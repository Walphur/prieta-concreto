import { ProductCard } from "@/components/product/ProductCard";
import { SolidifyReveal } from "@/components/effects/SolidifyReveal";
import { readProducts } from "@/lib/catalog";
import Link from "next/link";

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
  const featured = [...available, ...examples].slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="editorial-kicker">Colección</p>
            <h2 className="editorial-title mt-4 text-2xl sm:text-3xl">
              Piezas
            </h2>
          </div>
          <Link
            href="/tienda"
            className="text-xs font-medium uppercase tracking-[0.16em] text-navy/50 underline decoration-navy/20 underline-offset-8 transition duration-700 hover:text-navy hover:decoration-navy/50"
          >
            Ver tienda
          </Link>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <SolidifyReveal key={product.id} cureMs={450 + i * 70}>
              <ProductCard product={product} priority={i < 2} />
            </SolidifyReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
