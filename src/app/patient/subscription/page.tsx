import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { PatientSubscriptionView } from "./PatientSubscriptionView";

export const dynamic = "force-dynamic";

export default async function PatientSubscriptionPage() {
  const user = await getCurrentUser();
  const patientProfile = user
    ? await prisma.patientProfile.findUnique({
        where: { userId: user.userId },
        include: { user: true },
      })
    : null;

  const patientName = patientProfile?.user?.name || user?.name || "Patient Account";

  return <PatientSubscriptionView patientName={patientName} />;
}
