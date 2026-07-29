import type { Metadata } from "next";
import Image from "next/image";
import {
  galleryClientes,
  galleryGrupos,
  galleryProducto,
  galleryVideos,
} from "@/lib/gallery";
import { whatsappGeneralUrl } from "@/lib/bank";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Espacios e instalaciones reales con bachas Prieta Concreto. Baños de clientes y piezas del taller. San Luis.",
  alternates: { canonical: "/inspiracion" },
};

const estudioGallery = [
  ...galleryProducto.slice(0, 9),
  ...galleryGrupos.filter((i) => !i.src.includes("feria")).slice(0, 3),
];

const instalaciones = [
  {
    src: "/hero/hero-bano-marmolada.png",
    label: "Oval marmolada",
    alt: "Bacha oval marmolada Prieta en baño con mueble de madera",
  },
  ...galleryClientes,
];

export default function InspiracionPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <header className="max-w-lg pb-4">
          <p className="editorial-kicker">Inspiración</p>
          <h1 className="editorial-title mt-4 text-3xl sm:text-4xl">
            Espacios
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-navy/55">
            Baños reales. La pieza en contexto.
          </p>
        </header>

        <section className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
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
                <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-navy/40">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <p className="editorial-kicker">Taller</p>
          <h2 className="editorial-title mt-4 text-2xl">Piezas</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
                <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-navy/35">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <p className="editorial-kicker">Oficio</p>
          <h2 className="editorial-title mt-4 text-2xl">Proceso</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {galleryVideos.map((item) => (
              <figure key={item.src}>
                <div className="flex aspect-[9/16] items-center justify-center bg-navy">
                  <video
                    src={item.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full max-h-full w-full object-contain"
                  >
                    {item.label}
                  </video>
                </div>
                <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-navy/40">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="mt-28 border-t border-navy/10 pt-16 text-center">
          <p className="text-sm text-navy/50">¿Tenés un baño Prieta?</p>
          <a
            href={whatsappGeneralUrl(
              "Hola Prieta, quiero compartir fotos de mi bacha instalada.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.16em] text-navy underline decoration-navy/25 underline-offset-8 transition duration-700 hover:decoration-navy/60"
          >
            Compartir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
