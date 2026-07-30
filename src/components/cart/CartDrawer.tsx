"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useMember } from "@/components/member/MemberProvider";
import { calcFirstPurchaseDiscount } from "@/lib/member-discount";
import { formatPrice } from "@/lib/products";
import { clsx } from "clsx";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal);
  const { eligibleForDiscount } = useMember();

  const raw = subtotal();
  const discount = eligibleForDiscount
    ? calcFirstPurchaseDiscount(raw)
    : null;

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-[60] bg-navy/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className={clsx(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-concrete px-5 py-4">
          <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
            Carrito
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center text-navy/70 hover:text-navy"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-navy/60">Todavía vacío.</p>
              <Link
                href="/tienda"
                onClick={closeCart}
                className="text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
              >
                Ir a la colección
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-concrete-light">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || "Producto"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="truncate font-medium text-navy">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-deep-red">
                          {formatPrice(item.price ?? 0)}
                        </p>
                        <p className="mt-1 text-xs text-navy/45">Una unidad</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-navy/40 hover:text-deep-red"
                        aria-label={`Quitar ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-concrete px-5 py-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-navy/65">Subtotal</span>
              <span
                className={clsx(
                  "font-[family-name:var(--font-outfit)] text-lg font-semibold",
                  discount ? "text-navy/45 line-through" : "text-deep-red",
                )}
              >
                {formatPrice(raw)}
              </span>
            </div>
            {discount ? (
              <>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-sage-dark">
                    Primera compra (−{discount.discountPercent}%)
                  </span>
                  <span className="font-medium text-sage-dark">
                    −{formatPrice(discount.discountAmount)}
                  </span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-navy">Total</span>
                  <span className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-deep-red">
                    {formatPrice(discount.total)}
                  </span>
                </div>
              </>
            ) : null}
            <p className={clsx("mb-3 text-xs text-navy/50", !discount && "mt-2")}>
              Transferencia · Andesmar Cargas a todo el país
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="interactive flex w-full items-center justify-center bg-sage px-4 py-3 text-sm font-semibold tracking-wide text-white hover:bg-sage-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Continuar
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
