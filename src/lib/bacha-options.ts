/** Catálogo oficial Prieta Concreto — colores y modelos */

export const BACHA_COLORS = [
  { id: "gris-natural", label: "Gris natural" },
  { id: "gris-oscuro", label: "Gris oscuro" },
  { id: "rosa", label: "Rosa" },
  { id: "verde-agua", label: "Verde agua" },
  { id: "marmolado", label: "Marmolado gris con negro" },
  { id: "blanco", label: "Blanco" },
  { id: "negro", label: "Negro" },
] as const;

export const BACHA_SHAPES = [
  { id: "cuadrado", label: "Cuadrado" },
  { id: "oval", label: "Oval" },
  { id: "circular", label: "Circular" },
  { id: "circular-tapon", label: "Circular con tapón" },
] as const;

export type BachaColorId = (typeof BACHA_COLORS)[number]["id"];
export type BachaShapeId = (typeof BACHA_SHAPES)[number]["id"];

export function colorLabel(id?: string) {
  return BACHA_COLORS.find((c) => c.id === id || c.label === id)?.label ?? id ?? "";
}

export function shapeLabel(id?: string) {
  return BACHA_SHAPES.find((s) => s.id === id || s.label === id)?.label ?? id ?? "";
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
    note: "Incluye tapón / tapa de desagüe de concreto a juego",
  },
};
