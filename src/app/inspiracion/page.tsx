import type { Metadata } from "next";
import Image from "next/image";
import {
  galleryClientes,
  galleryGrupos,
  galleryProducto,
  galleryVideos,
} from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Galería de bachas Prieta Concreto: estudio, clientes y videos. San Luis, Argentina.",
};

export default function InspiracionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Inspiración
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          Galería de bachas
        </h1>
        <p className="mt-3 text-navy/65">
          Fotos de estudio, instalaciones de clientes y videos del taller en San
          Luis. Solo piezas reales.
        </p>
      </header>

      <section className="mt-14">
        <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
          Estudio
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {galleryProducto.map((item) => (
            <figure
              key={item.src}
              className="group relative aspect-square overflow-hidden bg-cream-dark"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute bottom-3 left-3 bg-cream/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
          Colecciones y grupos
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {galleryGrupos.map((item) => (
            <figure
              key={item.src}
              className="group relative aspect-square overflow-hidden bg-cream-dark"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute bottom-3 left-3 bg-cream/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
          Clientes
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {galleryClientes.map((item) => (
            <figure
              key={item.src}
              className="group relative aspect-[4/5] overflow-hidden bg-concrete-light"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute bottom-3 left-3 bg-cream/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
          Videos
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {galleryVideos.map((item) => (
            <figure key={item.src} className="overflow-hidden bg-navy">
              <video
                src={item.src}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full object-cover"
              >
                {item.label}
              </video>
              <figcaption className="px-4 py-3 text-sm text-cream/80">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="mt-16 border border-concrete bg-cream-dark/40 px-6 py-10 text-center sm:px-10">
        <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
          Subí tu foto
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-navy/60">
          ¿Ya tenés tu bacha Prieta? Mandanos la foto por WhatsApp y la sumamos
          a esta galería.
        </p>
      </div>
    </div>
  );
}
