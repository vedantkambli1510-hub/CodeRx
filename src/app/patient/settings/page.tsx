import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Settings, Bell, Shield, User, Smartphone, Mail, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PatientSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: user.userId },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Account & Preference Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your CodeRx notification channels, pre-visit reminder delivery, and privacy preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pre-Visit Reminders Settings (Section 31) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">Automatic Appointment Reminders</h2>
          </div>
          <p className="text-xs text-slate-600">
            CodeRx automatically notifies you before upcoming doctor consultations to ensure all reports, scans, and medicines are ready.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-bold text-slate-900">7 Days Before Consultation</p>
                <p className="text-[11px] text-slate-500">Early reminder to book required lab work or diagnostic scans.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-bold text-slate-900">1 Day Before Consultation</p>
                <p className="text-[11px] text-slate-500">Checklist alert reminding you to gather reports and current medicines.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-bold text-slate-900">2 Hours Before Consultation</p>
                <p className="text-[11px] text-slate-500">Final heads-up before doctor consultation begins.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Delivery Channels</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Notifications</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">In-App Notification Drawer</p>
                <p className="text-[11px] text-slate-500">Persistent real-time alerts</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Privacy & Medical Record Security</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your medical records and extracted values are encrypted and stored in private cloud storage. Only your designated healthcare providers have authorized access during consultations.
          </p>
        </div>
      </div>
    </div>
  );
}
