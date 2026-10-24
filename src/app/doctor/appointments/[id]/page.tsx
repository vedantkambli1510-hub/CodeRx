"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  AlertTriangle,
  FileText,
  Printer,
  CheckCircle2,
  Download,
  Paperclip,
  ChevronLeft,
  RefreshCw,
  Eye,
  ShieldCheck,
  Save,
  HelpCircle,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ClinicalReport } from "@/lib/validation/report";

export default function DoctorReportViewPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Raw responses modal state
  const [showRawResponses, setShowRawResponses] = useState(false);

  // Doctor note state
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  // Status updates
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [retryingAI, setRetryingAI] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  async function loadAppointment() {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load consultation");

      setAppointment(data.appointment);
      if (data.appointment.doctorNotes?.[0]) {
        setNoteContent(data.appointment.doctorNotes[0].content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading details");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveNote() {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    setNoteSuccess(false);

    try {
      const res = await fetch("/api/doctor/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          content: noteContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save note");

      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
      await loadAppointment();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving note");
    } finally {
      setSavingNote(false);
    }
  }

  async function handleMarkReviewed() {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_REVIEWED" }),
      });
      if (!res.ok) throw new Error("Failed to mark report reviewed");
      await loadAppointment();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating report");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleMarkCompleted() {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_COMPLETED" }),
      });
      if (!res.ok) throw new Error("Failed to mark appointment completed");
      await loadAppointment();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error completing appointment");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleRetryReport() {
    setRetryingAI(true);
    setRetryMessage(null);
    try {
      const res = await fetch(`/api/intake/${appointmentId}/retry-report`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      if (data.reportStatus === "FAILED") {
        throw new Error(data.reviewReason || "AI report generation failed");
      }

      setRetryMessage("Report generated successfully!");
      await loadAppointment();
    } catch (err) {
      setRetryMessage(err instanceof Error ? err.message : "Report generation failed");
    } finally {
      setRetryingAI(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading clinical intake report..." size="lg" />;
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Appointment not found.</p>
        <Link href="/doctor" className="text-brand-600 hover:underline text-sm font-semibold mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const patient = appointment.patient;
  const session = appointment.intakeSession;
  const rawAnswers = session?.answers || [];
  const aiReport = appointment.aiReport;

  // Parse structured report if available
  let structuredReport: ClinicalReport | null = null;
  let reportParseError: string | null = null;

  if (aiReport?.structuredReportJson) {
    try {
      const parsed = JSON.parse(aiReport.structuredReportJson);
      if (parsed.mainReasonForVisit) {
        structuredReport = parsed as ClinicalReport;
      } else if (parsed.error) {
        reportParseError = parsed.error;
      }
    } catch {
      reportParseError = "Error parsing AI structured report.";
    }
  }

  const isReviewed = Boolean(aiReport?.reviewedAt);
  const isCompleted = appointment.status === "COMPLETED";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/doctor/appointments" className="hover:text-brand-600 flex items-center gap-1 font-medium">
            <ChevronLeft className="w-4 h-4" />
            <span>Consultations</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Pre-Visit Clinical Intake Report</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>

          {/* Mark Reviewed Button */}
          {aiReport && !isReviewed && (
            <button
              onClick={handleMarkReviewed}
              disabled={updatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-tealbrand-800 bg-tealbrand-50 hover:bg-tealbrand-100 border border-tealbrand-300 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-tealbrand-600" />
              <span>Mark Report Reviewed</span>
            </button>
          )}

          {/* Mark Completed Button */}
          {!isCompleted && (
            <button
              onClick={handleMarkCompleted}
              disabled={updatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Mark Consult Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient & Consultation Overview Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 report-container">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{patient.user.name}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                AI-Assisted Intake
              </span>
              {aiReport?.needsReview && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  Needs Review
                </span>
              )}
              {isReviewed && <StatusBadge status="REVIEWED" type="report" />}
              <StatusBadge status={appointment.status} type="appointment" />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
              <span>
                <strong>DOB / Age:</strong> {patient.dob || "Not specified"}
              </span>
              <span>•</span>
              <span>
                <strong>Gender:</strong> {patient.gender || "Voluntarily unstated"}
              </span>
              <span>•</span>
              <span>
                <strong>Phone:</strong> {patient.phone || "Not provided"}
              </span>
              <span>•</span>
              <span>
                <strong>Blood Group:</strong> {patient.bloodGroup || "Unknown"}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-right space-y-1 sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
            <div>
              <strong>Consultation:</strong>{" "}
              {new Date(appointment.slot.startTime).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {new Date(appointment.slot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>
              <strong>Intake Status:</strong> {session?.status || "NOT_STARTED"}
            </div>
            {aiReport?.generatedAt && (
              <div className="text-[11px] text-slate-400">
                AI Summary Model: {aiReport.modelUsed} ({new Date(aiReport.generatedAt).toLocaleTimeString()})
              </div>
            )}
          </div>
        </div>

        {/* Clinician Attention / Needs Review Alert Banner */}
        {aiReport?.needsReview && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Flagged for Clinician Attention (Non-Diagnostic Flag)</span>
            </div>
            <p className="leading-relaxed text-amber-900">
              {aiReport.reviewReason || "Patient responses contain symptoms or statements that warrant prompt clinician review."}
            </p>
          </div>
        )}

        {/* View Raw Responses Quick Button */}
        <div className="flex items-center justify-between pt-1 no-print">
          <p className="text-xs text-slate-500 italic">
            This pre-visit intake is scannable within ~1 minute. Review directly with patient.
          </p>
          <button
            onClick={() => setShowRawResponses(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Raw Patient Answers ({rawAnswers.length})</span>
          </button>
        </div>
      </div>

      {/* Main Clinical Intake Report */}
      {structuredReport ? (
        <div className="space-y-6 report-container">
          {/* 1. Main Reason & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Main Reason for Visit
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {structuredReport.mainReasonForVisit}
              </p>

              {structuredReport.symptoms.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Reported Symptoms:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {structuredReport.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Symptom Timeline
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Onset:</span>
                  <span className="text-slate-900 font-medium">{structuredReport.timeline.onset}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Duration:</span>
                  <span className="text-slate-900 font-medium">{structuredReport.timeline.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Progression:</span>
                  <span className="text-slate-900 font-medium">{structuredReport.timeline.progression}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Severity, Pain & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Body Location
              </span>
              <p className="text-sm font-semibold text-slate-900">{structuredReport.location}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Patient-Reported Severity
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-brand-700">
                  {structuredReport.severity}
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 10 Scale</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pain Assessment
              </span>
              <div className="text-xs space-y-1">
                <p>
                  <strong>Present:</strong> {structuredReport.pain.present ? "Yes" : "No"}
                </p>
                {structuredReport.pain.present && (
                  <>
                    <p>
                      <strong>Rating:</strong> {structuredReport.pain.rating ?? "Unstated"} / 10
                    </p>
                    <p>
                      <strong>Character:</strong> {structuredReport.pain.character.join(", ") || "Not specified"}
                    </p>
                    <p>
                      <strong>Pattern:</strong> {structuredReport.pain.pattern}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. Clinical Factors, Associated Symptoms, Treatments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Aggravating / Relieving
              </span>
              <div className="text-xs space-y-1 text-slate-700">
                <p>
                  <strong>Makes it worse:</strong> {structuredReport.aggravatingFactors.join(", ") || "None noticed"}
                </p>
                <p>
                  <strong>Makes it better:</strong> {structuredReport.relievingFactors.join(", ") || "Nothing noticed"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Associated Symptoms
              </span>
              <p className="text-xs text-slate-800">
                {structuredReport.associatedSymptoms.length > 0
                  ? structuredReport.associatedSymptoms.join(", ")
                  : "None reported"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Treatments Already Tried
              </span>
              <p className="text-xs text-slate-800">
                {structuredReport.treatmentsTried.length > 0
                  ? structuredReport.treatmentsTried.join("; ")
                  : "None reported"}
              </p>
            </div>
          </div>

          {/* 4. Medical History, Medications, Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ongoing Medical Conditions
              </span>
              <p className="text-xs text-slate-800">
                {structuredReport.medicalHistory.length > 0
                  ? structuredReport.medicalHistory.join(", ")
                  : "None reported"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Current Medications
              </span>
              <p className="text-xs text-slate-800">
                {structuredReport.medications.length > 0
                  ? structuredReport.medications.join(", ")
                  : "None reported"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Known Allergies
              </span>
              <p className="text-xs text-rose-700 font-semibold">
                {structuredReport.allergies.length > 0
                  ? structuredReport.allergies.join(", ")
                  : "No known allergies"}
              </p>
            </div>
          </div>

          {/* 5. Patient Goals & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Patient&apos;s Main Concern & Goal
              </span>
              <p className="text-xs text-slate-800">
                <strong>Concern:</strong> {structuredReport.patientConcern}
              </p>
              <p className="text-xs text-slate-800">
                <strong>Consultation Goal:</strong> {structuredReport.consultationGoal}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Functional Daily Impact
              </span>
              <p className="text-xs text-slate-800">{structuredReport.dailyImpact}</p>
            </div>
          </div>

          {/* 6. Clinician Clarification & Attention Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clinician Attention Items */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Information Requiring Clinician Attention</span>
              </div>
              <p className="text-xs text-slate-600">
                Explicitly reported items surfaced for review. (Non-diagnostic).
              </p>
              {structuredReport.clinicianAttentionItems.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1 text-xs text-amber-950 font-medium">
                  {structuredReport.clinicianAttentionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No urgent safety flags detected.</p>
              )}
            </div>

            {/* Suggested Doctor Follow-Up Questions */}
            <div className="rounded-2xl border border-tealbrand-200 bg-tealbrand-50/40 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-tealbrand-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-tealbrand-700" />
                <span>Suggested Clarifying Questions for Consultation</span>
              </div>
              <p className="text-xs text-slate-600">
                Targeted questions for the clinician to consider asking the patient:
              </p>
              {structuredReport.doctorFollowUpQuestions.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-800">
                  {structuredReport.doctorFollowUpQuestions.map((q, i) => (
                    <li key={i} className="font-medium italic">
                      &ldquo;{q}&rdquo;
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Standard preliminary history collected clearly.
                </p>
              )}
            </div>
          </div>

          {/* Mandatory Medical Disclaimer Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center leading-relaxed font-medium">
            {structuredReport.mandatoryNotice ||
              "AI-generated pre-visit summary based on patient-reported information. It has not been independently verified and is not a diagnosis. The clinician must review the information directly with the patient."}
          </div>
        </div>
      ) : (
        /* Fallback when AI summary is not generated or Gemini was offline */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              AI Summary Not Generated
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              {reportParseError ||
                "Gemini API is not configured or temporarily unavailable. All original patient responses are safely preserved and available below for clinician review."}
            </p>
          </div>

          {retryMessage && (
            <div
              className={`p-2.5 rounded-lg text-xs max-w-md mx-auto ${
                retryMessage.includes("successfully")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {retryMessage}
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetryReport}
              disabled={retryingAI}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retryingAI ? "animate-spin" : ""}`} />
              <span>{retryingAI ? "Generating Report..." : "Retry Report Generation"}</span>
            </button>
            <button
              onClick={() => setShowRawResponses(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Raw Responses</span>
            </button>
          </div>
        </div>
      )}

      {/* Attached Medical Records Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-tealbrand-600" />
          <span>Patient Attached Records ({appointment.medicalRecords.length})</span>
        </h3>
        <p className="text-xs text-slate-500">
          Attached files are stored locally for direct clinician review and are not analyzed by AI.
        </p>

        {appointment.medicalRecords.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No medical records attached by patient.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointment.medicalRecords.map((rec: any) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">{rec.originalName}</p>
                    <p className="text-[10px] text-slate-500">
                      {(rec.size / 1024).toFixed(1)} KB • Uploaded {new Date(rec.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <a
                  href={`/api/records/${rec.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200"
                >
                  <Download className="w-3 h-3" />
                  <span>View / Download</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Private Notes Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 no-print">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Doctor Private Notes</h3>
            <p className="text-xs text-slate-500">
              Internal clinician notes for this appointment. Visible only to you; never shared with patient or Gemini.
            </p>
          </div>
          {noteSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Note Saved
            </span>
          )}
        </div>

        <textarea
          rows={3}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Type private clinical impressions, examination notes, or prescription plans..."
          className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveNote}
            disabled={savingNote}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingNote ? "Saving Note..." : "Save Note"}</span>
          </button>
        </div>
      </div>

      {/* Raw Responses Audit Modal / Drawer */}
      {showRawResponses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="max-w-2xl w-full max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Original Patient Responses</h3>
                <p className="text-xs text-slate-500">
                  Full auditable record of answers provided by {patient.user.name}
                </p>
              </div>
              <button
                onClick={() => setShowRawResponses(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-2 py-1"
              >
                Close &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto divide-y divide-slate-100 space-y-4">
              {rawAnswers.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No answers submitted yet.</p>
              ) : (
                rawAnswers.map((ans: any) => (
                  <div key={ans.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{ans.section || "General"}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {ans.source}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{ans.questionText}</p>
                    <p className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap">
                      {ans.answerText || <span className="text-slate-400 italic">No answer provided</span>}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowRawResponses(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
