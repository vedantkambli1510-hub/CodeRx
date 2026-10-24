import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { PatientProfileSchema } from "@/lib/validation/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const patient = await requirePatient();
    const profile = await prisma.patientProfile.findUnique({
      where: { id: patient.patientProfileId },
      include: { user: true },
    });

    return NextResponse.json({ patient: profile });
  } catch (error) {
    console.error("[Get Profile Error]:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const patient = await requirePatient();
    const body = await req.json();
    const validated = PatientProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid profile data format" }, { status: 400 });
    }

    const updated = await prisma.patientProfile.update({
      where: { id: patient.patientProfileId },
      data: {
        dob: validated.data.dob || null,
        gender: validated.data.gender || null,
        phone: validated.data.phone || null,
        bloodGroup: validated.data.bloodGroup || null,
        emergencyContactName: validated.data.emergencyContactName || null,
        emergencyContactPhone: validated.data.emergencyContactPhone || null,
      },
    });

    return NextResponse.json({ success: true, patient: updated });
  } catch (error) {
    console.error("[Update Profile Error]:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
