"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  X,
  Printer,
  Download,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Edit2,
  RefreshCw,
  Share2,
} from "lucide-react";
import {
  getDoctorUpiVpa,
  buildUpiUri,
  generateUpiQrDataUrl,
} from "@/lib/payment/upi";

interface DoctorQrStandeeModalProps {
  doctorName: string;
  specialization: string;
  clinicInfo?: string | null;
  consultationFee: number;
  initialUpiId?: string | null;
  onClose: () => void;
  onUpiUpdated?: (newUpiId: string) => void;
}

export function DoctorQrStandeeModal({
  doctorName,
  specialization,
  clinicInfo,
  consultationFee,
  initialUpiId,
  onClose,
  onUpiUpdated,
}: DoctorQrStandeeModalProps) {
  const [amount, setAmount] = useState<number>(consultationFee);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState(consultationFee.toString());
  
  const [upiId, setUpiId] = useState<string>(
    initialUpiId || getDoctorUpiVpa(doctorName, initialUpiId)
  );
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [editingUpiInput, setEditingUpiInput] = useState(upiId);
  const [isSavingUpi, setIsSavingUpi] = useState(false);
  
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const printableRef = useRef<HTMLDivElement>(null);

  // Generate QR whenever upiId or amount changes
  useEffect(() => {
    let active = true;
    setIsLoadingQr(true);

    const safeAmount = amount > 0 ? amount : consultationFee;
    const details = {
      payeeVpa: upiId,
      payeeName: doctorName,
      amount: safeAmount,
      transactionNote: `Clinic Consultation - ${doctorName.slice(0, 25)}`,
      transactionRef: `DOC-STAND-${Date.now().toString().slice(-6)}`,
    };

    generateUpiQrDataUrl(details, 380)
      .then((url) => {
        if (active) {
          setQrDataUrl(url);
          setIsLoadingQr(false);
        }
      })
      .catch((err) => {
        console.error("QR standee generation failed:", err);
        if (active) setIsLoadingQr(false);
      });

    return () => {
      active = false;
    };
  }, [upiId, amount, doctorName, consultationFee]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyLink = () => {
    const uri = buildUpiUri({
      payeeVpa: upiId,
      payeeName: doctorName,
      amount: amount > 0 ? amount : consultationFee,
      transactionNote: `Doctor Consultation - ${doctorName}`,
    });
    navigator.clipboard.writeText(uri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = editingUpiInput.trim().toLowerCase();
    if (!clean || !clean.includes("@")) return;

    setIsSavingUpi(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId: clean }),
      });
      if (res.ok) {
        setUpiId(clean);
        setIsEditingUpi(false);
        if (onUpiUpdated) onUpiUpdated(clean);
      }
    } catch (err) {
      console.error("Failed to update doctor UPI ID:", err);
    } finally {
      setIsSavingUpi(false);
    }
  };

  const handleApplyCustomAmount = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(customAmountInput);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${doctorName.replace(/\s+/g, "_")}_GPay_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-xl w-full overflow-hidden text-slate-900 relative my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-sky-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white">
                Doctor Clinic Payment Standee & Demo QR
              </h2>
              <p className="text-[11px] text-slate-300">
                Official Google Pay UPI Standee for In-Person & Virtual Consultations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Quick Amount Selector / Custom Generator */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">QR Amount Preset:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setAmount(consultationFee);
                  setIsCustomAmount(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  amount === consultationFee && !isCustomAmount
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Standard (₹{consultationFee})
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount(500);
                  setIsCustomAmount(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  amount === 500 && !isCustomAmount
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Follow-up (₹500)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount(1200);
                  setIsCustomAmount(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  amount === 1200 && !isCustomAmount
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Comprehensive (₹1200)
              </button>
              <button
                type="button"
                onClick={() => setIsCustomAmount(!isCustomAmount)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isCustomAmount
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Custom ₹
              </button>
            </div>
          </div>

          {/* Custom Amount Input Row */}
          {isCustomAmount && (
            <form onSubmit={handleApplyCustomAmount} className="flex gap-2 animate-in fade-in">
              <input
                type="number"
                min="1"
                placeholder="Enter custom consultation fee in INR"
                value={customAmountInput}
                onChange={(e) => setCustomAmountInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Update Standee
              </button>
            </form>
          )}

          {/* Printable Standee Card */}
          <div
            ref={printableRef}
            className="p-6 bg-gradient-to-b from-white to-slate-50 rounded-3xl border-2 border-slate-300 shadow-lg text-center space-y-4 relative overflow-hidden"
          >
            {/* Top Google Pay Standee Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs">
                <span className="flex items-center font-black tracking-tight text-xs">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="ml-1 text-white font-extrabold">Pay</span>
                </span>
                <span className="text-slate-400 font-normal">| Accepted Here</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Verified Medical Merchant
              </span>
            </div>

            {/* Doctor Info on Standee */}
            <div className="space-y-0.5">
              <h3 className="text-lg font-black text-slate-900">{doctorName}</h3>
              <p className="text-xs text-sky-800 font-bold">{specialization}</p>
              {clinicInfo && <p className="text-[11px] text-slate-500 truncate max-w-sm mx-auto">{clinicInfo}</p>}
            </div>

            {/* Real Scannable QR Code Canvas */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-md inline-block relative mx-auto group">
              {isLoadingQr ? (
                <div className="w-52 h-52 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-sky-600 animate-spin" />
                  <span className="text-xs text-slate-500 font-medium">Generating QR...</span>
                </div>
              ) : qrDataUrl ? (
                <div className="relative">
                  <img
                    src={qrDataUrl}
                    alt={`Doctor QR Standee for ${doctorName}`}
                    className="w-52 h-52 rounded-lg object-contain mx-auto"
                  />
                  {/* Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-2 py-0.5 rounded-md bg-white border border-slate-300 shadow-xs flex items-center gap-1 text-[10px] font-black">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-slate-900 font-extrabold">Pay</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-rose-500">
                  Unable to render QR code
                </div>
              )}
            </div>

            {/* Amount & VPA Details */}
            <div className="space-y-1">
              <div className="text-xl font-black text-slate-900">
                ₹{amount} <span className="text-xs font-semibold text-slate-500">INR</span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-700 bg-white py-1 px-3 rounded-lg border border-slate-200 inline-block">
                UPI ID: {upiId}
              </div>
              <p className="text-[10px] text-slate-500">
                Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app.
              </p>
            </div>
          </div>

          {/* Edit UPI ID Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Settlement Google Pay UPI ID</span>
              {!isEditingUpi && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUpiInput(upiId);
                    setIsEditingUpi(true);
                  }}
                  className="flex items-center gap-1 text-sky-600 font-bold hover:underline"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit UPI ID</span>
                </button>
              )}
            </div>

            {isEditingUpi ? (
              <form onSubmit={handleSaveUpi} className="flex gap-2">
                <input
                  type="text"
                  value={editingUpiInput}
                  onChange={(e) => setEditingUpiInput(e.target.value)}
                  placeholder="e.g. dr.aarav.mehta@okaxis"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={isSavingUpi}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  {isSavingUpi ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingUpi(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 px-2 py-1 rounded-lg hover:bg-sky-50"
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
            )}
          </div>

          {/* Action buttons (Download, Print, Copy Intent) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Standee</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy UPI Link</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
