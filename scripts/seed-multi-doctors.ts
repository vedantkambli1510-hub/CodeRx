import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DOCTORS_DATA = [
  {
    name: "Dr. Aarav Mehta",
    email: "doctor@coderx.local",
    specialization: "Diabetology & Endocrinology",
    qualification: "MBBS, MD (Medicine), DM (Endocrinology) AIIMS New Delhi",
    designation: "Senior Consultant Diabetologist",
    experience: 14,
    consultationFee: 800,
    clinicInfo: "CodeRx Advanced Health Hub, Floor 4, Cyber City, Gurugram",
    visitingHospitals: "Max Super Speciality Hospital, Fortis Memorial",
    licenseNumber: "MCI-REG-2010-48291",
    bio: "Senior Consultant Physician specializing in complex cardiometabolic disorders, adult diabetes management, insulin therapy, and chronic disease longitudinal care.",
    area: "Cyber City, Gurugram",
    city: "Delhi NCR",
  },
  {
    name: "Dr. Neha Kapoor",
    email: "neha.kapoor@coderx.local",
    specialization: "Pediatrics & Child Care",
    qualification: "MBBS, MD (Pediatrics), DNB, Fellowship in Neonatology",
    designation: "Chief Pediatrician & Child Health Specialist",
    experience: 12,
    consultationFee: 700,
    clinicInfo: "Fortis Memorial Research Institute, Sector 44, Gurugram",
    visitingHospitals: "Fortis Clinic, Rainbow Children's Hospital",
    licenseNumber: "MCI-REG-2012-78102",
    bio: "Passionate child specialist with 12+ years expertise in infant nutrition, immunization schedules, childhood allergic cough, growth monitoring, and pediatric wellness.",
    area: "Sector 44, Gurugram",
    city: "Delhi NCR",
  },
  {
    name: "Dr. Rohan Deshmukh",
    email: "rohan.deshmukh@coderx.local",
    specialization: "General Physician (GP)",
    qualification: "MBBS, MD (Internal Medicine), MRCGP (UK)",
    designation: "Principal Family Physician & GP",
    experience: 16,
    consultationFee: 600,
    clinicInfo: "Apollo Clinic, 100 Feet Road, Indiranagar, Bengaluru",
    visitingHospitals: "Apollo Hospitals, Manipal Hospital",
    licenseNumber: "KMC-REG-2008-39211",
    bio: "Dedicated primary care physician providing whole-family medicine, viral infection triage, hypertension monitoring, acute consultations, and preventive lifestyle guidance.",
    area: "Indiranagar, Bengaluru",
    city: "Bengaluru",
  },
  {
    name: "Dr. Sunita Rao",
    email: "sunita.rao@coderx.local",
    specialization: "Cardiology & Heart Health",
    qualification: "MBBS, MD (Medicine), DM (Cardiology), FACC",
    designation: "Senior Interventional Cardiologist",
    experience: 18,
    consultationFee: 1200,
    clinicInfo: "Max Super Speciality Hospital, Saket, South Delhi",
    visitingHospitals: "Max Healthcare, Medanta Heart Institute",
    licenseNumber: "DMC-REG-2006-19284",
    bio: "Renowned cardiologist offering expert evaluation for chest tightness, high blood pressure, lipid disorders, ECG/2D-Echo analysis, and preventive cardiovascular wellness.",
    area: "Saket, South Delhi",
    city: "Delhi NCR",
  },
  {
    name: "Dr. Vikram Singhania",
    email: "vikram.singhania@coderx.local",
    specialization: "Orthopedics & Joint Care",
    qualification: "MBBS, MS (Orthopedics), MCh (Ortho - UK), Arthroscopy Fellow",
    designation: "Consultant Orthopedic & Joint Surgeon",
    experience: 15,
    consultationFee: 950,
    clinicInfo: "Manipal Hospital, Old Airport Road, Bengaluru",
    visitingHospitals: "Manipal Hospital, Aster CMI Hospital",
    licenseNumber: "KMC-REG-2009-55102",
    bio: "Leading specialist for knee osteoarthritis, sports injuries, lumbar spine pain, ergonomic postural problems, tendonitis, and joint preservation therapies.",
    area: "Old Airport Road, Bengaluru",
    city: "Bengaluru",
  },
  {
    name: "Dr. Ananya Sen",
    email: "ananya.sen@coderx.local",
    specialization: "Dermatology & Skin Care",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy), DVD",
    designation: "Consultant Dermatologist & Dermatosurgeon",
    experience: 9,
    consultationFee: 750,
    clinicInfo: "Kaya Clinic & Wellness, Linking Road, Bandra West, Mumbai",
    visitingHospitals: "Lilavati Hospital, Hinduja Healthcare",
    licenseNumber: "MMC-REG-2015-84920",
    bio: "Specialist dermatologist focusing on persistent acne vulgaris, eczema, psoriasis, hair loss/alopecia, fungal dermatomycoses, and medical skincare regimens.",
    area: "Bandra West, Mumbai",
    city: "Mumbai",
  },
  {
    name: "Dr. Rajesh Kulkarni",
    email: "rajesh.kulkarni@coderx.local",
    specialization: "Neurology & Brain Health",
    qualification: "MBBS, MD (Medicine), DM (Neurology) NIMHANS",
    designation: "Senior Consultant Neurologist",
    experience: 17,
    consultationFee: 1100,
    clinicInfo: "Medanta - The Medicity, Sector 38, Gurugram",
    visitingHospitals: "Medanta Hospital, Artemis Health Institute",
    licenseNumber: "MCI-REG-2007-63910",
    bio: "Consultant neurologist addressing chronic migraines, diabetic peripheral neuropathy, tension headaches, vertigo, tremors, and neuro-muscular health.",
    area: "Sector 38, Gurugram",
    city: "Delhi NCR",
  },
  {
    name: "Dr. Meera Nambiar",
    email: "meera.nambiar@coderx.local",
    specialization: "Obstetrics & Gynecology",
    qualification: "MBBS, MS (OBG), DNB, Fellowship in Reproductive Medicine",
    designation: "Lead Consultant Gynecologist & Women's Health",
    experience: 13,
    consultationFee: 850,
    clinicInfo: "Cloudnine Hospital, Linking Road, Bandra West, Mumbai",
    visitingHospitals: "Cloudnine Hospital, Nanavati Max Super Speciality",
    licenseNumber: "MMC-REG-2011-92841",
    bio: "Empathetic women's health physician specializing in PCOS / PCOD metabolic reversal, menstrual irregularity, hormonal balance, pre-pregnancy guidance, and pelvic care.",
    area: "Bandra West, Mumbai",
    city: "Mumbai",
  },
  {
    name: "Dr. Tariq Alvi",
    email: "tariq.alvi@coderx.local",
    specialization: "Pulmonology & Respiratory Care",
    qualification: "MBBS, MD (Pulmonary Medicine), DNB, FCCP",
    designation: "Chief Pulmonologist & Chest Physician",
    experience: 14,
    consultationFee: 900,
    clinicInfo: "Sir HN Reliance Foundation Hospital, Girgaon, Mumbai",
    visitingHospitals: "Reliance Foundation Hospital, Breach Candy Hospital",
    licenseNumber: "MMC-REG-2010-47291",
    bio: "Dedicated chest specialist diagnosing bronchial asthma, allergic bronchitis, COPD, persistent cough, seasonal respiratory allergies, and sleep apnea evaluation.",
    area: "Girgaon, Mumbai",
    city: "Mumbai",
  },
];

