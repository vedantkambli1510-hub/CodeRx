"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Crown,
  Heart,
  Pill,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Calendar,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Info,
} from "lucide-react";

interface DoctorFamilyCohortSectionProps {
  patient: any;
}

export function DoctorFamilyCohortSection({ patient }: DoctorFamilyCohortSectionProps) {
  const [selectedMember, setSelectedMember] = useState<string>("rajesh");

  const familyMembers = [
    {
      id: "rajesh",
      name: "Rajesh Sharma",
      relationship: "Father / Account Head",
      age: 52,
      gender: "Male",
      bloodGroup: "B+",
      diagnosis: "Type 2 Diabetes Mellitus with Mild Acute Kidney Injury & HTN",
      keyMetrics: "Creatinine 1.7 mg/dL (Slowed filtration) • HbA1c 7.1% • BP 126/80",
      activeMeds: "Linagliptin 5mg, Amlodipine 5mg, Atorvastatin 10mg (Metformin on hold)",
      status: "REQUIRES_REVIEW",
      doctorNotes: "Renal-sparing protocol initiated. Metformin paused to avoid lactic acidosis risk. Re-test KFT in 3 weeks.",
    },
    {
      id: "sunita",
      name: "Sunita Sharma",
      relationship: "Spouse",
      age: 48,
      gender: "Female",
      bloodGroup: "O+",
      diagnosis: "Primary Hypothyroidism & Borderline Dyslipidemia",
      keyMetrics: "TSH 3.2 mIU/L (Target met) • Total Cholesterol 208 mg/dL",
      activeMeds: "Thyronorm (Levothyroxine) 50 mcg OD empty stomach",
      status: "STABLE",
      doctorNotes: "Euthyroid state maintained on 50mcg. Advised routine 6-month TSH follow-up.",
    },
    {
      id: "rohan",
      name: "Rohan Sharma",
      relationship: "Son",
      age: 21,
      gender: "Male",
      bloodGroup: "B+",
      diagnosis: "Seasonal Allergic Rhinitis / Athletic Profile",
      keyMetrics: "Fasting Glucose 88 mg/dL • Resting HR 64 bpm • BP 118/76",
      activeMeds: "Levocetirizine 5mg PRN for allergy flares",
      status: "OPTIMAL",
      doctorNotes: "Strong paternal history of T2DM (father Rajesh). Advised annual HbA1c screening from age 25.",
    },
    {
      id: "kamla",
      name: "Kamla Sharma",
      relationship: "Mother (Senior)",
      age: 76,
      gender: "Female",
      bloodGroup: "A+",
      diagnosis: "Bilateral Knee Osteoarthritis & Mild Essential Hypertension",
      keyMetrics: "BP 134/82 mmHg • eGFR 62 mL/min (Age appropriate)",
      activeMeds: "Telmisartan 20mg, Calcium + D3, Glucosamine",
      status: "STABLE",
      doctorNotes: "Knee pain managed conservatively. Strict avoidance of OTC NSAIDs (Combiflam/Brufen) to protect renal baseline.",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. CLINICAL FAMILY UNIT BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A1A20] to-[#0D2830] text-white border border-teal-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <Users className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-white">
                Sharma Family Clinical Cohort
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-400/20 text-teal-300 border border-teal-400/30 font-mono">
                UHID: FAM-CRX-8821
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-300" />
                <span>Family Pass Active (4/6)</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Registered patient <strong>{patient?.user?.name || "Rajesh Sharma"}</strong> is enrolled in the CodeRx Family Health Unit. All 4 members are under your longitudinal OPD registry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-teal-300 border border-white/15">
            Synchronized with OPD Desk 304
          </span>
        </div>
      </div>

      {/* 2. FAMILY MEMBERS GRID & SELECTION */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>Enrolled Family Members (Click to Inspect Profile):</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {familyMembers.map((m) => {
            const isSelected = selectedMember === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMember(m.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isSelected
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{m.name}</h5>
                    <p className="text-[11px] text-teal-700 font-medium truncate">{m.relationship}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  {m.age} Y &bull; {m.gender} &bull; Blood: <strong>{m.bloodGroup}</strong>
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                      m.status === "REQUIRES_REVIEW"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : m.status === "OPTIMAL"
                        ? "bg-sky-100 text-sky-800 border border-sky-300"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    {m.status === "REQUIRES_REVIEW" ? "Under Acute Review" : "Stable"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SELECTED MEMBER CLINICAL DEEP DIVE */}
      {(() => {
        const mem = familyMembers.find((m) => m.id === selectedMember) || familyMembers[0];

        return (
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-bold flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    Clinical Record: {mem.name} ({mem.relationship})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Primary Diagnosis: <strong className="text-slate-800">{mem.diagnosis}</strong>
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                Blood Group: {mem.bloodGroup}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                <span className="font-bold text-teal-900 uppercase text-[11px] block">
                  Latest Key Biomarkers &amp; Vitals:
                </span>
                <p className="text-slate-800 font-semibold leading-relaxed">
                  {mem.keyMetrics}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 uppercase text-[11px] block">
                  Active Drug Regimen:
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {mem.activeMeds}
                </p>
              </div>
            </div>

            {/* Doctor's Private Clinical Note for this Member */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Dr. Aarav Mehta's Family Directive:</span>
              </div>
              <p className="text-amber-950 font-medium leading-relaxed pl-5">
                {mem.doctorNotes}
              </p>
            </div>
          </div>
        );
      })()}

      {/* 4. HEREDITARY RISK & CROSS-GENERATIONAL CLINICAL MAP */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <h4 className="text-sm font-black text-slate-900">
              Cross-Generational Familial Assessment
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded font-bold bg-white text-teal-800 border border-teal-200 text-[10px]">
            AIIMS Familial Care Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold text-[11px]">
              1. Paternal Diabetes Predisposition:
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Rajesh has T2DM. Rohan (son, 21) carries genetic insulin resistance risk. Advised annual HbA1c screening from age 25.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold text-[11px]">
              2. Maternal Autoimmune Thyroid:
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Sunita has primary hypothyroidism. Family members instructed to monitor fatigue or weight changes with TSH check.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold text-[11px]">
              3. Renal Safety across Unit:
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Zero OTC NSAIDs rule enforced for both Rajesh (recovering AKI) and Kamla (76Y, senior baseline nephron protection).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
