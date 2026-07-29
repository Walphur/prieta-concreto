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
  /** Radio de la luz en px (desktop). */
  lightRadius?: number;
};

/**
 * Linterna especular sobre navy: revela grano mineral y empuja sombras
 * en sentido inverso al cursor.
 */
export function DynamicLightSection({
  children,
  className,
  lightRadius = 460,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 62, y: 38 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x, y });
    },
    [enabled],
  );

  const shadowX = ((50 - pos.x) / 50) * 14;
  const shadowY = ((50 - pos.y) / 50) * 14;

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
        "dynamic-light relative overflow-hidden bg-navy",
        className,
      )}
    >
      {/* Base brutalista */}
      <div className="absolute inset-0 texture-concrete-dark" />
      {/* Grano mineral — solo se lee bajo la luz */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{
          backgroundImage: "url(/textures/grain.svg)",
          backgroundSize: "190px 190px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage: "url(/textures/cement-dark.svg)",
          backgroundSize: "520px 520px",
        }}
      />

      {/* Linterna sage */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          enabled ? "opacity-100" : "opacity-70",
        )}
        style={{
          background: enabled
            ? `radial-gradient(circle var(--light-r) at var(--lx) var(--ly), rgba(163, 178, 158, 0.28) 0%, rgba(125, 143, 120, 0.12) 32%, transparent 68%)`
            : `radial-gradient(circle 520px at 70% 35%, rgba(163, 178, 158, 0.18) 0%, transparent 65%)`,
        }}
      />
      {/* Highlight más duro cerca del cursor */}
      {enabled ? (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background: `radial-gradient(circle 180px at var(--lx) var(--ly), rgba(247, 245, 242, 0.14) 0%, transparent 70%)`,
          }}
        />
      ) : null}

      <div className="dynamic-light-content relative z-10">{children}</div>
    </section>
  );
}
