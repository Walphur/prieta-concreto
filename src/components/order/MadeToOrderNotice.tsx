import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

type Props = {
  compact?: boolean;
  className?: string;
};

export function MadeToOrderNotice({ compact, className }: Props) {
  if (compact) {
    return (
      <p className={className ?? "text-sm text-navy/65"}>
        Por pedido · {madeToOrder.leadDays} días · seña {depositLabel()} · total{" "}
        {fullPriceLabel()}
      </p>
    );
  }

  return (
    <aside
      className={
        className ??
        "border border-concrete bg-cream-dark/50 px-5 py-5 sm:px-6"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Pedido a medida
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
        Bachas por modelo y color
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/70">
        Fabricamos bajo pedido eligiendo modelo y color. Demora aproximada de{" "}
        <span className="font-semibold text-navy">
          {madeToOrder.leadDays} días
        </span>{" "}
        por {madeToOrder.reason}. Precio{" "}
        <span className="font-semibold text-deep-red">{fullPriceLabel()}</span>
        ; seña de{" "}
        <span className="font-semibold text-navy">{depositLabel()}</span> para
        iniciar.
      </p>
      <div className="mt-4">
        <Button
          href={whatsappGeneralUrl(
            `Hola Prieta Concreto, quiero encargar una bacha por pedido (modelo y color). Entiendo ~${madeToOrder.leadDays} días y seña ${depositLabel()}.`,
          )}
          variant="outline"
          className="text-sm"
        >
          Consultar por WhatsApp
        </Button>
      </div>
    </aside>
  );
}
