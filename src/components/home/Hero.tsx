"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { whatsappGeneralUrl } from "@/lib/bank";
import { depositLabel, fullPriceLabel, madeToOrder } from "@/lib/order-policy";
import { productPhotos } from "@/lib/gallery";

const HERO_IMAGE = productPhotos.clienteCircular;

/**
 * Hero con foto real + linterna que revela la imagen y el grano
 * (efecto 1 + 3 sin canvas pesado).
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
        className="absolute inset-0 bg-navy/75 transition-[background] duration-100"
        style={{
          background: live
            ? `radial-gradient(circle 520px at var(--hx) var(--hy), transparent 0%, rgba(26,35,50,0.35) 28%, rgba(26,35,50,0.78) 58%, rgba(18,24,32,0.92) 100%)`
            : `linear-gradient(90deg, rgba(26,35,50,0.82) 0%, rgba(26,35,50,0.45) 55%, rgba(26,35,50,0.55) 100%)`,
        }}
      />

      {/* Grano revelado bajo la luz */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light"
        style={{
          backgroundImage: "url(/textures/grain.svg)",
          backgroundSize: "140px 140px",
          WebkitMaskImage: live
            ? `radial-gradient(circle 420px at var(--hx) var(--hy), #000 0%, transparent 72%)`
            : `linear-gradient(90deg, transparent 20%, #000 50%, transparent 90%)`,
          maskImage: live
            ? `radial-gradient(circle 420px at var(--hx) var(--hy), #000 0%, transparent 72%)`
            : `linear-gradient(90deg, transparent 20%, #000 50%, transparent 90%)`,
        }}
      />

      {/* Halo sage */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: live
            ? `radial-gradient(circle 280px at var(--hx) var(--hy), rgba(163,178,158,0.28) 0%, transparent 70%)`
            : `radial-gradient(circle 360px at 70% 40%, rgba(163,178,158,0.16) 0%, transparent 70%)`,
        }}
      />

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
