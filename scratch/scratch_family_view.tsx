"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  User,
  Heart,
  Plus,
  ShieldCheck,
  Crown,
  FileText,
  Pill,
  Sparkles,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  Eye,
  Download,
  Share2,
  X,
  Stethoscope,
  ChevronRight,
  Info,
  Lock,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
  Volume2,
  Languages,
  TrendingDown,
  TrendingUp,
  Check,
} from "lucide-react";
import { useSubscription } from "@/lib/subscription";

export interface TimelineBiomarker {
  name: string;
  value: string;
  delta?: string;
  status: "IMPROVED" | "NEEDS_ATTENTION" | "OPTIMAL" | "STABLE";
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  organFocus: string[];
  biomarkers: TimelineBiomarker[];
  aiSummary: string;
  drNote: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  bloodGroup: string;
  conditions: string[];
  allergies: string[];
  latestVitals: {
    bp: string;
    sugar: string;
    keyMetric: string;
    keyMetricValue: string;
    status: "NORMAL" | "NEEDS_ATTENTION" | "OPTIMAL";
  };
  activeMedications: {
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
  }[];
  recentRecords: {
    id: string;
    title: string;
    date: string;
    category: string;
    status: string;
  }[];
  aiTakeaway: string;
  bilingualAudio: {
    englishText: string;
    hindiText: string;
    duration: string;
  };
  timelineEvents: TimelineEvent[];
}

