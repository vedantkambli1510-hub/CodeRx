"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Cpu,
  Info,
  ShieldCheck,
} from "lucide-react";
import {
  AIProviderName,
  SingleProviderAnalysis,
} from "@/lib/types/report-analysis";

interface ThreeModelComparisonProps {
  providerAnalyses: Record<AIProviderName, SingleProviderAnalysis>;
  onRetryProvider?: (provider: AIProviderName) => void;
  isRetryingProvider?: AIProviderName | null;
}

export function ThreeModelComparison({
  providerAnalyses,
  onRetryProvider,
  isRetryingProvider,
}: ThreeModelComparisonProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const providers: Array<{
    key: AIProviderName;
    name: string;
    badgeColor: string;
    borderAccent: string;
  }> = [
    {
      key: "openai",
      name: "OpenAI GPT-4o",
      badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
      borderAccent: "border-t-emerald-500",
    },
    {
      key: "claude",
      name: "Anthropic Claude 3.5",
      badgeColor: "bg-amber-500/15 text-amber-700 border-amber-500/30",
      borderAccent: "border-t-amber-500",
    },
    {
      key: "gemini",
      name: "Google Gemini 2.5",
      badgeColor: "bg-blue-500/15 text-blue-700 border-blue-500/30",
      borderAccent: "border-t-blue-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-600" />
            <span>Three Independent AI Analyses (Side-by-Side)</span>
          </h4>
          <p className="text-xs text-slate-500">
            Each model reviewed the original report without cross-contamination.
          </p>
        </div>

        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
        >
          <span>{showTechnicalDetails ? "Hide Technical Details" : "Show Technical Details"}</span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map(({ key, name, badgeColor, borderAccent }) => {
          const analysis = providerAnalyses[key];
          const isRetrying = isRetryingProvider === key;

          return (
            <div
              key={key}
              className={`bg-white rounded-xl border border-slate-200 border-t-4 ${borderAccent} p-4 shadow-sm flex flex-col justify-between space-y-4`}
            >
              {/* Provider Header */}
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeColor}`}>
                    {name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {analysis?.status === "complete" ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Complete
                      </span>
                    ) : analysis?.status === "failed" ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        Failed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Analyzing...
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Model: {analysis?.modelName || "Configured model"}</span>
                </div>
              </div>

              {/* Provider Content */}
              {analysis?.status === "complete" ? (
                <div className="space-y-3.5 text-xs flex-1">
                  {/* Document Type Detected */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Detected Classification
                    </span>
                    <span className="text-slate-800 font-medium bg-slate-50 px-2 py-1 rounded block border border-slate-100">
                      {analysis.documentType}
                    </span>
                  </div>

                  {/* Observations */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Primary Observations
                    </span>
                    <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc list-inside">
                      {analysis.observations.slice(0, 3).map((obs, idx) => (
                        <li key={idx} className="text-[11px]">
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interpretations */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Possible Interpretation
                    </span>
                    <p className="text-[11px] text-slate-600 italic bg-slate-50/80 p-2 rounded border border-slate-100 leading-relaxed">
                      "{analysis.possibleInterpretations[0] || "No critical deviation reported."}"
                    </p>
                  </div>

                  {/* Uncertainties */}
                  {analysis.uncertainties.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        Noted Uncertainties
                      </span>
                      <p className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100">
                        {analysis.uncertainties[0]}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Failed / Incomplete State */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <p className="text-xs font-semibold text-slate-700">Provider Analysis Unavailable</p>
                  <p className="text-[11px] text-slate-500">
                    {analysis?.errorMessage || "Service call timed out or endpoint unconfigured."}
                  </p>
                </div>
              )}

              {/* Action / Retry Button (Section 47) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onRetryProvider?.(key)}
                  disabled={isRetrying}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-colors"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin text-sky-600" : ""}`} />
                  <span>{isRetrying ? `Re-running ${name}...` : `Re-evaluate with ${name}`}</span>
                </button>
              </div>

              {/* Expandable Technical Details (Section 50) */}
              {showTechnicalDetails && analysis && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 space-y-1">
                  <div>Model ID: {analysis.modelName}</div>
                  <div>Timestamp: {analysis.timestamp}</div>
                  <div>Quality: {analysis.documentQuality.resolution} resolution</div>
                  <div>Adequate: {analysis.documentQuality.adequate ? "YES" : "NO"}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
