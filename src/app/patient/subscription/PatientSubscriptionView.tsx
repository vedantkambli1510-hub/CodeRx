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
    switch (type) {
      case "INDIVIDUAL":
        return "Essential Care";
      case "FAMILY":
        return "Family Health";
    }
  };

  const getPlanPrice = (type: "INDIVIDUAL" | "FAMILY") => {
    switch (type) {
      case "INDIVIDUAL":
        return "99";
      case "FAMILY":
        return "199";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 text-[#4C0519]">
      
      {/* ============================================================== */}
      {/* 1. TOP HERO BANNER: SELECT YOUR PREFERRED CARE PLAN             */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FFF0F5] via-[#FFE4ED] to-[#FCE7F0] border border-[#FDA4AF] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        {/* Soft decorative background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/80 border border-[#FDA4AF] text-[#E11D48] flex items-center gap-1.5 shadow-2xs">
                <Crown className="w-3.5 h-3.5" />
                <span>CodeRx Care Memberships</span>
              </span>

              {/* DEMO SWITCHER */}
              <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-white/70 border border-[#FDA4AF] text-[10px] font-bold">
                <span className="text-[#881337] px-2">Demo:</span>
                <button
                  type="button"
                  onClick={() => updateSubscription(false)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    !isSubscribed ? "bg-[#E11D48] text-white font-black" : "text-[#881337] hover:bg-pink-100"
                  }`}
                  title="Simulate unsubscribed locked state"
                >
                  🔒 Locked
                </button>
                <button
                  type="button"
                  onClick={() => updateSubscription(true, "INDIVIDUAL")}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    isSubscribed && plan === "INDIVIDUAL" ? "bg-[#E11D48] text-white font-black" : "text-[#881337] hover:bg-pink-100"
                  }`}
                  title="Simulate Basic (₹99)"
                >
                  Basic (₹99)
                </button>
                <button
                  type="button"
                  onClick={() => updateSubscription(true, "FAMILY")}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    isSubscribed && (plan === "FAMILY" || plan === "PREMIUM") ? "bg-[#E11D48] text-white font-black" : "text-[#881337] hover:bg-pink-100"
                  }`}
                  title="Simulate Family (₹199)"
                >
                  Family (₹199)
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#4C0519] tracking-tight leading-tight">
              Select Your Preferred Care Plan
            </h1>

            <p className="text-xs sm:text-sm text-[#881337] leading-relaxed font-medium">
              Quality healthcare for you and your family, at your convenience.
            </p>

            {/* Badges: Trusted Doctors, Secure & Private, 24/7 Support */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#FCE7F0] text-xs font-bold text-[#881337] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#E11D48]" />
                <span>Trusted Doctors</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#FCE7F0] text-xs font-bold text-[#881337] shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Secure &amp; Private</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#FCE7F0] text-xs font-bold text-[#881337] shadow-2xs">
                <Clock className="w-4 h-4 text-[#E11D48]" />
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
                  stroke="#E11D48"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="30" cy="20" r="7" fill="#FDA4AF" />
                <circle cx="50" cy="20" r="7" fill="#FDA4AF" />
                <path
                  d="M 50 20 Q 50 60 80 75"
                  stroke="#E11D48"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Bell / Diaphragm */}
                <circle cx="160" cy="45" r="14" fill="#FFFFFF" stroke="#E11D48" strokeWidth="4" />
                <circle cx="160" cy="45" r="6" fill="#FDA4AF" />

                {/* Heart Pulse Icon in Center */}
                <g transform="translate(100, 15) scale(0.7)">
                  <rect x="0" y="0" width="46" height="42" rx="12" fill="#E11D48" />
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
                <p className="font-serif italic text-sm sm:text-base font-bold text-[#E11D48] rotate-[-4deg] tracking-tight">
                  Your Health
                </p>
                <p className="font-serif italic text-sm sm:text-base font-bold text-[#881337] rotate-[-4deg] flex items-center justify-end gap-1">
                  <span>Matters</span>
                  <span className="text-[#E11D48]">♡</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CARE PLANS: FIRST TWO PLANS ONLY (ESSENTIAL & FAMILY)       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-2">
        
        {/* ---------------------------------------------------------- */}
        {/* PLAN 1: BASIC (Essential Care - ₹99/mo)                   */}
        {/* ---------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-[#FCE7F0] shadow-sm p-7 sm:p-8 flex flex-col justify-between hover:shadow-md hover:border-[#FDA4AF] transition-all">
          <div className="space-y-5">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-[#BE123C] border border-pink-200">
                BASIC
              </span>
              <h3 className="text-2xl font-black text-[#4C0519] mt-3">Essential Care</h3>
              <p className="text-xs text-[#881337] font-medium mt-1">
                For your everyday health needs
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 pt-1 pb-3 border-b border-[#FCE7F0]">
              <span className="text-4xl font-black text-[#4C0519]">&#8377;99</span>
              <span className="text-xs font-bold text-[#881337]">/month</span>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 text-xs sm:text-sm text-[#881337]">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span className="font-semibold text-[#4C0519]">1 Upcoming Appointment</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Doctor Consultations (General)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Digital Prescriptions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Access to Medical Records</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Health Tips &amp; Guidance</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => handleOpenCheckout("INDIVIDUAL")}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs ${
                isSubscribed && plan === "INDIVIDUAL"
                  ? "bg-pink-100 text-[#E11D48] border border-[#FDA4AF]"
                  : "bg-white text-[#4C0519] border border-[#FDA4AF] hover:bg-[#FFF5F8] hover:border-[#E11D48]"
              }`}
            >
              <span>{isSubscribed && plan === "INDIVIDUAL" ? "Current Plan" : "Choose Basic"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* PLAN 2: FAMILY (Family Health - ₹199/mo) - MOST POPULAR    */}
        {/* ---------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border-2 border-[#E11D48] shadow-lg p-7 sm:p-8 flex flex-col justify-between relative hover:shadow-xl transition-all scale-[1.02]">
          {/* MOST POPULAR TAG */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E11D48] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            <span>MOST POPULAR</span>
          </div>

          <div className="space-y-5">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-[#BE123C] border border-pink-200">
                FAMILY
              </span>
              <h3 className="text-2xl font-black text-[#4C0519] mt-3">Family Health</h3>
              <p className="text-xs text-[#881337] font-medium mt-1">
                Complete care for your loved ones
              </p>
            </div>

            {/* Price & 20% OFF Tag */}
            <div className="flex items-baseline gap-2 pt-1 pb-3 border-b border-[#FCE7F0]">
              <span className="text-4xl font-black text-[#4C0519]">&#8377;199</span>
              <span className="text-xs font-bold text-[#881337]">/month</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-pink-100 text-[#E11D48] border border-pink-200 ml-auto">
                20% OFF
              </span>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 text-xs sm:text-sm text-[#881337]">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span className="font-black text-[#4C0519]">Up to 4 Family Members</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span className="font-semibold text-[#4C0519]">Unlimited Consultations</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Digital Prescriptions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Lab Reports Access</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span className="font-bold text-[#E11D48]">Health Timeline (AI)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#E11D48] mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Priority Support</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => handleOpenCheckout("FAMILY")}
              className="w-full py-3 px-4 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-pink-500/25"
            >
              <span>{isSubscribed && (plan === "FAMILY" || plan === "PREMIUM") ? "Active Plan" : "Choose Family"}</span>
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
          <div className="bg-white rounded-3xl border border-[#FCE7F0] shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#FCE7F0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-100 text-[#E11D48] flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#4C0519]">
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
            <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FCE7F0] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#881337] font-medium">Selected Plan:</span>
                <span className="font-black text-[#4C0519]">
                  CodeRx {getPlanTitle(selectedPlan)} Plan
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#881337] font-medium">Billing Term:</span>
                <span className="font-semibold text-[#4C0519]">Monthly Auto-Renew</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#881337] font-medium">Clinical Security Setup:</span>
                <span className="text-emerald-700 font-bold">FREE (₹0.00)</span>
              </div>
              <div className="pt-2 border-t border-[#FCE7F0] flex justify-between items-center text-sm font-black text-[#4C0519]">
                <span>Total Amount to Pay:</span>
                <span className="text-[#E11D48] text-base">₹{getPlanPrice(selectedPlan)}.00</span>
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
                        ? "border-[#E11D48] bg-pink-50 font-bold text-[#E11D48] shadow-xs"
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
                        ? "border-[#E11D48] bg-pink-50 font-bold text-[#E11D48] shadow-xs"
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
                        ? "border-[#E11D48] bg-pink-50 font-bold text-[#E11D48] shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 text-xs"
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto text-[#E11D48] mb-0.5" />
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-hidden focus:ring-2 focus:ring-pink-500"
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
                  className="w-full py-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ₹{getPlanPrice(selectedPlan)}.00 &amp; Activate Plan</span>
                </button>
              </div>
            )}

            {paymentStep === "PROCESSING" && (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin mx-auto" />
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
          <div className="bg-white rounded-3xl border border-[#FCE7F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#E11D48]" />
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
                  CodeRx {plan === "FAMILY" || plan === "PREMIUM" ? "Family Health" : "Essential Care"}
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
                <span className="font-black text-slate-900">₹{plan === "FAMILY" || plan === "PREMIUM" ? "199" : "99"}.00</span>
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
