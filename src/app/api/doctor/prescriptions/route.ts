import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { sendPrescriptionEmail } from "@/lib/notifications/service";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const prescriptions = await prisma.prescription.findMany({
      where: patientId ? { patientId } : {},
      orderBy: { createdAt: "desc" },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    return NextResponse.json({ prescriptions });
  } catch (error) {
    console.error("[Prescriptions GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.userId },
      include: { user: true },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 403 });
    }

    const body = await req.json();
    const { patientId, diagnosis, medicines, advice, followUpDate, sendEmail } = body;

    if (!patientId || !diagnosis || !medicines || !Array.isArray(medicines)) {
      return NextResponse.json(
        { error: "Missing required prescription fields" },
        { status: 400 }
      );
    }

    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: { user: true },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // 1. Create prescription record
    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: doctorProfile.id,
        diagnosis,
        medicinesJson: JSON.stringify(medicines),
        advice,
        followUpDate,
        emailStatus: sendEmail ? "SENDING" : "NOT_SENT",
      },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });

    // 2. Also register medicines into patient active medicines table
    for (const med of medicines) {
      if (med.name && med.name.trim()) {
        await prisma.medicine.create({
          data: {
            patientId,
            medicineName: med.name,
            dosage: med.dosage || "Standard Dose",
            frequency: med.frequency || "Daily",
            startDate: new Date().toISOString().split("T")[0],
            status: "CURRENT",
            source: "PRESCRIPTION",
            notes: med.instructions || advice,
          },
        });
      }
    }

    // 3. Add to medical timeline
    await prisma.medicalTimeline.create({
      data: {
        patientId,
        eventDate: new Date(),
        eventType: "PRESCRIPTION",
        title: `Digital Prescription — ${diagnosis}`,
        summary: `Prescribed ${medicines.length} medication(s) by ${doctorProfile.user.name}.`,
        importantFindings: `Advice: ${advice || "Adhere to schedule"}`,
        medicinesJson: JSON.stringify(medicines),
        doctorNotes: `Follow up: ${followUpDate || "Routine"}`,
        isKeyMilestone: true,
      },
    });

    // 4. Send email if requested
    if (sendEmail) {
      await sendPrescriptionEmail(
        prescription.id,
        patient.user.email,
        doctorProfile.user.name
      );
    }

    return NextResponse.json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.error("[Prescription Create Error]:", error);
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}
