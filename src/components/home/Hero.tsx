import Image from "next/image";
import Link from "next/link";
import { whatsappGeneralUrl } from "@/lib/bank";

/**
 * Una sola portada 50/50.
 * Foto exclusiva del home: banner-inicio (no se reutiliza en otras páginas).
 */
export function Hero() {
  return (
    <section className="w-full">
      <div className="grid w-full lg:grid-cols-2">
        <div className="flex min-h-[70vh] flex-col justify-center bg-verde-agua-panel px-10 py-24 text-white sm:px-14 lg:min-h-[92vh] lg:px-16 xl:px-24">
          <div className="max-w-md">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/90">
              Prieta Concreto
            </p>
            <h1 className="mt-10 font-[family-name:var(--font-outfit)] text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
              Objetos que transforman un baño.
            </h1>
            <p className="mt-8 max-w-sm text-[0.95rem] leading-[1.75] text-white/70">
              Una a una. Del taller a tu espacio.
            </p>
            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/tienda"
                className="interactive inline-flex items-center bg-white px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-navy hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Colección
              </Link>
              <a
                href={whatsappGeneralUrl(
                  "Hola Prieta, quiero encargar una pieza.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 underline decoration-white/30 underline-offset-[10px] transition duration-700 ease-editorial hover:text-white hover:decoration-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[56vh] overflow-hidden sm:min-h-[70vh] lg:min-h-[92vh]">
          <Image
            src="/hero/banner-inicio.jpg"
            alt="Bacha oval de concreto Prieta sobre mesada de granito con grifería de pared"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_62%]"
            quality={90}
          />
        </div>
      </div>
    </section>
  );
}
