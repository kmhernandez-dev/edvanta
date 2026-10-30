/**
 * ============================================================
 *  MarketingEscuela.jsx — Escuela de Marketing y Comunicación
 *
 *  Puerta de entrada a dos recorridos: formación para profesionales
 *  y servicios de marketing para empresas. Los programas nuevos se
 *  muestran como propuestas en desarrollo; no se presentan como cursos
 *  abiertos ni con fecha, precio o certificado inventados.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, CheckCircle2, GraduationCap, Megaphone, Sparkles,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Faq } from '../../components/edvanta/ui';
import {
  EjemploEntregable, MarketingAreaTabs, MarketingEyebrow, MarketingHeroVisual,
  MarketingSection, ProgramaMarketingCard, ProcesoMarketing, ServicioMarketingCard,
} from '../../components/edvanta/marketing';
import {
  AREAS_MARKETING, EJEMPLOS_ENTREGABLES, ESCUELA_MARKETING, FAQ_MARKETING,
  PROCESO_MARKETING, PROGRAMAS_MARKETING, SERVICIOS_MARKETING,
} from '../../data/edvanta/marketing';
import { updatePageSeo } from '../../utils/seo';

const servicioPorSlug = (slug) => SERVICIOS_MARKETING.find((s) => s.slug === slug);

export default function MarketingEscuela() {
  const e = ESCUELA_MARKETING;

  useEffect(() => {
    updatePageSeo({
      title: 'Escuela de Marketing y Comunicación Farmacéutica | Edvanta',
      description: 'Formación para profesionales y soluciones para empresas que quieren comunicar con claridad en el sector farmacéutico y de la salud.',
      canonical: 'https://edvanta.co/escuelas/marketing-y-comunicacion-farmaceutica',
      image: 'https://edvanta.co/img/escuelas/marketing.webp',
      keywords: ['marketing farmacéutico', 'comunicación científica', 'visita médica', 'formación farmacéutica'],
      jsonLdId: 'escuela-marketing',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Escuela de Marketing y Comunicación Farmacéutica',
          description: 'Formación y servicios de marketing y comunicación para profesionales y empresas del sector farmacéutico y de la salud.',
          url: 'https://edvanta.co/escuelas/marketing-y-comunicacion-farmaceutica',
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Escuelas', item: 'https://edvanta.co/escuelas' },
            { '@type': 'ListItem', position: 3, name: 'Marketing y Comunicación', item: 'https://edvanta.co/escuelas/marketing-y-comunicacion-farmaceutica' },
          ],
        },
      ],
    });
  }, []);

  const destacadoCientifico = servicioPorSlug('comunicacion-cientifica');
  const destacadoEquipos = servicioPorSlug('formacion-de-equipos');
  const otrosServicios = SERVICIOS_MARKETING.filter((s) => !['comunicacion-cientifica', 'formacion-de-equipos'].includes(s.slug));

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        {/* A. Hero */}
        <header className="border-b border-edvanta-border bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Escuelas', to: '/escuelas' },
                { label: 'Marketing y Comunicación' },
              ]}
              className="mb-8"
            />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
              <div>
                <MarketingEyebrow>{e.eyebrow}</MarketingEyebrow>
                <h1 className="mt-4 font-display text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-edvanta-blue sm:text-[2.8rem] lg:text-[3.15rem]">
                  {e.titulo}
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-edvanta-muted">{e.lead}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn href="#formacion" size="lg" iconRight={ArrowRight}>Explorar formación</Btn>
                  <Btn to="/empresas/marketing" variant="secondary" size="lg" icon={Building2}>
                    Ver soluciones para empresas
                  </Btn>
                </div>
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-edvanta-subtle">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-violet" aria-hidden="true" />
                  Los programas nuevos están en desarrollo. No hay fechas, precios ni certificados anunciados.
                </p>
              </div>
              <MarketingHeroVisual />
            </div>
          </div>
        </header>

        {/* B. Dos entradas */}
        <MarketingSection tone="white">
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              to="#formacion"
              className="group rounded-[22px] border border-edvanta-border bg-white p-6 transition hover:-translate-y-0.5 hover:border-edvanta-violet/50 hover:shadow-[0_18px_34px_-28px_rgba(8,46,134,0.35)] sm:p-8"
            >
              <span className="marketing-card__icon">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-edvanta-deep">Quiero aprender</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-edvanta-muted">
                Cursos y rutas para profesionales que quieren comunicar mejor, entender la evidencia y ordenar su trabajo.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
                Ver formación especializada <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              to="/empresas/marketing"
              className="group rounded-[22px] border border-[#CDE8E3] bg-[#EFF8F2] p-6 transition hover:-translate-y-0.5 hover:border-edvanta-teal/50 hover:shadow-[0_18px_34px_-28px_rgba(8,46,134,0.35)] sm:p-8"
            >
              <span className="marketing-card__icon bg-white">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-edvanta-deep">Busco una solución para mi empresa</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-edvanta-muted">
                Estrategia, comunicación científica, materiales y formación de equipos para organizaciones del sector salud.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-tealdark">
                Explorar servicios <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </MarketingSection>

        {/* C. Áreas */}
        <MarketingSection id="areas" tone="lavender">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Explora las áreas</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Cuatro formas de conectar ciencia y comunicación
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-edvanta-muted">
                Cada área reúne una pregunta de trabajo, tres aplicaciones concretas y los programas o servicios que pueden ayudarte a resolverla.
              </p>
            </div>
            <MarketingAreaTabs areas={AREAS_MARKETING} />
          </div>
        </MarketingSection>

        {/* D. Formación */}
        <MarketingSection id="formacion" tone="white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <MarketingEyebrow>Formación especializada</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Programas en desarrollo, propuestas abiertas
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
                Estas líneas están en preparación. Puedes conocer la propuesta y dejar tu interés; no se presentan como cursos abiertos.
              </p>
            </div>
            <Link to="/cursos" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
              Ver cursos disponibles <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMAS_MARKETING.map((p) => (
              <ProgramaMarketingCard key={p.slug} programa={p} escuelaSlug={e.slug} />
            ))}
          </div>
        </MarketingSection>

        {/* E. Soluciones para empresas */}
        <MarketingSection id="empresas" tone="mint">
          <MarketingEyebrow>Para empresas</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Soluciones para comunicar mejor la ciencia
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            Trabajamos con equipos de marketing, medical affairs, comunicación y formación. El alcance y la propuesta se definen según la necesidad de cada organización.
          </p>

          {destacadoCientifico && (
            <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">Comunicación científica</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep">Evidencia clara, con referencias y sin exageraciones</h3>
                <p className="mt-3 text-sm leading-7 text-edvanta-muted">{destacadoCientifico.necesidad}</p>
                <ul className="mt-5 space-y-2.5">
                  {destacadoCientifico.entregables.slice(0, 3).map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Btn to={`/empresas/marketing/${destacadoCientifico.slug}`} className="mt-6" variant="secondary" iconRight={ArrowRight}>
                  Conocer comunicación científica
                </Btn>
              </div>
              <EjemploEntregable ejemplo={{ titulo: 'Síntesis de evidencia', desc: 'Una pieza para explicar qué dice una fuente y qué no permite afirmar.', variante: 'ficha' }} />
            </div>
          )}

          {destacadoEquipos && (
            <div className="mt-12 grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="order-2 lg:order-1">
                <EjemploEntregable ejemplo={{ titulo: 'Programa de formación', desc: 'Una secuencia de sesiones y materiales para un equipo.', variante: 'programa' }} />
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">Formación de equipos</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep">Criterios comunes para comunicar con consistencia</h3>
                <p className="mt-3 text-sm leading-7 text-edvanta-muted">{destacadoEquipos.necesidad}</p>
                <Btn to={`/empresas/marketing/${destacadoEquipos.slug}`} className="mt-6" variant="secondary" iconRight={ArrowRight}>
                  Conocer formación para equipos
                </Btn>
              </div>
            </div>
          )}

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {otrosServicios.map((s) => <ServicioMarketingCard key={s.slug} servicio={s} />)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn to="/empresas/marketing" size="lg" iconRight={ArrowRight}>Ver todos los servicios</Btn>
            <Btn to="/instituciones" variant="secondary" size="lg" icon={Building2}>Capacitación para instituciones</Btn>
          </div>
        </MarketingSection>

        {/* F. Proceso */}
        <MarketingSection id="como-trabajamos" tone="white">
          <MarketingEyebrow>Cómo trabajamos</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            De la necesidad a una entrega concreta
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            Cinco etapas. En cada una sabes qué se trabaja y qué recibes. La revisión científica y de marca se integra cuando corresponde.
          </p>
          <ProcesoMarketing pasos={PROCESO_MARKETING} />
        </MarketingSection>

        {/* G. Ejemplos */}
        <MarketingSection tone="lavender">
          <MarketingEyebrow>Ejemplos de entregables</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Así puede verse una entrega
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            Son ejemplos de estructura y no proyectos contratados. Cada pieza se adapta al objetivo, al público y a las fuentes disponibles.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EJEMPLOS_ENTREGABLES.map((ejemplo) => (
              <EjemploEntregable key={ejemplo.id} ejemplo={ejemplo} />
            ))}
          </div>
        </MarketingSection>

        {/* H. Preguntas */}
        <MarketingSection tone="white">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Preguntas frecuentes</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Lo que conviene saber antes de empezar
              </h2>
              <p className="mt-4 text-sm leading-7 text-edvanta-muted">
                Si tu pregunta no está aquí, escríbenos. No prometemos fechas, certificados ni resultados que no estén confirmados.
              </p>
            </div>
            <Faq items={FAQ_MARKETING} />
          </div>
        </MarketingSection>

        {/* I. Cierre */}
        <section className="border-t border-edvanta-border bg-[#F8FAFD]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-8">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">Dos caminos, una misma escuela</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">
                Aprende a comunicar o trabaja con nosotros para hacerlo.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-edvanta-muted">
                La formación abre criterios. Los servicios ayudan a aplicarlos en una organización concreta.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Btn href="#formacion" size="lg" iconRight={ArrowRight}>Explorar formación</Btn>
              <Btn to="/empresas/marketing#solicitar-propuesta" variant="secondary" size="lg" icon={Megaphone}>
                Solicitar propuesta
              </Btn>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
