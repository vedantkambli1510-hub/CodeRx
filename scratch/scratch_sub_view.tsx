"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Receipt,
  FileText,
  TrendingUp,
  Heart,
  Activity,
  ArrowRight,
  HelpCircle,
  Zap,
  Lock,
  Unlock,
  RotateCcw,
  UserCheck,
} from "lucide-react";
import { useSubscription } from "@/lib/subscription";

interface PatientSubscriptionViewProps {
  patientName?: string;
}

export function PatientSubscriptionView({
  patientName = "Rajesh Sharma",
}: PatientSubscriptionViewProps) {
  const { isSubscribed, plan, isLoaded, updateSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<"INDIVIDUAL" | "FAMILY">("FAMILY");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPaymentApp, setSelectedPaymentApp] = useState<"gpay" | "phonepe" | "qr" | "card">("gpay");
  const [paymentStep, setPaymentStep] = useState<"SELECT" | "PROCESSING" | "SUCCESS">("SELECT");
  const [transactionId, setTransactionId] = useState<string>("CRX-GPAY-884210");
  const [upiIdInput, setUpiIdInput] = useState<string>("rajesh.sharma@okaxis");
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  function handleOpenCheckout(planType: "INDIVIDUAL" | "FAMILY") {
    setSelectedPlan(planType);
    setPaymentStep("SELECT");
    setShowPaymentModal(true);
  }

  function handleConfirmPayment() {
    setPaymentStep("PROCESSING");
    setTimeout(() => {
      const newTx = `CRX-${selectedPaymentApp.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(newTx);
      setPaymentStep("SUCCESS");

      // Officially activate subscription in persistent state
      updateSubscription(true, selectedPlan);

      setTimeout(() => {
        setShowPaymentModal(false);
      }, 1500);
    }, 1400);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-900">
      
      {/* 1. HERO HEADER WITH 3-WAY DEMO SWITCHER */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0A1920] to-[#0A262C] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-teal-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>CODE-RX HEALTHCARE SUBSCRIPTION PORTAL</span>
            </span>

            {/* 3-WAY DEMO QUICK TOGGLE FOR EVALUATION */}
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/10 border border-white/15 text-[11px] font-bold">
              <span className="text-slate-400 px-2">Demo Mode:</span>
              <button
                type="button"
                onClick={() => updateSubscription(false)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  !isSubscribed
                    ? "bg-rose-500 text-white font-black shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title="Simulate unsubscribed locked state"
              >
                🔒 Locked
              </button>

              <button
                type="button"
                onClick={() => updateSubscription(true, "INDIVIDUAL")}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  isSubscribed && plan === "INDIVIDUAL"
                    ? "bg-teal-500 text-white font-black shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title="Simulate Solo Pass (₹99) - Unlocks individual AI timeline only"
              >
                ⚡ Solo (₹99)
              </button>

              <button
                type="button"
                onClick={() => updateSubscription(true, "FAMILY")}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  isSubscribed && plan === "FAMILY"
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title="Simulate Family Pass (₹199) - Unlocks segregated AI timelines for all family members"
              >
                👑 Family (₹199)
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Transparent Clinical Intelligence for You &amp; Your Entire Family
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Choose the <strong>Solo AI Pass</strong> for individual longitudinal biomarker tracking, or the <strong>Family Health Pass</strong> for <strong>segregated AI Timelines for all family members</strong> plus the consolidated Family Vault.
          </p>

          {/* Active Subscription Badge or Locked Status */}
          {isSubscribed ? (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Active: {plan === "FAMILY" ? "CodeRx Family Health Care Pass (₹199 / mo)" : "Solo AI Pass (₹99 / mo - 1 Individual)"}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-amber-300" />
                <span>View Tax Invoice</span>
              </button>

              <Link
                href="/patient/compare"
                className="px-3.5 py-1.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Open My Health Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {plan === "FAMILY" ? (
                <Link
                  href="/patient/family"
                  className="px-3.5 py-1.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Open Family Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenCheckout("FAMILY")}
                  className="px-3.5 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Upgrade to Family Pass (₹199)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl w-fit">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Status: Unsubscribed &bull; Clinical AI Timeline &amp; Family Vault Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. PLANS COMPARISON CARDS */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Select Your Preferred Care Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Solo plan for single-user AI tracking &bull; Family plan for segregated AI timelines across all members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* PLAN 1: SOLO AI PASS (₹99 / mo) */}
          <div className={`rounded-3xl border-2 p-7 sm:p-8 space-y-6 flex flex-col justify-between transition-all ${
            isSubscribed && plan === "INDIVIDUAL"
              ? "border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/30 shadow-md"
              : "border-slate-200 bg-white shadow-xs hover:border-slate-300"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-200">
                  Solo Patient (Sirf Ek Jan)
                </span>
                <span className="text-xs font-bold text-slate-500">1 Individual Profile</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>CodeRx Solo AI Pass</span>
                  {isSubscribed && plan === "INDIVIDUAL" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-200">
                      CURRENT PLAN
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Strictly for <strong>1 individual patient</strong>. Unlocks personal <strong>AI Health Story &amp; Longitudinal Biomarker Timeline</strong> for single users.
                </p>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-4xl font-black text-slate-900">&#8377;99</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
                <span className="text-xs font-bold text-slate-400 line-through ml-2">&#8377;499</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                  80% OFF
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-800 font-bold">
                    Individual AI Health Timeline &amp; Longitudinal Story (1 Profile)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Longitudinal Biomarker Delta Tracking (HbA1c, Creatinine, eGFR, BP)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    60-Second Layman Plain-English &amp; Hindi Audio Explainer
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Organ Breakdown (Blood Sugar, Kidneys, Heart &amp; Blood Pressure)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Automated Lab Report Digitizer &amp; PDF Export
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span>Centralized Family Vault &amp; Multi-Member Management</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span>Segregated AI Timelines for Other Family Members</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <span>Cross-Generational Hereditary Risk Mapping</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCheckout("INDIVIDUAL")}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 ${
                isSubscribed && plan === "INDIVIDUAL"
                  ? "bg-teal-50 text-teal-800 border-2 border-teal-600 hover:bg-teal-100"
                  : "border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isSubscribed && plan === "INDIVIDUAL" ? "Renew Solo Pass (₹99 / mo)" : "Unlock Solo Pass (₹99 / mo)"}</span>
            </button>
          </div>

          {/* PLAN 2: FAMILY HEALTH PASS (₹199 / mo - RECOMMENDED) */}
          <div className={`rounded-3xl border-2 border-teal-500 bg-gradient-to-b from-teal-50/50 via-white to-white p-7 sm:p-8 space-y-6 flex flex-col justify-between shadow-lg relative ${
            isSubscribed && plan === "FAMILY" ? "ring-2 ring-teal-500/40" : ""
          }`}>
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-teal-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>Recommended &bull; Segregated AI Timelines for All</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-200">
                  Entire Family Vault
                </span>
                <span className="text-xs font-extrabold text-teal-700">Up to 6 Family Members</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>CodeRx Family Health Care Pass</span>
                  {isSubscribed && plan === "FAMILY" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      CURRENT PLAN
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Unlocks <strong>Segregated AI Health Timelines for EVERY family member individually</strong> plus the complete Centralized Family Vault.
                </p>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-4xl font-black text-teal-950">&#8377;199</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
                <span className="text-xs font-bold text-slate-400 line-through ml-2">&#8377;999</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                  80% OFF
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t border-teal-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-teal-950 font-black">
                    Segregated AI Health Timelines for ALL 6 Family Members (Individually Tracked)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-800 font-bold">
                    Individual 60-Sec Layman Plain-English &amp; Hindi Explainer for Every Member
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-800 font-bold">
                    Unlocks BOTH "My Health Story" AND "Family Health Portal"
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-800 font-bold">
                    Unified Doctor Visibility: Dr. Aarav Mehta views whole family cohort &amp; syncs OPD Rx
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Hereditary &amp; Genetic Risk Mapping (Diabetes, HTN, Thyroid, Heart)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Multi-Profile Health Records &amp; Digital Prescriptions Vault
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Priority OPD Teleconsult Booking &amp; Emergency Escalation
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCheckout("FAMILY")}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 font-black text-xs text-white transition-all cursor-pointer shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{isSubscribed && plan === "FAMILY" ? "Renew Family Pass (₹199 / mo)" : "Unlock Family Health Pass (₹199 / mo)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PAYMENT & CHECKOUT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-black text-slate-900">
                  {selectedPlan === "FAMILY" ? "Family Care Pass Checkout" : "Solo AI Pass Checkout"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Summary Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Selected Plan:</span>
                <span className="font-black text-slate-900">
                  {selectedPlan === "FAMILY" ? "CodeRx Family Pass (Up to 6 Members)" : "Solo AI Pass (1 Individual Profile)"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Core Feature Unlocked:</span>
                <span className="font-bold text-teal-700">
                  {selectedPlan === "FAMILY" ? "Segregated AI Timelines for All Family Members" : "Individual AI Timeline for Rajesh"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Billing Term:</span>
                <span className="font-semibold text-slate-700">Monthly Digital Subscription</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Clinical Encryption &amp; Setup:</span>
                <span className="text-emerald-700 font-bold">FREE (₹0.00)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Amount to Pay:</span>
                <span className="text-teal-700 text-base">₹{selectedPlan === "FAMILY" ? "199.00" : "99.00"}</span>
              </div>
            </div>

            {paymentStep === "SELECT" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentApp("gpay")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPaymentApp === "gpay"
                        ? "border-blue-600 bg-blue-50/70 font-bold text-blue-900 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 text-xs"
                    }`}
                  >
                    <span className="block text-sm font-black text-blue-600">GPay</span>
                    <span className="text-[10px]">Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentApp("phonepe")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPaymentApp === "phonepe"
                        ? "border-purple-600 bg-purple-50/70 font-bold text-purple-900 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 text-xs"
                    }`}
                  >
                    <span className="block text-sm font-black text-purple-700">PhonePe</span>
                    <span className="text-[10px]">Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentApp("qr")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPaymentApp === "qr"
                        ? "border-teal-600 bg-teal-50/70 font-bold text-teal-900 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 text-xs"
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto text-teal-700 mb-0.5" />
                    <span className="text-[10px] block font-bold">UPI QR</span>
                  </button>
                </div>

                {selectedPaymentApp === "qr" ? (
                  <div className="text-center space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 mx-auto flex items-center justify-center shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=coderx.health@okaxis%26pn=CodeRx%20Health%26am=${selectedPlan === "FAMILY" ? "199.00" : "99.00"}%26cu=INR%26tn=Clinical%20Pass`}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600">
                      Scan with Google Pay, PhonePe, Paytm or BHIM
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enter UPI ID / VPA:
                    </label>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      placeholder="name@okaxis"
                    />
                    <p className="text-[10px] text-slate-400">
                      A secure UPI collect request will be pushed to your {selectedPaymentApp.toUpperCase()} app.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ₹{selectedPlan === "FAMILY" ? "199.00" : "99.00"} &amp; Unlock Features</span>
                </button>
              </div>
            )}

            {paymentStep === "PROCESSING" && (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">
                  Processing Payment Handshake...
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  Confirming with UPI Banking Gateway
                </p>
              </div>
            )}

            {paymentStep === "SUCCESS" && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm">
                  <Check className="w-6 h-6 text-emerald-700" />
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Payment of ₹{selectedPlan === "FAMILY" ? "199.00" : "99.00"} Successful!
                </h4>
                <p className="text-xs text-emerald-700 font-mono font-bold">
                  Tx ID: {transactionId}
                </p>
                <p className="text-xs text-slate-600">
                  Plan Activated: <strong>{selectedPlan === "FAMILY" ? "Family Care Pass (All AI Timelines Segregated)" : "Solo AI Pass (1 Individual)"}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAX INVOICE MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Official Tax Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
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
                <span className="text-slate-500">Features Included:</span>
                <strong className="text-teal-700">
                  {plan === "FAMILY" ? "Segregated AI Timelines for All Members + Family Vault" : "Individual AI Timeline (1 Profile)"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono text-slate-700">INV-CRX-2026-99214</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold text-slate-900">UPI AutoPay / National Payments Corp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Billed:</span>
                <span className="font-black text-slate-900">₹{plan === "FAMILY" ? "199.00" : "99.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PAID &bull; ACTIVE</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-all"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {/* 5. TRANSPARENCY & DATA PRIVACY ACCORDION */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-black text-slate-900">
            Privacy Guarantee &amp; Clinical Encryption Architecture
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Whether you choose the Solo Pass or Family Care Pass, CodeRx strictly safeguards every diagnostic record and timeline. Your health biomarkers are encrypted end-to-end and are never monetized, traded, or shared with third-party advertising brokers. Only you and authorized physicians (Dr. Aarav Mehta) maintain clinical decryption rights.
        </p>
      </div>

    </div>
  );
}
