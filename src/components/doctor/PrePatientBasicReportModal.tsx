"use client";

import { useState } from "react";
import {
  FileText,
  AlertTriangle,
  User,
  Heart,
  Calendar,
  Clock,
  Pill,
  ShieldAlert,
  Printer,
  Sparkles,
  CheckCircle2,
  X,
  Eye,
  Activity,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PrePatientBasicReportModalProps {
  appointmentId: string;
  patientName: string;
  patientAgeOrDob?: string | null;
  patientGender?: string | null;
  slotDateTimeFormatted?: string;
  intakeAnswers?: { questionKey: string; answerText: string; section?: string }[];
  intakeStatus?: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export function PrePatientBasicReportModal({
  appointmentId,
  patientName,
  patientAgeOrDob,
  patientGender,
  slotDateTimeFormatted,
  intakeAnswers = [],
  intakeStatus = "NOT_STARTED",
  onClose,
  onRefresh,
}: PrePatientBasicReportModalProps) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState(intakeAnswers);
  const [status, setStatus] = useState(intakeStatus);
  const [populating, setPopulating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Helper to get answer by key
  const getAnswer = (key: string, fallback = "Not reported") => {
    const found = answers.find((a) => a.questionKey === key);
    return found?.answerText?.trim() || fallback;
  };

  const primaryConcern = getAnswer("primary_concern");
  const symptoms = getAnswer("symptoms_list");
  const location = getAnswer("symptom_location");
  const onset = getAnswer("symptom_onset");
  const progression = getAnswer("symptom_progression");
  const severityStr = getAnswer("overall_severity", "0");
  const severityScore = parseInt(severityStr) || 0;
  const hasPain = getAnswer("has_pain", "No");
  const painRating = getAnswer("pain_rating", "0");
  const painScore = parseInt(painRating) || 0;
  const painCharacter = getAnswer("pain_character", "N/A");
  const conditions = getAnswer("existing_conditions", "None known");
  const medications = getAnswer("current_medications", "None reported");
  const allergies = getAnswer("known_allergies", "No known drug allergies");
  const dailyImpact = getAnswer("daily_life_impact", "Minimal impact");
  const patientGoal = getAnswer("consultation_goal", "Understand symptom cause");
  const additionalInfo = getAnswer("additional_info", "None");

  // Allow doctor to auto-populate sample patient intake for instant demonstration if not yet filled
  async function handlePopulateDemoIntake() {
    setPopulating(true);
    setMessage(null);
    try {
      const demoAnswers = [
        { questionKey: "patient_name", questionText: "Patient Name", section: "A", answerText: patientName },
        { questionKey: "patient_gender", questionText: "Gender", section: "A", answerText: patientGender || "Male" },
        {
          questionKey: "primary_concern",
          questionText: "Primary Concern",
          section: "B",
          answerText: "Severe morning headache with neck stiffness and intermittent blurry vision for past 4 days.",
        },
        {
          questionKey: "symptoms_list",
          questionText: "Reported Symptoms",
          section: "C",
          answerText: "Headache, Dizziness / Lightheadedness, Fatigue / Weakness, Neck pain",
        },
        { questionKey: "symptom_location", questionText: "Location", section: "D", answerText: "Head / Face & Upper Neck" },
        { questionKey: "symptom_onset", questionText: "Onset", section: "E", answerText: "4 days ago, worsening each morning" },
        { questionKey: "symptom_progression", questionText: "Progression", section: "F", answerText: "Getting worse" },
        { questionKey: "overall_severity", questionText: "Severity", section: "G", answerText: "8" },
        { questionKey: "has_pain", questionText: "Pain Assessment", section: "H", answerText: "Yes" },
        { questionKey: "pain_rating", questionText: "Pain Rating", section: "H", answerText: "7" },
        { questionKey: "pain_character", questionText: "Pain Character", section: "H", answerText: "Throbbing, Pressure behind eyes" },
        { questionKey: "aggravating_factors", questionText: "Aggravating Factors", section: "I", answerText: "Bending forward, screen glare, bright light" },
        { questionKey: "relieving_factors", questionText: "Relieving Factors", section: "J", answerText: "Resting in a dark room with closed eyes" },
        { questionKey: "existing_conditions", questionText: "Medical Conditions", section: "N", answerText: "Hypertension (diagnosed 2 years ago), Type 2 Diabetes" },
        { questionKey: "current_medications", questionText: "Current Medications", section: "P", answerText: "Metformin 500mg (twice daily), Telmisartan 40mg (morning)" },
        { questionKey: "known_allergies", questionText: "Known Allergies", section: "Q", answerText: "Penicillin (causes urticaria / rash)" },
        { questionKey: "daily_life_impact", questionText: "Daily Life Impact", section: "T", answerText: "Significantly - Unable to attend work or look at computer screen" },
        { questionKey: "consultation_goal", questionText: "Consultation Goal", section: "V", answerText: "Understand cause of severe morning headaches and adjust blood pressure medication if needed" },
        { questionKey: "additional_info", questionText: "Additional Info", section: "W", answerText: "Blood pressure reading checked at home was 148/92 mmHg this morning." },
      ];

      // Submit via intake API
      const res = await fetch(`/api/intake/${appointmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: demoAnswers }),
      });

      if (res.ok) {
        setAnswers(demoAnswers);
        setStatus("COMPLETED");
        setMessage("Pre-patient questionnaire populated! Basic clinical triage report is now fully generated.");
        if (onRefresh) onRefresh();
      } else {
        // Fallback local update
        setAnswers(demoAnswers);
        setStatus("COMPLETED");
      }
    } catch {
      // Fallback local display
      setStatus("COMPLETED");
    } finally {
      setPopulating(false);
    }
  }

  const isIntakeEmpty = answers.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-3xl w-full overflow-hidden text-slate-900 my-auto animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600/30 border border-sky-400 text-sky-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-900/60 text-sky-300 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Pre-Visit Clinical Intake Report (Basic Preview)</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {patientName} &bull; Pre-Consultation Summary
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print basic report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subheader info bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4 text-slate-700 font-semibold">
            <span>
              <strong>Demographics:</strong> {patientGender || "Gender unstated"} • {patientAgeOrDob || "Age unstated"}
            </span>
            {slotDateTimeFormatted && (
              <span>
                <strong>Appointment:</strong> {slotDateTimeFormatted}
              </span>
            )}
          </div>
          <div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              {status === "COMPLETED" ? "✓ Intake Completed" : "⏳ Patient Intake Pending"}
            </span>
          </div>
        </div>

        {message && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {isIntakeEmpty ? (
            /* When Intake Has Not Been Completed Yet */
            <div className="py-8 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-sm font-black text-slate-900">
                  Pre-Patient Questionnaire Not Yet Submitted
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The patient has booked this consultation slot but has not completed the pre-visit
                  questions form yet. You can auto-populate demo responses to review how the basic report
                  displays.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePopulateDemoIntake}
                  disabled={populating}
                  className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md inline-flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{populating ? "Populating Demo Answers..." : "Pre-fill Demo Patient Responses"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Executive 1-Minute Scannable Basic Clinical Report */
            <div className="space-y-5">
              
              {/* 1. Primary Health Concern */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                <span className="text-[10px] font-black text-sky-900 uppercase tracking-wider block">
                  Chief Complaint / Primary Concern
                </span>
                <p className="text-sm font-black text-slate-900 leading-snug">
                  {primaryConcern}
                </p>
              </div>

              {/* 2. Visual Severity & Pain Score Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Overall Severity Score
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {severityScore} / 10
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        severityScore >= 7
                          ? "bg-rose-500"
                          : severityScore >= 4
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(severityScore * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {severityScore >= 7 ? "Severe / High Distress" : severityScore >= 4 ? "Moderate Impact" : "Mild"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Pain Assessment
                    </span>
                    <span className="font-mono font-black text-rose-600 text-sm">
                      {hasPain === "Yes" ? `${painScore} / 10 (${painCharacter})` : "No Pain Reported"}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all"
                      style={{ width: `${hasPain === "Yes" ? Math.min(painScore * 10, 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {hasPain === "Yes" ? `Character: ${painCharacter}` : "Patient denies active pain"}
                  </span>
                </div>
              </div>

              {/* 3. Symptoms, Location, Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Reported Symptoms
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {symptoms.split(",").map((sym, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]"
                      >
                        {sym.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Body Location
                  </span>
                  <p className="font-bold text-slate-900">{location}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Onset & Progression
                  </span>
                  <p className="font-bold text-slate-900">{onset}</p>
                  <p className="text-[10px] text-slate-500">Progression: {progression}</p>
                </div>
              </div>

              {/* 4. Critical Red Flags & Allergies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Allergies Highlight */}
                <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Known Drug Allergies (CRITICAL)</span>
                  </div>
                  <p className="font-black text-rose-950 text-xs">
                    {allergies}
                  </p>
                </div>

                {/* Current Medications */}
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                    <Pill className="w-4 h-4 text-sky-600" />
                    <span>Current Active Medications</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">
                    {medications}
                  </p>
                </div>
              </div>

              {/* 5. Medical History & Daily Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pre-Existing Medical Conditions
                  </span>
                  <p className="font-semibold text-slate-800">{conditions}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Daily Life Impact & Patient Goal
                  </span>
                  <p className="font-semibold text-slate-800">
                    <strong>Impact:</strong> {dailyImpact}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    <strong>Goal:</strong> {patientGoal}
                  </p>
                </div>
              </div>

              {/* Additional notes */}
              {additionalInfo && additionalInfo !== "None" && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                  <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                    Additional Patient Disclosure
                  </strong>
                  <p className="text-xs">{additionalInfo}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <Link
            href={`/doctor/appointments/${appointmentId}`}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
          >
            <span>Open Full Consultation Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
