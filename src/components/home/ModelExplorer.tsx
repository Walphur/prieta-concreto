"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { HeartbeatTitle } from "@/components/effects/HeartbeatTitle";
import type { BachaShapeId } from "@/lib/bacha-options";

export type ModelExplorerItem = {
  id: BachaShapeId;
  label: string;
  mold: string;
  dimensions: string;
  copy: string;
  images: string[];
  slug: string;
};

type ModelExplorerProps = {
  models: ModelExplorerItem[];
};

/** ModelExplorer uses its own pill styles (not .chip) */
const modelBtnBase =
  "relative w-fit max-w-full shrink-0 rounded-sm border px-2.5 py-1.5 text-left text-lg leading-none tracking-tight sm:text-xl font-[family-name:var(--font-outfit)] ease-editorial focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde-agua";

export function ModelExplorer({ models }: ModelExplorerProps) {
  const listId = useId();
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (models.length === 0) return null;

  const current = models[Math.min(active, models.length - 1)]!;

  function select(index: number) {
    setActive(index);
  }

  function onListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = models.length - 1;
    let next = active;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      next = active === last ? 0 : active + 1;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      next = active === 0 ? last : active - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = last;
    } else {
      return;
    }

    select(next);
    buttonsRef.current[next]?.focus();
  }

  return (
    <div
      className={clsx(
        "grid min-w-0 gap-8 sm:gap-10",
        /* Two columns from lg: left = title+list, right = photo from row 1 top */
        "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:items-start lg:gap-x-14 xl:gap-x-16",
      )}
    >
      {/* LEFT COLUMN — Colección, subtitle, models, TODAS (below Forma) */}
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <HeartbeatTitle className="editorial-title text-2xl sm:text-3xl">
          Colección
        </HeartbeatTitle>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/50">
          Cuatro moldes. Elegí el modelo y mirá la pieza.
        </p>

        <div className="mt-8 flex flex-col items-start gap-1 sm:mt-10 sm:gap-1.5">
          <div
            role="tablist"
            aria-label="Modelos de la colección"
            aria-orientation="vertical"
            className="flex w-full max-w-full flex-row flex-wrap items-start gap-x-2 gap-y-1.5 sm:gap-x-2.5 lg:flex-col lg:items-start lg:gap-y-1"
            onKeyDown={onListKeyDown}
          >
            {models.map((model, i) => {
              const isActive = i === active;
              return (
                <button
                  key={model.id}
                  ref={(el) => {
                    buttonsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${listId}-tab-${model.id}`}
                  aria-selected={isActive}
                  aria-controls={`${listId}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(i)}
                  className={clsx(
                    "interactive no-underline hover:no-underline",
                    modelBtnBase,
                    reduceMotion ? "duration-0" : "duration-[400ms]",
                    isActive
                      ? "border-verde-agua/45 bg-verde-agua/[0.16] font-medium text-verde-agua-panel"
                      : "border-transparent font-normal text-navy/40 hover:bg-verde-agua/[0.1] hover:text-navy/65",
                  )}
                >
                  {model.label}
                </button>
              );
            })}
          </div>

          {/* TODAS — directly under Forma, same left padding as model buttons */}
          <Link
            href="/tienda"
            className="interactive inline-flex min-h-10 w-fit items-center px-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-navy/35 no-underline hover:text-navy/70 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
          >
            Todas
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN — photo top edge aligns with Colección (row 1 / items-start) */}
      <div
        role="tabpanel"
        id={`${listId}-panel`}
        aria-labelledby={`${listId}-tab-${current.id}`}
        className="min-w-0 self-start pt-0 lg:col-start-2 lg:row-start-1"
      >
        <div className="relative aspect-square overflow-hidden bg-concrete-light">
          {models.map((model) => {
            const src = model.images[0];
            if (!src) return null;
            const visible = model.id === current.id;
            return (
              <Image
                key={model.id}
                src={src}
                alt={`${model.label} — molde ${model.mold}`}
                fill
                priority={model.id === models[0]?.id}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={clsx(
                  "object-cover object-center transition-opacity ease-editorial",
                  visible ? "z-[1] opacity-100" : "z-0 opacity-0",
                  reduceMotion ? "duration-0" : "duration-[400ms]",
                )}
                aria-hidden={!visible}
              />
            );
          })}
        </div>

        <div
          key={current.id}
          className={clsx(
            "mt-7 max-w-md",
            !reduceMotion && "animate-fade-in",
          )}
          style={
            reduceMotion
              ? undefined
              : { animationDuration: "420ms" }
          }
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/40">
            {current.mold}
          </p>
          <p className="mt-2 text-sm text-navy/55">{current.dimensions}</p>
          {current.copy ? (
            <p className="mt-4 text-[0.95rem] leading-relaxed text-navy/65">
              {current.copy}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4">
            <Button href={`/producto/${current.slug}`} variant="outline">
              Ver {current.label}
            </Button>
            <Link
              href="/tienda"
              className="interactive inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.16em] text-navy/45 no-underline hover:text-navy hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Toda la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
