import type { MetadataRoute } from "next";
import { readProducts } from "@/lib/catalog";

const BASE = "https://prietaconcreto.shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await readProducts();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/tienda`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/inspiracion`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => !p.comingSoon)
    .map((p) => ({
      url: `${BASE}/producto/${p.slug}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...productPages];
}
