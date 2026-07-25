import Image from "next/image";
import { BACHA_DIMENSIONS, BACHA_SHAPES, type BachaShapeId } from "@/lib/bacha-options";

const MOLD_MEDIA: Record<
  BachaShapeId,
  { product: string; diagram?: string }
> = {
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

export function MedidasMoldes() {
  return (
    <div className="mt-12 space-y-14">
      <p className="max-w-2xl text-navy/65">
        Medidas oficiales de cada molde. Todos los modelos cuestan{" "}
        <span className="font-semibold text-deep-red">$80.000</span> y se
        fabrican en cualquiera de los colores.
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        {BACHA_SHAPES.map((shape) => {
          const dim = BACHA_DIMENSIONS[shape.id];
          const media = MOLD_MEDIA[shape.id];
          return (
            <article
              key={shape.id}
              className="border-t border-navy/10 pt-8 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-8"
            >
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
                  media.diagram
                    ? "mt-6 grid gap-3 sm:grid-cols-2"
                    : "mt-6"
                }
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
                  <Image
                    src={media.product}
                    alt={`Molde ${shape.label}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                {media.diagram ? (
                  <div className="relative aspect-[4/5] overflow-hidden bg-navy/90">
                    <Image
                      src={media.diagram}
                      alt={`Diagrama ${shape.label}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
