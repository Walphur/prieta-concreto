import Image from "next/image";
import Link from "next/link";
import { readProducts } from "@/lib/catalog";

export async function ComingSoon() {
  const products = await readProducts();
  const celosias = products.filter((p) => p.category === "celosias");

  return (
    <section className="texture-concrete border-y-2 border-navy/15">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Próximo
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Celosías
            </h2>
            <p className="mt-3 text-base leading-relaxed text-navy/65">
              Módulos para filtrar luz, aire y mirada.
            </p>
          </div>
          <Link
            href="/tienda?categoria=celosias"
            className="text-sm font-medium text-sage-dark no-underline transition hover:text-navy hover:no-underline"
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
      </div>
    </section>
  );
}
