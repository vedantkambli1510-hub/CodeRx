# TriageAI System Architecture & Technical Specifications

This document outlines the technical architecture, data flow, security model, and component boundaries of **TriageAI** (AI-Assisted Pre-Visit Patient Intake).

---

## 1. High-Level Architecture Overview

TriageAI is built as a unified full-stack application using the **Next.js App Router** with React Server Components, TypeScript, SQLite, and Prisma ORM.

```
                      ┌─────────────────────────────────────────┐
                      │             Web Browser                 │
                      │  (Patient Portal & Doctor Workspace)    │
                      └────────────────────┬────────────────────┘
                                           │ HTTP/HTTPS (Port 3000)
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Next.js Full-Stack App                           │
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │    App Router Pages   │  │  API Route Handlers  │  │   Auth / Session │  │
│  │ (Server/Client Comps) │  │  (Zod-Validated)     │  │  (jose JWT Cookie│  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └─────────┬────────┘  │
│              │                         │                        │           │
│              ▼                         ▼                        ▼           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       Business Logic Services                         │  │
│  │  - Deterministic Safety Detector (Regex Emergency Categorization)     │  │
│  │  - Question Engine (Conditional logic, sections A through W)         │  │
│  │  - Gemini AI Client (@google/genai, structured output, prompt defens) │  │
│  └───────────────────┬───────────────────────────────────┬───────────────┘  │
│                      │                                   │                  │
│                      ▼                                   ▼                  │
│             ┌─────────────────┐               ┌───────────────────────┐     │
│             │   Prisma ORM    │               │   Protected Storage   │     │
│             └────────┬────────┘               │  (`storage/uploads/`) │     │
│                      │                        └───────────────────────┘     │
└──────────────────────┼──────────────────────────────────────────────────────┘
                       │
                       ▼
            ┌─────────────────────┐                 ┌───────────────────────┐
            │   SQLite Database   │                 │   Google Gemini API   │
            │     (`dev.db`)      │                 │ (Free Tier / Flash)   │
            └─────────────────────┘                 └───────────────────────┘
```

---

## 2. Authentication & Authorization Model

- **Session Mechanics:**
  - Authenticated sessions are encoded as signed JSON Web Tokens (JWT) using the `jose` library with HS256 encryption.
  - Stored in an `httpOnly`, `sameSite: "lax"` cookie named `triageai_session`.
  - Token payload carries: `{ userId, role: "PATIENT" | "DOCTOR", email, name }`.
- **Role-Based Server-Side Guards:**
  - Route handlers and server components strictly enforce role authorization on the server.
  - `requirePatient()`: Verifies that the user role is `PATIENT` and resolves their `patientProfileId`. Access to doctor pages (`/doctor/*`) is denied.
  - `requireDoctor()`: Verifies that the user role is `DOCTOR` and resolves their `doctorProfileId`.
  - Doctor private notes are explicitly excluded when querying appointments from patient-facing API endpoints.

---

## 3. Database & Persistence Layer

The database uses **SQLite** through **Prisma ORM** (`DATABASE_URL="file:./dev.db"`).

### Core Entities & Relationships

1. **User:** Core authentication record (email, password hash, role).
2. **PatientProfile:** One-to-one relationship with User; holds voluntary demographic details (DOB, phone, blood group, emergency contact).
3. **DoctorProfile:** One-to-one relationship with User; holds clinical specialty, license number, and bio.
4. **AppointmentSlot:** Doctor's schedule window (`startTime`, `endTime`, `duration`, `status: AVAILABLE | BOOKED | BLOCKED`).
5. **Appointment:** Connects Patient, Doctor, and Slot. Enforces slot uniqueness via unique index on `slotId` to guarantee no double-booking.
6. **IntakeSession:** One-to-one with Appointment; tracks intake completion status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), start/completion timestamps, and safety flags.
7. **IntakeAnswer:** Individual patient answers linked to `IntakeSession`. Supports idempotency via unique compound index `[intakeSessionId, questionKey]`. Distinguishes between `CORE` questions and `AI_ADAPTIVE` questions.
8. **AIReport:** One-to-one with Appointment; stores the validated JSON clinical summary, model version used, review status, and review timestamps.
9. **MedicalRecord:** Metadata of patient-attached documents (`originalName`, `storedName`, `mimeType`, `size`). Stored files reside on the local filesystem.
10. **DoctorNote:** Private clinical notes attached to an appointment; restricted exclusively to the consulting physician.

---

## 4. Patient Intake Data Flow

1. **Booking:** Patient selects a slot. Server runs an atomic Prisma transaction checking slot availability and locks it to `BOOKED`.
2. **Question Engine:**
   - 23 core structured questions (Sections A to W) covering primary concern, symptoms, onset, progression, severity (0-10), pain (rating, character, pattern), triggers, relieving factors, history, medications, allergies, and daily impact.
   - Built-in conditional logic (e.g. skips pain rating if pain is "No"; skips previous episode details if none experienced).
   - Autosaves after each input to prevent data loss on browser refresh.
3. **Deterministic Safety Evaluation:**
   - Every answer passes through `evaluateSafety()`.
   - If emergency language (severe chest pain, choking, stroke symptoms, uncontrolled bleeding) is detected, an emergency advisory is displayed immediately, and the session is marked for clinician attention.
4. **Adaptive Clarification (Gemini API):**
   - After primary concern and symptoms are captured, a server-side prompt asks Gemini if a single clarifying question is warranted.
   - Enforces a strict server ceiling (max 6 adaptive questions total across the interview).
5. **Review & Verification:**
   - Summary of all answers shown to the patient.
   - Mandatory accuracy confirmation checkbox required prior to submission.
6. **Clinical Report Generation:**
   - Upon submission, server invokes Gemini with patient responses to generate a structured Pre-Visit Clinical Intake Report adhering to `ClinicalReportSchema`.
   - If severe symptoms (severity/pain 9-10) or safety flags exist, report is marked `NEEDS_REVIEW`.
   - If Gemini is unreachable, raw answers are preserved and status is marked `FAILED` with retry option.

---

## 5. Doctor Review Workspace

- **Dashboard:** At-a-glance stat cards (Today's Consultations, Reports Ready, Upcoming Total, Needs Review).
- **Consultation View:**
  - One-minute scannable report layout.
  - Visible `Needs Review` badge with exact triggering patient quotes.
  - **View Raw Patient Answers:** Opens an audit drawer with the exact verbatim questionnaire responses.
  - **Doctor Private Notes:** Textarea saving internal notes that are never sent to Gemini or visible to the patient.
  - **Status Transitions:** Buttons to `Mark Report Reviewed` and `Mark Consult Completed`.
  - **Print / PDF:** Built-in print stylesheet hiding UI controls and outputting a clean report document.
- **Slot Management:** Doctor can add custom date/time slots and remove unbooked availability slots.

---

## 6. File Uploads & Local Privacy Boundary

- Files (PDF, JPG, PNG up to 10MB; max 5 files per intake) are saved locally under `storage/uploads/`.
- File names are sanitized and assigned random UUID names to prevent path traversal attacks.
- Downloads are routed through authenticated endpoint `/api/records/[id]/download`, checking patient ownership or consulting doctor assignment.
- **Privacy Rule:** Medical record files are **never** transmitted to Gemini. Only patient-entered questionnaire text is processed.
