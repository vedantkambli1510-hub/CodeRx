/**
 * Date and Age calculation utilities for CodeRx
 */

/**
 * Calculates accurate age based on Date of Birth string or raw input
 * Supports:
 * - YYYY-MM-DD (standard HTML5 date input)
 * - DD/MM/YYYY or DD-MM-YYYY
 * - MM/DD/YYYY or RFC/ISO dates
 * - Direct strings like "24", "24 years", "24 yrs"
 * 
 * Returns number of completed years, or null if invalid.
 */
export function calculateAge(dob?: string | null): number | null {
  if (!dob) return null;
  const raw = String(dob).trim();
  if (!raw) return null;

  // 1. Check if user already typed pure age number like "22" or "22 years"
  const directMatch = raw.match(/^(\d{1,3})\s*(?:years?|yrs?|yr)?$/i);
  if (directMatch) {
    const val = parseInt(directMatch[1], 10);
    if (!isNaN(val) && val >= 0 && val <= 130) {
      return val;
    }
  }

  // 2. Parse Date
  let birthDate: Date | null = null;

  // Check for DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed
    const year = parseInt(dmyMatch[3], 10);
    const candidate = new Date(year, month, day);
    if (
      candidate.getFullYear() === year &&
      candidate.getMonth() === month &&
      candidate.getDate() === day
    ) {
      birthDate = candidate;
    }
  }

  // Standard ISO or YYYY-MM-DD or standard parseable string
  if (!birthDate) {
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      birthDate = parsed;
    }
  }

  if (!birthDate) return null;

  // 3. Compute completed years
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If birth month hasn't arrived this year, or birth month is current month but birth day hasn't arrived
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < 0 || age > 130) return null;
  return age;
}

/**
 * Formats age into a readable string: e.g. "Age: 22" or "Not specified"
 */
export function formatAgeString(dob?: string | null, fallback = "Age: --"): string {
  const age = calculateAge(dob);
  if (age === null) return fallback;
  return `Age: ${age}`;
}
