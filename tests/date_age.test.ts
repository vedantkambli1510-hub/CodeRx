import { describe, it, expect } from "vitest";
import { calculateAge, formatAgeString } from "@/lib/date";

describe("calculateAge & formatAgeString utilities", () => {
  it("calculates age correctly from standard YYYY-MM-DD", () => {
    // Current year in environment is 2026, month is Oct
    const age = calculateAge("2006-08-22");
    expect(age).toBe(20);
  });

  it("calculates age correctly from DD/MM/YYYY format", () => {
    const age = calculateAge("22/08/2006");
    expect(age).toBe(20);
  });

  it("handles birthdate later in the current year", () => {
    // Birthday in December has not occurred yet in October
    const age = calculateAge("2000-12-15");
    expect(age).toBe(25);
  });

  it("handles pure age number string", () => {
    expect(calculateAge("22")).toBe(22);
    expect(calculateAge("35 years")).toBe(35);
    expect(calculateAge("40 yrs")).toBe(40);
  });

  it("returns null for invalid inputs", () => {
    expect(calculateAge(null)).toBeNull();
    expect(calculateAge("")).toBeNull();
    expect(calculateAge("invalid-date-string")).toBeNull();
    expect(calculateAge("999")).toBeNull(); // Out of reasonable bounds
  });

  it("formats age string properly", () => {
    expect(formatAgeString("2006-08-22")).toBe("Age: 20");
    expect(formatAgeString("22")).toBe("Age: 22");
    expect(formatAgeString(null, "Age: Not set")).toBe("Age: Not set");
  });
});
