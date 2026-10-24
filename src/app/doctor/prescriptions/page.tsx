import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { DoctorPrescriptionsView } from "./DoctorPrescriptionsView";

export const dynamic = "force-dynamic";

export default async function DoctorPrescriptionsListPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [prescriptions, patients] = await Promise.all([
    prisma.prescription.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          include: { user: true },
        },
        doctor: {
          include: { user: true },
        },
      },
    }),
    prisma.patientProfile.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: { name: "asc" },
      },
    }),
  ]);

  return (
    <DoctorPrescriptionsView
      prescriptions={prescriptions}
      patients={patients}
    />
  );
}
