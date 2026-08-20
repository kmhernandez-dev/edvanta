import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { EDVANTA_WHATSAPP_URL, EDVANTA_COMMUNITY_URL } from '../config/links';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import GlobalSearch from './edvanta/GlobalSearch';
import { trackEvent } from '../utils/analytics';

const logoVersion = '20260716-edvanta-logo';

const carrerasMenu = [
  { label: 'Centro de carreras', to: '/carreras' },
  { label: 'Maestrías en Colombia', to: '/carreras#formacion' },
  { label: 'Especializaciones', to: '/carreras#formacion' },
  { label: 'Diplomados', to: '/carreras#formacion' },
  { label: 'Congresos y webinars', to: '/carreras#formacion' },
  { label: 'Cursos por área', to: '/carreras#cursos' },
  { type: 'separator' },
  { label: 'Orientación vocacional', to: '/vocacion' },
];

const empleoMenu = [
  { label: 'Centro de empleo', to: '/empleo' },
  { label: 'Crear hoja de vida ATS + IA', to: '/empleo#creador' },
  { label: 'Plantillas de correo a RR. HH.', to: '/empleo#correos' },
  { label: 'Banco de vacantes', to: '/empleo#vacantes' },
  { label: 'Guía de prácticas', to: '/practicas' },
];

const ecosistemaMenu = [
  { label: 'Feliz Sin Tiroides', to: '/feliz-sin-tiroides' },
  { label: 'AtenFarmaClinic', to: '/atenfarmaclinic' },
];

const herramientasMenu = [
  { label: 'Centro de herramientas', to: '/herramientas' },
  { label: 'Perfil profesional para empresas', to: '/empresas' },
  { label: 'Prompts para LinkedIn', to: '/linkedin' },
  { label: 'Guía de ingresos con tu marca (USD 10)', to: '/linkedin#ingresos' },
  { label: 'Crea tu emprendimiento', to: '/emprendimientos' },
  { label: 'Pruebas de productos', to: '/emprendimientos#probar' },
  { label: 'Crea tu curso o grupo de estudio', to: '/emprendimientos#profesor' },
  { label: 'Artículos científicos en equipo', to: '/emprendimientos#investigador' },
  { label: 'Artículos y lecturas', to: '/articulos' },
];

const masMenu = [...ecosistemaMenu];

const mainLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Carreras', menu: carrerasMenu },
  { label: 'Empleo', menu: empleoMenu },
  { label: 'Prácticas', to: '/practicas' },
  { label: 'LinkedIn', to: '/linkedin' },
  { label: 'Emprende', to: '/emprendimientos' },
  { label: 'Noticias', to: '/noticias' },
  { label: 'Empresas', to: '/empresas' },
  { label: 'Herramientas', menu: herramientasMenu },
  { label: 'Más', menu: masMenu },
  { label: 'Comunidad', external: EDVANTA_COMMUNITY_URL, event: 'community_clicked' },
];
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handle hash from URL on homepage mount
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname, location.search]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [openMenu, mobileOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMenu = (label) => {
    setOpenMenu(prev => prev === label ? null : label);
  };

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const handleHashLink = (e, hash) => {
    e.preventDefault();
    closeAll();
    const id = hash.replace('#', '');
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + hash);
    }
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    if (to.startsWith('/#')) return location.pathname === '/';
    return location.pathname.startsWith(to.split('?')[0]);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeAll}
            className="flex shrink-0 items-center rounded-lg py-1 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Ir al inicio de Edvanta"
          >
            <img
              src={`/img/logo-edvanta-wordmark.png?v=${logoVersion}`}
              alt="Edvanta"
              className="h-8 w-auto sm:h-9"
              width="901"
              height="162"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5" role="navigation" aria-label="Navegación principal">
            {mainLinks.map(link => {
              if (link.menu) {
                const isOpen = openMenu === link.label;
                return (
                  <div key={link.label} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleMenu(link.label)}
                      onMouseEnter={() => setOpenMenu(link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`inline-flex items-center gap-0.5 px-2 py-1.5 text-[13px] rounded-lg transition-colors duration-150 font-medium whitespace-nowrap ${
                        isOpen
                          ? 'text-teal-700 bg-teal-50'
                          : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                      <svg className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-gray-100 bg-white shadow-xl shadow-navy-950/10 py-2 z-50"
                        onMouseLeave={() => setOpenMenu(null)}
                        role="menu"
                      >
                        {link.menu.map((item, i) => {
                          if (item.type === 'separator') {
                            return <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />;
                          }
                          return (
                            <Link
                              key={item.label}
                              to={item.to}
                              onClick={closeAll}
                              role="menuitem"
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isActive(item.to)
                                  ? 'text-teal-700 bg-teal-50 font-semibold'
                                  : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (link.external) {
                return (
                  <a
                    key={link.label}
                    href={link.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { closeAll(); trackEvent(link.event || 'community_clicked', { origin: 'header' }); }}
                    className="px-2 py-1.5 text-[13px] rounded-lg transition-colors duration-150 font-medium whitespace-nowrap text-gray-600 hover:text-navy-900 hover:bg-gray-50"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={link.to.startsWith('/#') ? (e) => handleHashLink(e, link.to) : closeAll}
                  className={`px-2 py-1.5 text-[13px] rounded-lg transition-colors duration-150 font-medium whitespace-nowrap ${
                    isActive(link.to)
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-2">
            <GlobalSearch className="h-10" />

            <a
              href={EDVANTA_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('community_clicked', { origin: 'header' })}
              className="hidden h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-navy-900 sm:inline-flex xl:hidden"
              aria-label="Comunidad de Químicos Farmacéuticos en WhatsApp"
            >
              <Icon name="whatsapp" className="h-4 w-4 text-[#25D366]" />
              Comunidad
            </a>

            {!user && (
              <Link
                to="/cuenta"
                onClick={closeAll}
                className="hidden min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-xs font-bold text-navy-900 transition hover:bg-gray-50 sm:inline-flex"
              >
                Ingresar
              </Link>
            )}

            <Link
              to={user ? '/app' : '/cuenta?modo=registro'}
              onClick={closeAll}
              className="hidden min-h-10 items-center gap-2 rounded-lg bg-[#071a4a] px-4 text-xs font-bold text-white hover:bg-[#0d2d6d] sm:inline-flex"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              {user ? 'Mi Edvanta' : 'Crear cuenta'}
            </Link>

            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center text-navy-900 transition-colors"
              aria-label="Abrir carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 overflow-y-auto">
          <nav className="px-4 py-3 space-y-1" role="navigation" aria-label="Menú móvil">
            {mainLinks.map(link => {
              if (link.menu) {
                return (
                  <details key={link.label} className="group">
                    <summary className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 list-none">
                      {link.label}
                      <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                      {link.menu.map(item => {
                        if (item.type === 'separator') return null;
                        return (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={closeAll}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(item.to)
                                ? 'text-teal-700 bg-teal-50 font-semibold'
                                : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                );
              }
              if (link.external) {
                return (
                  <a
                    key={link.label}
                    href={link.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { closeAll(); trackEvent('community_clicked', { origin: 'header_mobile' }); }}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-navy-900"
                  >
                    <Icon name="whatsapp" className="h-4 w-4 text-[#25D366]" />
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={link.to.startsWith('/#') ? (e) => handleHashLink(e, link.to) : closeAll}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.to)
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-navy-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-gray-100 my-3" />

            <Link to="/feliz-sin-tiroides" onClick={closeAll}
              className="block px-3 py-2.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg">
              Feliz Sin Tiroides
            </Link>
            <Link to="/atenfarmaclinic" onClick={closeAll}
              className="block px-3 py-2.5 text-sm font-medium text-deepblue-700 hover:bg-blue-50 rounded-lg">
              AtenFarmaClinic
            </Link>

            <div className="pt-3 pb-1 flex flex-col gap-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                {!user && (
                  <Link to="/cuenta" onClick={closeAll} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-bold text-navy-900">
                    Ingresar
                  </Link>
                )}
                <Link to={user ? '/app' : '/cuenta?modo=registro'} onClick={closeAll} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white"><UserRound className="h-4 w-4" />{user ? 'Mi Edvanta' : 'Crear cuenta'}</Link>
              </div>
              <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-teal text-sm text-center">Hablar con Edvanta</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
