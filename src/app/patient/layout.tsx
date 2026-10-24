import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { PatientSidebar } from "@/components/layout/PatientSidebar";
import { PatientHeader } from "@/components/layout/PatientHeader";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=PATIENT");
  }

  if (user.role !== "PATIENT") {
    redirect("/doctor");
  }

  const patientName = user.name || "Aarav Mehta";

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#FFF5F8] via-[#FFF0F5] to-[#FDE8F0] text-slate-900 font-sans antialiased">
      <PatientSidebar patientName={patientName} patientEmail={user.email} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-gradient-to-br from-[#FFF5F8] via-[#FFF0F5] to-[#FDE8F0]">
        <PatientHeader patientName={patientName} patientEmail={user.email} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
