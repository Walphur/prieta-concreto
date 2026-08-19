import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { HomeCta } from "@/components/home/HomeCta";
import { MemberDiscountBanner } from "@/components/member/MemberDiscountBanner";

/** Home en 4 actos: portada → piezas → pigmento → encargo. Sin repetición fotográfica. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <MemberDiscountBanner variant="home" />
      <FeaturedProducts />
      <PigmentStrip />
      <HomeCta />
    </>
  );
}
