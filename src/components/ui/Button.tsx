import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-sage text-white hover:bg-sage-dark shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  secondary:
    "bg-navy text-cream hover:bg-navy-soft",
  outline:
    "border border-navy/25 text-navy hover:border-sage hover:text-sage-dark bg-transparent",
  ghost: "text-navy/80 hover:text-sage-dark bg-transparent",
};

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonAsButton = BaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    children,
    className,
    variant = "primary",
    ...rest
  } = props;

  const classes = clsx(
    "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ComponentProps<"button">;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
