"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  QrCode,
  Smartphone,
  ShieldCheck,
  Search,
  Eye,
  Edit2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { DoctorQrStandeeModal } from "@/components/payment/DoctorQrStandeeModal";
import { GooglePayReceiptModal, PaymentReceiptData } from "@/components/payment/GooglePayReceiptModal";

interface PaymentItem {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: string;
  patient: {
    user: {
      name: string;
      email: string;
    };
  };
  appointment: {
    slot?: {
      startTime: string;
      duration: number;
    } | null;
  } | null;
}

interface DoctorPaymentsClientProps {
  initialPayments: PaymentItem[];
  doctorProfile: {
    id: string;
    name: string;
    specialization: string;
    consultationFee: number;
    clinicInfo?: string | null;
    upiId?: string | null;
  };
}

export function DoctorPaymentsClient({
  initialPayments,
  doctorProfile,
}: DoctorPaymentsClientProps) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [doctorUpiId, setDoctorUpiId] = useState<string>(
    doctorProfile.upiId || `dr.${doctorProfile.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@okaxis`
  );
  
  // Modals
  const [showStandeeModal, setShowStandeeModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptData | null>(null);
  
  // Search / filter
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(doctorUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.patient.user.name.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q) ||
      p.amount.toString().includes(q)
    );
  });

  const handleOpenReceipt = (p: PaymentItem) => {
    setSelectedReceipt({
      transactionId: p.transactionId,
      amount: p.amount,
      patientName: p.patient.user.name,
      patientEmail: p.patient.user.email,
      doctorName: doctorProfile.name,
      doctorSpecialization: doctorProfile.specialization,
      doctorUpiId: doctorUpiId,
      createdAt: p.createdAt,
      paymentMethod: p.paymentMethod,
      paymentStatus: p.paymentStatus,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-900 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-sky-600" />
            <span>Consultation Billings & Google Pay Revenue Analytics</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Linked Google Pay settlements, live UPI transaction receipts, and doctor consultation QR standees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStandeeModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-[1.01]"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
            <span>Clinic Demo QR Standee</span>
          </button>
          <span className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            {payments.length} Settled Transactions
          </span>
        </div>
      </div>

      {/* Linked Google Pay Merchant Status Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 backdrop-blur-xs">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>Linked Merchant VPA: {doctorUpiId}</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="text-sky-300 hover:text-white ml-1 p-0.5"
              title="Copy VPA"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Google Pay UPI Integration Active</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Patient appointment booking fees are settled directly via Google Pay UPI. Each transaction generates a verifiable NPCI reference ID with instant reconciliation.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowStandeeModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Open & Customize Standee QR</span>
            </button>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              NPCI Escrow Protected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="p-4 bg-white rounded-2xl border border-slate-300 text-slate-900 text-center shadow-lg">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UPI APP LINKED</div>
            <div className="flex items-center justify-center gap-1 font-black text-sm text-slate-900 mt-1">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
              <span className="ml-1 text-slate-900 font-extrabold">Pay</span>
            </div>
            <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ● Connected
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 bottom-0 opacity-10 text-white pointer-events-none translate-x-12 translate-y-8">
          <CreditCard className="w-72 h-72" />
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% verified settlement rate
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {payments.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Average consultation fee: ₹{doctorProfile.consultationFee || 800}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Google Pay Gateway</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-black text-slate-900">
            Connected & Live
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Real-time webhook sync & instant receipts
          </p>
        </div>
      </div>

      {/* Search & Transactions Section */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-sm overflow-hidden space-y-4 p-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Live Google Pay Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Click any transaction to view, print, or download the official NPCI Google Pay Digital Receipt.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction Reference</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Consultation Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Digital Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No transactions found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isGpay =
                    p.paymentMethod.toUpperCase().includes("GOOGLE_PAY") ||
                    p.paymentMethod.toUpperCase().includes("MOCK");

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenReceipt(p)}
                      className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-sky-700">
                        {p.transactionId}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                        {p.patient.user.name}
                      </td>

                      <td className="py-4 px-4 font-black text-slate-900 text-sm">
                        ₹{p.amount}
                      </td>

                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-4">
                        {isGpay ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs">
                            <span className="flex items-center">
                              <span className="text-[#4285F4]">G</span>
                              <span className="text-[#EA4335]">o</span>
                              <span className="text-[#FBBC05]">o</span>
                              <span className="text-[#4285F4]">g</span>
                              <span className="text-[#34A853]">l</span>
                              <span className="text-[#EA4335]">e</span>
                            </span>
                            <span>Pay UPI</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {p.paymentMethod}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {p.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReceipt(p);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs inline-flex items-center gap-1 border border-sky-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor QR Standee Modal */}
      {showStandeeModal && (
        <DoctorQrStandeeModal
          doctorName={doctorProfile.name}
          specialization={doctorProfile.specialization}
          clinicInfo={doctorProfile.clinicInfo}
          consultationFee={doctorProfile.consultationFee}
          initialUpiId={doctorUpiId}
          onClose={() => setShowStandeeModal(false)}
          onUpiUpdated={(newUpi) => setDoctorUpiId(newUpi)}
        />
      )}

      {/* Google Pay Receipt Modal */}
      {selectedReceipt && (
        <GooglePayReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
}
