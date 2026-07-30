"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { useLayoutEffect, useState } from "react";

type PrietaLogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  /** light = fondo claro; dark = fondo navy */
  variant?: "light" | "dark";
  /** Fade-in mark, then staggered letters — once per session */
  intro?: boolean;
};

const sizes = {
  sm: { mark: 36, text: "text-base" },
  md: { mark: 44, text: "text-lg" },
  lg: { mark: 56, text: "text-xl" },
};

const INTRO_KEY = "prieta-logo-intro";
const MARK_MS = 520;
const LETTER_STAGGER_MS = 55;

function WordLetters({
  text,
  animate,
  startDelayMs,
}: {
  text: string;
  animate: boolean;
  startDelayMs: number;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={clsx(
            "logo-intro__letter inline-block",
            animate && "logo-intro__letter--run",
          )}
          style={
            animate
              ? {
                  animationDelay: `${startDelayMs + i * LETTER_STAGGER_MS}ms`,
                }
              : undefined
          }
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </>
  );
}

/** Isotipo aislado sobre fondo claro + wordmark sans-serif */
export function PrietaLogo({
  className,
  showWordmark = true,
  size = "md",
  href = "/",
  variant = "light",
  intro = false,
}: PrietaLogoProps) {
  const s = sizes[size];
  const dark = variant === "dark";
  const [runIntro, setRunIntro] = useState(false);

  useLayoutEffect(() => {
    if (!intro) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let already = false;
    try {
      already = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      /* private mode */
    }

    if (reduced || already) return;

    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
    setRunIntro(true);
  }, [intro]);

  const prieta = "Prieta";
  const concreto = "Concreto";
  const lettersStart = MARK_MS;

  const content = (
    <span
      className={clsx(
        "inline-flex items-center gap-3",
        intro && "logo-intro",
        runIntro && "logo-intro--run",
        className,
      )}
    >
      <span
        className={clsx(
          "relative shrink-0 overflow-hidden",
          intro && "logo-intro__mark",
          runIntro && "logo-intro__mark--run",
        )}
        style={{ width: s.mark, height: s.mark }}
        aria-hidden
      >
        <Image
          src="/logo-prieta.png"
          alt=""
          width={s.mark}
          height={s.mark}
          className={clsx(
            "h-full w-full object-contain",
            dark && "brightness-110",
          )}
          priority
        />
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none" aria-hidden={intro || undefined}>
          <span
            className={clsx(
              "font-[family-name:var(--font-outfit)] font-semibold tracking-[-0.02em] whitespace-nowrap",
              dark ? "text-cream" : "text-navy",
              s.text,
            )}
          >
            {intro ? (
              <WordLetters
                text={prieta}
                animate={runIntro}
                startDelayMs={lettersStart}
              />
            ) : (
              prieta
            )}
          </span>
          <span
            className={clsx(
              "mt-0.5 text-[0.65em] font-medium uppercase tracking-[0.22em] whitespace-nowrap",
              dark ? "text-sage-light" : "text-sage",
            )}
          >
            {intro ? (
              <WordLetters
                text={concreto}
                animate={runIntro}
                startDelayMs={
                  lettersStart + prieta.length * LETTER_STAGGER_MS + 40
                }
              />
            ) : (
              concreto
            )}
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="group transition-opacity duration-300 hover:opacity-85"
      aria-label="Prieta Concreto — Inicio"
    >
      {content}
    </Link>
  );
}

/** Versión SVG con los tres bloques en colores de marca (para usos decorativos) */
export function PrietaMarkColored({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Bloque izquierdo — rojo profundo */}
      <path
        d="M18 28c0-8 6-14 14-14h22c6 0 10 5 9 11l-8 52c-1 7-7 12-14 12H32c-8 0-14-7-14-15V28z"
        fill="#8B3A3A"
      />
      {/* Bloque superior derecho — azul marino */}
      <path
        d="M62 16c-1-5 3-10 9-10h22c8 0 15 7 15 15v28c0 7-5 12-12 13l-28 4c-6 1-10-4-9-10l3-40z"
        fill="#1A2332"
      />
      {/* Bloque inferior derecho — sage */}
      <path
        d="M68 68c-1-6 4-11 10-12l24-4c7-1 13 4 13 11v24c0 8-7 15-15 15H78c-7 0-12-6-11-13l1-21z"
        fill="#7D8F78"
      />
      {/* Bacha isométrica */}
      <ellipse cx="58" cy="58" rx="22" ry="16" stroke="#7D8F78" strokeWidth="2.2" />
      <ellipse cx="58" cy="58" rx="15" ry="10.5" stroke="#7D8F78" strokeWidth="1.8" />
      <ellipse cx="58" cy="58" rx="8" ry="5.5" stroke="#7D8F78" strokeWidth="1.5" />
      <circle cx="58" cy="58" r="2.2" fill="#7D8F78" />
    </svg>
  );
}
