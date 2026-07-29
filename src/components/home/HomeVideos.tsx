import { galleryVideos } from "@/lib/gallery";
import Link from "next/link";

export function HomeVideos() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 section-space sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="editorial-kicker">Taller</p>
            <h2 className="editorial-title mt-4 text-2xl sm:text-3xl">
              Oficio
            </h2>
          </div>
          <Link
            href="/inspiracion"
            className="text-xs font-medium uppercase tracking-[0.16em] text-navy/50 underline decoration-navy/20 underline-offset-8 transition duration-700 hover:text-navy hover:decoration-navy/50"
          >
            Ver más
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {galleryVideos.map((item) => (
            <figure key={item.src}>
              <div className="flex aspect-[9/16] items-center justify-center bg-navy">
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full max-h-full w-full object-contain"
                >
                  {item.label}
                </video>
              </div>
              <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-navy/40">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
