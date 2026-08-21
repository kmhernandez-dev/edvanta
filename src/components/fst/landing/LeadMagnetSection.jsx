import Icon from '../../Icon';
import { SectionHeading } from './LandingUi';
import FstLandingLeadForm from './FstLandingLeadForm';

/**
 * Sección de captación reutilizable con lead magnet específico por landing.
 * El formulario nunca compite con el CTA de compra: se coloca con
 * jerarquía menor (fondo claro, botón texto) y va al final.
 */
export default function LeadMagnetSection({ magnet, related, formId, dark = false, title, intro }) {
  return (
    <section id="lead-magnet" className={`scroll-mt-24 py-16 md:py-20 ${dark ? 'bg-[#132e55] text-white' : 'bg-[#f5f0f7]'}`}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#5eead4]' : 'text-[#0B8176]'}`}>
            <Icon name="gift" className="h-4 w-4" /> Recurso gratuito
          </p>
          <h2 className={`mt-3 text-3xl font-semibold leading-tight md:text-4xl ${dark ? 'text-white' : 'text-[#132e55]'}`}>
            {title || '¿Todavía no sabes por dónde empezar? Empieza gratis.'}
          </h2>
          <p className={`mt-4 text-base leading-7 ${dark ? 'text-white/75' : 'text-gray-600'}`}>
            {intro || 'Es un recurso educativo de acceso inmediato, sin costo y sin compromiso de compra.'}
          </p>
          <div className={`mt-6 rounded-2xl border p-6 ${dark ? 'border-white/15 bg-white/5' : 'border-[#e5dceb] bg-white shadow-sm'}`}>
            <p className={`text-sm font-bold uppercase tracking-widest ${dark ? 'text-[#5eead4]' : 'text-[#76539a]'}`}>Recibirás</p>
            <h3 className={`mt-2 text-xl font-semibold ${dark ? 'text-white' : 'text-[#132e55]'}`}>{magnet.title}</h3>
            <p className={`mt-2 text-sm leading-6 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{magnet.summary}</p>
          </div>
        </div>
        <FstLandingLeadForm magnet={magnet} formId={formId} related={magnet.related} />
      </div>
    </section>
  );
}
