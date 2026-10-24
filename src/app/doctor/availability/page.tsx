import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { DoctorAvailabilityView } from "./DoctorAvailabilityView";

export const dynamic = "force-dynamic";

export default async function DoctorAvailabilityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: user.userId },
    include: {
      user: true,
      slots: {
        orderBy: { startTime: "asc" },
      },
    },
  });

  return <DoctorAvailabilityView doctor={doctorProfile} slots={doctorProfile?.slots || []} />;
}
