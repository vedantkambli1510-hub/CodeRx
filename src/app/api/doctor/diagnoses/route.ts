import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireDoctor } from "@/lib/auth/session";
import { recordAudit } from "@/lib/notifications/service";

export async function GET(req: Request) {
  try {
    const doctor = await requireDoctor();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }

    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        conditions: true,
        allergies: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({
      patientId: patient.id,
      conditions: patient.conditions,
      allergies: patient.allergies,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error?.message?.includes("ACCESS_DENIED")) {
      return NextResponse.json({ error: "Forbidden: Doctor access required" }, { status: 403 });
    }
    console.error("[Diagnoses GET Error]:", error);
    return NextResponse.json({ error: "Failed to load diagnoses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const doctor = await requireDoctor();
    const body = await req.json();
    const { patientId, probableDiagnoses, confirmedDiagnoses, clinicalNotes } = body;

    if (!patientId) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }

    // Prepare updated conditions string from confirmed diagnoses if available
    let conditionsText: string | undefined = undefined;
    if (Array.isArray(confirmedDiagnoses) && confirmedDiagnoses.length > 0) {
      conditionsText = confirmedDiagnoses
        .map((d: any) => (typeof d === "string" ? d : d.title))
        .join(", ");
    }

    const updatedPatient = await prisma.patientProfile.update({
      where: { id: patientId },
      data: conditionsText ? { conditions: conditionsText } : {},
      include: { user: true },
    });

    // Record clinical action in audit log
    await recordAudit(
      doctor.userId,
      "DOCTOR_UPDATED_DIAGNOSES",
      JSON.stringify({
        patientId,
        patientName: updatedPatient.user.name,
        probableCount: probableDiagnoses?.length || 0,
        confirmedCount: confirmedDiagnoses?.length || 0,
        confirmedList: conditionsText,
        clinicalNotes: clinicalNotes || "",
      })
    );

    return NextResponse.json({
      success: true,
      patientId,
      conditions: updatedPatient.conditions,
      savedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error?.message?.includes("ACCESS_DENIED")) {
      return NextResponse.json({ error: "Forbidden: Doctor access required" }, { status: 403 });
    }
    console.error("[Diagnoses POST Error]:", error);
    return NextResponse.json({ error: "Failed to save diagnoses" }, { status: 500 });
  }
}
