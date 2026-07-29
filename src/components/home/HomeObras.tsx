import Image from "next/image";
import Link from "next/link";
import { galleryClientes, productPhotos } from "@/lib/gallery";
import { SolidifyReveal } from "@/components/effects/SolidifyReveal";

const obras = [
  {
    src: productPhotos.heroBanoMarmolada,
    label: "Marmolada",
    alt: "Bacha oval marmolada en baño con mueble de madera",
  },
  {
    src: productPhotos.clienteCircularBeigeEspejo,
    label: "Beige · luz",
    alt: "Bacha circular beige con espejo retroiluminado",
  },
  {
    src: productPhotos.clienteGrisOscuroBano,
    label: "Oscuro",
    alt: "Bacha oval gris oscuro en baño",
  },
  {
    src: productPhotos.heroBanoCircularEspejo,
    label: "Terrazo",
    alt: "Bacha circular sobre terrazo con espejo LED",
  },
  ...galleryClientes
    .filter(
      (g) =>
        ![
          productPhotos.clienteCircularBeigeEspejo,
          productPhotos.clienteGrisOscuroBano,
          productPhotos.heroBanoCircularEspejo,
          productPhotos.heroBanoMarmolada,
        ].includes(g.src),
    )
    .slice(0, 2)
    .map((g) => ({ src: g.src, label: g.label, alt: g.alt })),
];

export function HomeObras() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="editorial-kicker">Espacios</p>
            <h2 className="editorial-title mt-4 text-2xl sm:text-3xl">
              En casa
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/55">
              Baños reales. Piezas Prieta.
            </p>
          </div>
          <Link
            href="/inspiracion"
            className="text-xs font-medium uppercase tracking-[0.16em] text-navy/50 underline decoration-navy/20 underline-offset-8 transition duration-700 hover:text-navy hover:decoration-navy/50"
          >
            Ver más
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {obras.slice(0, 6).map((item, i) => (
            <SolidifyReveal key={item.src} cureMs={400 + i * 80}>
              <Link href="/inspiracion" className="group block">
                <div className="img-reveal relative aspect-[4/5] overflow-hidden bg-concrete-light">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-navy/45">
                  {item.label}
                </p>
              </Link>
            </SolidifyReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
