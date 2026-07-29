import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const productsPath = path.join(root, "data", "products.json");
const imagesPath = path.join(root, "data", "bacha-images.json");

const DIMS = {
  cuadrado: {
    dimensions: "39 × 39 × 12 cm",
    finish: "Espesor 1,1 cm · Desagüe Ø 42 mm",
  },
  oval: {
    dimensions: "49 × 33 × 11,5 cm",
    finish: "Espesor 1,1 cm · Desagüe Ø 40 mm",
  },
  circular: {
    dimensions: "Ø 39 × 12 cm",
    finish: "Espesor 1,1 cm · Desagüe Ø 42 mm",
  },
  "circular-tapon": {
    dimensions: "Ø 30,5 × 14,5 cm",
    finish: "Incluye tapón de concreto a juego",
  },
};

const COLORS = [
  {
    id: "gris-natural",
    name: "Gris natural",
    description:
      "Ejemplo de color gris natural (incluye tonos claros que parecen blanco).",
    longDescription:
      "Referencia del pigmento gris natural. Las piezas claras ovales o circulares son gris natural, no blanco.",
    preferredShape: "oval",
  },
  {
    id: "gris-oscuro",
    name: "Gris oscuro",
    description: "Ejemplo de color gris oscuro / grafito.",
    longDescription: "Referencia del pigmento gris oscuro.",
    preferredShape: "circular",
  },
  {
    id: "rosa",
    name: "Rosa",
    description: "Ejemplo de color rosa polvo.",
    longDescription: "Referencia del pigmento rosa artesanal.",
    preferredShape: "circular",
  },
  {
    id: "verde-agua",
    name: "Verde agua",
    description: "Ejemplo de color verde agua.",
    longDescription:
      "Referencia del pigmento verde agua (foto de colección hasta tener pieza individual).",
    preferredShape: "oval",
    fallback: ["/gallery/shapes/coleccion/coleccion-colores.jpg"],
  },
  {
    id: "marmolado",
    name: "Marmolado gris con negro",
    description: "Ejemplo de veteado marmolado gris y negro.",
    longDescription:
      "Referencia del efecto marmolado. Cada pieza tiene un veteado distinto.",
    preferredShape: "oval",
  },
  {
    id: "blanco",
    name: "Blanco",
    description: "Única referencia de color blanco (modelo cuadrado).",
    longDescription:
      "El blanco es este tono en cuadrado. Las piezas claras ovales o circulares son gris natural.",
    preferredShape: "cuadrado",
  },
  {
    id: "negro",
    name: "Negro",
    description: "Ejemplo de color negro mate.",
    longDescription: "Referencia del pigmento negro.",
    preferredShape: "oval",
  },
];

const images = JSON.parse(fs.readFileSync(imagesPath, "utf8"));
const existing = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const nonBachas = existing.filter((p) => p.category !== "bachas");

function imagesForColor(colorId) {
  const list = images.filter(
    (i) =>
      i.color === colorId &&
      (i.kind === "studio" || i.kind === "cliente"),
  );
  // studio first, then cliente; preferred shape first
  const preferred =
    COLORS.find((c) => c.id === colorId)?.preferredShape ?? "";
  return list
    .sort((a, b) => {
      const ka =
        (a.kind === "studio" ? 0 : 1) * 10 +
        (a.shape === preferred ? 0 : 1);
      const kb =
        (b.kind === "studio" ? 0 : 1) * 10 +
        (b.shape === preferred ? 0 : 1);
      return ka - kb;
    })
    .map((i) => i.src);
}

const bachas = COLORS.map((c) => {
  let imgs = imagesForColor(c.id);
  if (imgs.length === 0 && c.fallback) imgs = c.fallback;
  const shape = c.preferredShape;
  const dim = DIMS[shape];
  return {
    id: `ex-color-${c.id}`,
    slug: `ejemplo-${c.id}`,
    name: c.name,
    description: c.description,
    longDescription: c.longDescription,
    price: 95000,
    currency: "ARS",
    category: "bachas",
    status: "example",
    shape,
    color: c.id,
    featured: true,
    images: imgs,
    specs: {
      dimensions: dim.dimensions,
      weight: "Según pieza",
      material: "Concreto pigmentado + sellador",
      finish: dim.finish,
    },
    createdAt: "2026-07-25T00:00:00.000Z",
  };
});

const next = [...bachas, ...nonBachas];
fs.writeFileSync(productsPath, JSON.stringify(next, null, 2) + "\n");
console.log(
  "Productos color:",
  bachas.map((b) => `${b.color}:${b.images.length}`).join(" · "),
);
