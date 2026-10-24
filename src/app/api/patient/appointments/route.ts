import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const patient = await requirePatient();

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.patientProfileId },
      orderBy: { slot: { startTime: "asc" } },
      include: {
        doctor: { include: { user: true } },
        slot: true,
        intakeSession: true,
        aiReport: true,
        medicalRecords: true,
        payment: true,
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("[Get Patient Appointments Error]:", error);
    return NextResponse.json({ error: "Failed to load appointments" }, { status: 500 });
  }
}
