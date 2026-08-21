import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../Icon';
import { trackEvent } from '../../../utils/analytics';
import { trackFstClick } from '../../../lib/fstClicks';

const NAV = [
  { label: 'Recursos', to: '/recursos-tiroides' },
  { label: 'Atención Farmacéutica', to: '/atencion-farmaceutica' },
];

export default function LandingHeader({ minimal = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${scrolled || menuOpen ? 'border-[#e8e1ee] bg-white/95 shadow-sm backdrop-blur' : 'border-transparent bg-white/90 backdrop-blur-sm'}`}>
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link to="/feliz-sin-tiroides" className="flex min-w-0 items-center gap-3" aria-label="Feliz Sin Tiroides, inicio">
          <img src="/img/port-logofelizsintiroides.jpg" alt="" width="44" height="44" className="h-11 w-11 rounded-md object-cover" />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-bold text-[#132e55]">Feliz Sin Tiroides</span>
            <span className="block truncate text-[11px] text-gray-500">Educación tiroidea responsable</span>
          </span>
        </Link>

        {!minimal && (
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
            {NAV.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => trackFstClick({ section: 'header', element: `nav_${item.label.toLowerCase()}`, label: item.label, destination: item.to })}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#563a78]"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/atencion-farmaceutica" className="text-sm font-medium text-[#0f766e] transition-colors hover:text-[#0c655f]">
              Orientación personalizada
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Link
            to="/atencion-farmaceutica"
            onClick={() => { trackEvent('hero_cta_click', { location: 'header', cta: 'empezar' }); trackFstClick({ section: 'header', element: 'cta_empezar', label: 'EMPEZAR', destination: '/atencion-farmaceutica' }); }}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#563a78] px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#452b65]"
          >
            EMPEZAR
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#e2d9eb] text-[#563a78] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="landing-mobile-menu" className="border-t border-[#e8e1ee] bg-white px-4 py-4 shadow-lg lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto max-w-7xl space-y-1">
            {NAV.map(item => (
              <Link key={item.to} to={item.to} className="block min-h-11 rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-[#f7f2fa] hover:text-[#563a78]">
                {item.label}
              </Link>
            ))}
            <Link to="/feliz-sin-tiroides" className="block min-h-11 rounded-md px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50">
              Inicio Feliz Sin Tiroides
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
