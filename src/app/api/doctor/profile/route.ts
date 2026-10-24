import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findFirst({
      where: user.role === "DOCTOR" ? { userId: user.userId } : undefined,
      include: { user: true },
    });

    if (!doctorProfile) {
      return NextResponse.json({
        designation: "Senior Consultant",
        visitingHospitals: "Max Super Speciality Hospital, Apollo Indraprastha",
        specialization: "General Medicine",
        qualification: "MBBS, MD",
        experience: 10,
        consultationFee: 800,
        clinicInfo: "CodeRx Specialty Health Hub, Suite 402",
      });
    }

    return NextResponse.json({
      id: doctorProfile.id,
      name: doctorProfile.user?.name || user.name,
      designation: doctorProfile.designation || "Senior Consultant",
      visitingHospitals: doctorProfile.visitingHospitals || "Max Super Speciality Hospital, Apollo Indraprastha",
      specialization: doctorProfile.specialization,
      qualification: doctorProfile.qualification,
      experience: doctorProfile.experience,
      consultationFee: doctorProfile.consultationFee,
      clinicInfo: doctorProfile.clinicInfo,
      upiId: doctorProfile.upiId || "dr.aarav.mehta@okaxis",
    });
  } catch (error) {
    console.error("[Doctor Profile GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch doctor profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { designation, visitingHospitals, name, specialization, qualification, consultationFee, upiId } = body;

    let doctorProfile = await prisma.doctorProfile.findFirst({
      where: user.role === "DOCTOR" ? { userId: user.userId } : undefined,
    });

    if (!doctorProfile) {
      doctorProfile = await prisma.doctorProfile.create({
        data: {
          userId: user.userId,
          designation: designation || "Senior Consultant",
          visitingHospitals: visitingHospitals || "Max Super Speciality Hospital, Apollo Indraprastha",
          specialization: specialization || "General Medicine",
          qualification: qualification || "MBBS, MD",
          consultationFee: Number(consultationFee) || 800,
          upiId: upiId || "dr.aarav.mehta@okaxis",
        },
      });
    } else {
      doctorProfile = await prisma.doctorProfile.update({
        where: { id: doctorProfile.id },
        data: {
          designation: designation !== undefined ? designation : doctorProfile.designation,
          visitingHospitals: visitingHospitals !== undefined ? visitingHospitals : doctorProfile.visitingHospitals,
          specialization: specialization !== undefined ? specialization : doctorProfile.specialization,
          qualification: qualification !== undefined ? qualification : doctorProfile.qualification,
          consultationFee: consultationFee !== undefined ? Number(consultationFee) : doctorProfile.consultationFee,
          upiId: upiId !== undefined ? upiId : doctorProfile.upiId,
        },
      });
    }

    if (name && user.userId) {
      await prisma.user.update({
        where: { id: user.userId },
        data: { name },
      });
    }

    return NextResponse.json({
      success: true,
      doctorProfile,
    });
  } catch (error) {
    console.error("[Doctor Profile PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update doctor profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return PATCH(req);
}
