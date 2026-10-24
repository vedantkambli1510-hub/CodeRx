"use client";

import { useState } from "react";
import {
  FileCheck2,
  Plus,
  Mail,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Pill,
  Sparkles,
} from "lucide-react";

interface PrescriptionItem {
  id: string;
  diagnosis: string;
  medicinesJson: string;
  advice: string | null;
  followUpDate: string | null;
  emailStatus: string; // NOT_SENT | SENDING | SENT | FAILED
  emailedAt: string | null;
  createdAt: string;
  doctor: {
    specialization: string;
    qualification: string | null;
    clinicInfo: string | null;
    user: { name: string; email: string };
  };
}

interface PrescriptionsTabProps {
  prescriptions: PrescriptionItem[];
  patientEmail: string;
  onOpenPrescriptionModal: () => void;
}

export function PrescriptionsTab({
  prescriptions,
  patientEmail,
  onOpenPrescriptionModal,
}: PrescriptionsTabProps) {
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [emailSuccessId, setEmailSuccessId] = useState<string | null>(null);

  async function handleSendEmail(prescriptionId: string) {
    setEmailingId(prescriptionId);
    try {
      const res = await fetch(`/api/doctor/prescriptions/${prescriptionId}/email`, {
        method: "POST",
      });
      if (res.ok) {
        setEmailSuccessId(prescriptionId);
        setTimeout(() => setEmailSuccessId(null), 3500);
      }
    } catch {
      // ignore
    } finally {
      setEmailingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header (Section 24) */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-sky-600" />
            <span>Digital Prescription Management</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Issue structured e-prescriptions with automatic patient delivery, PDF generation, and dosage compliance checks.
          </p>
        </div>

        <button
          onClick={onOpenPrescriptionModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Write New Prescription</span>
        </button>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <div className="bg-slate-100/95 p-12 text-center rounded-2xl border border-slate-300 text-slate-600 space-y-3">
          <p>No prescriptions have been issued for this patient yet.</p>
          <button
            onClick={onOpenPrescriptionModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
          >
            Create First Prescription
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((rx) => {
            let meds: any[] = [];
            try {
              meds = JSON.parse(rx.medicinesJson);
            } catch {}

            const isEmailSent = rx.emailStatus === "SENT" || emailSuccessId === rx.id;
            const isEmailing = emailingId === rx.id;

            return (
              <div
                key={rx.id}
                className="bg-slate-100/95 rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4 hover:border-slate-400 transition-all text-slate-800"
              >
                {/* Prescription Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-300">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {rx.doctor.user.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({rx.doctor.specialization} • {rx.doctor.qualification})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Date Issued:{" "}
                      <strong className="text-slate-800 font-semibold">
                        {new Date(rx.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </strong>{" "}
                      • Rx ID: <span className="font-mono text-sky-700">{rx.id.substring(0, 10)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendEmail(rx.id)}
                      disabled={isEmailing}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isEmailSent
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-sky-100 hover:bg-sky-600 hover:text-white text-sky-800 border border-sky-300"
                      }`}
                    >
                      {isEmailing ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : isEmailSent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Emailed to Patient</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Prescription</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs transition-colors"
                      title="Print Prescription"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Diagnosis Banner */}
                <div className="p-3 rounded-xl bg-white/90 border border-slate-300 text-xs shadow-2xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Clinical Diagnosis & Impression
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{rx.diagnosis}</p>
                </div>

                {/* Prescribed Medications Table (Section 24) */}
                <div className="rounded-xl border border-slate-300 overflow-hidden bg-white/90 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-200/70 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-4">Medicine & Strength</th>
                        <th className="py-2.5 px-4">Dosage / Frequency</th>
                        <th className="py-2.5 px-4">Duration</th>
                        <th className="py-2.5 px-4">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {meds.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/60">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <Pill className="w-3.5 h-3.5 text-sky-600" />
                            <span>{m.name || m.medicineName}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {m.dosage || m.dose || "1 tablet"} • {m.frequency || "Once daily"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {m.duration || "30 days"}
                          </td>
                          <td className="py-3 px-4 text-slate-500 italic">
                            {m.instructions || "After meals"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Clinical Advice & Follow-up */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  {rx.advice && (
                    <div className="p-3 rounded-xl bg-white/90 border border-slate-300 shadow-2xs">
                      <span className="font-bold text-slate-500 block mb-0.5">
                        Physician Advice & Lifestyle Notes:
                      </span>
                      <p className="text-slate-800">{rx.advice}</p>
                    </div>
                  )}

                  {rx.followUpDate && (
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="font-bold text-sky-900 block mb-0.5">
                          Recommended Follow-up Visit:
                        </span>
                        <p className="text-sky-950 font-semibold">{rx.followUpDate}</p>
                      </div>
                      <Calendar className="w-5 h-5 text-sky-600 opacity-80" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
