import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkPassword, isAdminAuthenticated } from "@/lib/admin-auth";
import { writeProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";

/** Sincroniza data/products.json → Blob (catálogo en producción). */
export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  let body: { password?: string } = {};
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    body = {};
  }

  if (!authed && !checkPassword(body.password || "")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const file = path.join(process.cwd(), "data", "products.json");
  const raw = await fs.readFile(file, "utf8");
  const products = JSON.parse(raw) as Product[];
  await writeProducts(products);

  return NextResponse.json({
    ok: true,
    count: products.length,
    models: products
      .filter((p) => p.category === "bachas" && !p.comingSoon)
      .map((p) => p.name),
  });
}
