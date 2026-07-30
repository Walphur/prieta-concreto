"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice, isInStock, statusLabel } from "@/lib/products";
import { colorLabel, moldLabel, shapeLabel } from "@/lib/bacha-options";
import { clsx } from "clsx";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
  /** Cycle through product.images every 5s (home Colección). Off by default for tienda. */
  rotateImages?: boolean;
};

function ProductCardImage({
  images,
  alt,
  priority,
  rotate,
}: {
  images: string[];
  alt: string;
  priority?: boolean;
  rotate?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const canRotate = Boolean(rotate && images.length > 1 && !reduceMotion);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!canRotate || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [canRotate, paused, images.length]);

  if (!canRotate) {
    return (
      <Image
        src={images[0]}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.02]"
      />
    );
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={priority && i === 0}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={clsx(
            "object-cover transition-[opacity,transform] duration-[1200ms] ease-editorial group-hover:scale-[1.02]",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}

export function ProductCard({
  product,
  className,
  priority,
  rotateImages = false,
}: ProductCardProps) {
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
          <ProductCardImage
            images={product.images}
            alt={modelName}
            priority={priority}
            rotate={rotateImages}
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
