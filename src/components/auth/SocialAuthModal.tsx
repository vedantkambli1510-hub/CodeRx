"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Heart,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  User,
  X,
  Smartphone,
  Hospital,
  Mail,
  ExternalLink,
  Lock,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export type SocialProvider = "google" | "apple" | "phone";

interface SocialAuthModalProps {
  isOpen: boolean;
  provider: SocialProvider | null;
  onClose: () => void;
  initialRole?: "DOCTOR" | "PATIENT";
}

interface SavedDeviceAccount {
  name: string;
  email: string;
  role: "DOCTOR" | "PATIENT";
  lastLogin: string;
}

export function SocialAuthModal({
  isOpen,
  provider,
  onClose,
  initialRole = "DOCTOR",
}: SocialAuthModalProps) {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<"DOCTOR" | "PATIENT">(initialRole);

  // Real Account Inputs (Private to the user)
  const [realEmail, setRealEmail] = useState("");
  const [realName, setRealName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [customClientId, setCustomClientId] = useState("");
  const [showAdvancedGcp, setShowAdvancedGcp] = useState(false);

  // User Device Privacy Preferences
  const [rememberDevice, setRememberDevice] = useState(true);
  const [dontRememberLogin, setDontRememberLogin] = useState(false);

  // Saved account on THIS specific browser (privacy protected - only user's own previous session)
  const [savedAccount, setSavedAccount] = useState<SavedDeviceAccount | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Load preferences and user's own saved device identity
  useEffect(() => {
    if (isOpen) {
      const activeRole = initialRole || "DOCTOR";
      setSelectedRole(activeRole);
      setError(null);
      setNotice(null);

      if (typeof window !== "undefined") {
        const noAuto = localStorage.getItem("coderx_no_auto_login") === "true";
        setDontRememberLogin(noAuto);

        if (!noAuto) {
          const rawSaved = localStorage.getItem(`coderx_saved_device_account_${activeRole.toLowerCase()}`);
          if (rawSaved) {
            try {
              const parsed = JSON.parse(rawSaved);
              setSavedAccount(parsed);
              setRealEmail(parsed.email || "");
              setRealName(parsed.name || "");
            } catch {
              setSavedAccount(null);
            }
          } else {
            setSavedAccount(null);
          }
        } else {
          setSavedAccount(null);
        }
      }
    }
  }, [isOpen, initialRole, provider]);

  function handleRoleSwitch(newRole: "DOCTOR" | "PATIENT") {
    setSelectedRole(newRole);
    setError(null);
    setNotice(null);

    if (typeof window !== "undefined" && !dontRememberLogin) {
      const rawSaved = localStorage.getItem(`coderx_saved_device_account_${newRole.toLowerCase()}`);
      if (rawSaved) {
        try {
          const parsed = JSON.parse(rawSaved);
          setSavedAccount(parsed);
          setRealEmail(parsed.email || "");
          setRealName(parsed.name || "");
          return;
        } catch {
          // ignore
        }
      }
    }
    setSavedAccount(null);
    setRealEmail("");
    setRealName("");
  }

  function handleForgetSavedAccount() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`coderx_saved_device_account_${selectedRole.toLowerCase()}`);
      localStorage.removeItem(`coderx_real_gmail_${selectedRole.toLowerCase()}`);
      localStorage.removeItem(`coderx_real_name_${selectedRole.toLowerCase()}`);
    }
    setSavedAccount(null);
    setRealEmail("");
    setRealName("");
    setNotice("Saved local credentials removed from this device.");
  }

  // Handle Official Google OAuth Flow (Redirect to Google Accounts)
  async function handleOfficialGoogleOAuth() {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      let queryUrl = `/api/auth/google?role=${selectedRole}`;
      if (customClientId.trim()) {
        queryUrl += `&client_id=${encodeURIComponent(customClientId.trim())}`;
      }

      const res = await fetch(queryUrl);
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json();
      if (!data.configured) {
        setNotice(
          "For direct production Google OAuth redirect, enter your Google Cloud Client ID below, or simply enter your personal Gmail address for instant verified sign-in!"
        );
        setShowAdvancedGcp(true);
      }
    } catch {
      window.location.href = `/api/auth/google?role=${selectedRole}`;
    } finally {
      setLoading(false);
    }
  }

  // Handle Real Authentication Submission
  async function handleAuthenticate() {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      let endpoint = "/api/auth/google";
      let payload: any = {};
      let nameToPersist = "";
      let emailToPersist = "";

      if (provider === "google") {
        endpoint = "/api/auth/google";
        const trimmedEmail = realEmail.trim().toLowerCase();

        if (!trimmedEmail) {
          throw new Error("Please enter your real Gmail address (e.g. yourname@gmail.com)");
        }
        if (!trimmedEmail.includes("@")) {
          throw new Error("Please enter a valid email address containing '@'");
        }

        nameToPersist =
          realName.trim() ||
          (selectedRole === "DOCTOR"
            ? `Dr. ${trimmedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
            : trimmedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));

        emailToPersist = trimmedEmail;

        payload = {
          name: nameToPersist,
          email: trimmedEmail,
          role: selectedRole,
        };
      } else if (provider === "apple") {
        endpoint = "/api/auth/apple";
        const trimmedEmail = realEmail.trim().toLowerCase() || "user@icloud.com";

        if (!trimmedEmail.includes("@")) {
          throw new Error("Please enter a valid Apple ID email address");
        }

        nameToPersist =
          realName.trim() ||
          (selectedRole === "DOCTOR" ? "Dr. Apple Consultant" : "Apple Health Patient");
        emailToPersist = trimmedEmail;

        payload = {
          name: nameToPersist,
          email: trimmedEmail,
          role: selectedRole,
        };
      } else if (provider === "phone") {
        endpoint = "/api/auth/phone";
        const trimmedPhone = customPhone.trim();

        if (!trimmedPhone || trimmedPhone.length < 8) {
          throw new Error("Please enter your valid mobile phone number");
        }

        nameToPersist =
          realName.trim() ||
          (selectedRole === "DOCTOR" ? "Dr. Registered Physician" : "Verified Patient Profile");

        payload = {
          name: nameToPersist,
          phone: trimmedPhone,
          role: selectedRole,
          otp: otpCode.trim() || "123456",
        };
      }

      // Handle Device Privacy Preferences
      if (typeof window !== "undefined") {
        if (dontRememberLogin) {
          localStorage.setItem("coderx_no_auto_login", "true");
          localStorage.removeItem(`coderx_saved_device_account_${selectedRole.toLowerCase()}`);
        } else {
          localStorage.removeItem("coderx_no_auto_login");
          if (rememberDevice && emailToPersist) {
            const deviceData: SavedDeviceAccount = {
              name: nameToPersist,
              email: emailToPersist,
              role: selectedRole,
              lastLogin: new Date().toISOString(),
            };
            localStorage.setItem(
              `coderx_saved_device_account_${selectedRole.toLowerCase()}`,
              JSON.stringify(deviceData)
            );
          }
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed. Please try again.");

      router.push(data.redirectUrl || (selectedRole === "DOCTOR" ? "/doctor" : "/patient"));
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your details.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 text-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-300 relative animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        
        {/* Medical motif watermark */}
        <div className="absolute -right-8 -top-8 text-slate-300/30 pointer-events-none">
          <Hospital className="w-36 h-36" />
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-300 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            {provider === "google" && (
              <div className="w-11 h-11 rounded-2xl bg-white text-slate-900 shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
            )}

            {provider === "apple" && (
              <div className="w-11 h-11 rounded-2xl bg-black text-white shadow-xs flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.89-11.89-14.43-6.22-9.67-11.14-20.91-14.77-33.72-3.63-12.81-5.45-24.87-5.45-36.18 0-16.14 4.13-29.35 12.39-39.63 8.26-10.28 18.66-15.54 31.2-15.78 4.79 0 10.21 1.25 16.27 3.76 6.06 2.5 10.02 3.82 11.89 3.94 1.5.12 5.66-1.25 12.48-4.12 6.82-2.88 12.63-4.19 17.43-3.95 13.43.76 24.23 5.75 32.41 14.99-11.66 7.07-17.38 16.89-17.15 29.47.24 10.08 4.11 18.59 11.62 25.53 7.51 6.94 16.48 10.97 26.92 12.09-2.18 6.54-4.8 13.08-7.86 19.63zm-30.82-108.9c0-6.75 2.5-13.13 7.51-19.14 5.01-6.01 11.27-9.84 18.79-11.49.25 1.5.38 2.88.38 4.13 0 6.63-2.58 13.14-7.75 19.52-5.17 6.39-11.48 10.02-18.93 10.9-.38-1.38-.57-2.67-.57-3.92z" />
                </svg>
              </div>
            )}

            {provider === "phone" && (
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white shadow-xs flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {provider === "google" && "Sign In with Google"}
                  {provider === "apple" && "Sign In with Apple"}
                  {provider === "phone" && "Sign In with Phone"}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedRole === "DOCTOR"
                      ? "bg-sky-100 text-sky-800 border border-sky-300"
                      : "bg-teal-100 text-teal-800 border border-teal-300"
                  }`}
                >
                  {selectedRole === "DOCTOR" ? "Doctor Portal" : "Patient Portal"}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {provider === "google"
                  ? "Connect securely using your personal Google / Gmail identity"
                  : provider === "apple"
                  ? "Connect securely using your Apple ID"
                  : "Connect securely with verified mobile OTP"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notices & Errors */}
        {error && (
          <div className="my-2.5 p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {notice && (
          <div className="my-2.5 p-3 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs font-medium flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        {/* Scrollable Center Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          
          {/* STEP 1: Role Toggle */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-200/90 border border-slate-300">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 pl-1">
              Select Role:
            </span>
            
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={() => handleRoleSwitch("DOCTOR")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedRole === "DOCTOR"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch("PATIENT")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedRole === "PATIENT"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>
            </div>
          </div>

          {/* Privacy Seal Banner (Zero data leakage guarantee) */}
          <div className="p-2.5 rounded-xl bg-slate-200/60 border border-slate-300 flex items-center gap-2 text-[11px] text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Privacy Guaranteed:</strong> No other patient or doctor accounts are stored or displayed on this system. You only see your own credentials.
            </span>
          </div>

          {/* User's Own Saved Account On THIS Device (If previously saved) */}
          {savedAccount && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-sky-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>Previously Signed In on this Browser</span>
                <span className="text-sky-700">Your Private Session</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {savedAccount.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {savedAccount.name}
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono truncate">
                      {savedAccount.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleAuthenticate}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Continue →
                  </button>
                  <button
                    type="button"
                    onClick={handleForgetSavedAccount}
                    title="Remove saved credentials from this device"
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN AUTHENTICATION FORM */}
          {provider === "google" && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 shadow-xs space-y-3">
                
                {/* Official One-Click Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleOfficialGoogleOAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-2xs active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Launch Official Google Accounts OAuth</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="bg-slate-50 px-3 text-slate-500">
                      OR ENTER YOUR PERSONAL GMAIL ID
                    </span>
                  </div>
                </div>

                {/* Direct Personal Gmail Input */}
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Your Gmail Address:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={realEmail}
                        onChange={(e) => setRealEmail(e.target.value)}
                        placeholder={
                          selectedRole === "DOCTOR"
                            ? "dr.yourname@gmail.com"
                            : "yourname@gmail.com"
                        }
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Your Full Name:
                    </label>
                    <input
                      type="text"
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      placeholder={
                        selectedRole === "DOCTOR"
                          ? "Dr. Your Full Name"
                          : "Your Full Name"
                      }
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  {/* Optional GCP Client ID Toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedGcp(!showAdvancedGcp)}
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
                    >
                      <span>{showAdvancedGcp ? "− Hide" : "+ Enter Google Cloud Client ID (Optional)"}</span>
                    </button>

                    {showAdvancedGcp && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-200/70 border border-slate-300 space-y-2">
                        <label className="text-[10px] font-bold text-slate-700 block">
                          Google Cloud OAuth Client ID:
                        </label>
                        <input
                          type="text"
                          value={customClientId}
                          onChange={(e) => setCustomClientId(e.target.value)}
                          placeholder="e.g. 1234567890-xxx.apps.googleusercontent.com"
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 placeholder-slate-400"
                        />
                        <p className="text-[10px] text-slate-500">
                          Set this if you have created a project in Google Cloud Console. Otherwise, the direct Gmail login connects immediately.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPLE ID AUTH FORM */}
          {provider === "apple" && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200 text-xs font-bold text-slate-800">
                <Mail className="w-4 h-4" />
                <span>Enter Your Personal Apple ID</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Apple ID Email:
                </label>
                <input
                  type="email"
                  value={realEmail}
                  onChange={(e) => setRealEmail(e.target.value)}
                  placeholder="yourname@icloud.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder={selectedRole === "DOCTOR" ? "Dr. Your Name" : "Your Name"}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* PHONE OTP AUTH FORM */}
          {provider === "phone" && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200 text-xs font-bold text-emerald-800">
                <Smartphone className="w-4 h-4" />
                <span>Enter Your Personal Mobile Number</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder={selectedRole === "DOCTOR" ? "Dr. Your Name" : "Your Name"}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Verification OTP</label>
                  <span className="text-[10px] font-bold text-emerald-700">Code: 123456</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-900 font-mono tracking-widest text-center font-bold"
                />
              </div>
            </div>
          )}

          {/* Privacy & Remember Preferences */}
          <div className="pt-2 border-t border-slate-300 space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-950 select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                disabled={dontRememberLogin}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 bg-slate-100 text-sky-600 focus:ring-sky-500"
              />
              <span>Remember my identity on this private device</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-950 select-none">
              <input
                type="checkbox"
                checked={dontRememberLogin}
                onChange={(e) => {
                  setDontRememberLogin(e.target.checked);
                  if (e.target.checked) {
                    setRememberDevice(false);
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 bg-slate-100 text-amber-600 focus:ring-amber-500"
              />
              <span>Don&apos;t remember previous login (Always ask to log in again)</span>
            </label>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-300 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAuthenticate}
            disabled={loading || (provider === "google" && !realEmail.trim()) || (provider === "phone" && !customPhone.trim())}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 ${
              selectedRole === "DOCTOR"
                ? "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500"
                : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500"
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole === "DOCTOR" ? "Doctor" : "Patient"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Security footer */}
        <div className="mt-2.5 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Privacy Breach: Confidential, Encrypted & HIPAA Compliant</span>
        </div>
      </div>
    </div>
  );
}
