"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Users,
  Calendar,
  Pill,
  GitCompare,
  Hospital,
  ShieldCheck,
  Stethoscope,
  Heart,
  FileText,
  UserCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CodeRxLogo } from "../common/CodeRxLogo";
import { LanguageSelector } from "../common/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";


interface NavbarProps {
  currentUser?: {
    userId: string;
    role: "PATIENT" | "DOCTOR";
    email: string;
    name: string;
  } | null;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  link?: string;
}

export function Navbar({ currentUser }: NavbarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchedRef = useRef(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const [doctorProfile, setDoctorProfile] = useState<{
    designation?: string;
    visitingHospitals?: string;
  } | null>(null);

  const isPatient = currentUser?.role === "PATIENT";
  const isDoctor = currentUser?.role === "DOCTOR";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Fetch notifications once on mount
  const userId = currentUser?.userId;
  useEffect(() => {
    if (userId && !fetchedRef.current) {
      fetchedRef.current = true;
      fetch("/api/notifications")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter((n: NotificationItem) => n.status === "UNREAD").length);
          }
        })
        .catch(() => {});
    }
  }, [userId]);

  // Fetch doctor profile details for user dropdown
  useEffect(() => {
    if (isDoctor) {
      fetch("/api/doctor/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setDoctorProfile(data);
        })
        .catch(() => {});
    }
  }, [isDoctor]);

  // Click outside listener for all dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    } finally {
      setLoggingOut(false);
    }
  }

  // Doctor and Patient portals use dedicated workstation chromes
  if (
    pathname?.startsWith("/doctor") ||
    pathname?.startsWith("/patient") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2] backdrop-blur-md border-b border-[#EFE8DE] shadow-xs print:hidden text-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          
          {/* ========================================================== */}
          {/* Left Brand Area (Clean & Uncrowded)                        */}
          {/* ========================================================== */}
          <div className="flex items-center gap-4">
            <Link
              href={isDoctor ? "/doctor" : isPatient ? "/patient" : "/login"}
              className="flex items-center gap-2 group"
            >
              <CodeRxLogo size="md" showTagline={false} />
            </Link>

            {/* Subtle Portal Badge */}
            {currentUser && !isAuthPage && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDE4] border border-[#E7DFD1] text-xs font-bold text-slate-800 shadow-2xs">
                {isDoctor ? (
                  <>
                    <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t("doctorStation", "Doctor Station")}</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t("patientHealthVault", "Patient Health Vault")}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* Center Navigation: Compact & Dropdown (Never Overcrowded)   */}
          {/* ========================================================== */}
          {!isAuthPage && currentUser && (
            <nav className="hidden md:flex items-center gap-2">
              {isDoctor && (
                <>
                  <Link
                    href="/doctor"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      pathname === "/doctor"
                        ? "bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-xs font-black"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/70"
                    }`}
                  >
                    {t("dashboard", "Dashboard")}
                  </Link>

                  <Link
                    href="/doctor/patients"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      pathname.startsWith("/doctor/patients")
                        ? "bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-xs font-black"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/70"
                    }`}
                  >
                    {t("patients", "Patients")}
                  </Link>

                  {/* Dropdown for All Other Tools (Prevents Overcrowding) */}
                  <div className="relative" ref={toolsMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowToolsMenu(!showToolsMenu)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        showToolsMenu || pathname.startsWith("/doctor/reviews") || pathname.startsWith("/doctor/prescriptions") || pathname.startsWith("/doctor/availability")
                          ? "bg-slate-300 text-slate-900 shadow-2xs"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/60"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t("clinicalTools", "Clinical Tools")}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {showToolsMenu && (
                      <div className="absolute left-0 mt-2 w-64 bg-slate-100 rounded-2xl shadow-xl border border-slate-300 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-1.5 space-y-1">
                        <Link
                          href="/doctor/patients/patient_1"
                          onClick={() => setShowToolsMenu(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                        >
                          <GitCompare className="w-4 h-4 text-rose-600 shrink-0" />
                          <div className="flex-1">
                            <div>{t("whatChangedAi", "WHAT CHANGED? (AI)")}</div>
                            <span className="text-[10px] font-normal text-slate-500">{t("longitudinalDiff", "Longitudinal differential engine")}</span>
                          </div>
                        </Link>

                        <Link
                          href="/doctor/appointments"
                          onClick={() => setShowToolsMenu(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                          <div className="flex-1">
                            <div>{t("appointmentsSchedule", "Appointments & Schedule")}</div>
                            <span className="text-[10px] font-normal text-slate-500">{t("opdBookings", "OPD bookings and time slots")}</span>
                          </div>
                        </Link>

                        <Link
                          href="/doctor/prescriptions"
                          onClick={() => setShowToolsMenu(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                        >
                          <Pill className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="flex-1">
                            <div>{t("prescriptions1mg", "Prescriptions & Tata 1mg")}</div>
                            <span className="text-[10px] font-normal text-slate-500">{t("digitalRxDispatch", "Digital Rx & pharmacy dispatch")}</span>
                          </div>
                        </Link>

                        <Link
                          href="/doctor/availability"
                          onClick={() => setShowToolsMenu(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                        >
                          <Hospital className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="flex-1">
                            <div>{t("visitingHospitalsSlots", "Visiting Hospitals & Slots")}</div>
                            <span className="text-[10px] font-normal text-slate-500">{t("configureOtherHospitals", "Configure other hospital OPDs")}</span>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {isPatient && (
                <>
                  <Link
                    href="/patient"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      pathname === "/patient"
                        ? "bg-[#0D8272] text-white shadow-xs font-black"
                        : "text-slate-700 hover:text-slate-900 hover:bg-[#F2ECE1]"
                    }`}
                  >
                    {t("myHealth", "My Health")}
                  </Link>

                  <Link
                    href="/patient/timeline"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      pathname.startsWith("/patient/timeline")
                        ? "bg-[#0D8272] text-white shadow-xs font-black"
                        : "text-slate-700 hover:text-slate-900 hover:bg-[#F2ECE1]"
                    }`}
                  >
                    {t("timeline", "Timeline")}
                  </Link>

                  <Link
                    href="/patient/records"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      pathname.startsWith("/patient/records")
                        ? "bg-[#0D8272] text-white shadow-xs font-black"
                        : "text-slate-700 hover:text-slate-900 hover:bg-[#F2ECE1]"
                    }`}
                  >
                    {t("uploadRecords", "Upload Records")}
                  </Link>

                  <Link
                    href="/patient/appointments/book"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      pathname.startsWith("/patient/appointments")
                        ? "bg-[#0D8272] text-white shadow-xs font-black"
                        : "text-slate-700 hover:text-slate-900 hover:bg-[#F2ECE1]"
                    }`}
                  >
                    {t("bookSlot", "Book Slot")}
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* ========================================================== */}
          {/* Right Area: Notification Bell + User Profile Dropdown      */}
          {/* ========================================================== */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector compact={true} />
            {currentUser ? (

              isAuthPage ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href={isDoctor ? "/doctor" : "/patient"}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors"
                  >
                    {t("enterWorkspace", "Enter Workspace →")}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  
                  {/* Notification Bell */}
                  <div className="relative" ref={notifMenuRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-300/70 transition-colors"
                      title={t("notifications", "Notifications")}
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-[9px] font-bold text-white flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-100 rounded-2xl shadow-xl border border-slate-300 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-slate-900">
                        <div className="p-3 bg-slate-200 text-slate-900 flex items-center justify-between border-b border-slate-300">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-sky-600" />
                            <span className="text-xs font-bold tracking-wide uppercase">{t("notifications", "Notifications")}</span>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold border border-sky-200">
                            {unreadCount} {t("unread", "Unread")}
                          </span>
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-200">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-500">
                              {t("noNotifications", "No notifications at this time.")}
                            </div>
                          ) : (
                            notifications.slice(0, 5).map((n) => (
                              <Link
                                key={n.id}
                                href={n.link || "#"}
                                onClick={() => setShowNotifications(false)}
                                className="p-3 block hover:bg-slate-200/60 transition-colors text-left"
                              >
                                <div className="flex items-start gap-2.5">
                                  <span
                                    className={`w-2 h-2 mt-1 rounded-full shrink-0 ${
                                      n.type === "IMPORTANT_CHANGE"
                                        ? "bg-red-500"
                                        : n.type === "APPOINTMENT"
                                        ? "bg-sky-500"
                                        : "bg-emerald-500"
                                    }`}
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                                  </div>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>

                        <div className="p-2.5 bg-slate-200/80 border-t border-slate-300 text-center">
                          <Link
                            href={isDoctor ? "/doctor/notifications" : "/patient/notifications"}
                            onClick={() => setShowNotifications(false)}
                            className="text-xs font-bold text-sky-700 hover:text-sky-900"
                          >
                            {t("viewAllNotifications", "View All Notifications →")}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* USER PROFILE DROPDOWN (Solves All Overcrowding Issues)    */}
                  {/* ======================================================== */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-300/80 border border-slate-300 shadow-2xs transition-all active:scale-[0.99]"
                    >
                      {/* Avatar Circle */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                        {isDoctor ? "DR" : currentUser.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="hidden sm:flex flex-col text-left min-w-0 max-w-[140px]">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] font-semibold text-sky-700 truncate">
                          {isDoctor
                            ? doctorProfile?.designation || t("seniorConsultant", "Senior Consultant")
                            : t("verifiedPatient", "Verified Patient")}
                        </span>
                      </div>

                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </button>

                    {/* Clean Dropdown Panel */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-72 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EDE6DA] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-2 space-y-2">
                        
                        {/* Dropdown Header: Doctor Info */}
                        <div className="p-3 rounded-xl bg-[#F3EDE4] border border-[#E7DFD1] space-y-1">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0D8272] to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                              {isDoctor ? "DR" : currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-black text-slate-900 truncate">
                                {currentUser.name}
                              </h4>
                              <p className="text-[11px] font-semibold text-[#0D8272] truncate">
                                {isDoctor
                                  ? doctorProfile?.designation || t("seniorConsultant", "Senior Consultant")
                                  : t("verifiedPatient", "Verified Patient")}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate font-mono">
                                {currentUser.email}
                              </p>
                            </div>
                          </div>

                          {/* Visiting Hospitals Info */}
                          {isDoctor && doctorProfile?.visitingHospitals && (
                            <div className="pt-2 mt-1 border-t border-slate-300 flex items-center gap-1.5 text-[10px] text-slate-600 truncate">
                              <Hospital className="w-3 h-3 text-sky-600 shrink-0" />
                              <span className="font-semibold text-slate-700 truncate">
                                {doctorProfile.visitingHospitals}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Navigation Links inside Dropdown */}
                        <div className="space-y-0.5">
                          {isDoctor ? (
                            <>
                              <Link
                                href="/doctor"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-sky-600" />
                                <span>{t("dashboard", "Dashboard")}</span>
                              </Link>

                              <Link
                                href="/doctor/patients"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition-colors"
                              >
                                <Users className="w-4 h-4 text-sky-600" />
                                <span>{t("patientWorkspace", "Patient Workspace")}</span>
                              </Link>

                              <Link
                                href="/doctor/patients/patient_1"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition-colors"
                              >
                                <GitCompare className="w-4 h-4 text-rose-600" />
                                <span>{t("whatChangedReview", "WHAT CHANGED? Review")}</span>
                              </Link>

                              <Link
                                href="/doctor/availability"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition-colors"
                              >
                                <Hospital className="w-4 h-4 text-emerald-600" />
                                <span>{t("editDesignationHospitals", "Edit Designation & Hospitals")}</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/patient"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-[#F2ECE1] transition-colors"
                              >
                                <Heart className="w-4 h-4 text-teal-600" />
                                <span>{t("myHealthVault", "My Health Vault")}</span>
                              </Link>

                              <Link
                                href="/patient/timeline"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-[#F2ECE1] transition-colors"
                              >
                                <FileText className="w-4 h-4 text-sky-600" />
                                <span>{t("medicalTimeline", "Medical Timeline")}</span>
                              </Link>

                              <Link
                                href="/patient/appointments"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-[#F2ECE1] transition-colors"
                              >
                                <Calendar className="w-4 h-4 text-sky-600" />
                                <span>{t("myAppointments", "My Appointments")}</span>
                              </Link>
                            </>
                          )}
                        </div>

                        {/* Sign Out Button in Dropdown */}
                        <div className="pt-1 border-t border-[#EFE8DE]">
                          <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span>{loggingOut ? t("loggingOut", "Signing Out...") : t("logout", "Sign Out")}</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-300/60 rounded-xl transition-colors"
                >
                  {t("login", "Sign In")}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-colors"
                >
                  {t("joinCodeRx", "Join CodeRx")}
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
