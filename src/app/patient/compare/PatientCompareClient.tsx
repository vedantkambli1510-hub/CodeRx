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
  const { isSubscribed, plan, isLoaded, updateSubscription } = useSubscription();
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // If subscription status is still reading from storage, render subtle skeleton
  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#881337] font-medium">Verifying subscription credentials...</p>
      </div>
    );
  }

  // ========================================================
  // 1. LOCKED PAYWALL GATE (NO REAL DATA REVEALED UNTIL SUBSCRIBED)
  // ========================================================
  if (!isSubscribed) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        
        {/* Locked Hero Banner in Soft Pink / Rose Palette */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFF0F5] via-[#FFE4ED] to-[#FCE7F0] text-[#4C0519] border-2 border-[#FDA4AF] shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#FDA4AF] text-[#E11D48] text-xs font-black shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>PREMIUM CLINICAL AI FEATURE &bull; LOCKED (₹99 / mo)</span>
              </div>

              {/* 3-Way Demo Switcher */}
              <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/70 border border-[#FDA4AF] text-[11px] font-bold">
                <span className="text-[#881337] px-2">Demo:</span>
                <button
                  type="button"
                  onClick={() => updateSubscription(false)}
                  className="px-2.5 py-1 rounded-xl bg-[#E11D48] text-white font-black shadow-xs cursor-pointer"
                >
                  🔒 Locked
                </button>
                <button
                  type="button"
                  onClick={() => updateSubscription(true, "INDIVIDUAL")}
                  className="px-2.5 py-1 rounded-xl text-[#881337] hover:bg-pink-100 cursor-pointer"
                >
                  ⚡ Basic (₹99)
                </button>
                <button
                  type="button"
                  onClick={() => updateSubscription(true, "FAMILY")}
                  className="px-2.5 py-1 rounded-xl text-[#881337] hover:bg-pink-100 cursor-pointer"
                >
                  👑 Family (₹199)
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#4C0519] tracking-tight leading-tight">
              My Health Story &amp; AI Differential Engine
            </h1>

            <p className="text-xs sm:text-sm text-[#881337] leading-relaxed font-medium">
              This feature autonomously analyzes your baseline and recent lab reports, calculates longitudinal biomarker shifts, and generates a 60-second layman plain-English translation with audio explanation.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#FDA4AF] flex items-center gap-2.5 text-xs text-[#881337]">
              <ShieldAlert className="w-4 h-4 text-[#E11D48] shrink-0" />
              <span>
                <strong>Subscription Required:</strong> Longitudinal delta analysis, kidney/sugar organ tracking, and layman explainer are locked to preserve clinical data integrity.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/patient/subscription"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-200" />
                <span>Unlock Care Plans (from ₹99/mo) &rarr;</span>
              </Link>

              <span className="text-xs text-[#881337] font-medium text-center sm:text-left">
                Instant digital activation &bull; Cancel anytime
              </span>
            </div>
          </div>
        </div>

        {/* FROSTED REDACTED TEASER GRID (HIDES LEGIT INFO) */}
        <div className="relative rounded-3xl border border-[#FCE7F0] bg-white shadow-xs p-6 sm:p-8 overflow-hidden select-none">
          
          {/* Blurred Background Mockup */}
          <div className="filter blur-md opacity-40 pointer-events-none space-y-6">
            <div className="h-6 w-1/3 bg-pink-200 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-32 bg-pink-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-pink-300 rounded" />
                <div className="h-8 w-1/2 bg-pink-400 rounded" />
              </div>
              <div className="h-32 bg-rose-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-rose-300 rounded" />
                <div className="h-8 w-1/2 bg-rose-400 rounded" />
              </div>
              <div className="h-32 bg-pink-50 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-pink-200 rounded" />
                <div className="h-8 w-1/2 bg-pink-300 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-10 bg-pink-50/50 rounded-xl" />
              <div className="h-10 bg-pink-50/50 rounded-xl" />
              <div className="h-10 bg-pink-50/50 rounded-xl" />
            </div>
          </div>

          {/* Centered Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/75 backdrop-blur-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF5F8] text-[#E11D48] flex items-center justify-center shadow-md border border-[#FDA4AF] mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#4C0519]">
              Legitimate Biomarker Data Encrypted
            </h3>

            <p className="text-xs text-[#881337] max-w-md mt-1 mb-4 leading-relaxed font-medium">
              Personalized laboratory delta calculations (HbA1c, Serum Creatinine, eGFR, Blood Pressure) and plain-English organ analysis are hidden until subscription activation.
            </p>

            <Link
              href="/patient/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all cursor-pointer"
            >
              <span>Unlock Care Plans (from ₹99/mo)</span>
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
      {/* Active Subscription Status Banner in Light Pink / Rose */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FFF0F5] via-[#FFE4ED] to-[#FCE7F0] text-[#4C0519] border border-[#FDA4AF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#FDA4AF] text-[#E11D48] flex items-center justify-center font-black shadow-2xs shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-sm sm:text-base text-[#4C0519] tracking-tight">
                CodeRx Clinical Pro &bull; AI Health Story Engine Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-[#E11D48] border border-pink-200">
                {plan === "FAMILY" ? "FAMILY PASS ACTIVE" : plan === "PREMIUM" ? "COMPLETE CARE ACTIVE" : "BASIC PASS ACTIVE"}
              </span>
            </div>
            <p className="text-xs text-[#881337] mt-0.5 font-medium">
              Longitudinal biomarker analysis unlocked &bull; Synchronized with Dr. Aarav Mehta&apos;s OPD clinical orders.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Quick Demo Switcher */}
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/70 border border-[#FDA4AF] text-[11px] font-bold mr-1">
            <span className="text-[#881337] px-1.5 text-[10px]">Demo:</span>
            <button
              type="button"
              onClick={() => updateSubscription(false)}
              className="px-2 py-0.5 rounded-lg text-[#881337] hover:bg-pink-100 cursor-pointer text-[10px]"
              title="Simulate unsubscribed locked state"
            >
              🔒 Lock
            </button>
            <button
              type="button"
              onClick={() => updateSubscription(true, "INDIVIDUAL")}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-[10px] ${
                isSubscribed && plan === "INDIVIDUAL"
                  ? "bg-[#E11D48] text-white font-black"
                  : "text-[#881337] hover:bg-pink-100"
              }`}
            >
              ⚡ ₹99
            </button>
            <button
              type="button"
              onClick={() => updateSubscription(true, "FAMILY")}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-[10px] ${
                isSubscribed && plan === "FAMILY"
                  ? "bg-[#E11D48] text-white font-black"
                  : "text-[#881337] hover:bg-pink-100"
              }`}
            >
              👑 ₹199
            </button>
          </div>

          {plan === "FAMILY" ? (
            <Link
              href="/patient/family"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-[#E11D48] border border-[#FDA4AF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Family Portal</span>
            </Link>
          ) : (
            <Link
              href="/patient/subscription"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-[#E11D48] border border-[#FDA4AF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Crown className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>Upgrade to Family (₹199)</span>
            </Link>
          )}

          <Link
            href="/patient/subscription"
            className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            <span>Manage Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Longitudinal Comparison & Layman Explainer Content */}
      <WhatChangedTab comparison={comparison} />

      {/* RECEIPT MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#FCE7F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#FCE7F0]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#E11D48]" />
                <h3 className="text-base font-bold text-[#4C0519]">Subscription Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FCE7F0] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#881337]">Plan:</span>
                <strong className="text-[#4C0519]">
                  {plan === "FAMILY" ? "CodeRx Family Health Care Pass" : "CodeRx Essential Care Pass"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#881337]">Amount Paid:</span>
                <strong className="text-[#E11D48]">₹{plan === "FAMILY" ? "199.00" : "99.00"} / month</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#881337]">Payment Mode:</span>
                <strong className="text-[#4C0519]">Google Pay / PhonePe UPI</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#881337]">Status:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-pink-100 text-[#E11D48] border border-pink-200">
                  PAID &amp; ACTIVE
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#4C0519] text-white font-bold text-xs hover:bg-[#881337] transition-all cursor-pointer"
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
