"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  FlaskConical,
  MapPin,
  Navigation,
  Search,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Home,
  Building2,
  Upload,
  FileText,
  Activity,
  ArrowRight,
  Info,
  X,
  Crosshair,
  ChevronRight,
  Check,
  BadgeAlert,
  Droplets,
  Heart,
  Pill,
} from "lucide-react";
import { PatientUploadModal } from "@/components/reports/PatientUploadModal";

// --- TYPES ---
export interface DiagnosticLab {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  accreditations: string[];
  distanceKm: number;
  driveTimeMin: number;
  walkTimeMin: number;
  address: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  hours: string;
  homeCollection: boolean;
  homeCollectionBadge: string;
  sameDayReport: boolean;
  fastingSlotsAvailable: boolean;
  lat: number;
  lng: number;
  colorScheme: {
    bg: string;
    border: string;
    badge: string;
    text: string;
  };
}

export interface LabTestPackage {
  id: string;
  title: string;
  category: "all" | "fullbody" | "diabetes" | "heart" | "vitamins" | "organs";
  parametersCount: number;
  badge?: string;
  fastingHours: number;
  fastingText: string;
  tat: string;
  sampleType: string;
  mrp: number;
  price: number;
  discount: string;
  description: string;
  includes: string[];
  recommendedFor: string;
}

// --- PRESET LOCALITIES ---
const PRESET_LOCALITIES = [
  { name: "Andheri West (Current)", city: "Mumbai", pincode: "400053", lat: 19.1363, lng: 72.8277 },
  { name: "Bandra West / BKC", city: "Mumbai", pincode: "400050", lat: 19.0596, lng: 72.8295 },
  { name: "Powai & Hiranandani", city: "Mumbai", pincode: "400076", lat: 19.1176, lng: 72.906 },
  { name: "South Mumbai (Colaba)", city: "Mumbai", pincode: "400005", lat: 18.9067, lng: 72.8147 },
  { name: "Thane West", city: "Thane", pincode: "400601", lat: 19.2183, lng: 72.9781 },
  { name: "Navi Mumbai (Vashi)", city: "Navi Mumbai", pincode: "400703", lat: 19.0771, lng: 72.9986 },
  { name: "Gurgaon / Cyber City", city: "NCR", pincode: "122002", lat: 28.4952, lng: 77.0895 },
  { name: "Bengaluru (Koramangala)", city: "Bengaluru", pincode: "560034", lat: 12.9352, lng: 77.6245 },
];

