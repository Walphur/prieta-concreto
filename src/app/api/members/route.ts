import { NextResponse } from "next/server";
import {
  MEMBER_COOKIE,
  memberCookieOptions,
  signMemberToken,
} from "@/lib/member-auth";
import {
  isValidEmail,
  normalizeEmail,
  upsertMember,
} from "@/lib/members-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; name?: string };
  const email = normalizeEmail(body.email ?? "");
  const name = body.name?.trim();

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Ingresá un email válido." },
      { status: 400 },
    );
  }
  if (name && name.length > 80) {
    return NextResponse.json(
      { error: "El nombre es demasiado largo." },
      { status: 400 },
    );
  }

  try {
    const member = await upsertMember({ email, name });
    const res = NextResponse.json({
      ok: true,
      member: {
        email: member.email,
        name: member.name,
        firstDiscountUsed: member.firstDiscountUsed,
        createdAt: member.createdAt,
      },
      message: member.firstDiscountUsed
        ? "Ya estás registrado. Tu descuento de primera compra ya fue utilizado."
        : "Listo. Tenés 15% de descuento en tu primera compra.",
    });
    res.cookies.set(
      MEMBER_COOKIE,
      signMemberToken(member.email),
      memberCookieOptions(),
    );
    return res;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el acceso",
      },
      { status: 500 },
    );
  }
}
