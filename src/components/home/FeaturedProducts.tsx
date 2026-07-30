import { ProductCard } from "@/components/product/ProductCard";
import { SolidifyReveal } from "@/components/effects/SolidifyReveal";
import { readProducts } from "@/lib/catalog";
import { BACHA_SHAPES } from "@/lib/bacha-options";
import Link from "next/link";
import type { Product } from "@/types/product";

const SHAPE_ORDER = BACHA_SHAPES.map((s) => s.id);

function sortBachas(products: Product[]) {
  return [...products].sort((a, b) => {
    const ia = SHAPE_ORDER.indexOf(a.shape as (typeof SHAPE_ORDER)[number]);
    const ib = SHAPE_ORDER.indexOf(b.shape as (typeof SHAPE_ORDER)[number]);
    const sa = ia === -1 ? 99 : ia;
    const sb = ib === -1 ? 99 : ib;
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name, "es");
  });
}

export async function FeaturedProducts() {
  const all = await readProducts();
  const featured = sortBachas(
    all.filter(
      (p) =>
        p.featured &&
        p.category === "bachas" &&
        !p.comingSoon &&
        (p.status === "available" || p.status === "example"),
    ),
  ).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <SolidifyReveal cureMs={380}>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-sm">
              <h2 className="editorial-title text-2xl sm:text-3xl">Colección</h2>
            </div>
            <Link
              href="/tienda"
              className="interactive text-xs font-medium uppercase tracking-[0.16em] text-navy/45 underline decoration-navy/15 underline-offset-8 hover:text-navy hover:decoration-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Todas
            </Link>
          </div>
        </SolidifyReveal>

        <div className="mt-16 grid gap-x-12 gap-y-16 sm:grid-cols-2">
          {featured.map((product, i) => (
            <SolidifyReveal key={product.id} cureMs={500 + i * 90}>
              <ProductCard product={product} priority={i < 2} rotateImages />
            </SolidifyReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
