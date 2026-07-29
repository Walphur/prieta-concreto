import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "prieta_member";

function secret() {
  return process.env.MEMBER_SECRET || process.env.ADMIN_SECRET || "prieta-member-cambia-esto";
}

export function signMemberToken(email: string) {
  const payload = email.trim().toLowerCase();
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyMemberToken(token: string | undefined): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    const ok = timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    return ok ? payload : null;
  } catch {
    return null;
  }
}

export async function getMemberEmailFromCookie() {
  const jar = await cookies();
  return verifyMemberToken(jar.get(COOKIE)?.value);
}

export function memberCookieOptions(maxAge = 60 * 60 * 24 * 365) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

export { COOKIE as MEMBER_COOKIE };
