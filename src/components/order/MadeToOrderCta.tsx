"use client";

import { useState } from "react";
import Link from "next/link";
import { whatsappMadeToOrderUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import {
  BACHA_COLORS,
  type BachaColorId,
} from "@/lib/bacha-options";
import { TonePicker } from "@/components/order/TonePicker";

type Props = {
  name: string;
  /** Initial tono id if the product already has one */
  initialColorId?: BachaColorId | string;
  shapeLabel?: string;
};

function resolveInitial(id?: string): BachaColorId {
  const match = BACHA_COLORS.find((c) => c.id === id || c.label === id);
  return match?.id ?? "gris-natural";
}

export function MadeToOrderCta({
  name,
  initialColorId,
  shapeLabel,
}: Props) {
  const [colorId, setColorId] = useState<BachaColorId>(() =>
    resolveInitial(initialColorId),
  );
  const colorName =
    BACHA_COLORS.find((c) => c.id === colorId)?.label ?? colorId;

  const href = whatsappMadeToOrderUrl({
    name,
    color: colorName,
    shape: shapeLabel,
  });

  return (
    <div className="space-y-5">
      <TonePicker
        value={colorId}
        onChange={setColorId}
        hint="Elegí el pigmento para el encargo."
      />
      <div className="space-y-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark sm:w-auto sm:min-w-[14rem]"
        >
          Encargar este modelo
        </a>
        <p className="text-xs leading-relaxed text-navy/55">
          Modelo por pedido · tono {colorName} · ~
          {madeToOrder.leadDays} días · seña {depositLabel()} · total{" "}
          {fullPriceLabel()}.{" "}
          <Link href="/tienda" className="underline-offset-2 hover:underline">
            Ver colección
          </Link>
        </p>
      </div>
    </div>
  );
}
