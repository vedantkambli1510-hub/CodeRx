import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireDoctor } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const doctor = await requireDoctor();

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.doctorProfileId },
      orderBy: { slot: { startTime: "asc" } },
      include: {
        patient: { include: { user: true } },
        slot: true,
        intakeSession: {
          include: { answers: true },
        },
        aiReport: true,
        medicalRecords: true,
        reminderJobs: true,
        payment: true,
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("[Get Doctor Appointments Error]:", error);
    return NextResponse.json({ error: "Failed to load consultations" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const doctor = await requireDoctor();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const appointmentId = searchParams.get("id");

    if (all) {
      // Find all appointments for this doctor
      const appts = await prisma.appointment.findMany({
        where: { doctorId: doctor.doctorProfileId },
        select: { id: true, slotId: true },
      });

      const apptIds = appts.map((a) => a.id);
      const slotIds = appts.map((a) => a.slotId);

      // Delete associated reminder jobs
      if (apptIds.length > 0) {
        await prisma.reminderJob.deleteMany({
          where: { appointmentId: { in: apptIds } },
        });
      }

      // Delete appointments
      await prisma.appointment.deleteMany({
        where: { doctorId: doctor.doctorProfileId },
      });

      // Release slots back to available
      if (slotIds.length > 0) {
        await prisma.appointmentSlot.updateMany({
          where: { id: { in: slotIds } },
          data: { status: "AVAILABLE" },
        });
      }

      return NextResponse.json({
        success: true,
        message: "All appointments removed successfully.",
      });
    }

    if (appointmentId) {
      const appt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appt || appt.doctorId !== doctor.doctorProfileId) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }

      await prisma.reminderJob.deleteMany({
        where: { appointmentId },
      });

      await prisma.appointment.delete({
        where: { id: appointmentId },
      });

      await prisma.appointmentSlot.update({
        where: { id: appt.slotId },
        data: { status: "AVAILABLE" },
      });

      return NextResponse.json({
        success: true,
        message: "Appointment removed successfully.",
      });
    }

    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  } catch (error) {
    console.error("[Delete Appointment Error]:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
