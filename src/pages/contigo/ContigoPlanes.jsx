/**
 * ContigoPlanes.jsx — /contigo/planes
 *
 * Comparación de la oferta propuesta. Los precios son hipótesis de
 * piloto y la página queda noindex hasta que la oferta se valide.
 */

import { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Faq } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoSection, PlanContigoCard,
} from '../../components/contigo/ContigoPieces';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { CONTIGO_PLANES } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';

const FAQ = [
  {
    q: '¿Puedo pagar Contigo Plus ahora?',
    a: 'No. El precio de $39.000 COP es una hipótesis del piloto y la membresía todavía no está habilitada.',
  },
  {
    q: '¿La consulta farmacéutica está incluida en Plus?',
    a: 'No. La consulta individual se plantea como un servicio separado. Una membresía educativa no debe incluir consultas individuales ilimitadas.',
  },
  {
    q: '¿Qué pasa si cancelo?',
    a: 'La cancelación se definirá antes de abrir la membresía. La intención es que sea sencilla y que puedas conservar tus documentos propios según la política aplicable.',
  },
  {
    q: '¿Los precios son definitivos?',
    a: 'No. Los valores de esta página son de prueba para discutir el piloto. Deben validarse con costos, impuestos y condiciones reales antes de cualquier cobro.',
  },
];

export default function ContigoPlanes() {
  useEffect(() => {
    updatePageSeo({
      title: 'Planes de Edvanta Contigo | Propuesta de piloto',
      description: 'Comparación de la comunidad gratuita, Contigo Plus, la consulta farmacéutica y los convenios institucionales. Precios de prueba, sin cobros activos.',
      canonical: 'https://edvanta.co/contigo/planes',
      robots: 'noindex,follow',
      jsonLdId: 'contigo-planes',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Planes de Edvanta Contigo',
        url: 'https://edvanta.co/contigo/planes',
        isAccessibleForFree: true,
        publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
      },
    });
  }, []);

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Planes' }]} className="mb-8" />
            <ContigoEyebrow>Planes y servicios</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
              Educación, herramientas y acompañamiento por separado
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">
              La comunidad es gratuita. La membresía y la consulta son propuestas de piloto con precios de prueba. Esta versión no procesa pagos.
            </p>
            <div className="mt-6 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Los valores son hipótesis de trabajo. No se cobran en esta versión y no deben tratarse como tarifas definitivas.</span>
            </div>
          </div>
        </header>

        <ContigoSection tone="white">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CONTIGO_PLANES.map((p) => (
              <PlanContigoCard key={p.id} plan={p} destacado={p.id === 'plus'} />
            ))}
          </div>
        </ContigoSection>

        <ContigoSection id="interes" tone="sage">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <ContigoEyebrow>Lista de interés</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Avísame cuando los planes estén disponibles
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                Déjanos tu correo si quieres conocer el avance del piloto. No se te cobrará nada y no se activará una membresía por este formulario.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'La comunidad gratuita sigue abierta en Feliz Sin Tiroides.',
                  'La consulta individual se activará cuando exista un profesional verificado y agenda.',
                  'Los precios se confirmarán antes de habilitar cualquier pago.',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-white">
              <FormularioSolicitud
                tipo="interes"
                referencia="contigo-planes"
                roles={['paciente', 'cuidador', 'otro']}
                pacientes
                boton="Quiero recibir novedades"
                exito="Te escribiremos cuando los planes tengan condiciones revisadas. No se activó ningún cobro."
                resumenWa="Quiero recibir novedades de los planes de Edvanta Contigo."
              />
            </Card>
          </div>
        </ContigoSection>

        <ContigoSection tone="white">
          <ContigoEyebrow>Preguntas frecuentes</ContigoEyebrow>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Antes de decidir
          </h2>
          <Faq items={FAQ} className="mt-6 max-w-4xl" />
          <div className="mt-6 flex flex-wrap gap-3">
            <Btn to="/contigo/tiroides" variant="secondary" iconRight={ArrowRight}>Volver a salud tiroidea</Btn>
            <Btn to="/contigo/red-profesional" variant="ghost" iconRight={ArrowRight}>Soy profesional</Btn>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}
