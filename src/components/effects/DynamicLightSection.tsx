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
 * Linterna suave sobre navy — sin grano SVG (evita look pixeleado).
 */
export function DynamicLightSection({
  children,
  className,
  lightRadius = 560,
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

  const shadowX = ((50 - pos.x) / 50) * 18;
  const shadowY = ((50 - pos.y) / 50) * 18;

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
        "dynamic-light relative isolate overflow-hidden bg-navy",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-navy-soft via-navy to-[#10161f]" />

      {/* Luz sage suave */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: active
            ? `radial-gradient(circle var(--light-r) at var(--lx) var(--ly), rgba(163,178,158,0.38) 0%, rgba(125,143,120,0.16) 34%, transparent 68%)`
            : `radial-gradient(circle 480px at 72% 38%, rgba(163,178,158,0.28) 0%, transparent 70%)`,
        }}
      />
      {/* Specular limpio */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: active
            ? `radial-gradient(circle 160px at var(--lx) var(--ly), rgba(247,245,242,0.14) 0%, transparent 72%)`
            : "none",
        }}
      />

      <div className="dynamic-light-content relative z-10">{children}</div>
    </section>
  );
}
