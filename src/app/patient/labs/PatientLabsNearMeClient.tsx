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
  X,
  Crosshair,
  Check,
  CheckCircle2,
  ArrowRight,
  Droplets,
} from "lucide-react";

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

// Curated list of top certified pathology labs across India
const DIAGNOSTIC_LABS: DiagnosticLab[] = [
  // 1. Mumbai
  {
    id: "lal-pathlabs-vakola",
    name: "Dr. Lal PathLabs - Vakola Collection Centre",
    tagline: "NABL & CAP Certified Diagnostic Pathology Center",
    rating: 4.8,
    reviewsCount: 1420,
    distanceKm: 0.4,
    driveTimeMin: 2,
    address: "Shop 3, Ground Floor, Nehru Road, Near Vakola Bridge, Santacruz East",
    area: "Vakola, Santacruz East",
    city: "Mumbai",
    pincode: "400055",
    phone: "+912226685100",
    hours: "06:30 AM - 09:00 PM",
    homeCollectionBadge: "Free Home Pickup in Vakola & Santacruz",
    badge: "Nearby Center",
  },
  {
    id: "metropolis-vakola",
    name: "Metropolis Healthcare - Vakola Diagnostic Hub",
    tagline: "CAP & NABL Accredited Pathology & Blood Test Centre",
    rating: 4.9,
    reviewsCount: 1890,
    distanceKm: 0.6,
    driveTimeMin: 3,
    address: "Datta Mandir Road, Near Vakola Police Station, Santacruz East",
    area: "Vakola, Santacruz East",
    city: "Mumbai",
    pincode: "400055",
    phone: "+918422801801",
    hours: "07:00 AM - 09:30 PM",
    homeCollectionBadge: "30-Min Home Phlebotomist",
    badge: "Top Rated in Vakola",
  },
  {
    id: "suburban-santacruz",
    name: "Suburban Diagnostics - Santacruz & Vakola",
    tagline: "High-Precision Pathology & Preventive Diagnostics",
    rating: 4.8,
    reviewsCount: 1650,
    distanceKm: 1.1,
    driveTimeMin: 4,
    address: "Near Grand Hyatt, Western Express Highway, Santacruz East / Vakola",
    area: "Santacruz East / Vakola",
    city: "Mumbai",
    pincode: "400055",
    phone: "+912261700000",
    hours: "06:30 AM - 09:00 PM",
    homeCollectionBadge: "Doorstep Phlebotomy",
    badge: "Fast 4-Hour Reports",
  },
  {
    id: "agilus-vakola",
    name: "Agilus Diagnostics (SRL) - Vakola Centre",
    tagline: "NABL Accredited Pathology & Wellness Hub",
    rating: 4.7,
    reviewsCount: 980,
    distanceKm: 0.8,
    driveTimeMin: 3,
    address: "Nehru Road, Opposite St. Anthony's Church, Vakola, Santacruz East",
    area: "Vakola, Santacruz East",
    city: "Mumbai",
    pincode: "400055",
    phone: "+912226691200",
    hours: "07:00 AM - 08:30 PM",
    homeCollectionBadge: "Free Home Collection",
    badge: "Certified Lab",
  },
  {
    id: "metropolis-mumbai",
    name: "Metropolis Healthcare Central Reference Lab",
    tagline: "Global NABL & CAP Accredited Diagnostic Reference Lab",
    rating: 4.9,
    reviewsCount: 3120,
    distanceKm: 1.8,
    driveTimeMin: 6,
    address: "Kohinoor City, Commercial 1, Near Kurla & Vidyavihar",
    area: "Kurla West",
    city: "Mumbai",
    pincode: "400070",
    phone: "+918422801801",
    hours: "24 Hours Open (Round-the-clock)",
    homeCollectionBadge: "Free Home Sample Pickup",
    badge: "Central Reference Lab",
  },
  {
    id: "lal-pathlabs-mumbai",
    name: "Dr. Lal PathLabs - Andheri Hub",
    tagline: "NABL & CAP Certified Diagnostic Center",
    rating: 4.8,
    reviewsCount: 1840,
    distanceKm: 3.5,
    driveTimeMin: 12,
    address: "Shop 4 & 5, Near Azad Nagar Metro, Linking Road",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912226834100",
    hours: "06:30 AM - 09:30 PM",
    homeCollectionBadge: "Free Home Pickup",
    badge: "Most Popular",
  },
  {
    id: "suburban-mumbai",
    name: "Suburban Diagnostics - Andheri",
    tagline: "Pathology & Digital Diagnostics Network",
    rating: 4.8,
    reviewsCount: 1250,
    distanceKm: 3.8,
    driveTimeMin: 14,
    address: "Crystal Plaza, Opposite Citi Mall, New Link Road",
    area: "Andheri West",
    city: "Mumbai",
    pincode: "400053",
    phone: "+912261700000",
    hours: "07:00 AM - 09:00 PM",
    homeCollectionBadge: "30-Min Home Phlebotomist",
    badge: "Quick Reports",
  },

  // 2. Delhi NCR
  {
    id: "lal-pathlabs-delhi",
    name: "Dr. Lal PathLabs National Reference Lab",
    tagline: "India's Flagship CAP & NABL Accredited Center of Excellence",
    rating: 4.9,
    reviewsCount: 4620,
    distanceKm: 2.1,
    driveTimeMin: 7,
    address: "Sector 18, Block E, Near Rohini West Metro Station",
    area: "Rohini",
    city: "New Delhi",
    pincode: "110085",
    phone: "+911139885050",
    hours: "24 Hours (Round-the-clock)",
    homeCollectionBadge: "Free Home Pickup Across Delhi NCR",
    badge: "National Reference Lab",
  },
  {
    id: "agilus-delhi",
    name: "Agilus Diagnostics (SRL)",
    tagline: "Premier NABL Certified Pathology Network",
    rating: 4.8,
    reviewsCount: 1980,
    distanceKm: 3.4,
    driveTimeMin: 10,
    address: "A-20, Ring Road, Near South Extension & Hauz Khas",
    area: "South Delhi",
    city: "New Delhi",
    pincode: "110049",
    phone: "+911149599999",
    hours: "06:30 AM - 09:00 PM",
    homeCollectionBadge: "Doorstep Phlebotomy",
    badge: "NABL Certified",
  },
  {
    id: "apollo-delhi-ncr",
    name: "Apollo Diagnostics",
    tagline: "Apollo Hospitals Specialized Pathology & Genomics",
    rating: 4.7,
    reviewsCount: 1420,
    distanceKm: 4.0,
    driveTimeMin: 12,
    address: "Sector 18 Market, Near Atta Market",
    area: "Noida",
    city: "Delhi NCR",
    pincode: "201301",
    phone: "+9118001020288",
    hours: "07:00 AM - 09:30 PM",
    homeCollectionBadge: "Free Home Sample Service",
    badge: "Hospital Grade",
  },

  // 3. Bengaluru
  {
    id: "neuberg-anand-bengaluru",
    name: "Neuberg Anand Reference Laboratory",
    tagline: "Karnataka's Premier NABL & CAP Accredited Reference Lab",
    rating: 4.9,
    reviewsCount: 2890,
    distanceKm: 1.8,
    driveTimeMin: 6,
    address: "Anand Tower, #11, Subbaiah Road / Lady Curzon Road, Shivajinagar",
    area: "Shivajinagar",
    city: "Bengaluru",
    pincode: "560001",
    phone: "+918042445566",
    hours: "06:30 AM - 09:30 PM",
    homeCollectionBadge: "Free Doorstep Pickup",
    badge: "State Reference Center",
  },
  {
    id: "agilus-bengaluru",
    name: "Agilus Diagnostics Central Lab",
    tagline: "Advanced Molecular & Clinical Pathology",
    rating: 4.7,
    reviewsCount: 1340,
    distanceKm: 3.1,
    driveTimeMin: 9,
    address: "#724, Chinmaya Mission Hospital Rd, 1st Stage, Indiranagar",
    area: "Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    phone: "+918049364936",
    hours: "07:00 AM - 09:00 PM",
    homeCollectionBadge: "Home Pickup in 45 Mins",
    badge: "Superfast TAT",
  },

  // 4. Hyderabad
  {
    id: "vijaya-hyderabad",
    name: "Vijaya Diagnostic Centre",
    tagline: "NABL Accredited Integrated Pathology & Imaging Hub",
    rating: 4.8,
    reviewsCount: 3410,
    distanceKm: 2.0,
    driveTimeMin: 6,
    address: "3-6-16 & 17, Street No 19, Opp. Telugu Academy, Himayatnagar",
    area: "Himayatnagar",
    city: "Hyderabad",
    pincode: "500029",
    phone: "+914023420420",
    hours: "06:30 AM - 10:00 PM",
    homeCollectionBadge: "Free Home Blood Sample Pickup",
    badge: "Most Trusted",
  },
  {
    id: "apollo-hyderabad",
    name: "Apollo Diagnostics Central Lab",
    tagline: "Automated Biochemistry & Pathology Center",
    rating: 4.8,
    reviewsCount: 2150,
    distanceKm: 3.5,
    driveTimeMin: 11,
    address: "Road No 36, Near Peddamma Temple Metro, Jubilee Hills",
    area: "Jubilee Hills",
    city: "Hyderabad",
    pincode: "500033",
    phone: "+9118001020288",
    hours: "07:00 AM - 09:00 PM",
    homeCollectionBadge: "30-Min Home Phlebotomist",
    badge: "NABL & CAP",
  },

  // 5. Chennai
  {
    id: "metropolis-chennai",
    name: "Metropolis Healthcare Reference Lab",
    tagline: "CAP & NABL Accredited Precision Diagnostics",
    rating: 4.8,
    reviewsCount: 2190,
    distanceKm: 1.5,
    driveTimeMin: 5,
    address: "No. 122, Nungambakkam High Road, Near Gemini Flyover",
    area: "Nungambakkam",
    city: "Chennai",
    pincode: "600034",
    phone: "+918422801801",
    hours: "06:30 AM - 09:30 PM",
    homeCollectionBadge: "Doorstep Sample Pickup",
    badge: "Precision Care",
  },
  {
    id: "neuberg-ehrlich-chennai",
    name: "Neuberg Ehrlich Laboratory",
    tagline: "Pioneer Pathology Institute in South India (Est. 1938)",
    rating: 4.8,
    reviewsCount: 1940,
    distanceKm: 2.4,
    driveTimeMin: 8,
    address: "46, Masilamani Road, Balaji Nagar, Royapettah",
    area: "Royapettah",
    city: "Chennai",
    pincode: "600014",
    phone: "+914442224444",
    hours: "06:30 AM - 09:00 PM",
    homeCollectionBadge: "Free Home Collection",
    badge: "Heritage Lab",
  },

  // 6. Kolkata
  {
    id: "suraksha-kolkata",
    name: "Suraksha Diagnostics Central Lab",
    tagline: "Eastern India's Leading NABL & CAP Accredited Lab Chain",
    rating: 4.8,
    reviewsCount: 2780,
    distanceKm: 1.9,
    driveTimeMin: 6,
    address: "DD-18/1, Salt Lake Sector 1, Near City Centre 1",
    area: "Salt Lake",
    city: "Kolkata",
    pincode: "700064",
    phone: "+913366191000",
    hours: "06:30 AM - 09:00 PM",
    homeCollectionBadge: "Free Doorstep Pickup",
    badge: "Top Lab in East India",
  },
  {
    id: "lal-kolkata",
    name: "Dr. Lal PathLabs",
    tagline: "Certified Clinical Pathology & Preventive Health",
    rating: 4.7,
    reviewsCount: 1620,
    distanceKm: 3.2,
    driveTimeMin: 10,
    address: "54A, Park Street, Near Park Mansions",
    area: "Park Street",
    city: "Kolkata",
    pincode: "700016",
    phone: "+913322295555",
    hours: "07:00 AM - 08:30 PM",
    homeCollectionBadge: "Same Day Home Sample Service",
    badge: "NABL Certified",
  },

  // 7. Pune
  {
    id: "rubyhall-pune",
    name: "Ruby Hall Clinic Diagnostic Center",
    tagline: "NABL & NABH Accredited Multi-speciality Diagnostic Network",
    rating: 4.8,
    reviewsCount: 2310,
    distanceKm: 2.1,
    driveTimeMin: 7,
    address: "40, Sassoon Road, Near Pune Railway Station",
    area: "Sangamvadi",
    city: "Pune",
    pincode: "411001",
    phone: "+912066455100",
    hours: "24 Hours Open",
    homeCollectionBadge: "Free Home Pickup Across Pune",
    badge: "NABH & NABL",
  },
  {
    id: "suburban-pune",
    name: "Suburban Diagnostics",
    tagline: "Automated Clinical Pathology & Wellness Hub",
    rating: 4.7,
    reviewsCount: 1450,
    distanceKm: 2.8,
    driveTimeMin: 9,
    address: "Fergusson College Road, Deccan Gymkhana, Shivajinagar",
    area: "FC Road",
    city: "Pune",
    pincode: "411004",
    phone: "+912061700000",
    hours: "07:00 AM - 09:00 PM",
    homeCollectionBadge: "Doorstep Phlebotomist",
    badge: "Fast Results",
  },

  // 8. Pan-India Network
  {
    id: "thyrocare-national",
    name: "Thyrocare Technologies National Lab",
    tagline: "Fully Automated Central Processing Laboratory Serving 2000+ PIN Codes",
    rating: 4.7,
    reviewsCount: 5200,
    distanceKm: 4.5,
    driveTimeMin: 14,
    address: "D-37/1, TTC MIDC, Turbhe & Pan-India Network",
    area: "Pan-India Network",
    city: "All India",
    pincode: "400703",
    phone: "+912227781200",
    hours: "24 Hours (Processing round-the-clock)",
    homeCollectionBadge: "Doorstep Pickup Across 2,000+ Indian PIN Codes",
    badge: "Pan-India Coverage",
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

const QUICK_AREAS = [
  "All India",
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
];

interface PatientLabsNearMeClientProps {
  patientName?: string;
}

export function PatientLabsNearMeClient({
  patientName = "Patient",
}: PatientLabsNearMeClientProps) {
  const [activeTab, setActiveTab] = useState<"labs" | "tests">("labs");
  const [selectedArea, setSelectedArea] = useState("All India");
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<DiagnosticLab>(DIAGNOSTIC_LABS[0]);
  const [selectedTest, setSelectedTest] = useState<LabTestPackage>(POPULAR_TESTS[0]);
  const [collectionType, setCollectionType] = useState<"HOME" | "LAB">("HOME");
  const [selectedDate, setSelectedDate] = useState("Tomorrow Morning");
  const [selectedSlot, setSelectedSlot] = useState("07:30 AM - 08:30 AM (Fasting)");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingToken, setBookingToken] = useState("");

  // Filtered labs across India
  const filteredLabs = useMemo(() => {
    let list = DIAGNOSTIC_LABS;
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      // First try matching within selected area (e.g. Mumbai)
      if (selectedArea && selectedArea !== "All India" && selectedArea !== "Your Current Location") {
        const s = selectedArea.toLowerCase();
        const areaFiltered = list.filter((l) => {
          if (s === "delhi ncr") {
            return (
              l.city.toLowerCase().includes("delhi") ||
              l.city.toLowerCase().includes("noida") ||
              l.city.toLowerCase().includes("gurugram") ||
              l.area.toLowerCase().includes("delhi")
            );
          }
          return l.city.toLowerCase().includes(s) || l.area.toLowerCase().includes(s);
        });

        const matches = areaFiltered.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.area.toLowerCase().includes(q) ||
            l.city.toLowerCase().includes(q) ||
            l.address.toLowerCase().includes(q) ||
            l.pincode.includes(q)
        );
        if (matches.length > 0) return matches;
      }

      // Check nationwide if query was a city or locality elsewhere
      const nationwideMatches = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.pincode.includes(q)
      );
      return nationwideMatches;
    }

    if (selectedArea && selectedArea !== "All India" && selectedArea !== "Your Current Location") {
      const s = selectedArea.toLowerCase();
      return list.filter((l) => {
        if (s === "delhi ncr") {
          return (
            l.city.toLowerCase().includes("delhi") ||
            l.city.toLowerCase().includes("noida") ||
            l.city.toLowerCase().includes("gurugram") ||
            l.area.toLowerCase().includes("delhi")
          );
        }
        return l.city.toLowerCase().includes(s) || l.area.toLowerCase().includes(s);
      });
    }

    return list;
  }, [selectedArea, searchQuery]);

  // GPS Detection across India
  function handleDetectGps() {
    setIsDetectingGps(true);
    setGpsMessage("Finding your location across India...");

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSelectedArea("Your Current Location");
          setGpsMessage("GPS location detected! Showing nearest labs and synced Google Maps.");
          setSearchQuery("");
        },
        () => {
          setIsDetectingGps(false);
          setGpsMessage("GPS unavailable. You can search any city, landmark or PIN code in India.");
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsDetectingGps(false);
      setGpsMessage("Geolocation not supported on this device. Search any city or PIN code across India.");
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

  // Open external Google Maps reliably
  function handleOpenExternalMap(url: string, e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // Google Maps links
  function getDirectionsUrl(lab: DiagnosticLab) {
    const fullAddress = `${lab.name}, ${lab.address}, ${lab.area}, ${lab.city}, ${lab.pincode}, India`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  }

  function getNearbyMapSearchUrl() {
    if (userCoords) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `pathology labs near ${userCoords.lat},${userCoords.lng}`
      )}`;
    }
    const q = searchQuery.trim();
    const areaContext =
      selectedArea && selectedArea !== "All India" && selectedArea !== "Your Current Location"
        ? selectedArea
        : "";

    if (q) {
      const queryWithContext =
        areaContext && !q.toLowerCase().includes(areaContext.toLowerCase())
          ? `pathology labs in ${q}, ${areaContext}, India`
          : `pathology labs in ${q}, India`;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryWithContext)}`;
    }

    if (areaContext) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `pathology labs in ${areaContext}, India`
      )}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "pathology labs near me India"
    )}`;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* 1. SIMPLE CLEAN HEADER */}
      <div className="pb-4 border-b border-[#D6EDE1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] shadow-2xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span>Pathology Labs Near Me</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Find certified pathology labs across India with GPS directions and direct contact.
          </p>
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
              placeholder="Search area, city or 6-digit pincode across India (e.g. Rohini, Indiranagar, 400053)..."
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
              rel="noopener noreferrer"
              onClick={(e) => handleOpenExternalMap(getNearbyMapSearchUrl(), e)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
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
                  setGpsMessage(
                    area === "All India"
                      ? "Showing top certified labs across India"
                      : `Showing certified labs in ${area}`
                  );
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
          <span>Pathology Labs ({filteredLabs.length})</span>
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
          {filteredLabs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#D6EDE1] text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D0] flex items-center justify-center text-[#059669] mx-auto">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Search &ldquo;{searchQuery || selectedArea}&rdquo; on Google Maps
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {selectedArea !== "All India" && selectedArea !== "Your Current Location"
                    ? `Click below to view all certified pathology labs in ${searchQuery || selectedArea}, ${selectedArea} directly with turn-by-turn navigation.`
                    : `Click below to view all certified pathology labs in ${searchQuery || selectedArea} directly on Google Maps.`}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={getNearbyMapSearchUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenExternalMap(getNearbyMapSearchUrl(), e)}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold inline-flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open &ldquo;{searchQuery || selectedArea}&rdquo; on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedArea("All India");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Show All India Labs
                </button>
              </div>

              {/* Also show home pickup options so user is never stuck */}
              <div className="pt-4 mt-4 border-t border-slate-100 text-left">
                <p className="text-xs font-black text-[#064E3B] mb-2 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Or Book Free Doorstep Home Sample Pickup in {searchQuery || selectedArea}:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DIAGNOSTIC_LABS.slice(0, 2).map((lab) => (
                    <div key={`backup-${lab.id}`} className="p-3 rounded-xl bg-[#F8FCFA] border border-[#D6EDE1] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{lab.name}</div>
                        <div className="text-[11px] text-[#059669] font-medium">{lab.homeCollectionBadge}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(lab)}
                        className="px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold cursor-pointer"
                      >
                        Book Pickup
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            filteredLabs.map((lab) => (
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
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenExternalMap(getDirectionsUrl(lab), e)}
                    className="flex-1 min-w-[150px] py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
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
            ))
          )}
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
    </div>
  );
}
