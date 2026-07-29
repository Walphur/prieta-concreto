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
        Sin stock del modelo: lo fabricamos · {madeToOrder.leadDays} días · seña{" "}
        {depositLabel()}. Mayoristas: consultá precio especial.
      </p>
    );
  }

  return (
    <aside
      className={clsx(
        "border border-concrete bg-cream-dark/50",
        className,
      )}
    >
      <div
        className={clsx(
          "grid gap-0",
          showWholesale && "lg:grid-cols-2",
        )}
      >
        <div className="px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Particular
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
            ¿No está el modelo que querés?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/70">
            Lo fabricamos por pedido en el modelo y color que elijas. Demora
            aproximada de{" "}
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
                `Hola Prieta Concreto, no encuentro el modelo/color que quiero en stock. Quiero encargar una bacha por pedido. Entiendo ~${madeToOrder.leadDays} días y seña ${depositLabel()}.`,
              )}
              variant="outline"
              className="text-sm"
            >
              Pedir por WhatsApp
            </Button>
          </div>
        </div>

        {showWholesale ? (
          <div className="border-t border-concrete px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Mayoristas
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
              Corralones y ferreterías
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">
              Pedidos mayoristas con mejor precio para corralones, ferreterías y
              comercios del rubro. Armamos cantidades y condiciones según tu
              necesidad.
            </p>
            <div className="mt-4">
              <Button
                href={whatsappWholesaleUrl()}
                variant="secondary"
                className="text-sm"
              >
                Consultar precio mayorista
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
