import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

type PrietaLogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  /** light = fondo claro; dark = fondo navy */
  variant?: "light" | "dark";
};

const sizes = {
  sm: { mark: 36, text: "text-base" },
  md: { mark: 44, text: "text-lg" },
  lg: { mark: 56, text: "text-xl" },
};

/** Isotipo aislado sobre fondo claro + wordmark sans-serif */
export function PrietaLogo({
  className,
  showWordmark = true,
  size = "md",
  href = "/",
  variant = "light",
}: PrietaLogoProps) {
  const s = sizes[size];
  const dark = variant === "dark";

  const content = (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <span
        className="relative shrink-0 overflow-hidden"
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
        <span className="flex flex-col leading-none">
          <span
            className={clsx(
              "font-[family-name:var(--font-outfit)] font-semibold tracking-[-0.02em]",
              dark ? "text-cream" : "text-navy",
              s.text,
            )}
          >
            Prieta
          </span>
          <span
            className={clsx(
              "mt-0.5 text-[0.65em] font-medium uppercase tracking-[0.22em]",
              dark ? "text-sage-light" : "text-sage",
            )}
          >
            Concreto
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
