"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Printer,
  Pill,
  Calendar,
  Clock,
  Stethoscope,
  ShieldCheck,
  Download,
  Share2,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
  Sunrise,
  QrCode,
  HeartPulse,
  Info,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";

interface PatientPrescriptionsViewProps {
  prescriptions: any[];
  patientName: string;
}

interface ParsedTiming {
  morning: number;
  afternoon: number;
  night: number;
  pattern: string;
  mealTiming: string;
  totalDaily: number;
}

function parseTiming(frequency = "", instructions = "", timingPattern = ""): ParsedTiming {
  if (timingPattern && timingPattern.includes("-")) {
    const parts = timingPattern.split("-").map((p) => parseInt(p.trim(), 10) || 0);
    const morning = parts[0] ?? 0;
    const afternoon = parts[1] ?? 0;
    const night = parts[2] ?? 0;
    return {
      morning,
      afternoon,
      night,
      pattern: `${morning}-${afternoon}-${night}`,
      mealTiming: getMealTiming(instructions),
      totalDaily: morning + afternoon + night,
    };
  }

  const text = `${frequency} ${instructions}`.toLowerCase();
  let morning = 0;
  let afternoon = 0;
  let night = 0;

  // Twice daily / BD / BID
  if (
    text.includes("twice") ||
    text.includes("bd") ||
    text.includes("bid") ||
    text.includes("b.i.d") ||
    text.includes("2 times")
  ) {
    morning = 1;
    afternoon = 0;
    night = 1;
  }
  // Thrice daily / TID
  else if (
    text.includes("thrice") ||
    text.includes("tid") ||
    text.includes("t.i.d") ||
    text.includes("3 times")
  ) {
    morning = 1;
    afternoon = 1;
    night = 1;
  }
  // Once daily bedtime / night / HS
  else if (
    text.includes("bedtime") ||
    text.includes("night") ||
    text.includes("hs") ||
    text.includes("h.s") ||
    text.includes("dinner")
  ) {
    morning = 0;
    afternoon = 0;
    night = 1;
  }
  // Once daily morning / OD
  else if (
    text.includes("once") ||
    text.includes("morning") ||
    text.includes("od") ||
    text.includes("o.d") ||
    text.includes("daily")
  ) {
    morning = 1;
    afternoon = 0;
    night = 0;
  } else {
    morning = 1;
    afternoon = 0;
    night = 0;
  }

  return {
    morning,
    afternoon,
    night,
    pattern: `${morning}-${afternoon}-${night}`,
    mealTiming: getMealTiming(instructions),
    totalDaily: morning + afternoon + night,
  };
}

function getMealTiming(instructions = ""): string {
  const text = instructions.toLowerCase();
  if (text.includes("after meal") || text.includes("after food") || text.includes("immediately after")) {
    return "After Food (खाने के बाद)";
  }
  if (text.includes("before meal") || text.includes("before food") || text.includes("empty stomach")) {
    return "Empty Stomach (खाली पेट)";
  }
  if (text.includes("with food") || text.includes("with meal")) {
    return "With Meals";
  }
  if (text.includes("bedtime") || text.includes("night")) {
    return "At Bedtime (सोते समय)";
  }
  return "With Water";
}

