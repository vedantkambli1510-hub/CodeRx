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
  ArrowRight,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Lock,
  Check,
  ChevronLeft,
  Info,
  User,
  Heart,
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

  // Reset to Step 1 on opening
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-3xl w-full shadow-2xl border border-slate-200/90 overflow-hidden my-6 font-['Quicksand',sans-serif]">
        
        {/* ------------------------------------------------------------------ */}
        {/* 1. TOP HEADER BANNER (WARM PASTEL WITH 3D SHIELD & ENCRYPTED BADGE) */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative px-6 sm:px-8 pt-6 pb-5 bg-gradient-to-r from-[#FFF8EE] via-[#FFFBF6] to-[#FFF3F0] border-b border-[#F7EAE1]">
          {/* Subtle floating heart accents in background */}
          <div className="absolute top-4 right-28 opacity-25 select-none pointer-events-none">
            <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
          </div>
          <div className="absolute bottom-2 right-40 opacity-20 select-none pointer-events-none">
            <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: 3D Shield Graphic & Title */}
            <div className="flex items-center gap-4">
              {/* Cute 3D Medical Shield & Stethoscope Illustration */}
              <div className="shrink-0 drop-shadow-sm">
                <svg
                  className="w-16 h-16"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Soft mint base circle */}
                  <circle cx="36" cy="36" r="32" fill="#E8F8F0" />
                  {/* Medical folder background */}
                  <rect x="36" y="20" width="22" height="26" rx="4" fill="#BFDBFE" />
                  <rect x="40" y="26" width="14" height="2" rx="1" fill="#93C5FD" />
                  <rect x="40" y="31" width="10" height="2" rx="1" fill="#93C5FD" />
                  {/* Shield outer layer */}
                  <path
                    d="M32 14L48 21V36C48 48 32 58 32 58C32 58 16 48 16 36V21L32 14Z"
                    fill="#10B981"
                  />
                  {/* Shield inner highlight */}
                  <path
                    d="M32 17L45 23V36C45 46 32 55 32 55C32 55 19 46 19 36V23L32 17Z"
                    fill="#34D399"
                  />
                  {/* White heart in shield */}
                  <path
                    d="M32 40C31.2 40 25 35 25 30C25 27 27 25 29.5 25C31 25 32 26 32 26C32 26 33 25 34.5 25C37 25 39 27 39 30C39 35 32.8 40 32 40Z"
                    fill="white"
                  />
                  {/* Stethoscope wrapping */}
                  <path
                    d="M22 44C17 44 14 50 18 56C22 62 34 62 42 61"
                    stroke="#1E40AF"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle cx="43" cy="61" r="3.5" fill="#1E3A8A" />
                  {/* Small pill badge */}
                  <rect x="14" y="44" width="12" height="6" rx="3" fill="#60A5FA" transform="rotate(-15 14 44)" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#102A45] tracking-tight">
                  Patient Consent &amp; Data Guidelines
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold pt-0.5">
                  Your health information deserves care, privacy and protection.
                </p>
              </div>
            </div>

            {/* Right: "Secure & Encrypted" Badge & Close 'X' */}
            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <div className="bg-[#E7F8F1] border border-[#BDEBD7] text-[#0A7B54] px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Lock className="w-3 h-3" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-black leading-tight text-[#085F40]">
                    Secure &amp; Encrypted
                  </div>
                  <div className="text-[9px] font-bold text-[#0D9465]">
                    Your data is always protected
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 border border-slate-200/60 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. STEPPER PROGRESS INDICATOR (1 Guidelines & Consent -> 2 Upload) */}
        {/* ------------------------------------------------------------------ */}
        <div className="px-6 sm:px-8 py-3 bg-[#FAFDFE] border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                currentStep === "consent"
                  ? "bg-[#0FA968] text-white shadow-2xs"
                  : "bg-[#0FA968] text-white"
              }`}
            >
              1
            </span>
            <span
              className={`font-black text-xs ${
                currentStep === "consent" ? "text-[#0FA968]" : "text-slate-600"
              }`}
            >
              Guidelines &amp; Consent
            </span>
          </div>

          {/* Stepper Connecting Line */}
          <div className="flex-1 mx-4 max-w-xs h-[3px] bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#0FA968] transition-all duration-300 ${
                currentStep === "consent" ? "w-1/2" : "w-full"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                currentStep === "upload"
                  ? "bg-[#0FA968] text-white shadow-2xs"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </span>
            <span
              className={`font-bold text-xs ${
                currentStep === "upload" ? "text-[#0FA968]" : "text-slate-400"
              }`}
            >
              Select &amp; Upload Report
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* STEP 1: PATIENT CONSENT & GUIDELINES (MATCHES REFERENCE IMAGE!)     */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === "consent" && (
          <div className="p-6 sm:p-8 space-y-5">
            {/* Patient & Authorized Doctor Context Card */}
            <div className="bg-[#F4F9FD] border border-[#DEEDF8] rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Patient Avatar & Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-100 border-2 border-white shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                  <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#E0F2FE" />
                    {/* Hair */}
                    <path d="M12 20C12 14 15 10 20 10C25 10 28 14 28 20C28 22 28 25 28 26C28 27 26 28 25 26C24 23 24 19 24 19C24 19 21 21 16 19C16 23 16 26 15 26C14 28 12 27 12 26V20Z" fill="#78350F" />
                    {/* Face */}
                    <ellipse cx="20" cy="20" rx="6" ry="6.5" fill="#FED7AA" />
                    <circle cx="16.5" cy="21.5" r="1.2" fill="#FDA4AF" />
                    <circle cx="23.5" cy="21.5" r="1.2" fill="#FDA4AF" />
                    <circle cx="17.5" cy="19.5" r="0.8" fill="#1E293B" />
                    <circle cx="22.5" cy="19.5" r="0.8" fill="#1E293B" />
                    <path d="M18.5 22.5C19.5 23.5 20.5 23.5 21.5 22.5" stroke="#9A3412" strokeWidth="0.8" strokeLinecap="round" />
                    {/* Scrubs */}
                    <path d="M11 36C11 30 15 28 20 28C25 28 29 30 29 36" fill="#38BDF8" />
                    <path d="M16 29C16 32 18 34 20 34C22 34 24 32 24 29" stroke="#E2E8F0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <circle cx="20" cy="35" r="1" fill="#F43F5E" />
                  </svg>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500 font-medium">Patient: </span>
                  <strong className="text-slate-900 font-extrabold text-sm">
                    {patientName}
                  </strong>
                  <span className="text-slate-400 font-semibold ml-1.5">
                    ({patientId})
                  </span>
                </div>
              </div>

              {/* Right: Authorized Doctor Badge */}
              <div className="flex items-center gap-2.5 sm:border-l sm:border-[#D5E6F3] sm:pl-4 text-xs">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium leading-none">
                    Authorized Doctor: <strong className="text-slate-900 font-bold">Dr. Aarav Mehta</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold pt-0.5">
                    (Senior Consultant)
                  </div>
                </div>
              </div>
            </div>

            {/* Section Heading with Shield Icon */}
            <div className="flex items-center gap-1.5 text-xs font-black text-[#0D8466] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#0D8466]" />
              <span>PLEASE REVIEW THE DATA PROTECTION &amp; CLINICAL GUIDELINES:</span>
            </div>

            {/* 4 PASTEL GUIDELINE CARDS (2x2 GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Strict Clinical Confidentiality (Soft Mint Green) */}
              <div className="p-4 rounded-2xl bg-[#F2FAF6] border border-[#D5EFE3] space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C7EEDD] text-[#0A7B54] flex items-center justify-center shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-[#0D6246] text-xs sm:text-sm">
                    Strict Clinical Confidentiality
                  </h4>
                </div>
                <p className="text-[11px] text-[#2C5E4E] leading-relaxed font-medium">
                  <strong>ONLY your consulting doctor (Dr. Aarav Mehta)</strong> and you have access to your uploaded reports. No third party or unauthorized hospital staff can view your records.
                </p>
              </div>

              {/* Card 2: Zero Data Leakage or Selling (Soft Warm Peach) */}
              <div className="p-4 rounded-2xl bg-[#FFF6F0] border border-[#FFE3D1] space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFDFCA] text-[#D95B16] flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-[#B94709] text-xs sm:text-sm">
                    Zero Data Leakage or Selling
                  </h4>
                </div>
                <p className="text-[11px] text-[#7A4526] leading-relaxed font-medium">
                  Your medical information is <strong>never sold, shared, or leased</strong> to third-party advertisers, insurance companies, or commercial brokers.
                </p>
              </div>

              {/* Card 3: Standardized AI Formatter Only (Soft Lavender) */}
              <div className="p-4 rounded-2xl bg-[#F4F7FF] border border-[#DEE6FF] space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D8E2FF] text-[#3D5FD9] flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-[#2949B8] text-xs sm:text-sm">
                    Standardized AI Formatter Only
                  </h4>
                </div>
                <p className="text-[11px] text-[#3C4E8A] leading-relaxed font-medium">
                  CodeRx AI only digitizes and organizes your lab numbers for easy viewing and download. It does <strong>NOT</strong> give medical diagnoses, diagnosis, or advice solely with Dr. Aarav Mehta.
                </p>
              </div>

              {/* Card 4: Per-Upload Consent Standard (Soft Sky Blue) */}
              <div className="p-4 rounded-2xl bg-[#F0F8FF] border border-[#D4ECFF] space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C6E5FF] text-[#1677C4] flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-[#0E5C9A] text-xs sm:text-sm">
                    Per-Upload Consent Standard
                  </h4>
                </div>
                <p className="text-[11px] text-[#2C5270] leading-relaxed font-medium">
                  In compliance with Indian Digital Data Protection and healthcare privacy norms, you authorize each uploaded document individually.
                </p>
              </div>
            </div>

            {/* MANDATORY CHECKBOX CONSENT CARD WITH CUTE REPORT ILLUSTRATION */}
            <div className="bg-[#FAFDFB] border border-[#CDEBDC] rounded-2xl p-4 flex items-center justify-between gap-4">
              <label
                htmlFor="consent-checkbox-modal"
                className="flex items-start gap-3 cursor-pointer select-none flex-1"
              >
                <input
                  type="checkbox"
                  id="consent-checkbox-modal"
                  checked={hasAcceptedGuidelines}
                  onChange={(e) => setHasAcceptedGuidelines(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded-md text-[#0FA968] border-slate-300 focus:ring-[#0FA968] cursor-pointer shrink-0"
                />
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 text-xs sm:text-sm leading-snug block">
                    I accept the above guidelines and give my explicit informed consent to upload, format, and share this diagnostic report strictly with Dr. Aarav Mehta.
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Please check this box to unlock report upload
                  </span>
                </div>
              </label>

              {/* Cute Medical Consent Card Graphic with Heart & Green Leaves */}
              <div className="shrink-0 hidden sm:block">
                <svg className="w-20 h-16" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Sprout Leaves */}
                  <path d="M22 62C18 52 28 44 34 48C38 52 32 64 22 62Z" fill="#86EFAC" />
                  <path d="M20 62C24 54 36 56 34 64C32 68 22 68 20 62Z" fill="#4ADE80" />
                  <path d="M78 62C82 52 72 44 66 48C62 52 68 64 78 62Z" fill="#86EFAC" />
                  <path d="M80 62C76 54 64 56 66 64C68 68 78 68 80 62Z" fill="#4ADE80" />
                  {/* Clipboard Paper */}
                  <rect x="28" y="14" width="44" height="54" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2" />
                  <rect x="33" y="22" width="34" height="40" rx="5" fill="#FFFFFF" stroke="#BBF7D0" strokeWidth="1.5" />
                  {/* Heart on report */}
                  <path
                    d="M50 44C49 44 43 39 43 35C43 32.5 44.5 31 47 31C48.2 31 49.5 31.8 50 32.5C50.5 31.8 51.8 31 53 31C55.5 31 57 32.5 57 35C57 39 51 44 50 44Z"
                    fill="#38BDF8"
                  />
                  {/* Document lines */}
                  <rect x="42" y="48" width="16" height="2" rx="1" fill="#BAE6FD" />
                  <rect x="44" y="52" width="12" height="2" rx="1" fill="#BAE6FD" />
                </svg>
              </div>
            </div>

            {/* FOOTER ACTIONS: CANCEL & CORAL "ACCEPT & PROCEED" BUTTON */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-3 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!hasAcceptedGuidelines}
                onClick={() => setCurrentStep("upload")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  hasAcceptedGuidelines
                    ? "bg-gradient-to-r from-[#FF8E7F] to-[#FFA28D] hover:from-[#f87867] hover:to-[#ff9179] text-white shadow-md shadow-[#FF8E7F]/30 cursor-pointer"
                    : "bg-[#FFD3CC] text-white/90 cursor-not-allowed shadow-none"
                }`}
              >
                <span>Accept Guidelines &amp; Proceed to Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 2: REPORT UPLOAD FORM (UNLOCKED AFTER CONSENT ACCEPTANCE)     */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === "upload" && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Active Consent Confirmation Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E7F8F1] border border-[#BDEBD7] text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A7B54] shrink-0" />
                <span className="text-[#085F40] font-bold">
                  Informed Consent Signed: Authorized for Dr. Aarav Mehta (Encrypted AES-256)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("consent")}
                className="text-[#0A7B54] hover:text-[#085F40] font-bold hover:underline shrink-0 text-[11px] cursor-pointer"
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF8E7F] to-[#FFA28D] hover:from-[#f87867] hover:to-[#ff9179] text-white text-xs font-extrabold shadow-md shadow-[#FF8E7F]/30 disabled:opacity-50 transition-all cursor-pointer"
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
