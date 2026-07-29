import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { whatsappGeneralUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";

const CUTOUTS = {
  main: "/gallery/cutouts/oval-negro.png",
  side: "/gallery/cutouts/circular-rosa.png",
  back: "/gallery/cutouts/oval-marmol.png",
} as const;

/** Superficie mineral real (textura de concreto pigmentado) */
const HERO_SURFACE = "/gallery/shapes/oval/gris-natural-mineral.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-navy">
      {/* Concrete surface — real mineral texture */}
      <Image
        src={HERO_SURFACE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-scale-soft object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 texture-concrete-dark opacity-90 mix-blend-multiply" />
      <div className="grain-overlay absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-navy/60" />

      {/* Ferrite light washes */}
      <div className="animate-glow-pulse absolute -right-20 top-8 h-[26rem] w-[26rem] rounded-full bg-[color:var(--ferrite-verde)]/20 blur-3xl" />
      <div className="absolute bottom-10 left-[18%] h-56 w-56 rounded-full bg-[color:var(--ferrite-rosa)]/15 blur-3xl" />
      <div className="absolute right-1/3 top-1/3 h-40 w-40 rounded-full bg-[color:var(--ferrite-grafito)]/25 blur-2xl" />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="relative z-10 max-w-xl">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.22em] text-sage-light">
            Concreto pigmentado · San Luis
          </p>
          <p className="animate-fade-up delay-100 mt-3 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-cream sm:text-3xl md:text-4xl">
            Prieta Concreto
          </p>
          <h1 className="animate-fade-up delay-200 mt-4 font-[family-name:var(--font-outfit)] text-3xl font-medium leading-[1.15] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Artesanía en concreto para baños de diseño.
          </h1>
          <p className="animate-fade-up delay-300 mt-5 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Masa pigmentada con ferrites, curado lento y sellado mineral. Si no
            está el modelo en stock, lo fabricamos por pedido —{" "}
            {fullPriceLabel()} · seña {depositLabel()} · ~{madeToOrder.leadDays}{" "}
            días.
          </p>
          <div className="animate-fade-up delay-400 mt-8 flex flex-wrap gap-3">
            <Button href="/tienda" variant="primary" className="min-w-[11rem]">
              Ver Colección
            </Button>
            <Button
              href={whatsappGeneralUrl(
                `Hola Prieta Concreto, quiero encargar una bacha por pedido.`,
              )}
              variant="outline"
              className="min-w-[11rem] border-cream/35 text-cream hover:border-sage-light hover:text-sage-light"
            >
              Pedir por WhatsApp
            </Button>
          </div>
        </div>

        <div
          className="relative mx-auto h-[min(62vh,34rem)] w-full max-w-lg lg:mx-0 lg:h-[min(72vh,40rem)] lg:max-w-none"
          aria-hidden
        >
          <div className="absolute bottom-[8%] left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/45 blur-2xl" />

          <div className="animate-float-in delay-200 absolute right-[4%] top-[6%] w-[42%] sm:w-[38%]">
            <div className="animate-float-slow cutout-fade cutout-shadow opacity-85">
              <Image
                src={CUTOUTS.back}
                alt=""
                width={480}
                height={480}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          <div className="animate-float-in delay-400 absolute bottom-[10%] left-[2%] w-[40%] sm:w-[36%]">
            <div className="animate-float cutout-fade cutout-shadow [animation-delay:1.2s]">
              <Image
                src={CUTOUTS.side}
                alt=""
                width={420}
                height={420}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          <div className="animate-float-in delay-300 absolute left-[18%] top-[18%] w-[72%] sm:left-[16%] sm:w-[68%]">
            <div className="animate-float cutout-fade cutout-shadow">
              <Image
                src={CUTOUTS.main}
                alt="Bacha oval de concreto Prieta"
                width={900}
                height={900}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
