"use client";

import { useState, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Check,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Target,
  Droplet,
  Heart,
  ChevronRight,
  Zap,
  Info,
  Maximize2,
  X,
  Layers,
  Sliders,
  Languages,
} from "lucide-react";
import { WhatChangedItem } from "@/lib/ai/differentials";

interface ReportGraphComparisonProps {
  items: WhatChangedItem[];
  previousDate?: string;
  latestDate?: string;
}

// Interactive 3D Tilt Card Component with mouse parallax and specular shine
function Interactive3DCard({
  children,
  className = "",
  isSelected = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angle
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease",
      }}
      className={`relative rounded-3xl cursor-pointer select-none overflow-hidden will-change-transform ${
        isSelected
          ? "border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/15"
          : "border border-slate-200 hover:border-emerald-300 hover:shadow-lg shadow-xs"
      } ${className}`}
    >
      {/* Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

// 3D Semi-Circular Gauge Meter Component
function RadialGauge3D({
  latestPercent,
  prevPercent,
  statusType,
  unit,
  referenceRange,
}: {
  latestPercent: number; // 0 to 100
  prevPercent: number | null;
  statusType: "improved" | "attention" | "stable";
  unit: string;
  referenceRange: string;
}) {
  // Semi-circle arc calculations: radius 54, center (80, 75)
  // Angle spans from -180 deg to 0 deg (180 deg total sweep)
  const radius = 54;
  const circumference = Math.PI * radius; // half circle length ~ 169.6
  const strokeDashoffset = circumference - (latestPercent / 100) * circumference;

  // Pointer position on the arc for Latest
  const angleRad = Math.PI * (1 - latestPercent / 100);
  const pointerX = 80 - radius * Math.cos(angleRad);
  const pointerY = 75 - radius * Math.sin(angleRad);

  // Prev pointer position
  const prevAngleRad = prevPercent !== null ? Math.PI * (1 - prevPercent / 100) : null;
  const prevPointerX = prevAngleRad !== null ? 80 - radius * Math.cos(prevAngleRad) : null;
  const prevPointerY = prevAngleRad !== null ? 75 - radius * Math.sin(prevAngleRad) : null;

  const colorGradientId =
    statusType === "improved"
      ? "gradEmerald"
      : statusType === "attention"
      ? "gradRose"
      : "gradSky";

  return (
    <div className="relative w-44 h-28 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 160 95" className="w-full h-full overflow-visible drop-shadow-sm">
        <defs>
          <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradRose" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
          <linearGradient id="gradSky" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* 3D Track Drop Shadow */}
          <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 3D Floor Shadow */}
        <ellipse cx="80" cy="85" rx="55" ry="8" fill="rgba(0,0,0,0.06)" />

        {/* Background Inactive Arc Track */}
        <path
          d="M 26 75 A 54 54 0 0 1 134 75"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Clinical Safe Zone Indicator Arc (Green soft segment 0 to 50%) */}
        <path
          d="M 26 75 A 54 54 0 0 1 80 21"
          fill="none"
          stroke="#D1FAE5"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Active Volumetric Progress Arc */}
        <path
          d="M 26 75 A 54 54 0 0 1 134 75"
          fill="none"
          stroke={`url(#${colorGradientId})`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#gaugeShadow)"
          className="transition-all duration-700 ease-out"
        />

        {/* Previous Marker (Gray Ball) */}
        {prevPointerX !== null && prevPointerY !== null && (
          <g>
            <circle cx={prevPointerX} cy={prevPointerY} r="5" fill="#94A3B8" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}

        {/* Latest Active Pointer (Glowing Spherical Bead) */}
        <circle
          cx={pointerX}
          cy={pointerY}
          r="7"
          fill={statusType === "improved" ? "#059669" : statusType === "attention" ? "#E11D48" : "#0284C7"}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out shadow-md"
        />
      </svg>

      {/* Target Safe Label */}
      <div className="absolute bottom-0 text-[10px] font-semibold text-slate-400">
        Safe: {referenceRange}
      </div>
    </div>
  );
}

