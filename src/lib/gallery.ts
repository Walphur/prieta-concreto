import data from "@/lib/gallery-data.json";
import bachaImages from "../../data/bacha-images.json";

export type GalleryItem = {
  src: string;
  label: string;
  alt: string;
  kind: "producto" | "cliente" | "video";
};

export type BachaImage = {
  src: string;
  shape: string;
  color: string;
  kind: string;
  file?: string;
};

export const allBachaImages = bachaImages as BachaImage[];

export const galleryProducto = data.producto as GalleryItem[];
export const galleryClientes = data.clientes as GalleryItem[];
export const galleryVideos = data.videos as GalleryItem[];

export const galleryGrupos: GalleryItem[] = allBachaImages
  .filter((i) => i.kind === "grupo" && !i.src.includes("feria"))
  .map((i) => {
    const label =
      i.shape === "coleccion"
        ? i.src.includes("colores")
          ? "Varios colores"
          : "En el taller"
        : i.src.includes("duo")
          ? `Dos · ${i.shape}`
          : `Varias · ${i.shape}`;
    return {
      src: i.src,
      label,
      alt: `Bachas ${i.shape}`,
      kind: "producto" as const,
    };
  });

export const galleryAll: GalleryItem[] = [
  ...galleryProducto,
  ...galleryClientes,
  ...galleryGrupos,
];

export function imagesByShape(shape: string) {
  return allBachaImages.filter((i) => i.shape === shape);
}

export function imagesByColor(color: string) {
  return allBachaImages.filter(
    (i) => i.color === color && (i.kind === "studio" || i.kind === "cliente"),
  );
}

/** Rutas estables usadas por home / hero */
export const productPhotos = {
  circularCarbon: "/gallery/shapes/circular/gris-oscuro.jpg",
  ovalNegro: "/gallery/shapes/oval/negro.jpg",
  ovalMarmol: "/gallery/shapes/oval/marmolado.jpg",
  circularClaro: "/gallery/shapes/circular-tapon/gris-natural.jpg",
  ovalCrema: "/gallery/shapes/oval/gris-natural-claro.jpg",
  circularRosa: "/gallery/shapes/circular/rosa.jpg",
  cuadradaBlanco: "/gallery/shapes/cuadrado/blanco.jpg",
  coleccion: "/gallery/shapes/coleccion/coleccion-colores.jpg",
  coleccionEstudio: "/gallery/shapes/coleccion/coleccion-estudio.jpg",
  feria: "/gallery/shapes/coleccion/feria.jpg",
  clienteCircular: "/gallery/shapes/circular-tapon/cliente-natural.jpg",
  clienteClara: "/gallery/shapes/circular/cliente-natural.jpg",
  clienteMarmol: "/gallery/shapes/oval/cliente-marmol.jpg",
  clienteMarmolMadera: "/gallery/clientes/cliente-oval-marmol-madera.png",
  clienteGrisOscuroBano: "/gallery/clientes/cliente-oval-gris-oscuro-bano.png",
  heroBanoMarmolada: "/hero/hero-bano-marmolada.png",
};
