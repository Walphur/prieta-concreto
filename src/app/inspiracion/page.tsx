import type { Metadata } from "next";
import Image from "next/image";
import {
  galleryClientes,
  galleryGrupos,
  galleryProducto,
} from "@/lib/gallery";
import { whatsappGeneralUrl } from "@/lib/bank";
import { HeartbeatTitle } from "@/components/effects/HeartbeatTitle";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Baños reales con bachas Prieta. Instalaciones de clientes y piezas del taller en San Luis.",
  alternates: { canonical: "/inspiracion" },
};

/** Fotos reservadas para otras páginas — no se repiten aquí. */
const RESERVED = new Set([
  "/hero/banner-inicio.jpg",
  "/hero/banner-coleccion.jpg",
  "/hero/banner-nosotros.jpg",
  "/hero/banner-inspiracion.jpg",
]);

const instalaciones = galleryClientes.filter((i) => !RESERVED.has(i.src));

const estudioGallery = [
  ...galleryProducto.slice(0, 6),
  ...galleryGrupos.filter((i) => !i.src.includes("feria")).slice(0, 2),
];

export default function InspiracionPage() {
  return (
    <div>
      <section className="relative min-h-[28vh] overflow-hidden bg-navy sm:min-h-[36vh] lg:min-h-[48vh]">
        <Image
          src="/hero/banner-inspiracion.jpg"
          alt="Baño spa Prieta con bacha marmolada, jardín interior y bañera"
          fill
          className="object-cover object-center opacity-80"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
        <div className="relative mx-auto flex min-h-[28vh] max-w-7xl items-end px-4 pb-10 sm:min-h-[36vh] sm:px-6 sm:pb-12 lg:min-h-[48vh] lg:px-8 lg:pb-16">
          <HeartbeatTitle
            as="h1"
            className="font-[family-name:var(--font-outfit)] text-3xl font-medium tracking-[-0.02em] text-cream sm:text-5xl"
          >
            Inspiración
          </HeartbeatTitle>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <header className="max-w-md pb-6">
          <h2 className="editorial-title text-3xl sm:text-4xl">Baños</h2>
        </header>

        <section className="mt-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:gap-12">
            {instalaciones.map((item) => (
              <figure key={item.src} className="group">
                <div className="overflow-hidden bg-cream-dark">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1400}
                    height={1800}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="h-auto w-full object-contain transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.01]"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-32">
          <h2 className="editorial-title text-2xl">Taller</h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {estudioGallery.map((item) => (
              <figure key={item.src} className="group">
                <div className="img-reveal relative aspect-[4/5] overflow-hidden bg-concrete-light">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.02]"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>

        <div className="mt-32 text-center">
          <a
            href={whatsappGeneralUrl(
              "Hola Prieta, quiero compartir fotos de mi baño con una pieza tuya.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive text-xs font-medium uppercase tracking-[0.16em] text-navy/45 no-underline transition duration-700 hover:text-navy hover:no-underline"
          >
            Sumá tu baño
          </a>
        </div>
      </div>
    </div>
  );
}
