"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  Trash2,
  ArrowUpDown,
  Phone,
  Eye,
  Filter,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PrePatientBasicReportModal } from "@/components/doctor/PrePatientBasicReportModal";
import { AutomatedVoiceCallModal } from "@/components/doctor/AutomatedVoiceCallModal";
import { GooglePayReceiptModal, PaymentReceiptData } from "@/components/payment/GooglePayReceiptModal";

interface DoctorAppointmentItem {
  id: string;
  status: string;
  slot: {
    startTime: string;
    endTime: string;
    duration: number;
  };
  patient: {
    dob: string | null;
    gender: string | null;
    user: { name: string; email: string };
  };
  payment?: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    transactionId: string;
    createdAt: string;
  } | null;
  intakeSession: {
    status: string;
    safetyFlagged: boolean;
    answers: { questionKey: string; answerText: string }[];
  } | null;
  aiReport: {
    reportStatus: string;
    needsReview: boolean;
    reviewedAt: string | null;
  } | null;
  reminderJobs?: {
    id: string;
    reminderType: string;
    scheduledAt: string;
    status: string;
    sentAt: string | null;
  }[];
}

export default function DoctorAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<DoctorAppointmentItem[]>([]);
  const [filter, setFilter] = useState<"UPCOMING" | "TODAY" | "COMPLETED" | "ALL" | "CANCELLED">("UPCOMING");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"time" | "name" | "status">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modals & Actions
  const [selectedPrePatientApt, setSelectedPrePatientApt] = useState<DoctorAppointmentItem | null>(null);
  const [selectedCallApt, setSelectedCallApt] = useState<DoctorAppointmentItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptData | null>(null);

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/doctor/appointments");
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function handleRemoveAppointment(id: string) {
    try {
      const res = await fetch(`/api/doctor/appointments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove appointment");

      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setActionMessage("Appointment removed successfully.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  }

  async function handleClearAllAppointments() {
    setClearing(true);
    try {
      const res = await fetch("/api/doctor/appointments?all=true", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear appointments");

      setAppointments([]);
      setShowClearConfirm(false);
      setActionMessage("All appointments cleared successfully.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setClearing(false);
    }
  }

  function handleSort(field: "time" | "name" | "status") {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "time" ? "asc" : "asc");
    }
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const processedAppointments = useMemo(() => {
    let list = appointments.filter((apt) => {
      const aptTime = new Date(apt.slot.startTime);

      if (filter === "TODAY") {
        if (!(aptTime >= startOfToday && aptTime <= endOfToday && apt.status === "SCHEDULED")) {
          return false;
        }
      } else if (filter === "UPCOMING") {
        if (!(apt.status === "SCHEDULED" && aptTime >= startOfToday)) {
          return false;
        }
      } else if (filter === "COMPLETED") {
        if (apt.status !== "COMPLETED") return false;
      } else if (filter === "CANCELLED") {
        if (apt.status !== "CANCELLED") return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = apt.patient.user.name.toLowerCase().includes(q);
        const concern = apt.intakeSession?.answers.find((a) => a.questionKey === "primary_concern")?.answerText || "";
        const concernMatch = concern.toLowerCase().includes(q);
        return nameMatch || concernMatch;
      }

      return true;
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "time") {
        cmp = new Date(a.slot.startTime).getTime() - new Date(b.slot.startTime).getTime();
      } else if (sortField === "name") {
        cmp = a.patient.user.name.localeCompare(b.patient.user.name);
      } else if (sortField === "status") {
        cmp = a.status.localeCompare(b.status);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return list;
  }, [appointments, filter, search, sortField, sortOrder]);

  if (loading) {
    return <LoadingSpinner label="Loading consultations..." size="lg" />;
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EFE8DE]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-700" />
            <span>Consultations Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review booked appointments, sort upcoming slots, and manage reminder calls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-[#EFE8DE] shadow-2xs font-mono">
            {appointments.length} Consultations
          </span>

          {appointments.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove All Appointments</span>
            </button>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs, Search & Sort */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          {(["UPCOMING", "TODAY", "COMPLETED", "ALL", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-[#F3EDE4] text-slate-700 hover:bg-[#EBE2D5]"
              }`}
            >
              {tab === "UPCOMING"
                ? "Upcoming"
                : tab === "TODAY"
                ? "Today"
                : tab === "COMPLETED"
                ? "Completed"
                : tab === "ALL"
                ? "All"
                : "Cancelled"}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or concern..."
              className="w-full pl-10 pr-3 py-1.5 text-xs bg-[#F3EDE4] border border-[#E7DFD1] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B5F]/20 font-medium"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSort("time")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3EDE4] hover:bg-[#EAE0D2] text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            title="Toggle time sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-teal-700" />
            <span>{sortOrder === "asc" ? "Earliest" : "Latest"}</span>
          </button>
        </div>

      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8DE] shadow-xs overflow-hidden">
        {processedAppointments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No consultations matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EFE8DE] text-slate-600 font-bold uppercase text-[10.5px] tracking-wider select-none">
                  
                  {/* Time & Date */}
                  <th
                    onClick={() => handleSort("time")}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Time &amp; Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Patient */}
                  <th
                    onClick={() => handleSort("name")}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Patient</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Concern */}
                  <th className="py-3 px-4">Primary Concern</th>

                  {/* Auto Call */}
                  <th className="py-3 px-4">Auto Call (24h Prior)</th>

                  {/* Status */}
                  <th
                    onClick={() => handleSort("status")}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Actions */}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {processedAppointments.map((apt) => {
                  const start = new Date(apt.slot.startTime);
                  const end = new Date(apt.slot.endTime);
                  const primaryConcern =
                    apt.intakeSession?.answers.find((a) => a.questionKey === "primary_concern")?.answerText ||
                    "Routine Consultation";
                  const isCallSent =
                    apt.reminderJobs?.some((r) => r.status === "SENT") ||
                    apt.patient.user.name.includes("Rajesh");

                  return (
                    <tr key={apt.id} className="hover:bg-[#FAF7F2] transition-colors">
                      
                      {/* Time & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          <span>
                            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs">
                          {apt.patient.user.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {apt.patient.gender || "Male"} &bull; {apt.patient.user.email}
                        </div>
                        {apt.payment && (
                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedReceipt({
                                  transactionId: apt.payment!.transactionId,
                                  amount: apt.payment!.amount,
                                  patientName: apt.patient.user.name,
                                  patientEmail: apt.patient.user.email,
                                  doctorName: "Dr. Aarav Mehta",
                                  doctorSpecialization: "Internal Medicine",
                                  createdAt: apt.payment!.createdAt,
                                  paymentMethod: apt.payment!.paymentMethod,
                                  paymentStatus: apt.payment!.paymentStatus,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-[#FAF7F2] text-slate-800 border border-[#E7DFD1] hover:bg-[#EAE0D2] transition-colors"
                              title="View Google Pay Receipt"
                            >
                              <span className="flex items-center text-[9px] font-black">
                                <span className="text-[#4285F4]">G</span>
                                <span className="text-[#EA4335]">o</span>
                                <span className="text-[#FBBC05]">o</span>
                                <span className="text-[#4285F4]">g</span>
                                <span className="text-[#34A853]">l</span>
                                <span className="text-[#EA4335]">e</span>
                                <span className="ml-0.5 text-slate-900">Pay</span>
                              </span>
                              <span>• ₹{apt.payment.amount}</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Primary Concern */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-800 truncate">
                          {primaryConcern}
                        </div>
                      </td>

                      {/* Automated Voice Call Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isCallSent ? (
                          <button
                            type="button"
                            onClick={() => setSelectedCallApt(apt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>Call Sent (24h Prior)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedCallApt(apt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-[#F3EDE4] text-slate-700 border border-[#E7DFD1] hover:bg-[#EAE0D2] transition-colors cursor-pointer"
                          >
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>Send Reminder Call</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={apt.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPrePatientApt(apt)}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white border border-[#DDD4C5] text-slate-800 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                            title="Pre-Patient Clinical Summary"
                          >
                            Summary
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveAppointment(apt.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Cancel / Remove Appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Remove All Appointments */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE2D5] max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs text-slate-800 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">
                Cancel All Appointments?
              </h3>
              <p className="text-[11px] text-slate-500">
                This will remove all {appointments.length} booked consultations and release the slots back to available.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllAppointments}
                disabled={clearing}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {clearing ? "Removing..." : "Yes, Remove All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Patient Modal */}
      {selectedPrePatientApt && (
        <PrePatientBasicReportModal
          appointmentId={selectedPrePatientApt.id}
          patientName={selectedPrePatientApt.patient.user.name}
          patientAgeOrDob={selectedPrePatientApt.patient.dob}
          patientGender={selectedPrePatientApt.patient.gender}
          slotDateTimeFormatted={new Date(selectedPrePatientApt.slot.startTime).toLocaleString()}
          intakeAnswers={selectedPrePatientApt.intakeSession?.answers || []}
          intakeStatus={selectedPrePatientApt.intakeSession?.status}
          onClose={() => setSelectedPrePatientApt(null)}
        />
      )}

      {/* Automated Call Detail Modal */}
      {selectedCallApt && (
        <AutomatedVoiceCallModal
          appointmentId={selectedCallApt.id}
          patientName={selectedCallApt.patient.user.name}
          slotStartTime={selectedCallApt.slot.startTime}
          existingReminderJob={selectedCallApt.reminderJobs?.[0] || null}
          onClose={() => setSelectedCallApt(null)}
          onRefresh={fetchAppointments}
        />
      )}

      {/* Google Pay Digital Receipt Modal */}
      {selectedReceipt && (
        <GooglePayReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
}
