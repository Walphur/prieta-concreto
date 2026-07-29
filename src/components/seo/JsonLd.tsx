export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://prietaconcreto.shop/#organization",
        name: "Prieta Concreto",
        url: "https://prietaconcreto.shop",
        logo: "https://prietaconcreto.shop/logo-prieta.png",
        description:
          "Estudio artesanal de bachas de concreto en San Luis, Argentina. Pedidos a medida por modelo y color.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "San Luis",
          addressCountry: "AR",
        },
        areaServed: "AR",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": "https://prietaconcreto.shop/#website",
        url: "https://prietaconcreto.shop",
        name: "Prieta Concreto",
        publisher: { "@id": "https://prietaconcreto.shop/#organization" },
        inLanguage: "es-AR",
      },
      {
        "@type": "Store",
        "@id": "https://prietaconcreto.shop/#store",
        name: "Prieta Concreto",
        url: "https://prietaconcreto.shop/tienda",
        image: "https://prietaconcreto.shop/gallery/clientes/cliente-circular-gris.jpg",
        priceRange: "$$$",
        currenciesAccepted: "ARS",
        paymentAccepted: "Bank Transfer",
        address: {
          "@type": "PostalAddress",
          addressLocality: "San Luis",
          addressCountry: "AR",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
