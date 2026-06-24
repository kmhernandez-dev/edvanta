import { Link } from 'react-router-dom';
import { WHATSAPP_URL, EMAIL, LINKEDIN_URL } from '../../config/links';

export default function FstFooter() {
  const year = new Date().getFullYear();

  const handleNav = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="fst-contacto" className="bg-deepblue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blush-400 flex items-center justify-center text-lg">🦋</div>
              <p className="font-serif text-lg font-semibold">Feliz Sin Tiroides<span className="text-teal-400">®</span></p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-md mb-4">
              Educación, acompañamiento farmacéutico y estilo de vida para personas que viven con enfermedades tiroideas y metabólicas. Por Karla Hernández, Química Farmacéutica y paciente sobreviviente de cáncer de tiroides.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200">WhatsApp</a>
              <span className="text-white/30">·</span>
              <a href={`mailto:${EMAIL}`} className="text-teal-300 hover:text-teal-200">{EMAIL}</a>
              <span className="text-white/30">·</span>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200">LinkedIn</a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Explora</p>
            <nav className="space-y-2 text-sm">
              <a href="#fst-ebooks" onClick={e => handleNav(e, '#fst-ebooks')} className="block text-white/70 hover:text-white">Guías y ebooks</a>
              <a href="#fst-servicios" onClick={e => handleNav(e, '#fst-servicios')} className="block text-white/70 hover:text-white">Servicios</a>
              <a href="#fst-recursos" onClick={e => handleNav(e, '#fst-recursos')} className="block text-white/70 hover:text-white">Recursos gratis</a>
              <a href="#fst-tienda" onClick={e => handleNav(e, '#fst-tienda')} className="block text-white/70 hover:text-white">Tienda recomendada</a>
              <Link to="/" className="block text-white/70 hover:text-white">Biblioteca Profesional KH</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Legal</p>
            <nav className="space-y-2 text-sm">
              <Link to="/privacidad" className="block text-white/70 hover:text-white">Política de privacidad</Link>
              <Link to="/terminos" className="block text-white/70 hover:text-white">Términos y condiciones</Link>
              <Link to="/descargo-medico" className="block text-white/70 hover:text-white">Descargo médico</Link>
              <Link to="/afiliados" className="block text-white/70 hover:text-white">Aviso de afiliados</Link>
            </nav>
          </div>
        </div>

        {/* Medical disclaimer banner */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
          <p className="text-xs text-white/60 leading-relaxed">
            <strong className="text-white/80">Descargo de responsabilidad médica:</strong> el contenido de Feliz Sin Tiroides® es educativo e informativo y no sustituye la consulta, diagnóstico ni tratamiento de tu médico o profesional de salud. No suspendas ni modifiques tu medicación sin indicación profesional. Ante una urgencia, acude a tu servicio de salud.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <p className="text-xs text-white/50">© {year} Feliz Sin Tiroides®. Karla Hernández. Todos los derechos reservados.</p>
          <a href="#fst-recursos" onClick={e => handleNav(e, '#fst-recursos')} className="text-xs text-teal-300 hover:text-teal-200">
            Recibe recursos gratis →
          </a>
        </div>
      </div>
    </footer>
  );
}
