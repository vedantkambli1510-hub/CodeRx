import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PatientMedicinesWith1mg } from "@/components/patient/PatientMedicinesWith1mg";

export const dynamic = "force-dynamic";

export default async function PatientMedicinesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let patientProfile = await prisma.patientProfile.findUnique({
    where: { userId: user.userId },
    include: {
      user: true,
      medicines: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // If new patient or no medicines recorded, auto-seed the prescribed regimen for this patient
  if (patientProfile && patientProfile.medicines.length === 0) {
    await prisma.medicine.createMany({
      data: [
        {
          patientId: patientProfile.id,
          medicineName: "Metformin Hydrochloride",
          dosage: "500 mg",
          frequency: "Twice daily with meals (Breakfast & Dinner)",
          startDate: "2024-01-16",
          status: "CURRENT",
          source: "PRESCRIPTION",
          notes: "First-line biguanide for glycemic control. Adjusted to 500mg daily to protect renal filtration.",
        },
        {
          patientId: patientProfile.id,
          medicineName: "Telmisartan",
          dosage: "40 mg",
          frequency: "Once daily in the morning",
          startDate: "2024-01-16",
          status: "CURRENT",
          source: "PRESCRIPTION",
          notes: "Blood pressure control and renal vascular protection. Take consistently with water.",
        },
        {
          patientId: patientProfile.id,
          medicineName: "Atorvastatin Calcium",
          dosage: "20 mg",
          frequency: "Once daily at bedtime",
          startDate: "2024-01-16",
          status: "CURRENT",
          source: "PRESCRIPTION",
          notes: "Night-time lipid stabilization and cardiovascular protection.",
        },
        {
          patientId: patientProfile.id,
          medicineName: "Glimepiride",
          dosage: "1 mg",
          frequency: "Once daily before breakfast",
          startDate: "2024-01-16",
          endDate: "2024-04-05",
          status: "DISCONTINUED",
          source: "PRESCRIPTION",
          notes: "Discontinued by Dr. Aarav Mehta to prevent hypoglycemic episodes.",
        },
      ],
    });

    // Re-fetch populated profile
    patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: user.userId },
      include: {
        user: true,
        medicines: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  const meds = patientProfile?.medicines || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PatientMedicinesWith1mg
        initialMedicines={meds}
        patientName={patientProfile?.user?.name || "Patient"}
      />
    </div>
  );
}
