import {
  ConsolidatedAIAnalysis,
  SingleProviderAnalysis,
  ConsolidatedFinding,
  DisagreementItem,
  PossibleDiagnosticHypothesis,
  VisualAnnotation,
  AuditLogEntry,
  DoctorClinicalNote,
  DocumentQuality,
} from "@/lib/types/report-analysis";
import { runMultimodelComparison } from "@/lib/ai/three-provider-engine";

// -------------------------------------------------------------
// ASTHMA DEMO X-RAY REPORT ANALYSIS (Section 5, 15, 44)
// -------------------------------------------------------------
export function createAsthmaDemoAnalysis(reportId = "RPT-DEMO-ASTHMA"): ConsolidatedAIAnalysis {
  const gptAnalysis: SingleProviderAnalysis = {
    provider: "openai",
    providerLabel: "OpenAI GPT-4o Vision",
    modelName: "gpt-4o-2024-08-06",
    status: "complete",
    timestamp: "2026-09-29T10:32:15Z",
    documentType: "Comparative Posteroanterior Chest Radiograph",
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [
        "Digital composite graphic containing two comparative panels and educational labels.",
        "Single PA projection without lateral projection.",
      ],
    },
    observations: [
      "Image is a dual-panel chest radiograph comparison labelled 'NORMAL' (left) and 'ASTHMA' (right).",
      "Right panel displays bilateral pulmonary hyperinflation with increased thoracic height.",
      "Flattening of bilateral hemidiaphragmatic domes with loss of standard superior convexity.",
      "Costophrenic recesses are acute and clear without overt fluid blunting bilaterally.",
      "Cardiac silhouette size (CTR ~0.42) remains within expected limits across both panels.",
      "Graphic arrow in lower right quadrant points to gastric bubble labelled 'Fluid-Fluid Level'.",
    ],
    extractedData: [
      { test: "Right Hemidiaphragm", result: "Depressed below 10th rib", unit: "rib level", reference: "9th-10th rib", flag: "ABNORMAL", sourceLocation: "Right panel diaphragm" },
      { test: "Left Hemidiaphragm", result: "Depressed below 10th rib", unit: "rib level", reference: "9th-10th rib", flag: "ABNORMAL", sourceLocation: "Right panel diaphragm" },
      { test: "Cardiothoracic Ratio", result: "0.42", unit: "ratio", reference: "< 0.50", flag: "NORMAL", sourceLocation: "Cardiac silhouette" },
      { test: "Lung Fields", result: "Bilateral hyperlucency", unit: "visual", reference: "Normal vascularity", flag: "ABNORMAL", sourceLocation: "Mid to upper lung fields" },
    ],
    abnormalFindings: [
      "Diaphragmatic depression and flattening consistent with air trapping.",
      "Bilateral hyperlucency with expanded intercostal spaces.",
    ],
    normalFindings: [
      "Cardiothoracic ratio normal (no cardiomegaly).",
      "No focal airspace consolidations or pneumothorax visible.",
      "Mediastinum remains central.",
    ],
    possibleInterpretations: [
      "Features are consistent with acute or chronic dynamic pulmonary hyperinflation.",
      "Significantly elevated functional residual capacity (FRC) flattening the diaphragms.",
    ],
    possibleDiagnoses: [
      {
        condition: "Bilateral Thoracic Hyperinflation & Air Trapping Pattern",
        supportingFindings: ["Diaphragmatic flattening", "Bilateral hyperinflated lung fields", "Increased thoracic lucency"],
        confidenceNote: "Strong radiographic pattern agreement; requires clinician correlation.",
        contradictoryFindings: ["Normal cardiac size excludes cor pulmonale at present."],
        missingInfo: ["Spirometry / FEV1 measurement", "Clinical symptom severity score"],
        status: "Requires physician confirmation",
      },
    ],
    supportingEvidence: [
      { claim: "Diaphragmatic flattening", source: "Right image panel base" },
      { claim: "Increased thoracic volume", source: "Right panel lateral margins" },
    ],
    uncertainties: [
      "Deep inspiratory effort in an asthenic patient can simulate mild diaphragmatic flattening.",
      "Text on image ('Fluid-Fluid Level') likely refers to gastric bubble rather than effusion.",
    ],
    physicianReviewPoints: [
      "Confirm diaphragmatic contour clinically with physical auscultation.",
      "Clarify that 'Fluid-Fluid Level' text indicates gastric bubble rather than hydropneumothorax.",
    ],
  };

  const claudeAnalysis: SingleProviderAnalysis = {
    provider: "claude",
    providerLabel: "Anthropic Claude 3.5 Sonnet",
    modelName: "claude-3-5-sonnet-20241022",
    status: "complete",
    timestamp: "2026-09-29T10:32:18Z",
    documentType: "Chest X-Ray / Medical Educational Comparison",
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [
        "Educational annotations, arrows, and comparative text are burned into the image file.",
      ],
    },
    observations: [
      "PA chest radiograph showing two comparison phases: baseline normal vs hyperinflated thorax.",
      "Severe flattening of the diaphragmatic contour crossing below the 10th posterior rib.",
      "Widening of the intercostal spaces throughout the bilateral hemithoraces.",
      "Subtle peribronchial thickening ('tram-track' opacities) seen near the hilum on the right.",
      "Heart size is normal without signs of chamber dilatation.",
    ],
    extractedData: [
      { test: "Thoracic Configuration", result: "Hyperinflated barrel pattern", unit: "morphology", reference: "Normal curvature", flag: "ABNORMAL", sourceLocation: "Bilateral thoracic cage" },
      { test: "Diaphragmatic Contour", result: "Flattened / loss of dome", unit: "contour", reference: "Convex dome", flag: "ABNORMAL", sourceLocation: "Bilateral bases" },
      { test: "Peribronchial Cuffing", result: "Visible near hilum", unit: "visual", reference: "Absent", flag: "ABNORMAL", sourceLocation: "Parahilar airway axes" },
    ],
    abnormalFindings: [
      "Diaphragmatic dome depression with loss of normal radius of curvature.",
      "Thoracic cage overexpansion with increased lucency.",
      "Mild bronchial wall thickening.",
    ],
    normalFindings: [
      "Bilateral costophrenic angles sharp and clear.",
      "Mediastinal contours are unremarkable.",
    ],
    possibleInterpretations: [
      "Marked gas trapping secondary to diffuse small airway narrowing.",
      "Bronchial wall inflammation or smooth muscle spasm in reactive airway disease.",
    ],
    possibleDiagnoses: [
      {
        condition: "Thoracic Hyperinflation & Parahilar Peribronchial Pattern",
        supportingFindings: ["Overinflation with flattened low diaphragm", "Hyperinflated lungs", "Bronchial wall thickening"],
        confidenceNote: "Visual pattern noted; physical exam & spirometry required for clinical diagnosis.",
        contradictoryFindings: ["Absence of focal infiltrates."],
        missingInfo: ["Peak expiratory flow rate", "Expiratory phase radiograph"],
        status: "Requires physician confirmation",
      },
    ],
    supportingEvidence: [
      { claim: "Overinflation", source: "Right panel: text & flattened diaphragm below rib 10" },
      { claim: "Peribronchial cuffing", source: "Parahilar radiopacities" },
    ],
    uncertainties: [
      "Distinguishing pure bronchial inflammation from overlapping pulmonary vasculature on plain radiograph.",
    ],
    physicianReviewPoints: [
      "Assess for acute wheezing, chest tightness, or nocturnal cough.",
      "Correlate with past response to beta-agonist inhalation.",
    ],
  };

  const geminiAnalysis: SingleProviderAnalysis = {
    provider: "gemini",
    providerLabel: "Google Gemini 2.5 Flash",
    modelName: "gemini-2.5-flash",
    status: "complete",
    timestamp: "2026-09-29T10:32:21Z",
    documentType: "Diagnostic Chest Radiograph (Comparative Study)",
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [
        "Image contains embedded teaching annotations and graphic pointers.",
      ],
    },
    observations: [
      "Side-by-side chest X-ray comparison displaying baseline and overinflated states.",
      "Right radiograph shows increased vertical thoracic dimension and flat diaphragms.",
      "Bilateral increased pulmonary radiolucency with decreased peripheral vascular tapering.",
      "Yellow arrow points to subdiaphragmatic region labelled 'Fluid-Fluid Level'.",
      "Costophrenic angles appear preserved bilaterally without frank blunting.",
    ],
    extractedData: [
      { test: "Diaphragm Position", result: "Depressed / Flattened", unit: "morphology", reference: "Curved dome", flag: "ABNORMAL", sourceLocation: "Base bilaterally" },
      { test: "Pulmonary Radiolucency", result: "Markedly Increased", unit: "density", reference: "Normal", flag: "ABNORMAL", sourceLocation: "Bilateral lung zones" },
      { test: "Costophrenic Recesses", result: "Sharp / Clear", unit: "status", reference: "Clear", flag: "NORMAL", sourceLocation: "Bilateral recesses" },
    ],
    abnormalFindings: [
      "Flattened diaphragms suggesting thoracic hyperinflation.",
      "Widened lucent thoracic cage with air trapping.",
    ],
    normalFindings: [
      "Normal cardiac dimensions.",
      "No pneumothorax or rib pathology.",
    ],
    possibleInterpretations: [
      "Findings reflect acute bronchial obstruction or reversible air trapping.",
      "The 'Fluid-Fluid Level' label is positioned over the stomach fundus (air-fluid bubble).",
    ],
    possibleDiagnoses: [
      {
        condition: "Bilateral Diaphragmatic Depression & Hyperlucent Lung Pattern",
        supportingFindings: ["Hyperinflated lung fields", "Depressed diaphragms", "Increased lucency"],
        confidenceNote: "Typical radiological presentation; clinician review essential.",
        contradictoryFindings: ["No consolidation or atelectasis."],
        missingInfo: ["Spirometry values", "Response to inhaled bronchodilators"],
        status: "Requires physician confirmation",
      },
    ],
    supportingEvidence: [
      { claim: "Hyperinflation", source: "Visual expansion of thoracic cage on right panel" },
    ],
    uncertainties: [
      "Whether the 'Fluid-Fluid Level' label was meant as an exam question or denotes an actual abnormality; appears to be normal stomach bubble.",
    ],
    physicianReviewPoints: [
      "Confirm stomach bubble anatomy vs potential base fluid collection.",
      "Evaluate patient for signs of dynamic hyperinflation.",
    ],
  };

  return runMultimodelComparison(reportId, {
    openai: gptAnalysis,
    claude: claudeAnalysis,
    gemini: geminiAnalysis,
  });
}

