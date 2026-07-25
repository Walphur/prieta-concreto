import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readProducts, writeProducts } from "@/lib/catalog";
import type { ProductStatus } from "@/types/product";
import { BACHA_PRICE } from "@/types/product";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = (await request.json()) as {
    status?: ProductStatus;
    name?: string;
    color?: string;
    description?: string;
    featured?: boolean;
  };

  const products = await readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const current = products[idx];
  const next = { ...current };

  if (body.name) next.name = body.name.trim();
  if (body.color !== undefined) next.color = body.color.trim();
  if (body.description) next.description = body.description.trim();
  if (body.featured !== undefined) next.featured = body.featured;
  if (body.status) {
    next.status = body.status;
    if (body.status === "sold") {
      next.soldAt = new Date().toISOString();
      next.featured = false;
    }
    if (body.status === "available") {
      next.soldAt = undefined;
      next.featured = true;
      next.price = BACHA_PRICE;
    }
  }

  products[idx] = next;
  await writeProducts(products);
  return NextResponse.json(next);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const products = await readProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  await writeProducts(next);
  return NextResponse.json({ ok: true });
}
