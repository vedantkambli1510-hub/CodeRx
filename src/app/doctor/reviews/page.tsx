import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import {
  compareMedicalRecords,
  StructuredReportExtraction,
} from "@/lib/ai/coderx-ai";
import { ComparisonStudioView } from "./ComparisonStudioView";

export const dynamic = "force-dynamic";

export default async function DoctorReviewsStudioPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Load all patients and their medical records
  const patients = await prisma.patientProfile.findMany({
    include: {
      user: true,
      medicalRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return <ComparisonStudioView patients={patients} />;
}
