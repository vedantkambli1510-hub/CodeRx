import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { PatientDashboardView } from "./PatientDashboardView";

export const dynamic = "force-dynamic";

export default async function PatientDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId: user.userId },
    include: {
      user: true,
      appointments: {
        orderBy: { slot: { startTime: "asc" } },
        include: {
          doctor: { include: { user: true } },
          slot: true,
          intakeSession: true,
          aiReport: true,
          medicalRecords: true,
          prescription: true,
        },
      },
      medicalRecords: {
        orderBy: { createdAt: "desc" },
      },
      timelines: {
        orderBy: { eventDate: "desc" },
      },
      medicines: {
        orderBy: { createdAt: "desc" },
      },
      prescriptions: {
        orderBy: { createdAt: "desc" },
        include: {
          doctor: { include: { user: true } },
        },
      },
      checklistItems: true,
    },
  });

  if (!patientProfile) return null;

  return (
    <PatientDashboardView
      user={user}
      patient={patientProfile}
      appointments={patientProfile.appointments}
      records={patientProfile.medicalRecords}
      timelines={patientProfile.timelines}
      medicines={patientProfile.medicines}
      prescriptions={patientProfile.prescriptions}
      initialChecklist={patientProfile.checklistItems}
    />
  );
}
