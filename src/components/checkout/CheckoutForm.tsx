"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { useMember } from "@/components/member/MemberProvider";
import { calcFirstPurchaseDiscount } from "@/lib/member-discount";
import { formatPrice } from "@/lib/products";
import {
  ORDER_STORAGE_KEY,
  createOrderRef,
  type CheckoutCustomer,
  type PendingOrder,
} from "@/lib/orders";

const inputClass =
  "mt-1 w-full border border-concrete bg-white px-3 py-2.5 text-sm text-navy outline-none focus:ring-2 focus:ring-sage";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const clear = useCartStore((s) => s.clear);
  const { member, eligibleForDiscount, markDiscountUsed } = useMember();
  const [mounted, setMounted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<CheckoutCustomer>({
    name: "",
    email: "",
    phone: "",
    city: "San Luis",
    address: "",
    notes: "",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!member) return;
    setForm((prev) => ({
      ...prev,
      email: prev.email || member.email,
      name: prev.name || member.name || "",
    }));
  }, [member]);

  function update<K extends keyof CheckoutCustomer>(
    key: K,
    value: CheckoutCustomer[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSending(true);

    const raw = subtotal();
    const discount = eligibleForDiscount
      ? calcFirstPurchaseDiscount(raw)
      : null;

    const order: PendingOrder = {
      ref: createOrderRef(),
      createdAt: new Date().toISOString(),
      customer: form,
      items: items.map((i) => ({ ...i })),
      subtotal: raw,
      ...(discount
        ? {
            discountPercent: discount.discountPercent,
            discountAmount: discount.discountAmount,
            total: discount.total,
            memberEmail: member?.email,
          }
        : { total: raw }),
    };

    sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));

    if (discount) {
      await markDiscountUsed();
    }

    clear();
    router.push(`/pedido/${order.ref}`);
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-navy/50 sm:px-6">
        Cargando carrito…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-semibold text-navy">
          Tu carrito está vacío
        </h1>
        <p className="mt-3 text-navy/60">
          Agregá una pieza disponible antes de finalizar.
        </p>
        <Link
          href="/tienda"
          className="mt-8 inline-block text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const raw = subtotal();
  const discount = eligibleForDiscount
    ? calcFirstPurchaseDiscount(raw)
    : null;
  const payable = discount?.total ?? raw;

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Checkout
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy">
          Pedido por transferencia
        </h1>
        <p className="mt-3 text-navy/65">
          Sin pasarelas. Completá tus datos, transferí y avisanos por WhatsApp.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-navy">
              Nombre y apellido
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-navy">
                WhatsApp / teléfono
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="2665…"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="text-sm font-medium text-navy">
                Ciudad
              </label>
              <input
                id="city"
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="text-sm font-medium text-navy"
              >
                Dirección de entrega
              </label>
              <input
                id="address"
                required
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-navy/50">
                Envíos a toda la Argentina por Andesmar Cargas.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="text-sm font-medium text-navy">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={inputClass}
            />
          </div>
          <Button type="submit" variant="primary" disabled={sending}>
            {sending ? "Generando pedido…" : "Confirmar pedido"}
          </Button>
        </form>
      </div>

      <aside className="h-fit border border-concrete bg-cream-dark/50 p-6">
        <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
          Resumen
        </h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-concrete-light">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name || ""}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy">
                  {item.name}
                </p>
                <p className="text-sm font-medium text-deep-red">
                  {formatPrice(item.price ?? 0)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-concrete pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-navy/65">Subtotal</span>
            <span
              className={
                discount
                  ? "text-sm text-navy/45 line-through"
                  : "font-[family-name:var(--font-outfit)] text-xl font-semibold text-deep-red"
              }
            >
              {formatPrice(raw)}
            </span>
          </div>
          {discount ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-dark">
                  Descuento primera compra ({discount.discountPercent}%)
                </span>
                <span className="font-medium text-sage-dark">
                  −{formatPrice(discount.discountAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-navy">
                  Total a transferir
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-deep-red">
                  {formatPrice(payable)}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
