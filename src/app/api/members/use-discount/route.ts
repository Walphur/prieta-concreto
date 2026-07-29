import { NextResponse } from "next/server";
import { getMemberEmailFromCookie } from "@/lib/member-auth";
import {
  getMemberByEmail,
  markFirstDiscountUsed,
  normalizeEmail,
} from "@/lib/members-store";

export async function POST(request: Request) {
  const cookieEmail = await getMemberEmailFromCookie();
  let bodyEmail: string | undefined;
  try {
    const body = (await request.json()) as { email?: string };
    bodyEmail = body.email ? normalizeEmail(body.email) : undefined;
  } catch {
    bodyEmail = undefined;
  }

  const email = cookieEmail || bodyEmail;
  if (!email) {
    return NextResponse.json({ error: "Sin sesión de miembro" }, { status: 401 });
  }

  const existing = await getMemberByEmail(email);
  if (!existing) {
    return NextResponse.json({ error: "Miembro no encontrado" }, { status: 404 });
  }

  if (existing.firstDiscountUsed) {
    return NextResponse.json({
      ok: true,
      alreadyUsed: true,
      member: {
        email: existing.email,
        name: existing.name,
        firstDiscountUsed: true,
        createdAt: existing.createdAt,
      },
    });
  }

  try {
    const member = await markFirstDiscountUsed(email);
    return NextResponse.json({
      ok: true,
      alreadyUsed: false,
      member: member
        ? {
            email: member.email,
            name: member.name,
            firstDiscountUsed: member.firstDiscountUsed,
            createdAt: member.createdAt,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo marcar el descuento",
      },
      { status: 500 },
    );
  }
}
