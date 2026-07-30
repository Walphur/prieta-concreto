import { NextResponse } from "next/server";
import { checkPassword, isAdminAuthenticated } from "@/lib/admin-auth";
import { writeProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";
/** Bundled into the serverless function — do not rely on fs + process.cwd(). */
import productsSeed from "../../../../../data/products.json";

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

  try {
    const products = productsSeed as Product[];
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Catálogo local vacío o inválido" },
        { status: 500 },
      );
    }

    await writeProducts(products);

    return NextResponse.json({
      ok: true,
      count: products.length,
      models: products
        .filter((p) => p.category === "bachas" && !p.comingSoon)
        .map((p) => p.name),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error("[sync-catalog]", error);
    return NextResponse.json(
      {
        error: "No se pudo sincronizar el catálogo a Blob",
        detail: message,
      },
      { status: 500 },
    );
  }
}
