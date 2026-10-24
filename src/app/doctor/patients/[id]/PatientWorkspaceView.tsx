"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  FileText,
  GitCompare,
  Pill,
  FileCheck2,
  Sparkles,
  Clock,
  User,
  Plus,
  CheckCircle2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { PatientHeader } from "@/components/workspace/PatientHeader";
import { OverviewTab } from "@/components/workspace/OverviewTab";
import { TimelineTab } from "@/components/workspace/TimelineTab";
import { ReportsTab } from "@/components/workspace/ReportsTab";
import { WhatChangedTab } from "@/components/workspace/WhatChangedTab";
import { MedicinesTab } from "@/components/workspace/MedicinesTab";
import { PrescriptionsTab } from "@/components/workspace/PrescriptionsTab";
import { AIBriefTab } from "@/components/workspace/AIBriefTab";
import { DoctorFamilyCohortSection } from "@/components/workspace/DoctorFamilyCohortSection";
import { PrescriptionModal } from "@/components/workspace/PrescriptionModal";
import { ReportModal } from "@/components/workspace/ReportModal";
import { WhatChangedComparison, DoctorBrief } from "@/lib/ai/differentials";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PatientWorkspaceViewProps {
  patient: any;
  records: any[];
  timelines: any[];
  medicines: any[];
  prescriptions: any[];
  appointments: any[];
  comparison: WhatChangedComparison;
  brief: DoctorBrief;
}

