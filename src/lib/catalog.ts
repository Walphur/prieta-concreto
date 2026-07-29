import { promises as fs } from "fs";
import path from "path";
import { del, list, put } from "@vercel/blob";
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
/** Immutable snapshots — never overwrite the same pathname (CDN cache races). */
const BLOB_VERSION_PREFIX = "catalog/v/";
/** Tiny pointer to the newest snapshot URL; overwritten with no-cache. */
const BLOB_HEAD_PATH = "catalog/head.json";
const MAX_VERSIONS_KEPT = 20;

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

type HeadPointer = { url: string; pathname: string; updatedAt: string };

async function readHeadPointer(): Promise<HeadPointer | null> {
  const { blobs } = await list({ prefix: BLOB_HEAD_PATH, limit: 5 });
  const head = blobs.find((b) => b.pathname === BLOB_HEAD_PATH);
  if (!head) return null;
  const res = await fetch(`${head.url}${head.url.includes("?") ? "&" : "?"}_=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  if (!res.ok) return null;
  return (await res.json()) as HeadPointer;
}

async function fetchProductsJson(url: string): Promise<Product[] | null> {
  const res = await fetch(
    `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`,
    {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    },
  );
  if (!res.ok) return null;
  return (await res.json()) as Product[];
}

async function readNewestVersioned(): Promise<Product[] | null> {
  const { blobs } = await list({
    prefix: BLOB_VERSION_PREFIX,
    limit: 100,
  });
  if (blobs.length === 0) return null;
  const newest = [...blobs].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  return fetchProductsJson(newest.url);
}

async function readLegacyProducts(): Promise<Product[] | null> {
  const legacy = await list({ prefix: "catalog/products", limit: 10 });
  const legacyFile = legacy.blobs
    .filter((b) => b.pathname === "catalog/products.json")
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
  if (!legacyFile) return null;
  return fetchProductsJson(legacyFile.url);
}

async function readBlobProducts(): Promise<Product[] | null> {
  // 1) Prefer HEAD pointer (always points at latest version URL)
  const head = await readHeadPointer();
  if (head?.url) {
    const fromHead = await fetchProductsJson(head.url);
    if (fromHead) return fromHead;
  }

  // 2) Newest versioned snapshot
  const versioned = await readNewestVersioned();
  if (versioned) return versioned;

  // 3) Legacy single-file catalog (pre-versioning)
  return readLegacyProducts();
}

async function pruneOldVersions() {
  try {
    const { blobs } = await list({
      prefix: BLOB_VERSION_PREFIX,
      limit: 100,
    });
    if (blobs.length <= MAX_VERSIONS_KEPT) return;
    const sorted = [...blobs].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
    const toDelete = sorted.slice(MAX_VERSIONS_KEPT).map((b) => b.url);
    if (toDelete.length) await del(toDelete);
  } catch {
    // Non-fatal: keep writing even if prune fails
  }
}

async function writeBlobProducts(products: Product[]) {
  const pathname = `${BLOB_VERSION_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 7)}.json`;
  const blob = await put(pathname, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });

  const pointer: HeadPointer = {
    url: blob.url,
    pathname: blob.pathname,
    updatedAt: new Date().toISOString(),
  };

  await put(BLOB_HEAD_PATH, JSON.stringify(pointer), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });

  void pruneOldVersions();
}

/**
 * Seed Blob once from committed JSON.
 * NEVER re-seed if any catalog blob already exists — that resurrected deleted pieces.
 */
export async function ensureCatalogSeeded() {
  if (!useBlob()) return { seeded: false, reason: "no-blob" as const };

  const existing = await readBlobProducts();
  if (existing) {
    return { seeded: false, reason: "exists" as const, count: existing.length };
  }

  // Extra guard: any file under catalog/ means do not overwrite with local seed
  const { blobs } = await list({ prefix: "catalog/", limit: 20 });
  if (blobs.length > 0) {
    return {
      seeded: false,
      reason: "exists" as const,
      count: blobs.length,
    };
  }

  const seed = await readLocalProducts();
  await writeBlobProducts(seed);
  return { seeded: true, reason: "seeded" as const, count: seed.length };
}

export async function readProducts(): Promise<Product[]> {
  if (useBlob()) {
    const fromBlob = await readBlobProducts();
    if (fromBlob) return fromBlob;
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
      "Pieza única hecha a mano en San Luis. Al ser artesanal, no hay dos iguales. Precio fijo $95.000 cualquier color o modelo.",
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
