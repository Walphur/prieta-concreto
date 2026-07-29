import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { MadeToOrderNotice } from "@/components/order/MadeToOrderNotice";
import { MedidasMoldes } from "@/components/tienda/MedidasMoldes";
import { readProducts } from "@/lib/catalog";
import { clsx } from "clsx";
import type { ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Bachas de concreto Prieta a $95.000. Si no hay stock, fabricamos por pedido. Precios mayoristas para corralones y ferreterías. San Luis.",
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
      return p.status === "example" && !p.comingSoon && Boolean(p.color);
    if (vista === "vendidas") return p.status === "sold";
    if (vista === "medidas") return false;
    // default: hide sold unless filtering vendidas; show available + examples + coming soon
    return p.status !== "sold";
  });

  if (categoria === "celosias" || categoria === "mesadas") {
    list = all.filter((p) => p.category === categoria);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl border-b-2 border-navy/15 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Tienda
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          Colección Prieta
        </h1>
        <p className="mt-3 text-navy/65">
          Toda bacha:{" "}
          <span className="font-semibold text-deep-red">$95.000</span>. Los
          ejemplos son referencia de color y modelo para encargar la tuya.
          Medidas de cada molde en la pestaña Medidas.
        </p>
      </header>

      <MadeToOrderNotice className="mt-8 w-full" />

      <div className="mt-10 border-y-2 border-navy/20 py-4">
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
                  "border-2 px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "border-sage bg-sage text-white"
                    : "border-navy/25 bg-cream text-navy hover:border-navy/50 hover:bg-concrete-light",
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {categoria === "bachas" || categoria === "all" ? (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-navy/15 pt-3">
            {[
              { label: "Todo", value: "todas" },
              { label: "En stock", value: "stock" },
              { label: "Ejemplos de color", value: "ejemplos" },
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
                    "border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                    active
                      ? "border-navy bg-navy text-cream"
                      : "border-navy/20 bg-cream text-navy/70 hover:border-navy/40 hover:text-navy",
                  )}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>

      {showMedidas ? (
        <MedidasMoldes />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
