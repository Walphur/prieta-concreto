import data from "@/lib/gallery-data.json";

export type GalleryItem = {
  src: string;
  label: string;
  alt: string;
  kind: "producto" | "cliente" | "video";
};

export const galleryProducto = data.producto as GalleryItem[];
export const galleryClientes = data.clientes as GalleryItem[];
export const galleryVideos = data.videos as GalleryItem[];

export const galleryAll: GalleryItem[] = [
  ...galleryProducto,
  ...galleryClientes,
];

/** Rutas útiles para catálogo / hero */
export const productPhotos = {
  circularCarbon: "/gallery/producto/circular-carbon.jpg",
  ovalNegro: "/gallery/producto/oval-negro.jpg",
  ovalMarmol: "/gallery/producto/oval-marmol.jpg",
  ovalMarmolOscuro: "/gallery/producto/oval-marmol-oscuro.jpg",
  circularClaro: "/gallery/producto/circular-claro.jpg",
  circularGrisClaro: "/gallery/producto/circular-gris-claro.jpg",
  ovalCrema: "/gallery/producto/oval-crema.jpg",
  ovalCremaMineral: "/gallery/producto/oval-crema-mineral.jpg",
  ovalGris: "/gallery/producto/oval-gris.jpg",
  circularGrafito: "/gallery/producto/circular-grafito.jpg",
  circularRosa: "/gallery/producto/circular-rosa.jpg",
  circularRosaMate: "/gallery/producto/circular-rosa-mate.jpg",
  cuadradaCrema: "/gallery/producto/cuadrada-crema.jpg",
  ovalMarmolHumo: "/gallery/producto/oval-marmol-humo.jpg",
  ovalGrisSuave: "/gallery/producto/oval-gris-suave.jpg",
  cuadradaGris: "/gallery/producto/cuadrada-gris.jpg",
  circularGris: "/gallery/producto/circular-gris.jpg",
  ovalCarbonPerfil: "/gallery/producto/oval-carbon-perfil.jpg",
  coleccion: "/gallery/producto/coleccion-colores.jpg",
  coleccionEstudio: "/gallery/producto/coleccion-estudio.jpg",
  clienteCircular: "/gallery/clientes/cliente-circular-gris.jpg",
  clienteClara: "/gallery/clientes/cliente-circular-clara.jpg",
  clienteMarmol: "/gallery/clientes/cliente-oval-marmol.jpg",
  clienteMarmolBano: "/gallery/clientes/cliente-oval-marmol-bano.jpg",
};
