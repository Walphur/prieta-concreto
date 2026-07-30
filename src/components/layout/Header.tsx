"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { PrietaLogo } from "@/components/brand/PrietaLogo";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MemberAccess } from "@/components/member/MemberAccess";

const nav = [
  { href: "/tienda", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/inspiracion", label: "Inspiración" },
];

/** Trolley cart — upright handle, trapezoid basket, two wheels (ref right icon). */
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 6.5H7.5V17.5H16L18 6.5H7.5" />
      <circle cx="10" cy="20.25" r="1.4" />
      <circle cx="15.25" cy="20.25" r="1.4" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const count = mounted ? totalItems() : 0;

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 border-b transition-all duration-700 ease-editorial",
          scrolled
            ? "border-navy/10 bg-cream/95 backdrop-blur-sm"
            : "border-transparent bg-cream",
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 overflow-x-clip px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 shrink">
            <PrietaLogo size="md" intro className="origin-left max-sm:scale-[0.92]" />
          </div>

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Principal">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "chip interactive inline-flex min-h-10 items-center px-3 py-1.5 text-sm tracking-wide no-underline hover:no-underline",
                    active
                      ? "chip--active"
                      : "chip--idle font-medium text-navy/70",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <MemberAccess className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center text-navy transition-colors hover:text-sage-dark"
              aria-label={`Carrito${count ? `, ${count} artículos` : ""}`}
            >
              <CartIcon className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sage px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-navy md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={1.75} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        <div
          className={clsx(
            "overflow-hidden border-t border-concrete/60 bg-cream transition-[max-height,opacity] duration-300 md:hidden",
            mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Móvil">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "chip interactive inline-flex min-h-11 items-center px-3 py-3 text-sm tracking-wide no-underline hover:no-underline",
                    active
                      ? "chip--active"
                      : "chip--idle font-medium text-navy/75",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-concrete/60 px-3 pt-2 sm:hidden">
              <MemberAccess
                className="inline-flex py-2 text-sm"
                onOpen={() => setMobileOpen(false)}
              />
            </div>
          </nav>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
