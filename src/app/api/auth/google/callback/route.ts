import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { setSessionCookie, hashPassword } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // "DOCTOR" or "PATIENT"
  const error = url.searchParams.get("error");

  const normalizedRole: "DOCTOR" | "PATIENT" =
    state === "PATIENT" ? "PATIENT" : "DOCTOR";

  if (error || !code) {
    console.warn("[Google OAuth Callback Warning]:", error || "No code provided");
    return NextResponse.redirect(
      new URL(`/login?role=${normalizedRole}&error=${encodeURIComponent(error || "Google sign-in was cancelled")}`, req.url)
    );
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || `${url.protocol}//${url.host}`;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Exchange authorization code for access token with Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("[Google OAuth Token Exchange Error]:", tokenData);
      return NextResponse.redirect(
        new URL(`/login?role=${normalizedRole}&error=oauth_token_exchange_failed`, req.url)
      );
    }

    // Fetch user info from Google API
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    const userEmail = (googleUser.email || "").toLowerCase().trim();
    const userName =
      googleUser.name ||
      (normalizedRole === "DOCTOR" ? "Dr. Real Google Doctor" : "Real Google Patient");

    if (!userEmail) {
      return NextResponse.redirect(
        new URL(`/login?role=${normalizedRole}&error=no_email_from_google`, req.url)
      );
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { doctorProfile: true, patientProfile: true },
    });

    if (!user) {
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
                    experience: 8,
                    consultationFee: 750,
                    licenseNumber: `MCI-GMAIL-${Date.now().toString().slice(-6)}`,
                  },
                }
              : undefined,
          patientProfile:
            normalizedRole === "PATIENT"
              ? {
                  create: {
                    dob: "1990-01-01",
                    gender: "Not Specified",
                    phone: "+91 98200 12345",
                    bloodGroup: "B+",
                    conditions: "Verified Google Account Profile",
                  },
                }
              : undefined,
        },
        include: { doctorProfile: true, patientProfile: true },
      });
    } else {
      // Ensure user has profile matching the active role
      if (normalizedRole === "DOCTOR" && !user.doctorProfile) {
        await prisma.doctorProfile.create({
          data: {
            userId: user.id,
            specialization: "General Physician & Consultant",
            qualification: "MBBS, MD",
            experience: 8,
            consultationFee: 750,
            licenseNumber: `MCI-GMAIL-${Date.now().toString().slice(-6)}`,
          },
        });
      } else if (normalizedRole === "PATIENT" && !user.patientProfile) {
        await prisma.patientProfile.create({
          data: {
            userId: user.id,
            dob: "1990-01-01",
            gender: "Not Specified",
            phone: "+91 98200 12345",
            bloodGroup: "B+",
            conditions: "Verified Google Account Profile",
          },
        });
      }

      // Update role and name if changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: normalizedRole,
          name: userName || user.name,
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

    const destination = user.role === "DOCTOR" ? "/doctor" : "/patient";
    return NextResponse.redirect(new URL(destination, req.url));
  } catch (err) {
    console.error("[Google OAuth Callback Fatal Error]:", err);
    return NextResponse.redirect(
      new URL(`/login?role=${normalizedRole}&error=google_auth_failed`, req.url)
    );
  }
}
