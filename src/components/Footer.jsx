import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EDVANTA_WHATSAPP_URL, EDVANTA_EMAIL, EDVANTA_LINKEDIN_URL, EDVANTA_BRAND_FULL } from '../config/links';

const quickLinks = [
  { label: 'Mi panel profesional', href: '/app' },
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Aprende', href: '/aprende' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Rutas profesionales', href: '/rutas' },
  { label: 'Competencias', href: '/competencias' },
  { label: 'Oportunidades', href: '/oportunidades' },
  { label: 'Conecta', href: '/conecta' },
  { label: 'Empresas', href: '/empresas' },
  { label: 'Artículos', href: '/articulos' },
  { label: 'Recursos', href: '/recursos' },
];

const logoVersion = '20260716-edvanta-logo';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (e, href) => {
    e.preventDefault();
    const id = href.replace('/#', '');
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="mb-3">
              <img
                src={`/img/logo-edvanta-wordmark.png?v=${logoVersion}`}
                alt="Edvanta"
                className="h-9 w-auto"
                width="901"
                height="162"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Rutas de aprendizaje, cursos recomendados y recursos profesionales para fortalecer tu perfil.
            </p>
            <div className="flex gap-2">
              {EDVANTA_LINKEDIN_URL && (
                <a href={EDVANTA_LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center hover:bg-navy-800 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center hover:bg-teal-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Navegación</p>
            <nav className="space-y-2">
              <Link to="/carreras" className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">
                Carreras farmacéuticas
              </Link>
              {quickLinks.map(l => l.href.startsWith('/#') ? (
                <a key={l.href} href={l.href} onClick={e => handleNav(e, l.href)} className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} to={l.href} className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link to="/articulos" className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legal</p>
            <nav className="space-y-2">
              <Link to="/privacidad" className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">Política de privacidad</Link>
              <Link to="/terminos" className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">Términos y condiciones</Link>
              <Link to="/descargo-medico" className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">Descargo médico</Link>
              <Link to="/afiliados" className="block text-sm text-gray-600 hover:text-navy-900 transition-colors">Aviso de afiliados</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contacto</p>
            <div className="space-y-3">
              <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                <svg className="w-4 h-4 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Escríbenos por WhatsApp
              </a>
              {EDVANTA_EMAIL && (
                <a href={`mailto:${EDVANTA_EMAIL}`}
                   className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy-900 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {EDVANTA_EMAIL}
                </a>
              )}
              <a href="#cursos" onClick={e => handleNav(e, '#cursos')}
                 className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Ver cursos recomendados
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          {/* Affiliate notice */}
          <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
            Algunos enlaces pueden corresponder a cursos afiliados de plataformas educativas. La disponibilidad,
            condiciones del certificado y precios pueden variar según la plataforma. Edvanta no dicta ni certifica esos cursos.
          </p>
          <p className="text-xs text-gray-400">
            © {year} {EDVANTA_BRAND_FULL}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
