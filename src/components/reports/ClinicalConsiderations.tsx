"use client";

import {
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  XCircle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { PossibleDiagnosticHypothesis } from "@/lib/types/report-analysis";

interface ClinicalConsiderationsProps {
  considerations: PossibleDiagnosticHypothesis[];
}

export function ClinicalConsiderations({
  considerations,
}: ClinicalConsiderationsProps) {
  if (!considerations || considerations.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
        No unusual radiographic pattern flagged. All analyzed visual landmarks remain within standard reference curvature.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with explicit "No Diagnosis" notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-sky-600" />
            <span>Radiographic Finding Clusters (Assistance Only — Not a Diagnosis)</span>
          </h4>
          <p className="text-xs text-slate-500">
            Correlated image features grouped for physician differential review. The AI does not diagnose disease.
          </p>
        </div>

        <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-amber-600" />
          No Medical Diagnosis Provided
        </span>
      </div>

      <div className="space-y-3">
        {considerations.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
          >
            {/* Consideration Title & Confirmation Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                  Radiographic Pattern Cluster {idx + 1}
                </span>
                <h5 className="text-sm font-bold text-slate-900">{item.condition}</h5>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-sky-600" />
                  Clinician Correlation Needed
                </span>
              </div>
            </div>

            {/* Model Agreement */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-500">Visual Pattern Concordance:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  item.modelAgreement.openai
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                GPT-4o {item.modelAgreement.openai ? "✓" : "—"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  item.modelAgreement.claude
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                Claude 3.5 {item.modelAgreement.claude ? "✓" : "—"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  item.modelAgreement.gemini
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                Gemini 2.5 {item.modelAgreement.gemini ? "✓" : "—"}
              </span>
            </div>

            {/* Supporting Findings */}
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-700 block">Supporting Film Observations:</span>
              <ul className="space-y-1 list-disc list-inside text-slate-600 pl-1">
                {item.supportingFindings.map((finding, fIdx) => (
                  <li key={fIdx} className="text-[11px]">
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Information / Contradictory Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              {item.missingInfo && item.missingInfo.length > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-sky-600" />
                    Required for Clinical Diagnosis:
                  </span>
                  <ul className="text-slate-600 space-y-0.5">
                    {item.missingInfo.map((info, iIdx) => (
                      <li key={iIdx}>• {info}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.contradictoryFindings && item.contradictoryFindings.length > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Info className="w-3 h-3 text-amber-600" />
                    Film Observations Ruling Out Severity:
                  </span>
                  <ul className="text-slate-600 space-y-0.5">
                    {item.contradictoryFindings.map((contra, cIdx) => (
                      <li key={cIdx}>• {contra}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Uncertainty / Safety Notice */}
            <div className="text-[11px] text-slate-600 bg-sky-50/50 p-2.5 rounded-lg border border-sky-100 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>
                <strong>Physician Note:</strong> {item.confidenceNote}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
