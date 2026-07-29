import { galleryVideos } from "@/lib/gallery";
import { Button } from "@/components/ui/Button";

export function HomeVideos() {
  return (
    <section className="border-y-2 border-navy/15 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Taller · inspiración
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              El oficio en movimiento
            </h2>
            <p className="mt-3 text-base text-navy/65">
              Textura, color y proceso: un adelanto del taller. La galería
              completa tiene más instalaciones.
            </p>
          </div>
          <Button
            href="/inspiracion"
            variant="outline"
            className="self-start sm:self-auto"
          >
            Ver galería
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryVideos.map((item) => (
            <figure key={item.src} className="overflow-hidden bg-navy/95">
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
              <figcaption className="px-4 py-3 text-sm text-cream/80">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
