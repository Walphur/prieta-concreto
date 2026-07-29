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
    diagram: "/gallery/fichas/cuadrado-diagrama.png",
  },
  oval: {
    product: "/gallery/fichas/oval-producto.jpg",
    diagram: "/gallery/fichas/oval-diagrama.png",
  },
  circular: {
    product: "/gallery/fichas/circular-producto.jpg",
    diagram: "/gallery/fichas/circular-diagrama.png",
  },
  "circular-tapon": {
    product: "/gallery/fichas/circular-tapon-producto.png",
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
    <div className="mt-12 space-y-20">
      <p className="max-w-xl text-sm leading-relaxed text-navy/55">
        Medidas oficiales de cada molde. Precio fijo $95.000. Envíos por Andesmar
        Cargas.
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
            className="border-t border-navy/10 pt-12 first:border-t-0 first:pt-0"
          >
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-medium tracking-tight text-navy">
                {shape.label}
              </h2>
              <p className="mt-2 text-base text-navy/60">{dim.dimensions}</p>
              <p className="mt-1 text-sm text-navy/45">{dim.detail}</p>
              <ul className="mt-3 space-y-1 text-sm text-navy/50">
                {dim.wall ? <li>{dim.wall}</li> : null}
                {dim.drain ? <li>{dim.drain}</li> : null}
                {dim.note ? <li>{dim.note}</li> : null}
              </ul>
            </div>

            {/* Diagrama grande a la izquierda; foto de bacha chica a la derecha */}
            {ficha.diagram ? (
              <div className="grid items-start gap-4 lg:grid-cols-[1.4fr_0.7fr] lg:gap-6">
                <div className="bg-[#1c1c1c] p-4 sm:p-6">
                  <Image
                    src={ficha.diagram}
                    alt={`Diagrama de medidas ${shape.label}`}
                    width={1000}
                    height={1300}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="h-auto w-full object-contain"
                    priority={shape.id === "cuadrado"}
                  />
                </div>
                <div className="mx-auto w-full max-w-[280px] bg-[#e8e8e8] p-3 lg:mx-0 lg:max-w-none">
                  <Image
                    src={ficha.product}
                    alt={`Molde ${shape.label}`}
                    width={480}
                    height={480}
                    sizes="(max-width: 1024px) 280px, 28vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-xs bg-[#e8e8e8] p-3">
                <Image
                  src={ficha.product}
                  alt={`Molde ${shape.label}`}
                  width={480}
                  height={480}
                  sizes="280px"
                  className="h-auto w-full object-contain"
                />
              </div>
            )}

            {photos.length > 0 ? (
              <div className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/40">
                  Colores · {shape.label.toLowerCase()}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 lg:gap-3">
                  {photos.map((photo) => (
                    <figure
                      key={photo.src}
                      className="relative aspect-square overflow-hidden bg-concrete-light"
                    >
                      <Image
                        src={photo.src}
                        alt={`${shape.label} ${colorLabel(photo.color)}`}
                        fill
                        sizes="(max-width: 640px) 33vw, 12vw"
                        className="object-cover object-center"
                      />
                      <figcaption className="absolute bottom-1.5 left-1.5 bg-cream/90 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-navy">
                        {colorLabel(photo.color)}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
