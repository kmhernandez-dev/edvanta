/**
 * ============================================================
 *  SiteHeader.jsx — Encabezado único de edvanta.co
 *
 *  Es el mismo en todas las páginas de Edvanta (inicio, cursos,
 *  empleo, herramientas, empresas…). Tiene dos contextos:
 *
 *   · Personal  → Formación · Carrera y empleo · Herramientas · Comunidad
 *   · Empresas  → Inicio · Capacitación · Buscar talento · Aula virtual
 *
 *  La franja superior cambia de contexto y siempre deja a la vista
 *  el acceso al Aula Edvanta. Feliz Sin Tiroides, Vida 360 y
 *  AtenFarmaClinic tienen sus propios encabezados y no usan este.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, MonitorPlay, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { EDVANTA_EMAIL } from '../../config/links';
import { trackEvent } from '../../utils/analytics';
import {
  EMPLEO_GROUPS, EMPRESAS_LINKS, esRutaEmpresas, FORMACION_GROUPS, HERRAMIENTAS_GROUPS,
} from '../../config/navEdvanta';
import GlobalSearch from './GlobalSearch';

// Se reexporta porque el inicio arma con estos grupos su sección de formación.
export { FORMACION_GROUPS };

const MENUS = [
  { id: 'formacion', label: 'Formación', groups: FORMACION_GROUPS, width: 'w-[640px]' },
  { id: 'empleo', label: 'Carrera y empleo', groups: EMPLEO_GROUPS, width: 'w-[660px]' },
  { id: 'herramientas', label: 'Herramientas', groups: HERRAMIENTAS_GROUPS, width: 'w-[640px]' },
];

const NOSOTROS = [
  { label: 'Contacto', href: `mailto:${EDVANTA_EMAIL}` },
  { label: 'Términos y condiciones', to: '/terminos' },
  { label: 'Privacidad', to: '/privacidad' },
];

const NAV_LINK = 'inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-[15px] font-medium transition-colors';

/** ¿La ruta actual pertenece a este menú? Sirve para marcar la sección activa. */
const grupoActivo = (groups, pathname) =>
  groups.some((g) => g.items.some((it) => it.to && (pathname === it.to || pathname.startsWith(`${it.to}/`))));

