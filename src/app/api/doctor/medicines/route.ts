import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { createNotification, recordAudit } from "@/lib/notifications/service";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const medicines = await prisma.medicine.findMany({
      where: patientId ? { patientId } : {},
      orderBy: { createdAt: "desc" },
      include: {
        patient: { include: { user: true } },
      },
    });

    return NextResponse.json({ medicines });
  } catch (error) {
    console.error("[Medicines GET Error]:", error);
    return NextResponse.json({ error: "Failed to load medicines" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Doctor authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { patientId, medicineName, dosage, frequency, notes, startDate } = body;

    if (!patientId || !medicineName || !dosage) {
      return NextResponse.json({ error: "Patient ID, medicine name, and dosage are required" }, { status: 400 });
    }

    const medicine = await prisma.medicine.create({
      data: {
        patientId,
        medicineName,
        dosage,
        frequency: frequency || "Once daily",
        startDate: startDate || new Date().toISOString().split("T")[0],
        status: "CURRENT",
        source: "PRESCRIPTION",
        notes,
      },
    });

    return NextResponse.json({ success: true, medicine });
  } catch (error) {
    console.error("[Medicines POST Error]:", error);
    return NextResponse.json({ error: "Failed to add medication" }, { status: 500 });
  }
}

/**
 * Doctor Turn OFF / Discontinue or Resume Medication (Deprescribing Protocol)
 */
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Doctor authorization required" }, { status: 403 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.userId },
      include: { user: true },
    });

    const body = await req.json();
    const { medicineId, action, reason } = body; // action: "DISCONTINUE" | "REACTIVATE"

    if (!medicineId || !action) {
      return NextResponse.json({ error: "Medicine ID and action required" }, { status: 400 });
    }

    const existingMed = await prisma.medicine.findUnique({
      where: { id: medicineId },
      include: {
        patient: { include: { user: true } },
      },
    });

    if (!existingMed) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const doctorName = doctorProfile?.user?.name || "Dr. Aarav Mehta";

    if (action === "DISCONTINUE") {
      const discontinuationNote = `[Discontinued on ${todayDate} by ${doctorName}: ${reason || "Clinical judgment"}]`;
      const updatedNotes = existingMed.notes
        ? `${existingMed.notes} • ${discontinuationNote}`
        : discontinuationNote;

      const updated = await prisma.medicine.update({
        where: { id: medicineId },
        data: {
          status: "DISCONTINUED",
          endDate: todayDate,
          notes: updatedNotes,
        },
      });

      // 1. Create Medical Timeline Milestone
      await prisma.medicalTimeline.create({
        data: {
          patientId: existingMed.patientId,
          eventDate: new Date(),
          eventType: "PRESCRIPTION",
          title: `Medication Withheld: ${existingMed.medicineName}`,
          summary: `${doctorName} advised discontinuing ${existingMed.medicineName} (${existingMed.dosage}). Reason: ${reason || "Dose adjustment for organ protection"}.`,
          importantFindings: `Discontinued on ${todayDate}. Reason: ${reason || "Physician discretion"}`,
          isKeyMilestone: true,
          doctorNotes: reason,
        },
      });

      // 2. Dispatch urgent patient safety notification
      await createNotification({
        userId: existingMed.patient.userId,
        type: "IMPORTANT_CHANGE",
        title: `⚠️ Medication Stopped: ${existingMed.medicineName}`,
        message: `${doctorName} has updated your prescription regimen and advised you to STOP taking ${existingMed.medicineName} (${existingMed.dosage}). Reason: ${reason || "Clinical adjustment"}.`,
        link: "/patient/medicines",
      });

      // 3. Audit log
      await recordAudit(
        user.userId,
        "DISCONTINUE_MEDICATION",
        `Doctor discontinued ${existingMed.medicineName} for patient ${existingMed.patient.user.name}. Reason: ${reason}`
      );

      return NextResponse.json({
        success: true,
        message: `Successfully discontinued ${existingMed.medicineName}`,
        medicine: updated,
      });
    } else if (action === "REACTIVATE") {
      const updated = await prisma.medicine.update({
        where: { id: medicineId },
        data: {
          status: "CURRENT",
          endDate: null,
          notes: existingMed.notes ? `${existingMed.notes} • [Resumed on ${todayDate}]` : `[Resumed on ${todayDate}]`,
        },
      });

      // Notify patient
      await createNotification({
        userId: existingMed.patient.userId,
        type: "IMPORTANT_CHANGE",
        title: `Medication Resumed: ${existingMed.medicineName}`,
        message: `${doctorName} has resumed your active regimen for ${existingMed.medicineName} (${existingMed.dosage}).`,
        link: "/patient/medicines",
      });

      return NextResponse.json({
        success: true,
        message: `Reactivated ${existingMed.medicineName}`,
        medicine: updated,
      });
    } else if (action === "PAUSE") {
      const pauseNote = `[Temporarily paused on ${todayDate} by ${doctorName}: ${reason || "Pending lab retest"}]`;
      const updatedNotes = existingMed.notes ? `${existingMed.notes} • ${pauseNote}` : pauseNote;

      const updated = await prisma.medicine.update({
        where: { id: medicineId },
        data: {
          status: "PAUSED",
          notes: updatedNotes,
        },
      });

      // Notify patient
      await createNotification({
        userId: existingMed.patient.userId,
        type: "IMPORTANT_CHANGE",
        title: `⏸️ Medication Paused: ${existingMed.medicineName}`,
        message: `${doctorName} has temporarily paused ${existingMed.medicineName} (${existingMed.dosage}). Reason: ${reason || "Pending clinical review"}. Do not take doses until advised.`,
        link: "/patient/medicines",
      });

      return NextResponse.json({
        success: true,
        message: `Temporarily paused ${existingMed.medicineName}`,
        medicine: updated,
      });
    } else if (action === "TAPER") {
      const taperNote = `[Dose tapering on ${todayDate} by ${doctorName}: ${reason || "Gradual dose reduction"}]`;
      const updatedNotes = existingMed.notes ? `${existingMed.notes} • ${taperNote}` : taperNote;

      const updated = await prisma.medicine.update({
        where: { id: medicineId },
        data: {
          status: "TAPERING",
          notes: updatedNotes,
        },
      });

      // Notify patient
      await createNotification({
        userId: existingMed.patient.userId,
        type: "IMPORTANT_CHANGE",
        title: `📉 Medication Tapering: ${existingMed.medicineName}`,
        message: `${doctorName} has initiated a gradual tapering regimen for ${existingMed.medicineName} (${existingMed.dosage}). Follow updated dosing instructions.`,
        link: "/patient/medicines",
      });

      return NextResponse.json({
        success: true,
        message: `Tapering dose for ${existingMed.medicineName}`,
        medicine: updated,
      });
    } else {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

  } catch (error) {
    console.error("[Medicines PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update medication status" }, { status: 500 });
  }
}
