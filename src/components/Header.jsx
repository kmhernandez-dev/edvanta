import { useState, useEffect } from 'react';
import { EDVANTA_WHATSAPP_URL } from '../config/links';
import { useCart } from '../context/CartContext';
import { learningRoutes, getFeaturedCourse } from '../data/featuredCourses';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Cursos', href: '#cursos' },
  { label: 'Rutas profesionales', href: '#rutas' },
  { label: 'Artículos', href: '#articulos' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Acerca de Edvanta', href: '#contacto' },
];

const logoVersion = '20260716-edvanta-logo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setCourseMenuOpen(false);
    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setCourseMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm'}`}
      onMouseLeave={() => setCourseMenuOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#inicio"
            onClick={e => handleNav(e, '#inicio')}
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
          </a>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              link.label === 'Cursos' ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setCourseMenuOpen(true)}
                >
                  <button
                    type="button"
                    onClick={() => setCourseMenuOpen(true)}
                    onFocus={() => setCourseMenuOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors duration-150 font-medium"
                    aria-expanded={courseMenuOpen}
                    aria-controls="courses-mega-menu"
                  >
                    Cursos
                    <svg className={`h-3.5 w-3.5 transition-transform ${courseMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => handleNav(e, link.href)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors duration-150 font-medium"
                >
                  {link.label}
                </a>
              )
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

      {courseMenuOpen && (
        <div
          id="courses-mega-menu"
          className="hidden lg:block border-t border-gray-100 bg-white/98 shadow-2xl shadow-navy-950/10 backdrop-blur"
          onMouseEnter={() => setCourseMenuOpen(true)}
          onMouseLeave={() => setCourseMenuOpen(false)}
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-teal-600">Categorías de cursos</p>
                <p className="mt-1 text-sm text-gray-500">Empieza por Calidad y avanza por datos, sostenibilidad y mejora de procesos.</p>
              </div>
              <a
                href="#cursos"
                onClick={e => handleNav(e, '#cursos')}
                className="shrink-0 rounded-lg border border-navy-200 px-3 py-2 text-xs font-bold text-navy-900 hover:bg-navy-50"
              >
                Ver sección de cursos
              </a>
            </div>

            <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
              {learningRoutes.map(route => (
                <section
                  key={route.slug}
                  className="min-w-[310px] max-w-[340px] rounded-xl border border-gray-200 bg-slate-50 p-4"
                >
                  <div className="mb-3">
                    <h3 className="text-sm font-black text-navy-950">{route.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{route.summary}</p>
                  </div>

                  <div className="space-y-2">
                    {route.courseSlugs.map(slug => {
                      const course = getFeaturedCourse(slug);
                      if (!course) return null;
                      return (
                        <a
                          key={course.slug}
                          href={`/cursos/${course.slug}`}
                          onClick={closeMenus}
                          className="group flex items-center justify-between gap-3 rounded-lg border border-white bg-white px-3 py-2 shadow-sm transition hover:border-teal-200 hover:bg-teal-50"
                        >
                          <span>
                            <span className="block text-sm font-bold leading-snug text-navy-950 group-hover:text-teal-800">{course.title}</span>
                            <span className="text-[11px] font-semibold text-gray-400">{course.duration} · {course.modality}</span>
                          </span>
                          <span className="shrink-0 text-lg leading-none text-teal-600">›</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              link.label === 'Cursos' ? (
                <div key={link.href} className="rounded-xl bg-slate-50 p-2">
                  <a
                    href={link.href}
                    onClick={e => handleNav(e, link.href)}
                    className="block px-3 py-2.5 text-sm font-bold text-navy-950"
                  >
                    Cursos
                  </a>
                  <div className="flex gap-3 overflow-x-auto px-1 pb-2">
                    {learningRoutes.map(route => (
                      <div key={route.slug} className="min-w-[250px] rounded-lg border border-gray-200 bg-white p-3">
                        <p className="mb-2 text-xs font-black uppercase tracking-wide text-teal-600">{route.title}</p>
                        <div className="space-y-1.5">
                          {route.courseSlugs.map(slug => {
                            const course = getFeaturedCourse(slug);
                            if (!course) return null;
                            return (
                              <a
                                key={course.slug}
                                href={`/cursos/${course.slug}`}
                                onClick={closeMenus}
                                className="block rounded-md px-2 py-1.5 text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                              >
                                {course.title}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => handleNav(e, link.href)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy-900 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              )
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
