"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  FilePlus,
  CheckCircle2,
  Clock,
  Pill,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Utensils,
  Ban,
  Calendar,
  Send,
  User,
  HeartHandshake,
} from "lucide-react";

export interface PrescriptionMedicineItem {
  name: string;
  dosage: string;
  form: string;
  timeOfDay: string[]; // ["Morning", "Afternoon", "Evening", "Night"]
  timingPattern: string; // e.g. "1-0-1"
  frequency: string; // e.g. "Twice Daily (BD)"
  duration: string; // e.g. "30 Days"
  intakeCondition: string; // e.g. "After Food (Khane Ke Baad)"
  avoid: string; // e.g. "Avoid Painkillers (Brufen/Combiflam), Alcohol"
  instructions: string;
}

interface DoctorCreatePrescriptionModalProps {
  patients: Array<{
    id: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  onClose: () => void;
  onSuccess: (newPrescription: any) => void;
}

const POPULAR_MEDICINE_PRESETS = [
  {
    name: "Metformin HCl (Glycomet)",
    dosage: "500 mg",
    form: "Tablet",
    timeOfDay: ["Morning", "Night"],
    frequency: "Twice Daily (BD)",
    duration: "30 Days",
    intakeCondition: "After Food (Khane Ke Baad)",
    avoid: "Avoid skipping meals, avoid heavy alcohol consumption",
    instructions: "Renal-adjusted dose. Take with a full glass of water.",
  },
  {
    name: "Telmisartan (Telma)",
    dosage: "40 mg",
    form: "Tablet",
    timeOfDay: ["Morning"],
    frequency: "Once Daily (OD)",
    duration: "30 Days",
    intakeCondition: "After Breakfast (Subah Khane Ke Baad)",
    avoid: "Avoid OTC Painkillers (NSAIDs: Brufen/Combiflam), avoid potassium supplements",
    instructions: "Monitor blood pressure weekly. Report any dizziness.",
  },
  {
    name: "Atorvastatin (Atorva)",
    dosage: "20 mg",
    form: "Tablet",
    timeOfDay: ["Night"],
    frequency: "Once Daily Bedtime (HS)",
    duration: "30 Days",
    intakeCondition: "Just Before Sleeping (Sone Se Theek Pehle)",
    avoid: "Avoid Grapefruit juice & excessive alcohol",
    instructions: "Maintains optimal lipid profile and cardiovascular protection.",
  },
  {
    name: "Pantoprazole (Pan-40)",
    dosage: "40 mg",
    form: "Tablet",
    timeOfDay: ["Morning"],
    frequency: "Once Daily (OD)",
    duration: "14 Days",
    intakeCondition: "Before Food / Empty Stomach (Khali Pet - 30 min pehle)",
    avoid: "Avoid spicy, fried food, and caffeine on empty stomach",
    instructions: "Swallow whole with plain water 30 minutes before first meal.",
  },
  {
    name: "Glimepiride (Amaryl)",
    dosage: "1 mg",
    form: "Tablet",
    timeOfDay: ["Morning"],
    frequency: "Once Daily (OD)",
    duration: "30 Days",
    intakeCondition: "Immediately Before Breakfast (Nashte Se 5 Min Pehle)",
    avoid: "Avoid fasting or delaying breakfast after taking tablet",
    instructions: "Carry sugar sweets in case of hypoglycemia symptoms.",
  },
  {
    name: "Paracetamol (Dolo 650)",
    dosage: "650 mg",
    form: "Tablet",
    timeOfDay: ["Morning", "Evening"],
    frequency: "As Needed (SOS / Max 3 times)",
    duration: "5 Days",
    intakeCondition: "After Food (Khane Ke Baad)",
    avoid: "Avoid taking with other paracetamol products, avoid alcohol",
    instructions: "Maintain at least 6-hour gap between doses. For fever/pain only.",
  },
  {
    name: "Amoxicillin + Clavulanic Acid (Augmentin)",
    dosage: "625 mg",
    form: "Tablet",
    timeOfDay: ["Morning", "Night"],
    frequency: "Twice Daily (BD)",
    duration: "7 Days",
    intakeCondition: "With Food / Meal (Khana Khate Samay)",
    avoid: "Do not stop course early even if feeling better",
    instructions: "Complete the full 7-day course. Take with light meal to avoid stomach upset.",
  },
];

const COMMON_DIAGNOSES = [
  "Type 2 Diabetes Mellitus with Essential Hypertension & Dyslipidemia",
  "Early Diabetic Nephropathy Stage 3 (Renal Trajectory Shift)",
  "Acute Upper Respiratory Tract Infection (URTI) with Bronchitis",
  "Dyslipidemia with High Cardiovascular Risk",
  "Gastroesophageal Reflux Disease (GERD) with Mild Gastritis",
  "Hypertensive Urgency / Blood Pressure Fluctuation Follow-Up",
];

const INTAKE_OPTIONS = [
  "🍽️ Before Food / Empty Stomach (Khali Pet - 30 min pehle)",
  "🍲 After Food (Khane Ke Baad - 15-30 min baad)",
  "🥪 With Food / Meal (Khana Khate Samay)",
  "🥛 With Warm Milk / Water (Gungune Doodh ya Paani Ke Saath)",
  "🌙 Just Before Sleeping (Sone Se Theek Pehle)",
  "⚡ Anytime / Without Food Constraint (Kabhi Bhi)",
];

const AVOID_OPTIONS = [
  "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam, Diclofenac)",
  "🚫 Avoid Alcohol & Grapefruit Juice",
  "🚫 Avoid High Sodium / Salt, Pickles & Papads",
  "🚫 Avoid High Potassium Foods (Bananas, Coconut Water)",
  "🚫 Avoid Skipping Meals / Prolonged Fasting",
  "🚫 Avoid Heavy Driving / Direct Sun Exposure",
];

const FREQUENCY_OPTIONS = [
  "Once Daily (OD - 1 bar roz)",
  "Twice Daily (BD - 2 bar roz)",
  "Thrice Daily (TDS - 3 bar roz)",
  "Four times Daily (QID - 4 bar roz)",
  "Every 8 Hours",
  "Every 12 Hours",
  "Alternate Days (QOD)",
  "Once Weekly (QW)",
  "As Needed (SOS / PRN - Jab zaroorat ho)",
];

const DURATION_OPTIONS = [
  "3 Days",
  "5 Days",
  "7 Days",
  "10 Days",
  "14 Days",
  "1 Month (30 Days)",
  "2 Months (60 Days)",
  "3 Months (90 Days)",
  "Chronic / Ongoing (Niyamit)",
];

function calculateTimingPattern(times: string[]): string {
  const m = times.includes("Morning") ? "1" : "0";
  const a = times.includes("Afternoon") ? "1" : "0";
  const n = times.includes("Night") || times.includes("Evening") ? "1" : "0";
  return `${m}-${a}-${n}`;
}

export function DoctorCreatePrescriptionModal({
  patients,
  onClose,
  onSuccess,
}: DoctorCreatePrescriptionModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || ""
  );

