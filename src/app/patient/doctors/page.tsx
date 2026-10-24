"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  Award,
  Stethoscope,
  Filter,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Baby,
  Activity,
  Heart,
  Bone,
  Brain,
  Users,
  Wind,
  X,
  CreditCard,
  QrCode,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { GooglePayCheckoutModal } from "@/components/payment/GooglePayCheckoutModal";

interface SlotItem {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  period?: "MORNING" | "AFTERNOON" | "EVENING";
}

interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  designation: string;
  experience: number;
  consultationFee: number;
  upiId?: string;
  clinicInfo: string;
  visitingHospitals: string;
  licenseNumber?: string;
  bio?: string;
  area: string;
  city: string;
  rating: number;
  reviewsCount: number;
  availableSlotsCount: number;
  todaySlotsCount: number;
  tomorrowSlotsCount: number;
  nextAvailableSlot: string | null;
  availableDates: string[];
  slots: SlotItem[];
}

interface ExtractedSlotDate {
  dateStr: string;
  dateFormatted: string;
  isToday: boolean;
  isTomorrow: boolean;
  totalSlots: number;
  morning: SlotItem[];
  afternoon: SlotItem[];
  evening: SlotItem[];
}

const SPECIALTIES = [
  { key: "ALL", label: "All Specialists", icon: Stethoscope },
  { key: "gp", label: "General Physician (GP)", icon: Stethoscope },
  { key: "pediatrician", label: "Pediatrician", icon: Baby },
  { key: "diabetologist", label: "Diabetologist", icon: Activity },
  { key: "cardiologist", label: "Cardiologist", icon: Heart },
  { key: "dermatologist", label: "Dermatologist", icon: Sparkles },
  { key: "orthopedic", label: "Orthopedic", icon: Bone },
  { key: "neurologist", label: "Neurologist", icon: Brain },
  { key: "gynecologist", label: "Gynecologist", icon: Users },
  { key: "pulmonologist", label: "Pulmonologist", icon: Wind },
];

