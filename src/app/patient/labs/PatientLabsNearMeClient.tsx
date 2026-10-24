"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FlaskConical,
  MapPin,
  Navigation,
  Search,
  Phone,
  Clock,
  ExternalLink,
  Home,
  Building2,
  Upload,
  FileText,
  X,
  Crosshair,
  Check,
  CheckCircle2,
  ArrowRight,
  Droplets,
} from "lucide-react";
import { PatientUploadModal } from "@/components/reports/PatientUploadModal";

export interface DiagnosticLab {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  driveTimeMin: number;
  address: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  hours: string;
  homeCollectionBadge: string;
  badge: string;
}

export interface LabTestPackage {
  id: string;
  title: string;
  parametersCount: number;
  fastingText: string;
  tat: string;
  mrp: number;
  price: number;
  discount: string;
  description: string;
}

// Simple curated list of top certified labs
const DIAGNOSTIC_LABS: DiagnosticLab[] = [
  {
    id: "lal-pathlabs",
    name: "Dr. Lal PathLabs",
    tagline: "NABL & CAP Certified Diagnostic Center",
    rating: 4.8,
    reviewsCount: 1840,
    distanceKm: 0.7,
    driveTimeMin: 3,
    address: "Shop 4 & 5, Near Azad Nagar Metro, Linking Road, Andheri West",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912226834100",
    hours: "06:30 AM - 09:30 PM",
    homeCollectionBadge: "Free Home Pickup",
    badge: "Most Popular",
  },
  {
    id: "metropolis",
    name: "Metropolis Healthcare",
    tagline: "CAP & NABL Accredited Global Pathology Lab",
    rating: 4.9,
    reviewsCount: 2410,
    distanceKm: 1.2,
    driveTimeMin: 5,
    address: "SV Road, Near Shoppers Stop, Andheri West Station",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400058",
    phone: "+918422801801",
    hours: "07:00 AM - 09:00 PM",
    homeCollectionBadge: "Free Home Pickup",
    badge: "Top Rated",
  },
  {
    id: "agilus",
    name: "Agilus Diagnostics (SRL)",
    tagline: "NABL Accredited Reference Pathology Network",
    rating: 4.7,
    reviewsCount: 1120,
    distanceKm: 1.8,
    driveTimeMin: 7,
    address: "Prime Square, New Link Road, Oshiwara, Opp. Infinity Mall",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912226300900",
    hours: "06:30 AM - 08:30 PM",
    homeCollectionBadge: "Home Sample Service",
    badge: "NABL Certified",
  },
  {
    id: "suburban",
    name: "Suburban Diagnostics",
    tagline: "Pathology & Digital Diagnostics Center",
    rating: 4.8,
    reviewsCount: 980,
    distanceKm: 2.3,
    driveTimeMin: 8,
    address: "Crystal Plaza, Opposite Citi Mall, New Link Road",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912261700000",
    hours: "07:00 AM - 09:00 PM",
    homeCollectionBadge: "Home Sample Service",
    badge: "Quick Reports",
  },
  {
    id: "apollo",
    name: "Apollo Diagnostics",
    tagline: "Apollo Hospitals Pathology Network",
    rating: 4.8,
    reviewsCount: 1350,
    distanceKm: 2.9,
    driveTimeMin: 10,
    address: "Central Avenue, Near Metro Pillar 114, Andheri West",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400058",
    phone: "+9118001020288",
    hours: "06:30 AM - 10:00 PM",
    homeCollectionBadge: "30-Min Home Phlebotomist",
    badge: "24/7 Support",
  },
  {
    id: "thyrocare",
    name: "Thyrocare Technologies",
    tagline: "Automated Biochemistry & Preventive Care",
    rating: 4.6,
    reviewsCount: 870,
    distanceKm: 3.4,
    driveTimeMin: 12,
    address: "Sunrise Arcade, JP Road, Versova, Andheri West",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400061",
    phone: "+912227781200",
    hours: "06:00 AM - 08:00 PM",
    homeCollectionBadge: "Free Home Pickup",
    badge: "Best Value",
  },
];

