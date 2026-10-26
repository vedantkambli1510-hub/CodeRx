"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Crown,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  QrCode,
  Receipt,
  Activity,
  Heart,
  TrendingUp,
  Stethoscope,
  Users,
} from "lucide-react";
import { PatientCompareClient } from "../compare/PatientCompareClient";
import { TimelineTab } from "@/components/workspace/TimelineTab";
import { useSubscription } from "@/lib/subscription";

interface PatientTimelineClientProps {
  timelines: any[];
  comparison: any;
  defaultTab?: "ai" | "history";
  isDemoAccount?: boolean;
}

export function PatientTimelineClient({
  timelines,
  comparison,
  defaultTab = "ai",
  isDemoAccount = true,
}: PatientTimelineClientProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "history">(defaultTab);
  const { isSubscribed, isLoaded, updateSubscription } = useSubscription();

  // Checkout modal states for in-page purchase
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"SELECT" | "PROCESSING" | "SUCCESS">("SELECT");
  const [selectedPaymentApp, setSelectedPaymentApp] = useState<"gpay" | "phonepe" | "upi">("gpay");
  const [transactionId, setTransactionId] = useState("CRX-GPAY-772910");

  function handleOpenCheckout() {
    setPaymentStep("SELECT");
    setShowCheckoutModal(true);
  }

  function handleConfirmPayment() {
    setPaymentStep("PROCESSING");
    setTimeout(() => {
      const tx = `CRX-${selectedPaymentApp.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(tx);
      setPaymentStep("SUCCESS");

      // Activate subscription in persistent storage and trigger updates
      updateSubscription(true, "INDIVIDUAL");

      setTimeout(() => {
        setShowCheckoutModal(false);
      }, 1200);
    }, 1000);
  }

  // Quick 1-click demo activator
  function handleOneClickActivate() {
    updateSubscription(true, "INDIVIDUAL");
  }

  function handleLockAgain() {
    updateSubscription(false);
  }

  // Loading skeleton while reading storage
  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-3 font-sans">
        <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#047857] font-medium">Checking Care Pass credentials...</p>
      </div>
    );
  }

  // =========================================================================
  // 1. LOCKED STATE: CARE PASS REQUIRED (Timeline DOES NOT appear until bought)
  // =========================================================================
  if (!isSubscribed) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans text-[#064E3B] animate-in fade-in duration-200">
        
        {/* Main Care Pass Paywall Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#F0F8F5] via-[#E8F8F0] to-[#DCF5E7] border-2 border-[#8FE3B8] p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Decorative blur blob */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Top pill & Demo switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#8FE3B8] text-[#059669] text-xs font-black shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#059669]" />
                <span>CODE RX CARE PASS &bull; ₹149 / MONTH</span>
              </span>

              {/* Demo 1-Click Switcher for instant testing */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 border border-[#8FE3B8] text-[11px] font-bold shadow-2xs">
                <span className="text-[#047857] px-2">Demo:</span>
                <button
                  type="button"
                  onClick={handleOneClickActivate}
                  className="px-3 py-1 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  title="Click to instantly simulate purchase & unlock timeline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Buy Pass (₹149)</span>
                </button>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-[#064E3B] tracking-tight leading-tight">
                Unlock AI Health Timeline &amp; Longitudinal Story
              </h1>
              <p className="text-xs sm:text-sm text-[#047857] leading-relaxed font-medium max-w-2xl">
                See how your body condition evolved over time (<strong>pehle condition kaisi thi vs ab kaisi hai</strong>).
                Understand clinical lab shifts, 3D biomarker trajectories, and plain-English organ safety translations.
              </p>
            </div>

            {/* 4 Feature Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/90 border border-[#D6EDE1] shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#064E3B]">
                  <TrendingUp className="w-4 h-4 text-[#059669]" />
                  <span>Pehle vs Abhi 3D Delta Charts</span>
                </div>
                <p className="text-[11px] text-[#047857] leading-relaxed">
                  Interactive 3D trajectory tracking for HbA1c, Fasting Glucose, Kidney filtration (Creatinine &amp; eGFR), and Blood Pressure.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-[#D6EDE1] shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#064E3B]">
                  <Sparkles className="w-4 h-4 text-[#059669]" />
                  <span>60-Second Layman AI Explainer</span>
                </div>
                <p className="text-[11px] text-[#047857] leading-relaxed">
                  Converts complex diagnostic lab jargon into simple everyday language with organ health indicators and actionable guidance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-[#D6EDE1] shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#064E3B]">
                  <Stethoscope className="w-4 h-4 text-[#059669]" />
                  <span>Multi-Doctor Record Correlation</span>
                </div>
                <p className="text-[11px] text-[#047857] leading-relaxed">
                  Connects prescriptions, dose changes, and lab outcomes across different specialists and hospital visits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-[#D6EDE1] shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#064E3B]">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>Organ Safety &amp; Early Alert Protocol</span>
                </div>
                <p className="text-[11px] text-[#047857] leading-relaxed">
                  Automated checks against toxic drug interactions and organ strain before your next OPD consultation.
                </p>
              </div>
            </div>

            {/* Price Box + Call to Action */}
            <div className="pt-3 border-t border-[#BCE8D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#064E3B]">₹149</span>
                  <span className="text-xs text-[#047857] font-bold">/ month</span>
                </div>
                <p className="text-[11px] text-[#047857]">Instant digital access &bull; Cancel anytime with 1 click</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                >
                  <Crown className="w-4 h-4 text-emerald-200" />
                  <span>Buy Care Pass (₹149/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* PAYMENT MODAL (Google Pay / PhonePe / UPI) */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">CodeRx Care Pass Checkout</h3>
                    <p className="text-[11px] text-slate-500">Longitudinal AI Timeline &amp; Health Story</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step 1: Select & Pay */}
              {paymentStep === "SELECT" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Care Pass Subscription</div>
                      <div className="text-[11px] text-emerald-700">Monthly renewal &bull; Instant activation</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-950">₹149</div>
                      <div className="text-[10px] text-emerald-600">All Taxes Incl.</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Select Payment Method:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentApp("gpay")}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPaymentApp === "gpay"
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-xs font-extrabold text-slate-800">Google Pay</div>
                        <div className="text-[10px] text-slate-500">Fast UPI</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentApp("phonepe")}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPaymentApp === "phonepe"
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-xs font-extrabold text-slate-800">PhonePe</div>
                        <div className="text-[10px] text-slate-500">Instant</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentApp("upi")}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPaymentApp === "upi"
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-xs font-extrabold text-slate-800">UPI ID</div>
                        <div className="text-[10px] text-slate-500">Any App</div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Pay ₹149 &amp; Unlock AI Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Step 2: Processing */}
              {paymentStep === "PROCESSING" && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Verifying UPI Transaction...</p>
                  <p className="text-[11px] text-slate-500">Activating your CodeRx Care Pass (₹149)</p>
                </div>
              )}

              {/* Step 3: Success */}
              {paymentStep === "SUCCESS" && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Payment Successful!</h4>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Care Pass Activated &bull; {transactionId}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Unlocking AI Health Timeline right now...
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // 2. UNLOCKED STATE: CARE PASS ACTIVE (Full AI Timeline Appears on Interface)
  // =========================================================================
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200 text-[#064E3B] font-sans">
      
      {/* 1. TOP HEADER WITH TITLE & CONDITIONAL DEMO TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D6EDE1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>CARE PASS ACTIVE</span>
            </span>
            <span className="text-xs text-[#047857] font-bold">
              Longitudinal Clinical Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#059669]" />
            <span>Health Journal &amp; AI Timeline</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#047857] mt-1 leading-relaxed font-medium">
            See how your body condition evolved over time (<strong>pehle condition kaisi thi vs ab kaisi hai</strong>) &amp; chronological clinical events.
          </p>
        </div>

        {/* DEMO SWITCHER - Allows re-locking to test the paywall purchase flow */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-white border border-[#D6EDE1] p-1.5 rounded-2xl shadow-2xs">
            <span className="text-[11px] font-bold text-[#047857] px-2">Demo:</span>
            <button
              type="button"
              onClick={handleLockAgain}
              className="px-2.5 py-1 rounded-xl text-xs font-bold text-[#047857] hover:bg-[#E8F8F0] transition-all cursor-pointer"
              title="Lock again to test the subscription purchase screen"
            >
              🔒 Lock Again
            </button>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-[#059669] text-white shadow-xs">
              ✨ Unlocked (₹149)
            </span>
          </div>

          <Link
            href="/patient/subscription"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064E3B] text-xs font-bold border border-[#BCE8D0] shadow-2xs transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-[#059669]" />
            <span>Manage Plan</span>
          </Link>
        </div>
      </div>

      {/* 2. DUAL TAB SELECTOR (AI HEALTH STORY vs CHRONOLOGICAL LOG) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#D6EDE1] shadow-xs">
        <div className="flex items-center gap-2">
          {/* TAB 1: AI HEALTH STORY (BEFORE VS NOW) */}
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-[#D7F4E5] to-[#BEEBD3] text-[#064E3B] border border-[#8FE3B8] shadow-2xs"
                : "text-[#134E39] hover:bg-[#E4F5ED] hover:text-[#064E3B]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span>AI Health Story: Pehle vs Abhi</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
              ACTIVE
            </span>
          </button>

          {/* TAB 2: CHRONOLOGICAL EVENT LOG */}
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-gradient-to-r from-[#D7F4E5] to-[#BEEBD3] text-[#064E3B] border border-[#8FE3B8] shadow-2xs"
                : "text-[#134E39] hover:bg-[#E4F5ED] hover:text-[#064E3B]"
            }`}
          >
            <Clock className="w-4 h-4 text-[#059669]" />
            <span>Complete Event Log</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#064E3B]">
              {timelines.length} Records
            </span>
          </button>
        </div>
      </div>

      {/* 3. ACTIVE TAB CONTENT */}
      {activeTab === "ai" ? (
        <div className="space-y-4">
          <PatientCompareClient
            comparison={comparison}
            isDemoAccount={isDemoAccount}
            hideHeaderBanner={true}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-xs p-6">
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#059669]" />
                <span>Chronological Medical Journal</span>
              </h2>
              <p className="text-xs text-[#047857] mt-0.5 font-medium">
                Every logged doctor consultation, prescription modification, and diagnostic scan report.
              </p>
            </div>
            <TimelineTab timelines={timelines} />
          </div>
        </div>
      )}

    </div>
  );
}
