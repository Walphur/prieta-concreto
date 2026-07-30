"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { clsx } from "clsx";

const LETTER_STAGGER_MS = 55;
const LETTER_DURATION_MS = 480;

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Delay between each letter (ms). Default 55. */
  staggerMs?: number;
};

/**
 * Quiet section title: staggered letter reveal on enter, then a slow heartbeat pulse.
 * Respects prefers-reduced-motion (final text only).
 */
export function HeartbeatTitle({
  children,
  as: Tag = "h2",
  className,
  staggerMs = LETTER_STAGGER_MS,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<"idle" | "reveal" | "beat" | "static">(
    "idle",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("static");
      return;
    }

    let beatTimer = 0;
    let done = false;

    const start = () => {
      if (done) return;
      done = true;
      setPhase("reveal");
      const letterCount = Array.from(children).length;
      const total = letterCount * staggerMs + LETTER_DURATION_MS;
      beatTimer = window.setTimeout(() => setPhase("beat"), total);
      io.disconnect();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
      },
      { threshold: 0.15, rootMargin: "60px 0px 60px 0px" },
    );

    io.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      start();
    }

    return () => {
      io.disconnect();
      window.clearTimeout(beatTimer);
    };
  }, [children, staggerMs]);

  const animate = phase === "reveal" || phase === "beat";
  const chars = Array.from(children);
  const Comp = Tag as ElementType;

  return (
    <Comp
      ref={ref}
      className={className}
      aria-label={children}
    >
      <span
        className={clsx(
          "heartbeat-title__inner",
          phase === "beat" && "heartbeat-title__inner--pulse",
        )}
        aria-hidden="true"
      >
        {chars.map((char, i) => (
          <span
            key={`${i}-${char}`}
            className={clsx(
              "heartbeat-title__letter",
              phase === "idle" && "heartbeat-title__letter--hidden",
              animate && "heartbeat-title__letter--run",
              phase === "static" && "heartbeat-title__letter--visible",
            )}
            style={
              animate
                ? { animationDelay: `${i * staggerMs}ms` }
                : undefined
            }
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </span>
    </Comp>
  );
}
