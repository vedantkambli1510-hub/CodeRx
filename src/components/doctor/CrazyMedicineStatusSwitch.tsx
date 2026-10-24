"use client";

import { useState, useRef, useEffect } from "react";
import {
  Power,
  PowerOff,
  RotateCcw,
  Pause,
  TrendingDown,
  ChevronDown,
  Check,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

export type MedicineClinicalStatus = "CURRENT" | "DISCONTINUED" | "PAUSED" | "TAPERING";

interface CrazyMedicineStatusSwitchProps {
  medicine: {
    id: string;
    medicineName: string;
    dosage: string;
    status: string;
    notes?: string | null;
    patient?: { user?: { name?: string } };
  };
  onStatusUpdated: (updatedMedicine: any) => void;
}

export function CrazyMedicineStatusSwitch({
  medicine,
  onStatusUpdated,
}: CrazyMedicineStatusSwitchProps) {
  const [currentStatus, setCurrentStatus] = useState<MedicineClinicalStatus>(
    (medicine.status as MedicineClinicalStatus) || "CURRENT"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"DISCONTINUE" | "PAUSE" | "TAPER" | null>(null);
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentStatus((medicine.status as MedicineClinicalStatus) || "CURRENT");
  }, [medicine.status]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCurrent = currentStatus === "CURRENT" || currentStatus === ("RECENTLY_ADDED" as any);
  const isStopped = currentStatus === "DISCONTINUED" || currentStatus === ("PREVIOUS" as any);
  const isPaused = currentStatus === "PAUSED";
  const isTapering = currentStatus === "TAPERING";

  // Preset clinical reasons for rapid 1-click deprescribing
  const presetReasons = medicine.medicineName.toLowerCase().includes("metformin")
    ? [
        "Renal risk: Serum creatinine > 1.7 mg/dL & eGFR < 45 mL/min",
        "Lactic acidosis risk with acute illness",
        "Severe gastrointestinal intolerance",
        "Target HbA1c achieved; deprescribing",
      ]
    : medicine.medicineName.toLowerCase().includes("glimepiride")
    ? [
        "Hypoglycemia risk: Recurrent blood sugar drops < 70 mg/dL",
        "Renal clearance decline; switching to safer agent",
        "Patient experienced dizziness/sweating",
        "Therapeutic dose adjustment",
      ]
    : [
        "Elevated renal parameters / Organ safety protocol",
        "Adverse drug interaction or symptom emergence",
        "Allergic reaction or rash reported by patient",
        "Course completed / Therapeutic goal achieved",
      ];

  // Quick Direct Flip
  const handleTogglePower = () => {
    if (isCurrent) {
      // Opening reason modal to safely turn off
      setReason(presetReasons[0]);
      setModalAction("DISCONTINUE");
    } else {
      // Direct instant reactivate
      executeStatusChange("REACTIVATE");
    }
  };

  const handleSelectStatus = (target: MedicineClinicalStatus) => {
    setDropdownOpen(false);
    if (target === "CURRENT") {
      executeStatusChange("REACTIVATE");
    } else if (target === "DISCONTINUED") {
      setReason(presetReasons[0]);
      setModalAction("DISCONTINUE");
    } else if (target === "PAUSED") {
      setReason("Temporarily paused pending repeat laboratory testing (creatinine / electrolytes)");
      setModalAction("PAUSE");
    } else if (target === "TAPERING") {
      setReason("Tapering dose by 50% over 2 weeks before full discontinuation");
      setModalAction("TAPER");
    }
  };

  async function executeStatusChange(action: "REACTIVATE" | "DISCONTINUE" | "PAUSE" | "TAPER") {
    setUpdating(true);
    try {
      const res = await fetch("/api/doctor/medicines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: medicine.id,
          action,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update medication status");

      const next =
        action === "REACTIVATE"
          ? "CURRENT"
          : action === "DISCONTINUE"
          ? "DISCONTINUED"
          : action === "PAUSE"
          ? "PAUSED"
          : "TAPERING";

      setCurrentStatus(next as MedicineClinicalStatus);
      onStatusUpdated(data.medicine || { ...medicine, status: next });
      setModalAction(null);
    } catch (err: any) {
      alert(err.message || "Error updating medication");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="relative inline-flex items-center gap-1.5" ref={containerRef}>
      
      {/* 1. CRAZY CYBERNETIC POWER SWITCH TOGGLE */}
      <button
        type="button"
        onClick={handleTogglePower}
        disabled={updating}
        className={`group relative flex items-center justify-between w-28 h-8 px-1.5 rounded-full border-2 transition-all duration-300 shadow-xs focus:outline-none cursor-pointer ${
          isCurrent
            ? "bg-emerald-950/90 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
            : isStopped
            ? "bg-rose-950/90 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
            : isPaused
            ? "bg-amber-950/90 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            : "bg-indigo-950/90 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.35)]"
        }`}
        title="Click to toggle Power ON/OFF, or click chevron for multi-status clinical modes"
      >
        {/* Left Status Label */}
        <span
          className={`text-[9px] font-black uppercase tracking-wider pl-1.5 transition-opacity ${
            isCurrent ? "text-emerald-400 opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          ON
        </span>

        {/* Sliding Mechanical / LED Knob */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-transform duration-300 transform ${
            isCurrent
              ? "translate-x-0 bg-emerald-500 text-emerald-950 ring-2 ring-emerald-300 animate-pulse"
              : isStopped
              ? "translate-x-18 bg-rose-500 text-white ring-2 ring-rose-300"
              : "translate-x-10 bg-amber-500 text-slate-900 ring-2 ring-amber-300"
          }`}
        >
          {isCurrent ? (
            <Power className="w-3 h-3 text-emerald-950 stroke-[3]" />
          ) : isStopped ? (
            <PowerOff className="w-3 h-3 text-white stroke-[3]" />
          ) : (
            <Pause className="w-2.5 h-2.5 text-slate-900 stroke-[3]" />
          )}
        </div>

        {/* Right Status Label */}
        <span
          className={`text-[9px] font-black uppercase tracking-wider pr-1.5 transition-opacity ${
            !isCurrent ? "text-rose-400 opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {isStopped ? "OFF" : isPaused ? "PAUSE" : "TAPER"}
        </span>
      </button>

      {/* 2. CRAZY MULTI-OPTION STATUS DROPDOWN TRIGGER */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="p-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
        title="Change medication clinical state (Active, Stop, Pause, Taper)"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {/* DROPDOWN MENU */}
      {dropdownOpen && (
        <div className="absolute right-0 top-10 w-56 bg-white rounded-2xl border border-slate-300 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 text-slate-900">
          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
            <span>Medication Regimen Mode</span>
            <Sparkles className="w-3 h-3 text-sky-500" />
          </div>

          <button
            type="button"
            onClick={() => handleSelectStatus("CURRENT")}
            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
              isCurrent ? "bg-emerald-50 text-emerald-900 font-extrabold" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <div className="font-bold">🟢 Active (Turn ON)</div>
                <div className="text-[10px] text-slate-500 font-normal">Patient actively taking doses</div>
              </div>
            </div>
            {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectStatus("DISCONTINUED")}
            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
              isStopped ? "bg-rose-50 text-rose-900 font-extrabold" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <div>
                <div className="font-bold text-rose-700">🛑 Turn OFF (Stop)</div>
                <div className="text-[10px] text-slate-500 font-normal">Discontinue / Deprescribe</div>
              </div>
            </div>
            {isStopped && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectStatus("PAUSED")}
            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
              isPaused ? "bg-amber-50 text-amber-900 font-extrabold" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <div>
                <div className="font-bold text-amber-800">⏸️ Pause / On-Hold</div>
                <div className="text-[10px] text-slate-500 font-normal">Pending lab retest (eGFR/K+)</div>
              </div>
            </div>
            {isPaused && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectStatus("TAPERING")}
            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
              isTapering ? "bg-indigo-50 text-indigo-900 font-extrabold" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <div>
                <div className="font-bold text-indigo-800">📉 Tapering Dose</div>
                <div className="text-[10px] text-slate-500 font-normal">Gradual reduction regimen</div>
              </div>
            </div>
            {isTapering && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
          </button>
        </div>
      )}

      {/* REASON MODAL (When Discontinuing, Pausing, or Tapering) */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div
              className={`px-6 py-4 text-white flex items-center justify-between ${
                modalAction === "DISCONTINUE"
                  ? "bg-rose-600"
                  : modalAction === "PAUSE"
                  ? "bg-amber-600"
                  : "bg-indigo-600"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  {modalAction === "DISCONTINUE" ? (
                    <PowerOff className="w-4 h-4" />
                  ) : modalAction === "PAUSE" ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">
                    {modalAction === "DISCONTINUE"
                      ? "Turn OFF & Deprescribe Drug"
                      : modalAction === "PAUSE"
                      ? "Temporarily Pause Regimen"
                      : "Initiate Dose Tapering"}
                  </h3>
                  <p className="text-[11px] text-white/90">
                    {medicine.medicineName} ({medicine.dosage}) &bull;{" "}
                    {medicine.patient?.user?.name || "Patient"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-slate-800 block">
                  Quick Select Clinical Rationale Presets:
                </label>
                <div className="flex flex-col gap-1.5">
                  {presetReasons.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReason(preset)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        reason === preset
                          ? "border-sky-600 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-500 shadow-2xs"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>⚡ {preset}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Physician Note:</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter specific clinical justification..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  This action dispatches an urgent patient safety alert and logs to the medical timeline.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAction(null)}
                  disabled={updating}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => executeStatusChange(modalAction)}
                  disabled={updating || !reason.trim()}
                  className={`px-5 py-2 rounded-xl text-white font-extrabold shadow-md transition-all disabled:opacity-50 ${
                    modalAction === "DISCONTINUE"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : modalAction === "PAUSE"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {updating
                    ? "Updating..."
                    : modalAction === "DISCONTINUE"
                    ? "Confirm Turn OFF"
                    : modalAction === "PAUSE"
                    ? "Confirm Pause"
                    : "Confirm Taper"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
