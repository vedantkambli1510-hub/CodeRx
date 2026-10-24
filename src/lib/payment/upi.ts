import QRCode from "qrcode";

export interface UpiPaymentDetails {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionNote?: string;
  transactionRef?: string;
  merchantCode?: string;
}

/**
 * Derives a clean, realistic doctor UPI VPA based on doctor's name
 * e.g., "Dr. Aarav Mehta" -> "dr.aarav.mehta@okaxis"
 */
export function getDoctorUpiVpa(doctorName: string, customUpi?: string | null): string {
  if (customUpi && customUpi.trim()) {
    return customUpi.trim();
  }
  const cleanName = doctorName
    .toLowerCase()
    .replace(/^dr\.?\s*/i, "")
    .trim()
    .replace(/[^a-z0-9]+/g, ".");
  
  // Rotating bank handles for realistic clinical marketplace
  const handles = ["okaxis", "okhdfcbank", "okicici", "oksbi"];
  const charSum = cleanName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const handle = handles[charSum % handles.length];

  return `dr.${cleanName || "doctor"}@${handle}`;
}

/**
 * Builds the official NPCI UPI Deep Link / Intent URI
 * Works seamlessly with Google Pay, PhonePe, Paytm, BHIM, Cred, etc.
 */
export function buildUpiUri({
  payeeVpa,
  payeeName,
  amount,
  transactionNote = "Consultation Fee - TriageAI Medical",
  transactionRef,
  merchantCode = "8011", // MCC 8011: Doctors, Physicians
}: UpiPaymentDetails): string {
  const params = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: transactionNote,
  });

  if (transactionRef) {
    params.set("tr", transactionRef);
  }
  if (merchantCode) {
    params.set("mc", merchantCode);
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Generates high-resolution base64 PNG QR code Data URL for instant rendering
 */
export async function generateUpiQrDataUrl(
  details: UpiPaymentDetails,
  width: number = 320
): Promise<string> {
  const upiUri = buildUpiUri(details);
  try {
    const dataUrl = await QRCode.toDataURL(upiUri, {
      width,
      margin: 1,
      color: {
        dark: "#0F172A", // Slate 900
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
    return dataUrl;
  } catch (error) {
    console.error("Failed to generate UPI QR code:", error);
    throw error;
  }
}

/**
 * Generates an SVG string representation of the QR code
 */
export async function generateUpiQrSvg(details: UpiPaymentDetails): Promise<string> {
  const upiUri = buildUpiUri(details);
  try {
    return await QRCode.toString(upiUri, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch (error) {
    console.error("Failed to generate UPI QR SVG:", error);
    throw error;
  }
}

/**
 * Generates a realistic 12-digit NPCI Bank Reference / UTR Number
 */
export function generateRealisticUtr(): string {
  // Typical 12-digit UPI reference (first digit usually year/day in banking systems)
  const prefix = Math.floor(400000 + Math.random() * 500000).toString();
  const suffix = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}${suffix}`;
}

/**
 * Generates a formatted Google Pay transaction identifier
 */
export function generateGPayTxnId(utr?: string): string {
  const ref = utr || generateRealisticUtr();
  return `UPI-GPAY-${ref}`;
}
