"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  User,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  ChevronDown,
  Info,
  GitCompare,
  MessageSquare,
  History,
  FileCheck2,
  Activity,
} from "lucide-react";
import {
  PatientReport,
  ReportStatus,
  ReviewStatus,
} from "@/lib/data/reports-data";
import {
  AIProviderName,
  DoctorFindingReviewStatus,
} from "@/lib/types/report-analysis";
import { OriginalReportViewer } from "./OriginalReportViewer";
import { ThreeModelComparison } from "./ThreeModelComparison";
import { ConsensusPanel } from "./ConsensusPanel";
import { ClinicalConsiderations } from "./ClinicalConsiderations";
import { FindingsList } from "./FindingsList";
import { StatusBadge } from "./StatusBadge";
import { ReportFindingsFlowchart } from "./ReportFindingsFlowchart";
import { ModelConcordanceChart } from "./ModelConcordanceChart";
import { LandmarkMetricsGrid } from "./LandmarkMetricsGrid";

interface ReportAnalysisDetailModalProps {
  report: PatientReport | null;
  onClose: () => void;
  onToggleReview: (reportId: string) => void;
  onChangeStatus: (reportId: string, newStatus: ReportStatus) => void;
  onOpenPatientProfile: (patientId: string) => void;
  onSelectReportById?: (reportId: string) => void;
  onShowToast?: (message: string) => void;
}

