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
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(req: Request) {
  try {
    const patient = await requirePatient();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const appointmentId = formData.get("appointmentId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, JPG, JPEG, and PNG are allowed." },
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

    // AI Medical Report Reading (Requirement 3)
    const extraction = await extractMedicalRecord(
      buffer,
      file.type,
      originalName
    );

    // Determine reportType
    let reportType = "LAB_REPORT";
    const lowerName = originalName.toLowerCase();
    if (lowerName.includes("rx") || lowerName.includes("prescription")) reportType = "PRESCRIPTION";
    else if (lowerName.includes("scan") || lowerName.includes("xray") || lowerName.includes("mri") || lowerName.includes("ecg")) reportType = "SCAN";

    // Save record with AI structured JSON
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: patient.patientProfileId,
        appointmentId: appointmentId || null,
        originalName,
        storedName,
        mimeType: file.type,
        size: file.size,
        reportName: extraction.reportTitle || originalName.replace(/\.[^/.]+$/, ""),
        reportType,
        reportDate: extraction.reportDate ? new Date(extraction.reportDate) : new Date(),
        processingStatus: "COMPLETED",
        extractedDataJson: JSON.stringify(extraction),
      },
    });

    // Auto-create Timeline Entry (Requirement 4)
    await prisma.medicalTimeline.create({
      data: {
        patientId: patient.patientProfileId,
        recordId: record.id,
        eventDate: record.reportDate || new Date(),
        eventType: reportType,
        title: record.reportName,
        summary: extraction.findings || "Uploaded diagnostic document indexed by CodeRx.",
        importantFindings: extraction.impression || extraction.diagnosisMentioned,
        medicinesJson: extraction.medicinesExtracted ? JSON.stringify(extraction.medicinesExtracted) : null,
        doctorNotes: extraction.doctorNotes,
        isKeyMilestone: extraction.parameters?.some((p) => p.status === "CRITICAL" || p.status === "HIGH"),
      },
    });

    return NextResponse.json({
      success: true,
      record: {
        id: record.id,
        originalName: record.originalName,
        reportName: record.reportName,
        size: record.size,
        mimeType: record.mimeType,
        createdAt: record.createdAt,
        extracted: extraction,
      },
    });
  } catch (error) {
    console.error("[Record Upload & AI Extraction Error]:", error);
    return NextResponse.json({ error: "Failed to upload and extract medical record" }, { status: 500 });
  }
}
