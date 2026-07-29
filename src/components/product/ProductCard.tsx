import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, isInStock, statusLabel } from "@/lib/products";
import { colorLabel, moldLabel, shapeLabel } from "@/lib/bacha-options";
import { clsx } from "clsx";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const inStock = isInStock(product);
  const meta = product.comingSoon
    ? "Próximamente"
    : product.status === "example"
      ? "Por pedido"
      : statusLabel(product.status);

  const isBacha = product.category === "bachas";
  const modelName =
    isBacha && product.shape ? shapeLabel(product.shape) : product.name;
  const toneLine = isBacha
    ? product.color
      ? colorLabel(product.color)
      : "Elegí el tono al encargar"
    : null;

  return (
    <article className={clsx("group", className)}>
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="img-reveal relative aspect-[4/5] overflow-hidden bg-concrete-light">
          <Image
            src={product.images[0]}
            alt={modelName}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-5 space-y-1">
          <h3 className="font-[family-name:var(--font-outfit)] text-[0.95rem] font-medium tracking-tight text-navy transition-colors duration-700 group-hover:text-sage-dark">
            {isBacha ? modelName : product.name}
          </h3>
          {isBacha ? (
            <p className="text-[11px] uppercase tracking-[0.14em] text-navy/40">
              {[moldLabel(product.shape), toneLine].filter(Boolean).join(" · ")}
            </p>
          ) : (
            <p className="text-[11px] uppercase tracking-[0.14em] text-navy/40">
              {meta}
            </p>
          )}
          {!product.comingSoon && product.price > 0 ? (
            <p className="pt-1.5 text-sm font-medium text-navy/70">
              {formatPrice(product.price)}
            </p>
          ) : null}
          {isBacha && !inStock && !product.comingSoon ? (
            <p className="text-[11px] text-navy/35">{meta}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
