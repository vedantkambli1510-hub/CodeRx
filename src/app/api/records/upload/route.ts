import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { extractMedicalRecord } from "@/lib/ai/coderx-ai";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const NOTICE_VERSION = "v1.2-2026";

export async function POST(req: Request) {
  try {
    const patient = await requirePatient();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const appointmentId = formData.get("appointmentId") as string | null;
    const reportTitleParam = formData.get("reportTitle") as string | null;
    const reportTypeParam = formData.get("reportType") as string | null;

    // Consent parameters from patient submission
    const storageConsent = formData.get("storageConsent") === "true";
    const aiConsent = formData.get("aiConsent") === "true";
    const doctorSharing = formData.get("doctorSharing") === "true";
    const doctorIdParam = formData.get("doctorId") as string | null;

    // 1. Storage Consent Gate: Backend enforcement
    if (!storageConsent) {
      return NextResponse.json(
        {
          error:
            "Medical report storage permission is required to save records to your CodeRx account. Storage consent was not granted.",
        },
        { status: 422 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, JPG, JPEG, PNG, and WEBP are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the 15 MB upload limit." },
        { status: 400 }
      );
    }

    // Sanitize filename and prevent path traversal
    const originalName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(originalName) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
    const storedName = `${crypto.randomUUID()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "storage", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, storedName);

    // Write file to protected local storage
    await writeFile(filePath, buffer);

    // 2. AI Processing Gate: Strictly verify patient permission before sending to Gemini AI
    let extraction: any = null;
    let processingStatus = "SKIPPED_BY_PATIENT";

    if (aiConsent) {
      try {
        extraction = await extractMedicalRecord(buffer, file.type, originalName);
        processingStatus = "COMPLETED";
      } catch (aiErr) {
        console.warn("[Gemini AI Extraction Error, continuing without AI]:", aiErr);
        processingStatus = "FAILED";
      }
    } else {
      // Patient declined AI processing: Zero data transmitted to AI provider
      console.log(`[CodeRx Consent Gate]: Patient ${patient.patientProfileId} declined AI extraction for ${originalName}. AI processing skipped.`);
    }

    // Determine reportType
    let resolvedReportType = reportTypeParam && reportTypeParam !== "Auto Detect" ? reportTypeParam : "LAB_REPORT";
    if (resolvedReportType === "Auto Detect" || !reportTypeParam) {
      const lowerName = originalName.toLowerCase();
      if (lowerName.includes("rx") || lowerName.includes("prescription")) resolvedReportType = "PRESCRIPTION";
      else if (lowerName.includes("scan") || lowerName.includes("xray") || lowerName.includes("mri") || lowerName.includes("ecg") || lowerName.includes("ct")) resolvedReportType = "SCAN";
      else resolvedReportType = "LAB_REPORT";
    }

    // 3. Doctor Sharing Gate: Verify doctor if sharing is authorized
    let verifiedDoctorId: string | null = null;
    if (doctorSharing) {
      if (doctorIdParam) {
        const doc = await prisma.doctorProfile.findUnique({ where: { id: doctorIdParam } });
        if (doc) verifiedDoctorId = doc.id;
      }
      if (!verifiedDoctorId && appointmentId) {
        const apt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (apt) verifiedDoctorId = apt.doctorId;
      }
      if (!verifiedDoctorId) {
        // Fallback to active system doctor (e.g. Dr. Aarav Mehta)
        const primaryDoc = await prisma.doctorProfile.findFirst();
        if (primaryDoc) verifiedDoctorId = primaryDoc.id;
      }
    }

    const finalReportTitle =
      reportTitleParam?.trim() ||
      extraction?.reportTitle ||
      originalName.replace(/\.[^/.]+$/, "");

    // 4. Save record with verified consent flags
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: patient.patientProfileId,
        appointmentId: appointmentId || null,
        originalName,
        storedName,
        mimeType: file.type,
        size: file.size,
        reportName: finalReportTitle,
        reportType: resolvedReportType,
        reportDate: extraction?.reportDate ? new Date(extraction.reportDate) : new Date(),
        processingStatus,
        extractedDataJson: extraction ? JSON.stringify(extraction) : null,
        storageConsent: true,
        aiConsent,
        doctorConsent: doctorSharing && !!verifiedDoctorId,
        sharedDoctorId: doctorSharing ? verifiedDoctorId : null,
      },
    });

    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "CodeRx Patient Portal";

    // 5. Persist independent audit consent records linked to this medical record
    await prisma.patientConsent.createMany({
      data: [
        {
          patientId: patient.patientProfileId,
          recordId: record.id,
          purpose: "REPORT_STORAGE",
          scope: "SINGLE_REPORT",
          noticeVersion: NOTICE_VERSION,
          decision: "GRANTED",
          source: "PATIENT_PORTAL_CONSENT_MODAL",
          ipAddress: clientIp,
          userAgent,
          accessDuration: "ACCOUNT_LIFETIME_OR_PATIENT_DELETION",
        },
        {
          patientId: patient.patientProfileId,
          recordId: record.id,
          purpose: "AI_PROCESSING",
          scope: "SINGLE_REPORT",
          noticeVersion: NOTICE_VERSION,
          decision: aiConsent ? "GRANTED" : "DECLINED",
          source: "PATIENT_PORTAL_CONSENT_MODAL",
          ipAddress: clientIp,
          userAgent,
          accessDuration: "TRANSACTIONAL_EXTRACTION",
        },
        {
          patientId: patient.patientProfileId,
          recordId: record.id,
          purpose: "DOCTOR_SHARING",
          scope: "SINGLE_REPORT",
          recipientId: verifiedDoctorId,
          noticeVersion: NOTICE_VERSION,
          decision: doctorSharing && verifiedDoctorId ? "GRANTED" : "DECLINED",
          source: "PATIENT_PORTAL_CONSENT_MODAL",
          ipAddress: clientIp,
          userAgent,
          accessDuration: "ACTIVE_EPISODE_OF_CARE",
        },
      ],
    });

    // 6. Auto-create Timeline Entry
    await prisma.medicalTimeline.create({
      data: {
        patientId: patient.patientProfileId,
        recordId: record.id,
        eventDate: record.reportDate || new Date(),
        eventType: resolvedReportType,
        title: record.reportName,
        summary: aiConsent && extraction
          ? (extraction.findings || "Uploaded diagnostic document indexed with AI standardization.")
          : "Uploaded document stored securely in your private vault (AI processing declined by patient).",
        importantFindings: extraction ? (extraction.impression || extraction.diagnosisMentioned) : null,
        medicinesJson: extraction?.medicinesExtracted ? JSON.stringify(extraction.medicinesExtracted) : null,
        doctorNotes: extraction?.doctorNotes || null,
        isKeyMilestone: extraction?.parameters?.some((p: any) => p.status === "CRITICAL" || p.status === "HIGH") || false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Medical report uploaded and stored under verified patient consent.",
      record: {
        id: record.id,
        originalName: record.originalName,
        reportName: record.reportName,
        size: record.size,
        mimeType: record.mimeType,
        createdAt: record.createdAt,
        processingStatus: record.processingStatus,
        aiConsent: record.aiConsent,
        doctorConsent: record.doctorConsent,
        sharedDoctorId: record.sharedDoctorId,
        extracted: extraction,
      },
      consentStatus: {
        storage: "GRANTED",
        aiProcessing: aiConsent ? "GRANTED" : "DECLINED",
        doctorSharing: doctorSharing && verifiedDoctorId ? "GRANTED" : "DECLINED",
      },
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN_DOCTOR_ACCESS_DENIED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    console.error("[Record Upload & Consent Error]:", error);
    return NextResponse.json({ error: "Failed to upload medical record" }, { status: 500 });
  }
}
