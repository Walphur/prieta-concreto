import type { BachaColorId, BachaShapeId } from "@/lib/bacha-options";

export type ProductCategory = "bachas" | "celosias" | "mesadas";

/** example = muestra de color/modelo (sin stock). available = pieza única a la venta. sold = vendida. */
export type ProductStatus = "example" | "available" | "sold";

export type ProductShape = BachaShapeId | "otro";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  currency: "ARS";
  category: ProductCategory;
  status: ProductStatus;
  shape?: ProductShape;
  /** id oficial: gris-natural, negro, etc. */
  color?: BachaColorId | string;
  featured?: boolean;
  images: string[];
  specs: {
    dimensions: string;
    weight: string;
    material: string;
    finish?: string;
  };
  comingSoon?: boolean;
  createdAt?: string;
  soldAt?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
};

export const BACHA_PRICE = 95000;
