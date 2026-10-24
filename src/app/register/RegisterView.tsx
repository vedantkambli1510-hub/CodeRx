"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
  Heart,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Phone,
} from "lucide-react";
import { CodeRxLogo } from "@/components/common/CodeRxLogo";
import { SocialAuthModal, SocialProvider } from "@/components/auth/SocialAuthModal";

interface RegisterViewProps {
  initialRole?: "DOCTOR" | "PATIENT";
}

export function RegisterView({ initialRole = "PATIENT" }: RegisterViewProps) {
  const router = useRouter();

  const [role, setRole] = useState<"DOCTOR" | "PATIENT">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialModalProvider, setSocialModalProvider] = useState<SocialProvider | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push(data.redirectUrl || (role === "DOCTOR" ? "/doctor" : "/patient"));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-stretch p-3 sm:p-5 lg:p-6 bg-[#eef2f6] text-slate-800 relative overflow-hidden">
      
      {/* Main Full-Screen Frame */}
      <div className="w-full max-w-[1600px] mx-auto rounded-3xl overflow-hidden border border-slate-300 bg-slate-100/90 grid grid-cols-1 lg:grid-cols-12 min-h-[720px] shadow-xl relative z-10">
        
        {/* Left Column: Soothing Showcase (Light Theme - Not White) */}
        <div className="lg:col-span-6 xl:col-span-6 bg-gradient-to-br from-slate-200/90 via-slate-100 to-slate-200/80 p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-300 relative">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/90 border border-slate-300 text-xs font-bold text-slate-800 shadow-xs">
              <span className="text-sm">🏥</span>
              <span className="text-sky-700">Clinic Onboarding</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700">New Account</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="inline-block bg-white p-2.5 rounded-2xl shadow-xs border border-slate-200">
                <CodeRxLogo size="md" showTagline={true} />
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Join CodeRx <br />
                <span className="bg-gradient-to-r from-sky-700 via-teal-600 to-indigo-700 bg-clip-text text-transparent">
                  Healthcare Platform.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-md font-normal leading-relaxed">
                Connect your medical journey with automated longitudinal timelines, real-time lab
                differentials, and instant medicine order management.
              </p>
            </div>
          </div>

          <div className="space-y-3 my-8">
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-300/80 flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300/70 flex items-center justify-center text-lg text-sky-800 shrink-0">
                🩺
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">For Doctors & Clinics</h4>
                <p className="text-xs text-slate-600 mt-0.5">Differential AI diagnosis, Tata 1mg medicine integration & rapid review tools.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-300/80 flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300/70 flex items-center justify-center text-lg text-teal-800 shrink-0">
                💖
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">For Patients & Caregivers</h4>
                <p className="text-xs text-slate-600 mt-0.5">Complete chronological health timeline, dynamic lab trend graphs & prescription access.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>HIPAA Compliant • Encrypted Records</span>
            </div>
            <span>Fast Setup in 30 Seconds</span>
          </div>

        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-6 xl:col-span-6 bg-slate-50/80 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          
          <div className="space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-300">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Register as a Doctor or Patient
                </p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 shadow-xs">
                <Heart className="w-5 h-5" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Social fast sign up */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                Fast Sign Up
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSocialModalProvider("google")}
                  className="h-10 flex items-center justify-center gap-1.5 px-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSocialModalProvider("apple")}
                  className="h-10 flex items-center justify-center gap-1.5 px-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.89-11.89-14.43-6.22-9.67-11.14-20.91-14.77-33.72-3.63-12.81-5.45-24.87-5.45-36.18 0-16.14 4.13-29.35 12.39-39.63 8.26-10.28 18.66-15.54 31.2-15.78 4.79 0 10.21 1.25 16.27 3.76 6.06 2.5 10.02 3.82 11.89 3.94 1.5.12 5.66-1.25 12.48-4.12 6.82-2.88 12.63-4.19 17.43-3.95 13.43.76 24.23 5.75 32.41 14.99-11.66 7.07-17.38 16.89-17.15 29.47.24 10.08 4.11 18.59 11.62 25.53 7.51 6.94 16.48 10.97 26.92 12.09-2.18 6.54-4.8 13.08-7.86 19.63zm-30.82-108.9c0-6.75 2.5-13.13 7.51-19.14 5.01-6.01 11.27-9.84 18.79-11.49.25 1.5.38 2.88.38 4.13 0 6.63-2.58 13.14-7.75 19.52-5.17 6.39-11.48 10.02-18.93 10.9-.38-1.38-.57-2.67-.57-3.92z" />
                  </svg>
                  <span>Apple ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSocialModalProvider("phone")}
                  className="h-10 flex items-center justify-center gap-1.5 px-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-emerald-800 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone OTP</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
                <span className="bg-slate-50 px-3 text-slate-500">OR REGISTER WITH EMAIL</span>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-200/90 rounded-2xl border border-slate-300">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "PATIENT"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("DOCTOR")}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "DOCTOR"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "DOCTOR" ? "Dr. Priya Patel" : "Anita Roy"}
                  required
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-slate-100 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-slate-100 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-slate-100 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-slate-100 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create {role === "DOCTOR" ? "Doctor" : "Patient"} Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
            <div>
              Already have an account?{" "}
              <Link href={`/login?role=${role}`} className="font-bold text-sky-700 hover:underline">
                Sign In
              </Link>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">CodeRx v2.4</div>
          </div>

        </div>

      </div>

      <SocialAuthModal
        isOpen={!!socialModalProvider}
        provider={socialModalProvider}
        onClose={() => setSocialModalProvider(null)}
        initialRole={role}
      />
    </div>
  );
}
