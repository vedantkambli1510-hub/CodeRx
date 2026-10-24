"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pill,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  PowerOff,
  RotateCcw,
  X,
  Check,
} from "lucide-react";
import { CrazyMedicineStatusSwitch } from "@/components/doctor/CrazyMedicineStatusSwitch";

interface DoctorMedicinesViewProps {

  medicines: any[];
}

export function DoctorMedicinesView({ medicines: initialMedicines }: DoctorMedicinesViewProps) {
  const [medicines, setMedicines] = useState<any[]>(initialMedicines);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Turn Off / Discontinue modal state
  const [targetMedicine, setTargetMedicine] = useState<any | null>(null);
  const [discontinueReason, setDiscontinueReason] = useState<string>(
    "Renal impairment: Elevated serum creatinine (1.7 mg/dL) & reduced eGFR (46 mL/min)"
  );
  const [submittingAction, setSubmittingAction] = useState(false);

  const currentCount = medicines.filter(
    (m) => m.status === "CURRENT" || m.status === "RECENTLY_ADDED"
  ).length;
  const discontinuedCount = medicines.filter(
    (m) => m.status === "DISCONTINUED" || m.status === "PREVIOUS"
  ).length;

  async function handleConfirmDiscontinue() {
    if (!targetMedicine) return;
    setSubmittingAction(true);

    try {
      const res = await fetch("/api/doctor/medicines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: targetMedicine.id,
          action: "DISCONTINUE",
          reason: discontinueReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to turn off medication");

      setMedicines((prev) =>
        prev.map((m) => (m.id === targetMedicine.id ? { ...m, ...data.medicine } : m))
      );

      setActionSuccess(
        `Turned OFF: ${targetMedicine.medicineName} for ${targetMedicine.patient?.user?.name || "Patient"}. Patient has been alerted to STOP taking this medicine.`
      );
      setTimeout(() => setActionSuccess(null), 5000);
      setTargetMedicine(null);
    } catch (err: any) {
      alert(err.message || "Failed to discontinue medication");
    } finally {
      setSubmittingAction(false);
    }
  }

  async function handleResume(med: any) {
    if (!confirm(`Reactivate and turn ON ${med.medicineName} for ${med.patient?.user?.name || "Patient"}?`)) return;

    try {
      const res = await fetch("/api/doctor/medicines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: med.id,
          action: "REACTIVATE",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resume medication");

      setMedicines((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, ...data.medicine } : m))
      );

      setActionSuccess(`Reactivated: ${med.medicineName} is now active.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to reactivate");
    }
  }

  const filtered = medicines.filter((m) => {
    if (statusFilter === "CURRENT" && m.status !== "CURRENT" && m.status !== "RECENTLY_ADDED") return false;
    if (statusFilter === "DISCONTINUED" && m.status !== "DISCONTINUED" && m.status !== "PREVIOUS") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inMed = m.medicineName.toLowerCase().includes(q);
      const inPat = m.patient?.user?.name.toLowerCase().includes(q);
      const inNotes = m.notes?.toLowerCase().includes(q);
      return inMed || inPat || inNotes;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Pill className="w-6 h-6 text-sky-600" />
            <span>Pharmacotherapy & Medicine Directory</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Centrally monitor active drugs, stop contraindicated medicines when clinical risks emerge, and manage patient prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 shadow-2xs">
            {medicines.length} Tracked Prescriptions
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Renal Contraindication Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="font-bold text-amber-900">
            Clinical Safety Protocol: Doctor Deprescribing / Turning Off Medications
          </strong>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            When lab findings (such as elevated Serum Creatinine or declining eGFR) suggest risk of adverse drug reactions, doctors can use the <strong>"Turn Off"</strong> action below to immediately discontinue the drug, record the clinical rationale, and dispatch an urgent safety alert to the patient.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-100/95 p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by drug name, patient, or notes..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: `All (${medicines.length})` },
            { id: "CURRENT", label: `Active (${currentCount})` },
            { id: "DISCONTINUED", label: `Turned Off / Stopped (${discontinuedCount})` },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === btn.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-200/80 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Medication Name</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Dosage / Frequency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Clinical Notes & Audit</th>
                <th className="py-3.5 px-4 text-right">Doctor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((med) => {
                const isCurrent = med.status === "CURRENT" || med.status === "RECENTLY_ADDED";

                return (
                  <tr key={med.id} className="hover:bg-slate-200/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isCurrent
                              ? "bg-sky-100 text-sky-700 border border-sky-300"
                              : "bg-slate-200 text-slate-500 border border-slate-300"
                          }`}
                        >
                          <Pill className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className={`font-bold block ${isCurrent ? "text-slate-900" : "text-slate-400 line-through"}`}>
                            {med.medicineName}
                          </span>
                          <span className="text-[11px] text-slate-500">{med.dosage}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {med.patient?.user?.name || "Patient"}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {med.frequency}
                    </td>

                    <td className="py-3.5 px-4">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🟢 Active (ON)
                        </span>
                      ) : med.status === "PAUSED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ⏸️ On-Hold (Paused)
                        </span>
                      ) : med.status === "TAPERING" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                          📉 Tapering Dose
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          🛑 Turned Off (Stopped)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div>Start: {med.startDate || "Jan 2024"}</div>
                      {med.endDate && (
                        <div className="text-[11px] text-rose-700 font-semibold">
                          Stopped: {med.endDate}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {med.notes || "Standard clinical regimen."}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <CrazyMedicineStatusSwitch
                          medicine={med}
                          onStatusUpdated={(updated) => {
                            setMedicines((prev) =>
                              prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
                            );
                            setActionSuccess(`Updated ${updated.medicineName}: Regimen is now ${updated.status}.`);
                            setTimeout(() => setActionSuccess(null), 4000);
                          }}
                        />

                        <Link
                          href={`/doctor/patients/${med.patientId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-700 hover:bg-sky-600 hover:text-white transition-colors border border-slate-300 shadow-2xs"
                        >
                          <span>Workspace</span>
                          <ArrowRight className="w-3 h-3" />
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

      {/* Discontinue / Turn Off Confirmation Modal */}
      {targetMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-slate-100 rounded-3xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 text-slate-900">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-rose-700 to-red-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
                  <PowerOff className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">Turn Off Medication</h3>
                  <p className="text-xs text-rose-100">
                    Deprescribe: <strong>{targetMedicine.medicineName} ({targetMedicine.dosage})</strong> for <strong>{targetMedicine.patient?.user?.name || "Patient"}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTargetMedicine(null)}
                className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-700 leading-relaxed">
                Turning off this medication will immediately change its status to <strong className="text-rose-700">Turned Off / Stopped</strong>, create an entry in the patient's <strong>Medical Timeline</strong>, and dispatch an urgent <strong>Safety Alert</strong> telling the patient not to take this medicine anymore.
              </p>

              {/* Presets */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 block">
                  Select Clinical Reason for Discontinuation:
                </label>
                <div className="space-y-1.5">
                  {[
                    "Renal impairment: Elevated serum creatinine (1.7 mg/dL) & reduced eGFR (46 mL/min)",
                    "Course completed — patient no longer requires therapy",
                    "Adverse drug reaction / intolerance reported by patient",
                    "Contraindicated based on latest laboratory findings",
                    "Substituted with a new alternative medication",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDiscontinueReason(preset)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs ${
                        discontinueReason === preset
                          ? "bg-rose-100 border-rose-400 text-rose-900 font-bold"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Textarea */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Custom Doctor Advice / Remarks:
                </label>
                <textarea
                  rows={2}
                  value={discontinueReason}
                  onChange={(e) => setDiscontinueReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 shadow-2xs"
                  placeholder="Additional notes for patient chart..."
                />
              </div>

              <div className="pt-3 border-t border-slate-300 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTargetMedicine(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDiscontinue}
                  disabled={submittingAction}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PowerOff className="w-4 h-4" />
                  <span>{submittingAction ? "Stopping..." : "Turn Off & Alert Patient"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
