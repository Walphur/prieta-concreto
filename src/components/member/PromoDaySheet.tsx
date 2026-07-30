"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useMember } from "@/components/member/MemberProvider";

const STORAGE_KEY = "prieta-promo-15-day";
const SHOW_DELAY_MS = 800;
const MOBILE_MQ = "(max-width: 767px)";

const inputClass =
  "mt-1.5 w-full border border-concrete bg-white px-3 py-2.5 text-sm text-navy outline-none focus:ring-2 focus:ring-sage";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function alreadyShownToday() {
  try {
    return localStorage.getItem(STORAGE_KEY) === todayKey();
  } catch {
    return true;
  }
}

function markShownToday() {
  try {
    localStorage.setItem(STORAGE_KEY, todayKey());
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Once-per-calendar-day mobile promo sheet for first-purchase 15%.
 * Skips members (cookie/session) and desktop; portal + safe-area like MemberAccess.
 */
export function PromoDaySheet() {
  const pathname = usePathname();
  const { member, loading, register } = useMember();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
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
    if (!mounted || loading) return;
    if (member) return;
    if (pathname?.startsWith("/admin")) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia(MOBILE_MQ).matches) return;
    if (alreadyShownToday()) return;

    const t = window.setTimeout(() => {
      markShownToday();
      setOpen(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(t);
  }, [mounted, loading, member, pathname]);

  useEffect(() => {
    if (!open) return;
    const focusT = window.setTimeout(() => emailRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusT);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

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

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/40"
        aria-label="Cerrar"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[201] flex max-h-[min(92dvh,100%)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-concrete bg-cream shadow-xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-concrete/50 px-5 pb-3 pt-4">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
              Oferta del día
            </p>
            <h2
              id={titleId}
              className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy"
            >
              15% la primera vez
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-navy/60 hover:text-navy"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-3">
          {message ? (
            <div className="space-y-3 text-sm text-navy/70">
              <p className="border border-sage/30 bg-sage/10 px-3 py-2.5 text-sage-dark">
                {message}
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-2 text-sm font-medium text-sage-dark no-underline transition hover:text-navy hover:no-underline"
              >
                Continuar
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-navy/65">
                Dejá tu email — sin contraseña — y activás el 15% una sola vez.
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
                    <span className="font-normal text-navy/45">(opcional)</span>
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
  );
}
