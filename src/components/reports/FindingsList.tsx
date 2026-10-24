"use client";

import { useState } from "react";
import {
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import {
  ConsolidatedFinding,
  DoctorFindingReviewStatus,
  FindingReviewPriority,
} from "@/lib/types/report-analysis";

interface FindingsListProps {
  findings: ConsolidatedFinding[];
  onUpdateFindingStatus?: (findingId: string, newStatus: DoctorFindingReviewStatus) => void;
  selectedAnnotationId?: string | null;
}

export function FindingsList({
  findings,
  onUpdateFindingStatus,
  selectedAnnotationId,
}: FindingsListProps) {
  function getPriorityBadge(priority: FindingReviewPriority) {
    switch (priority) {
      case "Important Review":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Review":
        return "bg-yellow-100 text-yellow-900 border-yellow-300";
      case "Informational":
        return "bg-sky-100 text-sky-900 border-sky-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  }

  function getReviewStatusBadge(status: DoctorFindingReviewStatus) {
    switch (status) {
      case "Reviewed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Accepted for consideration":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Disputed":
        return "bg-red-50 text-red-700 border-red-200";
      case "Not clinically relevant":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-600" />
          <span>Structured Findings & Evidence Traceability</span>
        </h4>
        <p className="text-xs text-slate-500">
          Strict clinical hierarchy: Observed Finding → Interpretation → Possible Diagnostic Hypothesis.
        </p>
      </div>

      <div className="space-y-3">
        {findings.map((finding) => {
          const isSelected = selectedAnnotationId === finding.annotationId;

          return (
            <div
              key={finding.id}
              className={`bg-white rounded-xl border p-4 space-y-3 transition-all ${
                isSelected
                  ? "border-sky-500 ring-2 ring-sky-200 shadow-md bg-sky-50/20"
                  : "border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              {/* Finding Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                        finding.priority
                      )}`}
                    >
                      {finding.priority}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {finding.category}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">{finding.title}</h5>
                </div>

                {/* Doctor Review Status Selector (Section 29) */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Physician Action:</span>
                  <select
                    value={finding.doctorReviewStatus}
                    onChange={(e) =>
                      onUpdateFindingStatus?.(
                        finding.id,
                        e.target.value as DoctorFindingReviewStatus
                      )
                    }
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer outline-hidden ${getReviewStatusBadge(
                      finding.doctorReviewStatus
                    )}`}
                  >
                    <option value="Needs further review">Needs further review</option>
                    <option value="Reviewed">Mark as Reviewed</option>
                    <option value="Accepted for consideration">Accept for consideration</option>
                    <option value="Disputed">Dispute finding</option>
                    <option value="Not clinically relevant">Not clinically relevant</option>
                  </select>
                </div>
              </div>

              {/* Strict Clinical Hierarchy (Section 36) */}
              <div className="space-y-2 text-xs">
                {/* 1. OBSERVATION */}
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span className="uppercase tracking-wider">1. Documented Observation (What is seen)</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed text-[12px]">{finding.observation}</p>
                </div>

                {/* 2. INTERPRETATION */}
                <div className="bg-sky-50/50 rounded-lg p-2.5 border border-sky-100">
                  <div className="flex items-center gap-1.5 text-sky-800 font-bold text-[11px] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span className="uppercase tracking-wider">2. Plausible Clinical Interpretation (Mechanism)</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed text-[12px]">
                    {finding.possibleInterpretation}
                  </p>
                </div>

                {/* 3. DIAGNOSTIC HYPOTHESIS */}
                <div className="bg-amber-50/40 rounded-lg p-2.5 border border-amber-100">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="uppercase tracking-wider">3. Possible Diagnostic Consideration (Hypothesis)</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed text-[12px]">
                    {finding.possibleDiagnosticHypothesis}
                  </p>
                </div>
              </div>

              {/* Model Checklist & Evidence Traceability (Section 14 & 16) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                {/* Evidence Link */}
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <ArrowRight className="w-3 h-3 text-sky-600" />
                  <span className="font-semibold text-slate-700">Traceability:</span>
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    {finding.sourceLocation}
                  </span>
                </div>

                {/* Models Agreeing */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Models:</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      finding.agreeingModels.includes("openai")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    GPT
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      finding.agreeingModels.includes("claude")
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    Claude
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      finding.agreeingModels.includes("gemini")
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    Gemini
                  </span>
                </div>
              </div>

              {/* Uncertainty */}
              {finding.uncertainty && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-600">Technical Uncertainty: </strong>
                    {finding.uncertainty}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
