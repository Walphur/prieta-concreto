import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { productPhotos } from "@/lib/gallery";

const HERO_IMAGE = productPhotos.clienteCircular;

export function Hero() {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-navy">
      <Image
        src={HERO_IMAGE}
        alt="Bacha de concreto en baño de diseño iluminado"
        fill
        priority
        sizes="100vw"
        className="animate-scale-soft object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/45 to-navy/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-navy/30" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:justify-center lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <p className="animate-fade-up font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-cream sm:text-3xl md:text-4xl">
            Prieta Concreto
          </p>
          <h1 className="animate-fade-up delay-100 mt-4 font-[family-name:var(--font-outfit)] text-3xl font-medium leading-[1.15] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Artesanía en concreto para baños de diseño.
          </h1>
          <p className="animate-fade-up delay-200 mt-5 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Bachas hechas a mano en San Luis. Piezas únicas con textura mineral y
            acabados de estudio.
          </p>
          <div className="animate-fade-up delay-300 mt-8">
            <Button href="/tienda" variant="primary" className="min-w-[11rem]">
              Ver Colección
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
