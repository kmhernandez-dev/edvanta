/**
 * ContigoRutas.jsx — /contigo/rutas
 *
 * Selector de rutas. La única abierta es salud tiroidea. Las demás
 * llevan a su formulario de interés; no muestran herramientas ni
 * compras activas.
 */

import { useEffect } from 'react';
import { ArrowRight, CheckCircle2, HeartPulse, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoSection, RutaContigoCard,
} from '../../components/contigo/ContigoPieces';
import { CONTIGO_RUTAS } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoRutas() {
  useEffect(() => {
    updatePageSeo({
      title: 'Rutas de Edvanta Contigo | Elige tu condición',
      description: 'Seis rutas educativas por condición. Salud tiroidea está abierta hoy; las demás se están preparando y puedes dejar tu interés.',
      canonical: 'https://edvanta.co/contigo/rutas',
      jsonLdId: 'contigo-rutas',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Rutas de Edvanta Contigo',
        url: 'https://edvanta.co/contigo/rutas',
        publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
      },
    });
  }, []);

  const abiertas = CONTIGO_RUTAS.filter((r) => r.estado === 'disponible');
  const futuras = CONTIGO_RUTAS.filter((r) => r.estado !== 'disponible');

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Rutas' }]} className="mb-8" />
            <ContigoEyebrow>Elige tu ruta</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
              Una condición puede necesitar más de una ruta
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">
              Una misma cuenta puede reunir varias condiciones. Empieza por la que hoy tiene contenido y deja tu interés en las que se están preparando.
            </p>
          </div>
        </header>

        <ContigoSection tone="white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <ContigoEyebrow>Disponible hoy</ContigoEyebrow>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Salud tiroidea</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--contigo-muted)]">
                La ruta de Feliz Sin Tiroides reúne guías, contenido educativo, comunidad y las herramientas privadas del portal.
              </p>
            </div>
            <Btn to="/contigo/tiroides" icon={HeartPulse} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
              Conocer salud tiroidea
            </Btn>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div className="max-w-md">
              {abiertas.map((r) => <RutaContigoCard key={r.slug} ruta={r} />)}
            </div>
            <div className="contigo-card p-6">
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Qué encuentras hoy en esta ruta</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Guías y contenido por tema, en lenguaje claro.',
                  'La comunidad voluntaria de Feliz Sin Tiroides.',
                  'Herramientas privadas para medicamentos, laboratorios y consultas.',
                  'La red de acompañamiento profesional cuando esté habilitada.',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-base leading-7 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-[var(--contigo-muted)]">
                Las herramientas privadas se abren en Feliz Sin Tiroides. La comunidad es opcional y no es un canal de consultas clínicas.
              </p>
            </div>
          </div>
        </ContigoSection>

        <ContigoSection tone="sage">
          <ContigoEyebrow>En preparación</ContigoEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Las siguientes rutas todavía no están abiertas
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--contigo-muted)]">
            Puedes dejar tu interés. No mostramos fechas, profesionales, herramientas ni precios que no estén confirmados.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {futuras.map((r) => <RutaContigoCard key={r.slug} ruta={r} />)}
          </div>
        </ContigoSection>

        <ContigoSection tone="white">
          <div className="flex flex-col gap-5 rounded-[22px] border border-[var(--contigo-border)] bg-[var(--contigo-mint)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
              <div>
                <p className="font-bold text-edvanta-deep">Una ruta abierta no es una consulta médica</p>
                <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">
                  Las rutas educativas no diagnostican ni cambian tu tratamiento. Si tienes una urgencia, acude a un servicio de salud.
                </p>
              </div>
            </div>
            <Btn to="/contigo" variant="secondary" size="sm" iconRight={ArrowRight}>Volver a Contigo</Btn>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}
