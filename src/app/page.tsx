import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeReviews } from "@/components/home/HomeReviews";
import { HomeVideos } from "@/components/home/HomeVideos";
import { ComingSoon } from "@/components/home/ComingSoon";
import { HomeCta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PigmentStrip />
      <FeaturedProducts />
      <HowItWorks />
      <HomeReviews />
      <HomeVideos />
      <ComingSoon />
      <HomeCta />
    </>
  );
}
