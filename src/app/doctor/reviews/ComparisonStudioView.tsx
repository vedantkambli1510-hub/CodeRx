"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  GitCompare,
  ArrowRight,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { WhatChangedTab } from "@/components/workspace/WhatChangedTab";
import { ReportModal } from "@/components/workspace/ReportModal";
import {
  compareMedicalRecords,
  StructuredReportExtraction,
  WhatChangedComparison,
} from "@/lib/ai/differentials";

interface ComparisonStudioViewProps {
  patients: any[];
}

export function ComparisonStudioView({ patients }: ComparisonStudioViewProps) {
  // Default to Rajesh Sharma (the signature showcase case)
  const defaultPatient =
    patients.find((p) => p.user.name.includes("Rajesh")) || patients[0];

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    defaultPatient?.id || ""
  );

  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || defaultPatient;
  const patientRecords = activePatient?.medicalRecords || [];

  // Default baseline & follow-up records
  const baselineRec =
    patientRecords.find((r: any) => r.reportName.includes("Baseline")) ||
    patientRecords[patientRecords.length - 1];

  const followUpRec =
    patientRecords.find((r: any) => r.reportName.includes("Follow-up")) ||
    patientRecords[0];

  const [previousRecordId, setPreviousRecordId] = useState<string>(
    baselineRec?.id || ""
  );
  const [latestRecordId, setLatestRecordId] = useState<string>(
    followUpRec?.id || ""
  );

  const [comparison, setComparison] = useState<WhatChangedComparison | null>(() => {
    return computeComparison(baselineRec, followUpRec);
  });

  const [selectedReportModal, setSelectedReportModal] = useState<any | null>(null);

  function computeComparison(prevRecord: any, nextRecord: any): WhatChangedComparison {
    let prevData: StructuredReportExtraction = {
      reportTitle: prevRecord?.reportName || "Baseline Metabolic & Renal Panel",
      laboratory: "Apex PathLabs & Diagnostic Research",
      reportDate: prevRecord?.reportDate
        ? new Date(prevRecord.reportDate).toISOString().split("T")[0]
        : "2024-01-15",
      parameters: [
        { name: "HbA1c (Glycated Hemoglobin)", value: "8.4", unit: "%", reference: "< 5.7", status: "HIGH", note: "Suboptimal baseline" },
        { name: "Fasting Blood Glucose", value: "168", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Elevated" },
        { name: "Serum Creatinine", value: "1.0", unit: "mg/dL", reference: "0.7 - 1.2", status: "NORMAL", note: "Baseline normal" },
        { name: "Blood Urea Nitrogen (BUN)", value: "16", unit: "mg/dL", reference: "7 - 20", status: "NORMAL", note: "Normal" },
        { name: "Total Cholesterol", value: "220", unit: "mg/dL", reference: "< 200", status: "HIGH", note: "High" },
        { name: "LDL Cholesterol", value: "134", unit: "mg/dL", reference: "< 100", status: "HIGH", note: "High" },
        { name: "HDL Cholesterol", value: "39", unit: "mg/dL", reference: "> 40", status: "LOW", note: "Suboptimal" },
        { name: "Blood Pressure", value: "138/88", unit: "mmHg", reference: "< 120/80", status: "HIGH", note: "Stage 1" },
        { name: "Urine Microalbumin/Creatinine", value: "32", unit: "mg/g", reference: "< 30", status: "HIGH", note: "Borderline" },
      ],
      findings: "Suboptimal glycemic control and hypercholesterolemia. Renal filtration normal.",
      impression: "Type 2 Diabetes Mellitus with Essential Hypertension and Dyslipidemia.",
      disclaimer: "CodeRx AI Assistive Engine",
    };

    let latestData: StructuredReportExtraction = {
      reportTitle: nextRecord?.reportName || "Follow-up Glycemic, Renal & Lipid Profile",
      laboratory: "Apex PathLabs & Diagnostic Research",
      reportDate: nextRecord?.reportDate
        ? new Date(nextRecord.reportDate).toISOString().split("T")[0]
        : "2024-07-18",
      parameters: [
        { name: "HbA1c (Glycated Hemoglobin)", value: "7.1", unit: "%", reference: "< 5.7", status: "HIGH", note: "Improved from 8.4%" },
        { name: "Fasting Blood Glucose", value: "122", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Improved from 168" },
        { name: "Serum Creatinine", value: "1.7", unit: "mg/dL", reference: "0.7 - 1.2", status: "CRITICAL", note: "Acute elevation from 1.0" },
        { name: "Blood Urea Nitrogen (BUN)", value: "34", unit: "mg/dL", reference: "7 - 20", status: "HIGH", note: "Elevated marker" },
        { name: "eGFR (CKD-EPI)", value: "46", unit: "mL/min/1.73m²", reference: "> 60", status: "CRITICAL", note: "Renal impairment" },
        { name: "Total Cholesterol", value: "174", unit: "mg/dL", reference: "< 200", status: "NORMAL", note: "Target met" },
        { name: "LDL Cholesterol", value: "92", unit: "mg/dL", reference: "< 100", status: "NORMAL", note: "Target achieved" },
        { name: "HDL Cholesterol", value: "43", unit: "mg/dL", reference: "> 40", status: "NORMAL", note: "Normalized" },
        { name: "Blood Pressure", value: "126/80", unit: "mmHg", reference: "< 120/80", status: "NORMAL", note: "Controlled" },
        { name: "Urine Microalbumin/Creatinine", value: "88", unit: "mg/g", reference: "< 30", status: "HIGH", note: "Progressive" },
      ],
      findings: "Good glycemic and lipid response. Notable acute elevation in serum creatinine from 1.0 to 1.7 mg/dL with newly documented eGFR 46 mL/min.",
      impression: "Diabetic nephropathy stage 3a vs hemodynamic effect. Clinician review mandatory.",
      disclaimer: "CodeRx AI Assistive Engine",
    };

    if (prevRecord?.extractedDataJson) {
      try {
        const p = JSON.parse(prevRecord.extractedDataJson);
        if (p.parameters && p.parameters.length > 0) prevData = p;
      } catch {}
    }

    if (nextRecord?.extractedDataJson) {
      try {
        const l = JSON.parse(nextRecord.extractedDataJson);
        if (l.parameters && l.parameters.length > 0) latestData = l;
      } catch {}
    }

    return compareMedicalRecords(
      prevData,
      latestData,
      prevData.reportTitle || "Baseline Report",
      prevData.reportDate || "2024-01-15",
      latestData.reportTitle || "Follow-up Report",
      latestData.reportDate || "2024-07-18"
    );
  }

  function handlePatientChange(patId: string) {
    setSelectedPatientId(patId);
    const pat = patients.find((p) => p.id === patId);
    const recs = pat?.medicalRecords || [];
    const b = recs[recs.length - 1];
    const f = recs[0];
    setPreviousRecordId(b?.id || "");
    setLatestRecordId(f?.id || "");
    setComparison(computeComparison(b, f));
  }

  function handleRunComparison() {
    const prev = patientRecords.find((r: any) => r.id === previousRecordId);
    const next = patientRecords.find((r: any) => r.id === latestRecordId);
    setComparison(computeComparison(prev, next));
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-sky-400" />
            <span>"WHAT CHANGED?" Comparison Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare any baseline report against follow-up panels to generate the 5-category longitudinal differential table.
          </p>
        </div>

        <Link
          href={`/doctor/patients/${activePatient?.id || ""}`}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Open Full Patient Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Comparison Selector Controls (Section 15) */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Patient Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Select Patient Record:</span>
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            >
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.user.name} ({pat.medicalRecords.length} records available)
                </option>
              ))}
            </select>
          </div>

          {/* Previous Report Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Baseline / Earlier Report:</span>
            </label>
            <select
              value={previousRecordId}
              onChange={(e) => setPreviousRecordId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            >
              {patientRecords.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.reportName} (
                  {r.reportDate
                    ? new Date(r.reportDate).toLocaleDateString()
                    : "Baseline"}
                  )
                </option>
              ))}
            </select>
          </div>

          {/* Latest Report Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Follow-up / Latest Report:</span>
            </label>
            <select
              value={latestRecordId}
              onChange={(e) => setLatestRecordId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            >
              {patientRecords.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.reportName} (
                  {r.reportDate
                    ? new Date(r.reportDate).toLocaleDateString()
                    : "Follow-up"}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Active Patient: <strong className="text-white">{activePatient?.user?.name}</strong>
            </span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Condition: <strong className="text-white">{activePatient?.conditions || "T2D & HTN"}</strong>
            </span>
          </div>

          <button
            onClick={handleRunComparison}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Differential Analysis</span>
          </button>
        </div>
      </div>

      {/* Render Signature WHAT CHANGED Component */}
      {comparison && (
        <WhatChangedTab
          comparison={comparison}
          onOpenReportModal={(reportTitle) => {
            const matched = patientRecords.find((r: any) =>
              r.reportName.toLowerCase().includes(reportTitle.toLowerCase())
            );
            if (matched) setSelectedReportModal(matched);
          }}
        />
      )}

      {selectedReportModal && (
        <ReportModal
          record={selectedReportModal}
          onClose={() => setSelectedReportModal(null)}
        />
      )}
    </div>
  );
}
