import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { readProducts } from "@/lib/catalog";
import { clsx } from "clsx";
import type { ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Bachas de concreto Prieta a $80.000. Ejemplos de color y piezas únicas en stock. San Luis.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ categoria?: string; vista?: string }>;

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
  const vista = params.vista || "todas";
  const all = await readProducts();

  let list = all.filter((p) => {
    if (categoria !== "all" && p.category !== categoria) return false;
    if (vista === "stock") return p.status === "available" && !p.comingSoon;
    if (vista === "ejemplos") return p.status === "example" && !p.comingSoon;
    if (vista === "vendidas") return p.status === "sold";
    // default: hide sold unless filtering vendidas; show available + examples + coming soon
    return p.status !== "sold";
  });

  if (categoria === "celosias" || categoria === "mesadas") {
    list = all.filter((p) => p.category === categoria);
  }

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
          Toda bacha:{" "}
          <span className="font-semibold text-deep-red">$80.000</span> · Los
          ejemplos muestran colores; en stock hay piezas únicas artesanales.
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

      {categoria === "bachas" || categoria === "all" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "Todo", value: "todas" },
            { label: "En stock", value: "stock" },
            { label: "Ejemplos de color", value: "ejemplos" },
            { label: "Vendidas", value: "vendidas" },
          ].map((f) => {
            const active = vista === f.value;
            const base = categoria === "bachas" ? "/tienda?categoria=bachas" : "/tienda";
            const href =
              f.value === "todas"
                ? base
                : `${base}${base.includes("?") ? "&" : "?"}vista=${f.value}`;
            return (
              <Link
                key={f.value}
                href={href}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                  active
                    ? "bg-navy text-cream"
                    : "text-navy/55 hover:text-navy",
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-navy/55">
          No hay productos en esta vista. Cargá piezas nuevas desde el admin.
        </p>
      ) : null}
    </div>
  );
}
