import Image from "next/image";
import bachaImages from "../../../data/bacha-images.json";
import {
  BACHA_DIMENSIONS,
  BACHA_SHAPES,
  colorLabel,
  type BachaShapeId,
} from "@/lib/bacha-options";

const DIAGRAMAS: Partial<Record<BachaShapeId, string>> = {
  cuadrado: "/gallery/fichas/cuadrado-diagrama.png",
  oval: "/gallery/fichas/oval-diagrama.png",
  circular: "/gallery/fichas/circular-diagrama.png",
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
        const diagram = DIAGRAMAS[shape.id];
        const photos = all.filter(
          (i) =>
            i.shape === shape.id &&
            i.kind !== "grupo" &&
            !i.src.includes("/fichas/"),
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

            {/* Medidas (izq, más chicas) · bachas de referencia (der) */}
            <div
              className={
                diagram
                  ? "grid items-start gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10"
                  : ""
              }
            >
              {diagram ? (
                <div className="mx-auto w-full max-w-[280px] bg-[#1c1c1c] p-3 sm:p-4 lg:mx-0 lg:max-w-[320px]">
                  <Image
                    src={diagram}
                    alt={`Diagrama de medidas ${shape.label}`}
                    width={640}
                    height={840}
                    sizes="(max-width: 1024px) 280px, 320px"
                    className="h-auto w-full object-contain"
                    priority={shape.id === "cuadrado"}
                  />
                </div>
              ) : null}

              {photos.length > 0 ? (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/40">
                    Referencia · {shape.label.toLowerCase()}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
            </div>
          </article>
        );
      })}
    </div>
  );
}
