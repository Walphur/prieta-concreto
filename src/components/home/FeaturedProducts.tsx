import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import { Button } from "@/components/ui/Button";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Colección
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Productos destacados
          </h2>
          <p className="mt-3 text-base text-navy/65">
            Bachas de concreto con pigmentación integrada y sellado profesional.
          </p>
        </div>
        <Button href="/tienda" variant="outline" className="self-start sm:self-auto">
          Ver toda la tienda
        </Button>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={i < 2}
            className="animate-fade-up"
          />
        ))}
      </div>
    </section>
  );
}
