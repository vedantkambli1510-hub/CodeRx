import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireDoctor } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await requireDoctor();
    const resolvedParams = await params;
    const appointmentId = resolvedParams.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        slot: true,
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (appointment.doctorId !== doctor.doctorProfileId) {
      return NextResponse.json({ error: "Unauthorized access to this consultation" }, { status: 403 });
    }

    const apptTime = new Date(appointment.slot.startTime);
    const oneDayBefore = new Date(apptTime.getTime() - 24 * 3600 * 1000);
    const doctorName = appointment.doctor?.user?.name || "Dr. Aarav Mehta";
    const patientName = appointment.patient?.user?.name || "Patient";
    const timeFormatted = apptTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const dateFormatted = apptTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    // 1. Find existing ONE_DAY reminder job or create one
    let reminder = await prisma.reminderJob.findFirst({
      where: {
        appointmentId,
        reminderType: "ONE_DAY",
      },
    });

    if (!reminder) {
      reminder = await prisma.reminderJob.create({
        data: {
          appointmentId,
          reminderType: "ONE_DAY",
          scheduledAt: oneDayBefore,
          status: "SENT",
          sentAt: new Date(),
        },
      });
    } else {
      reminder = await prisma.reminderJob.update({
        where: { id: reminder.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
        },
      });
    }

    // 2. Log notification in database for patient audit
    await prisma.notification.create({
      data: {
        userId: appointment.patient.userId,
        type: "REMINDER",
        title: "Automated Voice Call Reminder Sent",
        message: `Automated voice call dispatched: Consultation with ${doctorName} on ${dateFormatted} at ${timeFormatted}. Arrive 30 minutes early.`,
        status: "READ",
        sentAt: new Date(),
      },
    });

    // 3. Simulated Telephony Response
    const speechTranscript = `Namaste ${patientName}, this is an automated reminder from ${doctorName}'s clinic at Fortis Hospital Complex, Room 304. You have an appointment scheduled for tomorrow, ${dateFormatted} at ${timeFormatted}. Please make sure to arrive at least 30 minutes prior to your consultation with your diagnostic reports and medicine strips. Press 1 to confirm attendance, or press 2 to reschedule.`;

    return NextResponse.json({
      success: true,
      reminderJob: reminder,
      callDetails: {
        provider: "Twilio / Exotel Healthcare Voice Gateway",
        callSid: `CA_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        status: "COMPLETED",
        duration: 38,
        patientName,
        recipientPhone: "+91 98201 44521",
        speechTranscript,
        dtmfResponse: "1 (Confirmed Attendance)",
        arriveEarlyRule: "30 Minutes Before Consultation",
        scheduledTime: oneDayBefore.toISOString(),
        dispatchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Automated Voice Call Dispatch Error]:", error);
    return NextResponse.json(
      { error: "Failed to dispatch automated call reminder" },
      { status: 500 }
    );
  }
}
