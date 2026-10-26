import { getCurrentUser } from "@/lib/auth/session";
import { getPatientComparison } from "@/lib/data/patientComparison";
import { PatientCompareClient } from "./PatientCompareClient";
import { GitCompare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PatientComparePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const comparison = await getPatientComparison(user.userId);

  const isDemoAccount = Boolean(
    user.email?.toLowerCase().includes("demo") ||
    user.email === "patient@coderx.local"
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EFE8DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/patient/timeline"
              className="text-xs font-bold text-[#8C7A72] hover:text-[#B95535] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Health Journal</span>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#2B231F] tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-7 h-7 text-[#B95535]" />
            <span>Before vs Now — What Changed in My Reports?</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#7A6960] mt-1">
            Longitudinal comparison between your Baseline (15 Jan 2024) and Follow-up (18 Jul 2024) blood &amp; kidney reports.
          </p>
        </div>
      </div>

      <PatientCompareClient comparison={comparison} isDemoAccount={isDemoAccount} />
    </div>
  );
}
