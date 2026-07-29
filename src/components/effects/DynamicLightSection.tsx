import type { ReactNode } from "react";
import { clsx } from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Bloque CTA navy limpio — sin linterna, rAF ni filtros.
 */
export function DynamicLightSection({ children, className }: Props) {
  return (
    <section className={clsx("relative bg-navy", className)}>{children}</section>
  );
}