function MenuItem({ item, onPick }) {
  const Icono = item.icon;
  const body = (
    <>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${item.soon ? 'bg-slate-100 text-slate-400' : 'bg-edvanta-soft text-edvanta-blue group-hover:bg-edvanta-blue group-hover:text-white'}`}>
        <Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-edvanta-deep">
          {item.label}
          {item.soon && <span className="rounded-full bg-edvanta-lilac px-2 py-0.5 text-[10.5px] font-semibold text-[#5E51A8]">Próximamente</span>}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-edvanta-muted">{item.desc}</span>
      </span>
    </>
  );

  if (item.soon) {
    return <div role="menuitem" aria-disabled="true" className="flex items-start gap-3 rounded-xl px-3 py-2.5 opacity-80">{body}</div>;
  }
  return (
    <Link
      role="menuitem"
      to={item.to}
      onClick={() => onPick(item)}
      className="group flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-edvanta-bg focus-visible:bg-edvanta-bg focus-visible:ring-2 focus-visible:ring-edvanta-blue/30"
    >
      {body}
    </Link>
  );
}

export default function SiteHeader() {
  const { user } = useAuth();
  const { count, openCart } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(null);
  const ref = useRef(null);

  const { pathname } = location;
  const empresas = esRutaEmpresas(pathname);

  useEffect(() => { setOpen(null); setMobileOpen(false); }, [pathname, location.search]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(null); setMobileOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open && !mobileOpen) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(null); setMobileOpen(false); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [open, mobileOpen]);

  const toggle = (name) => setOpen((cur) => {
    const next = cur === name ? null : name;
    if (next) trackEvent('nav_click', { item: `${next}_open` });
    return next;
  });

  const pick = (item) => {
    trackEvent('nav_click', { item: item.to });
    setOpen(null);
    setMobileOpen(false);
  };

  // «/empresas» es la portada empresarial: solo está activa en su propia ruta,
  // no en las secciones que cuelgan de ella.
  const activo = (to) => pathname === to || (to !== '/' && to !== '/empresas' && pathname.startsWith(`${to}/`));

  return (
    <header ref={ref} className="sticky top-0 z-50 bg-white">
      {/* Franja Personal / Empresas */}
      <div className="border-b border-edvanta-border bg-edvanta-bg">
        <div className="mx-auto flex h-10 max-w-7xl items-stretch justify-between px-4 sm:px-6 lg:px-8">
          <nav aria-label="Tipo de cuenta" className="flex items-stretch gap-7">
            <Link
              to="/"
              aria-current={empresas ? undefined : 'true'}
              className={`flex items-center border-b-2 text-[13.5px] transition-colors ${empresas ? 'border-transparent font-medium text-edvanta-muted hover:text-edvanta-blue' : 'border-edvanta-blue font-semibold text-edvanta-blue'}`}
            >
              Personal
            </Link>
            <Link
              to="/empresas"
              onClick={() => trackEvent('nav_click', { item: 'empresas_tab' })}
              aria-current={empresas ? 'true' : undefined}
              className={`flex items-center border-b-2 text-[13.5px] transition-colors ${empresas ? 'border-edvanta-blue font-semibold text-edvanta-blue' : 'border-transparent font-medium text-edvanta-muted hover:text-edvanta-blue'}`}
            >
              Empresas
            </Link>
          </nav>
          <div className="relative flex items-center gap-6">
            <Link
              to="/aula"
              onClick={() => trackEvent('nav_click', { item: 'aula_virtual' })}
              className="hidden items-center gap-1.5 text-[13.5px] font-semibold text-edvanta-blue transition-colors hover:text-edvanta-teal sm:inline-flex"
            >
              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
              Aula virtual
            </Link>
            <button
              type="button"
              aria-expanded={open === 'nosotros'}
              aria-haspopup="menu"
              onClick={() => toggle('nosotros')}
              className="inline-flex items-center gap-1.5 text-[13.5px] text-edvanta-muted transition-colors hover:text-edvanta-blue"
            >
              Sobre nosotros
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === 'nosotros' ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {open === 'nosotros' && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-edvanta-border bg-white p-1.5 shadow-[0_12px_32px_rgba(23,34,59,.10)]">
                {NOSOTROS.map((n) => (n.href ? (
                  <a key={n.label} role="menuitem" href={n.href} className="block rounded-lg px-3 py-2 text-sm text-edvanta-deep hover:bg-edvanta-bg">{n.label}</a>
                ) : (
                  <Link key={n.label} role="menuitem" to={n.to} className="block rounded-lg px-3 py-2 text-sm text-edvanta-deep hover:bg-edvanta-bg">{n.label}</Link>
                )))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="border-b border-edvanta-border bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link to={empresas ? '/empresas' : '/'} className="shrink-0" aria-label="Edvanta, ir al inicio">
            <img src="/img/logo-edvanta.png" alt="Edvanta" width="931" height="512" className="h-11 w-auto sm:h-[52px]" />
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 xl:flex">
            {empresas ? (
              EMPRESAS_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => trackEvent('nav_click', { item: l.to })}
                  aria-current={activo(l.to) ? 'page' : undefined}
                  className={`${NAV_LINK} ${activo(l.to) ? 'bg-edvanta-soft font-semibold text-edvanta-blue' : 'text-edvanta-deep hover:bg-edvanta-bg'}`}
                >
                  {l.label}
                </Link>
              ))
            ) : (
              <>
                <Link to="/" aria-current={pathname === '/' ? 'page' : undefined} className={`${NAV_LINK} ${pathname === '/' ? 'font-semibold text-edvanta-blue' : 'text-edvanta-deep hover:bg-edvanta-bg'}`}>
                  Inicio
                </Link>
                {MENUS.map((m) => {
                  const enSeccion = grupoActivo(m.groups, pathname);
                  return (
                    <div key={m.id} className="relative">
                      <button
                        type="button"
                        aria-expanded={open === m.id}
                        aria-haspopup="menu"
                        aria-controls={`menu-${m.id}`}
                        onClick={() => toggle(m.id)}
                        className={`${NAV_LINK} ${open === m.id || enSeccion ? 'bg-edvanta-soft font-semibold text-edvanta-blue' : 'text-edvanta-deep hover:bg-edvanta-bg'}`}
                      >
                        {m.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open === m.id ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                      {open === m.id && (
                        <div
                          id={`menu-${m.id}`}
                          role="menu"
                          aria-label={`Opciones de ${m.label}`}
                          className={`hx-menu absolute left-0 top-full z-50 mt-2 ${m.width} rounded-2xl border border-edvanta-border bg-white p-3 shadow-[0_18px_44px_rgba(23,34,59,.14)]`}
                        >
                          <div className="grid grid-cols-2 gap-x-2">
                            {m.groups.map((g) => (
                              <div key={g.title}>
                                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">{g.title}</p>
                                {g.items.map((it) => <MenuItem key={it.label} item={it} onPick={pick} />)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <Link
                  to="/comunidad"
                  onClick={() => trackEvent('nav_click', { item: 'comunidad' })}
                  aria-current={activo('/comunidad') ? 'page' : undefined}
                  className={`${NAV_LINK} ${activo('/comunidad') ? 'bg-edvanta-soft font-semibold text-edvanta-blue' : 'text-edvanta-deep hover:bg-edvanta-bg'}`}
                >
                  Comunidad
                </Link>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <GlobalSearch className="h-11" />

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-edvanta-deep transition-colors hover:bg-edvanta-bg"
              aria-label={count > 0 ? `Abrir carrito, ${count} artículos` : 'Abrir carrito'}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              {count > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-edvanta-teal px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>

            {user ? (
              <Link to="/app" className="hidden h-12 items-center gap-2 rounded-xl bg-edvanta-soft px-5 text-[15px] font-semibold text-edvanta-blue transition-colors hover:bg-edvanta-light lg:inline-flex">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Mi Edvanta
              </Link>
            ) : (
              <>
                <Link to="/cuenta" className="hidden text-[15px] font-semibold text-edvanta-blue hover:text-edvanta-teal lg:inline-flex">Acceder</Link>
                <Link
                  to="/cuenta?modo=registro"
                  onClick={() => trackEvent('nav_click', { item: 'crear_cuenta' })}
                  className="hidden h-12 items-center rounded-xl bg-edvanta-blue px-5 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:-translate-y-px hover:bg-edvanta-bluedark lg:inline-flex"
                >
                  Crear cuenta gratis
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-edvanta-deep hover:bg-edvanta-bg xl:hidden"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto border-b border-edvanta-border bg-white px-4 pb-6 pt-2 shadow-lg xl:hidden">
          {empresas ? (
            EMPRESAS_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-edvanta-deep">
                {l.label}
              </Link>
            ))
          ) : (
            <>
              <Link to="/" className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-edvanta-blue">Inicio</Link>
              {MENUS.map((m) => (
                <div key={m.id}>
                  <button
                    type="button"
                    onClick={() => setMobileMenu((v) => (v === m.id ? null : m.id))}
                    aria-expanded={mobileMenu === m.id}
                    className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-base font-medium text-edvanta-deep"
                  >
                    {m.label}
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileMenu === m.id ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {mobileMenu === m.id && (
                    <div className="mb-2 rounded-2xl bg-edvanta-bg p-1.5">
                      {m.groups.map((g) => (
                        <div key={g.title}>
                          <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">{g.title}</p>
                          {g.items.map((it) => <MenuItem key={it.label} item={it} onPick={pick} />)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/comunidad" className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-edvanta-deep">Comunidad</Link>
              <Link to="/empresas" className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-edvanta-deep">Para empresas</Link>
            </>
          )}
          <Link to="/aula" className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-medium text-edvanta-blue">
            <MonitorPlay className="h-5 w-5" aria-hidden="true" />
            Aula virtual
          </Link>
          <Link to="/buscar" className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-medium text-edvanta-deep">
            <Search className="h-5 w-5" aria-hidden="true" />
            Buscar en Edvanta
          </Link>
          <div className="mt-3 flex gap-3">
            {user ? (
              <Link to="/app" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Mi Edvanta
              </Link>
            ) : (
              <>
                <Link to="/cuenta" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-edvanta-border px-5 text-sm font-semibold text-edvanta-blue">Acceder</Link>
                <Link to="/cuenta?modo=registro" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white">Crear cuenta gratis</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
