import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { MadeToOrderNotice } from "@/components/order/MadeToOrderNotice";
import { PigmentStrip } from "@/components/home/PigmentStrip";
import { MedidasMoldes } from "@/components/tienda/MedidasMoldes";
import { readProducts } from "@/lib/catalog";
import { BACHA_SHAPES } from "@/lib/bacha-options";
import { clsx } from "clsx";
import type { Product, ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Bachas Prieta a $95.000. Por pedido si no hay stock. Mayoristas para corralones y ferreterías. San Luis, envíos Andesmar.",
  alternates: { canonical: "/tienda" },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ categoria?: string; vista?: string }>;

const filters: { label: string; value: "all" | ProductCategory }[] = [
  { label: "Todas", value: "all" },
  { label: "Bachas", value: "bachas" },
  { label: "Celosías", value: "celosias" },
  { label: "Mesadas", value: "mesadas" },
];

const SHAPE_ORDER = BACHA_SHAPES.map((s) => s.id);

function sortCatalog(products: Product[]) {
  const categoryOrder: Record<string, number> = {
    bachas: 0,
    celosias: 1,
    mesadas: 2,
  };
  return [...products].sort((a, b) => {
    const ca = categoryOrder[a.category] ?? 9;
    const cb = categoryOrder[b.category] ?? 9;
    if (ca !== cb) return ca - cb;
    if (a.category === "bachas" && b.category === "bachas") {
      const ia = SHAPE_ORDER.indexOf(a.shape as (typeof SHAPE_ORDER)[number]);
      const ib = SHAPE_ORDER.indexOf(b.shape as (typeof SHAPE_ORDER)[number]);
      const sa = ia === -1 ? 99 : ia;
      const sb = ib === -1 ? 99 : ib;
      if (sa !== sb) return sa - sb;
    }
    return a.name.localeCompare(b.name, "es");
  });
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categoria = (params.categoria as ProductCategory | "all") || "all";
  const vista = params.vista || "todas";
  const all = await readProducts();
  const showMedidas =
    vista === "medidas" && (categoria === "bachas" || categoria === "all");

  let list = all.filter((p) => {
    if (categoria !== "all" && p.category !== categoria) return false;
    if (vista === "stock") return p.status === "available" && !p.comingSoon;
    if (vista === "ejemplos")
      return (
        p.status === "example" &&
        !p.comingSoon &&
        p.category === "bachas"
      );
    if (vista === "vendidas") return p.status === "sold";
    if (vista === "medidas") return false;
    // Todas: show everything except sold (includes por-pedido models + coming soon)
    return p.status !== "sold";
  });

  if (categoria === "celosias" || categoria === "mesadas") {
    list = all.filter((p) => p.category === categoria);
  }

  list = sortCatalog(list);

  return (
    <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
      <header className="max-w-lg pb-12">
        <h1 className="editorial-title text-3xl sm:text-4xl">
          Colección
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-navy/50">
          $95.000. Medidas en su pestaña.
        </p>
      </header>

      <nav className="mb-4 space-y-5" aria-label="Filtros de colección">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = categoria === f.value;
            const href =
              f.value === "all" ? "/tienda" : `/tienda?categoria=${f.value}`;
            return (
              <Link
                key={f.value}
                href={href}
                className={clsx(
                  "px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-500",
                  active
                    ? "bg-verde-agua text-white"
                    : "bg-cream-dark text-navy/55 hover:bg-concrete-light hover:text-navy",
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {categoria === "bachas" || categoria === "all" ? (
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {[
              { label: "Todo", value: "todas" },
              { label: "En stock", value: "stock" },
              { label: "Ejemplos", value: "ejemplos" },
              { label: "Medidas", value: "medidas" },
              { label: "Vendidas", value: "vendidas" },
            ].map((f) => {
              const active = vista === f.value;
              const base =
                categoria === "bachas" ? "/tienda?categoria=bachas" : "/tienda";
              const href =
                f.value === "todas"
                  ? base
                  : `${base}${base.includes("?") ? "&" : "?"}vista=${f.value}`;
              return (
                <Link
                  key={f.value}
                  href={href}
                  className={clsx(
                    "px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-500",
                    active
                      ? "text-verde-agua-panel underline decoration-verde-agua underline-offset-8"
                      : "text-navy/40 hover:text-navy/70",
                  )}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </nav>

      {showMedidas ? (
        <MedidasMoldes />
      ) : (
        <>
          <div
            className={clsx(
              "mt-16 grid gap-y-14",
              categoria === "bachas"
                ? "gap-x-12 sm:grid-cols-2"
                : "gap-x-8 sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {list.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 4}
              />
            ))}
          </div>

          {list.length === 0 ? (
            <p className="mt-20 text-center text-sm text-navy/45">
              Nada en esta vista.
            </p>
          ) : null}
        </>
      )}

      <PigmentStrip
        variant="inline"
        className="mt-20 mb-14 border-t border-navy/8 pt-14"
      />

      <MadeToOrderNotice className="mb-14 w-full" showTonePicker />
    </div>
  );
}
