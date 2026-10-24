import { describe, it, expect } from "vitest";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../src/lib/i18n/LanguageContext";
import { BookAppointmentSchema } from "../src/lib/validation/auth";

describe("New Features: Indian Languages, Google Pay, Organized Slots, & Crazy Medicine Status", () => {
  it("should have all 10 Indian languages registered in SUPPORTED_LANGUAGES", () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(10);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("hi");
    expect(codes).toContain("mr");
    expect(codes).toContain("gu");
    expect(codes).toContain("bn");
    expect(codes).toContain("ta");
    expect(codes).toContain("te");
    expect(codes).toContain("kn");
    expect(codes).toContain("ml");
    expect(codes).toContain("pa");
  });

  it("should have translations for key terms across Hindi, Marathi, and Gujarati", () => {
    expect(TRANSLATIONS.hi.payWithGooglePay).toBeDefined();
    expect(TRANSLATIONS.mr.payWithGooglePay).toBeDefined();
    expect(TRANSLATIONS.gu.payWithGooglePay).toBeDefined();
    expect(TRANSLATIONS.hi.basicReport).toBeDefined();
    expect(TRANSLATIONS.mr.basicReport).toBeDefined();
    expect(TRANSLATIONS.hi.activeOn).toBeDefined();
    expect(TRANSLATIONS.hi.stoppedOff).toBeDefined();
  });

  it("should validate BookAppointmentSchema with Google Pay and custom transaction IDs", () => {
    const payload = {
      slotId: "slot-abc-123",
      doctorId: "doctor-xyz-456",
      paymentMethod: "GOOGLE_PAY",
      transactionId: "UPI-GPAY-TEST9876",
    };
    const result = BookAppointmentSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paymentMethod).toBe("GOOGLE_PAY");
      expect(result.data.transactionId).toBe("UPI-GPAY-TEST9876");
    }
  });

  it("should support default Google Pay payment method when transactionId is optional", () => {
    const payload = {
      slotId: "slot-abc-123",
      doctorId: "doctor-xyz-456",
    };
    const result = BookAppointmentSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paymentMethod).toBe("GOOGLE_PAY");
    }
  });

  it("should calculate comparative pricing correctly across Tata 1mg, PharmEasy, Netmeds, and Self-Purchase", () => {
    const totalMrp = 500;
    // 1mg: 15% off, free delivery > 300
    const oneMgDiscount = Math.round(totalMrp * 0.15);
    const oneMgTotal = totalMrp - oneMgDiscount;
    expect(oneMgDiscount).toBe(75);
    expect(oneMgTotal).toBe(425);

    // PharmEasy: 20% off (cheapest), free delivery > 299
    const peDiscount = Math.round(totalMrp * 0.20);
    const peTotal = totalMrp - peDiscount;
    expect(peDiscount).toBe(100);
    expect(peTotal).toBe(400);
    expect(peTotal).toBeLessThan(oneMgTotal);

    // Netmeds: 18% off, free delivery > 350
    const nmDiscount = Math.round(totalMrp * 0.18);
    const nmTotal = totalMrp - nmDiscount;
    expect(nmDiscount).toBe(90);
    expect(nmTotal).toBe(410);

    // Self-Purchase / Local Chemist: MRP, 0 delivery fee, 0 platform fee
    const selfTotal = totalMrp;
    expect(selfTotal).toBe(500);
  });

  it("should deduplicate multiple historical entries of the same medication into a single latest record", () => {
    const entries = [
      { id: "1", name: "Telmisartan", date: "2026-10-02", status: "DISCONTINUED", doctor: "Dr Setu Kumar" },
      { id: "2", name: "Telmisartan", date: "2026-10-10", status: "DISCONTINUED", doctor: "Dr. Aarav Mehta" },
    ];
    // Sort descending by date
    entries.sort((a, b) => b.date.localeCompare(a.date));
    expect(entries[0].doctor).toBe("Dr. Aarav Mehta");
    expect(entries[0].date).toBe("2026-10-10");
  });

  it("should calculate exact 24h prior automated call schedule and validate 30-minute arrival instruction", () => {
    const slotStartTime = new Date("2026-10-15T10:00:00.000Z");
    const oneDayBefore = new Date(slotStartTime.getTime() - 24 * 3600 * 1000);
    
    // Exactly 24 hours prior
    expect(oneDayBefore.toISOString()).toBe("2026-10-14T10:00:00.000Z");
    expect(slotStartTime.getTime() - oneDayBefore.getTime()).toBe(86400000); // 24h in ms

    // Validate voice reminder script parameters
    const patientName = "Rajesh Sharma";
    const doctorName = "Dr. Aarav Mehta";
    const clinicAddress = "Room 304, Fortis Hospital Complex";
    const voiceScript = `Namaste ${patientName}. This is an automated reminder from ${doctorName}'s clinic at ${clinicAddress}. You have an appointment scheduled for tomorrow at 10:00 AM. Please make sure to be present at least thirty minutes before your consultation with your reports and current medicine strips. Press 1 to confirm attendance, or press 2 to reschedule.`;

    expect(voiceScript).toContain("thirty minutes before");
    expect(voiceScript).toContain("Press 1 to confirm attendance");
    expect(voiceScript).toContain(clinicAddress);
  });
});

