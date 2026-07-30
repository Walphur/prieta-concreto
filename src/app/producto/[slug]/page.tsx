import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  formatPrice,
  getProductBySlug,
  isPurchasable,
  readProducts,
  statusLabel,
} from "@/lib/catalog";
import {
  BACHA_COLORS,
  BACHA_DIMENSIONS,
  colorLabel,
  moldLabel,
  shapeLabel,
  type BachaColorId,
  type BachaShapeId,
} from "@/lib/bacha-options";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { MadeToOrderCta } from "@/components/order/MadeToOrderCta";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { madeToOrder, madeToOrderSummary } from "@/lib/order-policy";
import { getApprovedReviews } from "@/lib/reviews-store";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const FICHA_BY_SHAPE: Partial<
  Record<BachaShapeId, { product: string; diagram?: string }>
> = {
  cuadrado: {
    product: "/gallery/fichas/cuadrado-producto.jpg",
    diagram: "/gallery/fichas/cuadrado-diagrama.png",
  },
  oval: {
    product: "/gallery/fichas/oval-producto.jpg",
    diagram: "/gallery/fichas/oval-diagrama.png",
  },
  circular: {
    product: "/gallery/fichas/circular-producto.jpg",
    diagram: "/gallery/fichas/circular-diagrama.png",
  },
  "circular-tapon": {
    product: "/gallery/fichas/circular-tapon-producto.png",
    diagram: "/gallery/fichas/circular-tapon-diagrama.png",
  },
};

export async function generateStaticParams() {
  const products = await readProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto" };

  const title = `${product.name} — bacha Prieta`;
  const description =
    product.status === "example"
      ? `${product.description} ${madeToOrderSummary()}`
      : product.description;
  const image = product.images[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://prietaconcreto.shop/producto/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const canBuy = isPurchasable(product);
  const isExampleBacha =
    product.status === "example" &&
    product.category === "bachas" &&
    !product.comingSoon;
  const shapeId =
    product.shape && product.shape in BACHA_DIMENSIONS
      ? (product.shape as BachaShapeId)
      : null;
  const shapeDims = shapeId ? BACHA_DIMENSIONS[shapeId] : null;
  const ficha = shapeId ? FICHA_BY_SHAPE[shapeId] : null;
  const shapeName = product.shape ? shapeLabel(product.shape) : undefined;
  const colorName = product.color ? colorLabel(product.color) : undefined;

  const approved = await getApprovedReviews();
  const initialReviews = approved.filter(
    (r) => !r.productSlug || r.productSlug === product.slug,
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: "Prieta Concreto" },
    offers: {
      "@type": "Offer",
      url: `https://prietaconcreto.shop/producto/${product.slug}`,
      priceCurrency: "ARS",
      price: product.price,
      availability: canBuy
        ? "https://schema.org/InStock"
        : isExampleBacha
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Prieta Concreto" },
    },
  };

  // Studio photos only — ficha/diagrama assets are shown once below (never duplicated).
  const fichaAssets = new Set(
    [ficha?.product, ficha?.diagram].filter(Boolean) as string[],
  );
  const galleryImages = [...new Set(product.images.filter(Boolean))].filter(
    (src) => !fichaAssets.has(src) && !src.includes("/fichas/"),
  );
  const hero = galleryImages[0];
  const rest = galleryImages.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-4 lg:col-span-7">
          {hero ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light lg:aspect-[3/4]">
              <Image
                src={hero}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {rest.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative aspect-square overflow-hidden bg-concrete-light"
                >
                  <Image
                    src={src}
                    alt={`${product.name} — detalle ${i + 2}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 28vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}

          {ficha?.diagram ? (
            <div className="bg-[#1c1c1c] p-4 sm:p-6">
              <Image
                src={ficha.diagram}
                alt={`Diagrama de medidas — ${shapeName || product.name}`}
                width={1200}
                height={1400}
                className="h-auto w-full object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <p className="editorial-kicker">
            {isExampleBacha || product.category === "bachas"
              ? ["Modelo", moldLabel(product.shape)].filter(Boolean).join(" · ")
              : product.category}
          </p>
          <h1 className="editorial-title mt-4 text-3xl sm:text-4xl">
            {shapeName && product.category === "bachas"
              ? shapeName
              : product.name}
          </h1>

          {!product.comingSoon && product.price > 0 ? (
            <p className="mt-6 text-xl font-medium text-navy/80">
              {formatPrice(product.price)}
            </p>
          ) : null}

          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-navy/40">
            {product.comingSoon
              ? "Próximamente"
              : product.status === "example"
                ? "Por pedido"
                : statusLabel(product.status)}
          </p>

          <p className="mt-8 max-w-md leading-[1.75] text-navy/60">
            {product.longDescription}
          </p>

          <div className="mt-10">
            {isExampleBacha ||
            (product.category === "bachas" &&
              product.status === "sold" &&
              !product.comingSoon) ? (
              <div className="space-y-4">
                <MadeToOrderCta
                  name={shapeName || product.name}
                  initialColorId={product.color as BachaColorId | undefined}
                  shapeLabel={shapeName}
                />
                {product.status === "sold" ? (
                  <p className="text-xs leading-relaxed text-navy/45">
                    Ya salió. El mismo modelo se hace por pedido (~
                    {madeToOrder.leadDays} días); elegí el tono arriba.
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                {product.category === "bachas" && !product.comingSoon ? (
                  <div className="mb-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/40">
                      Tonos
                    </p>
                    <p className="mt-2 text-sm text-navy/50">
                      {colorName
                        ? `Esta pieza: ${colorName}. Otros pigmentos al encargar.`
                        : "El pigmento se elige al encargar."}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-3">
                      {BACHA_COLORS.map((c) => (
                        <li key={c.id} className="flex items-center gap-2">
                          <span
                            className="h-5 w-5 border border-navy/10"
                            style={{ backgroundColor: c.hex }}
                            aria-hidden
                          />
                          <span className="text-xs text-navy/55">{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  disabled={!canBuy}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-24 max-w-2xl space-y-0 border-t border-navy/10 pt-10">
        {[
          {
            t: "Material",
            d: `${product.specs.material}. El color vive en la masa, no encima.${
              product.specs.finish ? ` ${product.specs.finish}.` : ""
            }`,
          },
          {
            t: "Proceso",
            d: `Vaciado a mano. ~${madeToOrder.leadDays} días de ${madeToOrder.reason}. Luego, sellado mineral.`,
          },
          {
            t: "Medidas",
            d: [
              shapeDims?.dimensions || product.specs.dimensions,
              shapeDims?.detail,
              shapeDims?.wall ? shapeDims.wall : null,
              shapeDims?.drain ? shapeDims.drain : null,
              product.specs.weight,
            ]
              .filter(Boolean)
              .join(". "),
          },
          {
            t: "Cuidado",
            d: "Paño suave, jabón neutro. Sin ácidos ni abrasivos.",
          },
          {
            t: "Envío",
            d: "Desde San Luis, Andesmar Cargas a todo el país. Embalaje reforzado.",
          },
        ].map((block) => (
          <details
            key={block.t}
            className="group border-b border-navy/10 py-5"
          >
            <summary className="cursor-pointer list-none font-[family-name:var(--font-outfit)] text-sm font-medium tracking-wide text-navy marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {block.t}
                <span className="text-navy/30 transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-navy/55">
              {block.d}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-24">
        <ReviewSection
          productName={product.name}
          productSlug={product.slug}
          initialReviews={initialReviews}
        />
      </div>
    </div>
  );
}
