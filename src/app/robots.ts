import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/checkout", "/pedido/"],
      },
    ],
    sitemap: "https://prietaconcreto.shop/sitemap.xml",
    host: "https://prietaconcreto.shop",
  };
}
