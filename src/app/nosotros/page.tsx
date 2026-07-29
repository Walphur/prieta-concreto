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
      <section className="relative min-h-[48vh] overflow-hidden bg-navy lg:min-h-[56vh]">
        <Image
          src="/hero/hero-bano-marmolada.png"
          alt="Bacha Prieta Concreto instalada"
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-7xl items-end px-4 pb-14 sm:px-6 lg:min-h-[56vh] lg:px-8 lg:pb-16">
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-cream/70">
              Nosotros
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-outfit)] text-3xl font-medium tracking-[-0.02em] text-cream sm:text-5xl">
              Concreto con oficio
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 section-space sm:px-6 lg:px-8">
        <h2 className="editorial-title text-2xl">Historia</h2>
        <p className="mt-6 leading-[1.75] text-navy/60">
          Prieta Concreto nace en San Luis como un estudio de diseño artesanal
          dedicado a piezas de baño. Cada bacha se vacía a mano: pigmentamos la
          masa con óxidos y ferrites, controlamos el curado y sellamos la
          superficie para un uso diario sin perder la textura mineral del
          concreto.
        </p>

        <h2 className="editorial-title mt-20 text-2xl">Proceso</h2>
        <ol className="mt-10 divide-y divide-navy/8">
          {[
            {
              t: "Diseño",
              d: "Proporciones, drenaje y bordes para baños contemporáneos.",
            },
            {
              t: "Vaciado",
              d: "Moldes propios y mezclas pigmentadas en la masa.",
            },
            {
              t: "Curado y sellado",
              d: "Aprox. 15 días de fraguado, más sellador mineral resistente al agua.",
            },
            {
              t: "Pedido a medida",
              d: "Modelo y color a elección. Seña para iniciar; saldo al retirar o despachar.",
            },
          ].map((step, i) => (
            <li key={step.t} className="flex gap-6 py-7 first:pt-0 last:pb-0">
              <span className="font-[family-name:var(--font-outfit)] text-sm font-medium text-sage">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-outfit)] font-medium text-navy">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/55">
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
