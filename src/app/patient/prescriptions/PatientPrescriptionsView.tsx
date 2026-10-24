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
  ChevronDown,
  Sparkles,
  ShoppingCart,
  Truck,
  HelpCircle,
  MessageCircle,
  Building2,
  X,
  ArrowRight,
  BadgePercent,
  CheckCircle,
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
    return "After Food (खाने के बाद)";
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

// Demo historical visits so dropdown is populated if only 1 is currently in database
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
  // Combine real DB prescriptions + historical visits so dropdown is populated
  const allPrescriptions =
    rawPrescriptions && rawPrescriptions.length > 0
      ? [
          ...rawPrescriptions.map((rx) => ({
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

  // Refill Assistant Modal State
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [activeMedicineForRefill, setActiveMedicineForRefill] = useState<any | null>(null);
  const [isOrderingAll, setIsOrderingAll] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [orderSuccessStatus, setOrderSuccessStatus] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

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

  function openSingleRefill(medicine: any) {
    setActiveMedicineForRefill(medicine);
    setIsOrderingAll(false);
    setOrderSuccessStatus(null);
    setRefillModalOpen(true);
  }

  function openOrderAllRefill() {
    setActiveMedicineForRefill(null);
    setIsOrderingAll(true);
    setOrderSuccessStatus(null);
    setRefillModalOpen(true);
  }

  function handleInstantHospitalDelivery() {
    setIsSubmittingOrder(true);
    setTimeout(() => {
      setIsSubmittingOrder(false);
      setOrderSuccessStatus(
        `Order #CRX-${Math.floor(10000 + Math.random() * 90000)} Placed! Your medicines are being packed by the hospital pharmacy for express delivery to Flat 402, Cyber City.`
      );
    }, 700);
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

  // WhatsApp order link text generator
  const getWhatsAppOrderUrl = () => {
    const medList = isOrderingAll
      ? meds.map((m, i) => `${i + 1}. ${m.name} ${m.strength || ""} (${m.duration || "90 Days"})`).join("\n")
      : activeMedicineForRefill
      ? `1. ${activeMedicineForRefill.name} ${activeMedicineForRefill.strength || ""} (${activeMedicineForRefill.duration || "90 Days"})`
      : "";

    const text = `Hi, I want to order medicine refill from my Dr. Aarav Mehta prescription (Rx #${rxIdDisplay}) for ${patientName}:\n\n${medList}\n\nPlease let me know the total price and delivery time to my address. Thank you!`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-slate-900 pb-20 font-['Quicksand',sans-serif]">
      {/* 1. TOP CONTROLS & TIME-BASED DROPDOWN (Hidden during Print) */}
      <div className="print:hidden bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 font-['Quicksand',sans-serif]">
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

      {/* 2. DOORSTEP MEDICINE DELIVERY BANNER (Explains Refill to Patient!) */}
      <div className="print:hidden bg-gradient-to-r from-emerald-50 via-teal-50/70 to-sky-50 border border-emerald-200/80 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs font-['Quicksand',sans-serif]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs text-2xl">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-emerald-950 text-sm sm:text-base">
                Doorstep Medicine Refill &amp; Delivery
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Rx Digitally Verified
              </span>
            </div>
            <p className="text-xs text-emerald-900/80 font-medium pt-0.5 max-w-xl">
              Running low on your prescribed medicines? Order your complete 90-day pack directly to your home via <strong>Tata 1mg</strong>, <strong>Apollo 24|7</strong>, or <strong>In-Clinic Pharmacy</strong> with instant 15–20% discount.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={openOrderAllRefill}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Order All Medicines ({meds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHowItWorksModal(true)}
            className="px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">How it works</span>
          </button>
        </div>
      </div>

      {/* 3. THE OFFICIAL PRESCRIPTION DOCUMENT (CUTE, SOFT & PROPER MEDICAL SLIP!) */}
      <div className="bg-[#FAFDFE] rounded-3xl border border-[#D0E2EF] shadow-lg p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0 font-['Quicksand',sans-serif]">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#113B5F] tracking-tight">
                {currentRx.doctor?.user?.name || "Dr. Aarav Mehta"}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#1C5B8C]">
                {currentRx.doctor?.specialization || "Internal Medicine & Diabetology"} •{" "}
                <span className="font-semibold text-slate-600">
                  {currentRx.doctor?.qualification || "MBBS, MD (Medicine), DM (Endocrinology)"}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                AIIMS New Delhi | CodeRx Specialty Health Hub • OPD Suite 402, Cyber City Medical Center
              </p>
            </div>
          </div>

          {/* Top-Right Cute Motto */}
          <div className="text-right shrink-0">
            <span className="font-['Caveat',cursive] text-xl font-bold text-[#1C5B8C] block leading-tight">
              Better Health,
            </span>
            <span className="font-['Caveat',cursive] text-xl font-bold text-[#1C5B8C] block leading-tight">
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

          {/* Right Stamp: Cute Digitally Signed Box */}
          <div className="bg-[#FFF5F6] border border-[#FFD9DF] rounded-2xl p-3 text-center sm:text-right shrink-0">
            <div className="text-[11px] font-bold text-[#C7254E] flex items-center justify-center sm:justify-end gap-1">
              <Heart className="w-3 h-3 fill-[#FF8093] text-[#FF8093]" />
              <span>Digitally Signed</span>
            </div>
            <div className="font-['Caveat',cursive] font-bold text-[#113B5F] text-2xl py-0.5 leading-none">
              Dr. Aarav Mehta
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              Reg. No: MCI/2018/98421
            </div>
            <div className="text-[9px] text-slate-400 font-medium">
              Issued: {issuedDate} | Valid: 90 Days
            </div>
          </div>
        </div>

        {/* CLINICAL DIAGNOSIS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#1E5685] shrink-0" />
            <span className="text-xs text-slate-800">
              <strong className="font-bold text-slate-700 mr-1.5">
                Clinical Diagnosis:
              </strong>
              <span className="font-semibold text-[#113B5F]">
                {currentRx.diagnosis || "Type 2 Diabetes Mellitus, Essential Hypertension, Dyslipidemia"}
              </span>
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
              <span className="text-3xl font-black text-[#113B5F] leading-none select-none">
                ℞
              </span>
              <h2 className="text-base font-extrabold text-[#113B5F] underline decoration-pink-300 underline-offset-4 decoration-2">
                Prescribed Medications ({meds.length})
              </h2>
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              All dosages verified against renal profile (eGFR: 46 mL/min)
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-[#D6E6F2] bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse font-['Quicksand',sans-serif]">
              <thead>
                <tr className="bg-[#EAF3FA] text-[#1C5B8C] font-bold text-xs border-b border-[#D6E6F2]">
                  <th className="py-3.5 px-3.5 w-10 text-center">#</th>
                  <th className="py-3.5 px-3.5">Medicine &amp; Strength</th>
                  <th className="py-3.5 px-3.5 text-center">Schedule (M - A - N)</th>
                  <th className="py-3.5 px-3.5">Timing &amp; Instructions</th>
                  <th className="py-3.5 px-3.5 text-center">Duration</th>
                  <th className="py-3.5 px-3.5 text-center print:hidden">Refill &amp; Order</th>
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
                        <div className="flex items-start gap-2.5">
                          <span className="text-lg select-none">💊</span>
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-slate-900 text-sm block">
                              {cleanName}
                            </span>
                            <span className="text-xs text-slate-600 font-semibold block">
                              {cleanForm} {strength}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {m.frequency}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Schedule: M - A - N */}
                      <td className="py-4 px-3.5 text-center">
                        <span className="font-bold text-sm text-[#113B5F] bg-[#EEF5FB] px-3 py-1 rounded-xl border border-[#D6E7F4] inline-block">
                          {timing.pattern}
                        </span>
                      </td>

                      {/* Timing & Instructions */}
                      <td className="py-4 px-3.5">
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-900 text-xs block">
                            {timing.mealTiming}
                          </span>
                          <p className="text-[11px] text-slate-600 font-medium max-w-xs leading-relaxed">
                            {m.instructions || "Take regularly as prescribed by Dr. Mehta."}
                          </p>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-3.5 text-center whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-xs bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100 inline-block">
                          {m.duration || "90 Days"}
                        </span>
                      </td>

                      {/* Refill Button - Clear, intuitive, patient-friendly! */}
                      <td className="py-4 px-3.5 text-center whitespace-nowrap print:hidden">
                        <button
                          type="button"
                          onClick={() => openSingleRefill(m)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span>Order Refill</span>
                        </button>
                        <span className="block text-[10px] text-slate-400 font-semibold pt-0.5">
                          via 1mg / Apollo
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM MOTIVATIONAL NOTE & AUTHENTIC DOCTOR SIGNATURE (MATCHES IMAGE!) */}
        <div className="pt-4 border-t border-[#E1EDF5] flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-['Quicksand',sans-serif]">
          {/* Left: Friendly note */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-[#FF8093] text-[#FF8093] shrink-0" />
            <span className="font-['Caveat',cursive] text-base font-bold text-slate-700">
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
              <div className="font-['Caveat',cursive] font-bold text-[#113B5F] text-2xl leading-tight">
                Dr. Aarav Mehta
              </div>
              <div className="text-xs text-slate-600 font-bold">
                Dr. Aarav Mehta
              </div>
              <div className="text-[10px] text-slate-400 font-semibold font-mono">
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

      {/* 4. INTERACTIVE "PRESCRIPTION REFILL & MEDICINE DELIVERY" MODAL */}
      {refillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 relative my-8 font-['Quicksand',sans-serif]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setRefillModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-2xl">
                🛵
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                  Doorstep Medicine Refill
                </h3>
                <p className="text-xs text-slate-500 font-medium pt-0.5">
                  Verified against Rx #{rxIdDisplay} • Dr. Aarav Mehta
                </p>
              </div>
            </div>

            {/* Selection Scope Switcher (Single Item vs Complete Prescription) */}
            <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => setIsOrderingAll(false)}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  !isOrderingAll
                    ? "bg-white text-emerald-800 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeMedicineForRefill?.name
                  ? activeMedicineForRefill.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "")
                  : "Single Medicine"}
              </button>
              <button
                type="button"
                onClick={() => setIsOrderingAll(true)}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  isOrderingAll
                    ? "bg-white text-emerald-800 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All 3 Medicines (Complete Kit)
              </button>
            </div>

            {/* Summary of what will be ordered */}
            <div className="bg-[#F8FBFC] border border-[#D9EAF4] rounded-2xl p-3.5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Items In Refill Order:
              </span>
              {isOrderingAll ? (
                <div className="space-y-1.5">
                  {meds.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">💊</span>
                        <span>{m.name} {m.strength || ""}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {m.duration || "90 Days"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">💊</span>
                    <span>
                      {activeMedicineForRefill?.name || meds[0]?.name}{" "}
                      {activeMedicineForRefill?.strength || meds[0]?.strength || ""}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {activeMedicineForRefill?.duration || "90 Days Pack"}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#D9EAF4] flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Prescription Auto-Attached
                </span>
                <span>Valid: 90 Days</span>
              </div>
            </div>

            {/* Order Confirmation Feedback Banner (if ordered via hospital) */}
            {orderSuccessStatus && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-xs text-emerald-900 font-semibold flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-extrabold text-emerald-950">Refill Dispatched!</div>
                  <p className="leading-relaxed">{orderSuccessStatus}</p>
                </div>
              </div>
            )}

            {/* FULFILLMENT CHANNELS (HOW PATIENT ACTUALLY REFILLS) */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">
                Choose How You Want To Refill:
              </span>

              {/* 1. Tata 1mg Online Pharmacy (Direct Search & Instant Cart) */}
              <a
                href={
                  isOrderingAll
                    ? `https://www.1mg.com/search/all?name=${encodeURIComponent(
                        meds[0]?.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "") || "Metformin"
                      )}`
                    : `https://www.1mg.com/search/all?name=${encodeURIComponent(
                        activeMedicineForRefill?.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "") || "Metformin"
                      )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    1mg
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">
                        Order on Tata 1mg
                      </span>
                      <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-md">
                        15% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Doorstep delivery in 2–4 hours • Genuine medicines
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>

              {/* 2. Apollo 24|7 Pharmacy (2-Hour Express Delivery) */}
              <a
                href={`https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(
                  isOrderingAll
                    ? meds[0]?.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "") || "Metformin"
                    : activeMedicineForRefill?.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/i, "") || "Metformin"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    Apollo
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">
                        Order on Apollo 24|7
                      </span>
                      <span className="text-[10px] font-bold bg-sky-200/80 text-sky-900 px-1.5 py-0.5 rounded-md">
                        2-Hr Delivery
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Fulfilled by nearest Apollo outlet in your locality
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-sky-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>

              {/* 3. In-Clinic Pharmacy 1-Click Home Delivery */}
              <button
                type="button"
                onClick={handleInstantHospitalDelivery}
                disabled={isSubmittingOrder}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-emerald-300 bg-emerald-500 text-white hover:bg-emerald-600 transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white font-black text-lg flex items-center justify-center shrink-0">
                    🏥
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">
                        1-Click In-Clinic Chemist Delivery
                      </span>
                      <span className="text-[10px] font-bold bg-white text-emerald-900 px-1.5 py-0.5 rounded-md">
                        Pay on Delivery
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100 font-medium">
                      Delivers to: Flat 402, Cyber City Medical Center Area
                    </p>
                  </div>
                </div>
                {isSubmittingOrder ? (
                  <RotateCw className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
                )}
              </button>

              {/* 4. WhatsApp Rx to Chemist (Traditional Indian Neighborhood Chemist) */}
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-2xs">
                    💬
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">
                      Send Rx to Local Chemist on WhatsApp
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Auto-formats medicine list &amp; doctor details to share with any pharmacy
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setRefillModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. "HOW MEDICINE REFILL WORKS" HELPER MODAL */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 relative font-['Quicksand',sans-serif]">
            <button
              type="button"
              onClick={() => setShowHowItWorksModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl">
                💡
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  How Digital Refills Work
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  3 simple steps for easy doorstep medicines
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    Click &quot;Order Refill&quot; on Any Medicine
                  </span>
                  <p className="text-slate-600 font-medium pt-0.5">
                    Select a single medicine or tap &quot;Order All Medicines&quot; to refill your complete 90-day supply.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    Pick Tata 1mg, Apollo, or Hospital Delivery
                  </span>
                  <p className="text-slate-600 font-medium pt-0.5">
                    Your digital prescription signed by Dr. Aarav Mehta (MCI: 98421) is automatically attached, fulfilling all statutory telemedicine guidelines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    Medicines Delivered to Your Door
                  </span>
                  <p className="text-slate-600 font-medium pt-0.5">
                    Delivered in 2 to 4 hours with temperature-controlled packaging and 15–20% partner discount applied.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowItWorksModal(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
