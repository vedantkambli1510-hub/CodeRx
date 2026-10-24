"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Pill,
  GitCompare,
  Calendar,
  Search,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  Users,
  Crown,
  Lock,
} from "lucide-react";
import { CodeRxLogo } from "@/components/common/CodeRxLogo";
import { useSubscription } from "@/lib/subscription";

interface PatientSidebarProps {
  patientName?: string;
  patientEmail?: string;
}

export function PatientSidebar({
  patientName = "Patient Account",
  patientEmail,
}: PatientSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isSubscribed, plan } = useSubscription();

  const isFamilyActive = isSubscribed && plan === "FAMILY";
  const isSoloActive = isSubscribed && plan === "INDIVIDUAL";

  const navSections = [
    {
      group: "HOME",
      items: [
        {
          label: "Dashboard",
          href: "/patient",
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      group: "MY HEALTH",
      items: [
        {
          label: "My Health Story",
          href: "/patient/compare",
          icon: GitCompare,
          badge: isSubscribed ? "AI PASS" : "LOCKED",
          badgeColor: isSubscribed
            ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold"
            : "bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono font-bold",
        },
        {
          label: "Family Health Portal",
          href: "/patient/family",
          icon: Users,
          badge: isFamilyActive ? "FAMILY PASS" : isSoloActive ? "UPGRADE" : "LOCKED",
          badgeColor: isFamilyActive
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
            : "bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono font-bold",
        },
        {
          label: "Medical Records",
          href: "/patient/records",
          icon: FileText,
          badge: null,
        },
        {
          label: "Medicines",
          href: "/patient/medicines",
          icon: Pill,
          badge: null,
        },
        {
          label: "Prescriptions",
          href: "/patient/prescriptions",
          icon: FileCheck2,
          badge: null,
        },
      ],
    },
    {
      group: "PLANS & PASSES",
      items: [
        {
          label: "Subscription & Perks",
          href: "/patient/subscription",
          icon: Crown,
          badge: isSubscribed ? (plan === "FAMILY" ? "FAMILY ACTIVE" : "SOLO ACTIVE") : "UPGRADE",
          badgeColor: isSubscribed
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold"
            : "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold",
        },
      ],
    },
    {
      group: "CARE",
      items: [
        {
          label: "Appointments",
          href: "/patient/appointments",
          icon: Calendar,
          badge: null,
        },
        {
          label: "Find a Doctor",
          href: "/patient/doctors",
          icon: Search,
          badge: null,
        },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        {
          label: "Notifications",
          href: "/patient/notifications",
          icon: Bell,
          badge: null,
        },
        {
          label: "Profile",
          href: "/patient/profile",
          icon: User,
          badge: null,
        },
        {
          label: "Settings",
          href: "/patient/settings",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#0B1519] border-r border-[#15252C] flex flex-col flex-shrink-0 min-h-screen text-slate-300 transition-all duration-300 select-none relative z-20 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#142329]/70 bg-[#0B1519]">
        <Link href="/patient" className="group overflow-hidden">
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden border border-slate-200">
              <img
                src="/images/coderx-logo.jpg"
                alt="CodeRx"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <CodeRxLogo size="sm" showTagline={true} inverted={true} />
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Patient Quick Badge */}
      {!collapsed && (
        <div className="p-3.5 mx-3 my-3 rounded-2xl bg-[#0F1B20]/90 border border-[#182C34]/80 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shrink-0">
              {patientName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{patientName}</p>
              <p className="text-[11px] text-teal-400 font-semibold truncate font-mono">
                {patientEmail || "patient@coderx.local"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isSubscribed ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-slate-300 font-medium">
                {isSubscribed ? (plan === "FAMILY" ? "Family Care Pass" : "Solo AI Pass (1 User)") : "Standard Account"}
              </span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono font-bold ${
                isSubscribed
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isSubscribed ? (plan === "FAMILY" ? "Family Active" : "Solo Active") : "Locked"}
            </span>
          </div>
        </div>
      )}

      {/* Grouped Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
                {section.group}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/patient" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center ${
                    collapsed ? "justify-center px-2" : "justify-between px-3"
                  } py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-[#0D8272]/20 text-[#00D2B4] font-bold border border-[#0D8272]/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#00D2B4]" : "text-slate-400 group-hover:text-teal-400"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        item.badgeColor || "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 absolute right-2 top-2" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User Action */}
      <div className="p-3 border-t border-[#142329]/70 bg-[#0B1519]">
        <Link
          href="/patient/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-xs text-slate-400 hover:text-white"
        >
          <div className="w-8 h-8 rounded-full bg-[#182C34] flex items-center justify-center font-bold text-white shrink-0">
            {patientName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-200 block truncate">{patientName}</span>
              <span className="text-[10px] text-teal-400 font-mono block">Patient Portal</span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
