export type AIProviderName = "openai" | "claude" | "gemini";

export type AIProviderStatus = "pending" | "analyzing" | "complete" | "failed";

export type ConsensusAgreement =
  | "high_agreement" // 3/3 agree
  | "partial_agreement" // 2/3 agree
  | "disagreement" // Models differ materially
  | "insufficient_evidence"; // Low quality or inconclusive

export type FindingReviewPriority =
  | "Informational"
  | "Review"
  | "Important Review"
  | "Unable to Assess";

export type DoctorFindingReviewStatus =
  | "Reviewed"
  | "Needs further review"
  | "Not clinically relevant"
  | "Accepted for consideration"
  | "Disputed";

export interface DocumentQuality {
  adequate: boolean;
  resolution: "High" | "Medium" | "Low";
  contrast: "Optimal" | "Suboptimal" | "Poor";
  blur: "None" | "Mild" | "Significant";
  readability: "Clear" | "Partially Legible" | "Poor";
  limitations: string[];
}

export interface ExtractedDataRow {
  test: string;
  result: string;
  unit: string;
  reference: string;
  flag?: "NORMAL" | "HIGH" | "LOW" | "CRITICAL" | "ABNORMAL";
  sourceLocation?: string;
  clinicalInterpretation?: string;
}

export interface PossibleDiagnosticHypothesis {
  condition: string;
  supportingFindings: string[];
  modelAgreement: {
    openai: boolean;
    claude: boolean;
    gemini: boolean;
  };
  confidenceNote: string;
  contradictoryFindings: string[];
  missingInfo: string[];
  status: "Requires physician confirmation";
}

export interface VisualAnnotation {
  id: string;
  label: string;
  priority: FindingReviewPriority;
  coordinates: {
    x: number; // percentage from left
    y: number; // percentage from top
    width: number;
    height: number;
  };
  evidence: string;
  agreeingModels: AIProviderName[];
  disagreeingModels: AIProviderName[];
  uncertainty: string;
  doctorReviewStatus: DoctorFindingReviewStatus;
}

export interface ConsolidatedFinding {
  id: string;
  title: string;
  category: string;
  observation: string; // purely what is seen/documented
  possibleInterpretation: string; // physiological/pathological meaning
  possibleDiagnosticHypothesis: string; // possible condition consideration
  evidence: string;
  sourceLocation: string;
  priority: FindingReviewPriority;
  agreeingModels: AIProviderName[];
  disagreeingModels: AIProviderName[];
  agreementLevel: ConsensusAgreement;
  uncertainty: string;
  doctorReviewStatus: DoctorFindingReviewStatus;
  annotationId?: string;
}

export interface SingleProviderAnalysis {
  provider: AIProviderName;
  providerLabel: string;
  modelName: string;
  status: AIProviderStatus;
  errorMessage?: string;
  timestamp: string;
  documentType: string;
  documentQuality: DocumentQuality;
  observations: string[];
  extractedData: ExtractedDataRow[];
  abnormalFindings: string[];
  normalFindings: string[];
  possibleInterpretations: string[];
  possibleDiagnoses: Array<{
    condition: string;
    supportingFindings: string[];
    confidenceNote: string;
    contradictoryFindings: string[];
    missingInfo: string[];
    status: "Requires physician confirmation";
  }>;
  supportingEvidence: Array<{ claim: string; source: string }>;
  uncertainties: string[];
  physicianReviewPoints: string[];
}

export interface DisagreementItem {
  issue: string;
  openaiView: string;
  claudeView: string;
  geminiView: string;
  physicianAction: string;
}

export interface ComparisonWithPrevious {
  previousDate: string;
  previousReportId: string;
  parameters: Array<{
    name: string;
    current: string;
    previous: string;
    changeStatus: "New" | "Improved" | "Worsened" | "Stable" | "Unclear";
    note: string;
  }>;
}

export interface DoctorClinicalNote {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface SourceDocumentFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
  pageCount?: number;
  isImage?: boolean;
}

export interface ConsolidatedAIAnalysis {
  reportId: string;
  analysisVersion: string;
  analysisTimestamp: string;
  overallStatus: "analyzing" | "complete" | "partial" | "failed";
  documentSummary: string;
  documentQuality: DocumentQuality;
  ocrExtractedText?: string;
  findings: ConsolidatedFinding[];
  possibleDiagnoses: PossibleDiagnosticHypothesis[];
  disagreements: DisagreementItem[];
  uncertainties: string[];
  physicianReviewPoints: string[];
  visualAnnotations?: VisualAnnotation[];
  providerAnalyses: Record<AIProviderName, SingleProviderAnalysis>;
  comparisonWithPrevious?: ComparisonWithPrevious;
  doctorNotes: DoctorClinicalNote[];
  auditTrail: AuditLogEntry[];
}