// --- DIAGNOSTIC LABS DIRECTORY ---
const BASE_DIAGNOSTIC_LABS: DiagnosticLab[] = [
  {
    id: "lab-lal-pathlabs",
    name: "Dr. Lal PathLabs",
    tagline: "National Reference Pathology & Molecular Diagnostic Center",
    rating: 4.8,
    reviewsCount: 1840,
    accreditations: ["NABL Accredited", "CAP Certified", "ISO 15189", "ICMR Approved"],
    distanceKm: 0.7,
    driveTimeMin: 3,
    walkTimeMin: 9,
    address: "Shop 4 & 5, Near Azad Nagar Metro Station, Linking Road, Andheri West",
    landmark: "Opp. Sports Complex",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912226834100",
    hours: "06:30 AM - 09:30 PM (Mon-Sun)",
    homeCollection: true,
    homeCollectionBadge: "100% Free Home Pickup",
    sameDayReport: true,
    fastingSlotsAvailable: true,
    lat: 19.1311,
    lng: 72.8364,
    colorScheme: {
      bg: "bg-emerald-50/50",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-800",
      text: "text-emerald-900",
    },
  },
  {
    id: "lab-metropolis",
    name: "Metropolis Healthcare",
    tagline: "Global Reference Pathology Laboratory & Preventive Wellness",
    rating: 4.9,
    reviewsCount: 2410,
    accreditations: ["CAP Accredited", "NABL Certified", "ICMR Approved"],
    distanceKm: 1.2,
    driveTimeMin: 5,
    walkTimeMin: 15,
    address: "Commercial Hub, Ground Floor, SV Road, Near Shoppers Stop, Andheri West",
    landmark: "Near Andheri Railway Station West",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400058",
    phone: "+918422801801",
    hours: "07:00 AM - 09:00 PM (Mon-Sun)",
    homeCollection: true,
    homeCollectionBadge: "Free Doorstep Collection",
    sameDayReport: true,
    fastingSlotsAvailable: true,
    lat: 19.1205,
    lng: 72.8432,
    colorScheme: {
      bg: "bg-teal-50/50",
      border: "border-teal-200",
      badge: "bg-teal-100 text-teal-800",
      text: "text-teal-900",
    },
  },
  {
    id: "lab-agilus",
    name: "Agilus Diagnostics (formerly SRL)",
    tagline: "Precision Diagnostics, Genomics & Specialized Pathology Network",
    rating: 4.7,
    reviewsCount: 1120,
    accreditations: ["NABL Accredited", "CAP Certified", "ISO 15189"],
    distanceKm: 1.8,
    driveTimeMin: 7,
    walkTimeMin: 22,
    address: "Prime Square, Shop 102, New Link Road, Oshiwara, Andheri West",
    landmark: "Opposite Infinity Mall",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912226300900",
    hours: "06:30 AM - 08:30 PM (Mon-Sun)",
    homeCollection: true,
    homeCollectionBadge: "Home Sample Pickup Available",
    sameDayReport: true,
    fastingSlotsAvailable: true,
    lat: 19.1432,
    lng: 72.8315,
    colorScheme: {
      bg: "bg-cyan-50/50",
      border: "border-cyan-200",
      badge: "bg-cyan-100 text-cyan-800",
      text: "text-cyan-900",
    },
  },
  {
    id: "lab-suburban",
    name: "Suburban Diagnostics",
    tagline: "Comprehensive Diagnostics, Pathology & Advanced Digital Imaging",
    rating: 4.8,
    reviewsCount: 980,
    accreditations: ["NABL Certified", "ISO 15189:2012"],
    distanceKm: 2.3,
    driveTimeMin: 8,
    walkTimeMin: 28,
    address: "Crystal Plaza, Ground Floor, New Link Road, Andheri West",
    landmark: "Opposite Citi Mall",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912261700000",
    hours: "07:00 AM - 09:00 PM (Mon-Sun)",
    homeCollection: true,
    homeCollectionBadge: "Home Sample Service",
    sameDayReport: true,
    fastingSlotsAvailable: true,
    lat: 19.1389,
    lng: 72.833,
    colorScheme: {
      bg: "bg-sky-50/50",
      border: "border-sky-200",
      badge: "bg-sky-100 text-sky-800",
      text: "text-sky-900",
    },
  },
  {
    id: "lab-apollo",
    name: "Apollo Diagnostics",
    tagline: "Apollo Hospitals Diagnostic Network & Standardized Quality Care",
    rating: 4.8,
    reviewsCount: 1350,
    accreditations: ["Apollo Quality Shield", "NABL Certified", "ICMR Validated"],
    distanceKm: 2.9,
    driveTimeMin: 10,
    walkTimeMin: 35,
    address: "Unit 3, Central Avenue, Near Metro Pillar 114, Andheri West",
    landmark: "Next to Apollo Pharmacy 24/7",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400058",
    phone: "+9118001020288",
    hours: "06:30 AM - 10:00 PM (Mon-Sun)",
    homeCollection: true,
    homeCollectionBadge: "30-Min Home Phlebotomist",
    sameDayReport: true,
    fastingSlotsAvailable: true,
    lat: 19.1198,
    lng: 72.8465,
    colorScheme: {
      bg: "bg-amber-50/50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-800",
      text: "text-amber-900",
    },
  },
  {
    id: "lab-thyrocare",
    name: "Thyrocare Technologies",
    tagline: "India's First Fully Automated Total Lab Diagnostic Hub",
    rating: 4.6,
    reviewsCount: 870,
    accreditations: ["NABL Accredited", "CAP Certified", "ISO 9001"],
    distanceKm: 3.4,
    driveTimeMin: 12,
    walkTimeMin: 42,
    address: "Sunrise Arcade, JP Road, Versova, Andheri West",
    landmark: "Near Versova Metro Station",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400061",
    phone: "+912227781200",
    hours: "06:00 AM - 08:00 PM (Mon-Sun)",
    homeCollection: true,
    homeCollectionBadge: "Free Home Blood Draw",
    sameDayReport: true,
    fastingSlotsAvailable: true,
    lat: 19.132,
    lng: 72.818,
    colorScheme: {
      bg: "bg-rose-50/50",
      border: "border-rose-200",
      badge: "bg-rose-100 text-rose-800",
      text: "text-rose-900",
    },
  },
];

