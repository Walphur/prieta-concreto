"use client";

import { BACHA_COLORS, type BachaColorId } from "@/lib/bacha-options";
import { clsx } from "clsx";

type Props = {
  value: BachaColorId | null;
  onChange: (id: BachaColorId) => void;
  className?: string;
  /** compact = small swatches for CTA panels */
  size?: "sm" | "md";
  label?: string;
  hint?: string;
};

export function TonePicker({
  value,
  onChange,
  className,
  size = "md",
  label = "Tono",
  hint,
}: Props) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy/40">
        {label}
      </p>
      {hint ? (
        <p className="mt-1.5 text-sm text-navy/50">{hint}</p>
      ) : null}
      <ul
        className={clsx(
          "flex flex-wrap",
          size === "sm" ? "mt-3 gap-2" : "mt-4 gap-3",
        )}
        role="listbox"
        aria-label="Elegir tono"
      >
        {BACHA_COLORS.map((c) => {
          const selected = value === c.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                title={c.label}
                onClick={() => onChange(c.id)}
                className={clsx(
                  "group flex items-center gap-2 text-left transition-opacity duration-300",
                  selected ? "opacity-100" : "opacity-70 hover:opacity-100",
                )}
              >
                <span
                  className={clsx(
                    "shrink-0 border transition-[box-shadow,border-color] duration-300",
                    size === "sm" ? "h-7 w-7" : "h-8 w-8",
                    selected
                      ? "border-navy/50 ring-1 ring-navy/25 ring-offset-2 ring-offset-cream"
                      : "border-navy/10",
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span
                  className={clsx(
                    "text-navy/60",
                    size === "sm" ? "text-[11px]" : "text-xs",
                    selected && "font-medium text-navy",
                  )}
                >
                  {c.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
