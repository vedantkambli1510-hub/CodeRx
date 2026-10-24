import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.SESSION_SECRET || "fallback-secret-for-development-change-in-env-32-chars-min";
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload {
  userId: string;
  role: "PATIENT" | "DOCTOR";
  email: string;
  name: string;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
