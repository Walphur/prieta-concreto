import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assets =
  "C:\\Users\\User\\.cursor\\projects\\f-Juan-Archivos-Pagina-web-Concreto-prieta-concreto\\assets";
const outDir = path.join(root, "public", "gallery", "fichas");
fs.mkdirSync(outDir, { recursive: true });

/**
 * Recorta las fichas para sacar logos ajenos ("Tu Negocio en Concreto", BuildMX)
 * y dejar solo producto + diagrama útil.
 */
const jobs = [
  {
    // Circular chico con tapón — solo producto (derecha), sin logos ni texto
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.02-83957ca4-ea6c-4798-805b-5b8bcb718e46.png",
    out: "circular-tapon-producto.jpg",
    crop: { left: 0.52, top: 0.48, width: 0.42, height: 0.46 },
  },
  {
    // Circular 39 — producto perspectiva (sin marca)
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.03__1_-0a515a64-6eb2-42a4-a10f-06ce87df5d23.png",
    out: "circular-producto.jpg",
    crop: { left: 0.48, top: 0.04, width: 0.48, height: 0.48 },
  },
  {
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.03__1_-0a515a64-6eb2-42a4-a10f-06ce87df5d23.png",
    out: "circular-diagrama.jpg",
    crop: { left: 0.02, top: 0.02, width: 0.46, height: 0.96 },
  },
  {
    // Cuadrado
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.03__2_-f6b4bc32-3044-4274-874c-7bffc03e14bf.png",
    out: "cuadrado-producto.jpg",
    crop: { left: 0.48, top: 0.04, width: 0.48, height: 0.48 },
  },
  {
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.03__2_-f6b4bc32-3044-4274-874c-7bffc03e14bf.png",
    out: "cuadrado-diagrama.jpg",
    crop: { left: 0.02, top: 0.02, width: 0.46, height: 0.96 },
  },
  {
    // Oval — diagramas (izquierda), sin logo ni título de marca
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.03-bc0a48ca-c330-4f1d-b2e4-b4823d1d9e79.png",
    out: "oval-diagrama.jpg",
    crop: { left: 0.02, top: 0.28, width: 0.48, height: 0.7 },
  },
  {
    // Oval — fotos producto (derecha), sin logo ni texto naranja
    file: "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-25_at_14.25.03-bc0a48ca-c330-4f1d-b2e4-b4823d1d9e79.png",
    out: "oval-producto.jpg",
    crop: { left: 0.56, top: 0.22, width: 0.42, height: 0.74 },
  },
];

for (const job of jobs) {
  const src = path.join(assets, job.file);
  const meta = await sharp(src).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const left = Math.round(w * job.crop.left);
  const top = Math.round(h * job.crop.top);
  const width = Math.min(Math.round(w * job.crop.width), w - left);
  const height = Math.min(Math.round(h * job.crop.height), h - top);
  const out = path.join(outDir, job.out);
  await sharp(src)
    .rotate()
    .extract({ left, top, width, height })
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(out);
  console.log("→", job.out);
}

console.log("Fichas procesadas sin logos ajenos.");
