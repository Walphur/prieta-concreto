"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { clsx } from "clsx";
import { PrietaLogo } from "@/components/brand/PrietaLogo";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MemberAccess } from "@/components/member/MemberAccess";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/inspiracion", label: "Inspiración" },
];

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
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <PrietaLogo size="md" />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative text-sm font-medium tracking-wide transition-colors duration-300",
                    active ? "text-sage-dark" : "text-navy/75 hover:text-navy",
                  )}
                >
                  {item.label}
                  <span
                    className={clsx(
                      "absolute -bottom-1 left-0 h-px w-full origin-left bg-sage transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
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
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
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
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-concrete-light text-sage-dark"
                      : "text-navy/80 hover:bg-cream-dark",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-concrete/60 px-3 pt-2 sm:hidden">
              <MemberAccess className="inline-flex py-2 text-sm" />
            </div>
          </nav>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
