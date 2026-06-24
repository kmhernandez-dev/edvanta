import { WHATSAPP_URL } from '../config/links';
import LeadForm from './LeadForm';

const freeResources = [
  { icon: '✅', label: 'Checklist de LinkedIn profesional' },
  { icon: '🗺️', label: 'Mini guía de rutas de formación' },
  { icon: '📊', label: 'Plantilla básica de control de postulaciones' },
  { icon: '📋', label: 'Checklist de calidad ISO 9001' },
  { icon: '🛡️', label: 'Checklist HSEQ básico' },
];

const trustPoints = [
  { icon: '✏️', text: 'Plantillas listas para adaptar a tu empresa o proceso' },
  { icon: '🗺️', text: 'Rutas de formación diseñadas por perfil profesional' },
  { icon: '⚖️', text: 'Enfoque profesional, ético y aplicable' },
  { icon: '💼', text: 'Ideal para LinkedIn, empleabilidad y organización de procesos' },
  { icon: '🤝', text: 'Compatible con campañas de cursos afiliados de Edutin' },
];

export default function CTASection() {
  return (
    <>
      {/* Trust section */}
      <section id="confianza" className="py-16 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">¿Por qué elegir estos recursos?</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                Recursos creados para profesionales que necesitan herramientas prácticas, editables y aplicables
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cada pack fue construido desde la práctica real, con el lenguaje y los formatos que los equipos realmente usan en sus puestos de trabajo.
              </p>
            </div>
            <div className="space-y-3">
              {trustPoints.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-xl shrink-0">{p.icon}</span>
                  <p className="text-sm text-gray-300 leading-snug">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free resources lead capture */}
      <section id="recursos" className="py-16 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Sin costo</p>
          <h2 className="section-title mb-3">Descarga recursos gratis para empezar</h2>
          <p className="section-subtitle mx-auto mb-8">
            Accede a una selección de herramientas básicas sin costo. Perfectas para conocer el nivel de los packs.
          </p>

          {/* Resource list */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-left">
            {freeResources.map((r, i) => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <span className="text-xl shrink-0">{r.icon}</span>
                <p className="text-sm font-medium text-gray-700">{r.label}</p>
              </div>
            ))}
          </div>

          {/* Formulario de captación → función /lead-capture (Resend) */}
          <LeadForm />

          <div className="mt-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-700 hover:text-teal-800 font-medium"
            >
              o pregúntame por WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