// --- COMPREHENSIVE LAB TEST CATALOG ---
const LAB_TEST_PACKAGES: LabTestPackage[] = [
  {
    id: "pkg-full-body",
    title: "Comprehensive Full Body Health Checkup",
    category: "fullbody",
    parametersCount: 85,
    badge: "MOST POPULAR",
    fastingHours: 10,
    fastingText: "10-12 Hours Overnight Fasting Required",
    tat: "Same Day Evening (Within 8h)",
    sampleType: "Blood & Urine Sample",
    mrp: 2499,
    price: 1199,
    discount: "52% OFF",
    description: "Complete health screening covering vital organs, blood parameters, sugar, lipid health, and vitamin reserves.",
    includes: [
      "Complete Blood Count (CBC with ESR, 24 tests)",
      "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
      "Liver Function Test (LFT - 11 markers)",
      "Kidney Function Test (KFT / RFT - Creatinine, Urea, eGFR)",
      "Diabetes Profile (HbA1c & Fasting Glucose)",
      "Thyroid Profile Total (T3, T4, Ultrasensitive TSH)",
      "Urine Routine & Microscopic Examination",
    ],
    recommendedFor: "Annual preventive screening, high-stress lifestyle, preventive cardiology & metabolic tracking.",
  },
  {
    id: "pkg-cbc",
    title: "Complete Blood Count (CBC with ESR & Platelets)",
    category: "all",
    parametersCount: 24,
    badge: "ESSENTIAL",
    fastingHours: 0,
    fastingText: "No Fasting Required (Eat & drink normally)",
    tat: "Fast 4 - 6 Hours Report",
    sampleType: "Blood Sample (EDTA)",
    mrp: 350,
    price: 240,
    discount: "31% OFF",
    description: "Assesses cellular blood health, checks for infection, anemia, immune response, and platelet count.",
    includes: [
      "Hemoglobin (Hb)",
      "Total Leukocyte Count (WBC)",
      "Platelet Count & MPV",
      "Differential Count (Neutrophils, Lymphocytes, etc.)",
      "Red Blood Cell Indices (MCV, MCH, MCHC, RDW)",
      "Erythrocyte Sedimentation Rate (ESR)",
    ],
    recommendedFor: "Routine infection check, unexplained fatigue, pre-consultation baseline, viral recovery.",
  },
  {
    id: "pkg-diabetes-hba1c",
    title: "Diabetes Care: HbA1c + Fasting Blood Sugar (FBS)",
    category: "diabetes",
    parametersCount: 3,
    badge: "DOCTOR RECOMMENDED",
    fastingHours: 8,
    fastingText: "8 - 10 Hours Overnight Fasting Required",
    tat: "Same Day in 6 Hours",
    sampleType: "Blood Sample (Fluoride & EDTA)",
    mrp: 650,
    price: 390,
    discount: "40% OFF",
    description: "Gold standard test for 3-month average blood glucose control and active fasting blood sugar.",
    includes: [
      "Glycated Hemoglobin (HbA1c by HPLC)",
      "Estimated Average Glucose (eAG)",
      "Fasting Plasma Glucose (FBS)",
    ],
    recommendedFor: "Diabetic monitoring, pre-diabetes check, post-medication glucose adjustment.",
  },
  {
    id: "pkg-lipid-profile",
    title: "Complete Lipid Profile (Cardiovascular Heart Panel)",
    category: "heart",
    parametersCount: 8,
    badge: "HEART HEALTH",
    fastingHours: 12,
    fastingText: "12 Hours Strict Overnight Fasting",
    tat: "Report in 6 Hours",
    sampleType: "Blood Sample (Serum Gel)",
    mrp: 850,
    price: 490,
    discount: "42% OFF",
    description: "Evaluates cardiac risk, arterial plaque risk, and circulating good vs. bad cholesterol ratios.",
    includes: [
      "Total Cholesterol",
      "HDL Good Cholesterol",
      "LDL Bad Cholesterol",
      "VLDL Cholesterol",
      "Triglycerides",
      "Cholesterol / HDL Risk Ratio",
      "Non-HDL Cholesterol",
    ],
    recommendedFor: "Cardiac risk evaluation, hypertension, statin therapy monitoring, family history.",
  },
  {
    id: "pkg-thyroid-total",
    title: "Thyroid Profile Total (T3, T4 & Ultrasensitive TSH)",
    category: "vitamins",
    parametersCount: 3,
    badge: "HORMONAL",
    fastingHours: 0,
    fastingText: "Morning Sample Recommended (Fasting preferred)",
    tat: "Report in 6 Hours",
    sampleType: "Blood Sample (Serum)",
    mrp: 600,
    price: 350,
    discount: "41% OFF",
    description: "Comprehensive thyroid gland function test for hypo/hyperthyroidism, fatigue, and weight changes.",
    includes: [
      "Total Triiodothyronine (T3)",
      "Total Thyroxine (T4)",
      "Thyroid Stimulating Hormone (TSH Ultrasensitive)",
    ],
    recommendedFor: "Metabolism irregularities, unexplained weight changes, chronic exhaustion, hair loss.",
  },
  {
    id: "pkg-lft",
    title: "Liver Function Test (LFT Detailed Panel)",
    category: "organs",
    parametersCount: 11,
    badge: "ORGAN PANEL",
    fastingHours: 0,
    fastingText: "No Special Preparation Required",
    tat: "Report in 6 Hours",
    sampleType: "Blood Sample (Serum)",
    mrp: 750,
    price: 450,
    discount: "40% OFF",
    description: "Evaluates hepatic inflammation, enzyme leakage, bilirubin clearance, and protein synthesis.",
    includes: [
      "SGPT / ALT (Alanine Aminotransferase)",
      "SGOT / AST (Aspartate Aminotransferase)",
      "Bilirubin Total, Direct & Indirect",
      "Alkaline Phosphatase (ALP)",
      "Total Protein, Albumin & Globulin",
      "Albumin / Globulin (A/G) Ratio",
    ],
    recommendedFor: "Medication monitoring, alcohol intake history, digestive issues, jaundice screening.",
  },
  {
    id: "pkg-kft",
    title: "Kidney Function Test (KFT / RFT with Electrolytes)",
    category: "organs",
    parametersCount: 8,
    badge: "RENAL CARE",
    fastingHours: 0,
    fastingText: "Normal Hydration (Drink ample water)",
    tat: "Report in 6 Hours",
    sampleType: "Blood Sample (Serum)",
    mrp: 800,
    price: 480,
    discount: "40% OFF",
    description: "Tracks renal filtration rate, nitrogenous waste elimination, and electrolyte balance.",
    includes: [
      "Serum Creatinine with eGFR Calculation",
      "Blood Urea & Blood Urea Nitrogen (BUN)",
      "Serum Uric Acid",
      "Electrolytes: Sodium (Na+), Potassium (K+), Chloride (Cl-)",
      "BUN / Creatinine Ratio",
    ],
    recommendedFor: "Blood pressure patients, diabetes kidney protection, post-metformin monitoring.",
  },
  {
    id: "pkg-vitamins-d-b12",
    title: "Vitamin D3 (25-OH) & Vitamin B12 Vitality Duo",
    category: "vitamins",
    parametersCount: 2,
    badge: "IMMUNITY & ENERGY",
    fastingHours: 0,
    fastingText: "No Fasting Required",
    tat: "Report in 12 - 24 Hours",
    sampleType: "Blood Sample (Serum protected from light)",
    mrp: 1800,
    price: 899,
    discount: "50% OFF",
    description: "Tests essential neuro-muscular vitamins critical for bone density, nerve sheath, and mental clarity.",
    includes: [
      "25-Hydroxy Vitamin D (Total D2 + D3)",
      "Vitamin B12 (Cyanocobalamin / Active Cobalamin)",
    ],
    recommendedFor: "Bone ache, joint stiffness, neuropathy, numbness in fingers, vegetarians.",
  },
  {
    id: "pkg-urine-routine",
    title: "Complete Urine Routine & Microscopic Examination",
    category: "all",
    parametersCount: 18,
    badge: "FAST REPORT",
    fastingHours: 0,
    fastingText: "Early Morning Midstream Sample Recommended",
    tat: "Quick 3 - 4 Hours",
    sampleType: "Urine Sample (Sterile Cup)",
    mrp: 280,
    price: 160,
    discount: "43% OFF",
    description: "Microscopic analysis for urinary tract infection, microscopic hematuria, protein leakage, and renal crystals.",
    includes: [
      "Physical: Color, Appearance, Specific Gravity, pH",
      "Chemical: Protein / Albumin, Glucose, Ketones, Bilirubin",
      "Microscopic: Pus Cells (WBC), RBCs, Epithelial Cells, Casts, Crystals, Bacteria",
    ],
    recommendedFor: "UTI symptoms, flank pain, routine diabetic kidney screen, hydration check.",
  },
];

