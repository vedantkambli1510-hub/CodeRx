import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireDoctor } from "@/lib/auth/session";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await requireDoctor();
    const appointmentId = params.id;
    const body = await req.json();

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { aiReport: true },
    });

    if (!appointment || appointment.doctorId !== doctor.doctorProfileId) {
      return NextResponse.json({ error: "Unauthorized appointment" }, { status: 403 });
    }

    if (body.action === "MARK_REVIEWED") {
      if (appointment.aiReport) {
        await prisma.aIReport.update({
          where: { appointmentId },
          data: { reviewedAt: new Date() },
        });
      }
      return NextResponse.json({ success: true, reviewedAt: new Date() });
    }

    if (body.action === "MARK_COMPLETED") {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, status: "COMPLETED" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[Update Status Error]:", error);
    return NextResponse.json({ error: "Failed to update appointment status" }, { status: 500 });
  }
}
