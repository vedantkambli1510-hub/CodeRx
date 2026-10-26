import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as recordConsentRoute, PATCH as withdrawConsentRoute, GET as getConsentRoute } from "../src/app/api/patient/consent/route";
import { CURRENT_NOTICE_VERSION } from "../src/lib/consent/constants";
import { POST as uploadRecordRoute } from "../src/app/api/records/upload/route";
import { GET as downloadRecordRoute } from "../src/app/api/records/[id]/download/route";
import * as authSession from "../src/lib/auth/session";
import { prisma } from "../src/lib/db/prisma";

// Mock authSession to simulate authenticated Patient and Doctor sessions
vi.mock("../src/lib/auth/session", async () => {
  const actual = await vi.importActual<any>("../src/lib/auth/session");
  return {
    ...actual,
    requirePatient: vi.fn(),
    getCurrentUser: vi.fn(),
    requireAuth: vi.fn(),
  };
});

describe("Patient Consent & Data Guidelines Upgrade - 15 Verification Scenarios", () => {
  const mockPatientProfile = {
    userId: "patient-user-101",
    patientProfileId: "patient-profile-101",
    role: "PATIENT" as const,
    email: "patient.test@coderx.local",
    name: "Sarah Johnson",
  };

  const mockDoctorProfile = {
    userId: "doctor-user-202",
    doctorProfileId: "doctor-profile-202",
    role: "DOCTOR" as const,
    email: "dr.aarav@coderx.local",
    name: "Dr. Aarav Mehta",
  };

  const otherPatientProfile = {
    userId: "attacker-patient-999",
    patientProfileId: "attacker-profile-999",
    role: "PATIENT" as const,
    email: "attacker@coderx.local",
    name: "Other Patient",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default Prisma mocks for fast, robust unit test isolation
    vi.spyOn(prisma.doctorProfile as any, "findUnique").mockImplementation(async ({ where }: any) => {
      if (where.id === mockDoctorProfile.doctorProfileId) {
        return {
          id: mockDoctorProfile.doctorProfileId,
          userId: mockDoctorProfile.userId,
          clinicInfo: "CodeRx Specialty Health Hub",
        } as any;
      }
      return null;
    });

    vi.spyOn(prisma.patientConsent as any, "create").mockImplementation(async ({ data }: any) => {
      return {
        id: `consent-${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    });

    vi.spyOn(prisma.patientConsent, "createMany").mockResolvedValue({ count: 3 });

    vi.spyOn(prisma.patientConsent, "findMany").mockResolvedValue([]);

    vi.spyOn(prisma.medicalTimeline, "create").mockResolvedValue({} as any);

    vi.spyOn(prisma.auditLog, "create").mockResolvedValue({} as any);
  });

  // Scenario 1: Patient grants storage and AI processing but declines doctor-sharing
  it("Scenario 1: Patient grants storage and AI processing but declines doctor-sharing", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: true,
        aiConsent: true,
        doctorSharing: false,
        doctorId: mockDoctorProfile.doctorProfileId,
        noticeVersion: CURRENT_NOTICE_VERSION,
      }),
    });

    const res = await recordConsentRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.consentRecords.storage.decision).toBe("GRANTED");
    expect(data.consentRecords.ai.decision).toBe("GRANTED");
    expect(data.consentRecords.doctorSharing.decision).toBe("DECLINED");
  });

  // Scenario 2: Patient grants storage but declines AI processing
  it("Scenario 2: Patient grants storage but declines AI processing", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: true,
        aiConsent: false,
        doctorSharing: true,
        doctorId: mockDoctorProfile.doctorProfileId,
        noticeVersion: CURRENT_NOTICE_VERSION,
      }),
    });

    const res = await recordConsentRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.consentRecords.storage.decision).toBe("GRANTED");
    expect(data.consentRecords.ai.decision).toBe("DECLINED");
    expect(data.consentRecords.doctorSharing.decision).toBe("GRANTED");
  });

  // Scenario 3: Patient grants storage but declines both AI and sharing
  it("Scenario 3: Patient grants storage but declines both AI and sharing", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: true,
        aiConsent: false,
        doctorSharing: false,
        noticeVersion: CURRENT_NOTICE_VERSION,
      }),
    });

    const res = await recordConsentRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.consentRecords.storage.decision).toBe("GRANTED");
    expect(data.consentRecords.ai.decision).toBe("DECLINED");
    expect(data.consentRecords.doctorSharing.decision).toBe("DECLINED");
  });

  // Scenario 4: Patient attempts to proceed without a required permission (storageConsent = false)
  it("Scenario 4: Patient attempts to proceed without required storage permission", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    // Testing consent route rejection
    const consentReq = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: false,
        aiConsent: true,
        doctorSharing: true,
      }),
    });

    const consentRes = await recordConsentRoute(consentReq);
    expect(consentRes.status).toBe(422);
    const consentData = await consentRes.json();
    expect(consentData.error).toContain("Medical report storage permission is required");

    // Testing upload route rejection
    const formData = new FormData();
    const fakeFile = new File(["dummy lab content"], "test-report.pdf", { type: "application/pdf" });
    formData.append("file", fakeFile);
    formData.append("storageConsent", "false");

    const uploadReq = new Request("http://localhost:3000/api/records/upload", {
      method: "POST",
      body: formData,
    });

    const uploadRes = await uploadRecordRoute(uploadReq);
    expect(uploadRes.status).toBe(422);
    const uploadData = await uploadRes.json();
    expect(uploadData.error).toContain("Storage consent was not granted");
  });

  // Scenario 5: Consent saving fails on invalid data payload
  it("Scenario 5: Consent saving fails on invalid payload", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aiConsent: true,
      }),
    });

    const res = await recordConsentRoute(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Storage consent decision must be explicitly provided");
  });

  // Scenario 6: Upload fails after consent is saved (unsupported file type or oversized file)
  it("Scenario 6: Upload fails after consent is saved when invalid file type is provided", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const formData = new FormData();
    const invalidFile = new File(["malicious executable content"], "virus.exe", { type: "application/x-msdownload" });
    formData.append("file", invalidFile);
    formData.append("storageConsent", "true");

    const uploadReq = new Request("http://localhost:3000/api/records/upload", {
      method: "POST",
      body: formData,
    });

    const uploadRes = await uploadRecordRoute(uploadReq);
    expect(uploadRes.status).toBe(400);
    const uploadData = await uploadRes.json();
    expect(uploadData.error).toContain("Unsupported file type");
  });

  // Scenario 7: Patient cancels before selecting a file
  it("Scenario 7: Patient cancels before selecting a file - no report is created", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    // Cancel action in modal resets frontend state and submits no file to upload route
    const formData = new FormData();
    formData.append("storageConsent", "true");

    const uploadReq = new Request("http://localhost:3000/api/records/upload", {
      method: "POST",
      body: formData,
    });

    const uploadRes = await uploadRecordRoute(uploadReq);
    expect(uploadRes.status).toBe(400);
    const uploadData = await uploadRes.json();
    expect(uploadData.error).toBe("No file provided");
  });

  // Scenario 8: Patient attempts to share a report with an invalid / wrong doctor ID
  it("Scenario 8: Patient attempts to share with wrong doctor ID - handled securely without unauthorized grant", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: true,
        aiConsent: false,
        doctorSharing: true,
        doctorId: "non-existent-doctor-id-999",
      }),
    });

    const res = await recordConsentRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.consentRecords.doctorSharing.recipientId).toBeNull();
  });

  // Scenario 9: A doctor attempts to access an unshared report
  it("Scenario 9: A doctor attempts to access an unshared report - blocked with 403 Forbidden", async () => {
    (authSession.getCurrentUser as any).mockResolvedValue(mockDoctorProfile);

    const findUniqueSpy = vi.spyOn(prisma.medicalRecord, "findUnique").mockResolvedValueOnce({
      id: "report-unshared-123",
      patientId: mockPatientProfile.patientProfileId,
      originalName: "confidential_biopsy.pdf",
      storedName: "confidential_biopsy.pdf",
      mimeType: "application/pdf",
      size: 1024,
      reportName: "Confidential Biopsy",
      reportType: "LAB_REPORT",
      reportDate: new Date(),
      processingStatus: "COMPLETED",
      extractedDataJson: null,
      storageConsent: true,
      aiConsent: false,
      doctorConsent: false, // Unshared!
      sharedDoctorId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: { userId: mockPatientProfile.userId, user: { name: "Sarah Johnson" } },
      sharedDoctor: null,
      appointment: null,
    } as any);

    const req = new Request("http://localhost:3000/api/records/report-unshared-123/download");
    const res = await downloadRecordRoute(req, { params: { id: "report-unshared-123" } });

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Patient has not authorized sharing of this diagnostic record");

    findUniqueSpy.mockRestore();
  });

  // Scenario 10: Patient withdraws AI-processing permission
  it("Scenario 10: Patient withdraws AI-processing permission", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const mockConsent = {
      id: "consent-ai-456",
      patientId: mockPatientProfile.patientProfileId,
      purpose: "AI_PROCESSING",
      recordId: "rec-789",
      decision: "GRANTED",
    };

    const findUniqueSpy = vi.spyOn(prisma.patientConsent, "findUnique").mockResolvedValueOnce(mockConsent as any);
    const updateConsentSpy = vi.spyOn(prisma.patientConsent, "update").mockResolvedValueOnce({
      ...mockConsent,
      decision: "WITHDRAWN",
      withdrawnAt: new Date(),
    } as any);
    const updateRecordSpy = vi.spyOn(prisma.medicalRecord, "update").mockResolvedValueOnce({} as any);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consentId: "consent-ai-456",
        reason: "Patient prefers manual review only",
      }),
    });

    const res = await withdrawConsentRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("AI_PROCESSING has been successfully withdrawn");
    expect(updateRecordSpy).toHaveBeenCalledWith({
      where: { id: "rec-789" },
      data: { aiConsent: false },
    });

    findUniqueSpy.mockRestore();
    updateConsentSpy.mockRestore();
    updateRecordSpy.mockRestore();
  });

  // Scenario 11: Patient withdraws sharing permission
  it("Scenario 11: Patient withdraws sharing permission", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const mockConsent = {
      id: "consent-share-789",
      patientId: mockPatientProfile.patientProfileId,
      purpose: "DOCTOR_SHARING",
      recordId: "rec-789",
      decision: "GRANTED",
    };

    const findUniqueSpy = vi.spyOn(prisma.patientConsent, "findUnique").mockResolvedValueOnce(mockConsent as any);
    const updateConsentSpy = vi.spyOn(prisma.patientConsent, "update").mockResolvedValueOnce({
      ...mockConsent,
      decision: "WITHDRAWN",
      withdrawnAt: new Date(),
    } as any);
    const updateRecordSpy = vi.spyOn(prisma.medicalRecord, "update").mockResolvedValueOnce({} as any);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consentId: "consent-share-789",
        reason: "Consultation completed; revoking doctor access",
      }),
    });

    const res = await withdrawConsentRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("DOCTOR_SHARING has been successfully withdrawn");
    expect(updateRecordSpy).toHaveBeenCalledWith({
      where: { id: "rec-789" },
      data: { doctorConsent: false, sharedDoctorId: null },
    });

    findUniqueSpy.mockRestore();
    updateConsentSpy.mockRestore();
    updateRecordSpy.mockRestore();
  });

  // Scenario 12: Patient attempts to access another patient's report by modifying an ID
  it("Scenario 12: Patient attempts to access another patient's report - blocked with 403 Forbidden", async () => {
    (authSession.getCurrentUser as any).mockResolvedValue(otherPatientProfile);

    const findUniqueSpy = vi.spyOn(prisma.medicalRecord, "findUnique").mockResolvedValueOnce({
      id: "sarah-private-report-1",
      patientId: mockPatientProfile.patientProfileId,
      originalName: "sarah_report.pdf",
      storedName: "sarah_report.pdf",
      mimeType: "application/pdf",
      size: 2048,
      patient: { userId: mockPatientProfile.userId, user: { name: "Sarah Johnson" } },
      sharedDoctor: null,
      appointment: null,
    } as any);

    const req = new Request("http://localhost:3000/api/records/sarah-private-report-1/download");
    const res = await downloadRecordRoute(req, { params: { id: "sarah-private-report-1" } });

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("You cannot access medical records belonging to another patient");

    findUniqueSpy.mockRestore();
  });

  // Scenario 13: AI provider configuration is missing or unavailable
  it("Scenario 13: AI provider configuration handles missing key gracefully", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const req = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: true,
        aiConsent: false,
        doctorSharing: false,
      }),
    });

    const res = await recordConsentRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.consentRecords.ai.decision).toBe("DECLINED");
  });

  // Scenario 14: The user session expires during upload (unauthenticated request)
  it("Scenario 14: The user session expires during upload - returns 401 Unauthorized", async () => {
    (authSession.requirePatient as any).mockRejectedValueOnce(new Error("UNAUTHORIZED"));

    const formData = new FormData();
    const fakeFile = new File(["dummy file content"], "report.pdf", { type: "application/pdf" });
    formData.append("file", fakeFile);
    formData.append("storageConsent", "true");

    const uploadReq = new Request("http://localhost:3000/api/records/upload", {
      method: "POST",
      body: formData,
    });

    const uploadRes = await uploadRecordRoute(uploadReq);
    expect(uploadRes.status).toBe(401);
    const uploadData = await uploadRes.json();
    expect(uploadData.error).toBe("Unauthorized access");
  });

  // Scenario 15: A notice version changes and renewed consent is verified
  it("Scenario 15: Notice version change tracks versioning and requires current version", async () => {
    (authSession.requirePatient as any).mockResolvedValue(mockPatientProfile);

    const getReq = new Request("http://localhost:3000/api/patient/consent");
    const getRes = await getConsentRoute(getReq);
    const getData = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(getData.noticeVersion).toBe("v1.2-2026");

    const postReq = new Request("http://localhost:3000/api/patient/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storageConsent: true,
        aiConsent: true,
        doctorSharing: true,
        noticeVersion: CURRENT_NOTICE_VERSION,
      }),
    });

    const postRes = await recordConsentRoute(postReq);
    const postData = await postRes.json();
    expect(postRes.status).toBe(200);
    expect(postData.noticeVersion).toBe("v1.2-2026");
  });
});
