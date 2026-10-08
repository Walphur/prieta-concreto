"use client";

import Link from "next/link";
import { useMember } from "@/components/member/MemberProvider";
import { memberDiscountPercent } from "@/lib/member-discount";
import { clsx } from "clsx";

type Props = {
  className?: string;
  /** Compact strip under page chrome */
  variant?: "store" | "home";
};

export function MemberDiscountBanner({
  className,
  variant = "store",
}: Props) {
  const { eligibleForDiscount, loading, member } = useMember();
  const percent = memberDiscountPercent();

  if (loading || !eligibleForDiscount) return null;

  return (
    <div
      role="status"
      className={clsx(
        "border-b border-sage/25 bg-sage/10 text-navy",
        className,
      )}
    >
      <div
        className={clsx(
          "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8",
          variant === "home" && "py-2.5",
        )}
      >
        <p className="text-sm leading-snug sm:text-[0.95rem]">
          <span className="font-semibold text-sage-dark">
            {percent}% en la 2.ª bacha
          </span>
          {" · "}
          La primera paga el total. La segunda unidad lleva el descuento en el
          carrito
          {member?.email ? (
            <span className="hidden text-navy/45 sm:inline">
              {" "}
              ({member.email})
            </span>
          ) : null}
        </p>
        {variant === "home" ? (
          <Link
            href="/tienda"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-dark no-underline hover:text-navy hover:no-underline"
          >
            Ver colección
          </Link>
        ) : (
          <span className="text-[11px] uppercase tracking-[0.12em] text-navy/45">
            1.ª a precio de lista · 2.ª −{percent}%
          </span>
        )}
      </div>
    </div>
  );
}
