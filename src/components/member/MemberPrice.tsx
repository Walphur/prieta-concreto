"use client";

import { useMember } from "@/components/member/MemberProvider";
import {
  memberDiscountedPrice,
  memberDiscountPercent,
} from "@/lib/member-discount";
import { formatPrice } from "@/lib/products";
import { clsx } from "clsx";

type Props = {
  price: number;
  className?: string;
  /** Larger PDP style */
  size?: "sm" | "md" | "lg";
};

export function MemberPrice({ price, className, size = "sm" }: Props) {
  const { eligibleForDiscount, loading } = useMember();
  const showDiscount = !loading && eligibleForDiscount && price > 0;
  const discounted = memberDiscountedPrice(price);
  const percent = memberDiscountPercent();

  if (!showDiscount) {
    return (
      <p
        className={clsx(
          size === "lg" && "text-xl font-medium text-navy/80",
          size === "md" && "text-base font-medium text-navy/70",
          size === "sm" && "text-sm font-medium text-navy/70",
          className,
        )}
      >
        {formatPrice(price)}
      </p>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        className,
      )}
    >
      <span
        className={clsx(
          "text-navy/40 line-through",
          size === "lg" ? "text-base" : "text-xs sm:text-sm",
        )}
      >
        {formatPrice(price)}
      </span>
      <span
        className={clsx(
          "font-semibold text-sage-dark",
          size === "lg" && "text-xl",
          size === "md" && "text-base",
          size === "sm" && "text-sm",
        )}
      >
        {formatPrice(discounted)}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-sage-dark/80 sm:text-[11px]">
        −{percent}%
      </span>
    </div>
  );
}
