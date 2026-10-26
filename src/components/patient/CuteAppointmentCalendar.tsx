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
  RotateCcw,
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
  year: number;
  monthIndex: number; // 0-11
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
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
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
          clinicInfo: "CodeRx Specialty Health Hub, Floor 4, Cyber City Med Center",
          date: new Date(2026, 9, 24, 10, 0),
          dateKey: "2026-10-24",
          dayNumber: 24,
          dayName: "Sat",
          monthName: "Oct",
          year: 2026,
          monthIndex: 9,
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
          year: 2026,
          monthIndex: 9,
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
          year: 2026,
          monthIndex: 9,
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

  // Active Month & Year state (defaults to October 2026 where appointments are)
  const [activeMonthYear, setActiveMonthYear] = useState({ year: 2026, month: 9 }); // 9 = October

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Month navigation handlers
  const handlePrevMonth = () => {
    setActiveMonthYear((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setActiveMonthYear((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const jumpToOctober = () => {
    setActiveMonthYear({ year: 2026, month: 9 });
    setSelectedDateKey("2026-10-24");
  };

  // Appointments for the currently active month
  const currentMonthAppointments = useMemo(() => {
    return normalizedAppointments.filter(
      (app) => app.year === activeMonthYear.year && app.monthIndex === activeMonthYear.month
    );
  }, [normalizedAppointments, activeMonthYear]);

  // Selected date key
  const [selectedDateKey, setSelectedDateKey] = useState<string>("2026-10-24");

  // Generate dynamic days ribbon for the active month
  const ribbonDays = useMemo(() => {
    const totalDays = new Date(activeMonthYear.year, activeMonthYear.month + 1, 0).getDate();
    const days: Array<{
      dateKey: string;
      dayNumber: number;
      dayName: string;
      hasAppointment: boolean;
      appointmentCount: number;
      isToday: boolean;
    }> = [];

    for (let d = 1; d <= totalDays; d++) {
      const key = `${activeMonthYear.year}-${String(activeMonthYear.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const apps = appointmentsByDate.get(key) || [];
      const dateObj = new Date(activeMonthYear.year, activeMonthYear.month, d);
      days.push({
        dateKey: key,
        dayNumber: d,
        dayName: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        hasAppointment: apps.length > 0,
        appointmentCount: apps.length,
        isToday: activeMonthYear.year === 2026 && activeMonthYear.month === 9 && d === 27,
      });
    }

    return days;
  }, [activeMonthYear, appointmentsByDate]);

  // Selected appointments on current day
  const currentSelectedApps = useMemo(() => {
    return appointmentsByDate.get(selectedDateKey) || [];
  }, [appointmentsByDate, selectedDateKey]);

  // Selected date parsed details
  const selectedDateDetails = useMemo(() => {
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return {
      day: d,
      month: dateObj.toLocaleDateString("en-US", { month: "short" }),
      weekday: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
      year: y,
    };
  }, [selectedDateKey]);

  return (
    <div className="bg-gradient-to-r from-[#D7F3E5] via-[#E8F8EE] to-[#CFEFE0] border border-[#BDE8D1] rounded-2xl p-3.5 sm:p-4 shadow-2xs flex flex-col space-y-2.5">
      {/* 1. Sleek Digital Header with Month Switcher (Matching Light Green Theme) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#047857] text-white flex items-center justify-center shadow-xs">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black tracking-widest uppercase text-[#064E3B] bg-white/80 px-1.5 py-0.2 rounded border border-[#BDE8D1]">
                DIGITAL HUD
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#064E3B]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#064E3B] tracking-tight mt-0.5">
              Visits Calendar
            </h3>
          </div>
        </div>

        {/* Month Navigator Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white/85 border border-[#BDE8D1] rounded-lg px-1.5 py-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-5 h-5 rounded hover:bg-[#D7F3E5] text-[#064E3B] flex items-center justify-center cursor-pointer transition-colors"
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-[#064E3B] px-1.5 select-none min-w-[95px] text-center">
              {monthNames[activeMonthYear.month]} {activeMonthYear.year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-5 h-5 rounded hover:bg-[#D7F3E5] text-[#064E3B] flex items-center justify-center cursor-pointer transition-colors"
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/80 text-[#064E3B] border border-[#BDE8D1] shrink-0">
            {currentMonthAppointments.length} Booked
          </span>
        </div>
      </div>

      {/* 2. Quick Doctor Switcher Chips for Current Month */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {currentMonthAppointments.length > 0 ? (
          currentMonthAppointments.map((app) => {
            const isSelected = selectedDateKey === app.dateKey;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => setSelectedDateKey(app.dateKey)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#059669] text-white shadow-2xs scale-102 border border-[#047857]"
                    : "bg-white hover:bg-[#E8F8EE] text-[#064E3B] border border-[#BDE8D1] hover:border-[#059669]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-white" : "bg-[#059669]"
                  }`}
                />
                <span>{app.doctorName.split(" ")[1] || app.doctorName}</span>
                <span className="opacity-80 font-normal">({app.dayNumber} {app.monthName})</span>
              </button>
            );
          })
        ) : (
          <div className="flex items-center justify-between w-full text-xs py-0.5">
            <span className="text-[11px] text-slate-500 font-medium">
              No visits scheduled in {monthNames[activeMonthYear.month]}
            </span>
            <button
              type="button"
              onClick={jumpToOctober}
              className="text-[11px] font-bold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Back to Oct (3 Booked)</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Horizontal Digital Days Ribbon (Scrollable for active month) */}
      <div className="bg-white/70 rounded-xl p-1.5 border border-[#BDE8D1]">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {ribbonDays.map((d) => {
            const isSelected = selectedDateKey === d.dateKey;
            const hasApp = d.hasAppointment;

            return (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(d.dateKey)}
                className={`py-1 px-1.5 sm:px-2 rounded-lg flex flex-col items-center justify-center min-w-[34px] sm:min-w-[38px] transition-all cursor-pointer relative shrink-0 ${
                  isSelected
                    ? "bg-[#059669] text-white font-extrabold shadow-2xs scale-105 z-10 border border-[#047857]"
                    : hasApp
                    ? "bg-[#D7F3E5] text-[#064E3B] font-bold hover:bg-white border border-[#BDE8D1]"
                    : "text-[#064E3B]/80 hover:bg-white font-medium"
                }`}
                title={hasApp ? `Appointment on ${d.dayNumber} ${monthNames[activeMonthYear.month]}` : `${d.dayNumber} ${monthNames[activeMonthYear.month]}`}
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
                      isSelected ? "bg-white" : "bg-[#059669] animate-pulse"
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
        <div className="p-2.5 rounded-xl bg-white/90 border border-[#BDE8D1] flex items-center justify-between text-xs transition-all shadow-2xs">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            {/* Digital Date Cube in Brand Green */}
            <div className="shrink-0 w-11 h-12 rounded-lg bg-gradient-to-br from-[#059669] to-[#047857] text-white flex flex-col items-center justify-center shadow-xs border border-[#047857]/40">
              <span className="text-[9px] font-black tracking-widest uppercase text-[#D7F3E5] leading-none">
                {selectedDateDetails.month}
              </span>
              <span className="text-base font-black leading-tight mt-0.5 text-white">
                {selectedDateDetails.day}
              </span>
              <span className="text-[8px] uppercase font-bold text-[#D7F3E5] leading-none">
                {selectedDateDetails.weekday}
              </span>
            </div>

            {/* Doctor Info */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-[#064E3B] text-xs sm:text-sm truncate">
                  {currentSelectedApps[0].doctorName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#059669]/15 text-[#064E3B] border border-[#BDE8D1] shrink-0">
                  {currentSelectedApps[0].status}
                </span>
              </div>
              <div className="text-[11px] text-[#064E3B]/80 truncate font-medium">
                {currentSelectedApps[0].specialty}
              </div>
              <div className="text-[11px] text-[#064E3B] font-semibold flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-[#059669] shrink-0" />
                <span className="truncate">{currentSelectedApps[0].timeString} • {currentSelectedApps[0].clinicInfo}</span>
              </div>
            </div>
          </div>

          <Link
            href="/patient/appointments"
            className="px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-white/90 border border-[#BDE8D1] flex items-center justify-between text-xs text-[#064E3B] shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="shrink-0 w-11 h-12 rounded-lg bg-[#E8F8EE] text-[#064E3B] border border-[#BDE8D1] flex flex-col items-center justify-center font-bold">
              <span className="text-[9px] uppercase leading-none">{selectedDateDetails.month}</span>
              <span className="text-base font-black leading-tight mt-0.5">{selectedDateDetails.day}</span>
              <span className="text-[8px] uppercase leading-none opacity-70">{selectedDateDetails.weekday}</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="font-bold text-[#064E3B] text-xs">No Visit Scheduled</div>
              <div className="text-[11px] text-[#064E3B]/70 truncate">
                Free clinical slot on {selectedDateDetails.day} {monthNames[activeMonthYear.month]}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={jumpToOctober}
            className="px-2.5 py-1 rounded-lg bg-[#D7F3E5] hover:bg-white text-[#064E3B] text-[11px] font-bold transition-all shrink-0 ml-1 cursor-pointer border border-[#BDE8D1]"
          >
            View Oct Visits &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
