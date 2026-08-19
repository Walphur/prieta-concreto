import { NextResponse } from "next/server";
import {
  getMemberFromCookie,
  MEMBER_COOKIE,
  memberCookieOptions,
  signMemberToken,
} from "@/lib/member-auth";
import { getMemberByEmail } from "@/lib/members-store";

export async function GET() {
  const fromCookie = await getMemberFromCookie();
  if (!fromCookie) {
    return NextResponse.json(
      { member: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // Prefer shared store when available (syncs firstDiscountUsed across devices).
  const fromStore = await getMemberByEmail(fromCookie.email);
  const member = fromStore
    ? {
        email: fromStore.email,
        name: fromStore.name ?? fromCookie.name,
        firstDiscountUsed:
          fromStore.firstDiscountUsed || fromCookie.firstDiscountUsed,
        firstDiscountUsedAt:
          fromStore.firstDiscountUsedAt || fromCookie.firstDiscountUsedAt,
        createdAt: fromStore.createdAt || fromCookie.createdAt,
      }
    : {
        email: fromCookie.email,
        name: fromCookie.name,
        firstDiscountUsed: fromCookie.firstDiscountUsed,
        firstDiscountUsedAt: fromCookie.firstDiscountUsedAt,
        createdAt: fromCookie.createdAt,
      };

  const res = NextResponse.json(
    { member },
    { headers: { "Cache-Control": "no-store" } },
  );

  // Keep signed cookie as source of truth (upgrades legacy email-only tokens).
  res.cookies.set(
    MEMBER_COOKIE,
    signMemberToken(member),
    memberCookieOptions(),
  );

  return res;
}
