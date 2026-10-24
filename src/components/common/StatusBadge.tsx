interface StatusBadgeProps {
  status: string;
  type?: "appointment" | "intake" | "report";
}

export function StatusBadge({ status, type = "appointment" }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  let label = status;

  if (normalized === "SCHEDULED") {
    colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
    label = "Scheduled";
  } else if (normalized === "COMPLETED") {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
    label = "Completed";
  } else if (normalized === "CANCELLED") {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
    label = "Cancelled";
  } else if (normalized === "NOT_STARTED") {
    colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
    label = "Not Started";
  } else if (normalized === "IN_PROGRESS") {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
    label = "In Progress";
  } else if (normalized === "READY") {
    colorClasses = "bg-tealbrand-50 text-tealbrand-700 border-tealbrand-200";
    label = "Report Ready";
  } else if (normalized === "NEEDS_REVIEW") {
    colorClasses = "bg-amber-100 text-amber-900 border-amber-300 font-semibold";
    label = "Needs Review";
  } else if (normalized === "REVIEWED") {
    colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium";
    label = "Reviewed";
  } else if (normalized === "AVAILABLE") {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
    label = "Available";
  } else if (normalized === "BOOKED") {
    colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
    label = "Booked";
  } else if (normalized === "BLOCKED") {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
    label = "Blocked";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {label}
    </span>
  );
}
