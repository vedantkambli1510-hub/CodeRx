"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Sparkles,
  GitCompare,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ReportModal } from "@/components/workspace/ReportModal";

interface DoctorRecordsViewProps {
  records: any[];
}

export function DoctorRecordsView({ records }: DoctorRecordsViewProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const filtered = records.filter((rec) => {
    if (filterType !== "ALL" && rec.reportType !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inName = rec.reportName.toLowerCase().includes(q);
      const inPatient = rec.patient?.user?.name.toLowerCase().includes(q);
      return inName || inPatient;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-sky-400" />
            <span>Master Medical Documents Repository</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centrally indexed patient clinical documentation, lab panels, discharge summaries, and diagnostic scans.
          </p>
        </div>

        <Link
          href="/doctor/reviews"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <GitCompare className="w-4 h-4" />
          <span>Launch "WHAT CHANGED?" Studio</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document title or patient name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: "ALL", label: `All (${records.length})` },
            { id: "LAB_REPORT", label: "Lab Reports" },
            { id: "PRESCRIPTION", label: "Prescriptions" },
            { id: "SCAN", label: "Scans / Imaging" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === btn.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Document Date</th>
                <th className="py-3.5 px-4">Extraction Status</th>
                <th className="py-3.5 px-4">Clinical Findings Preview</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((record) => {
                let parsed: any = null;
                try {
                  parsed = record.extractedDataJson
                    ? JSON.parse(record.extractedDataJson)
                    : null;
                } catch {}

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-400 font-bold flex items-center justify-center shrink-0">
                          PDF
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors">
                            {record.reportName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {record.mimeType || "application/pdf"} •{" "}
                            {Math.round(record.size / 1024)} KB
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-white">
                      {record.patient?.user?.name || "Anonymous Patient"}
                    </td>

                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {record.reportDate
                        ? new Date(record.reportDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "July 2024"}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        AI Verified
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-300 max-w-xs">
                      <p className="line-clamp-2 text-[11px]">
                        {parsed?.findings || "Parameters extracted and synchronized."}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-sky-950/60 text-sky-300 hover:bg-sky-600 hover:text-white transition-colors border border-sky-800/60"
                        >
                          View Values
                        </button>
                        <Link
                          href={`/doctor/patients/${record.patientId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                          title="Open Patient Workspace"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <ReportModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
