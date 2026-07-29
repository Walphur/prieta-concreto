import Link from "next/link";
import { BACHA_COLORS } from "@/lib/bacha-options";

export function PigmentStrip() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <div className="max-w-lg">
          <p className="editorial-kicker">Pigmentos</p>
          <h2 className="editorial-title mt-4 text-2xl sm:text-3xl">
            Color en la masa
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy/55">
            Óxidos y ferrites mezclados en el concreto. Textura mineral a la
            vista.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-7 lg:gap-6">
          {BACHA_COLORS.map((c) => (
            <li key={c.id}>
              <Link
                href="/tienda?vista=ejemplos"
                className="group block"
              >
                <span
                  className="block aspect-[3/4] w-full transition-opacity duration-700 ease-editorial group-hover:opacity-90"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="mt-3 block font-[family-name:var(--font-outfit)] text-sm font-medium text-navy">
                  {c.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
