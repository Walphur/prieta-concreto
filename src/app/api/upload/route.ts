import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name || "").toLowerCase() || ".jpg";
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Formato no permitido" }, { status: 400 });
  }

  const name = `pieza-${Date.now().toString(36)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);

  return NextResponse.json({ url: `/uploads/${name}` });
}
