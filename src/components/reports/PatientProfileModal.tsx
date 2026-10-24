"use client";

import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  ShieldAlert,
  Pill,
  FileText,
  Clock,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { MOCK_PATIENTS, INITIAL_REPORTS, PatientReport } from "@/lib/data/reports-data";
import { StatusBadge } from "./StatusBadge";

interface PatientProfileModalProps {
  patientId: string | null;
  onClose: () => void;
  onSelectReport: (report: PatientReport) => void;
}

export function PatientProfileModal({
  patientId,
  onClose,
  onSelectReport,
}: PatientProfileModalProps) {
  if (!patientId) return null;

  const patient = MOCK_PATIENTS[patientId] || {
    id: patientId,
    name: "Patient " + patientId,
    age: 45,
    gender: "Unspecified",
    phone: "+1 (555) 000-0000",
    email: "patient@example.com",
    lastVisit: "Recent",
    medications: ["Maintenance medication"],
    allergies: "None documented",
    conditions: ["Under medical observation"],
  };

  const patientReports = INITIAL_REPORTS.filter((r) => r.patientId === patientId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900">Patient Profile & Clinical Summary</h2>
              <span className="text-xs text-slate-500">Longitudinal patient record</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{patient.name}</h3>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {patient.age} yrs • {patient.gender} • Last Visit: <strong className="text-slate-800">{patient.lastVisit}</strong>
              </p>
            </div>
          </div>

          {/* Contact & Safety Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                <span className="font-medium text-slate-800">{patient.phone}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                <span className="font-medium text-slate-800">{patient.email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3 sm:col-span-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Documented Allergies</span>
                <span className="font-medium text-amber-900">{patient.allergies}</span>
              </div>
            </div>
          </div>

          {/* Current Medications (Mock/Demo per Section 39) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-indigo-600" />
              <span>Current Medications ({patient.medications.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {patient.medications.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {med}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports Timeline */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Patient Reports & Diagnostic Records ({patientReports.length})</span>
            </h4>

            <div className="space-y-2">
              {patientReports.map((report) => {
                const formattedDate = new Date(report.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={report.id}
                    onClick={() => {
                      onClose();
                      onSelectReport(report);
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.reportName}
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        {formattedDate} • {report.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={report.status} size="sm" />
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Back to Reports
          </button>
        </div>
      </div>
    </div>
  );
}
