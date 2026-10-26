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
  ChevronDown,
  ChevronUp,
  User,
  Heart,
  ChevronLeft,
  Info,
  Check,
  Eye,
  ExternalLink,
} from "lucide-react";
import { PrivacyNoticeModal } from "@/components/privacy/PrivacyNoticeModal";

interface PatientUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated?: (newReport?: any) => void;
  patientName?: string;
  patientId?: string;
  doctorName?: string;
  doctorClinic?: string;
  doctorId?: string;
  appointmentId?: string;
}

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  progress: number;
  status: "ready" | "uploading" | "complete" | "error";
  errorMessage?: string;
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
  doctorName = "Dr. Aarav Mehta",
  doctorClinic = "CodeRx Specialty Health Hub, Suite 402",
  doctorId,
  appointmentId,
}: PatientUploadModalProps) {
  // Navigation: Step 1: "consent", Step 2: "upload"
  const [currentStep, setCurrentStep] = useState<"consent" | "upload">("consent");

  // Separate, independent consent states (All start UNCHECKED per requirements)
  const [storageConsent, setStorageConsent] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  const [doctorSharingConsent, setDoctorSharingConsent] = useState(false);

  // Expandable guideline cards state
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Validation & Backend saving state
  const [consentError, setConsentError] = useState<string | null>(null);
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Step 2: Upload Form State
  const [reportType, setReportType] = useState("Auto Detect");
  const [reportTitle, setReportTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Reset all states whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("consent");
      setStorageConsent(false);
      setAiConsent(false);
      setDoctorSharingConsent(false);
      setExpandedCard(null);
      setConsentError(null);
      setIsSubmittingConsent(false);
      setUploadedFiles([]);
      setReportTitle("");
      setReportType("Auto Detect");
      setIsProcessing(false);
      setUploadProgress(0);
      setProcessingStage("");
      setUploadError(null);
      setUploadSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function toggleCardExpand(cardId: string) {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
  }

  /**
   * Action: "Continue to Upload"
   * Validates storage choice, saves granular consents to backend, and proceeds to Step 2
   */
  async function handleContinueToUpload() {
    setConsentError(null);

    // Purpose-specific validation: Storage is required for the upload/store workflow
    if (!storageConsent) {
      setConsentError(
        "Medical report storage permission is required to save records to your CodeRx account. Please check 'Store my medical report' to proceed. AI extraction and doctor sharing remain completely optional."
      );
      return;
    }

    setIsSubmittingConsent(true);

    try {
      // Save consent decisions through backend endpoint
      const res = await fetch("/api/patient/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageConsent,
          aiConsent,
          doctorSharing: doctorSharingConsent,
          doctorId,
          scope: "SINGLE_REPORT",
          noticeVersion: "v1.2-2026",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to record your consent decisions. Please try again.");
      }

      // Success: advance to Step 2 with recorded choices
      setCurrentStep("upload");
    } catch (err: any) {
      setConsentError(err.message || "An unexpected error occurred while saving consent.");
    } finally {
      setIsSubmittingConsent(false);
    }
  }

  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const maxFileSize = 15 * 1024 * 1024; // 15MB
    const allowedMime = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    const validItems: UploadedFileItem[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedMime.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|webp)$/i)) {
        setUploadError(`Unsupported file: "${file.name}". Supported formats: PDF, JPG, PNG, WEBP.`);
        return;
      }

      if (file.size > maxFileSize) {
        setUploadError(`File "${file.name}" exceeds the 15 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        return;
      }

      const isImg = file.type.startsWith("image/");
      validItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        progress: 100,
        status: "ready",
      });
    });

    if (validItems.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validItems]);

      // Auto-populate title if not set
      if (!reportTitle && validItems[0]) {
        const cleanName = validItems[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setReportTitle(cleanName);
      }
    }
  }

  function handleRemoveFile(id: string) {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  /**
   * Action: Submit Report & Upload to Backend
   * Connects consent choices to real backend upload endpoint (/api/records/upload)
   */
  async function handleSubmitUpload(e: React.FormEvent) {
    e.preventDefault();
    if (uploadedFiles.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setUploadError(null);
    setUploadProgress(15);
    setProcessingStage("Validating file format & security credentials...");

    try {
      const targetFile = uploadedFiles[0].file;
      const formData = new FormData();
      formData.append("file", targetFile);
      formData.append("storageConsent", storageConsent ? "true" : "false");
      formData.append("aiConsent", aiConsent ? "true" : "false");
      formData.append("doctorSharing", doctorSharingConsent ? "true" : "false");

      if (reportTitle.trim()) {
        formData.append("reportTitle", reportTitle.trim());
      }
      if (reportType) {
        formData.append("reportType", reportType);
      }
      if (doctorId) {
        formData.append("doctorId", doctorId);
      }
      if (appointmentId) {
        formData.append("appointmentId", appointmentId);
      }

      setUploadProgress(35);
      if (aiConsent) {
        setProcessingStage("Analyzing document with Google Gemini AI & standardizing biomarkers...");
      } else {
        setProcessingStage("Storing document securely in your private vault (AI extraction skipped)...");
      }

      const res = await fetch("/api/records/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(75);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed. Please check your network connection and retry.");
      }

      setUploadProgress(100);
      setProcessingStage("Upload and consent indexing successfully completed!");
      setUploadSuccessMessage(
        aiConsent
          ? "Report uploaded and standardized with clinical AI tables."
          : "Report stored securely in your private account without AI extraction."
      );

      // Notify parent component to refresh records
      onReportCreated?.(data.record);

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setIsProcessing(false);
      setUploadProgress(0);
      setUploadError(err.message || "Failed to upload medical report.");
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
      >
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden my-4 font-sans">
          
          {/* ------------------------------------------------------------------ */}
          {/* 1. TOP HEADER BANNER (PRESERVED CODE RX AESTHETIC & LOGO)          */}
          {/* ------------------------------------------------------------------ */}
          <div className="relative px-6 sm:px-8 pt-5 pb-4 bg-gradient-to-r from-[#FFF8EE] via-[#FFFBF6] to-[#FFF3F0] border-b border-[#F7EAE1] shrink-0">
            {/* Subtle floating heart accents */}
            <div className="absolute top-4 right-28 opacity-25 select-none pointer-events-none">
              <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
            </div>
            <div className="absolute bottom-2 right-40 opacity-20 select-none pointer-events-none">
              <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: 3D Shield Graphic & Title */}
              <div className="flex items-center gap-3.5">
                <div className="shrink-0 drop-shadow-sm">
                  <svg
                    className="w-14 h-14"
                    viewBox="0 0 72 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="36" cy="36" r="32" fill="#E8F8F0" />
                    <rect x="36" y="20" width="22" height="26" rx="4" fill="#BFDBFE" />
                    <rect x="40" y="26" width="14" height="2" rx="1" fill="#93C5FD" />
                    <rect x="40" y="31" width="10" height="2" rx="1" fill="#93C5FD" />
                    <path
                      d="M32 14L48 21V36C48 48 32 58 32 58C32 58 16 48 16 36V21L32 14Z"
                      fill="#10B981"
                    />
                    <path
                      d="M32 17L45 23V36C45 46 32 55 32 55C32 55 19 46 19 36V23L32 17Z"
                      fill="#34D399"
                    />
                    <path
                      d="M32 40C31.2 40 25 35 25 30C25 27 27 25 29.5 25C31 25 32 26 32 26C32 26 33 25 34.5 25C37 25 39 27 39 30C39 35 32.8 40 32 40Z"
                      fill="white"
                    />
                    <path
                      d="M22 44C17 44 14 50 18 56C22 62 34 62 42 61"
                      stroke="#1E40AF"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <circle cx="43" cy="61" r="3.5" fill="#1E3A8A" />
                    <rect x="14" y="44" width="12" height="6" rx="3" fill="#60A5FA" transform="rotate(-15 14 44)" />
                  </svg>
                </div>

                <div>
                  <h2
                    id="consent-modal-title"
                    className="text-lg sm:text-xl font-black text-[#102A45] tracking-tight"
                  >
                    Patient Consent &amp; Data Guidelines
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold pt-0.5">
                    Your health information deserves care, privacy and protection.
                  </p>
                </div>
              </div>

              {/* Right: "Secure & Encrypted" Badge & Close 'X' */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <div className="bg-[#E7F8F1] border border-[#BDEBD7] text-[#0A7B54] px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xs">
                  <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Lock className="w-2.5 h-2.5" />
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

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-slate-700 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 2. STEPPER PROGRESS INDICATOR (PRESERVED)                           */}
          {/* ------------------------------------------------------------------ */}
          <div className="px-6 sm:px-8 py-2.5 bg-[#FAFDFE] border-b border-slate-200/80 flex items-center justify-between text-xs shrink-0">
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
          {/* STEP 1: PATIENT CONSENT & DATA GUIDELINES                          */}
          {/* ------------------------------------------------------------------ */}
          {currentStep === "consent" && (
            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
              
              {/* Context Bar: Patient & Authorized Doctor Cards */}
              <div className="bg-[#F4F9FD] border border-[#DEEDF8] rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Patient Information */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-100 border-2 border-white shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#E0F2FE" />
                      <path d="M12 20C12 14 15 10 20 10C25 10 28 14 28 20C28 22 28 25 28 26C28 27 26 28 25 26C24 23 24 19 24 19C24 19 21 21 16 19C16 23 16 26 15 26C14 28 12 27 12 26V20Z" fill="#78350F" />
                      <ellipse cx="20" cy="20" rx="6" ry="6.5" fill="#FED7AA" />
                      <circle cx="16.5" cy="21.5" r="1.2" fill="#FDA4AF" />
                      <circle cx="23.5" cy="21.5" r="1.2" fill="#FDA4AF" />
                      <circle cx="17.5" cy="19.5" r="0.8" fill="#1E293B" />
                      <circle cx="22.5" cy="19.5" r="0.8" fill="#1E293B" />
                      <path d="M18.5 22.5C19.5 23.5 20.5 23.5 21.5 22.5" stroke="#9A3412" strokeWidth="0.8" strokeLinecap="round" />
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

                {/* Authorized Doctor Information */}
                <div className="flex items-center gap-2.5 sm:border-l sm:border-[#D5E6F3] sm:pl-4 text-xs">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium leading-none">
                      Authorized Doctor: <strong className="text-slate-900 font-bold">{doctorName}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold pt-0.5 truncate max-w-[220px]">
                      {doctorClinic}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Heading */}
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0D8466] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#0D8466]" />
                <span>PLEASE REVIEW THE DATA PROTECTION &amp; CLINICAL GUIDELINES:</span>
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* THE 4 REPLACED GUIDELINE CARDS (WITH VERIFIED DETAILS & LINKS)      */}
              {/* ------------------------------------------------------------------ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* CARD 1 — YOUR HEALTH DATA, YOUR CONTROL (Soft Mint Green) */}
                <div className="p-3.5 rounded-2xl bg-[#F2FAF6] border border-[#D5EFE3] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-[#C7EEDD] text-[#0A7B54] flex items-center justify-center shrink-0 shadow-2xs">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-extrabold text-[#0D6246] text-xs">
                          YOUR HEALTH DATA, YOUR CONTROL
                        </h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#2C5E4E] leading-relaxed font-medium">
                      Your medical reports contain personal health information. CodeRx processes and stores information for the purposes described in its Privacy Notice. Access is restricted according to authorised permissions and applicable security controls.
                    </p>
                  </div>

                  <div className="pt-1 border-t border-[#D5EFE3]/60">
                    <button
                      type="button"
                      onClick={() => toggleCardExpand("card1")}
                      className="text-[11px] font-bold text-[#0A7B54] hover:text-[#064E3B] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>How is my data protected?</span>
                      {expandedCard === "card1" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {expandedCard === "card1" && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white/90 border border-[#C7EEDD] text-[10px] text-[#1E4D3E] space-y-1.5 animate-in fade-in duration-150">
                        <p className="font-bold text-[#0D6246]">Verified Security Architecture:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li><strong>Session Security:</strong> Authenticated sessions managed via signed JWTs in HttpOnly cookies with CSRF mitigation.</li>
                          <li><strong>Data In Transit:</strong> TLS 1.3 encryption across all client requests and database queries to Neon PostgreSQL.</li>
                          <li><strong>Password Hashing:</strong> User credentials salted and hashed using bcrypt (10 rounds).</li>
                          <li><strong>Access Controls:</strong> Server-side role authorization restricts file access to the owning patient and authorized clinicians.</li>
                          <li><em>Note:</em> Uploaded files reside in server-managed storage; CodeRx adheres to technical transparency without unverified end-to-end claims.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD 2 — NO SALE OF HEALTH DATA (Soft Warm Peach) */}
                <div className="p-3.5 rounded-2xl bg-[#FFF6F0] border border-[#FFE3D1] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-[#FFDFCA] text-[#D95B16] flex items-center justify-center shrink-0 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-extrabold text-[#B94709] text-xs">
                          NO SALE OF HEALTH DATA
                        </h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7A4526] leading-relaxed font-medium">
                      CodeRx does not sell your personal health information or use your medical reports for targeted advertising. Any permitted processing or disclosure will be explained in the Privacy Notice.
                    </p>
                  </div>

                  <div className="pt-1 border-t border-[#FFE3D1]/60">
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-[11px] font-bold text-[#D95B16] hover:text-[#B94709] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>View Privacy Notice</span>
                    </button>
                  </div>
                </div>

                {/* CARD 3 — AI-ASSISTED REPORT FORMATTING (Soft Lavender) */}
                <div className="p-3.5 rounded-2xl bg-[#F4F7FF] border border-[#DEE6FF] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-[#D8E2FF] text-[#3D5FD9] flex items-center justify-center shrink-0 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-extrabold text-[#2949B8] text-xs">
                          AI-ASSISTED REPORT FORMATTING
                        </h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#3C4E8A] leading-relaxed font-medium">
                      CodeRx may use AI-assisted tools to extract test values, organise report information and prepare readable summaries. AI-generated results may contain errors and do not replace a qualified healthcare professional’s judgement.
                    </p>
                  </div>

                  <div className="pt-1 border-t border-[#DEE6FF]/60">
                    <button
                      type="button"
                      onClick={() => toggleCardExpand("card3")}
                      className="text-[11px] font-bold text-[#3D5FD9] hover:text-[#2949B8] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>How does AI processing work?</span>
                      {expandedCard === "card3" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {expandedCard === "card3" && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white/90 border border-[#D8E2FF] text-[10px] text-[#293E80] space-y-1.5 animate-in fade-in duration-150">
                        <p className="font-bold text-[#2949B8]">Verified AI Extraction Implementation:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li><strong>Data Processed:</strong> Test biomarker names, units, numerical values, and reference ranges.</li>
                          <li><strong>AI Provider:</strong> Google Gemini API (model <code>gemini-2.5-flash</code> via official SDK).</li>
                          <li><strong>External Transmission:</strong> Original document buffer is sent to Google Gemini only if you grant AI consent below. If declined, <strong>zero data is sent to AI</strong>.</li>
                          <li><strong>Retention:</strong> Processing is transactional per upload; files are not retained for general AI model training.</li>
                          <li><strong>Verification:</strong> The original report file is always preserved for direct clinician comparison to detect any extraction errors.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD 4 — CONSENT FOR EACH PURPOSE (Soft Sky Blue) */}
                <div className="p-3.5 rounded-2xl bg-[#F0F8FF] border border-[#D4ECFF] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-[#C6E5FF] text-[#1677C4] flex items-center justify-center shrink-0 shadow-2xs">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-extrabold text-[#0E5C9A] text-xs">
                          CONSENT FOR EACH PURPOSE
                        </h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#2C5270] leading-relaxed font-medium">
                      Storing a report, processing it with AI and sharing it with a doctor are different activities. You can review these purposes separately and choose which optional activities you allow.
                    </p>
                  </div>

                  <div className="pt-1 border-t border-[#D4ECFF]/60">
                    <button
                      type="button"
                      onClick={() => toggleCardExpand("card4")}
                      className="text-[11px] font-bold text-[#1677C4] hover:text-[#0E5C9A] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Understand your choices</span>
                      {expandedCard === "card4" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {expandedCard === "card4" && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white/90 border border-[#C6E5FF] text-[10px] text-[#19476B] space-y-1 animate-in fade-in duration-150">
                        <p className="font-bold text-[#0E5C9A]">Your Independent Choices:</p>
                        <p><strong>1. Storage (Required to Upload):</strong> Stores the file in your personal patient vault so you can view/download it anytime.</p>
                        <p><strong>2. AI Processing (Optional):</strong> Automatically extracts lab values into tables. If declined, your file is stored cleanly without AI processing.</p>
                        <p><strong>3. Doctor Sharing (Optional):</strong> Grants your consulting doctor access. If declined, the file remains strictly private to you.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* 3 SEPARATE PURPOSE-SPECIFIC CONSENT CONTROLS (ALL UNCHECKED)       */}
              {/* ------------------------------------------------------------------ */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>SELECT YOUR CONSENT PREFERENCES FOR THIS UPLOAD:</span>
                  <span className="text-[10px] font-semibold text-slate-400 lowercase">
                    (unbundled &amp; independent)
                  </span>
                </div>

                {/* CONSENT A — MEDICAL REPORT STORAGE (REQUIRED FOR UPLOAD) */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    storageConsent
                      ? "bg-[#FAFDFB] border-[#0FA968] ring-1 ring-[#0FA968]/30"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <label
                    htmlFor="consent-checkbox-storage"
                    className="flex items-start gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id="consent-checkbox-storage"
                      checked={storageConsent}
                      onChange={(e) => {
                        setStorageConsent(e.target.checked);
                        if (e.target.checked) setConsentError(null);
                      }}
                      className="w-5 h-5 mt-0.5 rounded-md text-[#0FA968] border-slate-300 focus:ring-2 focus:ring-[#0FA968] focus:ring-offset-1 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          Store my medical report
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Required for Storage
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug font-medium">
                        I agree to CodeRx storing this uploaded medical report so I can access it through my account, for the purposes explained in the Privacy Notice.
                      </p>
                      <div className="pt-1 flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCardExpand("storage-retention");
                          }}
                          className="text-emerald-700 hover:underline font-bold cursor-pointer"
                        >
                          Retention &amp; Deletion Information
                        </button>
                      </div>
                    </div>
                  </label>

                  {expandedCard === "storage-retention" && (
                    <div className="mt-2.5 ml-8 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1 animate-in fade-in">
                      <p><strong>Retention Policy:</strong> Stored reports remain in your personal account indefinitely or until you manually delete them.</p>
                      <p><strong>Deletion Right:</strong> You may download, export, or request immediate deletion of any medical report at any time from your account.</p>
                    </div>
                  )}
                </div>

                {/* CONSENT B — AI-ASSISTED PROCESSING (OPTIONAL) */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    aiConsent
                      ? "bg-[#FAFDFB] border-[#0FA968] ring-1 ring-[#0FA968]/30"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <label
                    htmlFor="consent-checkbox-ai"
                    className="flex items-start gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id="consent-checkbox-ai"
                      checked={aiConsent}
                      onChange={(e) => setAiConsent(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded-md text-[#0FA968] border-slate-300 focus:ring-2 focus:ring-[#0FA968] focus:ring-offset-1 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          Allow AI-assisted report processing
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug font-medium">
                        I allow CodeRx to process this report using AI-assisted tools for digitisation, extraction and formatting, as explained above.
                      </p>
                      {!aiConsent && (
                        <p className="text-[10px] text-slate-500 font-medium italic pt-0.5">
                          If unchecked, your report is saved safely without AI extraction or transmission to Google Gemini.
                        </p>
                      )}
                    </div>
                  </label>
                </div>

                {/* CONSENT C — SHARE WITH THE SELECTED DOCTOR (OPTIONAL) */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    doctorSharingConsent
                      ? "bg-[#FAFDFB] border-[#0FA968] ring-1 ring-[#0FA968]/30"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <label
                    htmlFor="consent-checkbox-doctor"
                    className="flex items-start gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id="consent-checkbox-doctor"
                      checked={doctorSharingConsent}
                      onChange={(e) => setDoctorSharingConsent(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded-md text-[#0FA968] border-slate-300 focus:ring-2 focus:ring-[#0FA968] focus:ring-offset-1 cursor-pointer shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          Share this report with my doctor
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug font-medium">
                        I authorise CodeRx to share this selected report with the doctor shown below for the stated consultation or follow-up purpose.
                      </p>

                      {/* Display verified doctor, clinic & sharing scope */}
                      <div className="mt-1.5 p-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-[10px] text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div>
                          <span className="text-slate-400 font-medium">Doctor: </span>
                          <strong className="text-slate-900">{doctorName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Clinic: </span>
                          <span className="text-slate-800 font-semibold">{doctorClinic}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Scope: </span>
                          <span className="text-emerald-700 font-bold">This selected report only</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Purpose: </span>
                          <span className="text-slate-700">Clinical consultation &amp; review</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Message Alert */}
              {consentError && (
                <div
                  className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="font-bold block">Action Required to Proceed:</strong>
                    <span className="text-[11px] leading-relaxed">{consentError}</span>
                  </div>
                </div>
              )}

              {/* Cute Medical Illustration / Graphic Accent */}
              <div className="p-3 rounded-2xl bg-[#FAFDFB] border border-[#CDEBDC] flex items-center justify-between gap-4">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your consent choices are recorded in an audit trail and can be modified or withdrawn at any time.
                  </span>
                </div>

                <div className="shrink-0 hidden sm:block">
                  <svg className="w-16 h-12" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 62C18 52 28 44 34 48C38 52 32 64 22 62Z" fill="#86EFAC" />
                    <path d="M20 62C24 54 36 56 34 64C32 68 22 68 20 62Z" fill="#4ADE80" />
                    <path d="M78 62C82 52 72 44 66 48C62 52 68 64 78 62Z" fill="#86EFAC" />
                    <path d="M80 62C76 54 64 56 66 64C68 68 78 68 80 62Z" fill="#4ADE80" />
                    <rect x="28" y="14" width="44" height="54" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2" />
                    <rect x="33" y="22" width="34" height="40" rx="5" fill="#FFFFFF" stroke="#BBF7D0" strokeWidth="1.5" />
                    <path
                      d="M50 44C49 44 43 39 43 35C43 32.5 44.5 31 47 31C48.2 31 49.5 31.8 50 32.5C50.5 31.8 51.8 31 53 31C55.5 31 57 32.5 57 35C57 39 51 44 50 44Z"
                      fill="#38BDF8"
                    />
                    <rect x="42" y="48" width="16" height="2" rx="1" fill="#BAE6FD" />
                    <rect x="44" y="52" width="12" height="2" rx="1" fill="#BAE6FD" />
                  </svg>
                </div>
              </div>

              {/* FOOTER ACTIONS: CANCEL, PRIVACY NOTICE LINK & PRIMARY "CONTINUE TO UPLOAD" */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-3 py-2 rounded-xl hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Read Privacy Notice</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleContinueToUpload}
                  disabled={isSubmittingConsent}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-md ${
                    storageConsent
                      ? "bg-gradient-to-r from-[#FF8E7F] to-[#FFA28D] hover:from-[#f87867] hover:to-[#ff9179] text-white shadow-[#FF8E7F]/30 cursor-pointer"
                      : "bg-[#FFD3CC] text-white/95 cursor-pointer shadow-none"
                  } disabled:opacity-50`}
                >
                  {isSubmittingConsent ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Consent Decisions...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Upload</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* STEP 2: REPORT UPLOAD FORM (UNLOCKED AFTER CONSENT ACCEPTANCE)     */}
          {/* ------------------------------------------------------------------ */}
          {currentStep === "upload" && (
            <form onSubmit={handleSubmitUpload} className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
              
              {/* Recorded Consent Decision Confirmation Banner */}
              <div className="p-3 rounded-2xl bg-[#E7F8F1] border border-[#BDEBD7] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A7B54] shrink-0" />
                    <span className="text-[#085F40] font-extrabold">
                      Consent Verified &amp; Recorded
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#0A7B54] font-medium">
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-[#BDEBD7]">
                      Storage: <strong>Granted</strong>
                    </span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-[#BDEBD7]">
                      AI Processing:{" "}
                      <strong className={aiConsent ? "text-[#085F40]" : "text-slate-600"}>
                        {aiConsent ? "Enabled (Gemini)" : "Declined (Non-AI Storage)"}
                      </strong>
                    </span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-[#BDEBD7]">
                      Doctor Sharing:{" "}
                      <strong className={doctorSharingConsent ? "text-[#085F40]" : "text-slate-600"}>
                        {doctorSharingConsent ? `Authorized (${doctorName})` : "Private"}
                      </strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep("consent")}
                  disabled={isProcessing}
                  className="text-[#0A7B54] hover:text-[#085F40] font-bold hover:underline shrink-0 text-[11px] cursor-pointer self-start sm:self-center"
                >
                  Modify Choices
                </button>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Success Banner */}
              {uploadSuccessMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccessMessage}</span>
                </div>
              )}

              {/* Report Title */}
              <div className="space-y-1.5">
                <label htmlFor="report-title-input" className="text-xs font-bold text-slate-700 block">
                  Report Title / Description
                </label>
                <input
                  id="report-title-input"
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g., Follow-up Blood Panel, Chest X-Ray, Lipid Profile"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Report Type Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="report-type-select" className="text-xs font-bold text-slate-700">
                    Report Type
                  </label>
                  {reportType === "Auto Detect" && (
                    <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {aiConsent ? "AI Classification Active" : "File Classification Active"}
                    </span>
                  )}
                </div>
                <select
                  id="report-type-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium text-slate-800 cursor-pointer"
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
                      Supports PDF, JPG, JPEG, PNG, WEBP (Max 15MB)
                    </p>
                  </div>

                  {/* Quick Select Buttons */}
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
                  accept="image/*,application/pdf"
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
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
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
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 shrink-0">
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
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload &amp; Save Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Standalone accessible Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
}