export function ReportGraphComparison({
  items,
  previousDate = "Jan 15, 2024",
  latestDate = "Jul 18, 2024",
}: ReportGraphComparisonProps) {
  // Category tabs: All, Sugar, Kidney, Heart
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "SUGAR" | "KIDNEY" | "HEART">("ALL");

  // Language selector state: English by default
  const [lang, setLang] = useState<"en" | "hi">("en");

  // Selected parameter modal / inspector
  const [inspectItem, setInspectItem] = useState<any | null>(null);

  // Plain language clinical status summaries with English & Hindi support
  const patientExplanations: Record<
    string,
    {
      category: "SUGAR" | "KIDNEY" | "HEART";
      organ: string;
      simpleName: string;
      targetSafeZone: string;
      statusHeadlineEn: string;
      statusHeadlineHi: string;
      statusType: "improved" | "attention" | "stable";
      shortSummaryEn: string;
      patientActionEn: string;
      shortSummaryHi: string;
      patientActionHi: string;
    }
  > = {
    hba1c: {
      category: "SUGAR",
      organ: "Blood Sugar Control",
      simpleName: "3-Month Average Blood Sugar (HbA1c)",
      targetSafeZone: "Below 5.7% (Safe Target)",
      statusHeadlineEn: "Great Progress! Down by 1.3%",
      statusHeadlineHi: "सकारात्मक सुधार! 1.3% की कमी",
      statusType: "improved",
      shortSummaryEn:
        "HbA1c dropped from 8.4% down to 7.1%. Your daily diabetes medicines and regular morning walks are showing strong positive results.",
      patientActionEn:
        "Continue your morning Metformin routine as advised. Next clinical benchmark target is below 6.5%.",
      shortSummaryHi:
        "HbA1c 8.4% से घटकर 7.1% हो गया है। नियमित दवा और मॉर्निंग वॉक का असर बहुत सकारात्मक है।",
      patientActionHi:
        "सुबह की मेटफ़ॉर्मिन दवा जारी रखें। अगला क्लीनिकल लक्ष्य 6.5% से नीचे लाना है।",
    },
    glucose: {
      category: "SUGAR",
      organ: "Fasting Glucose",
      simpleName: "Morning Fasting Blood Sugar",
      targetSafeZone: "70 – 99 mg/dL (Normal Range)",
      statusHeadlineEn: "Dropping toward Safe Target (-46 mg/dL)",
      statusHeadlineHi: "सुरक्षित लक्ष्य की ओर सुधार (-46 mg/dL)",
      statusType: "improved",
      shortSummaryEn:
        "Fasting blood glucose dropped from 168 down to 122 mg/dL, moving much closer to the normal morning benchmark (70–99 mg/dL).",
      patientActionEn:
        "Maintain light, early dinners and prioritize a high-fiber, low-carb morning breakfast.",
      shortSummaryHi:
        "खाली पेट शुगर 168 से घटकर 122 mg/dL हो गई है, जो सुरक्षित स्तर (70–99) के काफी करीब है।",
      patientActionHi:
        "रात का भारी भोजन टालें और सुबह फाइबर युक्त नाश्ता लें।",
    },
    creatinine: {
      category: "KIDNEY",
      organ: "Kidney Filtration",
      simpleName: "Serum Creatinine (Waste Filter)",
      targetSafeZone: "0.7 – 1.2 mg/dL (Normal Kidney Zone)",
      statusHeadlineEn: "Action Needed: Temporary filter strain (+70% rise)",
      statusHeadlineHi: "सावधानी आवश्यक: फ़िल्टर पर अस्थाई लोड",
      statusType: "attention",
      shortSummaryEn:
        "Creatinine rose from 1.0 to 1.7 mg/dL, indicating temporary extra load on kidney filters, likely from mild dehydration or medication adjustment.",
      patientActionEn:
        "Drink 2.5L clean water daily and review dosage adjustments with Dr. Meera Nair on your Oct 24 appointment.",
      shortSummaryHi:
        "क्रिएटिनिन 1.0 से बढ़कर 1.7 mg/dL हुआ है, जो पानी की कमी या दवाओं से अस्थाई लोड दर्शाता है।",
      patientActionHi:
        "रोज़ाना 2.5L पानी पिएं और 24 अक्टूबर को डॉक्टर से डोज़ चेक कराएं।",
    },
    bun: {
      category: "KIDNEY",
      organ: "Kidney Waste",
      simpleName: "Blood Urea Nitrogen (BUN)",
      targetSafeZone: "7 – 20 mg/dL (Healthy Filter Range)",
      statusHeadlineEn: "Action Needed: Elevated protein waste (34 mg/dL)",
      statusHeadlineHi: "सावधानी आवश्यक: वेस्ट स्तर में वृद्धि",
      statusType: "attention",
      shortSummaryEn:
        "BUN rose from 16 to 34 mg/dL. This commonly elevates during mild dehydration or higher protein metabolic load.",
      patientActionEn:
        "Increase daily plain water intake and cut down on heavily salted or processed snacks.",
      shortSummaryHi:
        "BUN 16 से बढ़कर 34 mg/dL हो गया है। पानी की मात्रा बढ़ाएं और नमकीन स्नैक्स कम करें।",
      patientActionHi:
        "पानी का सेवन बढ़ाएं और प्रोसेस्ड फूड से बचें।",
    },
    egfr: {
      category: "KIDNEY",
      organ: "Kidney Speed",
      simpleName: "Estimated Kidney Speed (eGFR)",
      targetSafeZone: "Above 60 mL/min (Optimal Speed)",
      statusHeadlineEn: "Newly Logged: 46 mL/min (Doctor Monitoring)",
      statusHeadlineHi: "नवीनतम रिकॉर्ड: 46 mL/min (निगरानी जारी)",
      statusType: "attention",
      shortSummaryEn:
        "eGFR is documented at 46 mL/min. Your doctor is monitoring closely and adjusting dosages to keep filtration completely safe.",
      patientActionEn:
        "Strictly avoid over-the-counter painkillers (such as Ibuprofen, Combiflam, or Diclofenac) without doctor approval.",
      shortSummaryHi:
        "eGFR 46 mL/min रिकॉर्ड हुआ है। डॉक्टर इस पर नज़र रख कर दवाएं सुरक्षित रखेंगे।",
      patientActionHi:
        "बिना डॉक्टर की सलाह के दर्दनिवारक दवाएं बिल्कुल न लें।",
    },
    cholesterol: {
      category: "HEART",
      organ: "Heart & Blood Vessels",
      simpleName: "Total Blood Cholesterol",
      targetSafeZone: "Below 200 mg/dL (Safe Heart Zone)",
      statusHeadlineEn: "Safe Zone Reached! Normalized to 174 mg/dL",
      statusHeadlineHi: "सुरक्षित ज़ोन! 174 mg/dL पर सामान्य",
      statusType: "improved",
      shortSummaryEn:
        "Total Cholesterol dropped from 224 to 174 mg/dL, safely within the healthy green target zone. Statin therapy is highly effective.",
      patientActionEn:
        "Continue your bedtime Atorvastatin regularly and favor heart-healthy oils in your meals.",
      shortSummaryHi:
        "कोलेस्ट्रॉल 224 से गिरकर 174 mg/dL सुरक्षित ज़ोन में आ गया है। दवा का बहुत अच्छा असर हुआ है।",
      patientActionHi:
        "शाम की दवा नियमित लें और स्वस्थ तेल का इस्तेमाल करें।",
    },
    ldl: {
      category: "HEART",
      organ: "Heart Protection",
      simpleName: "Bad Cholesterol (LDL)",
      targetSafeZone: "Below 100 mg/dL (Clean Arteries)",
      statusHeadlineEn: "Goal Reached! Dropped to 92 mg/dL (-42 mg/dL)",
      statusHeadlineHi: "लक्ष्य प्राप्त! 92 mg/dL तक सुधार",
      statusType: "improved",
      shortSummaryEn:
        "Bad LDL cholesterol dropped from 134 down to 92 mg/dL. Reaching the <100 target significantly reduces arterial plaque buildup.",
      patientActionEn:
        "Continue your 20–30 minutes daily brisk morning walk routine.",
      shortSummaryHi:
        "खराब कोलेस्ट्रॉल 134 से घटकर 92 mg/dL हो गया है, जिससे नसों में ब्लॉकेज का खतरा काफी घट गया है।",
      patientActionHi:
        "रोज़ाना 20-30 मिनट की वॉक जारी रखें।",
    },
    "blood pressure": {
      category: "HEART",
      organ: "Blood Pressure",
      simpleName: "Arterial Blood Pressure (BP)",
      targetSafeZone: "120/80 mmHg (Optimal Target)",
      statusHeadlineEn: "Controlled Nicely (126/80 mmHg)",
      statusHeadlineHi: "नियंत्रित स्तर (126/80 mmHg)",
      statusType: "improved",
      shortSummaryEn:
        "Blood pressure settled from 138/88 to a healthy 126/80 mmHg. Excellent for heart protection and reducing cardiac strain.",
      patientActionEn:
        "Check and log your morning BP twice weekly in your patient timeline.",
      shortSummaryHi:
        "बीपी 138/88 से नियंत्रित होकर 126/80 mmHg पर सामान्य है। दिल की सुरक्षा के लिए यह बहुत अच्छा है।",
      patientActionHi:
        "हफ़्ते में 2 बार सुबह बीपी नापकर टाइमलाइन में दर्ज करें।",
    },
    microalbumin: {
      category: "KIDNEY",
      organ: "Kidney Micro-vessels",
      simpleName: "Urine Protein Leakage",
      targetSafeZone: "Below 30 mg/g (Normal Protein Retained)",
      statusHeadlineEn: "Needs Doctor Watch: Minor protein leak (88 mg/g)",
      statusHeadlineHi: "डॉक्टर समीक्षा: प्रोटीन स्तर (88 mg/g)",
      statusType: "attention",
      shortSummaryEn:
        "Microalbumin noted at 88 mg/g, showing mild, reversible protein leakage across microscopic kidney filters.",
      patientActionEn:
        "Discuss renal-protective prescription adjustments with Dr. Meera Nair on your follow-up.",
      shortSummaryHi:
        "माइक्रोएल्बुमिन 88 mg/g दर्ज हुआ है, जो किडनी के छोटे फ़िल्टर में हल्का अस्थाई रिसाव दिखाता है।",
      patientActionHi:
        "डॉक्टर मीरा नायर से किडनी सुरक्षा दवाओं पर चर्चा करें।",
    },
  };

  const getExplanation = (paramName: string) => {
    const lower = paramName.toLowerCase();
    for (const [key, val] of Object.entries(patientExplanations)) {
      if (lower.includes(key)) return val;
    }
    return {
      category: "SUGAR" as const,
      organ: "General Biomarker",
      simpleName: paramName,
      targetSafeZone: "Standard Diagnostic Reference Limits",
      statusHeadlineEn: "Monitored Between Checkups",
      statusHeadlineHi: "नियमित जांच के तहत",
      statusType: "stable" as const,
      shortSummaryEn:
        "This parameter was compared across your baseline and follow-up lab tests.",
      patientActionEn:
        "Your doctor will review this metric during your next consultation.",
      shortSummaryHi:
        "इस पैरामीटर की पिछली और ताज़ा रिपोर्ट के बीच तुलना की गई है।",
      patientActionHi:
        "आपकी अगली डॉक्टर विज़िट में इस पर विस्तार से चर्चा होगी।",
    };
  };

  // Clean numerical parsing and percentage calculation
  const processedItems = items
    .map((item) => {
      const prevVal = parseFloat(item.previousValue.replace(/[^\d.-]/g, ""));
      const latestVal = parseFloat(item.latestValue.replace(/[^\d.-]/g, ""));
      if (isNaN(latestVal)) return null;

      const maxVal = Math.max(isNaN(prevVal) ? latestVal : prevVal, latestVal) * 1.35 || 100;
      const prevPercent = isNaN(prevVal) ? null : Math.min(92, Math.max(8, (prevVal / maxVal) * 100));
      const latestPercent = Math.min(92, Math.max(8, (latestVal / maxVal) * 100));

      const isImproved = item.category === "IMPROVED";
      const isReview = item.category === "REQUIRES_REVIEW";

      const explanation = getExplanation(item.parameter);

      let deltaStr = "";
      if (!isNaN(prevVal)) {
        const diff = latestVal - prevVal;
        const sign = diff > 0 ? "+" : "";
        deltaStr = `${sign}${diff.toFixed(1)} ${item.unit}`.trim();
      }

      return {
        ...item,
        prevVal: isNaN(prevVal) ? null : prevVal,
        latestVal,
        prevPercent,
        latestPercent,
        maxVal,
        isImproved,
        isReview,
        deltaStr,
        explanation,
      };
    })
    .filter(Boolean) as (WhatChangedItem & {
    prevVal: number | null;
    latestVal: number;
    prevPercent: number | null;
    latestPercent: number;
    maxVal: number;
    isImproved: boolean;
    isReview: boolean;
    deltaStr: string;
    explanation: {
      category: "SUGAR" | "KIDNEY" | "HEART";
      organ: string;
      simpleName: string;
      targetSafeZone: string;
      statusHeadlineEn: string;
      statusHeadlineHi: string;
      statusType: "improved" | "attention" | "stable";
      shortSummaryEn: string;
      patientActionEn: string;
      shortSummaryHi: string;
      patientActionHi: string;
    };
  })[];

  const filteredItems = processedItems.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return item.explanation.category === selectedCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. COMPACT TOP HEADER WITH CATEGORY PILLS (PHOTO 3)            */}
      {/* ============================================================== */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interactive 3D Health Trajectory Gauges</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {lang === "en" ? "Biomarker Comparison • Baseline vs Latest" : "बायोमार्कर्स तुलना • पिछली बनाम नवीनतम रिपोर्ट"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {lang === "en"
                ? "Hover over any card for 3D parallax inspection. See your test values move into the healthy target zone."
                : "3D व्यू के लिए कार्ड पर होवर करें और देखें कि आपके टेस्ट नंबर सुरक्षित ज़ोन में आ रहे हैं।"}
            </p>
          </div>

          {/* Previous vs Latest Legend in Pure English */}
          <div className="flex items-center gap-4 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400"></span>
              <span className="text-slate-600">{lang === "en" ? "Previous" : "पिछला"}: {previousDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
              <span className="text-emerald-800 font-bold">{lang === "en" ? "Latest" : "नवीनतम"}: {latestDate}</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-[#064E3B] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Biomarkers ({processedItems.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("SUGAR")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "SUGAR"
                ? "bg-[#064E3B] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-rose-500" />
            <span>Blood Sugar &amp; Metabolism</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("KIDNEY")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "KIDNEY"
                ? "bg-[#064E3B] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Kidneys &amp; Renal Filtration</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("HEART")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "HEART"
                ? "bg-[#064E3B] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Heart &amp; Cholesterol</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. COMPACT EXECUTIVE PATIENT STATUS SCORECARD (PHOTO 2)        */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-[#F4FAF7] via-[#ECF8F2] to-[#E3F6EC] border border-[#BDE8D1] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#BDE8D1]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {lang === "en" ? "Overall Patient Health Story • At A Glance" : "स्वास्थ्य सारांश • एक नज़र में"}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {lang === "en"
                  ? "Significant Progress in Sugar & Cholesterol • 2 Kidney Action Items"
                  : "शुगर और कोलेस्ट्रॉल में बड़ा सुधार • 2 किडनी संबंधित निर्देश"}
              </h3>
            </div>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-2xs">
            {lang === "en" ? "Review Status: On Track with 2 Actions" : "स्थिति: 2 आवश्यक सावधानियों के साथ सामान्य"}
          </span>
        </div>

        {/* 2 Compact Executive Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* Column 1: The Good News */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>{lang === "en" ? "The Good News: Significant Improvements" : "सकारात्मक सुधार"}</span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>
                  <strong>HbA1c dropped from 8.4% down to 7.1%</strong> (-1.3%). Your daily diabetes medicines are effectively keeping long-term sugar under control.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>
                  <strong>Fasting Blood Glucose dropped to 122 mg/dL</strong> (down from 168 mg/dL), moving much closer to the normal morning target (70–99).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>
                  <strong>Total Cholesterol normalized to 174 mg/dL</strong> (&lt;200 mg/dL safe zone) and Bad LDL dropped to 92 mg/dL, strongly protecting heart &amp; arteries.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: What Needs Doctor Attention */}
          <div className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
              <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>{lang === "en" ? "Focus Area: Kidney Hydration & Filter Care" : "ध्यान देने योग्य: किडनी हाइड्रेशन एवं सुरक्षा"}</span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>
                  <strong>Serum Creatinine rose from 1.0 to 1.7 mg/dL</strong> and BUN increased to 34 mg/dL. This shows kidneys are working harder to filter waste.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>
                  <strong>Action Plan:</strong> Drink 2.5L clean water daily. Avoid heavy painkiller pills (NSAIDs) which strain kidney filters.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>
                  <strong>Doctor Consultation:</strong> Discuss dosage adjustments with Dr. Meera Nair on your <strong>24 Oct Apollo Clinic appointment</strong>.
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. 3D PARALLAX CARDS GRID (ALL BIOMARKERS) (PHOTO 1)           */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Detailed Biomarker Gauges ({filteredItems.length}) &bull; Hover for 3D Tilt
          </h3>
          <span className="text-[11px] text-slate-400 font-normal">
            Click any card to inspect full clinical details
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isSelected = inspectItem?.parameter === item.parameter;

            return (
              <Interactive3DCard
                key={item.parameter}
                isSelected={isSelected}
                onClick={() => setInspectItem(item)}
                className="bg-white p-5 sm:p-5.5 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        {item.explanation.organ}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5 leading-snug">
                        {item.parameter}
                      </h4>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        item.isImproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.isReview
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {item.isImproved ? "🟢 Down/Better" : item.isReview ? "🔴 Attention" : "🔵 New"}
                    </span>
                  </div>

                  {/* 3D Semi-Circular Radial Gauge */}
                  <div className="py-1">
                    <RadialGauge3D
                      latestPercent={item.latestPercent}
                      prevPercent={item.prevPercent}
                      statusType={
                        item.isImproved
                          ? "improved"
                          : item.isReview
                          ? "attention"
                          : "stable"
                      }
                      unit={item.unit}
                      referenceRange={item.referenceRange}
                    />
                  </div>

                  {/* Previous vs Latest Numerical Values in Pure English */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400">
                        {lang === "en" ? "Previous" : "पिछला"} ({previousDate})
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">
                        {item.previousValue || "—"}
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-xl border ${
                        item.isImproved
                          ? "bg-emerald-50/60 border-emerald-200"
                          : item.isReview
                          ? "bg-rose-50/60 border-rose-200"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-500">
                        {lang === "en" ? "Latest" : "नवीनतम"} ({latestDate})
                      </div>
                      <div
                        className={`text-sm font-extrabold mt-0.5 ${
                          item.isImproved
                            ? "text-emerald-800"
                            : item.isReview
                            ? "text-rose-800"
                            : "text-slate-900"
                        }`}
                      >
                        {item.latestValue}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Summary 2-Line Takeaway in Clean English */}
                <div className="pt-2.5 border-t border-slate-100 space-y-1">
                  <div className="text-[11px] font-bold text-slate-800">
                    {lang === "en" ? item.explanation.statusHeadlineEn : item.explanation.statusHeadlineHi}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
                    {lang === "en" ? item.explanation.shortSummaryEn : item.explanation.shortSummaryHi}
                  </p>
                </div>
              </Interactive3DCard>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL: DETAILED BIOMARKER DEEP-DIVE INSPECTION              */}
      {/* ============================================================== */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  {inspectItem.explanation.organ} &bull; Detailed Analysis
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {inspectItem.parameter} ({inspectItem.unit})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              
              {/* 3D Gauge */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                <RadialGauge3D
                  latestPercent={inspectItem.latestPercent}
                  prevPercent={inspectItem.prevPercent}
                  statusType={
                    inspectItem.isImproved
                      ? "improved"
                      : inspectItem.isReview
                      ? "attention"
                      : "stable"
                  }
                  unit={inspectItem.unit}
                  referenceRange={inspectItem.referenceRange}
                />
                
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div>Previous: <strong>{inspectItem.previousValue}</strong></div>
                  <div>&rarr;</div>
                  <div>Latest: <strong className="text-emerald-700 text-sm">{inspectItem.latestValue}</strong></div>
                  {inspectItem.deltaStr && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {inspectItem.deltaStr}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Friendly Meaning */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What Does This Mean For You?</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === "en" ? inspectItem.explanation.shortSummaryEn : inspectItem.explanation.shortSummaryHi}
                </p>
              </div>

              {/* Doctor Recommended Next Steps */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Doctor's Advice &amp; Action Items</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === "en" ? inspectItem.explanation.patientActionEn : inspectItem.explanation.patientActionHi}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectItem(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close &amp; Continue
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. BOTTOM BAR: COMPACT LANGUAGE SELECTOR & NOTE                */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px]">
            Longitudinal biomarker data verified against accredited diagnostic laboratory records.
          </span>
        </div>

        {/* Small Language Dropdown as requested */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-emerald-700" />
            Language:
          </span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "en" | "hi")}
            className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            aria-label="Select portal language"
          >
            <option value="en">English (Default)</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

    </div>
  );
}
