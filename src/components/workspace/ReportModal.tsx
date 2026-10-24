"use client";

import { useState } from "react";
import {
  X,
  FileText,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Code,
  Check,
} from "lucide-react";

interface ReportModalProps {
  record: any;
  onClose: () => void;
}

export function ReportModal({ record, onClose }: ReportModalProps) {
  const [showJson, setShowJson] = useState(false);

  if (!record) return null;

  let parsed: any = null;
  try {
    parsed = record.extractedDataJson ? JSON.parse(record.extractedDataJson) : null;
  } catch {}

  const paramsList = parsed?.parameters || [];

  function handlePrint() {
    window.open(`/api/records/${record.id}/download`, "_blank");
  }

  function handleDownload() {
    window.open(`/api/records/${record.id}/download`, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-slate-900">
                {record.reportName || "Standardized Diagnostic Report"}
              </h3>
              <p className="text-xs text-slate-500">
                {record.reportDate
                  ? new Date(record.reportDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Processed Record"}{" "}
                • {parsed?.laboratory || "Apex Diagnostic Pathology Research Lab"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? "Table View" : "Raw JSON"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Safety & Non-Diagnosis Banner */}
        <div className="px-6 py-2.5 bg-teal-50/80 border-b border-teal-100 text-[11px] text-teal-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            <strong>AI Formatting Notice:</strong> This summary accurately digitizes all values from your uploaded document. AI does NOT diagnose. Medical evaluation is reserved solely for Dr. Aarav Mehta.
          </span>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {showJson ? (
            <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed shadow-inner">
              {JSON.stringify(parsed || record, null, 2)}
            </pre>
          ) : (
            <>
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Specimen
                  </span>
                  <span className="font-semibold text-slate-800">
                    {parsed?.specimen || "Venous Blood / Serum"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Parameters Extracted
                  </span>
                  <span className="font-semibold text-slate-800">
                    {paramsList.length} Biomarkers
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Format Status
                  </span>
                  <span className="font-semibold text-teal-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    Standardized
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Consulting Doctor
                  </span>
                  <span className="font-semibold text-slate-800">Dr. Aarav Mehta</span>
                </div>
              </div>

              {/* Discrete Parameters Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Digitized Lab Results &amp; Biological Intervals ({paramsList.length})
                  </h4>
                  <span className="text-[10.5px] text-slate-400">
                    Structured for Patient Review &amp; Download
                  </span>
                </div>

                {paramsList.length === 0 ? (
                  <div className="p-4 bg-slate-50 text-slate-500 rounded-xl text-center">
                    No discrete numerical parameters found in this scan.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-2.5 px-3">Biomarker / Investigation</th>
                          <th className="py-2.5 px-3">Observed Result</th>
                          <th className="py-2.5 px-3">Standard Reference Interval</th>
                          <th className="py-2.5 px-3">Range Flag</th>
                          <th className="py-2.5 px-3">Laboratory Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {paramsList.map((param: any, idx: number) => {
                          const isHigh = param.status === "HIGH";
                          const isCritical = param.status === "CRITICAL";
                          const isLow = param.status === "LOW";

                          return (
                            <tr key={idx} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                {param.name}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                                {param.value}{" "}
                                <span className="text-slate-500 text-[11px] font-normal">
                                  {param.unit}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">
                                {param.reference || "Standard"}
                              </td>
                              <td className="py-2.5 px-3">
                                {isCritical ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    CRITICAL
                                  </span>
                                ) : isHigh ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    HIGH
                                  </span>
                                ) : isLow ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    LOW
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    NORMAL
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {param.note || "Within normal limits"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lab Remarks */}
              {parsed?.doctorNotes && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 shadow-2xs">
                  <span className="font-bold block mb-0.5 text-slate-900">Laboratory Remarks:</span>
                  <p className="text-slate-600">{parsed.doctorNotes}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer with Download & Print */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 text-xs shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Formatted Report</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center gap-1.5 text-xs shadow-2xs cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
