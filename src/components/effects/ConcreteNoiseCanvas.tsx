"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  opacity?: number;
};

/**
 * Noise espeso (pigmento en cemento) — canvas 2D, desktop only.
 * Sin Three.js: barato y desactivable en móvil / reduced-motion.
 */
export function ConcreteNoiseCanvas({ className, opacity = 0.22 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    if (!fine || reduce || narrow) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let mx = 0.5;
    let my = 0.5;
    let w = 0;
    let h = 0;
    let scale = 0.45;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      scale = Math.min(0.32, 480 / Math.max(rect.width, 1));
      w = Math.max(1, Math.floor(rect.width * scale));
      h = Math.max(1, Math.floor(rect.height * scale));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    // Hash noise (barato)
    const hash = (x: number, y: number) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const valueNoise = (x: number, y: number) => {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const u = fx * fx * (3 - 2 * fx);
      const v = fy * fy * (3 - 2 * fy);
      const a = hash(x0, y0);
      const b = hash(x0 + 1, y0);
      const c = hash(x0, y0 + 1);
      const d = hash(x0 + 1, y0 + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };

    const fbm = (x: number, y: number) => {
      let amp = 0.55;
      let freq = 1;
      let sum = 0;
      for (let i = 0; i < 4; i++) {
        sum += amp * valueNoise(x * freq, y * freq);
        amp *= 0.5;
        freq *= 2.05;
      }
      return sum;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = (e.clientY - rect.top) / rect.height;
    };

    const draw = () => {
      t += 0.0022;
      const step = 2;
      const img = ctx.createImageData(w, h);
      const data = img.data;
      const warpX = (mx - 0.5) * 0.28;
      const warpY = (my - 0.5) * 0.28;

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const nx = x / w;
          const ny = y / h;
          const n =
            fbm(nx * 3.1 + t * 0.32 + warpX, ny * 3.1 - t * 0.2 + warpY) * 0.75 +
            fbm(nx * 6.5 + t * 0.08, ny * 6.5) * 0.25;

          const r = 26 + n * 55 + (n > 0.62 ? 38 : 0);
          const g = 35 + n * 48 + (n > 0.55 ? 16 : 0);
          const b = 50 + n * 42 - (n > 0.7 ? 10 : 0);
          const a = 50 + n * 110;

          for (let dy = 0; dy < step && y + dy < h; dy++) {
            for (let dx = 0; dx < step && x + dx < w; dx++) {
              const i = ((y + dy) * w + (x + dx)) * 4;
              data[i] = Math.min(255, r);
              data[i + 1] = Math.min(255, g);
              data[i + 2] = Math.min(255, b);
              data[i + 3] = Math.min(170, a);
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ opacity, mixBlendMode: "soft-light" }}
    />
  );
}
