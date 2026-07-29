import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { HomeCta } from "@/components/home/HomeCta";

/** Home en 4 actos: portada → pigmento → piezas → encargo. Sin repetición fotográfica. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PigmentStrip />
      <FeaturedProducts />
      <HomeCta />
    </>
  );
}
