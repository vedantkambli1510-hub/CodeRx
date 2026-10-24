import { buildUpiUri, generateUpiQrDataUrl, getDoctorUpiVpa } from "../src/lib/payment/upi";

async function main() {
  const vpa = getDoctorUpiVpa("Dr. Aarav Mehta");
  const uri = buildUpiUri({
    payeeVpa: vpa,
    payeeName: "Dr. Aarav Mehta",
    amount: 800,
    transactionRef: "TR-TEST-1234",
  });
  console.log("UPI URI:", uri);
  const dataUrl = await generateUpiQrDataUrl({
    payeeVpa: vpa,
    payeeName: "Dr. Aarav Mehta",
    amount: 800,
  });
  console.log("QR Data URL length:", dataUrl.length, "Prefix:", dataUrl.slice(0, 30));
}

main().catch(console.error);
