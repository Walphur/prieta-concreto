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
    <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-start lg:gap-16 xl:gap-20">
      {/* Model list */}
      <div
        role="tablist"
        aria-label="Modelos de la colección"
        aria-orientation="vertical"
        className="flex flex-row flex-wrap gap-x-3 gap-y-2 lg:flex-col lg:gap-y-1.5"
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
                "interactive relative w-fit rounded-sm border px-3 py-1.5 text-left font-[family-name:var(--font-outfit)] tracking-tight",
                "transition-[background-color,border-color,color] ease-editorial",
                reduceMotion ? "duration-0" : "duration-[400ms]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde-agua",
                isActive
                  ? "border-verde-agua/45 bg-verde-agua/[0.16] text-[1.35rem] font-medium text-verde-agua-panel sm:text-[1.5rem]"
                  : "border-transparent text-[1.15rem] font-normal text-navy/40 hover:bg-verde-agua/[0.07] hover:text-navy/65 sm:text-[1.25rem]",
              )}
            >
              {model.label}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div
        role="tabpanel"
        id={`${listId}-panel`}
        aria-labelledby={`${listId}-tab-${current.id}`}
        className="min-w-0"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light sm:aspect-[5/6] lg:aspect-[4/5]">
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
                  "object-cover transition-opacity ease-editorial",
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
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href={`/producto/${current.slug}`} variant="outline">
              Ver {current.label}
            </Button>
            <Link
              href="/tienda"
              className="interactive text-xs font-medium uppercase tracking-[0.16em] text-navy/45 underline decoration-navy/15 underline-offset-8 hover:text-navy hover:decoration-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Toda la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
