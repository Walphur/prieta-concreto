import { NextResponse } from "next/server";
import {
  getMemberFromCookie,
  MEMBER_COOKIE,
  memberCookieOptions,
  signMemberToken,
} from "@/lib/member-auth";
import {
  markFirstDiscountUsed,
  normalizeEmail,
} from "@/lib/members-store";

export async function POST(request: Request) {
  const fromCookie = await getMemberFromCookie();
  let bodyEmail: string | undefined;
  try {
    const body = (await request.json()) as { email?: string };
    bodyEmail = body.email ? normalizeEmail(body.email) : undefined;
  } catch {
    bodyEmail = undefined;
  }

  const email = fromCookie?.email || bodyEmail;
  if (!email) {
    return NextResponse.json({ error: "Sin sesión de miembro" }, { status: 401 });
  }

  if (fromCookie?.firstDiscountUsed) {
    return NextResponse.json({
      ok: true,
      alreadyUsed: true,
      member: {
        email: fromCookie.email,
        name: fromCookie.name,
        firstDiscountUsed: true,
        firstDiscountUsedAt: fromCookie.firstDiscountUsedAt,
        createdAt: fromCookie.createdAt,
      },
    });
  }

  try {
    const result = await markFirstDiscountUsed(email, fromCookie);
    if (!result) {
      return NextResponse.json({ error: "Miembro no encontrado" }, { status: 404 });
    }

    const { member } = result;
    const res = NextResponse.json({
      ok: true,
      alreadyUsed: false,
      member: {
        email: member.email,
        name: member.name,
        firstDiscountUsed: member.firstDiscountUsed,
        firstDiscountUsedAt: member.firstDiscountUsedAt,
        createdAt: member.createdAt,
      },
    });
    res.cookies.set(
      MEMBER_COOKIE,
      signMemberToken(member),
      memberCookieOptions(),
    );
    return res;
  } catch {
    return NextResponse.json(
      {
        error:
          "No pudimos actualizar el descuento ahora. Probá de nuevo en unos minutos.",
      },
      { status: 500 },
    );
  }
}
