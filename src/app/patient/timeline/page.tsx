import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { getPatientComparison } from "@/lib/data/patientComparison";
import { PatientTimelineClient } from "./PatientTimelineClient";

export const dynamic = "force-dynamic";

interface PatientTimelinePageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function PatientTimelinePage({
  searchParams,
}: PatientTimelinePageProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  const resolvedParams = searchParams ? await searchParams : {};
  const defaultTab = resolvedParams.tab === "history" ? "history" : "ai";

  const [patientProfile, comparison] = await Promise.all([
    prisma.patientProfile.findUnique({
      where: { userId: user.userId },
      include: {
        timelines: {
          orderBy: { eventDate: "desc" },
        },
      },
    }),
    getPatientComparison(user.userId),
  ]);

  return (
    <PatientTimelineClient
      timelines={patientProfile?.timelines || []}
      comparison={comparison}
      defaultTab={defaultTab}
    />
  );
}
