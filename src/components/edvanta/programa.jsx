/**
 * ============================================================
 *  programa.jsx — Encabezado y pie de los programas de Edvanta
 *
 *  Feliz Sin Tiroides y AtenFarmaClinic son programas de Edvanta, no
 *  sitios aparte: llevan el encabezado y el pie de edvanta.co, con la
 *  misma paleta, letra y botones. Lo propio de cada programa va en dos
 *  piezas:
 *
 *   BarraDePrograma  bajo el encabezado: su nombre y sus secciones. No
 *                    se queda fija; al bajar, solo queda el encabezado
 *                    de Edvanta. En el celular el nombre va arriba y las
 *                    secciones se deslizan de lado.
 *   PieDePrograma    antes del pie de Edvanta: quién lo hace, cómo
 *                    escribir, sus secciones y su aviso.
 *
 *  Las secciones y los contactos están en config/navProgramas.js.
 * ============================================================
 */

import { Link, useLocation } from 'react-router-dom';
import { AtSign, Mail, MessageCircle, Share2, Users } from 'lucide-react';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';
import { Btn, Eyebrow } from './ui';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const sinAncla = (to) => to.split(/[?#]/)[0];

/**
 * La sección en la que se está: la de dirección más larga que coincide
 * (en /academia/retos/caminar es «Retos», no «Academia»). Las que
 * llevan ancla (#ebooks) son partes de otra página y nunca se marcan.
 */
export function seccionActiva(enlaces, pathname) {
  let actual = null;
  for (const l of enlaces) {
    if (l.to.includes('#')) continue;
    const base = sinAncla(l.to);
    const coincide = pathname === base || pathname.startsWith(`${base}/`);
    if (coincide && (!actual || base.length > sinAncla(actual.to).length)) actual = l;
  }
  return actual;
}

function Logo({ programa, className = '' }) {
  // Sin imagen, la sigla del programa en una ficha de marca (Vida 360 Pro).
  if (!programa.logo) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white ${className}`}
        style={{ background: 'var(--ds-grad-navy)' }}
        aria-hidden="true"
      >
        {programa.sigla}
      </span>
    );
  }
  return (
    <img
      src={programa.logo}
      alt=""
      width="40"
      height="40"
      className={`shrink-0 rounded-xl bg-white ring-1 ring-edvanta-border ${programa.logoContenido ? 'object-contain' : 'object-cover'} ${className}`}
    />
  );
}

export function BarraDePrograma({ programa }) {
  const { pathname, hash } = useLocation();
  const activa = seccionActiva(programa.enlaces, pathname);

  // Un segundo clic en la misma ancla no cambia la dirección y no movería
  // la página: se baja a mano.
  const alPulsar = (l) => (e) => {
    trackEvent('nav_click', { item: l.to, programa: programa.id });
    const [ruta, ancla] = l.to.split('#');
    if (ancla && ruta === pathname && hash === `#${ancla}`) {
      const el = document.getElementById(ancla);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  };

  return (
    <div className="border-b border-edvanta-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:gap-6">
        <div className="flex items-center justify-between gap-3 pt-3 xl:py-3">
          <Link to={programa.inicio} className="flex min-w-0 items-center gap-3" aria-label={`${programa.nombre}, inicio del programa`}>
            <Logo programa={programa} className="h-10 w-10" />
            <span className="min-w-0 xl:max-w-[13.5rem]">
              <span className="block truncate font-display text-[15px] font-extrabold leading-tight text-edvanta-deep">{programa.nombre}</span>
              <span className="block truncate text-xs text-edvanta-muted">{programa.lema}</span>
            </span>
          </Link>
          {programa.accion && (
            <Btn to={programa.accion.to} variant="secondary" size="sm" className="shrink-0 xl:hidden" onClick={() => trackEvent('nav_click', { item: programa.accion.to, programa: programa.id })}>
              {programa.accion.label}
            </Btn>
          )}
        </div>

        <nav
          aria-label={`Secciones de ${programa.nombre}`}
          className="-mx-4 flex gap-1 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:mx-0 xl:ml-auto xl:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {programa.enlaces.map((l) => {
            const actual = activa === l;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={alPulsar(l)}
                aria-current={actual ? 'page' : undefined}
                className={`inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full px-3.5 text-sm transition-colors xl:px-3 ${actual ? 'bg-edvanta-soft font-semibold text-edvanta-blue' : 'font-medium text-edvanta-muted hover:bg-edvanta-bg hover:text-edvanta-deep'}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {programa.accion && (
          <Btn to={programa.accion.to} variant="primary" size="sm" className="hidden shrink-0 xl:inline-flex" onClick={() => trackEvent('nav_click', { item: programa.accion.to, programa: programa.id })}>
            {programa.accion.label}
          </Btn>
        )}
      </div>
    </div>
  );
}

/** El encabezado de Edvanta con la barra del programa debajo. */
export function EncabezadoDePrograma({ programa }) {
  return (
    <>
      <SiteHeader />
      <BarraDePrograma programa={programa} />
    </>
  );
}

/**
 * La franja del programa y el pie de Edvanta. `alContactar(canal)` deja
 * registrar cada contacto como lo hacía el pie anterior.
 */
export function PieDePrograma({ programa, id, aviso, alContactar }) {
  const pie = programa.pie;
  const avisar = (canal) => () => {
    trackEvent('program_contact_click', { programa: programa.id, canal });
    alContactar?.(canal);
  };
  const contactos = [
    pie.comunidad && { canal: 'comunidad', label: 'Comunidad', href: pie.comunidad, icon: Users },
    pie.whatsapp && { canal: 'whatsapp', label: 'WhatsApp', href: waLink(pie.whatsapp), icon: MessageCircle },
    pie.correo && { canal: 'correo', label: 'Correo', href: `mailto:${pie.correo}`, icon: Mail, propio: true },
    pie.instagram && { canal: 'instagram', label: 'Instagram', href: pie.instagram, icon: AtSign },
    pie.linkedin && { canal: 'linkedin', label: 'LinkedIn', href: pie.linkedin, icon: Share2 },
  ].filter(Boolean);
  const textoDelAviso = aviso || pie.aviso;

  return (
    <>
      <section id={id} aria-label={`Sobre ${programa.nombre}`} className="ds-surface-navy relative scroll-mt-28 overflow-hidden text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <Logo programa={programa} className="h-12 w-12 ring-white/30" />
                <div>
                  <p className="font-display text-lg font-extrabold leading-tight">{programa.nombre}</p>
                  <p className="text-sm text-white/70">Un programa de Edvanta</p>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/80">{pie.texto}</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {contactos.map((c) => (
                  <Btn
                    key={c.canal}
                    href={c.href}
                    external={!c.propio}
                    variant="outline-white"
                    size="sm"
                    icon={c.icon}
                    onClick={avisar(c.canal)}
                  >
                    {c.label}
                  </Btn>
                ))}
              </div>
            </div>
            <nav aria-label={`Más de ${programa.nombre}`}>
              <Eyebrow tone="white">Explora el programa</Eyebrow>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {pie.enlaces.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-flex min-h-8 items-center text-[15px] text-white/80 transition-colors hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {textoDelAviso && (
            <p className="mt-10 rounded-2xl border border-white/15 bg-white/[.06] p-4 text-[13px] leading-6 text-white/75">
              <strong className="text-white">Aviso:</strong> {textoDelAviso}
            </p>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
