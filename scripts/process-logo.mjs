import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(
  "C:",
  "Users",
  "User",
  ".cursor",
  "projects",
  "f-Juan-Archivos-Pagina-web-Concreto",
  "assets",
  "c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Logo_Prieta_Concrete-c12fb456-e0cb-419b-9946-7a47147bc5ab.png",
);

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r < 40 && g < 40 && b < 40) data[i + 3] = 0;
}

let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = data[(y * width + x) * channels + 3];
    if (a > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const pad = 8;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);

const cw = maxX - minX + 1;
const ch = maxY - minY + 1;
const cropped = Buffer.alloc(cw * ch * 4);

for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const si = ((minY + y) * width + (minX + x)) * channels;
    const di = (y * cw + x) * 4;
    cropped[di] = data[si];
    cropped[di + 1] = data[si + 1];
    cropped[di + 2] = data[si + 2];
    cropped[di + 3] = data[si + 3];
  }
}

const publicDir = path.join(root, "public");
fs.copyFileSync(src, path.join(publicDir, "logo-prieta-original.png"));
await sharp(cropped, { raw: { width: cw, height: ch, channels: 4 } })
  .png()
  .toFile(path.join(publicDir, "logo-prieta.png"));

console.log("Logo procesado:", cw, "x", ch);
