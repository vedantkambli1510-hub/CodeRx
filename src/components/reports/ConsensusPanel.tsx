"use client";

import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  GitBranch,
} from "lucide-react";
import {
  ConsolidatedFinding,
  DisagreementItem,
} from "@/lib/types/report-analysis";

interface ConsensusPanelProps {
  findings: ConsolidatedFinding[];
  disagreements: DisagreementItem[];
  onSelectFinding?: (id: string) => void;
}

export function ConsensusPanel({
  findings,
  disagreements,
  onSelectFinding,
}: ConsensusPanelProps) {
  const highAgreementCount = findings.filter((f) => f.agreementLevel === "high_agreement").length;
  const partialAgreementCount = findings.filter((f) => f.agreementLevel === "partial_agreement").length;
  const disagreementCount = findings.filter((f) => f.agreementLevel === "disagreement").length + disagreements.length;

  return (
    <div className="space-y-4">
      {/* Consensus Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>High Agreement</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-950">{highAgreementCount}</span>
            <span className="text-[10px] text-emerald-700">findings (3/3)</span>
          </div>
          <p className="text-[10px] text-emerald-600/90 mt-0.5">All 3 models concordant</p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-sky-800 text-xs font-semibold">
            <GitBranch className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Partial Agreement</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-sky-950">{partialAgreementCount}</span>
            <span className="text-[10px] text-sky-700">findings (2/3)</span>
          </div>
          <p className="text-[10px] text-sky-600/90 mt-0.5">Majority consensus</p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Disagreements</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-amber-950">{disagreementCount}</span>
            <span className="text-[10px] text-amber-700">divergences</span>
          </div>
          <p className="text-[10px] text-amber-600/90 mt-0.5">Doctor review required</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Evidence Level</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900">Adequate</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Supported by source file</p>
        </div>
      </div>

      {/* Disagreements Detail Box (Section 10 & 17) */}
      {disagreements.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h5 className="text-xs font-bold text-amber-950">
              Model Disagreements Requiring Physician Review
            </h5>
          </div>

          <div className="space-y-3">
            {disagreements.map((dis, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-amber-200/80 p-3 text-xs space-y-2.5 shadow-xs"
              >
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Point of Divergence: {dis.issue}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Needs Decision
                  </span>
                </div>

                {/* 3 Model Perspectives */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="font-bold text-emerald-800 block">OpenAI GPT-4o:</span>
                    <p className="text-slate-600 leading-snug">{dis.openaiView}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="font-bold text-amber-800 block">Claude 3.5:</span>
                    <p className="text-slate-600 leading-snug">{dis.claudeView}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="font-bold text-blue-800 block">Gemini 2.5:</span>
                    <p className="text-slate-600 leading-snug">{dis.geminiView}</p>
                  </div>
                </div>

                {/* Recommended Clinician Action */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-slate-700">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                  <span className="text-[11px]">
                    <strong className="text-slate-900">Physician Action: </strong>
                    {dis.physicianAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