const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "fam_rajesh",
    name: "Rajesh Sharma",
    relationship: "Self (Father)",
    age: 52,
    gender: "Male",
    bloodGroup: "B+",
    conditions: ["Type 2 Diabetes", "Mild AKI (Improving)", "Hypertension"],
    allergies: ["No known drug allergies"],
    latestVitals: {
      bp: "126/80 mmHg",
      sugar: "122 mg/dL (Fasting)",
      keyMetric: "Creatinine",
      keyMetricValue: "1.7 mg/dL (Filtered slower)",
      status: "NEEDS_ATTENTION",
    },
    activeMedications: [
      { name: "Linagliptin", dosage: "5 mg", frequency: "Once Daily", timing: "Morning after food" },
      { name: "Amlodipine", dosage: "5 mg", frequency: "Once Daily", timing: "Bedtime" },
      { name: "Atorvastatin", dosage: "10 mg", frequency: "Once Daily", timing: "Night after dinner" },
    ],
    recentRecords: [
      { id: "REC-RS-1", title: "Follow-up Glycemic, Renal & Lipid Profile", date: "18 Jul 2026", category: "Blood Test", status: "AI Formatted" },
      { id: "REC-RS-2", title: "12-Lead Electrocardiogram (ECG)", date: "10 Mar 2026", category: "Cardiology", status: "Verified Normal" },
      { id: "REC-RS-3", title: "Baseline Comprehensive Metabolic Panel", date: "15 Jan 2026", category: "Blood Test", status: "Archived" },
    ],
    aiTakeaway: "Great news on sugar (HbA1c down from 8.2% to 7.1%) and BP. Kidneys filtering temporarily slower (Creatinine 1.7); Metformin paused for safety. Hydrate with 2.5-3L water daily.",
    bilingualAudio: {
      englishText: "Hello Rajesh. Your long-term blood sugar is much better: HbA1c dropped from 8.2% to 7.1%. Because your kidneys are filtering slightly slower right now with Creatinine at 1.7, Dr. Mehta safely paused Metformin and started Linagliptin. Blood pressure is well-controlled at 126/80. Drink plenty of water.",
      hindiText: "नमस्ते राजेश जी। आपका ब्लड शुगर काफी सुधरा है, HbA1c 8.2% से घटकर 7.1% हो गया है। किडनी की जांच में क्रिएटिनिन 1.7 आने के कारण डॉक्टर मेहता ने मेटफॉर्मिन रोककर लीनाग्लिप्टिन शुरू की है ताकि किडनी सुरक्षित रहे। रोज 2.5 से 3 लीटर पानी अवश्य पिएं।",
      duration: "0:56 min",
    },
    timelineEvents: [
      {
        id: "evt-rs-1",
        date: "18 Jul 2026",
        title: "Follow-up Glycemic, Renal & Lipid Digitization",
        category: "Biochemistry & Renal",
        organFocus: ["Blood Sugar", "Kidneys", "Lipids"],
        biomarkers: [
          { name: "HbA1c", value: "7.1%", delta: "Improved (-1.1%)", status: "IMPROVED" },
          { name: "Serum Creatinine", value: "1.7 mg/dL", delta: "Elevated (+0.5)", status: "NEEDS_ATTENTION" },
          { name: "Blood Pressure", value: "126/80 mmHg", delta: "Optimal", status: "OPTIMAL" },
          { name: "LDL Cholesterol", value: "88 mg/dL", delta: "Within Target", status: "OPTIMAL" },
        ],
        aiSummary: "Substantial glycemic improvement. Renal filtration temporarily sluggish. Nephro-protective safety protocol initiated.",
        drNote: "Metformin withheld pending renal clearance. Linagliptin 5mg daily commenced. Repeat renal function in 4 weeks.",
      },
      {
        id: "evt-rs-2",
        date: "10 Mar 2026",
        title: "12-Lead Electrocardiogram (ECG) Review",
        category: "Cardiology",
        organFocus: ["Heart & Circulation"],
        biomarkers: [
          { name: "Heart Rhythm", value: "Normal Sinus", status: "OPTIMAL" },
          { name: "Resting Rate", value: "72 bpm", status: "OPTIMAL" },
        ],
        aiSummary: "Cardiovascular electrical conduct is regular with no ischemic changes. Lipids well governed on Atorvastatin.",
        drNote: "Continue Amlodipine 5mg and Atorvastatin 10mg. Cardiovascular risk remains low.",
      },
      {
        id: "evt-rs-3",
        date: "15 Jan 2026",
        title: "Baseline Comprehensive Metabolic Assessment",
        category: "Routine Baseline",
        organFocus: ["Metabolism"],
        biomarkers: [
          { name: "HbA1c", value: "8.2%", status: "NEEDS_ATTENTION" },
          { name: "Fasting Blood Sugar", value: "168 mg/dL", status: "NEEDS_ATTENTION" },
          { name: "Creatinine", value: "1.2 mg/dL", status: "STABLE" },
        ],
        aiSummary: "Baseline diabetic status documented. Longitudinal lifestyle and dietary monitoring established.",
        drNote: "Initiated structured glycemic monitoring and nutritional counseling.",
      },
    ],
  },
  {
    id: "fam_sunita",
    name: "Sunita Sharma",
    relationship: "Spouse (Mother)",
    age: 48,
    gender: "Female",
    bloodGroup: "O+",
    conditions: ["Primary Hypothyroidism", "Borderline Dyslipidemia"],
    allergies: ["Sulfa drugs (mild rash)"],
    latestVitals: {
      bp: "124/82 mmHg",
      sugar: "98 mg/dL (Random)",
      keyMetric: "TSH (Thyroid)",
      keyMetricValue: "3.2 mIU/L (Euthyroid)",
      status: "NORMAL",
    },
    activeMedications: [
      { name: "Thyronorm (Levothyroxine)", dosage: "50 mcg", frequency: "Once Daily", timing: "Empty stomach early morning" },
      { name: "Vitamin D3 + B12", dosage: "Weekly Capsule", frequency: "Once a Week", timing: "Sundays after breakfast" },
    ],
    recentRecords: [
      { id: "REC-SS-1", title: "Comprehensive Thyroid Profile (T3, T4, TSH)", date: "12 Sep 2026", category: "Hormone Test", status: "AI Formatted" },
      { id: "REC-SS-2", title: "Annual Lipid & Liver Function Screening", date: "04 May 2026", category: "Biochemistry", status: "Normal" },
    ],
    aiTakeaway: "Thyroid hormone level is in perfect balance (TSH 3.2 mIU/L). Cholesterol dropped to a healthy 194 mg/dL. Continue Thyronorm 30 minutes before morning tea.",
    bilingualAudio: {
      englishText: "Hello Sunita. Your thyroid hormone TSH is currently 3.2, which is in the optimal normal range. Your cholesterol has also dropped from 228 to 194 mg/dL thanks to daily walking. Continue taking Thyronorm 50 mcg on an empty stomach with a full glass of water.",
      hindiText: "नमस्ते सुनीता जी। आपकी थायराइड रिपोर्ट बहुत अच्छी आई है, TSH 3.2 है जो बिल्कुल सामान्य है। कोलेस्ट्रॉल भी घटकर 194 mg/dL हो गया है। सुबह खाली पेट थायरोनॉर्म 50mcg चाय से 30 मिनट पहले नियमित रूप से लेती रहें।",
      duration: "0:50 min",
    },
    timelineEvents: [
      {
        id: "evt-ss-1",
        date: "12 Sep 2026",
        title: "Comprehensive Thyroid Hormone Surveillance",
        category: "Endocrinology",
        organFocus: ["Thyroid & Energy"],
        biomarkers: [
          { name: "TSH", value: "3.2 mIU/L", delta: "Normal (Prior: 5.4)", status: "OPTIMAL" },
          { name: "Free T4", value: "1.18 ng/dL", delta: "Normal Range", status: "OPTIMAL" },
        ],
        aiSummary: "Target euthyroid metabolic balance achieved. Current 50 mcg Levothyroxine dosage is highly effective.",
        drNote: "Dose titrated accurately. Maintain current regimen. Retest TSH after 6 months.",
      },
      {
        id: "evt-ss-2",
        date: "04 May 2026",
        title: "Annual Lipid & Cardiovascular Health Screen",
        category: "Lipid Profile",
        organFocus: ["Cardiovascular"],
        biomarkers: [
          { name: "Total Cholesterol", value: "194 mg/dL", delta: "Improved (Was 228)", status: "IMPROVED" },
          { name: "Triglycerides", value: "142 mg/dL", delta: "Normal", status: "OPTIMAL" },
          { name: "HDL (Good)", value: "52 mg/dL", delta: "Protective", status: "OPTIMAL" },
        ],
        aiSummary: "Significant lipid profile recovery. Dietary fat control and morning walks successfully normalized lipid ratios.",
        drNote: "No statin therapy required. Continue lifestyle adherence and aerobic walking.",
      },
    ],
  },
  {
    id: "fam_rohan",
    name: "Rohan Sharma",
    relationship: "Son",
    age: 21,
    gender: "Male",
    bloodGroup: "B+",
    conditions: ["Seasonal Allergic Rhinitis (Dust/Pollen)"],
    allergies: ["Dust mites, pollen"],
    latestVitals: {
      bp: "118/76 mmHg",
      sugar: "88 mg/dL (Fasting)",
      keyMetric: "Resting Heart Rate",
      keyMetricValue: "64 bpm (Athletic)",
      status: "OPTIMAL",
    },
    activeMedications: [
      { name: "Levocetirizine", dosage: "5 mg", frequency: "As Needed (PRN)", timing: "At night during allergy flare-ups" },
    ],
    recentRecords: [
      { id: "REC-RH-1", title: "Pre-College Comprehensive Health & CBC", date: "20 Aug 2026", category: "General Health", status: "Verified Normal" },
      { id: "REC-RH-2", title: "Serum Total IgE Allergy Screen", date: "14 Feb 2026", category: "Immunology", status: "Reviewed" },
    ],
    aiTakeaway: "Excellent cardiovascular health (BP 118/76, HR 64 bpm). Dust allergy managed with SOS Levocetirizine. Due to family diabetes history, an annual sugar check after age 25 is recommended.",
    bilingualAudio: {
      englishText: "Hello Rohan. Your blood counts and resting heart rate of 64 bpm reflect strong athletic fitness. Hemoglobin is optimal at 15.2. Seasonal dust causes mild sneezing, so keep Levocetirizine handy. Since diabetes runs in the family, maintain an active lifestyle.",
      hindiText: "नमस्ते रोहन। आपकी फिटनेस और हीमोग्लोबिन 15.2 बहुत बढ़िया है। ब्लड प्रेशर 118/76 और हार्ट रेट 64 बिल्कुल सामान्य है। धूल से एलर्जी होने पर रात में लेवोसिट्रीज़िन ले सकते हैं। परिवार में शुगर की हिस्ट्री है, इसलिए स्वस्थ खान-पान जारी रखें।",
      duration: "0:48 min",
    },
    timelineEvents: [
      {
        id: "evt-rh-1",
        date: "20 Aug 2026",
        title: "Pre-College Comprehensive CBC & Fitness Vitals",
        category: "Hematology & Vitals",
        organFocus: ["Immunity", "Blood Cells"],
        biomarkers: [
          { name: "Hemoglobin", value: "15.2 g/dL", delta: "Optimal", status: "OPTIMAL" },
          { name: "Blood Pressure", value: "118/76 mmHg", delta: "Athletic Norm", status: "OPTIMAL" },
          { name: "Fasting Sugar", value: "88 mg/dL", delta: "Excellent", status: "OPTIMAL" },
        ],
        aiSummary: "Optimal cellular oxygen-carrying capacity. Vitals indicative of peak young adult conditioning.",
        drNote: "Medically fit. Paternal family diabetes history noted for future preventative screening.",
      },
      {
        id: "evt-rh-2",
        date: "14 Feb 2026",
        title: "Serum Total IgE & Environmental Allergen Scan",
        category: "Allergy Panel",
        organFocus: ["Respiratory"],
        biomarkers: [
          { name: "Total IgE", value: "182 IU/mL", delta: "Mild Elevation", status: "NEEDS_ATTENTION" },
          { name: "Absolute Eosinophils", value: "480 cells/mcL", status: "STABLE" },
        ],
        aiSummary: "Confirmed hypersensitivity to indoor dust mites and pollen. No food or severe anaphylactic risks.",
        drNote: "Advised room dehumidification, dust mite mattress encasings, and PRN antihistamines.",
      },
    ],
  },
  {
    id: "fam_kamla",
    name: "Kamla Sharma",
    relationship: "Mother (Grandmother)",
    age: 76,
    gender: "Female",
    bloodGroup: "A+",
    conditions: ["Bilateral Knee Osteoarthritis", "Mild Essential Hypertension"],
    allergies: ["NSAID painkiller sensitivity (gastritis)"],
    latestVitals: {
      bp: "134/82 mmHg",
      sugar: "114 mg/dL",
      keyMetric: "eGFR (Kidney)",
      keyMetricValue: "62 mL/min (Age appropriate)",
      status: "NORMAL",
    },
    activeMedications: [
      { name: "Telmisartan", dosage: "20 mg", frequency: "Once Daily", timing: "Morning after breakfast" },
      { name: "Calcium Citrate Malate + D3", dosage: "1 Tablet", frequency: "Daily", timing: "After lunch" },
      { name: "Glucosamine Sulphate", dosage: "1500 mg", frequency: "Daily", timing: "For joint cartilage support" },
    ],
    recentRecords: [
      { id: "REC-KS-1", title: "Both Knees Standing Digital X-Ray (AP/Lat)", date: "14 Jul 2026", category: "X-Ray", status: "Indexed" },
      { id: "REC-KS-2", title: "Senior Geriatric Metabolic & Bone Profile", date: "10 Mar 2026", category: "Blood Test", status: "Reviewed" },
    ],
    aiTakeaway: "Blood pressure is well controlled at 134/82 with Telmisartan. Kidney eGFR 62 is very safe for age 76. Avoid NSAID pain relievers (Brufen/Combiflam) to safeguard kidneys and stomach.",
    bilingualAudio: {
      englishText: "Hello Kamla ji. Your blood pressure of 134/82 is safe on Telmisartan. Your kidney filtration rate of 62 is good for 76 years. Knee joint pain is from age-related osteoarthritis. Please avoid strong over-the-counter painkillers like Brufen; take your Calcium and do gentle knee exercises.",
      hindiText: "प्रणाम कमला जी। 76 वर्ष की उम्र में आपका बीपी 134/82 और किडनी eGFR 62 बहुत सुरक्षित और सामान्य है। घुटनों के दर्द के लिए भारी पेनकिलर (जैसे ब्रूफेन) कभी न लें। डॉक्टर द्वारा दी गई कैल्शियम और हल्की फिजियोथेरेपी से घुटनों को सहारा मिलेगा।",
      duration: "0:58 min",
    },
    timelineEvents: [
      {
        id: "evt-ks-1",
        date: "14 Jul 2026",
        title: "Bilateral Knee Standing Digital Radiography",
        category: "Orthopedics & Imaging",
        organFocus: ["Bones & Joints"],
        biomarkers: [
          { name: "Medial Joint Space", value: "Grade 2 Narrowing", status: "NEEDS_ATTENTION" },
          { name: "Osteophytes", value: "Mild Marginal", status: "STABLE" },
        ],
        aiSummary: "Moderate degenerative joint wear consistent with senior osteoarthritis. No acute ligamentous collapse.",
        drNote: "Advised low-impact isometric quadriceps physiotherapy, heat application, and Glucosamine supplementation.",
      },
      {
        id: "evt-ks-2",
        date: "10 Mar 2026",
        title: "Geriatric Renal & Mineral Metabolism Screen",
        category: "Biochemistry",
        organFocus: ["Kidneys & Bones"],
        biomarkers: [
          { name: "eGFR", value: "62 mL/min/1.73m²", delta: "Stable for 76 Yrs", status: "OPTIMAL" },
          { name: "Serum Calcium", value: "9.1 mg/dL", delta: "Normal", status: "OPTIMAL" },
          { name: "Blood Pressure", value: "134/82 mmHg", delta: "Safe Range", status: "OPTIMAL" },
        ],
        aiSummary: "Renal preservation confirmed. Electrolyte balance within safe gerontological margins.",
        drNote: "Continue Telmisartan 20mg daily. Strict avoidance of nephrotoxic NSAIDs emphasized.",
      },
    ],
  },
];

