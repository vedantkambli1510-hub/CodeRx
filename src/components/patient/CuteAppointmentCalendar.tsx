"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Stethoscope,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface AppointmentItem {
  id: string;
  doctorName: string;
  specialty?: string;
  clinicInfo?: string;
  date: Date;
  dateKey: string; // "YYYY-MM-DD"
  timeString: string;
  status: "CONFIRMED" | "SCHEDULED" | "CANCELLED" | "COMPLETED" | string;
}

interface CuteAppointmentCalendarProps {
  appointments?: any[];
}

export function CuteAppointmentCalendar({ appointments = [] }: CuteAppointmentCalendarProps) {
  // Normalize passed appointments
  const normalizedAppointments: AppointmentItem[] = useMemo(() => {
    const list: AppointmentItem[] = [];

    if (Array.isArray(appointments) && appointments.length > 0) {
      for (const app of appointments) {
        if (!app?.slot?.startTime) continue;
        const d = new Date(app.slot.startTime);
        if (isNaN(d.getTime())) continue;

        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const timeString = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        list.push({
          id: app.id || `app-${dateKey}`,
          doctorName: app.doctor?.user?.name || app.doctorName || "Dr. Medical Specialist",
          specialty: app.doctor?.specialization || "General Medicine",
          clinicInfo: app.doctor?.clinicInfo || "Apollo Clinic, Mumbai",
          date: d,
          dateKey,
          timeString,
          status: app.status || "CONFIRMED",
        });
      }
    }

    // If no appointments found in DB, provide rich defaults matching CodeRx demo
    if (list.length === 0) {
      list.push(
        {
          id: "demo-1",
          doctorName: "Dr. Meera Nair",
          specialty: "General Physician",
          clinicInfo: "Apollo Clinic, Mumbai",
          date: new Date(2026, 9, 24, 10, 30),
          dateKey: "2026-10-24",
          timeString: "10:30 AM",
          status: "CONFIRMED",
        },
        {
          id: "demo-2",
          doctorName: "Dr. Rohan Deshmukh",
          specialty: "Cardiologist (Heart Specialist)",
          clinicInfo: "Fortis Memorial, Mumbai",
          date: new Date(2026, 9, 26, 15, 30),
          dateKey: "2026-10-26",
          timeString: "03:30 PM",
          status: "SCHEDULED",
        },
        {
          id: "demo-3",
          doctorName: "Dr. Neha Kapoor",
          specialty: "Endocrinologist",
          clinicInfo: "Apollo Clinic, Mumbai",
          date: new Date(2026, 9, 31, 11, 0),
          dateKey: "2026-10-31",
          timeString: "11:00 AM",
          status: "CONFIRMED",
        }
      );
    }

    return list;
  }, [appointments]);

  // Map appointments by dateKey
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, AppointmentItem[]>();
    for (const app of normalizedAppointments) {
      const existing = map.get(app.dateKey) || [];
      existing.push(app);
      map.set(app.dateKey, existing);
    }
    return map;
  }, [normalizedAppointments]);

  // Determine initial month & selected date
  // Pick the date of the earliest upcoming appointment if available
  const initialDate = useMemo(() => {
    if (normalizedAppointments.length > 0) {
      return normalizedAppointments[0].date;
    }
    return new Date();
  }, [normalizedAppointments]);

  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-indexed (9 = Oct)
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    normalizedAppointments[0]?.dateKey ||
      `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, "0")}-${String(initialDate.getDate()).padStart(2, "0")}`
  );

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar matrix calculation
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells: Array<{
      dayNumber: number | null;
      dateKey: string | null;
      hasAppointment: boolean;
      appointmentCount: number;
    }> = [];

    // Empty offset cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({
        dayNumber: null,
        dateKey: null,
        hasAppointment: false,
        appointmentCount: 0,
      });
    }

    // Days 1..totalDays
    for (let d = 1; d <= totalDays; d++) {
      const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const apps = appointmentsByDate.get(key) || [];
      cells.push({
        dayNumber: d,
        dateKey: key,
        hasAppointment: apps.length > 0,
        appointmentCount: apps.length,
      });
    }

    return cells;
  }, [currentYear, currentMonth, appointmentsByDate]);

  // Appointments on selected date
  const selectedAppointments = useMemo(() => {
    return appointmentsByDate.get(selectedDateKey) || [];
  }, [appointmentsByDate, selectedDateKey]);

  // Count appointments in current month view
  const currentMonthAppointmentCount = useMemo(() => {
    let count = 0;
    for (const [key, apps] of appointmentsByDate.entries()) {
      const [y, m] = key.split("-").map(Number);
      if (y === currentYear && m === currentMonth + 1) {
        count += apps.length;
      }
    }
    return count;
  }, [appointmentsByDate, currentYear, currentMonth]);

  return (
    <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3">
      {/* 1. Header with Cute Icon, Month Selector and Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-100 text-purple-700 flex items-center justify-center border border-purple-200/80 shadow-2xs">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                Visits Calendar
              </span>
              <Sparkles className="w-2.5 h-2.5 text-purple-500" />
            </div>
            {/* Month & Nav */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-5 h-5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-5 h-5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Badge */}
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
          <span>{currentMonthAppointmentCount} Booked</span>
        </span>
      </div>

      {/* 2. Compact & Cute Month Grid */}
      <div className="bg-slate-50/70 rounded-xl p-2 sm:p-2.5 border border-slate-150">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, idx) => (
            <span key={idx} className="text-[10px] font-bold text-slate-400">
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            if (!cell.dayNumber || !cell.dateKey) {
              return <div key={`empty-${idx}`} className="h-6 sm:h-7" />;
            }

            const isSelected = selectedDateKey === cell.dateKey;
            const hasApp = cell.hasAppointment;

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(cell.dateKey!)}
                className={`h-6 sm:h-7 rounded-lg text-[11px] flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white font-extrabold shadow-2xs scale-105 z-10"
                    : hasApp
                    ? "bg-purple-100/90 text-purple-900 font-bold hover:bg-purple-200/90 border border-purple-300/80"
                    : "text-slate-600 hover:bg-slate-200/60 font-medium"
                }`}
                title={
                  hasApp
                    ? `${cell.appointmentCount} Appointment(s) on ${cell.dayNumber} ${monthNames[currentMonth]}`
                    : `${cell.dayNumber} ${monthNames[currentMonth]}`
                }
              >
                <span>{cell.dayNumber}</span>
                {/* Cute indicator dot for days that have appointments */}
                {hasApp && (
                  <span
                    className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full transition-colors ${
                      isSelected ? "bg-white" : "bg-purple-600"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. "Which appointment with this" Detail Strip */}
      {selectedAppointments.length > 0 ? (
        <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-50/90 to-slate-50 border border-purple-100/90 flex items-center justify-between text-xs transition-all">
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-xs truncate">
                {selectedAppointments[0].doctorName}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                {selectedAppointments[0].status}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
              <span className="font-semibold text-purple-900">
                {selectedAppointments[0].date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })} • {selectedAppointments[0].timeString}
              </span>
              <span>•</span>
              <span className="text-slate-500 truncate">
                {selectedAppointments[0].specialty}
              </span>
            </div>
          </div>

          <Link
            href="/patient/appointments"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-0.5 shrink-0 ml-1 bg-white px-2.5 py-1 rounded-md border border-purple-200 shadow-2xs"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-[11px]">
              No visits on this date • Click marked dates with dot (●)
            </span>
          </div>
          <Link
            href="/patient/appointments"
            className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0 ml-2"
          >
            Book Slot &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
