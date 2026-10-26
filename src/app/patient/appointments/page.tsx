"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Stethoscope,
  ChevronRight,
  Plus,
  AlertCircle,
  FileText,
  Sparkles,
  X,
  CheckCircle2,
  Search,
  MapPin,
  ExternalLink,
  Bell,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { GooglePayReceiptModal, PaymentReceiptData } from "@/components/payment/GooglePayReceiptModal";

interface AppointmentItem {
  id: string;
  status: string;
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
  };
  doctor: {
    user: { name: string; email?: string };
    specialization: string;
    upiId?: string;
    clinicInfo?: string;
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
  } | null;
  aiReport: {
    reportStatus: string;
    needsReview: boolean;
  } | null;
  medicalRecords: { id: string }[];
}

export default function PatientAppointmentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading your appointments..." size="lg" />}>
      <PatientAppointmentsInner />
    </Suspense>
  );
}

function PatientAppointmentsInner() {
  const searchParams = useSearchParams();
  const isRemindersTab = searchParams.get("tab") === "reminders";

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "SCHEDULED" | "COMPLETED" | "CANCELLED">("SCHEDULED");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptData | null>(null);
  const [checklist, setChecklist] = useState([
    { id: "c1", text: "Dr. Meera Nair consultation on 24 Oct (10:30 AM)", done: false },
    { id: "c2", text: "Keep recent CBC blood report and MRI scan handy", done: false },
    { id: "c3", text: "Take evening Metformin 500mg with meal", done: true },
  ]);

  useEffect(() => {
    if (isRemindersTab) {
      window.dispatchEvent(new Event("reminders-read"));
      try {
        localStorage.setItem("coderx_reminders_viewed", "true");
      } catch {}
    }
  }, [isRemindersTab]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/patient/appointments");
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

  async function handleConfirmCancel() {
    if (!cancellingId) return;
    setActionError(null);
    try {
      const res = await fetch(`/api/appointments/${cancellingId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel");

      setCancelModalOpen(false);
      setCancellingId(null);
      await fetchAppointments();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error cancelling appointment");
    }
  }

  const filtered = appointments.filter((apt) => {
    if (filter === "ALL") return true;
    return apt.status === filter;
  });

  if (loading) {
    return <LoadingSpinner label="Loading your appointments..." size="lg" />;
  }

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review scheduled consultations, pre-visit intake progress, and visit history
          </p>
        </div>
        <Link
          href="/patient/doctors"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Reminders / Pre-Visit Checklist Section */}
      {isRemindersTab && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Active Pre-Visit Reminders & Checklist</h3>
                <p className="text-xs text-emerald-700/80">Check off items as you prepare for your upcoming doctor consultation.</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {checklist.filter((c) => !c.done).length} Pending
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setChecklist((prev) =>
                    prev.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c))
                  )
                }
                className="p-3 rounded-xl bg-white/90 hover:bg-white border border-emerald-200/60 flex items-center gap-3 cursor-pointer transition-all shadow-2xs"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    item.done ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-xs font-semibold ${item.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm shadow-2xs">
          {actionError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
        <div className="flex items-center gap-2">
          {(["SCHEDULED", "ALL", "COMPLETED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {tab === "ALL" ? "All" : tab === "SCHEDULED" ? "Upcoming" : tab === "COMPLETED" ? "Completed" : "Cancelled"}
            </button>
          ))}
        </div>

        <Link
          href="/patient/doctors"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-sky-600" />
          <span>Find a Doctor by Specialty / Area</span>
        </Link>
      </div>

      {/* Appointment Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">No appointments found in this category</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Find qualified Pediatricians, General Physicians, Diabetologists, Cardiologists & more in your area, and extract live available slots to schedule a visit.
            </p>
          </div>
          <Link
            href="/patient/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition-all active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search & Book Doctors</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const intakeStatus = apt.intakeSession?.status || "NOT_STARTED";
            const isScheduled = apt.status === "SCHEDULED";

            return (
              <div
                key={apt.id}
                className="rounded-2xl border border-slate-300 bg-slate-100/95 p-5 sm:p-6 shadow-sm hover:border-slate-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={apt.status} type="appointment" />
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">Intake:</span>
                    <StatusBadge status={intakeStatus} type="intake" />
                    {apt.aiReport && (
                      <StatusBadge status={apt.aiReport.reportStatus} type="report" />
                    )}
                    {apt.payment && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReceipt({
                            transactionId: apt.payment!.transactionId,
                            amount: apt.payment!.amount,
                            patientName: "You (Patient)",
                            doctorName: apt.doctor.user.name,
                            doctorSpecialization: apt.doctor.specialization,
                            doctorUpiId:
                              apt.doctor.upiId ||
                              `dr.${apt.doctor.user.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@okaxis`,
                            createdAt: apt.payment!.createdAt,
                            paymentMethod: apt.payment!.paymentMethod,
                            paymentStatus: apt.payment!.paymentStatus,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-800 border border-slate-300 shadow-2xs hover:bg-slate-50 transition-colors"
                        title="Click to view Google Pay Digital Receipt"
                      >
                        <span className="flex items-center">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                          <span className="ml-0.5 text-slate-900 font-extrabold">Pay</span>
                        </span>
                        <span className="text-emerald-700">₹{apt.payment.amount}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-sky-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      {apt.doctor.user.name}{" "}
                      <span className="text-xs font-normal text-slate-600">
                        ({apt.doctor.specialization})
                      </span>
                    </h3>
                  </div>

                  {/* Doctor Clinic Address Venue */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/90 w-fit">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-500">Clinic Venue:</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apt.doctor.clinicInfo || "CodeRx Advanced Health Hub, Floor 4, Cyber City")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-900 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 transition-colors"
                      title="Open in Google Maps"
                    >
                      <span>{apt.doctor.clinicInfo || "CodeRx Advanced Health Hub, Floor 4, Cyber City"}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(apt.slot.startTime).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(apt.slot.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({apt.slot.duration} mins)
                    </span>
                    <span>Attachments: {apt.medicalRecords.length} file(s)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                  {isScheduled && intakeStatus !== "COMPLETED" && (
                    <Link
                      href={`/patient/appointments/${apt.id}/intake`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{intakeStatus === "IN_PROGRESS" ? "Continue Intake" : "Start Intake"}</span>
                    </Link>
                  )}

                  <Link
                    href={`/patient/appointments/${apt.id}`}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs"
                  >
                    View Details
                  </Link>

                  {isScheduled && (
                    <button
                      onClick={() => {
                        setCancellingId(apt.id);
                        setCancelModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-100 border border-transparent hover:border-rose-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-100 border border-slate-300 p-6 shadow-xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Are you sure you want to cancel this appointment? The reserved slot will be released back to
              the doctor&apos;s schedule. Your completed intake answers will remain saved.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReceipt && (
        <GooglePayReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
