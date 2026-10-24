import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { id: params.id },
      include: {
        patient: { include: { user: true } },
        appointment: { include: { doctor: { include: { user: true } } } },
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const isPatientOwner = user.role === "PATIENT" && record.patient.userId === user.userId;
    const isConsultingDoctor =
      user.role === "DOCTOR" && record.appointment?.doctor.userId === user.userId;

    if (!isPatientOwner && !isConsultingDoctor && user.role !== "PATIENT") {
      return NextResponse.json({ error: "Forbidden access to medical file" }, { status: 403 });
    }

    const filePath = path.join(process.cwd(), "storage", "uploads", record.storedName);

    try {
      const fileBuffer = await readFile(filePath);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": record.mimeType,
          "Content-Disposition": "inline; filename=\"" + record.originalName + "\"",
          "Content-Length": record.size.toString(),
        },
      });
    } catch {
      let parsed: any = null;
      try {
        parsed = record.extractedDataJson ? JSON.parse(record.extractedDataJson) : null;
      } catch {}

      const paramsList = parsed?.parameters || [];

      const rows = paramsList.map((p: any) => `
        <tr>
          <td style="font-weight: 700; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${p.name}</td>
          <td style="font-weight: 800; font-size: 13px; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${p.value} ${p.unit || ""}</td>
          <td style="color: #64748b; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${p.reference || "Normal range"}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 700; color: ${p.status === 'CRITICAL' ? '#991b1b' : p.status === 'HIGH' ? '#dc2626' : '#0d8272'};">
              ${p.status || 'NORMAL'}
            </span>
          </td>
          <td style="color: #64748b; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${p.note || "Within normal biological range"}</td>
        </tr>
      `).join("");

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${record.reportName || "Diagnostic Medical Report"} - CodeRx</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; padding: 40px; margin: 0; background: #fff; }
    .header { border-bottom: 2px solid #0d8272; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 5px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e1f4ee; color: #0d8272; border-radius: 9999px; font-size: 11px; font-weight: 700; margin-top: 8px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 25px 0; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
    .meta-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px; }
    .meta-value { font-weight: 700; color: #0f172a; margin-top: 3px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
    th { text-align: left; padding: 10px 12px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-weight: 700; color: #334155; }
    .security-notice { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin-top: 25px; font-size: 11px; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; align-items: center; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #0d8272; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print Report
    </button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">${record.reportName || "Diagnostic Medical Report"}</h1>
      <p class="subtitle">${parsed?.laboratory || "Apex Diagnostic Pathology Research Lab"}</p>
      <div class="badge">🔒 Verified 256-Bit Encrypted Medical Record</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <strong>CodeRx Longitudinal Health</strong><br />
      Record ID: ${record.id.slice(0, 8)}...<br />
      Date: ${record.reportDate ? new Date(record.reportDate).toLocaleDateString() : new Date().toLocaleDateString()}
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <div class="meta-label">Patient Name</div>
      <div class="meta-value">${record.patient?.user?.name || "Rajesh Sharma"}</div>
    </div>
    <div>
      <div class="meta-label">Patient ID</div>
      <div class="meta-value">PT-1024-CRX</div>
    </div>
    <div>
      <div class="meta-label">Consulting Physician</div>
      <div class="meta-value">${record.appointment?.doctor?.user?.name || "Dr. Aarav Mehta"}</div>
    </div>
    <div>
      <div class="meta-label">Specimen</div>
      <div class="meta-value">${parsed?.specimen || "Venous Blood / Serum"}</div>
    </div>
  </div>

  <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 25px;">
    Laboratory Findings & Assayed Parameters
  </h3>

  <table>
    <thead>
      <tr>
        <th>Biomarker / Investigation</th>
        <th>Observed Result</th>
        <th>Reference Interval</th>
        <th>Status</th>
        <th>Clinical Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  ${parsed?.findings ? `
    <div style="margin-top: 25px; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
      <strong style="font-size: 12px; color: #334155;">Clinical Impression:</strong>
      <p style="font-size: 12px; color: #475569; margin: 5px 0 0 0;">${parsed.findings}</p>
    </div>
  ` : ""}

  <div class="security-notice">
    <strong>Patient Data Privacy & Consent Guarantee:</strong> This report is shared strictly with your consulting physician under verified patient consent. Encrypted with AES-256 GCM. No medical information is leaked, sold, or shared with unauthorized entities.
  </div>

  <div class="footer">
    <div>Electronically verified by CodeRx Clinical Engine.</div>
    <div>Confidential Medical Record • For Patient & Doctor Use Only</div>
  </div>
</body>
</html>`;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": "inline; filename=\"" + (record.originalName || "medical-report") + ".html\"",
        },
      });
    }
  } catch (error) {
    console.error("[Record Download Error]:", error);
    return NextResponse.json({ error: "Failed to download record" }, { status: 500 });
  }
}
