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
import { Breadcrumb, Card, LandingHero, Section } from '../../components/edvanta/ui';
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
        <LandingHero
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Contacto' }]} className="mb-6" />}
          eyebrow="Contacto"
          title="Hablemos"
          lead="Escríbenos por el canal que prefieras. Si tu pregunta es sobre tu salud o tu tratamiento, consúltala con tu médico o farmacéutico tratante: por aquí no damos indicaciones clínicas."
        />

        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-6">
              <div className="space-y-3">
                <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-edvanta-border bg-white p-5 transition hover:border-edvanta-teal/50">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-bold text-edvanta-deep">WhatsApp</span>
                    <span className="block text-sm text-edvanta-muted">La forma más rápida de conversar</span>
                  </span>
                </a>
                {EDVANTA_EMAIL && (
                  <a href={`mailto:${EDVANTA_EMAIL}`}
                    className="flex items-center gap-4 rounded-2xl border border-edvanta-border bg-white p-5 transition hover:border-edvanta-blue/40">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-bold text-edvanta-deep">Correo</span>
                      <span className="block text-sm text-edvanta-muted">{EDVANTA_EMAIL}</span>
                    </span>
                  </a>
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Atajos</p>
                <ul className="mt-3 divide-y divide-edvanta-border overflow-hidden rounded-2xl border border-edvanta-border bg-white">
                  {ATAJOS.map((a) => (
                    <li key={a.to}>
                      <Link to={a.to} className="flex items-center justify-between gap-3 px-5 py-4 text-[15px] font-semibold text-edvanta-deep hover:bg-edvanta-bg">
                        {a.t}
                        <ArrowRight className="h-4 w-4 shrink-0 text-edvanta-blue" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Card>
              <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Escríbenos</h2>
              <p className="mt-1 mb-5 text-sm text-edvanta-muted">Te respondemos al correo que dejes.</p>
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
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
