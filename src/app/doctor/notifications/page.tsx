import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { Bell } from "lucide-react";
import { DoctorNotificationsView } from "./DoctorNotificationsView";

export const dynamic = "force-dynamic";

export default async function DoctorNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
  });

  return <DoctorNotificationsView notifications={notifications} />;
}
