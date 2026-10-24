"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import { CodeRxLogo } from "../common/CodeRxLogo";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/doctor") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Medical & AI Clinical Safety Disclaimer (Sections 31 & 32) */}
        <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-start gap-3 text-slate-300 leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold text-sky-300">Clinical Decision Support Notice: </span>
            CodeRx is an intelligent health record synthesis and longitudinal tracking system. All comparative analytics,
            differential alerts, and summaries are AI-assisted decision support tools designed for clinicians and patients.
            AI does NOT make definitive diagnoses, prescribe treatments, or replace independent clinical judgment. Verify all findings against original lab records.
            <div className="mt-1 text-slate-400 font-medium">
              🔒 Your medical information is accessible only to authorized users.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">CodeRx Healthcare OS</span>
            <span>— “Turn Medical Records Into One Clear Patient Story.”</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Desktop-First Clinical Suite
            </span>
            <span>v2.4.0 (Connected)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
