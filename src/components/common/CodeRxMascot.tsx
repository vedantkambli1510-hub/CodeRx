import React from "react";

export function CodeRxMascot({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sparkles / Doodle Lines around Mascot */}
      <path
        d="M30 65L20 60M35 50L25 40M45 40L42 28"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M170 65L180 60M165 50L175 40M155 40L158 28"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M175 100C180 95 185 98 185 105C185 110 178 115 175 118C172 115 165 110 165 105C165 98 170 95 175 100Z"
        fill="#38bdf8"
      />

      {/* Heart Body */}
      <path
        d="M100 165C100 165 30 120 30 75C30 45 55 30 80 35C92 37 98 46 100 52C102 46 108 37 120 35C145 30 170 45 170 75C170 120 100 165 100 165Z"
        fill="#93c5fd"
        stroke="#1d4ed8"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Doctor Coat (White Lower Overlay) */}
      <path
        d="M48 115C48 115 65 145 100 165C135 145 152 115 152 115L145 100L125 112L100 85L75 112L55 100L48 115Z"
        fill="#ffffff"
        stroke="#1d4ed8"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Coat Collar & Lapels */}
      <path
        d="M75 112L100 85L68 118"
        fill="#f8fafc"
        stroke="#1d4ed8"
        strokeWidth="3"
      />
      <path
        d="M125 112L100 85L132 118"
        fill="#f8fafc"
        stroke="#1d4ed8"
        strokeWidth="3"
      />

      {/* Doctor Tie */}
      <path
        d="M97 88H103L104 100L100 115L96 100L97 88Z"
        fill="#2563eb"
      />

      {/* Eyes */}
      <circle cx="82" cy="72" r="4.5" fill="#1e293b" />
      <circle cx="84" cy="70" r="1.5" fill="#ffffff" />

      <circle cx="118" cy="72" r="4.5" fill="#1e293b" />
      <circle cx="120" cy="70" r="1.5" fill="#ffffff" />

      {/* Cute Smile */}
      <path
        d="M93 80C97 85 103 85 107 80"
        stroke="#1e293b"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Rosy Cheeks */}
      <ellipse cx="72" cy="78" rx="5" ry="3.5" fill="#f472b6" opacity="0.6" />
      <ellipse cx="128" cy="78" rx="5" ry="3.5" fill="#f472b6" opacity="0.6" />

      {/* Stethoscope */}
      {/* Earpieces going into heart */}
      <path
        d="M70 102C65 115 62 135 75 145C85 152 95 148 100 135"
        stroke="#1e293b"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M130 102C135 115 138 135 125 145C115 152 105 148 100 135"
        stroke="#1e293b"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Hanging tube & Chest Piece */}
      <path
        d="M100 135V148"
        stroke="#1e293b"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx="100"
        cy="155"
        r="7"
        fill="#94a3b8"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <circle
        cx="100"
        cy="155"
        r="3"
        fill="#e2e8f0"
      />
    </svg>
  );
}
