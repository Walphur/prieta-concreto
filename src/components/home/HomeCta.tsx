import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

export function HomeCta() {
  return (
    <section className="bg-navy">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-8">
        <div className="max-w-md">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-medium tracking-[-0.02em] text-cream sm:text-3xl">
            Contame del baño.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/50">
            Una bacha a medida, o la pieza que ya está en colección.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:shrink-0 lg:pb-0.5">
          <Button href="/tienda" variant="primary">
            Colección
          </Button>
          <a
            href={whatsappGeneralUrl(
              "Hola Prieta, quiero hablar de una bacha para mi baño.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium uppercase tracking-[0.16em] text-cream/70 underline decoration-cream/25 underline-offset-[10px] transition duration-700 hover:text-cream hover:decoration-cream/60"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
