import { getCurrentUser } from "@/lib/auth/session";
import { DoctorReportsClient } from "./DoctorReportsClient";

export const dynamic = "force-dynamic";

export default async function DoctorReportsPage() {
  return <DoctorReportsClient />;
}
