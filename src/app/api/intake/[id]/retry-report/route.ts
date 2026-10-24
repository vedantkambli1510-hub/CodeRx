import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { generateClinicalReport } from "@/lib/ai/gemini";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointmentId = params.id;
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        intakeSession: { include: { answers: true } },
        medicalRecords: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Role check: must be the patient or the doctor
    const isPatient = user.role === "PATIENT" && appointment.patient.userId === user.userId;
    const isDoctor = user.role === "DOCTOR" && appointment.doctor.userId === user.userId;

    if (!isPatient && !isDoctor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const session = appointment.intakeSession;
    if (!session || session.answers.length === 0) {
      return NextResponse.json(
        { error: "Cannot generate report: No intake responses exist." },
        { status: 400 }
      );
    }

    const patientName = appointment.patient.user.name;
    const dobAnswer = session.answers.find((a) => a.questionKey === "patient_dob");
    const patientAgeOrDob = dobAnswer?.answerText || appointment.patient.dob || "Not specified";

    const answersPayload = session.answers.map((a) => ({
      questionKey: a.questionKey,
      questionText: a.questionText,
      answerText: a.answerText,
      source: a.source,
    }));

    const { report, modelUsed, error: aiError } = await generateClinicalReport({
      patientName,
      patientAgeOrDob,
      answers: answersPayload,
      uploadedRecordsCount: appointment.medicalRecords.length,
    });

    let reportStatus: "READY" | "NEEDS_REVIEW" | "FAILED" = "READY";
    let needsReview = false;
    let reviewReason: string | null = null;

    if (!report) {
      reportStatus = "FAILED";
      reviewReason = aiError || "Gemini service unavailable.";
    } else {
      if (session.safetyFlagged) {
        needsReview = true;
        reportStatus = "NEEDS_REVIEW";
        reviewReason = `Patient reported potential emergency symptom: "${session.safetyTrigger || session.safetyCategory}"`;
      } else if (Array.isArray(report.clinicianAttentionItems) && report.clinicianAttentionItems.length > 0) {
        needsReview = true;
        reportStatus = "NEEDS_REVIEW";
        reviewReason = `Surfaced items for clinician review: ${report.clinicianAttentionItems.join("; ")}`;
      }
    }

    const structuredJson = report
      ? JSON.stringify(report)
      : JSON.stringify({
          error: aiError || "AI summary temporarily unavailable.",
          message: "All original patient answers have been preserved and are available for clinician review.",
          mandatoryNotice:
            "AI-generated pre-visit summary based on patient-reported information. It has not been independently verified and is not a diagnosis. The clinician must review the information directly with the patient.",
        });

    const aiReport = await prisma.aIReport.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        structuredReportJson: structuredJson,
        modelUsed: modelUsed || "gemini-3.5-flash-lite",
        reportStatus,
        needsReview,
        reviewReason,
      },
      update: {
        structuredReportJson: structuredJson,
        modelUsed: modelUsed || "gemini-3.5-flash-lite",
        reportStatus,
        needsReview,
        reviewReason,
        generatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      reportStatus: aiReport.reportStatus,
      needsReview: aiReport.needsReview,
      reviewReason: aiReport.reviewReason,
    });
  } catch (error) {
    console.error("[Retry Report Error]:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
