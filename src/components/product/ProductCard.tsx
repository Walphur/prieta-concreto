import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, isInStock, statusLabel } from "@/lib/products";
import { clsx } from "clsx";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const inStock = isInStock(product);
  const label = product.comingSoon
    ? "Próximamente"
    : statusLabel(product.status);

  return (
    <article className={clsx("group", className)}>
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent opacity-60" />
          <span
            className={clsx(
              "absolute left-3 top-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
              inStock
                ? "bg-sage text-white"
                : product.status === "sold"
                  ? "bg-deep-red/90 text-cream"
                  : "bg-navy/85 text-cream",
            )}
          >
            {label}
          </span>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-[family-name:var(--font-outfit)] text-base font-semibold tracking-tight text-navy transition-colors group-hover:text-sage-dark">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-navy/60">
            {product.description}
          </p>
          {!product.comingSoon && product.price > 0 ? (
            <p className="pt-1 text-base font-semibold text-deep-red">
              {formatPrice(product.price)}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
