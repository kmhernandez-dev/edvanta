/**
 * /comunidades/:slug — Página de una comunidad de enfermedad.
 *
 * Presenta el espacio, sus reglas, los artículos para empezar y la ruta
 * del profesional. La acción principal es el WhatsApp de Karla
 * (+57 300 633 2244) con un mensaje propio de la enfermedad.
 */

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, HeartPulse, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { comunidadDeSlug } from '../data/comunidadesSalud';
import { articulos } from '../data/articulos';
import { updatePageSeo } from '../utils/seo';
import { descripcionDeComunidad, faqJsonLd, paraDeComunidad, preguntasDeComunidad, tituloSeoDeComunidad } from '../lib/comunidades/seo';
import { trackEvent } from '../utils/analytics';

const SITIO = 'https://edvanta.co';

export default function ComunidadDetalle() {
  const { slug } = useParams();
  const comunidad = comunidadDeSlug(slug);
  const preguntas = comunidad
    ? preguntasDeComunidad(comunidad, (s) => articulos.find((a) => a.slug === s)?.title || null)
    : [];

  useEffect(() => {
    if (!comunidad) return undefined;
    const canonical = `${SITIO}${comunidad.ruta}`;
    return updatePageSeo({
      title: tituloSeoDeComunidad(comunidad),
      description: descripcionDeComunidad(comunidad),
      canonical,
      type: 'website',
      keywords: comunidad.keywords,
      jsonLdId: 'comunidad',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            name: comunidad.titulo,
            description: descripcionDeComunidad(comunidad),
            url: canonical,
            inLanguage: 'es-CO',
            isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
              { '@type': 'ListItem', position: 2, name: 'Comunidades', item: `${SITIO}/comunidades` },
              { '@type': 'ListItem', position: 3, name: comunidad.nombre, item: canonical },
            ],
          },
          faqJsonLd(preguntas),
        ],
      },
    });
  }, [comunidad]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!comunidad) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-extrabold text-edvanta-blue">No encontramos esta comunidad</h1>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">Puede que la dirección haya cambiado. Estas son todas las comunidades disponibles.</p>
            <Link to="/comunidades" className="ed-btn ed-btn--primary mt-6 inline-flex">Ver comunidades</Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const relacionados = comunidad.articulos
    .map((s) => articulos.find((a) => a.slug === s))
    .filter(Boolean)
    .slice(0, 6);

  const entrar = () => trackEvent('community_join_clicked', {
    enfermedad: comunidad.slug,
    origen: 'comunidad_pagina',
    destino: 'whatsapp',
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Comunidades', to: '/comunidades' },
              { label: comunidad.nombre },
            ]} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-edvanta-teal/30 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
              <HeartPulse className="h-4 w-4" aria-hidden="true" />
              Grupo de apoyo · {comunidad.nombre}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[2.8rem]">
              {comunidad.titulo}
            </h1>
            <div className="mt-4 max-w-3xl space-y-3 text-lg leading-8 text-edvanta-muted">
              <p className="font-semibold text-edvanta-deep">Grupo de apoyo gratis por WhatsApp para {paraDeComunidad(comunidad)}.</p>
              {comunidad.intro.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={comunidad.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={entrar}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1fb959]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Entrar por WhatsApp
              </a>
              {comunidad.grupo && (
                <a
                  href={comunidad.grupo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={entrar}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light"
                >
                  Grupo de Feliz Sin Tiroides
                </a>
              )}
              <Link to="/articulos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-muted transition hover:bg-edvanta-light">
                Leer antes de entrar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-edvanta-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />
                Gratuita. No reemplaza la consulta ni el tratamiento.
              </span>
              <span>WhatsApp de Karla: +57 300 633 2244</span>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Qué encontrarás</h2>
              <ul className="mt-4 space-y-3">
                {comunidad.queEncuentras.map((t) => (
                  <li key={t} className="flex gap-3 rounded-xl border border-edvanta-border bg-white p-4 text-sm leading-6 text-edvanta-ink/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-extrabold text-edvanta-deep">Para quién es</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {comunidad.paraQuien.map((t) => (
                  <li key={t} className="rounded-full bg-edvanta-mint px-3 py-1.5 text-sm font-semibold text-edvanta-tealdark">{t}</li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-extrabold text-edvanta-deep">Reglas de la comunidad</h2>
              <ol className="mt-4 space-y-3">
                {comunidad.reglas.map((t, i) => (
                  <li key={t} className="flex gap-3 text-sm leading-6 text-edvanta-ink/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-edvanta-blue text-xs font-bold text-white">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <p className="font-bold">Lo que no es</p>
                <p className="mt-1">{comunidad.noEs}</p>
              </div>

              {relacionados.length > 0 && (
                <>
                  <h2 className="mt-10 font-display text-2xl font-extrabold text-edvanta-deep">Artículos para empezar</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {relacionados.map((a) => (
                      <Link key={a.slug} to={`/articulos/${a.slug}`} className="group rounded-xl border border-edvanta-border bg-white p-4 transition hover:border-edvanta-teal/40 hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{a.category}</p>
                        <p className="mt-1.5 font-display text-base font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{a.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-edvanta-muted">{a.description}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <h2 className="mt-10 font-display text-2xl font-extrabold text-edvanta-deep">Preguntas sobre el grupo de apoyo</h2>
              <div className="mt-4 divide-y divide-edvanta-border rounded-2xl border border-edvanta-border bg-white">
                {preguntas.map(([q, a]) => (
                  <details key={q} className="group p-4">
                    <summary className="cursor-pointer list-none font-display text-base font-bold text-edvanta-deep marker:hidden">
                      <h3 className="inline">{q}</h3>
                    </summary>
                    <p className="mt-2 text-sm leading-6 text-edvanta-ink/80">{a}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-edvanta-border bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Quién coordina</p>
                <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">Karla Hernández</p>
                <p className="mt-1 text-sm leading-6 text-edvanta-muted">
                  Química farmacéutica clínica. La comunidad es un espacio educativo; las decisiones clínicas
                  siguen en manos de tu equipo de salud.
                </p>
                <Link to="/autores/karla-hernandez" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                  Conocer a la autora
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/35 p-5">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Cómo entrar
                </p>
                <ol className="mt-3 space-y-3 text-sm leading-6 text-edvanta-ink/80">
                  <li><span className="font-bold text-edvanta-deep">1.</span> Escribe por WhatsApp y di qué comunidad te interesa.</li>
                  <li><span className="font-bold text-edvanta-deep">2.</span> Recibe las reglas y la bienvenida.</li>
                  <li><span className="font-bold text-edvanta-deep">3.</span> Participa cuando quieras; no hay obligación de escribir.</li>
                </ol>
                <a
                  href={comunidad.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={entrar}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1fb959]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Escribir a Karla
                </a>
              </div>

              {comunidad.curso && (
                <div className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    {/autocuidado/.test(comunidad.curso.ruta) ? 'Curso para pacientes' : 'Para profesionales'}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">Curso: {comunidad.curso.nombre}</p>
                  <p className="mt-1 text-sm leading-6 text-edvanta-muted">{/autocuidado/.test(comunidad.curso.ruta) ? 'Gratis, con certificado al terminar.' : 'Empieza por la primera unidad gratis; el curso completo incluye certificado verificable.'}</p>
                  <Link to={comunidad.curso.ruta} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                    Ver el curso
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}

              {comunidad.guiaPro && (
                <div className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Guía profesional</p>
                  <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">{comunidad.guiaPro.nombre}</p>
                  <Link to={comunidad.guiaPro.ruta} onClick={() => trackEvent('guide_clicked', { enfermedad: comunidad.slug, origen: 'comunidad_pagina', tipo: 'profesional' })} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                    Ver la guía
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}

              {comunidad.guia?.publico === 'pacientes' && (
                <div className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Guía para pacientes</p>
                  <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">{comunidad.guia.nombre}</p>
                  <p className="mt-1 text-sm leading-6 text-edvanta-muted">Material educativo de Hotmart. No reemplaza la consulta.</p>
                  <Link to={comunidad.guia.ruta} onClick={() => trackEvent('guide_clicked', { enfermedad: comunidad.slug, origen: 'comunidad_pagina', tipo: 'paciente' })} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                    Ver la guía
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="border-t border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Entra cuando lo necesites</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-edvanta-muted">
              No tienes que contar tu historia para pertenecer. Puedes leer, aprender y participar a tu ritmo.
            </p>
            <a
              href={comunidad.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={entrar}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 text-sm font-bold text-white transition hover:bg-[#1fb959]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Entrar a la comunidad de {comunidad.nombre}
            </a>
            <p className="mt-4">
              <Link to="/comunidades" className="text-sm font-semibold text-edvanta-blue hover:underline">Ver todas las comunidades</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
