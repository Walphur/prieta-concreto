import { madeToOrder } from "@/lib/order-policy";
import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    title: "Elegí modelo y color",
    body: "Mirás la colección o los ejemplos de pigmento. Medidas de moldes en Tienda.",
  },
  {
    title: "Confirmás por WhatsApp",
    body: "Coordinamos el pedido y la seña para iniciar la fabricación.",
  },
  {
    title: "Fabricamos y curamos",
    body: `Vaciado a mano, pigmento en masa y ~${madeToOrder.leadDays} días de fraguado.`,
  },
  {
    title: "Retiro o envío",
    body: "Coordinamos entrega. Envíos a toda la Argentina por Andesmar Cargas.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="texture-concrete border-y-2 border-navy/15">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Pedido a medida
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Así encargás tu bacha
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/65">
            Un proceso claro de punta a punta: sin stock del modelo, lo
            fabricamos por pedido.
          </p>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative border-navy/12 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-[family-name:var(--font-outfit)] text-sm font-semibold tracking-[0.12em] text-sage">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-lg font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 border-t-2 border-navy/12 pt-10">
          <Button
            href={whatsappGeneralUrl(
              `Hola Prieta Concreto, quiero encargar una bacha por pedido. Entiendo ~${madeToOrder.leadDays} días de fabricación.`,
            )}
            variant="secondary"
          >
            Empezar por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
