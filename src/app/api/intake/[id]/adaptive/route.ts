import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { generateAdaptiveFollowUp } from "@/lib/ai/gemini";

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
        intakeSession: {
          include: { answers: true },
        },
      },
    });

    if (!appointment || appointment.patientId !== patient.patientProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = appointment.intakeSession;
    if (!session) {
      return NextResponse.json({ needsFollowUp: false });
    }

    const body = await req.json().catch(() => ({}));
    const currentSection = body.currentSection || "Symptoms";

    // Count existing AI adaptive questions in this intake
    const aiAnswers = session.answers.filter((a) => a.source === "AI_ADAPTIVE");
    if (aiAnswers.length >= 6) {
      return NextResponse.json({ needsFollowUp: false, reason: "Max adaptive questions reached" });
    }

    // Context minimization: Only send primary complaint & relevant symptom answers
    const relevantAnswers = session.answers
      .filter((a) => ["primary_concern", "symptoms_list", "symptom_location", "symptom_onset", "symptom_progression"].includes(a.questionKey))
      .map((a) => ({
        questionText: a.questionText,
        answerText: a.answerText,
      }));

    if (relevantAnswers.length === 0) {
      return NextResponse.json({ needsFollowUp: false });
    }

    const adaptiveResponse = await generateAdaptiveFollowUp({
      currentSection,
      patientResponses: relevantAnswers,
      previousFollowUpCount: aiAnswers.length,
    });

    if (!adaptiveResponse || !adaptiveResponse.needsFollowUp || !adaptiveResponse.question) {
      return NextResponse.json({ needsFollowUp: false });
    }

    return NextResponse.json({
      needsFollowUp: true,
      question: adaptiveResponse.question,
      reasonCategory: adaptiveResponse.reasonCategory,
    });
  } catch (error) {
    console.error("[Adaptive Follow-up Error]:", error);
    return NextResponse.json({ needsFollowUp: false });
  }
}
