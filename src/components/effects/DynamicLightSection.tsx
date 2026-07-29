"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { clsx } from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  lightRadius?: number;
};

/**
 * Linterna sobre navy: el grano solo se ve bajo la luz;
 * las sombras se mueven al contrario del cursor.
 */
export function DynamicLightSection({
  children,
  className,
  lightRadius = 520,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const target = useRef({ x: 70, y: 40 });
  const current = useRef({ x: 70, y: 40 });
  const [pos, setPos] = useState({ x: 70, y: 40 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActive(!reduce);

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.14;
      current.current.y += (target.current.y - current.current.y) * 0.14;
      setPos({ ...current.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    target.current = {
      x: ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 100,
      y: ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 100,
    };
  }, []);

  const shadowX = ((50 - pos.x) / 50) * 22;
  const shadowY = ((50 - pos.y) / 50) * 22;

  const style = {
    "--lx": `${pos.x}%`,
    "--ly": `${pos.y}%`,
    "--sx": `${shadowX.toFixed(2)}px`,
    "--sy": `${shadowY.toFixed(2)}px`,
    "--light-r": `${lightRadius}px`,
  } as CSSProperties;

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      style={style}
      className={clsx(
        "dynamic-light relative isolate overflow-hidden bg-[#121820]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-navy" />

      {/* Textura siempre presente pero oscura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/textures/cement-dark.svg)",
          backgroundSize: "420px 420px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay"
        style={{
          backgroundImage: "url(/textures/grain.svg)",
          backgroundSize: "160px 160px",
        }}
      />

      {/* Luz sage fuerte — sigue el mouse */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: active
            ? `radial-gradient(circle var(--light-r) at var(--lx) var(--ly), rgba(163,178,158,0.55) 0%, rgba(125,143,120,0.28) 28%, rgba(26,35,50,0.15) 52%, transparent 72%)`
            : `radial-gradient(circle 480px at 72% 38%, rgba(163,178,158,0.4) 0%, transparent 70%)`,
        }}
      />
      {/* Revela textura solo bajo la luz (máscara) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90 mix-blend-soft-light"
        style={{
          backgroundImage: "url(/textures/grain.svg)",
          backgroundSize: "120px 120px",
          WebkitMaskImage: active
            ? `radial-gradient(circle calc(var(--light-r) * 0.85) at var(--lx) var(--ly), #000 0%, transparent 70%)`
            : `radial-gradient(circle 400px at 72% 38%, #000 0%, transparent 70%)`,
          maskImage: active
            ? `radial-gradient(circle calc(var(--light-r) * 0.85) at var(--lx) var(--ly), #000 0%, transparent 70%)`
            : `radial-gradient(circle 400px at 72% 38%, #000 0%, transparent 70%)`,
        }}
      />
      {/* Specular highlight */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: active
            ? `radial-gradient(circle 140px at var(--lx) var(--ly), rgba(247,245,242,0.22) 0%, transparent 70%)`
            : "none",
        }}
      />

      <div className="dynamic-light-content relative z-10">{children}</div>
    </section>
  );
}
