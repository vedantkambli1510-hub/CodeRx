import { describe, it, expect } from "vitest";
import { answerPatientQuestion, PatientAiContext } from "@/lib/ai/patient-assistant";

describe("Patient Portal AI Assistant", () => {
  const mockContext: PatientAiContext = {
    userName: "Rajesh Sharma",
    userEmail: "patient@coderx.local",
    patientDob: "2006-08-22",
    gender: "Male",
    bloodGroup: "O+",
    city: "Mumbai",
    allergies: "Sulfa antibiotics (Urticaria/rash), Shellfish",
    conditions: "Type 2 Diabetes Mellitus, Essential Hypertension",
    currentMedications: "Metformin 500mg BD, Telmisartan 40mg OD, Atorvastatin 20mg HS",
    emergencyContactName: "Sunita Sharma (Wife)",
    emergencyContactPhone: "+91 98201 98765",
    isSubscribed: true,
    appointments: [
      {
        doctorName: "Dr. Aarav Mehta",
        specialization: "Internal Medicine & Diabetology",
        clinicInfo: "Apollo Clinic, Mumbai",
        dateString: "24 Oct 2026",
        timeString: "10:00 AM",
        status: "CONFIRMED",
      },
    ],
    records: [
      {
        title: "Complete Blood Count (CBC)",
        type: "Blood",
        date: "12 Oct 2026",
        findings: "Hemoglobin 14.2 g/dL (Normal)",
        status: "Improved",
      },
    ],
  };

  it("answers appointment questions with exact doctor, timing and venue", async () => {
    const res = await answerPatientQuestion("when is my next doctor appointment?", mockContext);
    expect(res.answer).toContain("Dr. Aarav Mehta");
    expect(res.answer).toContain("24 Oct 2026");
    expect(res.answer).toContain("10:00 AM");
    expect(res.actionablePoints.length).toBeGreaterThan(0);
  });

  it("answers medication dosage questions accurately", async () => {
    const res = await answerPatientQuestion("what is my metformin dosage?", mockContext);
    expect(res.answer).toContain("Metformin 500mg");
    expect(res.answer).toContain("meals");
    expect(res.actionablePoints.length).toBeGreaterThan(0);
  });

  it("answers allergy inquiries with verified patient data", async () => {
    const res = await answerPatientQuestion("do I have any drug allergies?", mockContext);
    expect(res.answer).toContain("Sulfa antibiotics");
    expect(res.answer).toContain("Shellfish");
  });

  it("answers profile, age, blood group and emergency contact questions", async () => {
    const res = await answerPatientQuestion("who is my emergency contact and my blood group?", mockContext);
    expect(res.answer).toContain("Sunita Sharma");
    expect(res.answer).toContain("O+");
    expect(res.answer).toContain("20 years");
  });

  it("answers portal upload inquiries with step-by-step guidance", async () => {
    const res = await answerPatientQuestion("how do I upload a blood test report?", mockContext);
    expect(res.answer.toLowerCase()).toContain("upload");
    expect(res.actionablePoints.some((p) => p.includes("Upload Report"))).toBe(true);
  });
});