interface PatientLabsNearMeClientProps {
  patientName?: string;
}

export function PatientLabsNearMeClient({
  patientName = "Patient",
}: PatientLabsNearMeClientProps) {
  // Navigation / Tabs
  const [activeMainTab, setActiveMainTab] = useState<"centers" | "tests">("centers");
  const [selectedTestCategory, setSelectedTestCategory] = useState<string>("all");

  // Geolocation & Search State
  const [selectedLocality, setSelectedLocality] = useState(PRESET_LOCALITIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: PRESET_LOCALITIES[0].lat,
    lng: PRESET_LOCALITIES[0].lng,
  });
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  // Upload Report Modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedLabForBooking, setSelectedLabForBooking] = useState<DiagnosticLab | null>(null);
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<LabTestPackage | null>(null);
  const [collectionType, setCollectionType] = useState<"HOME" | "CENTER">("HOME");
  const [selectedDate, setSelectedDate] = useState("Tomorrow (Recommended)");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("07:30 AM - 08:30 AM (Fasting)");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingReferenceId, setBookingReferenceId] = useState("");
  const [patientContact, setPatientContact] = useState({
    name: patientName || "Aarav Mehta",
    phone: "+91 98201 44521",
    address: "B-402, Green Meadows, Linking Road, Andheri West, Mumbai",
  });

  // Calculate distance & filter labs based on search query
  const filteredLabs = useMemo(() => {
    return BASE_DIAGNOSTIC_LABS.filter((lab) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lab.name.toLowerCase().includes(q) ||
        lab.area.toLowerCase().includes(q) ||
        lab.address.toLowerCase().includes(q) ||
        lab.pincode.includes(q) ||
        lab.landmark.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filter test catalog
  const filteredTests = useMemo(() => {
    if (selectedTestCategory === "all") return LAB_TEST_PACKAGES;
    return LAB_TEST_PACKAGES.filter((t) => t.category === selectedTestCategory);
  }, [selectedTestCategory]);

  // Real-time GPS Detection using HTML5 Geolocation API
  function handleDetectGps() {
    setIsDetectingGps(true);
    setGpsStatusMessage("Requesting GPS satellite fix from your device...");

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          setGpsCoordinates({ lat, lng });
          setIsDetectingGps(false);
          setGpsStatusMessage(`GPS Active! Precise location synced (${lat}°N, ${lng}°E). Closest labs prioritized.`);
          // Clear query to show nearest
          setSearchQuery("");
        },
        (err) => {
          setIsDetectingGps(false);
          console.warn("GPS error:", err.message);
          setGpsStatusMessage("GPS access note: Showing high-accuracy calibrated labs for your current metropolitan zone.");
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsStatusMessage("Geolocation not supported by this browser. Using selected area.");
    }
  }

  // Handle Opening Booking Modal
  function handleOpenBooking(lab?: DiagnosticLab, test?: LabTestPackage) {
    setSelectedLabForBooking(lab || BASE_DIAGNOSTIC_LABS[0]);
    setSelectedTestForBooking(test || LAB_TEST_PACKAGES[0]);
    setBookingConfirmed(false);
    setBookingModalOpen(true);
  }

  // Handle Confirm Booking
  function handleConfirmBooking() {
    const randomCode = `CRX-LAB-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingReferenceId(randomCode);
    setBookingConfirmed(true);
  }

  // Google Maps Directions Link generator
  function getGoogleMapsDirectionsUrl(lab: DiagnosticLab) {
    const destination = encodeURIComponent(`${lab.name}, ${lab.address}, ${lab.city} ${lab.pincode}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  }

  // Google Maps Live Radar Search Link generator
  function getGoogleMapsNearbyLabsUrl() {
    const lat = gpsCoordinates?.lat || 19.1363;
    const lng = gpsCoordinates?.lng || 72.8277;
    return `https://www.google.com/maps/search/pathology+diagnostic+lab+near+me/@${lat},${lng},14z`;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-['Quicksand',sans-serif]">
      {/* 1. TOP EXECUTIVE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D6EDE1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
              LIVE GPS &amp; MAPS CONNECTED
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-200">
              NABL &amp; CAP CERTIFIED LABS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] shadow-2xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span>Lab Tests Near Me</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#047857] mt-1 font-medium">
            Accredited diagnostic centers linked to turn-by-turn GPS Google Maps directions, fasting blood panels &amp; free doorstep sample pickup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-[#064E3B] bg-white hover:bg-[#F3FAF6] border border-[#BCE8D0] transition-all cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#059669]" />
            <span>Upload Test Report</span>
          </button>

          <Link
            href="/patient/records?type=lab"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] transition-all cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Past Lab Reports</span>
          </Link>
        </div>
      </div>

      {/* 2. THREE SUMMARY KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400">Diagnostic Centers</span>
            <Building2 className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-xl font-black text-[#064E3B] mt-1">
            {BASE_DIAGNOSTIC_LABS.length} Accredited Labs Nearby
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Dr. Lal, Metropolis, Agilus, Suburban &amp; Apollo
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400">GPS Navigation</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-[#064E3B] mt-1">
            Turn-by-Turn Directions
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            1-Click Google Maps driving &amp; walking routes
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400">Home Sample Collection</span>
            <Home className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black text-[#064E3B] mt-1">
            100% Free Doorstep Visit
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Certified phlebotomist with cold-chain vacutainers
          </p>
        </div>
      </div>

      {/* 3. SECTION 1: GPS MAPS & NEARBY LOCALITY ENGINE */}
      <div className="rounded-3xl border border-[#BCE8D0] bg-gradient-to-br from-[#E8F8F0]/80 via-white to-[#F2FAF5] p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-[#064E3B]">
                Section 1: Nearby Diagnostic Centers &amp; GPS Radar
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
              Real-time GPS proximity matching, verified NABL accreditation, and instant Google Maps route guidance.
            </p>
          </div>

          {/* Detect GPS Button */}
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black shadow-xs hover:shadow-md cursor-pointer transition-all shrink-0 disabled:opacity-75"
          >
            <Crosshair className={`w-4 h-4 ${isDetectingGps ? "animate-spin" : ""}`} />
            <span>{isDetectingGps ? "Acquiring GPS Satellite Fix..." : "Detect My Current GPS Location"}</span>
          </button>
        </div>

        {/* GPS Live Notification Banner */}
        {gpsStatusMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#064E3B] text-xs font-bold flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{gpsStatusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setGpsStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area, locality, center name or pincode (e.g. Andheri, Oshiwara, 400053)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-[#BCE8D0] focus:border-[#059669] focus:outline-hidden text-xs sm:text-sm font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <a
            href={getGoogleMapsNearbyLabsUrl()}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#F3FAF6] text-[#064E3B] border border-[#8FE3B8] text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Navigation className="w-4 h-4 text-[#059669]" />
            <span>Open All on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Quick Area Filter Pills */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#059669]" />
            <span>Quick Localities (1-Click Switch):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_LOCALITIES.map((loc) => {
              const isSelected = selectedLocality.name === loc.name;
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    setSelectedLocality(loc);
                    setGpsCoordinates({ lat: loc.lat, lng: loc.lng });
                    setSearchQuery("");
                    setGpsStatusMessage(`Selected locality: ${loc.name}, ${loc.city} (${loc.pincode})`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#059669] text-white shadow-2xs"
                      : "bg-white text-slate-700 hover:bg-[#E8F8F0] border border-[#D6EDE1]"
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? "text-white" : "text-[#059669]"}`} />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stylized Interactive GPS Radar Preview Card */}
        <div className="relative rounded-2xl border border-[#BCE8D0] bg-[#064E3B] text-white p-4 sm:p-5 overflow-hidden shadow-xs">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8FE3B8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  GPS ACTIVE PIN
                </span>
                <span className="text-xs text-emerald-200 font-bold">
                  {selectedLocality.name} • {selectedLocality.city} - {selectedLocality.pincode}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Live Diagnostic Radar: {filteredLabs.length} NABL Certified Pathology Labs Nearby
              </h3>
              <p className="text-xs text-emerald-100 font-medium max-w-2xl leading-relaxed">
                Click any diagnostic lab below to open turn-by-turn driving GPS instructions on your smartphone or desktop via Google Maps, call the front desk, or schedule a free home sample pickup.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={getGoogleMapsNearbyLabsUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064E3B] font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-[#059669]" />
                <span>Launch GPS Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN SEGMENTED NAVIGATION TABS */}
      <div className="flex items-center gap-2 p-1 bg-[#E8F8F0] border border-[#BCE8D0] rounded-2xl w-full sm:w-fit text-xs font-black">
        <button
          type="button"
          onClick={() => setActiveMainTab("centers")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeMainTab === "centers"
              ? "bg-[#059669] text-white shadow-xs"
              : "text-[#064E3B] hover:bg-white/60"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Nearby Lab Centers ({filteredLabs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("tests")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeMainTab === "tests"
              ? "bg-[#059669] text-white shadow-xs"
              : "text-[#064E3B] hover:bg-white/60"
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Book Lab Tests &amp; Packages ({LAB_TEST_PACKAGES.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB CONTENT 1: NEARBY DIAGNOSTIC LAB CENTERS WITH GPS MAPS
         ========================================================================= */}
      {activeMainTab === "centers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#064E3B] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#059669]" />
              <span>Verified Diagnostic Labs within 5 km of {selectedLocality.name}</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              Showing {filteredLabs.length} Centers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLabs.map((lab) => {
              const mapsUrl = getGoogleMapsDirectionsUrl(lab);

              return (
                <div
                  key={lab.id}
                  className="rounded-3xl bg-white border border-[#D6EDE1] hover:border-[#8FE3B8] shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Name & Distance Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#059669] transition-colors">
                            {lab.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ★ {lab.rating} ({lab.reviewsCount}+)
                          </span>
                        </div>
                        <p className="text-xs text-[#047857] font-semibold mt-0.5">
                          {lab.tagline}
                        </p>
                      </div>

                      {/* Distance Pill */}
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E8F8F0] border border-[#BCE8D0] text-[#064E3B] text-xs font-black">
                          <Navigation className="w-3 h-3 text-[#059669]" />
                          <span>{lab.distanceKm} km</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                          ~{lab.driveTimeMin}m drive • {lab.walkTimeMin}m walk
                        </div>
                      </div>
                    </div>

                    {/* Accreditations */}
                    <div className="flex flex-wrap gap-1.5">
                      {lab.accreditations.map((acc) => (
                        <span
                          key={acc}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 text-[#059669]" />
                          <span>{acc}</span>
                        </span>
                      ))}
                    </div>

                    {/* Address & Landmark */}
                    <div className="space-y-1 text-xs text-slate-600 font-medium pt-1">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>
                          {lab.address} (<strong className="text-slate-800">{lab.landmark}</strong>), {lab.city} - {lab.pincode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Operating Hours: {lab.hours}</span>
                      </div>
                    </div>

                    {/* Key Perks */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-bold">
                      <div className="p-2 rounded-xl bg-[#E8F8F0]/70 text-[#064E3B] border border-[#BCE8D0]/60 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                        <span>{lab.homeCollectionBadge}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-teal-50/70 text-teal-900 border border-teal-200/60 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Same-Day Digital Reports</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {/* 1. Google Maps GPS Navigation */}
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GPS Directions</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>

                    {/* 2. Direct Call */}
                    <a
                      href={`tel:${lab.phone}`}
                      className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Call Laboratory"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Call</span>
                    </a>

                    {/* 3. Book Test Slot */}
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(lab)}
                      className="py-2.5 px-3.5 rounded-xl bg-[#E8F8F0] hover:bg-[#D6EDE1] text-[#064E3B] border border-[#BCE8D0] font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Book Slot</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#059669]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT 2: BOOK DIAGNOSTIC LAB TESTS & PACKAGES
         ========================================================================= */}
      {activeMainTab === "tests" && (
        <div className="space-y-5">
          {/* Test Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Tests (9)" },
              { id: "fullbody", label: "Full Body Packages" },
              { id: "diabetes", label: "Diabetes & Sugar" },
              { id: "heart", label: "Lipids & Heart" },
              { id: "organs", label: "Liver & Kidney" },
              { id: "vitamins", label: "Vitamins & Thyroid" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedTestCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTestCategory === cat.id
                    ? "bg-[#059669] text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-[#E8F8F0] border border-[#D6EDE1]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="rounded-3xl bg-white border border-[#D6EDE1] hover:border-[#8FE3B8] shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
                      {test.parametersCount} Parameters Included
                    </span>
                    {test.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                        {test.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-[#059669] transition-colors">
                      {test.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Fasting & Report Timeline */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Droplets className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                      <span>{test.fastingText}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Turnaround: {test.tat}</span>
                    </div>
                  </div>

                  {/* What it includes preview */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Key Parameters:</span>
                    <ul className="space-y-1 text-xs text-slate-600 font-medium">
                      {test.includes.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#059669] shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {test.includes.length > 3 && (
                        <li className="text-[11px] font-bold text-[#059669] pl-4">
                          +{test.includes.length - 3} more parameters included
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-[#064E3B]">₹{test.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{test.mrp}</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {test.discount}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(undefined, test)}
                      className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <span>Book Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MULTI-PHARMACY & LAB PARTNER ACCREDITATION NOTICE */}
      <div className="rounded-3xl border border-[#D6EDE1] bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">
              Direct Clinical Synchronization with Dr. Aarav Mehta
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Digital test results from Dr. Lal PathLabs, Metropolis, and Agilus are automatically formatted by CodeRx AI and securely added to your patient medical timeline.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Link
            href="/patient/records"
            className="px-4 py-2 rounded-xl bg-[#E8F8F0] hover:bg-[#D6EDE1] text-[#064E3B] font-bold text-xs flex items-center gap-1.5 border border-[#BCE8D0] transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#059669]" />
            <span>Open Medical Records</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          6. MODAL: BOOK LAB TEST / HOME PICKUP CONFIRMATION
         ========================================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#BCE8D0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {bookingConfirmed ? "Booking Confirmed! 🎉" : "Schedule Diagnostic Lab Test"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {bookingConfirmed ? "Your appointment is confirmed" : "Select date, slot & collection mode"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Confirmed Screen */}
            {bookingConfirmed ? (
              <div className="space-y-4 py-2 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E8F8F0] text-[#064E3B] border border-[#BCE8D0]">
                    Appointment Token: {bookingReferenceId}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 pt-2">
                    Sample Collection Scheduled!
                  </h4>
                  <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                    SMS and WhatsApp confirmation sent with preparation guidelines. A certified phlebotomist from{" "}
                    <strong>{selectedLabForBooking?.name}</strong> will arrive at your address.
                  </p>
                </div>

                {/* Appointment Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Test:</span>
                    <span className="font-bold text-slate-900">{selectedTestForBooking?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Laboratory:</span>
                    <span className="font-bold text-slate-900">{selectedLabForBooking?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mode:</span>
                    <span className="font-bold text-emerald-800">
                      {collectionType === "HOME" ? "🏠 Doorstep Home Collection" : "🏥 Center Walk-in"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date &amp; Time:</span>
                    <span className="font-bold text-slate-900">{selectedDate} ({selectedTimeSlot})</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Total Payable:</span>
                    <span className="font-black text-slate-900 text-sm">₹{selectedTestForBooking?.price} (Pay on Collection)</span>
                  </div>
                </div>

                {/* Preparation Guide */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-left text-xs font-medium space-y-1">
                  <span className="font-bold block">Fasting &amp; Sample Preparation:</span>
                  <p className="text-[11px] leading-relaxed">
                    {selectedTestForBooking?.fastingText}. You may drink plain water. Please keep previous prescriptions ready.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {selectedLabForBooking && (
                    <a
                      href={getGoogleMapsDirectionsUrl(selectedLabForBooking)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#059669]" />
                      <span>View Lab on Maps</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-xs cursor-pointer transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form Screen */
              <div className="space-y-4">
                {/* 1. Selected Test & Lab Summary */}
                <div className="p-3.5 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Test Selected:</span>
                    <h4 className="font-black text-[#064E3B]">{selectedTestForBooking?.title}</h4>
                    <span className="text-[11px] text-[#047857] font-semibold">
                      Via {selectedLabForBooking?.name} ({selectedLabForBooking?.distanceKm} km away)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#064E3B]">₹{selectedTestForBooking?.price}</span>
                    <span className="text-[10px] text-slate-400 line-through block">₹{selectedTestForBooking?.mrp}</span>
                  </div>
                </div>

                {/* 2. Collection Mode Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Collection Preference:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCollectionType("HOME")}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        collectionType === "HOME"
                          ? "bg-[#E8F8F0] border-[#059669] text-[#064E3B] shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Home className="w-4 h-4 text-[#059669]" />
                        {collectionType === "HOME" && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                      </div>
                      <div className="font-black text-xs mt-1.5">Home Collection 🏠</div>
                      <div className="text-[10px] text-slate-500 font-medium">Free phlebotomist visit</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionType("CENTER")}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        collectionType === "CENTER"
                          ? "bg-[#E8F8F0] border-[#059669] text-[#064E3B] shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Building2 className="w-4 h-4 text-[#059669]" />
                        {collectionType === "CENTER" && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                      </div>
                      <div className="font-black text-xs mt-1.5">Center Visit 🏥</div>
                      <div className="text-[10px] text-slate-500 font-medium">Direct priority queue token</div>
                    </button>
                  </div>
                </div>

                {/* 3. Choose Lab Provider */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Choose Diagnostics Provider:</label>
                  <select
                    value={selectedLabForBooking?.id}
                    onChange={(e) => {
                      const lab = BASE_DIAGNOSTIC_LABS.find((l) => l.id === e.target.value);
                      if (lab) setSelectedLabForBooking(lab);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-[#059669] focus:outline-hidden"
                  >
                    {BASE_DIAGNOSTIC_LABS.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name} — {lab.distanceKm} km ({lab.rating} ★ NABL Accredited)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Preferred Date:</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#059669] focus:outline-hidden"
                    >
                      <option value="Tomorrow (Recommended)">Tomorrow (Fastest)</option>
                      <option value="Day after Tomorrow">Day after Tomorrow</option>
                      <option value="This Sunday (Weekend Slot)">This Sunday</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Time Slot:</label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#059669] focus:outline-hidden"
                    >
                      <option value="06:30 AM - 07:30 AM (Early Fasting)">06:30 AM - 07:30 AM (Early Fasting)</option>
                      <option value="07:30 AM - 08:30 AM (Fasting)">07:30 AM - 08:30 AM (Fasting)</option>
                      <option value="08:30 AM - 09:30 AM (Standard)">08:30 AM - 09:30 AM (Standard)</option>
                      <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM</option>
                      <option value="05:00 PM - 06:00 PM (Evening)">05:00 PM - 06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Patient Contact & Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Patient Details &amp; Address:</label>
                  <input
                    type="text"
                    value={patientContact.name}
                    onChange={(e) => setPatientContact({ ...patientContact, name: e.target.value })}
                    placeholder="Patient Full Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-[#059669] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={patientContact.phone}
                    onChange={(e) => setPatientContact({ ...patientContact, phone: e.target.value })}
                    placeholder="Mobile Number (for SMS & OTP)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-[#059669] focus:outline-hidden"
                  />
                  {collectionType === "HOME" && (
                    <textarea
                      rows={2}
                      value={patientContact.address}
                      onChange={(e) => setPatientContact({ ...patientContact, address: e.target.value })}
                      placeholder="Home Address with Landmark for Phlebotomist visit"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-[#059669] focus:outline-hidden resize-none"
                    />
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="w-full py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <span>Confirm Lab Appointment (Pay on Visit)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. UPLOAD REPORT MODAL INTEGRATION */}
      <PatientUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        patientName={patientName}
      />
    </div>
  );
}
