import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { HomeObras } from "@/components/home/HomeObras";
import { HomeVideos } from "@/components/home/HomeVideos";
import { HomeCta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PigmentStrip />
      <FeaturedProducts />
      <HomeObras />
      <HomeVideos />
      <HomeCta />
    </>
  );
}