async function main() {
  console.log("Seeding doctors with multi-specialty qualifications and upcoming slots...");

  const passwordHash = await bcrypt.hash("Doctor@123", 10);
  const now = new Date();

  for (const docData of DOCTORS_DATA) {
    // 1. Create or update User & DoctorProfile
    let user = await prisma.user.findUnique({
      where: { email: docData.email },
      include: { doctorProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: docData.name,
          email: docData.email,
          passwordHash,
          role: "DOCTOR",
          doctorProfile: {
            create: {
              specialization: docData.specialization,
              qualification: docData.qualification,
              designation: docData.designation,
              experience: docData.experience,
              consultationFee: docData.consultationFee,
              clinicInfo: docData.clinicInfo,
              visitingHospitals: docData.visitingHospitals,
              licenseNumber: docData.licenseNumber,
              bio: docData.bio,
            },
          },
        },
        include: { doctorProfile: true },
      });
      console.log(`Created new doctor: ${user.name}`);
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: docData.name },
      });
      if (user.doctorProfile) {
        await prisma.doctorProfile.update({
          where: { id: user.doctorProfile.id },
          data: {
            specialization: docData.specialization,
            qualification: docData.qualification,
            designation: docData.designation,
            experience: docData.experience,
            consultationFee: docData.consultationFee,
            clinicInfo: docData.clinicInfo,
            visitingHospitals: docData.visitingHospitals,
            licenseNumber: docData.licenseNumber,
            bio: docData.bio,
          },
        });
      }
      console.log(`Updated existing doctor: ${user.name}`);
    }

    const doctorProfile = user.doctorProfile || (await prisma.doctorProfile.findUnique({ where: { userId: user.id } }))!;

    // 2. Generate future slots for this doctor across the next 5 days
    // Remove expired available slots for this doctor
    await prisma.appointmentSlot.deleteMany({
      where: {
        doctorId: doctorProfile.id,
        status: "AVAILABLE",
        startTime: { lt: now },
      },
    });

    // Time slots pattern (Hour, Minute)
    const slotTimes = [
      { h: 9, m: 30 },  // Morning
      { h: 10, m: 30 }, // Morning
      { h: 11, m: 30 }, // Morning
      { h: 14, m: 0 },  // Afternoon
      { h: 15, m: 30 }, // Afternoon
      { h: 17, m: 0 },  // Evening
      { h: 18, m: 30 }, // Evening
    ];

    let slotsAdded = 0;

    for (let dayOffset = 0; dayOffset <= 5; dayOffset++) {
      for (const t of slotTimes) {
        const slotStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + dayOffset,
          t.h,
          t.m,
          0
        );

        // Only add if slot is in the future
        if (slotStart <= now) continue;

        const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

        // Check if slot already exists
        const exists = await prisma.appointmentSlot.findFirst({
          where: {
            doctorId: doctorProfile.id,
            startTime: slotStart,
          },
        });

        if (!exists) {
          await prisma.appointmentSlot.create({
            data: {
              doctorId: doctorProfile.id,
              startTime: slotStart,
              endTime: slotEnd,
              duration: 30,
              status: "AVAILABLE",
            },
          });
          slotsAdded++;
        }
      }
    }

    console.log(`  Added ${slotsAdded} future available slots for ${docData.name}`);
  }

  console.log("Seeding doctors complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
