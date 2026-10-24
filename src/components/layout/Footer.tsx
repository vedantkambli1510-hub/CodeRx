"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/doctor") ||
    pathname?.startsWith("/patient") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">CodeRx Healthcare OS</span>
            <span>— “Turn Medical Records Into One Clear Patient Story.”</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Desktop-First Clinical Suite
            </span>
            <span>v2.4.0 (Connected)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
