"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  cureMs?: number;
};

/**
 * Colado → curado al entrar en viewport.
 * Nunca deja el contenido invisible: fallback a cured.
 */
export function SolidifyReveal({
  children,
  className,
  cureMs = 520,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "wet" | "cured">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("cured");
      return;
    }

    let curedTimer = 0;
    let fallbackTimer = 0;
    let done = false;

    const start = () => {
      if (done) return;
      done = true;
      setPhase("wet");
      curedTimer = window.setTimeout(() => setPhase("cured"), cureMs);
      io.disconnect();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
      },
      { threshold: 0.01, rootMargin: "80px 0px 80px 0px" },
    );

    io.observe(el);

    // Si ya está en pantalla al montar
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      start();
    }

    // Nunca quedar trabado en idle
    fallbackTimer = window.setTimeout(() => {
      if (!done) start();
      else setPhase("cured");
    }, 2200);

    return () => {
      io.disconnect();
      window.clearTimeout(curedTimer);
      window.clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, [cureMs]);

  return (
    <div
      ref={ref}
      className={clsx(
        "solidify",
        phase === "idle" && "solidify--idle",
        phase === "wet" && "solidify--wet",
        phase === "cured" && "solidify--cured",
        className,
      )}
    >
      {children}
    </div>
  );
}
