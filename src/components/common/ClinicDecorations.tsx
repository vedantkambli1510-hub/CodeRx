"use client";

import React from "react";
import { Stethoscope, Heart, Pill, Hospital, Activity, ShieldCheck } from "lucide-react";

export function ClinicTopPill() {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 shadow-2xs">
      <div className="flex items-center gap-1.5 font-bold text-sky-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>🏥 Clinic System Active</span>
      </div>
      <span className="text-slate-300">•</span>
      <span className="flex items-center gap-1 text-slate-500">
        <span>🩺</span>
        <span>Doctor Station</span>
      </span>
      <span className="text-slate-300">•</span>
      <span className="flex items-center gap-1 text-slate-500">
        <span>💊</span>
        <span>1mg Pharmacy</span>
      </span>
    </div>
  );
}

export function CuteDoctorBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold shadow-2xs">
      <span className="text-sm">🩺</span>
      <span>Attending Clinic Physician</span>
    </div>
  );
}

export function CutePatientBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
      <span className="text-sm">💖</span>
      <span>Verified Patient Record</span>
    </div>
  );
}
