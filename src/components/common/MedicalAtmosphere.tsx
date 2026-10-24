"use client";

import React from "react";

export function MedicalAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Subtle Clinical Hex / Cross Grid Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#0A6E82_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.035]" />

      {/* 2. Top-Left Stethoscope Clinical Watermark */}
      <div className="absolute top-16 left-6 opacity-15 text-teal-600">
        <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
          <circle cx="28" cy="22" r="4" fill="#0D9488" />
          <circle cx="68" cy="22" r="4" fill="#0D9488" />
          <path
            d="M28 22V36C28 46 38 54 48 54C58 54 68 46 68 36V22"
            stroke="#0A6E82"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M48 54V70C48 76 54 80 62 80"
            stroke="#0A6E82"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="68" cy="80" r="7" fill="#CCFBF1" stroke="#0A6E82" strokeWidth="3" />
        </svg>
      </div>

      {/* 3. Top-Right Rx Clinical Symbol */}
      <div className="absolute top-20 right-10 opacity-10 text-teal-800 font-serif font-black text-6xl">
        ℞
      </div>

      {/* 4. Bottom-Right Live ECG Heartbeat Waveform */}
      <div className="absolute bottom-8 right-10 opacity-20 text-teal-600">
        <svg className="w-36 h-12" viewBox="0 0 140 50" fill="none">
          <path
            d="M6 25H36L44 8L54 42L64 16L72 32L78 25H134"
            stroke="#0D9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 5. Bottom-Left Clinical Caduceus / Cross Badge */}
      <div className="absolute bottom-10 left-10 opacity-10 text-teal-700">
        <svg className="w-12 h-12" viewBox="0 0 40 40" fill="currentColor">
          <rect x="16" y="6" width="8" height="28" rx="2" />
          <rect x="6" y="16" width="28" height="8" rx="2" />
        </svg>
      </div>
    </div>
  );
}
