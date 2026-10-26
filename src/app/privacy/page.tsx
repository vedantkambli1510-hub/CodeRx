import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Notice - CodeRx Health",
  description: "CodeRx data protection practices, lawful basis, AI processing terms, and patient rights.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/patient/records"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Records</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">CodeRx Privacy Notice</h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Version 1.2-2026 &bull; Compliant with Digital Personal Data Protection Act, 2023
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">1. Data Controller &amp; Organization</h2>
              <p>
                CodeRx Health (&ldquo;CodeRx&rdquo;) is the data fiduciary responsible for the personal data and health information collected and processed through our patient and clinician portals. If you have questions regarding this notice or wish to exercise your data rights, please contact our Data Protection Grievance Officer at <strong className="text-emerald-700 font-semibold">privacy@coderx.health</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">2. Categories of Health Information Processed</h2>
              <p>We process only information required to provide patient record storage and clinical workflows:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Identity &amp; Profile Data:</strong> Full name, age/date of birth, gender, contact number, and internal system identifier.</li>
                <li><strong>Diagnostic Documents:</strong> Uploaded medical files, laboratory reports, imaging scans, and prescriptions (PDF, JPG, PNG, WEBP).</li>
                <li><strong>Extracted Biomarkers:</strong> Numerical lab parameters, reference intervals, specimen descriptions, and clinical impressions extracted when explicit AI consent is granted.</li>
                <li><strong>Consent Audit Trail:</strong> Timestamped records of your granular consent grants, declines, and withdrawals.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">3. Purpose-Specific Consent &amp; Lawful Basis</h2>
              <p>
                Under the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable Indian healthcare regulations, CodeRx processes personal health information strictly on the basis of informed, specific, and unbundled consent. We provide separate, independent consent controls for:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-900 text-xs block">1. Storage</span>
                  <p className="text-xs text-slate-600">Preserving your records in your private portal for personal access.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-900 text-xs block">2. AI Formatting</span>
                  <p className="text-xs text-slate-600">Extracting biomarkers into clinical tables using Google Gemini.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-900 text-xs block">3. Doctor Sharing</span>
                  <p className="text-xs text-slate-600">Allowing your authorized consulting doctor to review the report.</p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">4. AI Service Providers &amp; External Transmission</h2>
              <p>
                When you grant permission for <strong>AI-assisted report processing</strong>, CodeRx transmits the document buffer to <strong>Google Gemini API</strong> (model <em>gemini-2.5-flash</em> via <code>@google/genai</code>) over secure TLS 1.3 to perform multimodal extraction.
              </p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-emerald-900">
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strict AI Gating:</span>
                </p>
                <p className="text-xs text-emerald-800">
                  If you decline AI processing, your document is <strong>never sent to Google Gemini or any third-party AI service</strong>. It is stored directly on the server without automated processing.
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">5. Storage, Security &amp; Retention</h2>
              <p>
                Uploaded files are stored in protected local filesystem directories (<code>storage/uploads</code>) on the application server. Database records are maintained in Neon PostgreSQL using encrypted TLS database connections. Password authentication uses bcrypt with salt rounds of 10.
              </p>
              <p>
                Records are retained for the lifetime of your account or until you delete them. You may download or delete your records at any time.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">6. Doctor-Side Sharing Access</h2>
              <p>
                Doctors only gain access to reports when you explicitly authorize sharing for that specific report or appointment. Revoking sharing permission immediately removes doctor access on the backend.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">7. No Sale of Health Data</h2>
              <p>
                CodeRx does not sell, lease, or monetize your health data, nor do we share your medical reports with third-party advertisers, insurance companies, or commercial data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">8. Patient Rights &amp; Grievance Redressal</h2>
              <p>
                You may request access to, correction of, or deletion of your records. You may also withdraw previously granted consent at any time from your account settings. Contact our Grievance Officer at <strong className="text-emerald-700">privacy@coderx.health</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
