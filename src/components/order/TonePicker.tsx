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
  /** Show selected tone name once under the swatches */
  showSelectedLabel?: boolean;
};

export function TonePicker({
  value,
  onChange,
  className,
  size = "md",
  label = "Tono",
  hint,
  showSelectedLabel = true,
}: Props) {
  const selectedLabel =
    BACHA_COLORS.find((c) => c.id === value)?.label ?? null;

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
          size === "sm" ? "mt-3 gap-2" : "mt-4 gap-2.5",
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
                aria-label={c.label}
                title={c.label}
                onClick={() => onChange(c.id)}
                className={clsx(
                  "block shrink-0 border transition-[box-shadow,border-color,opacity] duration-300",
                  size === "sm" ? "h-7 w-7" : "h-9 w-9",
                  selected
                    ? "border-navy/50 opacity-100 ring-1 ring-navy/25 ring-offset-2 ring-offset-cream"
                    : "border-navy/10 opacity-80 hover:opacity-100",
                )}
                style={{ backgroundColor: c.hex }}
              />
            </li>
          );
        })}
      </ul>
      {showSelectedLabel && selectedLabel ? (
        <p className="mt-2.5 text-xs text-navy/55">{selectedLabel}</p>
      ) : null}
    </div>
  );
}
