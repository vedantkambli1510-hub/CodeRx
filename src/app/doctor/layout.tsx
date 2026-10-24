import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { DoctorSidebar } from "@/components/layout/DoctorSidebar";
import { DoctorHeader } from "@/components/layout/DoctorHeader";
import { prisma } from "@/lib/db/prisma";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?role=DOCTOR");
  }

  if (user.role !== "DOCTOR") {
    redirect("/patient");
  }

  // Fetch doctor data and pending counts if real user exists
  let doctor = null;
  let unreadAlerts = 0;

  if (user) {
    try {
      doctor = await prisma.doctorProfile.findUnique({
        where: { userId: user.userId },
      });
      unreadAlerts = await prisma.notification.count({
        where: {
          userId: user.userId,
          status: "UNREAD",
        },
      });
    } catch {
      unreadAlerts = 0;
    }
  }

  const doctorName = user.name || "Attending Physician";

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF7F2] text-slate-900 font-sans antialiased">
      <DoctorSidebar
        doctorName={doctorName}
        criticalAlertsCount={unreadAlerts}
        pendingReviewsCount={0}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#FAF7F2]">
        <DoctorHeader doctorName={doctorName} unreadAlertsCount={unreadAlerts} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
