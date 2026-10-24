import { prisma } from "../db/prisma";

export async function createNotification(params: {
  userId: string;
  type: "APPOINTMENT" | "REPORT_READY" | "IMPORTANT_CHANGE" | "PRESCRIPTION" | "REMINDER" | "SYSTEM";
  title: string;
  message: string;
  link?: string;
  scheduledAt?: Date;
}) {
  return await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      scheduledAt: params.scheduledAt,
      status: "UNREAD",
    },
  });
}

export async function scheduleAppointmentReminders(appointmentId: string, appointmentDate: Date, doctorName: string, patientUserId: string) {
  const apptTime = new Date(appointmentDate).getTime();

  const sevenDaysBefore = new Date(apptTime - 7 * 24 * 3600 * 1000);
  const oneDayBefore = new Date(apptTime - 1 * 24 * 3600 * 1000);
  const twoHoursBefore = new Date(apptTime - 2 * 3600 * 1000);

  // 1. Create reminder jobs in DB
  await prisma.reminderJob.createMany({
    data: [
      {
        appointmentId,
        reminderType: "SEVEN_DAYS",
        scheduledAt: sevenDaysBefore,
        status: "SCHEDULED",
      },
      {
        appointmentId,
        reminderType: "ONE_DAY",
        scheduledAt: oneDayBefore,
        status: "SCHEDULED",
      },
      {
        appointmentId,
        reminderType: "TWO_HOURS",
        scheduledAt: twoHoursBefore,
        status: "SCHEDULED",
      },
    ],
  });

  // 2. Add in-app confirmation notification for patient
  await createNotification({
    userId: patientUserId,
    type: "APPOINTMENT",
    title: "Appointment Confirmed",
    message: `Your consultation with ${doctorName} is confirmed for ${new Date(appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}.`,
    link: "/patient",
  });
}

export async function sendPrescriptionEmail(prescriptionId: string, patientEmail: string, doctorName: string) {
  // Update status to SENDING
  await prisma.prescription.update({
    where: { id: prescriptionId },
    data: { emailStatus: "SENDING" },
  });

  // Simulate network dispatch with guaranteed safe development delivery log
  await new Promise((r) => setTimeout(r, 600));

  // Mark as SENT
  const updated = await prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      emailStatus: "SENT",
      emailedAt: new Date(),
    },
  });

  console.log(`[CodeRx Email Engine] Prescription ${prescriptionId} emailed to ${patientEmail} from ${doctorName}. Subject: Your Prescription from ${doctorName} — CodeRx`);
  return updated;
}

export async function recordAudit(userId: string | null, action: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  } catch (err) {
    console.warn("Audit logging failed:", err);
  }
}
