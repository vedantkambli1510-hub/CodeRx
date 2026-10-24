"use client";

import {
  Activity,
  Maximize2,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileSearch,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";

export function LandmarkMetricsGrid() {
  const cards = [
    {
      label: "Bilateral Thoracic Lucency",
      value: "Hyperinflated (+38%)",
      status: "attention",
      tag: "Feature Detected",
      subtext: "Rib spaces widened; bilateral lucency heightened compared to baseline.",
      icon: Activity,
    },
    {
      label: "Diaphragmatic Contour",
      value: "Flattened (<10th Rib)",
      status: "attention",
      tag: "Contour Depressed",
      subtext: "Curvature depressed bilaterally; consistent with dynamic gas trapping.",
      icon: Maximize2,
    },
    {
      label: "Cardiothoracic Ratio (CTR)",
      value: "0.42 (Normal)",
      status: "normal",
      tag: "Within Bounds",
      subtext: "Heart silhouette diameter is normal; no chamber enlargement or cor pulmonale.",
      icon: Heart,
    },
    {
      label: "Costophrenic Angles & Pleura",
      value: "Clear & Acute",
      status: "normal",
      tag: "No Effusion",
      subtext: "Sharp lateral recesses; no blunting, consolidation, or pneumothorax visible.",
      icon: ShieldCheck,
    },
    {
      label: "Airspace Opacification",
      value: "None Detected",
      status: "normal",
      tag: "Clear Parenchyma",
      subtext: "No focal pneumonia, patchy consolidation, or mass lesions identified.",
      icon: CheckCircle2,
    },
    {
      label: "Annotation Inspection",
      value: "Gastric Bubble Flag",
      status: "review",
      tag: "Doctor Decision",
      subtext: "Educational 'Fluid-Fluid Level' arrow points to physiological stomach bubble.",
      icon: AlertTriangle,
    },
  ];

  function getStatusStyles(status: string) {
    switch (status) {
      case "normal":
        return {
          bg: "bg-emerald-50/60 border-emerald-200/80 hover:border-emerald-300",
          badge: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
          iconColor: "text-emerald-600 bg-emerald-100/60",
          valColor: "text-emerald-950",
        };
      case "attention":
        return {
          bg: "bg-amber-50/60 border-amber-200/80 hover:border-amber-300",
          badge: "bg-amber-100/80 text-amber-800 border-amber-200",
          iconColor: "text-amber-600 bg-amber-100/60",
          valColor: "text-amber-950",
        };
      case "review":
      default:
        return {
          bg: "bg-sky-50/60 border-sky-200/80 hover:border-sky-300",
          badge: "bg-sky-100/80 text-sky-800 border-sky-200",
          iconColor: "text-sky-600 bg-sky-100/60",
          valColor: "text-sky-950",
        };
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-sky-600" />
          <span>High-Yield Landmark Status & Quick Metrics</span>
        </h4>
        <span className="text-[11px] font-semibold text-slate-500">
          6 Key Radiographic Indicators
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c, idx) => {
          const styles = getStatusStyles(c.status);
          const Icon = c.icon;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${styles.bg} shadow-2xs space-y-2`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`p-1.5 rounded-lg ${styles.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                  {c.tag}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 block truncate">
                  {c.label}
                </span>
                <h5 className={`text-sm font-bold mt-0.5 ${styles.valColor}`}>
                  {c.value}
                </h5>
              </div>

              <p className="text-[10px] text-slate-600 leading-snug">
                {c.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
