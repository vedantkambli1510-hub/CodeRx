import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    const whereClause: any = doctorId ? { id: doctorId } : {};

    const doctor = await prisma.doctorProfile.findFirst({
      where: whereClause,
      include: {
        user: true,
        slots: {
          where: {
            status: "AVAILABLE",
            startTime: { gte: new Date() },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "No active doctor found" }, { status: 404 });
    }

    return NextResponse.json({
      doctor: {
        id: doctor.id,
        name: doctor.user.name,
        email: doctor.user.email,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        designation: doctor.designation,
        consultationFee: doctor.consultationFee,
        clinicInfo: doctor.clinicInfo,
        bio: doctor.bio,
        slots: doctor.slots.map((s) => ({
          id: s.id,
          startTime: s.startTime.toISOString(),
          endTime: s.endTime.toISOString(),
          duration: s.duration,
          status: s.status,
        })),
      },
    });
  } catch (error) {
    console.error("[Slots API Error]:", error);
    return NextResponse.json({ error: "Failed to load slots" }, { status: 500 });
  }
}
