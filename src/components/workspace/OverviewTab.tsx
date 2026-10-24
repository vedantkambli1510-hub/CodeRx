"use client";

import {
  FileText,
  Calendar,
  Pill,
  GitCompare,
  ArrowRight,
  Sparkles,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface OverviewTabProps {
  patient: {
    id: string;
    fullName: string;
    dob: string | null;
    gender: string | null;
    bloodGroup: string | null;
    allergies: string | null;
    conditions: string | null;
    currentMedications: string | null;
    nextAppointmentDate?: string;
  };
  records: any[];
  timelines: any[];
  medicines: any[];
  onSelectTab: (tabKey: string) => void;
  onOpenPrescriptionModal?: () => void;
  onOpenReportModal: (report: any) => void;
}

export function OverviewTab({
  patient,
  records,
  timelines,
  medicines,
  onSelectTab,
  onOpenReportModal,
}: OverviewTabProps) {
  const { language, t } = useLanguage();

  // Only active medicines (Section 14)
  const activeMedicines = medicines.filter(
    (m) => m.status === "CURRENT" || m.status === "RECENTLY_ADDED"
  );

  // Latest 3 records (Section 14)
  const recentRecords = records.slice(0, 3);

  const isRajesh = patient.fullName.includes("Rajesh");

  return (
    <div className="space-y-6 max-w-5xl text-slate-900">
      {/* 1. PATIENT SUMMARY (Short per Section 14) */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t("patientSummaryTitle", "Patient Summary")}
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {isRajesh ? (
            language === "hi" ? (
              <>
                <strong className="font-semibold text-slate-900">{patient.fullName}</strong> टाइप 2 डायबिटीज मेलिटस (2021 में निदान), प्राथमिक उच्च रक्तचाप, स्टेज 2 क्रोनिक किडनी रोग के ज्ञात मरीज़ हैं जो निरंतर अनुवर्ती जांच में हैं। रक्त शर्करा नियंत्रण में सुधार हो रहा है (HbA1c 7.1%), लेकिन हालिया मेटाबॉलिक जांच में सीरम क्रिएटिनिन 1.0 से बढ़कर 1.7 mg/dL (eGFR 46 mL/min) पाया गया है, जिसके लिए दवाओं की समीक्षा आवश्यक है।
              </>
            ) : (
              <>
                <strong className="font-semibold text-slate-900">{patient.fullName}</strong>, 58M with Type 2 Diabetes Mellitus (dx 2021), primary hypertension, and Stage 2 Chronic Kidney Disease presenting for longitudinal follow-up. Glycemic control is improving (HbA1c 7.1%), but recent metabolic panels indicate acute renal progression with serum creatinine elevated to 1.7 mg/dL (eGFR 46 mL/min), warranting medication reconciliation and clinical re-evaluation.
              </>
            )
          ) : (
            <>
              <strong className="font-semibold text-slate-900">{patient.fullName}</strong>{" "}
              {patient.conditions || "No recorded chronic conditions"}.{" "}
              {patient.allergies ? `Known allergies: ${patient.allergies}.` : "No known drug allergies reported."}
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. CURRENT MEDICINES (Only active medicines, View Full History per Section 14) */}
        <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">{t("currentMedicines", "Current Medicines")}</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {activeMedicines.length} {t("active", "Active")}
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {activeMedicines.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">{t("noActiveMedications", "No active medications currently prescribed.")}</p>
              ) : (
                activeMedicines.map((med) => (
                  <div
                    key={med.id}
                    className="p-3 rounded-xl bg-white border border-slate-300 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{med.medicineName}</span>
                      <span className="text-slate-500 ml-1.5 font-medium">{med.strength || med.dosage}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{med.frequency}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {t("active", "Active")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectTab("medicines")}
            className="w-full pt-3 border-t border-slate-300 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center justify-center gap-1 transition-colors"
          >
            <span>{t("viewFullHistory", "View Full History")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. LATEST AI REVIEW & NEXT APPOINTMENT (Section 14) */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Latest AI Review Card */}
          <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">{t("latestAiReview", "Latest AI Review")}</h3>
              </div>
              <span className="text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{t("changesDetected", "3 changes detected")}</span>
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {language === "hi" ? (
                <>15 जनवरी 2024 (आधारभूत) और 18 जुलाई 2024 (फॉलो-अप) की तुलना में: HbA1c में सुधार (-1.3%), क्रिएटिनिन में वृद्धि (+70%), और लगातार एल्बुमिनुरिया देखा गया।</>
              ) : (
                <>Comparison between <strong className="text-slate-900 font-semibold">15 Jan 2024</strong> (Baseline) and <strong className="text-slate-900 font-semibold">18 Jul 2024</strong> (Follow-up) shows: HbA1c improved (-1.3%), Creatinine elevated (+70%), and persistent Albuminuria.</>
              )}
            </p>

            <button
              onClick={() => onSelectTab("what-changed")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-xs"
            >
              <GitCompare className="w-4 h-4" />
              <span>{t("viewWhatChanged", "View What Changed")}</span>
            </button>
          </div>

          {/* Next Appointment Card (Section 14) */}
          <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-300">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">{t("nextAppointment", "Next Appointment")}</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {patient.nextAppointmentDate || (language === "hi" ? "आज, सुबह 10:00 बजे" : "Today, 10:00 AM")}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("followupConsultation", "Follow-up Consultation • Dr. Aarav Mehta")}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {t("confirmed", "Confirmed")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT RECORDS (Latest 3, View All per Section 14) */}
      <div className="bg-slate-100/95 p-5 rounded-2xl border border-slate-300 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">{t("recentRecords", "Recent Records")}</h3>
          </div>
          <button
            onClick={() => onSelectTab("records")}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>{t("viewAll", "View All")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-200">
          {recentRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenReportModal(rec)}
              className="py-3 flex items-center justify-between hover:bg-slate-200/60 rounded-xl px-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 border border-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
                  PDF
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 hover:text-sky-600 transition-colors">
                    {rec.reportName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>
                      {rec.reportDate
                        ? new Date(rec.reportDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{t("extractedStructured", "Extracted & Structured")}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1">
                <span>{t("view", "View")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
