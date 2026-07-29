import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readReviews, writeReviews } from "@/lib/reviews-store";
import type { ReviewStatus } from "@/types/review";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = (await request.json()) as { status?: ReviewStatus };

  if (!body.status || !["pending", "approved", "rejected"].includes(body.status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const reviews = await readReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  reviews[idx] = { ...reviews[idx], status: body.status };
  await writeReviews(reviews);
  return NextResponse.json(reviews[idx]);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const reviews = await readReviews();
  const next = reviews.filter((r) => r.id !== id);
  if (next.length === reviews.length) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  await writeReviews(next);
  return NextResponse.json({ ok: true });
}
