import { ProductCard } from "@/components/product/ProductCard";
import { MadeToOrderNotice } from "@/components/order/MadeToOrderNotice";
import { SolidifyReveal } from "@/components/effects/SolidifyReveal";
import { readProducts } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Colección
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {available.length > 0 ? "Piezas y colores" : "Modelos y colores"}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/65">
            Referencias para encargar tu bacha: modelo, color y textura real.
            Precio fijo{" "}
            <span className="font-semibold text-deep-red">$80.000</span>. Medidas
            de moldes en Tienda.
          </p>
        </div>
        <Button href="/tienda" variant="outline" className="self-start sm:self-auto">
          Ver tienda
        </Button>
      </div>

      <SolidifyReveal className="mt-8" cureMs={480}>
        <MadeToOrderNotice />
      </SolidifyReveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, i) => (
          <SolidifyReveal key={product.id} cureMs={500 + i * 70}>
            <ProductCard product={product} priority={i < 2} />
          </SolidifyReveal>
        ))}
      </div>
    </section>
  );
}
