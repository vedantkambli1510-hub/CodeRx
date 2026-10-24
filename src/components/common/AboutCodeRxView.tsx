"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Video,
  FileText,
  FolderHeart,
  Clock,
  Target,
  Sparkles,
  Heart,
  ArrowLeft,
  X,
  GraduationCap,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { CodeRxLogo } from "./CodeRxLogo";
import { CodeRxMascot } from "./CodeRxMascot";

interface AboutCodeRxViewProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AboutCodeRxView({ onClose, isModal = false }: AboutCodeRxViewProps) {
  const founders = [
    {
      name: "Vedant Kambli",
      degree: "Student of BPharm MBA • 3rd Year",
      image: "/images/team/vedant-kambli.jpg",
      accentColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "border-emerald-500/30 hover:border-emerald-400",
      ringColor: "ring-emerald-400/50 border-emerald-500",
    },
    {
      name: "Krish Doshi",
      degree: "Student of BPharm MBA • 3rd Year",
      image: "/images/team/krish-doshi.jpg",
      accentColor: "from-blue-500/20 via-sky-500/10 to-transparent",
      borderColor: "border-blue-500/30 hover:border-blue-400",
      ringColor: "ring-blue-400/50 border-blue-500",
    },
    {
      name: "Setu Kumar",
      degree: "Student of BPharm MBA • 3rd Year",
      image: "/images/team/setu-kumar.jpg",
      accentColor: "from-indigo-500/20 via-purple-500/10 to-transparent",
      borderColor: "border-indigo-500/30 hover:border-indigo-400",
      ringColor: "ring-indigo-400/50 border-indigo-500",
    },
  ];

  const pillars = [
    {
      title: "Appointments",
      sub: "Auto-Scheduled & 1-Day Prior Calls",
      desc: "Smart slot allocation with automated reminder calls to reduce no-shows.",
      icon: Calendar,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Online Consultations",
      sub: "Encrypted HD Tele-Health",
      desc: "Live video appointments backed by the patient's full medical history HUD.",
      icon: Video,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Digital Prescriptions",
      sub: "Structured Regimens",
      desc: "Direct e-prescriptions with automatic drug-drug interaction warning checks.",
      icon: FileText,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Medical Records",
      sub: "Longitudinal Timeline",
      desc: "AI report parser converting paper & PDFs into one interactive lifetime record.",
      icon: FolderHeart,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Proactive Follow-ups",
      sub: "Zero Dropped Care",
      desc: "Automated metabolic follow-up triggers for chronic and acute patient care.",
      icon: Clock,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div
      className={`w-full max-w-6xl mx-auto rounded-[36px] bg-[#0A131C]/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.85)] relative font-sans text-slate-100 select-none ${
        isModal ? "p-6 sm:p-10 max-h-[88vh] overflow-y-auto" : "p-6 sm:p-12 my-6"
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none -z-0" />

      {/* Back button if standalone page */}
      {!isModal && (
        <div className="mb-6 relative z-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white shadow-xs transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>
      )}

      <div className="relative z-10 space-y-8">
        
        {/* ============================================================ */}
        {/* TOP BRAND BAR & BENTO CONTROLS                               */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
          
          <div className="flex items-center gap-3">
            <CodeRxLogo size="lg" showTagline={true} inverted={true} />
            <div className="hidden md:block h-10 w-px bg-white/10" />
            <div className="hidden md:block text-left">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Founder Portfolio
              </span>
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                <span>Healthcare made simple</span>
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              </span>
            </div>
          </div>

          {/* Close button if in modal */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md shrink-0"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

        </div>

        {/* ============================================================ */}
        {/* APPLE / LINEAR STYLE BENTO GRID                              */}
        {/* ============================================================ */}
        <div className="space-y-6">
          
          {/* ---------------------------------------------------------- */}
          {/* ROW 1: HERO MANIFESTO (WIDE BENTO TILE)                    */}
          {/* ---------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-teal-500/[0.05] border border-white/10 backdrop-blur-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>The Vision Behind CodeRx</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-tight leading-tight">
                  Reimagining Clinical Care at the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-300 italic">
                    Intersection of Pharmacy &amp; Software.
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Founded by 3rd-year BPharm MBA innovators, CodeRx eliminates medical record fragmentation. We connect patients, clinic staff, and physicians into a synchronized, AI-assisted health narrative.
                </p>
              </div>

              {/* Quick High-Impact Metrics Bento Pill */}
              <div className="shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center min-w-[130px]">
                  <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">3</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Founders</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center min-w-[130px]">
                  <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">100%</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Sync Care</div>
                </div>
              </div>

            </div>

            {/* ---------------------------------------------------------- */}
            {/* ROW 2: 3 FOUNDERS BENTO TILES                              */}
            {/* ---------------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-b ${founder.accentColor} border ${founder.borderColor} backdrop-blur-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col items-center justify-center text-center relative overflow-hidden`}
                >
                  {/* Photo with Glowing Halo */}
                  <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 my-3">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative bg-slate-900">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 140px, 160px"
                        priority
                      />
                    </div>
                    <div
                      className={`absolute inset-0 rounded-full border-4 pointer-events-none ring-4 ${founder.ringColor}`}
                    />
                  </div>

                  {/* Name & Degree */}
                  <div className="space-y-2.5 mt-2 w-full text-center">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-teal-300 transition-colors">
                      {founder.name}
                    </h3>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 shadow-sm">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                        <span>{founder.degree}</span>
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* ---------------------------------------------------------- */}
            {/* ROW 3: MOTIVE & MASCOT (SPLIT BENTO TILES)                 */}
            {/* ---------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Motive Manifesto Tile (8 cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight">
                        Our Motive: Unified Patient Story
                      </h3>
                      <p className="text-xs text-slate-400">
                        Bridging appointments, diagnostics, and patient safety
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 pt-3">
                    <p>
                      <strong className="text-white font-bold">CodeRx</strong> connects patients and healthcare professionals through one secure, unified platform for:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-semibold text-xs text-teal-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Appointments</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Tele-Consults</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Prescriptions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Medical Records</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Follow-up Reminders</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Biomarker Shifts</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-xs text-teal-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>
                    Our goal: Make healthcare <strong>accessible</strong>, <strong>organized</strong>, and <strong>convenient</strong> for every patient &amp; clinician.
                  </span>
                </div>
              </div>

              {/* Mascot Bento Tile (4 cols) */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-b from-teal-500/10 via-sky-500/10 to-indigo-500/10 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-3 right-3 text-xs font-bold text-teal-400 font-mono">
                  ♡ = Heal
                </div>
                <CodeRxMascot className="w-32 h-32 drop-shadow-[0_10px_20px_rgba(56,189,248,0.3)] animate-pulse" />
                <h4 className="text-base font-black text-white mt-3">
                  CodeRx Mascot
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-[200px]">
                  Dedicated to compassionate, error-free clinical healthcare.
                </p>
              </div>

            </div>

            {/* ---------------------------------------------------------- */}
            {/* ROW 4: 5 HEALTH PILLARS BENTO TILES                        */}
            {/* ---------------------------------------------------------- */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {pillars.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-teal-400/50 shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-md border ${p.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                          {p.title}
                        </h4>
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          {p.sub}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-2 leading-snug">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* FOOTER BENTO STRIP                                         */}
            {/* ---------------------------------------------------------- */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>CodeRx Operating System &bull; Code &bull; Innovate &bull; Heal</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Together for a Healthier Tomorrow</span>
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
