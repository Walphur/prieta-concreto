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
  BACHA_DIMENSIONS,
  colorLabel,
  shapeLabel,
  type BachaShapeId,
} from "@/lib/bacha-options";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { MadeToOrderCta } from "@/components/order/MadeToOrderCta";
import { ReviewSection } from "@/components/product/ReviewSection";
import { madeToOrderSummary } from "@/lib/order-policy";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await readProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto" };

  const title = `${product.name} — bacha de concreto`;
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
      images: image
        ? [{ url: image, alt: product.name }]
        : undefined,
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
  const shapeDims =
    product.shape && product.shape in BACHA_DIMENSIONS
      ? BACHA_DIMENSIONS[product.shape as BachaShapeId]
      : null;
  const shapeName = product.shape ? shapeLabel(product.shape) : undefined;
  const colorName = product.color ? colorLabel(product.color) : undefined;

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          {product.images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[4/5] overflow-hidden bg-concrete-light"
            >
              <Image
                src={src}
                alt={`${product.name} — foto ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            {product.category}
            {shapeName ? ` · ${shapeName}` : ""}
            {colorName ? ` · ${colorName}` : ""}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {product.name}
          </h1>
          {!product.comingSoon && product.price > 0 ? (
            <p className="mt-4 text-2xl font-semibold text-deep-red">
              {formatPrice(product.price)}
            </p>
          ) : null}

          <p className="mt-3 text-sm font-medium">
            {product.comingSoon ? (
              <span className="text-navy/55">Próximamente</span>
            ) : (
              <span
                className={
                  canBuy
                    ? "text-sage-dark"
                    : product.status === "sold"
                      ? "text-deep-red"
                      : "text-navy/55"
                }
              >
                {statusLabel(product.status)}
                {product.status === "example"
                  ? " · referencia de color/modelo"
                  : product.status === "available"
                    ? " · pieza única"
                    : ""}
              </span>
            )}
          </p>

          <p className="mt-6 leading-relaxed text-navy/70">
            {product.longDescription}
          </p>

          <dl className="mt-8 grid gap-4 border-y border-concrete py-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-navy/45">
                Dimensiones
              </dt>
              <dd className="mt-1 text-sm font-medium text-navy">
                {shapeDims?.dimensions || product.specs.dimensions}
              </dd>
              {shapeDims?.detail ? (
                <dd className="mt-1 text-xs text-navy/50">{shapeDims.detail}</dd>
              ) : null}
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-navy/45">
                Material
              </dt>
              <dd className="mt-1 text-sm font-medium text-navy">
                {product.specs.material}
              </dd>
            </div>
            {shapeDims?.wall ? (
              <div>
                <dt className="text-xs uppercase tracking-wider text-navy/45">
                  Pared
                </dt>
                <dd className="mt-1 text-sm font-medium text-navy">
                  {shapeDims.wall}
                </dd>
              </div>
            ) : null}
            {shapeDims?.drain || shapeDims?.note ? (
              <div>
                <dt className="text-xs uppercase tracking-wider text-navy/45">
                  Desagüe
                </dt>
                <dd className="mt-1 text-sm font-medium text-navy">
                  {shapeDims.drain || shapeDims.note}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8">
            {isExampleBacha ? (
              <MadeToOrderCta
                name={product.name}
                colorLabel={colorName}
                shapeLabel={shapeName}
              />
            ) : (
              <>
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  disabled={!canBuy}
                />
                {product.status === "sold" ? (
                  <p className="mt-3 text-xs text-navy/50">
                    Pieza vendida. Podés encargar el mismo modelo y color por
                    pedido (demora ~15 días).
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <ReviewSection productName={product.name} />
    </div>
  );
}
