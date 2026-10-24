"use client";

import { useEffect } from "react";
import { AboutCodeRxView } from "./AboutCodeRxView";

interface AboutCodeRxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutCodeRxModal({ isOpen, onClose }: AboutCodeRxModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-6xl my-auto animate-in zoom-in-95 duration-200">
        <AboutCodeRxView onClose={onClose} isModal={true} />
      </div>
    </div>
  );
}
