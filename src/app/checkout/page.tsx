import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalizar compra con Mercado Pago y Mercado Envíos.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Checkout
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-navy">
        Mercado Pago
      </h1>
      <p className="mt-4 leading-relaxed text-navy/65">
        Próximo paso: crear preferencia de pago con la API de Mercado Pago,
        calcular envío con Mercado Envíos (San Luis / AR) y descontar stock al
        confirmar el pago (webhook).
      </p>
      <div className="texture-concrete mt-8 border border-concrete p-6">
        <ul className="space-y-2 text-sm text-navy/70">
          <li>· Preferencia Checkout Pro / Brick</li>
          <li>· Webhook de pago aprobado</li>
          <li>· Actualización de inventario en tiempo real</li>
          <li>· Etiqueta Mercado Envíos</li>
        </ul>
      </div>
      <Link
        href="/tienda"
        className="mt-8 inline-block text-sm font-medium text-sage-dark underline-offset-4 hover:underline"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
