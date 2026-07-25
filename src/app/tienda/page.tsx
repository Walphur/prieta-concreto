import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductsByCategory, products } from "@/lib/products";
import { clsx } from "clsx";
import type { ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Bachas y piezas de concreto Prieta. Stock en tiempo real.",
};

type SearchParams = Promise<{ categoria?: string }>;

const filters: { label: string; value: "all" | ProductCategory }[] = [
  { label: "Todas", value: "all" },
  { label: "Bachas", value: "bachas" },
  { label: "Celosías", value: "celosias" },
  { label: "Mesadas", value: "mesadas" },
];

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categoria = (params.categoria as ProductCategory | "all") || "all";
  const list =
    categoria === "celosias" || categoria === "mesadas"
      ? products.filter((p) => p.category === categoria)
      : getProductsByCategory(categoria === "all" ? "all" : categoria);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Tienda
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          Colección Prieta
        </h1>
        <p className="mt-3 text-navy/65">
          Filtrá por categoría. Precios y stock actualizados en tiempo real.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = categoria === f.value;
          const href =
            f.value === "all" ? "/tienda" : `/tienda?categoria=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={clsx(
                "px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sage text-white"
                  : "bg-concrete-light text-navy/75 hover:bg-concrete hover:text-navy",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-navy/55">
          No hay productos en esta categoría todavía.
        </p>
      ) : null}
    </div>
  );
}
