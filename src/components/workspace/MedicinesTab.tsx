"use client";

import { useState } from "react";
import {
  Pill,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ShieldAlert,
  PowerOff,
  Check,
  X,
} from "lucide-react";
import { CrazyMedicineStatusSwitch } from "@/components/doctor/CrazyMedicineStatusSwitch";

interface MedicineItem {

  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string | null;
  endDate: string | null;
  status: string; // CURRENT | PREVIOUS | RECENTLY_ADDED | DISCONTINUED
  source: string; // PRESCRIPTION | SELF_REPORTED | LAB_NOTE
  notes: string | null;
}

interface MedicinesTabProps {
  medicines: MedicineItem[];
  onOpenPrescriptionModal: () => void;
  onMedicinesChange?: (medicines: MedicineItem[]) => void;
}

export function MedicinesTab({
  medicines: initialMedicines,
  onOpenPrescriptionModal,
  onMedicinesChange,
}: MedicinesTabProps) {
  const [medicines, setMedicines] = useState<MedicineItem[]>(initialMedicines);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Discontinue modal state
  const [targetMedicine, setTargetMedicine] = useState<MedicineItem | null>(null);
  const [discontinueReason, setDiscontinueReason] = useState<string>(
    "Renal impairment: Elevated serum creatinine (1.7 mg/dL) & reduced eGFR (46 mL/min)"
  );
  const [submittingAction, setSubmittingAction] = useState(false);

  const currentMeds = medicines.filter(
    (m) => m.status === "CURRENT" || m.status === "RECENTLY_ADDED"
  );
  const discontinuedMeds = medicines.filter(
    (m) => m.status === "DISCONTINUED" || m.status === "PREVIOUS"
  );

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
      if (!res.ok) throw new Error(data.error || "Failed to discontinue medication");

      const updatedList = medicines.map((m) =>
        m.id === targetMedicine.id ? data.medicine : m
      );
      setMedicines(updatedList);
      onMedicinesChange?.(updatedList);

      setActionSuccess(
        `Turned OFF: ${targetMedicine.medicineName} has been discontinued. Patient has been notified and timeline updated.`
      );
      setTimeout(() => setActionSuccess(null), 4500);
      setTargetMedicine(null);
    } catch (err: any) {
      alert(err.message || "Failed to discontinue medication");
    } finally {
      setSubmittingAction(false);
    }
  }

  async function handleResume(med: MedicineItem) {
    if (!confirm(`Reactivate and turn ON ${med.medicineName} for patient?`)) return;

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

      const updatedList = medicines.map((m) =>
        m.id === med.id ? data.medicine : m
      );
      setMedicines(updatedList);
      onMedicinesChange?.(updatedList);

      setActionSuccess(`Reactivated: ${med.medicineName} is now active.`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to reactivate");
    }
  }

  const filteredMeds = medicines.filter((m) => {
    if (activeCategory === "CURRENT" && m.status !== "CURRENT" && m.status !== "RECENTLY_ADDED")
      return false;
    if (activeCategory === "DISCONTINUED" && m.status !== "DISCONTINUED" && m.status !== "PREVIOUS")
      return false;
    if (activeCategory === "RECENTLY_ADDED" && m.status !== "RECENTLY_ADDED") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.medicineName.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header (Section 19) */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-5 h-5 text-sky-600" />
            <span>Longitudinal Pharmacotherapy & Regimen Management</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Full audit log of active drugs, discontinued therapies, dosage adjustments, and prescription lineage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrescriptionModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Prescribe Medication</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Renal Warning Alert for Metformin */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="font-bold text-amber-900">
            Clinical Safety Alert: Metformin Regimen vs Renal Clearance
          </strong>
          <p className="mt-0.5 text-amber-900/90 leading-relaxed">
            Patient's calculated eGFR is 46 mL/min/1.73m² (Serum Creatinine 1.7 mg/dL). If you determine Metformin presents lactic acidosis risk, click <strong>"Turn Off / Discontinue"</strong> below to safely deprescribe and inform the patient.
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-slate-100/95 p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine, dose, or note..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: "ALL", label: `All (${medicines.length})` },
            { id: "CURRENT", label: `Current (${currentMeds.length})` },
            { id: "DISCONTINUED", label: `Discontinued (${discontinuedMeds.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-200/90 hover:bg-slate-300 text-slate-700 border border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Table (Section 19) */}
      <div className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-200/70 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Medicine & Strength</th>
                <th className="py-3.5 px-4">Dosage / Frequency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Duration / Timing</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Clinical Notes</th>
                <th className="py-3.5 px-4 text-right">Doctor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMeds.map((med) => {
                const isCurrent = med.status === "CURRENT" || med.status === "RECENTLY_ADDED";

                return (
                  <tr key={med.id} className="hover:bg-slate-200/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isCurrent
                              ? "bg-sky-100 border border-sky-300 text-sky-700"
                              : "bg-slate-200 text-slate-500"
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

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {med.frequency}
                    </td>

                    <td className="py-3.5 px-4">
                      {med.status === "RECENTLY_ADDED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                          🔵 Recently Added
                        </span>
                      )}
                      {med.status === "CURRENT" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🟢 Active (ON)
                        </span>
                      )}
                      {med.status === "PAUSED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ⏸️ On-Hold (Paused)
                        </span>
                      )}
                      {med.status === "TAPERING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                          📉 Tapering Dose
                        </span>
                      )}
                      {(med.status === "DISCONTINUED" || med.status === "PREVIOUS") && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          🛑 Turned Off / Stopped
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div>Start: {med.startDate || "Jan 2024"}</div>
                      {med.endDate && (
                        <div className="text-[11px] text-rose-600 font-semibold">Stopped: {med.endDate}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700 border border-slate-300">
                        {med.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                      {med.notes || "Standard chronic dosing."}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <CrazyMedicineStatusSwitch
                        medicine={med}
                        onStatusUpdated={(updated) => {
                          setMedicines((prev) =>
                            prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
                          );
                          setActionSuccess(`Medication status updated: ${updated.medicineName} is now ${updated.status}.`);
                          setTimeout(() => setActionSuccess(null), 4000);
                        }}
                      />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-slate-50 rounded-3xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 text-slate-800">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
                  <PowerOff className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">Turn Off Medication</h3>
                  <p className="text-xs text-rose-100">
                    Deprescribing: <strong>{targetMedicine.medicineName} ({targetMedicine.dosage})</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTargetMedicine(null)}
                className="p-1 rounded-lg text-rose-100 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Turning off this medication will move it to <strong className="text-slate-900">Discontinued Medicines</strong>, log an entry in the patient's <strong className="text-slate-900">Medical Timeline</strong>, and send an urgent <strong className="text-slate-900">Safety Notification</strong> advising the patient to stop taking it.
              </p>

              {/* Clinical Reason Options */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  Clinical Reason for Discontinuation:
                </label>
                <div className="space-y-1.5">
                  {[
                    "Renal impairment: Elevated serum creatinine (1.7 mg/dL) & reduced eGFR (46 mL/min)",
                    "Therapeutic goal achieved — taper and stop",
                    "Adverse drug reaction / intolerance reported by patient",
                    "Substituted with a new medication regimen",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDiscontinueReason(preset)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs ${
                        discontinueReason === preset
                          ? "bg-rose-100 border-rose-300 text-rose-900 font-bold"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
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
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  placeholder="Reason..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTargetMedicine(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDiscontinue}
                  disabled={submittingAction}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                >
                  <PowerOff className="w-4 h-4" />
                  <span>{submittingAction ? "Processing..." : "Turn Off & Notify Patient"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
