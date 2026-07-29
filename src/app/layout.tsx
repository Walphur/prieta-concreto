import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { MemberProvider } from "@/components/member/MemberProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteDescription =
  "Bachas artesanales de concreto en San Luis. Pedidos a medida por modelo y color, demora aprox. 15 días. Envíos a toda la Argentina por Andesmar Cargas.";

export const metadata: Metadata = {
  metadataBase: new URL("https://prietaconcreto.shop"),
  title: {
    default: "Prieta Concreto | Bachas artesanales de concreto",
    template: "%s | Prieta Concreto",
  },
  description: siteDescription,
  keywords: [
    "bachas de concreto",
    "bacha artesanal",
    "San Luis",
    "Prieta Concreto",
    "bacha por pedido",
    "baño de diseño",
    "concreto pigmentado",
    "Andesmar Cargas",
  ],
  authors: [{ name: "Prieta Concreto" }],
  creator: "Prieta Concreto",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prieta Concreto | Bachas artesanales de concreto",
    description: siteDescription,
    url: "https://prietaconcreto.shop",
    siteName: "Prieta Concreto",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/gallery/clientes/cliente-circular-gris.jpg",
        width: 1200,
        height: 800,
        alt: "Bacha de concreto Prieta en baño de diseño",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prieta Concreto | Bachas artesanales",
    description: siteDescription,
    images: ["/gallery/clientes/cliente-circular-gris.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-prieta.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${dmSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="site-mineral flex min-h-full flex-col text-navy">
        <MemberProvider>
          <JsonLd />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
        </MemberProvider>
      </body>
    </html>
  );
}
