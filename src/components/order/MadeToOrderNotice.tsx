import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import { whatsappGeneralUrl, whatsappWholesaleUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

type Props = {
  compact?: boolean;
  className?: string;
  showWholesale?: boolean;
};

export function MadeToOrderNotice({
  compact,
  className,
  showWholesale = true,
}: Props) {
  if (compact) {
    return (
      <p className={className ?? "text-sm text-navy/65"}>
        Sin stock: lo hacemos · {madeToOrder.leadDays} días · seña{" "}
        {depositLabel()}. Mayoristas: consultá condiciones.
      </p>
    );
  }

  return (
    <aside className={clsx("overflow-hidden border border-navy/10", className)}>
      <div
        className={clsx("grid gap-0", showWholesale && "lg:grid-cols-2")}
      >
        <div className="relative flex flex-col bg-verde-agua/[0.12] px-6 py-7 sm:px-8">
          <span
            className="absolute inset-y-0 left-0 w-1 bg-verde-agua"
            aria-hidden
          />
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-verde-agua-panel">
            Particular
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-lg font-medium text-navy">
            Por pedido
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/60">
            Modelo y tono a elección. ~{madeToOrder.leadDays} días ·{" "}
            {fullPriceLabel()} · seña {depositLabel()}.
          </p>
          <div className="mt-auto pt-5">
            <Button
              href={whatsappGeneralUrl(
                `Hola Prieta, quiero encargar una bacha. Entiendo ~${madeToOrder.leadDays} días y seña ${depositLabel()}.`,
              )}
              variant="primary"
              className="bg-verde-agua hover:bg-verde-agua-panel"
            >
              Encargar por WhatsApp
            </Button>
          </div>
        </div>

        {showWholesale ? (
          <div className="relative flex flex-col bg-navy/[0.04] px-6 py-7 sm:px-8 lg:border-l lg:border-navy/10">
            <span
              className="absolute inset-y-0 left-0 w-1 bg-sage lg:left-0"
              aria-hidden
            />
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-sage-dark">
              Mayoristas
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-lg font-medium text-navy">
              Corralones y ferreterías
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/60">
              Condiciones para el rubro. Escribinos y lo vemos.
            </p>
            <div className="mt-auto pt-5">
              <Button
                href={whatsappWholesaleUrl()}
                variant="secondary"
                className="bg-navy"
              >
                Consultar
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
