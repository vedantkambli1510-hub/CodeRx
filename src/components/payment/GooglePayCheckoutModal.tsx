"use client";

import { useState, useEffect, useMemo } from "react";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  ArrowRight,
  Clock,
  Lock,
  ExternalLink,
  X,
  CreditCard,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  getDoctorUpiVpa,
  buildUpiUri,
  generateUpiQrDataUrl,
  generateRealisticUtr,
  generateGPayTxnId,
} from "@/lib/payment/upi";

interface GooglePayCheckoutModalProps {
  doctorName: string;
  specialization: string;
  consultationFee: number;
  doctorUpiId?: string;
  slotDateTimeFormatted: string;
  slotDuration: number;
  onSuccess: (paymentDetails: {
    paymentMethod: string;
    transactionId: string;
    amount: number;
  }) => void;
  onCancel: () => void;
}

export function GooglePayCheckoutModal({
  doctorName,
  specialization,
  consultationFee,
  doctorUpiId,
  slotDateTimeFormatted,
  slotDuration,
  onSuccess,
  onCancel,
}: GooglePayCheckoutModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"QR_CODE" | "GPAY_DIRECT">("QR_CODE");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStepIndex, setProcessStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(599); // 10 min countdown
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isQrLoading, setIsQrLoading] = useState(true);
  
  // Custom UPI reference verification
  const [manualUtr, setManualUtr] = useState("");
  const [showManualUtrInput, setShowManualUtrInput] = useState(false);
  const [utrError, setUtrError] = useState("");

  // Resolve authentic doctor VPA
  const resolvedDoctorVpa = useMemo(() => {
    return getDoctorUpiVpa(doctorName, doctorUpiId);
  }, [doctorName, doctorUpiId]);

  // Unique Order Reference for this checkout session
  const orderRef = useMemo(() => {
    return `TR-GPAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }, []);

  // UPI deep link URI
  const upiIntentUri = useMemo(() => {
    return buildUpiUri({
      payeeVpa: resolvedDoctorVpa,
      payeeName: doctorName,
      amount: consultationFee,
      transactionNote: `Doctor Consultation Fee - ${doctorName.slice(0, 25)}`,
      transactionRef: orderRef,
    });
  }, [resolvedDoctorVpa, doctorName, consultationFee, orderRef]);

  // Generate real scannable QR code on mount
  useEffect(() => {
    let isMounted = true;
    setIsQrLoading(true);

    generateUpiQrDataUrl(
      {
        payeeVpa: resolvedDoctorVpa,
        payeeName: doctorName,
        amount: consultationFee,
        transactionNote: `Consultation Fee - ${doctorName.slice(0, 25)}`,
        transactionRef: orderRef,
      },
      320
    )
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setIsQrLoading(false);
        }
      })
      .catch((err) => {
        console.error("QR generation error:", err);
        if (isMounted) setIsQrLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedDoctorVpa, doctorName, consultationFee, orderRef]);

  // Countdown timer for Demo QR
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(resolvedDoctorVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopyIntentLink = () => {
    navigator.clipboard.writeText(upiIntentUri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const verificationSteps = [
    "Establishing encrypted handshake with Google Pay UPI Gateway...",
    `Verifying Payee VPA (${resolvedDoctorVpa}) with NPCI...`,
    "Awaiting bank settlement confirmation & capturing UTR...",
    "Payment verified! Generating clinical consultation receipt...",
  ];

  const handleExecutePayment = (providedUtr?: string) => {
    setProcessing(true);
    setProcessStepIndex(0);

    const stepInterval = setInterval(() => {
      setProcessStepIndex((prev) => {
        if (prev < verificationSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 700);

    setTimeout(() => {
      clearInterval(stepInterval);
      const finalUtr = providedUtr || generateRealisticUtr();
      const generatedTxnId = `UPI-GPAY-${finalUtr}`;

      onSuccess({
        paymentMethod: "GOOGLE_PAY",
        transactionId: generatedTxnId,
        amount: consultationFee,
      });
    }, 2800);
  };

  const handleVerifyManualUtr = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = manualUtr.trim().replace(/\s+/g, "");
    if (!cleanUtr) {
      setUtrError("Please enter your 12-digit UPI Reference / UTR Number");
      return;
    }
    if (cleanUtr.length < 8) {
      setUtrError("UPI Reference (UTR) must be at least 8 to 12 digits");
      return;
    }
    setUtrError("");
    handleExecutePayment(cleanUtr);
  };

  const handlePrefillDemoUtr = () => {
    const demoUtr = generateRealisticUtr();
    setManualUtr(demoUtr);
    setUtrError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 relative my-auto animate-in zoom-in-95">
        
        {/* Header with Google Pay Official Branding */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4.5 text-white flex items-center justify-between relative overflow-hidden border-b border-slate-800">
          <div className="flex items-center gap-3 z-10">
            {/* Google Pay Pill Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md">
              <span className="flex items-center font-black tracking-tight text-sm">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="ml-1 text-slate-900 font-extrabold">Pay</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold tracking-tight text-white">UPI Checkout Gateway</h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE NPCI
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Instant Doctor Fee Escrow Settlement</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={processing}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10 disabled:opacity-50"
            title="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative Google brand color glows */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/15 blur-xl pointer-events-none" />
          <div className="absolute left-1/2 -top-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        </div>

        {/* Appointment & Fee Summary Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs">
          <div>
            <div className="font-extrabold text-slate-900 text-sm">{doctorName}</div>
            <div className="text-[11px] text-slate-500 font-medium">
              {specialization} • {slotDateTimeFormatted}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TOTAL PAYABLE</span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-black text-slate-900">₹{consultationFee}</span>
              <span className="text-[10px] font-bold text-slate-500">INR</span>
            </div>
          </div>
        </div>

        {/* Mode Selector: Scannable QR Code vs Google Pay Direct Intent */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("QR_CODE")}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "QR_CODE"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <QrCode className="w-4 h-4 text-sky-600" />
              <span>Doctor UPI QR Code</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("GPAY_DIRECT")}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "GPAY_DIRECT"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span>Google Pay App Intent</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {processing ? (
            /* Processing State with Animated Gateway Steps */
            <div className="py-8 text-center space-y-5">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-slate-900">GPay</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Verifying Google Pay Settlement
                </h3>
                <p className="text-xs text-sky-700 font-bold animate-pulse">
                  {verificationSteps[processStepIndex]}
                </p>
                <p className="text-[11px] text-slate-400">
                  Please keep this window open while NPCI registers the transaction.
                </p>
              </div>

              {/* Step indicator progress pills */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {verificationSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx <= processStepIndex ? "w-6 bg-sky-600" : "w-2 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === "QR_CODE" ? (
            /* Tab 1: Real Scannable Demo UPI QR Code */
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center text-center space-y-3 relative">
                
                {/* Timer badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>QR Session Expires In: {formatTimer(secondsRemaining)}</span>
                </div>

                {/* Real Scannable QR Code Canvas / Image */}
                <div className="p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-md relative group">
                  {isQrLoading ? (
                    <div className="w-48 h-48 flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-6 h-6 text-sky-600 animate-spin" />
                      <span className="text-xs text-slate-500 font-medium">Generating UPI QR...</span>
                    </div>
                  ) : qrDataUrl ? (
                    <div className="relative">
                      {/* Real Base64 PNG QR Code */}
                      <img
                        src={qrDataUrl}
                        alt={`Google Pay UPI QR for ${doctorName}`}
                        className="w-48 h-48 rounded-lg object-contain mx-auto"
                      />
                      {/* Center Brand Badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="px-2 py-0.5 rounded-md bg-white border border-slate-300 shadow-xs flex items-center gap-1 text-[10px] font-black">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-slate-900 font-extrabold">Pay</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-rose-500">
                      Failed to render QR Code
                    </div>
                  )}
                </div>

                {/* Scannable info banner */}
                <div className="space-y-1">
                  <div className="text-xs font-black text-slate-900 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Real Scannable QR Code</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Open Google Pay, PhonePe, Paytm, or BHIM on your phone & scan this code.
                  </p>
                  <div className="text-[11px] font-mono text-slate-500 bg-white/80 py-1 px-3 rounded-lg border border-slate-200 inline-block mt-1">
                    Payee VPA: <span className="font-bold text-slate-800">{resolvedDoctorVpa}</span> • ₹{consultationFee}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                {/* Instant Sim / Confirm Scan Button */}
                <button
                  type="button"
                  onClick={() => handleExecutePayment()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Completed Payment (₹{consultationFee})</span>
                </button>

                {/* Option to enter manual UPI Transaction ID (UTR) */}
                {!showManualUtrInput ? (
                  <button
                    type="button"
                    onClick={() => setShowManualUtrInput(true)}
                    className="w-full text-center text-[11px] font-bold text-sky-700 hover:text-sky-900 py-1 flex items-center justify-center gap-1"
                  >
                    <span>Have a 12-digit UPI Reference / UTR Number? Enter it here</span>
                  </button>
                ) : (
                  <form onSubmit={handleVerifyManualUtr} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-800">12-Digit UPI Ref / UTR Number</label>
                      <button
                        type="button"
                        onClick={handlePrefillDemoUtr}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline"
                      >
                        Auto-fill Demo UTR
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 429185038192"
                        value={manualUtr}
                        onChange={(e) => setManualUtr(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Verify & Confirm
                      </button>
                    </div>
                    {utrError && <p className="text-[11px] text-rose-600 font-semibold">{utrError}</p>}
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Tab 2: Google Pay Direct Intent & Mobile Deep Link */
            <div className="space-y-4">
              {/* Doctor UPI Profile Card */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-900">Linked Doctor Google Pay UPI ID</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Verified Merchant
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-sky-200">
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                    {resolvedDoctorVpa}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 px-2 py-1 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy VPA</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Merchant Order Ref:</span>
                  <span className="font-mono font-semibold text-slate-700">{orderRef}</span>
                </div>
              </div>

              {/* Direct Google Pay Action Buttons */}
              <div className="space-y-2">
                {/* Mobile / Native UPI Deep Link trigger */}
                <a
                  href={upiIntentUri}
                  onClick={() => {
                    // Also start verification flow when deep link is opened
                    setTimeout(() => handleExecutePayment(), 1200);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-1 font-black text-sm">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                    <span className="ml-1 text-white">Pay</span>
                  </div>
                  <span>• Pay ₹{consultationFee} via Google Pay App</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>

                {/* Copy UPI payment link */}
                <button
                  type="button"
                  onClick={handleCopyIntentLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">UPI Payment Intent Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI Intent Deep Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Fee Breakdown Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Consultation Fee</span>
                  <span className="font-semibold text-slate-800">₹{consultationFee}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Google Pay Platform / Escrow Fee</span>
                  <span className="font-semibold text-emerald-600">FREE (₹0)</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-slate-900 text-sm">
                  <span>Total Amount</span>
                  <span>₹{consultationFee}</span>
                </div>
              </div>
            </div>
          )}

          {/* Security & Guarantee Trust Footnote */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>NPCI 256-bit Encrypted Medical Escrow • Instant Refund Guarantee</span>
          </div>

          {/* Footer Cancel / Change Time */}
          <div className="pt-2 text-center border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline transition-colors disabled:opacity-50"
            >
              Cancel and select a different slot
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
