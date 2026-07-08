import { useState, useEffect } from 'react';
import { EDVANTA_WHATSAPP_URL, EDVANTA_BRAND_NAME } from '../config/links';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Cursos', href: '#cursos' },
  { label: 'Rutas profesionales', href: '#rutas' },
  { label: 'Artículos', href: '#articulos' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Acerca de Edvanta', href: '#contacto' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#inicio" onClick={e => handleNav(e, '#inicio')} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">EV</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-navy-950 leading-none">{EDVANTA_BRAND_NAME}</p>
              <p className="text-[10px] text-teal-600 font-medium leading-none mt-0.5">Educación profesional</p>
            </div>
          </a>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNav(e, link.href)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors duration-150 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <a
              href="#recursos"
              onClick={e => handleNav(e, '#recursos')}
              className="hidden sm:inline-flex btn-primary text-xs px-4 py-2"
            >
              Solicitar ruta
            </a>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center text-navy-900 transition-colors"
              aria-label="Abrir carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-[pop_0.25s_ease-out]">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Menú"
            >
              {menuOpen ? (
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
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNav(e, link.href)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy-900 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1 flex flex-col gap-2">
              <a href="#herramientas" onClick={e => handleNav(e, '#herramientas')} className="btn-primary text-sm text-center">
                Ver herramientas
              </a>
              <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-teal text-sm text-center">
                Hablar con Edvanta
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
