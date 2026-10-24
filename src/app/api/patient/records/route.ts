import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const patient = await requirePatient();

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: patient.patientProfileId },
      orderBy: { createdAt: "desc" },
      include: {
        appointment: {
          include: {
            slot: true,
            doctor: { include: { user: true } },
          },
        },
      },
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("[Get Patient Records Error]:", error);
    return NextResponse.json({ error: "Failed to load medical records" }, { status: 500 });
  }
}
