/**
 * ============================================================
 *  SiteHeader.jsx — Encabezado único de edvanta.co
 *
 *  Es el mismo en todas las páginas de Edvanta. La franja de arriba
 *  elige el público —Profesionales · Pacientes · Instituciones, la
 *  heredera de la franja Personal / Empresas— y la barra principal
 *  cambia con esa elección:
 *
 *    Profesionales → Escuelas ▾ · Cursos · Guías y recursos ▾ · Artículos
 *    Pacientes     → Edvanta Contigo · Salud tiroidea · Artículos · Guías
 *    Instituciones → Qué ofrecemos · Paquetes · Talento · Propuesta
 *
 *  A la derecha de la franja quedan Sobre Edvanta, Contacto y el Aula. Feliz Sin Tiroides, Vida 360 y AtenFarmaClinic
 *  tienen sus propios encabezados y no usan este.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, MonitorPlay, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { trackEvent } from '../../utils/analytics';
import {
  ESCUELAS_GROUPS, MAIN_LINKS, NAV_INSTITUCIONES, NAV_PACIENTES, PUBLICOS_NAV, RECURSOS_GROUPS, TOP_LINKS, contextoDe,
} from '../../config/navEdvanta';
import GlobalSearch from './GlobalSearch';

const MENUS = {
  escuelas: { id: 'escuelas', label: 'Escuelas', groups: ESCUELAS_GROUPS, width: 'w-[440px]', cols: 1, all: { label: 'Ver las cuatro escuelas', to: '/escuelas' } },
  recursos: { id: 'recursos', label: 'Guías y recursos', groups: RECURSOS_GROUPS, width: 'w-[640px]', cols: 2 },
};

const NAV_LINK = 'inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[15px] font-medium transition-colors';
const ON = 'bg-edvanta-soft font-semibold text-edvanta-blue';
const OFF = 'text-edvanta-deep hover:bg-edvanta-bg';

/** ¿La ruta actual pertenece a este menú? Sirve para marcar la sección activa. */
const grupoActivo = (menu, pathname) =>
  (menu.all && (pathname === menu.all.to || pathname.startsWith(`${menu.all.to}/`)))
  || menu.groups.some((g) => g.items.some((it) => it.to && (pathname === it.to || pathname.startsWith(`${it.to}/`))));

function MenuItem({ item, onPick }) {
  const Icono = item.icon;
  return (
    <Link
      role="menuitem"
      to={item.to}
      onClick={() => onPick(item)}
      className="group flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-edvanta-bg focus-visible:bg-edvanta-bg focus-visible:ring-2 focus-visible:ring-edvanta-blue/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-edvanta-soft text-edvanta-blue transition-colors group-hover:bg-edvanta-blue group-hover:text-white">
        <Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-edvanta-deep">{item.label}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-edvanta-muted">{item.desc}</span>
      </span>
    </Link>
  );
}