// -------------------------------------------------------------
// GENERIC CLINICAL ANALYSIS FACTORY FOR OTHER REPORTS
// -------------------------------------------------------------
export function createGenericReportAnalysis(
  reportId: string,
  reportName: string,
  category: string,
  patientName: string,
  date: string,
  findingsList: Array<{ name: string; current: string; previous: string; unit: string; reference: string; status: string }>
): ConsolidatedAIAnalysis {
  const isAbnormal = findingsList.some((f) => f.status === "HIGH" || f.status === "LOW" || f.status === "CRITICAL");

  const gptObservations = findingsList.map(
    (f) => `${f.name} recorded at ${f.current} ${f.unit} (Ref: ${f.reference}). Status: ${f.status}.`
  );

  const abnormalItems = findingsList
    .filter((f) => f.status !== "NORMAL")
    .map((f) => `${f.name} is ${f.status.toLowerCase()} at ${f.current} ${f.unit} (Reference: ${f.reference}).`);

  const normalItems = findingsList
    .filter((f) => f.status === "NORMAL")
    .map((f) => `${f.name} is within reference interval (${f.current} ${f.unit}).`);

  const extractedData = findingsList.map((f, idx) => ({
    test: f.name,
    result: f.current,
    unit: f.unit,
    reference: f.reference,
    flag: f.status as any,
    sourceLocation: `Section 1, Row ${idx + 1}`,
  }));

  const singleGpt: SingleProviderAnalysis = {
    provider: "openai",
    providerLabel: "OpenAI GPT-4o Vision",
    modelName: "gpt-4o",
    status: "complete",
    timestamp: new Date().toISOString(),
    documentType: `${category} Report`,
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [],
    },
    observations: gptObservations,
    extractedData,
    abnormalFindings: abnormalItems,
    normalFindings: normalItems,
    possibleInterpretations: [
      isAbnormal
        ? "Documented parameters show deviation from established clinical reference intervals."
        : "All documented parameters reflect stable physiological baseline values.",
    ],
    possibleDiagnoses: isAbnormal
      ? [
          {
            condition: `Clinical Consideration related to ${findingsList[0]?.name || "reported parameters"}`,
            supportingFindings: abnormalItems,
            confidenceNote: "Laboratory/diagnostic correlation required; not a definitive diagnosis.",
            contradictoryFindings: [],
            missingInfo: ["Longitudinal trend history", "Comprehensive metabolic context"],
            status: "Requires physician confirmation",
          },
        ]
      : [],
    supportingEvidence: findingsList.map((f) => ({
      claim: `${f.name} value`,
      source: `Report Table: ${f.current} ${f.unit}`,
    })),
    uncertainties: ["Clinical history and concomitant medications must be verified."],
    physicianReviewPoints: ["Correlate findings with patient symptoms and medication history."],
  };

  const singleClaude: SingleProviderAnalysis = {
    provider: "claude",
    providerLabel: "Anthropic Claude 3.5 Sonnet",
    modelName: "claude-3-5-sonnet-20241022",
    status: "complete",
    timestamp: new Date().toISOString(),
    documentType: `${category} Report`,
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [],
    },
    observations: gptObservations,
    extractedData,
    abnormalFindings: abnormalItems,
    normalFindings: normalItems,
    possibleInterpretations: [
      isAbnormal
        ? "Biochemical / radiographic pattern demonstrates measurable changes requiring clinical context."
        : "Parameters are physiologically unremarkable.",
    ],
    possibleDiagnoses: isAbnormal
      ? [
          {
            condition: `Differential consideration for ${findingsList[0]?.name || "findings"}`,
            supportingFindings: abnormalItems,
            confidenceNote: "Hypothesis generated for physician review.",
            contradictoryFindings: [],
            missingInfo: ["Follow-up confirmatory panel"],
            status: "Requires physician confirmation",
          },
        ]
      : [],
    supportingEvidence: findingsList.map((f) => ({
      claim: `${f.name} result`,
      source: `Document Page 1: ${f.current} ${f.unit}`,
    })),
    uncertainties: ["Analytical variance between lab instruments."],
    physicianReviewPoints: ["Review patient compliance and repeat testing if clinically indicated."],
  };

  const singleGemini: SingleProviderAnalysis = {
    provider: "gemini",
    providerLabel: "Google Gemini 2.5 Flash",
    modelName: "gemini-2.5-flash",
    status: "complete",
    timestamp: new Date().toISOString(),
    documentType: `${category} Report`,
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [],
    },
    observations: gptObservations,
    extractedData,
    abnormalFindings: abnormalItems,
    normalFindings: normalItems,
    possibleInterpretations: [
      isAbnormal
        ? "Identified deviations suggest active monitoring or therapeutic titration."
        : "Test indices indicate preserved homeostasis.",
    ],
    possibleDiagnoses: isAbnormal
      ? [
          {
            condition: `Clinical evaluation of ${findingsList[0]?.name || "reported indices"}`,
            supportingFindings: abnormalItems,
            confidenceNote: "Decision support hypothesis; physician judgment required.",
            contradictoryFindings: [],
            missingInfo: ["Specialist clinical evaluation"],
            status: "Requires physician confirmation",
          },
        ]
      : [],
    supportingEvidence: findingsList.map((f) => ({
      claim: `${f.name} documentation`,
      source: `Source record line: ${f.current} ${f.unit}`,
    })),
    uncertainties: ["Single point-in-time assessment."],
    physicianReviewPoints: ["Evaluate patient trend against historical reports."],
  };

  const consolidatedFindings: ConsolidatedFinding[] = findingsList.map((f, i) => {
    const flag = f.status;
    const isCrit = flag === "CRITICAL" || flag === "HIGH" || flag === "LOW";
    return {
      id: `cf-${reportId}-${i}`,
      title: `${f.name}: ${f.current} ${f.unit}`,
      category,
      observation: `${f.name} measured at ${f.current} ${f.unit} compared to baseline ${f.previous} ${f.unit}.`,
      possibleInterpretation: isCrit
        ? `Value falls outside standard reference interval (${f.reference}). Indicates physiological variance.`
        : `Value is within reference interval (${f.reference}). Stable trajectory.`,
      possibleDiagnosticHypothesis: isCrit
        ? `Possible ${f.name} variance under physician consideration.`
        : "Physiologically stable parameter.",
      evidence: `Source: Document table, test index ${f.name}.`,
      sourceLocation: `Row ${i + 1}, Column 2`,
      priority: flag === "CRITICAL" ? "Important Review" : flag === "HIGH" || flag === "LOW" ? "Review" : "Informational",
      agreeingModels: ["openai", "claude", "gemini"],
      disagreeingModels: [],
      agreementLevel: "high_agreement",
      uncertainty: "Requires clinical validation.",
      doctorReviewStatus: isCrit ? "Needs further review" : "Reviewed",
    };
  });

  return {
    reportId,
    analysisVersion: "3.2.0-clinical",
    analysisTimestamp: new Date().toISOString(),
    overallStatus: "complete",
    documentSummary: `Comprehensive multi-model review by OpenAI GPT-4o, Claude 3.5 Sonnet, and Gemini 2.5 Flash for ${reportName}. ${
      isAbnormal
        ? "All three models concordantly identified parameters outside reference intervals requiring clinical review."
        : "All models concordantly verified normal diagnostic parameters without critical flags."
    }`,
    documentQuality: {
      adequate: true,
      resolution: "High",
      contrast: "Optimal",
      blur: "None",
      readability: "Clear",
      limitations: [],
    },
    findings: consolidatedFindings,
    possibleDiagnoses: isAbnormal
      ? [
          {
            condition: `Clinical Consideration for ${findingsList[0]?.name || "reported indices"}`,
            supportingFindings: abnormalItems,
            modelAgreement: { openai: true, claude: true, gemini: true },
            confidenceNote: "Consensus across all three models; requires clinical validation.",
            contradictoryFindings: [],
            missingInfo: ["Corroborating clinical notes"],
            status: "Requires physician confirmation",
          },
        ]
      : [],
    disagreements: [],
    uncertainties: ["Single timepoint measurement requires longitudinal verification."],
    physicianReviewPoints: [
      "Review flagged biometric parameters against clinical presentation.",
      "Confirm findings before discussing diagnostic implications with patient.",
    ],
    providerAnalyses: {
      openai: singleGpt,
      claude: singleClaude,
      gemini: singleGemini,
    },
    comparisonWithPrevious: {
      previousDate: "2026-07-15",
      previousReportId: `RPT-PREV-${reportId}`,
      parameters: findingsList.map((f) => ({
        name: f.name,
        current: `${f.current} ${f.unit}`,
        previous: `${f.previous} ${f.unit}`,
        changeStatus: f.status === "NORMAL" ? "Stable" : f.status === "HIGH" ? "Worsened" : "Improved",
        note: `Previous: ${f.previous} ${f.unit} → Current: ${f.current} ${f.unit}`,
      })),
    },
    doctorNotes: [],
    auditTrail: [
      {
        id: `aud-${reportId}-01`,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        action: "Report Uploaded",
        actor: `Patient (${patientName})`,
        details: `${reportName} uploaded to patient records.`,
      },
      {
        id: `aud-${reportId}-02`,
        timestamp: new Date(Date.now() - 7100000).toISOString(),
        action: "Three-AI Analysis Completed",
        actor: "CodeRx Clinical Pipeline",
        details: "OpenAI GPT-4o, Claude 3.5 Sonnet, and Gemini 2.5 Flash completed independent extraction.",
      },
    ],
  };
}
