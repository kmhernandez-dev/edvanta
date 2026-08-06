import { Link } from 'react-router-dom';
import { EMAIL, LINKEDIN_URL, waLink } from '../../config/links';
import { professionalDisclaimer } from '../../data/atenfarma-clinic';

export default function AfcFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/img/port-logoatenfarmaclinic.jpg"
                alt="AtenFarmaClinic"
                className="w-9 h-9 rounded-xl object-contain bg-white"
                width="36"
                height="36"
              />
              <div>
                <p className="text-sm font-bold text-white leading-none">AtenFarmaClinic</p>
                <p className="text-[10px] text-teal-400 font-medium leading-none mt-0.5">Atención farmacéutica clínica</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Herramientas clínicas para analizar, documentar y dar seguimiento a la farmacoterapia.
            </p>
            <div className="flex gap-2">
              {LINKEDIN_URL && (
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                   aria-label="LinkedIn">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              <a href={waLink('Hola, consulta desde AtenFarmaClinic.')} target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center hover:bg-teal-500 transition-colors"
                 aria-label="WhatsApp">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Navegación</p>
            <nav className="space-y-2">
              <Link to="/atenfarmaclinic" className="block text-sm text-gray-400 hover:text-white transition-colors">Inicio</Link>
              <a href="/atenfarmaclinic#herramientas" className="block text-sm text-gray-400 hover:text-white transition-colors">Herramientas</a>
              <a href="/atenfarmaclinic#casos" className="block text-sm text-gray-400 hover:text-white transition-colors">Casos clínicos</a>
              <a href="/atenfarmaclinic#formacion" className="block text-sm text-gray-400 hover:text-white transition-colors">Formación</a>
              <a href="/atenfarmaclinic#instituciones" className="block text-sm text-gray-400 hover:text-white transition-colors">Instituciones</a>
              <Link to="/atenfarmaclinic/workspace" className="block text-sm text-teal-400 hover:text-teal-300 transition-colors">Workspace clínico</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Legal</p>
            <nav className="space-y-2">
              <Link to="/privacidad" className="block text-sm text-gray-400 hover:text-white transition-colors">Política de privacidad</Link>
              <Link to="/tratamiento-de-datos" className="block text-sm text-gray-400 hover:text-white transition-colors">Tratamiento de datos</Link>
              <Link to="/terminos" className="block text-sm text-gray-400 hover:text-white transition-colors">Términos y condiciones</Link>
              <Link to="/reembolsos" className="block text-sm text-gray-400 hover:text-white transition-colors">Política de reembolso</Link>
              <Link to="/descargo-medico" className="block text-sm text-gray-400 hover:text-white transition-colors">Aviso de uso profesional</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Contacto</p>
            <div className="space-y-3">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {EMAIL}
              </a>
              <a href={waLink('Hola, consulta desde AtenFarmaClinic.')} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors">
                <svg className="w-4 h-4 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-6 space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
            {professionalDisclaimer}
          </p>
          <p className="text-xs text-gray-600">
            &copy; {year} AtenFarmaClinic &middot; Karla Hernández, Q.F. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
