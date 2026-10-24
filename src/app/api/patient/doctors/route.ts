import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getDoctorUpiVpa } from "@/lib/payment/upi";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get("specialization")?.trim() || "";
    const area = searchParams.get("area")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const search = searchParams.get("search")?.trim() || searchParams.get("q")?.trim() || "";
    const sortBy = searchParams.get("sortBy")?.trim() || "slots"; // "slots", "experience", "fee_asc", "fee_desc", "name", "rating"
    const maxFee = searchParams.get("maxFee") ? parseInt(searchParams.get("maxFee")!, 10) : null;
    const dateFilter = searchParams.get("date")?.trim() || "ALL"; // "TODAY", "TOMORROW", "WEEK", "ALL"

    const now = new Date();

    // Fetch active doctors with available future slots for extraction & booking
    const doctors = await prisma.doctorProfile.findMany({
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

    // Curated ratings and review counts map for realism
    const ratingMap: Record<string, { rating: number; reviews: number }> = {
      "Dr. Aarav Mehta": { rating: 4.9, reviews: 184 },
      "Dr. Neha Kapoor": { rating: 4.9, reviews: 210 },
      "Dr. Rohan Deshmukh": { rating: 4.8, reviews: 145 },
      "Dr. Sunita Rao": { rating: 5.0, reviews: 278 },
      "Dr. Vikram Singhania": { rating: 4.8, reviews: 162 },
      "Dr. Ananya Sen": { rating: 4.9, reviews: 193 },
      "Dr. Rajesh Kulkarni": { rating: 4.9, reviews: 156 },
      "Dr. Meera Nambiar": { rating: 4.9, reviews: 224 },
      "Dr. Tariq Alvi": { rating: 4.8, reviews: 138 },
    };

    // Filter and transform doctors
    let list = doctors.map((doc) => {
      const docRating = ratingMap[doc.user.name] || {
        rating: 4.8,
        reviews: 95 + (doc.experience * 7) % 60,
      };

      // Extract area and city from clinicInfo or defaults
      let extractedArea = "Cyber City, Gurugram";
      let extractedCity = "Delhi NCR";
      if (doc.clinicInfo) {
        if (doc.clinicInfo.includes("Bengaluru") || doc.clinicInfo.includes("Indiranagar") || doc.clinicInfo.includes("Airport Road")) {
          extractedCity = "Bengaluru";
          extractedArea = doc.clinicInfo.includes("Indiranagar") ? "Indiranagar, Bengaluru" : "Old Airport Road, Bengaluru";
        } else if (doc.clinicInfo.includes("Mumbai") || doc.clinicInfo.includes("Bandra") || doc.clinicInfo.includes("Girgaon")) {
          extractedCity = "Mumbai";
          extractedArea = doc.clinicInfo.includes("Bandra") ? "Bandra West, Mumbai" : "Girgaon, Mumbai";
        } else if (doc.clinicInfo.includes("Saket") || doc.clinicInfo.includes("Delhi")) {
          extractedCity = "Delhi NCR";
          extractedArea = "Saket, South Delhi";
        } else if (doc.clinicInfo.includes("Sector 44")) {
          extractedCity = "Delhi NCR";
          extractedArea = "Sector 44, Gurugram";
        } else if (doc.clinicInfo.includes("Sector 38")) {
          extractedCity = "Delhi NCR";
          extractedArea = "Sector 38, Gurugram";
        }
      }

      // Group available slots
      const availableSlots = doc.slots.filter((s) => new Date(s.startTime) > now);
      const nextAvailableSlot = availableSlots.length > 0 ? availableSlots[0].startTime.toISOString() : null;

      // Extract unique dates
      const uniqueDates = Array.from(
        new Set(
          availableSlots.map((s) => s.startTime.toISOString().split("T")[0])
        )
      );

      // Slot counts by category
      const todayDateStr = now.toISOString().split("T")[0];
      const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const tomorrowDateStr = tomorrowDate.toISOString().split("T")[0];

      const todaySlotsCount = availableSlots.filter(
        (s) => s.startTime.toISOString().split("T")[0] === todayDateStr
      ).length;

      const tomorrowSlotsCount = availableSlots.filter(
        (s) => s.startTime.toISOString().split("T")[0] === tomorrowDateStr
      ).length;

      return {
        id: doc.id,
        userId: doc.user.id,
        name: doc.user.name,
        email: doc.user.email,
        specialization: doc.specialization,
        qualification: doc.qualification || "MBBS, MD",
        designation: doc.designation || "Senior Specialist",
        experience: doc.experience || 10,
        consultationFee: doc.consultationFee || 800,
        upiId: getDoctorUpiVpa(doc.user.name, doc.upiId),
        clinicInfo: doc.clinicInfo || "CodeRx Specialty Health Hub",
        visitingHospitals: doc.visitingHospitals || "CodeRx Partner Hospitals",
        licenseNumber: doc.licenseNumber,
        bio: doc.bio,
        area: extractedArea,
        city: extractedCity,
        rating: docRating.rating,
        reviewsCount: docRating.reviews,
        availableSlotsCount: availableSlots.length,
        todaySlotsCount,
        tomorrowSlotsCount,
        nextAvailableSlot,
        availableDates: uniqueDates,
        slots: availableSlots.slice(0, 8).map((s) => {
          const hour = s.startTime.getHours();
          let period: "MORNING" | "AFTERNOON" | "EVENING" = "MORNING";
          if (hour >= 12 && hour < 16) period = "AFTERNOON";
          else if (hour >= 16) period = "EVENING";

          return {
            id: s.id,
            startTime: s.startTime.toISOString(),
            endTime: s.endTime.toISOString(),
            duration: s.duration,
            period,
          };
        }),
      };
    });

    // 1. Text Search Filter (Doctor Name, Qualification, Specialization, Clinic, Area, Bio)
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((doc) => {
        const text = `${doc.name} ${doc.specialization} ${doc.qualification} ${doc.clinicInfo} ${doc.visitingHospitals} ${doc.area} ${doc.city} ${doc.bio || ""}`.toLowerCase();
        
        // Match condition keywords as well (e.g. fever -> GP, sugar/diabetes -> Diabetologist, knee -> Orthopedic)
        if (text.includes(q)) return true;
        if (q.includes("pediatr") || q.includes("child") || q.includes("baby") || q.includes("kid")) {
          return doc.specialization.toLowerCase().includes("pediatric");
        }
        if (q.includes("gp") || q.includes("physician") || q.includes("fever") || q.includes("cold") || q.includes("general")) {
          return doc.specialization.toLowerCase().includes("general") || doc.designation.toLowerCase().includes("family");
        }
        if (q.includes("diabet") || q.includes("sugar") || q.includes("thyroid") || q.includes("endo")) {
          return doc.specialization.toLowerCase().includes("diabet") || doc.qualification.toLowerCase().includes("endocrinology");
        }
        if (q.includes("heart") || q.includes("cardio") || q.includes("ecg") || q.includes("chest pain") || q.includes("bp")) {
          return doc.specialization.toLowerCase().includes("cardio");
        }
        if (q.includes("skin") || q.includes("derma") || q.includes("acne") || q.includes("hair") || q.includes("rash")) {
          return doc.specialization.toLowerCase().includes("derma");
        }
        if (q.includes("ortho") || q.includes("bone") || q.includes("knee") || q.includes("joint") || q.includes("spine")) {
          return doc.specialization.toLowerCase().includes("ortho");
        }
        if (q.includes("neuro") || q.includes("brain") || q.includes("migraine") || q.includes("nerve")) {
          return doc.specialization.toLowerCase().includes("neuro");
        }
        if (q.includes("gynec") || q.includes("women") || q.includes("pcos") || q.includes("pregnancy") || q.includes("pcod")) {
          return doc.specialization.toLowerCase().includes("gynec") || doc.specialization.toLowerCase().includes("obstetric");
        }
        if (q.includes("pulmo") || q.includes("lung") || q.includes("breath") || q.includes("asthma") || q.includes("cough")) {
          return doc.specialization.toLowerCase().includes("pulmon");
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
          return fullSpec.includes("derma") || fullSpec.includes("skin");
        }
        if (spec === "orthopedic" || spec === "orthopedics") {
          return fullSpec.includes("ortho") || fullSpec.includes("joint");
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
      // Default: "slots" (earliest available slot first, then most slots)
      if (a.nextAvailableSlot && b.nextAvailableSlot) {
        return new Date(a.nextAvailableSlot).getTime() - new Date(b.nextAvailableSlot).getTime();
      }
      if (a.nextAvailableSlot) return -1;
      if (b.nextAvailableSlot) return 1;
      return b.availableSlotsCount - a.availableSlotsCount;
    });

    // Extract all unique areas and specializations for dynamic filter chips
    const allAreas = Array.from(new Set(doctors.map((d) => {
      if (d.clinicInfo?.includes("Cyber City")) return "Cyber City, Gurugram";
      if (d.clinicInfo?.includes("Sector 44")) return "Sector 44, Gurugram";
      if (d.clinicInfo?.includes("Sector 38")) return "Sector 38, Gurugram";
      if (d.clinicInfo?.includes("Saket")) return "Saket, South Delhi";
      if (d.clinicInfo?.includes("Indiranagar")) return "Indiranagar, Bengaluru";
      if (d.clinicInfo?.includes("Airport Road")) return "Old Airport Road, Bengaluru";
      if (d.clinicInfo?.includes("Bandra")) return "Bandra West, Mumbai";
      if (d.clinicInfo?.includes("Girgaon")) return "Girgaon, Mumbai";
      return "Cyber City, Gurugram";
    })));

    const allCities = ["Delhi NCR", "Bengaluru", "Mumbai"];

    return NextResponse.json({
      success: true,
      totalCount: list.length,
      doctors: list,
      filters: {
        areas: allAreas,
        cities: allCities,
        specializations: [
          { key: "ALL", label: "All Specializations" },
          { key: "gp", label: "General Physician (GP)", icon: "Stethoscope" },
          { key: "pediatrician", label: "Pediatrician (Child Specialist)", icon: "Baby" },
          { key: "diabetologist", label: "Diabetologist & Endocrinologist", icon: "Activity" },
          { key: "cardiologist", label: "Cardiologist (Heart)", icon: "Heart" },
          { key: "dermatologist", label: "Dermatologist (Skin & Hair)", icon: "Sparkles" },
          { key: "orthopedic", label: "Orthopedic Surgeon (Bones & Joints)", icon: "Bone" },
          { key: "neurologist", label: "Neurologist (Brain & Nerve)", icon: "Brain" },
          { key: "gynecologist", label: "Gynecologist (Women's Health)", icon: "Users" },
          { key: "pulmonologist", label: "Pulmonologist (Lungs & Chest)", icon: "Wind" },
        ],
      },
    });
  } catch (error) {
    console.error("[Patient Doctors Directory API Error]:", error);
    return NextResponse.json({ error: "Failed to load doctors" }, { status: 500 });
  }
}