export default function PatientDoctorsDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedAvailability, setSelectedAvailability] = useState("ALL");
  const [sortBy, setSortBy] = useState<"slots" | "experience" | "fee_asc" | "fee_desc" | "rating" | "name">("slots");
  const [maxFee, setMaxFee] = useState<string>("ALL");

  // Data states
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Slot Extraction Drawer / Modal
  const [selectedDoctorForSlots, setSelectedDoctorForSlots] = useState<Doctor | null>(null);
  const [extractingSlots, setExtractingSlots] = useState(false);
  const [extractedDates, setExtractedDates] = useState<ExtractedSlotDate[]>([]);
  const [selectedDateTab, setSelectedDateTab] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [lastExtractedAt, setLastExtractedAt] = useState<string | null>(null);

  // Booking & Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    appointmentId: string;
    doctorName: string;
    doctorSpecialty: string;
    dateFormatted: string;
    timeFormatted: string;
    transactionId?: string;
    paymentMethod?: string;
    amount?: number;
  } | null>(null);

  // Initialize from URL search parameters if any
  useEffect(() => {
    const spec = searchParams.get("specialty") || searchParams.get("specialization");
    if (spec) setSelectedSpecialty(spec);
    const area = searchParams.get("area");
    if (area) setSelectedArea(area);
    const q = searchParams.get("q") || searchParams.get("search");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch doctors list
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedSpecialty !== "ALL") params.set("specialization", selectedSpecialty);
      if (selectedArea !== "ALL") params.set("area", selectedArea);
      if (selectedCity !== "ALL") params.set("city", selectedCity);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (sortBy) params.set("sortBy", sortBy);
      if (selectedAvailability !== "ALL") params.set("date", selectedAvailability);
      if (maxFee !== "ALL") params.set("maxFee", maxFee);

      const res = await fetch(`/api/patient/doctors?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load doctors");

      setDoctors(data.doctors || []);
      if (data.filters?.areas) setAvailableAreas(data.filters.areas);
      if (data.filters?.cities) setAvailableCities(data.filters.cities);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, selectedArea, selectedCity, selectedAvailability, sortBy, maxFee]);

  // Handle live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Extract slots for a specific doctor
  const handleOpenSlots = async (doc: Doctor, preSelectSlot?: SlotItem) => {
    setSelectedDoctorForSlots(doc);
    setSelectedSlot(preSelectSlot || null);
    setExtractingSlots(true);
    setBookingError(null);

    try {
      const res = await fetch(`/api/patient/doctors/${doc.id}/slots`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to extract slots");

      setExtractedDates(data.dates || []);
      setLastExtractedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

      if (data.dates && data.dates.length > 0) {
        // If a pre-selected slot was passed, select its date tab
        if (preSelectSlot) {
          const slotDateStr = preSelectSlot.startTime.split("T")[0];
          const matchingDate = data.dates.find((d: ExtractedSlotDate) => d.dateStr === slotDateStr);
          if (matchingDate) {
            setSelectedDateTab(matchingDate.dateStr);
          } else {
            setSelectedDateTab(data.dates[0].dateStr);
          }
        } else {
          setSelectedDateTab(data.dates[0].dateStr);
        }
      } else {
        setSelectedDateTab("");
      }
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Error extracting slots");
    } finally {
      setExtractingSlots(false);
    }
  };

  // Re-extract slots with live animation
  const handleReExtractSlots = async () => {
    if (!selectedDoctorForSlots) return;
    setExtractingSlots(true);
    try {
      const res = await fetch(`/api/patient/doctors/${selectedDoctorForSlots.id}/slots`);
      const data = await res.json();
      if (res.ok) {
        setExtractedDates(data.dates || []);
        setLastExtractedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch {
      // ignore
    } finally {
      setTimeout(() => setExtractingSlots(false), 400);
    }
  };

  // Proceed to payment & booking
  const handleConfirmBooking = async (paymentDetails: {
    paymentMethod: string;
    transactionId: string;
    amount: number;
  }) => {
    if (!selectedSlot || !selectedDoctorForSlots) return;
    setShowPaymentModal(false);
    setIsBooking(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          doctorId: selectedDoctorForSlots.id,
          paymentMethod: paymentDetails.paymentMethod,
          transactionId: paymentDetails.transactionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "That slot was just booked or is unavailable. Please select another slot.");
      }

      setConfirmedAppointment({
        appointmentId: data.appointment.id,
        doctorName: selectedDoctorForSlots.name,
        doctorSpecialty: selectedDoctorForSlots.specialization,
        dateFormatted: new Date(selectedSlot.startTime).toLocaleDateString("en-IN", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        timeFormatted: new Date(selectedSlot.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        transactionId: paymentDetails.transactionId,
        paymentMethod: paymentDetails.paymentMethod,
        amount: paymentDetails.amount,
      });

      // Close the slot drawer
      setSelectedDoctorForSlots(null);
      setSelectedSlot(null);

      // Refresh doctor directory
      fetchDoctors();
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking could not be completed");
    } finally {
      setIsBooking(false);
    }
  };

  // Active date object for currently selected tab
  const activeDateGroup = useMemo(() => {
    return extractedDates.find((d) => d.dateStr === selectedDateTab) || extractedDates[0];
  }, [extractedDates, selectedDateTab]);

  // Render Post-Booking Confirmation Modal / Screen
  if (confirmedAppointment) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-3xl border border-emerald-300 bg-white p-8 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
              Payment & Slot Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 pt-2 tracking-tight">
              Appointment Scheduled Successfully!
            </h1>
            <p className="text-sm text-slate-600">
              Your consultation with <strong>{confirmedAppointment.doctorName}</strong> ({confirmedAppointment.doctorSpecialty}) is scheduled for{" "}
              <strong>{confirmedAppointment.dateFormatted}</strong> at{" "}
              <strong>{confirmedAppointment.timeFormatted}</strong>.
            </p>
          </div>

          {/* Receipt card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Receipt className="w-4 h-4 text-sky-600" />
                <span>Consultation Receipt</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                SETTLED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block">Transaction Reference:</span>
                <span className="font-mono font-bold text-slate-900">
                  {confirmedAppointment.transactionId || "UPI-GPAY-7729103"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Fee Settled:</span>
                <span className="font-extrabold text-emerald-700 text-xs">
                  ₹{confirmedAppointment.amount || 800} (INR)
                </span>
              </div>
            </div>
          </div>

          {/* CodeRx AI Pre-Patient Intake Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50 border-2 border-sky-300 text-left space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-sky-950 font-black text-base">
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
              <span>Fill Pre-Visit Intake Questionnaire</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Completing these intake questions now allows {confirmedAppointment.doctorName} to review your clinical timeline and longitudinal report before your consultation begins.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/patient/appointments/${confirmedAppointment.appointmentId}/intake`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition-all active:scale-95"
              >
                <span>Answer Questions Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/patient/appointments"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors"
              >
                Go to My Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find & Book a Doctor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-300">
              Live Directory
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Book consultations across Pediatricians, General Physicians, Diabetologists, Cardiologists & more. Filter by specialty & area, then extract live available slots instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/patient/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition-all"
          >
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>My Appointments</span>
          </Link>
          <button
            onClick={() => fetchDoctors()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-300 shadow-2xs transition-all"
            title="Refresh Doctor Directory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Search & Hero Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name, qualification (MBBS, MD, DM), condition (e.g. fever, diabetes, skin, knee), or hospital..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Specialization Pills Carousel / Scroll */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Specialization & Qualifications
            </span>
            {selectedSpecialty !== "ALL" && (
              <button
                onClick={() => setSelectedSpecialty("ALL")}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
              >
                Clear Specialty Filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {SPECIALTIES.map((spec) => {
              const Icon = spec.icon;
              const isSelected = selectedSpecialty.toLowerCase() === spec.key.toLowerCase();
              return (
                <button
                  key={spec.key}
                  onClick={() => setSelectedSpecialty(spec.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-xs scale-102"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                  <span>{spec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter & Sort Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Area Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Area / Locality
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Areas</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">Any Time</option>
              <option value="TODAY">Available Today</option>
              <option value="TOMORROW">Available Tomorrow</option>
              <option value="WEEK">Within Next 7 Days</option>
            </select>
          </div>

          {/* Fee Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Consultation Fee
            </label>
            <select
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">Any Fee</option>
              <option value="700">Up to ₹700</option>
              <option value="900">Up to ₹900</option>
              <option value="1200">Up to ₹1200</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-sky-600" />
              <span>Sort By</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="slots">⚡ Earliest Available Slot</option>
              <option value="experience">🎓 Experience (High to Low)</option>
              <option value="fee_asc">💰 Fee (Low to High)</option>
              <option value="fee_desc">💎 Fee (High to Low)</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="name">🔤 Doctor Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary Pills */}
        {(selectedSpecialty !== "ALL" || selectedArea !== "ALL" || selectedCity !== "ALL" || selectedAvailability !== "ALL" || maxFee !== "ALL" || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap pt-2 text-xs">
            <span className="text-slate-400 font-semibold">Active:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800">
                "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-sky-950" onClick={() => setSearchQuery("")} />
              </span>
            )}
            {selectedSpecialty !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800">
                Specialty: {selectedSpecialty}
                <X className="w-3 h-3 cursor-pointer hover:text-teal-950" onClick={() => setSelectedSpecialty("ALL")} />
              </span>
            )}
            {selectedArea !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800">
                Area: {selectedArea}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-950" onClick={() => setSelectedArea("ALL")} />
              </span>
            )}
            {selectedCity !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800">
                City: {selectedCity}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-950" onClick={() => setSelectedCity("ALL")} />
              </span>
            )}
            {selectedAvailability !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
                {selectedAvailability === "TODAY" ? "Today" : selectedAvailability === "TOMORROW" ? "Tomorrow" : "This Week"}
                <X className="w-3 h-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedAvailability("ALL")} />
              </span>
            )}
            {maxFee !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800">
                ≤ ₹{maxFee}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-950" onClick={() => setMaxFee("ALL")} />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedSpecialty("ALL");
                setSelectedArea("ALL");
                setSelectedCity("ALL");
                setSelectedAvailability("ALL");
                setMaxFee("ALL");
                setSearchQuery("");
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-1"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{doctors.length}</strong> qualified doctors with live booking slots
        </span>
        <span className="hidden sm:inline">
          Instant slot confirmation with CodeRx Pre-Visit AI Engine
        </span>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner label="Extracting qualified doctors and organizing clinic slots..." size="lg" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm">
          {error}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No doctors match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your specialty, area, or fee filter to see available doctors in other locations.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSpecialty("ALL");
              setSelectedArea("ALL");
              setSelectedCity("ALL");
              setSelectedAvailability("ALL");
              setMaxFee("ALL");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {doctors.map((doc) => {
            const nextSlotFormatted = doc.nextAvailableSlot
              ? new Date(doc.nextAvailableSlot).toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null;

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-300/90 hover:border-sky-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Doctor Header Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Avatar with Status Dot */}
                      <div className="relative shrink-0">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {doc.name
                            .split(" ")
                            .filter((_, i) => i > 0)
                            .map((n) => n[0])
                            .join("") || doc.name.slice(0, 2)}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            doc.availableSlotsCount > 0 ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                          title={doc.availableSlotsCount > 0 ? "Taking Appointments" : "No open slots"}
                        />
                      </div>

                      {/* Doctor Name, Qualification & Designation */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {doc.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            <ShieldCheck className="w-3 h-3 text-sky-600" />
                            Verified
                          </span>
                        </div>
                        <p className="text-xs font-bold text-teal-700 mt-0.5">
                          {doc.specialization}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                          {doc.qualification}
                        </p>
                      </div>
                    </div>

                    {/* Consultation Fee */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Fee
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{doc.consultationFee}
                      </span>
                    </div>
                  </div>

                  {/* Rating, Experience & Area Tags */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-1 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {doc.rating.toFixed(1)}
                      <span className="font-normal text-slate-500 text-[10px]">
                        ({doc.reviewsCount})
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <Award className="w-3.5 h-3.5 text-sky-600" />
                      {doc.experience} Yrs Experience
                    </span>

                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {doc.area}
                    </span>
                  </div>

                  {/* Clinic and Visiting Hospital */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                    <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{doc.clinicInfo}</span>
                    </div>
                    {doc.visitingHospitals && (
                      <div className="text-slate-500 text-[10px] pl-5">
                        <span className="font-semibold text-slate-600">Visiting: </span>
                        {doc.visitingHospitals}
                      </div>
                    )}
                  </div>

                  {/* Slot Highlights & Extraction Preview */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {doc.todaySlotsCount > 0 ? (
                          <span className="text-emerald-700">
                            {doc.todaySlotsCount} slots available today
                          </span>
                        ) : doc.tomorrowSlotsCount > 0 ? (
                          <span className="text-sky-700">
                            Available tomorrow ({doc.tomorrowSlotsCount} slots)
                          </span>
                        ) : nextSlotFormatted ? (
                          <span className="text-slate-700">
                            Next available: {nextSlotFormatted}
                          </span>
                        ) : (
                          <span className="text-slate-400">Slots on request</span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {doc.availableSlotsCount} Total Slots
                      </span>
                    </div>

                    {/* Quick Slot Pills (clickable for fast selection) */}
                    {doc.slots.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {doc.slots.slice(0, 4).map((slot) => {
                          const timeStr = new Date(slot.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const isToday =
                            new Date(slot.startTime).toDateString() === new Date().toDateString();

                          return (
                            <button
                              key={slot.id}
                              onClick={() => handleOpenSlots(doc, slot)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300 transition-colors shrink-0"
                              title={`Book ${timeStr} (${isToday ? "Today" : "Upcoming"})`}
                            >
                              {timeStr}
                              {isToday && (
                                <span className="ml-1 text-[9px] text-emerald-600 font-bold">
                                  Today
                                </span>
                              )}
                            </button>
                          );
                        })}
                        {doc.slots.length > 4 && (
                          <button
                            onClick={() => handleOpenSlots(doc)}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors shrink-0"
                          >
                            +{doc.slots.length - 4} more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenSlots(doc)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Extract Available Slots</span>
                  </button>

                  <button
                    onClick={() => handleOpenSlots(doc, doc.slots[0])}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Book Appointment</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SLOT EXTRACTION & BOOKING CONSOLE DRAWER / MODAL */}
      {selectedDoctorForSlots && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white flex items-start justify-between relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xl text-white">
                  {selectedDoctorForSlots.name
                    .split(" ")
                    .filter((_, i) => i > 0)
                    .map((n) => n[0])
                    .join("") || "DR"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {selectedDoctorForSlots.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                      {selectedDoctorForSlots.specialization}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedDoctorForSlots.qualification}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {selectedDoctorForSlots.clinicInfo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDoctorForSlots(null);
                  setSelectedSlot(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Slot Extraction Toolbar */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Live Available Slots</span>
                {lastExtractedAt && (
                  <span className="text-[10px] font-normal text-slate-500">
                    (Updated {lastExtractedAt})
                  </span>
                )}
              </div>

              <button
                onClick={handleReExtractSlots}
                disabled={extractingSlots}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${extractingSlots ? "animate-spin text-sky-600" : ""}`} />
                <span>{extractingSlots ? "Extracting..." : "Re-Extract"}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {bookingError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{bookingError}</span>
                </div>
              )}

              {extractingSlots && extractedDates.length === 0 ? (
                <div className="py-12">
                  <LoadingSpinner label="Extracting slots from hospital scheduler..." size="md" />
                </div>
              ) : extractedDates.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-slate-50 border border-dashed border-slate-300 p-6 text-slate-500 text-xs">
                  No upcoming slots found for this doctor right now.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Date Tabs */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      1. Select Consultation Date:
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
                      {extractedDates.map((dateObj) => {
                        const isSelected = selectedDateTab === dateObj.dateStr;
                        return (
                          <button
                            key={dateObj.dateStr}
                            onClick={() => {
                              setSelectedDateTab(dateObj.dateStr);
                              setSelectedSlot(null);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold text-center shrink-0 border transition-all ${
                              isSelected
                                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span className="block font-bold">
                              {dateObj.isToday ? "Today" : dateObj.isTomorrow ? "Tomorrow" : dateObj.dateFormatted.split(",")[0]}
                            </span>
                            <span className="block text-[10px] opacity-80">
                              {dateObj.dateFormatted.split(",")[1] || dateObj.dateFormatted}
                            </span>
                            <span
                              className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {dateObj.totalSlots} slots
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slot Periods: Morning, Afternoon, Evening */}
                  {activeDateGroup && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>2. Select Preferred Time Slot:</span>
                        <span className="text-slate-500 font-normal">
                          {activeDateGroup.dateFormatted} • {activeDateGroup.totalSlots} available
                        </span>
                      </div>

                      {/* Morning Slots */}
                      {activeDateGroup.morning.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                            🌅 Morning Slots (09:00 AM – 12:00 PM)
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {activeDateGroup.morning.map((slot) => {
                              const isSelected = selectedSlot?.id === slot.id;
                              const timeStr = new Date(slot.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                                    isSelected
                                      ? "bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-102"
                                      : "bg-white text-slate-800 border-slate-300 hover:border-sky-300 hover:bg-sky-50/50"
                                  }`}
                                >
                                  {timeStr}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Afternoon Slots */}
                      {activeDateGroup.afternoon.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                            ☀️ Afternoon Slots (12:00 PM – 04:00 PM)
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {activeDateGroup.afternoon.map((slot) => {
                              const isSelected = selectedSlot?.id === slot.id;
                              const timeStr = new Date(slot.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                                    isSelected
                                      ? "bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-102"
                                      : "bg-white text-slate-800 border-slate-300 hover:border-sky-300 hover:bg-sky-50/50"
                                  }`}
                                >
                                  {timeStr}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Evening Slots */}
                      {activeDateGroup.evening.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                            🌆 Evening Slots (04:00 PM – 08:00 PM)
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {activeDateGroup.evening.map((slot) => {
                              const isSelected = selectedSlot?.id === slot.id;
                              const timeStr = new Date(slot.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                                    isSelected
                                      ? "bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-102"
                                      : "bg-white text-slate-800 border-slate-300 hover:border-sky-300 hover:bg-sky-50/50"
                                  }`}
                                >
                                  {timeStr}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary & Fee Details */}
                  {selectedSlot && (
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-sky-950">
                        <span>Consultation Summary:</span>
                        <span className="text-emerald-700 font-extrabold text-sm">
                          ₹{selectedDoctorForSlots.consultationFee} INR
                        </span>
                      </div>
                      <div className="text-slate-600 space-y-1 text-[11px]">
                        <div>
                          <strong>Date:</strong> {activeDateGroup?.dateFormatted}
                        </div>
                        <div>
                          <strong>Time:</strong>{" "}
                          {new Date(selectedSlot.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          (30 mins consultation)
                        </div>
                        <div>
                          <strong>Venue:</strong> {selectedDoctorForSlots.clinicInfo}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedDoctorForSlots(null);
                  setSelectedSlot(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={!selectedSlot || isBooking}
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <span>Scheduling...</span>
                ) : (
                  <>
                    <span>Proceed to Book (₹{selectedDoctorForSlots.consultationFee})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Pay / Payment Checkout Modal */}
      {showPaymentModal && selectedDoctorForSlots && selectedSlot && (
        <GooglePayCheckoutModal
          doctorName={selectedDoctorForSlots.name}
          specialization={selectedDoctorForSlots.specialization}
          consultationFee={selectedDoctorForSlots.consultationFee}
          doctorUpiId={selectedDoctorForSlots.upiId}
          slotDateTimeFormatted={`${new Date(selectedSlot.startTime).toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })} at ${new Date(selectedSlot.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
          slotDuration={selectedSlot.duration || 30}
          onSuccess={handleConfirmBooking}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
