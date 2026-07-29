import Link from "next/link";
import { BACHA_COLORS } from "@/lib/bacha-options";

export function PigmentStrip() {
  return (
    <section className="texture-concrete border-y border-concrete/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Pigmentos · ferrites
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
            Color en la masa, no en la pintura
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/65 sm:text-base">
            Cada tono nace de óxidos y ferrites mezclados en el concreto. La
            textura mineral queda a la vista: poros, veteados y mate.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {BACHA_COLORS.map((c) => (
            <li key={c.id}>
              <Link
                href={`/tienda?vista=ejemplos`}
                className="group block transition-transform duration-500 hover:-translate-y-0.5"
              >
                <span
                  className="block aspect-[4/5] w-full border border-black/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  style={{
                    background: `linear-gradient(155deg, ${c.hex} 0%, color-mix(in srgb, ${c.hex} 72%, #1a2332) 100%)`,
                  }}
                  aria-hidden
                />
                <span className="mt-2 block font-[family-name:var(--font-outfit)] text-sm font-semibold text-navy group-hover:text-sage-dark">
                  {c.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-navy/45">
                  {c.ferrite}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
