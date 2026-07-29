import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assets =
  "C:\\Users\\User\\.cursor\\projects\\f-Juan-Archivos-Pagina-web-Concreto-prieta-concreto\\assets";
const outDir = path.join(root, "public", "gallery", "clientes");
fs.mkdirSync(outDir, { recursive: true });

const clients = [
  {
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_13.30.41-4574d4fe-6c74-4113-88b9-3ab66de178e4.png",
    out: "cliente-oval-marmol-bano.jpg",
    label: "Cliente · oval mármol",
    // sink + faucet, sin lámpara ni puerta
    crop: { left: 0.18, top: 0.28, width: 0.55, height: 0.42 },
  },
  {
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_13.30.55-e31c9cd4-d366-4f12-9dc1-caf10cb6d102.png",
    out: "cliente-oval-marmol.jpg",
    label: "Cliente · oval mármol detalle",
    crop: { left: 0.16, top: 0.04, width: 0.68, height: 0.52 },
  },
  {
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_13.29.47-a3d37edd-7f04-4181-9d5e-59223e50e4a1.png",
    out: "cliente-circular-gris.jpg",
    label: "Cliente · circular gris",
    // Full original — no crop (bacha completa)
    crop: null,
  },
  {
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_13.30.21-41c382fb-cc28-45be-a75c-60e31ee69f90.png",
    out: "cliente-circular-clara.jpg",
    label: "Cliente · circular clara",
    crop: null,
  },
];

const catalogPath = path.join(root, "src", "lib", "gallery-data.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

async function cropOne(src, crop) {
  const pipeline = sharp(src).rotate();

  if (!crop) {
    return pipeline
      .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();
  }

  const meta = await sharp(src).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const left = Math.round(w * crop.left);
  const top = Math.round(h * crop.top);
  const width = Math.min(Math.round(w * crop.width), w - left);
  const height = Math.min(Math.round(h * crop.height), h - top);

  return sharp(src)
    .rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1600, height: 1600, fit: "inside" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

const clientes = [];

for (const item of clients) {
  const src = path.join(assets, item.file);
  const out = path.join(outDir, item.out);
  console.log("→", item.out);
  const buf = await cropOne(src, item.crop);
  await sharp(buf).toFile(out);
  clientes.push({
    src: `/gallery/clientes/${item.out}`,
    label: item.label,
    alt: item.label,
    kind: "cliente",
  });
}

catalog.clientes = clientes;
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log("Clientes actualizados:", clientes.length);
