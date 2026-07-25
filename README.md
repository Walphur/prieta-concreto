# Prieta Concreto

E-commerce headless (custom) para el estudio artesanal **Prieta Concreto** — bachas, celosías y mesadas de concreto. San Luis, Argentina.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (paleta de marca en `globals.css`)
- **Zustand** (carrito persistente)
- Próximo: **Prisma + Postgres**, fotos reales, **Uploadthing/Firebase** (reseñas)

## Arquitectura elegida

Enfoque **custom** (no Shopify/WooCommerce en esta etapa):

| Capa | Decisión |
|------|----------|
| Catálogo / stock | Mock tipado → migrar a Prisma + Postgres + panel admin |
| Carrito | Zustand + `localStorage` |
| Pagos | Transferencia bancaria (alias/CBU) + aviso por WhatsApp |
| Envíos | Coordinación manual (San Luis y alrededores) |
| Reseñas + fotos | Formulario listo; storage externo (Uploadthing o Firebase) |

## Desarrollo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Admin de piezas

- URL: `/admin`
- Clave por defecto: `prieta2026` (cambiar con `ADMIN_PASSWORD` en `.env.local`)
- Crear piezas únicas, poner en stock, marcar vendidas
- Catálogo en `data/products.json`
- Precio fijo bachas: **$80.000**

## Paleta

- Sage `#7D8F78` — CTA / acentos
- Deep Red `#8B3A3A` — precios
- Navy `#1A2332` — texto / secciones oscuras
- Concrete `#D8D4CE` — superficies
- Cream `#F7F5F2` — fondo base

## Logo

- Original: `public/logo-prieta-original.png`
- Isotipo claro (fondo transparente): `public/logo-prieta.png`
