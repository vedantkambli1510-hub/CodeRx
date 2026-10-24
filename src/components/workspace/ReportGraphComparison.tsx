"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { WhatChangedItem } from "@/lib/ai/differentials";

interface ReportGraphComparisonProps {
  items: WhatChangedItem[];
  previousDate?: string;
  latestDate?: string;
}

export function ReportGraphComparison({
  items,
  previousDate = "Jan 15, 2024",
  latestDate = "Jul 18, 2024",
}: ReportGraphComparisonProps) {
  // Plain language explanations for each parameter
  const patientExplanations: Record<string, { whatItIs: string; patientMeaning: string }> = {
    "hba1c": {
      whatItIs: "Your 3-Month Average Blood Sugar Level",
      patientMeaning:
        "Fell from 8.4% down to 7.1%. This is great news! Your daily diabetes medicines are helping keep your blood sugar under much better control.",
    },
    "glucose": {
      whatItIs: "Morning Fasting Blood Sugar",
      patientMeaning:
        "Dropped from 168 to 122 mg/dL. You are making real progress toward the ideal fasting morning target (70-99 mg/dL).",
    },
    "creatinine": {
      whatItIs: "Kidney Blood Filtration Waste Marker",
      patientMeaning:
        "Rose from 1.0 to 1.7 mg/dL. When this goes up, it means your kidneys are working harder than usual. Your doctor is reviewing your medicines (like Metformin) to keep your kidneys protected.",
    },
    "bun": {
      whatItIs: "Blood Urea Nitrogen (Protein Waste)",
      patientMeaning:
        "Increased from 16 to 34 mg/dL. Often happens if you haven't been drinking enough water or if kidney filtration slows down. Staying well-hydrated helps.",
    },
    "egfr": {
      whatItIs: "Estimated Kidney Filtration Speed",
      patientMeaning:
        "Newly reported at 46 mL/min. Healthy kidneys are usually above 60. This is why your doctor is taking extra care to adjust your pill doses.",
    },
    "cholesterol": {
      whatItIs: "Total Blood Fats & Lipids",
      patientMeaning:
        "Dropped from 220 down to 174 mg/dL into the healthy green zone (<200 mg/dL). Your statin pill (Atorvastatin) is doing its job well.",
    },
    "ldl": {
      whatItIs: "Bad Cholesterol (Clogs Blood Vessels)",
      patientMeaning:
        "Decreased significantly from 134 to 92 mg/dL. You successfully beat the target (<100 mg/dL), protecting your heart and arteries.",
    },
    "blood pressure": {
      whatItIs: "Arterial Pressure",
      patientMeaning:
        "Controlled nicely from 138/88 down to 126/80 mmHg on Telmisartan. Great for keeping strokes and heart strain away.",
    },
    "microalbumin": {
      whatItIs: "Protein in Urine",
      patientMeaning:
        "Slightly elevated from 32 to 88 mg/g. Shows tiny protein leaks in kidney filters. Your doctor is keeping a close watch to protect your kidney walls.",
    },
  };

  const getExplanation = (paramName: string) => {
    const lower = paramName.toLowerCase();
    for (const [key, val] of Object.entries(patientExplanations)) {
      if (lower.includes(key)) return val;
    }
    return {
      whatItIs: "Clinical Laboratory Biomarker",
      patientMeaning: "Monitored longitudinally between your previous and recent health checks.",
    };
  };

  // Extract clean numerical parameters for charting
  const graphableItems = items
    .map((item) => {
      const prevVal = parseFloat(item.previousValue.replace(/[^\d.-]/g, ""));
      const latestVal = parseFloat(item.latestValue.replace(/[^\d.-]/g, ""));
      if (isNaN(latestVal)) return null;

      const maxVal = Math.max(isNaN(prevVal) ? latestVal : prevVal, latestVal) * 1.25 || 100;
      const prevPercent = isNaN(prevVal) ? 0 : Math.min(100, Math.max(8, (prevVal / maxVal) * 100));
      const latestPercent = Math.min(100, Math.max(8, (latestVal / maxVal) * 100));

      const isImproved = item.category === "IMPROVED";
      const isReview = item.category === "REQUIRES_REVIEW";

      return {
        ...item,
        prevVal: isNaN(prevVal) ? null : prevVal,
        latestVal,
        prevPercent,
        latestPercent,
        maxVal,
        isImproved,
        isReview,
        explanation: getExplanation(item.parameter),
      };
    })
    .filter(Boolean) as (WhatChangedItem & {
    prevVal: number | null;
    latestVal: number;
    prevPercent: number;
    latestPercent: number;
    maxVal: number;
    isImproved: boolean;
    isReview: boolean;
    explanation: { whatItIs: string; patientMeaning: string };
  })[];

  const [selectedParam, setSelectedParam] = useState<string>(
    graphableItems[0]?.parameter || ""
  );

  const activeItem = graphableItems.find((i) => i.parameter === selectedParam) || graphableItems[0];

  return (
    <div className="bg-slate-100/95 rounded-3xl border border-slate-300 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Visual Health Trajectory</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Report Graphs: Before vs Now Comparison
          </h3>
          <p className="text-xs text-slate-600">
            Click on any test graph to see what changed visually and read what it means in simple everyday terms.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            <span className="text-slate-600">Previous ({previousDate})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600"></span>
            <span className="text-sky-800 font-bold">Latest ({latestDate})</span>
          </div>
        </div>
      </div>

      {/* Featured Parameter Visual Showcase */}
      {activeItem && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-200 via-slate-100 to-indigo-100/70 text-slate-900 shadow-sm space-y-5 border border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-800 font-semibold block">
                {activeItem.explanation.whatItIs}
              </span>
              <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
                <span>{activeItem.parameter}</span>
                <span className="text-xs font-normal text-slate-600">({activeItem.unit})</span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  activeItem.isImproved
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : activeItem.isReview
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : "bg-sky-100 text-sky-900 border border-sky-300"
                }`}
              >
                {activeItem.category}
              </span>
              <span className="text-xs text-slate-600 font-mono">
                Ref: {activeItem.referenceRange}
              </span>
            </div>
          </div>

          {/* Side-by-Side Dual-Bar Visual Graph */}
          <div className="space-y-4 pt-1">
            {/* Previous Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Previous Baseline ({previousDate}):</span>
                </span>
                <strong className="text-slate-900 text-sm font-bold">
                  {activeItem.previousValue}
                </strong>
              </div>
              <div className="w-full h-5 rounded-xl bg-slate-200 overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full rounded-lg bg-slate-400 transition-all duration-700 ease-out"
                  style={{ width: `${activeItem.prevPercent}%` }}
                />
              </div>
            </div>

            {/* Latest Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-sky-900">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Latest Follow-up ({latestDate}):</span>
                </span>
                <strong className="text-slate-900 text-base font-black">
                  {activeItem.latestValue}
                </strong>
              </div>
              <div className="w-full h-6 rounded-xl bg-slate-200 overflow-hidden p-0.5 border border-slate-300">
                <div
                  className={`h-full rounded-lg transition-all duration-700 ease-out ${
                    activeItem.isImproved
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : activeItem.isReview
                      ? "bg-gradient-to-r from-rose-500 to-amber-500"
                      : "bg-gradient-to-r from-sky-500 to-indigo-600"
                  }`}
                  style={{ width: `${activeItem.latestPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Patient Friendly Explanation Callout */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-300 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Simply Explained For You</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {activeItem.explanation.patientMeaning}
            </p>
          </div>
        </div>
      )}

      {/* Grid of All Biomarker Visual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {graphableItems.map((item) => {
          const isSelected = item.parameter === selectedParam;

          return (
            <div
              key={item.parameter}
              onClick={() => setSelectedParam(item.parameter)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? "border-sky-500 bg-white shadow-md ring-2 ring-sky-500/40"
                  : "border-slate-300 bg-slate-50/90 hover:border-slate-400 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
                    {item.parameter}
                  </h5>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ref: {item.referenceRange}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    item.isImproved
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : item.isReview
                      ? "bg-rose-100 text-rose-900 border border-rose-300"
                      : "bg-slate-200 text-slate-700 border border-slate-300"
                  }`}
                >
                  {item.category === "IMPROVED" ? "🟢 Down/Better" : item.category === "REQUIRES_REVIEW" ? "🔴 Attention" : "🔵 New"}
                </span>
              </div>

              {/* Mini Comparative Bars */}
              <div className="space-y-1.5 pt-1">
                {/* Previous */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Prev:</span>
                  <span className="font-semibold text-slate-700">{item.previousValue}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${item.prevPercent}%` }}
                  />
                </div>

                {/* Latest */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Latest:</span>
                  <span className="font-black text-slate-900">{item.latestValue}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    className={`h-full rounded-full ${
                      item.isImproved
                        ? "bg-emerald-500"
                        : item.isReview
                        ? "bg-rose-500"
                        : "bg-sky-500"
                    }`}
                    style={{ width: `${item.latestPercent}%` }}
                  />
                </div>
              </div>

              {/* 1-sentence simple preview */}
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pt-2 border-t border-slate-200">
                {item.explanation.patientMeaning}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
