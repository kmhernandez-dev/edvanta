import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CalendarClock, Check, Clock, BarChart3, ShieldAlert } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, Faq, Section, SectionHeading } from '../components/edvanta/ui';
import { EtiquetaPublico, TemaCard, WebinarCard, CierreDePublico } from '../components/edvanta/comunidadWebinars';
import {
  PUBLICOS, clusterPorSlug, temaPorSlug, temasRelacionados, webinarsDelTema, rutaTema, rutaWebinar,
} from '../data/edvanta/comunidadWebinars';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import NotFound from './NotFound';

const SITIO = 'https://edvanta.co';

export default function ComunidadTema() {
  const { cluster: clusterSlug, tema: temaSlug } = useParams();
  const tema = temaPorSlug(clusterSlug, temaSlug);
  const cluster = tema ? clusterPorSlug(tema.cluster) : null;

  useEffect(() => {
    if (!tema) return;
    updatePageSeo({
      title: tema.seoTitle,
      description: tema.descripcion,
      canonical: `${SITIO}${rutaTema(tema)}`,
      image: `${SITIO}/img/og-edvanta.png`,
      type: 'article',
      jsonLdId: `tema-${tema.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: tema.titulo,
            description: tema.descripcion,
            url: `${SITIO}${rutaTema(tema)}`,
            inLanguage: 'es-CO',
            articleSection: cluster?.nombre,
            author: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
            about: [cluster?.nombre, 'Química farmacéutica', 'Educación continua'].filter(Boolean),
            audience: { '@type': 'Audience', audienceType: PUBLICOS[tema.publico]?.nombre },
          },
          {
            '@type': 'FAQPage',
            mainEntity: tema.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
              { '@type': 'ListItem', position: 2, name: 'Comunidad', item: `${SITIO}/comunidad` },
              { '@type': 'ListItem', position: 3, name: cluster?.corto || 'Temas', item: cluster ? `${SITIO}/comunidad/temas/${cluster.slug}` : `${SITIO}/comunidad/temas` },
              { '@type': 'ListItem', position: 4, name: tema.titulo, item: `${SITIO}${rutaTema(tema)}` },
            ],
          },
        ],
      },
    });
  }, [tema, cluster]);

  if (!tema || !cluster) return <NotFound />;

  const webinars = webinarsDelTema(tema);
  const relacionados = temasRelacionados(tema, 3);
  const esPaciente = tema.publico === 'paciente';

  const clicCta = (origen) => trackEvent('tema_cta_click', { tema: tema.slug, origen, publico: tema.publico });

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-[#F3F7FF] to-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Comunidad', to: '/comunidad' },
              { label: 'Temas', to: '/comunidad/temas' },
              { label: cluster.corto, to: `/comunidad/temas/${cluster.slug}` },
              { label: 'Guía' },
            ]} />
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <EtiquetaPublico publico={tema.publico} />
                  <span className="inline-flex items-center gap-1 rounded-full border border-edvanta-border bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-[.08em] text-edvanta-muted">
                    <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> {tema.nivel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-edvanta-border bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-[.08em] text-edvanta-muted">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {tema.minutos} min
                  </span>
                </div>
                <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-edvanta-deep sm:text-5xl">{tema.titulo}</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-edvanta-muted">{tema.promesa}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {webinars[0] ? (
                    <Link to={rutaWebinar(webinars[0])} onClick={() => clicCta('hero_webinar')} className="ed-btn ed-btn--gradient ed-btn--md">
                      Ver el webinar relacionado <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
                    </Link>
                  ) : (
                    <Link to="/webinars" onClick={() => clicCta('hero_webinars')} className="ed-btn ed-btn--gradient ed-btn--md">
                      Ver el ciclo de webinars <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
                    </Link>
                  )}
                  <Link to="/comunidad" onClick={() => clicCta('hero_comunidad')} className="ed-btn ed-btn--secondary ed-btn--md">Unirme a la comunidad</Link>
                </div>
              </div>

              <aside className="rounded-2xl border border-edvanta-border bg-white p-5 shadow-[0_12px_36px_rgba(23,34,59,.08)] lg:sticky lg:top-24">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">Siguiente paso</p>
                <h2 className="mt-2 font-display text-lg font-bold text-edvanta-deep">{tema.curso.label}</h2>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                  {esPaciente
                    ? 'Recursos gratuitos y educación clara para pacientes y cuidadores.'
                    : tema.publico === 'institucion'
                      ? 'Una propuesta armada con las brechas y los perfiles de tu equipo.'
                      : 'Formación con casos, evaluación y certificado verificable cuando completas el curso.'}
                </p>
                <Link to={tema.curso.to} onClick={() => clicCta('sidebar_curso')} className="ed-btn ed-btn--primary ed-btn--md ed-btn--block mt-4">
                  {tema.curso.label}
                </Link>
                {webinars[0] && (
                  <div className="mt-5 border-t border-edvanta-border pt-4">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Webinar</p>
                    <Link to={rutaWebinar(webinars[0])} className="mt-2 block text-sm font-bold leading-snug text-edvanta-deep hover:text-edvanta-blue">
                      {webinars[0].titulo}
                    </Link>
                    <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-edvanta-subtle">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Fecha por confirmar
                    </p>
                  </div>
                )}
                {tema.articulo && (
                  <div className="mt-4 border-t border-edvanta-border pt-4">
                    <Link to={`/articulos/${tema.articulo}`} className="text-sm font-bold text-edvanta-blue hover:underline">
                      Leer el artículo relacionado →
                    </Link>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        <Section tone="base" compact>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <article className="max-w-3xl">
              <div className="rounded-2xl border-l-4 border-edvanta-teal bg-edvanta-mint/40 p-5">
                <p className="flex items-start gap-2 text-sm leading-7 text-edvanta-deep">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                  <span>
                    <strong>Contenido educativo.</strong> No es consejo clínico individual, no indica dosis ni
                    reemplaza la valoración de un paciente. Aplica las ideas según la normativa y el protocolo de tu institución.
                  </span>
                </p>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-edvanta-deep">El problema que resuelve</h2>
                <p className="mt-4 text-[16px] leading-8 text-edvanta-muted">{tema.problema}</p>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-edvanta-deep">Lo que vas a aprender</h2>
                <ul className="mt-5 space-y-3">
                  {tema.aprender.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-edvanta-muted">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edvanta-mint text-edvanta-tealdark">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-edvanta-deep">Cómo aplicarlo en tu trabajo</h2>
                <ol className="mt-5 space-y-5">
                  {tema.aplicar.map((paso, i) => (
                    <li key={paso} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-edvanta-blue font-display text-sm font-extrabold text-white">{i + 1}</span>
                      <p className="pt-0.5 text-[15px] leading-7 text-edvanta-muted">{paso}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-10 rounded-2xl border border-edvanta-border bg-edvanta-bg p-6">
                <h2 className="font-display text-xl font-bold text-edvanta-deep">Errores que conviene evitar</h2>
                <ul className="mt-4 space-y-3">
                  {tema.errores.map((error) => (
                    <li key={error} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C2410C]" aria-hidden="true" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-edvanta-deep">Preguntas frecuentes</h2>
                <div className="mt-5">
                  <Faq items={tema.faq.map(([q, a]) => ({ q, a }))} />
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-edvanta-border bg-white p-6">
                <h2 className="font-display text-xl font-bold text-edvanta-deep">Para seguir con este tema</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <Link to={tema.curso.to} className="flex items-center justify-between gap-3 rounded-xl border border-edvanta-border px-4 py-3 text-sm font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
                    {tema.curso.label} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                  {webinars[0] && (
                    <Link to={rutaWebinar(webinars[0])} className="flex items-center justify-between gap-3 rounded-xl border border-edvanta-border px-4 py-3 text-sm font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
                      Webinar: {webinars[0].titulo} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  )}
                  <Link to="/comunidad/temas" className="flex items-center justify-between gap-3 rounded-xl border border-edvanta-border px-4 py-3 text-sm font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
                    Ver todas las guías de la comunidad <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">En esta guía</p>
                <ul className="mt-3 space-y-2 text-sm text-edvanta-muted">
                  <li>· Problema y contexto</li>
                  <li>· Qué vas a aprender</li>
                  <li>· Cómo aplicarlo</li>
                  <li>· Errores frecuentes</li>
                  <li>· Preguntas frecuentes</li>
                </ul>
                <p className="mt-4 border-t border-edvanta-border pt-4 text-[12px] leading-5 text-edvanta-subtle">
                  Guía editorial de Edvanta. Autor: equipo editorial. Última revisión: 2026.
                </p>
              </div>
            </aside>
          </div>
        </Section>

        {relacionados.length > 0 && (
          <Section tone="ice">
            <SectionHeading eyebrow="Sigue leyendo" title="Temas relacionados" desc="Otras guías de la comunidad que complementan esta tarea." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((t) => <TemaCard key={t.slug} tema={t} />)}
            </div>
          </Section>
        )}

        {webinars.length > 0 && (
          <Section tone="base">
            <SectionHeading eyebrow="En vivo" title="Webinars sobre este tema" desc="Fecha por confirmar. Inscríbete para recibir el aviso y los recursos de la sesión." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {webinars.map((w) => <WebinarCard key={w.slug} webinar={w} />)}
            </div>
          </Section>
        )}

        <CierreDePublico publico={tema.publico} origen={`tema-${tema.slug}`} />
      </main>
      <SiteFooter />
    </div>
  );
}
