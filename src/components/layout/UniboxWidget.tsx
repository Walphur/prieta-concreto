"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function UniboxWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Script
      src="https://unibox-production-7780.up.railway.app/widget.js"
      strategy="afterInteractive"
      data-unibox="w__x9ZFH94xxS47WX0Y-kv7g"
    />
  );
}
