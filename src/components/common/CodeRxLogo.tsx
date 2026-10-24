import React from "react";

interface CodeRxLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
  useImageOnly?: boolean;
}

export function CodeRxLogo({
  size = "md",
  showTagline = false,
  inverted = false,
  className = "",
  useImageOnly = false,
}: CodeRxLogoProps) {
  const iconSizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-14 h-14 rounded-2xl",
    xl: "w-20 h-20 rounded-2xl",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const taglineClasses = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  if (useImageOnly) {
    return (
      <div className={`relative ${iconSizeClasses[size]} bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden ${className}`}>
        <img
          src="/images/coderx-logo.jpg"
          alt="CodeRx Logo"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official CodeRx Logo Emblem with < / > & Pill */}
      <div
        className={`${iconSizeClasses[size]} relative flex items-center justify-center bg-white p-1 rounded-xl shadow-xs border border-slate-200/80 flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}
      >
        <img
          src="/images/coderx-logo.jpg"
          alt="CodeRx Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight font-sans ${textClasses[size]} ${
              inverted ? "text-white" : "text-[#0A2540]"
            }`}
          >
            Code<span className="text-[#00A896]">Rx</span>
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono">
            HEALTHCARE OS
          </span>
        </div>
        {showTagline && (
          <span
            className={`font-bold tracking-wider uppercase mt-1 ${taglineClasses[size]} ${
              inverted ? "text-teal-300" : "text-[#00A896]"
            }`}
          >
            CODE &bull; INNOVATE &bull; HEAL
          </span>
        )}
      </div>
    </div>
  );
}
