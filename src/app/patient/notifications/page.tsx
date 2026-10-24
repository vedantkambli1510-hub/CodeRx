import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { Bell, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PatientNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-sky-600" />
            <span>Health Notifications & Reminders</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Appointment confirmations, pre-visit checklist reminders, and report updates.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                    {new Date(n.sentAt || n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors border border-sky-200"
                >
                  View
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
