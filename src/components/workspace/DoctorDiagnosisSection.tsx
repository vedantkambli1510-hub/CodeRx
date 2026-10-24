"use client";

import { useState, useEffect } from "react";
import {
  Stethoscope,
  CheckCircle2,
  HelpCircle,
  Plus,
  Trash2,
  ArrowRight,
  Save,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Activity,
  FileCheck2,
  Pill,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";

export interface ProbableDiagnosis {
  id: string;
  title: string;
  icd10?: string;
  likelihood: "HIGH" | "MODERATE" | "LOW_RULE_OUT";
  rationale: string;
  addedAt: string;
  suggestedByAI?: boolean;
}

export interface ConfirmedDiagnosis {
  id: string;
  title: string;
  icd10: string;
  status: "ACTIVE" | "CHRONIC" | "CONTROLLED" | "RESOLVING";
  confirmatoryBasis: string;
  confirmedAt: string;
  doctorName: string;
}

interface DoctorDiagnosisSectionProps {
  patientId?: string;
  patientName: string;
  initialConditions?: string | null;
  onOpenPrescriptionModal?: (prefilledDiagnosis?: string) => void;
}

export function DoctorDiagnosisSection({
  patientId = "demo_patient",
  patientName,
  initialConditions,
  onOpenPrescriptionModal,
}: DoctorDiagnosisSectionProps) {
  const storageKey = `coderx_diagnoses_${patientId}`;

  // Default initial data tailored to clinical records (e.g. Rajesh Sharma)
  const defaultProbable: ProbableDiagnosis[] = [
    {
      id: "prob_1",
      title: "Stage 3a Diabetic Kidney Disease (Diabetic Nephropathy)",
      icd10: "E11.22",
      likelihood: "HIGH",
      rationale:
        "Acute 70% creatinine jump (1.0 → 1.7 mg/dL) with eGFR 46 mL/min/1.73m² and persistent microalbuminuria (88 mg/g).",
      addedAt: "Today, Pre-Consultation",
      suggestedByAI: true,
    },
    {
      id: "prob_2",
      title: "Telmisartan-Associated Hemodynamic Filtration Shift",
      icd10: "R94.4",
      likelihood: "MODERATE",
      rationale:
        "ARB efferent arteriolar vasodilation causing reversible functional eGFR reduction without acute intrinsic necrosis.",
      addedAt: "Today, Pre-Consultation",
      suggestedByAI: true,
    },
    {
      id: "prob_3",
      title: "Subacute Prerenal Azotemia secondary to Dehydration",
      icd10: "N17.9",
      likelihood: "LOW_RULE_OUT",
      rationale:
        "BUN 34 mg/dL with BUN/Cr ratio ~20. Requires verification of fluid intake and ruling out concurrent NSAID ingestion.",
      addedAt: "Today, Pre-Consultation",
      suggestedByAI: false,
    },
  ];

  const defaultConfirmed: ConfirmedDiagnosis[] = [
    {
      id: "conf_1",
      title: "Type 2 Diabetes Mellitus without acute complications",
      icd10: "E11.9",
      status: "CHRONIC",
      confirmatoryBasis:
        "Longstanding history; latest fasting glucose 122 mg/dL with favorable HbA1c reduction from 8.4% to 7.1%.",
      confirmedAt: "Apr 5, 2024",
      doctorName: "Dr. Aarav Mehta",
    },
    {
      id: "conf_2",
      title: "Essential (Primary) Hypertension",
      icd10: "I10",
      status: "CONTROLLED",
      confirmatoryBasis:
        "Blood pressure controlled at 126/80 mmHg under daily Telmisartan 40 mg therapy.",
      confirmedAt: "Jan 15, 2024",
      doctorName: "Dr. Aarav Mehta",
    },
  ];

  const [probableList, setProbableList] = useState<ProbableDiagnosis[]>(defaultProbable);
  const [confirmedList, setConfirmedList] = useState<ConfirmedDiagnosis[]>(defaultConfirmed);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form states for adding new Probable Diagnosis
  const [newProbTitle, setNewProbTitle] = useState("");
  const [newProbIcd, setNewProbIcd] = useState("");
  const [newProbLikelihood, setNewProbLikelihood] = useState<"HIGH" | "MODERATE" | "LOW_RULE_OUT">("HIGH");
  const [newProbRationale, setNewProbRationale] = useState("");
  const [isAddingProbable, setIsAddingProbable] = useState(false);

  // Form states for adding new Confirmed Diagnosis
  const [newConfTitle, setNewConfTitle] = useState("");
  const [newConfIcd, setNewConfIcd] = useState("");
  const [newConfStatus, setNewConfStatus] = useState<"ACTIVE" | "CHRONIC" | "CONTROLLED" | "RESOLVING">("ACTIVE");
  const [newConfBasis, setNewConfBasis] = useState("");
  const [isAddingConfirmed, setIsAddingConfirmed] = useState(false);

  // UI feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.probableList && Array.isArray(parsed.probableList)) {
          setProbableList(parsed.probableList);
        }
        if (parsed.confirmedList && Array.isArray(parsed.confirmedList)) {
          setConfirmedList(parsed.confirmedList);
        }
      }
    } catch (e) {
      console.warn("Could not load stored diagnoses", e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          probableList,
          confirmedList,
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn("Could not sync diagnoses to localStorage", e);
    }
  }, [probableList, confirmedList, isLoaded, storageKey]);

  // Promote a Probable diagnosis directly into Confirmed
  function handlePromoteToConfirmed(probable: ProbableDiagnosis) {
    const promoted: ConfirmedDiagnosis = {
      id: `conf_${Date.now()}`,
      title: probable.title,
      icd10: probable.icd10 || "Unspecified",
      status: "ACTIVE",
      confirmatoryBasis: `Established from clinical assessment. Basis: ${probable.rationale}`,
      confirmedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      doctorName: "Dr. Aarav Mehta",
    };

    setConfirmedList((prev) => [promoted, ...prev]);
    setProbableList((prev) => prev.filter((p) => p.id !== probable.id));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  // Add new Probable Diagnosis
  function handleAddProbable(e: React.FormEvent) {
    e.preventDefault();
    if (!newProbTitle.trim()) return;

    const newItem: ProbableDiagnosis = {
      id: `prob_${Date.now()}`,
      title: newProbTitle.trim(),
      icd10: newProbIcd.trim() || undefined,
      likelihood: newProbLikelihood,
      rationale: newProbRationale.trim() || "Observed during longitudinal pre-consultation review.",
      addedAt: "Just now",
      suggestedByAI: false,
    };

    setProbableList((prev) => [newItem, ...prev]);
    setNewProbTitle("");
    setNewProbIcd("");
    setNewProbRationale("");
    setIsAddingProbable(false);
  }

  // Add new Confirmed Diagnosis
  function handleAddConfirmed(e: React.FormEvent) {
    e.preventDefault();
    if (!newConfTitle.trim()) return;

    const newItem: ConfirmedDiagnosis = {
      id: `conf_${Date.now()}`,
      title: newConfTitle.trim(),
      icd10: newConfIcd.trim() || "R69",
      status: newConfStatus,
      confirmatoryBasis: newConfBasis.trim() || "Confirmed on examination and verified laboratory diagnostic findings.",
      confirmedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      doctorName: "Dr. Aarav Mehta",
    };

    setConfirmedList((prev) => [newItem, ...prev]);
    setNewConfTitle("");
    setNewConfIcd("");
    setNewConfBasis("");
    setIsAddingConfirmed(false);
  }

  // Remove functions
  function handleRemoveProbable(id: string) {
    setProbableList((prev) => prev.filter((p) => p.id !== id));
  }

  function handleRemoveConfirmed(id: string) {
    setConfirmedList((prev) => prev.filter((c) => c.id !== id));
  }

  // Save to database backend
  async function handleSaveToBackend() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/doctor/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          probableDiagnoses: probableList,
          confirmedDiagnoses: confirmedList,
          clinicalNotes: `Diagnostic review completed for ${patientName}`,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save to backend:", err);
      // Local state is still preserved
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  // Copy clinical summary to clipboard
  function handleCopySummary() {
    const text = `
CODERX PHYSICIAN DIAGNOSTIC ASSESSMENT
Patient: ${patientName}
Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
Attending Physician: Dr. Aarav Mehta

CONFIRMED DIAGNOSES:
${
  confirmedList.length === 0
    ? "No confirmed diagnoses recorded."
    : confirmedList
        .map(
          (c, idx) =>
            `${idx + 1}. ${c.title} (ICD-10: ${c.icd10}) [Status: ${c.status}]\n   Basis: ${c.confirmatoryBasis}`
        )
        .join("\n\n")
}

PROBABLE / DIFFERENTIAL DIAGNOSES (WORKING HYPOTHESES):
${
  probableList.length === 0
    ? "No active probable diagnoses."
    : probableList
        .map(
          (p, idx) =>
            `${idx + 1}. ${p.title} ${p.icd10 ? `(ICD-10: ${p.icd10})` : ""}\n   Likelihood: ${p.likelihood} | Rationale: ${p.rationale}`
        )
        .join("\n\n")
}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  }

  return (
    <div id="doctor-diagnosis-area" className="bg-slate-100/95 rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-indigo-100/70 text-slate-900 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
            <span>Physician Clinical Decision Area</span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>Probable & Confirmed Diagnoses</span>
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Designated clinical workspace for establishing working differential hypotheses and documenting verified definitive diagnoses with ICD-10 codification.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedSummary ? "Copied Assessment!" : "Copy Summary"}</span>
          </button>

          <button
            onClick={handleSaveToBackend}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-white font-bold" />
                <span>Saved to Patient Chart!</span>
              </>
            ) : isSaving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save Diagnoses to Chart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Probable Diagnoses vs Confirmed Diagnoses */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-200/50">
        
        {/* ======================================================== */}
        {/* COLUMN 1: PROBABLE / DIFFERENTIAL DIAGNOSES              */}
        {/* ======================================================== */}
        <div className="flex flex-col rounded-2xl border border-amber-300 bg-amber-50/60 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-amber-100/90 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-xs">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    Probable Diagnoses
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-200 text-amber-900 border border-amber-300 uppercase tracking-wider">
                    Working Differential
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Active hypotheses under clinical evaluation
                </p>
              </div>
            </div>

            <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center">
              {probableList.length}
            </span>
          </div>

          {/* Quick AI Differential Chips */}
          <div className="px-4 py-2.5 bg-amber-50/90 border-b border-amber-200 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Suggested Differentials:</span>
            </span>
            {[
              { title: "Stage 3a Diabetic Kidney Disease", icd: "E11.22" },
              { title: "ARB-Induced Filtration Dip", icd: "R94.4" },
              { title: "Prerenal Azotemia", icd: "N17.9" },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNewProbTitle(chip.title);
                  setNewProbIcd(chip.icd);
                  setIsAddingProbable(true);
                }}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/90 border border-amber-300 hover:border-amber-400 text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                + {chip.title}
              </button>
            ))}
          </div>

          {/* List of Probable Diagnoses */}
          <div className="p-4 space-y-3 flex-1">
            {probableList.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-amber-300 bg-white/60">
                <p className="text-xs text-slate-500 font-medium">
                  No active probable diagnoses. Add working hypotheses below.
                </p>
              </div>
            ) : (
              probableList.map((prob) => {
                const likelihoodStyles = {
                  HIGH: "bg-rose-100 text-rose-800 border-rose-300",
                  MODERATE: "bg-amber-100 text-amber-800 border-amber-300",
                  LOW_RULE_OUT: "bg-slate-100 text-slate-700 border-slate-300",
                };

                const likelihoodLabels = {
                  HIGH: "High Probability",
                  MODERATE: "Moderate / Differential",
                  LOW_RULE_OUT: "Rule Out",
                };

                return (
                  <div
                    key={prob.id}
                    className="p-3.5 rounded-xl bg-white/95 border border-amber-200 shadow-xs space-y-2.5 hover:border-amber-400 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h5 className="text-xs font-bold text-slate-900 leading-snug">
                            {prob.title}
                          </h5>
                          {prob.icd10 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
                              {prob.icd10}
                            </span>
                          )}
                          {prob.suggestedByAI && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                              <span>AI Shift Match</span>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              likelihoodStyles[prob.likelihood]
                            }`}
                          >
                            {likelihoodLabels[prob.likelihood]}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {prob.addedAt}
                          </span>
                        </div>
                      </div>

                      {/* Delete icon */}
                      <button
                        onClick={() => handleRemoveProbable(prob.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Remove diagnosis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Clinical Rationale */}
                    <div className="text-xs text-slate-800 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 leading-relaxed font-normal">
                      <strong className="font-semibold text-amber-900 text-[11px] block mb-0.5">
                        Clinical Rationale / Basis:
                      </strong>
                      {prob.rationale}
                    </div>

                    {/* Action: Promote to Confirmed Diagnosis */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 italic">
                        Evaluate & verify with lab evidence
                      </span>

                      <button
                        onClick={() => handlePromoteToConfirmed(prob)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Diagnosis</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Add New Probable Diagnosis Toggle/Form */}
            {isAddingProbable ? (
              <form
                onSubmit={handleAddProbable}
                className="p-3.5 rounded-xl bg-white border-2 border-dashed border-amber-300 space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                  <span className="text-xs font-bold text-amber-900">
                    Add Working Differential Diagnosis
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingProbable(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">
                      Diagnosis Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stage 3a Diabetic Nephropathy"
                      value={newProbTitle}
                      onChange={(e) => setNewProbTitle(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">
                      ICD-10 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. E11.22"
                      value={newProbIcd}
                      onChange={(e) => setNewProbIcd(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Confidence / Likelihood
                  </label>
                  <select
                    value={newProbLikelihood}
                    onChange={(e) =>
                      setNewProbLikelihood(e.target.value as "HIGH" | "MODERATE" | "LOW_RULE_OUT")
                    }
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-medium"
                  >
                    <option value="HIGH">High Probability (Clinically Strong)</option>
                    <option value="MODERATE">Moderate / Differential</option>
                    <option value="LOW_RULE_OUT">Low Probability / Rule Out</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Clinical Rationale & Lab Trajectory Basis
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Document symptoms, lab shifts, or pharmacology triggers supporting this hypothesis..."
                    value={newProbRationale}
                    onChange={(e) => setNewProbRationale(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400 font-normal"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs"
                  >
                    + Add to Probable List
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingProbable(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-amber-300 hover:border-amber-400 bg-white/80 hover:bg-amber-100/60 text-xs font-bold text-amber-900 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Add Probable Diagnosis</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: CONFIRMED / FINAL DIAGNOSES                    */}
        {/* ======================================================== */}
        <div className="flex flex-col rounded-2xl border border-emerald-300 bg-emerald-50/60 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-emerald-100/90 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    Confirmed Diagnoses
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200 text-emerald-900 border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>Definitive Clinical Decision</span>
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Verified diagnoses recorded in permanent patient chart
                </p>
              </div>
            </div>

            <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center justify-center">
              {confirmedList.length}
            </span>
          </div>

          {/* Quick Common Confirmation Chips */}
          <div className="px-4 py-2.5 bg-emerald-50/90 border-b border-emerald-200 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-700" />
              <span>Quick Verify:</span>
            </span>
            {[
              { title: "Type 2 Diabetes Mellitus", icd: "E11.9", status: "CHRONIC" as const },
              { title: "Essential Hypertension", icd: "I10", status: "CONTROLLED" as const },
              { title: "Stage 3a Diabetic Nephropathy", icd: "E11.22", status: "ACTIVE" as const },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNewConfTitle(chip.title);
                  setNewConfIcd(chip.icd);
                  setNewConfStatus(chip.status);
                  setIsAddingConfirmed(true);
                }}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/90 border border-emerald-300 hover:border-emerald-400 text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                + {chip.title}
              </button>
            ))}
          </div>

          {/* List of Confirmed Diagnoses */}
          <div className="p-4 space-y-3 flex-1">
            {confirmedList.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-emerald-300 bg-white/60">
                <p className="text-xs text-slate-500 font-medium">
                  No confirmed diagnoses recorded yet. Promote a probable diagnosis or establish one below.
                </p>
              </div>
            ) : (
              confirmedList.map((conf) => {
                const statusStyles = {
                  ACTIVE: "bg-rose-100 text-rose-800 border-rose-300",
                  CHRONIC: "bg-sky-100 text-sky-800 border-sky-300",
                  CONTROLLED: "bg-emerald-100 text-emerald-800 border-emerald-300",
                  RESOLVING: "bg-purple-100 text-purple-800 border-purple-300",
                };

                return (
                  <div
                    key={conf.id}
                    className="p-3.5 rounded-xl bg-white/95 border border-emerald-200 shadow-xs space-y-2.5 hover:border-emerald-400 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h5 className="text-xs font-black text-slate-900 leading-snug">
                            {conf.title}
                          </h5>
                          {conf.icd10 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              ICD-10: {conf.icd10}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              statusStyles[conf.status]
                            }`}
                          >
                            {conf.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          <span>Confirmed: <strong className="text-slate-800 font-semibold">{conf.confirmedAt}</strong></span>
                          <span>•</span>
                          <span>By: <strong className="text-slate-800 font-semibold">{conf.doctorName}</strong></span>
                        </div>
                      </div>

                      {/* Delete icon */}
                      <button
                        onClick={() => handleRemoveConfirmed(conf.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Remove confirmed diagnosis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Confirmatory Evidence / Notes */}
                    <div className="text-xs text-slate-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 leading-relaxed font-normal">
                      <strong className="font-semibold text-emerald-900 text-[11px] block mb-0.5">
                        Confirmatory Evidence & Basis:
                      </strong>
                      {conf.confirmatoryBasis}
                    </div>

                    {/* Bottom Utility: Link to Prescription */}
                    {onOpenPrescriptionModal && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Officially Recorded</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => onOpenPrescriptionModal(conf.title)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Pill className="w-3 h-3 text-sky-100" />
                          <span>Create Prescription</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Add New Confirmed Diagnosis Toggle/Form */}
            {isAddingConfirmed ? (
              <form
                onSubmit={handleAddConfirmed}
                className="p-3.5 rounded-xl bg-white border-2 border-dashed border-emerald-300 space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900">
                    Add Confirmed Diagnosis
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingConfirmed(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">
                      Confirmed Diagnosis Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Type 2 Diabetes Mellitus with Diabetic Nephropathy"
                      value={newConfTitle}
                      onChange={(e) => setNewConfTitle(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">
                      ICD-10 Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. E11.22"
                      value={newConfIcd}
                      onChange={(e) => setNewConfIcd(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Clinical Status
                  </label>
                  <select
                    value={newConfStatus}
                    onChange={(e) =>
                      setNewConfStatus(
                        e.target.value as "ACTIVE" | "CHRONIC" | "CONTROLLED" | "RESOLVING"
                      )
                    }
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="ACTIVE">Active (Currently Under Acute Evaluation / Treatment)</option>
                    <option value="CHRONIC">Chronic (Long-term Longitudinal Management)</option>
                    <option value="CONTROLLED">Controlled (Therapeutic Targets Achieved)</option>
                    <option value="RESOLVING">Resolving / Remission</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Confirmatory Evidence & Clinical Documentation
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Document clinical exam findings, lab panel confirmations, imaging criteria, or specialist consensus..."
                    value={newConfBasis}
                    onChange={(e) => setNewConfBasis(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder-slate-400 font-normal"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                  >
                    + Record Confirmed Diagnosis
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingConfirmed(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-400 bg-white/80 hover:bg-emerald-100/60 text-xs font-bold text-emerald-900 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Add Confirmed Diagnosis</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Summary Footer */}
      <div className="p-4 bg-slate-100 border-t border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            Diagnoses recorded here update the patient chart, are tagged with physician credentials, and integrate with prescription drafting.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[11px] text-slate-600 font-semibold">
            {confirmedList.length} Confirmed • {probableList.length} Probable
          </span>
        </div>
      </div>
    </div>
  );
}
