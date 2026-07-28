"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product, ProductStatus } from "@/types/product";
import { BACHA_PRICE } from "@/types/product";
import {
  BACHA_COLORS,
  BACHA_SHAPES,
  colorLabel,
  shapeLabel,
} from "@/lib/bacha-options";
import { formatPrice, statusLabel } from "@/lib/products";
import { Button } from "@/components/ui/Button";

type Props = { initialProducts: Product[] };

const inputClass =
  "mt-1 w-full border border-concrete bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sage";

export function AdminPanel({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [tab, setTab] = useState<"available" | "example" | "sold" | "all">(
    "available",
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("gris-natural");
  const [shape, setShape] = useState<string>("oval");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProductStatus>("available");
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (tab === "all") return products;
    return products.filter((p) => p.status === tab);
  }, [products, tab]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setColor("gris-natural");
    setShape("oval");
    setDescription("");
    setImageUrl("");
    setFileName("");
    setStatus("available");
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setName(p.name);
    setColor(p.color || "gris-natural");
    setShape(p.shape || "oval");
    setDescription(p.description || "");
    setImageUrl(p.images[0] || "");
    setFileName("");
    setStatus(p.status);
    setMsg(`Editando: ${p.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function reloadProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return;
    const list = (await res.json()) as Product[];
    setProducts(list);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setFileName(file.name);
    setMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      setMsg("Error al subir imagen");
      return;
    }
    const data = (await res.json()) as { url: string };
    setImageUrl(data.url);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setBusy("save");
    setMsg("");

    if (editingId) {
      const res = await fetch(`/api/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          color,
          shape,
          description,
          image: imageUrl,
          status,
        }),
      });
      setBusy(null);
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setMsg(err.error || "No se pudo guardar");
        return;
      }
      await reloadProducts();
      resetForm();
      setMsg("Pieza actualizada");
      router.refresh();
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        color,
        shape,
        description,
        image: imageUrl,
        status,
      }),
    });
    setBusy(null);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error || "No se pudo crear");
      return;
    }
    await reloadProducts();
    resetForm();
    setMsg("Pieza creada");
    router.refresh();
  }

  async function setProductStatus(id: string, next: ProductStatus) {
    setBusy(id + next);
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(null);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error || "No se pudo actualizar");
      return;
    }
    await reloadProducts();
    router.refresh();
  }

  async function removeProduct(id: string) {
    if (!confirm("¿Eliminar esta pieza del catálogo?")) return;
    setBusy(id + "del");
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error || "No se pudo eliminar");
      return;
    }
    if (editingId === id) resetForm();
    await reloadProducts();
    setMsg("Pieza eliminada");
    router.refresh();
  }

  const counts = {
    available: products.filter((p) => p.status === "available").length,
    example: products.filter((p) => p.status === "example").length,
    sold: products.filter((p) => p.status === "sold").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Admin
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-navy">
            Piezas artesanales
          </h1>
          <p className="mt-2 text-sm text-navy/60">
            Precio fijo bachas:{" "}
            <span className="font-semibold text-deep-red">
              {formatPrice(BACHA_PRICE)}
            </span>
            . Cada pieza en stock es única.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={logout}>
          Salir
        </Button>
      </div>

      {msg ? <p className="mt-4 text-sm text-sage-dark">{msg}</p> : null}

      <form
        onSubmit={saveProduct}
        className="mt-10 grid gap-4 border border-concrete bg-cream-dark/40 p-6 lg:grid-cols-2"
      >
        <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
            {editingId ? "Editar pieza" : "Nueva pieza"}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold uppercase tracking-wider text-navy/50 hover:text-navy"
            >
              Cancelar edición
            </button>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Nombre</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bacha oval negro #12"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Color</label>
          <select
            className={inputClass}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            {BACHA_COLORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Modelo</label>
          <select
            className={inputClass}
            value={shape}
            onChange={(e) => setShape(e.target.value)}
          >
            {BACHA_SHAPES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Estado</label>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
          >
            <option value="available">En stock (se puede comprar)</option>
            <option value="example">Ejemplo de color (sin stock)</option>
            <option value="sold">Vendida</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-navy">Descripción</label>
          <textarea
            className={inputClass}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-navy">Foto</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadFile(f);
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center bg-navy px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-navy/90 disabled:opacity-60"
            >
              {uploading ? "Subiendo…" : "Seleccionar archivo"}
            </button>
            <span className="text-sm text-navy/55">
              {fileName || (imageUrl ? "Imagen actual" : "Ningún archivo seleccionado")}
            </span>
          </div>
          {imageUrl ? (
            <div className="relative mt-3 h-40 w-40 overflow-hidden bg-concrete-light">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          ) : null}
          <input
            className={`${inputClass} mt-2`}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="O pegá URL /ruta/imagen.jpg"
            required
          />
        </div>
        <div className="lg:col-span-2 flex flex-wrap gap-3">
          <Button type="submit" variant="primary" disabled={busy === "save"}>
            {busy === "save"
              ? "Guardando…"
              : editingId
                ? "Guardar cambios"
                : "Crear pieza"}
          </Button>
        </div>
      </form>

      <div className="mt-10 flex flex-wrap gap-2">
        {(
          [
            ["available", `En stock (${counts.available})`],
            ["example", `Ejemplos (${counts.example})`],
            ["sold", `Vendidas (${counts.sold})`],
            ["all", "Todas"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              tab === key
                ? "bg-navy px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream"
                : "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy/50"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-4 border border-concrete p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-concrete-light">
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{p.name}</p>
              <p className="text-sm text-navy/55">
                {statusLabel(p.status)}
                {p.shape ? ` · ${shapeLabel(p.shape)}` : ""}
                {p.color ? ` · ${colorLabel(p.color)}` : ""} ·{" "}
                {formatPrice(p.price)}
              </p>
              <p className="truncate text-xs text-navy/40">{p.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!!busy}
                onClick={() => startEdit(p)}
                className="border border-navy/20 bg-white px-3 py-2 text-xs font-semibold text-navy hover:border-navy"
              >
                Editar
              </button>
              {p.status !== "available" && p.category === "bachas" ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setProductStatus(p.id, "available")}
                  className="bg-sage px-3 py-2 text-xs font-semibold text-white"
                >
                  Poner en stock
                </button>
              ) : null}
              {p.status !== "sold" && p.category === "bachas" ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setProductStatus(p.id, "sold")}
                  className="bg-deep-red px-3 py-2 text-xs font-semibold text-white"
                >
                  Marcar vendida
                </button>
              ) : null}
              {p.status !== "example" && p.category === "bachas" ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setProductStatus(p.id, "example")}
                  className="border border-concrete px-3 py-2 text-xs font-semibold text-navy"
                >
                  Pasar a ejemplo
                </button>
              ) : null}
              <button
                type="button"
                disabled={!!busy}
                onClick={() => removeProduct(p.id)}
                className="px-3 py-2 text-xs font-semibold text-navy/45 hover:text-deep-red"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
