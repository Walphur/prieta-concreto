"use client";

import { useCallback, useEffect, useState } from "react";
import type { Member } from "@/types/member";

type StorageInfo = {
  mode: "blob" | "local" | "cookie-only";
  blobConfigured: boolean;
  localDev: boolean;
};

type MembersResponse = {
  members: Member[];
  storage: StorageInfo;
  message?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      if (!res.ok) {
        setError("No se pudo cargar la lista de miembros.");
        setMembers([]);
        return;
      }
      const data = (await res.json()) as MembersResponse;
      setMembers(data.members ?? []);
      setStorage(data.storage ?? null);
      setMessage(data.message ?? "");
    } catch {
      setError("Error de conexión.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const unused = members.filter((m) => !m.firstDiscountUsed).length;
  const used = members.filter((m) => m.firstDiscountUsed).length;

  return (
    <section className="mt-16 border-t border-concrete pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
            Descuentos 15%
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Miembros registrados · 15% en la 2.ª unidad
            {!loading && members.length > 0
              ? ` · ${unused} con 15% disponible · ${used} ya usado`
              : null}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="border border-navy/20 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-navy hover:border-navy"
        >
          Actualizar
        </button>
      </div>

      {storage ? (
        <p className="mt-3 text-xs text-navy/45">
          Almacenamiento:{" "}
          {storage.mode === "blob"
            ? "Vercel Blob (compartido en producción)"
            : storage.mode === "local"
              ? "archivo local (solo desarrollo)"
              : "solo cookie de sesión (sin lista servidor)"}
          {storage.blobConfigured ? " · token Blob presente" : " · sin BLOB_READ_WRITE_TOKEN"}
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 border border-sage/30 bg-sage/5 px-4 py-3 text-sm text-navy/70">
          {message}
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-deep-red">{error}</p> : null}

      {loading ? (
        <p className="mt-6 text-sm text-navy/50">Cargando…</p>
      ) : members.length === 0 ? (
        <p className="mt-6 text-sm text-navy/50">
          Todavía no hay miembros en el store. Cuando alguien active el 15% y
          Blob esté configurado, aparecen acá.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-concrete text-[11px] uppercase tracking-[0.12em] text-navy/45">
                <th className="py-2 pr-3 font-semibold">Email</th>
                <th className="py-2 pr-3 font-semibold">Nombre</th>
                <th className="py-2 pr-3 font-semibold">Alta</th>
                <th className="py-2 pr-3 font-semibold">15%</th>
                <th className="py-2 font-semibold">Usado</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={`${m.email}-${m.createdAt}`}
                  className="border-b border-concrete/70"
                >
                  <td className="py-3 pr-3 font-medium text-navy">{m.email}</td>
                  <td className="py-3 pr-3 text-navy/70">{m.name || "—"}</td>
                  <td className="py-3 pr-3 text-navy/55">
                    {formatDate(m.createdAt)}
                  </td>
                  <td className="py-3 pr-3">
                    {m.firstDiscountUsed ? (
                      <span className="text-navy/45">Usado</span>
                    ) : (
                      <span className="font-semibold text-sage-dark">
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-navy/55">
                    {m.firstDiscountUsed
                      ? formatDate(m.firstDiscountUsedAt)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
