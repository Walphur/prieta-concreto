import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  formatPrice,
  getProductBySlug,
  isInStock,
  products,
} from "@/lib/products";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ReviewSection } from "@/components/product/ReviewSection";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const inStock = isInStock(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          {product.images.map((src, i) => (
            <div
              key={src}
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
            ) : inStock ? (
              <span className="text-sage-dark">
                En stock · {product.stock} disponible
                {product.stock === 1 ? "" : "s"}
              </span>
            ) : (
              <span className="text-deep-red">Agotado</span>
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
                {product.specs.dimensions}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-navy/45">
                Peso
              </dt>
              <dd className="mt-1 text-sm font-medium text-navy">
                {product.specs.weight}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-navy/45">
                Material
              </dt>
              <dd className="mt-1 text-sm font-medium text-navy">
                {product.specs.material}
              </dd>
            </div>
            {product.specs.finish ? (
              <div>
                <dt className="text-xs uppercase tracking-wider text-navy/45">
                  Acabado
                </dt>
                <dd className="mt-1 text-sm font-medium text-navy">
                  {product.specs.finish}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              disabled={!inStock || !!product.comingSoon}
            />
          </div>
        </div>
      </div>

      <ReviewSection productName={product.name} />
    </div>
  );
}
