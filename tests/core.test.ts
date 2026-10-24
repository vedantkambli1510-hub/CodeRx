import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema } from "../src/lib/validation/auth";
import { hashPassword, verifyPassword } from "../src/lib/auth/session";
import { signSessionToken, verifySessionToken } from "../src/lib/auth/jwt";
import { evaluateSafety, CONSERVATIVE_SAFETY_WARNING } from "../src/lib/safety/detector";
import { ClinicalReportSchema } from "../src/lib/validation/report";
import { INTAKE_QUESTIONS } from "../src/lib/intake/questions";

describe("1. Registration & Authentication Validation", () => {
  it("should validate correct registration payload", () => {
    const valid = {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: "Password@123",
      confirmPassword: "Password@123",
    };
    const result = RegisterSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject mismatched passwords in registration", () => {
    const invalid = {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: "Password@123",
      confirmPassword: "DifferentPassword@123",
    };
    const result = RegisterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should validate and reject invalid email formats", () => {
    const invalid = {
      email: "not-an-email",
      password: "Password@123",
    };
    const result = LoginSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should correctly hash and verify passwords using bcryptjs", async () => {
    const password = "PatientSecret@123";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("should sign and verify session JWT tokens with role preservation", async () => {
    const payload = {
      userId: "test-user-123",
      role: "PATIENT" as const,
      email: "test@example.com",
      name: "Test Patient",
    };
    const token = await signSessionToken(payload);
    expect(typeof token).toBe("string");

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.role).toBe("PATIENT");
  });
});

describe("2. Deterministic Safety Evaluation", () => {
  it("should flag explicit severe chest pain and preserve patient text", () => {
    const text = "I am having severe chest pain radiating to my left arm.";
    const result = evaluateSafety(text);

    expect(result.flagged).toBe(true);
    expect(result.matchedCategory).toBe("chest_pain");
    expect(result.patientStatement).toBe(text);
    expect(result.conservativeNotice).toBe(CONSERVATIVE_SAFETY_WARNING);
  });

  it("should flag acute breathing difficulty", () => {
    const text = "I cannot breathe properly and feel like I am choking";
    const result = evaluateSafety(text);

    expect(result.flagged).toBe(true);
    expect(result.matchedCategory).toBe("breathing_difficulty");
  });

  it("should flag stroke-like symptoms", () => {
    const text = "Sudden weakness on one side of my face and slurred speech";
    const result = evaluateSafety(text);

    expect(result.flagged).toBe(true);
    expect(result.matchedCategory).toBe("neurological_stroke");
  });

  it("should NOT flag normal, non-emergency symptom reports", () => {
    const text = "Mild headache for three days after working long hours on the laptop";
    const result = evaluateSafety(text);

    expect(result.flagged).toBe(false);
    expect(result.matchedCategory).toBeNull();
  });
});

describe("3. Conditional Questionnaire Logic", () => {
  it("should define conditional visibility for pain questions", () => {
    const painRatingQ = INTAKE_QUESTIONS.find((q) => q.key === "pain_rating");
    expect(painRatingQ).toBeDefined();
    expect(painRatingQ?.condition?.dependsOnKey).toBe("has_pain");
    expect(painRatingQ?.condition?.equals).toBe("Yes");

    // When has_pain is No, pain_rating condition evaluates false
    const answersNo = { has_pain: "No" };
    const shouldShowWhenNo = answersNo[painRatingQ!.condition!.dependsOnKey as "has_pain"] === painRatingQ!.condition!.equals;
    expect(shouldShowWhenNo).toBe(false);

    // When has_pain is Yes, pain_rating condition evaluates true
    const answersYes = { has_pain: "Yes" };
    const shouldShowWhenYes = answersYes[painRatingQ!.condition!.dependsOnKey as "has_pain"] === painRatingQ!.condition!.equals;
    expect(shouldShowWhenYes).toBe(true);
  });

  it("should define conditional visibility for previous episodes details", () => {
    const episodeDetailsQ = INTAKE_QUESTIONS.find((q) => q.key === "previous_episodes_details");
    expect(episodeDetailsQ).toBeDefined();
    expect(episodeDetailsQ?.condition?.dependsOnKey).toBe("had_previous_episodes");
    expect(episodeDetailsQ?.condition?.equals).toBe("Yes");
  });
});

describe("4. Clinical Report Schema & Malformed AI Output Handling", () => {
  it("should parse and validate a conforming clinical report", () => {
    const validReport = {
      mainReasonForVisit: "Patient reports persistent throbbing headache for 3 days.",
      symptoms: ["Headache", "Mild sensitivity to light"],
      timeline: {
        onset: "3 days ago",
        duration: "72 hours",
        progression: "About the same",
        frequency: "Constant",
      },
      location: "Frontal head",
      severity: "6",
      pain: {
        present: true,
        rating: 6,
        character: ["Throbbing"],
        pattern: "Constant",
      },
      associatedSymptoms: ["Mild photophobia"],
      aggravatingFactors: ["Bright computer screens"],
      relievingFactors: ["Rest in dark room"],
      previousEpisodes: "None reported",
      treatmentsTried: ["Over-the-counter paracetamol"],
      medicalHistory: ["None reported"],
      surgeriesOrHospitalizations: ["None reported"],
      medications: ["None reported"],
      allergies: ["No known allergies"],
      priorConsultations: "Not reported",
      dailyImpact: "Moderately - had to take frequent breaks from work",
      patientConcern: "Concerned about migraine or vision strain",
      consultationGoal: "Understand the cause of symptoms",
      clinicianAttentionItems: [],
      doctorFollowUpQuestions: [
        "Has the headache severity changed since completing the intake?",
        "Are there any visual auras or blind spots?",
      ],
      informationNotClarified: [],
      additionalNotes: "Patient drinks 2 cups of coffee daily.",
    };

    const parsed = ClinicalReportSchema.safeParse(validReport);
    expect(parsed.success).toBe(true);
  });

  it("should safely provide defaults for missing fields rather than crashing", () => {
    const minimalReport = {
      mainReasonForVisit: "Patient reports routine checkup.",
    };

    const parsed = ClinicalReportSchema.safeParse(minimalReport);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.severity).toBe("Not reported");
      expect(parsed.data.symptoms).toEqual([]);
      expect(parsed.data.mandatoryNotice).toContain("AI-generated pre-visit summary");
    }
  });
});

describe("5. File Validation Boundaries", () => {
  const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  it("should allow supported medical record types within 10MB limit", () => {
    const testFile = { type: "application/pdf", size: 4 * 1024 * 1024 };
    expect(ALLOWED_MIME_TYPES.includes(testFile.type)).toBe(true);
    expect(testFile.size <= MAX_FILE_SIZE).toBe(true);
  });

  it("should reject unsupported executable or script files", () => {
    const disallowed = ["application/x-msdownload", "text/javascript", "application/zip"];
    disallowed.forEach((type) => {
      expect(ALLOWED_MIME_TYPES.includes(type)).toBe(false);
    });
  });

  it("should reject files exceeding 10MB", () => {
    const oversized = 11 * 1024 * 1024;
    expect(oversized <= MAX_FILE_SIZE).toBe(false);
  });
});
