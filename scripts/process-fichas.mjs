import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mediaRoot = path.join(root, "..");
const outDir = path.join(root, "public", "gallery", "fichas");
fs.mkdirSync(outDir, { recursive: true });

/**
 * Recorta fichas: saca logos ajenos pero deja márgenes amplios
 * para que se lean todas las medidas.
 */
const jobs = [
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.02.jpeg",
    out: "circular-tapon-producto.jpg",
    // producto derecha — sin logos superiores
    crop: { left: 0.48, top: 0.42, width: 0.5, height: 0.54 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.03 (1).jpeg",
    out: "circular-producto.jpg",
    crop: { left: 0.48, top: 0.02, width: 0.5, height: 0.5 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.03 (1).jpeg",
    out: "circular-diagrama.jpg",
    // mitad izquierda completa con cotas
    crop: { left: 0.0, top: 0.0, width: 0.52, height: 1.0 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.03 (2).jpeg",
    out: "cuadrado-producto.jpg",
    crop: { left: 0.48, top: 0.02, width: 0.5, height: 0.5 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.03 (2).jpeg",
    out: "cuadrado-diagrama.jpg",
    crop: { left: 0.0, top: 0.0, width: 0.52, height: 1.0 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.03.jpeg",
    out: "oval-diagrama.jpg",
    // bajo título de marca, ancho completo de la mitad izquierda con cotas
    crop: { left: 0.0, top: 0.26, width: 0.55, height: 0.72 },
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.25.03.jpeg",
    out: "oval-producto.jpg",
    crop: { left: 0.52, top: 0.22, width: 0.46, height: 0.76 },
  },
];

for (const job of jobs) {
  const src = path.join(mediaRoot, job.file);
  if (!fs.existsSync(src)) {
    console.warn("Falta:", job.file);
    continue;
  }
  const meta = await sharp(src).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const left = Math.max(0, Math.round(w * job.crop.left));
  const top = Math.max(0, Math.round(h * job.crop.top));
  const width = Math.min(Math.round(w * job.crop.width), w - left);
  const height = Math.min(Math.round(h * job.crop.height), h - top);
  const out = path.join(outDir, job.out);
  const isDiagram = job.out.includes("diagrama");
  let pipeline = sharp(src)
    .rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1600, withoutEnlargement: true });

  if (isDiagram) {
    const pad = Math.round(Math.max(width, height) * 0.05);
    pipeline = pipeline.extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 28, g: 30, b: 34 },
    });
  }

  await pipeline.jpeg({ quality: 92, mozjpeg: true }).toFile(out);
  console.log("→", job.out, `${width}x${height}`);
}

console.log("Fichas procesadas con márgenes de medidas.");
