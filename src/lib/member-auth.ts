import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { Member } from "@/types/member";

const COOKIE = "prieta_member";

function secret() {
  return (
    process.env.MEMBER_SECRET ||
    process.env.ADMIN_SECRET ||
    "prieta-member-cambia-esto"
  );
}

function b64urlEncode(raw: string) {
  return Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecode(raw: string) {
  const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqualHex(a: string, b: string) {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function isMemberShape(value: unknown): value is Member {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.email === "string" &&
    typeof m.createdAt === "string" &&
    typeof m.firstDiscountUsed === "boolean" &&
    (m.name === undefined || typeof m.name === "string")
  );
}

/** Signed cookie carrying full member record (works without server FS). */
export function signMemberToken(member: Member | string) {
  if (typeof member === "string") {
    const payload = member.trim().toLowerCase();
    return `${payload}.${sign(payload)}`;
  }
  const body = b64urlEncode(
    JSON.stringify({
      v: 1,
      email: member.email.trim().toLowerCase(),
      name: member.name,
      createdAt: member.createdAt,
      firstDiscountUsed: Boolean(member.firstDiscountUsed),
    }),
  );
  return `v1.${body}.${sign(`v1.${body}`)}`;
}

export function verifyMemberToken(token: string | undefined): string | null {
  const member = verifyMemberPayload(token);
  return member?.email ?? null;
}

export function verifyMemberPayload(
  token: string | undefined,
): Member | null {
  if (!token) return null;

  // New format: v1.<base64url(json)>.<sig>
  if (token.startsWith("v1.")) {
    const rest = token.slice(3);
    const dot = rest.lastIndexOf(".");
    if (dot <= 0) return null;
    const body = rest.slice(0, dot);
    const sig = rest.slice(dot + 1);
    if (!body || !sig || !safeEqualHex(sig, sign(`v1.${body}`))) return null;
    try {
      const parsed = JSON.parse(b64urlDecode(body)) as unknown;
      if (!isMemberShape(parsed)) return null;
      return {
        email: parsed.email.trim().toLowerCase(),
        name: parsed.name?.trim() || undefined,
        createdAt: parsed.createdAt,
        firstDiscountUsed: Boolean(parsed.firstDiscountUsed),
      };
    } catch {
      return null;
    }
  }

  // Legacy: email.<sig>
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig || !safeEqualHex(sig, sign(payload))) return null;
  if (!payload.includes("@")) return null;
  return {
    email: payload.trim().toLowerCase(),
    createdAt: new Date(0).toISOString(),
    firstDiscountUsed: false,
  };
}

export async function getMemberEmailFromCookie() {
  const jar = await cookies();
  return verifyMemberToken(jar.get(COOKIE)?.value);
}

export async function getMemberFromCookie(): Promise<Member | null> {
  const jar = await cookies();
  return verifyMemberPayload(jar.get(COOKIE)?.value);
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
