/**
 * ============================================================
 *  SiteFooter.jsx — Pie de página único de edvanta.co
 *
 *  Organizado por proceso (fórmate, trabaja, empresas, ecosistema)
 *  para que desde cualquier página se llegue a la landing correcta.
 * ============================================================
 */

import { Link } from 'react-router-dom';
import { Mail, MessageCircle, MonitorPlay } from 'lucide-react';
import {
  EDVANTA_BRAND_FULL, EDVANTA_EMAIL, EDVANTA_LINKEDIN_URL, EDVANTA_WHATSAPP_URL,
} from '../../config/links';
import { FOOTER_COLUMNS, FOOTER_LEGAL } from '../../config/navEdvanta';

const logoVersion = '20260716-edvanta-logo';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="border-t border-edvanta-border bg-edvanta-bg">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
          {/* Marca */}
          <div>
            <img
              src={`/img/logo-edvanta-wordmark.png?v=${logoVersion}`}
              alt="Edvanta"
              className="h-9 w-auto"
              width="901"
              height="162"
              loading="lazy"
            />
            <p className="mt-4 max-w-sm text-sm leading-6 text-edvanta-muted">
              Plataforma profesional farmacéutica: formación con aula virtual, empleo, talento y
              herramientas para tu carrera y para los equipos de las empresas del sector.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={EDVANTA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-teal/50 hover:text-edvanta-tealdark"
              >
                <MessageCircle className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />
                WhatsApp
              </a>
              {EDVANTA_EMAIL && (
                <a
                  href={`mailto:${EDVANTA_EMAIL}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"
                >
                  <Mail className="h-4 w-4 text-edvanta-blue" aria-hidden="true" />
                  Escríbenos
                </a>
              )}
              {EDVANTA_LINKEDIN_URL && (
                <a
                  href={EDVANTA_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Edvanta en LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-edvanta-border bg-white text-edvanta-blue transition hover:border-edvanta-blue/40"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </div>
            <Link
              to="/aula"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark"
            >
              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
              Entrar al aula virtual
            </Link>
          </div>

          {/* Columnas por proceso */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-edvanta-muted">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-edvanta-deep transition-colors hover:text-edvanta-blue">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 space-y-4 border-t border-edvanta-border pt-6">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="text-xs text-edvanta-muted transition-colors hover:text-edvanta-blue">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="max-w-4xl text-xs leading-relaxed text-edvanta-subtle">
            Algunos enlaces pueden corresponder a cursos afiliados de plataformas educativas. La disponibilidad,
            las condiciones del certificado y los precios pueden variar según la plataforma. Edvanta no dicta ni
            certifica esos cursos.
          </p>
          <p className="text-xs text-edvanta-subtle">© {year} {EDVANTA_BRAND_FULL}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
