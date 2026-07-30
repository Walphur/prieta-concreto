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
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
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
      { threshold: 0.05, rootMargin: "80px 0px 80px 0px" },
    );

    io.observe(el);

    // Hero titles are already in view — kick off without waiting for IO.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.1 && rect.bottom > -40) {
      start();
    }

    // Failsafe: never leave titles stuck in idle/reveal without pulse.
    const failsafe = window.setTimeout(() => {
      if (!started) start();
      else setPhase((p) => (p === "reveal" || p === "idle" ? "beat" : p));
    }, Math.max(1800, Array.from(children).length * staggerMs + LETTER_DURATION_MS + 400));

    return () => {
      io.disconnect();
      window.clearTimeout(beatTimer);
      window.clearTimeout(failsafe);
    };
  }, [children, staggerMs]);

  const chars = Array.from(children);
  const Comp = Tag as ElementType;
  const revealing = phase === "reveal";
  const settled = phase === "beat" || phase === "static";

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
              revealing && "heartbeat-title__letter--run",
              settled && "heartbeat-title__letter--visible",
            )}
            style={
              revealing
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
