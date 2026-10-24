import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getDoctorUpiVpa } from "@/lib/payment/upi";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = params.id;
    const { searchParams } = new URL(req.url);
    const filterDate = searchParams.get("date"); // YYYY-MM-DD (optional)

    const now = new Date();

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        slots: {
          where: {
            status: "AVAILABLE",
            startTime: { gte: now },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Filter by specific date if requested
    let slots = doctor.slots;
    if (filterDate) {
      slots = slots.filter(
        (s) => s.startTime.toISOString().split("T")[0] === filterDate
      );
    }

    // Group slots by date and period
    const groupedByDate: Record<
      string,
      {
        dateStr: string;
        dateFormatted: string;
        isToday: boolean;
        isTomorrow: boolean;
        totalSlots: number;
        morning: Array<{ id: string; startTime: string; endTime: string; duration: number }>;
        afternoon: Array<{ id: string; startTime: string; endTime: string; duration: number }>;
        evening: Array<{ id: string; startTime: string; endTime: string; duration: number }>;
      }
    > = {};

    const todayStr = now.toISOString().split("T")[0];
    const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

    slots.forEach((s) => {
      const dStr = s.startTime.toISOString().split("T")[0];
      if (!groupedByDate[dStr]) {
        const slotDate = new Date(s.startTime);
        groupedByDate[dStr] = {
          dateStr: dStr,
          dateFormatted: slotDate.toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          isToday: dStr === todayStr,
          isTomorrow: dStr === tomorrowStr,
          totalSlots: 0,
          morning: [],
          afternoon: [],
          evening: [],
        };
      }

      groupedByDate[dStr].totalSlots += 1;

      const hour = s.startTime.getHours();
      const slotItem = {
        id: s.id,
        startTime: s.startTime.toISOString(),
        endTime: s.endTime.toISOString(),
        duration: s.duration,
      };

      if (hour < 12) {
        groupedByDate[dStr].morning.push(slotItem);
      } else if (hour < 16) {
        groupedByDate[dStr].afternoon.push(slotItem);
      } else {
        groupedByDate[dStr].evening.push(slotItem);
      }
    });

    return NextResponse.json({
      success: true,
      extractedAt: new Date().toISOString(),
      doctor: {
        id: doctor.id,
        name: doctor.user.name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        designation: doctor.designation,
        consultationFee: doctor.consultationFee,
        clinicInfo: doctor.clinicInfo,
        upiId: getDoctorUpiVpa(doctor.user.name, doctor.upiId),
        totalAvailableSlots: slots.length,
      },
      dates: Object.values(groupedByDate),
    });
  } catch (error) {
    console.error("[Doctor Slot Extraction API Error]:", error);
    return NextResponse.json(
      { error: "Failed to extract doctor slots" },
      { status: 500 }
    );
  }
}
