import { ProductCard } from "@/components/product/ProductCard";
import { MadeToOrderNotice } from "@/components/order/MadeToOrderNotice";
import { SolidifyReveal } from "@/components/effects/SolidifyReveal";
import { readProducts } from "@/lib/catalog";

export async function FeaturedProducts() {
  const all = await readProducts();
  const available = all.filter((p) => p.status === "available" && !p.comingSoon);
  const examples = all.filter(
    (p) =>
      p.status === "example" &&
      p.category === "bachas" &&
      !p.comingSoon &&
      p.featured &&
      Boolean(p.color),
  );
  const featured = [...available, ...examples].slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SolidifyReveal cureMs={480}>
        <MadeToOrderNotice />
      </SolidifyReveal>

      {featured.length > 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <SolidifyReveal key={product.id} cureMs={500 + i * 70}>
              <ProductCard product={product} priority={i < 2} />
            </SolidifyReveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}
