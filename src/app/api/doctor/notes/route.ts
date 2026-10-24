import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireDoctor } from "@/lib/auth/session";
import { DoctorNoteSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  try {
    const doctor = await requireDoctor();
    const body = await req.json();
    const validated = DoctorNoteSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid note content" }, { status: 400 });
    }

    const { appointmentId, content } = validated.data;

    // Verify appointment belongs to this doctor
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.doctorId !== doctor.doctorProfileId) {
      return NextResponse.json({ error: "Unauthorized appointment" }, { status: 403 });
    }

    const note = await prisma.doctorNote.create({
      data: {
        appointmentId,
        doctorId: doctor.doctorProfileId,
        content: content.trim(),
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("[Save Doctor Note Error]:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
