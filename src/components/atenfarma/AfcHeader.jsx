import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { waLink } from '../../config/links';

const NAV_ITEMS = [
  { label: 'Inicio', href: '/atenfarmaclinic' },
  { label: 'Herramientas', href: '/atenfarmaclinic#herramientas' },
  { label: 'Casos clínicos', href: '/atenfarmaclinic#casos' },
  { label: 'Biblioteca', href: '/atenfarmaclinic#biblioteca' },
  { label: 'Formación', href: '/atenfarmaclinic#formacion' },
  { label: 'Instituciones', href: '/atenfarmaclinic#instituciones' },
  { label: 'Metodología', href: '/atenfarmaclinic#metodologia' },
];

export default function AfcHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (e, href) => {
    if (href.startsWith('/atenfarmaclinic#')) {
      const id = href.split('#')[1];
      if (location.pathname === '/atenfarmaclinic') {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/atenfarmaclinic" className="flex items-center gap-2.5 shrink-0" aria-label="AtenFarmaClinic - Inicio">
            <img
              src="/img/port-logoatenfarmaclinic.jpg"
              alt="AtenFarmaClinic"
              className="w-9 h-9 rounded-xl object-contain bg-white"
              width="36"
              height="36"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-deepblue-900 leading-none">AtenFarmaClinic</p>
              <p className="text-[10px] text-teal-600 font-medium leading-none mt-0.5">Atención farmacéutica clínica</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {NAV_ITEMS.map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={e => handleNavClick(e, item.href)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-deepblue-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/atenfarmaclinic/workspace"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-deepblue-800 hover:bg-deepblue-900 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Probar las herramientas
            </Link>
            <a
              href={waLink('Hola, soy químico farmacéutico y me interesa AtenFarmaClinic.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-4 py-2 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
            >
              Iniciar sesión
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center text-deepblue-900 transition-colors"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white" aria-label="Menú móvil">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {NAV_ITEMS.map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={e => handleNavClick(e, item.href)}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <Link
                to="/atenfarmaclinic/workspace"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-deepblue-800 text-white text-sm font-semibold rounded-lg"
              >
                Probar las herramientas
              </Link>
              <a
                href={waLink('Hola, soy químico farmacéutico y me interesa AtenFarmaClinic.')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2.5 text-teal-700 text-sm font-semibold rounded-lg border border-teal-200"
              >
                Iniciar sesión
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
