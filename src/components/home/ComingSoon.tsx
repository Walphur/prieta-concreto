import Image from "next/image";
import Link from "next/link";

const futures = [
  {
    title: "Celosías",
    description:
      "Módulos de concreto para filtrar luz y crear penumbra en interiores y fachadas.",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80",
    href: "/tienda?categoria=celosias",
  },
  {
    title: "Mesadas",
    description:
      "Superficies continuas a medida, pensadas para integrar bachas Prieta.",
    image:
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1400&q=80",
    href: "/tienda?categoria=mesadas",
  },
];

export function ComingSoon() {
  return (
    <section className="texture-concrete border-y border-concrete/70">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Próximamente
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Celosías y mesadas
          </h2>
          <p className="mt-3 text-base text-navy/65">
            Expandimos el lenguaje del concreto más allá del baño. Piezas en
            desarrollo, con la misma lógica artesanal.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {futures.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative block min-h-[280px] overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-navy/55 transition-colors duration-500 group-hover:bg-navy/45" />
              <div className="relative flex h-full min-h-[280px] flex-col justify-end p-8">
                <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">
                  En desarrollo
                </span>
                <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/75">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
