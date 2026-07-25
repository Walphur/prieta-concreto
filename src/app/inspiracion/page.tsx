import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Galería de estudio y fotos de clientes con bachas Prieta Concreto.",
};

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1620626011761-a28690b11c63?auto=format&fit=crop&w=1200&q=80",
    label: "Estudio",
    alt: "Bacha en baño iluminado",
  },
  {
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    label: "Cliente",
    alt: "Detalle de baño residencial",
  },
  {
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    label: "Estudio",
    alt: "Instalación contemporánea",
  },
  {
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
    label: "Cliente",
    alt: "Baño con luz natural",
  },
  {
    src: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    label: "Estudio",
    alt: "Pieza circular de concreto",
  },
  {
    src: "https://images.unsplash.com/photo-1564540586988-aa4e5380613d?auto=format&fit=crop&w=1200&q=80",
    label: "Cliente",
    alt: "Detalle textura mineral",
  },
];

export default function InspiracionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Inspiración
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          Galería curada
        </h1>
        <p className="mt-3 text-navy/65">
          Fotos de estudio y contenido de clientes. Pronto vas a poder subir
          tus propias imágenes (moderadas antes de publicarse).
        </p>
      </header>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
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

      <div className="texture-concrete mt-16 border border-concrete px-6 py-10 text-center sm:px-10">
        <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-navy">
          Subí tu foto
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-navy/60">
          El formulario de carga (Uploadthing / Firebase) se conectará en la
          siguiente etapa, junto con la moderación de reseñas.
        </p>
        <button
          type="button"
          disabled
          className="mt-6 cursor-not-allowed bg-sage/50 px-6 py-3 text-sm font-semibold text-white"
        >
          Próximamente
        </button>
      </div>
    </div>
  );
}
