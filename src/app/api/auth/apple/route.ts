import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { setSessionCookie, hashPassword } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, role = "PATIENT", appleId } = body;

    const normalizedRole: "DOCTOR" | "PATIENT" =
      String(role).toUpperCase() === "DOCTOR" ? "DOCTOR" : "PATIENT";
    const userEmail = (email || "apple.user@privaterelay.appleid.com").toLowerCase().trim();
    const userName = name || (normalizedRole === "DOCTOR" ? "Dr. Aarav Mehta" : "Rajesh Sharma");

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { doctorProfile: true, patientProfile: true },
    });

    if (!user) {
      // Create user with selected role
      const defaultPasswordHash = await hashPassword("AppleAuth@CodeRx2024");
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
          passwordHash: defaultPasswordHash,
          role: normalizedRole,
          doctorProfile:
            normalizedRole === "DOCTOR"
              ? {
                  create: {
                    specialization: "General Physician & Consultant",
                    qualification: "MBBS, MD",
                    experience: 10,
                    consultationFee: 800,
                    licenseNumber: "APPLE-MCI-2024",
                  },
                }
              : undefined,
          patientProfile:
            normalizedRole === "PATIENT"
              ? {
                  create: {
                    dob: "1980-06-20",
                    gender: "Male",
                    phone: "+91 98111 22334",
                    bloodGroup: "B+",
                    conditions: "Routine Preventive Health Profile",
                  },
                }
              : undefined,
        },
        include: { doctorProfile: true, patientProfile: true },
      });
    }

    // Set authenticated session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "PATIENT" | "DOCTOR",
    });

    const redirectUrl = user.role === "DOCTOR" ? "/doctor" : "/patient";

    return NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
      redirectUrl,
    });
  } catch (error) {
    console.error("[Apple Auth Error]:", error);
    return NextResponse.json({ error: "Apple authentication failed" }, { status: 500 });
  }
}
