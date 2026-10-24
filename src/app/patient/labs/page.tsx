import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PatientLabsNearMeClient } from "./PatientLabsNearMeClient";

export const dynamic = "force-dynamic";

export default async function PatientLabsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId: user.userId },
    include: {
      user: true,
    },
  });

  return (
    <PatientLabsNearMeClient
      patientName={patientProfile?.user?.name || user.name || "Patient"}
    />
  );
}
