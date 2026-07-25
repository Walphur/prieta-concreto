import type { Product } from "@/types/product";

/**
 * Catálogo inicial (mock).
 * Arquitectura prevista: Prisma + Postgres + panel admin;
 * reseñas/fotos vía Uploadthing o Firebase Storage.
 * Pagos: Mercado Pago + Mercado Envíos (Córdoba / AR).
 */
export const products: Product[] = [
  {
    id: "bch-oval-01",
    slug: "bacha-oval-sage",
    name: "Bacha Oval Sage",
    description: "Bacha ovalada de concreto pigmentado en verde grisáceo.",
    longDescription:
      "Pieza artesanal vaciada a mano. Superficie sellada para uso diario, con textura mineral sutil y drenaje centrado. Ideal para baños de diseño contemporáneo.",
    price: 185000,
    currency: "ARS",
    category: "bachas",
    stock: 4,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1620626011761-a28690b11c63?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    ],
    specs: {
      dimensions: "55 × 38 × 14 cm",
      weight: "18 kg",
      material: "Concreto pigmentado + sellador food-safe",
      finish: "Mate mineral",
    },
  },
  {
    id: "bch-rect-02",
    slug: "bacha-recta-navy",
    name: "Bacha Recta Navy",
    description: "Líneas geométricas y tono azul marino profundo.",
    longDescription:
      "Diseño arquitectónico de bordes definidos. Pigmentación integrada en la masa del concreto para un color estable y elegante.",
    price: 210000,
    currency: "ARS",
    category: "bachas",
    stock: 2,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
    ],
    specs: {
      dimensions: "60 × 40 × 15 cm",
      weight: "22 kg",
      material: "Concreto pigmentado + sellador",
      finish: "Semi-mate",
    },
  },
  {
    id: "bch-circle-03",
    slug: "bacha-circular-terra",
    name: "Bacha Circular Terra",
    description: "Forma circular con pigmento rojo profundo.",
    longDescription:
      "Pieza statement para baños de autor. El tono rojo profundo remite a la paleta de marca Prieta y aporta calidez industrial.",
    price: 195000,
    currency: "ARS",
    category: "bachas",
    stock: 0,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=80",
    ],
    specs: {
      dimensions: "Ø 48 × 14 cm",
      weight: "16 kg",
      material: "Concreto pigmentado",
      finish: "Mate",
    },
  },
  {
    id: "bch-vessel-04",
    slug: "bacha-vessel-natural",
    name: "Bacha Vessel Natural",
    description: "Sobre mesada, concreto natural sin pigmento.",
    longDescription:
      "Concreto en su expresión más pura. Textura abierta, porosidad controlada y sellado profesional para durabilidad.",
    price: 165000,
    currency: "ARS",
    category: "bachas",
    stock: 6,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1564540586988-aa4e5380613d?auto=format&fit=crop&w=1600&q=80",
    ],
    specs: {
      dimensions: "50 × 35 × 13 cm",
      weight: "15 kg",
      material: "Concreto natural sellado",
      finish: "Mineral crudo",
    },
  },
  {
    id: "cel-01",
    slug: "celosia-modular-a",
    name: "Celosía Modular A",
    description: "Módulo de celosía en concreto para divisiones y fachadas.",
    longDescription:
      "Próximamente. Sistema modular para filtrar luz y generar penumbra cálida en interiores y exteriores.",
    price: 45000,
    currency: "ARS",
    category: "celosias",
    stock: 0,
    comingSoon: true,
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80",
    ],
    specs: {
      dimensions: "40 × 40 × 8 cm",
      weight: "9 kg",
      material: "Concreto estructural",
    },
  },
  {
    id: "mes-01",
    slug: "mesada-integral",
    name: "Mesada Integral",
    description: "Mesada continua de concreto a medida.",
    longDescription:
      "Próximamente. Fabricación a medida con encastre para bachas Prieta y acabados personalizados.",
    price: 0,
    currency: "ARS",
    category: "mesadas",
    stock: 0,
    comingSoon: true,
    images: [
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1600&q=80",
    ],
    specs: {
      dimensions: "A medida",
      weight: "Según proyecto",
      material: "Concreto armado ligero",
    },
  },
];

export function formatPrice(amount: number, currency: "ARS" = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured && !p.comingSoon);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category?: Product["category"] | "all") {
  if (!category || category === "all") {
    return products.filter((p) => !p.comingSoon);
  }
  return products.filter((p) => p.category === category && !p.comingSoon);
}

export function isInStock(product: Product) {
  return product.stock > 0 && !product.comingSoon;
}
