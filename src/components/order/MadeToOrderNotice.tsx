import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import { whatsappGeneralUrl, whatsappWholesaleUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

type Props = {
  compact?: boolean;
  className?: string;
  /** Si false, solo muestra el bloque de particulares */
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
    <aside
      className={clsx(
        "texture-panel",
        className,
      )}
    >
      <div
        className={clsx(
          "grid gap-0",
          showWholesale && "lg:grid-cols-2",
        )}
      >
        <div className="flex flex-col px-5 py-6 sm:px-6">
          <p className="editorial-kicker">Particular</p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-lg font-medium text-navy">
            Por pedido
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/55">
            Modelo y tono a elección. ~{madeToOrder.leadDays} días ·{" "}
            {fullPriceLabel()} · seña {depositLabel()}.
          </p>
          <div className="mt-auto pt-4">
            <Button
              href={whatsappGeneralUrl(
                `Hola Prieta, quiero encargar una bacha. Entiendo ~${madeToOrder.leadDays} días y seña ${depositLabel()}.`,
              )}
              variant="outline"
              className="text-sm"
            >
              Encargar por WhatsApp
            </Button>
          </div>
        </div>

        {showWholesale ? (
          <div className="flex flex-col border-t border-navy/10 px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
            <p className="editorial-kicker">Mayoristas</p>
            <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-lg font-medium text-navy">
              Corralones y ferreterías
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/55">
              Condiciones para el rubro. Escribinos y lo vemos.
            </p>
            <div className="mt-auto pt-4">
              <Button
                href={whatsappWholesaleUrl()}
                variant="secondary"
                className="text-sm"
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
