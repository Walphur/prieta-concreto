"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { useMember } from "@/components/member/MemberProvider";

const inputClass =
  "mt-1.5 w-full border border-concrete bg-white px-3 py-2.5 text-sm text-navy outline-none focus:ring-2 focus:ring-sage";

type Props = {
  className?: string;
};

export function MemberAccess({ className }: Props) {
  const { member, loading, eligibleForDiscount, register } = useMember();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => emailRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && member) {
      setEmail(member.email);
      setName(member.name ?? "");
    }
  }, [open, member]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    setMessage(null);
    const result = await register({ email, name: name || undefined });
    setSending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessage(result.message);
  }

  const label = loading
    ? "Acceso"
    : eligibleForDiscount
      ? "15% activo"
      : member
        ? "Acceso"
        : "15% primera compra";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
          setMessage(null);
        }}
        className={clsx(
          "text-[11px] font-medium tracking-wide text-navy/70 transition-colors hover:text-sage-dark",
          className,
        )}
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[91] w-full max-w-md border border-concrete bg-cream p-6 shadow-xl sm:mx-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
                  Acceso
                </p>
                <h2
                  id={titleId}
                  className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy"
                >
                  {member ? "Tu cuenta" : "15% en tu primera compra"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center text-navy/60 hover:text-navy"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {member ? (
              <div className="mt-5 space-y-3 text-sm text-navy/70">
                {message ? (
                  <p className="border border-sage/30 bg-sage/10 px-3 py-2.5 text-sage-dark">
                    {message}
                  </p>
                ) : null}
                <p>
                  Sesión con{" "}
                  <span className="font-medium text-navy">{member.email}</span>
                  {member.name ? ` · ${member.name}` : ""}.
                </p>
                {eligibleForDiscount ? (
                  <p className="border border-sage/30 bg-sage/10 px-3 py-2.5 text-sage-dark">
                    Tenés <strong>15% de descuento</strong> en tu primera
                    compra. Se aplica en el carrito y al confirmar el pedido.
                  </p>
                ) : (
                  <p>
                    Tu descuento de primera compra ya fue utilizado. Gracias por
                    comprar en Prieta.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-2 text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
                >
                  Continuar
                </button>
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm text-navy/65">
                  Dejá tu email (sin contraseña) para activar el 15% en tu
                  primera compra. El descuento se usa una sola vez.
                </p>
                <form onSubmit={onSubmit} className="mt-5 space-y-3">
                  <div>
                    <label
                      htmlFor="member-email"
                      className="text-sm font-medium text-navy"
                    >
                      Email
                    </label>
                    <input
                      ref={emailRef}
                      id="member-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="member-name"
                      className="text-sm font-medium text-navy"
                    >
                      Nombre{" "}
                      <span className="font-normal text-navy/45">(opcional)</span>
                    </label>
                    <input
                      id="member-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {error ? (
                    <p className="text-sm text-deep-red" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-navy px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-navy-soft disabled:opacity-50"
                  >
                    {sending ? "Guardando…" : "Activar descuento"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
