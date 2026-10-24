"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Lock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Eye,
  User,
  Power,
  Zap,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PrePatientBasicReportModal } from "@/components/doctor/PrePatientBasicReportModal";

interface SlotItem {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string; // AVAILABLE | BOOKED | BLOCKED
  appointment?: {
    id: string;
    patient: { user: { name: string; email: string }; dob?: string | null; gender?: string | null };
    intakeSession?: {
      status: string;
      answers: { questionKey: string; answerText: string }[];
    } | null;
  } | null;
}

export default function DoctorSlotsPage() {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDateFilter, setActiveDateFilter] = useState<string>("ALL");
  const [activeShiftFilter, setActiveShiftFilter] = useState<string>("ALL");

  // New slot form state
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [newDate, setNewDate] = useState(tomorrowStr);
  const [newTime, setNewTime] = useState("09:00");
  const [newDuration, setNewDuration] = useState(30);

  const [saving, setSaving] = useState(false);
  const [generatingShift, setGeneratingShift] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pre-patient intake report modal state
  const [selectedAppointmentForReport, setSelectedAppointmentForReport] = useState<any | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    try {
      const res = await fetch("/api/doctor/slots");
      const data = await res.json();
      if (res.ok) {
        setSlots(data.slots || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/doctor/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          startTime: newTime,
          duration: newDuration,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slot");

      setSuccess("Consultation slot added successfully.");
      setShowAddModal(false);
      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating slot");
    } finally {
      setSaving(false);
    }
  }

  // Generate complete OPD shift in 1-click
  async function handleGenerateShift(shiftType: "MORNING" | "AFTERNOON" | "EVENING") {
    setGeneratingShift(shiftType);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/doctor/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_SHIFT",
          date: newDate,
          shiftType,
          duration: 30,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate shift slots");

      setSuccess(data.message || `Generated ${shiftType} shift slots!`);
      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating shift");
    } finally {
      setGeneratingShift(null);
    }
  }

  // Toggle slot Available ↔ Blocked
  async function handleToggleSlotStatus(slot: SlotItem) {
    const nextStatus = slot.status === "AVAILABLE" ? "BLOCKED" : "AVAILABLE";
    try {
      const res = await fetch("/api/doctor/slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.id,
          status: nextStatus,
        }),
      });
      if (res.ok) {
        setSlots((prev) =>
          prev.map((s) => (s.id === slot.id ? { ...s, status: nextStatus } : s))
        );
      }
    } catch {
      // ignore
    }
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm("Are you sure you want to remove this consultation slot?")) return;

    try {
      const res = await fetch(`/api/doctor/slots?id=${slotId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove slot");

      await fetchSlots();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting slot");
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading organized availability slots..." size="lg" />;
  }

  // Metrics
  const totalSlotsCount = slots.length;
  const bookedSlotsCount = slots.filter((s) => s.status === "BOOKED").length;
  const availableSlotsCount = slots.filter((s) => s.status === "AVAILABLE").length;
  const blockedSlotsCount = slots.filter((s) => s.status === "BLOCKED").length;
  const utilization =
    totalSlotsCount > 0 ? Math.round((bookedSlotsCount / totalSlotsCount) * 100) : 0;

  // Filter slots
  const filteredSlots = slots.filter((s) => {
    // Date filter
    if (activeDateFilter !== "ALL") {
      const d = new Date(s.startTime).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (d !== activeDateFilter) return false;
    }

    // Shift filter
    if (activeShiftFilter !== "ALL") {
      const hour = new Date(s.startTime).getHours();
      if (activeShiftFilter === "MORNING" && hour >= 12) return false;
      if (activeShiftFilter === "AFTERNOON" && (hour < 12 || hour >= 17)) return false;
      if (activeShiftFilter === "EVENING" && hour < 17) return false;
    }

    return true;
  });

  // Group slots by Date for display
  const slotsByDate: Record<string, SlotItem[]> = {};
  filteredSlots.forEach((s) => {
    const dateLabel = new Date(s.startTime).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!slotsByDate[dateLabel]) slotsByDate[dateLabel] = [];
    slotsByDate[dateLabel].push(s);
  });

  // Date buttons
  const uniqueDates = Array.from(
    new Set(
      slots.map((s) =>
        new Date(s.startTime).toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      )
    )
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/doctor" className="hover:text-sky-600 flex items-center gap-1 font-medium">
          <ChevronLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">OPD Consultation Slots</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Doctor Consultation Slots Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Organized shift schedules (Morning, Afternoon, Evening), 1-click batch generators, and pre-patient basic report access
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setSuccess(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Slot</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* OPD Shift Capacity Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total OPD Slots
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalSlotsCount}</div>
          <span className="text-[11px] text-slate-500">Across all active dates</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Available Slots
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{availableSlotsCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Open for patient booking</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Booked Patients
          </span>
          <div className="text-2xl font-black text-sky-600 mt-1">{bookedSlotsCount}</div>
          <span className="text-[11px] text-sky-700 font-semibold">Intake reports accessible</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            OPD Utilization
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{utilization}%</div>
          <span className="text-[11px] text-slate-500">{blockedSlotsCount} slots paused/blocked</span>
        </div>
      </div>

      {/* 1-Click Batch OPD Shift Generator Bar (Organised Slot Creation) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-white border-2 border-sky-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <h3 className="text-sm font-black text-slate-900">
                1-Click Batch OPD Shift Generator
              </h3>
              <p className="text-[11px] text-slate-600">
                Instantly generate standard 30-minute consultation slots for date:{" "}
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs ml-1"
                />
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleGenerateShift("MORNING")}
              disabled={generatingShift !== null}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{generatingShift === "MORNING" ? "Generating..." : "Generate Morning (9am-1pm)"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateShift("AFTERNOON")}
              disabled={generatingShift !== null}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
            >
              <Sunset className="w-3.5 h-3.5" />
              <span>{generatingShift === "AFTERNOON" ? "Generating..." : "Generate Afternoon (1pm-5pm)"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateShift("EVENING")}
              disabled={generatingShift !== null}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{generatingShift === "EVENING" ? "Generating..." : "Generate Evening (5pm-8:30pm)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs: Date & Shifts */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-500 uppercase text-[10px] mr-1">Date:</span>
          <button
            type="button"
            onClick={() => setActiveDateFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeDateFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            All Dates ({slots.length})
          </button>
          {uniqueDates.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDateFilter(d)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeDateFilter === d
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Shift Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-500 uppercase text-[10px] mr-1">Shift:</span>
          {[
            { id: "ALL", label: "All Shifts" },
            { id: "MORNING", label: "🌅 Morning" },
            { id: "AFTERNOON", label: "☀️ Afternoon" },
            { id: "EVENING", label: "🌙 Evening" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveShiftFilter(s.id)}
              className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                activeShiftFilter === s.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slots List Grouped by Date */}
      <div className="space-y-6">
        {Object.keys(slotsByDate).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 text-xs sm:text-sm">
            No consultation slots match the selected filters. Use the generator buttons above to create slots.
          </div>
        ) : (
          Object.entries(slotsByDate).map(([dateLabel, dateSlots]) => (
            <div
              key={dateLabel}
              className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    {dateLabel}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {dateSlots.length} slots ({dateSlots.filter((s) => s.status === "BOOKED").length} booked)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {dateSlots.map((slot) => {
                  const isBooked = slot.status === "BOOKED";
                  const isBlocked = slot.status === "BLOCKED";
                  const apt = slot.appointment;
                  const patientName = apt?.patient?.user?.name || "Patient";

                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                        isBooked
                          ? "bg-sky-50/80 border-sky-300 shadow-xs"
                          : isBlocked
                          ? "bg-slate-100 border-slate-300 opacity-75"
                          : "bg-white border-slate-300 hover:border-slate-400 shadow-2xs"
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Status badge & Shift icon */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            <span>
                              {new Date(slot.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({slot.duration}m)
                            </span>
                          </div>

                          {isBooked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-200 text-sky-900 border border-sky-300">
                              👤 BOOKED
                            </span>
                          ) : isBlocked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                              ⏸️ BLOCKED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              🟢 AVAILABLE
                            </span>
                          )}
                        </div>

                        {/* If Booked: Patient Information & Pre-Patient Report CTA */}
                        {isBooked && apt ? (
                          <div className="p-2.5 rounded-xl bg-white border border-sky-200 space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-sky-600" />
                              <span className="font-extrabold text-slate-900 truncate">
                                {patientName}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedAppointmentForReport(apt)}
                              className="w-full py-1.5 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Pre-Patient Report</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">
                            {isBlocked ? "Slot is paused from public booking" : "Ready for patient booking"}
                          </div>
                        )}
                      </div>

                      {/* Controls: Block/Unblock & Delete unbooked */}
                      {!isBooked && (
                        <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleToggleSlotStatus(slot)}
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                          >
                            <Power className="w-3 h-3 text-slate-500" />
                            <span>{isBlocked ? "Unblock Slot" : "Block / Hold"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Single Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-base">Add Single Availability Slot</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Start Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Slot Duration</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-white bg-sky-600 hover:bg-sky-500 font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Save Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pre-Patient Basic Report Modal (when clicking on a booked slot) */}
      {selectedAppointmentForReport && (
        <PrePatientBasicReportModal
          appointmentId={selectedAppointmentForReport.id}
          patientName={selectedAppointmentForReport.patient?.user?.name || "Patient"}
          patientAgeOrDob={selectedAppointmentForReport.patient?.dob}
          patientGender={selectedAppointmentForReport.patient?.gender}
          intakeAnswers={selectedAppointmentForReport.intakeSession?.answers || []}
          intakeStatus={selectedAppointmentForReport.intakeSession?.status || "NOT_STARTED"}
          onClose={() => setSelectedAppointmentForReport(null)}
          onRefresh={fetchSlots}
        />
      )}
    </div>
  );
}
