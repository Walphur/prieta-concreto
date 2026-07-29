import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Historia y proceso artesanal de Prieta Concreto en San Luis. Bachas por pedido con demora de 15 días por fraguado.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <div>
      <section className="relative min-h-[52vh] overflow-hidden bg-navy lg:min-h-[62vh]">
        {/* Foto exclusiva de Nosotros — no usada en Home ni Inspiración */}
        <Image
          src="/hero/hero-bano-circular-espejo.png"
          alt="Bacha circular Prieta en baño con espejo retroiluminado"
          fill
          className="object-cover opacity-75"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/15 to-transparent" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-7xl items-end px-4 pb-16 sm:px-6 lg:min-h-[62vh] lg:px-8 lg:pb-20">
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-medium tracking-[-0.02em] text-cream sm:text-5xl">
            Concreto con oficio
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 section-space sm:px-6 lg:px-8">
        <p className="leading-[1.8] text-navy/60">
          Prieta Concreto nace en San Luis. Cada bacha se vacía a mano:
          pigmentamos la masa, controlamos el curado y sellamos la superficie
          para uso diario sin perder la textura mineral.
        </p>

        <ol className="mt-20 divide-y divide-navy/8">
          {[
            {
              t: "Diseño",
              d: "Proporciones y drenaje para baños contemporáneos.",
            },
            {
              t: "Vaciado",
              d: "Moldes propios y pigmento en la masa.",
            },
            {
              t: "Curado",
              d: "Aprox. 15 días de fraguado y sellado mineral.",
            },
            {
              t: "Encargo",
              d: "Modelo y color a elección. Seña para iniciar.",
            },
          ].map((step, i) => (
            <li key={step.t} className="flex gap-6 py-8 first:pt-0 last:pb-0">
              <span className="font-[family-name:var(--font-outfit)] text-sm font-medium text-sage">
                0{i + 1}
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-outfit)] font-medium text-navy">
                  {step.t}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy/50">
                  {step.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
