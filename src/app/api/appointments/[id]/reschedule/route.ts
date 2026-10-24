import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { RescheduleAppointmentSchema } from "@/lib/validation/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await requirePatient();
    const appointmentId = params.id;
    const body = await req.json();

    const validated = RescheduleAppointmentSchema.safeParse({
      appointmentId,
      newSlotId: body.newSlotId,
    });

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid slot selection" }, { status: 400 });
    }

    const { newSlotId } = validated.data;

    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
        include: { slot: true },
      });

      if (!appointment || appointment.patientId !== patient.patientProfileId) {
        throw new Error("NOT_FOUND");
      }

      if (appointment.status !== "SCHEDULED") {
        throw new Error("CANNOT_RESCHEDULE");
      }

      const newSlot = await tx.appointmentSlot.findUnique({
        where: { id: newSlotId },
      });

      if (!newSlot || newSlot.status !== "AVAILABLE" || new Date(newSlot.startTime) <= new Date()) {
        throw new Error("SLOT_UNAVAILABLE");
      }

      // Return old slot to AVAILABLE
      await tx.appointmentSlot.update({
        where: { id: appointment.slotId },
        data: { status: "AVAILABLE" },
      });

      // Mark new slot BOOKED
      await tx.appointmentSlot.update({
        where: { id: newSlotId },
        data: { status: "BOOKED" },
      });

      // Update appointment slot relation
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          slotId: newSlotId,
          updatedAt: new Date(),
        },
        include: { slot: true },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Appointment rescheduled successfully",
      newTime: result.slot.startTime,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { error: "The selected appointment slot is no longer available." },
        { status: 409 }
      );
    }
    console.error("[Reschedule Error]:", error);
    return NextResponse.json({ error: "Failed to reschedule appointment" }, { status: 500 });
  }
}
