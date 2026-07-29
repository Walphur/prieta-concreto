import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { whatsappGeneralUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";

const CUTOUTS = {
  main: "/gallery/cutouts/oval-negro.png",
  side: "/gallery/cutouts/circular-rosa.png",
  back: "/gallery/cutouts/oval-marmol.png",
} as const;

export function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-navy">
      {/* Atmosphere */}
      <div className="absolute inset-0 texture-concrete-dark" />
      <div className="animate-glow-pulse absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-sage/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-deep-red/15 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="relative z-10 max-w-xl">
          <p className="animate-fade-up font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-cream sm:text-3xl md:text-4xl">
            Prieta Concreto
          </p>
          <h1 className="animate-fade-up delay-100 mt-4 font-[family-name:var(--font-outfit)] text-3xl font-medium leading-[1.15] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Artesanía en concreto para baños de diseño.
          </h1>
          <p className="animate-fade-up delay-200 mt-5 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Bachas hechas a mano en San Luis. Si no está el modelo en stock, lo
            fabricamos por pedido — {fullPriceLabel()} · seña {depositLabel()} ·
            ~{madeToOrder.leadDays} días.
          </p>
          <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
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

        {/* Floating bachas */}
        <div
          className="relative mx-auto h-[min(62vh,34rem)] w-full max-w-lg lg:mx-0 lg:h-[min(72vh,40rem)] lg:max-w-none"
          aria-hidden
        >
          {/* Soft ground glow */}
          <div className="absolute bottom-[8%] left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/40 blur-2xl" />

          {/* Back marble — smaller, offset */}
          <div className="animate-float-in delay-200 absolute right-[4%] top-[6%] w-[42%] sm:w-[38%]">
            <div className="animate-float-slow cutout-fade cutout-shadow opacity-80">
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

          {/* Side pink */}
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

          {/* Main dark oval — hero piece */}
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
