import Link from "next/link";
import { BACHA_COLORS } from "@/lib/bacha-options";

export function PigmentStrip() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <h2 className="editorial-title max-w-sm text-2xl sm:text-3xl">
          Color en la masa
        </h2>

        <ul className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7 lg:gap-8">
          {BACHA_COLORS.map((c) => (
            <li key={c.id}>
              <Link href="/tienda?vista=ejemplos" className="group block">
                <span
                  className="block aspect-[3/4] w-full transition-opacity duration-700 ease-editorial group-hover:opacity-85"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="mt-4 block font-[family-name:var(--font-outfit)] text-sm font-medium text-navy">
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
