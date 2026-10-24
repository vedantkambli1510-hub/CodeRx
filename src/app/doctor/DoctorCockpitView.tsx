"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Pill,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  FileUp,
  ChevronRight,
  PhoneCall,
  Bot,
  MapPin,
  Check,
  X,
  Stethoscope,
  QrCode,
  CreditCard,
} from "lucide-react";

export interface SchedulePatient {
  id: string;
  time: string;
  consultType: "Consultation" | "Follow Up";
  name: string;
  gender: string;
  age: number;
  initials: string;
  avatarColor: string;
  condition: string;
  patientType: "New Patient" | "Follow Up";
  status: "Checked In" | "Waiting" | "Scheduled";
}

interface DoctorCockpitViewProps {
  doctorName?: string;
  doctorSpecialization?: string;
  doctorQualification?: string;
  totalPatientsCount?: number;
  initialSchedule?: any[];
}

const DEFAULT_SCHEDULE: SchedulePatient[] = [
  {
    id: "patient_1",
    time: "09:00 AM",
    consultType: "Consultation",
    name: "Rohan Sharma",
    gender: "M",
    age: 34,
    initials: "R",
    avatarColor: "bg-purple-100 text-purple-700 border-purple-200",
    condition: "Fever & Throat Pain",
    patientType: "New Patient",
    status: "Checked In",
  },
  {
    id: "pat_sneha",
    time: "09:45 AM",
    consultType: "Follow Up",
    name: "Sneha Patil",
    gender: "F",
    age: 28,
    initials: "S",
    avatarColor: "bg-sky-100 text-sky-700 border-sky-200",
    condition: "Thyroid Follow Up",
    patientType: "Follow Up",
    status: "Waiting",
  },
  {
    id: "pat_arjun",
    time: "10:30 AM",
    consultType: "Consultation",
    name: "Arjun Nair",
    gender: "M",
    age: 42,
    initials: "A",
    avatarColor: "bg-teal-100 text-teal-700 border-teal-200",
    condition: "Diabetes Management",
    patientType: "Follow Up",
    status: "Scheduled",
  },
  {
    id: "pat_priya",
    time: "11:15 AM",
    consultType: "Consultation",
    name: "Priya Shah",
    gender: "F",
    age: 26,
    initials: "P",
    avatarColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    condition: "Skin Allergy",
    patientType: "New Patient",
    status: "Scheduled",
  },
  {
    id: "pat_vikram",
    time: "12:00 PM",
    consultType: "Follow Up",
    name: "Vikram Desai",
    gender: "M",
    age: 50,
    initials: "V",
    avatarColor: "bg-blue-100 text-blue-700 border-blue-200",
    condition: "Hypertension",
    patientType: "Follow Up",
    status: "Scheduled",
  },
  {
    id: "pat_kavya",
    time: "01:00 PM",
    consultType: "Consultation",
    name: "Kavya Iyer",
    gender: "F",
    age: 37,
    initials: "K",
    avatarColor: "bg-amber-100 text-amber-700 border-amber-200",
    condition: "Migraine",
    patientType: "New Patient",
    status: "Scheduled",
  },
];

