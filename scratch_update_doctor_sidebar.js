const fs = require('fs');

const sidebarContent = `"use client";

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
} from "lucide-react";

interface DoctorSidebarProps {
  doctorName?: string;
  pendingReviewsCount?: number;
  criticalAlertsCount?: number;
}

export function DoctorSidebar({
  doctorName = "Dr. Aarav Mehta",
  pendingReviewsCount = 3,
  criticalAlertsCount = 3,
}: DoctorSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Doctor Clinical Credentials State
  const [displayName, setDisplayName] = useState(doctorName);
  const [designation, setDesignation] = useState("Senior Consultant");
  const [specialization, setSpecialization] = useState("Internal Medicine & Diabetology");
  const [visitingHospitals, setVisitingHospitals] = useState(
    "Max Super Speciality Hospital, Apollo Indraprastha"
  );
  const [consultationFee, setConsultationFee] = useState(800);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editDesignation, setEditDesignation] = useState(designation);
  const [editHospitals, setEditHospitals] = useState(visitingHospitals);
  const [editSpecialization, setEditSpecialization] = useState(specialization);
  const [editFee, setEditFee] = useState(consultationFee);
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
        }),
      });

      if (res.ok) {
        setDisplayName(editName);
        setDesignation(editDesignation);
        setVisitingHospitals(editHospitals);
        setSpecialization(editSpecialization);
        setConsultationFee(editFee);
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

  // Doctor Navigation Groups directly matching the reference screenshot
  const navSections = [
    {
      group: "CLINICAL WORKSPACE",
      items: [
        {
          label: "Doctor Cockpit",
          href: "/doctor",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          label: "Patients Cohort",
          href: "/doctor/patients",
          icon: Users,
          badge: null,
        },
        {
          label: "Consultation Schedule",
          href: "/doctor/appointments",
          icon: Calendar,
          badge: null,
        },
      ],
    },
    {
      group: "DIAGNOSTICS & AI",
      items: [
        {
          label: "Diagnostic Records",
          href: "/doctor/records",
          icon: FileText,
          badge: null,
        },
        {
          label: "AI Differential Review",
          href: "/doctor/patients/patient_1?tab=what-changed",
          icon: GitCompare,
          badge: "AI",
          badgeType: "ai",
        },
        {
          label: "Prescriptions & Imaging",
          href: "/doctor/prescriptions",
          icon: Pill,
          badge: null,
        },
        {
          label: "Pharmacovigilance",
          href: "/doctor/medicines",
          icon: ShieldCheck,
          badge: null,
        },
      ],
    },
    {
      group: "HOSPITAL PRACTICE",
      items: [
        {
          label: "Staff Scheduling",
          href: "/doctor/availability",
          icon: Users,
          badge: null,
        },
        {
          label: "Consultation Fees",
          href: "/doctor/payments",
          icon: CreditCard,
          badge: null,
        },
        {
          label: "Clinical Triage Alerts",
          href: "/doctor/notifications",
          icon: Bell,
          badge: "3",
          badgeType: "alert",
        },
      ],
    },
  ];

  return (
    <>
      <aside
        className={\`\${
          collapsed ? "w-16" : "w-64"
        } shrink-0 bg-[#0B1519] border-r border-[#15252C] text-slate-300 flex flex-col justify-between transition-all duration-300 select-none min-h-screen relative z-20\`}
      >
        <div>
          {/* 1. BRAND LOGO (Gold cross + CodeRx + Tagline) */}
          <div className="pt-6 pb-5 px-5 flex items-center justify-between border-b border-[#142329]/70">
            {!collapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F0BF7A] via-[#E4A95B] to-[#C88939] flex items-center justify-center text-[#1C1307] font-black text-2xl shadow-md shrink-0">
                  +
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-xl font-bold tracking-tight text-[#FAF5ED]">
                      CodeRx
                    </span>
                  </div>
                  <span className="text-[10px] text-[#B8A791] font-sans tracking-tight block -mt-0.5">
                    Better Care. Together.
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F0BF7A] to-[#C88939] flex items-center justify-center text-[#1C1307] font-black text-lg mx-auto shadow-md">
                +
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-[#16272F] transition-colors cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-[#E4A95B]" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* 2. DOCTOR PROFILE CARD (Photo, Name, Designation, Online) */}
          {!collapsed && (
            <div className="px-5 py-4 border-b border-[#142329]/70 flex items-center gap-3 group relative">
              <div className="relative shrink-0">
                <img
                  src="/images/doctor-aarav-mehta.jpg"
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C89B5F]/40"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(displayName);
                      setEditDesignation(designation);
                      setEditHospitals(visitingHospitals);
                      setEditSpecialization(specialization);
                      setEditFee(consultationFee);
                      setShowEditModal(true);
                    }}
                    title="Edit Credentials"
                    className="text-slate-500 hover:text-[#E4A95B] opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-[#86959B] truncate leading-tight">
                  {designation}
                </p>
                <p className="text-[9.5px] text-[#718288] truncate leading-tight">
                  {specialization}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. NAVIGATION SECTIONS */}
          <nav className="px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navSections.map((section) => (
              <div key={section.group} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 pb-1.5 text-[9px] uppercase font-bold tracking-[0.14em] text-[#697B82] font-mono">
                    {section.group}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/doctor"
                      ? pathname === "/doctor"
                      : pathname.startsWith(item.href.split("?")[0]);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={\`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group \${
                        isActive
                          ? "bg-gradient-to-r from-[#2B2317] to-[#1C1710] border border-[#6D5028]/60 text-[#F0C588] shadow-sm font-semibold"
                          : "text-[#97A7AD] hover:text-[#FAF6F0] hover:bg-[#142329]"
                      }\`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={\`w-4 h-4 shrink-0 transition-colors \${
                          isActive
                            ? "text-[#E6B16E]"
                            : "text-[#7E9096] group-hover:text-[#FAF6F0]"
                        }\`}
                      />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!collapsed && item.badge && (
                        <>
                          {item.badgeType === "ai" && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40">
                              {item.badge}
                            </span>
                          )}
                          {item.badgeType === "alert" && (
                            <span className="w-4 h-4 rounded-full text-[9px] font-black bg-rose-500 text-white flex items-center justify-center shadow-xs">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* 4. BOTTOM BOTANICAL DECORATION ("HEALTHCARE MADE PERSONAL") */}
        {!collapsed && (
          <div className="p-5 border-t border-[#142329]/70 select-none">
            <div className="flex flex-col items-start gap-1">
              {/* Refined botanical gold line-art SVG */}
              <svg
                className="w-10 h-10 text-[#C89B5F]/40 mb-1"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M50 90C50 50 20 40 20 20C40 20 50 50 50 90Z" strokeLinecap="round" />
                <path d="M50 90C50 50 80 40 80 20C60 20 50 50 50 90Z" strokeLinecap="round" />
                <path d="M50 70C50 40 30 35 30 25C40 25 50 40 50 70Z" strokeLinecap="round" />
                <path d="M50 70C50 40 70 35 70 25C60 25 50 40 50 70Z" strokeLinecap="round" />
              </svg>
              <span className="text-[8.5px] uppercase tracking-[0.24em] text-[#C89B5F]/75 font-serif block">
                Healthcare
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.24em] text-[#C89B5F]/75 font-serif block -mt-0.5">
                Made Personal
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Edit Doctor Credentials Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0C1519] text-white rounded-3xl border border-[#23353D] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B2B33]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F0BF7A]/20 text-[#F0BF7A] flex items-center justify-center font-bold text-base">
                  +
                </div>
                <h3 className="font-bold text-sm text-[#FAF5ED] font-serif">
                  Edit Clinical Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Doctor credentials updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070F12] border border-[#23353D] text-white focus:outline-none focus:border-[#C89B5F] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Clinical Designation
                </label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070F12] border border-[#23353D] text-white focus:outline-none focus:border-[#C89B5F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Clinical Specialization
                </label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070F12] border border-[#23353D] text-white focus:outline-none focus:border-[#C89B5F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Affiliated / Visiting Hospitals
                </label>
                <textarea
                  value={editHospitals}
                  onChange={(e) => setEditHospitals(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#070F12] border border-[#23353D] text-white focus:outline-none focus:border-[#C89B5F] leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1B2B33]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-[#152329] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F0BF7A] to-[#C88939] text-[#1C1307] font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Credentials"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
`;

fs.writeFileSync('c:/Users/Vedant/Desktop/triageai/src/components/layout/DoctorSidebar.tsx', sidebarContent);
console.log('Successfully updated DoctorSidebar.tsx to match reference image!');
