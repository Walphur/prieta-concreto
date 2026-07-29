import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const installs = [
  {
    src: "/gallery/clientes/cliente-oval-marmol-madera.png",
    alt: "Bacha oval marmolada instalada sobre mueble de madera",
    label: "Oval marmolada · baño claro",
    caption: "Instalada sobre madera clara, espejo redondo y luz natural.",
  },
  {
    src: "/gallery/clientes/cliente-oval-gris-oscuro-bano.png",
    alt: "Bacha oval gris oscuro instalada en baño con azulejos oscuros",
    label: "Oval gris oscuro · baño moody",
    caption: "Concreto mate sobre mesada moteada y muros en grafito.",
  },
] as const;

/**
 * Bloque lifestyle grande: ritmo tipo Bauvic (visual dominante + copy corto),
 * con voz e identidad Prieta.
 */
export function HomeInstalls() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            En casas reales
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Bachas ya instaladas
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/65">
            Fotos de clientes: la pieza en contexto, sin recortes agresivos.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light sm:aspect-[5/6]">
              <Image
                src={installs[0].src}
                alt={installs[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
                priority
              />
            </div>
            <figcaption className="mt-4">
              <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
                {installs[0].label}
              </p>
              <p className="mt-1 text-sm text-navy/60">{installs[0].caption}</p>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-8 lg:col-span-5">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
                <Image
                  src={installs[1].src}
                  alt={installs[1].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
                  {installs[1].label}
                </p>
                <p className="mt-1 text-sm text-navy/60">{installs[1].caption}</p>
              </figcaption>
            </figure>

            <div className="border-t-2 border-navy/15 pt-8">
              <p className="text-sm leading-relaxed text-navy/65">
                Más instalaciones, taller y videos en la galería de inspiración.
              </p>
              <div className="mt-5">
                <Button href="/inspiracion" variant="outline">
                  Ver inspiración
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y-2 border-navy/15 bg-navy">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 lg:py-12">
          <p className="max-w-xl font-[family-name:var(--font-outfit)] text-xl font-semibold tracking-tight text-cream sm:text-2xl">
            Elegí modelo y color. Si no hay stock, la fabricamos por pedido.
          </p>
          <Link
            href="/tienda"
            className="inline-flex shrink-0 items-center justify-center bg-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
