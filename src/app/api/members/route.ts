import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getMemberFromCookie,
  MEMBER_COOKIE,
  memberCookieOptions,
  signMemberToken,
} from "@/lib/member-auth";
import {
  getMembersStorageInfo,
  isValidEmail,
  normalizeEmail,
  readMembers,
  upsertMember,
} from "@/lib/members-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const storage = getMembersStorageInfo();
  const members = await readMembers();

  let message: string | undefined;
  if (storage.mode === "cookie-only") {
    message =
      "Configurá BLOB_READ_WRITE_TOKEN en Vercel para ver y guardar la lista de miembros. Sin Blob, el 15% sigue funcionando en cookie del cliente, pero el admin no puede listar altas.";
  } else if (storage.mode === "blob" && members.length === 0) {
    message =
      "Blob está configurado. Todavía no hay registros — las próximas altas con 15% aparecen acá.";
  }

  return NextResponse.json(
    { members, storage, message },
    { headers: { "Cache-Control": "no-store" } },
  );
}

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
    const cookieMember = await getMemberFromCookie();
    const { member } = await upsertMember({ email, name }, cookieMember);
    const res = NextResponse.json({
      ok: true,
      member: {
        email: member.email,
        name: member.name,
        firstDiscountUsed: member.firstDiscountUsed,
        firstDiscountUsedAt: member.firstDiscountUsedAt,
        createdAt: member.createdAt,
      },
      message: member.firstDiscountUsed
        ? "Ya estás registrado. El 15% de la segunda unidad ya se usó."
        : "Listo. La 2.ª bacha lleva 15%. La primera se paga entera.",
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
          "No pudimos activar el 15% ahora. Probá de nuevo en unos minutos.",
      },
      { status: 500 },
    );
  }
}
