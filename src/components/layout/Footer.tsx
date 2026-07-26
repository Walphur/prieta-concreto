import Link from "next/link";
import { PrietaLogo } from "@/components/brand/PrietaLogo";
import { whatsappGeneralUrl } from "@/lib/bank";

export function Footer() {
  return (
    <footer className="texture-concrete-dark mt-auto text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <PrietaLogo size="md" variant="dark" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Estudio artesanal en San Luis. Bachas de concreto, y pronto celosías
            y mesadas. Envíos a toda la Argentina por Andesmar Cargas.
          </p>
        </div>

        <div>
          <h3 className="font-[family-name:var(--font-outfit)] text-sm font-semibold tracking-wide text-cream">
            Explorar
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>
              <Link href="/tienda" className="transition hover:text-sage-light">
                Tienda
              </Link>
            </li>
            <li>
              <Link
                href="/nosotros"
                className="transition hover:text-sage-light"
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/inspiracion"
                className="transition hover:text-sage-light"
              >
                Inspiración
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-[family-name:var(--font-outfit)] text-sm font-semibold tracking-wide text-cream">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>San Luis, Argentina</li>
            <li>Envíos a todo el país · Andesmar Cargas</li>
            <li>
              <a
                href={whatsappGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-sage-light"
              >
                WhatsApp 2665 031950
              </a>
            </li>
            <li>
              <a
                href="mailto:hola@prietaconcreto.com"
                className="transition hover:text-sage-light"
              >
                hola@prietaconcreto.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-cream/45 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Prieta Concreto. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
