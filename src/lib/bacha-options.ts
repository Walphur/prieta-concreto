/** Catálogo oficial Prieta Concreto — tonos y modelos */

export const BACHA_COLORS = [
  {
    id: "gris-natural",
    label: "Gris natural",
    hex: "#9B9791",
  },
  {
    id: "gris-oscuro",
    label: "Gris oscuro",
    hex: "#4C5258",
  },
  {
    id: "rosa",
    label: "Rosa pastel",
    hex: "#CFA39A",
  },
  {
    id: "verde-agua",
    label: "Verde agua",
    hex: "#8FAAA2",
  },
  {
    id: "marmolado",
    label: "Marmolado gris con negro",
    hex: "#6A6E73",
  },
  {
    id: "blanco",
    label: "Blanco",
    hex: "#E6E3DC",
  },
  {
    id: "negro",
    label: "Negro",
    hex: "#2B2E31",
  },
] as const;

/** Modelos de diseño — Forma (cuadrado) último: el que menos se lleva */
export const BACHA_SHAPES = [
  { id: "oval", label: "Lena", mold: "Oval" },
  { id: "circular", label: "Atria", mold: "Circular" },
  { id: "circular-tapon", label: "Aura", mold: "Circular con tapón" },
  { id: "cuadrado", label: "Forma", mold: "Cuadrado" },
] as const;

export type BachaColorId = (typeof BACHA_COLORS)[number]["id"];
export type BachaShapeId = (typeof BACHA_SHAPES)[number]["id"];

export function colorLabel(id?: string) {
  return BACHA_COLORS.find((c) => c.id === id || c.label === id)?.label ?? id ?? "";
}

/** Nombre de modelo (Lena, Forma, Atria, Aura) */
export function shapeLabel(id?: string) {
  return BACHA_SHAPES.find((s) => s.id === id || s.label === id)?.label ?? id ?? "";
}

export function moldLabel(id?: string) {
  return BACHA_SHAPES.find((s) => s.id === id || s.label === id)?.mold ?? "";
}

/** Medidas oficiales por modelo (ficha técnica) */
export const BACHA_DIMENSIONS: Record<
  BachaShapeId,
  {
    dimensions: string;
    detail: string;
    wall?: string;
    drain?: string;
    note?: string;
  }
> = {
  cuadrado: {
    dimensions: "39 × 39 × 12 cm",
    detail: "Exterior 39 × 39 cm · Alto 12 cm",
    wall: "Espesor de pared 1,1 cm",
    drain: "Desagüe Ø 42 mm",
  },
  oval: {
    dimensions: "49 × 33 × 11,5 cm",
    detail: "Largo 49 cm · Ancho 33 cm · Alto 11,5 cm",
    wall: "Espesor de pared 1,1 cm",
    drain: "Desagüe Ø 40 mm",
  },
  circular: {
    dimensions: "Ø 39 × 12 cm",
    detail: "Diámetro exterior 39 cm · Alto 12 cm",
    wall: "Espesor de pared 1,1 cm",
    drain: "Desagüe Ø 42 mm",
  },
  "circular-tapon": {
    dimensions: "Ø 30,5 × 14,5 cm",
    detail: "Diámetro 30,5 cm · Alto 14,5 cm",
    wall: "Espesor de pared 1,1 cm",
    note: "Incluye tapón de desagüe a juego",
  },
};
