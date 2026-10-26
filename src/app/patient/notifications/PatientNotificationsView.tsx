"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Pill,
  FileText,
  Check,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  link?: string | null;
  sentAt?: string | Date;
  createdAt: string | Date;
}

interface PatientNotificationsViewProps {
  initialNotifications: NotificationItem[];
}

export function PatientNotificationsView({
  initialNotifications,
}: PatientNotificationsViewProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "APPOINTMENT" | "MEDICINE">("ALL");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Automatically mark all notifications as read once viewed
  useEffect(() => {
    // Notify sidebar and header immediately to remove the notification badge
    window.dispatchEvent(new Event("notifications-read"));
    try {
      localStorage.setItem("coderx_messages_viewed", "true");
    } catch {}

    const hasUnread = initialNotifications.some((n) => n.status === "UNREAD");
    if (hasUnread) {
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, status: "READ" }))
          );
        })
        .catch(() => {});
    }
  }, [initialNotifications]);

  async function handleMarkAllAsRead() {
    setIsMarkingAll(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "READ" }))
      );
      window.dispatchEvent(new Event("notifications-read"));
      try {
        localStorage.setItem("coderx_messages_viewed", "true");
      } catch {}
    } catch {
      // ignore
    } finally {
      setIsMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return n.status === "UNREAD";
    if (filter === "APPOINTMENT") return n.type === "APPOINTMENT" || n.title.toLowerCase().includes("appointment");
    if (filter === "MEDICINE") return n.type === "PRESCRIPTION" || n.title.toLowerCase().includes("medication");
    return true;
  });

  const getIcon = (n: NotificationItem) => {
    const titleLower = n.title.toLowerCase();
    if (titleLower.includes("stopped") || titleLower.includes("critical") || titleLower.includes("warning")) {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }
    if (titleLower.includes("medication") || titleLower.includes("resumed") || n.type === "PRESCRIPTION") {
      return (
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
          <Pill className="w-4 h-4" />
        </div>
      );
    }
    if (titleLower.includes("appointment") || n.type === "APPOINTMENT") {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
      );
    }
    if (titleLower.includes("report")) {
      return (
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#059669]" />
            <span>Health Notifications & Reminders</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Appointment confirmations, pre-visit checklist reminders, and report updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>All Viewed</span>
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: "ALL", label: `All (${notifications.length})` },
          { key: "UNREAD", label: `Unread (${unreadCount})` },
          { key: "APPOINTMENT", label: "Appointments" },
          { key: "MEDICINE", label: "Medicines" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 ${
              filter === t.key
                ? "bg-[#064E3B] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700">No notifications in this filter</div>
              <p className="text-xs text-slate-400 mt-0.5">You are completely up to date.</p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl bg-white border transition-all duration-150 flex items-start justify-between gap-4 shadow-2xs hover:border-slate-300 ${
                n.status === "UNREAD" ? "border-emerald-300 ring-1 ring-emerald-300/40" : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {getIcon(n)}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h3>
                    {n.status === "UNREAD" && (
                      <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-emerald-100 text-emerald-800">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10.5px] text-slate-400 block pt-1.5 font-sans">
                    {new Date(n.sentAt || n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  prefetch={true}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E8F8EE] text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors border border-emerald-200/80 shrink-0 self-center"
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
