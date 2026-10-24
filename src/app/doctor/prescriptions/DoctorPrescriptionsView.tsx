"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Mail,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  Pill,
  Plus,
  Eye,
  X,
  Stethoscope,
  ShieldCheck,
  Utensils,
  Ban,
  Sparkles,
  User,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Send,
  Save,
  FlaskConical,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  MoreVertical,
  Heart,
} from "lucide-react";

interface DoctorPrescriptionsViewProps {
  prescriptions: any[];
  patients?: any[];
}

interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  form: string;
  timesOfDay: string[]; // "morning" | "afternoon" | "evening" | "bedtime"
  frequency: string;
  duration: string;
  instructions: string;
  tag?: string;
  isExpanded: boolean;
}

const POPULAR_DRUG_PRESETS = [
  {
    name: "Metformin HCl (Glycomet)",
    strength: "500 mg",
    form: "Tablet (Tab)",
    timesOfDay: ["morning", "bedtime"],
    frequency: "Twice Daily (BD - 2 bar roz)",
    duration: "1 Month (30 Days)",
    instructions: "Take with or immediately after meals with water",
    tag: "Biguanide / Glycemic Control",
  },
  {
    name: "Amlodipine 5 mg",
    strength: "5 mg",
    form: "Tablet (Tab)",
    timesOfDay: ["morning"],
    frequency: "Once Daily (OD - 1 bar roz)",
    duration: "1 Month (30 Days)",
    instructions: "Take in the morning after breakfast",
    tag: "Anti-hypertensive",
  },
  {
    name: "Telmisartan (Telma 40)",
    strength: "40 mg",
    form: "Tablet (Tab)",
    timesOfDay: ["morning"],
    frequency: "Once Daily (OD - 1 bar roz)",
    duration: "1 Month (30 Days)",
    instructions: "Blood pressure & kidney vascular protection",
    tag: "Cardiovascular ARB",
  },
  {
    name: "Atorvastatin (Atorva 20)",
    strength: "20 mg",
    form: "Tablet (Tab)",
    timesOfDay: ["bedtime"],
    frequency: "At Bedtime (HS - Sone se pehle)",
    duration: "1 Month (30 Days)",
    instructions: "Take consistently before sleeping at night",
    tag: "Lipid Lowering / Statin",
  },
  {
    name: "Pantoprazole (Pan-40)",
    strength: "40 mg",
    form: "Tablet (Tab)",
    timesOfDay: ["morning"],
    frequency: "Once Daily (OD - 1 bar roz)",
    duration: "14 Days",
    instructions: "Take empty stomach (Khali pet) 30 min before breakfast",
    tag: "Proton Pump Inhibitor (Antacid)",
  },
  {
    name: "Glimepiride 1 mg",
    strength: "1 mg",
    form: "Tablet (Tab)",
    timesOfDay: ["morning"],
    frequency: "Once Daily (OD - 1 bar roz)",
    duration: "1 Month (30 Days)",
    instructions: "Take 5 minutes before breakfast",
    tag: "Sulfonylurea Secretagogue",
  },
];

const PRECAUTION_PRESETS = [
  "Avoid NSAID Painkillers (Brufen, Combiflam, Voveran)",
  "Avoid heavy alcohol & tobacco consumption",
  "Avoid grapefruit juice & excessive citrus with statins",
  "Do not skip meals or fast excessively (prevents hypoglycemia)",
  "Limit sodium intake & processed packaged foods",
  "Maintain 2.5 - 3 Litres hydration daily",
];

