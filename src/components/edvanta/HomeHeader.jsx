import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award, BookOpen, ChevronDown, Compass, FileText, Gift, GraduationCap,
  Menu, MonitorPlay, Newspaper, Route, Target, UserRound, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EDVANTA_EMAIL } from '../../config/links';
import { trackEvent } from '../../utils/analytics';

// Todo lo de formación que existe hoy en Edvanta. /academia y /academia/retos
// son de Feliz Sin Tiroides, por eso no aparecen aquí.
export const FORMACION_GROUPS = [
  {
    title: 'Aprende',
    items: [
      { label: 'Cursos', desc: 'Catálogo con certificado', to: '/cursos', icon: GraduationCap },
      { label: 'Cursos gratis', desc: 'Opciones recomendadas sin costo', to: '/cursos-gratis', icon: Gift },
      { label: 'Rutas profesionales', desc: 'Cursos en orden hacia un cargo', to: '/rutas', icon: Route },
      { label: 'Competencias', desc: 'Qué dominar en cada área', to: '/competencias', icon: Target },
      { label: 'Centro de aprendizaje', desc: 'Elige tu área y empieza', to: '/aprende', icon: Compass },
    ],
  },
  {
    title: 'Consulta',
    items: [
      { label: 'Guías y recursos', desc: 'Material práctico para tu trabajo', to: '/recursos', icon: FileText },
      { label: 'Artículos', desc: 'Lecturas del sector farmacéutico', to: '/articulos', icon: Newspaper },
      { label: 'Certificaciones', desc: 'Evalúa antes de invertir', to: '/certificaciones', icon: Award },
      { label: 'Ebooks', desc: 'En preparación', icon: BookOpen, soon: true },
    ],
  },
];

const NOSOTROS = [
  { label: 'Contacto', href: `mailto:${EDVANTA_EMAIL}` },
  { label: 'Términos y condiciones', to: '/terminos' },
  { label: 'Privacidad', to: '/privacidad' },
];

const NAV_LINK = 'inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-[15px] font-medium transition-colors';

