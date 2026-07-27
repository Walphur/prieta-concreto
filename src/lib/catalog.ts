import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import type { Product, ProductStatus } from "@/types/product";
import { BACHA_PRICE } from "@/types/product";
import {
  BACHA_DIMENSIONS,
  colorLabel,
  shapeLabel,
  type BachaColorId,
  type BachaShapeId,
} from "@/lib/bacha-options";
export {
  formatPrice,
  isInStock,
  isPurchasable,
  statusLabel,
} from "@/lib/catalog-shared";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");
const BLOB_CATALOG_PATH = "catalog/products.json";

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocalProducts(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Product[];
}

async function writeLocalProducts(products: Product[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
}

async function readBlobProducts(): Promise<Product[] | null> {
  const { blobs } = await list({
    prefix: "catalog/",
    limit: 20,
  });
  const match = blobs
    .filter((b) => b.pathname === BLOB_CATALOG_PATH)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
  if (!match) return null;

  const res = await fetch(match.url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) return null;
  return (await res.json()) as Product[];
}

async function writeBlobProducts(products: Product[]) {
  await put(BLOB_CATALOG_PATH, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });
}

/** Seed Blob once from the committed JSON. Never call this on every read. */
export async function ensureCatalogSeeded() {
  if (!useBlob()) return { seeded: false, reason: "no-blob" as const };
  const existing = await readBlobProducts();
  if (existing) return { seeded: false, reason: "exists" as const, count: existing.length };
  const seed = await readLocalProducts();
  await writeBlobProducts(seed);
  return { seeded: true, reason: "seeded" as const, count: seed.length };
}

export async function readProducts(): Promise<Product[]> {
  if (useBlob()) {
    const fromBlob = await readBlobProducts();
    if (fromBlob) return fromBlob;
    // Do NOT write on read — concurrent seeds were overwriting admin creates.
    return readLocalProducts();
  }

  return readLocalProducts();
}

export async function writeProducts(products: Product[]) {
  if (useBlob()) {
    await writeBlobProducts(products);
    return;
  }

  await writeLocalProducts(products);
}

export async function getProductBySlug(slug: string) {
  const products = await readProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string) {
  const products = await readProducts();
  return products.find((p) => p.id === id);
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function makeUniquePiece(input: {
  name?: string;
  color?: string;
  shape?: Product["shape"];
  description?: string;
  image: string;
  status?: ProductStatus;
  dimensions?: string;
}): Product {
  const id = `pieza-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const shape = (input.shape || "oval") as BachaShapeId | "otro";
  const color = input.color || "gris-natural";
  const shapeName = shapeLabel(shape) || "Bacha";
  const colorName = colorLabel(color) || color;
  const name = input.name?.trim() || `${shapeName} ${colorName}`;
  const baseSlug = slugify(name) || "pieza";
  const slug = `${baseSlug}-${id.slice(-6)}`;
  const status = input.status ?? "available";

  const shapeInfo =
    shape !== "otro" && shape in BACHA_DIMENSIONS
      ? BACHA_DIMENSIONS[shape as BachaShapeId]
      : null;

  return {
    id,
    slug,
    name,
    description:
      input.description || `Pieza única · ${shapeName} · ${colorName}.`,
    longDescription:
      "Pieza única hecha a mano en San Luis. Al ser artesanal, no hay dos iguales. Precio fijo $80.000 cualquier color o modelo.",
    price: BACHA_PRICE,
    currency: "ARS",
    category: "bachas",
    status,
    shape,
    color: color as BachaColorId | string,
    featured: status === "available",
    images: [input.image],
    specs: {
      dimensions: input.dimensions || shapeInfo?.dimensions || "Consultar",
      weight: "Según pieza",
      material: "Concreto pigmentado + sellador",
      finish:
        [shapeInfo?.wall, shapeInfo?.drain, shapeInfo?.note]
          .filter(Boolean)
          .join(" · ") || "Mate mineral",
    },
    createdAt: new Date().toISOString(),
  };
}
