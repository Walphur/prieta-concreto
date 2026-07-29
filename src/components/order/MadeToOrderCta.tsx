import Link from "next/link";
import { whatsappMadeToOrderUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";

type Props = {
  name: string;
  colorLabel?: string;
  shapeLabel?: string;
};

export function MadeToOrderCta({ name, colorLabel, shapeLabel }: Props) {
  const href = whatsappMadeToOrderUrl({
    name,
    color: colorLabel,
    shape: shapeLabel,
  });

  return (
    <div className="space-y-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark sm:w-auto sm:min-w-[14rem]"
      >
        Pedir este modelo y color
      </a>
      <p className="text-xs leading-relaxed text-navy/55">
        Ejemplo de referencia. Fabricamos por pedido · demora aprox.{" "}
        {madeToOrder.leadDays} días ({madeToOrder.reason}) · seña{" "}
        {depositLabel()} · total {fullPriceLabel()}.{" "}
        <Link href="/tienda" className="underline-offset-2 hover:underline">
          Ver colección
        </Link>
      </p>
    </div>
  );
}