export function ReportAnalysisDetailModal({
  report,
  onClose,
  onToggleReview,
  onChangeStatus,
  onOpenPatientProfile,
  onSelectReportById,
  onShowToast,
}: ReportAnalysisDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "analysis" | "comparison" | "longitudinal" | "notes_audit"
  >("analysis");
  const [analysisSubView, setAnalysisSubView] = useState<
    "flowchart" | "concordance" | "findings"
  >("flowchart");
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isRetryingProvider, setIsRetryingProvider] = useState<AIProviderName | null>(null);
  const [doctorNoteInput, setDoctorNoteInput] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Local state for doctor notes and findings updates during review session
  const [localReport, setLocalReport] = useState<PatientReport | null>(report);

  if (!report) return null;

  const currentReport = localReport || report;
  const analysis = currentReport.aiAnalysis;

  function handleSelectAnnotation(id: string | null) {
    setSelectedAnnotationId(id);
    if (id) {
      setActiveTab("analysis");
      setAnalysisSubView("findings");
    }
  }

  function handleUpdateFindingStatus(findingId: string, newStatus: DoctorFindingReviewStatus) {
    if (!currentReport.aiAnalysis) return;

    const updatedFindings = currentReport.aiAnalysis.findings.map((f) => {
      if (f.id === findingId) {
        return { ...f, doctorReviewStatus: newStatus };
      }
      return f;
    });

    const newAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Finding Review Status Updated",
      actor: "Dr. Aarav Mehta",
      details: `Finding "${findingId}" marked as "${newStatus}".`,
    };

    const updatedAnalysis = {
      ...currentReport.aiAnalysis,
      findings: updatedFindings,
      auditTrail: [newAuditEntry, ...currentReport.aiAnalysis.auditTrail],
    };

    setLocalReport({
      ...currentReport,
      aiAnalysis: updatedAnalysis,
    });

    onShowToast?.(`Finding updated to "${newStatus}"`);
  }

  function handleAddDoctorNote(e: React.FormEvent) {
    e.preventDefault();
    if (!doctorNoteInput.trim() || !currentReport.aiAnalysis) return;

    setIsSavingNote(true);

    const newNote = {
      id: `note-${Date.now()}`,
      author: "Dr. Aarav Mehta",
      timestamp: new Date().toISOString(),
      content: doctorNoteInput.trim(),
    };

    const newAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Clinical Review Note Added",
      actor: "Dr. Aarav Mehta",
      details: "Private clinician review note appended to report record.",
    };

    const updatedAnalysis = {
      ...currentReport.aiAnalysis,
      doctorNotes: [newNote, ...(currentReport.aiAnalysis.doctorNotes || [])],
      auditTrail: [newAuditEntry, ...currentReport.aiAnalysis.auditTrail],
    };

    setLocalReport({
      ...currentReport,
      aiAnalysis: updatedAnalysis,
    });

    setDoctorNoteInput("");
    setIsSavingNote(false);
    onShowToast?.("Clinical review note saved successfully.");
  }

  async function handleRetryProvider(provider: AIProviderName) {
    setIsRetryingProvider(provider);
    onShowToast?.(`Re-running ${provider.toUpperCase()} independent analysis...`);

    await new Promise((r) => setTimeout(r, 1200));

    if (currentReport.aiAnalysis?.providerAnalyses[provider]) {
      const updatedProviders = {
        ...currentReport.aiAnalysis.providerAnalyses,
        [provider]: {
          ...currentReport.aiAnalysis.providerAnalyses[provider],
          status: "complete" as const,
          timestamp: new Date().toISOString(),
        },
      };

      const updatedAudit = [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: `Provider ${provider.toUpperCase()} Re-analyzed`,
          actor: "Dr. Aarav Mehta",
          details: `Manual re-evaluation triggered for ${provider}.`,
        },
        ...currentReport.aiAnalysis.auditTrail,
      ];

      setLocalReport({
        ...currentReport,
        aiAnalysis: {
          ...currentReport.aiAnalysis,
          providerAnalyses: updatedProviders,
          auditTrail: updatedAudit,
        },
      });
    }

    setIsRetryingProvider(null);
    onShowToast?.(`${provider.toUpperCase()} analysis updated successfully.`);
  }

  function handleDownloadHtml() {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentReport.reportName} - CodeRx Clinical Export</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #0f172a; line-height: 1.5; }
            h1 { font-size: 24px; color: #1e293b; margin-bottom: 4px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
            .section { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; font-weight: 600; }
            .disclaimer { font-size: 11px; color: #64748b; margin-top: 32px; padding: 12px; background: #f1f5f9; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>${currentReport.reportName}</h1>
          <p><strong>Patient:</strong> ${currentReport.patientName} (${currentReport.patientId}) | <strong>Date:</strong> ${currentReport.date} | <strong>Referring:</strong> ${currentReport.referringPhysician}</p>
          <div class="badge">Category: ${currentReport.category}</div>
          <div class="section">
            <h3>Document Summary</h3>
            <p>${analysis?.documentSummary || currentReport.summary}</p>
          </div>
          <div class="section">
            <h3>Extracted Findings</h3>
            <table>
              <thead><tr><th>Parameter</th><th>Current</th><th>Previous</th><th>Status</th></tr></thead>
              <tbody>
                ${currentReport.findings
                  .map(
                    (f) =>
                      `<tr><td>${f.name}</td><td>${f.current} ${f.unit}</td><td>${f.previous} ${f.unit}</td><td>${f.status}</td></tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="disclaimer">
            <strong>Clinical Decision Support Notice:</strong> AI-assisted analysis is intended to support clinician review. It is not a confirmed diagnosis and should not replace professional clinical judgment.
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentReport.patientName.replace(/\s+/g, "_")}_${currentReport.id}_Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast?.("Report downloaded as printable HTML export.");
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast?.("Clinical report reference link copied to clipboard.");
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl max-w-7xl w-full h-[94vh] shadow-2xl border border-slate-300 flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Navigation & Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300 bg-slate-200 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>← Back to Reports</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-900 text-sm truncate">
                {currentReport.reportName}
              </span>
              {currentReport.isDemoReport && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/30 shrink-0">
                  Demo Report
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Share Clinical Reference"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadHtml}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Profile Bar & Status Switcher (Section 14 & 20) */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Patient Demographics */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {currentReport.patientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{currentReport.patientName}</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-semibold">
                  {currentReport.patientId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentReport.patientAge} yrs • {currentReport.patientGender} • Last Visit:{" "}
                {currentReport.patientLastVisit}
              </p>
            </div>
            <button
              onClick={() => onOpenPatientProfile(currentReport.patientId)}
              className="ml-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>View Patient Profile →</span>
            </button>
          </div>

          {/* Clinician Status & Review Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mark as Reviewed Toggle */}
            <button
              onClick={() => onToggleReview(currentReport.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                currentReport.reviewStatus === "reviewed"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{currentReport.reviewStatus === "reviewed" ? "Reviewed ✓" : "Mark as Reviewed"}</span>
            </button>

            {/* Change Status Dropdown */}
            <select
              value={currentReport.status}
              onChange={(e) => onChangeStatus(currentReport.id, e.target.value as ReportStatus)}
              className="text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="review_required">Status: Review Required</option>
              <option value="improve">Status: Improve</option>
              <option value="new_findings">Status: New Findings</option>
            </select>

            <StatusBadge status={currentReport.status} />
          </div>
        </div>

        {/* Clinical Decision Support Safety Notice (Section 37 & 53) */}
        <div className="px-6 py-2 bg-sky-50/70 border-b border-sky-100 text-[11px] text-sky-900 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Clinical Decision Support Tool: </strong>
              AI-assisted analysis is intended to support clinician review. It is not a confirmed diagnosis and should not replace professional clinical judgment.
            </span>
          </div>
          <span className="text-[10px] text-sky-700/80 font-mono hidden md:inline">
            Version 3.2.0 • Triple-Model Consensus
          </span>
        </div>

        {/* Tab Navigation for Detailed AI Views */}
        <div className="flex items-center gap-1 px-6 pt-2 border-b border-slate-300 bg-slate-200/90 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "analysis"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Report Analysis & Findings</span>
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "comparison"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Three-Model Comparison (GPT / Claude / Gemini)</span>
          </button>
          <button
            onClick={() => setActiveTab("longitudinal")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "longitudinal"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Compare With Previous Report</span>
          </button>
          <button
            onClick={() => setActiveTab("notes_audit")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "notes_audit"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Doctor Notes & Audit Log</span>
          </button>
        </div>

        {/* Two-Column Desktop Layout (Section 39) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT COLUMN: Original Report Viewer (Section 4 & 15) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-300 p-4 bg-slate-900/95 overflow-hidden flex flex-col">
            <OriginalReportViewer
              sourceFiles={
                currentReport.sourceFiles || [
                  {
                    id: "default-doc",
                    name: currentReport.reportName,
                    url: "/images/demo-asthma-xray.png",
                    type: "image/png",
                    size: 287959,
                    uploadDate: currentReport.uploadedDate,
                    isImage: true,
                  },
                ]
              }
              visualAnnotations={analysis?.visualAnnotations || []}
              selectedAnnotationId={selectedAnnotationId}
              onSelectAnnotation={handleSelectAnnotation}
              isDemoReport={currentReport.isDemoReport}
            />
          </div>

          {/* RIGHT COLUMN: AI Analysis & Multi-Model Views */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6 bg-slate-100/70">
            {/* TAB 1: AI Analysis & Findings */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                {/* Ultra-Concise Executive Finding Bar (No Diagnosis, 1-Click Digest) */}
                <div className="bg-white rounded-xl border border-slate-300 p-3.5 shadow-2xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Objective Finding Digest
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        • Triple-AI Cross-Check
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Assistive Tool • Physician Diagnoses
                    </span>
                  </div>

                  {/* 4 Compact Metric Badges in 1 Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 font-semibold">Lung Volume</span>
                      <span className="text-xs font-bold text-amber-950">+38% Hyperinflated</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 font-semibold">Diaphragm</span>
                      <span className="text-xs font-bold text-amber-950">Flattened (&lt;10th Rib)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-800 font-semibold">Heart CTR</span>
                      <span className="text-xs font-bold text-emerald-950">0.42 (Normal)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-sky-50/70 border border-sky-200 flex items-center justify-between">
                      <span className="text-[10px] text-sky-800 font-semibold">Annotation Flag</span>
                      <span className="text-xs font-bold text-sky-950">1 Review Needed</span>
                    </div>
                  </div>

                  {/* 1-sentence concise takeaway */}
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-900">Takeaway: </strong>
                    Bilateral hyperinflation &amp; flattened diaphragms observed. CTR normal (0.42), no consolidation. &lsquo;Fluid-Fluid Level&rsquo; label flagged for clinician confirmation.
                  </p>
                </div>

                {/* Concise Sub-View Switcher (Prevents endless scrolling) */}
                <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl border border-slate-300 text-xs font-bold">
                  <button
                    onClick={() => setAnalysisSubView("flowchart")}
                    className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      analysisSubView === "flowchart"
                        ? "bg-white text-sky-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Flowchart &amp; Landmarks</span>
                  </button>
                  <button
                    onClick={() => setAnalysisSubView("concordance")}
                    className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      analysisSubView === "concordance"
                        ? "bg-white text-sky-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Concordance &amp; Disagreements</span>
                  </button>
                  <button
                    onClick={() => setAnalysisSubView("findings")}
                    className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      analysisSubView === "findings"
                        ? "bg-white text-sky-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Detailed Findings &amp; Evidence</span>
                  </button>
                </div>

                {/* Sub-View 1: Flowchart & Landmarks */}
                {analysisSubView === "flowchart" && (
                  <div className="space-y-4">
                    <ReportFindingsFlowchart />
                    <LandmarkMetricsGrid />
                  </div>
                )}

                {/* Sub-View 2: Model Concordance & Disagreements */}
                {analysisSubView === "concordance" && (
                  <div className="space-y-4">
                    <ModelConcordanceChart />
                    {analysis && (
                      <ConsensusPanel
                        findings={analysis.findings}
                        disagreements={analysis.disagreements}
                      />
                    )}
                  </div>
                )}

                {/* Sub-View 3: Detailed Traceable Findings & Considerations */}
                {analysisSubView === "findings" && (
                  <div className="space-y-4">
                    {analysis?.possibleDiagnoses && (
                      <ClinicalConsiderations considerations={analysis.possibleDiagnoses} />
                    )}
                    {analysis?.findings && (
                      <FindingsList
                        findings={analysis.findings}
                        selectedAnnotationId={selectedAnnotationId}
                        onUpdateFindingStatus={handleUpdateFindingStatus}
                      />
                    )}
                  </div>
                )}

                {/* Physician Review Points Checklist (Section 11 L) */}
                {analysis?.physicianReviewPoints && analysis.physicianReviewPoints.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Physician Review Checkpoints</span>
                    </h5>
                    <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                      {analysis.physicianReviewPoints.map((pt, idx) => (
                        <li key={idx} className="text-[11px]">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Three-Model Comparison (Section 16) */}
            {activeTab === "comparison" && analysis && (
              <div className="space-y-6">
                <ThreeModelComparison
                  providerAnalyses={analysis.providerAnalyses}
                  onRetryProvider={handleRetryProvider}
                  isRetryingProvider={isRetryingProvider}
                />
              </div>
            )}

            {/* TAB 3: Longitudinal Multi-Report Comparison (Section 27) */}
            {activeTab === "longitudinal" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <History className="w-4 h-4 text-sky-600" />
                        <span>Longitudinal Parameter Comparison</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Comparing current report ({currentReport.date}) vs prior baseline (
                        {analysis?.comparisonWithPrevious?.previousDate || "2026-06-15"}).
                      </p>
                    </div>
                  </div>

                  {/* Comparative Parameters Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-y border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Parameter</th>
                          <th className="py-2.5 px-3">Baseline</th>
                          <th className="py-2.5 px-3">Current</th>
                          <th className="py-2.5 px-3">Trajectory</th>
                          <th className="py-2.5 px-3">Observation Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(
                          analysis?.comparisonWithPrevious?.parameters ||
                          currentReport.findings.map((f) => ({
                            name: f.name,
                            previous: `${f.previous} ${f.unit}`,
                            current: `${f.current} ${f.unit}`,
                            changeStatus:
                              f.status === "NORMAL"
                                ? "Stable"
                                : f.status === "HIGH"
                                ? "Worsened"
                                : "Improved",
                            note: f.clinicalNote || "Compared with prior reading",
                          }))
                        ).map((param: any, idx: number) => {
                          const statusColor =
                            param.changeStatus === "Worsened"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : param.changeStatus === "Improved"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200";

                          return (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{param.name}</td>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{param.previous}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                                {param.current}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}
                                >
                                  {param.changeStatus}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 text-[11px]">{param.note}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Doctor Notes & Audit Log (Sections 30 & 31) */}
            {activeTab === "notes_audit" && (
              <div className="space-y-6">
                {/* Doctor Clinical Review Notes (Section 30) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-sky-600" />
                        <span>Private Clinical Review Notes</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Confidential to attending physician and clinical care team.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddDoctorNote} className="space-y-3">
                    <textarea
                      rows={3}
                      value={doctorNoteInput}
                      onChange={(e) => setDoctorNoteInput(e.target.value)}
                      placeholder="Add physician assessment, clinical correlation, or plan notes..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!doctorNoteInput.trim() || isSavingNote}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-colors"
                      >
                        {isSavingNote ? "Saving Note..." : "Save Clinical Note"}
                      </button>
                    </div>
                  </form>

                  {/* List of Previous Notes */}
                  {analysis?.doctorNotes && analysis.doctorNotes.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 block">Saved Notes:</span>
                      {analysis.doctorNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <strong>{note.author}</strong>
                            <span>{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-800 text-[11px] leading-relaxed">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes added yet for this report.</p>
                  )}
                </div>

                {/* Audit Trail Log (Section 31) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <History className="w-4 h-4 text-sky-600" />
                        <span>Report Audit Trail & Timeline</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Immutable record of uploads, model analyses, and physician actions.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(analysis?.auditTrail || []).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">{entry.action}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{entry.details}</p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">By {entry.actor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
