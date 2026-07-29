import { whatsappGeneralUrl } from "@/lib/bank";
import { Button } from "@/components/ui/Button";

export function HomeCta() {
  return (
    <section className="relative bg-navy">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 85% 20%, rgba(163,178,158,0.18) 0%, transparent 55%), linear-gradient(160deg, #243044 0%, #1a2332 55%, #141c28 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-light">
            Siguiente paso
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            ¿Listo para encargar?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/70">
            Mirá instalaciones reales o escribinos: te ayudamos con modelo,
            color y envío.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/tienda" variant="primary" className="min-w-[11rem]">
              Ver colección
            </Button>
            <Button
              href={whatsappGeneralUrl(
                "Hola Prieta Concreto, quiero consultar por una bacha.",
              )}
              variant="outline"
              className="min-w-[11rem] border-cream/35 text-cream hover:border-sage-light hover:text-sage-light"
            >
              WhatsApp
            </Button>
            <Button
              href="/inspiracion"
              variant="ghost"
              className="min-w-[11rem] text-cream/75 hover:text-sage-light"
            >
              Ver galería
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
