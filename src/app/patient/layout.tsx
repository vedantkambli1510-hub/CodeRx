import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
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

  const patientName = user.name || "Rajesh Sharma";

  // Check unread count from database
  let unreadCount = 0;
  try {
    unreadCount = await prisma.notification.count({
      where: {
        userId: user.userId,
        status: "UNREAD",
      },
    });
  } catch {
    unreadCount = 0;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      <PatientSidebar
        patientName={patientName}
        patientEmail={user.email}
        initialUnreadCount={unreadCount}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F8FAFC]">
        <PatientHeader
          patientName={patientName}
          patientEmail={user.email}
          unreadCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
