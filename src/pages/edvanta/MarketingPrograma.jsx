/**
 * ============================================================
 *  MarketingPrograma.jsx — /escuelas/marketing-.../programas/:slug
 *
 *  Landing de una propuesta de programa. Es un borrador público de
 *  lectura: no tiene fecha, precio, matrícula ni certificado. Se marca
 *  noindex y el interés se registra por el formulario existente.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown, Clock, UserRound,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Faq } from '../../components/edvanta/ui';
import {
  EstadoMarketing, MarketingEyebrow, MarketingSection, ProgramaMarketingCard,
} from '../../components/edvanta/marketing';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import {
  ESCUELA_MARKETING, PROGRAMAS_MARKETING, SERVICIOS_MARKETING, programaMarketingPorSlug,
} from '../../data/edvanta/marketing';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

export default function MarketingPrograma() {
  const { slug } = useParams();
  const programa = programaMarketingPorSlug(slug);
  const relacionados = PROGRAMAS_MARKETING.filter((p) => p.slug !== slug).slice(0, 3);
  const servicios = SERVICIOS_MARKETING.filter((s) => programa && (
    (programa.area === 'marketing-farmaceutico' && ['estrategia-y-posicionamiento', 'landing-pages-y-campanas'].includes(s.slug))
    || (programa.area === 'visita-medica' && s.slug === 'materiales-comerciales')
    || (programa.area === 'comunicacion-cientifica' && s.slug === 'comunicacion-cientifica')
    || (programa.area === 'contenido-educativo' && s.slug === 'contenido-digital-y-video')
  )).slice(0, 2);

  useEffect(() => {
    if (!programa) return;
    updatePageSeo({
      title: `${programa.nombre} | Programa en desarrollo | Edvanta`,
      description: `${programa.resultado} Programa propuesto de la Escuela de Marketing y Comunicación Farmacéutica.`,
      canonical: `https://edvanta.co/escuelas/${ESCUELA_MARKETING.slug}/programas/${programa.slug}`,
      robots: 'noindex,follow',
      jsonLdId: `marketing-programa-${programa.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
          { '@type': 'ListItem', position: 2, name: 'Escuelas', item: 'https://edvanta.co/escuelas' },
          { '@type': 'ListItem', position: 3, name: 'Marketing y Comunicación', item: `https://edvanta.co/escuelas/${ESCUELA_MARKETING.slug}` },
          { '@type': 'ListItem', position: 4, name: programa.nombre, item: `https://edvanta.co/escuelas/${ESCUELA_MARKETING.slug}/programas/${programa.slug}` },
        ],
      },
    });
  }, [programa]);

  if (!programa) return <NotFound />;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-edvanta-border bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Escuelas', to: '/escuelas' },
                { label: 'Marketing y Comunicación', to: `/escuelas/${ESCUELA_MARKETING.slug}` },
                { label: programa.nombre },
              ]}
              className="mb-8"
            />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <EstadoMarketing estado="en_desarrollo" />
                  <span className="text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-subtle">{programa.linea}</span>
                </div>
                <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
                  {programa.nombre}
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-edvanta-muted">{programa.resumen}</p>
                <div className="mt-6 rounded-2xl border border-[#DDD5F4] bg-[#F4F0FB] p-4 text-sm leading-6 text-edvanta-deep">
                  <strong>Programa en desarrollo.</strong> Todavía no tiene fecha de apertura, matrícula publicada ni certificado confirmado. Esta página presenta la propuesta para recibir comentarios e interés.
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn href="#novedades" size="lg" iconRight={ArrowRight}>Quiero recibir novedades</Btn>
                  <Btn to={`/escuelas/${ESCUELA_MARKETING.slug}`} variant="secondary" size="lg" icon={BookOpen}>
                    Volver a la escuela
                  </Btn>
                </div>
              </div>

              <div className="marketing-area-visual">
                <div>
                  <span className="marketing-area-visual__kicker">Propuesta de programa</span>
                  <p className="mt-4 font-display text-2xl font-extrabold leading-tight text-edvanta-deep">{programa.resultado}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-edvanta-tealdark">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1"><BookOpen className="h-3.5 w-3.5" />Contenido propuesto</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1"><Clock className="h-3.5 w-3.5" />Sin fecha confirmada</span>
                  </div>
                </div>
                <ul className="mt-6 space-y-2">
                  {programa.temario.map((t, i) => (
                    <li key={t.titulo} className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-xs leading-5 text-edvanta-deep">
                      <span className="font-bold text-[#5E51A8]">0{i + 1}</span>
                      {t.titulo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </header>

        <MarketingSection tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Qué podrás aprender</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                Resultados de aprendizaje propuestos
              </h2>
              <p className="mt-4 text-base leading-7 text-edvanta-muted">
                Estos resultados orientan el programa. El contenido final se ajustará cuando la oferta esté validada.
              </p>
              <ul className="mt-6 space-y-3">
                {programa.resultados.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[15px] leading-7 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <h2 className="font-display text-xl font-extrabold text-edvanta-deep">A quién se dirige</h2>
              <p className="mt-3 text-sm leading-7 text-edvanta-muted">{programa.publico}</p>
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F8FAFD] p-4 text-sm leading-6 text-edvanta-deep">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                No hay requisitos publicados. Si el programa avanza, se confirmarán los conocimientos previos recomendados.
              </div>
            </Card>
          </div>
        </MarketingSection>

        <MarketingSection tone="lavender">
          <MarketingEyebrow>Propuesta de temario</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
            Cómo podría organizarse
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            Es una propuesta de estructura, no un temario definitivo. Los contenidos se revisarán antes de abrir el programa.
          </p>
          <div className="mt-8 divide-y divide-edvanta-border overflow-hidden rounded-2xl border border-edvanta-border bg-white">
            {programa.temario.map((t, i) => (
              <details key={t.titulo} className="group px-5 py-4" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-edvanta-deep [&::-webkit-details-marker]:hidden">
                  <span><span className="mr-3 text-xs font-extrabold uppercase tracking-[.12em] text-edvanta-tealdark">Módulo {i + 1}</span>{t.titulo}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-edvanta-blue transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-2 text-sm leading-7 text-edvanta-muted">{t.desc}</p>
              </details>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Metodología propuesta</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                Cómo se estudiaría
              </h2>
              <p className="mt-4 text-base leading-7 text-edvanta-muted">{programa.metodologia}</p>
              <p className="mt-4 text-sm leading-7 text-edvanta-muted">
                No se anuncia duración, modalidad definitiva, docente ni certificado mientras la oferta no esté confirmada.
              </p>
            </div>
            <Card className="bg-[#F8FAFD]">
              <h3 className="font-display text-lg font-extrabold text-edvanta-deep">Preguntas frecuentes</h3>
              <Faq items={programa.faq} className="mt-4" />
            </Card>
          </div>
        </MarketingSection>

        <MarketingSection id="novedades" tone="mint">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Recibir novedades</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                Avísame cuando haya una fecha real
              </h2>
              <p className="mt-4 text-base leading-7 text-edvanta-muted">
                Déjanos tu correo para avisarte cuando el programa abra o cuando haya una propuesta revisada. No prometemos una fecha.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn to={`/escuelas/${ESCUELA_MARKETING.slug}`} variant="secondary" size="sm" iconRight={ArrowRight}>Volver a la escuela</Btn>
                <Btn to="/empresas/marketing" variant="ghost" size="sm" iconRight={ArrowRight}>Ver servicios para empresas</Btn>
              </div>
            </div>
            <Card className="bg-white">
              <FormularioSolicitud
                key={programa.slug}
                tipo="interes"
                referencia={programa.slug}
                roles={['quimico', 'otro_profesional', 'estudiante', 'otro']}
                boton="Quiero recibir novedades"
                exito="Te escribiremos cuando el programa tenga una fecha o una propuesta revisada."
                resumenWa={`Me interesa el programa ${programa.nombre}.`}
              />
            </Card>
          </div>
        </MarketingSection>

        <MarketingSection tone="white">
          <MarketingEyebrow>Sigue explorando</MarketingEyebrow>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">Otros programas de la escuela</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => <ProgramaMarketingCard key={p.slug} programa={p} escuelaSlug={ESCUELA_MARKETING.slug} />)}
          </div>
          {servicios.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {servicios.map((s) => (
                <Link key={s.slug} to={`/empresas/marketing/${s.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-tealdark hover:underline">
                  Servicio relacionado: {s.nombre} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </MarketingSection>
      </main>
      <SiteFooter />
    </div>
  );
}
