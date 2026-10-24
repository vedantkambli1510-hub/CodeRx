"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

interface FindingMetric {
  name: string;
  category: "Thorax" | "Diaphragm" | "Cardiac" | "Pleura" | "Annotation";
  agreementPercent: number;
  models: {
    openai: { status: "concordant" | "divergent" | "normal"; label: string };
    claude: { status: "concordant" | "divergent" | "normal"; label: string };
    gemini: { status: "concordant" | "divergent" | "normal"; label: string };
  };
  summary: string;
}

export function ModelConcordanceChart() {
  const [viewMode, setViewMode] = useState<"bars" | "matrix">("bars");

  const metrics: FindingMetric[] = [
    {
      name: "Bilateral Thoracic Hyperinflation",
      category: "Thorax",
      agreementPercent: 100,
      models: {
        openai: { status: "concordant", label: "Confirmed (Overexpansion)" },
        claude: { status: "concordant", label: "Confirmed (Hyperlucency)" },
        gemini: { status: "concordant", label: "Confirmed (Rib Spacing)" },
      },
      summary: "All 3 models concordant on bilateral lung field enlargement & heightened lucency.",
    },
    {
      name: "Diaphragmatic Dome Flattening",
      category: "Diaphragm",
      agreementPercent: 100,
      models: {
        openai: { status: "concordant", label: "Depressed (<10th rib)" },
        claude: { status: "concordant", label: "Loss of superior curvature" },
        gemini: { status: "concordant", label: "Flattened hemidiaphragms" },
      },
      summary: "Full consensus: bilateral domes depressed below expected baseline curvature.",
    },
    {
      name: "Cardiothoracic Ratio (CTR 0.42)",
      category: "Cardiac",
      agreementPercent: 100,
      models: {
        openai: { status: "normal", label: "Normal (< 0.50)" },
        claude: { status: "normal", label: "Normal (No enlargement)" },
        gemini: { status: "normal", label: "Normal silhouette" },
      },
      summary: "Cardiac silhouette remains normal; no evidence of ventricular enlargement or cor pulmonale.",
    },
    {
      name: "Pleural Angles & No Consolidation",
      category: "Pleura",
      agreementPercent: 100,
      models: {
        openai: { status: "normal", label: "Sharp & Clear" },
        claude: { status: "normal", label: "No effusion or pneumothorax" },
        gemini: { status: "normal", label: "Clear costophrenic recesses" },
      },
      summary: "No focal consolidations, acute infiltrates, or pleural effusions detected bilaterally.",
    },
    {
      name: "Subdiaphragmatic 'Fluid-Fluid Level' Label",
      category: "Annotation",
      agreementPercent: 33,
      models: {
        openai: { status: "concordant", label: "Physiological Gastric Bubble" },
        claude: { status: "concordant", label: "Educational Label Reference" },
        gemini: { status: "divergent", label: "Flags for Explicit Doctor Review" },
      },
      summary: "Divergence: Gemini flags region for doctor inspection; GPT & Claude interpret as stomach air bubble.",
    },
  ];

  function getBarColor(percent: number) {
    if (percent === 100) return "bg-emerald-500";
    if (percent >= 66) return "bg-sky-500";
    return "bg-amber-500";
  }

  function getStatusBadge(status: "concordant" | "divergent" | "normal") {
    switch (status) {
      case "concordant":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "normal":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "divergent":
        return "bg-amber-50 text-amber-800 border-amber-300";
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Multi-Model Concordance Meters (GPT-4o vs Claude 3.5 vs Gemini 2.5)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual consensus distribution across individual radiographic parameters.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode("bars")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === "bars"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Concordance Gauges
          </button>
          <button
            onClick={() => setViewMode("matrix")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === "matrix"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Model Matrix
          </button>
        </div>
      </div>

      {/* VIEW 1: Visual Progress Bar Gauges */}
      {viewMode === "bars" && (
        <div className="space-y-3.5">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700">
                    {metric.category}
                  </span>
                  <span className="font-bold text-slate-900">{metric.name}</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold">
                  <span
                    className={
                      metric.agreementPercent === 100
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }
                  >
                    {metric.agreementPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {metric.agreementPercent === 100
                      ? "(3/3 Consensus)"
                      : "(Divergence Flagged)"}
                  </span>
                </div>
              </div>

              {/* Progress Bar with 3 segments */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-500 ${getBarColor(
                    metric.agreementPercent
                  )}`}
                  style={{ width: `${metric.agreementPercent}%` }}
                />
              </div>

              {/* Concise 1-liner explanation */}
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                {metric.agreementPercent === 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span>{metric.summary}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: 3-Model Side-by-Side Breakdown Matrix */}
      {viewMode === "matrix" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Finding Parameter</th>
                <th className="py-2.5 px-3">OpenAI GPT-4o</th>
                <th className="py-2.5 px-3">Claude 3.5 Sonnet</th>
                <th className="py-2.5 px-3">Gemini 2.5 Flash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((metric, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <div className="space-y-0.5">
                      <div>{metric.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Category: {metric.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        metric.models.openai.status
                      )}`}
                    >
                      {metric.models.openai.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        metric.models.claude.status
                      )}`}
                    >
                      {metric.models.claude.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        metric.models.gemini.status
                      )}`}
                    >
                      {metric.models.gemini.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Assistive Disclaimer */}
      <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="text-[11px]">
            <strong>Visual Assist Only: </strong>
            Model concordance measures radiographic feature agreement. Clinical diagnosis is determined exclusively by the physician.
          </span>
        </div>
      </div>
    </div>
  );
}
