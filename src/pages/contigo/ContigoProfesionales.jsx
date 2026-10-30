/**
 * ContigoProfesionales.jsx — /contigo/profesionales
 *
 * Catálogo de la red profesional. No hay perfiles verificados todavía:
 * la página lo dice y explica el proceso, sin inventar nombres ni agendas.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Stethoscope, UserRound } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection } from '../../components/contigo/ContigoPieces';
import { CONTIGO_PROFESIONALES, CONTIGO_SERVICIOS, RED_PROFESIONAL } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoProfesionales() {
  useEffect(() => {
    updatePageSeo({
      title: 'Red de profesionales | Edvanta Contigo',
      description: 'La red de profesionales de Edvanta Contigo está en preparación. Conoce el proceso y el servicio propuesto.',
      canonical: 'https://edvanta.co/contigo/profesionales',
      robots: 'noindex,follow',
      jsonLdId: 'contigo-profesionales',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Red de profesionales de Edvanta Contigo',
        url: 'https://edvanta.co/contigo/profesionales',
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
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Profesionales' }]} className="mb-8" />
            <ContigoEyebrow>Red de profesionales</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
              Acompañamiento con profesionales verificados
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">
              {RED_PROFESIONAL.lead}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn to="/contigo/red-profesional" icon={UserRound} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                Quiero vincularme
              </Btn>
              <Btn to="/contigo/planes" variant="secondary">Ver planes y precios propuestos</Btn>
            </div>
          </div>
        </header>

        <ContigoSection tone="white">
          <div className="contigo-empty">
            <span className="contigo-icon mx-auto"><Stethoscope className="h-5 w-5" aria-hidden="true" /></span>
            <h2>La red todavía no tiene profesionales verificados</h2>
            <p>
              No mostramos perfiles, testimonios, valoraciones ni agendas inventadas. Cuando haya profesionales vinculados y verificados, aparecerán aquí con su título, formación, país, alcance, precio y disponibilidad.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {CONTIGO_SERVICIOS.map((s) => (
                <Btn key={s.slug} to={`/contigo/servicios/${s.slug}/reservar`} variant="secondary" size="sm" iconRight={ArrowRight}>
                  Conocer {s.nombre.toLowerCase()}
                </Btn>
              ))}
              <Btn to="/contigo/red-profesional" variant="link" iconRight={ArrowRight}>Ver proceso de vinculación</Btn>
            </div>
          </div>
        </ContigoSection>

        <ContigoSection tone="sage">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <ContigoEyebrow>Qué se está preparando</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Una red, no un directorio de perfiles sin verificar
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                La vinculación exige revisión documental, verificación profesional y delimitación de servicios. Una solicitud no habilita la atención automáticamente.
              </p>
            </div>
            <Card>
              <h3 className="font-display text-lg font-extrabold text-edvanta-deep">Requisitos de vinculación</h3>
              <ul className="mt-4 space-y-3">
                {RED_PROFESIONAL.requisitos.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              <Btn to="/contigo/red-profesional/postulacion" className="mt-5" size="sm" iconRight={ArrowRight}>Enviar mi solicitud</Btn>
            </Card>
          </div>
        </ContigoSection>

        {CONTIGO_PROFESIONALES.length > 0 && (
          <ContigoSection tone="white">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CONTIGO_PROFESIONALES.map((p) => (
                <Link key={p.slug} to={`/contigo/profesionales/${p.slug}`} className="contigo-card contigo-card--interactive p-5">
                  <p className="font-display text-lg font-extrabold text-edvanta-deep">{p.nombre}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">{p.titulo}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--contigo-primary)]">
                    Ver perfil <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </ContigoSection>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
