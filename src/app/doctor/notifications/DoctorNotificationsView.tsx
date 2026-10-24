"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  Mail,
  Check,
} from "lucide-react";

interface DoctorNotificationsViewProps {
  notifications: any[];
}

export function DoctorNotificationsView({
  notifications: initialNotifications,
}: DoctorNotificationsViewProps) {
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    // Notify sidebar and header that notifications are viewed
    window.dispatchEvent(new Event("notifications-read"));

    // Automatically mark all unread notifications as read when visited
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
    } catch {}
  }

  async function handleMarkAsRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n));
        if (!next.some((n) => n.status === "UNREAD")) {
          window.dispatchEvent(new Event("notifications-read"));
        }
        return next;
      });
    } catch {}
  }

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return n.status === "UNREAD";
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-sky-600" />
            <span>Clinical Alerts & Notifications Center</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time feed of newly scheduled consultations, AI critical parameter alerts, and prescription dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some((n) => n.status === "UNREAD") && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark All as Read
            </button>
          )}
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "UNREAD"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300"
            }`}
          >
            Unread ({notifications.filter((n) => n.status === "UNREAD").length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-100/95 p-12 text-center rounded-2xl border border-slate-300 text-slate-600 shadow-sm">
            No notifications found in this view.
          </div>
        ) : (
          filtered.map((n) => {
            const isUnread = n.status === "UNREAD";

            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isUnread
                    ? "bg-white border-sky-300 shadow-sm"
                    : "bg-slate-100/80 border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === "IMPORTANT_CHANGE"
                        ? "bg-red-100 border border-red-300 text-red-700"
                        : "bg-sky-100 border border-sky-300 text-sky-700"
                    }`}
                  >
                    {n.type === "IMPORTANT_CHANGE" ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-sky-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-slate-500 block pt-1 font-medium">
                      {new Date(n.sentAt || n.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.link && (
                    <Link
                      href={n.link}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 hover:bg-sky-600 hover:text-white border border-sky-300 shadow-2xs transition-colors"
                    >
                      View
                    </Link>
                  )}
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
