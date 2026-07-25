"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Clave incorrecta");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Admin
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-navy">
        Prieta Concreto
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Gestión de piezas únicas · San Luis
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="password" className="text-sm font-medium text-navy">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-concrete bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sage"
            required
          />
        </div>
        {error ? <p className="text-sm text-deep-red">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