export function DoctorCockpitView({
  doctorName = "Dr. Aarav Mehta",
  doctorSpecialization = "General Physician",
  doctorQualification = "MBBS, MD (Medicine)",
  totalPatientsCount = 12,
}: DoctorCockpitViewProps) {
  const [schedule, setSchedule] = useState<SchedulePatient[]>(DEFAULT_SCHEDULE);
  const [currentDateFormatted, setCurrentDateFormatted] = useState("Today, 22 Oct 2026");

  useEffect(() => {
    setCurrentDateFormatted(
      `Today, ${new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`
    );
  }, []);

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16 text-slate-800 font-sans select-none animate-in fade-in duration-300">
      
      {/* ============================================================ */}
      {/* 1. HERO GREETING BANNER WITH DESK VISUAL & PRAISING QUOTE    */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FAF3EA] via-[#FDFBF7] to-[#F5ECE0] border border-[#EFE5D8] p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Warm Doctor Greeting & Clinic Status */}
        <div className="space-y-4 max-w-xl relative z-10">
          <div>
            <h1 className="font-serif italic text-2xl sm:text-3xl text-[#183E36] font-normal leading-tight">
              Good morning,
            </h1>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#183E36] tracking-tight mt-0.5">
              {doctorName}
            </p>
            <p className="text-xs sm:text-sm text-[#5D736C] font-medium mt-1.5">
              Here's what's happening with your clinic today.
            </p>
          </div>

          {/* Date & Location Badges matching screenshot */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E7DDCE] text-xs font-semibold text-[#183E36] shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#24544A]" />
              <span>{currentDateFormatted}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E7DDCE] text-xs font-semibold text-[#183E36] shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#24544A]" />
              <span>Civil Hospital, Mumbai</span>
            </span>
          </div>
        </div>

        {/* Right: Desk Stethoscope Visual + Handwritten Quote */}
        <div className="relative flex items-center justify-end shrink-0 max-w-md w-full md:w-auto">
          <div className="relative rounded-2xl overflow-hidden border border-[#E5DACB] shadow-sm aspect-[16/9] w-72 sm:w-80 group">
            <img
              src="/images/clinic-warm-desk.jpg"
              alt="Doctor Stethoscope Desk"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183E36]/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Handwritten Cursive Praising Callout matching screenshot */}
          <div className="absolute -top-3 -right-2 sm:right-2 transform rotate-2 select-none pointer-events-none z-10">
            <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl border border-[#E4D7C5] shadow-xs">
              <p className="font-serif italic font-bold text-sm sm:text-base text-[#1E4D43] tracking-wide leading-tight">
                Better Care
              </p>
              <p className="font-serif italic font-bold text-sm sm:text-base text-[#1E4D43] tracking-wide leading-tight text-right">
                Every Day
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. METRIC STAT CARDS ROW (4 CLEAN CARDS MATCHING MOCKUP)      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Today's Appointments */}
        <Link
          href="/doctor/appointments"
          className="p-5 rounded-2xl bg-white border border-[#EBE3D7] hover:border-[#1E4D43]/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F5EF] flex items-center justify-center text-[#1E4D43] shrink-0 border border-[#D5EADB]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#183E36] leading-none">
                8
              </div>
              <p className="text-xs font-bold text-[#5D736C] mt-1 group-hover:text-[#183E36] transition-colors flex items-center gap-1">
                <span>Today's Appointments</span>
                <span className="text-emerald-700 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Total Patients */}
        <Link
          href="/doctor/patients"
          className="p-5 rounded-2xl bg-white border border-[#EBE3D7] hover:border-sky-500/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F3FA] flex items-center justify-center text-sky-700 shrink-0 border border-[#D5E7F5]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#183E36] leading-none">
                {totalPatientsCount || 12}
              </div>
              <p className="text-xs font-bold text-[#5D736C] mt-1 group-hover:text-[#183E36] transition-colors flex items-center gap-1">
                <span>Total Patients</span>
                <span className="text-sky-700 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </p>
            </div>
          </div>
        </Link>

        {/* Card 3: Pending Prescriptions */}
        <Link
          href="/doctor/prescriptions"
          className="p-5 rounded-2xl bg-white border border-[#EBE3D7] hover:border-amber-500/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FEF4E8] flex items-center justify-center text-amber-700 shrink-0 border border-[#FDE5CC]">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#183E36] leading-none">
                3
              </div>
              <p className="text-xs font-bold text-[#5D736C] mt-1 group-hover:text-[#183E36] transition-colors flex items-center gap-1">
                <span>Pending Prescriptions</span>
                <span className="text-amber-700 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </p>
            </div>
          </div>
        </Link>

        {/* Card 4: Lab Reports */}
        <Link
          href="/doctor/records"
          className="p-5 rounded-2xl bg-white border border-[#EBE3D7] hover:border-purple-500/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EEFB] flex items-center justify-center text-purple-700 shrink-0 border border-[#E6D7F7]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#183E36] leading-none">
                2
              </div>
              <p className="text-xs font-bold text-[#5D736C] mt-1 group-hover:text-[#183E36] transition-colors flex items-center gap-1">
                <span>Lab Reports</span>
                <span className="text-purple-700 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </p>
            </div>
          </div>
        </Link>

      </div>

      {/* ============================================================ */}
      {/* 3. MAIN SPLIT CONTENT GRID (LEFT TABLE + RIGHT CARDS)        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: TODAY'S APPOINTMENTS TABLE (65%)              */}
        {/* ========================================================== */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D7] shadow-xs space-y-5">
          
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#183E36]" />
              <h2 className="text-base sm:text-lg font-black text-[#183E36]">
                Today's Appointments
              </h2>
            </div>

            <Link
              href="/doctor/appointments"
              className="text-xs font-bold text-[#5D736C] hover:text-[#183E36] transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          {/* Appointments Rows List */}
          <div className="divide-y divide-slate-100">
            {schedule.map((apt) => (
              <div
                key={apt.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F2]/60 px-2 rounded-2xl transition-colors group"
              >
                {/* 1. Time & Consultation Type */}
                <div className="w-28 shrink-0">
                  <span className="text-xs font-bold text-slate-900 block font-mono">
                    {apt.time}
                  </span>
                  <span className="text-[11px] text-[#718881] font-medium block">
                    {apt.consultType}
                  </span>
                </div>

                {/* 2. Patient Avatar & Demographics */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${apt.avatarColor}`}
                  >
                    {apt.initials}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-[#183E36] transition-colors">
                      {apt.name}
                    </h3>
                    <p className="text-[11px] text-[#718881]">
                      Age {apt.age} &bull; {apt.gender}
                    </p>
                  </div>
                </div>

                {/* 3. Reason / Condition */}
                <div className="w-44 shrink-0 hidden md:block">
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    {apt.condition}
                  </span>
                  <span className="text-[11px] text-[#718881] block">
                    {apt.patientType}
                  </span>
                </div>

                {/* 4. Status Badge */}
                <div className="w-24 shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                      apt.status === "Checked In"
                        ? "bg-[#E6F5EE] text-[#1E6047]"
                        : apt.status === "Waiting"
                        ? "bg-[#FEF1E2] text-[#9A5B1D]"
                        : "bg-[#EAF2FA] text-[#255D8F]"
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                {/* 5. View Action Button */}
                <div className="shrink-0">
                  <Link
                    href={`/doctor/patients/${apt.id}`}
                    className="px-4 py-1.5 rounded-full border border-slate-300 hover:border-[#183E36] hover:bg-[#183E36] hover:text-white text-xs font-bold text-[#183E36] transition-all inline-block text-center shadow-2xs"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: PENDING TASKS, AI ASSISTANT, QUICK ACTIONS    */}
        {/* ========================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD 1: PENDING TASKS */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D7] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#183E36]" />
                <h3 className="text-sm font-black text-[#183E36]">Pending Tasks</h3>
              </div>
              <Link href="/doctor/records" className="text-xs font-bold text-[#5D736C] hover:text-[#183E36]">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              
              {/* Task 1: Review lab reports */}
              <Link
                href="/doctor/records"
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-[#183E36]">
                      Review lab reports
                    </p>
                    <p className="text-[11px] text-slate-500">2 reports pending</p>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                  2
                </span>
              </Link>

              {/* Task 2: Complete prescriptions */}
              <Link
                href="/doctor/prescriptions"
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-[#183E36]">
                      Complete prescriptions
                    </p>
                    <p className="text-[11px] text-slate-500">3 pending</p>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Task 3: Follow up calls */}
              <Link
                href="/doctor/patients"
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-[#183E36]">
                      Follow up calls
                    </p>
                    <p className="text-[11px] text-slate-500">5 patients</p>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                  5
                </span>
              </Link>

              {/* Task 4: Update medical records */}
              <Link
                href="/doctor/records"
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-[#183E36]">
                      Update medical records
                    </p>
                    <p className="text-[11px] text-slate-500">1 pending</p>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                  1
                </span>
              </Link>

            </div>
          </div>

          {/* CARD 2: AI CLINICAL ASSISTANT (BETA) */}
          <div className="rounded-3xl bg-[#EAF5EF] border border-[#D3E8DC] p-5 sm:p-6 space-y-3.5 relative overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1E4D43]" />
                <h4 className="font-black text-sm text-[#183E36]">
                  AI Clinical Assistant
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3EEDB] text-[#164338] border border-[#BCE1C9]">
                Beta
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[#4F6A61] leading-relaxed max-w-[210px]">
                Get differential diagnosis, treatment suggestions and more, powered by AI.
              </p>

              {/* Friendly Robot / AI Mascot Graphic */}
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#CCE4D5] flex items-center justify-center shadow-xs text-[#1E4D43] shrink-0">
                <Bot className="w-8 h-8" />
              </div>
            </div>

            <Link
              href="/doctor/patients/patient_1?tab=what-changed"
              className="w-full py-2.5 rounded-xl bg-[#23584E] hover:bg-[#1B483F] text-white font-bold text-xs transition-all shadow-md shadow-[#23584E]/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open AI Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* CARD 3: QUICK ACTIONS */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase text-[#4F6A61] tracking-wider pl-1">
              Quick Actions
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <Link
                href="/doctor/patients"
                className="p-3 rounded-2xl bg-white border border-[#EBE3D7] hover:border-[#1E4D43] text-center space-y-1.5 transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#1E4D43] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  New Patient
                </span>
              </Link>

              <Link
                href="/doctor/prescriptions"
                className="p-3 rounded-2xl bg-white border border-[#EBE3D7] hover:border-[#1E4D43] text-center space-y-1.5 transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#1E4D43] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Pill className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  Write Rx
                </span>
              </Link>

              <Link
                href="/doctor/payments"
                className="p-3 rounded-2xl bg-white border border-sky-200 hover:border-sky-500 text-center space-y-1.5 transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-sky-900 block truncate">
                  Payment QR
                </span>
              </Link>

              <Link
                href="/doctor/records"
                className="p-3 rounded-2xl bg-white border border-[#EBE3D7] hover:border-[#1E4D43] text-center space-y-1.5 transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#1E4D43] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  Upload Report
                </span>
              </Link>

              <Link
                href="/doctor/availability"
                className="p-3 rounded-2xl bg-white border border-[#EBE3D7] hover:border-[#1E4D43] text-center space-y-1.5 transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#1E4D43] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  Calendar
                </span>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export const DoctorDashboardView = DoctorCockpitView;
