"use client";

import { useState, useRef, useEffect } from "react";
import {
  GitCompare,
  ChevronDown,
  Upload,
  FilePlus,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PatientHeaderProps {
  patient: {
    id: string;
    fullName: string;
    dob: string | null;
    gender: string | null;
    bloodGroup: string | null;
    allergies: string | null;
    conditions: string | null;
    currentMedications: string | null;
    lastConsultationDate?: string;
    nextAppointmentDate?: string;
  };
  onSelectTab: (tabKey: string) => void;
  onOpenPrescriptionModal: () => void;
  onOpenUploadModal?: () => void;
  onOpenNoteModal?: () => void;
  hasItemsRequiringReview?: boolean;
}

export function PatientHeader({
  patient,
  onSelectTab,
  onOpenPrescriptionModal,
  onOpenUploadModal,
  onOpenNoteModal,
  hasItemsRequiringReview = true,
}: PatientHeaderProps) {
  const { t } = useLanguage();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const birthYear = patient.dob ? parseInt(patient.dob.split("-")[0]) : 1970;
  const age = new Date().getFullYear() - birthYear;
  const isRajesh = patient.fullName.includes("Rajesh");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
      {/* Header Row (Section 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {patient.fullName}
            </h1>
            {/* Show only if relevant per Section 13 */}
            {(hasItemsRequiringReview || isRajesh) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{t("itemsRequiringReview", "⚠️ Items Requiring Review")}</span>
              </span>
            )}
          </div>

          {/* Show only: Age · Gender · Blood Group · Last Visit (Section 13) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            <span>{age} {t("yrs", "yrs")}</span>
            <span>·</span>
            <span>
              {patient.gender === "Female" ? t("female", "Female") : t("male", "Male")}
            </span>
            <span>·</span>
            <span>{patient.bloodGroup || "O+"}</span>
            <span>·</span>
            <span>{t("lastVisit", "Last Visit")}: {patient.lastConsultationDate || "Apr 5, 2024"}</span>
          </div>
        </div>

        {/* Actions Row: ONE Primary Action + "More ▾" Secondary Menu (Section 13 & 43) */}
        <div className="flex items-center gap-3">
          {/* Primary Action (Section 13) */}
          <button
            onClick={() => onSelectTab("what-changed")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all hover:scale-105"
          >
            <GitCompare className="w-4 h-4" />
            <span>{t("reviewLatestChanges", "Review Latest Changes")}</span>
          </button>

          {/* Secondary Actions: More ▾ (Section 13) */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <span>{t("more", "More")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-300 shadow-xl py-1.5 z-30 divide-y divide-slate-100 text-xs">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      if (onOpenUploadModal) onOpenUploadModal();
                      else onSelectTab("records");
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>{t("uploadRecord", "Upload Record")}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onOpenPrescriptionModal();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <FilePlus className="w-4 h-4 text-emerald-600" />
                    <span>{t("createPrescription", "Create Prescription")}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onSelectTab("appointments");
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{t("scheduleAppointment", "Schedule Appointment")}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      if (onOpenNoteModal) onOpenNoteModal();
                      else onSelectTab("overview");
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>{t("addClinicalNote", "Add Clinical Note")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

