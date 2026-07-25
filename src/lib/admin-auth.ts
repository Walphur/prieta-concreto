import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "prieta_admin";

function secret() {
  return process.env.ADMIN_SECRET || "prieta-san-luis-cambia-esto";
}

function password() {
  return process.env.ADMIN_PASSWORD || "prieta2026";
}

export function signToken() {
  const payload = `ok:${Date.now()}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | undefined) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(input: string) {
  return input === password();
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export { COOKIE as ADMIN_COOKIE };
