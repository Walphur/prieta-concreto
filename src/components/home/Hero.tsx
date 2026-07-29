import Image from "next/image";
import Link from "next/link";
import { whatsappGeneralUrl } from "@/lib/bank";

type Band = {
  src: string;
  alt: string;
  imageFirst?: boolean;
  kicker?: string;
  title: string;
  subtitle?: string;
  hero?: boolean;
};

const BANDS: Band[] = [
  {
    hero: true,
    src: "/hero/hero-bano-marmolada.png",
    alt: "Bacha oval marmolada Prieta instalada en baño con mueble de madera",
    kicker: "San Luis",
    title: "Concreto para baños de diseño.",
    subtitle: "Masa pigmentada. Curado lento. Sellado mineral.",
  },
  {
    src: "/gallery/clientes/cliente-circular-beige-espejo.png",
    alt: "Bacha circular beige a juego con la mesada, espejo redondo retroiluminado y grifería negra",
    imageFirst: true,
    kicker: "Obras",
    title: "Instalaciones reales.",
    subtitle: "La pieza en contexto, en baños ya habitados.",
  },
];

/**
 * Hero editorial 50/50: panel verde agua + foto a sangre.
 * Dos bandas — portada de marca, no landing de fábrica.
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
    <div className="flex min-h-[62vh] flex-col justify-center bg-verde-agua-panel px-10 py-20 text-white sm:px-14 sm:py-24 lg:min-h-[92vh] lg:px-16 xl:px-24">
      <div className="max-w-md">
        {kicker ? (
          <p className="editorial-kicker text-white/65">{kicker}</p>
        ) : null}

        {hero ? (
          <h1 className="mt-8 font-[family-name:var(--font-outfit)] text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
            {title}
          </h1>
        ) : (
          <h2
            className={`font-[family-name:var(--font-outfit)] text-[clamp(1.85rem,3.6vw,2.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white ${
              kicker ? "mt-8" : ""
            }`}
          >
            {title}
          </h2>
        )}

        {subtitle ? (
          <p className="mt-8 max-w-sm text-[0.95rem] leading-[1.7] text-white/72 sm:text-base">
            {subtitle}
          </p>
        ) : null}

        {hero ? (
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/tienda"
              className="inline-flex items-center bg-white px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-navy transition-colors duration-700 ease-editorial hover:bg-cream"
            >
              Colección
            </Link>
            <a
              href={whatsappGeneralUrl(
                "Hola Prieta Concreto, quiero encargar una bacha.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 underline decoration-white/30 underline-offset-[10px] transition duration-700 ease-editorial hover:text-white hover:decoration-white"
            >
              WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-12">
            <Link
              href="/inspiracion"
              className="text-xs font-medium uppercase tracking-[0.18em] text-white/85 underline decoration-white/30 underline-offset-[10px] transition duration-700 ease-editorial hover:text-white hover:decoration-white"
            >
              Ver espacios
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const photo = (
    <div className="relative min-h-[52vh] overflow-hidden sm:min-h-[62vh] lg:min-h-[92vh]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={Boolean(hero)}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-[1200ms] ease-editorial will-change-transform"
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
