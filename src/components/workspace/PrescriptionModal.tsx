"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  FilePlus,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  Pill,
  Utensils,
  Ban,
  ShieldCheck,
  Send,
} from "lucide-react";

interface MedicineRow {
  name: string;
  dosage: string;
  form?: string;
  timeOfDay?: string[];
  timingPattern?: string;
  frequency: string;
  duration: string;
  intakeCondition?: string;
  avoid?: string;
  instructions: string;
}

interface PrescriptionModalProps {
  patientId: string;
  patientName: string;
  patientEmail: string;
  onClose: () => void;
  onSuccess: (newRx: any) => void;
  initialDiagnosis?: string;
}

const POPULAR_PRESETS = [
  {
    name: "Metformin HCl (Glycomet)",
    dosage: "500 mg",
    timeOfDay: ["Morning", "Night"],
    timingPattern: "1-0-1",
    frequency: "Twice daily (BD)",
    duration: "30 days",
    intakeCondition: "🍲 After Food (Khane Ke Baad)",
    avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam)",
    instructions: "Renal adjusted dose. Monitor blood sugar.",
  },
  {
    name: "Telmisartan (Telma)",
    dosage: "40 mg",
    timeOfDay: ["Morning"],
    timingPattern: "1-0-0",
    frequency: "Once daily (OD)",
    duration: "30 days",
    intakeCondition: "🍲 After Breakfast",
    avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam)",
    instructions: "Take in morning. Report any dizziness.",
  },
  {
    name: "Atorvastatin (Atorva)",
    dosage: "20 mg",
    timeOfDay: ["Night"],
    timingPattern: "0-0-1",
    frequency: "Once daily Bedtime (HS)",
    duration: "30 days",
    intakeCondition: "🌙 Just Before Sleep",
    avoid: "🚫 Avoid Grapefruit juice & excessive alcohol",
    instructions: "Maintains target lipid levels.",
  },
  {
    name: "Pantoprazole (Pan-40)",
    dosage: "40 mg",
    timeOfDay: ["Morning"],
    timingPattern: "1-0-0",
    frequency: "Once daily (OD)",
    duration: "14 days",
    intakeCondition: "🍽️ Before Food / Empty Stomach (Khali Pet - 30 min pehle)",
    avoid: "🚫 Avoid spicy and fried food on empty stomach",
    instructions: "Take 30 minutes before first meal with plain water.",
  },
  {
    name: "Paracetamol (Dolo 650)",
    dosage: "650 mg",
    timeOfDay: ["Morning", "Evening"],
    timingPattern: "1-0-1",
    frequency: "As Needed (SOS / Max 3 times)",
    duration: "5 days",
    intakeCondition: "🍲 After Food (Khane Ke Baad)",
    avoid: "🚫 Avoid taking with other paracetamol products",
    instructions: "For fever or severe pain only. Minimum 6 hr gap.",
  },
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
];

