import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure catalog JSON ships with serverless routes that read/write it at runtime.
  outputFileTracingIncludes: {
    "/api/admin/sync-catalog": ["./data/products.json"],
    "/api/products": ["./data/products.json"],
    "/api/products/[id]": ["./data/products.json"],
    "/api/health": ["./data/products.json"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/producto/ejemplo-gris-natural",
        destination: "/producto/lena",
        permanent: true,
      },
      {
        source: "/producto/ejemplo-gris-oscuro",
        destination: "/producto/atria",
        permanent: true,
      },
      {
        source: "/producto/ejemplo-rosa",
        destination: "/producto/atria",
        permanent: true,
      },
      {
        source: "/producto/ejemplo-verde-agua",
        destination: "/producto/lena",
        permanent: true,
      },
      {
        source: "/producto/ejemplo-marmolado",
        destination: "/producto/lena",
        permanent: true,
      },
      {
        source: "/producto/ejemplo-blanco",
        destination: "/producto/forma",
        permanent: true,
      },
      {
        source: "/producto/ejemplo-negro",
        destination: "/producto/lena",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
