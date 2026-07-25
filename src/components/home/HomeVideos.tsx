import { galleryVideos } from "@/lib/gallery";
import { Button } from "@/components/ui/Button";

export function HomeVideos() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Taller
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Videos de las bachas
          </h2>
          <p className="mt-3 text-base text-navy/65">
            Cómo se hacen, textura, color y oficio artesanal.
          </p>
        </div>
        <Button href="/inspiracion" variant="outline">
          Ver galería completa
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryVideos.map((item) => (
          <figure
            key={item.src}
            className={
              item.src.includes("proceso-bachas")
                ? "overflow-hidden bg-navy/95 md:col-span-2 lg:col-span-3"
                : "overflow-hidden bg-navy/95"
            }
          >
            <div className="flex max-h-[70vh] items-center justify-center bg-navy">
              <video
                src={item.src}
                controls
                playsInline
                preload="metadata"
                className="max-h-[70vh] w-full object-contain"
              >
                {item.label}
              </video>
            </div>
            <figcaption className="px-4 py-3 text-sm text-cream/80">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
