"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bankTransfer, whatsappOrderUrl } from "@/lib/bank";
import { ORDER_STORAGE_KEY, type PendingOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";

type Props = { refId: string };

export function OrderConfirmation({ refId }: Props) {
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (!raw) {
        setReady(true);
        return;
      }
      const parsed = JSON.parse(raw) as PendingOrder;
      if (parsed.ref === refId) setOrder(parsed);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [refId]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-navy/50 sm:px-6">
        Cargando pedido…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-semibold text-navy">
          Pedido no encontrado
        </h1>
        <p className="mt-3 text-navy/60">
          Escribinos por WhatsApp con tu referencia{" "}
          <span className="font-medium text-navy">{refId}</span>.
        </p>
        <a
          href={whatsappOrderUrl(refId, "consultar")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
        >
          Abrir WhatsApp
        </a>
      </div>
    );
  }

  const totalLabel = formatPrice(order.total ?? order.subtotal);
  const wa = whatsappOrderUrl(order.ref, totalLabel);
  const hasDiscount =
    typeof order.discountAmount === "number" && order.discountAmount > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Pedido listo
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy">
        Transferí y avisanos
      </h1>
      <p className="mt-3 text-navy/65">
        Ref. <span className="font-semibold text-navy">{order.ref}</span>.
      </p>

      <div className="mt-8 border border-concrete bg-cream-dark/40 p-6">
        <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
          Datos bancarios
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Titular" value={bankTransfer.holder} />
          <Row label="Banco" value={bankTransfer.bank} />
          <Row label="Alias" value={bankTransfer.alias} mono />
          <Row label={bankTransfer.accountLabel} value={bankTransfer.cbu} mono />
          <Row label="Monto" value={totalLabel} accent />
        </dl>
      </div>

      <div className="mt-6 border border-concrete p-6">
        <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
          Resumen
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-navy/75">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4">
              <span>{item.name}</span>
              <span className="font-medium text-deep-red">
                {formatPrice(item.price ?? 0)}
              </span>
            </li>
          ))}
        </ul>
        {hasDiscount ? (
          <div className="mt-4 space-y-1 border-t border-concrete pt-3 text-sm">
            <div className="flex justify-between text-navy/55">
              <span>Subtotal</span>
              <span className="line-through">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sage-dark">
              <span>Descuento {order.discountPercent ?? 15}%</span>
              <span>−{formatPrice(order.discountAmount ?? 0)}</span>
            </div>
            <div className="flex justify-between font-medium text-navy">
              <span>Total</span>
              <span className="text-deep-red">{totalLabel}</span>
            </div>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-navy/60">
          Entrega: {order.customer.address}, {order.customer.city}
          <br />
          Contacto: {order.customer.name} · {order.customer.phone}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={wa} variant="primary" className="sm:flex-1">
          Avisar por WhatsApp
        </Button>
        <Button href="/tienda" variant="outline" className="sm:flex-1">
          Volver a la colección
        </Button>
      </div>
      <p className="mt-6 text-center text-xs text-navy/45">
        <Link href="/" className="hover:text-sage-dark">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-navy/50">{label}</dt>
      <dd
        className={
          accent
            ? "font-semibold text-deep-red"
            : mono
              ? "font-mono text-navy"
              : "font-medium text-navy"
        }
      >
        {value}
      </dd>
    </div>
  );
}
