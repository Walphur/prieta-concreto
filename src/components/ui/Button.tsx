import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-sage text-white hover:bg-sage-dark",
  secondary:
    "bg-navy text-cream hover:bg-navy-soft",
  outline:
    "border border-navy/20 text-navy hover:border-navy/45 hover:text-navy bg-transparent",
  ghost: "text-navy/70 hover:text-navy bg-transparent",
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
    "interactive inline-flex min-h-11 items-center justify-center px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] no-underline hover:no-underline",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const external = /^https?:\/\//.test(props.href);
    if (external) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
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
