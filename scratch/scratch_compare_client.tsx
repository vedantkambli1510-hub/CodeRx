"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Crown,
  Receipt,
  RotateCcw,
  Check,
  X,
  FileText,
  Activity,
  Heart,
  TrendingUp,
  Stethoscope,
  Users,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { WhatChangedTab } from "@/components/workspace/WhatChangedTab";
import { useSubscription } from "@/lib/subscription";

interface PatientCompareClientProps {
  comparison: any;
}

export function PatientCompareClient({ comparison }: PatientCompareClientProps) {
  const { isSubscribed, plan, isLoaded } = useSubscription();
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // If subscription status is still reading from storage, render subtle skeleton
  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Verifying subscription credentials...</p>
      </div>
    );
  }

  // ========================================================
  // 1. LOCKED PAYWALL GATE (NO REAL DATA REVEALED UNTIL SUBSCRIBED)
  // ========================================================
  if (!isSubscribed) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        
        {/* Locked Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0C1A20] to-[#0A262C] text-white border-2 border-amber-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>PREMIUM CLINICAL AI FEATURE &bull; LOCKED</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              My Health Story &amp; AI Differential Engine
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This feature autonomously analyzes your baseline and recent lab reports, calculates longitudinal biomarker shifts, and generates a 60-second layman plain-English translation with audio explanation.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Subscription Required:</strong> Longitudinal delta analysis, kidney/sugar organ tracking, and layman explainer are locked to preserve clinical data integrity.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/patient/subscription"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Unlock Solo Pass (₹99) or Family Pass (₹199) &rarr;</span>
              </Link>

              <span className="text-xs text-slate-400 text-center sm:text-left">
                Instant digital activation &bull; Cancel anytime
              </span>
            </div>
          </div>
        </div>

        {/* FROSTED REDACTED TEASER GRID (HIDES LEGIT INFO) */}
        <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xs p-6 sm:p-8 overflow-hidden select-none">
          
          {/* Blurred Background Mockup */}
          <div className="filter blur-md opacity-40 pointer-events-none space-y-6">
            <div className="h-6 w-1/3 bg-slate-300 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-32 bg-teal-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-teal-300 rounded" />
                <div className="h-8 w-1/2 bg-teal-400 rounded" />
              </div>
              <div className="h-32 bg-sky-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-sky-300 rounded" />
                <div className="h-8 w-1/2 bg-sky-400 rounded" />
              </div>
              <div className="h-32 bg-amber-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-amber-300 rounded" />
                <div className="h-8 w-1/2 bg-amber-400 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          </div>

          {/* Centered Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/70 backdrop-blur-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg border border-slate-800 mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Legitimate Biomarker Data Encrypted
            </h3>

            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4 leading-relaxed">
              Personalized laboratory delta calculations (HbA1c, Serum Creatinine, eGFR, Blood Pressure) and plain-English organ analysis are hidden until subscription activation.
            </p>

            <Link
              href="/patient/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all cursor-pointer"
            >
              <span>Unlock Solo Pass (₹99) / Family Pass (₹199)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // ========================================================
  // 2. UNLOCKED STATE (LEGITIMATE DATA SHOWN ONLY AFTER PAYMENT)
  // ========================================================
  return (
    <div className="space-y-6">
      {/* Active Subscription Status Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0B1A20] to-[#0A262C] text-white border border-teal-500/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-black shadow-inner shrink-0">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-sm sm:text-base text-white tracking-tight">
                CodeRx Clinical Pro &bull; AI Health Story Engine Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {plan === "FAMILY" ? "FAMILY PASS ACTIVE (ALL MEMBERS)" : "SOLO AI PASS ACTIVE (1 PROFILE)"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Longitudinal biomarker analysis unlocked &bull; Synchronized with Dr. Aarav Mehta's OPD clinical orders.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {plan === "FAMILY" ? (
            <Link
              href="/patient/family"
              className="px-3.5 py-2 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 border border-teal-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Family Portal (All Segregated Timelines)</span>
            </Link>
          ) : (
            <Link
              href="/patient/subscription"
              className="px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade to Family Pass (₹199)</span>
            </Link>
          )}

          <Link
            href="/patient/subscription"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Manage Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Longitudinal Comparison & Layman Explainer Content */}
      <WhatChangedTab comparison={comparison} />

      {/* RECEIPT MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Subscription Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan:</span>
                <strong className="text-slate-900">
                  {plan === "FAMILY" ? "CodeRx Family Health Care Pass" : "CodeRx Solo AI Pass"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <strong className="text-teal-700">₹{plan === "FAMILY" ? "199.00" : "99.00"} / month</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <strong className="text-slate-900">Google Pay / PhonePe UPI</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                  PAID &amp; ACTIVE
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
