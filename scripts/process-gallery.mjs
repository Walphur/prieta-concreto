import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourceDir = path.join(root, "..");
const outRoot = path.join(root, "public", "gallery");

const dirs = {
  producto: path.join(outRoot, "producto"),
  clientes: path.join(outRoot, "clientes"),
  videos: path.join(outRoot, "videos"),
};

for (const d of Object.values(dirs)) fs.mkdirSync(d, { recursive: true });

const CREAM = { r: 247, g: 245, b: 242, alpha: 1 };

/** Bachas de estudio — recorte centrado + marco crema limpio */
const productShots = [
  { file: "WhatsApp Image 2026-07-25 at 13.29.18 (1).jpeg", out: "circular-carbon.jpg", label: "Circular carbón", scale: 0.78 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.19.jpeg", out: "oval-negro.jpg", label: "Oval negro", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.19 (1).jpeg", out: "oval-marmol-oscuro.jpg", label: "Oval mármol oscuro", scale: 0.82 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.19 (2).jpeg", out: "oval-marmol.jpg", label: "Oval mármol", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.20.jpeg", out: "circular-claro.jpg", label: "Circular claro", scale: 0.78 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.20 (1).jpeg", out: "circular-gris-claro.jpg", label: "Circular gris claro", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.20 (2).jpeg", out: "oval-crema.jpg", label: "Oval crema", scale: 0.78 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.20 (3).jpeg", out: "oval-crema-mineral.jpg", label: "Oval crema mineral", scale: 0.78 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.21.jpeg", out: "oval-gris.jpg", label: "Oval gris", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.21 (1).jpeg", out: "circular-grafito.jpg", label: "Circular grafito", scale: 0.78 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.21 (2).jpeg", out: "circular-rosa.jpg", label: "Circular rosa", scale: 0.82 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.22.jpeg", out: "circular-rosa-mate.jpg", label: "Circular rosa mate", scale: 0.78 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.22 (2).jpeg", out: "cuadrada-crema.jpg", label: "Cuadrada crema", scale: 0.72, topBias: -0.04 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.22 (3).jpeg", out: "oval-marmol-humo.jpg", label: "Oval mármol humo", scale: 0.72, topBias: -0.04 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.28 (1).jpeg", out: "oval-gris-suave.jpg", label: "Oval gris suave", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.38.jpeg", out: "cuadrada-gris.jpg", label: "Cuadrada gris", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.38 (1).jpeg", out: "circular-gris.jpg", label: "Circular gris", scale: 0.8 },
  { file: "WhatsApp Image 2026-07-25 at 13.29.39.jpeg", out: "oval-carbon-perfil.jpg", label: "Oval carbón", scale: 0.85 },
  {
    file: "WhatsApp Image 2026-07-25 at 13.29.22 (1).jpeg",
    out: "duo-negro.jpg",
    label: "Dúo negro",
    crop: { left: 0.14, top: 0.02, width: 0.72, height: 0.96 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 13.29.17.jpeg",
    out: "coleccion-estudio.jpg",
    label: "Colección estudio",
    crop: { left: 0.04, top: 0.12, width: 0.92, height: 0.78 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 13.29.18.jpeg",
    out: "coleccion-colores.jpg",
    label: "Colección colores",
    crop: { left: 0.06, top: 0.06, width: 0.88, height: 0.88 },
  },
];

const clientCrops = [
  {
    file: "WhatsApp Image 2026-07-25 at 13.29.47.jpeg",
    out: "cliente-circular-gris.jpg",
    label: "Cliente · circular gris",
    crop: { left: 0.2, top: 0.24, width: 0.66, height: 0.5 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 13.30.21.jpeg",
    out: "cliente-circular-clara.jpg",
    label: "Cliente · circular clara",
    crop: { left: 0.24, top: 0.3, width: 0.52, height: 0.44 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 13.30.55.jpeg",
    out: "cliente-oval-marmol.jpg",
    label: "Cliente · oval mármol",
    crop: { left: 0.18, top: 0.05, width: 0.64, height: 0.5 },
  },
];

const videos = [
  {
    file: "WhatsApp Video 2026-07-25 at 16.23.13.mp4",
    out: "proceso-bachas.mp4",
    label: "Cómo se hacen las bachas",
  },
  { file: "WhatsApp Video 2026-07-25 at 13.29.17.mp4", out: "bachas-01.mp4", label: "Bachas en taller" },
  { file: "WhatsApp Video 2026-07-25 at 13.29.23.mp4", out: "bachas-02.mp4", label: "Detalle de bachas" },
];

async function framedCrop(srcPath, { scale, crop, topBias = 0 }) {
  const img = sharp(srcPath).rotate();
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  let left;
  let top;
  let width;
  let height;

  if (crop) {
    left = Math.round(w * crop.left);
    top = Math.round(h * crop.top);
    width = Math.min(Math.round(w * crop.width), w - left);
    height = Math.min(Math.round(h * crop.height), h - top);
  } else {
    const s = scale ?? 0.8;
    width = Math.round(w * s);
    height = Math.round(h * s);
    left = Math.round((w - width) / 2);
    top = Math.round((h - height) / 2 + h * topBias);
    top = Math.max(0, Math.min(top, h - height));
  }

  const cropped = await sharp(srcPath)
    .rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1400, height: 1400, fit: "inside" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  const cmeta = await sharp(cropped).metadata();
  const side = Math.max(cmeta.width ?? 0, cmeta.height ?? 0);
  const canvas = Math.round(side * 1.08);
  const pad = Math.round((canvas - side) / 2);

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

async function cropClient(srcPath, crop) {
  const meta = await sharp(srcPath).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const left = Math.round(w * crop.left);
  const top = Math.round(h * crop.top);
  const width = Math.min(Math.round(w * crop.width), w - left);
  const height = Math.min(Math.round(h * crop.height), h - top);

  return sharp(srcPath)
    .rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1600, height: 1600, fit: "inside" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

const catalog = { producto: [], clientes: [], videos: [] };

async function main() {
  // Limpia PNG viejos rotos
  for (const f of fs.readdirSync(dirs.producto)) {
    if (f.endsWith(".png")) fs.unlinkSync(path.join(dirs.producto, f));
  }

  console.log("Recortando bachas de estudio…");
  for (const item of productShots) {
    const src = path.join(sourceDir, item.file);
    if (!fs.existsSync(src)) {
      console.warn("Falta:", item.file);
      continue;
    }
    const out = path.join(dirs.producto, item.out);
    console.log("→", item.out);
    const buf = await framedCrop(src, item);
    await sharp(buf).toFile(out);
    catalog.producto.push({
      src: `/gallery/producto/${item.out}`,
      label: item.label,
      alt: `Bacha de concreto ${item.label}`,
      kind: "producto",
    });
  }

  console.log("Recortando instalaciones de clientes…");
  for (const item of clientCrops) {
    const src = path.join(sourceDir, item.file);
    if (!fs.existsSync(src)) continue;
    const out = path.join(dirs.clientes, item.out);
    console.log("→", item.out);
    const buf = await cropClient(src, item.crop);
    await sharp(buf).toFile(out);
    catalog.clientes.push({
      src: `/gallery/clientes/${item.out}`,
      label: item.label,
      alt: item.label,
      kind: "cliente",
    });
  }

  console.log("Copiando videos…");
  for (const item of videos) {
    const src = path.join(sourceDir, item.file);
    if (!fs.existsSync(src)) continue;
    const out = path.join(dirs.videos, item.out);
    fs.copyFileSync(src, out);
    catalog.videos.push({
      src: `/gallery/videos/${item.out}`,
      label: item.label,
      alt: item.label,
      kind: "video",
    });
    console.log("→", item.out);
  }

  fs.writeFileSync(
    path.join(root, "src", "lib", "gallery-data.json"),
    JSON.stringify(catalog, null, 2),
  );
  console.log(
    `Listo · Producto ${catalog.producto.length} · Clientes ${catalog.clientes.length} · Videos ${catalog.videos.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
