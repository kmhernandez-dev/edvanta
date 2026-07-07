import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { waLink } from '../../config/links';

const navLinks = [
  { label: 'Inicio',        href: '#fst-inicio' },
  { label: 'Sobre Karla',   href: '#fst-karla' },
  { label: 'Tiroides',      href: '#fst-tiroides' },
  { label: 'Guías y ebooks',href: '#fst-ebooks' },
  { label: 'Servicios',     href: '#fst-servicios' },
  { label: 'Comunidad',     href: '#fst-comunidad' },
  { label: 'Contacto',      href: '#fst-contacto' },
];

export default function FstHeader() {
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
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-sand-100' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#fst-inicio" onClick={e => handleNav(e, '#fst-inicio')} className="flex items-center gap-2 shrink-0">
            <img src="/img/port-logofelizsintiroides.jpg" alt="Feliz Sin Tiroides" className="w-9 h-9 rounded-full object-contain bg-white" />
            <div>
              <p className="font-serif text-base font-semibold text-deepblue-800 leading-none">Feliz Sin Tiroides<span className="text-teal-500">®</span></p>
              <p className="text-[10px] text-teal-600 font-medium leading-none mt-0.5">Salud tiroidea y metabólica</p>
            </div>
          </a>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNav(e, link.href)}
                className="px-3 py-1.5 text-sm text-deepblue-800/70 hover:text-deepblue-900 hover:bg-sand-50 rounded-lg transition-colors duration-150 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <a
              href={waLink('Hola Karla, vengo de Feliz Sin Tiroides y quiero más información.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-full hover:bg-teal-700 transition-colors"
            >
              Escríbeme
            </a>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-full bg-sand-50 hover:bg-sand-100 border border-sand-200 flex items-center justify-center text-deepblue-800 transition-colors"
              aria-label="Abrir carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blush-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-deepblue-800 hover:bg-sand-50 transition-colors"
              aria-label="Menú"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-sand-100 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNav(e, link.href)}
                className="block px-3 py-2.5 text-sm font-medium text-deepblue-800/80 hover:bg-sand-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link to="/" className="block px-3 py-2.5 text-sm font-medium text-teal-700 hover:bg-sand-50 rounded-lg">
              ← Biblioteca Profesional KH
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
