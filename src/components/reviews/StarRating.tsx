"use client";

import { clsx } from "clsx";

type Props = {
  value: number;
  onChange?: (n: 1 | 2 | 3 | 4 | 5) => void;
  size?: "sm" | "md";
  className?: string;
};

export function StarRating({ value, onChange, size = "md", className }: Props) {
  const interactive = typeof onChange === "function";
  const px = size === "sm" ? "text-base" : "text-xl";

  return (
    <div
      className={clsx("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${value} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <span
            className={clsx(
              px,
              filled ? "text-deep-red" : "text-concrete",
              interactive && "cursor-pointer transition hover:scale-110",
            )}
            aria-hidden
          >
            ★
          </span>
        );

        if (!interactive) return <span key={n}>{star}</span>;

        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} estrellas`}
            onClick={() => onChange(n as 1 | 2 | 3 | 4 | 5)}
            className="bg-transparent p-0.5"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
