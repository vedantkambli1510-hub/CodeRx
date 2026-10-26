"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  FileText,
  Pill,
  Activity,
  Stethoscope,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
  FlaskConical,
  Sparkles,
  Heart,
} from "lucide-react";
import { useSubscription } from "@/lib/subscription";

interface PatientSidebarProps {
  patientName?: string;
  patientEmail?: string;
  initialUnreadCount?: number;
  initialRemindersCount?: number;
}

export function PatientSidebar({
  patientName = "Rajesh Sharma",
  patientEmail,
  initialUnreadCount = 0,
  initialRemindersCount = 0,
}: PatientSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const [unreadMessages, setUnreadMessages] = useState<number>(initialUnreadCount);
  const [unreadReminders, setUnreadReminders] = useState<number>(initialRemindersCount);
  const { isSubscribed } = useSubscription();

  // Sync state with current path and localStorage
  useEffect(() => {
    // If currently on notifications / messages page, clear message count
    if (pathname === "/patient/notifications") {
      setUnreadMessages(0);
      try {
        localStorage.setItem("coderx_messages_viewed", "true");
      } catch {}
    } else {
      try {
        const viewed = localStorage.getItem("coderx_messages_viewed");
        if (viewed === "true") {
          setUnreadMessages(0);
        } else {
          setUnreadMessages(initialUnreadCount);
        }
      } catch {}
    }

    // If currently viewing reminders or appointments, clear reminder count
    if (pathname === "/patient/appointments" && currentTab === "reminders") {
      setUnreadReminders(0);
      try {
        localStorage.setItem("coderx_reminders_viewed", "true");
      } catch {}
    } else {
      try {
        const viewedRem = localStorage.getItem("coderx_reminders_viewed");
        if (viewedRem === "true") {
          setUnreadReminders(0);
        }
      } catch {}
    }
  }, [pathname, currentTab, initialUnreadCount]);

  // Listen for real-time notification/reminder clearing events
  useEffect(() => {
    function handleNotificationsRead() {
      setUnreadMessages(0);
      try {
        localStorage.setItem("coderx_messages_viewed", "true");
      } catch {}
    }

    function handleRemindersRead() {
      setUnreadReminders(0);
      try {
        localStorage.setItem("coderx_reminders_viewed", "true");
      } catch {}
    }

    window.addEventListener("notifications-read", handleNotificationsRead);
    window.addEventListener("reminders-read", handleRemindersRead);
    return () => {
      window.removeEventListener("notifications-read", handleNotificationsRead);
      window.removeEventListener("reminders-read", handleRemindersRead);
    };
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/patient",
      icon: Home,
      exact: true,
      badge: null,
      badgeColor: null,
      onClick: undefined,
    },
    {
      label: "My Reports",
      href: "/patient/records",
      icon: FileText,
      exact: false,
      badge: null,
      badgeColor: null,
      onClick: undefined,
    },
    {
      label: "Medications",
      href: "/patient/prescriptions",
      icon: Pill,
      exact: false,
      badge: null,
      badgeColor: null,
      onClick: undefined,
    },
    // Only show Health Timeline once purchased!
    ...(isSubscribed
      ? [
          {
            label: "Health Timeline",
            href: "/patient/timeline",
            icon: Activity,
            exact: false,
            badge: "AI Active",
            badgeColor: "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30",
            onClick: undefined,
          },
        ]
      : []),
    {
      label: "Doctors Near Me",
      href: "/patient/doctors",
      icon: Stethoscope,
      exact: false,
      badge: null,
      badgeColor: null,
      onClick: undefined,
    },
    {
      label: "Appointments",
      href: "/patient/appointments",
      icon: Calendar,
      exact: false,
      isAppointmentsLink: true,
      badge: null,
      badgeColor: null,
      onClick: undefined,
    },
    {
      label: "Reminders",
      href: "/patient/appointments?tab=reminders",
      icon: Bell,
      exact: false,
      isRemindersLink: true,
      badge: unreadReminders > 0 ? String(unreadReminders) : null,
      badgeColor: "bg-emerald-500/30 text-emerald-100 border border-emerald-400/40",
      onClick: () => {
        setUnreadReminders(0);
        try {
          localStorage.setItem("coderx_reminders_viewed", "true");
        } catch {}
        window.dispatchEvent(new Event("reminders-read"));
      },
    },
    {
      label: "Messages",
      href: "/patient/notifications",
      icon: MessageSquare,
      exact: false,
      badge: unreadMessages > 0 ? String(unreadMessages) : null,
      badgeColor: "bg-emerald-500 text-white font-extrabold shadow-xs",
      onClick: () => {
        setUnreadMessages(0);
        try {
          localStorage.setItem("coderx_messages_viewed", "true");
        } catch {}
        window.dispatchEvent(new Event("notifications-read"));
      },
    },
    {
      label: "Diagnostic Labs",
      href: "/patient/labs",
      icon: FlaskConical,
      exact: false,
      badge: "Near Me",
      badgeColor: "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30",
      onClick: undefined,
    },
    {
      label: "Care Pass ₹149",
      href: "/patient/subscription",
      icon: Sparkles,
      exact: false,
      badge: isSubscribed ? "Active" : "₹149/mo",
      badgeColor: isSubscribed
        ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
        : "bg-amber-400/20 text-amber-300 border border-amber-400/30",
      onClick: undefined,
    },
    {
      label: "Settings",
      href: "/patient/settings",
      icon: Settings,
      exact: false,
      badge: null,
      badgeColor: null,
      onClick: undefined,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#072C20] text-emerald-100 flex flex-col justify-between select-none h-screen font-sans border-r border-[#0D3B2C] shadow-xl">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Logo & Slogan */}
        <div className="p-5 pb-5 flex items-center gap-3 shrink-0 border-b border-[#0D3B2C]/70">
          <Link href="/patient" prefetch={true} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-emerald-400"
              >
                <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z" />
                <path d="M2 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4 4Z" />
                <path d="M12 14a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z" />
                <path d="M14 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-tight leading-snug">
                Code<span className="text-emerald-400">Rx</span>
              </div>
              <div className="text-[11px] text-emerald-300/70 font-normal leading-tight">
                Your Health. Our Priority.
              </div>
            </div>
          </Link>
        </div>

        {/* Scrollable Nav Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            let isActive = false;
            if (item.exact) {
              isActive = pathname === item.href;
            } else if (item.isRemindersLink) {
              isActive = pathname === "/patient/appointments" && currentTab === "reminders";
            } else if (item.isAppointmentsLink) {
              isActive = pathname === "/patient/appointments" && currentTab !== "reminders";
            } else {
              isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/patient");
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={true}
                onClick={item.onClick}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-100 cursor-pointer ${
                  isActive
                    ? "bg-[#0D7A53] text-white shadow-xs font-bold"
                    : "text-emerald-100/80 hover:text-white hover:bg-emerald-900/40 active:bg-emerald-900/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-emerald-300/70"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor ||
                      (isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#059669]/60 text-emerald-100")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Insights Card & Slogan */}
      <div className="p-3.5 shrink-0">
        <div className="p-3.5 rounded-2xl bg-[#093527] border border-emerald-800/60 flex items-center gap-3 text-white relative overflow-hidden group">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <Heart className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 z-10">
            <div className="text-xs font-bold text-white leading-tight">
              Better Health Tomorrow
            </div>
            <div className="text-[10px] text-emerald-300/80 leading-tight">
              Small steps today. A healthier you tomorrow.
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-500/10 pointer-events-none blur-sm" />
        </div>
      </div>
    </aside>
  );
}
