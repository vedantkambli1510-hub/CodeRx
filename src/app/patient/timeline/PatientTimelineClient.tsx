"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Crown,
  Lock,
  GitCompare,
  ArrowRight,
  Heart,
  Activity,
  Layers,
  Calendar,
} from "lucide-react";
import { PatientCompareClient } from "../compare/PatientCompareClient";
import { TimelineTab } from "@/components/workspace/TimelineTab";
import { useSubscription } from "@/lib/subscription";

interface PatientTimelineClientProps {
  timelines: any[];
  comparison: any;
  defaultTab?: "ai" | "history";
}

export function PatientTimelineClient({
  timelines,
  comparison,
  defaultTab = "ai",
}: PatientTimelineClientProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "history">(defaultTab);
  const { isSubscribed, plan, isLoaded, updateSubscription } = useSubscription();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200 text-[#4C0519]">
      
      {/* 1. TOP HEADER WITH TITLE & 3-WAY DEMO TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#FCE7F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-pink-100 text-[#E11D48] border border-pink-200">
              {isSubscribed ? (plan === "FAMILY" ? "👑 FAMILY PASS ACTIVE" : plan === "PREMIUM" ? "✨ COMPLETE CARE ACTIVE" : "⚡ BASIC PASS ACTIVE") : "🔒 ₹99/MO CARE FEATURE"}
            </span>
            <span className="text-xs text-[#881337] font-bold">
              Longitudinal Clinical Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#4C0519] tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#E11D48]" />
            <span>Health Journal &amp; AI Timeline</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#881337] mt-1 leading-relaxed font-medium">
            See how your body condition evolved over time (<strong>pehle condition kaisi thi vs ab kaisi hai</strong>) &amp; chronological clinical events.
          </p>
        </div>

        {/* 3-WAY DEMO SWITCHER */}
        <div className="flex items-center gap-2 bg-white border border-[#FCE7F0] p-1.5 rounded-2xl shadow-2xs self-start md:self-auto">
          <span className="text-[11px] font-bold text-[#881337] px-2">Demo:</span>
          <button
            type="button"
            onClick={() => updateSubscription(false)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isSubscribed
                ? "bg-[#E11D48] text-white shadow-xs font-black"
                : "text-[#881337] hover:bg-pink-100"
            }`}
            title="Simulate unsubscribed locked state"
          >
            🔒 Lock
          </button>
          <button
            type="button"
            onClick={() => updateSubscription(true, "INDIVIDUAL")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSubscribed && plan === "INDIVIDUAL"
                ? "bg-[#E11D48] text-white shadow-xs font-black"
                : "text-[#881337] hover:bg-pink-100"
            }`}
            title="Simulate Solo Pass (₹99) - Unlocks AI Before vs Now Timeline"
          >
            ⚡ Basic (₹99)
          </button>
          <button
            type="button"
            onClick={() => updateSubscription(true, "FAMILY")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSubscribed && plan === "FAMILY"
                ? "bg-[#E11D48] text-white shadow-xs font-black"
                : "text-[#881337] hover:bg-pink-100"
            }`}
            title="Simulate Family Pass (₹199) - Unlocks all family timelines"
          >
            👑 Family (₹199)
          </button>
        </div>
      </div>

      {/* 2. DUAL TAB SELECTOR (AI HEALTH STORY vs CHRONOLOGICAL LOG) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#FCE7F0] shadow-xs">
        <div className="flex items-center gap-2">
          {/* TAB 1: AI HEALTH STORY (BEFORE VS NOW) */}
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-[#FFF5F8] via-[#FFE4ED] to-[#FCE7F0] text-[#E11D48] border border-[#FDA4AF] shadow-2xs"
                : "text-[#881337] hover:bg-[#FFF5F8] hover:text-[#4C0519]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E11D48]" />
            <span>AI Health Story: Pehle vs Abhi</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isSubscribed
                  ? "bg-emerald-600 text-white"
                  : "bg-[#E11D48] text-white"
              }`}
            >
              {isSubscribed ? "ACTIVE" : "₹99/MO"}
            </span>
          </button>

          {/* TAB 2: CHRONOLOGICAL EVENT LOG */}
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-gradient-to-r from-[#FFF5F8] via-[#FFE4ED] to-[#FCE7F0] text-[#E11D48] border border-[#FDA4AF] shadow-2xs"
                : "text-[#881337] hover:bg-[#FFF5F8] hover:text-[#4C0519]"
            }`}
          >
            <Clock className="w-4 h-4 text-[#E11D48]" />
            <span>Complete Event Log</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#881337]">
              {timelines.length} Records
            </span>
          </button>
        </div>

        {/* Quick Link to Subscription Packages */}
        <Link
          href="/patient/subscription"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF5F8] hover:bg-[#FFE4ED] text-[#E11D48] text-xs font-black border border-[#FDA4AF] transition-all cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>{isSubscribed ? "Manage Plan & Perks" : "View Packages (from ₹99/mo) →"}</span>
        </Link>
      </div>

      {/* 3. ACTIVE TAB CONTENT */}
      {activeTab === "ai" ? (
        <div className="space-y-4">
          <PatientCompareClient comparison={comparison} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#FCE7F0] shadow-xs p-6">
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-[#4C0519] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E11D48]" />
                <span>Chronological Medical Journal</span>
              </h2>
              <p className="text-xs text-[#881337] mt-0.5 font-medium">
                Every logged doctor consultation, prescription modification, and diagnostic scan report.
              </p>
            </div>
            <TimelineTab timelines={timelines} />
          </div>
        </div>
      )}

    </div>
  );
}
