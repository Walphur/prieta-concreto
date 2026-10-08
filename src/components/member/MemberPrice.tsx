"use client";

import { useMember } from "@/components/member/MemberProvider";
import { memberDiscountPercent } from "@/lib/member-discount";
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
  const showNote = !loading && eligibleForDiscount && price > 0;
  const percent = memberDiscountPercent();

  return (
    <div className={clsx(showNote && "space-y-0.5", className)}>
      <p
        className={clsx(
          size === "lg" && "text-xl font-medium text-navy/80",
          size === "md" && "text-base font-medium text-navy/70",
          size === "sm" && "text-sm font-medium text-navy/70",
        )}
      >
        {formatPrice(price)}
      </p>
      {showNote ? (
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-sage-dark/80 sm:text-[11px]">
          2.ª unidad −{percent}%
        </p>
      ) : null}
    </div>
  );
}
