import type { Product } from "@/types/product";
import { productPhotos } from "@/lib/gallery";

/**
 * Catálogo Prieta Concreto (San Luis, AR).
 * Pagos: transferencia bancaria. Sin pasarela.
 */
export const products: Product[] = [
  {
    id: "bch-oval-negro",
    slug: "bacha-oval-negro",
    name: "Bacha Oval Negro",
    description: "Ovalada de concreto en negro mate profundo.",
    longDescription:
      "Pieza artesanal vaciada a mano en San Luis. Superficie sellada para uso diario, con textura mineral sutil y drenaje centrado.",
    price: 185000,
    currency: "ARS",
    category: "bachas",
    stock: 3,
    featured: true,
    images: [productPhotos.ovalNegro, productPhotos.ovalCarbonPerfil],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado + sellador",
      finish: "Mate mineral",
    },
  },
  {
    id: "bch-oval-marmol",
    slug: "bacha-oval-marmol",
    name: "Bacha Oval Mármol",
    description: "Ovalada con veteado tipo mármol negro y blanco.",
    longDescription:
      "Pigmentación artesanal con efecto humo/mármol. Cada pieza es única: el veteado no se repite.",
    price: 220000,
    currency: "ARS",
    category: "bachas",
    stock: 2,
    featured: true,
    images: [
      productPhotos.ovalMarmol,
      productPhotos.ovalMarmolOscuro,
      productPhotos.ovalMarmolHumo,
      productPhotos.clienteMarmol,
    ],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado",
      finish: "Satinado",
    },
  },
  {
    id: "bch-circular-carbon",
    slug: "bacha-circular-carbon",
    name: "Bacha Circular Carbón",
    description: "Circular profunda en carbón / grafito.",
    longDescription:
      "Forma circular limpia, bordes definidos y acabado sellado. Ideal como vessel sobre mesada.",
    price: 165000,
    currency: "ARS",
    category: "bachas",
    stock: 4,
    featured: true,
    images: [
      productPhotos.circularCarbon,
      productPhotos.circularGrafito,
      productPhotos.clienteCircular,
    ],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado + sellador",
      finish: "Mate",
    },
  },
  {
    id: "bch-circular-clara",
    slug: "bacha-circular-clara",
    name: "Bacha Circular Clara",
    description: "Circular en concreto natural claro.",
    longDescription:
      "Concreto en su expresión más limpia. Textura mineral y sellado profesional.",
    price: 155000,
    currency: "ARS",
    category: "bachas",
    stock: 5,
    featured: true,
    images: [
      productPhotos.circularClaro,
      productPhotos.circularGrisClaro,
      productPhotos.clienteClara,
    ],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto natural sellado",
      finish: "Mineral",
    },
  },
  {
    id: "bch-oval-crema",
    slug: "bacha-oval-crema",
    name: "Bacha Oval Crema",
    description: "Ovalada clara, tono crema mineral.",
    longDescription:
      "Tono claro que aporta luminosidad al baño. Sellada para uso diario.",
    price: 175000,
    currency: "ARS",
    category: "bachas",
    stock: 3,
    featured: false,
    images: [productPhotos.ovalCrema, productPhotos.ovalCremaMineral],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado",
      finish: "Mate mineral",
    },
  },
  {
    id: "bch-circular-rosa",
    slug: "bacha-circular-rosa",
    name: "Bacha Circular Rosa",
    description: "Circular en rosa polvo con textura artesanal.",
    longDescription:
      "Pigmento rosa suave. Interior liso y exterior con porosidad natural del vaciado.",
    price: 170000,
    currency: "ARS",
    category: "bachas",
    stock: 2,
    featured: false,
    images: [productPhotos.circularRosa, productPhotos.circularRosaMate],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado",
      finish: "Semi-mate",
    },
  },
  {
    id: "bch-cuadrada-gris",
    slug: "bacha-cuadrada-gris",
    name: "Bacha Cuadrada Gris",
    description: "Cuadrada de esqueros redondeados en gris.",
    longDescription:
      "Geometría suave: cuadrado con vértices generosos. Lectura contemporánea.",
    price: 180000,
    currency: "ARS",
    category: "bachas",
    stock: 2,
    featured: false,
    images: [productPhotos.cuadradaGris, productPhotos.cuadradaCrema],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado",
      finish: "Mate",
    },
  },
  {
    id: "bch-oval-gris",
    slug: "bacha-oval-gris",
    name: "Bacha Oval Gris",
    description: "Ovalada en gris medio neutro.",
    longDescription:
      "Gris equilibrado para baños de diseño. Acabado sellado y drenaje centrado.",
    price: 175000,
    currency: "ARS",
    category: "bachas",
    stock: 4,
    featured: false,
    images: [productPhotos.ovalGris, productPhotos.ovalGrisSuave],
    specs: {
      dimensions: "Consultar medidas",
      weight: "Según modelo",
      material: "Concreto pigmentado",
      finish: "Mate",
    },
  },
  {
    id: "cel-circulo",
    slug: "celosia-circulo",
    name: "Celosía Círculo",
    description: "Módulo con embudo circular que filtra luz y aire.",
    longDescription:
      "Próximamente. Celosía modular de concreto con depresión circular y apertura central.",
    price: 0,
    currency: "ARS",
    category: "celosias",
    stock: 0,
    comingSoon: true,
    images: ["/products/celosias/circulo.png"],
    specs: {
      dimensions: "Módulo cuadrado (consultar)",
      weight: "Según módulo",
      material: "Concreto",
      finish: "Mate mineral",
    },
  },
  {
    id: "cel-ranura",
    slug: "celosia-ranura",
    name: "Celosía Ranura",
    description: "Bloque con ranura vertical y caras biseladas.",
    longDescription:
      "Próximamente. Módulo de concreto con ranura vertical centrada.",
    price: 0,
    currency: "ARS",
    category: "celosias",
    stock: 0,
    comingSoon: true,
    images: ["/products/celosias/ranura.png"],
    specs: {
      dimensions: "Módulo cuadrado (consultar)",
      weight: "Según módulo",
      material: "Concreto",
      finish: "Mate mineral",
    },
  },
  {
    id: "cel-diagonal",
    slug: "celosia-diagonal",
    name: "Celosía Diagonal",
    description: "Triángulos de concreto y vacío en diagonal.",
    longDescription:
      "Próximamente. Celosía con partición diagonal de alto contraste.",
    price: 0,
    currency: "ARS",
    category: "celosias",
    stock: 0,
    comingSoon: true,
    images: ["/products/celosias/diagonal.png"],
    specs: {
      dimensions: "Módulo cuadrado (consultar)",
      weight: "Según módulo",
      material: "Concreto",
      finish: "Mate mineral",
    },
  },
  {
    id: "cel-horizontales",
    slug: "celosia-horizontales",
    name: "Celosía Horizontales",
    description: "Lamas horizontales inclinadas para ventilación.",
    longDescription:
      "Próximamente. Bloque rectangular con tres lamas horizontales.",
    price: 0,
    currency: "ARS",
    category: "celosias",
    stock: 0,
    comingSoon: true,
    images: ["/products/celosias/horizontales.png"],
    specs: {
      dimensions: "Módulo rectangular (consultar)",
      weight: "Según módulo",
      material: "Concreto",
      finish: "Mate mineral",
    },
  },
  {
    id: "mes-01",
    slug: "mesada-integral",
    name: "Mesada Integral",
    description: "Mesada continua de concreto a medida.",
    longDescription:
      "Próximamente. Fabricación a medida con encastre para bachas Prieta.",
    price: 0,
    currency: "ARS",
    category: "mesadas",
    stock: 0,
    comingSoon: true,
    images: [productPhotos.clienteMarmol],
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
