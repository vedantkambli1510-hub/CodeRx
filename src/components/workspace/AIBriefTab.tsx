"use client";

import { useState } from "react";
import {
  Sparkles,
  Printer,
  Copy,
  Download,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Stethoscope,
  Pill,
  Check,
} from "lucide-react";
import { DoctorBrief } from "@/lib/ai/differentials";
import { DoctorDiagnosisSection } from "./DoctorDiagnosisSection";

interface AIBriefTabProps {
  brief: DoctorBrief;
  patientName: string;
  patientId?: string;
  patientConditions?: string | null;
  onOpenPrescriptionModal?: (prefilledDiagnosis?: string) => void;
}

export function AIBriefTab({
  brief,
  patientName,
  patientId,
  patientConditions,
  onOpenPrescriptionModal,
}: AIBriefTabProps) {
  const [copied, setCopied] = useState(false);
  const [checkedPrompts, setCheckedPrompts] = useState<Record<number, boolean>>({});
  const [addedToNotes, setAddedToNotes] = useState(false);

  function handleCopy() {
    const textToCopy = `
CodeRx AI Doctor Brief — ${patientName}
${new Date().toLocaleDateString()}

PATIENT OVERVIEW:
${brief.patientOverview}

RELEVANT MEDICAL HISTORY:
${brief.relevantMedicalHistory.join("\n")}

RECENT REPORTS SUMMARY:
${brief.recentReportsSummary}

MAJOR CHANGES:
${brief.majorChangesSummary}

ITEMS REQUIRING REVIEW:
${brief.itemsRequiringReview.join("\n")}

CURRENT MEDICINES:
${brief.currentMedicines.join(", ")}

DISCLAIMER:
${brief.disclaimer}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handlePrint() {
    window.print();
  }

  function togglePrompt(idx: number) {
    setCheckedPrompts((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleAddToNotes() {
    setAddedToNotes(true);
    setTimeout(() => setAddedToNotes(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CODERX 1-PAGE CLINICAL SYNTHESIS</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            AI Doctor Brief & Consultation Assistant
          </h2>
          <p className="text-xs text-slate-600">
            Condensed 1-page longitudinal brief designed for instant pre-consultation review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Brief"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print 1-Page Summary</span>
          </button>
        </div>
      </div>

      {/* 1-Page AI Doctor Brief Document Layout (Section 17) */}
      <div className="bg-slate-100/95 rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-6 text-slate-800 print:bg-white print:text-black print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-300">
          <div>
            <div className="text-xl font-black text-slate-900 tracking-tight">CodeRx</div>
            <div className="text-xs font-bold text-sky-700 uppercase tracking-widest">
              Clinical Intelligence Brief
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>Patient: <strong className="text-slate-900">{patientName}</strong></div>
            <div>Date: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
          </div>
        </div>

        {/* Section 1: Patient Overview */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            1. Patient Clinical Overview
          </h3>
          <p className="text-sm font-medium text-slate-800 bg-white/90 p-3.5 rounded-xl border border-slate-300 leading-relaxed">
            {brief.patientOverview}
          </p>
        </div>

        {/* Section 2: Relevant Medical History */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            2. Relevant Medical History & Progression
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700 bg-white/90 p-3.5 rounded-xl border border-slate-300">
            {brief.relevantMedicalHistory.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Recent Reports & Major Changes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
              3. Recent Reports Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {brief.recentReportsSummary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>4. Major Metric Trajectory Shifts</span>
            </h4>
            <p className="text-xs text-rose-900 leading-relaxed">
              {brief.majorChangesSummary}
            </p>
          </div>
        </div>

        {/* Section 4: Items Requiring Review (High Priority) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>5. High-Priority Items Requiring Doctor Review</span>
          </h3>
          <div className="space-y-2">
            {brief.itemsRequiringReview.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 border border-rose-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Current & Previous Medicines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/90 border border-slate-300">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Current Regimen</span>
            </h4>
            <ul className="space-y-1 text-xs text-slate-800">
              {brief.currentMedicines.map((m, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-slate-300">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Previous / Discontinued
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              {brief.previousMedicines.map((m, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="line-through">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 6: Important Timeline Milestones */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            6. Key Longitudinal Milestones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {brief.importantTimelineEvents.map((event, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white/90 border border-slate-300 text-slate-700">
                {event}
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Attending Physician Diagnostic Summary */}
        <div className="p-4 rounded-xl bg-white/90 border border-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
              <span>7. Physician Diagnostic Assessment Summary</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Attending: Dr. Aarav Mehta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 space-y-1">
              <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Confirmed / Definitive</span>
              </div>
              <p className="text-slate-800 font-medium">
                • Type 2 Diabetes Mellitus [E11.9] (Chronic)
              </p>
              <p className="text-slate-800 font-medium">
                • Essential (Primary) Hypertension [I10] (Controlled)
              </p>
            </div>

            <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200 space-y-1">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-600" />
                <span>Probable / Working Differential</span>
              </div>
              <p className="text-slate-800 font-medium">
                • Stage 3a Diabetic Nephropathy [E11.22] (High Likelihood)
              </p>
              <p className="text-slate-800 font-medium">
                • ARB Hemodynamic Filtration Dip [R94.4] (Differential)
              </p>
            </div>
          </div>
        </div>

        {/* Required Medical Disclaimer */}
        <div className="pt-4 border-t border-slate-300 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {brief.disclaimer}
          </span>
        </div>
      </div>

      {/* Section 18: AI Consultation Assistant (Questions & Checks to Consider) */}
      <div className="bg-slate-100/95 rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300">
          <div>
            <div className="inline-flex items-center gap-1.5 text-indigo-700 text-xs font-bold">
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              <span>AI CONSULTATION ASSISTANT</span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              Questions & Clinical Checks to Consider During Consultation
            </h3>
          </div>

          <button
            onClick={handleAddToNotes}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {addedToNotes ? <Check className="w-3.5 h-3.5 text-white" /> : <FileCheck className="w-3.5 h-3.5" />}
            <span>{addedToNotes ? "Saved to Consultation Notes!" : "Add Checked to Notes"}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Interactive clinical prompts generated from recent parameter shifts and pharmacological contraindications. Check off items as you address them in the patient interview:
        </p>

        <div className="space-y-2.5">
          {brief.suggestedConsultationPrompts.map((prompt, idx) => {
            const isChecked = !!checkedPrompts[idx];

            return (
              <div
                key={idx}
                onClick={() => togglePrompt(idx)}
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-medium"
                    : "bg-white/90 border-slate-300 hover:border-slate-400 text-slate-800"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePrompt(idx)}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <span className={isChecked ? "line-through text-slate-400" : ""}>
                  {prompt}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 19: Designated Area for Probable Diagnosis & Confirmed Diagnosis by Doctor */}
      <DoctorDiagnosisSection
        patientId={patientId}
        patientName={patientName}
        initialConditions={patientConditions}
        onOpenPrescriptionModal={onOpenPrescriptionModal}
      />
    </div>
  );
}
