import { Link } from 'react-router-dom';
import { EMAIL, FST_COMMUNITY_URL, INSTAGRAM_URL, waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';
import { trackLeadEvent } from '../../lib/leadEvents';
import Icon from '../Icon';

const whatsappUrl = waLink('Hola, llegué desde la página de Feliz Sin Tiroides y necesito orientación para elegir un recurso.');

export default function FstFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="fst-contacto" className="bg-[#132e55] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/img/port-logofelizsintiroides.jpg" alt="Feliz Sin Tiroides" width="52" height="52" className="h-12 w-12 rounded-md bg-white object-cover" />
              <div>
                <p className="text-lg font-semibold">Feliz Sin Tiroides</p>
                <p className="text-xs text-white/60">Educación farmacéutica para pacientes tiroideos</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
              Información clara para comprender la levotiroxina, los exámenes, la alimentación y los cambios de vivir con una condición tiroidea. Creado por Karla Hernández, química farmacéutica y paciente tiroidectomizada.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent('whatsapp_click', { location: 'footer_comunidad' }); trackLeadEvent('community_clicked', { source: 'footer' }); }} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/25 px-4 text-sm font-semibold hover:bg-white/10">
                <Icon name="users" className="h-4 w-4" /> Comunidad
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'footer' })} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/25 px-4 text-sm font-semibold hover:bg-white/10">
                WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/25 px-4 text-sm font-semibold hover:bg-white/10">
                <Icon name="mail" className="h-4 w-4" /> Correo
              </a>
              {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-md border border-white/25 px-4 text-sm font-semibold hover:bg-white/10">Instagram</a>}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d8c5e8]">Explora</p>
            <nav className="mt-4 space-y-3 text-sm text-white/70">
              <Link to="/feliz-sin-tiroides#fst-recursos" className="block hover:text-white">Recurso gratuito</Link>
              <Link to="/feliz-sin-tiroides/guias" className="block hover:text-white">Guías y ebooks</Link>
              <Link to="/feliz-sin-tiroides/herramientas" className="block hover:text-white">Herramientas</Link>
              <Link to="/feliz-sin-tiroides/academy" className="block hover:text-white">Academy</Link>
              <Link to="/feliz-sin-tiroides/atencion-farmaceutica" className="block hover:text-white">Atención farmacéutica</Link>
              <Link to="/feliz-sin-tiroides/sobre-mi" className="block hover:text-white">Sobre mí</Link>
              <Link to="/feliz-sin-tiroides/comunidad" className="block hover:text-white">Comunidad</Link>
              <Link to="/articulos" className="block hover:text-white">Artículos educativos</Link>
              <Link to="/" className="block hover:text-white">Edvanta</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d8c5e8]">Legal</p>
            <nav className="mt-4 space-y-3 text-sm text-white/70">
              <Link to="/privacidad" className="block hover:text-white">Política de privacidad</Link>
              <Link to="/tratamiento-de-datos" className="block hover:text-white">Tratamiento de datos</Link>
              <Link to="/terminos" className="block hover:text-white">Términos y condiciones</Link>
              <Link to="/reembolsos" className="block hover:text-white">Política de reembolso</Link>
              <Link to="/descargo-medico" className="block hover:text-white">Aviso sanitario</Link>
              <Link to="/afiliados" className="block hover:text-white">Aviso de afiliados</Link>
            </nav>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-white/15 bg-white/5 p-4">
          <p className="text-xs leading-5 text-white/70">
            <strong className="text-white">Aviso sanitario:</strong> El contenido de Feliz Sin Tiroides es educativo y no reemplaza la valoración, diagnóstico, tratamiento ni seguimiento por parte de profesionales de salud. No modifiques tu medicación sin consultar al profesional tratante.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Feliz Sin Tiroides. Todos los derechos reservados.</p>
          <p>Una iniciativa educativa vinculada al ecosistema Edvanta.</p>
        </div>
      </div>
    </footer>
  );
}
