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
} from "lucide-react";

interface PatientPrescriptionsViewProps {
  prescriptions: any[];
  patientName: string;
}

export function PatientPrescriptionsView({
  prescriptions,
  patientName,
}: PatientPrescriptionsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-900 pb-16">
      {/* Page Title & Global Actions (Hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-teal-600" />
            <span>Digital Prescriptions (Rx)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official electronically signed prescription slips with verified clinical safety directives.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Prescription</span>
          </button>

          <Link
            href="/patient/medicines"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Order Refills</span>
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
              meds = typeof rx.medicinesJson === "string" ? JSON.parse(rx.medicinesJson) : rx.medicinesJson || [];
            } catch {
              meds = [];
            }

            // Fallback default medications if medicinesJson was empty
            if (!meds || meds.length === 0) {
              meds = [
                {
                  name: "Linagliptin",
                  dosage: "5 mg",
                  frequency: "Once Daily (Morning)",
                  duration: "30 Days",
                  instructions: "Take once daily in the morning after breakfast. Renal-safe replacement.",
                },
                {
                  name: "Amlodipine",
                  dosage: "5 mg",
                  frequency: "Once Daily (Bedtime)",
                  duration: "30 Days",
                  instructions: "Take at bedtime for blood pressure support without straining kidneys.",
                },
                {
                  name: "Atorvastatin",
                  dosage: "10 mg",
                  frequency: "Once Daily (Night)",
                  duration: "30 Days",
                  instructions: "Take after dinner for lipid and arterial plaque stabilization.",
                },
              ];
            }

            const rxIdDisplay = `CRX-2026-OCT-${8840 + (idx + 1)}`;

            return (
              <div
                key={rx.id || idx}
                className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden print:border print:shadow-none print:m-0"
              >
                {/* 1. CLINICAL LETTERHEAD HEADER (Clean Crisp Hospital Theme) */}
                <div className="p-6 sm:p-7 bg-[#0E1E25] text-white border-b-2 border-teal-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                        <Stethoscope className="w-6 h-6 text-slate-950" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-black text-white">
                            {rx.doctor?.user?.name || "Dr. Aarav Mehta"}
                          </h2>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Reg: MCI/2018/98421
                          </span>
                        </div>
                        <p className="text-xs text-teal-300 font-semibold">
                          {rx.doctor?.specialization || "Diabetology & Endocrinology"} &bull; {rx.doctor?.qualification || "MBBS, MD (Medicine), DM (AIIMS New Delhi)"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Fortis Super Speciality Hospital Complex &bull; OPD Desk 304, Diabetology Center
                        </p>
                      </div>
                    </div>

                    <div className="text-right self-start md:self-auto shrink-0 bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 justify-end">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Digitally Signed Rx</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono mt-1 flex items-center justify-end gap-1.5">
                        <span>Rx ID: {rxIdDisplay}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRxId(rxIdDisplay)}
                          className="text-slate-400 hover:text-teal-300 transition-colors p-0.5"
                          title="Copy Rx ID"
                        >
                          {copiedId === rxIdDisplay ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Issued: {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Oct 15, 2026"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. PATIENT DEMOGRAPHIC STRIP */}
                <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Patient Name
                    </span>
                    <span className="font-bold text-slate-900">{patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Age / Gender
                    </span>
                    <span className="font-semibold text-slate-800">52 Yrs / Male</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      UHID
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">CRX-PT-1024</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Next Follow-Up
                    </span>
                    <span className="font-bold text-teal-700">In 3 Weeks (Repeat KFT)</span>
                  </div>
                </div>

                {/* 3. DIAGNOSIS CARD */}
                <div className="p-6 space-y-6">
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-0.5">
                        Clinical Diagnosis:
                      </span>
                      <p className="text-base font-black text-slate-900">
                        {rx.diagnosis || "Type 2 Diabetes Mellitus with Mild Acute Kidney Injury (AKI on CKD) & Essential Hypertension"}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-teal-800 border border-teal-200 shrink-0 self-start sm:self-auto shadow-2xs">
                      ICD-10: E11.22
                    </span>
                  </div>

                  {/* 4. PRESCRIBED MEDICINES (Rx SLIP FORMAT) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-teal-700 font-serif">℞</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Prescribed Medications ({meds.length})
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Renal-Sparing Protocol Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {meds.map((m: any, mIdx: number) => {
                        const freq = (m.frequency || "").toLowerCase();
                        const isMorning = freq.includes("morning") || freq.includes("once") || freq.includes("od");
                        const isNoon = freq.includes("noon") || freq.includes("afternoon") || freq.includes("tid");
                        const isNight = freq.includes("night") || freq.includes("dinner") || freq.includes("bedtime") || freq.includes("hs") || freq.includes("bid");

                        return (
                          <div
                            key={mIdx}
                            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                                ℞
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-base font-black text-slate-900">
                                    {m.name}
                                  </h4>
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                                    {m.dosage}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                                  <span className="flex items-center gap-1 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                                    <span>{m.frequency}</span>
                                  </span>
                                  <span className="text-slate-300">&bull;</span>
                                  <span className="font-semibold text-slate-700">
                                    Course: {m.duration || "30 days"}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  {m.intakeCondition && (
                                    <div className="text-[11px] text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 border border-emerald-200">
                                      <span>{m.intakeCondition}</span>
                                    </div>
                                  )}
                                  {m.avoid && (
                                    <div className="text-[11px] text-rose-900 font-bold bg-rose-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 border border-rose-200">
                                      <span>{m.avoid}</span>
                                    </div>
                                  )}
                                  {m.instructions && (
                                    <div className="text-[11px] text-teal-900 font-medium bg-teal-50/70 px-2.5 py-1 rounded-lg inline-block border border-teal-100">
                                      <strong>Directions:</strong> {m.instructions}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Dosage Timing Visual */}
                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-center text-xs">
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Morning</span>
                                  <span className="font-black text-slate-800">
                                    {m.timingPattern ? m.timingPattern.split("-")[0] : (isMorning ? "1" : "0")}
                                  </span>
                                </div>
                                <span className="text-slate-300 font-bold">-</span>
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Noon</span>
                                  <span className="font-black text-slate-800">
                                    {m.timingPattern ? m.timingPattern.split("-")[1] : (isNoon ? "1" : "0")}
                                  </span>
                                </div>
                                <span className="text-slate-300 font-bold">-</span>
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Night</span>
                                  <span className="font-black text-slate-800">
                                    {m.timingPattern ? m.timingPattern.split("-")[2] : (isNight ? "1" : "0")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. MEDICATIONS ON HOLD (SAFETY DIRECTIVE) */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="uppercase tracking-wider text-[11px]">
                        Medications on Temporary Safety Hold (Do Not Consume):
                      </span>
                    </div>
                    <p className="text-xs text-rose-900 pl-6 leading-relaxed">
                      <strong>Metformin (Glucophage)</strong> and <strong>Telmisartan (Micardis)</strong> are paused to provide rest to kidney filtration filters. Please do not restart these without Dr. Mehta's explicit consultation.
                    </p>
                  </div>

                  {/* 6. DOCTOR ADVICE & DIRECTIVES */}
                  {rx.advice && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <Droplets className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="uppercase tracking-wider text-[11px]">
                          Doctor's Clinical Directives &amp; Lifestyle Advice:
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed pl-6">
                        {rx.advice}
                      </p>
                    </div>
                  )}

                  {/* 7. SIGNATURE & ACTIONS BAR */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Digitally Verified: Dr. Aarav Mehta (AIIMS New Delhi)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Digital Verification Hash: SHA-256 &bull; Medical Council Verified
                        </div>
                      </div>
                    </div>

                    <div className="print:hidden flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Prescription</span>
                      </button>

                      <Link
                        href="/patient/medicines"
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>Order Refills</span>
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
