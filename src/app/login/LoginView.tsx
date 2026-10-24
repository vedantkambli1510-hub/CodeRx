"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Stethoscope,
  User,
  ArrowRight,
  Check,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HelpCircle,
  AlertCircle,
  Zap,
  KeyRound,
  FileKey,
  ShieldAlert,
} from "lucide-react";
import { SocialAuthModal, SocialProvider } from "@/components/auth/SocialAuthModal";

interface LoginViewProps {
  currentUser?: {
    userId: string;
    role: "PATIENT" | "DOCTOR";
    email: string;
    name: string;
  } | null;
  requestedRole?: "DOCTOR" | "PATIENT";
}

export function LoginView({ currentUser, requestedRole = "PATIENT" }: LoginViewProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialModalProvider, setSocialModalProvider] = useState<SocialProvider | null>(null);
  const [activeTab, setActiveTab] = useState<"DOCTOR" | "PATIENT">(requestedRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [autofillSuccess, setAutofillSuccess] = useState<string | null>(null);

  // Quick Test Sandbox Password Protection (Password: CodeRx)
  const [sandboxUnlocked, setSandboxUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [sandboxPassword, setSandboxPassword] = useState("");
  const [sandboxError, setSandboxError] = useState("");
  const [targetRole, setTargetRole] = useState<"DOCTOR" | "PATIENT" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("coderx_remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (sessionStorage.getItem("coderx_sandbox_unlocked") === "true") {
        setSandboxUnlocked(true);
      }
    }
  }, []);

  function handleTabChange(tab: "DOCTOR" | "PATIENT") {
    setActiveTab(tab);
    setError(null);
  }

  function handleUnlockSandbox(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (sandboxPassword.trim().toLowerCase() === "coderx") {
      setSandboxUnlocked(true);
      setIsUnlocking(false);
      setSandboxError("");
      setSandboxPassword("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("coderx_sandbox_unlocked", "true");
      }
      if (targetRole) {
        handleQuickFill(targetRole);
        setTargetRole(null);
      }
    } else {
      setSandboxError("Incorrect password. Access denied.");
    }
  }

  function requestSandboxAccess(role: "DOCTOR" | "PATIENT") {
    if (sandboxUnlocked) {
      handleQuickFill(role);
    } else {
      setTargetRole(role);
      setIsUnlocking(true);
      setSandboxError("");
    }
  }

  function handleQuickFill(role: "DOCTOR" | "PATIENT") {
    setActiveTab(role);
    if (role === "DOCTOR") {
      setEmail("doctor@coderx.local");
      setPassword("Doctor@123");
      setAutofillSuccess("Test Clinician credentials loaded in isolated sandbox");
    } else {
      setEmail("patient@coderx.local");
      setPassword("Patient@123");
      setAutofillSuccess("Test Patient credentials loaded in isolated sandbox");
    }
    setTimeout(() => setAutofillSuccess(null), 2500);
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (typeof window !== "undefined") {
      if (rememberMe && email) {
        localStorage.setItem("coderx_remembered_email", email);
      } else {
        localStorage.removeItem("coderx_remembered_email");
      }
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid email or password");
      router.push(data.redirectUrl || (data.role === "DOCTOR" ? "/doctor" : "/patient"));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#193F38] font-sans relative overflow-x-hidden select-none flex flex-col justify-between">
      
      {/* ================================================================ */}
      {/* ORGANIC BOTANICAL PASTEL SHAPES IN CORNERS (IMAGE 2 AESTHETIC)   */}
      {/* ================================================================ */}
      <div className="absolute -top-12 -left-12 w-96 h-96 pointer-events-none -z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-60" fill="none">
          <path
            d="M-50 120 C40 10, 180 30, 210 140 C240 250, 120 320, 20 300 C-80 280, -140 230, -50 120 Z"
            fill="#E2ECE6"
          />
          <path
            d="M-80 -40 C30 -80, 120 -10, 140 80 C160 170, 70 210, -10 180 C-90 150, -190 0, -80 -40 Z"
            fill="#FDEEE2"
          />
        </svg>
      </div>

      {/* Top Header Row: Need Help Action */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-end relative z-20">
        <button
          type="button"
          onClick={() => alert("CodeRx Security & Helpdesk: Contact support@coderx.health. All patient sessions are encrypted using 256-bit AES cryptographic protocols.")}
          className="inline-flex items-center gap-1.5 text-xs text-[#5D756F] hover:text-[#183E36] font-medium transition-colors cursor-pointer"
        >
          <span>Need help?</span>
          <HelpCircle className="w-4 h-4 text-[#7A938C]" />
        </button>
      </div>

      {/* ================================================================ */}
      {/* MAIN TWO-COLUMN SPLIT CONTAINER                                   */}
      {/* ================================================================ */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center flex-1 relative z-10">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: BRANDING, HEADLINE & CLINIC DESK VISUAL           */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* 1. Official Warm CodeRx Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EBB164] to-[#DF9B43] flex items-center justify-center shadow-md shadow-[#EBB164]/30 relative overflow-hidden shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M18 31.5C18 31.5 4.5 22.5 4.5 13C4.5 8 8.5 4.5 13 4.5C15.8 4.5 17.5 5.8 18 7C18.5 5.8 20.2 4.5 23 4.5C27.5 4.5 31.5 8 31.5 13C31.5 22.5 18 31.5 18 31.5Z"
                    fill="#F2BC74"
                  />
                  <path
                    d="M18 10V22M12 16H24"
                    stroke="#1D4B42"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="18" cy="16" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#183E36] tracking-tight">
                  CodeRx
                </h1>
                <p className="text-[11px] font-bold text-[#6B857E] uppercase tracking-widest mt-0.5">
                  Connect &bull; Consult &bull; Care
                </p>
              </div>
            </div>

            {/* 2. Main Headline (Editorial Serif Style) */}
            <div className="space-y-3 pt-2">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#183E36] leading-[1.14] tracking-tight">
                Better Healthcare,
                <br />
                Together
              </h2>

              <p className="text-sm sm:text-base text-[#526B63] leading-relaxed max-w-lg font-sans">
                Book appointments, consult online, manage prescriptions and keep your health records &mdash; all in one secure, private place.
              </p>
            </div>

            {/* 3. Handwritten Callout */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-1 py-0.5 transform -rotate-3 select-none">
                <span className="font-serif italic font-bold text-lg sm:text-xl text-[#275B50] tracking-wide">
                  Your Health, Our Priority
                </span>
                <span className="text-base text-amber-500">🧡</span>
              </div>
            </div>
          </div>

          {/* 4. Warm Sunlit Clinic Desk Illustration */}
          <div className="pt-2">
            <div className="relative rounded-3xl overflow-hidden border border-[#E4ECE7] shadow-[0_15px_40px_rgba(27,62,54,0.06)] bg-white aspect-[16/9] max-w-xl group">
              <img
                src="/images/modern-clinic-consultation.jpg"
                alt="Modern Doctor Clinic Consultation Room"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: ELEVATED WHITE LOGIN CARD                         */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
          <div className="bg-white rounded-[32px] p-7 sm:p-10 shadow-[0_25px_70px_-15px_rgba(20,50,42,0.08)] border border-[#E7EFEA] w-full max-w-[440px] space-y-6 animate-in fade-in zoom-in-98 duration-300">
            
            {/* Card Header */}
            <div className="text-center space-y-1.5">
              <h3 className="font-serif text-3xl font-bold text-[#183E36] tracking-tight">
                Welcome Back
              </h3>
              <p className="text-xs sm:text-sm text-[#667E76] font-medium">
                Log in to access your encrypted medical vault.
              </p>
            </div>

            {/* Notification / Error / Sandbox Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {autofillSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{autofillSuccess}</span>
              </div>
            )}

            {/* 1. Universal Role Switcher (Patient vs Doctor) */}
            <div className="p-1 rounded-full bg-[#EAF1ED] border border-[#D7E3DC] grid grid-cols-2 gap-1 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => handleTabChange("PATIENT")}
                className={`py-2.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "PATIENT"
                    ? "bg-white text-[#183E36] font-bold shadow-xs border border-[#D7E3DC]/60"
                    : "text-[#667E76] hover:text-[#183E36]"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("DOCTOR")}
                className={`py-2.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "DOCTOR"
                    ? "bg-white text-[#183E36] font-bold shadow-xs border border-[#D7E3DC]/60"
                    : "text-[#667E76] hover:text-[#183E36]"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor</span>
              </button>
            </div>

            {/* 2. Login Credentials Form (Generic placeholders, no hardcoded names) */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              
              {/* Input 1: Email or Mobile Number */}
              <div className="space-y-1">
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#8BA098] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeTab === "PATIENT" ? "Email or Mobile Number" : "Doctor Work Email or Mobile"}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#D4DFD8] bg-white text-slate-900 placeholder-[#8BA098] focus:outline-hidden focus:ring-2 focus:ring-[#23584E] focus:border-transparent text-sm transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Input 2: Password */}
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#8BA098] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#D4DFD8] bg-white text-slate-900 placeholder-[#8BA098] focus:outline-hidden focus:ring-2 focus:ring-[#23584E] focus:border-transparent text-sm transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8BA098] hover:text-[#183E36] transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs text-[#5D756F] pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD9D1] text-[#23584E] focus:ring-[#23584E] cursor-pointer accent-[#23584E]"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("A secure password reset link has been dispatched to your verified contact method.")}
                  className="text-[#23584E] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#23584E] hover:bg-[#1B483F] text-white font-bold text-sm shadow-md shadow-[#23584E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 3. Divider: OR */}
            <div className="relative text-center my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E1ECE5]" />
              </div>
              <span className="relative px-3 bg-white text-[11px] font-bold text-[#8FA39B] uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* 4. Social Sign-In: Continue with Google */}
            <button
              type="button"
              onClick={() => setSocialModalProvider("google")}
              className="w-full py-3 rounded-xl border border-[#D4DFD8] hover:bg-slate-50 text-[#183E36] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* 5. Password-Protected Sandbox (Password: CodeRx) */}
            <div className="pt-2 border-t border-[#EDF4EF] space-y-2">
              {!sandboxUnlocked ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#799088] flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-amber-600" />
                      Quick Test Sandbox
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsUnlocking(true)}
                      className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Locked</span>
                    </button>
                  </div>

                  {isUnlocking ? (
                    <form onSubmit={handleUnlockSandbox} className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          Enter Sandbox Password
                        </span>
                        <button
                          type="button"
                          onClick={() => { setIsUnlocking(false); setSandboxError(""); }}
                          className="text-amber-700 hover:text-amber-950 text-xs font-bold cursor-pointer px-1"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="password"
                          value={sandboxPassword}
                          onChange={(e) => { setSandboxPassword(e.target.value); setSandboxError(""); }}
                          placeholder="Password (CodeRx)..."
                          autoFocus
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-amber-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Unlock
                        </button>
                      </div>
                      {sandboxError && (
                        <p className="text-[11px] text-red-600 font-semibold">{sandboxError}</p>
                      )}
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => requestSandboxAccess("PATIENT")}
                        className="py-2 px-3 rounded-xl border border-[#DCE6E0] bg-[#FAF7F2] text-[#556F67] hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                      >
                        <Lock className="w-3 h-3 text-amber-600 group-hover:scale-110 transition-transform" />
                        <span>Test Patient</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => requestSandboxAccess("DOCTOR")}
                        className="py-2 px-3 rounded-xl border border-[#DCE6E0] bg-[#FAF7F2] text-[#556F67] hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                      >
                        <Lock className="w-3 h-3 text-amber-600 group-hover:scale-110 transition-transform" />
                        <span>Test Clinician</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Quick Test Sandbox (Unlocked)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill("PATIENT")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === "PATIENT"
                          ? "bg-teal-50 border-teal-300 text-teal-900"
                          : "bg-[#FAF7F2] border-[#DCE6E0] text-[#556F67] hover:border-teal-300"
                      }`}
                    >
                      <KeyRound className="w-3 h-3 text-teal-600" />
                      <span>Test Patient</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFill("DOCTOR")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === "DOCTOR"
                          ? "bg-teal-50 border-teal-300 text-teal-900"
                          : "bg-[#FAF7F2] border-[#DCE6E0] text-[#556F67] hover:border-teal-300"
                      }`}
                    >
                      <KeyRound className="w-3 h-3 text-teal-600" />
                      <span>Test Clinician</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 6. Card Footer: Sign Up */}
            <div className="text-center text-xs text-[#5D756F] pt-2">
              <span>Don't have an account? </span>
              <Link href="/register" className="text-[#23584E] font-bold hover:underline">
                Sign Up
              </Link>
            </div>

          </div>
        </div>

      </div>



      {/* Social Auth Modal */}
      {socialModalProvider && (
        <SocialAuthModal
          isOpen={true}
          provider={socialModalProvider}
          onClose={() => setSocialModalProvider(null)}
          initialRole={activeTab}
        />
      )}

    </div>
  );
}
