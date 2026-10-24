import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { DoctorPaymentsClient } from "./DoctorPaymentsClient";

export const dynamic = "force-dynamic";

export default async function DoctorPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: user.userId },
    include: { user: true },
  });

  const payments = await prisma.payment.findMany({
    where: { doctorId: doctorProfile?.id },
    orderBy: { createdAt: "desc" },
    include: {
      patient: { include: { user: true } },
      appointment: { include: { slot: true } },
    },
  });

  const serializedPayments = payments.map((p) => ({
    id: p.id,
    amount: p.amount,
    paymentMethod: p.paymentMethod,
    paymentStatus: p.paymentStatus,
    transactionId: p.transactionId,
    createdAt: p.createdAt.toISOString(),
    patient: {
      user: {
        name: p.patient.user.name,
        email: p.patient.user.email,
      },
    },
    appointment: p.appointment?.slot
      ? {
          slot: {
            startTime: p.appointment.slot.startTime.toISOString(),
            duration: p.appointment.slot.duration,
          },
        }
      : null,
  }));

  const docData = {
    id: doctorProfile?.id || "doc-1",
    name: doctorProfile?.user?.name || user.name,
    specialization: doctorProfile?.specialization || "General Medicine & Diabetology",
    consultationFee: doctorProfile?.consultationFee || 800,
    clinicInfo: doctorProfile?.clinicInfo || "CodeRx Advanced Health Hub",
    upiId: doctorProfile?.upiId || "dr.aarav.mehta@okaxis",
  };

  return (
    <DoctorPaymentsClient
      initialPayments={serializedPayments}
      doctorProfile={docData}
    />
  );
}
