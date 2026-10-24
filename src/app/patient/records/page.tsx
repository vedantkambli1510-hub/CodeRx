"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Eye,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Paperclip,
  ShieldCheck,
  Check,
  Info,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { ReportModal } from "@/components/workspace/ReportModal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PatientUploadModal } from "@/components/reports/PatientUploadModal";

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<any | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch("/api/patient/records");
      const data = await res.json();
      if (res.ok) {
        setRecords(data.records || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handlePrintRecord(rec: any) {
    const printWindow = window.open(`/api/records/${rec.id}/download`, "_blank");
    if (printWindow) {
      printWindow.focus();
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading your medical documents..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-['Quicksand',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D6EDE1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#059669]" />
            <span>Medical Records &amp; Uploads</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload your laboratory tests, blood panels, and prescriptions for automated AI data extraction and standardized formatting.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-sm cursor-pointer transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Medical Report</span>
          </button>
        </div>
      </div>

      {/* SECURITY & DATA PROTECTION PROTOCOL GUARANTEE */}
      <div className="rounded-3xl border border-[#BCE8D0] bg-gradient-to-r from-[#EAF7F0] via-white to-[#F2FAF5] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">
                Encrypted Data Protection &amp; Confidentiality Guarantee
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#D1F2E2] text-[#064E3B] border border-[#8FE3B8]">
                AES-256 Bit E2E
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Strictly confidential between you and Dr. Aarav Mehta. Every report upload requires explicit informed consent before processing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="text-xs font-bold text-[#064E3B] hover:text-[#047857] hover:underline flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-xl border border-[#8FE3B8] bg-white shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-[#059669]" />
            <span>Privacy Charter</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] transition-all cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Report</span>
          </button>
        </div>
      </div>

      {/* AI STANDARDIZED REPORT FORMATTER NOTICE (NO AUTONOMOUS DIAGNOSIS) */}
      <div className="p-4 rounded-3xl bg-[#EAF7F0]/80 border border-[#BCE8D0] text-[#064E3B] text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#059669] mt-0.5 shrink-0" />
        <div className="space-y-1">
          <span className="font-bold text-[#064E3B] block">
            AI Report Digitizer &amp; Standardized Formatter:
          </span>
          <p className="text-[#134E39] leading-relaxed font-medium">
            When you upload any lab report, CodeRx AI extracts and organizes all test numbers, reference intervals, and dates into a clean, standardized format so you can easily review and download it. <strong>AI does not perform diagnosis;</strong> clinical diagnosis and medical decision-making remain strictly with your consulting doctor.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Records Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {records.length === 0 ? (
          <div className="text-center py-12 p-6 text-slate-500 text-xs space-y-2">
            <Paperclip className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-800">No medical records uploaded yet</p>
            <p className="text-slate-500">
              Upload your past blood tests, prescriptions, or imaging scans to generate your formatted report.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="px-5 py-3.5">Document Details</th>
                  <th className="px-5 py-3.5">Report Date</th>
                  <th className="px-5 py-3.5">File Size</th>
                  <th className="px-5 py-3.5">Formatting Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] text-[#064E3B] font-bold flex items-center justify-center shrink-0 border border-[#BCE8D0]">
                          PDF
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                            {rec.reportName || rec.originalName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {rec.originalName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {rec.reportDate
                        ? new Date(rec.reportDate).toLocaleDateString()
                        : new Date(rec.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-slate-500 font-mono">
                      {(rec.size / 1024).toFixed(1)} KB
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7F0] text-[#064E3B] border border-[#BCE8D0]">
                        <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                        AI Formatted &amp; Digitized
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* View Formatted Report */}
                        <button
                          type="button"
                          onClick={() => setSelectedRecordForModal(rec)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#064E3B] bg-[#EAF7F0] hover:bg-[#059669] hover:text-white border border-[#BCE8D0] transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Formatted Report</span>
                        </button>

                        {/* Print Action */}
                        <button
                          type="button"
                          onClick={() => handlePrintRecord(rec)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                          title="Print formatted diagnostic report"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>Print</span>
                        </button>

                        {/* Download Formatted Document */}
                        <a
                          href={`/api/records/${rec.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-2xs"
                          title="Download standardized report"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>Download</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRIVACY CHARTER MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Patient Confidentiality Charter
                  </h3>
                  <p className="text-xs text-slate-500">CodeRx Healthcare Privacy Commitment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950">
                <strong className="block mb-1 text-teal-900">1. Strict Doctor-Patient Isolation:</strong>
                Reports uploaded by you are accessible solely to your assigned consulting clinician (Dr. Aarav Mehta) and your authenticated account.
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="block mb-1 text-slate-900">2. Zero Data Commercialization:</strong>
                Your diagnostic reports, lab parameters, and personal identifiers will never be sold, leased, or transmitted to pharmaceutical companies, insurance companies, or third-party ad brokers.
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="block mb-1 text-slate-900">3. Cryptographic Storage:</strong>
                All PDFs, scan images, and discrete biomarker tables are encrypted in transit with TLS 1.3 and at rest with AES-256 GCM.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all cursor-pointer shadow-xs"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRecordForModal && (
        <ReportModal
          record={selectedRecordForModal}
          onClose={() => setSelectedRecordForModal(null)}
        />
      )}

      {/* Upload Medical Report Modal - Enforces Mandatory Consent Form on every upload */}
      <PatientUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onReportCreated={() => {
          fetchRecords();
          setSuccess("Medical report uploaded, digitized and formatted successfully.");
        }}
      />
    </div>
  );
}
