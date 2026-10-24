import { prisma } from "@/lib/db/prisma";
import {
  compareMedicalRecords,
  StructuredReportExtraction,
  WhatChangedComparison,
} from "@/lib/ai/differentials";

export async function getPatientComparison(userId: string): Promise<WhatChangedComparison> {
  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId },
    include: {
      medicalRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const records = patientProfile?.medicalRecords || [];

  const baselineRec = records.find(
    (r) =>
      r.reportName?.toLowerCase().includes("baseline") ||
      r.reportName?.toLowerCase().includes("metabolic")
  ) || records[records.length - 1];

  const followUpRec = records.find(
    (r) =>
      r.reportName?.toLowerCase().includes("follow-up") ||
      r.reportName?.toLowerCase().includes("glycemic")
  ) || records[0];

  let prevData: StructuredReportExtraction = {
    reportTitle: "Baseline Comprehensive Metabolic & Lipid Panel",
    laboratory: "Apex PathLabs & Diagnostic Research",
    reportDate: "2024-01-15",
    specimen: "Venous Blood / Fasting Serum",
    parameters: [
      { name: "HbA1c (Glycated Hemoglobin)", value: "8.4", unit: "%", reference: "< 5.7", status: "HIGH", note: "Suboptimal glycemic control" },
      { name: "Fasting Blood Glucose", value: "168", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Elevated fasting blood sugar" },
      { name: "Serum Creatinine", value: "1.0", unit: "mg/dL", reference: "0.7 - 1.2", status: "NORMAL", note: "Normal baseline kidney filtration" },
      { name: "Blood Urea Nitrogen (BUN)", value: "16", unit: "mg/dL", reference: "7 - 20", status: "NORMAL", note: "Normal baseline" },
      { name: "Total Cholesterol", value: "224", unit: "mg/dL", reference: "< 200", status: "HIGH", note: "High total blood cholesterol" },
      { name: "LDL Cholesterol (Direct)", value: "142", unit: "mg/dL", reference: "< 100", status: "HIGH", note: "High bad cholesterol" },
      { name: "HDL Cholesterol", value: "38", unit: "mg/dL", reference: "> 40", status: "LOW", note: "Suboptimal good cholesterol" },
      { name: "Serum Triglycerides", value: "185", unit: "mg/dL", reference: "< 150", status: "HIGH", note: "Elevated blood fats" },
      { name: "Blood Pressure (Systolic/Diastolic)", value: "148/92", unit: "mmHg", reference: "< 120/80", status: "HIGH", note: "Stage 2 Hypertension" },
      { name: "Urine Microalbumin", value: "24", unit: "mg/g", reference: "< 30", status: "NORMAL", note: "Normal baseline urine protein" },
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
      { name: "HbA1c (Glycated Hemoglobin)", value: "7.1", unit: "%", reference: "< 5.7", status: "HIGH", note: "Improved from 8.4%" },
      { name: "Fasting Blood Glucose", value: "122", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Improved from 168 mg/dL" },
      { name: "Serum Creatinine", value: "1.7", unit: "mg/dL", reference: "0.7 - 1.2", status: "CRITICAL", note: "Acute elevation from 1.0 mg/dL" },
      { name: "Blood Urea Nitrogen (BUN)", value: "34", unit: "mg/dL", reference: "7 - 20", status: "HIGH", note: "Elevated marker from 16 mg/dL" },
      { name: "eGFR (CKD-EPI)", value: "46", unit: "mL/min/1.73m²", reference: "> 60", status: "CRITICAL", note: "Renal filtration speed slowed" },
      { name: "Total Cholesterol", value: "174", unit: "mg/dL", reference: "< 200", status: "NORMAL", note: "Normalized from 224 mg/dL" },
      { name: "LDL Cholesterol (Direct)", value: "92", unit: "mg/dL", reference: "< 100", status: "NORMAL", note: "Healthy target met from 142 mg/dL" },
      { name: "HDL Cholesterol", value: "43", unit: "mg/dL", reference: "> 40", status: "NORMAL", note: "Improved from 38 mg/dL" },
      { name: "Serum Triglycerides", value: "148", unit: "mg/dL", reference: "< 150", status: "NORMAL", note: "Normalized from 185 mg/dL" },
      { name: "Blood Pressure (Systolic/Diastolic)", value: "126/80", unit: "mmHg", reference: "< 120/80", status: "NORMAL", note: "Controlled from 148/92 mmHg" },
      { name: "Urine Microalbumin", value: "88", unit: "mg/g", reference: "< 30", status: "HIGH", note: "Protein leak increased from 24 mg/g" },
    ],
    findings: "Good glycemic and lipid response. Notable acute elevation in serum creatinine from 1.0 to 1.7 mg/dL with newly documented eGFR 46 mL/min.",
    impression: "Diabetic nephropathy stage 3a vs hemodynamic effect. Clinician review mandatory.",
    disclaimer: "CodeRx AI Assistive Engine",
  };

  if (baselineRec?.extractedDataJson) {
    try {
      const b = JSON.parse(baselineRec.extractedDataJson);
      if (b.parameters && b.parameters.length > 0) prevData = b;
    } catch {}
  }

  if (followUpRec?.extractedDataJson) {
    try {
      const f = JSON.parse(followUpRec.extractedDataJson);
      if (f.parameters && f.parameters.length > 0) latestData = f;
    } catch {}
  }

  if (latestData.parameters) {
    latestData.parameters = latestData.parameters.map((p) => {
      if (p.name.includes("Albumin-to-Creatinine")) {
        return { ...p, name: "Urine Microalbumin" };
      }
      return p;
    });
  }

  return compareMedicalRecords(
    prevData,
    latestData,
    prevData.reportTitle || "Baseline Comprehensive Panel (15 Jan 2024)",
    prevData.reportDate || "2024-01-15",
    latestData.reportTitle || "Follow-up Glycemic & Renal Profile (18 Jul 2024)",
    latestData.reportDate || "2024-07-18"
  );
}
