"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

interface PatientHeaderProps {
  patientName: string;
  patientEmail?: string;
  avatarUrl?: string;
  unreadCount?: number;
}

export function PatientHeader({
  patientName = "Aarav Mehta",
  patientEmail,
  avatarUrl,
  unreadCount = 2,
}: PatientHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
    <header className="h-18 px-6 lg:px-8 bg-[#F3FAF6] border-b border-[#D6EDE1] flex items-center justify-between gap-4 select-none shrink-0 shadow-2xs font-sans">
      
      {/* Search Input Bar (Center/Left pill) */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#059669]/70 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors, symptoms, or anything..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#CDEBDC] hover:border-[#8FE3B8] focus:border-[#059669] text-xs font-semibold text-slate-800 placeholder-[#164E3D]/50 focus:outline-hidden focus:ring-3 focus:ring-[#059669]/15 transition-all shadow-2xs"
          />
        </div>
      </form>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-3.5">
        
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-white border border-[#D6EDE1] hover:bg-[#E4F5ED] text-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#059669]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#059669] text-white text-[9px] font-black flex items-center justify-center border-2 border-[#F3FAF6] shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-900">Notifications</span>
                <Link
                  href="/patient/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-[#059669] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Follow-up in 3 Weeks</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Dr. Aarav Mehta scheduled your repeat Kidney Function Test (KFT).
                  </p>
                </div>

                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Refill Reminder</span>
                    </span>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Your Metformin 500mg supply has 7 days remaining.
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
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full bg-white border border-[#D6EDE1] hover:border-[#8FE3B8] hover:bg-[#E4F5ED]/60 transition-all shadow-2xs cursor-pointer group"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={patientName}
                className="w-7 h-7 rounded-full object-cover border border-[#8FE3B8]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D1F2E2] to-[#A7F3D0] border border-[#8FE3B8] flex items-center justify-center text-[#064E3B] font-black text-xs">
                {patientName.charAt(0)}
              </div>
            )}

            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-extrabold text-slate-900 group-hover:text-[#064E3B] transition-colors leading-tight">
                {patientName}
              </div>
              <div className="text-[10px] font-semibold text-[#059669] leading-tight">
                Patient
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#059669] transition-transform" />
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
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#E4F5ED] hover:text-[#064E3B] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#059669]" />
                  <span>My Health Profile</span>
                </Link>

                <Link
                  href="/patient/subscription"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#E4F5ED] hover:text-[#064E3B] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Subscription &amp; Pass</span>
                </Link>

                <Link
                  href="/patient/settings"
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
