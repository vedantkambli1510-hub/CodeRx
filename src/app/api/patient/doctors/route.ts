import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getDoctorUpiVpa } from "@/lib/payment/upi";

export const dynamic = "force-dynamic";

// Rich demonstration doctors registry to showcase full clinical diversity
const DEMO_DOCTORS_BASE = [
  {
    id: "doc-demo-aarav",
    userId: "usr-demo-aarav",
    name: "Dr. Aarav Mehta",
    email: "aarav.mehta@coderx.health",
    specialization: "Internal Medicine & Diabetology",
    qualification: "MBBS, MD (Medicine), DM (Endocrinology) AIIMS New Delhi",
    designation: "Director & Senior Consultant",
    experience: 14,
    consultationFee: 800,
    clinicInfo: "CodeRx Advanced Health Hub, Floor 4, Cyber City Medical Center",
    visitingHospitals: "Max Super Speciality Hospital, Apollo Indraprastha",
    area: "Cyber City, Gurugram",
    city: "Delhi NCR",
    rating: 4.9,
    reviewsCount: 184,
    licenseNumber: "MCI/2018/98421",
    bio: "Renowned diabetologist & internal medicine consultant specializing in renal-sparing protocols, CGM insulin dynamics, and complex metabolic syndrome.",
  },
  {
    id: "doc-demo-neha",
    userId: "usr-demo-neha",
    name: "Dr. Neha Kapoor",
    email: "neha.kapoor@coderx.health",
    specialization: "Pediatrician (Child Specialist)",
    qualification: "MBBS, MD (Pediatrics, KEM Mumbai), DCH",
    designation: "Senior Pediatric Consultant",
    experience: 12,
    consultationFee: 700,
    clinicInfo: "Little Wonders Child Health Pavilion, Hill Road",
    visitingHospitals: "Lilavati Hospital, Surya Child Care Hospital",
    area: "Bandra West, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewsCount: 210,
    licenseNumber: "MMC/2012/04581",
    bio: "Gold medalist pediatrician focusing on infant immunity, asthma in children, newborn nutritional guidance, and pediatric developmental milestones.",
  },
  {
    id: "doc-demo-rohan",
    userId: "usr-demo-rohan",
    name: "Dr. Rohan Deshmukh",
    email: "rohan.deshmukh@coderx.health",
    specialization: "Cardiologist (Heart Specialist)",
    qualification: "MBBS, MD (Medicine), DM (Cardiology, AIIMS New Delhi)",
    designation: "Chief Interventional Cardiologist",
    experience: 16,
    consultationFee: 1200,
    clinicInfo: "Apex Heart & Vascular Institute, 100 Ft Road",
    visitingHospitals: "Manipal Hospital, Narayana Health Heart City",
    area: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    rating: 4.8,
    reviewsCount: 145,
    licenseNumber: "KMC/2008/11290",
    bio: "Senior interventional cardiologist with 16+ years experience in preventive coronary care, early plaque detection, hypertension management, and Doppler ECG.",
  },
  {
    id: "doc-demo-sunita",
    userId: "usr-demo-sunita",
    name: "Dr. Sunita Rao",
    email: "sunita.rao@coderx.health",
    specialization: "Dermatologist (Skin & Hair)",
    qualification: "MBBS, MD (DVL, PGIMER Chandigarh)",
    designation: "Senior Consultant Dermatologist & Trichologist",
    experience: 11,
    consultationFee: 900,
    clinicInfo: "Aura Skin & Hair Specialty Clinic, Community Centre",
    visitingHospitals: "Max Smart Super Speciality Hospital Saket",
    area: "Saket, South Delhi",
    city: "Delhi NCR",
    rating: 5.0,
    reviewsCount: 278,
    licenseNumber: "DMC/2013/88219",
    bio: "Board-certified clinical dermatologist with international fellowships in laser medicine, chronic eczema, refractory acne therapy, and scalp health.",
  },
  {
    id: "doc-demo-vikram",
    userId: "usr-demo-vikram",
    name: "Dr. Vikram Singhania",
    email: "vikram.singhania@coderx.health",
    specialization: "Orthopedic Surgeon (Bones & Joints)",
    qualification: "MBBS, MS (Orthopedics, CMC Vellore), M.Ch (UK)",
    designation: "Head of Joint Reconstruction & Trauma",
    experience: 15,
    consultationFee: 1000,
    clinicInfo: "CodeRx Ortho Pavilion, DLF Cyber City Phase 2",
    visitingHospitals: "Fortis Memorial Research Institute, Artemis Hospital",
    area: "Cyber City, Gurugram",
    city: "Delhi NCR",
    rating: 4.8,
    reviewsCount: 162,
    licenseNumber: "MCI/2009/44120",
    bio: "Pioneer in robotic knee arthroplasty, meniscus restoration, sports ligament reconstructions, and minimally invasive bone trauma surgery.",
  },
  {
    id: "doc-demo-ananya",
    userId: "usr-demo-ananya",
    name: "Dr. Ananya Sen",
    email: "ananya.sen@coderx.health",
    specialization: "Neurologist (Brain & Nerve)",
    qualification: "MBBS, MD (General Medicine), DM (Neurology, NIMHANS)",
    designation: "Senior Consultant Neurologist",
    experience: 13,
    consultationFee: 1100,
    clinicInfo: "NeuroHealth Brain & Spine Center, HAL 2nd Stage",
    visitingHospitals: "Manipal Hospital Old Airport Road, Aster CMI",
    area: "Old Airport Road, Bengaluru",
    city: "Bengaluru",
    rating: 4.9,
    reviewsCount: 193,
    licenseNumber: "KMC/2011/76211",
    bio: "Renowned neurologist specializing in chronic migraine management, stroke recovery, neuropathy, vertigo diagnostics, and epilepsy management.",
  },
  {
    id: "doc-demo-rajesh",
    userId: "usr-demo-rajesh",
    name: "Dr. Rajesh Kulkarni",
    email: "rajesh.kulkarni@coderx.health",
    specialization: "General Physician (GP & Family Medicine)",
    qualification: "MBBS, MRCGP (London), DNB (Family Medicine)",
    designation: "Senior Family Care Physician",
    experience: 18,
    consultationFee: 600,
    clinicInfo: "CareRx Neighborhood Primary Clinic, Sector 44",
    visitingHospitals: "Artemis Hospital Gurugram, Paras Hospital",
    area: "Sector 44, Gurugram",
    city: "Delhi NCR",
    rating: 4.9,
    reviewsCount: 156,
    licenseNumber: "MCI/2006/19442",
    bio: "Empathetic family doctor providing comprehensive primary care, seasonal fever triage, adult vaccinations, and long-term preventive health checkups.",
  },
  {
    id: "doc-demo-meera",
    userId: "usr-demo-meera",
    name: "Dr. Meera Nambiar",
    email: "meera.nambiar@coderx.health",
    specialization: "Gynecologist & Obstetrician (Women's Health)",
    qualification: "MBBS, MS (OBG, Grant Medical College), DNB",
    designation: "Senior Obstetrician & Gynecologist",
    experience: 14,
    consultationFee: 850,
    clinicInfo: "Matrika Women's Health & Wellness Suite, Opera House",
    visitingHospitals: "Sir H.N. Reliance Foundation Hospital, Saifee Hospital",
    area: "Girgaon, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewsCount: 224,
    licenseNumber: "MMC/2010/33890",
    bio: "Specialist in holistic PCOS/PCOD reversal, high-risk pregnancy management, hormonal rebalancing, and compassionate adolescent gynecological care.",
  },
  {
    id: "doc-demo-tariq",
    userId: "usr-demo-tariq",
    name: "Dr. Tariq Alvi",
    email: "tariq.alvi@coderx.health",
    specialization: "Pulmonologist (Lungs & Chest)",
    qualification: "MBBS, MD (Respiratory Medicine, VMMC Safdarjung)",
    designation: "Consultant Pulmonologist & Sleep Specialist",
    experience: 12,
    consultationFee: 750,
    clinicInfo: "BreatheEasy Chest & Sleep Care, Press Enclave Road",
    visitingHospitals: "Max Super Speciality Hospital Saket",
    area: "Saket, South Delhi",
    city: "Delhi NCR",
    rating: 4.8,
    reviewsCount: 138,
    licenseNumber: "DMC/2012/66540",
    bio: "Clinical expert in adult bronchial asthma, chronic post-viral cough, environmental allergies, COPD management, and sleep apnea polysomnography.",
  },
  {
    id: "doc-demo-priya",
    userId: "usr-demo-priya",
    name: "Dr. Priya Malhotra",
    email: "priya.malhotra@coderx.health",
    specialization: "Pediatrician (Child Specialist)",
    qualification: "MBBS, DNB (Pediatrics), Fellowship in Neonatology",
    designation: "Consultant Neonatologist & Pediatrician",
    experience: 9,
    consultationFee: 650,
    clinicInfo: "Child First Pediatric Hub, Near Subhash Chowk",
    visitingHospitals: "Medanta - The Medicity, Cloudnine Hospital",
    area: "Sector 38, Gurugram",
    city: "Delhi NCR",
    rating: 4.8,
    reviewsCount: 112,
    licenseNumber: "HN/2015/09841",
    bio: "Gentle child specialist dedicated to infant developmental screenings, childhood allergy assessments, vaccination regimens, and growth tracking.",
  },
  {
    id: "doc-demo-alok",
    userId: "usr-demo-alok",
    name: "Dr. Alok Verma",
    email: "alok.verma@coderx.health",
    specialization: "Diabetologist & Endocrinologist",
    qualification: "MBBS, MD (Medicine), PG Dip. Diabetes (Boston)",
    designation: "Consultant Diabetologist & Metabolic Physician",
    experience: 15,
    consultationFee: 800,
    clinicInfo: "Metabolic Care Center, Turner Road",
    visitingHospitals: "Hinduja Healthcare Surgical, Holy Family Hospital",
    area: "Bandra West, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewsCount: 175,
    licenseNumber: "MMC/2009/88142",
    bio: "Specializing in early-onset Type 2 Diabetes, insulin pump optimization, continuous glucose monitoring (CGM), and diabetic peripheral neuropathy.",
  },
  {
    id: "doc-demo-siddharth",
    userId: "usr-demo-siddharth",
    name: "Dr. Siddharth Joshi",
    email: "siddharth.joshi@coderx.health",
    specialization: "Orthopedic Surgeon (Sports Medicine)",
    qualification: "MBBS, DNB (Orthopedics, Lilavati), Fellowship in Arthroscopy",
    designation: "Senior Sports Orthopedic Surgeon",
    experience: 14,
    consultationFee: 950,
    clinicInfo: "Elite Motion Ortho Clinic, CMH Road",
    visitingHospitals: "Manipal Hospital, Cloudnine Hospital",
    area: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    rating: 4.8,
    reviewsCount: 130,
    licenseNumber: "KMC/2010/55490",
    bio: "Specialist in knee ligament tears (ACL/PCL reconstruction), rotator cuff repairs, runner's knee, and active lifestyle joint preservation.",
  },
];

