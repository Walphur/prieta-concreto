import Link from "next/link";
import { BACHA_COLORS } from "@/lib/bacha-options";
import { SolidifyReveal } from "@/components/effects/SolidifyReveal";
import { clsx } from "clsx";

type Props = {
  /** home = full cream section with links to tienda; inline = nested under Colección */
  variant?: "home" | "inline";
  className?: string;
  id?: string;
};

export function PigmentStrip({
  variant = "home",
  className,
  id = "pigmento",
}: Props) {
  const inline = variant === "inline";

  const body = (
    <>
      <h2
        className={clsx(
          "editorial-title",
          inline ? "text-xl sm:text-2xl" : "max-w-sm text-2xl sm:text-3xl",
        )}
      >
        Pigmento en masa
      </h2>
      {inline ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/50">
          El color se elige al encargar. Mismo precio en todos los tonos.
        </p>
      ) : null}

      <ul
        className={clsx(
          "grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7 lg:gap-8",
          inline ? "mt-10" : "mt-16",
        )}
      >
        {BACHA_COLORS.map((c) => {
          const swatch = (
            <>
              <span
                className={clsx(
                  "block w-full overflow-hidden transition-[opacity,transform] duration-500 ease-editorial",
                  inline ? "aspect-square" : "aspect-[3/4]",
                  !inline && "motion-safe:group-hover:scale-[1.02] group-hover:opacity-90",
                )}
                style={{ backgroundColor: c.hex }}
                aria-hidden
              />
              <span
                className={clsx(
                  "mt-3 block font-[family-name:var(--font-outfit)] font-medium text-navy transition-colors duration-200",
                  inline ? "text-xs sm:text-sm" : "mt-4 text-sm group-hover:text-sage-dark",
                )}
              >
                {c.label}
              </span>
            </>
          );

          return (
            <li key={c.id}>
              {inline ? (
                <div className="block">{swatch}</div>
              ) : (
                <Link href="/tienda?categoria=bachas#pigmento" className="group block">
                  {swatch}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );

  if (inline) {
    return (
      <section id={id} className={clsx("scroll-mt-28", className)}>
        <SolidifyReveal cureMs={420}>{body}</SolidifyReveal>
      </section>
    );
  }

  return (
    <section id={id} className={clsx("scroll-mt-28 bg-cream", className)}>
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <SolidifyReveal cureMs={420}>{body}</SolidifyReveal>
      </div>
    </section>
  );
}