  const [diagnosis, setDiagnosis] = useState<string>(
    "Type 2 Diabetes Mellitus with Essential Hypertension & Renal Trajectory Shift"
  );

  const [advice, setAdvice] = useState<string>(
    "Hydration: Drink 2.5 to 3.0 liters of plain water daily. Adhere strictly to low-sodium (<2g/day) & low-carbohydrate diabetic diet. Do not consume OTC pain relievers (Ibuprofen, Diclofenac) without prior consultation."
  );

  const [followUpDate, setFollowUpDate] = useState<string>(
    "In 3 to 4 weeks with repeat renal panel (Serum Creatinine & Electrolytes)"
  );

  const [sendEmailImmediately, setSendEmailImmediately] = useState<boolean>(true);
  const [syncWithPatientPortal, setSyncWithPatientPortal] = useState<boolean>(true);

  const [medicines, setMedicines] = useState<PrescriptionMedicineItem[]>([
    {
      name: "Metformin HCl (Glycomet)",
      dosage: "500 mg",
      form: "Tablet",
      timeOfDay: ["Morning", "Night"],
      timingPattern: "1-0-1",
      frequency: "Twice Daily (BD - 2 bar roz)",
      duration: "1 Month (30 Days)",
      intakeCondition: "🍲 After Food (Khane Ke Baad - 15-30 min baad)",
      avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam, Diclofenac)",
      instructions: "Renal adjusted dose. Monitor blood sugar.",
    },
    {
      name: "Telmisartan (Telma)",
      dosage: "40 mg",
      form: "Tablet",
      timeOfDay: ["Morning"],
      timingPattern: "1-0-0",
      frequency: "Once Daily (OD - 1 bar roz)",
      duration: "1 Month (30 Days)",
      intakeCondition: "🍲 After Food (Khane Ke Baad - 15-30 min baad)",
      avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam, Diclofenac)",
      instructions: "Take after breakfast. Report any dizziness.",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addMedicineRow() {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "1 Tab",
        form: "Tablet",
        timeOfDay: ["Morning"],
        timingPattern: "1-0-0",
        frequency: "Once Daily (OD - 1 bar roz)",
        duration: "14 Days",
        intakeCondition: "🍲 After Food (Khane Ke Baad - 15-30 min baad)",
        avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam, Diclofenac)",
        instructions: "Take as directed with water",
      },
    ]);
  }

  function removeMedicineRow(index: number) {
    if (medicines.length <= 1) {
      alert("At least one medicine is required on a digital prescription.");
      return;
    }
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMedicineField(
    index: number,
    field: keyof PrescriptionMedicineItem,
    value: any
  ) {
    setMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function toggleTimeOfDay(index: number, timeStr: string) {
    setMedicines((prev) => {
      const copy = [...prev];
      const current = copy[index].timeOfDay || [];
      const updated = current.includes(timeStr)
        ? current.filter((t) => t !== timeStr)
        : [...current, timeStr];
      copy[index].timeOfDay = updated;
      copy[index].timingPattern = calculateTimingPattern(updated);
      return copy;
    });
  }

  function applyPreset(index: number, preset: (typeof POPULAR_MEDICINE_PRESETS)[0]) {
    setMedicines((prev) => {
      const copy = [...prev];
      copy[index] = {
        name: preset.name,
        dosage: preset.dosage,
        form: preset.form,
        timeOfDay: preset.timeOfDay,
        timingPattern: calculateTimingPattern(preset.timeOfDay),
        frequency: preset.frequency,
        duration: preset.duration,
        intakeCondition: preset.intakeCondition,
        avoid: preset.avoid,
        instructions: preset.instructions,
      };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatientId) {
      setError("Please select a patient.");
      return;
    }
    if (!diagnosis.trim()) {
      setError("Please specify a clinical diagnosis.");
      return;
    }
    if (medicines.some((m) => !m.name.trim())) {
      setError("Every medicine must have a valid medication name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          diagnosis,
          medicines,
          advice,
          followUpDate,
          sendEmail: sendEmailImmediately,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to issue prescription");
      }

      onSuccess(data.prescription);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-4xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-sky-900 via-sky-800 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-200 shadow-inner">
              <FilePlus className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Issue Digital Prescription (℞)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Direct Portal Sync
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Directly links to Patient Portal, updates active medicines &amp; adds timeline milestone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 font-bold flex items-center gap-2 shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Patient Selector & Diagnosis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
            {/* Patient Dropdown */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>Select Patient *</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/30 focus:border-sky-600 transition-all shadow-2xs cursor-pointer text-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user.name} ({p.user.email})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Prescription will appear instantly in this patient&apos;s account.
              </p>
            </div>

            {/* Diagnosis Input */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between text-xs">
                <span>Clinical Diagnosis *</span>
                <span className="text-[10.5px] text-sky-700 font-bold">ICD-10 Aligned</span>
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Type 2 Diabetes Mellitus with Essential Hypertension"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/30 focus:border-sky-600 transition-all shadow-2xs text-xs"
              />
              {/* Quick diagnosis chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_DIAGNOSES.slice(0, 3).map((diag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDiagnosis(diag)}
                    className="px-2 py-0.5 rounded-lg bg-slate-200/80 hover:bg-sky-100 text-[10px] text-slate-700 hover:text-sky-800 font-medium transition-colors cursor-pointer"
                  >
                    + {diag.split(" ")[0]} {diag.split(" ")[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. MEDICINES BUILDER WITH RICH DROPDOWNS & CONTROLS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-serif font-black">
                  ℞
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Prescribed Medications ({medicines.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={addMedicineRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Medicine Rows */}
            <div className="space-y-4">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="p-4.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-300 shadow-2xs space-y-4 transition-all relative"
                >
                  {/* Row Header with Quick Preset Selector & Delete */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10.5px]">
                        {index + 1}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs">
                        Medicine Details
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Popular Preset Dropdown */}
                      <select
                        onChange={(e) => {
                          const found = POPULAR_MEDICINE_PRESETS.find(
                            (p) => p.name === e.target.value
                          );
                          if (found) applyPreset(index, found);
                        }}
                        defaultValue=""
                        className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 font-bold text-[11px] cursor-pointer"
                      >
                        <option value="" disabled>
                          ⚡ Auto-fill Popular Drug...
                        </option>
                        {POPULAR_MEDICINE_PRESETS.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} ({p.dosage})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeMedicineRow(index)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Grid: Name, Dosage, Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6 space-y-1">
                      <label className="font-bold text-slate-700 text-[11px] block">
                        Medicine Name &amp; Generic Brand *
                      </label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedicineField(index, "name", e.target.value)}
                        placeholder="e.g. Tab. Metformin HCl (Glycomet)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs shadow-2xs"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="font-bold text-slate-700 text-[11px] block">
                        Strength / Dose *
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedicineField(index, "dosage", e.target.value)}
                        placeholder="e.g. 500 mg / 1 Tab"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs shadow-2xs"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="font-bold text-slate-700 text-[11px] block">
                        Dosage Form
                      </label>
                      <select
                        value={med.form}
                        onChange={(e) => updateMedicineField(index, "form", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-sky-500 text-xs shadow-2xs cursor-pointer"
                      >
                        <option value="Tablet">Tablet (Tab)</option>
                        <option value="Capsule">Capsule (Cap)</option>
                        <option value="Syrup">Syrup / Suspension</option>
                        <option value="Drops">Eye/Ear Drops</option>
                        <option value="Injection">Injection / Pen</option>
                        <option value="Inhaler">Inhaler / Rotacap</option>
                      </select>
                    </div>
                  </div>

                  {/* Secondary Controls: What Time of Day (Interactive Chips) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>What Time of Day? (Dose Schedule)</span>
                      </label>
                      <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800">
                        Pattern: {med.timingPattern || "1-0-1"}
                      </span>
                    </div>

                    {/* Time Of Day Toggles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: "Morning", label: "☀️ Morning (Subah)" },
                        { key: "Afternoon", label: "🌤️ Afternoon (Dopahar)" },
                        { key: "Evening", label: "🌅 Evening (Shaam)" },
                        { key: "Night", label: "🌙 Bedtime (Raat)" },
                      ].map((t) => {
                        const isSelected = med.timeOfDay?.includes(t.key);
                        return (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => toggleTimeOfDay(index, t.key)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-sky-600 text-white border-sky-700 shadow-xs font-black"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Third Row: Frequency & Duration ("kab kab kitne time") */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 text-[11px] block">
                        Frequency (Kab kab lena hai) *
                      </label>
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedicineField(index, "frequency", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-sky-500 text-xs shadow-2xs cursor-pointer"
                      >
                        {FREQUENCY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 text-[11px] block">
                        Duration (Kitne time tak lena hai) *
                      </label>
                      <select
                        value={med.duration}
                        onChange={(e) => updateMedicineField(index, "duration", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-sky-500 text-xs shadow-2xs cursor-pointer"
                      >
                        {DURATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fourth Row: Intake Timing / Condition ("kiske saath like empty stomach vagera") */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Meal Timing &amp; Intake Condition (Kiske saath lena hai) *</span>
                    </label>
                    <select
                      value={med.intakeCondition}
                      onChange={(e) => updateMedicineField(index, "intakeCondition", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 font-bold text-emerald-950 focus:border-emerald-600 text-xs shadow-2xs cursor-pointer"
                    >
                      {INTAKE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fifth Row: What to Avoid ("aur kya avoid karo") */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-rose-700">
                        <Ban className="w-3.5 h-3.5 text-rose-600" />
                        <span>Precautions: What to Avoid (Kya avoid karna hai)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Contraindications &amp; food/drug interactions
                      </span>
                    </label>

                    <div className="space-y-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const current = med.avoid || "";
                            const addition = e.target.value;
                            updateMedicineField(
                              index,
                              "avoid",
                              current ? `${current}; ${addition}` : addition
                            );
                          }
                        }}
                        defaultValue=""
                        className="w-full px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/40 font-semibold text-rose-950 focus:border-rose-400 text-xs cursor-pointer"
                      >
                        <option value="" disabled>
                          + Select Popular Precaution to Avoid...
                        </option>
                        {AVOID_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={med.avoid}
                        onChange={(e) => updateMedicineField(index, "avoid", e.target.value)}
                        placeholder="e.g. Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam), Avoid Alcohol, Avoid Grapefruit"
                        className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white font-medium text-slate-900 focus:border-rose-500 text-xs shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Sixth Row: Additional Instructions */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-[11px] block">
                      Specific Patient Instructions / Doctor Note
                    </label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => updateMedicineField(index, "instructions", e.target.value)}
                      placeholder="e.g. Swallow whole with 1 glass water, do not chew or crush."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs shadow-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. General Clinical Advice & Lifestyle Guidelines */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="font-extrabold text-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                <span>General Clinical Advice &amp; Lifestyle Directives</span>
              </span>
            </label>
            <textarea
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
              placeholder="e.g. Drink 2.5 to 3 liters of water, restrict dietary salt, 20 min morning walk..."
            />
          </div>

          {/* 4. Follow-Up Schedule & Sync Directives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Follow-Up Appointment / Review</span>
              </label>
              <input
                type="text"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                placeholder="e.g. In 3 weeks with repeat Serum Creatinine & eGFR"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs shadow-2xs"
              />
            </div>

            <div className="space-y-2 p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-950 text-xs">
                <input
                  type="checkbox"
                  checked={syncWithPatientPortal}
                  onChange={(e) => setSyncWithPatientPortal(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                <span>Direct Link &amp; Sync to Patient Portal</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-950 text-xs">
                <input
                  type="checkbox"
                  checked={sendEmailImmediately}
                  onChange={(e) => setSendEmailImmediately(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                <span>Email Official Signed Slip to Patient</span>
              </label>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Issuing &amp; Linking to Portal...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Issue Digital Prescription &amp; Sync</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
