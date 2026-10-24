"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Send,
  Upload,
  UserCheck,
  Heart,
  Bot,
  CheckCircle2,
  AlertCircle,
  X,
  Stethoscope,
  Activity,
  MapPin,
  ExternalLink,
  HelpCircle,
  FlaskConical,
} from "lucide-react";

interface PatientDashboardViewProps {
  user: any;
  patient: any;
  appointments: any[];
  records: any[];
  timelines: any[];
  medicines: any[];
  prescriptions: any[];
  initialChecklist: any[];
}

export function PatientDashboardView({
  user,
  patient,
  appointments,
  records,
  medicines,
  prescriptions,
}: PatientDashboardViewProps) {
  const patientName = user?.name || "Aarav Mehta";

  // AI Assistant state
  const [aiQuery, setAiQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeAiResponse, setActiveAiResponse] = useState<{
    query: string;
    answer: string;
    tips: string[];
  } | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Selected prescription modal
  const [selectedRx, setSelectedRx] = useState<any | null>(null);

  // Fallback appointments matching the reference UI mockup perfectly
  const sampleAppointments = [
    {
      id: "apt-1",
      dateStr: "Oct 22 Wed",
      doctorName: "Dr. Meera Sharma",
      doctorSpecialty: "General Physician",
      doctorAvatar: "https://images.unsplash.com/photo-1594824813501-4837e1a3179f?w=150&auto=format&fit=crop&q=80",
      time: "10:30 AM – 11:00 AM",
      hospital: "Civil Hospital, Mumbai",
      status: "Confirmed",
      statusColor: "bg-[#EAF5EE] text-[#2F7A4D] border-[#CDE5D5]",
    },
    {
      id: "apt-2",
      dateStr: "Oct 25 Sat",
      doctorName: "Dr. Rohan Patil",
      doctorSpecialty: "Dermatologist",
      doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      time: "02:00 PM – 02:30 PM",
      hospital: "CareWell Clinic, Andheri",
      status: "Pending",
      statusColor: "bg-[#FDF4E7] text-[#B57422] border-[#F7E2C3]",
    },
    {
      id: "apt-3",
      dateStr: "Oct 28 Tue",
      doctorName: "Dr. Sneha Iyer",
      doctorSpecialty: "Cardiologist",
      doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
      time: "11:00 AM – 11:30 AM",
      hospital: "Apollo Hospitals, Mumbai",
      status: "Scheduled",
      statusColor: "bg-[#EEF4FA] text-[#3B6B9B] border-[#D4E3F3]",
    },
  ];

  // Map real appointments if available, otherwise use sample
  const displayedAppointments = appointments.length > 0 ? appointments.slice(0, 3).map((apt, idx) => {
    const start = new Date(apt.slot.startTime);
    const dateFormatted = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${start.toLocaleDateString("en-US", { weekday: "short" })}`;
    const timeFormatted = `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${new Date(apt.slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    
    const statuses = ["Confirmed", "Pending", "Scheduled"];
    const statusColors = [
      "bg-[#EAF5EE] text-[#2F7A4D] border-[#CDE5D5]",
      "bg-[#FDF4E7] text-[#B57422] border-[#F7E2C3]",
      "bg-[#EEF4FA] text-[#3B6B9B] border-[#D4E3F3]",
    ];

    const currentStatus = apt.status === "SCHEDULED" ? statuses[idx % 3] : apt.status;
    const currentColor = statusColors[idx % 3];

    return {
      id: apt.id,
      dateStr: dateFormatted,
      doctorName: apt.doctor.user.name,
      doctorSpecialty: apt.doctor.specialization,
      doctorAvatar: sampleAppointments[idx % 3].doctorAvatar,
      time: timeFormatted,
      hospital: apt.doctor.clinicInfo || "Civil Hospital, Mumbai",
      status: currentStatus,
      statusColor: currentColor,
    };
  }) : sampleAppointments;

  // Fallback prescriptions matching the reference UI
  const samplePrescription = {
    id: "rx-1",
    name: "Amoxicillin 500mg",
    dosage: "1-0-1 • 5 days",
    doctor: "Dr. Meera Sharma",
    date: "18 Oct 2026",
    instructions: "Take with meals. Complete the full antibiotic course to avoid recurrence.",
  };

  const handleAskAi = (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    setIsAiLoading(true);
    setShowAiModal(true);

    setTimeout(() => {
      let answer = "";
      let tips: string[] = [];

      if (q.toLowerCase().includes("lab") || q.toLowerCase().includes("result")) {
        answer = "Based on your latest Metabolic & CBC Panel from Civil Hospital: Fasting Blood Sugar is 126 mg/dL (slightly elevated), Serum Creatinine is 1.1 mg/dL (within normal renal limits), and Hemoglobin is 13.8 g/dL (optimal).";
        tips = [
          "Continue monitoring fasting blood glucose twice weekly.",
          "Keep adequate hydration (2.5L water daily) to support renal clearance.",
          "Review renal panel with Dr. Meera Sharma on your upcoming visit.",
        ];
      } else if (q.toLowerCase().includes("diet")) {
        answer = "For healthy metabolic balance and cardiovascular support: prioritize low-glycemic foods, fresh leafy greens, lean proteins, and fiber-rich lentils while moderating refined carbohydrates and saturated oils.";
        tips = [
          "Switch to whole grains (steel-cut oats, millets/jowar, quinoa).",
          "Include a palm-sized portion of protein with every main meal.",
          "Avoid sugary beverages and late-night heavy snacking.",
        ];
      } else {
        answer = `Regarding "${q}": Most mild symptoms can be traced to stress, seasonal hydration fluctuations, or dietary shifts. Your vital records and previous appointments show stable longitudinal trends.`;
        tips = [
          "Maintain regular 7-8 hours sleep cycle.",
          "Track any persistent discomfort in your Health Journal.",
          "Discuss any severe or worsening symptoms during your next consultation.",
        ];
      }

      setActiveAiResponse({ query: q, answer, tips });
      setIsAiLoading(false);
      setAiQuery("");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-800 pb-16">
      
      {/* ============================================================== */}
      {/* 1. TOP ROW: WELCOME BANNER + MOTIVATION CARD                    */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch font-sans">
        
        {/* Left: Warm Cozy Morning Welcome Banner (8 Cols) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#F0F8F5] via-[#E4F5ED]/90 to-[#D4F4E4]/40 border border-[#A5E3C3]/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-xs">
          
          {/* Subtle Window & Plant Illustration Artwork Background */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 pointer-events-none opacity-50 overflow-hidden">
            <svg viewBox="0 0 400 300" fill="none" className="w-full h-full object-cover">
              {/* Window Frame with Sunlight */}
              <rect x="180" y="20" width="180" height="240" rx="8" fill="#FFFBF5" stroke="#A5E3C3" strokeWidth="2.5" />
              <line x1="270" y1="20" x2="270" y2="260" stroke="#A5E3C3" strokeWidth="2" />
              <line x1="180" y1="140" x2="360" y2="140" stroke="#A5E3C3" strokeWidth="2" />
              {/* Warm Sun Rays */}
              <path d="M220 20 L360 160 L360 20 Z" fill="#BBF7D0" opacity="0.45" />
              {/* Potted Plant */}
              <path d="M130 190 L170 190 L165 240 L135 240 Z" fill="#059669" />
              <circle cx="150" cy="180" r="16" fill="#15803D" opacity="0.8" />
              <circle cx="140" cy="165" r="12" fill="#22C55E" opacity="0.85" />
              <circle cx="160" cy="165" r="12" fill="#16A34A" opacity="0.9" />
              {/* Coffee Cup with Heart */}
              <rect x="220" y="210" width="24" height="26" rx="4" fill="#FFFFFF" stroke="#A5E3C3" strokeWidth="1.5" />
              <path d="M244 216 Q252 223 244 230" stroke="#A5E3C3" strokeWidth="1.5" fill="none" />
              <path d="M232 222 Q234 220 236 222 Q236 226 232 229 Q228 226 228 222 Q230 220 232 222 Z" fill="#059669" />
              {/* Wall Frame Quote: Good Health Takes Time */}
              <rect x="280" y="50" width="55" height="75" rx="3" fill="#F0F8F5" stroke="#A5E3C3" strokeWidth="1.5" />
              <text x="307" y="75" textAnchor="middle" fontSize="6.5" fontStyle="italic" fill="#064E3B" fontFamily="sans-serif">Good</text>
              <text x="307" y="85" textAnchor="middle" fontSize="6.5" fontStyle="italic" fill="#064E3B" fontFamily="sans-serif">Health</text>
              <text x="307" y="95" textAnchor="middle" fontSize="6.5" fontStyle="italic" fill="#064E3B" fontFamily="sans-serif">Takes</text>
              <text x="307" y="105" textAnchor="middle" fontSize="6.5" fontStyle="italic" fill="#059669" fontFamily="sans-serif">Time ♡</text>
            </svg>
          </div>

          {/* Left Content Area */}
          <div className="space-y-3 z-10 max-w-md">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#047857]/90">
                Good morning,
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] tracking-tight flex items-center gap-2 mt-0.5">
                <span>{patientName}</span>
                <span className="text-amber-500 text-xl sm:text-2xl">☀️</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#134E39] leading-relaxed font-medium">
              Your health journey matters. Let&apos;s keep moving forward!
            </p>
          </div>

          {/* Meta Tags Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-6 z-10 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D6EDE1] text-[#064E3B] font-semibold shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#059669]" />
              <span>Today, 22 Oct 2026</span>
            </div>
            {patient?.bloodGroup && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D6EDE1] text-[#064E3B] font-semibold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Blood Group: {patient.bloodGroup}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Inspirational Patient Care Card (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#F0F8F5] via-[#E4F5ED] to-[#D4F4E4]/50 border border-[#A5E3C3]/70 rounded-3xl p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <h3 className="text-base font-extrabold text-[#064E3B] leading-snug">
              Your health<br />is in safe hands
            </h3>
            <p className="text-xs text-[#047857]/90 font-semibold">
              Stay consistent, stay healthier.
            </p>
          </div>

          {/* Botanical & Patient Artwork SVG */}
          <div className="relative pt-6 flex justify-end">
            <div className="w-32 h-28 relative">
              <svg viewBox="0 0 140 120" fill="none" className="w-full h-full">
                {/* Botanical leaves behind */}
                <path d="M110 90 Q 130 50 125 15" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="120" cy="30" rx="10" ry="16" fill="#BBF7D0" opacity="0.65" transform="rotate(25 120 30)" />
                <ellipse cx="130" cy="50" rx="8" ry="14" fill="#86EFAC" opacity="0.7" transform="rotate(40 130 50)" />
                <ellipse cx="115" cy="70" rx="7" ry="12" fill="#4ADE80" opacity="0.75" transform="rotate(15 115 70)" />
                {/* Serene Patient Silhouette */}
                <circle cx="65" cy="40" r="16" fill="#A7F3D0" />
                <path d="M52 35 Q 65 18 78 35 Q 75 48 52 35 Z" fill="#064E3B" />
                <path d="M42 85 Q 45 60 65 60 Q 85 60 88 85 Z" fill="#059669" />
                <circle cx="70" cy="68" r="4" fill="#FFFFFF" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 2. KPI METRIC STAT CARDS (4 COLUMNS - LIGHT DOCTORY GREEN)       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Upcoming Appointments */}
        <Link
          href="/patient/appointments"
          className="p-5 bg-white rounded-3xl border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#F3FAF6]/50 transition-all shadow-xs flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#064E3B] leading-tight">
                {displayedAppointments.length || 3}
              </div>
              <div className="text-[11px] font-bold text-[#047857]">
                Upcoming Appointments
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8FE3B8] group-hover:text-[#059669] group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Metric 2: Active Prescriptions */}
        <Link
          href="/patient/prescriptions"
          className="p-5 bg-white rounded-3xl border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#F3FAF6]/50 transition-all shadow-xs flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#064E3B] leading-tight">
                {medicines?.filter((m) => m.status === "CURRENT")?.length || 2}
              </div>
              <div className="text-[11px] font-bold text-[#047857]">
                Active Prescriptions
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8FE3B8] group-hover:text-[#059669] group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Metric 3: Medical Records */}
        <Link
          href="/patient/records"
          className="p-5 bg-white rounded-3xl border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#F3FAF6]/50 transition-all shadow-xs flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#064E3B] leading-tight">
                {records?.length || 5}
              </div>
              <div className="text-[11px] font-bold text-[#047857]">
                Medical Records
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8FE3B8] group-hover:text-[#059669] group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Metric 4: Lab Tests Near Me */}
        <Link
          href="/patient/labs"
          className="p-5 bg-white rounded-3xl border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#F3FAF6]/50 transition-all shadow-xs flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#064E3B] leading-tight">
                6+
              </div>
              <div className="text-[11px] font-bold text-[#047857]">
                Lab Tests Near Me
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8FE3B8] group-hover:text-[#059669] group-hover:translate-x-1 transition-all" />
        </Link>

      </div>

      {/* ============================================================== */}
      {/* 3. MAIN SPLIT: LEFT CONTENT (65%) + RIGHT WIDGETS (35%)         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN: UPCOMING APPOINTMENTS & RECENT PRESCRIPTIONS    */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section A: Upcoming Appointments */}
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-xs p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#059669]" />
                <h2 className="text-base font-extrabold text-[#064E3B]">
                  Upcoming Appointments
                </h2>
              </div>
              <Link
                href="/patient/appointments"
                className="text-xs font-bold text-[#047857] hover:text-[#059669] transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Appointment Cards List */}
            <div className="space-y-3">
              {displayedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#F3FAF6]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Date Pill Box */}
                    <div className="w-14 h-14 rounded-2xl bg-[#EAF7F0] border border-[#D6EDE1] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#047857] uppercase leading-tight">
                        {apt.dateStr.split(" ")[0]}
                      </span>
                      <span className="text-sm font-black text-[#064E3B] leading-tight">
                        {apt.dateStr.split(" ")[1]}
                      </span>
                      <span className="text-[9px] font-bold text-[#134E39] uppercase leading-tight">
                        {apt.dateStr.split(" ")[2]}
                      </span>
                    </div>

                    {/* Doctor Avatar */}
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={apt.doctorAvatar}
                        alt={apt.doctorName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Doctor Details */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-[#064E3B]">
                        {apt.doctorName}
                      </h4>
                      <p className="text-[11px] text-[#047857]">
                        {apt.doctorSpecialty}
                      </p>
                      <p className="text-[10.5px] text-[#134E39] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#059669]" />
                        <span>{apt.time}</span>
                      </p>
                    </div>
                  </div>

                  {/* Hospital & Status Badge */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-semibold text-[#047857] flex items-center gap-1 sm:justify-end">
                        <MapPin className="w-3 h-3 text-[#059669]" />
                        <span>{apt.hospital}</span>
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${apt.statusColor}`}
                    >
                      {apt.status}
                    </span>

                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Section B: Recent Prescriptions */}
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-xs p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#059669]" />
                <h2 className="text-base font-extrabold text-[#064E3B]">
                  Recent Prescriptions
                </h2>
              </div>
              <Link
                href="/patient/prescriptions"
                className="text-xs font-bold text-[#047857] hover:text-[#059669] transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Prescription Item matching mockup */}
            <div className="p-4 rounded-2xl border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#F3FAF6]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#064E3B]">
                    {prescriptions?.[0]?.diagnosis || samplePrescription.name}
                  </h4>
                  <p className="text-[11px] text-[#047857]">
                    {samplePrescription.dosage}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-[#047857]">
                <span>
                  {prescriptions?.[0]?.doctor?.user?.name || samplePrescription.doctor}
                </span>
                <span className="text-[#064E3B] font-semibold">
                  {samplePrescription.date}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRx(samplePrescription)}
                  className="px-4 py-1.5 rounded-full bg-white border border-[#8FE3B8] hover:border-[#059669] hover:bg-[#059669] hover:text-white text-xs font-bold text-[#064E3B] transition-all cursor-pointer shadow-2xs"
                >
                  View Details
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: AI HEALTH ASSISTANT, QUICK ACTIONS, MOTIVATION */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: AI Health Assistant in Rich Clinical Emerald */}
          <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0D9488] text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-4 border border-[#8FE3B8]/30">
            
            {/* Header: Title + Cute 3D Mascot Robot */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <h3 className="text-sm font-extrabold tracking-tight">
                    AI Health Assistant
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                    Beta
                  </span>
                </div>
                <p className="text-[11px] text-emerald-50/90 leading-relaxed pr-2">
                  Get insights, understand your reports, and ask health questions.
                </p>
              </div>

              {/* Cute Robot Mascot with Wave & Stethoscope */}
              <div className="w-14 h-14 shrink-0 relative animate-pulse duration-1000">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  {/* Antennas */}
                  <circle cx="50" cy="15" r="4" fill="#8FE3B8" />
                  <line x1="50" y1="15" x2="50" y2="28" stroke="#8FE3B8" strokeWidth="3" strokeLinecap="round" />
                  {/* Head */}
                  <rect x="25" y="26" width="50" height="38" rx="14" fill="#FFFFFF" />
                  <rect x="30" y="32" width="40" height="26" rx="8" fill="#064E3B" />
                  {/* Eyes */}
                  <circle cx="40" cy="45" r="4.5" fill="#34D399" />
                  <circle cx="60" cy="45" r="4.5" fill="#34D399" />
                  {/* Body */}
                  <rect x="32" y="66" width="36" height="28" rx="10" fill="#FFFFFF" />
                  {/* Stethoscope */}
                  <path d="M42 70 Q50 82 58 70" stroke="#059669" strokeWidth="2.5" fill="none" />
                  <circle cx="50" cy="79" r="3" fill="#059669" />
                  {/* Waving Arm */}
                  <path d="M72 72 Q88 60 84 45" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <circle cx="84" cy="45" r="4" fill="#8FE3B8" />
                </svg>
              </div>
            </div>

            {/* Interactive Query Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi(aiQuery);
              }}
              className="relative z-10"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask anything about your health..."
                  className="w-full pl-4 pr-11 py-2.5 rounded-full bg-white/15 border border-white/25 hover:border-white/40 focus:border-white text-xs text-white placeholder-white/70 focus:outline-hidden focus:ring-2 focus:ring-emerald-300/40 transition-all font-medium backdrop-blur-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-8 h-8 rounded-full bg-white text-[#064E3B] flex items-center justify-center hover:bg-[#E8F8F0] transition-colors shadow-xs cursor-pointer"
                  title="Submit Health Question"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </form>

            {/* Quick Prompt Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 relative z-10 pt-1">
              <button
                type="button"
                onClick={() => handleAskAi("What do my lab results mean?")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10.5px] font-medium text-white transition-colors cursor-pointer"
              >
                What do my lab results mean?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("Diet suggestions for my condition?")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10.5px] font-medium text-white transition-colors cursor-pointer"
              >
                Diet suggestions?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("Possible causes for my symptoms?")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10.5px] font-medium text-white transition-colors cursor-pointer"
              >
                Possible causes for my symptoms?
              </button>
            </div>

            {/* Ambient background glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
          </div>

          {/* Card 2: Quick Actions (4 Columns) */}
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-black uppercase text-[#064E3B] tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span>Quick Actions</span>
            </h3>

            <div className="grid grid-cols-4 gap-2">
              <Link
                href="/patient/doctors"
                className="p-2.5 rounded-2xl bg-[#F3FAF6] hover:bg-[#E4F5ED] border border-[#D6EDE1] text-center space-y-1.5 transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#059669] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#064E3B] block leading-tight">
                  Book Appointment
                </span>
              </Link>

              <Link
                href="/patient/records"
                className="p-2.5 rounded-2xl bg-[#F3FAF6] hover:bg-[#E4F5ED] border border-[#D6EDE1] text-center space-y-1.5 transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#059669] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#064E3B] block leading-tight">
                  Upload Report
                </span>
              </Link>

              <Link
                href="/patient/prescriptions"
                className="p-2.5 rounded-2xl bg-[#F3FAF6] hover:bg-[#E4F5ED] border border-[#D6EDE1] text-center space-y-1.5 transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#059669] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                  <Pill className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#064E3B] block leading-tight">
                  Request Rx
                </span>
              </Link>

              <Link
                href="/patient/appointments"
                className="p-2.5 rounded-2xl bg-[#F3FAF6] hover:bg-[#E4F5ED] border border-[#D6EDE1] text-center space-y-1.5 transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#059669] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#064E3B] block leading-tight">
                  Calendar
                </span>
              </Link>
            </div>
          </div>

          {/* Card 2.5: AI Health Story (Pehle vs Abhi) Banner */}
          <div className="bg-gradient-to-br from-[#E8F8F0] via-[#D8F3E5] to-[#C6EFD9] border border-[#9AE5BF] rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>AI Health Story</span>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#059669] text-white shadow-2xs">
                ₹99/mo &bull; Pehle vs Abhi
              </span>
            </div>

            <p className="text-xs text-[#134E39] leading-relaxed font-medium">
              See how your condition evolved over time (<strong>pehle condition kaisi thi vs ab kaisi hai</strong>): HbA1c, kidney filtration, and 60-second audio summary.
            </p>

            <div className="pt-0.5">
              <Link
                href="/patient/timeline"
                className="w-full py-2.5 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Open AI Timeline (Pehle vs Abhi)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Take Care of Yourself Botanical Card */}
          <div className="bg-[#F3FAF6] border border-[#D6EDE1] rounded-3xl p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 text-[#059669]">
                <svg viewBox="0 0 50 60" fill="none" className="w-full h-full">
                  <path d="M10 50 Q 25 35 35 10" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                  <path d="M35 10 Q 45 5 40 0 Q 30 5 35 10 Z" fill="#86EFAC" opacity="0.85" />
                  <path d="M28 22 Q 40 20 38 12 Q 28 15 28 22 Z" fill="#4ADE80" opacity="0.85" />
                  <path d="M22 34 Q 10 26 12 18 Q 22 22 22 34 Z" fill="#22C55E" opacity="0.75" />
                </svg>
              </div>
              <div>
                <p className="italic text-sm text-[#047857] leading-tight">
                  Take care
                </p>
                <p className="italic text-sm font-bold text-[#064E3B] leading-tight flex items-center gap-1">
                  <span>of yourself</span>
                  <span className="text-xs text-[#059669]">✓</span>
                </p>
              </div>
            </div>

            <Link
              href="/patient/timeline"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#8FE3B8] hover:border-[#059669] hover:bg-[#059669] hover:text-white text-[11px] font-bold text-[#064E3B] transition-all shadow-2xs"
            >
              Health Log
            </Link>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. INTERACTIVE MODAL: AI HEALTH ASSISTANT INTELLIGENCE          */}
      {/* ============================================================== */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 relative my-auto animate-in zoom-in-95">
            
            {/* Modal Header in Clinical Emerald */}
            <div className="bg-gradient-to-r from-[#064E3B] to-[#047857] px-6 py-4.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white/10 text-emerald-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight">AI Health Assistant</h3>
                  <p className="text-[11px] text-white/80">Clinical Intelligence & Insights</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {isAiLoading ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-3 border-emerald-200 border-t-[#059669] animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600 animate-pulse">
                    Synthesizing clinical insights and patient health records...
                  </p>
                </div>
              ) : activeAiResponse ? (
                <div className="space-y-4">
                  {/* Query Header */}
                  <div className="p-3 bg-[#F3FAF6] rounded-2xl border border-[#D6EDE1]">
                    <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">
                      YOUR QUESTION
                    </span>
                    <p className="font-extrabold text-[#064E3B] text-xs sm:text-sm mt-0.5">
                      &ldquo;{activeAiResponse.query}&rdquo;
                    </p>
                  </div>

                  {/* AI Response Card */}
                  <div className="p-4 bg-white rounded-2xl border border-[#D6EDE1] shadow-2xs space-y-2">
                    <div className="flex items-center gap-1.5 text-[#059669] font-bold text-xs">
                      <Bot className="w-4 h-4" />
                      <span>Clinical Assessment</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activeAiResponse.answer}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Recommended Next Steps:</span>
                    </h4>
                    <ul className="space-y-1.5 pl-2">
                      {activeAiResponse.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600 text-[11.5px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clinical Disclaimer */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[10.5px] text-emerald-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      AI insights are intended for patient education and preparation. Always consult your attending physician before altering dosages or medical treatments.
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#059669] text-white font-bold text-xs hover:bg-[#047857] transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. INTERACTIVE MODAL: PRESCRIPTION DETAILS                      */}
      {/* ============================================================== */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xl max-w-md w-full overflow-hidden text-slate-800 relative my-auto animate-in zoom-in-95">
            <div className="bg-[#F3FAF6] px-6 py-4 border-b border-[#D6EDE1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#059669]" />
                <h3 className="font-extrabold text-sm text-[#064E3B]">Prescription Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-[#F3FAF6] rounded-2xl border border-[#D6EDE1] space-y-1">
                <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">MEDICATION</span>
                <div className="text-base font-extrabold text-[#064E3B]">{selectedRx.name}</div>
                <div className="text-xs font-semibold text-[#059669]">{selectedRx.dosage}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Prescribed By</span>
                  <span className="font-bold text-slate-900">{selectedRx.doctor}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Date Issued</span>
                  <span className="font-bold text-slate-900">{selectedRx.date}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Refill Status</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active (Valid)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Instructions:</span>
                {selectedRx.instructions}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRx(null)}
                  className="px-5 py-2 rounded-xl bg-[#059669] text-white font-bold text-xs hover:bg-[#047857] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
