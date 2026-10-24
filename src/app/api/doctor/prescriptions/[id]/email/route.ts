import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { sendPrescriptionEmail } from "@/lib/notifications/service";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    const updated = await sendPrescriptionEmail(
      prescription.id,
      prescription.patient.user.email,
      prescription.doctor.user.name
    );

    return NextResponse.json({
      success: true,
      message: `Prescription dispatched to ${prescription.patient.user.email}`,
      prescription: updated,
    });
  } catch (error) {
    console.error("[Prescription Email Error]:", error);
    return NextResponse.json({ error: "Failed to dispatch email" }, { status: 500 });
  }
}
