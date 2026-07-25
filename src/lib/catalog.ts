import { promises as fs } from "fs";
import path from "path";
import type { Product, ProductStatus } from "@/types/product";
import { BACHA_PRICE } from "@/types/product";
export {
  formatPrice,
  isInStock,
  isPurchasable,
  statusLabel,
} from "@/lib/catalog-shared";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

export async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Product[];
}

export async function writeProducts(products: Product[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
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
  name: string;
  color?: string;
  shape?: Product["shape"];
  description?: string;
  image: string;
  status?: ProductStatus;
}): Product {
  const id = `pieza-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const baseSlug = slugify(input.name) || "pieza";
  const slug = `${baseSlug}-${id.slice(-6)}`;
  const color = input.color || "Personalizado";
  const status = input.status ?? "available";

  return {
    id,
    slug,
    name: input.name,
    description:
      input.description ||
      `Pieza única artesanal${color ? ` · ${color}` : ""}.`,
    longDescription:
      "Pieza única hecha a mano en San Luis. Al ser artesanal, no hay dos iguales. Precio fijo por bacha.",
    price: BACHA_PRICE,
    currency: "ARS",
    category: "bachas",
    status,
    shape: input.shape || "otro",
    color,
    featured: status === "available",
    images: [input.image],
    specs: {
      dimensions: "Consultar / medida de esta pieza",
      weight: "Según pieza",
      material: "Concreto pigmentado + sellador",
      finish: "Mate mineral",
    },
    createdAt: new Date().toISOString(),
  };
}
