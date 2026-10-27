/**
 * ============================================================
 *  Contacto.jsx — /contacto
 *
 *  Los canales reales (WhatsApp, correo y el formulario, que se
 *  guarda y se atiende desde el panel) y atajos para lo que más se
 *  pregunta. Una consulta sobre la salud de alguien no se responde
 *  por aquí, y se dice antes de que la escriba.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Card, Eyebrow } from '../../components/edvanta/ui';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { EDVANTA_EMAIL, EDVANTA_WHATSAPP_URL } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const ATAJOS = [
  { t: 'Quiero una propuesta para mi institución', to: '/instituciones#solicitar-propuesta' },
  { t: 'Me interesa el curso en vivo para auxiliares y regentes', to: '/cursos/en-vivo/operacion-segura-servicio-farmaceutico#registro' },
  { t: 'No puedo entrar al aula virtual', to: '/diagnostico' },
  { t: 'Política de reembolsos de los kits', to: '/reembolsos' },
];

export default function Contacto() {
  useEffect(() => updatePageSeo({
    title: 'Contacto | Edvanta',
    description: 'Escríbele a Edvanta por WhatsApp, por correo o con el formulario.',
    canonical: 'https://edvanta.co/contacto',
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        {/* El formulario sube al primer pantallazo: quien llega a Contacto ya decidió escribir. */}
        <section className="ds-surface-glow relative overflow-hidden">
          <div className="ed-grid" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Contacto' }]} className="mb-8" />
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div className="ds-rise">
                <Eyebrow>Contacto</Eyebrow>
                <h1 className="mt-4 font-display font-extrabold leading-[1.07] tracking-[-0.03em] text-edvanta-blue" style={{ fontSize: 'var(--ds-fs-display)' }}>
                  <span className="ed-grad-text">Hablemos</span>
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-edvanta-muted">
                  Escríbenos por el canal que prefieras. Si tu pregunta es sobre tu salud o tu tratamiento, consúltala con tu
                  médico o farmacéutico tratante: por aquí no damos indicaciones clínicas.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group ds-card ds-card--interactive flex items-center gap-4 p-4">
                    <span className="ds-icon-tile ds-icon-tile--teal h-11 w-11 shrink-0"><MessageCircle className="h-5 w-5" aria-hidden="true" /></span>
                    <span>
                      <span className="block font-bold text-edvanta-deep">WhatsApp</span>
                      <span className="block text-sm text-edvanta-muted">La forma más rápida</span>
                    </span>
                  </a>
                  {EDVANTA_EMAIL && (
                    <a href={`mailto:${EDVANTA_EMAIL}`} className="group ds-card ds-card--interactive flex items-center gap-4 p-4">
                      <span className="ds-icon-tile h-11 w-11 shrink-0"><Mail className="h-5 w-5" aria-hidden="true" /></span>
                      <span className="min-w-0">
                        <span className="block font-bold text-edvanta-deep">Correo</span>
                        <span className="block truncate text-sm text-edvanta-muted">{EDVANTA_EMAIL}</span>
                      </span>
                    </a>
                  )}
                </div>
                <p className="mt-10 text-xs font-bold uppercase tracking-[.14em] text-edvanta-subtle">Atajos</p>
                <ul className="mt-3 space-y-1">
                  {ATAJOS.map((a) => (
                    <li key={a.to}>
                      <Link to={a.to} className="group flex items-center justify-between gap-3 border-b border-edvanta-border py-3 text-[15px] font-semibold text-edvanta-deep hover:text-edvanta-blue">
                        {a.t}
                        <ArrowRight className="h-4 w-4 shrink-0 text-edvanta-blue transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="ds-rise-2 self-start p-6 sm:p-8">
                <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Escríbenos</h2>
                <p className="mb-6 mt-1 text-sm text-edvanta-muted">Te respondemos al correo que dejes.</p>
                <FormularioSolicitud
                  tipo="contacto"
                  referencia="contacto-general"
                  roles={['quimico', 'regente', 'auxiliar', 'otro_profesional', 'estudiante', 'paciente', 'cuidador', 'otro']}
                  boton="Enviar mensaje"
                  exito="Te responderemos pronto."
                  resumenWa="Quiero hacerles una consulta."
                />
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
