import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CodeRx database with realistic clinical demo data...");

  // 1. Clean existing records for a fresh seed
  await prisma.auditLog.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.reminderJob.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.medicalTimeline.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.doctorNote.deleteMany();
  await prisma.aIReport.deleteMany();
  await prisma.intakeAnswer.deleteMany();
  await prisma.intakeSession.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.appointmentSlot.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash passwords
  const doctorPasswordHash = await bcrypt.hash("Doctor@123", 10);
  const patientPasswordHash = await bcrypt.hash("Patient@123", 10);

  // 3. Create Demo Doctor (Dr. Aarav Mehta)
  const doctorUser = await prisma.user.create({
    data: {
      name: "Dr. Aarav Mehta",
      email: "doctor@coderx.local",
      passwordHash: doctorPasswordHash,
      role: "DOCTOR",
      doctorProfile: {
        create: {
          specialization: "Internal Medicine & Diabetology",
          qualification: "MBBS, MD (Medicine), DM (Endocrinology) AIIMS New Delhi",
          experience: 14,
          consultationFee: 800,
          clinicInfo: "CodeRx Advanced Health Hub, Floor 4, Cyber City Medical Center",
          licenseNumber: "MCI-REG-2010-48291",
          bio: "Senior Consultant Physician specializing in complex cardiometabolic disorders, adult diabetes management, and chronic disease longitudinal care.",
        },
      },
    },
    include: { doctorProfile: true },
  });

  const doctorProfile = doctorUser.doctorProfile!;
  console.log(`Created doctor: ${doctorUser.name} (${doctorUser.email})`);

  // 4. Create Demo Patient 1: Rajesh Sharma (Signature Case: Type 2 DM + HTN + Renal Shift)
  const patient1User = await prisma.user.create({
    data: {
      name: "Rajesh Sharma",
      email: "patient@coderx.local",
      passwordHash: patientPasswordHash,
      role: "PATIENT",
      patientProfile: {
        create: {
          dob: "1970-08-22",
          gender: "Male",
          phone: "+91 98201 54321",
          bloodGroup: "O+",
          emergencyContactName: "Sunita Sharma (Wife)",
          emergencyContactPhone: "+91 98201 98765",
          allergies: "Sulfa antibiotics (Urticaria/rash), Shellfish",
          conditions: "Type 2 Diabetes Mellitus (diagnosed 2021), Essential Hypertension, Stage 2 Chronic Kidney Disease",
          currentMedications: "Metformin 500mg BD, Telmisartan 40mg OD, Atorvastatin 20mg HS",
        },
      },
    },
    include: { patientProfile: true },
  });

  const patient1 = patient1User.patientProfile!;
  console.log(`Created patient 1: ${patient1User.name}`);

  // 5. Create Demo Patient 2: Priya Patel (Hypothyroidism & Anemia)
  const patient2User = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya.patel@coderx.local",
      passwordHash: patientPasswordHash,
      role: "PATIENT",
      patientProfile: {
        create: {
          dob: "1986-04-12",
          gender: "Female",
          phone: "+91 97112 65432",
          bloodGroup: "B+",
          emergencyContactName: "Kunal Patel (Husband)",
          emergencyContactPhone: "+91 97112 11223",
          allergies: "No known drug allergies (NKDA)",
          conditions: "Primary Hypothyroidism, Iron Deficiency Anemia (Resolved)",
          currentMedications: "Levothyroxine 75mcg OD empty stomach",
        },
      },
    },
    include: { patientProfile: true },
  });
  const patient2 = patient2User.patientProfile!;

  // 6. Create Demo Patient 3: Vikram Singh (Post-PTCA, Cardiac health)
  const patient3User = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "vikram.singh@coderx.local",
      passwordHash: patientPasswordHash,
      role: "PATIENT",
      patientProfile: {
        create: {
          dob: "1962-11-05",
          gender: "Male",
          phone: "+91 99887 76655",
          bloodGroup: "A+",
          emergencyContactName: "Rohan Singh (Son)",
          emergencyContactPhone: "+91 99887 12345",
          allergies: "Aspirin (mild gastric intolerance)",
          conditions: "Coronary Artery Disease (s/p PTCA 2022 to LAD), Dyslipidemia",
          currentMedications: "Clopidogrel 75mg OD, Rosuvastatin 20mg HS, Metoprolol Succinate 25mg OD",
        },
      },
    },
    include: { patientProfile: true },
  });
  const patient3 = patient3User.patientProfile!;

  // 7. Create Appointment Slots for Doctor
  const now = new Date();
  const today10am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
  const today1030am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30, 0);
  const today11am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0);
  const today1130am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30, 0);
  const tomorrow10am = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0, 0);
  const tomorrow1030am = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30, 0);
  const nextWeek11am = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 11, 0, 0);
  const nextWeek1130am = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 11, 30, 0);

  const slot1 = await prisma.appointmentSlot.create({
    data: {
      doctorId: doctorProfile.id,
      startTime: today10am,
      endTime: today1030am,
      duration: 30,
      status: "BOOKED",
    },
  });

  const slot2 = await prisma.appointmentSlot.create({
    data: {
      doctorId: doctorProfile.id,
      startTime: today11am,
      endTime: today1130am,
      duration: 30,
      status: "BOOKED",
    },
  });

  const slot3 = await prisma.appointmentSlot.create({
    data: {
      doctorId: doctorProfile.id,
      startTime: tomorrow10am,
      endTime: tomorrow1030am,
      duration: 30,
      status: "BOOKED",
    },
  });

  const slot4 = await prisma.appointmentSlot.create({
    data: {
      doctorId: doctorProfile.id,
      startTime: nextWeek11am,
      endTime: nextWeek1130am,
      duration: 30,
      status: "AVAILABLE",
    },
  });

  // 8. Create Appointments
  // Appointment 1: Rajesh Sharma (Today 10:00 AM - Pending Review & Signature Demo!)
  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctorProfile.id,
      slotId: slot1.id,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      bookedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
  });

  // Payment for Appt 1
  await prisma.payment.create({
    data: {
      appointmentId: appt1.id,
      patientId: patient1.id,
      doctorId: doctorProfile.id,
      amount: 800,
      paymentStatus: "COMPLETED",
      transactionId: "TXN_CRX_9921478",
      paymentMethod: "RAZORPAY_TEST",
    },
  });

  // Appointment 2: Priya Patel
  const appt2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctorProfile.id,
      slotId: slot2.id,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      bookedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
  });

  // Appointment 3: Vikram Singh (Tomorrow)
  const appt3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: doctorProfile.id,
      slotId: slot3.id,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      bookedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    },
  });

  // 9. Structured Medical Records for Rajesh Sharma (Old vs Latest Reports)
  // Previous Report (6 months ago - Jan 15, 2024)
  const report1Extracted = {
    reportTitle: "Comprehensive Metabolic & Lipid Panel",
    laboratory: "Apex PathLabs & Diagnostic Research",
    reportDate: "2024-01-15",
    specimen: "Blood / Fasting Serum",
    parameters: [
      { name: "HbA1c (Glycated Hemoglobin)", value: "8.4", unit: "%", reference: "< 5.7", status: "HIGH", note: "Suboptimal glycemic control" },
      { name: "Fasting Blood Glucose", value: "168", unit: "mg/dL", reference: "70 - 99", status: "HIGH", note: "Impaired fasting glucose" },
      { name: "Serum Creatinine", value: "1.0", unit: "mg/dL", reference: "0.7 - 1.2", status: "NORMAL", note: "Stable renal filtration" },
      { name: "Blood Urea Nitrogen (BUN)", value: "16", unit: "mg/dL", reference: "7 - 20", status: "NORMAL", note: "Normal clearance" },
      { name: "Total Cholesterol", value: "224", unit: "mg/dL", reference: "< 200", status: "HIGH", note: "Borderline hypercholesterolemia" },
      { name: "LDL Cholesterol (Direct)", value: "142", unit: "mg/dL", reference: "< 100", status: "HIGH", note: "Elevated atherogenic lipid" },
      { name: "HDL Cholesterol", value: "38", unit: "mg/dL", reference: "> 40", status: "LOW", note: "Suboptimal cardioprotective lipid" },
      { name: "Serum Triglycerides", value: "185", unit: "mg/dL", reference: "< 150", status: "HIGH", note: "Hypertriglyceridemia" },
      { name: "Blood Pressure (Systolic/Diastolic)", value: "148/92", unit: "mmHg", reference: "< 120/80", status: "HIGH", note: "Stage 2 Hypertension" },
      { name: "Urine Microalbumin", value: "24", unit: "mg/g", reference: "< 30", status: "NORMAL", note: "Normoalbuminuria" },
    ],
    findings: "Uncontrolled Type 2 Diabetes with secondary dyslipidemia and Stage 2 systemic hypertension. Normal baseline renal filtration parameters.",
    impression: "Requires escalation of oral hypoglycemic agent and lipid-lowering therapy. Follow-up recommended in 3 to 6 months.",
    medicinesExtracted: [
      { name: "Metformin", dosage: "500 mg", frequency: "Twice daily after meals", duration: "90 days" },
      { name: "Telmisartan", dosage: "40 mg", frequency: "Once daily morning", duration: "90 days" },
      { name: "Atorvastatin", dosage: "20 mg", frequency: "Once daily at bedtime", duration: "90 days" },
    ],
    doctorNotes: "Advised strict carbohydrate restriction, 30 min daily walking, and repeat renal/lipid markers in 6 months.",
  };

  const oldRecord = await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      reportName: "Baseline Comprehensive Metabolic & Lipid Panel",
      reportType: "LAB_REPORT",
      reportDate: new Date("2024-01-15T09:30:00Z"),
      fileUrl: "/records/rajesh_metabolic_panel_jan2024.pdf",
      originalName: "Rajesh_Metabolic_Panel_Jan2024.pdf",
      storedName: "rec_rajesh_jan2024.pdf",
      mimeType: "application/pdf",
      size: 428000,
      processingStatus: "COMPLETED",
      extractedDataJson: JSON.stringify(report1Extracted),
    },
  });

  // Latest Report (Recent - July 18, 2024)
  const report2Extracted = {
    reportTitle: "Follow-up Glycemic, Renal & Lipid Profile",
    laboratory: "Apex PathLabs & Diagnostic Research",
    reportDate: "2024-07-18",
    specimen: "Blood / Fasting Serum & Morning Spot Urine",
    parameters: [
      { name: "HbA1c (Glycated Hemoglobin)", value: "7.1", unit: "%", reference: "< 5.7", status: "IMPROVED", note: "Significant reduction of 1.3% — positive glycemic response" },
      { name: "Fasting Blood Glucose", value: "122", unit: "mg/dL", reference: "70 - 99", status: "IMPROVED", note: "Marked decline from baseline 168 mg/dL" },
      { name: "Serum Creatinine", value: "1.7", unit: "mg/dL", reference: "0.7 - 1.2", status: "CRITICAL_REVIEW", note: "Acute upward elevation from 1.0 to 1.7 mg/dL (+70% rise) — requires urgent clinician review" },
      { name: "Blood Urea Nitrogen (BUN)", value: "34", unit: "mg/dL", reference: "7 - 20", status: "CRITICAL_REVIEW", note: "Elevated from 16 to 34 mg/dL — indicates azotemia / renal clearance decline" },
      { name: "eGFR (CKD-EPI)", value: "46", unit: "mL/min/1.73m²", reference: "> 60", status: "NEW_CRITICAL", note: "Newly documented finding: Moderately to severely decreased kidney function (Stage 3a CKD)" },
      { name: "Total Cholesterol", value: "174", unit: "mg/dL", reference: "< 200", status: "IMPROVED", note: "Normalized below target threshold (<200)" },
      { name: "LDL Cholesterol (Direct)", value: "92", unit: "mg/dL", reference: "< 100", status: "IMPROVED", note: "Target <100 mg/dL achieved on Atorvastatin 20mg" },
      { name: "HDL Cholesterol", value: "43", unit: "mg/dL", reference: "> 40", status: "IMPROVED", note: "Increased into normal cardioprotective zone" },
      { name: "Serum Triglycerides", value: "148", unit: "mg/dL", reference: "< 150", status: "IMPROVED", note: "Normalized from baseline 185 mg/dL" },
      { name: "Blood Pressure (Systolic/Diastolic)", value: "126/80", unit: "mmHg", reference: "< 120/80", status: "IMPROVED", note: "Blood pressure well managed on Telmisartan" },
      { name: "Urine Albumin-to-Creatinine Ratio (uACR)", value: "88", unit: "mg/g", reference: "< 30", status: "CRITICAL_REVIEW", note: "Persistent microalbuminuria progression from 24 to 88 mg/g" },
    ],
    findings: "Marked glycemic and lipid profile improvement. However, notable renal parameter shift detected with Serum Creatinine elevating from 1.0 to 1.7 mg/dL and eGFR declining to 46 mL/min.",
    impression: "Suspected diabetic nephropathy progression vs medication-induced hemodynamic creatinine rise. Immediate clinician assessment advised for Metformin dosage adjustment.",
    medicinesExtracted: [
      { name: "Metformin", dosage: "500 mg", frequency: "Twice daily", duration: "Ongoing" },
      { name: "Telmisartan", dosage: "40 mg", frequency: "Once daily morning", duration: "Ongoing" },
      { name: "Atorvastatin", dosage: "20 mg", frequency: "Once daily bedtime", duration: "Ongoing" },
    ],
    doctorNotes: "Requires review of renal function before refilling Metformin (eGFR 46 warrants dose review).",
  };

  const latestRecord = await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      appointmentId: appt1.id,
      reportName: "Follow-up Glycemic, Renal & Lipid Profile",
      reportType: "LAB_REPORT",
      reportDate: new Date("2024-07-18T11:00:00Z"),
      fileUrl: "/records/rajesh_renal_lipid_jul2024.pdf",
      originalName: "Rajesh_Renal_Lipid_Jul2024.pdf",
      storedName: "rec_rajesh_jul2024.pdf",
      mimeType: "application/pdf",
      size: 512000,
      processingStatus: "COMPLETED",
      extractedDataJson: JSON.stringify(report2Extracted),
    },
  });

  // Additional Document: Electrocardiogram (ECG) Report
  const ecgExtracted = {
    reportTitle: "12-Lead Electrocardiogram (ECG)",
    laboratory: "Metro Cardiac Diagnostic Centre",
    reportDate: "2024-03-10",
    specimen: "Cardiological Diagnostic Test",
    parameters: [
      { name: "Heart Rate", value: "74", unit: "bpm", reference: "60 - 100", status: "NORMAL", note: "Normal sinus rhythm" },
      { name: "PR Interval", value: "162", unit: "ms", reference: "120 - 200", status: "NORMAL", note: "Normal AV conduction" },
      { name: "QRS Duration", value: "88", unit: "ms", reference: "70 - 100", status: "NORMAL", note: "Normal intraventricular conduction" },
      { name: "QTc Interval", value: "418", unit: "ms", reference: "< 450", status: "NORMAL", note: "Normal repolarization" },
      { name: "Sokolow-Lyon Index (LVH)", value: "37", unit: "mm", reference: "< 35", status: "BORDERLINE_HIGH", note: "Mild voltage criteria suggestive of Left Ventricular Hypertrophy" },
    ],
    findings: "Normal sinus rhythm. Mild voltage criteria for left ventricular hypertrophy, likely secondary to longstanding hypertension. No acute ischemic ST-T changes.",
    impression: "Hypertensive heart remodeling changes. Regular BP control emphasized.",
  };

  await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      reportName: "12-Lead Electrocardiogram (ECG)",
      reportType: "ECG",
      reportDate: new Date("2024-03-10T14:15:00Z"),
      fileUrl: "/records/rajesh_ecg_mar2024.pdf",
      originalName: "Rajesh_ECG_Mar2024.pdf",
      storedName: "rec_rajesh_ecg_mar2024.pdf",
      mimeType: "application/pdf",
      size: 380000,
      processingStatus: "COMPLETED",
      extractedDataJson: JSON.stringify(ecgExtracted),
    },
  });

  // 10. Medical Timeline for Rajesh Sharma (Chronological: 2023 -> 2024)
  const timelineEvents = [
    {
      patientId: patient1.id,
      eventDate: new Date("2023-11-10T10:00:00Z"),
      eventType: "CONSULTATION",
      title: "Initial Specialist Consultation",
      summary: "Patient presented with complaints of polydipsia, fatigue, and occasional blurred vision. Baseline diagnostic workup ordered.",
      importantFindings: "BP elevated at 152/96 mmHg. Suspected new-onset Type 2 Diabetes.",
      doctorNotes: "Ordered baseline HbA1c, fasting lipids, kidney function test, and urine routine.",
      isKeyMilestone: true,
    },
    {
      patientId: patient1.id,
      recordId: oldRecord.id,
      eventDate: new Date("2024-01-15T09:30:00Z"),
      eventType: "LAB_REPORT",
      title: "Baseline Comprehensive Metabolic & Lipid Panel",
      summary: "Diagnostic blood tests confirmed uncontrolled Type 2 Diabetes (HbA1c 8.4%) and mixed hyperlipidemia (LDL 142). Renal parameters baseline intact (Creatinine 1.0).",
      importantFindings: "HbA1c 8.4% (High), Fasting Glucose 168 mg/dL, LDL 142 mg/dL, BP 148/92.",
      doctorNotes: "Initiated pharmacotherapy with Metformin, Telmisartan, and Atorvastatin.",
      isKeyMilestone: true,
    },
    {
      patientId: patient1.id,
      eventDate: new Date("2024-01-16T11:00:00Z"),
      eventType: "PRESCRIPTION",
      title: "Pharmacotherapy Initiation Prescription",
      summary: "Prescribed triple medical therapy for cardiometabolic risk reduction.",
      importantFindings: "Started Metformin 500mg BD, Telmisartan 40mg OD, Atorvastatin 20mg HS.",
      medicinesJson: JSON.stringify([
        { name: "Metformin", dosage: "500 mg", frequency: "Twice daily after meals", duration: "90 days" },
        { name: "Telmisartan", dosage: "40 mg", frequency: "Once daily morning", duration: "90 days" },
        { name: "Atorvastatin", dosage: "20 mg", frequency: "Once daily bedtime", duration: "90 days" },
      ]),
      isKeyMilestone: false,
    },
    {
      patientId: patient1.id,
      eventDate: new Date("2024-03-10T14:15:00Z"),
      eventType: "ECG",
      title: "12-Lead Electrocardiogram Diagnostic Test",
      summary: "Normal sinus rhythm, heart rate 74 bpm. Voltage criteria suggestive of mild left ventricular remodeling from chronic hypertension.",
      importantFindings: "Sokolow-Lyon index 37 mm (Borderline elevated). No ST segment depression or acute ischemic changes.",
      isKeyMilestone: false,
    },
    {
      patientId: patient1.id,
      eventDate: new Date("2024-04-05T10:30:00Z"),
      eventType: "CONSULTATION",
      title: "Quarterly Routine Review Consultation",
      summary: "Patient reported improved daily energy levels and no symptomatic hypoglycemic episodes. Mild morning lightheadedness discussed.",
      importantFindings: "Clinic BP recorded at 134/84 mmHg. Self-monitored fasting blood sugar averaging ~130 mg/dL.",
      doctorNotes: "Maintained current therapy. Discontinued trial of low-dose Glimepiride. Scheduled comprehensive 6-month repeat tests.",
      isKeyMilestone: false,
    },
    {
      patientId: patient1.id,
      recordId: latestRecord.id,
      eventDate: new Date("2024-07-18T11:00:00Z"),
      eventType: "LAB_REPORT",
      title: "Follow-up Glycemic, Renal & Lipid Profile (Latest)",
      summary: "Major glycemic success with HbA1c falling to 7.1% and LDL to 92 mg/dL. Critical alert: Serum Creatinine climbed to 1.7 mg/dL with eGFR 46 mL/min.",
      importantFindings: "HbA1c 7.1% (🟢 Improved), LDL 92 mg/dL (🟢 Improved), Creatinine 1.7 mg/dL (🔴 REQUIRES REVIEW), eGFR 46 (🔵 NEW / 🔴 REVIEW).",
      doctorNotes: "Requires urgent review of Metformin dose and assessment of potential renal hemodynamic effects vs nephropathy progression.",
      isKeyMilestone: true,
    },
  ];

  for (const event of timelineEvents) {
    await prisma.medicalTimeline.create({ data: event });
  }

  // 11. Medicine History for Rajesh Sharma
  const medicines = [
    {
      patientId: patient1.id,
      medicineName: "Metformin Hydrochloride",
      dosage: "500 mg",
      frequency: "Twice daily after meals (Breakfast & Dinner)",
      startDate: "2024-01-16",
      endDate: null,
      status: "CURRENT",
      source: "PRESCRIPTION",
      notes: "First-line biguanide for T2DM glycemic control. Note: Needs renal dose adjustment due to eGFR 46.",
    },
    {
      patientId: patient1.id,
      medicineName: "Telmisartan",
      dosage: "40 mg",
      frequency: "Once daily in the morning",
      startDate: "2024-01-16",
      endDate: null,
      status: "CURRENT",
      source: "PRESCRIPTION",
      notes: "Angiotensin II Receptor Blocker (ARB) for blood pressure control and renal protection.",
    },
    {
      patientId: patient1.id,
      medicineName: "Atorvastatin Calcium",
      dosage: "20 mg",
      frequency: "Once daily at bedtime",
      startDate: "2024-01-16",
      endDate: null,
      status: "CURRENT",
      source: "PRESCRIPTION",
      notes: "HMG-CoA reductase inhibitor for atherosclerotic cardiovascular disease prevention.",
    },
    {
      patientId: patient1.id,
      medicineName: "Glimepiride",
      dosage: "1 mg",
      frequency: "Once daily before breakfast",
      startDate: "2024-01-16",
      endDate: "2024-04-05",
      status: "DISCONTINUED",
      source: "PRESCRIPTION",
      notes: "Discontinued after 12 weeks to prevent hypoglycemia when HbA1c showed strong Metformin response.",
    },
    {
      patientId: patient1.id,
      medicineName: "Multivitamin & Vitamin D3 (60K)",
      dosage: "60,000 IU",
      frequency: "Once weekly with milk",
      startDate: "2024-04-05",
      endDate: "2024-06-30",
      status: "PREVIOUS",
      source: "SELF_REPORTED",
      notes: "8-week replenishment course completed.",
    },
  ];

  for (const med of medicines) {
    await prisma.medicine.create({ data: med });
  }

  // 12. "Before Your Next Visit" Checklist for Rajesh Sharma
  const checklist = [
    {
      patientId: patient1.id,
      appointmentId: appt1.id,
      text: "Keep your July 18 Renal & Lipid panel report accessible for Dr. Mehta",
      isReady: true,
      category: "LABS",
    },
    {
      patientId: patient1.id,
      appointmentId: appt1.id,
      text: "Bring your daily home fasting blood sugar log from the past 14 days",
      isReady: true,
      category: "NOTES",
    },
    {
      patientId: patient1.id,
      appointmentId: appt1.id,
      text: "Have your current medicine packaging strips ready (Metformin, Telmisartan, Atorvastatin)",
      isReady: false,
      category: "MEDICINES",
    },
    {
      patientId: patient1.id,
      appointmentId: appt1.id,
      text: "Note down any swelling in ankles, changes in urination frequency, or morning dizziness",
      isReady: false,
      category: "NOTES",
    },
  ];

  for (const item of checklist) {
    await prisma.checklistItem.create({ data: item });
  }

  // 13. Reminder Jobs for Appointment 1
  const appointmentTime = slot1.startTime;
  await prisma.reminderJob.createMany({
    data: [
      {
        appointmentId: appt1.id,
        reminderType: "SEVEN_DAYS",
        scheduledAt: new Date(appointmentTime.getTime() - 7 * 24 * 3600 * 1000),
        status: "SENT",
        sentAt: new Date(appointmentTime.getTime() - 7 * 24 * 3600 * 1000),
      },
      {
        appointmentId: appt1.id,
        reminderType: "ONE_DAY",
        scheduledAt: new Date(appointmentTime.getTime() - 1 * 24 * 3600 * 1000),
        status: "SENT",
        sentAt: new Date(appointmentTime.getTime() - 1 * 24 * 3600 * 1000),
      },
      {
        appointmentId: appt1.id,
        reminderType: "TWO_HOURS",
        scheduledAt: new Date(appointmentTime.getTime() - 2 * 3600 * 1000),
        status: "SENT",
        sentAt: new Date(appointmentTime.getTime() - 2 * 3600 * 1000),
      },
    ],
  });

  // 14. Notifications for Doctor & Patient
  await prisma.notification.createMany({
    data: [
      {
        userId: doctorUser.id,
        type: "IMPORTANT_CHANGE",
        title: "⚠️ Critical Lab Parameter Shift Detected",
        message: "Rajesh Sharma's latest report shows Serum Creatinine elevated from 1.0 to 1.7 mg/dL (+70% rise) and eGFR 46 mL/min.",
        status: "UNREAD",
        link: `/doctor/patients/${patient1.id}?tab=what-changed`,
      },
      {
        userId: doctorUser.id,
        type: "REPORT_READY",
        title: "New Follow-up Report Analyzed",
        message: "AI has successfully processed and extracted parameters from Rajesh Sharma's Follow-up Glycemic & Renal Profile.",
        status: "UNREAD",
        link: `/doctor/patients/${patient1.id}?tab=reports`,
      },
      {
        userId: doctorUser.id,
        type: "APPOINTMENT",
        title: "Upcoming Consultation Today",
        message: "Consultation scheduled with Rajesh Sharma at 10:00 AM. Pre-visit AI brief is ready.",
        status: "READ",
        link: `/doctor/patients/${patient1.id}?tab=ai-brief`,
      },
      {
        userId: patient1User.id,
        type: "REMINDER",
        title: "Upcoming Appointment with Dr. Aarav Mehta",
        message: "Your consultation starts shortly at 10:00 AM. Please keep your reports and medicine strips ready.",
        status: "UNREAD",
        link: "/patient",
      },
      {
        userId: patient1User.id,
        type: "REPORT_READY",
        title: "Report Analysis Complete",
        message: "Your July 18 Follow-up Lab Report has been structured and added to your Medical Timeline.",
        status: "READ",
        link: "/patient/timeline",
      },
    ],
  });

  // 15. Create realistic Previous Prescription for Patient 1
  await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: doctorProfile.id,
      diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension, Dyslipidemia",
      medicinesJson: JSON.stringify([
        {
          name: "Tab. Metformin HCl (Glycomet)",
          strength: "500 mg",
          dose: "1 Tab",
          frequency: "Twice daily",
          duration: "90 Days",
          instructions: "Take with or immediately after meals (Breakfast and Dinner) to prevent GI upset.",
        },
        {
          name: "Tab. Telmisartan (Telma)",
          strength: "40 mg",
          dose: "1 Tab",
          frequency: "Once daily",
          duration: "90 Days",
          instructions: "Take every morning at 8:00 AM with water. Monitor BP weekly.",
        },
        {
          name: "Tab. Atorvastatin (Atorva)",
          strength: "20 mg",
          dose: "1 Tab",
          frequency: "Once daily",
          duration: "90 Days",
          instructions: "Take every night at bedtime.",
        },
      ]),
      advice: "Maintain low glycemic index diet. Limit sodium intake to <2g per day. 30 minutes brisk walking daily. Avoid nephrotoxic NSAIDs (e.g. Ibuprofen/Diclofenac).",
      followUpDate: "2024-07-22",
      pdfUrl: "/prescriptions/rx_rajesh_sharma_apr2024.pdf",
      emailStatus: "SENT",
      emailedAt: new Date("2024-04-05T11:30:00Z"),
    },
  });

  // 16. Audit Log
  await prisma.auditLog.createMany({
    data: [
      { userId: doctorUser.id, action: "DOCTOR_LOGIN", details: "Dr. Aarav Mehta logged into CodeRx desktop workspace" },
      { userId: patient1User.id, action: "REPORT_UPLOAD", details: "Uploaded Follow-up Glycemic & Renal Profile (PDF, 512KB)" },
      { userId: patient1User.id, action: "AI_EXTRACTION_SUCCESS", details: "Extracted 11 parameters from report using CodeRx Multimodal AI" },
      { userId: doctorUser.id, action: "WHAT_CHANGED_VIEW", details: "Compared Baseline Jan 2024 vs Follow-up Jul 2024 reports" },
    ],
  });

  console.log("CodeRx database successfully seeded with complete clinical ecosystem!");
}

main()
  .catch((e) => {
    console.error("Error seeding CodeRx:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
