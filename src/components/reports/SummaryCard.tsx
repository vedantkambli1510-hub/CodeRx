"use client";

import { FileText, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { ReportStatus } from "@/lib/data/reports-data";

interface SummaryCardsProps {
  totalCount: number;
  reviewRequiredCount: number;
  improveCount: number;
  newFindingsCount: number;
  activeStatusFilter: ReportStatus | "all";
  onSelectStatusFilter: (status: ReportStatus | "all") => void;
}

export function SummaryCards({
  totalCount,
  reviewRequiredCount,
  improveCount,
  newFindingsCount,
  activeStatusFilter,
  onSelectStatusFilter,
}: SummaryCardsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Reports",
      value: totalCount,
      description: "Across all patients",
      icon: FileText,
      iconColor: "text-sky-700",
      iconBg: "bg-sky-100 border border-sky-200",
      border: "border-slate-300 hover:border-slate-400",
      active: "ring-2 ring-sky-600 border-sky-600 bg-sky-50/90",
    },
    {
      id: "review_required" as const,
      label: "Review Required",
      value: reviewRequiredCount,
      description: "Require your attention",
      icon: AlertCircle,
      iconColor: "text-amber-800",
      iconBg: "bg-amber-100 border border-amber-200",
      border: "border-amber-300 hover:border-amber-400",
      active: "ring-2 ring-amber-600 border-amber-600 bg-amber-50/90",
    },
    {
      id: "improve" as const,
      label: "Improve",
      value: improveCount,
      description: "Showing improvement",
      icon: TrendingUp,
      iconColor: "text-emerald-800",
      iconBg: "bg-emerald-100 border border-emerald-200",
      border: "border-emerald-300 hover:border-emerald-400",
      active: "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50/90",
    },
    {
      id: "new_findings" as const,
      label: "New Findings",
      value: newFindingsCount,
      description: "Recently identified",
      icon: Sparkles,
      iconColor: "text-indigo-800",
      iconBg: "bg-indigo-100 border border-indigo-200",
      border: "border-indigo-300 hover:border-indigo-400",
      active: "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/90",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatusFilter(card.id)}
            className={`p-5 rounded-2xl bg-slate-50/90 border text-left transition-all shadow-xs cursor-pointer ${
              isActive ? card.active : `${card.border} hover:bg-slate-100`
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </span>
              {isActive && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-300">
                  Filtered
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 font-medium">{card.description}</p>
          </button>
        );
      })}
    </div>
  );
}
