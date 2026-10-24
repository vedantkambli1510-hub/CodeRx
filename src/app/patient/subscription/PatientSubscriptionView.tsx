"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
  QrCode,
  Receipt,
  ArrowRight,
  Lock,
  Clock,
} from "lucide-react";
import { useSubscription } from "@/lib/subscription";

interface PatientSubscriptionViewProps {
  patientName?: string;
}

export function PatientSubscriptionView({
  patientName = "Rajesh Sharma",
}: PatientSubscriptionViewProps) {
  const { isSubscribed, plan, updateSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<"INDIVIDUAL" | "FAMILY">("FAMILY");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPaymentApp, setSelectedPaymentApp] = useState<"gpay" | "phonepe" | "qr">("gpay");
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
    }, 1300);
  }

  const getPlanTitle = (type: "INDIVIDUAL" | "FAMILY") => {
    return "Essential Care";
  };

  const getPlanPrice = (type: "INDIVIDUAL" | "FAMILY") => {
    return "99";
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 text-[#064E3B]">
      
      {/* ============================================================== */}
      {/* 1. TOP HERO BANNER: SELECT YOUR PREFERRED CARE PLAN             */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#F0F8F5] via-[#E8F8F0] to-[#DCF5E7] border border-[#8FE3B8] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        {/* Soft decorative background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/80 border border-[#8FE3B8] text-[#059669] flex items-center gap-1.5 shadow-2xs">
                <Crown className="w-3.5 h-3.5" />
                <span>CodeRx Care Membership</span>
              </span>

              {/* DEMO SWITCHER */}
              <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-white/70 border border-[#8FE3B8] text-[10px] font-bold">
                <span className="text-[#047857] px-2">Demo:</span>
                <button
                  type="button"
                  onClick={() => updateSubscription(false)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    !isSubscribed ? "bg-[#059669] text-white font-black" : "text-[#047857] hover:bg-[#E8F8F0]"
                  }`}
                  title="Simulate unsubscribed locked state"
                >
                  🔒 Locked
                </button>
                <button
                  type="button"
                  onClick={() => updateSubscription(true, "INDIVIDUAL")}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    isSubscribed ? "bg-[#059669] text-white font-black" : "text-[#047857] hover:bg-[#E8F8F0]"
                  }`}
                  title="Simulate Active (₹99)"
                >
                  ✨ Active (₹99)
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#064E3B] tracking-tight leading-tight">
              Select Your Preferred Care Plan
            </h1>

            <p className="text-xs sm:text-sm text-[#047857] leading-relaxed font-medium">
              Quality healthcare for you and your family, at your convenience.
            </p>

            {/* Badges: Trusted Doctors, Secure & Private, 24/7 Support */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#D6EDE1] text-xs font-bold text-[#047857] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Trusted Doctors</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#D6EDE1] text-xs font-bold text-[#047857] shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#059669]" />
                <span>Secure &amp; Private</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#D6EDE1] text-xs font-bold text-[#047857] shadow-2xs">
                <Clock className="w-4 h-4 text-[#059669]" />
                <span>24/7 Support</span>
              </span>
            </div>
          </div>

          {/* Right Header Graphic: Stethoscope + Handwritten "Your Health Matters ♡" */}
          <div className="relative shrink-0 flex items-center justify-end">
            <div className="w-48 sm:w-60 h-32 relative flex items-center justify-center">
              {/* Cute Stethoscope Graphic */}
              <svg viewBox="0 0 200 120" className="w-full h-full opacity-90 drop-shadow-xs">
                <path
                  d="M 30 20 Q 30 70 80 75 Q 130 80 150 45"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="30" cy="20" r="7" fill="#8FE3B8" />
                <circle cx="50" cy="20" r="7" fill="#8FE3B8" />
                <path
                  d="M 50 20 Q 50 60 80 75"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Bell / Diaphragm */}
                <circle cx="160" cy="45" r="14" fill="#FFFFFF" stroke="#059669" strokeWidth="4" />
                <circle cx="160" cy="45" r="6" fill="#8FE3B8" />

                {/* Heart Pulse Icon in Center */}
                <g transform="translate(100, 15) scale(0.7)">
                  <rect x="0" y="0" width="46" height="42" rx="12" fill="#059669" />
                  <path
                    d="M 8 21 L 16 21 L 20 10 L 26 32 L 30 21 L 38 21"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              </svg>

              {/* Handwritten font callout */}
              <div className="absolute right-0 -bottom-1 text-right">
                <p className="italic text-sm sm:text-base font-bold text-[#059669] rotate-[-4deg] tracking-tight">
                  Your Health
                </p>
                <p className="italic text-sm sm:text-base font-bold text-[#047857] rotate-[-4deg] flex items-center justify-end gap-1">
                  <span>Matters</span>
                  <span className="text-[#059669]">✓</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CARE PLAN: CODE-RX ESSENTIAL CARE (₹99/mo)                   */}
      {/* ============================================================== */}
      <div className="max-w-md mx-auto pt-2">
        <div className="bg-white rounded-3xl border-2 border-[#059669] shadow-lg p-7 sm:p-8 flex flex-col justify-between relative hover:shadow-xl transition-all">
          {/* MOST POPULAR TAG */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#059669] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>CODE-RX CARE PASS</span>
          </div>

          <div className="space-y-5">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#E8F8F0] text-[#047857] border border-[#BCE8D0]">
                ACTIVE CARE
              </span>
              <h3 className="text-2xl font-black text-[#064E3B] mt-3">Essential Care Pass</h3>
              <p className="text-xs text-[#047857] font-medium mt-1">
                Complete clinical intelligence &amp; everyday health needs
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1 pb-3 border-b border-[#D6EDE1]">
              <span className="text-4xl font-black text-[#064E3B]">&#8377;99</span>
              <span className="text-xs font-bold text-[#047857]">/month</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0] ml-auto">
                POPULAR
              </span>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 text-xs sm:text-sm text-[#047857]">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 shrink-0 stroke-[2.5]" />
                <span className="font-bold text-[#064E3B]">AI Health Story (Pehle vs Abhi Timeline)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 shrink-0 stroke-[2.5]" />
                <span className="font-semibold text-[#064E3B]">Longitudinal Biomarker Shifts (HbA1c, eGFR)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Doctor OPD Consultations &amp; Appointments</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Digital Prescriptions &amp; Pharmacy Refills</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Diagnostic Lab Reports Access</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#059669] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>24/7 AI Health Assistant Insights</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => handleOpenCheckout("INDIVIDUAL")}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25"
            >
              <span>{isSubscribed ? "Active Plan" : "Subscribe Now (₹99/mo)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. PAYMENT & CHECKOUT MODAL                                     */}
      {/* ============================================================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6EDE1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#064E3B]">
                  {getPlanTitle(selectedPlan)} Checkout
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
            <div className="p-4 rounded-2xl bg-[#F3FAF6] border border-[#D6EDE1] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#047857] font-medium">Selected Plan:</span>
                <span className="font-black text-[#064E3B]">
                  CodeRx {getPlanTitle(selectedPlan)} Plan
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#047857] font-medium">Billing Term:</span>
                <span className="font-semibold text-[#064E3B]">Monthly Auto-Renew</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#047857] font-medium">Clinical Security Setup:</span>
                <span className="text-emerald-700 font-bold">FREE (₹0.00)</span>
              </div>
              <div className="pt-2 border-t border-[#D6EDE1] flex justify-between items-center text-sm font-black text-[#064E3B]">
                <span>Total Amount to Pay:</span>
                <span className="text-[#059669] text-base">₹{getPlanPrice(selectedPlan)}.00</span>
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
                        ? "border-[#059669] bg-[#E8F8F0] font-bold text-[#064E3B] shadow-xs"
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
                        ? "border-[#059669] bg-[#E8F8F0] font-bold text-[#064E3B] shadow-xs"
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
                        ? "border-[#059669] bg-[#E8F8F0] font-bold text-[#064E3B] shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 text-xs"
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto text-[#059669] mb-0.5" />
                    <span className="text-[10px] block font-bold">UPI QR</span>
                  </button>
                </div>

                {selectedPaymentApp === "qr" ? (
                  <div className="text-center space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 mx-auto flex items-center justify-center shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=coderx.health@okaxis%26pn=CodeRx%20Health%26am=${getPlanPrice(selectedPlan)}.00%26cu=INR%26tn=Care%20Plan`}
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ₹{getPlanPrice(selectedPlan)}.00 &amp; Activate Plan</span>
                </button>
              </div>
            )}

            {paymentStep === "PROCESSING" && (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto" />
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
                  Payment of ₹{getPlanPrice(selectedPlan)}.00 Successful!
                </h4>
                <p className="text-xs text-emerald-700 font-mono font-bold">
                  Tx ID: {transactionId}
                </p>
                <p className="text-xs text-slate-600">
                  Plan Activated: <strong>CodeRx {getPlanTitle(selectedPlan)}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. TAX INVOICE MODAL                                            */}
      {/* ============================================================== */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#059669]" />
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
                  CodeRx Essential Care Pass
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
                <span className="font-black text-slate-900">₹99.00</span>
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

    </div>
  );
}
