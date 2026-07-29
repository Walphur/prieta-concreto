"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay antes de “curar” (ms). */
  cureMs?: number;
};

/**
 * Colado → curado: entra húmedo/oscuro, solidifica y cae con peso.
 */
export function SolidifyReveal({
  children,
  className,
  cureMs = 280,
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

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("wet");
        window.setTimeout(() => setPhase("cured"), cureMs);
        io.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
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
