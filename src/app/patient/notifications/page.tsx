import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PatientNotificationsView } from "./PatientNotificationsView";

export const dynamic = "force-dynamic";

export default async function PatientNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
  });

  const serializedNotifications = JSON.parse(JSON.stringify(notifications));

  return <PatientNotificationsView initialNotifications={serializedNotifications} />;
}