export function PrescriptionModal({
  patientId,
  patientName,
  patientEmail,
  onClose,
  onSuccess,
  initialDiagnosis,
}: PrescriptionModalProps) {
  const [diagnosis, setDiagnosis] = useState(
    initialDiagnosis || "Type 2 Diabetes Mellitus with early diabetic nephropathy & essential hypertension"
  );
  const [advice, setAdvice] = useState(
    "Ensure adequate hydration (2.5 - 3.0 L/day). Strictly avoid OTC NSAID painkillers (Ibuprofen, Naproxen, Diclofenac). Repeat serum creatinine & electrolytes in 3 weeks."
  );
  const [followUpDate, setFollowUpDate] = useState("In 3 to 4 weeks with repeat renal panel");
  const [sendEmailImmediately, setSendEmailImmediately] = useState(true);

  const [medicines, setMedicines] = useState<MedicineRow[]>([
    {
      name: "Metformin HCl (Glycomet)",
      dosage: "500 mg",
      timeOfDay: ["Morning", "Night"],
      timingPattern: "1-0-1",
      frequency: "Twice daily (BD)",
      duration: "30 days",
      intakeCondition: "🍲 After Food (Khane Ke Baad - 15-30 min baad)",
      avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam)",
      instructions: "Adjusted dose for renal protection",
    },
    {
      name: "Telmisartan (Telma)",
      dosage: "40 mg",
      timeOfDay: ["Morning"],
      timingPattern: "1-0-0",
      frequency: "Once daily morning (OD)",
      duration: "30 days",
      intakeCondition: "🍲 After Food (Khane Ke Baad)",
      avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam)",
      instructions: "After breakfast",
    },
    {
      name: "Atorvastatin (Atorva)",
      dosage: "20 mg",
      timeOfDay: ["Night"],
      timingPattern: "0-0-1",
      frequency: "Once daily bedtime (HS)",
      duration: "30 days",
      intakeCondition: "🌙 Just Before Sleeping",
      avoid: "🚫 Avoid Grapefruit juice & excessive alcohol",
      instructions: "Lipid target maintained",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addMedicineRow() {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "1 tablet",
        timeOfDay: ["Morning"],
        timingPattern: "1-0-0",
        frequency: "Once daily (OD)",
        duration: "14 days",
        intakeCondition: "🍲 After Food (Khane Ke Baad - 15-30 min baad)",
        avoid: "🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam)",
        instructions: "After meals as directed",
      },
    ]);
  }

  function removeMedicineRow(index: number) {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMedicine(index: number, field: keyof MedicineRow, value: any) {
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
      const m = updated.includes("Morning") ? "1" : "0";
      const a = updated.includes("Afternoon") ? "1" : "0";
      const n = updated.includes("Night") || updated.includes("Evening") ? "1" : "0";
      copy[index].timingPattern = `${m}-${a}-${n}`;
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError("Please provide a diagnosis.");
      return;
    }
    if (medicines.some((m) => !m.name.trim())) {
      setError("All medicines must have a valid medication name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          diagnosis,
          medicines,
          advice,
          followUpDate,
          sendEmail: sendEmailImmediately,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate prescription");

      onSuccess(data.prescription);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save prescription");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-3xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-sky-900 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-200 shadow-inner">
              <FilePlus className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-white">Generate Digital e-Prescription (℞)</h3>
              <p className="text-xs text-sky-200">
                Prescribing for: <strong className="text-white">{patientName}</strong> ({patientEmail}) &bull; Directly linked to Patient Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 font-bold shadow-2xs">
              {error}
            </div>
          )}

          {/* Diagnosis */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="font-extrabold text-slate-800 block">
              Clinical Diagnosis &amp; Impression *
            </label>
            <textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs font-semibold"
              placeholder="e.g. Type 2 Diabetes Mellitus with controlled BP..."
            />
          </div>

          {/* Medicines Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                <Pill className="w-4 h-4 text-sky-600" />
                <span>Prescribed Medications ({medicines.length})</span>
              </label>
              <button
                type="button"
                onClick={addMedicineRow}
                className="text-white bg-sky-600 hover:bg-sky-500 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {medicines.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800 text-xs">
                      Drug #{idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          const p = POPULAR_PRESETS.find((item) => item.name === e.target.value);
                          if (p) {
                            setMedicines((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...p };
                              return copy;
                            });
                          }
                        }}
                        defaultValue=""
                        className="px-2 py-0.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 font-bold text-[11px] cursor-pointer"
                      >
                        <option value="" disabled>⚡ Quick Fill...</option>
                        {POPULAR_PRESETS.map((p) => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeMedicineRow(idx)}
                        disabled={medicines.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                        title="Remove Drug"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div className="sm:col-span-8">
                      <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Medicine Name *</label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => updateMedicine(idx, "name", e.target.value)}
                        placeholder="e.g. Tab. Metformin HCl (Glycomet)"
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Dosage / Strength *</label>
                      <input
                        type="text"
                        value={m.dosage}
                        onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                        placeholder="500 mg"
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* What Time of Day */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>What Time of Day?</span>
                      </span>
                      <span className="font-mono font-bold text-sky-800">
                        {m.timingPattern || "1-0-1"}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: "Morning", label: "☀️ Morning" },
                        { key: "Afternoon", label: "🌤️ Noon" },
                        { key: "Evening", label: "🌅 Evening" },
                        { key: "Night", label: "🌙 Bedtime" },
                      ].map((t) => {
                        const sel = m.timeOfDay?.includes(t.key);
                        return (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => toggleTimeOfDay(idx, t.key)}
                            className={`py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                              sel
                                ? "bg-sky-600 text-white border-sky-700"
                                : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Frequency & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Frequency (Kab kab)</label>
                      <input
                        type="text"
                        value={m.frequency}
                        onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
                        placeholder="Twice daily (BD)"
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Duration (Kitne time)</label>
                      <input
                        type="text"
                        value={m.duration}
                        onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                        placeholder="30 days"
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                      />
                    </div>
                  </div>

                  {/* Intake Condition (Empty Stomach / After Food) */}
                  <div>
                    <label className="text-[10.5px] font-bold text-emerald-800 flex items-center gap-1 mb-0.5">
                      <Utensils className="w-3 h-3 text-emerald-600" />
                      <span>Intake Condition (Kiske saath lena hai - Khali pet / Khane ke baad)</span>
                    </label>
                    <select
                      value={m.intakeCondition || INTAKE_OPTIONS[1]}
                      onChange={(e) => updateMedicine(idx, "intakeCondition", e.target.value)}
                      className="w-full p-2 rounded-xl bg-emerald-50/60 border border-emerald-300 text-emerald-950 font-bold text-xs cursor-pointer"
                    >
                      {INTAKE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* What to Avoid */}
                  <div>
                    <label className="text-[10.5px] font-bold text-rose-800 flex items-center gap-1 mb-0.5">
                      <Ban className="w-3 h-3 text-rose-600" />
                      <span>What to Avoid (Kya avoid karna hai)</span>
                    </label>
                    <input
                      type="text"
                      value={m.avoid || ""}
                      onChange={(e) => updateMedicine(idx, "avoid", e.target.value)}
                      placeholder="e.g. 🚫 Avoid OTC Painkillers (NSAIDs: Brufen, Combiflam), Alcohol"
                      className="w-full p-2 rounded-xl bg-rose-50/50 border border-rose-200 text-rose-950 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Specific Directions / Doctor Note</label>
                    <input
                      type="text"
                      value={m.instructions}
                      onChange={(e) => updateMedicine(idx, "instructions", e.target.value)}
                      placeholder="Take with full glass of water"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="font-extrabold text-slate-800 block text-xs">
              General Clinical Advice &amp; Lifestyle Precautions
            </label>
            <textarea
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs shadow-2xs font-medium"
            />
          </div>

          {/* Follow-up & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-800 block text-xs">Follow-Up Date / Next Review</label>
              <input
                type="text"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold"
              />
            </div>

            <div className="flex items-center p-3 rounded-xl bg-teal-50 border border-teal-200">
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

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Issuing &amp; Syncing...</span>
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