export function PatientWorkspaceView({
  patient,
  records,
  timelines,
  medicines,
  prescriptions: initialPrescriptions,
  appointments,
  comparison,
  brief,
}: PatientWorkspaceViewProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [workspaceMedicines, setWorkspaceMedicines] = useState<any[]>(medicines);
  const [prescriptions, setPrescriptions] = useState<any[]>(initialPrescriptions);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prefilledDiagnosis, setPrefilledDiagnosis] = useState<string | undefined>(undefined);
  const [selectedReportModal, setSelectedReportModal] = useState<any | null>(null);

  const isRajesh = patient?.user?.name?.includes("Rajesh");

  // Tabs matching Section 13 exactly + Family Cohort
  const tabs = [
    { id: "overview", label: t("overview", "Overview"), icon: LayoutDashboard, badge: null },
    {
      id: "timeline",
      label: t("timeline", "Timeline"),
      icon: Clock,
      badge: `${timelines.length}`,
    },
    {
      id: "records",
      label: t("records", "Records"),
      icon: FileText,
      badge: `${records.length}`,
    },
    {
      id: "what-changed",
      label: t("whatChanged", "WHAT CHANGED?"),
      icon: GitCompare,
      badge: comparison.criticalAlertCount > 0 ? `${comparison.criticalAlertCount} ${t("alerts", "Alerts")}` : t("verified", "Verified"),
      badgeColor: "bg-red-100 text-red-700 animate-pulse font-bold",
      highlight: true,
    },
    {
      id: "family-cohort",
      label: "Family Cohort (4)",
      icon: Users,
      badge: "Family Pass",
      badgeColor: "bg-teal-100 text-teal-800 border border-teal-300 font-bold",
    },
    {
      id: "medicines",
      label: t("medicines", "Medicines"),
      icon: Pill,
      badge: `${workspaceMedicines.length}`,
    },
    {
      id: "prescriptions",
      label: t("prescriptions", "Prescriptions"),
      icon: FileCheck2,
      badge: `${prescriptions.length}`,
    },
    {
      id: "appointments",
      label: t("appointments", "Appointments"),
      icon: Calendar,
      badge: `${appointments.length}`,
    },
    {
      id: "ai-brief",
      label: t("aiDoctorBrief", "AI Doctor Brief"),
      icon: Sparkles,
      badge: "1-Page",
      badgeColor: "bg-indigo-100 text-indigo-700 font-bold",
    },
  ];

  function handleOpenReportByRecordId(recordId: string) {
    const rec = records.find((r) => r.id === recordId);
    if (rec) {
      setSelectedReportModal(rec);
    }
  }

  function handlePrescriptionCreated(newPrescription: any) {
    setPrescriptions((prev) => [newPrescription, ...prev]);
    setIsPrescriptionModalOpen(false);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Link
          href="/doctor/patients"
          className="hover:text-sky-600 transition-colors flex items-center gap-1 font-medium"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{t("patientDirectory", "Patient Directory")}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{patient.user.name}</span>
        <span>/</span>
        <span className="text-sky-600 font-mono font-bold">{t("workspace", "Workspace")}</span>
      </div>

      {/* Sharma Family Unit Doctor Notification Banner */}
      {isRajesh && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-teal-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">
                  Sharma Family Health Unit (4 Members Linked)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                  CodeRx Family Pass Active
                </span>
              </div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                Enrolled: <strong>Rajesh (Self, 52)</strong>, <strong>Sunita (Wife, 48)</strong>, <strong>Rohan (Son, 21)</strong>, <strong>Kamla (Mother, 76)</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("family-cohort")}
            className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Family Cohort Tab</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Patient Header Component */}
      <PatientHeader
        patient={{
          id: patient.id,
          fullName: patient.user.name,
          dob: patient.dob,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          allergies: patient.allergies,
          conditions: patient.conditions,
          currentMedications: patient.currentMedications,
          lastConsultationDate: "Apr 5, 2024",
          nextAppointmentDate: appointments[0]
            ? new Date(appointments[0].slot?.startTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Today, 10:00 AM",
        }}
        onSelectTab={setActiveTab}
        onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
        onOpenUploadModal={() => setActiveTab("records")}
        hasItemsRequiringReview={comparison.criticalAlertCount > 0}
      />

      {/* Workspace Tabs Navigation Bar */}
      <div className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? tab.highlight
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-teal-600 text-white shadow-xs"
                  : tab.highlight
                  ? "text-rose-700 hover:bg-rose-100 bg-rose-50 border border-rose-200"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : tab.highlight ? "text-rose-600" : "text-slate-500"
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive
                      ? "bg-white/25 text-white"
                      : tab.badgeColor || "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            patient={{
              id: patient.id,
              fullName: patient.user.name,
              dob: patient.dob,
              gender: patient.gender,
              bloodGroup: patient.bloodGroup,
              allergies: patient.allergies,
              conditions: patient.conditions,
              currentMedications: patient.currentMedications,
              nextAppointmentDate: appointments[0]
                ? new Date(appointments[0].slot?.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Today, 10:00 AM",
            }}
            records={records}
            timelines={timelines}
            medicines={workspaceMedicines}
            onSelectTab={setActiveTab}
            onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
            onOpenReportModal={(r) => setSelectedReportModal(r)}
          />
        )}

        {activeTab === "timeline" && (
          <TimelineTab
            timelines={timelines}
            onOpenReportModal={handleOpenReportByRecordId}
          />
        )}

        {activeTab === "records" && (
          <ReportsTab
            records={records}
            onSelectTab={setActiveTab}
            onOpenReportModal={(r) => setSelectedReportModal(r)}
          />
        )}

        {activeTab === "what-changed" && (
          <WhatChangedTab comparison={comparison} />
        )}

        {activeTab === "family-cohort" && (
          <DoctorFamilyCohortSection patient={patient} />
        )}

        {activeTab === "medicines" && (
          <MedicinesTab
            medicines={workspaceMedicines}
            onMedicinesChange={setWorkspaceMedicines}
            onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
          />
        )}

        {activeTab === "prescriptions" && (
          <PrescriptionsTab
            prescriptions={prescriptions}
            patientEmail={patient.user.email}
            onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
          />
        )}

        {activeTab === "appointments" && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Patient Consultation Appointments ({appointments.length})
                </h3>
              </div>
              <Link
                href="/doctor/appointments"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-xs"
              >
                Schedule Next Appointment
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80">
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No appointments scheduled for this patient.
                </p>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-400 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {new Date(apt.slot?.startTime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {new Date(apt.slot?.startTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(apt.slot?.endTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                        <span>Automated Reminder Active</span>
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                        {apt.status}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        Payment: {apt.paymentStatus || "PAID"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "ai-brief" && (
          <AIBriefTab
            brief={brief}
            patientName={patient.user.name}
            patientId={patient.id}
            patientConditions={patient.conditions}
            onOpenPrescriptionModal={(diag) => {
              if (diag) setPrefilledDiagnosis(diag);
              setIsPrescriptionModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Prescription Creation Modal */}
      {isPrescriptionModalOpen && (
        <PrescriptionModal
          patientId={patient.id}
          patientName={patient.user.name}
          patientEmail={patient.user.email}
          initialDiagnosis={prefilledDiagnosis}
          onClose={() => setIsPrescriptionModalOpen(false)}
          onSuccess={handlePrescriptionCreated}
        />
      )}

      {/* Report Modal */}
      {selectedReportModal && (
        <ReportModal
          record={selectedReportModal}
          onClose={() => setSelectedReportModal(null)}
        />
      )}
    </div>
  );
}
