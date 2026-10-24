import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireDoctor } from "@/lib/auth/session";
import { DoctorSlotCreateSchema } from "@/lib/validation/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const doctor = await requireDoctor();

    const slots = await prisma.appointmentSlot.findMany({
      where: { doctorId: doctor.doctorProfileId },
      orderBy: { startTime: "asc" },
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            intakeSession: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[Get Slots Error]:", error);
    return NextResponse.json({ error: "Failed to load slots" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const doctor = await requireDoctor();
    const body = await req.json();

    // 1. Check for Batch / Shift Generation Request
    if (body.action === "GENERATE_SHIFT") {
      const { date, shiftType, duration = 30 } = body;
      if (!date || !shiftType) {
        return NextResponse.json(
          { error: "Date and shift type required" },
          { status: 400 }
        );
      }

      let timePoints: string[] = [];
      if (shiftType === "MORNING") {
        timePoints = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];
      } else if (shiftType === "AFTERNOON") {
        timePoints = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
      } else if (shiftType === "EVENING") {
        timePoints = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
      }

      const createdSlots = [];
      for (const timeStr of timePoints) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const startDateTime = new Date(`${date}T00:00:00`);
        startDateTime.setHours(hours, minutes, 0, 0);

        if (startDateTime <= new Date()) continue; // Skip past times

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + duration);

        // Check for existing overlap
        const existing = await prisma.appointmentSlot.findFirst({
          where: {
            doctorId: doctor.doctorProfileId,
            startTime: { lt: endDateTime },
            endTime: { gt: startDateTime },
          },
        });

        if (!existing) {
          const slot = await prisma.appointmentSlot.create({
            data: {
              doctorId: doctor.doctorProfileId,
              startTime: startDateTime,
              endTime: endDateTime,
              duration,
              status: "AVAILABLE",
            },
          });
          createdSlots.push(slot);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully generated ${createdSlots.length} slots for ${shiftType} shift.`,
        createdCount: createdSlots.length,
      });
    }

    // 2. Single slot creation
    const validated = DoctorSlotCreateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid slot parameters" }, { status: 400 });
    }

    const { date, startTime, duration } = validated.data;
    const [hours, minutes] = startTime.split(":").map(Number);

    const startDateTime = new Date(`${date}T00:00:00`);
    startDateTime.setHours(hours, minutes, 0, 0);

    if (startDateTime <= new Date()) {
      return NextResponse.json(
        { error: "Slot start time must be in the future." },
        { status: 400 }
      );
    }

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);

    // Check for overlap
    const existingOverlap = await prisma.appointmentSlot.findFirst({
      where: {
        doctorId: doctor.doctorProfileId,
        startTime: { lt: endDateTime },
        endTime: { gt: startDateTime },
      },
    });

    if (existingOverlap) {
      return NextResponse.json(
        { error: "This time window overlaps with an existing consultation slot." },
        { status: 409 }
      );
    }

    const slot = await prisma.appointmentSlot.create({
      data: {
        doctorId: doctor.doctorProfileId,
        startTime: startDateTime,
        endTime: endDateTime,
        duration,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (error) {
    console.error("[Create Slot Error]:", error);
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const doctor = await requireDoctor();
    const body = await req.json();
    const { slotId, status } = body;

    if (!slotId || !status) {
      return NextResponse.json({ error: "Slot ID and status required" }, { status: 400 });
    }

    const slot = await prisma.appointmentSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.doctorId !== doctor.doctorProfileId) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.status === "BOOKED") {
      return NextResponse.json({ error: "Cannot block already booked slot" }, { status: 400 });
    }

    const updated = await prisma.appointmentSlot.update({
      where: { id: slotId },
      data: { status },
    });

    return NextResponse.json({ success: true, slot: updated });
  } catch (error) {
    console.error("[Update Slot Error]:", error);
    return NextResponse.json({ error: "Failed to update slot" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const doctor = await requireDoctor();
    const { searchParams } = new URL(req.url);
    const slotId = searchParams.get("id");
    const all = searchParams.get("all") === "true";

    if (all) {
      // Delete all slots for this doctor (or unbooked ones if booked exist)
      const force = searchParams.get("force") === "true";
      if (force) {
        const appts = await prisma.appointment.findMany({
          where: { doctorId: doctor.doctorProfileId },
          select: { id: true },
        });
        if (appts.length > 0) {
          await prisma.reminderJob.deleteMany({
            where: { appointmentId: { in: appts.map((a) => a.id) } },
          });
          await prisma.appointment.deleteMany({
            where: { doctorId: doctor.doctorProfileId },
          });
        }
        await prisma.appointmentSlot.deleteMany({
          where: { doctorId: doctor.doctorProfileId },
        });
      } else {
        await prisma.appointmentSlot.deleteMany({
          where: {
            doctorId: doctor.doctorProfileId,
            status: "AVAILABLE",
          },
        });
      }

      return NextResponse.json({ success: true, message: "Slots cleared successfully" });
    }

    if (!slotId) {
      return NextResponse.json({ error: "Slot ID required" }, { status: 400 });
    }

    const slot = await prisma.appointmentSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.doctorId !== doctor.doctorProfileId) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.status === "BOOKED") {
      return NextResponse.json(
        { error: "Booked consultation slots cannot be removed directly without rescheduling or cancelling the appointment." },
        { status: 400 }
      );
    }

    await prisma.appointmentSlot.delete({
      where: { id: slotId },
    });

    return NextResponse.json({ success: true, message: "Slot removed" });
  } catch (error) {
    console.error("[Delete Slot Error]:", error);
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
  }
}
