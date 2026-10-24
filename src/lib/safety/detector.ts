export interface SafetyCheckResult {
  flagged: boolean;
  matchedCategory: string | null;
  matchedTrigger: string | null;
  patientStatement: string | null;
  conservativeNotice: string | null;
}

interface SafetyRule {
  category: string;
  label: string;
  patterns: RegExp[];
}

const EMERGENCY_RULES: SafetyRule[] = [
  {
    category: "chest_pain",
    label: "Severe chest pain or pressure",
    patterns: [
      /\b(?:severe|crushing|heavy|radiating)\s+(?:chest\s+pain|chest\s+pressure|tightness\s+in\s+(?:my\s+)?chest)\b/i,
      /\bchest\s+pain\s+(?:and|with)\s+(?:shortness\s+of\s+breath|sweating|jaw\s+pain|left\s+arm)\b/i,
      /\b(?:heart\s+attack|crushing\s+chest)\b/i,
    ],
  },
  {
    category: "breathing_difficulty",
    label: "Severe difficulty breathing",
    patterns: [
      /\b(?:cannot|can't|unable\s+to)\s+breathe\b/i,
      /\b(?:severe|gasping\s+for|struggling\s+to)\s+(?:breath|breathing|air)\b/i,
      /\bchoking\b/i,
      /\bextreme\s+shortness\s+of\s+breath\b/i,
    ],
  },
  {
    category: "neurological_stroke",
    label: "Stroke-like or acute neurological symptoms",
    patterns: [
      /\b(?:facial\s+droop|face\s+drooping|slurred\s+speech|cannot\s+speak|unable\s+to\s+speak)\b/i,
      /\b(?:sudden\s+weakness|paralysis)\s+(?:in|on)\s+(?:one\s+side|my\s+arm|my\s+face|my\s+leg)\b/i,
      /\b(?:worst\s+headache\s+of\s+my\s+life|thunderclap\s+headache)\b/i,
    ],
  },
  {
    category: "loss_of_consciousness",
    label: "Loss of consciousness or acute unresponsiveness",
    patterns: [
      /\b(?:passed\s+out|lost\s+consciousness|blacked\s+out|unresponsive|fainted\s+and\s+can't\s+wake)\b/i,
      /\bseizure\s+(?:right\s+now|continuous|status)\b/i,
    ],
  },
  {
    category: "heavy_bleeding",
    label: "Uncontrolled heavy bleeding",
    patterns: [
      /\b(?:uncontrolled|spurting|gushing|heavy)\s+bleeding\b/i,
      /\b(?:coughing\s+up|vomiting)\s+(?:large\s+amounts\s+of\s+)?blood\b/i,
      /\bbleeding\s+(?:that\s+won't\s+stop|will\s+not\s+stop)\b/i,
    ],
  },
  {
    category: "self_harm",
    label: "Immediate risk of self-harm or crisis",
    patterns: [
      /\b(?:want\s+to\s+die|kill\s+myself|commit\s+suicide|end\s+my\s+life|harm\s+myself)\b/i,
      /\bsuicidal\s+(?:thoughts|intent|plan)\b/i,
    ],
  },
];

export const CONSERVATIVE_SAFETY_WARNING =
  "Your response may describe symptoms that require prompt medical attention. This application cannot determine whether this is an emergency. Please seek appropriate urgent medical assistance rather than relying on this appointment system.";

export const PRE_VISIT_DISCLAIMER =
  "TriageAI helps collect information before your appointment. It does not provide a diagnosis or emergency medical care. If you believe you are experiencing a medical emergency, seek emergency medical assistance immediately rather than waiting for an appointment.";

export const CLINICAL_REPORT_MANDATORY_NOTICE =
  "AI-generated pre-visit summary based on patient-reported information. It has not been independently verified and is not a diagnosis. The clinician must review the information directly with the patient.";

/**
 * Deterministic safety check on patient-provided text.
 * Conservatively identifies emergency-related language to display
 * an urgent prompt warning and flag the appointment for clinician review,
 * while preserving all original text.
 */
export function evaluateSafety(text: string): SafetyCheckResult {
  if (!text || typeof text !== "string") {
    return {
      flagged: false,
      matchedCategory: null,
      matchedTrigger: null,
      patientStatement: null,
      conservativeNotice: null,
    };
  }

  for (const rule of EMERGENCY_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          flagged: true,
          matchedCategory: rule.category,
          matchedTrigger: rule.label,
          patientStatement: text.trim(),
          conservativeNotice: CONSERVATIVE_SAFETY_WARNING,
        };
      }
    }
  }

  return {
    flagged: false,
    matchedCategory: null,
    matchedTrigger: null,
    patientStatement: null,
    conservativeNotice: null,
  };
}
