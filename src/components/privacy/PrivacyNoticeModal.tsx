"use client";

import React from "react";
import { X, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyNoticeModal({ isOpen, onClose }: PrivacyNoticeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#F0FDF4] to-[#F8FAFC] border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">CodeRx Privacy Notice</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Version 1.2-2026 &bull; Verified Implementation Details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Privacy Notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>1. Data Controller &amp; Organization</span>
            </h4>
            <p>
              CodeRx Health (&ldquo;CodeRx&rdquo;) is the data fiduciary responsible for personal data and health information processed through the CodeRx platform. For queries regarding our data practices, contact our Grievance Officer at{" "}
              <strong className="text-emerald-700 font-semibold">privacy@coderx.health</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>2. Categories of Health Information Processed</span>
            </h4>
            <p>We process only information required to provide patient record storage and clinical workflows:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Patient Profile:</strong> Full name, age/DOB, gender, contact phone, and assigned ID.</li>
              <li><strong>Diagnostic Documents:</strong> Uploaded laboratory reports, imaging scans, discharge summaries, and prescriptions (PDF, JPG, PNG, WEBP).</li>
              <li><strong>Extracted Biomarkers:</strong> Numerical lab values, biological reference intervals, and clinical impressions extracted when AI permission is granted.</li>
              <li><strong>Consent Audit Metadata:</strong> Timestamps, purpose, IP address, and grant/withdrawal decisions.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>3. Purposes &amp; Lawful Basis (DPDP Act, 2023)</span>
            </h4>
            <p>
              Under the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable Indian healthcare guidelines, processing of personal health data is conducted strictly on the basis of <strong>freely given, specific, informed, and unambiguous patient consent</strong>. Processing activities (Storage, AI Extraction, and Doctor Sharing) are separately presented and independently controllable.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>4. AI Service Providers &amp; Processing Workflow</span>
            </h4>
            <p>
              When you opt-in to <strong>Allow AI-assisted report processing</strong>, CodeRx uses <strong>Google Gemini API</strong> (model <em>gemini-2.5-flash</em> via <code>@google/genai</code>) to parse document images/PDFs and extract discrete lab values.
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1 text-amber-900">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Zero AI Transmission When Declined:</span>
              </p>
              <p className="text-[11px] text-amber-800">
                If you decline AI processing, your report file is <strong>never transmitted to Google Gemini or any external AI provider</strong>. It is stored directly in your account for manual viewing and clinician download.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>5. Storage, Security &amp; Data Retention</span>
            </h4>
            <p>
              Uploaded diagnostic documents are stored on protected server storage (<code>storage/uploads</code>). Database records are maintained in Neon PostgreSQL with mandatory SSL/TLS connection encryption. User passwords are encrypted with bcrypt (salt rounds = 10).
            </p>
            <p>
              <strong>Retention:</strong> Documents remain in your account until you delete them or withdraw storage consent. AI processing requests are transactional and not stored for AI model training.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>6. Doctor Sharing &amp; Access Controls</span>
            </h4>
            <p>
              Medical reports are <strong>NOT automatically visible to every doctor or hospital staff member</strong>. A doctor can only access a report if you check &ldquo;Share this report with my doctor&rdquo; for that specific upload or appointment. You may withdraw sharing access at any time from your records view.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>7. No Sale of Health Data</span>
            </h4>
            <p>
              CodeRx does not sell, rent, lease, or monetize personal health records to commercial brokers, advertisers, or third-party insurers.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>8. Patient Rights &amp; Consent Withdrawal</span>
            </h4>
            <p>Under applicable law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Access and download original and formatted reports.</li>
              <li>Withdraw consent for AI processing or doctor sharing at any time.</li>
              <li>Request correction or deletion of health records.</li>
              <li>Lodge a grievance with our Data Protection Grievance Officer.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Effective Date: October 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
