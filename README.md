# CodeRx — Healthcare Management Software Platform

> **Tagline:** Turn Medical Records Into One Clear Patient Story.  
> **Core USP:** CodeRx turns scattered medical reports, prescriptions, and diagnostic records into a structured medical timeline and helps doctors quickly understand **WHAT CHANGED**.

---

## 1. Product Overview

CodeRx is a complete desktop-first healthcare management platform designed for clinicians and patients. It replaces fragmented lab PDFs, WhatsApp scans, and physical files with an interconnected medical system:

**Patient Journey:**
`Patient Login` → `Profile` → `Medical Records` → `AI Extraction` → `Medical Timeline` → `Before vs Now` → `What Changed?` → `Doctor Brief` → `Consultation Focus` → `Appointment` → `Prescription` → `Next Visit` → `Before Your Next Visit` → `Automatic Reminders`

---

## 2. Credentials You Need to Add for Live Production

CodeRx includes safe development fallbacks and seeded demo profiles out of the box. To activate full live production features, add these keys to your `.env`:

| Service | Environment Variable(s) | Where to Obtain |
| :--- | :--- | :--- |
| **Google Gemini AI** | `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) (Get API Key) |
| **Google OAuth 2.0** | `GOOGLE_CLIENT_ID`<br>`GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/) > Credentials |
| **Razorpay Payments** | `RAZORPAY_KEY_ID`<br>`RAZORPAY_KEY_SECRET`<br>`RAZORPAY_WEBHOOK_SECRET` | [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys) |
| **Resend Email** | `RESEND_API_KEY`<br>`EMAIL_FROM` | [Resend](https://resend.com/api-keys) (Verify Domain / Onboarding) |
| **PostgreSQL Database** | `DATABASE_URL` | [Supabase](https://supabase.com/) / Neon / AWS RDS PostgreSQL |
| **Twilio SMS / WhatsApp** | `TWILIO_ACCOUNT_SID`<br>`TWILIO_AUTH_TOKEN`<br>`TWILIO_PHONE_NUMBER` | [Twilio Console](https://console.twilio.com/) |

---

## 3. CodeRx 12-Step Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and configure your credentials.

### 3. Configure Google OAuth
In Google Cloud Console:
1. Create an **OAuth 2.0 Client ID** (Web Application).
2. Add Authorized JavaScript origins: `http://localhost:3000` (or your domain).
3. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`.
4. Copy Client ID and Client Secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 4. Configure Database
By default, CodeRx uses SQLite (`file:./dev.db`) for rapid local development.
For PostgreSQL production:
Set `DATABASE_URL="postgresql://user:password@host:5432/coderx?sslmode=require"`.

### 5. Run Migrations
Push schema and generate Prisma client:
```bash
npx prisma db push
npx prisma generate
```

### 6. Configure Storage
Private medical file storage directory is created automatically at `./storage/medical_records`.
For cloud S3 or Supabase Storage, configure `S3_ENDPOINT`, `S3_BUCKET_NAME`, and S3 access keys in `.env`.

### 7. Configure AI
Add your `GEMINI_API_KEY` from Google AI Studio. CodeRx utilizes `gemini-2.5-flash` for multimodal report extraction and differential comparison.

### 8. Configure Payments
1. Create a Razorpay test account at `https://dashboard.razorpay.com`.
2. Generate API Keys (Key ID & Key Secret) and add to `.env`.
3. Set Webhook URL to: `https://your-domain.com/api/payments/webhook` with event `payment.captured`.

### 9. Configure Email
1. Create a Resend account at `https://resend.com`.
2. Add and verify your sender domain (or use test email during development).
3. Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env`.

### 10. Configure Reminders & Webhooks
CodeRx includes an integrated scheduled reminder engine that queues:
- **7 Days Before**: Early reminder to prepare lab reports or diagnostic scans.
- **1 Day Before**: Checklist reminder with pre-visit action items.
- **2 Hours Before**: Final notification before doctor consultation starts.

### 11. Seed Demo Data
Populate realistic longitudinal patient history (Dr. Aarav Mehta and Rajesh Sharma):
```bash
npx prisma db seed
```
Or execute seed script:
```bash
npm run db:seed
```

### 12. Start Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 4. Demonstration Accounts

| Role | Name | Email | Password | Primary Workflow |
| :--- | :--- | :--- | :--- | :--- |
| **Doctor** | Dr. Aarav Mehta | `doctor@coderx.local` | `Doctor@123` | Patient Management, "WHAT CHANGED?", AI Doctor Brief, Deprescribing, Digital Prescriptions |
| **Patient** | Rajesh Sharma | `patient@coderx.local` | `Patient@123` | My Health Story, Medical Records, Pre-Visit Checklist, Stopped Meds Alert |

---

## 5. Architectural Map

- **Authentication & RBAC:** `src/lib/auth/` (JWT sessions, role guard middleware, Google OAuth handler)
- **Differential AI Engine:** `src/lib/ai/differentials.ts` (acute metric shift detection, baseline vs follow-up comparison)
- **Multimodal AI Extraction:** `src/lib/ai/coderx-ai.ts` (Google GenAI multimodal PDF/image parsing)
- **Doctor Workspace:** `src/app/doctor/` (Dashboard, Patients, Workspace tabs, Slot Availability)
- **Patient Portal:** `src/app/patient/` (Dashboard, My Health Story, Before Your Next Visit checklist)
- **Configuration Checker:** `src/lib/config/checker.ts` (Startup & `/doctor/settings` service inspector)
- **Prescription & Deprescribing Engine:** `src/app/api/doctor/prescriptions/` & `src/app/api/doctor/medicines/`
- **Notification & Reminders:** `src/lib/notifications/service.ts`

---

## 6. Safety & AI Disclaimers

CodeRx operates strictly as a clinical decision support and longitudinal organization software. It does **not** prescribe automatically, alter dosages without physician signoff, or replace clinical judgment. All AI outputs carry the mandatory notice:

> *"AI-generated information. Verify with the original medical record and qualified healthcare professional."*
