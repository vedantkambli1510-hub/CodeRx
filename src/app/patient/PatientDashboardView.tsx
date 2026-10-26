"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Pill,
  Calendar,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Stethoscope,
  Activity,
  FileCheck,
  Download,
  Send,
  Loader2,
  Check,
  User,
  Droplet,
  MapPin,
  Upload,
  CalendarPlus,
  FilePlus,
  FlaskConical,
  Crown,
  Navigation,
  Bot,
  Camera,
  Clock,
} from "lucide-react";
import { usePatientAvatar } from "@/lib/avatar";
import { useSubscription } from "@/lib/subscription";
import { calculateAge } from "@/lib/date";
import { CuteAppointmentCalendar } from "@/components/patient/CuteAppointmentCalendar";

interface PatientDashboardViewProps {
  user: any;
  patient: any;
  appointments?: any[];
  records?: any[];
  timelines?: any[];
  medicines?: any[];
  prescriptions?: any[];
  initialChecklist?: any[];
}

export function PatientDashboardView({
  user,
  patient,
  appointments = [],
  records = [],
  timelines = [],
  medicines = [],
  prescriptions = [],
  initialChecklist = [],
}: PatientDashboardViewProps) {
  const patientName = user?.name || "Rajesh Sharma";
  const { avatarUrl, setAvatar } = usePatientAvatar();
  const { isSubscribed } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Patient DOB & Age calculation with real-time sync
  const [patientDob, setPatientDob] = useState<string | null>(patient?.dob || null);

  useEffect(() => {
    // Check localStorage if updated in profile settings
    if (typeof window !== "undefined") {
      const savedDob = localStorage.getItem("coderx_patient_dob");
      if (savedDob) {
        setPatientDob(savedDob);
      } else if (patient?.dob) {
        setPatientDob(patient.dob);
      }
    }

    const onProfileUpdate = (e: any) => {
      if (e.detail?.dob) {
        setPatientDob(e.detail.dob);
      }
    };
    window.addEventListener("coderx_profile_updated", onProfileUpdate);
    return () => window.removeEventListener("coderx_profile_updated", onProfileUpdate);
  }, [patient?.dob]);

  const computedAge = calculateAge(patientDob);
  const displayAge = computedAge !== null ? `Age: ${computedAge}` : "Age: --";

  // Filter state for records (All, Reports, Prescriptions)
  const [recordFilter, setRecordFilter] = useState<"All" | "Reports" | "Prescriptions">("All");

  // Reminders state
  const [reminders, setReminders] = useState([
    {
      id: "rem-1",
      title: "Take Metformin 500mg",
      time: "Tonight • 8:00 PM (After dinner)",
      done: false,
    },
    {
      id: "rem-2",
      title: "Upload follow-up blood report",
      time: "Due before 24 Oct 2026",
      done: false,
    },
  ]);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  // AI Modal & Question State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<{
    query: string;
    answer: string;
    actionablePoints: string[];
  } | null>(null);

  // Report Modal Preview State
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerAi = (questionText: string) => {
    if (!questionText.trim()) return;
    setShowAiModal(true);
    setAiLoading(true);

    setTimeout(() => {
      setAiResponse({
        query: questionText,
        answer: `Clinical AI Insight for "${questionText}": All markers across your blood report and current Metformin 500mg routine are within expected therapeutic limits. Your vitals remain stable.`,
        actionablePoints: [
          "Continue daily Metformin 500mg with evening meals.",
          "Keep drinking 2.5L clean water daily for kidney hydration.",
          "Dr. Meera Nair will review your progress on 24 Oct 2026.",
        ],
      });
      setAiLoading(false);
      setAiQuestion("");
    }, 300);
  };

  // Consolidated non-redundant medical records list
  const allRecords = [
    {
      id: "rec-1",
      type: "Reports",
      title: "Blood Test (CBC)",
      details: "Complete Blood Count • Hemoglobin 14.2 g/dL",
      date: "12 Oct 2026",
      status: "Improved",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: FileText,
      iconBg: "bg-emerald-50 text-emerald-600",
      link: "/patient/records",
    },
    {
      id: "rec-2",
      type: "Prescriptions",
      title: "Metformin 500mg",
      details: "1 tab twice daily with meals (Ongoing)",
      date: "05 Oct 2026",
      status: "Active",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Pill,
      iconBg: "bg-blue-50 text-blue-600",
      link: "/patient/prescriptions",
    },
    {
      id: "rec-3",
      type: "Reports",
      title: "Chest X-Ray",
      details: "Normal bronchovascular markings • Routine review",
      date: "28 Aug 2026",
      status: "Normal",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      icon: FileCheck,
      iconBg: "bg-slate-50 text-slate-600",
      link: "/patient/records",
    },
    {
      id: "rec-4",
      type: "Prescriptions",
      title: "Atorvastatin 10mg",
      details: "1 tab at bedtime (Cholesterol control)",
      date: "15 Aug 2026",
      status: "Active",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Pill,
      iconBg: "bg-blue-50 text-blue-600",
      link: "/patient/prescriptions",
    },
    {
      id: "rec-5",
      type: "Reports",
      title: "MRI Brain",
      details: "Follow-up scan • High stability noted",
      date: "02 Jul 2026",
      status: "Improved",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Activity,
      iconBg: "bg-emerald-50 text-emerald-600",
      link: "/patient/records",
    },
  ];

  const filteredRecords = recordFilter === "All"
    ? allRecords
    : allRecords.filter((r) => r.type === recordFilter);

  return (
    <div className="space-y-4 max-w-6xl mx-auto font-sans text-slate-800 pb-10">
      
      {/* Hidden File Input for Patient Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        aria-label="Upload profile photo"
      />

      {/* ============================================================== */}
      {/* 1. CLEAN, CALM HERO: Photo + Name + Primary Action             */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#D7F3E5] via-[#E8F8EE] to-[#CFEFE0] border border-[#BDE8D1] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Avatar + Patient Meta */}
          <div className="flex items-center gap-3.5">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={patientName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                title="Click to upload profile photo"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>Upload</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs border border-white cursor-pointer group-hover:scale-110 transition-transform"
                title="Change Photo"
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#064E3B]/80">Good Morning,</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#059669] text-white text-[10px] font-bold">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Verified Patient</span>
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-bold text-[#064E3B] tracking-tight leading-snug">
                {patientName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-semibold text-[#064E3B]">
                <span className="px-2 py-0.5 rounded-md bg-white/80 border border-[#BDE8D1]">
                  {displayAge}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/80 border border-[#BDE8D1] flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>{patient?.bloodGroup || "O+"}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/80 border border-[#BDE8D1]">
                  {patient?.city || "Mumbai"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Primary Actions in Hero */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              href="/patient/records?action=upload"
              className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Report</span>
            </Link>
            <Link
              href="/patient/profile"
              className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#064E3B] border border-[#BDE8D1] text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <span>Profile Settings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TODAY'S ESSENTIALS: Upcoming Visit + Today's Pills (2 Cards) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Card 1: Cute Visits & Appointments Calendar */}
        <CuteAppointmentCalendar appointments={appointments} />

        {/* Card 2: Today's Tasks & Medication Reminders */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Today&apos;s Checklist
                </span>
                <h3 className="text-sm font-bold text-slate-900">2 Pending Items</h3>
              </div>
            </div>

            <Link href="/patient/prescriptions" className="text-[11px] font-bold text-emerald-700 hover:underline">
              Prescriptions &rarr;
            </Link>
          </div>

          <div className="space-y-1.5">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                onClick={() => toggleReminder(rem.id)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      rem.done ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                    }`}
                  >
                    {rem.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${rem.done ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {rem.title}
                    </div>
                    <div className="text-[10px] text-slate-500">{rem.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. RECENT MEDICAL RECORDS (Unified & Non-Redundant)            */}
      {/* ============================================================== */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
        
        {/* Header + Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Medical Records</h2>
            <p className="text-xs text-slate-500">Your latest lab findings and ongoing medications in one place.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              {(["All", "Reports", "Prescriptions"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRecordFilter(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    recordFilter === tab
                      ? "bg-[#064E3B] text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Link
              href="/patient/records"
              className="text-xs font-bold text-emerald-700 hover:underline hidden sm:inline"
            >
              All Records &rarr;
            </Link>
          </div>
        </div>

        {/* Clean, Non-Duplicated Records List */}
        <div className="divide-y divide-slate-100">
          {filteredRecords.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === "Reports") {
                    setSelectedReport({
                      title: item.title,
                      date: item.date,
                      status: item.status,
                      summary: `Verified clinical result. Metrics confirm stable progress consistent with your treatment plan.`,
                    });
                  }
                }}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {item.details}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    {item.date}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <Link
                    href={item.link}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. ESSENTIAL SERVICES (Compact Bottom Row: Labs, Care Pass, AI) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Diagnostic Labs Near Me */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-900">Diagnostic Labs Near Me</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              NABL
            </span>
          </div>

          <div className="text-[11px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Dr Lal PathLabs (Bandra)</span>
              <strong className="text-emerald-700 font-semibold">1.2 km</strong>
            </div>
            <div className="flex justify-between">
              <span>Metropolis Healthcare</span>
              <strong className="text-emerald-700 font-semibold">2.4 km</strong>
            </div>
          </div>

          <Link href="/patient/labs" className="text-xs font-bold text-emerald-700 hover:underline pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Explore Certified Labs</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* CodeRx Care Pass ₹149/mo */}
        <div className="bg-gradient-to-r from-[#063826] to-[#09573B] text-white rounded-xl p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              <Crown className="w-3 h-3 text-amber-300" />
              <span>Care Pass ₹149/mo</span>
            </div>
            <span
              className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                isSubscribed
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                  : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
              }`}
            >
              {isSubscribed ? "Active" : "Locked"}
            </span>
          </div>

          <p className="text-[11px] text-emerald-100/90 leading-tight">
            {isSubscribed
              ? "Longitudinal AI Health Timeline and 3D biomarker trajectory analysis unlocked."
              : "Unlock AI Longitudinal Timeline, 3D biomarker shifts & organ health story."}
          </p>

          <Link
            href={isSubscribed ? "/patient/timeline" : "/patient/subscription"}
            prefetch={true}
            className="text-xs font-bold text-emerald-300 hover:text-white flex items-center justify-between pt-1 border-t border-emerald-800/80 cursor-pointer"
          >
            <span>{isSubscribed ? "Open AI Timeline" : "Unlock for ₹149"}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* CodeRx Clinical AI Ask */}
        <div className="bg-[#0A3828] text-white rounded-xl p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold text-white">Ask CodeRx AI</span>
            </div>
            <span className="text-[9.5px] text-emerald-300 bg-emerald-400/20 px-1.5 py-0.5 rounded">Clinical</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTriggerAi(aiQuestion);
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask about reports or pills..."
              className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white/15 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!aiQuestion.trim()}
              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0"
              title="Send"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-emerald-200/80 pt-1 border-t border-emerald-800/80">
            <button
              type="button"
              onClick={() => handleTriggerAi("What does my latest report mean?")}
              className="hover:text-white cursor-pointer truncate"
            >
              &bull; Explain latest report
            </button>
            <button
              type="button"
              onClick={() => handleTriggerAi("Is my medicine dosage correct?")}
              className="hover:text-white cursor-pointer truncate"
            >
              &bull; Check medicine dose
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: AI Assistant Response Modal                           */}
      {/* ============================================================== */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">CodeRx Clinical AI</h3>
                  <p className="text-[10px] text-slate-500">Clinical Observations</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setAiResponse(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {aiLoading ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <p className="text-xs font-semibold">Reviewing health records...</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs font-bold text-emerald-900">
                    &ldquo;{aiResponse.query}&rdquo;
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {aiResponse.answer}
                    </p>

                    {aiResponse.actionablePoints.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                          Key Clinical Takeaways:
                        </span>
                        <ul className="space-y-1">
                          {aiResponse.actionablePoints.map((pt, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 font-normal">
                              <span className="text-emerald-500">&bull;</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: Report Findings Modal                                 */}
      {/* ============================================================== */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{selectedReport.title}</h3>
                  <p className="text-[10px] text-slate-500">Date: {selectedReport.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
                    Diagnostic Status
                  </span>
                  <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {selectedReport.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {selectedReport.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/patient/records"
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors"
                >
                  View in My Reports
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    alert("Report PDF downloaded to your device.");
                    setSelectedReport(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
