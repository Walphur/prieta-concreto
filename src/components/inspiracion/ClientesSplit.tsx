import Image from "next/image";
import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

const FEATURED = {
  src: "/gallery/clientes/cliente-oval-marmol-madera.png",
  alt: "Bacha oval marmolada Prieta instalada sobre mueble de madera clara",
} as const;

/**
 * Bloque 50/50 estilo Bauvic (organización, no clon):
 * panel verde agua + foto de instalación a sangre.
 */
export function ClientesSplit() {
  return (
    <section className="w-full overflow-hidden">
      <div className="grid lg:min-h-[min(72vh,640px)] lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-verde-agua px-6 py-14 text-navy sm:px-10 lg:px-14 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy/55">
            En casas reales
          </p>
          <h2 className="mt-3 max-w-md font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Bachas ya instaladas
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-navy/75">
            Fotos de clientes: la pieza en el baño, sin recortes agresivos. Si
            no hay stock del modelo, la fabricamos por pedido.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href="/tienda"
              variant="secondary"
              className="min-w-[10.5rem] bg-navy text-cream hover:bg-navy-soft"
            >
              Ver colección
            </Button>
            <Button
              href={whatsappGeneralUrl(
                "Hola Prieta Concreto, vi las instalaciones y quiero encargar una bacha.",
              )}
              variant="outline"
              className="min-w-[10.5rem] border-navy/30 text-navy hover:border-navy hover:bg-navy/5"
            >
              Pedir por WhatsApp
            </Button>
          </div>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full">
          <Image
            src={FEATURED.src}
            alt={FEATURED.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
