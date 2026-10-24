import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { setSessionCookie, hashPassword } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, name, role = "PATIENT", otp } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^\d+]/g, "").trim();
    const sanitizedDigits = cleanPhone.replace(/\D/g, "");
    const normalizedRole: "DOCTOR" | "PATIENT" =
      String(role).toUpperCase() === "DOCTOR" ? "DOCTOR" : "PATIENT";
    const userEmail = `phone_${sanitizedDigits}@coderx.local`;
    const userName = name || (normalizedRole === "DOCTOR" ? "Dr. Aarav Mehta" : "Rajesh Sharma");

    // Check if user exists with this phone email
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { doctorProfile: true, patientProfile: true },
    });

    if (!user) {
      // Create user with phone profile
      const defaultPasswordHash = await hashPassword("PhoneAuth@CodeRx2024");
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
                    specialization: "Family Medicine & Emergency Care",
                    qualification: "MBBS, DNB",
                    experience: 8,
                    consultationFee: 700,
                    licenseNumber: `PHONE-MCI-${sanitizedDigits.slice(-4)}`,
                  },
                }
              : undefined,
          patientProfile:
            normalizedRole === "PATIENT"
              ? {
                  create: {
                    dob: "1985-03-12",
                    gender: "Male",
                    phone: cleanPhone,
                    bloodGroup: "O+",
                    conditions: "Longitudinal Primary Health Care",
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
    console.error("[Phone Auth Error]:", error);
    return NextResponse.json({ error: "Phone authentication failed" }, { status: 500 });
  }
}