export function PatientFamilyPortalView() {
  const { isSubscribed, plan, isLoaded } = useSubscription();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("fam_rajesh");
  const [activeTab, setActiveTab] = useState<"overview" | "ai-story" | "records" | "meds">("ai-story");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Audio Playback Simulation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<"en" | "hi">("en");

  // New Member Form State
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("Daughter");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("Female");
  const [newBloodGroup, setNewBloodGroup] = useState("B+");
  const [newConditions, setNewConditions] = useState("");

  const isFamilyUnlocked = isSubscribed && plan === "FAMILY";
  const isSoloPlan = isSubscribed && plan === "INDIVIDUAL";

  if (!isLoaded) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Checking Family Pass authorization...</p>
      </div>
    );
  }

  // ========================================================
  // 1. LOCKED GATE: USER HAS SOLO PLAN (₹99) OR UNSUBSCRIBED
  // ========================================================
  if (!isFamilyUnlocked) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        
        {/* Locked Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0C1A20] to-[#0A262C] text-white border-2 border-amber-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isSoloPlan ? "SOLO AI PASS ACTIVE • FAMILY PORTAL LOCKED" : "CODE-RX FAMILY PASS • LOCKED"}
                </span>
              </span>

              {isSoloPlan && (
                <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                  1 Individual Profile (Rajesh Sharma)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {isSoloPlan
                ? "Upgrade to Unlock Segregated AI Timelines for All Family Members"
                : "Centralized Family Health Vault & Segregated AI Timelines"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isSoloPlan ? (
                <span>
                  Your <strong>Solo AI Pass (₹99 / mo)</strong> is active for <strong>Rajesh Sharma (1 Person Only)</strong>. To view and track <strong>segregated AI Timelines for Sunita, Rohan, and Kamla</strong>, plus access the consolidated Family Vault and hereditary risk map, upgrade to the <strong>Family Health Pass</strong>.
                </span>
              ) : (
                <span>
                  Consolidate diagnostic reports, digital prescriptions, and <strong>segregated AI Health Timelines for every family member individually</strong> under 1 unified account, with synchronized visibility for Dr. Aarav Mehta.
                </span>
              )}
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Family Pass Required (₹199 / mo):</strong> Individual patient privacy and segregated multi-member AI accounts require a Family Health Pass. All real family data remains encrypted until unlocked.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/patient/subscription"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>{isSoloPlan ? "Upgrade to Family Health Pass (₹199 / mo) →" : "Unlock Family Health Pass (₹199 / mo) →"}</span>
              </Link>

              {isSoloPlan ? (
                <Link
                  href="/patient/compare"
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <span>Open Rajesh's Solo AI Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-slate-400 text-center sm:text-left">
                  Covers up to 6 Family Members &bull; Segregated AI for All
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FROSTED REDACTED FAMILY TEASER */}
        <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xs p-6 sm:p-8 overflow-hidden select-none">
          
          {/* Blurred Background Family Mockup */}
          <div className="filter blur-md opacity-30 pointer-events-none space-y-6">
            <div className="h-6 w-1/3 bg-slate-300 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="h-28 bg-teal-100 rounded-2xl p-3 space-y-2">
                <div className="w-8 h-8 rounded-full bg-teal-400" />
                <div className="h-3 w-3/4 bg-teal-300 rounded" />
              </div>
              <div className="h-28 bg-slate-100 rounded-2xl p-3 space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-300" />
                <div className="h-3 w-3/4 bg-slate-300 rounded" />
              </div>
              <div className="h-28 bg-slate-100 rounded-2xl p-3 space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-300" />
                <div className="h-3 w-3/4 bg-slate-300 rounded" />
              </div>
              <div className="h-28 bg-slate-100 rounded-2xl p-3 space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-300" />
                <div className="h-3 w-3/4 bg-slate-300 rounded" />
              </div>
            </div>
            <div className="h-36 bg-slate-100 rounded-2xl" />
          </div>

          {/* Centered Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/75 backdrop-blur-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg border border-slate-800 mb-3">
              <Users className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {isSoloPlan ? "Family Segregated AI Portals Locked" : "Family Member Records & AI Segregation Encrypted"}
            </h3>

            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4 leading-relaxed">
              {isSoloPlan
                ? "Your Solo plan includes AI analysis for 1 profile only. Upgrade to unlock individual segregated AI tracking for your spouse, children, and parents."
                : "Household diagnostic archives, doctor cohort sync, and individual AI health timelines are locked until Family Pass subscription."}
            </p>

            <Link
              href="/patient/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all cursor-pointer"
            >
              <span>{isSoloPlan ? "Upgrade to Family Pass (₹199)" : "Subscribe to Family Pass (₹199)"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // ========================================================
  // 2. UNLOCKED STATE (FAMILY PASS ACTIVE - SEGREGATED AI FOR ALL)
  // ========================================================
  const activeMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMember: FamilyMember = {
      id: `fam_${Date.now()}`,
      name: newName.trim(),
      relationship: newRelation,
      age: parseInt(newAge) || 24,
      gender: newGender,
      bloodGroup: newBloodGroup,
      conditions: newConditions ? newConditions.split(",").map((c) => c.trim()) : ["Healthy / General Care"],
      allergies: ["No known allergies documented"],
      latestVitals: {
        bp: "120/80 mmHg",
        sugar: "92 mg/dL",
        keyMetric: "General Vitals",
        keyMetricValue: "Stable",
        status: "OPTIMAL",
      },
      activeMedications: [],
      recentRecords: [],
      aiTakeaway: `Profile added to Family Health Vault. Upload past reports for automated AI digitization and segregated timeline tracking for ${newName.trim()}.`,
      bilingualAudio: {
        englishText: `Hello ${newName.trim()}. Your health profile is now actively linked to the family vault. Upload clinical reports to begin your segregated longitudinal timeline.`,
        hindiText: `नमस्ते ${newName.trim()} जी। आपका प्रोफ़ाइल फ़ैमिली वॉल्ट में जोड़ दिया गया है। अपनी रिपोर्ट अपलोड करके अपनी व्यक्तिगत AI टाइमलाइन शुरू करें।`,
        duration: "0:30 min",
      },
      timelineEvents: [
        {
          id: `evt-${Date.now()}`,
          date: "Today",
          title: "Profile Onboarded to Family Health Vault",
          category: "Initial Registration",
          organFocus: ["General Wellness"],
          biomarkers: [
            { name: "Health Status", value: "Active", status: "OPTIMAL" },
          ],
          aiSummary: "Initial family profile created. Ready for first diagnostic report upload.",
          drNote: "Synchronized with Dr. Aarav Mehta family cohort registry.",
        },
      ],
    };

    setFamilyMembers((prev) => [...prev, newMember]);
    setSelectedMemberId(newMember.id);
    setShowAddMemberModal(false);

    // Reset Form
    setNewName("");
    setNewAge("");
    setNewConditions("");
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-slate-900">
      
      {/* 1. FAMILY VAULT HERO HEADER */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0A1A20] to-[#0A262C] text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-teal-500/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>PREMIUM FAMILY HEALTH PASS &bull; ACTIVE</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                SEGREGATED AI TIMELINES ACTIVE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sharma Family Centralized Health Vault
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidated medical records, active prescriptions, and <strong>segregated AI Health Timelines for all members</strong>. Synchronized in real time with <strong>Dr. Aarav Mehta's OPD Consultation Cockpit</strong>.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Users className="w-4 h-4 text-teal-400" />
                <span>{familyMembers.length} of 6 Family Profiles Enrolled</span>
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>All Member AI Stories Segregated &amp; Protected</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddMemberModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Family Member</span>
            </button>

            <Link
              href="/patient/subscription"
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Manage Plan (₹199 / mo)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FAMILY MEMBERS SWITCHER CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span>Select Family Member to View Their Segregated AI Timeline</span>
          </h2>
          <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Segregated AI Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {familyMembers.map((member) => {
            const isSelected = member.id === selectedMemberId;

            return (
              <div
                key={member.id}
                onClick={() => {
                  setSelectedMemberId(member.id);
                  setIsPlayingAudio(false);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                    : "bg-white/90 border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                      isSelected
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-sm text-slate-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-teal-700 font-bold truncate">
                      {member.relationship}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {member.age} Yrs &bull; {member.gender} &bull; {member.bloodGroup}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">AI Timeline:</span>
                  <span className="font-bold text-teal-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>{member.timelineEvents.length} Events</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE MEMBER HEALTH CONSOLE */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-6">
        
        {/* Active Member Bar */}
        <div className="p-5 sm:p-6 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              {activeMember.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">{activeMember.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  {activeMember.relationship}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  SEGREGATED PROFILE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeMember.age} Yrs &bull; Gender: {activeMember.gender} &bull; Blood Group: <strong>{activeMember.bloodGroup}</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs for Active Member */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("ai-story")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ai-story"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Health Timeline ({activeMember.timelineEvents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Overview &amp; Vitals
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("records")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "records"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Records ({activeMember.recentRecords.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("meds")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "meds"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Prescriptions ({activeMember.activeMedications.length})
            </button>
          </div>
        </div>

        {/* Console Tab Content */}
        <div className="px-6 pb-6">
          
          {/* TAB 1: SEGREGATED AI HEALTH TIMELINE (PRIMARY FOCUS) */}
          {activeTab === "ai-story" && (
            <div className="space-y-6">
              
              {/* Segregated AI Header Notice */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="text-teal-950 font-medium">
                    <strong>Segregated Timeline:</strong> This AI Timeline reflects clinical trends exclusively for <strong>{activeMember.name}</strong> ({activeMember.relationship}), completely isolated from other family records.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white font-black text-[10px] shrink-0 w-fit">
                  Dr. Mehta Verified
                </span>
              </div>

              {/* BILINGUAL 60-SEC AUDIO EXPLAINER FOR THIS MEMBER */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0B1A20] to-[#0A262C] text-white border border-teal-500/40 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg transition-all cursor-pointer shrink-0"
                      title={isPlayingAudio ? "Pause Audio" : "Play Layman Audio Explainer"}
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-teal-400" />
                        <h4 className="font-black text-sm text-white">
                          60-Second Layman Explainer for {activeMember.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isPlayingAudio ? "Playing clinical audio overview..." : "Click play to listen to plain-language translation"} &bull; {activeMember.bilingualAudio.duration}
                      </p>
                    </div>
                  </div>

                  {/* Language Switcher */}
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/15 text-xs font-bold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAudioLanguage("en")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        audioLanguage === "en" ? "bg-teal-500 text-white font-black shadow-xs" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudioLanguage("hi")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        audioLanguage === "hi" ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      हिंदी (Hindi)
                    </button>
                  </div>
                </div>

                {/* Animated Waveform when playing */}
                {isPlayingAudio && (
                  <div className="flex items-center gap-1.5 py-1 px-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-teal-300 mr-2">PLAYING AUDIO</span>
                    <div className="h-4 w-1 bg-teal-400 animate-pulse rounded-full" />
                    <div className="h-6 w-1 bg-teal-300 animate-bounce rounded-full" />
                    <div className="h-3 w-1 bg-amber-400 animate-pulse rounded-full" />
                    <div className="h-7 w-1 bg-teal-400 animate-bounce rounded-full" />
                    <div className="h-5 w-1 bg-emerald-400 animate-pulse rounded-full" />
                    <div className="h-8 w-1 bg-teal-300 animate-bounce rounded-full" />
                    <div className="h-4 w-1 bg-amber-300 animate-pulse rounded-full" />
                  </div>
                )}

                {/* Spoken Text Transcript */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  <p>
                    {audioLanguage === "en" ? activeMember.bilingualAudio.englishText : activeMember.bilingualAudio.hindiText}
                  </p>
                </div>
              </div>

              {/* SEGREGATED TIMELINE MILESTONE EVENTS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Longitudinal Biomarker Milestones ({activeMember.timelineEvents.length})</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Sorted Chronologically (Latest First)
                  </span>
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {activeMember.timelineEvents.map((evt, idx) => (
                    <div key={evt.id} className="relative space-y-3">
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-teal-600 border-4 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-black">
                        {idx + 1}
                      </div>

                      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3 hover:border-teal-300 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                                {evt.date}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                &bull; {evt.category}
                              </span>
                            </div>
                            <h5 className="text-base font-black text-slate-900 mt-1">
                              {evt.title}
                            </h5>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {evt.organFocus.map((org, oIdx) => (
                              <span key={oIdx} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                                {org}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Biomarkers Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {evt.biomarkers.map((bm, bIdx) => (
                            <div key={bIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                              <span className="text-[10px] text-slate-500 font-bold block truncate">
                                {bm.name}
                              </span>
                              <span className="text-sm font-black text-slate-900 block">
                                {bm.value}
                              </span>
                              {bm.delta && (
                                <span className={`text-[10px] font-bold block ${
                                  bm.status === "IMPROVED" ? "text-emerald-700" :
                                  bm.status === "NEEDS_ATTENTION" ? "text-amber-700" : "text-teal-700"
                                }`}>
                                  {bm.delta}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* AI Summary */}
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                            <span>AI Clinical Insight:</span>
                          </span>
                          <p className="leading-relaxed pl-5 font-medium">
                            {evt.aiSummary}
                          </p>
                        </div>

                        {/* Doctor's Synchronized OPD Remark */}
                        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
                          <span className="font-bold text-blue-900 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
                            <span>Dr. Aarav Mehta (Attending Physician):</span>
                          </span>
                          <p className="leading-relaxed pl-5 font-mono text-[11px] text-blue-900">
                            {evt.drNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: OVERVIEW & VITALS */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                    Blood Pressure
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {activeMember.latestVitals.bp}
                  </div>
                  <span className="text-[11px] text-teal-700 font-semibold">
                    Monitored regularly
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                    Blood Glucose / Sugar
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {activeMember.latestVitals.sugar}
                  </div>
                  <span className="text-[11px] text-sky-700 font-semibold">
                    Target glycemic range
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    {activeMember.latestVitals.keyMetric}
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {activeMember.latestVitals.keyMetricValue}
                  </div>
                  <span className="text-[11px] text-amber-800 font-semibold">
                    Reviewed with Dr. Mehta
                  </span>
                </div>
              </div>

              {/* Conditions & Allergies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider">
                    Documented Chronic Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMember.conditions.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider">
                    Allergies &amp; Drug Sensitivities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMember.allergies.map((a, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 font-semibold text-rose-800"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Layman Snapshot for This Member */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>AI Clinical Summary for {activeMember.name}:</span>
                </div>
                <p className="leading-relaxed pl-6 font-medium">
                  {activeMember.aiTakeaway}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RECORDS */}
          {activeTab === "records" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Diagnostic Reports for {activeMember.name}
                </h4>
                <Link
                  href="/patient/records"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Upload New Report &rarr;</span>
                </Link>
              </div>

              {activeMember.recentRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200">
                  No medical records uploaded for this family member yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {activeMember.recentRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200">
                          PDF
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900">{rec.title}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {rec.date} &bull; {rec.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {rec.status}
                        </span>
                        <Link
                          href="/patient/records"
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 hover:bg-teal-50 border border-teal-200"
                        >
                          View Report
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDICATIONS */}
          {activeTab === "meds" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active Prescriptions for {activeMember.name}
                </h4>
                <Link
                  href="/patient/prescriptions"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>View Clinical Rx Slip &rarr;</span>
                </Link>
              </div>

              {activeMember.activeMedications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200">
                  No active long-term medications prescribed for this member.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMember.activeMedications.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all space-y-2 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-serif font-black text-teal-700">℞</span>
                          <h5 className="font-bold text-sm text-slate-900">{m.name}</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                          {m.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {m.frequency} &bull; {m.timing}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 4. CROSS-GENERATIONAL HEREDITARY RISK MAP */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-black text-slate-900">
              Cross-Generational Hereditary Risk Map
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            Cohort Analyzed: 4 Members
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed">
          AI synthesized family medical histories across generations. Highlights hereditary vulnerabilities so Dr. Aarav Mehta can prescribe early preventative screenings for children.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Type 2 Diabetes</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                Moderate Risk
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Paternal lineage (Rajesh). Son Rohan (21) advised annual screening starting at age 25.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Essential Hypertension</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-900">
                Familial Pattern
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Observed in Rajesh (52) &amp; Kamla (76). Dietary sodium monitoring advised for whole household.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Autoimmune Thyroiditis</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                Isolated
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Maternal lineage (Sunita). No genetic transmission identified in offspring cohort.
            </p>
          </div>
        </div>
      </div>

      {/* 5. ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-black text-slate-900">Enroll Family Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="18"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Known Chronic Conditions (Optional)</label>
                <input
                  type="text"
                  value={newConditions}
                  onChange={(e) => setNewConditions(e.target.value)}
                  placeholder="e.g. Asthma, Migraine (comma separated)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md shadow-teal-600/30 cursor-pointer"
                >
                  Enroll to Family Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
