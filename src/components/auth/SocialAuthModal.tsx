"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Heart,
  ArrowRight,
  User,
  X,
  Smartphone,
  Mail,
  Trash2,
  Sparkles,
  AlertCircle,
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
  initialRole = "PATIENT",
}: SocialAuthModalProps) {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<"DOCTOR" | "PATIENT">(initialRole);
  const [realEmail, setRealEmail] = useState("");
  const [realName, setRealName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);

  // Saved account on this device
  const [savedAccount, setSavedAccount] = useState<SavedDeviceAccount | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const activeRole = initialRole || "PATIENT";
      setSelectedRole(activeRole);
      setError(null);
      setNotice(null);

      if (typeof window !== "undefined") {
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
      }
    }
  }, [isOpen, initialRole, provider]);

  function handleRoleSwitch(newRole: "DOCTOR" | "PATIENT") {
    setSelectedRole(newRole);
    setError(null);
    setNotice(null);

    if (typeof window !== "undefined") {
      const rawSaved = localStorage.getItem(`coderx_saved_device_account_${newRole.toLowerCase()}`);
      if (rawSaved) {
        try {
          const parsed = JSON.parse(rawSaved);
          setSavedAccount(parsed);
          setRealEmail(parsed.email || "");
          setRealName(parsed.name || "");
          return;
        } catch {}
      }
    }
    setSavedAccount(null);
    setRealEmail("");
    setRealName("");
  }

  function handleForgetSavedAccount() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`coderx_saved_device_account_${selectedRole.toLowerCase()}`);
    }
    setSavedAccount(null);
    setRealEmail("");
    setRealName("");
  }

  async function handleOfficialGoogleOAuth() {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const queryUrl = `/api/auth/google?role=${selectedRole}`;
      const res = await fetch(queryUrl);
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json();
      if (!data.configured) {
        if (realEmail.trim()) {
          await handleAuthenticate();
          return;
        } else {
          setNotice("Type your Gmail address below to sign in instantly ✨");
        }
      }
    } catch {
      window.location.href = `/api/auth/google?role=${selectedRole}`;
    } finally {
      setLoading(false);
    }
  }

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
          throw new Error("Please enter your email address");
        }
        if (!trimmedEmail.includes("@")) {
          throw new Error("Please enter a valid email address");
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
          throw new Error("Please enter a valid Apple ID email");
        }

        nameToPersist =
          realName.trim() ||
          (selectedRole === "DOCTOR" ? "Dr. Consultant" : "Patient Profile");
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
          throw new Error("Please enter a valid phone number");
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

      if (typeof window !== "undefined" && rememberDevice && emailToPersist) {
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
    <div className="fixed inset-0 z-50 bg-[#122A23]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-[410px] bg-[#FAF7F2] rounded-[32px] p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(20,50,42,0.18)] border border-[#E9E1D3] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 my-auto font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE8DC] hover:bg-[#E4DBCB] text-[#556F67] hover:text-[#183E36] flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cute Header */}
        <div className="text-center pt-1">
          <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-[#EBE3D7] flex items-center justify-center mx-auto mb-2.5">
            {provider === "google" && (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            {provider === "apple" && (
              <svg className="w-6 h-6 fill-slate-900" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.89-11.89-14.43-6.22-9.67-11.14-20.91-14.77-33.72-3.63-12.81-5.45-24.87-5.45-36.18 0-16.14 4.13-29.35 12.39-39.63 8.26-10.28 18.66-15.54 31.2-15.78 4.79 0 10.21 1.25 16.27 3.76 6.06 2.5 10.02 3.82 11.89 3.94 1.5.12 5.66-1.25 12.48-4.12 6.82-2.88 12.63-4.19 17.43-3.95 13.43.76 24.23 5.75 32.41 14.99-11.66 7.07-17.38 16.89-17.15 29.47.24 10.08 4.11 18.59 11.62 25.53 7.51 6.94 16.48 10.97 26.92 12.09-2.18 6.54-4.8 13.08-7.86 19.63zm-30.82-108.9c0-6.75 2.5-13.13 7.51-19.14 5.01-6.01 11.27-9.84 18.79-11.49.25 1.5.38 2.88.38 4.13 0 6.63-2.58 13.14-7.75 19.52-5.17 6.39-11.48 10.02-18.93 10.9-.38-1.38-.57-2.67-.57-3.92z" />
              </svg>
            )}
            {provider === "phone" && (
              <Smartphone className="w-6 h-6 text-[#183E36]" />
            )}
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#183E36] tracking-tight">
            {provider === "google" && "Sign in with Google"}
            {provider === "apple" && "Sign in with Apple"}
            {provider === "phone" && "Sign in with Phone"}
          </h3>
          <p className="text-xs text-[#637C74] mt-1 font-medium">
            Welcome to CodeRx &bull; Simple, safe healthcare 🌿
          </p>
        </div>

        {/* Cute Role Pill Switcher */}
        <div className="bg-[#EFE8DC] p-1 rounded-full grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleSwitch("PATIENT")}
            className={`py-2 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === "PATIENT"
                ? "bg-white text-[#183E36] font-bold shadow-xs"
                : "text-[#637C74] hover:text-[#183E36]"
            }`}
          >
            <span>🌱</span>
            <span>Patient</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch("DOCTOR")}
            className={`py-2 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === "DOCTOR"
                ? "bg-white text-[#183E36] font-bold shadow-xs"
                : "text-[#637C74] hover:text-[#183E36]"
            }`}
          >
            <span>🩺</span>
            <span>Doctor</span>
          </button>
        </div>

        {/* Errors & Notices */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Saved Session Card (if previously logged in on this browser) */}
        {savedAccount && (
          <div className="p-3 rounded-2xl bg-white border border-[#E5DDD0] shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#E5F2EC] text-[#183E36] font-bold text-xs flex items-center justify-center shrink-0">
                {savedAccount.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#183E36] truncate">{savedAccount.name}</p>
                <p className="text-[11px] text-[#637C74] truncate">{savedAccount.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAuthenticate}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-[#183E36] hover:bg-[#122F29] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Continue →
              </button>
              <button
                type="button"
                onClick={handleForgetSavedAccount}
                title="Remove"
                className="p-1.5 rounded-lg text-[#8DA199] hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Provider Specific Inputs */}
        {provider === "google" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleOfficialGoogleOAuth}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-[#DCE4DF] text-[#183E36] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative text-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8DFD3]" />
              </div>
              <span className="relative px-3 bg-[#FAF7F2] text-[10px] font-bold text-[#8DA199] uppercase tracking-wider">
                or with Gmail address
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#4B635B] block mb-1">
                  Gmail Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={realEmail}
                    onChange={(e) => setRealEmail(e.target.value)}
                    placeholder={
                      selectedRole === "DOCTOR"
                        ? "dr.name@gmail.com"
                        : "yourname@gmail.com"
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 placeholder-[#8DA199] focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs"
                  />
                  <Mail className="w-4 h-4 text-[#8DA199] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4B635B] block mb-1">
                  Your Full Name <span className="text-[10px] font-normal text-[#8DA199]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder={selectedRole === "DOCTOR" ? "Dr. Aarav Mehta" : "Aarav Mehta"}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 placeholder-[#8DA199] focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}

        {provider === "apple" && (
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#4B635B] block mb-1">
                Apple ID Email
              </label>
              <input
                type="email"
                value={realEmail}
                onChange={(e) => setRealEmail(e.target.value)}
                placeholder="yourname@icloud.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 placeholder-[#8DA199] focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4B635B] block mb-1">
                Your Name <span className="text-[10px] font-normal text-[#8DA199]">(optional)</span>
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder={selectedRole === "DOCTOR" ? "Dr. Name" : "Your Name"}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 placeholder-[#8DA199] focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs"
              />
            </div>
          </div>
        )}

        {provider === "phone" && (
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#4B635B] block mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 placeholder-[#8DA199] focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4B635B] block mb-1">
                Your Name <span className="text-[10px] font-normal text-[#8DA199]">(optional)</span>
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder={selectedRole === "DOCTOR" ? "Dr. Name" : "Your Name"}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 placeholder-[#8DA199] focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-[#4B635B]">SMS OTP</label>
                <span className="text-[10px] font-bold text-emerald-700">Code: 123456</span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-slate-900 font-mono tracking-widest text-center font-bold focus:outline-hidden focus:ring-2 focus:ring-[#183E36] focus:border-transparent transition-all shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* Remember me toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#526B63] select-none pt-1">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="w-4 h-4 rounded border-[#DCE4DF] text-[#183E36] focus:ring-[#183E36] accent-[#183E36] cursor-pointer"
          />
          <span>Remember me on this browser</span>
        </label>

        {/* Modal Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-[#DCE4DF] text-xs font-bold text-[#556F67] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAuthenticate}
            disabled={loading || (provider === "google" && !realEmail.trim()) || (provider === "phone" && !customPhone.trim())}
            className="flex-1 py-3 px-4 rounded-xl bg-[#183E36] hover:bg-[#122F29] text-white text-xs font-bold transition-all shadow-md shadow-[#183E36]/20 flex items-center justify-center gap-1.5 active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in as {selectedRole === "DOCTOR" ? "Doctor" : "Patient"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Cute Sweet Footer */}
        <div className="text-[11px] text-[#718B82] text-center flex items-center justify-center gap-1.5 -mt-1 font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Care for you and your family &bull; Safe &amp; private</span>
        </div>

      </div>
    </div>
  );
}