function DesktopMenu({ menu, open, onToggle, onPick, pathname }) {
  const abierto = open === menu.id;
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-controls={`menu-${menu.id}`}
        onClick={() => onToggle(menu.id)}
        className={`${NAV_LINK} ${abierto || grupoActivo(menu, pathname) ? ON : OFF}`}
      >
        {menu.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {abierto && (
        <div
          id={`menu-${menu.id}`}
          role="menu"
          aria-label={`Opciones de ${menu.label}`}
          className={`hx-menu absolute left-0 top-full z-50 mt-2 ${menu.width} rounded-2xl border border-edvanta-border bg-white p-3 shadow-[0_18px_44px_rgba(23,34,59,.14)]`}
        >
          <div className={menu.cols === 2 ? 'grid grid-cols-2 gap-x-2' : ''}>
            {menu.groups.map((g) => (
              <div key={g.title}>
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">{g.title}</p>
                {g.items.map((it) => <MenuItem key={it.label} item={it} onPick={onPick} />)}
              </div>
            ))}
          </div>
          {menu.all && (
            <Link
              role="menuitem"
              to={menu.all.to}
              onClick={() => onPick(menu.all)}
              className="mt-1 flex items-center justify-between border-t border-edvanta-border px-3 pb-1 pt-3 text-sm font-semibold text-edvanta-blue hover:text-edvanta-teal"
            >
              {menu.all.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </div>
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

  const activo = (to) => pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));

  const enlace = (l) => (
    <Link
      key={l.to}
      to={l.to}
      onClick={() => trackEvent('nav_click', { item: l.to })}
      aria-current={activo(l.to) ? 'page' : undefined}
      className={`${NAV_LINK} ${activo(l.to) ? ON : OFF}`}
    >
      {l.label}
    </Link>
  );

  const [cursos, articulos] = MAIN_LINKS;
  const contexto = contextoDe(pathname);
  const enlacesDelContexto = contexto === 'pacientes' ? NAV_PACIENTES : contexto === 'instituciones' ? NAV_INSTITUCIONES : null;
  const sinQuery = (to) => to.split(/[?#]/)[0];
  const activoEn = (to) => (to.includes('#') ? false : activo(sinQuery(to)));
  const enlaceSimple = (l) => (
    <Link
      key={l.to}
      to={l.to}
      onClick={() => trackEvent('nav_click', { item: l.to })}
      aria-current={activoEn(l.to) ? 'page' : undefined}
      className={`${NAV_LINK} ${activoEn(l.to) ? ON : OFF}`}
    >
      {l.label}
    </Link>
  );

  return (
    <header ref={ref} className="sticky top-0 z-50 bg-white">
      {/* Franja superior */}
      <div className="border-b border-edvanta-border bg-edvanta-bg">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <nav aria-label="Público" className="flex h-full min-w-0 items-stretch gap-3 overflow-x-auto [scrollbar-width:none] sm:gap-7 [&::-webkit-scrollbar]:hidden">
            {PUBLICOS_NAV.map((p) => {
              const actual = contexto === p.id;
              return (
                <Link
                  key={p.id}
                  to={p.to}
                  onClick={() => trackEvent('nav_click', { item: `publico_${p.id}` })}
                  aria-current={actual ? 'true' : undefined}
                  className={`flex shrink-0 items-center border-b-2 text-[12.5px] transition-colors sm:text-[13.5px] ${actual ? 'border-edvanta-blue font-semibold text-edvanta-blue' : 'border-transparent font-medium text-edvanta-muted hover:text-edvanta-blue'}`}
                >
                  {p.label}
                </Link>
              );
            })}
          </nav>
          <nav aria-label="Edvanta" className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            {TOP_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={activo(l.to) ? 'page' : undefined}
                className={`hidden text-[13.5px] transition-colors hover:text-edvanta-blue md:inline ${activo(l.to) ? 'font-semibold text-edvanta-blue' : 'text-edvanta-muted'}`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/aula"
              onClick={() => trackEvent('nav_click', { item: 'aula_virtual' })}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-edvanta-blue transition-colors hover:text-edvanta-teal"
            >
              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Aula virtual</span>
              <span className="sr-only sm:hidden">Aula virtual</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Barra principal */}
      <div className="border-b border-edvanta-border bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0" aria-label="Edvanta, ir al inicio">
            <img src="/img/logo-edvanta.png" alt="Edvanta" width="931" height="512" className="h-11 w-auto sm:h-[52px]" />
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 xl:flex">
            {enlacesDelContexto ? enlacesDelContexto.map(enlaceSimple) : (
              <>
                <DesktopMenu menu={MENUS.escuelas} open={open} onToggle={toggle} onPick={pick} pathname={pathname} />
                {enlace(cursos)}
                <DesktopMenu menu={MENUS.recursos} open={open} onToggle={toggle} onPick={pick} pathname={pathname} />
                {enlace(articulos)}
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
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
              <Link to="/aula" className="hidden h-12 items-center gap-2 rounded-xl bg-edvanta-soft px-5 text-[15px] font-semibold text-edvanta-blue transition-colors hover:bg-edvanta-light lg:inline-flex">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Mi aula
              </Link>
            ) : (
              <Link
                to="/cuenta"
                onClick={() => trackEvent('nav_click', { item: 'acceder' })}
                className="ed-btn ed-btn--primary hidden lg:inline-flex"
              >
                Acceder
              </Link>
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
          <Link to="/" className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-edvanta-blue">Inicio</Link>
          {enlacesDelContexto && (
            <div className="mb-2 rounded-2xl bg-edvanta-bg p-1.5">
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">
                {contexto === 'pacientes' ? 'Para pacientes' : 'Para instituciones'}
              </p>
              {enlacesDelContexto.map((l) => (
                <Link key={l.to} to={l.to} className="flex min-h-11 items-center rounded-xl px-3 text-[15px] font-medium text-edvanta-deep">{l.label}</Link>
              ))}
            </div>
          )}
          {[MENUS.escuelas, null, MENUS.recursos].map((m) => (m ? (
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
                  {m.all && (
                    <Link to={m.all.to} className="flex min-h-11 items-center gap-2 px-3 text-sm font-semibold text-edvanta-blue">
                      {m.all.label}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link key={cursos.to} to={cursos.to} className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-edvanta-deep">
              {cursos.label}
            </Link>
          )))}
          {[articulos, ...TOP_LINKS].map((l) => (
            <Link key={l.to} to={l.to} className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-edvanta-deep">
              {l.label}
            </Link>
          ))}
          <Link to="/buscar" className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-medium text-edvanta-deep">
            <Search className="h-5 w-5" aria-hidden="true" />
            Buscar en Edvanta
          </Link>
          <div className="mt-3 flex gap-3">
            {user ? (
              <Link to="/aula" className="ed-btn ed-btn--primary flex-1">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Mi aula
              </Link>
            ) : (
              <>
                <Link to="/cuenta" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-edvanta-border px-5 text-sm font-semibold text-edvanta-blue">Acceder</Link>
                <Link to="/cuenta?modo=registro" className="ed-btn ed-btn--primary flex-1">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