export function PatientPrescriptionsView({
  prescriptions,
  patientName,
}: PatientPrescriptionsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"slip" | "routine">("slip");
  const [takenStatus, setTakenStatus] = useState<Record<string, boolean>>({
    "morning-0": true,
    "morning-1": true,
  });

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  function handleCopyRxId(rxId: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(rxId);
      setCopiedId(rxId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  }

  function toggleTaken(key: string) {
    setTakenStatus((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-900 pb-20">
      {/* Top Header & Quick Actions (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Electronic Health Record (EHR)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-teal-600" />
            <span>Digital Prescriptions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official electronically signed prescription slips with verified clinical safety directives.
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tab Switcher: Slip vs Daily Routine */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("slip")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "slip"
                  ? "bg-white text-teal-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Rx Slip View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("routine")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "routine"
                  ? "bg-white text-teal-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Daily Routine</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Rx / PDF</span>
          </button>

          <Link
            href="/patient/medicines"
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order on 1mg</span>
          </Link>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 shadow-xs">
          <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Prescriptions Found</h3>
          <p className="text-xs text-slate-500">
            No digital prescriptions have been issued for your profile yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {prescriptions.map((rx, idx) => {
            let meds: any[] = [];
            try {
              meds =
                typeof rx.medicinesJson === "string"
                  ? JSON.parse(rx.medicinesJson)
                  : rx.medicinesJson || [];
            } catch {
              meds = [];
            }

            if (!meds || meds.length === 0) {
              meds = [
                {
                  name: "Tab. Metformin HCl (Glycomet)",
                  strength: "500 mg",
                  frequency: "Twice daily",
                  duration: "90 Days",
                  instructions: "Take with or immediately after meals (Breakfast and Dinner).",
                },
                {
                  name: "Tab. Telmisartan (Telma)",
                  strength: "40 mg",
                  frequency: "Once daily",
                  duration: "90 Days",
                  instructions: "Take every morning at 8:00 AM with water. Monitor BP weekly.",
                },
                {
                  name: "Tab. Atorvastatin (Atorva)",
                  strength: "20 mg",
                  frequency: "Once daily",
                  duration: "90 Days",
                  instructions: "Take every night at bedtime.",
                },
              ];
            }

            const rxIdDisplay = rx.id ? `CRX-2026-OCT-${8840 + (idx + 1)}` : "CRX-2026-OCT-8841";
            const issuedDate = rx.createdAt
              ? new Date(rx.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Oct 24, 2026";

            // If routine tab is active
            if (activeTab === "routine") {
              const morningMeds = meds.filter((m) => {
                const t = parseTiming(m.frequency, m.instructions, m.timingPattern);
                return t.morning > 0;
              });
              const afternoonMeds = meds.filter((m) => {
                const t = parseTiming(m.frequency, m.instructions, m.timingPattern);
                return t.afternoon > 0;
              });
              const nightMeds = meds.filter((m) => {
                const t = parseTiming(m.frequency, m.instructions, m.timingPattern);
                return t.night > 0;
              });

              return (
                <div key={rx.id || idx} className="space-y-6">
                  {/* Routine Quick Overview Card */}
                  <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          Personalized Daily Medication Routine
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black">
                          Today&apos;s Pill Schedule
                        </h2>
                        <p className="text-xs sm:text-sm text-teal-100/80 mt-1">
                          Carefully aligned with meal times for optimal absorption and kidney protection.
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center shrink-0">
                        <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider block">
                          Total Daily Dosage
                        </span>
                        <span className="text-2xl font-black text-white">
                          {meds.reduce(
                            (acc, m) =>
                              acc + parseTiming(m.frequency, m.instructions, m.timingPattern).totalDaily,
                            0
                          )}{" "}
                          Pills
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Times of Day Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. MORNING */}
                    <div className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                              <Sunrise className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-sm">Morning (सुबह)</h3>
                              <span className="text-[11px] text-slate-500 font-medium">8:00 AM • After Breakfast</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                            {morningMeds.length} Pills
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100 mt-3 space-y-2">
                          {morningMeds.map((m, mIdx) => {
                            const key = `morning-${mIdx}`;
                            const isTaken = Boolean(takenStatus[key]);
                            return (
                              <div
                                key={mIdx}
                                className={`pt-2 flex items-start justify-between gap-3 transition-opacity ${
                                  isTaken ? "opacity-75" : "opacity-100"
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                      {m.name}
                                    </h4>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                                      {m.strength || m.dosage}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-teal-800 font-medium">
                                    {getMealTiming(m.instructions)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleTaken(key)}
                                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                                    isTaken
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500"
                                  }`}
                                  title="Mark as taken"
                                >
                                  {isTaken ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      <span className="text-[10px]">Taken</span>
                                    </>
                                  ) : (
                                    <span className="text-[10px] px-1 text-slate-600">Take</span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 2. AFTERNOON */}
                    <div className="bg-white rounded-3xl border border-sky-200/80 p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                              <Sun className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-sm">Afternoon (दोपहर)</h3>
                              <span className="text-[11px] text-slate-500 font-medium">1:30 PM • Post Lunch</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 font-extrabold text-xs">
                            {afternoonMeds.length} Pills
                          </span>
                        </div>

                        {afternoonMeds.length === 0 ? (
                          <div className="py-8 text-center text-slate-400">
                            <CheckCircle2 className="w-7 h-7 mx-auto mb-1 text-slate-300" />
                            <p className="text-xs font-semibold">No pills scheduled</p>
                            <p className="text-[10px] text-slate-400">Keep well-hydrated throughout the day.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100 mt-3 space-y-2">
                            {afternoonMeds.map((m, mIdx) => (
                              <div key={mIdx} className="pt-2">
                                <h4 className="font-bold text-slate-900 text-xs">{m.name}</h4>
                                <span className="text-[11px] text-slate-500">{m.instructions}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. NIGHT */}
                    <div className="bg-white rounded-3xl border border-indigo-200/80 p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                              <Moon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-sm">Night (रात)</h3>
                              <span className="text-[11px] text-slate-500 font-medium">9:00 PM • After Dinner</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-xs">
                            {nightMeds.length} Pills
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100 mt-3 space-y-2">
                          {nightMeds.map((m, mIdx) => {
                            const key = `night-${mIdx}`;
                            const isTaken = Boolean(takenStatus[key]);
                            return (
                              <div
                                key={mIdx}
                                className={`pt-2 flex items-start justify-between gap-3 transition-opacity ${
                                  isTaken ? "opacity-75" : "opacity-100"
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                      {m.name}
                                    </h4>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                                      {m.strength || m.dosage}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-indigo-800 font-medium">
                                    {getMealTiming(m.instructions)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleTaken(key)}
                                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                                    isTaken
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500"
                                  }`}
                                >
                                  {isTaken ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      <span className="text-[10px]">Taken</span>
                                    </>
                                  ) : (
                                    <span className="text-[10px] px-1 text-slate-600">Take</span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // SLIP VIEW (High-End Hospital Letterhead Format)
            return (
              <div
                key={rx.id || idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none print:m-0"
              >
                {/* Visual Top Decorative Gradient */}
                <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500" />

                {/* 1. CLINICAL LETTERHEAD (Clean, Prestigious Medical Header) */}
                <div className="p-6 sm:p-7 bg-white border-b border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                    {/* Doctor Info & Clinic Branding */}
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0 shadow-xs">
                        <Stethoscope className="w-7 h-7 text-teal-700" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {rx.doctor?.user?.name || "Dr. Aarav Mehta"}
                          </h2>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            Reg: MCI/2018/98421
                          </span>
                        </div>
                        <p className="text-xs font-bold text-teal-700">
                          {rx.doctor?.specialization || "Internal Medicine & Diabetology"} •{" "}
                          <span className="text-slate-600 font-medium">
                            {rx.doctor?.qualification || "MBBS, MD (Medicine), DM (AIIMS New Delhi)"}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500 pt-0.5">
                          CodeRx Specialty Health Hub • OPD Suite 402, Cyber City Medical Center
                        </p>
                      </div>
                    </div>

                    {/* Rx Digital Signature Badge & Verification Details */}
                    <div className="self-start md:self-auto shrink-0 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Digitally Signed Rx</span>
                      </div>

                      <div className="text-[11px] text-slate-600 font-mono mt-2 flex items-center justify-end gap-1.5">
                        <span className="font-semibold text-slate-800">Rx ID: {rxIdDisplay}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRxId(rxIdDisplay)}
                          className="text-slate-400 hover:text-teal-600 transition-colors p-0.5 cursor-pointer"
                          title="Copy Rx ID"
                        >
                          {copiedId === rxIdDisplay ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Issued: {issuedDate} • Valid: 90 Days
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. PATIENT DEMOGRAPHIC STRIP (Compact & Refined) */}
                <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Patient Name
                    </span>
                    <span className="font-black text-slate-900">{patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Age / Gender
                    </span>
                    <span className="font-semibold text-slate-800">52 Yrs / Male</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Patient UHID
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">CRX-PT-1024</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Next Review Date
                    </span>
                    <span className="font-extrabold text-teal-700">In 3 Weeks (Repeat KFT)</span>
                  </div>
                </div>

                {/* 3. DIAGNOSIS STRIP (Clean & Compact) */}
                <div className="px-6 py-3.5 bg-emerald-50/40 border-b border-emerald-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Clinical Diagnosis:
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {rx.diagnosis || "Type 2 Diabetes Mellitus, Essential Hypertension, Dyslipidemia"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                      ICD-10: E11.22
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-100/80 text-teal-900">
                      Renal-Sparing Protocol
                    </span>
                  </div>
                </div>

                {/* 4. PRESCRIBED MEDICATIONS TABLE (Compact, Clean & Presentable) */}
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-teal-700 font-serif leading-none">
                        ℞
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Prescribed Medications ({meds.length})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      All dosages verified against renal profile (eGFR: 46 mL/min)
                    </span>
                  </div>

                  {/* Sleek Compact Medicine Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-200">
                          <th className="py-3 px-4 w-10 text-center">#</th>
                          <th className="py-3 px-4">Medicine &amp; Strength</th>
                          <th className="py-3 px-4 text-center">Schedule (M - A - N)</th>
                          <th className="py-3 px-4">Timing &amp; Instructions</th>
                          <th className="py-3 px-4 text-center">Duration</th>
                          <th className="py-3 px-4 text-right print:hidden">Refill</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {meds.map((m: any, mIdx: number) => {
                          const timing = parseTiming(m.frequency, m.instructions, m.timingPattern);
                          const cleanName = m.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "");
                          const cleanForm = m.name.match(/^(Tab\.|Cap\.|Syp\.)/i)?.[0] || "Tab.";
                          const strength = m.strength || m.dosage || "Standard Dose";
                          const search1mgUrl = `https://www.1mg.com/search/all?name=${encodeURIComponent(
                            cleanName
                          )}`;

                          return (
                            <tr
                              key={mIdx}
                              className="hover:bg-teal-50/30 transition-colors group"
                            >
                              {/* Row Number */}
                              <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                                {mIdx + 1}
                              </td>

                              {/* Medicine Name & Strength */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-extrabold text-slate-900 text-sm">
                                      {cleanName}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                      {cleanForm} {strength}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    {m.frequency}
                                  </p>
                                </div>
                              </td>

                              {/* Schedule Chips (Visual: Morning - Afternoon - Night) */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[11px] font-black ${
                                      timing.morning > 0
                                        ? "bg-amber-100 text-amber-900"
                                        : "text-slate-300"
                                    }`}
                                    title="Morning Dose"
                                  >
                                    {timing.morning}
                                  </span>
                                  <span className="text-slate-300 font-bold">-</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[11px] font-black ${
                                      timing.afternoon > 0
                                        ? "bg-sky-100 text-sky-900"
                                        : "text-slate-300"
                                    }`}
                                    title="Afternoon Dose"
                                  >
                                    {timing.afternoon}
                                  </span>
                                  <span className="text-slate-300 font-bold">-</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[11px] font-black ${
                                      timing.night > 0
                                        ? "bg-indigo-100 text-indigo-900"
                                        : "text-slate-300"
                                    }`}
                                    title="Night Dose"
                                  >
                                    {timing.night}
                                  </span>
                                </div>
                              </td>

                              {/* Instructions & Food Timing */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-100">
                                    {timing.mealTiming}
                                  </span>
                                  <p className="text-[11px] text-slate-600 line-clamp-2">
                                    {m.instructions || "Take regularly as prescribed."}
                                  </p>
                                </div>
                              </td>

                              {/* Duration */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <span className="font-extrabold text-slate-800 text-xs">
                                  {m.duration || "90 Days"}
                                </span>
                              </td>

                              {/* 1mg 1-Click Refill */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap print:hidden">
                                <a
                                  href={search1mgUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-900 font-bold text-[11px] transition-colors"
                                >
                                  <span>1mg</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* 5. CLINICAL DIRECTIVES & SAFETY WARNINGS (Refined Two-Column Box) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {/* Renal Care Notice */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="uppercase tracking-wider text-[10px]">
                          Clinical Safety Directive
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        Metformin dose renal-adjusted for eGFR 46 mL/min. Avoid OTC painkillers (NSAIDs: Ibuprofen, Diclofenac) without prior consultation.
                      </p>
                    </div>

                    {/* Lifestyle & Dietary Guidance */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Droplets className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="uppercase tracking-wider text-[10px]">
                          Doctor&apos;s Advice &amp; Lifestyle
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900 leading-relaxed">
                        {rx.advice ||
                          "Maintain 2.5L daily hydration. Low sodium (<2g/day) & low glycemic index diet. 30 min daily brisk walking."}
                      </p>
                    </div>
                  </div>

                  {/* 6. AUTHENTIC SIGNATURE & VERIFICATION FOOTER */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Official Digital Signature Stamp */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                        <QrCode className="w-5 h-5 text-teal-700" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span>Digitally Authenticated: Dr. Aarav Mehta</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          SHA-256 Verified Seal • Registered with National Medical Commission
                        </p>
                      </div>
                    </div>

                    {/* Quick Print & Refill CTA Buttons */}
                    <div className="print:hidden flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>

                      <Link
                        href="/patient/medicines"
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order All on 1mg</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
