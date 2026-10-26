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
  isDemoAccount?: boolean;
  hideHeaderBanner?: boolean;
}

export function PatientCompareClient({
  comparison,
  isDemoAccount = false,
  hideHeaderBanner = false,
}: PatientCompareClientProps) {
  const { isSubscribed, plan, isLoaded, updateSubscription } = useSubscription();
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // If subscription status is still reading from storage, render subtle skeleton
  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#047857] font-medium">Verifying subscription credentials...</p>
      </div>
    );
  }

  // ========================================================
  // 1. LOCKED PAYWALL GATE (NO REAL DATA REVEALED UNTIL SUBSCRIBED)
  // ========================================================
  if (!isSubscribed) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        
        {/* Only show locked hero banner if not nested under timeline */}
        {!hideHeaderBanner && (
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#F0F8F5] via-[#E8F8F0] to-[#DCF5E7] text-[#064E3B] border-2 border-[#8FE3B8] shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#8FE3B8] text-[#059669] text-xs font-black shadow-2xs">
                  <Lock className="w-3.5 h-3.5 text-[#059669]" />
                  <span>PREMIUM CLINICAL AI FEATURE &bull; LOCKED (₹149 / mo)</span>
                </div>

                {/* Demo Switcher - Only visible on demo accounts */}
                {isDemoAccount && (
                  <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/70 border border-[#8FE3B8] text-[11px] font-bold">
                    <span className="text-[#047857] px-2">Demo:</span>
                    <button
                      type="button"
                      onClick={() => updateSubscription(false)}
                      className="px-2.5 py-1 rounded-xl bg-[#059669] text-white font-black shadow-xs cursor-pointer"
                    >
                      🔒 Locked
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSubscription(true, "INDIVIDUAL")}
                      className="px-2.5 py-1 rounded-xl text-[#047857] hover:bg-[#E8F8F0] cursor-pointer"
                    >
                      ⚡ Care Pass (₹149)
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#064E3B] tracking-tight leading-tight">
                My Health Story &amp; AI Differential Engine
              </h1>

              <p className="text-xs sm:text-sm text-[#047857] leading-relaxed font-medium">
                This feature autonomously analyzes your baseline and recent lab reports, calculates longitudinal biomarker shifts, and generates a 60-second layman plain-English translation with audio explanation.
              </p>

              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#8FE3B8] flex items-center gap-2.5 text-xs text-[#047857]">
                <ShieldAlert className="w-4 h-4 text-[#059669] shrink-0" />
                <span>
                  <strong>Subscription Required:</strong> Longitudinal delta analysis, kidney/sugar organ tracking, and layman explainer are locked to preserve clinical data integrity.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  href="/patient/subscription"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Unlock Care Pass (₹149/mo) &rarr;</span>
                </Link>

                <span className="text-xs text-[#047857] font-medium text-center sm:text-left">
                  Instant digital activation &bull; Cancel anytime
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FROSTED REDACTED TEASER GRID (HIDES LEGIT INFO) */}
        <div className="relative rounded-3xl border border-[#D6EDE1] bg-white shadow-xs p-6 sm:p-8 overflow-hidden select-none">
          
          {/* Blurred Background Mockup */}
          <div className="filter blur-md opacity-40 pointer-events-none space-y-6">
            <div className="h-6 w-1/3 bg-emerald-200 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-32 bg-emerald-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-emerald-300 rounded" />
                <div className="h-8 w-1/2 bg-emerald-400 rounded" />
              </div>
              <div className="h-32 bg-teal-100 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-teal-300 rounded" />
                <div className="h-8 w-1/2 bg-teal-400 rounded" />
              </div>
              <div className="h-32 bg-emerald-50 rounded-2xl p-4 space-y-2">
                <div className="h-4 w-3/4 bg-emerald-200 rounded" />
                <div className="h-8 w-1/2 bg-emerald-300 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-10 bg-emerald-50/50 rounded-xl" />
              <div className="h-10 bg-emerald-50/50 rounded-xl" />
              <div className="h-10 bg-emerald-50/50 rounded-xl" />
            </div>
          </div>

          {/* Centered Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/75 backdrop-blur-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center shadow-md border border-[#8FE3B8] mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#064E3B]">
              Legitimate Biomarker Data Encrypted
            </h3>

            <p className="text-xs text-[#047857] max-w-md mt-1 mb-4 leading-relaxed font-medium">
              Personalized laboratory delta calculations (HbA1c, Serum Creatinine, eGFR, Blood Pressure) and plain-English organ analysis are hidden until subscription activation.
            </p>

            <Link
              href="/patient/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Unlock Care Pass (₹149/mo)</span>
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
      {/* Standalone Status Banner - Only shown if not nested inside timeline header */}
      {!hideHeaderBanner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#F0F8F5] via-[#E8F8F0] to-[#DCF5E7] text-[#064E3B] border border-[#8FE3B8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#8FE3B8] text-[#059669] flex items-center justify-center font-black shadow-2xs shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-sm sm:text-base text-[#064E3B] tracking-tight">
                  CodeRx Clinical Pro &bull; AI Health Story Engine Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
                  CARE PASS ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#047857] mt-0.5 font-medium">
                Longitudinal biomarker analysis unlocked &bull; Synchronized with Dr. Aarav Mehta&apos;s OPD clinical orders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Quick Demo Switcher - Only visible on demo accounts */}
            {isDemoAccount && (
              <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/70 border border-[#8FE3B8] text-[11px] font-bold mr-1">
                <span className="text-[#047857] px-1.5 text-[10px]">Demo:</span>
                <button
                  type="button"
                  onClick={() => updateSubscription(false)}
                  className="px-2 py-0.5 rounded-lg text-[#047857] hover:bg-[#E8F8F0] cursor-pointer text-[10px]"
                  title="Simulate unsubscribed locked state"
                >
                  🔒 Lock
                </button>
                <button
                  type="button"
                  onClick={() => updateSubscription(true, "INDIVIDUAL")}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-[10px] ${
                    isSubscribed
                      ? "bg-[#059669] text-white font-black"
                      : "text-[#047857] hover:bg-[#E8F8F0]"
                  }`}
                >
                  ⚡ ₹149
                </button>
              </div>
            )}

            <Link
              href="/patient/subscription"
              className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Manage Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Longitudinal Comparison & Layman Explainer Content */}
      <WhatChangedTab comparison={comparison} />

      {/* RECEIPT MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6EDE1]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#059669]" />
                <h3 className="text-base font-bold text-[#064E3B]">Subscription Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F3FAF6] border border-[#D6EDE1] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#047857]">Plan:</span>
                <strong className="text-[#064E3B]">
                  CodeRx Essential Care Pass
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#047857]">Amount Paid:</span>
                <strong className="text-[#059669]">₹149.00 / month</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#047857]">Payment Mode:</span>
                <strong className="text-[#064E3B]">Google Pay / PhonePe UPI</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#047857]">Status:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
                  PAID &amp; ACTIVE
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#059669] text-white font-bold text-xs hover:bg-[#047857] transition-all cursor-pointer"
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
