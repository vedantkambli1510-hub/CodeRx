import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ label = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <Loader2 className={`${iconSizes[size]} animate-spin text-brand-600 mb-2`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
