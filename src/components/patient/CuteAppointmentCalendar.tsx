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
  CheckCircle2,
  CalendarCheck,
  Plus,
} from "lucide-react";

export interface AppointmentItem {
  id: string;
  doctorName: string;
  specialty?: string;
  clinicInfo?: string;
  date: Date;
  dateKey: string; // "YYYY-MM-DD"
  dayNumber: number;
  dayName: string;
  monthName: string;
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
          dayNumber: d.getDate(),
          dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
          monthName: d.toLocaleDateString("en-US", { month: "short" }),
          timeString,
          status: app.status || "CONFIRMED",
        });
      }
    }

    // Default rich fallback matching demo state
    if (list.length === 0) {
      list.push(
        {
          id: "demo-1",
          doctorName: "Dr. Aarav Mehta",
          specialty: "Internal Medicine & Diabetology",
          clinicInfo: "Apollo Clinic, Mumbai",
          date: new Date(2026, 9, 24, 10, 0),
          dateKey: "2026-10-24",
          dayNumber: 24,
          dayName: "Sat",
          monthName: "Oct",
          timeString: "10:00 AM",
          status: "CONFIRMED",
        },
        {
          id: "demo-2",
          doctorName: "Dr. Rohan Deshmukh",
          specialty: "Cardiologist (Heart Specialist)",
          clinicInfo: "Fortis Health, Mumbai",
          date: new Date(2026, 9, 26, 15, 30),
          dateKey: "2026-10-26",
          dayNumber: 26,
          dayName: "Mon",
          monthName: "Oct",
          timeString: "03:30 PM",
          status: "SCHEDULED",
        },
        {
          id: "demo-3",
          doctorName: "Dr. Neha Kapoor",
          specialty: "Pediatrician / General Care",
          clinicInfo: "Apollo Clinic, Mumbai",
          date: new Date(2026, 9, 31, 11, 0),
          dateKey: "2026-10-31",
          dayNumber: 31,
          dayName: "Sat",
          monthName: "Oct",
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

  // Initial selected date defaults to next upcoming appointment (e.g. 24 Oct)
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    normalizedAppointments[0]?.dateKey || "2026-10-24"
  );

  // Focus Month (e.g., October 2026)
  const [activeMonthYear, setActiveMonthYear] = useState({ year: 2026, month: 9 }); // 9 = Oct

  // Generate a sleek horizontal digital ribbon of days (around current week/appointments, e.g. 23 Oct to 31 Oct)
  const ribbonDays = useMemo(() => {
    const days: Array<{
      dateKey: string;
      dayNumber: number;
      dayName: string;
      hasAppointment: boolean;
      appointmentCount: number;
      isToday: boolean;
    }> = [];

    // Focus around October 22 to October 31
    for (let d = 22; d <= 31; d++) {
      const key = `2026-10-${String(d).padStart(2, "0")}`;
      const apps = appointmentsByDate.get(key) || [];
      const dateObj = new Date(2026, 9, d);
      days.push({
        dateKey: key,
        dayNumber: d,
        dayName: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        hasAppointment: apps.length > 0,
        appointmentCount: apps.length,
        isToday: d === 27, // current mock date 27 Oct 2026
      });
    }

    return days;
  }, [appointmentsByDate]);

  // Currently selected appointments
  const currentSelectedApps = useMemo(() => {
    return appointmentsByDate.get(selectedDateKey) || [];
  }, [appointmentsByDate, selectedDateKey]);

  // Selected date components
  const selectedDateDetails = useMemo(() => {
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return {
      day: d,
      month: dateObj.toLocaleDateString("en-US", { month: "short" }),
      weekday: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
      fullWeekday: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
      year: y,
    };
  }, [selectedDateKey]);

  return (
    <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col space-y-3">
      {/* 1. Sleek Digital Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black tracking-widest uppercase text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded border border-purple-200/80">
                DIGITAL HUD
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
              Visits Calendar
            </h3>
          </div>
        </div>

        {/* Month & Badge */}
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200 text-slate-700 text-[11px] font-bold">
            October 2026
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
            {normalizedAppointments.length} Booked
          </span>
        </div>
      </div>

      {/* 2. Quick Doctor Switcher Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {normalizedAppointments.map((app) => {
          const isSelected = selectedDateKey === app.dateKey;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedDateKey(app.dateKey)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-purple-700 text-white shadow-2xs scale-102"
                  : "bg-slate-100/80 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border border-slate-200/80"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-white" : "bg-purple-600"
                }`}
              />
              <span>{app.doctorName.split(" ")[1] || app.doctorName}</span>
              <span className="opacity-80 font-normal">({app.dayNumber} {app.monthName})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Horizontal Digital Days Ribbon */}
      <div className="bg-slate-50/80 rounded-xl p-1.5 border border-slate-150">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 scrollbar-none justify-between">
          {ribbonDays.map((d) => {
            const isSelected = selectedDateKey === d.dateKey;
            const hasApp = d.hasAppointment;

            return (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(d.dateKey)}
                className={`py-1 px-1.5 sm:px-2 rounded-lg flex flex-col items-center justify-center min-w-[34px] sm:min-w-[38px] transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-purple-600 text-white font-extrabold shadow-2xs scale-105 z-10"
                    : hasApp
                    ? "bg-purple-100 text-purple-900 font-bold hover:bg-purple-200/90 border border-purple-200"
                    : "text-slate-600 hover:bg-slate-200/60 font-medium"
                }`}
                title={hasApp ? `Appointment on ${d.dayNumber} Oct` : `${d.dayNumber} Oct`}
              >
                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75">
                  {d.dayName}
                </span>
                <span className="text-xs font-black leading-tight mt-0.5">
                  {d.dayNumber}
                </span>

                {/* Digital LED dot indicator */}
                {hasApp && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? "bg-white" : "bg-purple-600 animate-pulse"
                    }`}
                  />
                )}
                {!hasApp && <span className="w-1 h-1 mt-0.5 opacity-0">.</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Selected Appointment Digital HUD Card */}
      {currentSelectedApps.length > 0 ? (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-50/90 via-indigo-50/40 to-slate-50 border border-purple-200/80 flex items-center justify-between text-xs transition-all shadow-2xs">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            {/* Digital Date Cube */}
            <div className="shrink-0 w-11 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col items-center justify-center shadow-xs border border-purple-500/30">
              <span className="text-[9px] font-black tracking-widest uppercase opacity-90 leading-none">
                {selectedDateDetails.month}
              </span>
              <span className="text-base font-black leading-tight mt-0.5">
                {selectedDateDetails.day}
              </span>
              <span className="text-[8px] uppercase font-bold opacity-80 leading-none">
                {selectedDateDetails.weekday}
              </span>
            </div>

            {/* Doctor Info */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                  {currentSelectedApps[0].doctorName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  {currentSelectedApps[0].status}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 truncate font-medium">
                {currentSelectedApps[0].specialty}
              </div>
              <div className="text-[11px] text-purple-900 font-semibold flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-purple-600 shrink-0" />
                <span>{currentSelectedApps[0].timeString} • {currentSelectedApps[0].clinicInfo}</span>
              </div>
            </div>
          </div>

          <Link
            href="/patient/appointments"
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="shrink-0 w-11 h-12 rounded-lg bg-slate-200 text-slate-700 flex flex-col items-center justify-center font-bold">
              <span className="text-[9px] uppercase leading-none">{selectedDateDetails.month}</span>
              <span className="text-base font-black leading-tight mt-0.5">{selectedDateDetails.day}</span>
              <span className="text-[8px] uppercase leading-none opacity-70">{selectedDateDetails.weekday}</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="font-bold text-slate-800 text-xs">No Visit Scheduled</div>
              <div className="text-[11px] text-slate-500 truncate">
                Free clinical slot • Next visit on 24 Oct with Dr. Aarav Mehta
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDateKey("2026-10-24")}
            className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bold transition-all shrink-0 ml-1 cursor-pointer border border-purple-200"
          >
            Jump to 24th &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
