"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Stethoscope,
  ChevronLeft,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function PatientAppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  async function loadAppointment() {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load appointment");
      setAppointment(data.appointment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading details");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointmentId", appointmentId);

    try {
      const res = await fetch("/api/records/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      await loadAppointment();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error uploading file");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading appointment details..." size="lg" />;
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Appointment not found.</p>
        <Link href="/patient" className="text-brand-600 hover:underline text-sm font-semibold mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const intakeStatus = appointment.intakeSession?.status || "NOT_STARTED";
  const isScheduled = appointment.status === "SCHEDULED";
  const answers = appointment.intakeSession?.answers || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/patient/appointments" className="hover:text-brand-600 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span>Appointments</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Consultation Details</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={appointment.status} type="appointment" />
            <span className="text-xs text-slate-500">
              Booked on {new Date(appointment.bookedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultation with {appointment.doctor.user.name}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Appointment Information Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Doctor & Specialty
          </span>
          <p className="text-base font-bold text-slate-900">{appointment.doctor.user.name}</p>
          <p className="text-xs font-medium text-brand-700">{appointment.doctor.specialization}</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Date & Scheduled Time
          </span>
          <p className="text-base font-bold text-slate-900">
            {new Date(appointment.slot.startTime).toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {new Date(appointment.slot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              ({appointment.slot.duration} mins)
            </span>
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Intake Status
          </span>
          <div className="flex items-center gap-2 pt-1">
            <StatusBadge status={intakeStatus} type="intake" />
            {appointment.aiReport && (
              <StatusBadge status={appointment.aiReport.reportStatus} type="report" />
            )}
          </div>
        </div>
      </div>

      {/* Pre-Visit Intake Section */}
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-white via-white to-brand-50/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Pre-Visit Intake</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Estimated time: 3–4 minutes
          </span>
        </div>

        {intakeStatus !== "COMPLETED" ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              Help your doctor understand your symptoms, onset, and previous treatments by completing
              this preliminary interview from home before your consultation.
            </p>
            <div>
              <Link
                href={`/patient/appointments/${appointment.id}/intake`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{intakeStatus === "IN_PROGRESS" ? "Continue Pre-Visit Intake" : "Start Pre-Visit Intake"}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 text-sm font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Intake submitted. Your structured pre-visit summary is prepared for Dr. {appointment.doctor.user.name.split(" ")[1]}.
              </span>
            </div>

            {/* Submitted Answers Accordion/Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Submitted Responses ({answers.length})
                </span>
                <Link
                  href={`/patient/appointments/${appointment.id}/intake`}
                  className="text-xs text-brand-600 hover:underline font-semibold"
                >
                  Edit Answers &rarr;
                </Link>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100 max-h-64 overflow-y-auto pr-2">
                {answers.map((ans: any) => (
                  <div key={ans.id} className="pt-2 first:pt-0">
                    <span className="font-semibold text-slate-600 block">{ans.questionText}</span>
                    <span className="text-slate-900 font-medium">{ans.answerText}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Medical Records / Attachments */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-tealbrand-600" />
              <span>Attached Medical Records ({appointment.medicalRecords.length}/5)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              PDF, JPG, PNG up to 10MB each. Stored locally for direct clinician review. Not analyzed by AI.
            </p>
          </div>

          <div>
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? "Uploading..." : "Upload Document"}</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading || appointment.medicalRecords.length >= 5}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {uploadError}
          </div>
        )}

        {appointment.medicalRecords.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No medical records attached to this appointment. You may attach previous prescriptions, scans, or lab reports.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointment.medicalRecords.map((rec: any) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">{rec.originalName}</p>
                    <p className="text-[10px] text-slate-500">
                      {(rec.size / 1024).toFixed(1)} KB • {new Date(rec.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <a
                  href={`/api/records/${rec.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
