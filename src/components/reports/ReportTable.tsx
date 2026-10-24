"use client";

import { ChevronLeft, ChevronRight, FileText, ArrowRight, User } from "lucide-react";
import { PatientReport } from "@/lib/data/reports-data";
import { StatusBadge, ReviewStatusBadge, CategoryBadge } from "./StatusBadge";

interface ReportTableProps {
  reports: PatientReport[];
  totalReportsCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewReport: (report: PatientReport) => void;
  onViewPatient: (patientId: string) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function ReportTable({
  reports,
  totalReportsCount,
  currentPage,
  pageSize,
  onPageChange,
  onViewReport,
  onViewPatient,
  onClearFilters,
  isLoading = false,
}: ReportTableProps) {
  const totalPages = Math.ceil(totalReportsCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = reports.slice(startIndex, startIndex + pageSize);

  const startRecordNum = totalReportsCount === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + pageSize, totalReportsCount);

  // Loading skeleton rows (Section 23)
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3.5 bg-slate-200 rounded w-1/4" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
            <div className="h-8 bg-slate-200 rounded-lg w-24" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state (Section 22)
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No reports found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try changing your filters or search terms to locate patient records.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-50/90 rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-200/70 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Report</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Summary</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedReports.map((report) => {
                const initials = report.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                const formattedDate = new Date(report.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={report.id}
                    className="hover:bg-sky-50/60 transition-colors group"
                  >
                    {/* 1. Patient */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onViewPatient(report.patientId)}
                          className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors cursor-pointer shadow-2xs"
                          title="View patient profile"
                        >
                          {initials}
                        </button>
                        <div>
                          <button
                            type="button"
                            onClick={() => onViewPatient(report.patientId)}
                            className="font-bold text-slate-900 hover:text-sky-700 text-left block transition-colors cursor-pointer"
                          >
                            {report.patientName}
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {report.patientId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Report */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[200px] flex items-center gap-1.5">
                        <span>{report.reportName}</span>
                        {report.isDemoReport && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Demo
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <ReviewStatusBadge reviewStatus={report.reviewStatus} />
                        {/* Models Checklist */}
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <span className="text-emerald-700 font-bold">GPT ✓</span>
                          <span className="text-amber-700 font-bold">Claude ✓</span>
                          <span className="text-sky-700 font-bold">Gemini ✓</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Category */}
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={report.category} />
                    </td>

                    {/* 4. Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {formattedDate}
                    </td>

                    {/* 5. Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* 6. AI Summary & Consensus */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-600 text-xs line-clamp-2 max-w-xs leading-relaxed">
                        {report.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span className="font-bold text-sky-700">
                          {report.providerAgreement || "3/3 Agree"}
                        </span>
                        <span>•</span>
                        <span className="text-amber-700 font-bold">
                          {report.doctorReviewItemsCount || 2} review points
                        </span>
                      </div>
                    </td>

                    {/* 7. Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewReport(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-100 hover:bg-sky-600 text-sky-800 hover:text-white transition-colors border border-sky-300 shadow-xs cursor-pointer"
                      >
                        <span>Open AI Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {paginatedReports.map((report) => {
          const initials = report.patientName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          const formattedDate = new Date(report.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={report.id}
              className="bg-slate-50/90 rounded-2xl border border-slate-300 p-4 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{report.patientName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{report.patientId}</span>
                  </div>
                </div>
                <StatusBadge status={report.status} />
              </div>

              <div>
                <h5 className="font-semibold text-slate-900 text-xs">{report.reportName}</h5>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryBadge category={report.category} />
                  <span className="text-[11px] text-slate-500">{formattedDate}</span>
                </div>
              </div>

              {/* Models checklist */}
              <div className="flex items-center gap-1 text-[10px] font-mono bg-slate-100 p-1.5 rounded border border-slate-200 text-slate-700">
                <span className="text-emerald-700 font-bold">GPT ✓</span>
                <span>•</span>
                <span className="text-amber-700 font-bold">Claude ✓</span>
                <span>•</span>
                <span className="text-sky-700 font-bold">Gemini ✓</span>
              </div>

              <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{report.summary}</p>

              <button
                type="button"
                onClick={() => onViewReport(report)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors"
              >
                <span>Open AI Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalReportsCount > pageSize && (
        <div className="bg-slate-100/90 px-4 py-3 rounded-2xl border border-slate-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900 font-bold">{startRecordNum}–{endRecordNum}</strong> of{" "}
            <strong className="text-slate-900 font-bold">{totalReportsCount}</strong> reports
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors text-slate-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === p
                    ? "bg-sky-600 text-white shadow-xs"
                    : "border border-slate-300 bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors text-slate-700"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