// Curated popular tests
const POPULAR_TESTS: LabTestPackage[] = [
  {
    id: "cbc",
    title: "Complete Blood Count (CBC with ESR)",
    parametersCount: 24,
    fastingText: "No Fasting Required",
    tat: "Report in 4 - 6 Hours",
    mrp: 350,
    price: 240,
    discount: "31% OFF",
    description: "Hemoglobin, platelets, RBC, WBC count and infection markers.",
  },
  {
    id: "full-body",
    title: "Full Body Comprehensive Health Checkup",
    parametersCount: 85,
    fastingText: "10-12 hrs Overnight Fasting",
    tat: "Same Day Evening",
    mrp: 2499,
    price: 1199,
    discount: "52% OFF",
    description: "Complete health checkup: CBC, Liver, Kidney, Lipids, Diabetes, Thyroid & Urine.",
  },
  {
    id: "diabetes",
    title: "HbA1c & Fasting Blood Sugar",
    parametersCount: 3,
    fastingText: "8-10 hrs Fasting Required",
    tat: "Report in 6 Hours",
    mrp: 650,
    price: 390,
    discount: "40% OFF",
    description: "Gold standard 3-month average glucose (HbA1c) + active fasting sugar.",
  },
  {
    id: "lipid",
    title: "Lipid Profile (Cholesterol & Heart Panel)",
    parametersCount: 8,
    fastingText: "12 hrs Strict Fasting",
    tat: "Report in 6 Hours",
    mrp: 850,
    price: 490,
    discount: "42% OFF",
    description: "Total Cholesterol, HDL good, LDL bad cholesterol & Triglycerides.",
  },
  {
    id: "thyroid",
    title: "Thyroid Profile (T3, T4, TSH)",
    parametersCount: 3,
    fastingText: "Morning Sample Preferred",
    tat: "Report in 6 Hours",
    mrp: 600,
    price: 350,
    discount: "41% OFF",
    description: "Thyroid gland hormones for metabolism, weight, and energy balance.",
  },
  {
    id: "vitamins",
    title: "Vitamin D3 & Vitamin B12 Duo",
    parametersCount: 2,
    fastingText: "No Fasting Required",
    tat: "Report in 12 - 24 Hours",
    mrp: 1800,
    price: 899,
    discount: "50% OFF",
    description: "Key vitamins for bone strength, nerve health, and energy levels.",
  },
  {
    id: "lft",
    title: "Liver Function Test (LFT)",
    parametersCount: 11,
    fastingText: "No Special Prep",
    tat: "Report in 6 Hours",
    mrp: 750,
    price: 450,
    discount: "40% OFF",
    description: "Bilirubin, SGOT, SGPT enzymes and protein markers.",
  },
  {
    id: "kft",
    title: "Kidney Function Test (KFT with Creatinine)",
    parametersCount: 8,
    fastingText: "Normal Hydration",
    tat: "Report in 6 Hours",
    mrp: 800,
    price: 480,
    discount: "40% OFF",
    description: "Serum Creatinine, Blood Urea, eGFR and electrolyte balance.",
  },
  {
    id: "urine",
    title: "Urine Routine & Microscopic",
    parametersCount: 18,
    fastingText: "Early Morning Sample",
    tat: "Report in 3 - 4 Hours",
    mrp: 280,
    price: 160,
    discount: "43% OFF",
    description: "Routine check for infection, protein leakage, and kidney crystals.",
  },
];

const QUICK_AREAS = ["Andheri West", "Bandra", "Powai", "South Mumbai", "Thane"];

interface PatientLabsNearMeClientProps {
  patientName?: string;
}

