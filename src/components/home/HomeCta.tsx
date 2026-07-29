import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

export function HomeCta() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        <div className="max-w-md">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-medium tracking-[-0.02em] text-cream sm:text-4xl">
            Contame del baño.
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
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
      </div>
    </section>
  );
}
