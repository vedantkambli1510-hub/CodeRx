"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  GitCompare,
  Pill,
  ShieldCheck,
  CreditCard,
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit3,
  X,
  Save,
  Check,
  Sparkles,
  Heart,
  Settings,
  Mail,
  Stethoscope,
} from "lucide-react";

interface DoctorSidebarProps {
  doctorName?: string;
  pendingReviewsCount?: number;
  criticalAlertsCount?: number;
}

export function DoctorSidebar({
  doctorName = "Attending Physician",
  pendingReviewsCount = 3,
  criticalAlertsCount = 3,
}: DoctorSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Doctor Clinical Credentials State
  const [displayName, setDisplayName] = useState(doctorName);
  const [designation, setDesignation] = useState("General Physician");
  const [specialization, setSpecialization] = useState("Internal Medicine & Diabetology");
  const [visitingHospitals, setVisitingHospitals] = useState("Civil Hospital, Mumbai");
  const [consultationFee, setConsultationFee] = useState(800);
  const [upiId, setUpiId] = useState("dr.aarav.mehta@okaxis");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editDesignation, setEditDesignation] = useState(designation);
  const [editHospitals, setEditHospitals] = useState(visitingHospitals);
  const [editSpecialization, setEditSpecialization] = useState(specialization);
  const [editFee, setEditFee] = useState(consultationFee);
  const [editUpiId, setEditUpiId] = useState(upiId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch saved doctor credentials on mount
  useEffect(() => {
    fetch("/api/doctor/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.name) {
            setDisplayName(data.name);
            setEditName(data.name);
          }
          if (data.designation) {
            setDesignation(data.designation);
            setEditDesignation(data.designation);
          }
          if (data.visitingHospitals) {
            setVisitingHospitals(data.visitingHospitals);
            setEditHospitals(data.visitingHospitals);
          }
          if (data.specialization) {
            setSpecialization(data.specialization);
            setEditSpecialization(data.specialization);
          }
          if (data.consultationFee) {
            setConsultationFee(data.consultationFee);
            setEditFee(data.consultationFee);
          }
          if (data.upiId) {
            setUpiId(data.upiId);
            setEditUpiId(data.upiId);
          }
        }
      })
      .catch(() => {});
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          designation: editDesignation,
          visitingHospitals: editHospitals,
          specialization: editSpecialization,
          consultationFee: editFee,
          upiId: editUpiId,
        }),
      });

      if (res.ok) {
        setDisplayName(editName);
        setDesignation(editDesignation);
        setVisitingHospitals(editHospitals);
        setSpecialization(editSpecialization);
        setConsultationFee(editFee);
        setUpiId(editUpiId);
        setSaveSuccess(true);
        setTimeout(() => {
          setShowEditModal(false);
          setSaveSuccess(false);
        }, 1200);
      }
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  }

  // Doctor Navigation items matching the reference mockup
  const navItems = [
    {
      label: "Dashboard",
      href: "/doctor",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Patients",
      href: "/doctor/patients",
      icon: Users,
      badge: null,
    },
    {
      label: "Appointments",
      href: "/doctor/appointments",
      icon: Calendar,
      badge: null,
    },
    {
      label: "Prescriptions",
      href: "/doctor/prescriptions",
      icon: Pill,
      badge: null,
    },
    {
      label: "Medical Records",
      href: "/doctor/records",
      icon: FileText,
      badge: null,
    },
    {
      label: "AI Insights",
      href: "/doctor/patients/patient_1?tab=what-changed",
      icon: Sparkles,
      badge: "New",
      badgeType: "new",
    },
    {
      label: "Messages",
      href: "/doctor/notifications",
      icon: Mail,
      badge: "3",
      badgeType: "count",
    },
    {
      label: "Calendar",
      href: "/doctor/availability",
      icon: Calendar,
      badge: null,
    },
    {
      label: "Payments & QR",
      href: "/doctor/payments",
      icon: CreditCard,
      badge: "GPay",
      badgeType: "new",
    },
    {
      label: "Settings",
      href: "/doctor/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } shrink-0 bg-[#163832] border-r border-[#1B423B] text-slate-200 flex flex-col justify-between transition-all duration-300 select-none min-h-screen relative z-20 font-sans`}
      >
        <div className="flex-1 flex flex-col">
          
          {/* 1. BRAND HEADER (CodeRx • Better Care. Together.) */}
          <div className="pt-6 pb-5 px-5 flex items-center justify-between border-b border-white/10">
            {!collapsed ? (
              <Link href="/doctor" className="flex items-center gap-3 group">
                {/* White Heart + Stethoscope/Cross icon */}
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11h3l2-4 2 8 2-4h2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                      Code<span className="text-[#38D4B0]">Rx</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-200/70 tracking-wide font-medium block -mt-0.5">
                    Better Care. Together.
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/doctor" className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto shadow-sm">
                <Heart className="w-5 h-5 text-teal-300" />
              </Link>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-teal-200/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-teal-300" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* 2. NAVIGATION LINKS LIST */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/doctor"
                  ? pathname === "/doctor"
                  : pathname === item.href || (pathname && pathname.startsWith(item.href) && item.href !== "/doctor");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center ${
                    collapsed ? "justify-center px-2" : "justify-between px-3.5"
                  } py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-[#244C44] text-white shadow-xs border border-white/10 font-bold"
                      : "text-teal-100/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors shrink-0 ${
                        isActive ? "text-[#38D4B0]" : "text-teal-200/60 group-hover:text-white"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        item.badgeType === "new"
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                          : "bg-rose-500 text-white font-mono"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute right-2 top-2" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 3. BOTTOM DOCTOR PRAISING QUOTE & STETHOSCOPE WATERMARK */}
        {!collapsed && (
          <div className="p-5 border-t border-white/10 relative overflow-hidden select-none bg-[#122F2A]/60">
            {/* Subtle Stethoscope Watermark in Corner */}
            <div className="absolute -right-2 -bottom-2 opacity-15 pointer-events-none text-teal-200">
              <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                <circle cx="28" cy="22" r="4" fill="currentColor" />
                <circle cx="68" cy="22" r="4" fill="currentColor" />
                <path
                  d="M28 22V36C28 46 38 54 48 54C58 54 68 46 68 36V22"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M48 54V70C48 76 54 80 62 80"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="68" cy="80" r="7" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>

            <div className="relative z-10 space-y-1">
              <p className="font-serif italic text-sm sm:text-[15px] text-teal-100/90 leading-snug">
                Good doctors build healthier tomorrows.
              </p>
              <p className="text-[10px] text-teal-300/60 font-sans">
                Dedicated Clinical Suite
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Profile Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Edit Doctor Credentials</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Clinic / Hospital</label>
                <input
                  type="text"
                  value={editHospitals}
                  onChange={(e) => setEditHospitals(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Google Pay UPI ID (Settlement VPA)
                </label>
                <input
                  type="text"
                  value={editUpiId}
                  onChange={(e) => setEditUpiId(e.target.value)}
                  placeholder="e.g. dr.aarav.mehta@okaxis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-semibold bg-slate-50 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Used for generating the clinic standee QR code and receiving Google Pay payments.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold cursor-pointer transition-all shadow-xs"
                >
                  {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
