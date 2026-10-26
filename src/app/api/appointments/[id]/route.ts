import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        slot: true,
        intakeSession: {
          include: { answers: true },
        },
        aiReport: true,
        medicalRecords: true,
        doctorNotes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Role check: must be patient owner or consulting doctor
    const isPatient = user.role === "PATIENT" && appointment.patient.userId === user.userId;
    const isDoctor = user.role === "DOCTOR" && appointment.doctor.userId === user.userId;

    if (!isPatient && !isDoctor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If requesting user is patient, hide doctor internal notes
    if (isPatient) {
      const sanitizedAppointment = {
        ...appointment,
        doctorNotes: [], // Never send private doctor notes to patient
      };
      return NextResponse.json({ appointment: sanitizedAppointment });
    }

    if (isDoctor) {
      const authorizedRecords = (appointment.medicalRecords || []).filter(
        (rec: any) => rec.doctorConsent === true
      );
      return NextResponse.json({
        appointment: {
          ...appointment,
          medicalRecords: authorizedRecords,
        },
      });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("[Get Appointment Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve appointment" }, { status: 500 });
  }
}
