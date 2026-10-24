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
    <header className="h-18 px-6 lg:px-8 bg-[#FFF5F8] border-b border-[#FCE7F0] flex items-center justify-between gap-4 select-none shrink-0 shadow-2xs">
      
      {/* Search Input Bar (Center/Left pill) */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#E11D48]/70 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors, symptoms, or anything..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#FBCFE8] hover:border-[#F43F5E] focus:border-[#E11D48] text-xs font-medium text-slate-800 placeholder-[#9F1239]/50 focus:outline-hidden focus:ring-3 focus:ring-[#E11D48]/15 transition-all shadow-2xs"
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
            className="relative p-2.5 rounded-full bg-white border border-[#FCE7F0] hover:bg-[#FFE4E6] text-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#BE123C]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#FFF5F8] shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E7DFD1] shadow-xl p-4 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                <span className="font-extrabold text-slate-900">Notifications</span>
                <span className="text-[10px] text-[#A8988D] font-bold">2 unread alerts</span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/patient/appointments"
                  onClick={() => setShowNotifications(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE3] block transition-colors space-y-0.5"
                >
                  <p className="font-bold text-slate-900">Appointment Confirmed</p>
                  <p className="text-[11px] text-slate-600">
                    Dr. Meera Sharma confirmed your consultation for Today at 10:30 AM.
                  </p>
                </Link>
                <Link
                  href="/patient/records"
                  onClick={() => setShowNotifications(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE3] block transition-colors space-y-0.5"
                >
                  <p className="font-bold text-slate-900">Lab Report Ready</p>
                  <p className="text-[11px] text-slate-600">
                    Your Complete Blood Count & Renal Panel is available for review.
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-white/80 border border-transparent hover:border-[#EBE3D7] transition-all cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F3EDE4] border border-[#E7DFD1] shrink-0">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={patientName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name & Role */}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-slate-900 tracking-tight leading-tight">
                {patientName}
              </div>
              <div className="text-[10.5px] font-medium text-[#8C7A72]">
                Patient
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#8C7A72] ml-0.5" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E7DFD1] shadow-xl p-2 text-xs space-y-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#F0EAE1]">
                <p className="font-black text-slate-900 text-xs">{patientName}</p>
                {patientEmail && <p className="text-[10px] text-slate-500 truncate">{patientEmail}</p>}
              </div>

              <Link
                href="/patient/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF7F2] font-semibold transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#7A6960]" />
                <span>My Health Profile</span>
              </Link>

              <Link
                href="/patient/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAF7F2] font-semibold transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#7A6960]" />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
