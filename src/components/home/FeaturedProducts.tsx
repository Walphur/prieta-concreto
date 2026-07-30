import { SolidifyReveal } from "@/components/effects/SolidifyReveal";
import {
  ModelExplorer,
  type ModelExplorerItem,
} from "@/components/home/ModelExplorer";
import { readProducts } from "@/lib/catalog";
import {
  BACHA_DIMENSIONS,
  BACHA_SHAPES,
  type BachaShapeId,
} from "@/lib/bacha-options";
import { imagesByShape } from "@/lib/gallery";
import Link from "next/link";
import type { Product } from "@/types/product";

/** Studio shots only — skip ficha/diagram and group shots. */
function studioImages(product: Product | undefined, shapeId: BachaShapeId) {
  const fromProduct = (product?.images ?? []).filter(
    (src) => src && !src.includes("/fichas/") && !src.includes("grupo"),
  );
  if (fromProduct.length > 0) return fromProduct;

  return imagesByShape(shapeId)
    .filter(
      (i) =>
        i.kind !== "grupo" &&
        !i.src.includes("/fichas/") &&
        !i.src.includes("grupo"),
    )
    .map((i) => i.src);
}

function pickProduct(all: Product[], shapeId: BachaShapeId, label: string) {
  const bachas = all.filter(
    (p) =>
      p.category === "bachas" &&
      p.shape === shapeId &&
      !p.comingSoon &&
      (p.status === "available" || p.status === "example"),
  );
  const labelKey = label.toLowerCase();
  return (
    bachas.find((p) => p.featured) ??
    bachas.find(
      (p) =>
        p.slug === labelKey || p.name.toLowerCase() === labelKey,
    ) ??
    bachas[0]
  );
}

export async function FeaturedProducts() {
  const all = await readProducts();

  const models: ModelExplorerItem[] = BACHA_SHAPES.map((shape) => {
    const product = pickProduct(all, shape.id, shape.label);
    const dim = BACHA_DIMENSIONS[shape.id];
    const images = studioImages(product, shape.id);

    return {
      id: shape.id,
      label: shape.label,
      mold: shape.mold,
      dimensions: dim.dimensions,
      copy: product?.description?.trim() || dim.detail,
      images,
      slug: product?.slug ?? shape.label.toLowerCase(),
    };
  }).filter((m) => m.images.length > 0);

  if (models.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <SolidifyReveal cureMs={380}>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-sm">
              <h2 className="editorial-title text-2xl sm:text-3xl">Colección</h2>
              <p className="mt-3 text-sm leading-relaxed text-navy/50">
                Cuatro moldes. Elegí el modelo y mirá la pieza.
              </p>
            </div>
            <Link
              href="/tienda"
              className="interactive inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.16em] text-navy/45 underline decoration-navy/15 underline-offset-8 hover:text-navy hover:decoration-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Todas
            </Link>
          </div>
        </SolidifyReveal>

        <SolidifyReveal cureMs={520}>
          <ModelExplorer models={models} />
        </SolidifyReveal>
      </div>
    </section>
  );
}
