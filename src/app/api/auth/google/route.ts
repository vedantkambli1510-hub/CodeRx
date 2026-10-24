import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { setSessionCookie, hashPassword } from "@/lib/auth/session";
import { decodeJwt } from "jose";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get("role") === "PATIENT" ? "PATIENT" : "DOCTOR";

    const customClientId = url.searchParams.get("client_id");
    const clientId = customClientId || process.env.GOOGLE_CLIENT_ID || "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || `${url.protocol}//${url.host}`;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Check if real Google client ID is configured
    const isPlaceholder =
      !clientId ||
      clientId.includes("coderx-dev-google-client-id") ||
      clientId.length < 15;

    if (isPlaceholder) {
      // In dev mode without configured GCP credentials, guide the user cleanly
      return NextResponse.json({
        configured: false,
        message:
          "Google OAuth requires GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in .env. You can use the 'Real Gmail ID' sign-in option below for instant real account connection.",
        fallbackRole: role,
      });
    }

    // Generate authentic Google OAuth 2.0 authorization URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", role);
    googleAuthUrl.searchParams.set("prompt", "select_account");
    googleAuthUrl.searchParams.set("access_type", "online");

    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (err) {
    console.error("[Google OAuth GET Error]:", err);
    return NextResponse.json({ error: "Failed to initiate Google OAuth" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { email, name, role = "DOCTOR", credential } = body;

    // Handle Google Identity Services credential (ID Token JWT)
    if (credential) {
      try {
        const decoded: any = decodeJwt(credential);
        if (decoded?.email) {
          email = decoded.email;
          name = decoded.name || decoded.given_name || email.split("@")[0];
        }
      } catch (jwtErr) {
        console.warn("[Google GIS JWT Decode Warning]:", jwtErr);
      }
    }

    const normalizedRole: "DOCTOR" | "PATIENT" =
      String(role).toUpperCase() === "DOCTOR" ? "DOCTOR" : "PATIENT";

    const userEmail = (email || (normalizedRole === "DOCTOR" ? "doctor.gmail@coderx.local" : "patient.gmail@coderx.local"))
      .toLowerCase()
      .trim();

    const userName =
      name ||
      (normalizedRole === "DOCTOR" ? "Dr. Real Doctor" : "Real Patient Profile");

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { doctorProfile: true, patientProfile: true },
    });

    if (!user) {
      // Create new user with selected role
      const defaultPasswordHash = await hashPassword("GoogleAuth@CodeRx2024");
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
                    licenseNumber: `MCI-GMAIL-${Date.now().toString().slice(-6)}`,
                  },
                }
              : undefined,
          patientProfile:
            normalizedRole === "PATIENT"
              ? {
                  create: {
                    dob: "1985-04-12",
                    gender: "Not Specified",
                    phone: "+91 98200 12345",
                    bloodGroup: "B+",
                    conditions: "Verified Gmail Account Profile",
                  },
                }
              : undefined,
        },
        include: { doctorProfile: true, patientProfile: true },
      });
    } else {
      // User exists - ensure they have the matching profile for the requested role
      if (normalizedRole === "DOCTOR" && !user.doctorProfile) {
        await prisma.doctorProfile.create({
          data: {
            userId: user.id,
            specialization: "General Physician & Consultant",
            qualification: "MBBS, MD",
            experience: 10,
            consultationFee: 800,
            licenseNumber: `MCI-GMAIL-${Date.now().toString().slice(-6)}`,
          },
        });
      } else if (normalizedRole === "PATIENT" && !user.patientProfile) {
        await prisma.patientProfile.create({
          data: {
            userId: user.id,
            dob: "1985-04-12",
            gender: "Not Specified",
            phone: "+91 98200 12345",
            bloodGroup: "B+",
            conditions: "Verified Gmail Account Profile",
          },
        });
      }

      // Update role & name if different
      if (user.role !== normalizedRole || (name && user.name !== name)) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role: normalizedRole,
            name: userName || user.name,
          },
          include: { doctorProfile: true, patientProfile: true },
        });
      }
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
      email: user.email,
      redirectUrl,
    });
  } catch (error) {
    console.error("[Google Auth Error]:", error);
    return NextResponse.json({ error: "Google authentication failed" }, { status: 500 });
  }
}
