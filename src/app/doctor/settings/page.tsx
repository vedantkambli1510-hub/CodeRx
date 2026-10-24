import { getCurrentUser } from "@/lib/auth/session";
import { checkSystemConfiguration } from "@/lib/config/checker";
import {
  Settings,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Database,
  Lock,
  Sparkles,
  HardDrive,
  CreditCard,
  Mail,
  Bell,
  ExternalLink,
  Info,
  Check,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DoctorSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const report = await checkSystemConfiguration();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DATABASE":
        return Database;
      case "OAUTH":
        return Lock;
      case "AI":
        return Sparkles;
      case "STORAGE":
        return HardDrive;
      case "PAYMENTS":
        return CreditCard;
      case "EMAIL":
        return Mail;
      case "NOTIFICATIONS":
        return Bell;
      default:
        return Settings;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              System Settings & Integration Health
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status check for database, Google OAuth, Gemini AI, storage, payments, email, and reminder workers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono bg-sky-50 text-sky-800 border border-sky-200">
            Mode: {report.environment.toUpperCase()} (SANDBOX ACTIVE)
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              report.isReady
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {report.configuredCount} / {report.totalServices} Services Connected
          </span>
        </div>
      </div>

      {/* Status Banner */}
      {report.isReady ? (
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                All Systems Fully Operational
              </h3>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                All 7 core platform subsystems are connected and operational. AI multimodal report analysis, What Changed differentials, Google authentication, local file storage, payments, and transactional email dispatches are ready.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-200/80 text-emerald-900">
              🟢 Ready for Demonstration & Production
            </span>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Configuration Required</h3>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                Supply external keys in <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-[11px] font-bold">.env</code> to activate live cloud integrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.services.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const isLive = item.status === "CONNECTED_LIVE";
          const isSandbox = item.status === "CONNECTED_SANDBOX";
          const isConfigured = isLive || isSandbox;

          return (
            <div
              key={item.service}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                isConfigured
                  ? "border-slate-200 shadow-sm hover:border-slate-300"
                  : "border-amber-200/80 bg-amber-50/10 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isLive
                        ? "bg-emerald-50 text-emerald-700"
                        : isSandbox
                        ? "bg-sky-50 text-sky-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.service}</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                {isLive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Connected (Live)</span>
                  </span>
                ) : isSandbox ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Connected (Sandbox)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Configuration Required</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{item.description}</p>

              {/* Status Note & Required Env Vars */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                  <span>Environment Variables:</span>
                  <span className="text-emerald-700 font-bold text-[10px]">
                    {item.sandboxDetails || "Active & Functional"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.requiredVars.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700"
                    >
                      {v}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                  <strong className="text-slate-700">Setup Note:</strong> {item.actionGuide}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Audit Policy Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <span>Security & AI Safety Safeguards (Sections 35 & 36)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-1">Role-Based Access Control</h5>
            <p>
              Strict server-side verification ensures patient profiles are only accessible to authorized clinicians, and doctor workspaces are walled from patient accounts.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-1">Non-Diagnostic AI Safeguards</h5>
            <p>
              CodeRx AI is structured strictly as a clinical decision support tool. It never prescribes automatically, never modifies medication without doctor signoff, and includes mandatory verification disclaimers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-1">Immutable Audit Logging</h5>
            <p>
              Every record access, differential analysis, prescription dispatch, deprescribing action, and payment transaction is recorded with user attribution and timestamping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
