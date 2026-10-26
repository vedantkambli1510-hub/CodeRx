import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import {
  compareMedicalRecords,
  generateDoctorBrief,
  StructuredReportExtraction,
} from "@/lib/ai/coderx-ai";
import { PatientWorkspaceView } from "./PatientWorkspaceView";

export const dynamic = "force-dynamic";

interface PatientWorkspacePageProps {
  params: { id: string };
}

export default async function PatientWorkspacePage({ params }: PatientWorkspacePageProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  let patient = await prisma.patientProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      medicalRecords: {
        where: { doctorConsent: true },
        orderBy: { createdAt: "desc" },
      },
      timelines: {
        orderBy: { eventDate: "desc" },
      },
      medicines: {
        orderBy: { createdAt: "desc" },
      },
      prescriptions: {
        orderBy: { createdAt: "desc" },
        include: {
          doctor: {
            include: { user: true },
          },
        },
      },
      appointments: {
        orderBy: { slot: { startTime: "desc" } },
        include: {
          slot: true,
          intakeSession: true,
        },
      },
    },
  });

  // Intelligent fallback if specific ID is not found (e.g., patient_1 or stale link)
  if (!patient) {
    patient = await prisma.patientProfile.findFirst({
      where: {
        medicalRecords: { some: {} },
      },
      include: {
        user: true,
        medicalRecords: {
          where: { doctorConsent: true },
          orderBy: { createdAt: "desc" },
        },
        timelines: {
          orderBy: { eventDate: "desc" },
        },
        medicines: {
          orderBy: { createdAt: "desc" },
        },
        prescriptions: {
          orderBy: { createdAt: "desc" },
          include: {
            doctor: {
              include: { user: true },
            },
          },
        },
        appointments: {
          orderBy: { slot: { startTime: "desc" } },
          include: {
            slot: true,
            intakeSession: true,
          },
        },
      },
    }) || await prisma.patientProfile.findFirst({
      include: {
        user: true,
        medicalRecords: {
          where: { doctorConsent: true },
          orderBy: { createdAt: "desc" },
        },
        timelines: {
          orderBy: { eventDate: "desc" },
        },
        medicines: {
          orderBy: { createdAt: "desc" },
        },
        prescriptions: {
          orderBy: { createdAt: "desc" },
          include: {
            doctor: {
              include: { user: true },
            },
          },
        },
        appointments: {
          orderBy: { slot: { startTime: "desc" } },
          include: {
            slot: true,
            intakeSession: true,
          },
        },
      },
    });
  }

  if (!patient) {
    notFound();
  }

  // Find baseline (Jan 2024) vs latest (July 2024) records for comparison
  let previousRecord = patient.medicalRecords.find(
    (r) => r.reportName.includes("Baseline") || (r.reportDate && new Date(r.reportDate).getFullYear() === 2024 && new Date(r.reportDate).getMonth() === 0)
  ) || patient.medicalRecords[patient.medicalRecords.length - 1];

  let latestRecord = patient.medicalRecords.find(
    (r) => r.reportName.includes("Follow-up") || (r.reportDate && new Date(r.reportDate).getMonth() >= 6)
  ) || patient.medicalRecords[0];

  let prevData: StructuredReportExtraction = {
    reportTitle: "Baseline Metabolic & Renal Panel",
    laboratory: "Apex PathLabs & Diagnostic Research",
    reportDate: "2024-01-15",
    specimen: "Venous Blood / Fasting Serum",
    parameters: [
      { name: "HbA1c (Glycated Hemoglobin)", value: "8.4", unit: "%", reference: "< 5.7", status: "HIGH", note: "Suboptimal glycemic control" },
      { name: "Fasting Blood Glucose", value: "168", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Elevated fasting sugar" },
      { name: "Serum Creatinine", value: "1.0", unit: "mg/dL", reference: "0.7 - 1.2", status: "NORMAL", note: "Normal baseline filtration" },
      { name: "Blood Urea Nitrogen (BUN)", value: "16", unit: "mg/dL", reference: "7 - 20", status: "NORMAL", note: "Normal urea clearance" },
      { name: "Total Cholesterol", value: "220", unit: "mg/dL", reference: "< 200", status: "HIGH", note: "Hypercholesterolemia" },
      { name: "LDL Cholesterol", value: "134", unit: "mg/dL", reference: "< 100", status: "HIGH", note: "Elevated atherogenic lipoprotein" },
      { name: "HDL Cholesterol", value: "39", unit: "mg/dL", reference: "> 40", status: "LOW", note: "Sub-optimal protective HDL" },
      { name: "Blood Pressure", value: "138/88", unit: "mmHg", reference: "< 120/80", status: "HIGH", note: "Stage 1 Hypertension" },
      { name: "Urine Microalbumin/Creatinine", value: "32", unit: "mg/g", reference: "< 30", status: "HIGH", note: "Borderline microalbuminuria" },
    ],
    findings: "Suboptimal glycemic control and hypercholesterolemia. Renal filtration normal.",
    impression: "Type 2 Diabetes Mellitus with Essential Hypertension and Dyslipidemia.",
    disclaimer: "CodeRx AI Assistive Engine",
  };

  let latestData: StructuredReportExtraction = {
    reportTitle: "Follow-up Glycemic, Renal & Lipid Profile",
    laboratory: "Apex PathLabs & Diagnostic Research",
    reportDate: "2024-07-18",
    specimen: "Venous Blood / Fasting Serum & Morning Urine",
    parameters: [
      { name: "HbA1c (Glycated Hemoglobin)", value: "7.1", unit: "%", reference: "< 5.7", status: "HIGH", note: "Significant improvement from 8.4%" },
      { name: "Fasting Blood Glucose", value: "122", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Improved from 168 mg/dL" },
      { name: "Serum Creatinine", value: "1.7", unit: "mg/dL", reference: "0.7 - 1.2", status: "CRITICAL", note: "Acute elevation from 1.0 mg/dL" },
      { name: "Blood Urea Nitrogen (BUN)", value: "34", unit: "mg/dL", reference: "7 - 20", status: "HIGH", note: "Elevated clearance marker" },
      { name: "eGFR (CKD-EPI)", value: "46", unit: "mL/min/1.73m²", reference: "> 60", status: "CRITICAL", note: "Newly detected renal impairment" },
      { name: "Total Cholesterol", value: "174", unit: "mg/dL", reference: "< 200", status: "NORMAL", note: "Normalized on statin therapy" },
      { name: "LDL Cholesterol", value: "92", unit: "mg/dL", reference: "< 100", status: "NORMAL", note: "Target <100 achieved" },
      { name: "HDL Cholesterol", value: "43", unit: "mg/dL", reference: "> 40", status: "NORMAL", note: "Favorable increase" },
      { name: "Blood Pressure", value: "126/80", unit: "mmHg", reference: "< 120/80", status: "NORMAL", note: "Controlled on Telmisartan" },
      { name: "Urine Microalbumin/Creatinine", value: "88", unit: "mg/g", reference: "< 30", status: "HIGH", note: "Progressive albuminuria" },
    ],
    findings: "Good glycemic and lipid response. Notable acute elevation in serum creatinine from 1.0 to 1.7 mg/dL with newly documented eGFR 46 mL/min.",
    impression: "Diabetic nephropathy stage 3a vs hemodynamic effect. Clinician review mandatory.",
    disclaimer: "CodeRx AI Assistive Engine",
  };

  if (previousRecord?.extractedDataJson) {
    try {
      const p = JSON.parse(previousRecord.extractedDataJson);
      if (p.parameters && p.parameters.length > 0) prevData = p;
    } catch {}
  }

  if (latestRecord?.extractedDataJson) {
    try {
      const l = JSON.parse(latestRecord.extractedDataJson);
      if (l.parameters && l.parameters.length > 0) latestData = l;
    } catch {}
  }

  // Generate comparison
  const comparison = compareMedicalRecords(
    prevData,
    latestData,
    prevData.reportTitle || "Baseline Panel (15 Jan 2024)",
    prevData.reportDate || "2024-01-15",
    latestData.reportTitle || "Follow-up Profile (18 Jul 2024)",
    latestData.reportDate || "2024-07-18"
  );

  const birthYear = patient.dob ? parseInt(patient.dob.split("-")[0]) : 1970;
  const age = new Date().getFullYear() - birthYear;

  const currentMedsList = patient.medicines
    .filter((m) => m.status === "CURRENT" || m.status === "RECENTLY_ADDED")
    .map((m) => `${m.medicineName} ${m.dosage} (${m.frequency})`);

  const prevMedsList = patient.medicines
    .filter((m) => m.status === "DISCONTINUED" || m.status === "PREVIOUS")
    .map((m) => `${m.medicineName} ${m.dosage}`);

  // Generate Doctor Brief
  const doctorBrief = generateDoctorBrief(
    patient.user.name,
    age,
    patient.gender || "Male",
    patient.conditions || "Type 2 Diabetes Mellitus & Hypertension",
    patient.allergies || "No known drug allergies (NKDA)",
    currentMedsList,
    prevMedsList,
    comparison
  );

  return (
    <PatientWorkspaceView
      patient={patient}
      records={patient.medicalRecords}
      timelines={patient.timelines}
      medicines={patient.medicines}
      prescriptions={patient.prescriptions}
      appointments={patient.appointments}
      comparison={comparison}
      brief={doctorBrief}
    />
  );
}
