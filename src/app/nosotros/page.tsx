import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Historia y proceso artesanal de Prieta Concreto en Córdoba.",
};

export default function NosotrosPage() {
  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden bg-navy">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
          alt="Taller de diseño y concreto"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="relative mx-auto flex min-h-[42vh] max-w-7xl items-end px-4 pb-12 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-light">
              Nosotros
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-cream sm:text-5xl">
              Concreto con oficio
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
          Historia
        </h2>
        <p className="mt-4 leading-relaxed text-navy/70">
          Prieta Concreto nace en Córdoba como un estudio de diseño artesanal
          dedicado a piezas de baño. Cada bacha se vacía a mano: pigmentamos la
          masa, controlamos el curado y sellamos la superficie para un uso
          diario sin perder la textura mineral del material.
        </p>

        <h2 className="mt-12 font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
          Proceso artesanal
        </h2>
        <ol className="mt-6 space-y-6">
          {[
            {
              t: "Diseño",
              d: "Proporciones, drenaje y bordes pensados para baños contemporáneos.",
            },
            {
              t: "Vaciado",
              d: "Moldes propios y mezclas pigmentadas en rojo, navy, sage o natural.",
            },
            {
              t: "Curado y sellado",
              d: "Tiempo de fraguado controlado y sellador profesional resistente al agua.",
            },
            {
              t: "Control de stock",
              d: "Inventario en tiempo real: solo publicamos lo que podemos entregar.",
            },
          ].map((step, i) => (
            <li key={step.t} className="flex gap-4">
              <span className="font-[family-name:var(--font-outfit)] text-sm font-semibold text-sage">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-navy">{step.t}</h3>
                <p className="mt-1 text-navy/65">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
