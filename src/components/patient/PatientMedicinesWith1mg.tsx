"use client";

import { useState } from "react";
import {
  Pill,
  Clock,
  ShieldCheck,
  ShoppingCart,
  ExternalLink,
  Trash2,
  Check,
  Tag,
  Sparkles,
  Store,
  Printer,
  MapPin,
  CreditCard,
  Moon,
  Sun,
  Sunrise,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export interface PrescribedMedicine {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  notes?: string | null;
  source?: string;
  price?: number;
  mrp?: number;
}

interface PatientMedicinesWith1mgProps {
  initialMedicines: PrescribedMedicine[];
  patientName?: string;
}

export function PatientMedicinesWith1mg({
  initialMedicines,
  patientName = "Patient",
}: PatientMedicinesWith1mgProps) {
  const [activeTab, setActiveTab] = useState<"active" | "stopped" | "refill">("active");

  const [takenStatus, setTakenStatus] = useState<Record<string, boolean>>({
    "atorva-1": false,
    "met-1": true,
    "telmi-1": true,
  });

  const [discardedStatus, setDiscardedStatus] = useState<Record<string, boolean>>({
    "stop-1": true,
    "stop-2": true,
    "stop-3": false,
    "stop-4": false,
  });

  function toggleTaken(id: string) {
    setTakenStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleDiscarded(id: string) {
    setDiscardedStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Active Daily Regimens
  const activeRegimens = [
    {
      id: "atorva-1",
      name: "Atorvastatin Calcium",
      dosage: "20 mg",
      timing: "Bedtime (10:00 PM)",
      timeIcon: Moon,
      mealInstruction: "Take at bedtime with water",
      purpose: "HMG-CoA reductase inhibitor for cardiovascular & lipid stabilization",
      mrp: "₹250",
      onlinePrice: "₹199",
      savings: "20% OFF",
      refillLink: "https://www.1mg.com/search/all?name=Atorvastatin%2020mg",
    },
    {
      id: "met-1",
      name: "Metformin Hydrochloride",
      dosage: "500 mg",
      timing: "With Dinner (08:30 PM)",
      timeIcon: Moon,
      mealInstruction: "Take with or immediately after food",
      purpose: "Renal-sparing biguanide dosage for glycemic balance",
      mrp: "₹180",
      onlinePrice: "₹142",
      savings: "21% OFF",
      refillLink: "https://www.1mg.com/search/all?name=Metformin%20500mg",
    },
    {
      id: "telmi-1",
      name: "Telmisartan",
      dosage: "40 mg",
      timing: "Morning (09:00 AM)",
      timeIcon: Sun,
      mealInstruction: "Take in the morning after breakfast",
      purpose: "Angiotensin receptor blocker for renal vascular protection & blood pressure",
      mrp: "₹220",
      onlinePrice: "₹176",
      savings: "20% OFF",
      refillLink: "https://www.1mg.com/search/all?name=Telmisartan%2040mg",
    },
  ];

  // Stopped Medications
  const stoppedList = [
    {
      id: "stop-1",
      name: "Telmisartan (Alternative Formulation)",
      dosage: "40 mg",
      stoppedBy: "Dr. Aarav Mehta",
      date: "Oct 10, 2026",
      reason: "Patient reported mild dizziness; adjusted to morning single-agent therapy.",
    },
    {
      id: "stop-2",
      name: "Metformin (High Dose 1000mg)",
      dosage: "1000 mg",
      stoppedBy: "Dr. Aarav Mehta",
      date: "Oct 10, 2026",
      reason: "Dose down-titrated to 500mg to protect kidney filtration trajectory.",
    },
    {
      id: "stop-3",
      name: "Multivitamin & Vitamin D3 (60K)",
      dosage: "60,000 IU",
      stoppedBy: "Consulting Physician",
      date: "Sep 28, 2026",
      reason: "8-week high-dose deficiency replenishment course completed.",
    },
    {
      id: "stop-4",
      name: "Glimepiride",
      dosage: "1 mg",
      stoppedBy: "Consulting Physician",
      date: "Sep 15, 2026",
      reason: "Discontinued after 12 weeks to prevent hypoglycemic episodes.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. CLEAN EXECUTIVE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Pill className="w-7 h-7 text-teal-600" />
            <span>Prescriptions &amp; Pharmacy Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active daily regimens, clinical deprescribing safety guard &amp; multi-pharmacy price comparison.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            {activeRegimens.length} Active Prescriptions
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {stoppedList.length} Stopped by Doctor
          </span>
        </div>
      </div>

      {/* 2. THREE SUMMARY KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400">Daily Regimen</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {activeRegimens.length} Medicines Scheduled
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1 Morning • 2 Bedtime doses tracked
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400">Deprescribing Radar</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {stoppedList.length} Meds Safely Discontinued
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prevents adverse drug-drug interactions
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400">Refill Comparison</span>
            <ShoppingCart className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            Up to 25% Savings
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tata 1mg, PharmEasy &amp; Local Chemist
          </p>
        </div>
      </div>

      {/* 3. MODERN SEGMENTED TABS */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-full sm:w-fit text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "active"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Pill className="w-3.5 h-3.5 text-teal-600" />
          <span>Active Daily Schedule ({activeRegimens.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stopped")}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "stopped"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Doctor Stopped ({stoppedList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("refill")}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "refill"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
          <span>Refill &amp; Instant Buy</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE DAILY SCHEDULE (CLEAN SLEEK CARDS)        */}
      {/* ======================================================== */}
      {activeTab === "active" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Today's Prescribed Intake Schedule
            </h2>
            <span className="text-xs text-slate-400">
              Verified by Dr. Aarav Mehta
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {activeRegimens.map((med) => {
              const TimeIcon = med.timeIcon;
              const isTaken = !!takenStatus[med.id];

              return (
                <div
                  key={med.id}
                  className={`p-5 rounded-3xl border transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-xs ${
                    isTaken ? "border-emerald-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                      <TimeIcon className="w-5 h-5 text-teal-700" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">
                          {med.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                          {med.dosage}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>{med.timing}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {med.purpose}
                      </p>
                      <div className="text-[11px] text-teal-800 font-medium bg-teal-50/70 px-2.5 py-0.5 rounded-md inline-block border border-teal-100">
                        {med.mealInstruction}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs text-slate-400 line-through">{med.mrp}</span>
                        <span className="text-sm font-black text-slate-900">{med.onlinePrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {med.savings}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTaken(med.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isTaken
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isTaken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Taken Today</span>
                        </>
                      ) : (
                        <span>Mark Taken</span>
                      )}
                    </button>

                    <a
                      href={med.refillLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy Refill</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DOCTOR STOPPED MEDICATIONS (ELEGANT SAFETY VAULT) */}
      {/* ======================================================== */}
      {activeTab === "stopped" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 block">
                Clinical Deprescribing Safety Shield:
              </span>
              <p className="text-amber-800 leading-relaxed">
                Dr. Aarav Mehta explicitly discontinued these medications during consultation. Please verify that these strips are removed from your daily pillbox and medicine cabinet to avoid accidental dosing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stoppedList.map((med) => {
              const isDiscarded = !!discardedStatus[med.id];

              return (
                <div
                  key={med.id}
                  className={`p-5 rounded-3xl border transition-all bg-white flex flex-col justify-between space-y-3 ${
                    isDiscarded ? "border-slate-200 opacity-80" : "border-rose-200 shadow-2xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">
                          {med.name}
                        </h4>
                        <span className="text-xs font-bold text-rose-700">
                          {med.dosage}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        Discontinued
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {med.reason}
                    </p>

                    <div className="text-[10.5px] text-slate-400 pt-1">
                      Stopped by: <strong>{med.stoppedBy}</strong> • {med.date}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Pillbox Status:</span>
                    <button
                      type="button"
                      onClick={() => toggleDiscarded(med.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDiscarded
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {isDiscarded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Removed from Pillbox</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Mark Removed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PHARMACY PRICE COMPARISON & INSTANT REFILL        */}
      {/* ======================================================== */}
      {activeTab === "refill" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Compare Refill Rates Across Trusted Pharmacies
            </h2>
            <span className="text-xs text-teal-700 font-bold">Live Price Match</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Tata 1mg */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800">
                    EXPRESS
                  </span>
                  <span className="text-xs font-bold text-teal-700">⚡ 2h Delivery</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-2">Tata 1mg</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Automated prescription verification and genuine pharmacy network.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Discount:</span>
                  <span className="text-emerald-700 font-bold">Up to 20% OFF</span>
                </div>
                <a
                  href="https://www.1mg.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Order on 1mg</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PharmEasy */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                    BEST VALUE
                  </span>
                  <span className="text-xs font-bold text-emerald-700">🎉 25% OFF</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-2">PharmEasy</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Maximum savings on chronic monthly medication refills.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Delivery:</span>
                  <span className="text-slate-900 font-bold">Same Day / 24 hrs</span>
                </div>
                <a
                  href="https://pharmeasy.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Order on PharmEasy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Netmeds */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-sky-100 text-sky-800">
                    NETWORK
                  </span>
                  <span className="text-xs font-bold text-sky-700">Nationwide</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-2">Netmeds</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trusted healthcare brand with rewards points on repeat orders.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Rewards:</span>
                  <span className="text-slate-900 font-bold">5% NMS Cash</span>
                </div>
                <a
                  href="https://www.netmeds.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Order on Netmeds</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Local Chemist */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                    WALK-IN
                  </span>
                  <span className="text-xs font-bold text-teal-700">📍 350m Away</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-2">Local Chemist</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Apollo / Wellness Forever store near Fortis Hospital Complex.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Availability:</span>
                  <span className="text-emerald-700 font-bold">Instant Pickup</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/pharmacy+near+me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
