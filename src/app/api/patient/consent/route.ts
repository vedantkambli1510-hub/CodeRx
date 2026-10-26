import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient, getCurrentUser } from "@/lib/auth/session";
import { CURRENT_NOTICE_VERSION } from "@/lib/consent/constants";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve active consent records for the authenticated patient
 */
export async function GET(req: Request) {
  try {
    const patient = await requirePatient();
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get("recordId");

    const whereClause: any = {
      patientId: patient.patientProfileId,
    };
    if (recordId) {
      whereClause.recordId = recordId;
    }

    const consents = await prisma.patientConsent.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        recipientDoctor: {
          include: { user: { select: { name: true, email: true } } },
        },
        record: {
          select: { id: true, reportName: true, originalName: true, reportType: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      noticeVersion: CURRENT_NOTICE_VERSION,
      consents,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN_DOCTOR_ACCESS_DENIED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    console.error("[Get Consent Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve consent history" }, { status: 500 });
  }
}

/**
 * POST: Record purpose-specific consent decisions prior to or alongside report upload
 */
export async function POST(req: Request) {
  try {
    const patient = await requirePatient();
    const body = await req.json();

    const {
      storageConsent,
      aiConsent,
      doctorSharing,
      doctorId,
      noticeVersion = CURRENT_NOTICE_VERSION,
      scope = "SINGLE_REPORT",
      recordId,
    } = body;

    // Validation: storage consent must be explicitly granted if the patient intends to proceed with storage
    if (typeof storageConsent !== "boolean") {
      return NextResponse.json(
        { error: "Storage consent decision must be explicitly provided (true or false)." },
        { status: 400 }
      );
    }

    if (!storageConsent) {
      return NextResponse.json(
        {
          error: "Medical report storage permission is required to save records to your CodeRx account. Please check 'Store my medical report' to proceed.",
        },
        { status: 422 }
      );
    }

    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "CodeRx Patient Portal";

    // If doctor sharing is granted, verify doctor exists
    let verifiedDoctorId: string | null = null;
    if (doctorSharing && doctorId) {
      const doc = await prisma.doctorProfile.findUnique({
        where: { id: doctorId },
      });
      if (doc) {
        verifiedDoctorId = doc.id;
      }
    }

    // Record individual purpose-specific consent entries
    const storageRecord = await prisma.patientConsent.create({
      data: {
        patientId: patient.patientProfileId,
        purpose: "REPORT_STORAGE",
        scope,
        recordId: recordId || null,
        noticeVersion,
        decision: storageConsent ? "GRANTED" : "DECLINED",
        source: "PATIENT_PORTAL_CONSENT_MODAL",
        ipAddress: clientIp,
        userAgent,
        accessDuration: "ACCOUNT_LIFETIME_OR_PATIENT_DELETION",
      },
    });

    const aiRecord = await prisma.patientConsent.create({
      data: {
        patientId: patient.patientProfileId,
        purpose: "AI_PROCESSING",
        scope,
        recordId: recordId || null,
        noticeVersion,
        decision: aiConsent ? "GRANTED" : "DECLINED",
        source: "PATIENT_PORTAL_CONSENT_MODAL",
        ipAddress: clientIp,
        userAgent,
        accessDuration: "TRANSACTIONAL_EXTRACTION",
      },
    });

    const sharingRecord = await prisma.patientConsent.create({
      data: {
        patientId: patient.patientProfileId,
        purpose: "DOCTOR_SHARING",
        scope,
        recordId: recordId || null,
        recipientId: verifiedDoctorId,
        noticeVersion,
        decision: doctorSharing ? "GRANTED" : "DECLINED",
        source: "PATIENT_PORTAL_CONSENT_MODAL",
        ipAddress: clientIp,
        userAgent,
        accessDuration: "ACTIVE_EPISODE_OF_CARE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Granular patient consent decisions recorded successfully.",
      noticeVersion,
      consentRecords: {
        storage: { id: storageRecord.id, decision: storageRecord.decision },
        ai: { id: aiRecord.id, decision: aiRecord.decision },
        doctorSharing: {
          id: sharingRecord.id,
          decision: sharingRecord.decision,
          recipientId: verifiedDoctorId,
        },
      },
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN_DOCTOR_ACCESS_DENIED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    console.error("[Record Consent Error]:", error);
    return NextResponse.json(
      { error: "Failed to securely save consent decisions. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Withdraw consent for AI processing or Doctor sharing on a specific report or scope
 */
export async function PATCH(req: Request) {
  try {
    const patient = await requirePatient();
    const body = await req.json();
    const { consentId, recordId, purpose, reason } = body;

    if (!consentId && (!recordId || !purpose)) {
      return NextResponse.json(
        { error: "Either consentId or both recordId and purpose are required to withdraw consent." },
        { status: 400 }
      );
    }

    let targetConsent: any = null;

    if (consentId) {
      targetConsent = await prisma.patientConsent.findUnique({
        where: { id: consentId },
      });
    } else if (recordId && purpose) {
      targetConsent = await prisma.patientConsent.findFirst({
        where: {
          patientId: patient.patientProfileId,
          recordId,
          purpose,
          decision: "GRANTED",
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!targetConsent || targetConsent.patientId !== patient.patientProfileId) {
      return NextResponse.json(
        { error: "Active consent record not found or not owned by authenticated patient." },
        { status: 404 }
      );
    }

    // Mark as withdrawn
    const updatedConsent = await prisma.patientConsent.update({
      where: { id: targetConsent.id },
      data: {
        decision: "WITHDRAWN",
        withdrawnAt: new Date(),
      },
    });

    // If attached to a medical record, update the medical record flags immediately
    if (targetConsent.recordId) {
      if (targetConsent.purpose === "DOCTOR_SHARING") {
        await prisma.medicalRecord.update({
          where: { id: targetConsent.recordId },
          data: {
            doctorConsent: false,
            sharedDoctorId: null,
          },
        });
      } else if (targetConsent.purpose === "AI_PROCESSING") {
        await prisma.medicalRecord.update({
          where: { id: targetConsent.recordId },
          data: {
            aiConsent: false,
          },
        });
      }
    }

    // Create an audit trail entry
    await prisma.auditLog.create({
      data: {
        userId: patient.userId,
        action: "CONSENT_WITHDRAWN",
        details: JSON.stringify({
          purpose: targetConsent.purpose,
          recordId: targetConsent.recordId,
          reason: reason || "Patient requested withdrawal",
          withdrawnAt: new Date(),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Consent for ${targetConsent.purpose} has been successfully withdrawn. Access permissions updated immediately.`,
      consent: updatedConsent,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN_DOCTOR_ACCESS_DENIED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    console.error("[Withdraw Consent Error]:", error);
    return NextResponse.json({ error: "Failed to withdraw consent" }, { status: 500 });
  }
}
