import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { PatientSidebar } from "@/components/layout/PatientSidebar";

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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FAF7F2] text-slate-900 font-sans antialiased">
      <PatientSidebar patientName={user.name || "Patient Account"} patientEmail={user.email} />
      <div className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FAF7F2]">
        {children}
      </div>
    </div>
  );
}
