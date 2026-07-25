import Image from "next/image";
import bachaImages from "../../../data/bacha-images.json";
import {
  BACHA_DIMENSIONS,
  BACHA_SHAPES,
  colorLabel,
  type BachaShapeId,
} from "@/lib/bacha-options";

const FICHAS: Record<BachaShapeId, { product: string; diagram?: string }> = {
  cuadrado: {
    product: "/gallery/fichas/cuadrado-producto.jpg",
    diagram: "/gallery/fichas/cuadrado-diagrama.jpg",
  },
  oval: {
    product: "/gallery/fichas/oval-producto.jpg",
    diagram: "/gallery/fichas/oval-diagrama.jpg",
  },
  circular: {
    product: "/gallery/fichas/circular-producto.jpg",
    diagram: "/gallery/fichas/circular-diagrama.jpg",
  },
  "circular-tapon": {
    product: "/gallery/fichas/circular-tapon-producto.jpg",
  },
};

type BachaImage = {
  src: string;
  shape: string;
  color: string;
  kind: string;
};

export function MedidasMoldes() {
  const all = bachaImages as BachaImage[];

  return (
    <div className="mt-12 space-y-16">
      <p className="max-w-2xl text-navy/65">
        Medidas oficiales de cada molde y todas las bachas fotografiadas de ese
        modelo. Todos cuestan{" "}
        <span className="font-semibold text-deep-red">$80.000</span> en
        cualquiera de los colores.
      </p>

      {BACHA_SHAPES.map((shape) => {
        const dim = BACHA_DIMENSIONS[shape.id];
        const ficha = FICHAS[shape.id];
        const photos = all.filter(
          (i) => i.shape === shape.id && i.kind !== "grupo",
        );

        return (
          <article
            key={shape.id}
            className="border-t border-navy/10 pt-10 first:border-t-0 first:pt-0"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div>
                <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-navy">
                  {shape.label}
                </h2>
                <p className="mt-2 text-lg font-medium text-sage-dark">
                  {dim.dimensions}
                </p>
                <p className="mt-1 text-sm text-navy/55">{dim.detail}</p>
                <ul className="mt-3 space-y-1 text-sm text-navy/60">
                  {dim.wall ? <li>{dim.wall}</li> : null}
                  {dim.drain ? <li>{dim.drain}</li> : null}
                  {dim.note ? <li>{dim.note}</li> : null}
                </ul>

                <div
                  className={
                    ficha.diagram
                      ? "mt-6 grid gap-3 sm:grid-cols-2"
                      : "mt-6 max-w-sm"
                  }
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
                    <Image
                      src={ficha.product}
                      alt={`Molde ${shape.label}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  {ficha.diagram ? (
                    <div className="relative aspect-[4/5] overflow-hidden bg-navy/90">
                      <Image
                        src={ficha.diagram}
                        alt={`Diagrama ${shape.label}`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/45">
                  Bachas {shape.label.toLowerCase()}
                </p>
                <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {photos.map((photo) => (
                    <figure
                      key={photo.src}
                      className="relative aspect-square overflow-hidden bg-concrete-light"
                    >
                      <Image
                        src={photo.src}
                        alt={`${shape.label} ${colorLabel(photo.color)}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover"
                      />
                      <figcaption className="absolute bottom-2 left-2 bg-cream/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy">
                        {colorLabel(photo.color)}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
