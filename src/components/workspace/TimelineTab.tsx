"use client";

import { useState } from "react";
import {
  Calendar,
  Filter,
  Search,
  FileText,
  Stethoscope,
  Pill,
  Activity,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  eventDate: string | Date;
  eventType: string; // LAB_REPORT | CONSULTATION | PRESCRIPTION | SCAN | ECG | MRI
  title: string;
  summary: string;
  importantFindings: string | null;
  medicinesJson: string | null;
  doctorNotes: string | null;
  isKeyMilestone: boolean;
  recordId?: string | null;
}

interface TimelineTabProps {
  timelines: TimelineEvent[];
  onOpenReportModal?: (recordId: string) => void;
}

export function TimelineTab({ timelines, onOpenReportModal }: TimelineTabProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = timelines.filter((event) => {
    if (filterType !== "ALL" && event.eventType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = event.title.toLowerCase().includes(q);
      const inSummary = event.summary.toLowerCase().includes(q);
      const inFindings = event.importantFindings?.toLowerCase().includes(q);
      return inTitle || inSummary || inFindings;
    }
    return true;
  });

  // Group events by year (Section 14: 2024, 2025, 2026)
  const groupedByYear = filtered.reduce((acc, event) => {
    const d = new Date(event.eventDate);
    const year = isNaN(d.getFullYear()) ? "2024" : String(d.getFullYear());
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  const typeConfig: Record<
    string,
    { label: string; icon: any; bg: string; text: string; border: string }
  > = {
    LAB_REPORT: {
      label: "Lab Report",
      icon: Activity,
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
    },
    CONSULTATION: {
      label: "Consultation",
      icon: Stethoscope,
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    PRESCRIPTION: {
      label: "Prescription",
      icon: Pill,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    SCAN: {
      label: "Diagnostic Scan",
      icon: FileText,
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    ECG: {
      label: "12-Lead ECG",
      icon: Activity,
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    MRI: {
      label: "MRI / Imaging",
      icon: FileText,
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header & Filter Controls (Section 14) */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <span>Longitudinal Medical Timeline</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Chronological synthesis of all historical lab assays, prescriptions, clinical consultations, and scans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-300 shadow-2xs">
              {filtered.length} Events Logged
            </span>
          </div>
        </div>

        {/* Search & Event Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-3 border-t border-slate-300">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings, notes, lab tests..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "ALL", label: "All Events" },
              { id: "LAB_REPORT", label: "Lab Reports" },
              { id: "CONSULTATION", label: "Consultations" },
              { id: "PRESCRIPTION", label: "Prescriptions" },
              { id: "ECG", label: "ECG & Scans" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === btn.id
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline View Grouped By Year (Section 14) */}
      {sortedYears.length === 0 ? (
        <div className="bg-slate-100/95 p-12 text-center rounded-2xl border border-slate-300 text-slate-500">
          No medical events matching the current search and filter criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-4">
              {/* Year Separator Badge */}
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm">
                  {year}
                </span>
                <div className="flex-1 h-px bg-slate-300" />
                <span className="text-[11px] font-semibold text-slate-600">
                  {groupedByYear[year].length} Record{groupedByYear[year].length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Event Cards in Year */}
              <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-300">
                {groupedByYear[year].map((evt) => {
                  const d = new Date(evt.eventDate);
                  const formattedDate = isNaN(d.getTime())
                    ? String(evt.eventDate)
                    : d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                  const config = typeConfig[evt.eventType] || typeConfig.LAB_REPORT;
                  const Icon = config.icon;

                  let medsList: any[] = [];
                  if (evt.medicinesJson) {
                    try {
                      medsList = JSON.parse(evt.medicinesJson);
                    } catch {}
                  }

                  return (
                    <div
                      key={evt.id}
                      className="relative bg-slate-100/95 rounded-2xl border border-slate-300 p-5 shadow-sm hover:border-slate-400 transition-all group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-6 sm:-left-8 top-5 w-4 h-4 rounded-full bg-white border-4 border-sky-600 shadow-xs" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`p-2 rounded-xl ${config.bg} ${config.text} border ${config.border}`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                {evt.title}
                              </h3>
                              {evt.isKeyMilestone && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  Milestone
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {config.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-2xs">
                            {formattedDate}
                          </span>
                          {evt.recordId && onOpenReportModal && (
                            <button
                              onClick={() => onOpenReportModal(evt.recordId!)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-100 text-sky-800 hover:bg-sky-600 hover:text-white transition-colors border border-sky-300 flex items-center gap-1 shadow-2xs"
                            >
                              <span>View Report</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Event Body */}
                      <div className="pt-3 space-y-3 text-xs">
                        <p className="text-slate-700 leading-relaxed">{evt.summary}</p>

                        {/* Important Clinical Findings (Section 14) */}
                        {evt.importantFindings && (
                          <div className="p-3 rounded-xl bg-white border border-slate-300 text-slate-800 shadow-2xs">
                            <span className="font-bold text-slate-900 block mb-1">
                              Important Findings:
                            </span>
                            <span className="font-mono text-slate-700">
                              {evt.importantFindings}
                            </span>
                          </div>
                        )}

                        {/* Medicines Prescribed / Recorded (Section 14) */}
                        {medsList.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-wrap items-center gap-2 shadow-2xs">
                            <span className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                              <Pill className="w-3.5 h-3.5 text-emerald-600" /> Prescribed / Recorded:
                            </span>
                            {medsList.map((m, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-[11px] font-semibold text-emerald-800"
                              >
                                {typeof m === "string" ? m : `${m.name} ${m.dose || m.dosage || ""}`}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Doctor's Note (Section 14) */}
                        {evt.doctorNotes && (
                          <div className="text-[11px] text-slate-600 italic flex items-center gap-1.5 pt-1">
                            <span className="font-bold text-slate-800 not-italic">Doctor's Note:</span>
                            <span>"{evt.doctorNotes}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