function FormacionItem({ item, onPick }) {
  const Icono = item.icon;
  const body = (
    <>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.soon ? 'bg-slate-100 text-slate-400' : 'bg-[#EEF5FA] text-[#082E86] group-hover:bg-[#082E86] group-hover:text-white'} transition-colors`}>
        <Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-[#17223B]">
          {item.label}
          {item.soon && (
            <span className="rounded-full bg-[#E9E5FA] px-2 py-0.5 text-[10.5px] font-semibold text-[#5E51A8]">Próximamente</span>
          )}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-[#65718A]">{item.desc}</span>
      </span>
    </>
  );

  if (item.soon) {
    return (
      <div role="menuitem" aria-disabled="true" className="flex items-start gap-3 rounded-xl px-3 py-2.5 opacity-80">
        {body}
      </div>
    );
  }
  return (
    <Link
      role="menuitem"
      to={item.to}
      onClick={() => onPick(item)}
      className="group flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-[#F6F8FC] focus-visible:bg-[#F6F8FC] focus-visible:ring-2 focus-visible:ring-[#082E86]/30"
    >
      {body}
    </Link>
  );
}

export default function HomeHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(null); // 'formacion' | 'nosotros' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFormacion, setMobileFormacion] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(null); setMobileOpen(false); }
    };
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

  const toggle = (name) => {
    setOpen((cur) => {
      const next = cur === name ? null : name;
      if (next === 'formacion') trackEvent('home_nav_click', { item: 'formacion_open' });
      return next;
    });
  };

  const pick = (item) => {
    trackEvent('home_nav_click', { item: item.to });
    setOpen(null);
    setMobileOpen(false);
  };

  return (
    <header ref={ref} className="sticky top-0 z-50 bg-white">
      {/* Franja Personal / Empresas */}
      <div className="border-b border-[#E3E9F2] bg-[#F6F8FC]">
        <div className="mx-auto flex h-10 max-w-7xl items-stretch justify-between px-4 sm:px-6 lg:px-8">
          <nav aria-label="Tipo de cuenta" className="flex items-stretch gap-7">
            <Link to="/" aria-current="page" className="flex items-center border-b-2 border-[#082E86] text-[13.5px] font-semibold text-[#082E86]">
              Personal
            </Link>
            <Link to="/empresas" onClick={() => trackEvent('home_nav_click', { item: 'empresas_tab' })} className="flex items-center border-b-2 border-transparent text-[13.5px] font-medium text-[#65718A] transition-colors hover:text-[#082E86]">
              Empresas
            </Link>
          </nav>
          <div className="relative flex items-center gap-6">
            {/* Acceso al aula virtual de capacitaciones (cuentas propias del aula). */}
            <Link
              to="/aula"
              onClick={() => trackEvent('home_nav_click', { item: 'aula_virtual' })}
              className="hidden items-center gap-1.5 text-[13.5px] font-semibold text-[#082E86] transition-colors hover:text-[#25A7B0] sm:inline-flex"
            >
              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
              Aula virtual
            </Link>
            <button
              type="button"
              aria-expanded={open === 'nosotros'}
              aria-haspopup="menu"
              onClick={() => toggle('nosotros')}
              className="inline-flex items-center gap-1.5 text-[13.5px] text-[#65718A] transition-colors hover:text-[#082E86]"
            >
              Sobre nosotros
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === 'nosotros' ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {open === 'nosotros' && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-[#E3E9F2] bg-white p-1.5 shadow-[0_12px_32px_rgba(23,34,59,.10)]">
                {NOSOTROS.map((n) => (n.href ? (
                  <a key={n.label} role="menuitem" href={n.href} className="block rounded-lg px-3 py-2 text-sm text-[#17223B] hover:bg-[#F6F8FC]">{n.label}</a>
                ) : (
                  <Link key={n.label} role="menuitem" to={n.to} className="block rounded-lg px-3 py-2 text-sm text-[#17223B] hover:bg-[#F6F8FC]">{n.label}</Link>
                )))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="border-b border-[#E3E9F2] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0" aria-label="Edvanta, ir al inicio">
            <img src="/img/logo-edvanta.png" alt="Edvanta" width="931" height="512" className="h-12 w-auto sm:h-[52px]" />
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            <Link to="/" aria-current="page" className={`${NAV_LINK} font-semibold text-[#082E86]`}>Inicio</Link>

            <div className="relative">
              <button
                type="button"
                aria-expanded={open === 'formacion'}
                aria-haspopup="menu"
                aria-controls="menu-formacion"
                onClick={() => toggle('formacion')}
                className={`${NAV_LINK} ${open === 'formacion' ? 'bg-[#EEF5FA] font-semibold text-[#082E86]' : 'text-[#17223B] hover:bg-[#F6F8FC]'}`}
              >
                Formación
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open === 'formacion' ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {open === 'formacion' && (
                <div
                  id="menu-formacion"
                  role="menu"
                  aria-label="Opciones de formación"
                  className="hx-menu absolute left-0 top-full z-50 mt-2 w-[640px] rounded-2xl border border-[#E3E9F2] bg-white p-3 shadow-[0_18px_44px_rgba(23,34,59,.14)]"
                >
                  <div className="grid grid-cols-2 gap-x-2">
                    {FORMACION_GROUPS.map((g) => (
                      <div key={g.title}>
                        <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#65718A]">{g.title}</p>
                        {g.items.map((it) => <FormacionItem key={it.label} item={it} onPick={pick} />)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/comunidad" onClick={() => trackEvent('home_nav_click', { item: 'comunidad' })} className={`${NAV_LINK} text-[#17223B] hover:bg-[#F6F8FC]`}>
              Comunidad
            </Link>
          </nav>

          <div className="ml-auto hidden items-center gap-5 lg:flex">
            {user ? (
              <Link to="/app" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#EEF5FA] px-5 text-[15px] font-semibold text-[#082E86] transition-colors hover:bg-[#E2ECF7]">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Mi Edvanta
              </Link>
            ) : (
              <>
                <Link to="/cuenta" className="text-[15px] font-semibold text-[#082E86] hover:text-[#25A7B0]">Acceder</Link>
                <Link
                  to="/cuenta?modo=registro"
                  onClick={() => trackEvent('home_nav_click', { item: 'crear_cuenta' })}
                  className="inline-flex h-12 items-center rounded-xl bg-[#082E86] px-6 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:-translate-y-px hover:bg-[#0A3AA6]"
                >
                  Crear cuenta gratis
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#17223B] hover:bg-[#F6F8FC] lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto border-b border-[#E3E9F2] bg-white px-4 pb-5 pt-2 shadow-lg lg:hidden">
          <Link to="/" className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-[#082E86]">Inicio</Link>
          <button
            type="button"
            onClick={() => setMobileFormacion((v) => !v)}
            aria-expanded={mobileFormacion}
            className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-base font-medium text-[#17223B]"
          >
            Formación
            <ChevronDown className={`h-5 w-5 transition-transform ${mobileFormacion ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {mobileFormacion && (
            <div className="mb-2 rounded-2xl bg-[#F6F8FC] p-1.5">
              {FORMACION_GROUPS.map((g) => (
                <div key={g.title}>
                  <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#65718A]">{g.title}</p>
                  {g.items.map((it) => <FormacionItem key={it.label} item={it} onPick={pick} />)}
                </div>
              ))}
            </div>
          )}
          <Link to="/comunidad" className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-[#17223B]">Comunidad</Link>
          <Link to="/aula" className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-medium text-[#082E86]">
            <MonitorPlay className="h-5 w-5" aria-hidden="true" />
            Aula virtual
          </Link>
          <div className="mt-3 flex gap-3">
            {user ? (
              <Link to="/app" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#082E86] px-5 text-sm font-semibold text-white">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Mi Edvanta
              </Link>
            ) : (
              <>
                <Link to="/cuenta" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#E3E9F2] px-5 text-sm font-semibold text-[#082E86]">Acceder</Link>
                <Link to="/cuenta?modo=registro" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#082E86] px-5 text-sm font-semibold text-white">Crear cuenta gratis</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
