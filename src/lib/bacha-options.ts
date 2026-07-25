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

/** Medidas por modelo — se completan cuando lleguen los datos oficiales */
export const BACHA_DIMENSIONS: Record<
  BachaShapeId,
  { dimensions: string; note?: string }
> = {
  cuadrado: {
    dimensions: "Medidas a confirmar",
    note: "Pendiente de ficha técnica",
  },
  oval: {
    dimensions: "Medidas a confirmar",
    note: "Pendiente de ficha técnica",
  },
  circular: {
    dimensions: "Medidas a confirmar",
    note: "Pendiente de ficha técnica",
  },
  "circular-tapon": {
    dimensions: "Medidas a confirmar",
    note: "Incluye tapón de concreto a juego",
  },
};