export function PatientLabsNearMeClient({
  patientName = "Patient",
}: PatientLabsNearMeClientProps) {
  const [activeTab, setActiveTab] = useState<"labs" | "tests">("labs");
  const [selectedArea, setSelectedArea] = useState("Andheri West");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<DiagnosticLab>(DIAGNOSTIC_LABS[0]);
  const [selectedTest, setSelectedTest] = useState<LabTestPackage>(POPULAR_TESTS[0]);
  const [collectionType, setCollectionType] = useState<"HOME" | "LAB">("HOME");
  const [selectedDate, setSelectedDate] = useState("Tomorrow Morning");
  const [selectedSlot, setSelectedSlot] = useState("07:30 AM - 08:30 AM (Fasting)");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingToken, setBookingToken] = useState("");

  // Filtered labs
  const filteredLabs = useMemo(() => {
    if (!searchQuery.trim()) return DIAGNOSTIC_LABS;
    const q = searchQuery.toLowerCase();
    return DIAGNOSTIC_LABS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.pincode.includes(q)
    );
  }, [searchQuery]);

  // GPS Detection
  function handleDetectGps() {
    setIsDetectingGps(true);
    setGpsMessage("Finding your location...");

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          setSelectedArea("Your Current Location");
          setGpsMessage("GPS connected! Showing labs closest to your location.");
          setSearchQuery("");
        },
        () => {
          setIsDetectingGps(false);
          setGpsMessage("GPS unavailable. Showing labs in Andheri West.");
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsMessage("Geolocation not supported. Showing labs in Andheri West.");
    }
  }

  // Open booking modal
  function handleOpenBooking(lab?: DiagnosticLab, test?: LabTestPackage) {
    if (lab) setSelectedLab(lab);
    if (test) setSelectedTest(test);
    setIsBooked(false);
    setBookingModalOpen(true);
  }

  function handleConfirmBooking() {
    setBookingToken(`LAB-${Math.floor(10000 + Math.random() * 90000)}`);
    setIsBooked(true);
  }

  // Google Maps links
  function getDirectionsUrl(lab: DiagnosticLab) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      lab.name + ", " + lab.address
    )}`;
  }

  function getNearbyMapSearchUrl() {
    return `https://www.google.com/maps/search/diagnostic+pathology+lab+near+me`;
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-16 font-sans">
      {/* 1. SIMPLE CLEAN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D6EDE1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span>Lab Tests Near Me</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Find nearby certified pathology labs with GPS directions or book free home sample pickup.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#064E3B] bg-white hover:bg-[#F3FAF6] border border-[#BCE8D0] shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#059669]" />
            <span>Upload Report</span>
          </button>
          <Link
            href="/patient/records?type=lab"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-2xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Past Reports</span>
          </Link>
        </div>
      </div>

      {/* 2. SIMPLE UNIFIED SEARCH & LOCATION BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#D6EDE1] shadow-2xs space-y-3">
        {/* Main Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or pincode (e.g. Andheri, 400053)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#059669] focus:outline-hidden text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* GPS Button */}
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#E8F8F0] hover:bg-[#D6EDE1] text-[#064E3B] border border-[#BCE8D0] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Crosshair className={`w-3.5 h-3.5 text-[#059669] ${isDetectingGps ? "animate-spin" : ""}`} />
              <span>{isDetectingGps ? "Locating..." : "Use My GPS"}</span>
            </button>

            {/* Google Maps Link */}
            <a
              href={getNearbyMapSearchUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Maps</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* GPS Status feedback */}
        {gpsMessage && (
          <div className="text-xs text-[#064E3B] bg-[#E8F8F0] border border-[#BCE8D0] px-3 py-1.5 rounded-xl flex items-center justify-between font-medium">
            <span>{gpsMessage}</span>
            <button
              type="button"
              onClick={() => setGpsMessage(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Quick Area Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#059669]" />
            Nearby:
          </span>
          {QUICK_AREAS.map((area) => {
            const isSelected = selectedArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => {
                  setSelectedArea(area);
                  setSearchQuery("");
                  setGpsMessage(`Showing labs in ${area}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#059669] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SIMPLE TAB SWITCHER */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-black">
        <button
          type="button"
          onClick={() => setActiveTab("labs")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "labs"
              ? "bg-white text-[#064E3B] shadow-2xs font-black"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#059669]" />
          <span>Nearby Diagnostic Labs ({filteredLabs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tests")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "tests"
              ? "bg-white text-[#064E3B] shadow-2xs font-black"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-[#059669]" />
          <span>Popular Tests &amp; Pricing ({POPULAR_TESTS.length})</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: SIMPLE LABS LIST (GPS DIRECT TO GOOGLE MAPS)
         ========================================================= */}
      {activeTab === "labs" && (
        <div className="space-y-3">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D6EDE1] hover:border-[#8FE3B8] shadow-2xs transition-all space-y-3"
            >
              {/* Header: Name, Distance & Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-900">{lab.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                      ★ {lab.rating} ({lab.reviewsCount}+)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {lab.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{lab.tagline}</p>
                </div>

                {/* Distance Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E8F8F0] text-[#064E3B] text-xs font-black w-fit">
                  <Navigation className="w-3.5 h-3.5 text-[#059669]" />
                  <span>{lab.distanceKm} km away</span>
                  <span className="text-[10px] text-slate-400 font-normal">({lab.driveTimeMin} min drive)</span>
                </div>
              </div>

              {/* Address & Hours */}
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                  <span>{lab.address}, {lab.city} - {lab.pincode}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Hours: {lab.hours} • <strong className="text-emerald-700">{lab.homeCollectionBadge}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {/* 1. Google Maps Directions */}
                <a
                  href={getDirectionsUrl(lab)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[150px] py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                {/* 2. Direct Call */}
                <a
                  href={`tel:${lab.phone}`}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-[#059669]" />
                  <span>Call</span>
                </a>

                {/* 3. Book Slot */}
                <button
                  type="button"
                  onClick={() => handleOpenBooking(lab)}
                  className="py-2 px-3.5 rounded-xl bg-[#E8F8F0] hover:bg-[#D6EDE1] text-[#064E3B] border border-[#BCE8D0] text-xs font-bold cursor-pointer"
                >
                  Book Test Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          TAB 2: SIMPLE TEST PACKAGES (PRICING & 1-CLICK BOOK)
         ========================================================= */}
      {activeTab === "tests" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {POPULAR_TESTS.map((test) => (
            <div
              key={test.id}
              className="p-4 rounded-2xl bg-white border border-[#D6EDE1] hover:border-[#8FE3B8] shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8F0] text-[#064E3B]">
                    {test.parametersCount} Tests
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {test.discount}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 leading-snug">{test.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{test.description}</p>

                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                  <div className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Droplets className="w-3 h-3 text-[#059669]" />
                    <span>{test.fastingText}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{test.tat}</span>
                  </div>
                </div>
              </div>

              {/* Price & Book */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-[#064E3B]">₹{test.price}</span>
                  <span className="text-xs text-slate-400 line-through ml-1.5">₹{test.mrp}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(undefined, test)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          4. SIMPLE BOOKING MODAL
         ========================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#BCE8D0] shadow-xl max-w-md w-full p-5 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {isBooked ? "Booking Confirmed! 🎉" : "Book Lab Test"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBooked ? "Sample collection scheduled" : "Choose home pickup or center visit"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Confirmed */}
            {isBooked ? (
              <div className="space-y-3 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#E8F8F0] text-[#064E3B]">
                    Token: {bookingToken}
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-1.5">
                    Appointment Confirmed
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {collectionType === "HOME"
                      ? `Phlebotomist from ${selectedLab.name} will visit your address.`
                      : `Priority slot token reserved at ${selectedLab.name}.`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Test:</span>
                    <span className="font-bold text-slate-900">{selectedTest.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date &amp; Time:</span>
                    <span className="font-bold text-slate-900">{selectedDate} ({selectedSlot})</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Total:</span>
                    <span className="font-bold text-slate-900">₹{selectedTest.price} (Pay on visit)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={getDirectionsUrl(selectedLab)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#059669]" />
                    <span>View Map</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <div className="space-y-3.5">
                {/* Selected Test */}
                <div className="p-3 rounded-xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-black text-[#064E3B]">{selectedTest.title}</h4>
                    <span className="text-[11px] text-[#047857]">Via {selectedLab.name} ({selectedLab.distanceKm} km)</span>
                  </div>
                  <span className="text-sm font-black text-[#064E3B]">₹{selectedTest.price}</span>
                </div>

                {/* Collection Mode */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCollectionType("HOME")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      collectionType === "HOME"
                        ? "bg-[#E8F8F0] border-[#059669] text-[#064E3B]"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Home className="w-4 h-4 text-[#059669]" />
                      {collectionType === "HOME" && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                    </div>
                    <div className="font-bold text-xs mt-1">Home Collection 🏠</div>
                    <div className="text-[10px] text-slate-400">Free doorstep pickup</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionType("LAB")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      collectionType === "LAB"
                        ? "bg-[#E8F8F0] border-[#059669] text-[#064E3B]"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Building2 className="w-4 h-4 text-[#059669]" />
                      {collectionType === "LAB" && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                    </div>
                    <div className="font-bold text-xs mt-1">Lab Walk-in 🏥</div>
                    <div className="text-[10px] text-slate-400">Priority queue slot</div>
                  </button>
                </div>

                {/* Date & Slot */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Preferred Date:</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden"
                    >
                      <option value="Tomorrow Morning">Tomorrow</option>
                      <option value="Day after Tomorrow">Day after Tomorrow</option>
                      <option value="This Weekend">This Weekend</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Time Slot:</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden"
                    >
                      <option value="06:30 AM - 07:30 AM (Fasting)">06:30 - 07:30 AM (Fasting)</option>
                      <option value="07:30 AM - 08:30 AM (Fasting)">07:30 - 08:30 AM (Fasting)</option>
                      <option value="08:30 AM - 09:30 AM">08:30 - 09:30 AM</option>
                      <option value="05:00 PM - 06:00 PM (Evening)">05:00 - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Confirm Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. UPLOAD MODAL */}
      <PatientUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        patientName={patientName}
      />
    </div>
  );
}
