import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  BACHA_DIMENSIONS,
  type BachaShapeId,
} from "@/lib/bacha-options";
import { readProducts, writeProducts } from "@/lib/catalog";
import type { Product, ProductStatus } from "@/types/product";
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
    shape?: Product["shape"];
    description?: string;
    longDescription?: string;
    image?: string;
    featured?: boolean;
  };

  try {
    const products = await readProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx < 0) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const current = products[idx];
    const next = { ...current };

    if (body.name?.trim()) next.name = body.name.trim();
    if (body.color !== undefined) next.color = body.color.trim();
    if (body.shape) {
      next.shape = body.shape;
      const shapeInfo =
        body.shape !== "otro" && body.shape in BACHA_DIMENSIONS
          ? BACHA_DIMENSIONS[body.shape as BachaShapeId]
          : null;
      if (shapeInfo) {
        next.specs = {
          ...next.specs,
          dimensions: shapeInfo.dimensions,
          finish:
            [shapeInfo.wall, shapeInfo.drain, shapeInfo.note]
              .filter(Boolean)
              .join(" · ") || next.specs.finish,
        };
      }
    }
    if (body.description !== undefined) {
      next.description = body.description.trim();
    }
    if (body.longDescription !== undefined) {
      next.longDescription = body.longDescription.trim();
    }
    if (body.image?.trim()) {
      next.images = [body.image.trim(), ...next.images.slice(1)];
    }
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
      if (body.status === "example") {
        next.soldAt = undefined;
        next.featured = true;
      }
    }

    products[idx] = next;
    await writeProducts(products);
    return NextResponse.json(next);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el catálogo",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  try {
    const products = await readProducts();
    const next = products.filter((p) => p.id !== id);
    if (next.length === products.length) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    await writeProducts(next);
    return NextResponse.json({ ok: true, count: next.length });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar del catálogo",
      },
      { status: 500 },
    );
  }
}
