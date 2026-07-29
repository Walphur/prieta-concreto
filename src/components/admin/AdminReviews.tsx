"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Review, ReviewStatus } from "@/types/review";
import { StarRating } from "@/components/reviews/StarRating";

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/reviews?status=all", { cache: "no-store" });
    if (!res.ok) return;
    setReviews((await res.json()) as Review[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const list =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  async function setStatus(id: string, status: ReviewStatus) {
    setBusy(id + status);
    setMsg("");
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error || "No se pudo actualizar");
      return;
    }
    await load();
    setMsg(
      status === "approved"
        ? "Reseña publicada"
        : status === "rejected"
          ? "Reseña rechazada"
          : "Actualizado",
    );
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    setBusy(id + "del");
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      setMsg("No se pudo eliminar");
      return;
    }
    await load();
    setMsg("Reseña eliminada");
  }

  const pending = reviews.filter((r) => r.status === "pending").length;

  return (
    <section className="mt-16 border-t border-concrete pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
            Reseñas
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Moderación de comentarios del sitio
            {pending > 0 ? ` · ${pending} pendiente${pending > 1 ? "s" : ""}` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["pending", "Pendientes"],
              ["approved", "Publicadas"],
              ["rejected", "Rechazadas"],
              ["all", "Todas"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={
                filter === key
                  ? "bg-navy px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream"
                  : "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy/50"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {msg ? <p className="mt-3 text-sm text-sage-dark">{msg}</p> : null}

      <ul className="mt-6 space-y-4">
        {list.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-4 border border-concrete p-4 sm:flex-row"
          >
            {r.photoUrl ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-concrete-light">
                <Image
                  src={r.photoUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-navy">{r.author}</p>
                <StarRating value={r.rating} size="sm" />
                <span className="text-[11px] uppercase tracking-wider text-navy/40">
                  {r.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy/70">{r.text}</p>
              {r.productName ? (
                <p className="mt-1 text-xs text-navy/40">{r.productName}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 self-start">
              {r.status !== "approved" ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setStatus(r.id, "approved")}
                  className="bg-sage px-3 py-2 text-xs font-semibold text-white"
                >
                  Aprobar
                </button>
              ) : null}
              {r.status !== "rejected" ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setStatus(r.id, "rejected")}
                  className="border border-concrete px-3 py-2 text-xs font-semibold text-navy"
                >
                  Rechazar
                </button>
              ) : null}
              <button
                type="button"
                disabled={!!busy}
                onClick={() => remove(r.id)}
                className="px-3 py-2 text-xs font-semibold text-navy/45 hover:text-deep-red"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 ? (
          <p className="text-sm text-navy/50">No hay reseñas en esta vista.</p>
        ) : null}
      </ul>
    </section>
  );
}
