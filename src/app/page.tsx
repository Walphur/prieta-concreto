import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { HomeCta } from "@/components/home/HomeCta";

/** Home en 4 actos: portada → piezas → pigmento → encargo. Sin repetición fotográfica. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <PigmentStrip />
      <HomeCta />
    </>
  );
}
