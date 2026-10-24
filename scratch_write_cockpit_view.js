const fs = require('fs');

const cockpitViewContent = `"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  GitCompare,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Activity,
  ShieldCheck,
  PhoneCall,
  Pill,
  Hospital,
  MoreVertical,
  CheckCircle2,
  Info,
  Brain,
  Award,
  Briefcase,
  X,
  PhoneForwarded,
} from "lucide-react";

export interface SchedulePatient {
  id: string;
  time: string;
  room: string;
  name: string;
  gender: string;
  age: number;
  avatarUrl?: string;
  initials: string;
  condition: string;
  visitType: string;
  triageStatus: "Scheduled" | "Pending" | "Critical";
  callStatus: "Called" | "Not Called" | "Scheduled";
  calledAt?: string;
}

interface DoctorCockpitViewProps {
  doctorName: string;
  doctorSpecialization: string;
  doctorQualification: string;
  totalPatientsCount: number;
  initialSchedule?: SchedulePatient[];
}

const defaultSchedule: SchedulePatient[] = [
  {
    id: "patient_1",
    time: "09:30 AM",
    room: "Room 1",
    name: "Rajesh Sharma",
    gender: "Male",
    age: 56,
    initials: "RS",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    condition: "T2DM + Hypertension",
    visitType: "Follow-up visit",
    triageStatus: "Scheduled",
    callStatus: "Not Called",
  },
  {
    id: "pat_priya",
    time: "10:30 AM",
    room: "Room 2",
    name: "Priya Nair",
    gender: "Female",
    age: 42,
    initials: "PN",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    condition: "Fever & Cough",
    visitType: "Initial consultation",
    triageStatus: "Scheduled",
    callStatus: "Called",
    calledAt: "Yesterday at 06:15 PM",
  },
  {
    id: "pat_amit",
    time: "11:15 AM",
    room: "Room 1",
    name: "Amit Verma",
    gender: "Male",
    age: 34,
    initials: "AV",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    condition: "Diabetes Review",
    visitType: "Follow-up visit",
    triageStatus: "Pending",
    callStatus: "Not Called",
  },
  {
    id: "pat_sneha",
    time: "12:00 PM",
    room: "Room 3",
    name: "Sneha Iyer",
    gender: "Female",
    age: 28,
    initials: "SI",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    condition: "Thyroid Evaluation",
    visitType: "New consultation",
    triageStatus: "Scheduled",
    callStatus: "Scheduled",
  },
  {
    id: "pat_vikram",
    time: "01:00 PM",
    room: "Room 2",
    name: "Vikram Singh",
    gender: "Male",
    age: 61,
    initials: "VS",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    condition: "Post-op Review",
    visitType: "Follow-up visit",
    triageStatus: "Critical",
    callStatus: "Called",
    calledAt: "Yesterday at 05:40 PM",
  },
  {
    id: "pat_ananya",
    time: "02:30 PM",
    room: "Room 1",
    name: "Ananya Rao",
    gender: "Female",
    age: 45,
    initials: "AR",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    condition: "Migraine",
    visitType: "Follow-up visit",
    triageStatus: "Scheduled",
    callStatus: "Not Called",
  },
];

export function DoctorCockpitView({
  doctorName,
  doctorSpecialization,
  doctorQualification,
  totalPatientsCount,
  initialSchedule = defaultSchedule,
}: DoctorCockpitViewProps) {
  const [schedule, setSchedule] = useState<SchedulePatient[]>(initialSchedule);
  const [callingPatient, setCallingPatient] = useState<SchedulePatient | null>(null);
  const [callModalSuccess, setCallModalSuccess] = useState(false);

  // Trigger automated reminder call simulation
  function triggerCall(patient: SchedulePatient) {
    setCallingPatient(patient);
    setCallModalSuccess(false);
  }

  function confirmDispatchCall() {
    if (!callingPatient) return;
    setCallModalSuccess(true);
    setTimeout(() => {
      setSchedule((prev) =>
        prev.map((p) =>
          p.id === callingPatient.id
            ? { ...p, callStatus: "Called", calledAt: "Today (Just now)" }
            : p
        )
      );
      setCallingPatient(null);
      setCallModalSuccess(false);
    }, 1400);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER ("Good morning, Dr. Aarav Mehta")             */}
      {/* ============================================================ */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0C161D] via-[#0E1E28] to-[#132A37] p-6 sm:p-8 text-white overflow-hidden shadow-sm">
        
        {/* Stethoscope Background Artwork on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none overflow-hidden">
          <img
            src="/images/doctor-banner-stethoscope.jpg"
            alt=""
            className="w-full h-full object-cover object-right opacity-35 mix-blend-luminosity"
          />
          {/* Subtle gradient fader */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C161D] via-[#0E1E28]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-6">
          
          {/* Top Row: Greeting & Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal text-white tracking-tight leading-tight">
                Good morning, {doctorName}
              </h1>
              <p className="text-xs sm:text-sm text-[#CAD6D2] mt-1.5 font-light">
                Your clinical command center for smarter, coordinated patient care.
              </p>
            </div>

            {/* Buttons (Patients Cohort & Schedule Review) */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/doctor/patients"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F0BF7A] hover:bg-[#E5B168] text-[#1C140B] shadow-sm transition-all active:scale-95"
              >
                <Users className="w-4 h-4 text-[#1C140B]" />
                <span>Patients Cohort</span>
              </Link>

              <Link
                href="/doctor/appointments"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/25 text-white backdrop-blur-md transition-all active:scale-95"
              >
                <Calendar className="w-4 h-4 text-white/90" />
                <span>Schedule Review</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row: 4 Frosted Dark Metric Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            
            {/* Badge 1: Clinical Rounds */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Stethoscope className="w-4 h-4 text-[#F0BF7A] shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
                  <span>Clinical Rounds</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-[10px]">Active</span>
                </div>
                <div className="text-[10px] text-white/60 font-mono">
                  08:00 AM &ndash; 01:00 PM
                </div>
              </div>
            </div>

            {/* Badge 2: Qualification */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Award className="w-4 h-4 text-[#F0BF7A] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-white truncate">
                  {doctorQualification || "MBBS, MD (Medicine)"}
                </div>
                <div className="text-[10px] text-white/60 font-mono">
                  Reg. No. 123456
                </div>
              </div>
            </div>

            {/* Badge 3: Specialization */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Briefcase className="w-4 h-4 text-[#F0BF7A] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-white truncate">
                  {doctorSpecialization || "Internal Medicine & Diabetology"}
                </div>
                <div className="text-[10px] text-white/60">
                  Senior Consultant
                </div>
              </div>
            </div>

            {/* Badge 4: Current Shift */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Clock className="w-4 h-4 text-[#F0BF7A] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-white">
                  Current Shift
                </div>
                <div className="text-[10px] text-white/60 font-mono">
                  08:00 AM &ndash; 04:00 PM
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. FOUR CLINICAL METRIC STAT CARDS                           */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Consultations (Mint Green) */}
        <Link
          href="/doctor/appointments"
          className="p-5 rounded-3xl bg-white border border-[#EFE8DE] hover:border-[#D5E6E0] shadow-xs hover:shadow-md transition-all group relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#E1F4EE] flex items-center justify-center text-[#0D8272]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 leading-none">8</div>
                <span className="text-[10px] font-bold text-[#0D8272] bg-[#E1F4EE] px-2 py-0.5 rounded-full mt-1 inline-block">
                  +2 vs yesterday
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-800">Today&apos;s Consultations</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Scheduled for today</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#E1F4EE] group-hover:text-[#0D8272] transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 2: Longitudinal Patients (Warm Honey Amber) */}
        <Link
          href="/doctor/patients"
          className="p-5 rounded-3xl bg-white border border-[#EFE8DE] hover:border-[#F2DFBE] shadow-xs hover:shadow-md transition-all group relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FDF0DC] flex items-center justify-center text-[#C97A1E]">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 leading-none">
                  {totalPatientsCount || 24}
                </div>
                <span className="text-[10px] font-bold text-[#C97A1E] bg-[#FDF0DC] px-2 py-0.5 rounded-full mt-1 inline-block">
                  +3 vs last week
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-800">Longitudinal Patients</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Under continuous care</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#FDF0DC] group-hover:text-[#C97A1E] transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 3: Assessments to Review (Periwinkle Slate) */}
        <Link
          href="/doctor/patients/patient_1?tab=what-changed"
          className="p-5 rounded-3xl bg-white border border-[#EFE8DE] hover:border-[#CAD8E6] shadow-xs hover:shadow-md transition-all group relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF1F7] flex items-center justify-center text-[#456382]">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 leading-none">3</div>
                <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  Need attention
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-800">Assessments to Review</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Pending clinical review</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#EBF1F7] group-hover:text-[#456382] transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 4: Follow-up Reminders Due (Soft Coral / Rose) */}
        <Link
          href="/doctor/appointments"
          className="p-5 rounded-3xl bg-white border border-[#EFE8DE] hover:border-[#F2CACA] shadow-xs hover:shadow-md transition-all group relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FDEAEA] flex items-center justify-center text-[#C84949]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 leading-none">3</div>
                <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  Due today
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-800">Follow-up Reminders Due</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Patient follow-ups &amp; rechecks</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#FDEAEA] group-hover:text-[#C84949] transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

      </div>

      {/* ============================================================ */}
      {/* 3. SPLIT MAIN CONTENT: SCHEDULE & CLINICAL INTELLIGENCE      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: TODAY'S CONSULTATION SCHEDULE (2 COLUMNS)     */}
        {/* ========================================================== */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFE8DE] p-5 sm:p-6 shadow-xs space-y-4">
          
          {/* Schedule Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0DC] flex items-center justify-center text-[#C97A1E]">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                Today&apos;s Consultation Schedule
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 bg-[#F6F1E9] px-3 py-1 rounded-full border border-[#EAE2D5]">
                Thu, 24 Apr 2025
              </span>
              <Link
                href="/doctor/appointments"
                className="text-xs font-bold text-[#0D8272] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-semibold text-[11px] pb-3 border-b border-slate-100">
                  <th className="py-2.5 px-3">Time &amp; Room</th>
                  <th className="py-2.5 px-3">Patient Profile</th>
                  <th className="py-2.5 px-3">Clinical Indication</th>
                  <th className="py-2.5 px-3">Triage Status</th>
                  <th className="py-2.5 px-3">Auto Call / Appt</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {schedule.map((patient) => (
                  <tr key={patient.id} className="hover:bg-[#FAF7F2] transition-colors group">
                    
                    {/* Time & Room */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-800 text-xs">{patient.time}</div>
                      <div className="text-[10.5px] text-slate-500">&bull; {patient.room}</div>
                    </td>

                    {/* Patient Profile */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={patient.avatarUrl}
                          alt={patient.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#E8DFD1]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <Link
                            href={\`/doctor/patients/\${patient.id}?tab=what-changed\`}
                            className="font-bold text-slate-900 text-xs hover:text-[#0D8272] truncate block"
                          >
                            {patient.name}
                          </Link>
                          <div className="text-[10px] text-slate-500">
                            {patient.gender} &bull; {patient.age} yrs
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Clinical Indication */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                        {patient.condition}
                      </div>
                      <div className="text-[10.5px] text-slate-500 line-clamp-1">
                        {patient.visitType}
                      </div>
                    </td>

                    {/* Triage Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {patient.triageStatus === "Scheduled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0F3EE] text-[#0D8272] border border-[#A7E2D5]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D8272]" />
                          Scheduled
                        </span>
                      )}
                      {patient.triageStatus === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                          Pending
                        </span>
                      )}
                      {patient.triageStatus === "Critical" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                          Critical
                        </span>
                      )}
                    </td>

                    {/* Auto Call / Appt */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {patient.callStatus === "Called" && (
                        <button
                          type="button"
                          onClick={() => triggerCall(patient)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E0F3EE] text-[#0D8272] border border-[#B6E8DC] hover:bg-[#D2EFE7] transition-colors cursor-pointer"
                          title="Call already sent 1 day prior. Click to view or redial."
                        >
                          <PhoneCall className="w-3 h-3 text-[#0D8272]" />
                          <span>Called</span>
                        </button>
                      )}
                      {patient.callStatus === "Not Called" && (
                        <button
                          type="button"
                          onClick={() => triggerCall(patient)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0EAE1] text-[#71665A] border border-[#E2D8CC] hover:bg-[#E6DDCF] transition-colors cursor-pointer"
                          title="Click to trigger automated appointment reminder call"
                        >
                          <PhoneForwarded className="w-3 h-3 text-[#8F8170]" />
                          <span>Not Called</span>
                        </button>
                      )}
                      {patient.callStatus === "Scheduled" && (
                        <button
                          type="button"
                          onClick={() => triggerCall(patient)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E0F3EE] text-[#0D8272] border border-[#B6E8DC] hover:bg-[#D2EFE7] transition-colors cursor-pointer"
                        >
                          <PhoneCall className="w-3 h-3 text-[#0D8272]" />
                          <span>Scheduled</span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={\`/doctor/patients/\${patient.id}?tab=what-changed\`}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-[#DDD4C5] text-slate-800 hover:bg-[#FAF7F2] hover:border-[#0D8272] transition-colors"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F2ECE1] transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: CLINICAL INTELLIGENCE (1 COLUMN)             */}
        {/* ========================================================== */}
        <div className="bg-white rounded-3xl border border-[#EFE8DE] p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Header: Brain icon + Clinical Intelligence + View All */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-xs">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight">
                    Clinical Intelligence
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    AI-assisted insights for better decisions
                  </p>
                </div>
              </div>

              <Link
                href="/doctor/patients/patient_1?tab=what-changed"
                className="text-xs font-bold text-[#0D8272] hover:underline"
              >
                View All &rarr;
              </Link>
            </div>

            {/* Insight 1: AI Differential Review */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#E1F4EE] text-[#0D8272] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    AI Differential Review
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  2 Pending
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Potential differentials identified for 2 cases today.
              </p>
              <div>
                <Link
                  href="/doctor/patients/patient_1?tab=what-changed"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D8272] hover:underline"
                >
                  <span>Review Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Insight 2: Flagged Observations */}
            <div className="p-3.5 rounded-2xl bg-[#FFF6F6] border border-[#FCE1E1] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#FDEAEA] text-[#C84949] flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Flagged Observations
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                  1 Critical
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                1 critical observation detected (Creatinine +70% acute shift).
              </p>
              <div>
                <Link
                  href="/doctor/patients/patient_1?tab=records"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C84949] hover:underline"
                >
                  <span>View Alerts</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Insight 3: Pharmacovigilance Alerts */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#EBF1F7] text-[#456382] flex items-center justify-center">
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Pharmacovigilance Alerts
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  1 Pending
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Possible drug interaction / adverse event risk flagged.
              </p>
              <div>
                <Link
                  href="/doctor/medicines"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D8272] hover:underline"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Insight 4: Follow-up Reminders */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#E1F4EE] text-[#0D8272] flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Follow-up Reminders
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                  5 Due
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Patient rechecks, labs and consultations schedule due.
              </p>
              <div>
                <Link
                  href="/doctor/appointments"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D8272] hover:underline"
                >
                  <span>View Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

          {/* Footnote: Safety & Disclaimer Notice */}
          <div className="pt-3 border-t border-[#F4EFE6] flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p>
              AI outputs are decision support suggestions and not a definitive diagnosis. Always use your clinical judgment and approval.
            </p>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* AUTOMATED REMINDER CALL MODAL                                */}
      {/* ============================================================ */}
      {callingPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE2D5] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 text-xs text-slate-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E0F3EE] text-[#0D8272] flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Automated Appointment Call
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Telephony IVR Service &bull; 1-Day Prior Notice
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCallingPatient(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {callModalSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Call Dispatched Successfully!</p>
                <p className="text-xs text-emerald-700">
                  Patient {callingPatient.name} has been notified to arrive 30 minutes prior. Status updated to &quot;Called&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] space-y-1">
                  <p className="font-bold text-slate-900 text-xs">
                    Patient: {callingPatient.name} ({callingPatient.age} yrs, {callingPatient.gender})
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Appointment: {callingPatient.time} at {callingPatient.room}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Doctor: {doctorName} ({doctorSpecialization})
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    Automated Voice Script:
                  </span>
                  <p className="italic text-[11px]">
                    &ldquo;Hello {callingPatient.name}, this is an automated reminder from CodeRx. You have a confirmed consultation with {doctorName} at {callingPatient.room} at {callingPatient.time}. Please arrive 30 minutes prior to your slot. Thank you.&rdquo;
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCallingPatient(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDispatchCall}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0D8272] to-[#0A6E82] text-white font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dispatch Automated Call</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
`;

fs.writeFileSync('c:/Users/Vedant/Desktop/triageai/src/app/doctor/DoctorCockpitView.tsx', cockpitViewContent);
console.log('Successfully written DoctorCockpitView.tsx!');
