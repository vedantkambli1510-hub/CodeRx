import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { generateClinicalReport } from "@/lib/ai/gemini";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await requirePatient();
    const appointmentId = params.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        intakeSession: {
          include: { answers: true },
        },
        medicalRecords: true,
      },
    });

    if (!appointment || appointment.patientId !== patient.patientProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = appointment.intakeSession;
    if (!session) {
      return NextResponse.json({ error: "Intake session not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    if (!body.confirmedAccuracy) {
      return NextResponse.json(
        { error: "Please confirm that your provided information is accurate before submitting." },
        { status: 400 }
      );
    }

    // Mark intake session COMPLETED
    await prisma.intakeSession.update({
      where: { id: session.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Check for severe rating in answers
    const severityAnswer = session.answers.find((a) => a.questionKey === "overall_severity");
    const painRatingAnswer = session.answers.find((a) => a.questionKey === "pain_rating");
    const isSevere =
      (severityAnswer && Number(severityAnswer.answerText) >= 9) ||
      (painRatingAnswer && Number(painRatingAnswer.answerText) >= 9);

    // Prepare patient details for AI report
    const patientName = appointment.patient.user.name;
    const dobAnswer = session.answers.find((a) => a.questionKey === "patient_dob");
    const patientAgeOrDob = dobAnswer?.answerText || appointment.patient.dob || "Not specified";

    const answersPayload = session.answers.map((a) => ({
      questionKey: a.questionKey,
      questionText: a.questionText,
      answerText: a.answerText,
      source: a.source,
    }));

    // Invoke Gemini Clinical Report Generator
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
      reviewReason = aiError || "AI service temporarily unavailable.";
    } else {
      // Conservative Clinician Attention / Needs Review Check
      const hasClinicianAttentionItems =
        Array.isArray(report.clinicianAttentionItems) && report.clinicianAttentionItems.length > 0;

      if (session.safetyFlagged) {
        needsReview = true;
        reportStatus = "NEEDS_REVIEW";
        reviewReason = `Patient reported explicit potential emergency symptom: "${session.safetyTrigger || session.safetyCategory}"`;
      } else if (isSevere) {
        needsReview = true;
        reportStatus = "NEEDS_REVIEW";
        reviewReason = "Patient reported very severe symptoms (rating 9-10).";
      } else if (hasClinicianAttentionItems) {
        needsReview = true;
        reportStatus = "NEEDS_REVIEW";
        reviewReason = `Specific reported items surfaced for clinician review: ${report.clinicianAttentionItems.join("; ")}`;
      }
    }

    // Upsert AIReport
    const structuredJson = report
      ? JSON.stringify(report)
      : JSON.stringify({
          error: aiError || "AI summary temporarily unavailable.",
          message: "All original patient answers have been preserved and are available for clinician review.",
          mandatoryNotice:
            "AI-generated pre-visit summary based on patient-reported information. It has not been independently verified and is not a diagnosis. The clinician must review the information directly with the patient.",
        });

    await prisma.aIReport.upsert({
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
      reportStatus,
      needsReview,
    });
  } catch (error) {
    console.error("[Submit Intake Error]:", error);
    return NextResponse.json({ error: "Failed to submit intake" }, { status: 500 });
  }
}
