"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Trash2,
  Eye,
  ShieldCheck,
  Lock,
  Check,
  ChevronLeft,
  Info,
} from "lucide-react";
import { PatientReport } from "@/lib/data/reports-data";
import { createGenericReportAnalysis } from "@/lib/data/mock-ai-generator";

interface PatientUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated?: (newReport: PatientReport) => void;
  patientName?: string;
  patientId?: string;
}

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  progress: number;
  status: "uploading" | "complete" | "error";
}

const REPORT_TYPE_OPTIONS = [
  "Auto Detect",
  "Blood Test",
  "Pathology",
  "Urine Test",
  "Stool Test",
  "Biochemistry",
  "Hematology",
  "Hormone Test",
  "Lipid Profile",
  "Diabetes / Glucose",
  "Liver Function",
  "Kidney Function",
  "Thyroid",
  "ECG",
  "Echocardiogram",
  "X-Ray",
  "CT Scan",
  "MRI",
  "Ultrasound",
  "Mammography",
  "PET Scan",
  "Radiology Report",
  "Histopathology",
  "Cytology",
  "Endoscopy",
  "Colonoscopy",
  "Pulmonary Function Test",
  "Genetic Test",
  "Microbiology",
  "Infectious Disease Test",
  "Allergy Test",
  "Discharge Summary",
  "Prescription",
  "Clinical Note",
  "Operative Report",
  "Other",
];

