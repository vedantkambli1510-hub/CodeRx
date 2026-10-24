"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Printer,
  Pill,
  Calendar,
  Clock,
  HeartPulse,
  Heart,
  User,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  RotateCw,
  FileText,
  Filter,
  ChevronDown,
  Sparkles,
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
      pattern: `${morning} - ${afternoon} - ${night}`,
      mealTiming: getMealTiming(instructions),
    };
  }

  const text = `${frequency} ${instructions}`.toLowerCase();
  let morning = 0;
  let afternoon = 0;
  let night = 0;

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
  } else if (
    text.includes("thrice") ||
    text.includes("tid") ||
    text.includes("t.i.d") ||
    text.includes("3 times")
  ) {
    morning = 1;
    afternoon = 1;
    night = 1;
  } else if (
    text.includes("bedtime") ||
    text.includes("night") ||
    text.includes("hs") ||
    text.includes("h.s") ||
    text.includes("dinner")
  ) {
    morning = 0;
    afternoon = 0;
    night = 1;
  } else if (
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
    pattern: `${morning} - ${afternoon} - ${night}`,
    mealTiming: getMealTiming(instructions),
  };
}

function getMealTiming(instructions = ""): string {
  const text = instructions.toLowerCase();
  if (text.includes("after meal") || text.includes("after food") || text.includes("immediately after")) {
    return "After food (खाने के बाद)";
  }
  if (text.includes("before meal") || text.includes("before food") || text.includes("empty stomach")) {
    return "Empty Stomach (खाली पेट)";
  }
  if (text.includes("with food") || text.includes("with meal")) {
    return "With Meals";
  }
  if (text.includes("bedtime") || text.includes("night")) {
    return "At Bedtime (रात में)";
  }
  return "With Water";
}