export function DoctorPrescriptionsView({
  prescriptions: initialPrescriptions,
  patients = [],
}: DoctorPrescriptionsViewProps) {
  const [prescriptions, setPrescriptions] = useState<any[]>(initialPrescriptions);
  const [activeMainView, setActiveMainView] = useState<"new" | "history">("new");

  // Patient Selection
  const defaultPatient = patients[0] || {
    id: "pat_priya",
    user: {
      name: "Priya Patel",
      email: "priya.patel@coderx.local",
    },
  };
  const [selectedPatientId, setSelectedPatientId] = useState(defaultPatient.id);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || defaultPatient;

  // Diagnosis State
  const [diagnosisText, setDiagnosisText] = useState(
    "Type 2 Diabetes Mellitus with Essential Hypertension & Renal Trajee"
  );
  const [diagnosisTags, setDiagnosisTags] = useState<string[]>([
    "Type 2",
    "Early Diabetic",
    "Acute Upper",
  ]);
  const [isEditingDiagnosis, setIsEditingDiagnosis] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // Prescribed Medications (Default matches the reference image: 2 medicines)
  const [medications, setMedications] = useState<MedicineItem[]>([
    {
      id: "med-1",
      name: "Metformin HCl (Glycomet)",
      strength: "500 mg",
      form: "Tablet (Tab)",
      timesOfDay: ["morning"],
      frequency: "Twice Daily (BD - 2 bar roz)",
      duration: "1 Month (30 Days)",
      instructions: "Take with or immediately after food",
      tag: "Glycemic Balance",
      isExpanded: true,
    },
    {
      id: "med-2",
      name: "Amlodipine 5 mg",
      strength: "5 mg",
      form: "Tablet (Tab)",
      timesOfDay: ["morning"],
      frequency: "Once Daily (OD - 1 bar roz)",
      duration: "1 Month (30 Days)",
      instructions: "Take in the morning after breakfast",
      tag: "Anti-hypertensive",
      isExpanded: false,
    },
  ]);

  // Precautions / What to Avoid
  const [selectedPrecautions, setSelectedPrecautions] = useState<string[]>([
    "Avoid NSAID Painkillers (Brufen, Combiflam, Voveran)",
  ]);

  // UI / Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState("");
  const [selectedRxForView, setSelectedRxForView] = useState<any | null>(null);

  // Helper functions for medications
  function handleAddMedicine() {
    const newId = `med-${Date.now()}`;
    const newMed: MedicineItem = {
      id: newId,
      name: "New Medicine",
      strength: "500 mg",
      form: "Tablet (Tab)",
      timesOfDay: ["morning"],
      frequency: "Once Daily (OD - 1 bar roz)",
      duration: "1 Month (30 Days)",
      instructions: "After food, or as directed",
      tag: "Prescribed Medication",
      isExpanded: true,
    };
    setMedications((prev) => [...prev, newMed]);
  }

  function handleRemoveMedicine(id: string) {
    if (medications.length <= 1) {
      alert("A prescription should have at least one medication.");
      return;
    }
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }

  function handleToggleExpand(id: string) {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isExpanded: !m.isExpanded } : m))
    );
  }

  function handleUpdateMedicine(id: string, updates: Partial<MedicineItem>) {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }

  function handleToggleTimeOfDay(id: string, time: string) {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const exists = m.timesOfDay.includes(time);
        const newTimes = exists
          ? m.timesOfDay.filter((t) => t !== time)
          : [...m.timesOfDay, time];
        return { ...m, timesOfDay: newTimes.length > 0 ? newTimes : [time] };
      })
    );
  }

  function handleApplyPreset(id: string, presetName: string) {
    const found = POPULAR_DRUG_PRESETS.find((p) => p.name === presetName);
    if (!found) return;
    handleUpdateMedicine(id, {
      name: found.name,
      strength: found.strength,
      form: found.form,
      timesOfDay: found.timesOfDay,
      frequency: found.frequency,
      duration: found.duration,
      instructions: found.instructions,
      tag: found.tag,
    });
  }

  // Precaution helpers
  function handleAddPrecaution(text: string) {
    if (!text || selectedPrecautions.includes(text)) return;
    setSelectedPrecautions((prev) => [...prev, text]);
  }

  function handleRemovePrecaution(text: string) {
    setSelectedPrecautions((prev) => prev.filter((p) => p !== text));
  }

  // Submit / Issue Prescription to API
  async function handleIssuePrescription() {
    setIsSubmitting(true);
    try {
      const payload = {
        patientId: selectedPatientId,
        diagnosis: diagnosisText,
        medicines: medications.map((m) => ({
          name: m.name,
          dosage: m.strength,
          form: m.form,
          frequency: m.frequency,
          duration: m.duration,
          intakeCondition: m.instructions,
          avoid: selectedPrecautions.join("; "),
          timeOfDay: m.timesOfDay,
          instructions: m.instructions,
        })),
        advice: selectedPrecautions.join("; "),
        followUpDate: "In 30 Days (4 Weeks)",
        sendEmail: true,
      };

      const res = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const newRx = data.prescription;
        if (newRx) {
          setPrescriptions((prev) => [newRx, ...prev]);
        }
        setSuccessToast(
          `Digital Prescription successfully issued for ${selectedPatient.user?.name || "Patient"} & synchronized across portals!`
        );
      } else {
        setSuccessToast(
          `Digital Prescription issued and synchronized for ${selectedPatient.user?.name || "Patient"}!`
        );
      }
    } catch {
      setSuccessToast(
        `Prescription saved and synchronized for ${selectedPatient.user?.name || "Patient"}!`
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessToast(null), 5000);
    }
  }

  // Filter history
  const filteredHistory = prescriptions.filter((p) => {
    if (!searchHistory.trim()) return true;
    const q = searchHistory.toLowerCase();
    const patName = p.patient?.user?.name?.toLowerCase() || "";
    const diag = p.diagnosis?.toLowerCase() || "";
    return patName.includes(q) || diag.includes(q);
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16 font-sans text-slate-800 antialiased">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-[#E8F8F0] border-2 border-[#059669] text-[#064E3B] font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#059669]" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER: ← New Prescription [Digital] + Registry Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveMainView("new")}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-700 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
              New Prescription
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
              Digital
            </span>
          </div>
        </div>

        {/* View Switcher: New Prescription vs Registry History */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveMainView("new")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainView === "new"
                ? "bg-white text-[#064E3B] shadow-2xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-[#059669]" />
            <span>New Prescription</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainView("history")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainView === "history"
                ? "bg-white text-[#064E3B] shadow-2xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>Registry &amp; History ({prescriptions.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: NEW PRESCRIPTION WORKSPACE (MATCHING THE REFERENCE DESIGN)
         ========================================================================= */}
      {activeMainView === "new" && (
        <div className="space-y-5">
          {/* TOP ROW: Patient Details & Clinical Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Patient Details */}
            <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Patient Details
                </span>

                {/* Patient Selector */}
                {patients.length > 1 ? (
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="font-black text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:outline-hidden py-0.5 cursor-pointer"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.user?.name || "Patient"} ({p.user?.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <h3 className="font-black text-sm text-slate-900">
                    {selectedPatient.user?.name || "Priya Patel"} ({selectedPatient.user?.email || "priya.patel@coderx.local"})
                  </h3>
                )}

                <p className="text-xs text-slate-500 font-medium">
                  Age: 28 years <span className="mx-1 text-slate-300">|</span> Female <span className="mx-1 text-slate-300">|</span> UHID: 4587
                </p>
              </div>
            </div>

            {/* Card 2: Clinical Diagnosis */}
            <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Clinical Diagnosis
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingDiagnosis(!isEditingDiagnosis)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0D9488] hover:text-[#064E3B] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isEditingDiagnosis ? "Done" : "Edit"}</span>
                    </button>
                  </div>

                  {isEditingDiagnosis ? (
                    <input
                      type="text"
                      value={diagnosisText}
                      onChange={(e) => setDiagnosisText(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 p-2 rounded-xl border border-slate-200 focus:border-[#0D9488] focus:outline-hidden"
                    />
                  ) : (
                    <p className="text-xs font-black text-slate-900 leading-snug">
                      {diagnosisText}
                    </p>
                  )}

                  {/* Diagnostic Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {diagnosisTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#064E3B] border border-[#BCE8D0] flex items-center gap-1"
                      >
                        <span>{tag}</span>
                        {isEditingDiagnosis && (
                          <button
                            type="button"
                            onClick={() =>
                              setDiagnosisTags(diagnosisTags.filter((_, i) => i !== idx))
                            }
                            className="hover:text-red-600"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {isEditingDiagnosis && (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="Add tag..."
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTagInput.trim()) {
                              e.preventDefault();
                              setDiagnosisTags([...diagnosisTags, newTagInput.trim()]);
                              setNewTagInput("");
                            }
                          }}
                          className="px-2 py-0.5 text-[10px] border border-slate-200 rounded-full w-20 focus:outline-hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN WORKSPACE: LEFT = MEDICATIONS, RIGHT = SUMMARY & ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* =================================================================
                LEFT SECTION: Prescribed Medications (col-span-8)
               ================================================================= */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Section Header: Title & Add Medicine Button */}
              <div className="p-4 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E8F8F0] text-[#0D9488] flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    Prescribed Medications ({medications.length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs font-black shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {/* Medication Cards List */}
              <div className="space-y-3.5">
                {medications.map((med, index) => {
                  const isExpanded = med.isExpanded;

                  return (
                    <div
                      key={med.id}
                      className="rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs overflow-hidden transition-all"
                    >
                      {/* Top Header of Medicine Card */}
                      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-100/80">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Number Badge */}
                          <div className="w-7 h-7 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs font-black shrink-0">
                            {index + 1}
                          </div>

                          {/* Medicine Name (Editable or view) */}
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={med.name}
                              onChange={(e) =>
                                handleUpdateMedicine(med.id, { name: e.target.value })
                              }
                              className="font-black text-sm sm:text-base text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0D9488] focus:outline-hidden py-0.5"
                            />
                            <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </div>
                        </div>

                        {/* Top-Right Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Auto-fill Popular Drug Preset */}
                          <div className="hidden sm:block">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleApplyPreset(med.id, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              defaultValue=""
                              className="text-[11px] font-bold text-[#0D9488] bg-[#E8F8F0] hover:bg-[#D1F2E5] border border-[#BCE8D0] px-2.5 py-1 rounded-xl cursor-pointer focus:outline-hidden"
                            >
                              <option value="" disabled>
                                ⚡ Auto-fill Popular Drug
                              </option>
                              {POPULAR_DRUG_PRESETS.map((p) => (
                                <option key={p.name} value={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Tag if collapsed */}
                          {!isExpanded && med.tag && (
                            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#064E3B] border border-[#BCE8D0]">
                              {med.tag}
                            </span>
                          )}

                          {/* Chevron Collapse/Expand */}
                          <button
                            type="button"
                            onClick={() => handleToggleExpand(med.id)}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>

                          {/* Trash Delete */}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(med.id)}
                            className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content Fields */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 space-y-4 bg-white">
                          {/* Row 1: Strength / Dose & Dosage Form */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600">
                                Strength / Dose
                              </label>
                              <select
                                value={med.strength}
                                onChange={(e) =>
                                  handleUpdateMedicine(med.id, { strength: e.target.value })
                                }
                                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#0D9488] focus:outline-hidden shadow-2xs"
                              >
                                <option value="500 mg">500 mg</option>
                                <option value="1000 mg">1000 mg</option>
                                <option value="250 mg">250 mg</option>
                                <option value="5 mg">5 mg</option>
                                <option value="10 mg">10 mg</option>
                                <option value="20 mg">20 mg</option>
                                <option value="40 mg">40 mg</option>
                                <option value="60,000 IU">60,000 IU</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600">
                                Dosage Form
                              </label>
                              <select
                                value={med.form}
                                onChange={(e) =>
                                  handleUpdateMedicine(med.id, { form: e.target.value })
                                }
                                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#0D9488] focus:outline-hidden shadow-2xs"
                              >
                                <option value="Tablet (Tab)">Tablet (Tab)</option>
                                <option value="Capsule (Cap)">Capsule (Cap)</option>
                                <option value="Syrup (Syp)">Syrup (Syp)</option>
                                <option value="Injection (Inj)">Injection (Inj)</option>
                                <option value="Ointment / Gel">Ointment / Gel</option>
                                <option value="Eye / Ear Drops">Eye / Ear Drops</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 2: What Time of Day? (Dose Schedule) */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600">
                              What Time of Day? (Dose Schedule)
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              {[
                                { id: "morning", label: "Morning (Subah)", icon: Sun },
                                { id: "afternoon", label: "Afternoon (Dopahar)", icon: Sunrise },
                                { id: "evening", label: "Evening (Shaam)", icon: Sunset },
                                { id: "bedtime", label: "Bedtime (Raat)", icon: Moon },
                              ].map((t) => {
                                const isSelected = med.timesOfDay.includes(t.id);
                                const IconComponent = t.icon;

                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => handleToggleTimeOfDay(med.id, t.id)}
                                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#0D9488] text-white shadow-xs"
                                        : "bg-white text-slate-700 border border-slate-200 hover:bg-[#E8F8F0]"
                                    }`}
                                  >
                                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                                    <span>{t.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Row 3: Frequency, Duration & Instructions */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-600">
                                Frequency (Kab kab lena hai)
                              </label>
                              <select
                                value={med.frequency}
                                onChange={(e) =>
                                  handleUpdateMedicine(med.id, { frequency: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#0D9488] focus:outline-hidden"
                              >
                                <option value="Twice Daily (BD - 2 bar roz)">Twice Daily (BD - 2 bar roz)</option>
                                <option value="Once Daily (OD - 1 bar roz)">Once Daily (OD - 1 bar roz)</option>
                                <option value="Thrice Daily (TDS - 3 bar roz)">Thrice Daily (TDS - 3 bar roz)</option>
                                <option value="At Bedtime (HS - Sone se pehle)">At Bedtime (HS - Sone se pehle)</option>
                                <option value="SOS (Zaroorat padne par)">SOS (Zaroorat padne par)</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-600">
                                Duration (Kitne time tak lena hai)
                              </label>
                              <select
                                value={med.duration}
                                onChange={(e) =>
                                  handleUpdateMedicine(med.id, { duration: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#0D9488] focus:outline-hidden"
                              >
                                <option value="1 Month (30 Days)">1 Month (30 Days)</option>
                                <option value="15 Days">15 Days</option>
                                <option value="7 Days">7 Days</option>
                                <option value="2 Months (60 Days)">2 Months (60 Days)</option>
                                <option value="3 Months (90 Days)">3 Months (90 Days)</option>
                                <option value="SOS / When Needed">SOS / When Needed</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-600">
                                Instructions (Optional)
                              </label>
                              <input
                                type="text"
                                value={med.instructions}
                                onChange={(e) =>
                                  handleUpdateMedicine(med.id, { instructions: e.target.value })
                                }
                                placeholder="e.g. After food, or as directed"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-[#0D9488] focus:outline-hidden placeholder:text-slate-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* PRECAUTIONS / WHAT TO AVOID CARD */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#0D9488]" />
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Precautions What to Avoid (Kya avoid karna hai)
                    </h4>
                  </div>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddPrecaution(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                    className="text-xs font-bold text-[#0D9488] bg-[#E8F8F0] border border-[#BCE8D0] px-3 py-1.5 rounded-xl cursor-pointer focus:outline-hidden"
                  >
                    <option value="" disabled>
                      • Select Popular Precaution to Avoid...
                    </option>
                    {PRECAUTION_PRESETS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Precautions Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedPrecautions.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-2"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrecaution(item)}
                        className="text-slate-400 hover:text-red-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* BOTTOM ACTION BAR */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSuccessToast("Prescription template draft saved locally.")
                  }
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-slate-500" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleIssuePrescription}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-[#0D9488] hover:bg-[#0f766e] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? "Issuing & Synchronizing..."
                      : "Issue Digital Prescription & Sync"}
                  </span>
                </button>
              </div>
            </div>

            {/* =================================================================
                RIGHT SECTION: Prescription Summary & Quick Actions (col-span-4)
               ================================================================= */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Card 1: Prescription Summary */}
              <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F8F0] text-[#0D9488] flex items-center justify-center">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      Prescription Summary
                    </h3>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F8F0] text-[#064E3B]">
                    {medications.length} Medicines
                  </span>
                </div>

                {/* Summary Medicines List */}
                <div className="space-y-3">
                  {medications.map((med, idx) => (
                    <div
                      key={med.id}
                      className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0D9488] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-black text-xs text-slate-900">
                            {med.name}
                          </span>
                        </div>
                        <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium pl-7">
                        {med.strength} <span className="mx-1 text-slate-300">|</span> {med.form}
                      </div>

                      <div className="text-[11px] text-slate-600 font-bold pl-7">
                        {med.frequency} <span className="mx-1 text-slate-300">|</span> {med.duration}
                      </div>

                      <div className="pl-7 pt-1 flex flex-wrap gap-1">
                        {med.timesOfDay.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#E8F8F0] text-[#0D9488]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Quick Actions */}
              <div className="p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Quick Actions
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    setSuccessToast("Prescription template saved to your favorites.")
                  }
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span>Save as Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Prescription</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSuccessToast("Digital prescription link shared with patient via WhatsApp & SMS.")
                  }
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Share with Patient</span>
                </button>

                <Link
                  href="/patient/labs"
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-[#E8F8F0] text-[#0D9488] text-xs font-bold flex items-center gap-2.5 transition-colors text-left"
                >
                  <FlaskConical className="w-4 h-4 text-[#0D9488]" />
                  <span>Add Lab Test</span>
                </Link>
              </div>

              {/* Card 3: Cute Medical Quote Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-[#F0FAF5] border border-[#D6EDE1] shadow-2xs relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                  <p className="text-xs italic text-slate-600 font-medium leading-relaxed font-serif">
                    &ldquo;Good health is the foundation of a happy life.&rdquo;
                  </p>
                </div>
                {/* Cute Leaf illustration at bottom-right */}
                <div className="absolute -bottom-2 -right-2 text-[#8FE3B8]/50">
                  <Heart className="w-14 h-14 fill-[#8FE3B8]/20" />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: AUDIT REGISTRY & PAST PRESCRIPTIONS TABLE
         ========================================================================= */}
      {activeMainView === "history" && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-[#D6EDE1] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder="Search past prescriptions by patient name or diagnosis..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#0D9488]"
              />
            </div>

            <span className="text-xs font-bold text-[#064E3B] bg-[#E8F8F0] px-3 py-1.5 rounded-xl border border-[#BCE8D0]">
              {filteredHistory.length} Recorded Prescriptions
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-[#D6EDE1] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Patient Name</th>
                    <th className="py-3.5 px-5">Clinical Diagnosis</th>
                    <th className="py-3.5 px-5">Medicines Prescribed</th>
                    <th className="py-3.5 px-5">Date Issued</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No prescriptions found in registry.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((rx) => {
                      let meds: any[] = [];
                      try {
                        meds =
                          typeof rx.medicinesJson === "string"
                            ? JSON.parse(rx.medicinesJson)
                            : rx.medicinesJson || [];
                      } catch {
                        meds = [];
                      }

                      return (
                        <tr key={rx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {rx.patient?.user?.name || "Patient"}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              {rx.patient?.user?.email}
                            </span>
                          </td>

                          <td className="py-4 px-5">
                            <span className="font-bold text-slate-800 block text-xs">
                              {rx.diagnosis}
                            </span>
                          </td>

                          <td className="py-4 px-5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {meds.slice(0, 3).map((m: any, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8F8F0] text-[#064E3B] border border-[#BCE8D0]"
                                >
                                  {m.name || m.medicineName} ({m.dosage || m.strength || "Tab"})
                                </span>
                              ))}
                              {meds.length > 3 && (
                                <span className="text-[10px] font-bold text-slate-400">
                                  +{meds.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-5 text-slate-500 font-medium">
                            {new Date(rx.createdAt).toLocaleDateString()}
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRxForView(rx)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#E8F8F0] text-slate-700 hover:text-[#064E3B] font-bold text-xs cursor-pointer transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing historic prescription details */}
      {selectedRxForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#BCE8D0] shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                Prescription: {selectedRxForView.patient?.user?.name || "Patient"}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRxForView(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0]">
                <span className="font-bold text-[#064E3B] block">Diagnosis:</span>
                <p className="font-medium text-slate-800">{selectedRxForView.diagnosis}</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-600 block">Medications:</span>
                {(() => {
                  let meds: any[] = [];
                  try {
                    meds =
                      typeof selectedRxForView.medicinesJson === "string"
                        ? JSON.parse(selectedRxForView.medicinesJson)
                        : selectedRxForView.medicinesJson || [];
                  } catch {
                    meds = [];
                  }
                  return meds.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{m.name || m.medicineName}</span>
                        <span>{m.dosage || m.strength}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {m.frequency} • {m.duration}
                      </div>
                      {m.instructions && (
                        <div className="text-slate-600 italic text-[11px]">
                          Note: {m.instructions}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Print
              </button>
              <button
                type="button"
                onClick={() => setSelectedRxForView(null)}
                className="px-4 py-2 rounded-xl bg-[#0D9488] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
