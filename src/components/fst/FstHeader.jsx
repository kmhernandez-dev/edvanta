import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../utils/analytics';
import Icon from '../Icon';

const navLinks = [
  ['Inicio', '#fst-inicio'],
  ['Guías', '#fst-guias'],
  ['Herramientas', '#fst-herramientas'],
  ['Academy', '#fst-academy'],
  ['Atención farmacéutica', '#fst-servicios'],
  ['Sobre mí', '#fst-karla'],
  ['Comunidad', '#fst-comunidad'],
];

function goToSection(event, href, onNavigate) {
  event.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.assign(`/feliz-sin-tiroides${href}`);
  }
  onNavigate?.();
}

export default function FstHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const freeResourceClick = (event) => {
    trackEvent('hero_cta_click', { location: 'header', cta: 'free_resource' });
    goToSection(event, '#fst-recursos', () => setMenuOpen(false));
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${scrolled ? 'border-[#e8e1ee] bg-white/95 shadow-sm backdrop-blur' : 'border-transparent bg-white/90 backdrop-blur-sm'}`}>
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <a href="/feliz-sin-tiroides#fst-inicio" onClick={event => goToSection(event, '#fst-inicio')} className="flex min-w-0 items-center gap-3" aria-label="Feliz Sin Tiroides, inicio">
          <img src="/img/port-logofelizsintiroides.jpg" alt="" width="48" height="48" className="h-12 w-12 rounded-md object-cover" />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-bold text-[#132e55]">Feliz Sin Tiroides</span>
            <span className="block truncate text-[11px] text-gray-500">Educación tiroidea responsable</span>
          </span>
        </a>

        <nav className="hidden items-center gap-4 xl:flex" aria-label="Navegación principal">
          {navLinks.map(([label, href]) => (
            <a key={href} href={`/feliz-sin-tiroides${href}`} onClick={event => goToSection(event, href)} className="text-sm font-medium text-gray-600 transition-colors hover:text-[#563a78]">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? '/fst-app' : '/fst-app?modo=registro'} className="hidden min-h-11 items-center rounded-md bg-[#EAE2F8] px-3 py-2 text-sm font-bold text-[#6b4fa8] transition-colors hover:bg-[#e0d5f2] md:inline-flex">
            {isAuthenticated ? 'Mi espacio' : 'Crear mi cuenta'}
          </Link>
          <Link to="/vida-360" className="hidden min-h-11 items-center rounded-md bg-[#e8f7f4] px-3 py-2 text-sm font-bold text-[#0A655D] transition-colors hover:bg-[#d7f1ec] lg:inline-flex">
            Vida 360
          </Link>
          <a href="/feliz-sin-tiroides#fst-recursos" onClick={freeResourceClick} className="hidden min-h-11 items-center justify-center rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white hover:bg-[#452b65] md:inline-flex">
            Recibir recurso gratuito
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(value => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#e2d9eb] text-[#563a78] xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="fst-mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="fst-mobile-menu" className="border-t border-[#e8e1ee] bg-white px-4 py-4 shadow-lg xl:hidden" aria-label="Navegación móvil">
          <div className="mx-auto max-w-7xl space-y-1">
            <Link to={isAuthenticated ? '/fst-app' : '/fst-app?modo=registro'} onClick={() => setMenuOpen(false)} className="mb-2 flex min-h-11 items-center rounded-md bg-[#EAE2F8] px-3 py-3 text-sm font-bold text-[#6b4fa8]">
              {isAuthenticated ? 'Abrir mi espacio' : 'Crear mi cuenta'}
            </Link>
            <Link to="/vida-360" onClick={() => setMenuOpen(false)} className="mb-2 flex min-h-11 items-center rounded-md bg-[#e8f7f4] px-3 py-3 text-sm font-bold text-[#0A655D]">
              Abrir FST Vida 360
            </Link>
            {navLinks.map(([label, href]) => (
              <a key={href} href={`/feliz-sin-tiroides${href}`} onClick={event => goToSection(event, href, () => setMenuOpen(false))} className="block min-h-11 rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-[#f7f2fa] hover:text-[#563a78]">
                {label}
              </a>
            ))}
            <a href="/feliz-sin-tiroides#fst-recursos" onClick={freeResourceClick} className="mt-3 flex min-h-11 items-center justify-center rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white">
              Recibir recurso gratuito
            </a>
            <Link to="/" className="mt-2 block min-h-11 rounded-md px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50">Volver a Edvanta</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
