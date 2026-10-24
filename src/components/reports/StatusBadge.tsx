"use client";

import { AlertCircle, TrendingUp, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { ReportStatus, ReviewStatus } from "@/lib/data/reports-data";

interface StatusBadgeProps {
  status: ReportStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isSm = size === "sm";

  switch (status) {
    case "review_required":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full border border-amber-500/40 bg-amber-950/60 text-amber-300 ${
            isSm ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
          }`}
        >
          <AlertCircle className={isSm ? "w-3 h-3 text-amber-400" : "w-3.5 h-3.5 text-amber-400"} />
          <span>Review Required</span>
        </span>
      );

    case "improve":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 ${
            isSm ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
          }`}
        >
          <TrendingUp className={isSm ? "w-3 h-3 text-emerald-400" : "w-3.5 h-3.5 text-emerald-400"} />
          <span>Improve</span>
        </span>
      );

    case "new_findings":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full border border-sky-500/40 bg-sky-950/60 text-sky-300 ${
            isSm ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
          }`}
        >
          <Sparkles className={isSm ? "w-3 h-3 text-sky-400" : "w-3.5 h-3.5 text-sky-400"} />
          <span>New Findings</span>
        </span>
      );

    default:
      return null;
  }
}

export function ReviewStatusBadge({ reviewStatus }: { reviewStatus: ReviewStatus }) {
  if (reviewStatus === "reviewed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-800/60">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Reviewed</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/60">
      <Clock className="w-3 h-3 text-amber-400" />
      <span>Unreviewed</span>
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
      {category}
    </span>
  );
}
