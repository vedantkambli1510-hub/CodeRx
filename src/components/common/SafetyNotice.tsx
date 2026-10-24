import { AlertTriangle, PhoneCall } from "lucide-react";
import { CONSERVATIVE_SAFETY_WARNING } from "@/lib/safety/detector";

interface SafetyNoticeProps {
  message?: string;
  triggerContext?: string | null;
  patientStatement?: string | null;
  inline?: boolean;
}

export function SafetyNotice({
  message = CONSERVATIVE_SAFETY_WARNING,
  triggerContext,
  patientStatement,
  inline = false,
}: SafetyNoticeProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-amber-300 bg-amber-50/95 p-4 text-amber-950 shadow-sm ${
        inline ? "my-3" : "my-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-200/80 p-2 text-amber-800 shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm sm:text-base text-amber-900">
              Important Health Safety Notice
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              Prompt Attention Advised
            </span>
          </div>

          <p className="text-sm text-amber-900 leading-relaxed font-normal">{message}</p>

          {triggerContext && (
            <div className="text-xs bg-amber-100/70 p-2 rounded-lg border border-amber-200 text-amber-900">
              <span className="font-semibold">Detected Context:</span> {triggerContext}
              {patientStatement && (
                <div className="mt-1 italic text-amber-800">
                  Patient reported: &ldquo;{patientStatement}&rdquo;
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-amber-900 border-t border-amber-200/70">
            <div className="flex items-center gap-1 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>Emergency Services: Call 112 (India) / 911 / 999 or go to the nearest emergency department.</span>
            </div>
            <span className="text-amber-700 italic">
              Your questionnaire responses remain saved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