// Helper to generate realistic available slots across next 5 days
function generateDemoDoctorSlots(docId: string, now: Date) {
  const slots: any[] = [];
  
  for (let dayOffset = 0; dayOffset <= 4; dayOffset++) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + dayOffset);

    // Morning slot: 10:30 AM
    const m = new Date(targetDate);
    m.setHours(10, 30, 0, 0);
    if (m > now) {
      const endM = new Date(m);
      endM.setMinutes(endM.getMinutes() + 20);
      slots.push({
        id: `slot-demo-${docId}-d${dayOffset}-1`,
        startTime: m.toISOString(),
        endTime: endM.toISOString(),
        duration: 20,
        period: "MORNING" as const,
      });
    }

    // Afternoon slot: 02:30 PM
    const a = new Date(targetDate);
    a.setHours(14, 30, 0, 0);
    if (a > now) {
      const endA = new Date(a);
      endA.setMinutes(endA.getMinutes() + 20);
      slots.push({
        id: `slot-demo-${docId}-d${dayOffset}-2`,
        startTime: a.toISOString(),
        endTime: endA.toISOString(),
        duration: 20,
        period: "AFTERNOON" as const,
      });
    }

    // Evening slot: 05:00 PM
    const e = new Date(targetDate);
    e.setHours(17, 0, 0, 0);
    if (e > now) {
      const endE = new Date(e);
      endE.setMinutes(endE.getMinutes() + 20);
      slots.push({
        id: `slot-demo-${docId}-d${dayOffset}-3`,
        startTime: e.toISOString(),
        endTime: endE.toISOString(),
        duration: 20,
        period: "EVENING" as const,
      });
    }
  }

  return slots;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get("specialization")?.trim() || "";
    const area = searchParams.get("area")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const search = searchParams.get("search")?.trim() || searchParams.get("q")?.trim() || "";
    const sortBy = searchParams.get("sortBy")?.trim() || "slots";
    const maxFee = searchParams.get("maxFee") ? parseInt(searchParams.get("maxFee")!, 10) : null;
    const dateFilter = searchParams.get("date")?.trim() || "ALL";

    const now = new Date();

    // Fetch active doctors from database
    let dbDoctors: any[] = [];
    try {
      dbDoctors = await prisma.doctorProfile.findMany({
        where: {
          slots: {
            some: {
              status: "AVAILABLE",
              startTime: { gte: now },
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          slots: {
            where: {
              status: "AVAILABLE",
              startTime: { gte: now },
            },
            orderBy: { startTime: "asc" },
          },
        },
      });
    } catch {
      dbDoctors = [];
    }

    // Build complete demo list populated with dynamic slots
    const demoPopulatedList = DEMO_DOCTORS_BASE.map((demoDoc) => {
      // Check if this doctor matches a real DB doctor by name (e.g. Dr. Aarav Mehta)
      const matchingDb = dbDoctors.find(
        (d) => d.user?.name?.toLowerCase() === demoDoc.name.toLowerCase()
      );

      let availableSlots: any[] = [];
      if (matchingDb && matchingDb.slots && matchingDb.slots.length > 0) {
        availableSlots = matchingDb.slots.map((s: any) => {
          const sTime = new Date(s.startTime);
          const hour = sTime.getHours();
          let period: "MORNING" | "AFTERNOON" | "EVENING" = "MORNING";
          if (hour >= 12 && hour < 16) period = "AFTERNOON";
          else if (hour >= 16) period = "EVENING";

          return {
            id: s.id,
            startTime: s.startTime instanceof Date ? s.startTime.toISOString() : s.startTime,
            endTime: s.endTime instanceof Date ? s.endTime.toISOString() : s.endTime,
            duration: s.duration || 20,
            period,
          };
        });
      }

      // If DB has fewer than 2 slots, supplement with generated demo slots
      if (availableSlots.length < 2) {
        availableSlots = generateDemoDoctorSlots(demoDoc.id, now);
      }

      const uniqueDates = Array.from(
        new Set(availableSlots.map((s) => s.startTime.split("T")[0]))
      );

      const todayDateStr = now.toISOString().split("T")[0];
      const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const tomorrowDateStr = tomorrowDate.toISOString().split("T")[0];

      const todaySlotsCount = availableSlots.filter(
        (s) => s.startTime.split("T")[0] === todayDateStr
      ).length;

      const tomorrowSlotsCount = availableSlots.filter(
        (s) => s.startTime.split("T")[0] === tomorrowDateStr
      ).length;

      const nextAvailableSlot = availableSlots.length > 0 ? availableSlots[0].startTime : null;

      return {
        id: matchingDb?.id || demoDoc.id,
        userId: matchingDb?.user?.id || demoDoc.userId,
        name: matchingDb?.user?.name || demoDoc.name,
        email: matchingDb?.user?.email || demoDoc.email,
        specialization: matchingDb?.specialization || demoDoc.specialization,
        qualification: matchingDb?.qualification || demoDoc.qualification,
        designation: matchingDb?.designation || demoDoc.designation,
        experience: matchingDb?.experience || demoDoc.experience,
        consultationFee: matchingDb?.consultationFee || demoDoc.consultationFee,
        upiId: getDoctorUpiVpa(demoDoc.name),
        clinicInfo: matchingDb?.clinicInfo || demoDoc.clinicInfo,
        visitingHospitals: matchingDb?.visitingHospitals || demoDoc.visitingHospitals,
        licenseNumber: matchingDb?.licenseNumber || demoDoc.licenseNumber,
        bio: matchingDb?.bio || demoDoc.bio,
        area: demoDoc.area,
        city: demoDoc.city,
        rating: demoDoc.rating,
        reviewsCount: demoDoc.reviewsCount,
        availableSlotsCount: availableSlots.length,
        todaySlotsCount,
        tomorrowSlotsCount,
        nextAvailableSlot,
        availableDates: uniqueDates,
        slots: availableSlots,
      };
    });

    let list = demoPopulatedList;

    // 1. Text Search Filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((doc) => {
        const text = `${doc.name} ${doc.specialization} ${doc.qualification} ${doc.clinicInfo} ${doc.visitingHospitals} ${doc.area} ${doc.city} ${doc.bio || ""}`.toLowerCase();
        
        if (text.includes(q)) return true;
        if (q.includes("pediatr") || q.includes("child") || q.includes("baby") || q.includes("kid")) {
          return doc.specialization.toLowerCase().includes("pediatric");
        }
        if (q.includes("gp") || q.includes("physician") || q.includes("fever") || q.includes("cold") || q.includes("general")) {
          return doc.specialization.toLowerCase().includes("general") || doc.designation.toLowerCase().includes("family");
        }
        if (q.includes("diabet") || q.includes("sugar") || q.includes("thyroid") || q.includes("endo")) {
          return doc.specialization.toLowerCase().includes("diabet") || doc.qualification.toLowerCase().includes("endocrin");
        }
        if (q.includes("heart") || q.includes("cardio") || q.includes("ecg") || q.includes("chest pain") || q.includes("bp")) {
          return doc.specialization.toLowerCase().includes("cardio");
        }
        if (q.includes("skin") || q.includes("derma") || q.includes("acne") || q.includes("hair") || q.includes("rash")) {
          return doc.specialization.toLowerCase().includes("derma") || doc.specialization.toLowerCase().includes("skin");
        }
        if (q.includes("ortho") || q.includes("bone") || q.includes("knee") || q.includes("joint") || q.includes("spine")) {
          return doc.specialization.toLowerCase().includes("ortho") || doc.specialization.toLowerCase().includes("bone");
        }
        if (q.includes("neuro") || q.includes("brain") || q.includes("migraine") || q.includes("nerve")) {
          return doc.specialization.toLowerCase().includes("neuro") || doc.specialization.toLowerCase().includes("brain");
        }
        if (q.includes("gynec") || q.includes("women") || q.includes("pcos") || q.includes("pregnancy") || q.includes("pcod")) {
          return doc.specialization.toLowerCase().includes("gynec") || doc.specialization.toLowerCase().includes("obstetric");
        }
        if (q.includes("pulmo") || q.includes("lung") || q.includes("breath") || q.includes("asthma") || q.includes("cough")) {
          return doc.specialization.toLowerCase().includes("pulmon") || doc.specialization.toLowerCase().includes("respiratory");
        }
        return false;
      });
    }

    // 2. Specialization / Qualification Filter
    if (specialization && specialization !== "ALL") {
      const spec = specialization.toLowerCase();
      list = list.filter((doc) => {
        const fullSpec = `${doc.specialization} ${doc.qualification} ${doc.designation}`.toLowerCase();
        if (spec === "pediatrician" || spec === "pediatrics") {
          return fullSpec.includes("pediatric") || fullSpec.includes("child");
        }
        if (spec === "gp" || spec === "general" || spec === "general physician") {
          return fullSpec.includes("general") || fullSpec.includes("family") || fullSpec.includes("mrcgp");
        }
        if (spec === "diabetologist" || spec === "diabetes" || spec === "endocrinologist") {
          return fullSpec.includes("diabet") || fullSpec.includes("endocrin");
        }
        if (spec === "cardiologist" || spec === "cardiology") {
          return fullSpec.includes("cardio");
        }
        if (spec === "dermatologist" || spec === "dermatology") {
          return fullSpec.includes("derma") || fullSpec.includes("skin") || fullSpec.includes("tricholog");
        }
        if (spec === "orthopedic" || spec === "orthopedics") {
          return fullSpec.includes("ortho") || fullSpec.includes("joint") || fullSpec.includes("bone");
        }
        if (spec === "neurologist" || spec === "neurology") {
          return fullSpec.includes("neuro");
        }
        if (spec === "gynecologist" || spec === "gynecology") {
          return fullSpec.includes("gynec") || fullSpec.includes("obstetric");
        }
        if (spec === "pulmonologist" || spec === "pulmonology") {
          return fullSpec.includes("pulmon") || fullSpec.includes("chest") || fullSpec.includes("respiratory");
        }
        return fullSpec.includes(spec);
      });
    }

    // 3. Area / Locality Filter
    if (area && area !== "ALL") {
      const a = area.toLowerCase();
      list = list.filter(
        (doc) =>
          doc.area.toLowerCase().includes(a) ||
          doc.clinicInfo.toLowerCase().includes(a) ||
          doc.visitingHospitals.toLowerCase().includes(a)
      );
    }

    // 4. City Filter
    if (city && city !== "ALL") {
      const c = city.toLowerCase();
      list = list.filter((doc) => doc.city.toLowerCase().includes(c));
    }

    // 5. Max Fee Filter
    if (maxFee) {
      list = list.filter((doc) => doc.consultationFee <= maxFee);
    }

    // 6. Date / Availability Filter
    if (dateFilter === "TODAY") {
      list = list.filter((doc) => doc.todaySlotsCount > 0);
    } else if (dateFilter === "TOMORROW") {
      list = list.filter((doc) => doc.tomorrowSlotsCount > 0);
    } else if (dateFilter === "WEEK") {
      list = list.filter((doc) => doc.availableSlotsCount > 0);
    }

    // 7. Sorting
    list.sort((a, b) => {
      if (sortBy === "experience") {
        return b.experience - a.experience;
      }
      if (sortBy === "fee_asc") {
        return a.consultationFee - b.consultationFee;
      }
      if (sortBy === "fee_desc") {
        return b.consultationFee - a.consultationFee;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (a.nextAvailableSlot && b.nextAvailableSlot) {
        return new Date(a.nextAvailableSlot).getTime() - new Date(b.nextAvailableSlot).getTime();
      }
      if (a.nextAvailableSlot) return -1;
      if (b.nextAvailableSlot) return 1;
      return b.availableSlotsCount - a.availableSlotsCount;
    });

    const allAreas = Array.from(new Set(DEMO_DOCTORS_BASE.map((d) => d.area)));
    const allCities = ["All Cities", "Delhi NCR", "Mumbai", "Bengaluru"];

    return NextResponse.json({
      success: true,
      totalCount: list.length,
      doctors: list,
      filters: {
        areas: allAreas,
        cities: allCities,
        specializations: [
          { key: "ALL", label: "All Specialists" },
          { key: "gp", label: "General Physician (GP)", icon: "Stethoscope" },
          { key: "pediatrician", label: "Pediatrician", icon: "Baby" },
          { key: "diabetologist", label: "Diabetologist", icon: "Activity" },
          { key: "cardiologist", label: "Cardiologist", icon: "Heart" },
          { key: "dermatologist", label: "Dermatologist", icon: "Sparkles" },
          { key: "orthopedic", label: "Orthopedic", icon: "Bone" },
          { key: "neurologist", label: "Neurologist", icon: "Brain" },
          { key: "gynecologist", label: "Gynecologist", icon: "Users" },
          { key: "pulmonologist", label: "Pulmonologist", icon: "Wind" },
        ],
      },
    });
  } catch (error) {
    console.error("[Patient Doctors Directory API Error]:", error);
    return NextResponse.json({ error: "Failed to load doctors" }, { status: 500 });
  }
}