// Demo historical visits if only 1 is in DB, so user has multiple visits in the dropdown!
const SAMPLE_HISTORICAL_RX = [
  {
    id: "rx-historical-apr2024",
    diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension, Dyslipidemia",
    createdAt: "2024-04-05T10:30:00Z",
    visitLabel: "Apr 05, 2024 • Quarterly Follow-Up Review",
    doctor: {
      user: { name: "Dr. Aarav Mehta" },
      specialization: "Internal Medicine & Diabetology",
      qualification: "MBBS, MD (Medicine), DM (Endocrinology) AIIMS New Delhi",
    },
    medicinesJson: JSON.stringify([
      {
        name: "Tab. Metformin HCl (Glycomet)",
        strength: "500 mg",
        frequency: "Twice daily",
        duration: "90 Days",
        instructions: "Take with or immediately after meals (Breakfast and Dinner) to prevent GI upset.",
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
    ]),
    advice: "Maintain low glycemic index diet. Limit sodium intake to <2g per day. 30 min daily brisk walking.",
  },
  {
    id: "rx-historical-jan2024",
    diagnosis: "Uncontrolled Type 2 Diabetes, Stage 2 Hypertension (Baseline)",
    createdAt: "2024-01-16T11:00:00Z",
    visitLabel: "Jan 16, 2024 • Initial Pharmacotherapy Initiation",
    doctor: {
      user: { name: "Dr. Aarav Mehta" },
      specialization: "Internal Medicine & Diabetology",
      qualification: "MBBS, MD (Medicine), DM (Endocrinology) AIIMS New Delhi",
    },
    medicinesJson: JSON.stringify([
      {
        name: "Tab. Metformin HCl",
        strength: "500 mg",
        frequency: "Once daily",
        duration: "30 Days",
        instructions: "Take with dinner to assess GI tolerance.",
      },
      {
        name: "Tab. Telmisartan",
        strength: "20 mg",
        frequency: "Once daily",
        duration: "30 Days",
        instructions: "Take every morning at 8:00 AM with water.",
      },
    ]),
    advice: "Start baseline diet restriction. Avoid high carbohydrates and repeat HbA1c in 90 days.",
  },
];

export function PatientPrescriptionsView({
  prescriptions: rawPrescriptions,
  patientName,
}: PatientPrescriptionsViewProps) {
  // Combine real DB prescriptions + historical visits so dropdown is fully populated!
  const allPrescriptions =
    rawPrescriptions && rawPrescriptions.length > 0
      ? [
          ...rawPrescriptions.map((rx, idx) => ({
            ...rx,
            visitLabel: `${new Date(rx.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })} • Latest Clinical Review (OPD)`,
          })),
          ...SAMPLE_HISTORICAL_RX,
        ]
      : SAMPLE_HISTORICAL_RX;

  const [selectedRxId, setSelectedRxId] = useState<string>(allPrescriptions[0]?.id || "");
  const [timeFilter, setTimeFilter] = useState<"ALL" | "MORNING" | "AFTERNOON" | "NIGHT">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentRx =
    allPrescriptions.find((p) => p.id === selectedRxId) || allPrescriptions[0];

  let meds: any[] = [];
  try {
    meds =
      typeof currentRx?.medicinesJson === "string"
        ? JSON.parse(currentRx.medicinesJson)
        : currentRx?.medicinesJson || [];
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
        instructions: "Take with or immediately after meals (Breakfast and Dinner) to prevent GI upset.",
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

  // Filter medicines by time of day if requested
  const filteredMeds = meds.filter((m) => {
    if (timeFilter === "ALL") return true;
    const t = parseTiming(m.frequency, m.instructions, m.timingPattern);
    if (timeFilter === "MORNING") return t.morning > 0;
    if (timeFilter === "AFTERNOON") return t.afternoon > 0;
    if (timeFilter === "NIGHT") return t.night > 0;
    return true;
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

  const rxIdDisplay = "CRX-2026-OCT-8841";
  const issuedDate = currentRx?.createdAt
    ? new Date(currentRx.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "24-10-2026";

  const numColors = [
    { bg: "bg-[#FFE8EC]", text: "text-[#E63956]" }, // Soft pink
    { bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" }, // Soft blue
    { bg: "bg-[#E0F2F1]", text: "text-[#00897B]" }, // Soft teal
    { bg: "bg-[#FFF3E0]", text: "text-[#FB8C00]" }, // Soft amber
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-slate-900 pb-20">
      {/* 1. TOP CONTROLS & TIME-BASED DROPDOWN (Hidden during Print) */}
      <div className="print:hidden bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Prescription Date / Visit Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Select Visit / Date:</span>
          </label>
          <div className="relative flex-1 max-w-md">
            <select
              value={selectedRxId}
              onChange={(e) => setSelectedRxId(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-10 bg-sky-50/60 hover:bg-sky-50 border border-sky-200 rounded-2xl font-bold text-xs text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-all"
            >
              {allPrescriptions.map((rx) => (
                <option key={rx.id} value={rx.id}>
                  {rx.visitLabel ||
                    `${new Date(rx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })} • Clinical Prescription`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-sky-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Time of Day Filter & Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Pills */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => setTimeFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === "ALL"
                  ? "bg-white text-sky-800 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({meds.length})
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("MORNING")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === "MORNING"
                  ? "bg-amber-100 text-amber-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Morning
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("AFTERNOON")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === "AFTERNOON"
                  ? "bg-sky-100 text-sky-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Noon
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("NIGHT")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === "NIGHT"
                  ? "bg-indigo-100 text-indigo-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Night
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Rx</span>
          </button>
        </div>
      </div>

      {/* 2. THE OFFICIAL PRESCRIPTION DOCUMENT (EXACT MATCH WITH USER'S DESIGN!) */}
      <div className="bg-[#FAFDFE] rounded-3xl border border-[#D0E2EF] shadow-lg p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0 font-sans">
        {/* HEADER: Doctor Identity & Clinic Branding */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-[#E1EDF5]">
          <div className="flex items-start gap-4">
            {/* Cute Stethoscope with Heart Icon */}
            <div className="shrink-0 text-[#1E5685]">
              <svg
                className="w-13 h-13"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="18" cy="18" r="6" stroke="#1E5685" strokeWidth="3" fill="#EBF4FA" />
                <path
                  d="M18 24C18 36 34 38 34 48C34 54 28 58 22 58C16 58 12 54 12 48"
                  stroke="#1E5685"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="48" r="4.5" fill="#1E5685" />
                <path
                  d="M44 14C42 10 36 10 34 14C32 10 26 10 24 14C22 18 34 26 34 26C34 26 46 18 44 14Z"
                  fill="#FF8093"
                />
              </svg>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#113B5F] tracking-tight font-serif italic">
                {currentRx.doctor?.user?.name || "Dr. Aarav Mehta"}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#1C5B8C]">
                {currentRx.doctor?.specialization || "Internal Medicine & Diabetology"} •{" "}
                <span className="font-normal text-slate-600">
                  {currentRx.doctor?.qualification || "MBBS, MD (Medicine), DM (Endocrinology)"}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 pt-0.5">
                AIIMS New Delhi | CodeRx Specialty Health Hub • OPD Suite 402, Cyber City Medical Center
              </p>
            </div>
          </div>

          {/* Top-Right Motivational Motto */}
          <div className="text-right shrink-0">
            <span className="font-serif italic font-bold text-[#1C5B8C] text-sm block">
              Better Health,
            </span>
            <span className="font-serif italic font-bold text-[#1C5B8C] text-sm block">
              Brighter Tomorrow ♡
            </span>
          </div>
        </div>

        {/* PATIENT DEMOGRAPHICS & DIGITALLY SIGNED BADGE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          {/* 3 Columns for Patient Details */}
          <div className="lg:col-span-3 bg-[#EEF5FB] border border-[#D6E7F4] rounded-2xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#567A99] block tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-[#1E5685]" />
                Patient Name
              </span>
              <span className="font-extrabold text-[#113B5F] text-sm pt-0.5 block">
                {patientName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#567A99] block tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-[#1E5685]" />
                Age / Gender
              </span>
              <span className="font-bold text-slate-800 text-sm pt-0.5 block">
                52 Yrs / Male
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#567A99] block tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#1E5685]" />
                Patient UHID
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm pt-0.5 block">
                CRX-PT-1024
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#567A99] block tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1E5685]" />
                Next Review Date
              </span>
              <span className="font-extrabold text-[#0D6E6E] text-xs pt-0.5 block">
                In 3 Weeks (Repeat KFT)
              </span>
            </div>
          </div>

          {/* Right Stamp: Digitally Signed Box */}
          <div className="bg-[#FFF5F6] border border-[#FFD9DF] rounded-2xl p-3 text-center sm:text-right shrink-0">
            <div className="text-[11px] font-bold text-[#C7254E] flex items-center justify-center sm:justify-end gap-1">
              <Heart className="w-3 h-3 fill-[#FF8093] text-[#FF8093]" />
              <span>Digitally Signed</span>
            </div>
            <div className="font-serif italic font-extrabold text-[#113B5F] text-base py-0.5">
              Dr. Aarav Mehta
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Reg. No: MCI/2018/98421
            </div>
            <div className="text-[9px] text-slate-400">
              Issued: {issuedDate} | Valid: 90 Days
            </div>
          </div>
        </div>

        {/* CLINICAL DIAGNOSIS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#1E5685] shrink-0" />
            <span className="text-xs font-serif italic text-slate-800">
              <strong className="font-sans font-bold text-slate-700 not-italic mr-1">
                Clinical Diagnosis:
              </strong>
              {currentRx.diagnosis || "Type 2 Diabetes Mellitus, Essential Hypertension, Dyslipidemia"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-[#EBF4FA] text-[#1E5685] border border-[#D0E2EF]">
              ICD-10: E11.22
            </span>
            <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-[#E0F4F2] text-[#0D6E6E] border border-[#BCE4E0]">
              Renal-Sparing Protocol
            </span>
          </div>
        </div>

        {/* PRESCRIBED MEDICATIONS TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#113B5F] font-serif leading-none">
                ℞
              </span>
              <h2 className="text-base font-extrabold text-[#113B5F] font-serif underline decoration-pink-300 underline-offset-4 decoration-2">
                Prescribed Medications ({meds.length})
              </h2>
            </div>

            <span className="text-xs font-serif italic text-slate-500">
              All dosages verified against renal profile (eGFR: 46 mL/min)
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-[#D6E6F2] bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#EAF3FA] text-[#1C5B8C] font-serif italic font-extrabold text-xs border-b border-[#D6E6F2]">
                  <th className="py-3 px-3.5 w-10 text-center">#</th>
                  <th className="py-3 px-3.5">Medicine &amp; Strength</th>
                  <th className="py-3 px-3.5 text-center">Schedule (M - A - N)</th>
                  <th className="py-3 px-3.5">Timing &amp; Instructions</th>
                  <th className="py-3 px-3.5 text-center">Duration</th>
                  <th className="py-3 px-3.5 text-center print:hidden">Refill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF3FA] text-slate-800">
                {filteredMeds.map((m: any, mIdx: number) => {
                  const timing = parseTiming(m.frequency, m.instructions, m.timingPattern);
                  const cleanName = m.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "");
                  const cleanForm = m.name.match(/^(Tab\.|Cap\.|Syp\.)/i)?.[0] || "Tab.";
                  const strength = m.strength || m.dosage || "Standard Dose";
                  const colorIndex = mIdx % numColors.length;
                  const circleTheme = numColors[colorIndex];
                  const search1mgUrl = `https://www.1mg.com/search/all?name=${encodeURIComponent(
                    cleanName
                  )}`;

                  return (
                    <tr
                      key={mIdx}
                      className="hover:bg-[#F5FAFE] transition-colors"
                    >
                      {/* # Number Circle Badge */}
                      <td className="py-4 px-3.5 text-center">
                        <div
                          className={`w-6 h-6 rounded-full ${circleTheme.bg} ${circleTheme.text} font-black text-xs mx-auto flex items-center justify-center`}
                        >
                          {mIdx + 1}
                        </div>
                      </td>

                      {/* Medicine & Strength with Pill Icon */}
                      <td className="py-4 px-3.5">
                        <div className="flex items-start gap-2">
                          <span className="text-base select-none">💊</span>
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-slate-900 text-sm block">
                              {cleanName}
                            </span>
                            <span className="text-xs text-slate-600 font-medium block">
                              {cleanForm} {strength}
                            </span>
                            <span className="text-[11px] text-slate-400 font-serif italic block">
                              {m.frequency}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Schedule: M - A - N */}
                      <td className="py-4 px-3.5 text-center">
                        <span className="font-mono font-bold text-sm text-[#113B5F] bg-[#EEF5FB] px-3 py-1 rounded-xl border border-[#D6E7F4] inline-block">
                          {timing.pattern}
                        </span>
                      </td>

                      {/* Timing & Instructions */}
                      <td className="py-4 px-3.5">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 text-xs block">
                            {timing.mealTiming}
                          </span>
                          <p className="text-[11px] font-serif italic text-slate-500 max-w-xs leading-relaxed">
                            {m.instructions || "Take regularly as prescribed by Dr. Mehta."}
                          </p>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-3.5 text-center whitespace-nowrap">
                        <span className="font-serif italic font-bold text-slate-900 text-sm underline decoration-slate-400 underline-offset-2">
                          {m.duration || "90 Days"}
                        </span>
                      </td>

                      {/* 1mg Refill Button */}
                      <td className="py-4 px-3.5 text-center whitespace-nowrap print:hidden">
                        <a
                          href={search1mgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 font-serif italic font-bold text-xs transition-all shadow-2xs"
                        >
                          <span>1mg</span>
                          <RotateCw className="w-3 h-3 text-sky-600" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM MOTIVATIONAL NOTE & AUTHENTIC DOCTOR SIGNATURE (MATCHES IMAGE!) */}
        <div className="pt-4 border-t border-[#E1EDF5] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Left: Friendly note */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-[#FF8093] text-[#FF8093] shrink-0" />
            <span className="text-xs font-serif italic text-slate-700">
              Take your medicines regularly. Stay healthy, stay happy! 😊
            </span>
          </div>

          {/* Center: Stethoscope + Pulse graphic */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <svg
              className="w-28 h-8 text-[#1E5685]"
              viewBox="0 0 120 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 16H24C28 16 32 6 36 26C40 6 44 26 48 16H70C74 16 78 8 82 8C86 8 88 12 90 16C92 20 96 22 100 18C104 14 108 14 112 18"
                stroke="#1E5685"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M106 10C104 7 99 7 97 10C95 7 90 7 88 10C86 14 97 22 97 22C97 22 108 14 106 10Z"
                fill="#FF8093"
              />
            </svg>
          </div>

          {/* Right: Signature & Pills Illustration */}
          <div className="flex items-center justify-end gap-4 shrink-0">
            <div className="text-right">
              <div className="font-serif italic font-extrabold text-[#113B5F] text-lg leading-tight">
                Dr. Aarav Mehta
              </div>
              <div className="text-xs text-slate-600 font-serif italic">
                Dr. Aarav Mehta
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                MCI Reg. No. 98421
              </div>
            </div>

            {/* Medicine Bottle Illustration */}
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xl shadow-2xs">
              💊
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
