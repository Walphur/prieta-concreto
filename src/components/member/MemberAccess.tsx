"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { useMember } from "@/components/member/MemberProvider";

const inputClass =
  "mt-1.5 w-full border border-concrete bg-white px-3 py-2.5 text-sm text-navy outline-none focus:ring-2 focus:ring-sage";

type Props = {
  className?: string;
  onOpen?: () => void;
};

export function MemberAccess({ className, onOpen }: Props) {
  const { member, loading, eligibleForDiscount, register } = useMember();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const emailFieldId = useId();
  const nameFieldId = useId();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => emailRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
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
      ? "15% listo"
      : member
        ? "Acceso"
        : "15% primera vez";

  const dialog =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
            style={{
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              paddingTop: "env(safe-area-inset-top, 0px)",
            }}
          >
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
              className="relative z-[201] flex max-h-[min(92dvh,100%)] w-full max-w-md flex-col overflow-hidden border border-concrete bg-cream shadow-xl sm:mx-0 rounded-t-2xl sm:rounded-none"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-concrete/50 px-5 pb-3 pt-4 sm:border-0 sm:px-6 sm:pb-0 sm:pt-6">
                <div className="min-w-0 pr-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
                    Acceso
                  </p>
                  <h2
                    id={titleId}
                    className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy"
                  >
                    {member ? "Tu acceso" : "15% la primera vez"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-navy/60 hover:text-navy"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
                {member ? (
                  <div className="space-y-3 text-sm text-navy/70">
                    {message ? (
                      <p className="border border-sage/30 bg-sage/10 px-3 py-2.5 text-sage-dark">
                        {message}
                      </p>
                    ) : null}
                    <p>
                      Sesión con{" "}
                      <span className="font-medium text-navy">
                        {member.email}
                      </span>
                      {member.name ? ` · ${member.name}` : ""}.
                    </p>
                    {eligibleForDiscount ? (
                      <p className="border border-sage/30 bg-sage/10 px-3 py-2.5 text-sage-dark">
                        Tenés <strong>15%</strong> en tu primera compra. Se
                        aplica en el carrito al confirmar.
                      </p>
                    ) : (
                      <p>
                        Ya usaste el 15% de la primera compra. Gracias por
                        estar.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-2 text-sm font-medium text-sage-dark no-underline transition hover:text-navy hover:no-underline"
                    >
                      Continuar
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-navy/65">
                      Dejá tu email — sin contraseña — y activás el 15% una sola
                      vez.
                    </p>
                    <form onSubmit={onSubmit} className="mt-5 space-y-3">
                      <div>
                        <label
                          htmlFor={emailFieldId}
                          className="text-sm font-medium text-navy"
                        >
                          Email
                        </label>
                        <input
                          ref={emailRef}
                          id={emailFieldId}
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
                          htmlFor={nameFieldId}
                          className="text-sm font-medium text-navy"
                        >
                          Nombre{" "}
                          <span className="font-normal text-navy/45">
                            (opcional)
                          </span>
                        </label>
                        <input
                          id={nameFieldId}
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
                        {sending ? "Guardando…" : "Activar 15%"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onOpen?.();
          setOpen(true);
          setError(null);
          setMessage(null);
        }}
        className={clsx(
          "inline-flex min-h-11 items-center text-[11px] font-medium tracking-wide text-navy/70 transition-colors hover:text-sage-dark",
          className,
        )}
      >
        {label}
      </button>
      {dialog}
    </>
  );
}
