"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Mail,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  Pill,
  Plus,
  Eye,
  X,
  Stethoscope,
  ShieldCheck,
  Utensils,
  Ban,
  Sparkles,
} from "lucide-react";
import { DoctorCreatePrescriptionModal } from "@/components/workspace/DoctorCreatePrescriptionModal";

interface DoctorPrescriptionsViewProps {
  prescriptions: any[];
  patients?: any[];
}

export function DoctorPrescriptionsView({
  prescriptions: initialPrescriptions,
  patients = [],
}: DoctorPrescriptionsViewProps) {
  const [prescriptions, setPrescriptions] = useState<any[]>(initialPrescriptions);
  const [search, setSearch] = useState("");
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRxForView, setSelectedRxForView] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  async function handleSendEmail(prescriptionId: string) {
    setEmailingId(prescriptionId);
    try {
      const res = await fetch(`/api/doctor/prescriptions/${prescriptionId}/email`, {
        method: "POST",
      });
      if (res.ok) {
        setPrescriptions((prev) =>
          prev.map((p) =>
            p.id === prescriptionId ? { ...p, emailStatus: "SENT" } : p
          )
        );
      }
    } catch {
      // ignore
    } finally {
      setEmailingId(null);
    }
  }

  function handlePrescriptionCreated(newRx: any) {
    setPrescriptions((prev) => [newRx, ...prev]);
    setSuccessToast(
      `Prescription issued for ${newRx.patient?.user?.name || "Patient"} & linked directly to Patient Portal!`
    );
    setTimeout(() => setSuccessToast(null), 5000);
  }

  const filtered = prescriptions.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const inPat = p.patient?.user?.name?.toLowerCase().includes(q);
      const inDiag = p.diagnosis?.toLowerCase().includes(q);
      return inPat || inDiag;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-900 pb-16">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-sky-600" />
            <span>Digital Prescriptions Registry</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Audit history of all issued e-prescriptions, delivery timestamps, and active medication regimens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 shadow-2xs">
            {prescriptions.length} Issued Prescriptions
          </span>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Prescription</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-100/95 p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name or diagnosis..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Directly linked to Patient Portal &amp; Timeline</span>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-200/80 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Clinical Diagnosis</th>
                <th className="py-3.5 px-4">Medicines Prescribed &amp; Regimen</th>
                <th className="py-3.5 px-4">Date Issued</th>
                <th className="py-3.5 px-4">Email Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((rx) => {
                let meds: any[] = [];
                try {
                  meds = typeof rx.medicinesJson === "string" ? JSON.parse(rx.medicinesJson) : rx.medicinesJson || [];
                } catch {
                  meds = [];
                }

                const isEmailing = emailingId === rx.id;
                const isSent = rx.emailStatus === "SENT";

                return (
                  <tr key={rx.id} className="hover:bg-slate-200/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {rx.patient?.user?.name || "Patient"}
                      </div>
                      <span className="text-[11px] text-slate-600 font-mono block">
                        {rx.patient?.user?.email}
                      </span>
                      <span className="text-[9.5px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 mt-1 inline-block">
                        Linked to Portal ✓
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800 max-w-xs">
                      <div>{rx.diagnosis}</div>
                      {rx.followUpDate && (
                        <div className="text-[10px] text-slate-500 mt-1">
                          Follow-up: {rx.followUpDate}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                        <Pill className="w-3.5 h-3.5 text-sky-600" />
                        <span>{meds.length} Medicines</span>
                      </div>

                      {/* Display medicines with time of day, intake, and avoid badges */}
                      <div className="space-y-1.5">
                        {meds.slice(0, 2).map((m: any, mIdx: number) => (
                          <div
                            key={mIdx}
                            className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {m.name} ({m.dosage})
                              </span>
                              {m.timingPattern && (
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                                  {m.timingPattern}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              {m.intakeCondition && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold truncate max-w-[200px]">
                                  {m.intakeCondition.split("(")[0]}
                                </span>
                              )}
                              {m.avoid && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold truncate max-w-[200px]">
                                  {m.avoid.split(";")[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}

                        {meds.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setSelectedRxForView(rx)}
                            className="text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline"
                          >
                            + {meds.length - 2} more medicines (View slip)
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {new Date(rx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 px-4">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 border border-emerald-300 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Emailed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendEmail(rx.id)}
                          disabled={isEmailing}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800 hover:bg-sky-600 hover:text-white transition-colors border border-sky-300 shadow-2xs cursor-pointer"
                        >
                          {isEmailing ? (
                            <Clock className="w-3 h-3 animate-spin" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          <span>Send Email</span>
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRxForView(rx)}
                          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer"
                          title="View Full Prescription Slip"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-700" />
                        </button>

                        <button
                          onClick={() => window.print()}
                          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer"
                          title="Print Prescription"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/doctor/patients/${rx.patientId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-xs"
                        >
                          <span>Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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

      {/* CREATE DIGITAL PRESCRIPTION MODAL */}
      {showCreateModal && (
        <DoctorCreatePrescriptionModal
          patients={patients}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handlePrescriptionCreated}
        />
      )}

      {/* VIEW PRESCRIPTION SLIP MODAL */}
      {selectedRxForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-2xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b-2 border-sky-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-serif text-xl font-black">
                  ℞
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Digital Prescription Slip
                  </h3>
                  <p className="text-xs text-sky-200">
                    Patient: {selectedRxForView.patient?.user?.name} &bull; {selectedRxForView.patient?.user?.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRxForView(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-800">
                  Diagnosis
                </span>
                <p className="font-extrabold text-sm text-slate-900">
                  {selectedRxForView.diagnosis}
                </p>
              </div>

              {/* Medicines List */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  Prescribed Medications
                </h4>

                {(() => {
                  let meds = [];
                  try {
                    meds = typeof selectedRxForView.medicinesJson === "string"
                      ? JSON.parse(selectedRxForView.medicinesJson)
                      : selectedRxForView.medicinesJson || [];
                  } catch {}

                  return meds.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-black text-sm text-slate-900">
                          {idx + 1}. {m.name} ({m.dosage})
                        </div>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                          {m.timingPattern || m.frequency}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3 text-sky-600" />
                            Schedule &amp; Duration
                          </span>
                          <p className="font-semibold text-slate-800">
                            {m.frequency} &bull; {m.duration}
                          </p>
                        </div>

                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-emerald-600" />
                            Intake Timing
                          </span>
                          <p className="font-bold text-emerald-950">
                            {m.intakeCondition || "After meals"}
                          </p>
                        </div>
                      </div>

                      {m.avoid && (
                        <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] space-y-0.5">
                          <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
                            <Ban className="w-3 h-3 text-rose-600" />
                            What to Avoid
                          </span>
                          <p className="font-semibold text-rose-950">
                            {m.avoid}
                          </p>
                        </div>
                      )}

                      {m.instructions && (
                        <p className="text-[11px] text-slate-600 italic">
                          <strong>Note:</strong> {m.instructions}
                        </p>
                      )}
                    </div>
                  ));
                })()}
              </div>

              {selectedRxForView.advice && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-800">
                    Doctor Advice &amp; Lifestyle
                  </span>
                  <p className="font-medium text-slate-900">
                    {selectedRxForView.advice}
                  </p>
                </div>
              )}

              {selectedRxForView.followUpDate && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-slate-600 font-bold">Follow-Up Review:</span>
                  <span className="font-black text-sky-800">
                    {selectedRxForView.followUpDate}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRxForView(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
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
