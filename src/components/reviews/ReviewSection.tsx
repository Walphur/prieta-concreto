"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/reviews/StarRating";
import { GOOGLE_REVIEW_URL } from "@/types/review";
import type { Review } from "@/types/review";

type Props = {
  productName?: string;
  productSlug?: string;
  initialReviews?: Review[];
};

const inputClass =
  "mt-1 w-full border border-concrete bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sage";

export function ReviewSection({
  productName,
  productSlug,
  initialReviews = [],
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => r.json())
      .then((list: Review[]) => {
        if (cancelled || !Array.isArray(list)) return;
        const filtered = productSlug
          ? list.filter(
              (rev) => !rev.productSlug || rev.productSlug === productSlug,
            )
          : list;
        setReviews(filtered);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  async function uploadPhoto(file: File) {
    setUploading(true);
    setPhotoName(file.name);
    setMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/reviews/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error || "No se pudo subir la foto");
      return;
    }
    const data = (await res.json()) as { url: string };
    setPhotoUrl(data.url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author,
        text,
        rating,
        photoUrl: photoUrl || undefined,
        productSlug,
        productName,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error || "No se pudo enviar");
      return;
    }
    const data = (await res.json()) as { message?: string };
    setAuthor("");
    setText("");
    setRating(5);
    setPhotoUrl("");
    setPhotoName("");
    setMsg(data.message || "Gracias. Pendiente de aprobación.");
  }

  return (
    <section className="mt-20 border-t border-concrete pt-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
            Reseñas de clientes
          </h2>
          <p className="mt-2 max-w-xl text-sm text-navy/60">
            {productName
              ? `Contanos tu experiencia con ${productName}.`
              : "Contanos tu experiencia con Prieta."}{" "}
            Estrellas, comentario y foto opcional. También podés dejar tu
            opinión en Google Maps.
          </p>
        </div>
        <Button
          href={GOOGLE_REVIEW_URL}
          variant="outline"
          className="self-start text-sm"
        >
          Reseñar en Google
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="texture-panel mt-8 max-w-xl space-y-4 p-5 sm:p-6"
      >
        <div>
          <p className="text-sm font-medium text-navy">Tu puntuación</p>
          <StarRating
            value={rating}
            onChange={setRating}
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="author" className="text-sm font-medium text-navy">
            Nombre
          </label>
          <input
            id="author"
            className={inputClass}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            maxLength={80}
          />
        </div>
        <div>
          <label htmlFor="review" className="text-sm font-medium text-navy">
            Comentario
          </label>
          <textarea
            id="review"
            className={inputClass}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
            minLength={10}
            maxLength={1200}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-navy">
            Foto de tu bacha (opcional)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadPhoto(f);
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-navy px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60"
            >
              {uploading ? "Subiendo…" : "Elegir foto"}
            </button>
            <span className="text-sm text-navy/50">
              {photoName || (photoUrl ? "Foto lista" : "Sin foto")}
            </span>
          </div>
          {photoUrl ? (
            <div className="relative mt-3 h-28 w-28 overflow-hidden bg-concrete-light">
              <Image src={photoUrl} alt="Vista previa" fill className="object-cover" />
            </div>
          ) : null}
        </div>
        <Button type="submit" variant="primary" disabled={busy || uploading}>
          {busy ? "Enviando…" : "Enviar reseña"}
        </Button>
        {msg ? <p className="text-sm text-sage-dark">{msg}</p> : null}
      </form>

      <ul className="mt-12 space-y-6">
        {reviews.map((r) => (
          <li key={r.id} className="border-b border-concrete/80 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-semibold text-navy">{r.author}</p>
              <StarRating value={r.rating} size="sm" />
              {r.source === "google" ? (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/40">
                  Google
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-navy/70">{r.text}</p>
            {r.photoUrl ? (
              <div className="relative mt-3 h-40 w-56 overflow-hidden bg-concrete-light sm:h-48 sm:w-72">
                <Image
                  src={r.photoUrl}
                  alt={`Foto de ${r.author}`}
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            ) : null}
          </li>
        ))}
        {reviews.length === 0 ? (
          <p className="text-sm text-navy/50">
            Todavía no hay reseñas publicadas. Sé el primero o dejá la tuya en
            Google.
          </p>
        ) : null}
      </ul>
    </section>
  );
}
