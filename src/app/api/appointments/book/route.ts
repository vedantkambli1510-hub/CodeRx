import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requirePatient } from "@/lib/auth/session";
import { BookAppointmentSchema } from "@/lib/validation/auth";
import { scheduleAppointmentReminders } from "@/lib/notifications/service";

export async function POST(req: Request) {
  try {
    const patient = await requirePatient();
    const body = await req.json();
    const validated = BookAppointmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid booking request parameters" }, { status: 400 });
    }

    const { slotId, doctorId, paymentMethod, transactionId } = validated.data;
    const resolvedTxnId =
      transactionId ||
      `UPI-GPAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}`;
    const resolvedMethod = paymentMethod || "GOOGLE_PAY";


    // Seamless support for demo doctors during product presentations
    if (slotId.startsWith("slot-demo-") || doctorId.startsWith("doc-demo-")) {
      return NextResponse.json({
        success: true,
        appointment: {
          id: `apt-demo-${Date.now()}`,
          slotId,
          doctorId,
          patientId: patient.patientProfileId,
          status: "SCHEDULED",
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Use a transaction with verification to prevent double-booking
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.appointmentSlot.findUnique({
        where: { id: slotId },
      });

      if (!slot) {
        throw new Error("SLOT_NOT_FOUND");
      }

      if (slot.doctorId !== doctorId) {
        throw new Error("SLOT_MISMATCH");
      }

      if (slot.status !== "AVAILABLE") {
        throw new Error("SLOT_NOT_AVAILABLE");
      }

      if (new Date(slot.startTime) <= new Date()) {
        throw new Error("SLOT_EXPIRED");
      }

      // Check if slot already has an active appointment
      const existingApt = await tx.appointment.findUnique({
        where: { slotId },
      });

      if (existingApt && existingApt.status === "SCHEDULED") {
        throw new Error("SLOT_ALREADY_BOOKED");
      }

      // Mark slot BOOKED
      await tx.appointmentSlot.update({
        where: { id: slotId },
        data: { status: "BOOKED" },
      });

      // Fetch doctor details for dynamic fee and checklist personalization
      const doctorProfile = await tx.doctorProfile.findUnique({
        where: { id: doctorId },
        include: { user: true },
      });

      const feeAmount = doctorProfile?.consultationFee || 800;
      const doctorDisplayName = doctorProfile?.user?.name || "your doctor";

      // Create Appointment
      const appointment = await tx.appointment.create({
        data: {
          patientId: patient.patientProfileId,
          doctorId,
          slotId,
          status: "SCHEDULED",
          paymentStatus: "PAID",
          intakeSession: {
            create: {
              status: "NOT_STARTED",
            },
          },
          payment: {
            create: {
              patientId: patient.patientProfileId,
              doctorId,
              amount: feeAmount,
              paymentStatus: "COMPLETED",
              paymentMethod: resolvedMethod,
              transactionId: resolvedTxnId,
            },
          },

        },
        include: {
          slot: true,
          doctor: { include: { user: true } },
          intakeSession: true,
          payment: true,
        },
      });

      // Section 26: Pre-Visit Checklist Items
      await tx.checklistItem.createMany({
        data: [
          {
            patientId: patient.patientProfileId,
            appointmentId: appointment.id,
            text: `Keep your most recent blood test / lab report accessible for ${doctorDisplayName}`,
            isReady: true,
            category: "LABS",
          },
          {
            patientId: patient.patientProfileId,
            appointmentId: appointment.id,
            text: "Bring all current prescription strips and blister packs (Metformin, Telmisartan, Atorvastatin)",
            isReady: false,
            category: "MEDICINES",
          },
          {
            patientId: patient.patientProfileId,
            appointmentId: appointment.id,
            text: "Bring your home blood sugar and blood pressure tracking logbook or mobile records",
            isReady: true,
            category: "NOTES",
          },
          {
            patientId: patient.patientProfileId,
            appointmentId: appointment.id,
            text: "Fasting required: Do not eat or drink (except water) for 10-12 hours prior to scheduled fasting blood test",
            isReady: false,
            category: "GENERAL",
          },
        ],
      });

      return appointment;
    });

    // Section 27: Schedule automated 7-day, 1-day, and 2-hour reminders
    await scheduleAppointmentReminders(
      result.id,
      result.slot.startTime,
      result.doctor.user.name,
      patient.userId
    );

    return NextResponse.json({
      success: true,
      appointment: {
        id: result.id,
        status: result.status,
        slot: result.slot,
        doctor: {
          name: result.doctor.user.name,
          specialization: result.doctor.specialization,
        },
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (
      msg === "SLOT_NOT_AVAILABLE" ||
      msg === "SLOT_ALREADY_BOOKED" ||
      msg === "SLOT_EXPIRED"
    ) {
      return NextResponse.json(
        { error: "That appointment time is no longer available. Please choose another slot." },
        { status: 409 }
      );
    }
    console.error("[Book Appointment Error]:", error);
    return NextResponse.json({ error: "Failed to schedule appointment" }, { status: 500 });
  }
}
