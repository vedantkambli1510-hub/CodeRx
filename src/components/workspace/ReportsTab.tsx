"use client";

import { useState } from "react";
import {
  FileText,
  Calendar,
  Sparkles,
  GitCompare,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
} from "lucide-react";

interface ReportsTabProps {
  records: any[];
  onSelectTab: (tabKey: string) => void;
  onOpenReportModal: (record: any) => void;
}

export function ReportsTab({
  records,
  onSelectTab,
  onOpenReportModal,
}: ReportsTabProps) {
  const [search, setSearch] = useState("");

  const filteredRecords = records.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.reportName.toLowerCase().includes(q) ||
      (r.originalName && r.originalName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header and Actions (Section 13) */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>Diagnostic & Laboratory Records Repository</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Multimodal optical & digital records processed into structured clinical parameters with reference validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab("what-changed")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <GitCompare className="w-4 h-4" />
            <span>Launch "WHAT CHANGED?" Comparison</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((record) => {
          let parsed: any = null;
          try {
            parsed = record.extractedDataJson ? JSON.parse(record.extractedDataJson) : null;
          } catch {}

          const paramsList = parsed?.parameters || [];
          const highCount = paramsList.filter(
            (p: any) => p.status === "HIGH" || p.status === "CRITICAL"
          ).length;

          return (
            <div
              key={record.id}
              className="bg-slate-100/95 rounded-2xl border border-slate-300 p-5 shadow-sm hover:border-slate-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
                      PDF
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{record.reportName}</h3>
                      <span className="text-[11px] text-slate-500">
                        {record.reportDate
                          ? new Date(record.reportDate).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Record Date Unspecified"}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    AI Parsed
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Laboratory / Source:</span>
                    <span className="font-semibold text-slate-800">
                      {parsed?.laboratory || "Apex Diagnostic Center"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Total Assayed Parameters:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {paramsList.length}
                    </span>
                  </div>

                  {highCount > 0 && (
                    <div className="flex items-center justify-between text-rose-700 font-semibold">
                      <span>Parameters Outside Reference:</span>
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                        {highCount} flagged
                      </span>
                    </div>
                  )}

                  {parsed?.findings && (
                    <p className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-300 line-clamp-2 shadow-2xs">
                      <strong className="text-sky-700">AI Summary:</strong> {parsed.findings}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-300">
                <button
                  onClick={() => onOpenReportModal(record)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-100 hover:bg-sky-600 text-sky-800 hover:text-white transition-colors border border-sky-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Extracted Data</span>
                </button>

                <button
                  onClick={() => onSelectTab("what-changed")}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
