import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await requirePatient();
    const appointmentId = params.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { slot: true },
    });

    if (!appointment || appointment.patientId !== patient.patientProfileId) {
      return NextResponse.json({ error: "Appointment not found or unauthorized" }, { status: 404 });
    }

    if (appointment.status === "CANCELLED") {
      return NextResponse.json({ error: "Appointment is already cancelled" }, { status: 400 });
    }

    // Atomically cancel appointment and release slot back to AVAILABLE
    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      }),
      prisma.appointmentSlot.update({
        where: { id: appointment.slotId },
        data: { status: "AVAILABLE" },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("[Cancel Appointment Error]:", error);
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}
