"use client";

import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Filter,
  Check,
  MessageSquare,
  FileCode,
  PowerOff,
  BarChart3,
  Table,
  Layers,
} from "lucide-react";
import { WhatChangedComparison, WhatChangedItem } from "@/lib/ai/differentials";
import { ReportGraphComparison } from "./ReportGraphComparison";
import { PatientSimpleExplainer } from "./PatientSimpleExplainer";

interface WhatChangedTabProps {
  comparison: WhatChangedComparison;
  onOpenReportModal?: (reportName: string) => void;
  onSelectTab?: (tab: string) => void;
}

export function WhatChangedTab({
  comparison,
  onOpenReportModal,
  onSelectTab,
}: WhatChangedTabProps) {
  const [displayMode, setDisplayMode] = useState<"BOTH" | "GRAPHS" | "TABLE">("BOTH");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [reviewedItems, setReviewedItems] = useState<Record<string, boolean>>({});
  const [clinicalNotes, setClinicalNotes] = useState<Record<string, string>>({});
  const [activeNoteParam, setActiveNoteParam] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const filteredItems = comparison.items.filter((item) => {
    if (filterCategory === "ALL") return true;
    return item.category === filterCategory;
  });

  function toggleReviewed(param: string) {
    setReviewedItems((prev) => ({
      ...prev,
      [param]: !prev[param],
    }));
  }

  function handleSaveNote(param: string) {
    if (noteInput.trim()) {
      setClinicalNotes((prev) => ({
        ...prev,
        [param]: noteInput.trim(),
      }));
    }
    setActiveNoteParam(null);
    setNoteInput("");
  }

  const categoryBadgeMap: Record<WhatChangedItem["category"], { bg: string; text: string; icon: string; label: string }> = {
    IMPROVED: {
      bg: "bg-emerald-100 border-emerald-300",
      text: "text-emerald-900",
      icon: "🟢",
      label: "IMPROVED",
    },
    STABLE: {
      bg: "bg-amber-100 border-amber-300",
      text: "text-amber-900",
      icon: "🟡",
      label: "STABLE",
    },
    REQUIRES_REVIEW: {
      bg: "bg-rose-100 border-rose-300",
      text: "text-rose-900 font-extrabold",
      icon: "🔴",
      label: "REQUIRES REVIEW",
    },
    NEW: {
      bg: "bg-sky-100 border-sky-300",
      text: "text-sky-900",
      icon: "🔵",
      label: "NEW FINDING",
    },
    NO_LONGER_REPORTED: {
      bg: "bg-slate-200 border-slate-300",
      text: "text-slate-700",
      icon: "⚪",
      label: "NO LONGER REPORTED",
    },
  };

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-indigo-100/70 text-slate-900 shadow-sm border border-slate-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>CODERX LONGITUDINAL DIFFERENTIAL ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">WHAT CHANGED?</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Automated comparison between baseline and follow-up medical records. Highlights clinical trajectory and flags significant metric shifts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/90 border border-slate-300 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Alerts</span>
              <span className="text-xl font-black text-rose-600">{comparison.criticalAlertCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/90 border border-slate-300 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Improved</span>
              <span className="text-xl font-black text-emerald-600">{comparison.improvedCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/90 border border-slate-300 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">New</span>
              <span className="text-xl font-black text-sky-600">{comparison.newCount}</span>
            </div>
          </div>
        </div>

        {/* Selected Records Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-300">
          <div className="p-3.5 rounded-xl bg-white/90 border border-slate-300 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Previous Record
            </span>
            <div className="font-bold text-sm text-slate-900">{comparison.previousReportTitle}</div>
            <div className="text-xs text-sky-700 mt-0.5">Date: {comparison.previousReportDate}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/90 border border-slate-300 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Latest Record (Assayed)
            </span>
            <div className="font-bold text-sm text-slate-900">{comparison.latestReportTitle}</div>
            <div className="text-xs text-emerald-700 mt-0.5">Date: {comparison.latestReportDate}</div>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner (Section 16: "⚠️ Requires Doctor Review") */}
      {comparison.criticalAlertCount > 0 && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-rose-950 text-base">
                ⚠️ Requires Doctor Review: Significant Parameter Shifts Detected
              </h3>
              <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                CodeRx AI observation: A clinically notable acute change was detected between the two records.
                Specifically, <strong className="font-bold text-rose-950">Serum Creatinine elevated from 1.0 to 1.7 mg/dL (+70% rise)</strong> and{" "}
                <strong className="font-bold text-rose-950">eGFR is newly documented at 46 mL/min/1.73m²</strong> (Moderate-to-severe filtration decline).
              </p>
              <div className="mt-2 text-[11px] text-rose-700 font-semibold italic">
                AI observation: A change was detected between the two records. Verify against original lab document before making dosage decisions.
              </div>

              {/* One-click Action to Deprescribe / Turn Off contraindicated medicine */}
              {onSelectTab && (
                <div className="mt-3 pt-3 border-t border-rose-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-rose-950 font-bold flex items-center gap-1.5">
                    <span>Clinical Action Recommended:</span>
                    <span className="font-normal text-rose-900">
                      Discontinue Metformin to prevent lactic acidosis with reduced eGFR (46 mL/min).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTab("medicines")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>Go to Medicines & Turn Off Metformin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patient Friendly AI Explainer: Simply Telling the Patient About It */}
      <PatientSimpleExplainer patientName="Rajesh Sharma" />

      {/* View Switcher: Graphs vs Table vs Both */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/95 p-3 rounded-2xl border border-slate-300 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
            Display Mode:
          </span>
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setDisplayMode("BOTH")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === "BOTH"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Story (Graphs + Table)</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("GRAPHS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === "GRAPHS"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Visual Graphs Only</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("TABLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === "TABLE"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Clinical Table Only</span>
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-medium px-1">
          Comparing {comparison.previousReportDate} vs {comparison.latestReportDate}
        </span>
      </div>

      {/* 1. VISUAL GRAPH COMPARISON (Photo 2 Running Feature) */}
      {(displayMode === "GRAPHS" || displayMode === "BOTH") && (
        <ReportGraphComparison
          items={comparison.items}
          previousDate={comparison.previousReportDate}
          latestDate={comparison.latestReportDate}
        />
      )}

      {/* 2. STRUCTURED CLINICAL TABLE (Photo 2 Table Feature) */}
      {(displayMode === "TABLE" || displayMode === "BOTH") && (
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100/95 p-3 rounded-xl border border-slate-300">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter by:
              </span>
              {[
                { id: "ALL", label: "All Parameters" },
                { id: "REQUIRES_REVIEW", label: "🔴 Requires Review" },
                { id: "IMPROVED", label: "🟢 Improved" },
                { id: "NEW", label: "🔵 New Findings" },
                { id: "NO_LONGER_REPORTED", label: "⚪ No Longer Reported" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    filterCategory === tab.id
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-slate-200/90 text-slate-700 hover:bg-slate-300 border border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredItems.length} of {comparison.items.length} parameters
            </span>
          </div>

          {/* Comparison Structured Table (Section 15) */}
          <div className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-200/70 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Parameter</th>
                <th className="py-3.5 px-4">Previous ({comparison.previousReportDate})</th>
                <th className="py-3.5 px-4">Latest ({comparison.latestReportDate})</th>
                <th className="py-3.5 px-4">Change Trajectory</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">AI Clinical Observation</th>
                <th className="py-3.5 px-4 text-right">Doctor Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item, idx) => {
                const badge = categoryBadgeMap[item.category];
                const isReviewed = reviewedItems[item.parameter];
                const note = clinicalNotes[item.parameter];

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      item.isCriticalAlert
                        ? "bg-rose-50/70 hover:bg-rose-100/80"
                        : "hover:bg-slate-200/40"
                    }`}
                  >
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div>{item.parameter}</div>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Ref: {item.referenceRange}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                      {item.previousValue}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {item.latestValue}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {item.changeDescription}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${badge.bg} ${badge.text}`}
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 max-w-xs leading-relaxed">
                      {item.clinicalObservation}
                      {note && (
                        <div className="mt-1.5 p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-[11px]">
                          <strong>Dr. Note:</strong> {note}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleReviewed(item.parameter)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                            isReviewed
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"
                          }`}
                          title="Mark as reviewed"
                        >
                          {isReviewed ? "✓ Reviewed" : "Mark Review"}
                        </button>

                        <button
                          onClick={() => {
                            setActiveNoteParam(item.parameter);
                            setNoteInput(note || "");
                          }}
                          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs"
                          title="Add clinical note"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mandatory Medical Disclaimer (Section 15 & 32) */}
        <div className="p-4 bg-slate-100 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>AI-detected change — requires clinical review.</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Absence of a finding in the latest report does not automatically imply medical resolution.
          </span>
        </div>
      </div>
    </div>
  )}

      {/* Note Input Modal */}
      {activeNoteParam && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-50 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-slate-900 text-sm">
              Add Clinical Note: {activeNoteParam}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record doctor observation regarding this parameter shift.
            </p>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Discussed hydration; repeat serum creatinine in 2 weeks..."
              className="w-full mt-3 p-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setActiveNoteParam(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNote(activeNoteParam)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
