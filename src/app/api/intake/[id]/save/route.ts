import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { evaluateSafety } from "@/lib/safety/detector";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await requirePatient();
    const appointmentId = params.id;

    // Verify appointment ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { intakeSession: true },
    });

    if (!appointment || appointment.patientId !== patient.patientProfileId) {
      return NextResponse.json({ error: "Appointment not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const {
      questionKey,
      questionText,
      section,
      answerText,
      answerJson,
      source = "CORE",
      reasonCategory,
      sequence = 0,
    } = body;

    if (!questionKey || answerText === undefined) {
      return NextResponse.json({ error: "Missing required answer fields" }, { status: 400 });
    }

    // Run conservative deterministic safety evaluation on the patient's answer
    const safetyResult = evaluateSafety(typeof answerText === "string" ? answerText : "");

    // Get or create intake session
    let session = appointment.intakeSession;
    if (!session) {
      session = await prisma.intakeSession.create({
        data: {
          appointmentId,
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });
    } else if (session.status === "NOT_STARTED") {
      session = await prisma.intakeSession.update({
        where: { id: session.id },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });
    }

    // If safety flagged, update session flags
    if (safetyResult.flagged) {
      await prisma.intakeSession.update({
        where: { id: session.id },
        data: {
          safetyFlagged: true,
          safetyCategory: safetyResult.matchedCategory,
          safetyTrigger: safetyResult.patientStatement,
          lastSavedAt: new Date(),
        },
      });
    } else {
      await prisma.intakeSession.update({
        where: { id: session.id },
        data: { lastSavedAt: new Date(), currentStepKey: questionKey },
      });
    }

    // Upsert Intake Answer
    const savedAnswer = await prisma.intakeAnswer.upsert({
      where: {
        intakeSessionId_questionKey: {
          intakeSessionId: session.id,
          questionKey,
        },
      },
      create: {
        intakeSessionId: session.id,
        questionKey,
        questionText: questionText || questionKey,
        section: section || "General",
        answerText: typeof answerText === "string" ? answerText : JSON.stringify(answerText),
        answerJson: answerJson ? JSON.stringify(answerJson) : null,
        source: source || "CORE",
        reasonCategory: reasonCategory || null,
        sequence: Number(sequence) || 0,
      },
      update: {
        answerText: typeof answerText === "string" ? answerText : JSON.stringify(answerText),
        answerJson: answerJson ? JSON.stringify(answerJson) : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      answerId: savedAnswer.id,
      savedAt: savedAnswer.updatedAt,
      safety: safetyResult,
    });
  } catch (error) {
    console.error("[Save Intake Answer Error]:", error);
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
