import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { PatientFamilyPortalView } from "./PatientFamilyPortalView";

export const dynamic = "force-dynamic";

export default async function PatientFamilyPage() {
  const user = await getCurrentUser();
  return <PatientFamilyPortalView />;
}
