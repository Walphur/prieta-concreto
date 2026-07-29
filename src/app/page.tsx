import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { HomeVideos } from "@/components/home/HomeVideos";
import { ComingSoon } from "@/components/home/ComingSoon";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PigmentStrip />
      <FeaturedProducts />
      <HomeVideos />
      <ComingSoon />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="texture-concrete-dark relative overflow-hidden px-8 py-14 sm:px-12 sm:py-16">
          <div className="grain-overlay absolute inset-0" />
          <div className="relative max-w-xl">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              Inspiración real, piezas reales
            </h2>
            <p className="mt-3 text-cream/70">
              Textura mineral, instalaciones de clientes y el proceso del taller.
              Envíos a toda la Argentina por Andesmar Cargas.
            </p>
            <div className="mt-8">
              <Button href="/inspiracion" variant="primary">
                Ver galería
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
