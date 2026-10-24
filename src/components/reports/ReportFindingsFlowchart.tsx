"use client";

import { useState } from "react";
import {
  FileImage,
  Scan,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Stethoscope,
  Info,
  Sparkles,
} from "lucide-react";

interface FlowStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  status: "verified" | "attention" | "review" | "doctor_action";
  badge: string;
  details: {
    label: string;
    value: string;
    tone: "green" | "amber" | "blue" | "purple";
  }[];
  clinicalTip: string;
}

export function ReportFindingsFlowchart() {
  const [selectedStep, setSelectedStep] = useState<string>("step-2");

  const steps: FlowStep[] = [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Input Film & Alignment",
      subtitle: "Dual-panel comparative chest study",
      status: "verified",
      badge: "Quality: Optimal",
      details: [
        { label: "Projection", value: "Posteroanterior (PA)", tone: "blue" },
        { label: "Format", value: "Baseline vs Current Comparison", tone: "blue" },
        { label: "Adequacy", value: "Full lung fields visible", tone: "green" },
      ],
      clinicalTip: "Resolution and contrast are optimal for lung field & diaphragmatic contour assessment.",
    },
    {
      id: "step-2",
      stepNumber: 2,
      title: "Anatomical Landmark Scan",
      subtitle: "Bilateral thoracic volumetric measurements",
      status: "attention",
      badge: "Hyperinflation Detected",
      details: [
        { label: "Thoracic Height", value: "+38% Volumetric Expansion", tone: "amber" },
        { label: "Lung Lucency", value: "Bilateral Hyperlucency", tone: "amber" },
        { label: "Intercostal Spaces", value: "Widened Rib Margins", tone: "amber" },
      ],
      clinicalTip: "Noticeable bilateral expansion compared to baseline normal thorax on left panel.",
    },
    {
      id: "step-3",
      stepNumber: 3,
      title: "Diaphragm & Recesses",
      subtitle: "Contour curvature & costophrenic angles",
      status: "attention",
      badge: "Dome Flattened",
      details: [
        { label: "Diaphragm Level", value: "Depressed (<10th rib)", tone: "amber" },
        { label: "Curvature", value: "Loss of superior dome convexity", tone: "amber" },
        { label: "Pleural Recesses", value: "Sharp & Clear (No fluid)", tone: "green" },
      ],
      clinicalTip: "Diaphragm depression below 10th posterior rib indicates increased residual gas volume.",
    },
    {
      id: "step-4",
      stepNumber: 4,
      title: "Consensus & Artifact Check",
      subtitle: "Triple-model independent cross-check",
      status: "review",
      badge: "1 Divergence Flagged",
      details: [
        { label: "Hyperinflation Consensus", value: "100% (3/3 Agree)", tone: "green" },
        { label: "Cardiac Ratio (CTR 0.42)", value: "Normal Silhouette (3/3)", tone: "green" },
        { label: "'Fluid-Fluid Level' Label", value: "Gastric Bubble Check Needed", tone: "amber" },
      ],
      clinicalTip: "Claude & GPT identify label as educational reference to stomach bubble; Gemini flags for physical check.",
    },
    {
      id: "step-5",
      stepNumber: 5,
      title: "Physician Assessment",
      subtitle: "Clinical correlation & diagnosis hand-off",
      status: "doctor_action",
      badge: "Doctor Decision Required",
      details: [
        { label: "AI Role", value: "Assistive Reading Only", tone: "purple" },
        { label: "Diagnosis Rendered", value: "None (Reserved for Doctor)", tone: "purple" },
        { label: "Recommended Action", value: "Correlate with auscultation & spirometry", tone: "blue" },
      ],
      clinicalTip: "CodeRx assists with objective film measurements. Diagnosis must be confirmed clinically by the physician.",
    },
  ];

  const currentStepObj = steps.find((s) => s.id === selectedStep) || steps[1];

  function getStepHeaderBadge(status: FlowStep["status"]) {
    switch (status) {
      case "verified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "attention":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "review":
        return "bg-sky-50 text-sky-800 border-sky-300";
      case "doctor_action":
        return "bg-purple-50 text-purple-800 border-purple-300";
    }
  }

  function getToneBadge(tone: "green" | "amber" | "blue" | "purple") {
    switch (tone) {
      case "green":
        return "bg-emerald-100/70 text-emerald-800 border-emerald-200";
      case "amber":
        return "bg-amber-100/70 text-amber-800 border-amber-200";
      case "blue":
        return "bg-sky-100/70 text-sky-800 border-sky-200";
      case "purple":
        return "bg-purple-100/70 text-purple-800 border-purple-200";
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-xs space-y-4">
      {/* Header with Title and Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-sky-100 text-sky-700">
              <Activity className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Radiographic Finding Workflow (Visual Flowchart)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step extraction pipeline: from original image acquisition to physician review.
          </p>
        </div>

        <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-600" />
          Interactive Flowchart • Click steps below
        </span>
      </div>

      {/* Flowchart Horizontal Pipeline Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {steps.map((step, idx) => {
          const isSelected = selectedStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setSelectedStep(step.id)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-sky-50/80 border-sky-500 ring-2 ring-sky-300/60 shadow-xs"
                  : "bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-sky-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {step.stepNumber}
                </span>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border truncate max-w-[85px] ${getStepHeaderBadge(
                    step.status
                  )}`}
                >
                  {step.status === "verified"
                    ? "Normal"
                    : step.status === "attention"
                    ? "Attention"
                    : step.status === "review"
                    ? "Review"
                    : "Doctor Step"}
                </span>
              </div>

              {/* Title & subtitle */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 leading-snug truncate">
                  {step.title}
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {step.subtitle}
                </p>
              </div>

              {/* Chevron connecting to next step */}
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-2xs flex items-center justify-center text-slate-400">
                    <ChevronRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Step Detail Box */}
      <div className="bg-slate-50/90 rounded-xl border border-slate-200 p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
              {currentStepObj.stepNumber}
            </span>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                {currentStepObj.title}: <span className="text-slate-600 font-normal">{currentStepObj.subtitle}</span>
              </h5>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStepHeaderBadge(
              currentStepObj.status
            )}`}
          >
            {currentStepObj.badge}
          </span>
        </div>

        {/* Detail Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {currentStepObj.details.map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${getToneBadge(
                item.tone
              )}`}
            >
              <span className="text-[10px] font-medium opacity-80 block">{item.label}</span>
              <span className="font-bold text-xs mt-0.5">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Clinical Note / High-Yield takeaway */}
        <div className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
          <Info className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-slate-900">Radiographic Insight: </strong>
            {currentStepObj.clinicalTip}
          </div>
        </div>
      </div>
    </div>
  );
}
