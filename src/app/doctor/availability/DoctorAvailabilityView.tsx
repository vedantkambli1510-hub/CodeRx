"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Plus,
  CheckCircle2,
  Trash2,
  Save,
  DollarSign,
  Hospital,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from "lucide-react";

interface DoctorAvailabilityViewProps {
  doctor: any;
  slots: any[];
}

export function DoctorAvailabilityView({
  doctor,
  slots: initialSlots,
}: DoctorAvailabilityViewProps) {
  const [slots, setSlots] = useState<any[]>(initialSlots);
  const [fee, setFee] = useState<number>(doctor?.consultationFee || 800);
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [designation, setDesignation] = useState<string>(doctor?.designation || "Senior Consultant");
  const [visitingHospitals, setVisitingHospitals] = useState<string>(
    doctor?.visitingHospitals || "Max Super Speciality Hospital, Apollo Indraprastha"
  );
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [savingFee, setSavingFee] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearingSlots, setClearingSlots] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Sorting & Filtering
  const [filterMode, setFilterMode] = useState<"ALL" | "AVAILABLE" | "BOOKED">("ALL");
  const [sortOrder, setSortOrder] = useState<"EARLIEST" | "LATEST">("EARLIEST");

  const [newDate, setNewDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [newTime, setNewTime] = useState<string>("10:00");

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/doctor/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          startTime: newTime,
          duration: slotDuration,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slot");

      setSlots((prev) => [...prev, data.slot]);
      setMessage("New consultation slot added successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot(slotId: string) {
    try {
      const res = await fetch(`/api/doctor/slots?id=${slotId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete slot");

      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      setMessage("Slot removed successfully.");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  }

  async function handleClearAllSlots() {
    setClearingSlots(true);
    try {
      const res = await fetch("/api/doctor/slots?all=true&force=true", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear slots");

      setSlots([]);
      setShowClearConfirm(false);
      setMessage("All appointment slots cleared successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setClearingSlots(false);
    }
  }

  async function handleSaveCredentials(e: React.FormEvent) {
    e.preventDefault();
    setSavingCredentials(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designation: designation.trim(),
          visitingHospitals: visitingHospitals.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to update credentials");
      setMessage("Doctor credentials updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSavingCredentials(false);
    }
  }

  async function handleSaveFee(e: React.FormEvent) {
    e.preventDefault();
    setSavingFee(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationFee: fee,
        }),
      });
      if (!res.ok) throw new Error("Failed to update fee");
      setMessage("Consultation fee updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSavingFee(false);
    }
  }

  // Group and sort slots chronologically by day
  const groupedSlots = useMemo(() => {
    let list = [...slots];

    // Filter
    if (filterMode === "AVAILABLE") list = list.filter((s) => s.status === "AVAILABLE");
    if (filterMode === "BOOKED") list = list.filter((s) => s.status === "BOOKED");

    // Sort
    list.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return sortOrder === "EARLIEST" ? timeA - timeB : timeB - timeA;
    });

    // Group by Date string
    const groups: { [dateKey: string]: any[] } = {};
    for (const slot of list) {
      const dateKey = new Date(slot.startTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    }

    return groups;
  }, [slots, filterMode, sortOrder]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EFE8DE]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-700" />
            <span>Consultation Schedule &amp; Slot Availability</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your daily consultation timings, fees, and slot availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-[#EFE8DE] shadow-2xs font-mono">
            {slots.length} Total Slots
          </span>
          {slots.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove All Slots</span>
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid: Left Settings + Right Active Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Designation, Pricing & Add Slot */}
        <div className="space-y-5">
          
          {/* Add Slot Form */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DE] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Add Consultation Slot</span>
            </h3>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7DFD1] bg-[#FAF7F2] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7DFD1] bg-[#FAF7F2] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Duration</label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E7DFD1] bg-[#FAF7F2] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? "Adding Slot..." : "Create Slot"}</span>
              </button>
            </form>
          </div>

          {/* Designation & Hospital Affiliations */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DE] shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-teal-600" />
              <span>Hospital Affiliations</span>
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7DFD1] bg-[#FAF7F2] text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hospitals</label>
              <textarea
                rows={2}
                value={visitingHospitals}
                onChange={(e) => setVisitingHospitals(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7DFD1] bg-[#FAF7F2] text-slate-800 font-medium"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveCredentials}
              disabled={savingCredentials}
              className="w-full py-2 rounded-xl bg-[#F0BF7A] hover:bg-[#E5B168] text-[#1C140B] font-bold text-xs transition-colors cursor-pointer"
            >
              {savingCredentials ? "Saving..." : "Save Credentials"}
            </button>
          </div>

          {/* Pricing */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DE] shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Consultation Pricing</span>
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">&yen;</span>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full p-2 pl-7 rounded-xl border border-[#E7DFD1] bg-[#FAF7F2] text-slate-800 font-bold"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveFee}
                disabled={savingFee}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
              >
                {savingFee ? "..." : "Save"}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Clean, Grouped & Sorted Active Slots */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls Bar: Filter pills + Sort toggle */}
          <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode("ALL")}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-[#F3EDE4] text-slate-700 hover:bg-[#EAE0D2]"
                }`}
              >
                All ({slots.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("AVAILABLE")}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === "AVAILABLE"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                Available ({slots.filter((s) => s.status === "AVAILABLE").length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("BOOKED")}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === "BOOKED"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                Booked ({slots.filter((s) => s.status === "BOOKED").length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "EARLIEST" ? "LATEST" : "EARLIEST")}
              className="text-xs font-bold text-slate-700 bg-[#F3EDE4] hover:bg-[#EAE0D2] px-3 py-1 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-teal-700" />
              <span>{sortOrder === "EARLIEST" ? "Earliest First" : "Latest First"}</span>
            </button>
          </div>

          {/* Grouped Slots View */}
          {Object.keys(groupedSlots).length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EFE8DE] p-12 text-center text-slate-500 text-sm space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No consultation slots available.</p>
              <p className="text-xs text-slate-500">
                Use the form on the left to add upcoming slots to your schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSlots).map(([dateKey, daySlots]) => (
                <div
                  key={dateKey}
                  className="bg-white rounded-2xl border border-[#EFE8DE] shadow-xs p-4 space-y-3"
                >
                  {/* Date Group Heading */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#F4EFE6]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {dateKey}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {daySlots.length} {daySlots.length === 1 ? "Slot" : "Slots"}
                    </span>
                  </div>

                  {/* Clean Slots Chips Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {daySlots.map((slot) => {
                      const start = new Date(slot.startTime);
                      const end = new Date(slot.endTime);
                      const isBooked = slot.status === "BOOKED";

                      return (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                            isBooked
                              ? "bg-amber-50/50 border-amber-200 text-amber-900"
                              : "bg-[#FAF7F2] border-[#EFE8DE] text-slate-800 hover:border-teal-300"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-teal-600" />
                              <span>
                                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {slot.duration || 30} mins &bull;{" "}
                              <span className={isBooked ? "font-bold text-amber-700" : "font-semibold text-emerald-700"}>
                                {isBooked ? "Booked" : "Available"}
                              </span>
                            </div>
                          </div>

                          {!isBooked && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Confirmation Modal: Remove All Slots */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE2D5] max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs text-slate-800 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">
                Clear All Appointment Slots?
              </h3>
              <p className="text-[11px] text-slate-500">
                This will remove all {slots.length} consultation slots from your schedule. This action cannot be undone.
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
                onClick={handleClearAllSlots}
                disabled={clearingSlots}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {clearingSlots ? "Clearing..." : "Yes, Remove All"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
