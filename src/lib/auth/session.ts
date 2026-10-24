import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signSessionToken, verifySessionToken, SessionPayload } from "./jwt";
import { prisma } from "../db/prisma";

export const SESSION_COOKIE_NAME = "triageai_session";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function requireAuth(): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requirePatient(): Promise<SessionPayload & { patientProfileId: string }> {
  const user = await requireAuth();
  if (user.role !== "PATIENT") {
    throw new Error("FORBIDDEN_DOCTOR_ACCESS_DENIED");
  }
  const patient = await prisma.patientProfile.findUnique({
    where: { userId: user.userId },
  });
  if (!patient) {
    throw new Error("PATIENT_PROFILE_NOT_FOUND");
  }
  return { ...user, patientProfileId: patient.id };
}

export async function requireDoctor(): Promise<SessionPayload & { doctorProfileId: string }> {
  const user = await requireAuth();
  if (user.role !== "DOCTOR") {
    throw new Error("FORBIDDEN_PATIENT_ACCESS_DENIED");
  }
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId: user.userId },
  });
  if (!doctor) {
    throw new Error("DOCTOR_PROFILE_NOT_FOUND");
  }
  return { ...user, doctorProfileId: doctor.id };
}
