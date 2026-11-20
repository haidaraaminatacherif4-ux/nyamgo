import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const secretValue = process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "nyamgo-development-secret-do-not-use-in-production");
if (secretValue.length < 32) {
  throw new Error("AUTH_SECRET must contain at least 32 characters.");
}
const secret = new TextEncoder().encode(secretValue);
const COOKIE = "nyamgo_session";

export async function createSession(user: { id: string; role: string }) {
  const token = await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" }).setSubject(user.id)
    .setIssuedAt().setExpirationTime("7d").sign(secret);
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession() {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    return await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true, restaurant: { select: { id: true, slug: true, name: true } } } });
  } catch { return null; }
}

export async function requireRole(roles: string[]) {
  const user = await getSession();
  if (!user || !roles.includes(user.role)) return null;
  return user;
}

export const sessionCookieName = COOKIE;
