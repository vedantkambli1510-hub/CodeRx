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
  isDemoAccount?: boolean;
}

export function PatientTimelineClient({
  timelines,
  comparison,
  defaultTab = "ai",
  isDemoAccount = false,
}: PatientTimelineClientProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "history">(defaultTab);
  const { isSubscribed, plan, isLoaded, updateSubscription } = useSubscription();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200 text-[#064E3B]">
      
      {/* 1. TOP HEADER WITH TITLE & CONDITIONAL DEMO TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D6EDE1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
              {isSubscribed ? "✨ CARE PASS ACTIVE" : "🔒 ₹149/MO CARE FEATURE"}
            </span>
            <span className="text-xs text-[#047857] font-bold">
              Longitudinal Clinical Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#059669]" />
            <span>Health Journal &amp; AI Timeline</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#047857] mt-1 leading-relaxed font-medium">
            See how your body condition evolved over time (<strong>pehle condition kaisi thi vs ab kaisi hai</strong>) &amp; chronological clinical events.
          </p>
        </div>

        {/* DEMO SWITCHER & CARE PASS BUTTON - ALWAYS VISIBLE FOR DEMO/TESTING */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-white border border-[#D6EDE1] p-1.5 rounded-2xl shadow-2xs">
            <span className="text-[11px] font-bold text-[#047857] px-2">Demo:</span>
            <button
              type="button"
              onClick={() => updateSubscription(false)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isSubscribed
                  ? "bg-[#059669] text-white shadow-xs font-black"
                  : "text-[#047857] hover:bg-[#E8F8F0]"
              }`}
              title="Simulate unsubscribed locked state"
            >
              🔒 Lock
            </button>
            <button
              type="button"
              onClick={() => updateSubscription(true, "FAMILY")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isSubscribed
                  ? "bg-[#059669] text-white shadow-xs font-black"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              }`}
              title="Simulate Care Pass (₹149) - Unlocks AI Before vs Now Timeline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Care Pass (₹149)</span>
            </button>
          </div>

          <Link
            href="/patient/subscription"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064E3B] text-xs font-bold border border-[#BCE8D0] shadow-2xs transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-[#059669]" />
            <span>Manage Plan &amp; Perks</span>
          </Link>
        </div>
      </div>

      {/* 2. DUAL TAB SELECTOR (AI HEALTH STORY vs CHRONOLOGICAL LOG) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#D6EDE1] shadow-xs">
        <div className="flex items-center gap-2">
          {/* TAB 1: AI HEALTH STORY (BEFORE VS NOW) */}
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-[#D7F4E5] to-[#BEEBD3] text-[#064E3B] border border-[#8FE3B8] shadow-2xs"
                : "text-[#134E39] hover:bg-[#E4F5ED] hover:text-[#064E3B]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span>AI Health Story: Pehle vs Abhi</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isSubscribed
                  ? "bg-emerald-600 text-white"
                  : "bg-[#059669] text-white"
              }`}
            >
              {isSubscribed ? "ACTIVE" : "₹149/MO"}
            </span>
          </button>

          {/* TAB 2: CHRONOLOGICAL EVENT LOG */}
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-gradient-to-r from-[#D7F4E5] to-[#BEEBD3] text-[#064E3B] border border-[#8FE3B8] shadow-2xs"
                : "text-[#134E39] hover:bg-[#E4F5ED] hover:text-[#064E3B]"
            }`}
          >
            <Clock className="w-4 h-4 text-[#059669]" />
            <span>Complete Event Log</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#064E3B]">
              {timelines.length} Records
            </span>
          </button>
        </div>

        {/* Quick Link to Subscription Packages */}
        <Link
          href="/patient/subscription"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F8F0] hover:bg-[#D4F4E4] text-[#064E3B] text-xs font-black border border-[#8FE3B8] transition-all cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5 text-[#059669]" />
          <span>{isSubscribed ? "Manage Plan & Perks" : "View Packages (from ₹149/mo) →"}</span>
        </Link>
      </div>

      {/* 3. ACTIVE TAB CONTENT */}
      {activeTab === "ai" ? (
        <div className="space-y-4">
          <PatientCompareClient
            comparison={comparison}
            isDemoAccount={isDemoAccount}
            hideHeaderBanner={true}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-xs p-6">
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#059669]" />
                <span>Chronological Medical Journal</span>
              </h2>
              <p className="text-xs text-[#047857] mt-0.5 font-medium">
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
