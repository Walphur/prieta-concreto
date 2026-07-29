import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { whatsappGeneralUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import { productPhotos } from "@/lib/gallery";
import { ConcreteNoiseCanvas } from "@/components/effects/ConcreteNoiseCanvas";

const HERO_IMAGE = productPhotos.clienteCircular;

export function Hero() {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-navy">
      <Image
        src={HERO_IMAGE}
        alt="Bacha de concreto Prieta en baño de diseño"
        fill
        priority
        sizes="100vw"
        className="animate-scale-soft object-cover object-[68%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-transparent to-navy/40" />
      <ConcreteNoiseCanvas className="pointer-events-none absolute inset-0" opacity={0.28} />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:justify-center lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.22em] text-sage-light">
            Concreto pigmentado · San Luis
          </p>
          <p className="animate-fade-up delay-100 mt-3 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-cream sm:text-3xl md:text-4xl">
            Prieta Concreto
          </p>
          <h1 className="animate-fade-up delay-200 mt-4 font-[family-name:var(--font-outfit)] text-3xl font-medium leading-[1.15] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Artesanía en concreto para baños de diseño.
          </h1>
          <p className="animate-fade-up delay-300 mt-5 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Masa pigmentada con ferrites, curado lento y sellado mineral. Si no
            está el modelo en stock, lo fabricamos por pedido —{" "}
            {fullPriceLabel()} · seña {depositLabel()} · ~{madeToOrder.leadDays}{" "}
            días.
          </p>
          <div className="animate-fade-up delay-400 mt-8 flex flex-wrap gap-3">
            <Button href="/tienda" variant="primary" className="min-w-[11rem]">
              Ver Colección
            </Button>
            <Button
              href={whatsappGeneralUrl(
                `Hola Prieta Concreto, quiero encargar una bacha por pedido.`,
              )}
              variant="outline"
              className="min-w-[11rem] border-cream/35 text-cream hover:border-sage-light hover:text-sage-light"
            >
              Pedir por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
