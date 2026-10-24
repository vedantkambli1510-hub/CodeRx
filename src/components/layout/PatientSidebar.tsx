"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Pill,
  FileText,
  FlaskConical,
  MessageSquare,
  Sparkles,
  GitCompare,
  Users,
  Crown,
  User,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useSubscription } from "@/lib/subscription";

interface PatientSidebarProps {
  patientName?: string;
  patientEmail?: string;
}

export function PatientSidebar({
  patientName = "Aarav Mehta",
  patientEmail,
}: PatientSidebarProps) {
  const pathname = usePathname();
  const { isSubscribed, plan } = useSubscription();

  const isFamilyActive = isSubscribed && plan === "FAMILY";
  const isSoloActive = isSubscribed && plan === "INDIVIDUAL";

  const navSections = [
    {
      group: "CLINICAL CARE",
      items: [
        {
          label: "Home",
          href: "/patient",
          icon: Home,
          exact: true,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Appointments",
          href: "/patient/appointments",
          icon: Calendar,
          exact: false,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Prescriptions",
          href: "/patient/prescriptions",
          icon: Pill,
          exact: false,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Medical Records",
          href: "/patient/records",
          icon: FileText,
          exact: false,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Lab Reports",
          href: "/patient/records?type=lab",
          icon: FlaskConical,
          exact: false,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Messages",
          href: "/patient/notifications",
          icon: MessageSquare,
          exact: false,
          badge: "2",
          badgeColor: "bg-[#059669] text-white",
        },
      ],
    },
    {
      group: "PREMIUM & FAMILY",
      items: [
        {
          label: "AI Health Story (Timeline & Progress)",
          href: "/patient/timeline",
          icon: Sparkles,
          exact: false,
          badge: isSubscribed ? "AI PASS" : "₹99/mo",
          badgeColor: isSubscribed
            ? "bg-[#0D9488] text-white"
            : "bg-[#059669] text-white",
        },
        {
          label: "Family Health Portal",
          href: "/patient/family",
          icon: Users,
          exact: false,
          badge: isFamilyActive ? "FAMILY PASS" : isSoloActive ? "UPGRADE" : "👑 ₹199",
          badgeColor: isFamilyActive
            ? "bg-[#10B981] text-white"
            : isSoloActive
            ? "bg-[#0D9488] text-white"
            : "bg-[#059669] text-white",
        },
      ],
    },
    {
      group: "PLANS & CARE",
      items: [
        {
          label: "Subscription & Plans",
          href: "/patient/subscription",
          icon: Crown,
          exact: false,
          badge: isSubscribed ? (isFamilyActive ? "₹199/mo" : "₹99/mo") : "₹99/mo",
          badgeColor: "bg-[#059669] text-white font-black",
        },
        {
          label: "Book a Consultation",
          href: "/patient/appointments/book",
          icon: Calendar,
          exact: false,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Find a Doctor",
          href: "/patient/doctors",
          icon: User,
          exact: false,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        {
          label: "Profile",
          href: "/patient/profile",
          icon: User,
          exact: false,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Settings",
          href: "/patient/settings",
          icon: Settings,
          exact: false,
          badge: null,
          badgeColor: "",
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#F3FAF6] border-r border-[#D6EDE1] flex flex-col justify-between select-none h-screen text-slate-800 font-['Quicksand',sans-serif] shadow-xs">
      
      {/* Top Branding Section */}
      <div className="flex-1 flex flex-col min-h-0">
        
        <div className="p-5 pb-3 flex items-center gap-3 shrink-0">
          <Link href="/patient" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D1F2E2] to-[#B8ECD3] border border-[#86DFB4] flex items-center justify-center text-[#059669] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#059669"
                  opacity="0.22"
                />
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#047857"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12h2.5l1.5-3 2 6 1.5-3h2.5"
                  stroke="#047857"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <div className="font-extrabold text-xl tracking-tight text-[#064E3B] font-['Quicksand',sans-serif]">
                Code<span className="text-[#059669]">Rx</span>
              </div>
              <div className="text-[10px] font-semibold text-[#047857]/80 tracking-wide">
                Your Health. Our Priority.
              </div>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.group} className="space-y-1">
              
              {/* Group Header */}
              <div className="px-3 py-1 text-[9.5px] font-black tracking-wider text-[#047857]/70 uppercase">
                {section.group}
              </div>

              {/* Group Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/patient");

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs transition-all font-semibold group ${
                        isActive
                          ? "bg-gradient-to-r from-[#D4F4E4] to-[#BEEBD3] text-[#064E3B] font-extrabold shadow-2xs border border-[#8AE2B5]"
                          : "text-[#134E39]/85 hover:text-[#064E3B] hover:bg-[#E4F5ED]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 transition-colors shrink-0 ${
                            isActive ? "text-[#059669]" : "text-[#34D399] group-hover:text-[#059669]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[9.5px] rounded-full font-black shrink-0 shadow-2xs ${
                            item.badgeColor || "bg-[#059669] text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* DEDICATED PACKAGES / PLANS COLUMN BOX IN SIDEBAR */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#E8F8F0] via-[#D8F3E5] to-[#C6EFD9] border border-[#9AE5BF] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#064E3B] flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#059669]" />
                <span>{isSubscribed ? (isFamilyActive ? "Family Pass" : "Solo AI Pass") : "Care Packages"}</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#059669] text-white shadow-2xs">
                {isSubscribed ? (isFamilyActive ? "₹199/mo" : "₹99/mo") : "₹99/mo"}
              </span>
            </div>
            
            <p className="text-[10.5px] text-[#134E39] leading-tight mb-2 font-medium">
              {isSubscribed
                ? "AI Timeline 'Pehle vs Abhi' & condition evolution active."
                : "Unlock 'Before vs Now' AI Timeline & Family Vault."}
            </p>

            <Link
              href="/patient/subscription"
              className="w-full py-1.5 px-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
            >
              <span>{isSubscribed ? "Manage Subscription" : "Explore ₹99 Packages →"}</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Botanical Illustration & Handwritten Motivation */}
      <div className="p-4 pt-3 border-t border-[#D6EDE1] relative select-none shrink-0 bg-[#F3FAF6]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-14 shrink-0 opacity-85 text-[#059669]">
            <svg viewBox="0 0 50 70" fill="none" className="w-full h-full">
              <path
                d="M10 65 Q 25 45 35 15"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M35 15 Q 45 8 40 2 Q 30 8 35 15 Z"
                fill="#A7F3D0"
                opacity="0.85"
              />
              <path
                d="M28 28 Q 40 25 38 18 Q 28 20 28 28 Z"
                fill="#6EE7B7"
                opacity="0.85"
              />
              <path
                d="M23 40 Q 10 32 12 25 Q 22 28 23 40 Z"
                fill="#34D399"
                opacity="0.75"
              />
              <path
                d="M17 52 Q 30 48 28 40 Q 18 42 17 52 Z"
                fill="#10B981"
                opacity="0.8"
              />
              <path
                d="M12 60 Q 3 55 4 48 Q 12 50 12 60 Z"
                fill="#059669"
                opacity="0.7"
              />
            </svg>
          </div>

          <div className="space-y-0.5 pt-0.5">
            <p className="font-['Caveat',cursive] text-sm leading-snug text-[#134E39]">
              Small steps.
            </p>
            <p className="font-['Caveat',cursive] text-sm leading-snug text-[#134E39]">
              Better health.
            </p>
            <p className="font-['Caveat',cursive] text-sm font-bold leading-snug text-[#059669]">
              Always.
            </p>
            <div className="flex items-center gap-1.5 text-[#059669] pt-0.5 text-xs">
              <span>♡</span>
              <span>✓</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
