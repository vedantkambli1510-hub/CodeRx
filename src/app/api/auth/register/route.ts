import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth/session";
import { RegisterSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      const firstError = validated.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password, role } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and associated profile atomically based on role
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: role,
        ...(role === "DOCTOR"
          ? {
              doctorProfile: {
                create: {
                  specialization: "General Medicine & Clinical Practice",
                  qualification: "MD, MBBS",
                  experience: 5,
                  consultationFee: 800,
                  clinicInfo: "CodeRx Clinical Care Suite 402",
                },
              },
            }
          : {
              patientProfile: {
                create: {},
              },
            }),
      },
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: role,
    });

    const redirectUrl = role === "DOCTOR" ? "/doctor" : "/patient";

    return NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
      redirectUrl,
    });
  } catch (error) {
    console.error("[Register API Error]:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
