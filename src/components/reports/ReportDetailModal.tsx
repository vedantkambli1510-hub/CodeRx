"use client";

import { useState } from "react";
import {
  X,
  User,
  Calendar,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  FileText,
  FileCheck2,
} from "lucide-react";
import { PatientReport, ReportStatus, INITIAL_REPORTS } from "@/lib/data/reports-data";
import { StatusBadge, ReviewStatusBadge, CategoryBadge } from "./StatusBadge";

interface ReportDetailModalProps {
  report: PatientReport;
  onClose: () => void;
  onToggleReview: (reportId: string) => void;
  onChangeStatus: (reportId: string, newStatus: ReportStatus) => void;
  onViewPatient: (patientId: string) => void;
  onSelectReportById: (reportId: string) => void;
  onShowToast: (message: string) => void;
}

export function ReportDetailModal({
  report,
  onClose,
  onToggleReview,
  onChangeStatus,
  onViewPatient,
  onSelectReportById,
  onShowToast,
}: ReportDetailModalProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  if (!report) return null;

  // Patient's historical reports timeline (Section 18)
  const patientHistoryReports = INITIAL_REPORTS.filter(
    (r) => r.patientId === report.patientId
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Real report download generator (Section 21)
  function handleDownloadReport() {
    if (!report) return;
    const formattedDate = new Date(report.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const findingsHtml = report.findings
      .map(
        (f) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${f.name}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${f.current} ${f.unit}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${f.previous} ${f.unit}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-transform: uppercase;">${f.trend}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${f.reference}</td>
        </tr>
      `
      )
      .join("");

    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${report.reportName} - ${report.patientName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 40px; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { text-align: left; background: #f8fafc; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #64748b; }
          .summary-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .disclaimer { margin-top: 32px; font-size: 11px; color: #94a3b8; font-style: italic; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin: 0; font-size: 22px; color: #0f172a;">${report.reportName}</h1>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">CodeRx Clinical Healthcare Operating System</p>
          </div>
          <div style="text-align: right;">
            <span class="badge">${report.category}</span>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b;">Report Date: <strong>${formattedDate}</strong></p>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 16px; border-radius: 12px; margin-bottom: 20px; display: flex; gap: 24px; font-size: 13px;">
          <div><strong>Patient:</strong> ${report.patientName} (${report.patientId})</div>
          <div><strong>Age / Gender:</strong> ${report.patientAge} yrs / ${report.patientGender}</div>
          <div><strong>Physician:</strong> ${report.referringPhysician}</div>
          <div><strong>Status:</strong> ${report.status.toUpperCase()}</div>
        </div>

        <h3>AI & Clinical Summary</h3>
        <div class="summary-box">
          <p style="margin: 0; line-height: 1.6; font-size: 13px;">${report.summary}</p>
          ${report.impressions ? `<p style="margin: 8px 0 0 0; font-size: 13px; font-weight: 600;">Impression: ${report.impressions}</p>` : ""}
        </div>

        <h3>Key Structured Findings</h3>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Current Result</th>
              <th>Previous Result</th>
              <th>Observed Trend</th>
              <th>Reference Range</th>
            </tr>
          </thead>
          <tbody>
            ${findingsHtml}
          </tbody>
        </table>

        <div class="disclaimer">
          Notice: AI-assisted clinical summary generated for informational decision support. Must be verified with original laboratory instrumentation logs and qualified healthcare practitioner judgment.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.patientId}_${report.reportName.replace(/\s+/g, "_")}_${report.date}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast("Report downloaded successfully as printable clinical document");
  }

  function handleShareReport() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/doctor/reports?reportId=${report?.id}`
      );
      onShowToast("Secure report link copied to clipboard");
    } else {
      onShowToast("Report link ready to share");
    }
  }

  const formattedDate = new Date(report.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Top Control Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareReport}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Share report link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownloadReport}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Download report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Patient Header (Section 14) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                {report.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{report.patientName}</h3>
                  <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {report.patientId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                  <span>{report.patientAge} yrs</span>
                  <span>•</span>
                  <span>{report.patientGender}</span>
                  <span>•</span>
                  <span>Last Visit: {report.patientLastVisit}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewPatient(report.patientId);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 transition-colors shrink-0 shadow-2xs"
            >
              View Patient Profile →
            </button>
          </div>

          {/* Report Detail Header (Section 15) */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {report.reportName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <CategoryBadge category={report.category} />
                  <span>•</span>
                  <span>Report Date: <strong className="text-slate-800">{formattedDate}</strong></span>
                  <span>•</span>
                  <span>Referring: <strong className="text-slate-800">{report.referringPhysician}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={report.status} />
              </div>
            </div>

            {/* Actions Strip: Mark as Reviewed & Change Status (Sections 19 & 20) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* Doctor Review Toggle Action */}
              <button
                type="button"
                onClick={() => onToggleReview(report.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  report.reviewStatus === "reviewed"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {report.reviewStatus === "reviewed"
                    ? "✓ Marked as Reviewed"
                    : "Mark as Reviewed"}
                </span>
              </button>

              {/* Change Classification Status Dropdown (Section 20) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-2xs"
                >
                  <span>Change Status</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-20 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeStatus(report.id, "review_required");
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Review Required</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeStatus(report.id, "improve");
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-emerald-50 text-emerald-900 font-semibold flex items-center gap-2"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Improve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeStatus(report.id, "new_findings");
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-blue-50 text-blue-900 font-semibold flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>New Findings</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Download Action Button (Section 21) */}
              <button
                type="button"
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-2xs ml-auto"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* AI / Clinical Summary (Section 16) */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI / Clinical Summary</span>
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {report.summary}
            </p>
            {report.impressions && (
              <p className="text-xs text-blue-950 pt-2 border-t border-blue-200/60 leading-relaxed">
                <strong>Impression:</strong> {report.impressions}
              </p>
            )}
            <p className="text-[10px] text-slate-400 italic pt-1">
              * AI clinical summary for observational assistance. Confirm findings with original lab instrumentation and clinical judgment.
            </p>
          </div>

          {/* Key Findings Section (Section 17) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Key Structured Findings</h4>

            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-2.5 px-3.5">Parameter</th>
                    <th className="py-2.5 px-3.5">Current</th>
                    <th className="py-2.5 px-3.5">Previous</th>
                    <th className="py-2.5 px-3.5">Trend</th>
                    <th className="py-2.5 px-3.5">Reference Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.findings.map((item, idx) => {
                    const isAlert = item.status === "CRITICAL" || item.status === "HIGH" || item.status === "LOW";

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          {item.clinicalNote && (
                            <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                              {item.clinicalNote}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className={`font-mono font-bold ${isAlert ? "text-amber-800" : "text-slate-900"}`}>
                            {item.current} {item.unit}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-slate-500 font-mono">
                          {item.previous} {item.unit}
                        </td>

                        <td className="py-3 px-3.5">
                          {item.trend === "decreased" && (
                            <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                              <TrendingDown className="w-3 h-3" /> Decreased
                            </span>
                          )}
                          {item.trend === "improved" && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              <TrendingUp className="w-3 h-3" /> Improved
                            </span>
                          )}
                          {item.trend === "increased" && (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                              <TrendingUp className="w-3 h-3" /> Increased
                            </span>
                          )}
                          {item.trend === "stable" && (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              <Minus className="w-3 h-3" /> Stable
                            </span>
                          )}
                          {item.trend === "new" && (
                            <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                              <Sparkles className="w-3 h-3" /> New
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-slate-500 font-mono text-[11px]">
                          {item.reference}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Report History Timeline (Section 18) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">
              Patient Report History ({patientHistoryReports.length})
            </h4>

            <div className="space-y-2">
              {patientHistoryReports.map((hist) => {
                const isCurrent = hist.id === report.id;
                const histDate = new Date(hist.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={hist.id}
                    onClick={() => {
                      if (!isCurrent) onSelectReportById(hist.id);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isCurrent
                        ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-500/20"
                        : "bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{hist.reportName}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {histDate} • {hist.category}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={hist.status} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
