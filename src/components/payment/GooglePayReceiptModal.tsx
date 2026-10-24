"use client";

import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  CreditCard,
  Building,
  User,
  Clock,
  Download,
} from "lucide-react";
import { useState } from "react";

export interface PaymentReceiptData {
  transactionId: string;
  amount: number;
  patientName: string;
  patientEmail?: string;
  doctorName: string;
  doctorSpecialization?: string;
  doctorUpiId?: string;
  consultationDate?: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface GooglePayReceiptModalProps {
  receipt: PaymentReceiptData;
  onClose: () => void;
}

export function GooglePayReceiptModal({ receipt, onClose }: GooglePayReceiptModalProps) {
  const [copiedTxn, setCopiedTxn] = useState(false);

  const handleCopyTxn = () => {
    navigator.clipboard.writeText(receipt.transactionId);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(receipt.createdAt).toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-md w-full overflow-hidden text-slate-900 relative my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4.5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs">
              <span className="flex items-center font-black tracking-tight text-xs">
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
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Digital Payment Receipt
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5">
          
          {/* Success Check and Amount */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Payment Completed • Verified NPCI
              </span>
              <div className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
                ₹{receipt.amount.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Doctor (Payee)</span>
              <span className="font-extrabold text-slate-900 text-right">{receipt.doctorName}</span>
            </div>

            {receipt.doctorUpiId && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Doctor UPI VPA</span>
                <span className="font-mono font-bold text-sky-800 text-right">{receipt.doctorUpiId}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Patient (Payer)</span>
              <span className="font-extrabold text-slate-900 text-right">{receipt.patientName}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Payment Channel</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Google Pay UPI (Instant)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">NPCI Ref / Transaction ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900 text-[11px] truncate max-w-[150px]">
                  {receipt.transactionId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTxn}
                  className="p-1 hover:bg-slate-100 rounded text-sky-600 transition-colors"
                  title="Copy ID"
                >
                  {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">GST / Taxes</span>
              <span className="font-semibold text-emerald-700">Exempt (Healthcare Services)</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">Settlement Status</span>
              <span className="font-bold text-emerald-700">T+0 Instant Bank Credit</span>
            </div>
          </div>

          {/* Escrow Guarantee Footnote */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              This is a digitally verified medical consultation receipt issued under CodeRx Health Escrow.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