export function PatientUploadModal({
  isOpen,
  onClose,
  onReportCreated,
  patientName = "Sarah Johnson",
  patientId = "PT-1024",
}: PatientUploadModalProps) {
  // Step 1: "consent", Step 2: "upload"
  const [currentStep, setCurrentStep] = useState<"consent" | "upload">("consent");
  const [hasAcceptedGuidelines, setHasAcceptedGuidelines] = useState(false);

  // Upload Form State
  const [reportType, setReportType] = useState("Auto Detect");
  const [reportTitle, setReportTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ALWAYS RESET TO STEP 1 (CONSENT FORM) ON EVERY REPORT UPLOAD
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("consent");
      setHasAcceptedGuidelines(false);
      setUploadedFiles([]);
      setReportTitle("");
      setReportType("Auto Detect");
      setIsProcessing(false);
      setUploadProgress(0);
      setProcessingStage("");
      setDetectedCategory(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    const newItems: UploadedFileItem[] = Array.from(files).map((file) => {
      const isImg = file.type.startsWith("image/");
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        progress: 100,
        status: "complete",
      };
    });

    setUploadedFiles((prev) => [...prev, ...newItems]);

    // Auto-detect title if not filled
    if (!reportTitle && files[0]) {
      const cleanName = files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setReportTitle(cleanName);
    }
  }

  function handleRemoveFile(id: string) {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(10);
    setProcessingStage("Validating file integrity & image quality...");

    await new Promise((r) => setTimeout(r, 600));
    setUploadProgress(35);
    setProcessingStage("Running document classification & OCR extraction...");

    // Auto Detect classification logic
    let resolvedCategory = reportType;
    if (reportType === "Auto Detect") {
      const lower = (reportTitle + " " + uploadedFiles[0].name).toLowerCase();
      if (lower.includes("xray") || lower.includes("x-ray") || lower.includes("chest")) {
        resolvedCategory = "X-Ray";
      } else if (lower.includes("blood") || lower.includes("cbc") || lower.includes("count") || lower.includes("lipid") || lower.includes("glucose")) {
        resolvedCategory = "Blood Test";
      } else if (lower.includes("mri")) {
        resolvedCategory = "MRI";
      } else if (lower.includes("ct") || lower.includes("scan")) {
        resolvedCategory = "CT Scan";
      } else if (lower.includes("ecg") || lower.includes("ekg")) {
        resolvedCategory = "ECG";
      } else if (lower.includes("ultra") || lower.includes("usg")) {
        resolvedCategory = "Ultrasound";
      } else {
        resolvedCategory = "General Health";
      }
      setDetectedCategory(resolvedCategory);
    }

    await new Promise((r) => setTimeout(r, 600));
    setUploadProgress(65);
    setProcessingStage("Standardizing extracted biomarkers into clinical tables...");

    await new Promise((r) => setTimeout(r, 800));
    setUploadProgress(90);
    setProcessingStage("Formatting report for patient download & Dr. Aarav Mehta's OPD review...");

    await new Promise((r) => setTimeout(r, 500));
    setUploadProgress(100);
    setProcessingStage("Formatting complete! Added to your medical records.");

    const newId = `RPT-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalTitle = reportTitle.trim() || uploadedFiles[0].name.replace(/\.[^/.]+$/, "");

    const sourceFiles = uploadedFiles.map((f, i) => ({
      id: `sf-${newId}-${i}`,
      name: f.name,
      url: f.previewUrl || "/images/demo-asthma-xray.png",
      type: f.type,
      size: f.size,
      uploadDate: new Date().toISOString(),
      isImage: f.type.startsWith("image/"),
    }));

    const mockAnalysis = createGenericReportAnalysis(
      newId,
      finalTitle,
      resolvedCategory,
      patientName,
      new Date().toISOString().split("T")[0],
      [
        { name: "Clinical Index 1", current: "Normal", previous: "Normal", unit: "score", reference: "Normal", status: "NORMAL" },
        { name: "Evaluation Parameter", current: "Reviewed", previous: "Baseline", unit: "status", reference: "Clear", status: "NORMAL" },
      ]
    );

    const newReport: PatientReport = {
      id: newId,
      patientId,
      patientName,
      patientAge: 38,
      patientGender: "Female",
      patientPhone: "+1 (555) 234-5678",
      patientEmail: "sarah.johnson@example.com",
      patientLastVisit: "Sep 20, 2026",
      currentMedications: ["Ferrous Sulfate 325mg daily"],
      reportName: finalTitle,
      category: resolvedCategory as any,
      date: new Date().toISOString().split("T")[0],
      uploadedDate: new Date().toISOString(),
      referringPhysician: "Dr. Aarav Mehta",
      status: "review_required",
      reviewStatus: "unreviewed",
      summary: `Patient uploaded ${finalTitle}. Formatted and standardized for clinical review by Dr. Aarav Mehta. Informed consent verified.`,
      findings: [
        {
          name: "Diagnostic Extraction",
          current: "Indexed",
          previous: "None",
          trend: "new",
          unit: "status",
          reference: "Normal",
          status: "NORMAL",
          clinicalNote: "Automated OCR extraction and standardized formatting complete",
        },
      ],
      sourceFiles,
      aiAnalysis: mockAnalysis,
      aiAnalysisStatus: "complete",
      providerAgreement: "3/3",
      doctorReviewItemsCount: 1,
    };

    onReportCreated?.(newReport);

    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* STEPPER HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  {currentStep === "consent" ? "Patient Consent & Data Guidelines" : "Upload Medical Report"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  AES-256 E2E
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentStep === "consent"
                  ? "Required confidentiality agreement before uploading diagnostic records"
                  : "Upload files for automated extraction and standardized clinical formatting"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === "consent"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {currentStep === "upload" ? <Check className="w-3.5 h-3.5" /> : "1"}
            </span>
            <span
              className={`font-bold ${
                currentStep === "consent" ? "text-teal-950" : "text-slate-600"
              }`}
            >
              1. Guidelines &amp; Consent
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200 rounded-full" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === "upload"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </span>
            <span
              className={`font-bold ${
                currentStep === "upload" ? "text-teal-950" : "text-slate-400"
              }`}
            >
              2. Select &amp; Upload Report
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: CONSENT & GUIDELINES FORM (SHOWN BEFORE EVERY UPLOAD) */}
        {/* ------------------------------------------------------------- */}
        {currentStep === "consent" && (
          <div className="p-6 space-y-5">
            {/* Context Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Patient:</span>
                <strong className="text-slate-900 font-bold">{patientName}</strong>
                <span className="text-slate-500">({patientId})</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                <span className="text-slate-500 font-normal">Authorized Doctor:</span>
                <span>Dr. Aarav Mehta (Senior Consultant)</span>
              </div>
            </div>

            {/* Privacy & Security Guidelines Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Please Review the Data Protection &amp; Clinical Guidelines:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Rule 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-xs">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Strict Clinical Confidentiality</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>ONLY your consulting doctor (Dr. Aarav Mehta) and you</strong> have access to your uploaded reports. No third party or unauthorized hospital staff can view your records.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Zero Data Leakage or Selling</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Your medical information is <strong>never sold, shared, or leased</strong> to third-party advertisers, insurance companies, or commercial brokers.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-sky-700 font-bold text-xs">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Standardized AI Formatter Only</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    CodeRx AI only digitizes and organizes your lab numbers for easy viewing and download. <strong>AI does NOT give medical diagnoses;</strong> diagnosis remains solely with Dr. Aarav Mehta.
                  </p>
                </div>

                {/* Rule 4 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Per-Upload Consent Standard</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    In compliance with Indian Digital Data Protection and healthcare privacy norms, you authorize each uploaded document individually.
                  </p>
                </div>
              </div>
            </div>

            {/* MANDATORY CHECKBOX FORM CARD */}
            <div className="pt-2">
              <label
                htmlFor="upload-consent-checkbox"
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                  hasAcceptedGuidelines
                    ? "bg-emerald-50/80 border-emerald-400 shadow-xs"
                    : "bg-amber-50/50 border-amber-300 hover:border-amber-400"
                }`}
              >
                <input
                  type="checkbox"
                  id="upload-consent-checkbox"
                  checked={hasAcceptedGuidelines}
                  onChange={(e) => setHasAcceptedGuidelines(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500 cursor-pointer shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                    I accept the above guidelines and give my explicit informed consent to upload, format, and share this diagnostic report strictly with Dr. Aarav Mehta.
                  </span>
                  
                  <div className="flex items-center gap-2 text-[11px]">
                    {hasAcceptedGuidelines ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-black inline-flex items-center gap-1 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Consent Signed for this Report Upload</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Please check this box to unlock report upload</span>
                      </span>
                    )}
                  </div>
                </div>
              </label>
            </div>

            {/* FOOTER ACTIONS FOR STEP 1 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!hasAcceptedGuidelines}
                onClick={() => setCurrentStep("upload")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  hasAcceptedGuidelines
                    ? "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                }`}
              >
                <span>Accept Guidelines &amp; Proceed to Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: REPORT UPLOAD FORM (UNLOCKED ONLY AFTER CONSENT)     */}
        {/* ------------------------------------------------------------- */}
        {currentStep === "upload" && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Active Consent Confirmation Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 font-bold">
                  Informed Consent Signed: Authorized for Dr. Aarav Mehta (Encrypted AES-256)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("consent")}
                className="text-teal-700 hover:text-teal-900 font-bold hover:underline shrink-0 text-[11px] cursor-pointer"
              >
                Review Guidelines
              </button>
            </div>

            {/* Report Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Report Title / Description
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g., Follow-up Blood Panel, Chest X-Ray, Lipid Profile"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Report Type Selector (35+ Options + Auto Detect) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Report Type</label>
                {reportType === "Auto Detect" && (
                  <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Auto-Classification Enabled
                  </span>
                )}
              </div>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium text-slate-800"
              >
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelect(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                isDragging
                  ? "border-teal-500 bg-teal-50/60"
                  : "border-slate-300 hover:border-teal-400 bg-slate-50/60"
              }`}
            >
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop your report files here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-teal-700 hover:underline font-bold cursor-pointer"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports JPG, PNG, PDF, WEBP, Scanned lab reports
                  </p>
                </div>

                {/* Mobile "Take a photo" & File Selector */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-600" />
                    <span>Take a photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Select Document</span>
                  </button>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Uploaded File Cards */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Selected Files ({uploadedFiles.length})
                </span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {uploadedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-xs gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {Math.round(item.size / 1024)} KB &bull; {item.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                    <span>{processingStage}</span>
                  </span>
                  <span className="font-mono font-bold text-teal-700">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-teal-200/70 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep("consent")}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Guidelines</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadedFiles.length === 0 || isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? "Standardizing Report..." : "Submit & Format Report"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
