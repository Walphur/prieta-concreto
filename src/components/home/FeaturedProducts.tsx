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

/** Studio shots for explorer — skip ficha, grupo, cliente, and tall portraits. */
function isExplorerHeroSrc(src: string) {
  return (
    Boolean(src) &&
    !src.includes("/fichas/") &&
    !src.includes("grupo") &&
    !src.includes("cliente") &&
    !src.includes("marmolado-humo")
  );
}

/** Prefer landscape/square studio frames so the full bacha shows in a square hero. */
function preferStudioFrame(srcs: string[]) {
  const rank = (src: string) => {
    if (src.includes("marmolado.jpg") || src.includes("gris-oscuro-perfil"))
      return 0;
    if (src.includes("negro.jpg") || src.includes("carbon.jpg")) return 1;
    return 2;
  };
  return [...srcs].sort((a, b) => rank(a) - rank(b));
}

function studioImages(product: Product | undefined, shapeId: BachaShapeId) {
  const fromProduct = (product?.images ?? []).filter(isExplorerHeroSrc);
  if (fromProduct.length > 0) return preferStudioFrame(fromProduct);

  return preferStudioFrame(
    imagesByShape(shapeId)
      .filter((i) => i.kind !== "grupo" && isExplorerHeroSrc(i.src))
      .map((i) => i.src),
  );
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
          <div className="max-w-xl">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="editorial-title text-2xl sm:text-3xl">Colección</h2>
              <Link
                href="/tienda"
                className="interactive inline-flex min-h-10 shrink-0 items-center text-[11px] font-medium uppercase tracking-[0.16em] text-navy/35 underline decoration-navy/10 underline-offset-8 hover:text-navy/70 hover:decoration-navy/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                Todas
              </Link>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/50">
              Cuatro moldes. Elegí el modelo y mirá la pieza.
            </p>
          </div>
        </SolidifyReveal>

        <SolidifyReveal cureMs={520}>
          <ModelExplorer models={models} />
        </SolidifyReveal>
      </div>
    </section>
  );
}
