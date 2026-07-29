import type { Metadata } from "next";
import Image from "next/image";
import {
  galleryClientes,
  galleryGrupos,
  galleryProducto,
  galleryVideos,
} from "@/lib/gallery";
import { MadeToOrderNotice } from "@/components/order/MadeToOrderNotice";
import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Galería de bachas Prieta Concreto: fotos de estudio, baños de clientes y videos del taller. San Luis.",
  alternates: { canonical: "/inspiracion" },
};

/** Fotos de taller + varias bachas juntas (sin feria / fotos confusas). */
const estudioGallery = [
  ...galleryProducto,
  ...galleryGrupos.filter((i) => !i.src.includes("feria")),
];

export default function InspiracionPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="max-w-2xl border-b-2 border-navy/15 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Inspiración
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Galería de bachas
          </h1>
          <p className="mt-3 text-navy/65">
            Fotos reales del taller y de baños ya instalados. Elegí modelo y
            color para encargar la tuya.
          </p>
        </header>

        <section className="mt-14">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
            En el taller
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Modelos, colores y piezas terminadas antes de enviar.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {estudioGallery.map((item) => (
              <figure
                key={item.src}
                className="group relative aspect-[4/5] overflow-hidden bg-concrete-light"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute bottom-3 left-3 bg-cream/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t-2 border-navy/15 pt-16">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
            Instalaciones de clientes
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Bachas Prieta en baños reales — se ve la pieza y el entorno.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {galleryClientes.map((item) => (
              <figure
                key={item.src}
                className="group overflow-hidden border border-navy/12 bg-cream-dark"
              >
                <div className="bg-cream-dark p-2 sm:p-3">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1200}
                    height={1600}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>
                <figcaption className="border-t border-navy/10 bg-cream px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t-2 border-navy/15 pt-16">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
            Videos del proceso
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Cómo se hacen las bachas en el taller.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryVideos.map((item) => (
              <figure key={item.src} className="overflow-hidden bg-navy">
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
                <figcaption className="px-4 py-3 text-sm text-cream/80">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="mt-16 border-2 border-navy/15 bg-cream-dark/40 px-6 py-10 text-center sm:px-10">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
            Subí tu foto
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-navy/60">
            ¿Ya tenés tu bacha Prieta? Mandanos la foto por WhatsApp y la
            sumamos a esta galería.
          </p>
          <div className="mt-6">
            <Button
              href={whatsappGeneralUrl(
                "Hola Prieta Concreto, les mando foto de mi bacha para la galería.",
              )}
              variant="outline"
            >
              Enviar por WhatsApp
            </Button>
          </div>
        </div>

        <MadeToOrderNotice className="mt-10 w-full" />
      </div>
    </div>
  );
}
