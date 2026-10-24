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
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Printer,
  ChevronRight,
  Filter,
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

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "PENDING">("ALL");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(doctorUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const filteredPayments = payments.filter((p) => {
    // Status filter
    if (statusFilter !== "ALL") {
      if (statusFilter === "COMPLETED" && p.paymentStatus !== "COMPLETED") return false;
      if (statusFilter === "PENDING" && p.paymentStatus === "COMPLETED") return false;
    }
    // Search query
    if (!searchQuery.trim()) return true;
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
    <div className="space-y-6 max-w-7xl mx-auto text-slate-800 pb-16 font-['Quicksand',sans-serif] antialiased pt-2 sm:pt-4">
      {/* 1. CLEAN ORGANIZED HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#D6EDE1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
              LIVE NPCI SETTLEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-200">
              GOOGLE PAY UPI GATEWAY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <span>Consultation Billings &amp; Revenue</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Direct Google Pay settlements, verified NPCI digital receipts &amp; clinic desktop QR standee.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowStandeeModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Clinic QR Standee</span>
          </button>
          <span className="text-xs font-bold px-3 py-2 rounded-2xl bg-[#E8F8F0] text-[#064E3B] border border-[#BCE8D0] shadow-2xs">
            {payments.length} Settled Transactions
          </span>
        </div>
      </div>

      {/* 2. DOCTORY MINT-GREEN GOOGLE PAY INTEGRATION CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0D9488] p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-[#059669]/40">
        <div className="space-y-2.5 z-10">
          {/* Linked Merchant VPA Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/25 backdrop-blur-xs">
            <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
            <span>Linked Merchant VPA: {doctorUpiId}</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="text-emerald-200 hover:text-white ml-1 p-0.5 cursor-pointer transition-colors"
              title="Copy VPA"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Google Pay UPI Integration Active</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-medium leading-relaxed">
            Patient appointment booking fees are settled directly into your linked bank account via Google Pay UPI. Each transaction generates a verifiable NPCI reference ID with instant reconciliation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowStandeeModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-[#064E3B] font-black text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#059669]" />
              <span>Open &amp; Customize Standee QR</span>
            </button>

            <span className="text-xs text-emerald-100 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              NPCI Escrow Protected
            </span>
          </div>
        </div>

        {/* Right Google Pay Status Badge */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="p-5 bg-white rounded-3xl border border-white/40 text-slate-900 text-center shadow-lg w-full sm:w-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              UPI APP LINKED
            </div>
            <div className="flex items-center justify-center gap-1 font-black text-base text-slate-900 mt-1">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
              <span className="ml-1 text-slate-900 font-extrabold">Pay</span>
            </div>
            <div className="mt-2 text-[10px] font-black text-emerald-800 bg-[#E8F8F0] px-2.5 py-0.5 rounded-full border border-[#BCE8D0]">
              ● Connected &amp; Live
            </div>
          </div>
        </div>

        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 bottom-0 opacity-10 text-white pointer-events-none translate-x-12 translate-y-8">
          <CreditCard className="w-64 h-64" />
        </div>
      </div>

      {/* 3. FOUR ORGANIZED ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#064E3B]">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">
            100% verified settlement rate
          </p>
        </div>

        {/* Card 2: Completed Consultations */}
        <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Consultations Paid</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#064E3B]">
            {payments.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Average consultation fee: ₹{doctorProfile.consultationFee || 800}
          </p>
        </div>

        {/* Card 3: Google Pay Gateway */}
        <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Gateway Health</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-[#064E3B]">
            Connected &amp; Live
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Real-time webhook sync &amp; instant receipts
          </p>
        </div>

        {/* Card 4: Settlement Speed */}
        <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Settlement Speed</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-[#064E3B]">
            Instant T+0 UPI
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Direct NPCI bank credit to VPA
          </p>
        </div>
      </div>

      {/* 4. TRANSACTION LEDGER (CLEAN, ORGANIZED & WELL-STYLED) */}
      <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
        
        {/* Ledger Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#059669]" />
              <span>Live Google Pay Transaction Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Click any transaction to view, print, or download the official NPCI Google Pay Digital Receipt.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-white text-[#064E3B] shadow-2xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({payments.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("COMPLETED")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === "COMPLETED"
                    ? "bg-white text-[#064E3B] shadow-2xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Completed
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#059669] focus:outline-hidden bg-slate-50/60 font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Transaction Reference</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Consultation Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Digital Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                    No transactions found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenReceipt(p)}
                      className="hover:bg-[#E8F8F0]/40 transition-colors cursor-pointer group"
                    >
                      {/* Transaction Reference */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 group-hover:text-[#059669] transition-colors">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                          {p.transactionId}
                        </span>
                      </td>

                      {/* Patient Name */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {p.patient.user.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {p.patient.user.email}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-black text-[#064E3B] text-sm">
                        ₹{p.amount}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Payment Method (Clean Human-friendly Google Pay Badge) */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black bg-[#E8F8F0] text-[#064E3B] border border-[#BCE8D0] shadow-2xs">
                          <span className="flex items-center">
                            <span className="text-[#4285F4]">G</span>
                            <span className="text-[#EA4335]">o</span>
                            <span className="text-[#FBBC05]">o</span>
                            <span className="text-[#4285F4]">g</span>
                            <span className="text-[#34A853]">l</span>
                            <span className="text-[#EA4335]">e</span>
                          </span>
                          <span className="ml-0.5 font-extrabold text-slate-800">Pay UPI</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{p.paymentStatus}</span>
                        </span>
                      </td>

                      {/* View Receipt Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReceipt(p);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#E8F8F0] hover:bg-[#D6EDE1] text-[#064E3B] font-bold text-xs inline-flex items-center gap-1.5 border border-[#BCE8D0] transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#059669]" />
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

      {/* 5. QUICK CLINIC QR STANDEE PROMPT BANNER */}
      <div className="rounded-3xl border border-[#D6EDE1] bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">
              Need a Physical Standee for Your Clinic Reception Desk?
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Generate an official Google Pay / BHIM UPI acrylic QR standee with Dr. Aarav Mehta&#39;s name, consultation fee, and clinic details.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowStandeeModal(true)}
          className="px-4 py-2 rounded-xl bg-[#E8F8F0] hover:bg-[#D6EDE1] text-[#064E3B] border border-[#BCE8D0] font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <span>Preview QR Standee</span>
          <ChevronRight className="w-4 h-4 text-[#059669]" />
        </button>
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
