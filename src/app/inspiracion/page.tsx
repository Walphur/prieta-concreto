import type { Metadata } from "next";
import Image from "next/image";
import {
  galleryClientes,
  galleryGrupos,
  galleryProducto,
} from "@/lib/gallery";
import { whatsappGeneralUrl } from "@/lib/bank";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Espacios e instalaciones reales con bachas Prieta Concreto. Baños de clientes y piezas del taller. San Luis.",
  alternates: { canonical: "/inspiracion" },
};

/** Fotos reservadas para otras páginas — no se repiten aquí. */
const RESERVED = new Set([
  "/hero/hero-bano-marmolada.png", // Home hero
  "/hero/hero-bano-circular-espejo.png", // Nosotros hero
]);

const instalaciones = galleryClientes.filter((i) => !RESERVED.has(i.src));

const estudioGallery = [
  ...galleryProducto.slice(0, 6),
  ...galleryGrupos.filter((i) => !i.src.includes("feria")).slice(0, 2),
];

export default function InspiracionPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <header className="max-w-md pb-6">
          <h1 className="editorial-title text-3xl sm:text-4xl">Espacios</h1>
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
              "Hola Prieta, quiero compartir fotos de mi bacha instalada.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium uppercase tracking-[0.16em] text-navy/45 underline decoration-navy/20 underline-offset-8 transition duration-700 hover:text-navy hover:decoration-navy/50"
          >
            Compartir tu espacio
          </a>
        </div>
      </div>
    </div>
  );
}
