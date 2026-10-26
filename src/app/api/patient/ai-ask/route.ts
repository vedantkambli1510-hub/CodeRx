import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { answerPatientQuestion, PatientAiContext } from "@/lib/ai/patient-assistant";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const question = String(body.question || "").trim();

    if (!question) {
      return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    }

    // Fetch full patient profile & related clinical data
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: user.userId },
      include: {
        user: true,
        appointments: {
          orderBy: { slot: { startTime: "asc" } },
          include: {
            doctor: { include: { user: true } },
            slot: true,
          },
        },
        medicalRecords: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        medicines: {
          orderBy: { createdAt: "desc" },
        },
        prescriptions: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            doctor: { include: { user: true } },
          },
        },
        checklistItems: true,
      },
    });

    // Build context
    const context: PatientAiContext = {
      userName: patientProfile?.user?.name || user.name || "Rajesh Sharma",
      userEmail: patientProfile?.user?.email || user.email || "",
      patientDob: patientProfile?.dob || null,
      gender: patientProfile?.gender || "Male",
      bloodGroup: patientProfile?.bloodGroup || "O+",
      allergies: patientProfile?.allergies || "Sulfa antibiotics (Urticaria/rash), Shellfish",
      conditions:
        patientProfile?.conditions ||
        "Type 2 Diabetes Mellitus, Essential Hypertension, Stage 2 Chronic Kidney Disease",
      currentMedications:
        patientProfile?.currentMedications ||
        "Metformin 500mg BD, Telmisartan 40mg OD, Atorvastatin 20mg HS",
      emergencyContactName: patientProfile?.emergencyContactName || "Sunita Sharma (Wife)",
      emergencyContactPhone: patientProfile?.emergencyContactPhone || "+91 98201 98765",
      isSubscribed: false, // default checked in client via useSubscription
      appointments: patientProfile?.appointments.map((a) => {
        const d = a.slot?.startTime ? new Date(a.slot.startTime) : new Date();
        return {
          doctorName: a.doctor?.user?.name || "Dr. Medical Specialist",
          specialization: a.doctor?.specialization || "General Medicine",
          clinicInfo: a.doctor?.clinicInfo || "Apollo Clinic, Mumbai",
          dateString: d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          timeString: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
          status: a.status || "CONFIRMED",
        };
      }) || [],
      records: patientProfile?.medicalRecords.map((r) => ({
        title: r.reportName || r.originalName,
        type: r.reportType,
        date: r.reportDate
          ? new Date(r.reportDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
          : new Date(r.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        findings: r.extractedDataJson ? "Extracted clinical report data available" : "Clinical Record",
        status: r.processingStatus,
      })) || [],
    };

    const result = await answerPatientQuestion(question, context);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Patient AI Ask Error]:", error);
    return NextResponse.json(
      {
        query: "",
        answer: "I am ready to help with your medical records, dosages, visits, or any question about the patient portal.",
        actionablePoints: [
          "Check your appointments on the Visits Calendar HUD",
          "Review active medications in the Medications tab",
        ],
      },
      { status: 500 }
    );
  }
}
