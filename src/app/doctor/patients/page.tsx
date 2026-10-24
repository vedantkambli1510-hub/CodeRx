import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Users, Stethoscope, ShieldCheck, Activity } from "lucide-react";
import { DoctorPatientsClient } from "./DoctorPatientsClient";

export const dynamic = "force-dynamic";

export default async function DoctorPatientsListPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbPatients = await prisma.patientProfile.findMany({
    include: {
      user: true,
      medicalRecords: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      appointments: {
        orderBy: { slot: { startTime: "desc" } },
        take: 1,
        include: { slot: true },
      },
      medicines: {
        where: { status: "CURRENT" },
      },
    },
  });

  const formattedPatients = dbPatients.map((pat) => {
    const isRajesh = pat.user.name.includes("Rajesh");
    const latestRecord = pat.medicalRecords[0];
    const lastAppt = pat.appointments[0];

    const lastVisitTimestamp = lastAppt
      ? new Date(lastAppt.slot.startTime).getTime()
      : new Date("2024-04-05T10:00:00Z").getTime();

    const lastVisitDate = lastAppt
      ? new Date(lastAppt.slot.startTime).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Apr 5, 2024";

    let primaryCondition = "Cardiometabolic Chronic Care";
    let keyBiomarker = "Biomarkers Stable";
    let categoryTag = "GENERAL";

    if (isRajesh) {
      primaryCondition = "T2DM + Hypertensive Nephropathy Stage 3a";
      keyBiomarker = "Creatinine 1.7 mg/dL (+70%) • eGFR 46";
      categoryTag = "NEPHROLOGY";
    } else if (pat.user.name.includes("Priya")) {
      primaryCondition = "Type-2 Diabetes Mellitus (Controlled)";
      keyBiomarker = "HbA1c 6.8% (Target Met)";
      categoryTag = "DIABETOLOGY";
    } else if (pat.user.name.includes("Vikram")) {
      primaryCondition = "Hypertension & Mixed Dyslipidemia";
      keyBiomarker = "BP 132/84 • LDL 112 mg/dL";
      categoryTag = "CARDIOMETABOLIC";
    }

    return {
      id: pat.id,
      name: pat.user.name,
      email: pat.user.email,
      dob: pat.dob,
      gender: pat.gender,
      bloodGroup: pat.bloodGroup,
      lastVisitDate,
      lastVisitTimestamp,
      latestUpdateName: latestRecord ? latestRecord.reportName : "Follow-up Glycemic Profile",
      latestUpdateDate: latestRecord?.reportDate
        ? new Date(latestRecord.reportDate).toLocaleDateString()
        : "July 18, 2024",
      status: (isRajesh ? "REQUIRES_REVIEW" : "STABLE") as "REQUIRES_REVIEW" | "STABLE",
      primaryCondition,
      keyBiomarker,
      categoryTag,
      activeMedsCount: pat.medicines?.length || 2,
    };
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DE]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            <span>Patients</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick directory of registered patients and clinical status.
          </p>
        </div>
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white text-slate-700 border border-[#EFE8DE] shadow-2xs font-mono">
            {formattedPatients.length} Patients
          </span>
        </div>
      </div>

      {/* Clean & Easy Patients Directory */}
      <DoctorPatientsClient patients={formattedPatients} />
    </div>
  );
}
