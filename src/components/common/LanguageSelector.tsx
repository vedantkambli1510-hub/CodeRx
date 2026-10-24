"use client";

import { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "@/lib/i18n/LanguageContext";

export function LanguageSelector({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white/95 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        title="Change Language / भाषा बदलें"
      >
        <span className="text-sm">{currentOption.flag}</span>
        <Languages className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <span className={compact ? "hidden sm:inline" : ""}>
          {currentOption.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-300 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 text-slate-900">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Select Language / भाषा</span>
            <span className="text-sky-600 font-mono">10 Indian Langs</span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
            {SUPPORTED_LANGUAGES.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-sky-50 text-sky-900 font-bold"
                      : "text-slate-700 hover:bg-slate-100/80 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.flag}</span>
                    <div>
                      <div className="font-bold">{opt.nativeName}</div>
                      <div className="text-[10px] text-slate-500">{opt.name}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
