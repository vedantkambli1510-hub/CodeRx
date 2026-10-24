"use client";

import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  Calendar,
  Layers,
  CheckCircle,
  User,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { ReportCategory, ReportStatus, ReviewStatus } from "@/lib/data/reports-data";

export type MajorReportTab =
  | "all"
  | "images"
  | "lab"
  | "pathology"
  | "radiology"
  | "other"
  | "ai_analysis";

export interface FilterState {
  searchQuery: string;
  reportType: ReportStatus | "all";
  category: ReportCategory | "all";
  reviewStatus: ReviewStatus | "all";
  dateRange: "all" | "today" | "7days" | "30days" | "90days";
  patientId: string | "all";
  sortBy: "newest" | "oldest" | "patient_asc" | "patient_desc" | "priority";
  majorTab: MajorReportTab;
  aiStatus: "all" | "complete" | "analyzing" | "partial" | "failed";
  providerAgreement: "all" | "3/3" | "2/3" | "Disagreement" | "Insufficient Evidence";
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  patientOptions: Array<{ id: string; name: string }>;
  isPanelOpen: boolean;
  onTogglePanel: () => void;
  totalFilteredCount: number;
}

export function FilterControls({
  filters,
  onFilterChange,
  onClearFilters,
  patientOptions,
  isPanelOpen,
  onTogglePanel,
  totalFilteredCount,
}: FilterPanelProps) {
  const categories: Array<ReportCategory | "all"> = [
    "all",
    "Blood Test",
    "Imaging",
    "ECG",
    "MRI",
    "CT Scan",
    "X-Ray",
    "Pathology",
    "General Health",
    "Ultrasound",
  ];

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.reportType !== "all" ||
    filters.category !== "all" ||
    filters.reviewStatus !== "all" ||
    filters.dateRange !== "all" ||
    filters.patientId !== "all" ||
    filters.sortBy !== "newest" ||
    filters.majorTab !== "all" ||
    filters.aiStatus !== "all" ||
    filters.providerAgreement !== "all";

  const majorTabs: Array<{ id: MajorReportTab; label: string; count?: string }> = [
    { id: "all", label: "All Reports" },
    { id: "images", label: "Image Reports", count: "Important" },
    { id: "lab", label: "Laboratory Reports" },
    { id: "pathology", label: "Pathology Reports" },
    { id: "radiology", label: "Radiology Reports" },
    { id: "other", label: "Other Medical Documents" },
    { id: "ai_analysis", label: "AI Analysis" },
  ];

  return (
    <div className="space-y-4">
      {/* Major Section Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {majorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange({ majorTab: tab.id })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filters.majorTab === tab.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-200/80 text-slate-700 border border-slate-300 hover:bg-slate-300 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
                    filters.majorTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Top Search & Primary Filters Bar */}
      <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-300 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Real-time Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search patients, report names, patient ID, or findings..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 bg-slate-100 text-slate-900 placeholder-slate-400 transition-all font-medium"
          />
        </div>

        {/* Controls Cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Report Type Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.reportType}
              onChange={(e) =>
                onFilterChange({ reportType: e.target.value as ReportStatus | "all" })
              }
              aria-label="Filter by report classification"
              className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-100 text-slate-800 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="all">Report Type: All</option>
              <option value="review_required">⚠️ Review Required</option>
              <option value="improve">🟢 Improve</option>
              <option value="new_findings">✨ New Findings</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[145px]">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({ sortBy: e.target.value as FilterState["sortBy"] })
              }
              aria-label="Sort reports"
              className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-100 text-slate-800 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="oldest">Sort: Oldest first</option>
              <option value="priority">Sort: Priority</option>
              <option value="patient_asc">Patient Name A–Z</option>
              <option value="patient_desc">Patient Name Z–A</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* Expand Filter Panel Button */}
          <button
            type="button"
            onClick={onTogglePanel}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              isPanelOpen || hasActiveFilters
                ? "bg-sky-100 border-sky-300 text-sky-800 font-bold"
                : "border-slate-300 bg-slate-200/80 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-sky-600" />
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isPanelOpen && (
        <div className="p-4 sm:p-5 bg-slate-100/95 rounded-2xl border border-slate-300 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Advanced Filter Parameters
            </span>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-sky-700 hover:text-sky-900 font-bold cursor-pointer"
            >
              Clear all filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs">
            {/* 1. Date Range */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Date Range</span>
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  onFilterChange({
                    dateRange: e.target.value as FilterState["dateRange"],
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>

            {/* 2. Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-500" />
                <span>Report Category</span>
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  onFilterChange({
                    category: e.target.value as ReportCategory | "all",
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== "all")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {/* 3. Review Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-slate-500" />
                <span>Review Status</span>
              </label>
              <select
                value={filters.reviewStatus}
                onChange={(e) =>
                  onFilterChange({
                    reviewStatus: e.target.value as ReviewStatus | "all",
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
              >
                <option value="all">All Review States</option>
                <option value="unreviewed">Unreviewed</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>

            {/* 4. Patient Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                <span>Select Patient</span>
              </label>
              <select
                value={filters.patientId}
                onChange={(e) => onFilterChange({ patientId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
              >
                <option value="all">All Patients ({patientOptions.length})</option>
                {patientOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            {/* 5. AI Analysis Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                AI Analysis Status
              </label>
              <select
                value={filters.aiStatus}
                onChange={(e) =>
                  onFilterChange({
                    aiStatus: e.target.value as FilterState["aiStatus"],
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="complete">Complete ✓</option>
                <option value="analyzing">Processing ●</option>
                <option value="partial">Partial</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* 6. Provider Agreement */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Provider Agreement
              </label>
              <select
                value={filters.providerAgreement}
                onChange={(e) =>
                  onFilterChange({
                    providerAgreement: e.target.value as FilterState["providerAgreement"],
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
              >
                <option value="all">All Agreements</option>
                <option value="3/3">3/3 High Agreement</option>
                <option value="2/3">2/3 Partial Agreement</option>
                <option value="Disagreement">Model Disagreements</option>
                <option value="Insufficient Evidence">Insufficient Evidence</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Result Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          <strong className="text-slate-900 font-bold">{totalFilteredCount}</strong>{" "}
          {totalFilteredCount === 1 ? "report found" : "reports found"}
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-sky-700 font-bold">
            Active filters applied
          </span>
        )}
      </div>
    </div>
  );
}
