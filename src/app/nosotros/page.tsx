import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Prieta Concreto nace de la arquitectura: un taller en San Luis donde cada pieza se fabrica una a una, con la obsesión de que la siguiente sea mejor.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <div>
      <section className="relative min-h-[52vh] overflow-hidden bg-navy lg:min-h-[62vh]">
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
          <h1 className="max-w-2xl font-[family-name:var(--font-outfit)] text-3xl font-medium tracking-[-0.02em] text-cream sm:text-5xl">
            Nosotros
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 section-space sm:px-6 lg:px-8">
        <div className="space-y-6 text-[1.05rem] leading-[1.85] text-navy/65">
          <p>Prieta Concreto nació mientras estudiaba Arquitectura.</p>
          <p>
            Siempre me interesó cómo un material, una proporción o un detalle
            podían cambiar por completo la forma en que se vive un espacio.
          </p>
          <p>
            Empecé fabricando las primeras piezas por curiosidad, buscando
            entender el concreto desde otro lugar: no como un material de
            construcción, sino como un material de diseño.
          </p>
          <p>
            Con el tiempo esa búsqueda dejó de ser un hobby y se convirtió en un
            taller.
          </p>
          <p>
            Hoy cada pieza sigue siendo fabricada por mí, una por una,
            respetando los tiempos del material y buscando que cada nueva bacha
            sea mejor que la anterior.
          </p>
          <p>No buscamos producir más.</p>
          <p>
            Buscamos crear piezas que acompañen la arquitectura del baño y
            hagan que, al entrar, alguien pregunte:
          </p>
          <p className="font-[family-name:var(--font-outfit)] text-xl font-medium text-navy sm:text-2xl">
            “¿Dónde conseguiste esa bacha?”
          </p>
        </div>
      </section>

      <section className="bg-verde-agua-panel text-white">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="font-[family-name:var(--font-outfit)] text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em]">
            La obsesión por mejorar nunca termina.
          </p>
          <div className="mt-10 max-w-lg space-y-5 text-base leading-[1.8] text-white/75">
            <p>Cada pieza que sale del taller sirve para aprender algo.</p>
            <p>
              Cambiar un detalle. Ajustar una proporción. Probar una textura.
              Encontrar un acabado mejor.
            </p>
            <p>La siguiente siempre tiene que ser superior a la anterior.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 section-space sm:px-6 lg:px-8">
        <ol className="divide-y divide-navy/8">
          {[
            {
              t: "Pensada desde la arquitectura",
              d: "Cada línea, cada curva y cada proporción buscan integrarse naturalmente al espacio. Una buena bacha no llama la atención por sí sola. Hace que todo el baño se vea mejor.",
            },
            {
              t: "El material habla por sí solo",
              d: "Trabajamos con concreto pigmentado en masa para que el color forme parte de la pieza desde el primer momento. Cada textura es distinta. Cada pieza también.",
            },
            {
              t: "El tiempo forma parte del proceso",
              d: "No aceleramos el concreto. Cada pieza necesita su tiempo para fraguar, curar y alcanzar la resistencia que buscamos. Esperar también es una decisión de diseño.",
            },
            {
              t: "Hecha para un proyecto",
              d: "No fabricamos en serie. Cada pedido comienza desde cero y se produce especialmente para el espacio donde va a instalarse. Porque ningún baño es igual a otro.",
            },
          ].map((step, i) => (
            <li key={step.t} className="flex gap-6 py-10 first:pt-0 last:pb-0">
              <span className="font-[family-name:var(--font-outfit)] text-sm font-medium text-sage">
                0{i + 1}
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-outfit)] text-lg font-medium text-navy">
                  {step.t}
                </h2>
                <p className="mt-3 text-sm leading-[1.75] text-navy/55">
                  {step.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-navy/10 bg-cream">
        <div className="mx-auto max-w-xl px-4 section-space sm:px-6 lg:px-8">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-sage-dark">
            Nuestra idea
          </p>
          <h2 className="editorial-title mt-5 text-2xl sm:text-3xl">
            Un baño de diseño no debería depender de un presupuesto enorme.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-[1.8] text-navy/60">
            <p>
              A veces una sola pieza puede cambiar por completo la forma en que
              se percibe un espacio.
            </p>
            <p>Ese es el motivo por el que existe Prieta Concreto.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
