import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  makeUniquePiece,
  readProducts,
  writeProducts,
} from "@/lib/catalog";
import type { Product, ProductStatus } from "@/types/product";
import { BACHA_PRICE } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ProductStatus | null;
  const category = searchParams.get("category");
  let products = await readProducts();

  if (status) products = products.filter((p) => p.status === status);
  if (category) products = products.filter((p) => p.category === category);

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    color?: string;
    shape?: Product["shape"];
    description?: string;
    image?: string;
    status?: ProductStatus;
  };

  if (!body.name?.trim() || !body.image?.trim()) {
    return NextResponse.json(
      { error: "Nombre e imagen son obligatorios" },
      { status: 400 },
    );
  }

  const product = makeUniquePiece({
    name: body.name.trim(),
    color: body.color?.trim(),
    shape: body.shape,
    description: body.description?.trim(),
    image: body.image.trim(),
    status: body.status ?? "available",
  });
  product.price = BACHA_PRICE;

  const products = await readProducts();
  products.unshift(product);
  await writeProducts(products);

  return NextResponse.json(product, { status: 201 });
}
