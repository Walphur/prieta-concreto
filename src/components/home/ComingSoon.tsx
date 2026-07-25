import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

const celosias = products.filter((p) => p.category === "celosias");

export function ComingSoon() {
  return (
    <section className="texture-concrete border-y border-concrete/70">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Próximamente
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Celosías
            </h2>
            <p className="mt-3 text-base text-navy/65">
              Módulos de concreto para filtrar luz, ventilación y privacidad.
              Cuatro modelos en desarrollo, con la misma lógica artesanal.
            </p>
          </div>
          <Link
            href="/tienda?categoria=celosias"
            className="text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
          >
            Ver en tienda
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {celosias.map((item) => (
            <Link
              key={item.id}
              href={`/producto/${item.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-concrete-light">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 bg-cream/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-dark">
                  En desarrollo
                </span>
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-base font-semibold text-navy transition-colors group-hover:text-sage-dark">
                {item.name}
              </h3>
              <p className="mt-1 text-sm text-navy/60">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="border border-concrete bg-cream-dark/40 p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">
              También en camino
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
              Mesadas
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-navy/65">
              Superficies a medida para integrar bachas Prieta. Mismo material,
              misma precisión artesanal.
            </p>
            <Link
              href="/tienda?categoria=mesadas"
              className="mt-5 inline-block text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
            >
              Seguir el lanzamiento
            </Link>
          </div>
          <div className="relative min-h-[220px] overflow-hidden bg-navy">
            <Image
              src="/products/celosias/circulo.png"
              alt="Detalle de celosía Prieta"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
            <p className="absolute bottom-6 left-6 max-w-xs text-sm leading-relaxed text-cream/85">
              Luz, sombra y concreto modular — el lenguaje Prieta fuera del baño.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
