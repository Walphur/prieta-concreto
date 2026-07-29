"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { whatsappGeneralUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import { productPhotos } from "@/lib/gallery";

const HERO_IMAGE = productPhotos.clienteCircular;
const HERO_BACHA = "/hero/bacha-flotante-cutout.png";

/**
 * Hero con foto real + linterna que revela la imagen y el grano
 * (efecto 1 + 3 sin canvas pesado). Bacha real flotante como ancla de producto.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const target = useRef({ x: 72, y: 42 });
  const current = useRef({ x: 72, y: 42 });
  const [pos, setPos] = useState({ x: 72, y: 42 });
  const [live, setLive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLive(fine && !reduce);

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      setPos({ ...current.current });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!live || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      target.current = {
        x: ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 100,
        y: ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 100,
      };
    },
    [live],
  );

  const style = {
    "--hx": `${pos.x}%`,
    "--hy": `${pos.y}%`,
  } as CSSProperties;

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      style={style}
      className="relative min-h-[88vh] w-full overflow-hidden bg-navy"
    >
      <Image
        src={HERO_IMAGE}
        alt="Bacha de concreto Prieta en baño de diseño"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] saturate-[0.92] contrast-[1.05]"
      />

      {/* Base oscura — la linterna “abre” un hueco */}
      <div
        className="absolute inset-0"
        style={{
          background: live
            ? `radial-gradient(circle 520px at var(--hx) var(--hy), transparent 0%, rgba(26,35,50,0.32) 28%, rgba(26,35,50,0.72) 58%, rgba(18,24,32,0.9) 100%)`
            : `linear-gradient(90deg, rgba(26,35,50,0.82) 0%, rgba(26,35,50,0.45) 55%, rgba(26,35,50,0.55) 100%)`,
        }}
      />

      {/* Halo sage suave (sin grano) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: live
            ? `radial-gradient(circle 300px at var(--hx) var(--hy), rgba(163,178,158,0.22) 0%, transparent 72%)`
            : `radial-gradient(circle 360px at 70% 40%, rgba(163,178,158,0.14) 0%, transparent 70%)`,
        }}
      />

      {/* Bacha real flotante — cutout sin fondo negro */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] flex justify-end"
        aria-hidden
      >
        <div className="animate-float-in absolute right-[-8%] top-[12%] w-[min(78vw,340px)] sm:right-[2%] sm:top-[14%] sm:w-[min(48vw,400px)] lg:right-[6%] lg:top-[18%] lg:w-[min(42vw,460px)]">
          <div className="animate-float-slow cutout-shadow origin-center">
            <Image
              src={HERO_BACHA}
              alt=""
              width={392}
              height={215}
              priority
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, 42vw"
              className="h-auto w-full select-none"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:justify-center lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.22em] text-sage-light">
            Concreto pigmentado · San Luis
          </p>
          <p className="animate-fade-up delay-100 mt-3 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-cream sm:text-3xl md:text-4xl">
            Prieta Concreto
          </p>
          <h1 className="animate-fade-up delay-200 mt-4 font-[family-name:var(--font-outfit)] text-3xl font-medium leading-[1.15] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Artesanía en concreto para baños de diseño.
          </h1>
          <p className="animate-fade-up delay-300 mt-5 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Masa pigmentada con ferrites, curado lento y sellado mineral. Si no
            está el modelo en stock, lo fabricamos por pedido —{" "}
            {fullPriceLabel()} · seña {depositLabel()} · ~{madeToOrder.leadDays}{" "}
            días.
          </p>
          <div className="animate-fade-up delay-400 mt-8 flex flex-wrap gap-3">
            <Button href="/tienda" variant="primary" className="min-w-[11rem]">
              Ver Colección
            </Button>
            <Button
              href={whatsappGeneralUrl(
                `Hola Prieta Concreto, quiero encargar una bacha por pedido.`,
              )}
              variant="outline"
              className="min-w-[11rem] border-cream/35 text-cream hover:border-sage-light hover:text-sage-light"
            >
              Pedir por WhatsApp
            </Button>
          </div>
          {live ? (
            <p className="animate-fade-up delay-500 mt-6 text-[11px] uppercase tracking-[0.18em] text-cream/40">
              Mové el mouse — luz sobre el concreto
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
