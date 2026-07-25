import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mediaRoot = path.join(root, "..");
const outRoot = path.join(root, "public", "gallery", "shapes");
const CREAM = { r: 247, g: 245, b: 242 };

/**
 * Fuente de verdad: carpetas por molde en Pagina web Concreto/
 * Colores según clasificación Prieta (blanco = solo cuadrada blanca).
 */
const SHAPE_FOLDERS = {
  cuadrado: "cuadrada",
  oval: "oval",
  circular: "circular",
  "circular-tapon": "circular con tapon",
};

/** Archivos por carpeta: out slug, color, kind */
const CATALOG = {
  cuadrado: [
    { file: "WhatsApp Image 2026-07-25 at 13.29.22 (2).jpeg", out: "blanco", color: "blanco", kind: "studio", scale: 0.72, topBias: -0.02 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.38.jpeg", out: "gris-natural", color: "gris-natural", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.23.jpeg", out: "grupo-oscuro", color: "gris-oscuro", kind: "grupo", crop: { left: 0.08, top: 0.08, width: 0.84, height: 0.84 } },
    { file: "WhatsApp Image 2026-07-25 at 13.29.24 (1).jpeg", out: "grupo-natural", color: "gris-natural", kind: "grupo", crop: { left: 0.08, top: 0.08, width: 0.84, height: 0.84 } },
  ],
  oval: [
    { file: "WhatsApp Image 2026-07-25 at 13.29.19.jpeg", out: "negro", color: "negro", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.19 (1).jpeg", out: "marmolado-oscuro", color: "marmolado", kind: "studio", scale: 0.82 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.19 (2).jpeg", out: "marmolado", color: "marmolado", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.20 (2).jpeg", out: "gris-natural-claro", color: "gris-natural", kind: "studio", scale: 0.78 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.20 (3).jpeg", out: "gris-natural-mineral", color: "gris-natural", kind: "studio", scale: 0.78 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.21.jpeg", out: "gris-oscuro", color: "gris-oscuro", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.22 (1).jpeg", out: "duo-oscuro", color: "gris-oscuro", kind: "grupo", crop: { left: 0.14, top: 0.02, width: 0.72, height: 0.96 } },
    { file: "WhatsApp Image 2026-07-25 at 13.29.22 (3).jpeg", out: "marmolado-humo", color: "marmolado", kind: "studio", scale: 0.72, topBias: -0.04 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.24.jpeg", out: "grupo-natural", color: "gris-natural", kind: "grupo", crop: { left: 0.1, top: 0.1, width: 0.8, height: 0.8 } },
    { file: "WhatsApp Image 2026-07-25 at 13.29.28 (1).jpeg", out: "gris-natural", color: "gris-natural", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.39.jpeg", out: "gris-oscuro-perfil", color: "gris-oscuro", kind: "studio", scale: 0.85 },
    { file: "WhatsApp Image 2026-07-25 at 13.30.55.jpeg", out: "cliente-marmol", color: "marmolado", kind: "cliente", crop: { left: 0.18, top: 0.05, width: 0.64, height: 0.5 } },
  ],
  circular: [
    { file: "WhatsApp Image 2026-07-25 at 13.29.18 (1).jpeg", out: "gris-oscuro", color: "gris-oscuro", kind: "studio", scale: 0.78 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.21 (2).jpeg", out: "rosa", color: "rosa", kind: "studio", scale: 0.82 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.22.jpeg", out: "rosa-mate", color: "rosa", kind: "studio", scale: 0.78 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.38 (1).jpeg", out: "gris-natural", color: "gris-natural", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.30.21.jpeg", out: "cliente-natural", color: "gris-natural", kind: "cliente", crop: { left: 0.24, top: 0.3, width: 0.52, height: 0.44 } },
    { file: "WhatsApp Image 2026-07-25 at 13.29.22 (1).jpeg", out: "duo-oscuro", color: "gris-oscuro", kind: "grupo", crop: { left: 0.14, top: 0.02, width: 0.72, height: 0.96 } },
    { file: "WhatsApp Image 2026-07-25 at 13.29.23.jpeg", out: "grupo-oscuro", color: "gris-oscuro", kind: "grupo", crop: { left: 0.08, top: 0.08, width: 0.84, height: 0.84 } },
    { file: "WhatsApp Image 2026-07-25 at 13.29.24 (1).jpeg", out: "grupo-natural", color: "gris-natural", kind: "grupo", crop: { left: 0.08, top: 0.08, width: 0.84, height: 0.84 } },
  ],
  "circular-tapon": [
    { file: "WhatsApp Image 2026-07-25 at 13.29.20.jpeg", out: "gris-natural", color: "gris-natural", kind: "studio", scale: 0.78 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.20 (1).jpeg", out: "gris-natural-claro", color: "gris-natural", kind: "studio", scale: 0.8 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.21 (1).jpeg", out: "gris-oscuro", color: "gris-oscuro", kind: "studio", scale: 0.78 },
    { file: "WhatsApp Image 2026-07-25 at 13.29.47.jpeg", out: "cliente-natural", color: "gris-natural", kind: "cliente", crop: { left: 0.2, top: 0.24, width: 0.66, height: 0.5 } },
  ],
};

const COLLECTIONS = [
  { file: "WhatsApp Image 2026-07-25 at 13.29.17.jpeg", out: "coleccion-estudio", crop: { left: 0.04, top: 0.12, width: 0.92, height: 0.78 } },
  { file: "WhatsApp Image 2026-07-25 at 13.29.18.jpeg", out: "coleccion-colores", crop: { left: 0.06, top: 0.06, width: 0.88, height: 0.88 } },
  { file: "WhatsApp Image 2026-07-25 at 13.29.28.jpeg", out: "feria", crop: { left: 0.05, top: 0.15, width: 0.9, height: 0.7 } },
];

async function framed(srcPath, item) {
  const meta = await sharp(srcPath).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  let left, top, width, height;

  if (item.crop) {
    left = Math.round(w * item.crop.left);
    top = Math.round(h * item.crop.top);
    width = Math.min(Math.round(w * item.crop.width), w - left);
    height = Math.min(Math.round(h * item.crop.height), h - top);
  } else {
    const s = item.scale ?? 0.8;
    width = Math.round(w * s);
    height = Math.round(h * s);
    left = Math.round((w - width) / 2);
    top = Math.round((h - height) / 2 + h * (item.topBias ?? 0));
    top = Math.max(0, Math.min(top, h - height));
  }

  const cropped = await sharp(srcPath)
    .rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1400, height: 1400, fit: "inside" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  if (item.kind === "cliente" || item.kind === "grupo" || item.collection) {
    return cropped;
  }

  const cmeta = await sharp(cropped).metadata();
  const side = Math.max(cmeta.width ?? 0, cmeta.height ?? 0);
  const canvas = Math.round(side * 1.08);

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 3,
      background: CREAM,
    },
  })
    .composite([{ input: cropped, gravity: "center" }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

async function main() {
  const manifest = [];
  fs.mkdirSync(outRoot, { recursive: true });

  for (const [shapeId, folderName] of Object.entries(SHAPE_FOLDERS)) {
    const dir = path.join(outRoot, shapeId);
    fs.mkdirSync(dir, { recursive: true });
    const items = CATALOG[shapeId] ?? [];
    const folder = path.join(mediaRoot, folderName);

    for (const item of items) {
      const src = path.join(folder, item.file);
      if (!fs.existsSync(src)) {
        console.warn("Falta:", folderName, item.file);
        continue;
      }
      const outName = `${item.out}.jpg`;
      const outPath = path.join(dir, outName);
      const web = `/gallery/shapes/${shapeId}/${outName}`;
      console.log("→", shapeId, outName);
      const buf = await framed(src, item);
      await sharp(buf).toFile(outPath);
      manifest.push({
        src: web,
        shape: shapeId,
        color: item.color,
        kind: item.kind,
        file: item.file,
      });
    }
  }

  const colDir = path.join(outRoot, "coleccion");
  fs.mkdirSync(colDir, { recursive: true });
  for (const item of COLLECTIONS) {
    const src = path.join(mediaRoot, item.file);
    if (!fs.existsSync(src)) {
      console.warn("Falta colección:", item.file);
      continue;
    }
    const outPath = path.join(colDir, `${item.out}.jpg`);
    const web = `/gallery/shapes/coleccion/${item.out}.jpg`;
    console.log("→ coleccion", item.out);
    const buf = await framed(src, { ...item, collection: true });
    await sharp(buf).toFile(outPath);
    manifest.push({
      src: web,
      shape: "coleccion",
      color: "varios",
      kind: "grupo",
      file: item.file,
    });
  }

  // Copiar también a gallery/producto y clientes con nombres estables para compat
  const productoDir = path.join(root, "public", "gallery", "producto");
  const clientesDir = path.join(root, "public", "gallery", "clientes");
  fs.mkdirSync(productoDir, { recursive: true });
  fs.mkdirSync(clientesDir, { recursive: true });

  const compat = [
    ["cuadrado/blanco.jpg", "producto/cuadrada-blanco.jpg"],
    ["cuadrado/gris-natural.jpg", "producto/cuadrada-gris.jpg"],
    ["oval/negro.jpg", "producto/oval-negro.jpg"],
    ["oval/marmolado.jpg", "producto/oval-marmol.jpg"],
    ["oval/marmolado-oscuro.jpg", "producto/oval-marmol-oscuro.jpg"],
    ["oval/marmolado-humo.jpg", "producto/oval-marmol-humo.jpg"],
    ["oval/gris-natural-claro.jpg", "producto/oval-crema.jpg"],
    ["oval/gris-natural-mineral.jpg", "producto/oval-crema-mineral.jpg"],
    ["oval/gris-natural.jpg", "producto/oval-gris-suave.jpg"],
    ["oval/gris-oscuro.jpg", "producto/oval-gris.jpg"],
    ["oval/gris-oscuro-perfil.jpg", "producto/oval-carbon-perfil.jpg"],
    ["oval/duo-oscuro.jpg", "producto/duo-negro.jpg"],
    ["oval/cliente-marmol.jpg", "clientes/cliente-oval-marmol.jpg"],
    ["circular/gris-oscuro.jpg", "producto/circular-carbon.jpg"],
    ["circular/rosa.jpg", "producto/circular-rosa.jpg"],
    ["circular/rosa-mate.jpg", "producto/circular-rosa-mate.jpg"],
    ["circular/gris-natural.jpg", "producto/circular-gris.jpg"],
    ["circular/cliente-natural.jpg", "clientes/cliente-circular-clara.jpg"],
    ["circular-tapon/gris-natural.jpg", "producto/circular-claro.jpg"],
    ["circular-tapon/gris-natural-claro.jpg", "producto/circular-gris-claro.jpg"],
    ["circular-tapon/gris-oscuro.jpg", "producto/circular-grafito.jpg"],
    ["circular-tapon/cliente-natural.jpg", "clientes/cliente-circular-gris.jpg"],
    ["coleccion/coleccion-colores.jpg", "producto/coleccion-colores.jpg"],
    ["coleccion/coleccion-estudio.jpg", "producto/coleccion-estudio.jpg"],
    ["coleccion/feria.jpg", "producto/feria.jpg"],
  ];

  for (const [from, to] of compat) {
    const src = path.join(outRoot, from);
    const dest = path.join(root, "public", "gallery", to);
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  }

  fs.writeFileSync(
    path.join(root, "data", "bacha-images.json"),
    JSON.stringify(manifest, null, 2),
  );

  // gallery-data.json para Inspiración
  const gallery = {
    producto: manifest
      .filter((m) => m.kind === "studio")
      .map((m) => ({
        src: m.src,
        label: `${m.shape} · ${m.color}`,
        alt: `Bacha ${m.shape} ${m.color}`,
        kind: "producto",
      })),
    clientes: manifest
      .filter((m) => m.kind === "cliente")
      .map((m) => ({
        src: m.src,
        label: `Cliente · ${m.shape}`,
        alt: `Instalación ${m.shape}`,
        kind: "cliente",
      })),
    videos: [
      {
        src: "/gallery/videos/proceso-bachas.mp4",
        label: "Cómo se hacen las bachas",
        alt: "Proceso de fabricación de bachas de concreto",
        kind: "video",
      },
      { src: "/gallery/videos/bachas-01.mp4", label: "Bachas en taller", alt: "Bachas en taller", kind: "video" },
      { src: "/gallery/videos/bachas-02.mp4", label: "Detalle de bachas", alt: "Detalle de bachas", kind: "video" },
    ],
  };
  fs.writeFileSync(
    path.join(root, "src", "lib", "gallery-data.json"),
    JSON.stringify(gallery, null, 2),
  );

  console.log(`Listo · ${manifest.length} imágenes en data/bacha-images.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
