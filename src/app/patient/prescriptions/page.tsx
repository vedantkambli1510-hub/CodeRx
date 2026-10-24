import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PatientPrescriptionsView } from "./PatientPrescriptionsView";

export const dynamic = "force-dynamic";

export default async function PatientPrescriptionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId: user.userId },
    include: {
      user: true,
      prescriptions: {
        orderBy: { createdAt: "desc" },
        include: {
          doctor: { include: { user: true } },
        },
      },
    },
  });

  const prescriptions = patientProfile?.prescriptions || [];
  const patientName = patientProfile?.user?.name || user?.name || "Patient Account";

  // Safely serialize for Client Component
  const serializedPrescriptions = JSON.parse(JSON.stringify(prescriptions));

  return (
    <PatientPrescriptionsView
      prescriptions={serializedPrescriptions}
      patientName={patientName}
    />
  );
}
