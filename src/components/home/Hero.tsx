import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { whatsappGeneralUrl } from "@/lib/bank";
import { madeToOrder } from "@/lib/order-policy";

type Band = {
  src: string;
  alt: string;
  /** Image left on desktop; on mobile stacks image then text. */
  imageFirst?: boolean;
  kicker?: string;
  title: string;
  subtitle?: string;
  /** Primary hero: brand + CTAs as buttons */
  hero?: boolean;
};

const BANDS: Band[] = [
  {
    hero: true,
    src: "/hero/hero-bano-marmolada.png",
    alt: "Bacha oval marmolada Prieta instalada en baño con mueble de madera",
    kicker: "Prieta Concreto · San Luis",
    title: "ARTESANÍA EN CONCRETO PARA BAÑOS DE DISEÑO",
    subtitle: `Masa pigmentada, curado lento y sellado mineral. Por pedido — ~${madeToOrder.leadDays} días.`,
  },
  {
    src: "/gallery/clientes/cliente-oval-gris-oscuro-bano.png",
    alt: "Bacha oval gris oscuro instalada en baño con azulejos oscuros",
    imageFirst: true,
    kicker: "Instalaciones reales",
    title: "EN CASAS DE CLIENTES",
    subtitle: "La pieza en el baño, sin recortes. Así se ve el concreto Prieta instalado.",
  },
  {
    src: "/hero/hero-bano-circular-espejo.png",
    alt: "Bacha circular gris clara sobre terrazo, espejo redondo retroiluminado y grifería negra",
    title: "ENCARGÁ LA TUYA",
    subtitle:
      "Elegí modelo y color. Si no hay stock, la fabricamos en el taller de San Luis.",
  },
];

/**
 * Hero + bandas 50/50 full-bleed (estilo Bauvic, voz Prieta):
 * panel verde agua + foto de instalación a sangre.
 */
export function Hero() {
  return (
    <section className="w-full">
      {BANDS.map((band) => (
        <SplitBand key={band.src} {...band} />
      ))}
    </section>
  );
}

function SplitBand({
  src,
  alt,
  imageFirst = false,
  kicker,
  title,
  subtitle,
  hero,
}: Band) {
  const text = (
    <div className="flex min-h-[56vh] flex-col justify-center bg-verde-agua-panel px-8 py-16 text-white sm:px-12 sm:py-20 lg:min-h-[88vh] lg:px-14 xl:px-20">
      <div className={hero ? "max-w-xl" : "max-w-lg"}>
        {kicker ? (
          <p
            className={
              hero
                ? "text-xs font-semibold uppercase tracking-[0.22em] text-white/75"
                : "font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-[0.28em] text-white/80 sm:text-base"
            }
          >
            {kicker}
          </p>
        ) : null}

        {hero ? (
          <p className="mt-4 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Prieta Concreto
          </p>
        ) : null}

        {hero ? (
          <h1 className="mt-4 font-[family-name:var(--font-outfit)] text-[clamp(1.85rem,4.2vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white">
            {title}
          </h1>
        ) : (
          <h2
            className={`font-[family-name:var(--font-outfit)] text-[clamp(2.15rem,5.2vw,4.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white ${
              kicker ? "mt-4" : ""
            }`}
          >
            {title}
          </h2>
        )}

        {subtitle ? (
          <p
            className={`mt-6 leading-relaxed text-white/85 ${
              hero ? "max-w-md text-base sm:text-lg" : "max-w-sm text-base sm:text-lg"
            }`}
          >
            {subtitle}
          </p>
        ) : null}

        {hero ? (
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              href="/tienda"
              variant="secondary"
              className="min-w-[11rem] bg-white text-navy hover:bg-cream"
            >
              Ver colección
            </Button>
            <Button
              href={whatsappGeneralUrl(
                "Hola Prieta Concreto, quiero encargar una bacha por pedido.",
              )}
              variant="outline"
              className="min-w-[11rem] border-white/45 text-white hover:border-white hover:bg-white/10"
            >
              Pedir por WhatsApp
            </Button>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <Link
              href="/tienda"
              className="font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-[0.2em] text-white underline decoration-white/40 underline-offset-8 transition hover:decoration-white"
            >
              Ver colección
            </Link>
            <Link
              href="/inspiracion"
              className="font-[family-name:var(--font-outfit)] text-sm font-semibold uppercase tracking-[0.2em] text-white/90 underline decoration-white/35 underline-offset-8 transition hover:text-white hover:decoration-white"
            >
              Ver inspiración
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const photo = (
    <div className="relative min-h-[48vh] sm:min-h-[56vh] lg:min-h-[88vh]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={Boolean(hero)}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </div>
  );

  return (
    <div
      className={`grid w-full lg:grid-cols-2 ${
        imageFirst ? "max-lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {imageFirst ? (
        <>
          {photo}
          {text}
        </>
      ) : (
        <>
          {text}
          {photo}
        </>
      )}
    </div>
  );
}
