"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface DoctorHeaderProps {
  doctorName?: string;
  onToggleSidebar?: () => void;
}

export function DoctorHeader({
  doctorName = "Dr. Aarav Mehta",
  onToggleSidebar,
}: DoctorHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/doctor/patients?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    }
  }

  return (
    <header className="h-16 shrink-0 bg-[#FAF7F2] border-b border-[#EFE8DE] px-4 sm:px-8 flex items-center justify-between gap-4 select-none z-20 font-sans">
      
      {/* 1. Left: Hamburger Menu Icon */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-[#F2ECE1] text-[#163832] transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Center: Pill-shaped Patient Search Bar (Matching Mockup) */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-md hidden md:block mx-auto"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#8C9E97] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, ID, or condition..."
            className="w-full bg-white border border-[#E3DCD1] hover:border-[#D1C6B7] focus:border-[#163832] rounded-full pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-[#8C9E97] focus:outline-hidden focus:ring-2 focus:ring-[#163832]/20 transition-all font-medium shadow-2xs"
          />
        </div>
      </form>

      {/* 3. Right: Notifications Bell & Doctor Profile Pill (Matching Mockup) */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Notifications Bell with Red Badge '3' */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-[#F2ECE1] text-slate-600 transition-colors cursor-pointer"
            title="Clinical Alerts"
          >
            <Bell className="w-4 h-4 text-[#465A54]" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F2]">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EDE6DA] p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Clinical Notifications
                </span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  3 Pending
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <Link
                  href="/doctor/patients/patient_1?tab=what-changed"
                  onClick={() => setShowNotifications(false)}
                  className="block p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <p className="font-bold text-rose-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Lab Review: Rohan Sharma</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Acute creatinine &amp; glycemic shifts flagged by AI
                  </p>
                </Link>
                <Link
                  href="/doctor/appointments"
                  onClick={() => setShowNotifications(false)}
                  className="block p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Next Patient: Sneha Patil</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Checked in at clinic OPD &bull; Waiting in Room 1
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Pill: Avatar + Name + Specialization + Chevron */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[#F2ECE1] transition-all cursor-pointer border border-[#E9E1D4] bg-white shadow-2xs"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D5CABB] shrink-0">
              <img
                src="/images/doctor-aarav-mehta.jpg"
                alt={doctorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#163832] leading-tight">
                {doctorName}
              </p>
              <p className="text-[10px] text-[#697E77] leading-tight">
                General Physician
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EDE6DA] p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="p-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">{doctorName}</p>
                <p className="text-[11px] text-slate-500">Civil Hospital, Mumbai</p>
              </div>

              <div className="py-1">
                <Link
                  href="/doctor/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Clinic Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
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
