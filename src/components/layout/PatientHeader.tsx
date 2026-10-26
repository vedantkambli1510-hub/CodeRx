"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  Pill,
  Sparkles,
  Check,
} from "lucide-react";
import { usePatientAvatar } from "@/lib/avatar";

interface PatientHeaderProps {
  patientName: string;
  patientEmail?: string;
  avatarUrl?: string;
  unreadCount?: number;
}

export function PatientHeader({
  patientName = "Rajesh Sharma",
  patientEmail,
  avatarUrl: customAvatarUrl,
  unreadCount = 0,
}: PatientHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { avatarUrl: persistentAvatarUrl } = usePatientAvatar();
  const avatarUrl = customAvatarUrl || persistentAvatarUrl;

  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUnreadCount, setCurrentUnreadCount] = useState<number>(unreadCount);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync unread count with current route and localStorage
  useEffect(() => {
    if (pathname === "/patient/notifications") {
      setCurrentUnreadCount(0);
      try {
        localStorage.setItem("coderx_messages_viewed", "true");
      } catch {}
    } else {
      try {
        const viewed = localStorage.getItem("coderx_messages_viewed");
        if (viewed === "true") {
          setCurrentUnreadCount(0);
        } else {
          setCurrentUnreadCount(unreadCount);
        }
      } catch {
        setCurrentUnreadCount(unreadCount);
      }
    }
  }, [pathname, unreadCount]);

  // Listen to global notifications-read event
  useEffect(() => {
    function handleRead() {
      setCurrentUnreadCount(0);
      try {
        localStorage.setItem("coderx_messages_viewed", "true");
      } catch {}
    }

    window.addEventListener("notifications-read", handleRead);
    return () => window.removeEventListener("notifications-read", handleRead);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/patient/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearNotifications = () => {
    setCurrentUnreadCount(0);
    try {
      localStorage.setItem("coderx_messages_viewed", "true");
    } catch {}
    window.dispatchEvent(new Event("notifications-read"));
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => {});
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-16 px-6 lg:px-8 bg-[#F2FAF6] border-b border-[#D8EDE2] flex items-center justify-between gap-4 select-none shrink-0 font-sans z-20">
      
      {/* Search Input Bar (Center/Left pill) */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-emerald-700/60 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports, medicines, doctors, or anything..."
            className="w-full pl-11 pr-4 py-2 rounded-full bg-white border border-[#CDE5D8] hover:border-emerald-400 focus:border-emerald-600 focus:bg-white text-xs font-normal text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
          />
        </div>
      </form>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-emerald-100/60 text-slate-700 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {currentUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <div className="flex items-center gap-2">
                  {currentUnreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearNotifications}
                      className="text-[10px] font-semibold text-slate-500 hover:text-emerald-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <Link
                    href="/patient/notifications"
                    prefetch={true}
                    onClick={() => {
                      setShowNotifications(false);
                      handleClearNotifications();
                    }}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upcoming Doctor Visit</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Dr. Meera Nair consultation on 24 Oct 2026 at Apollo Clinic, Mumbai.
                  </p>
                </div>

                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Take Metformin 500mg</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Today, 8:00 PM</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    1 tablet after dinner as per prescription.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-emerald-100/50 transition-all cursor-pointer group"
          >
            <img
              src={avatarUrl}
              alt={patientName}
              className="w-8 h-8 rounded-full object-cover border border-emerald-300 shadow-2xs"
            />

            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                {patientName}
              </div>
              <div className="text-[10px] font-medium text-slate-500 leading-tight">
                Patient ID: CRX-45872
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-black text-slate-900">{patientName}</p>
                {patientEmail && (
                  <p className="text-[10px] text-slate-500 truncate">{patientEmail}</p>
                )}
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/patient/profile"
                  prefetch={true}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#E4F5ED] hover:text-[#064E3B] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#059669]" />
                  <span>My Health Profile</span>
                </Link>

                <Link
                  href="/patient/subscription"
                  prefetch={true}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#E4F5ED] hover:text-[#064E3B] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Subscription &amp; Pass</span>
                </Link>

                <Link
                  href="/patient/settings"
                  prefetch={true}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#E4F5ED] hover:text-[#064E3B] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-bold text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
