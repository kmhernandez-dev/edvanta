/**
 * /examenes/:slug — Examen interactivo con respuestas explicadas.
 *
 * La página es indexable: incluye el temario, todas las preguntas y una
 * clave de respuestas visible para estudiar. El componente interactivo
 * corrige en el navegador y no guarda datos personales.
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, BookOpenCheck, CheckCircle2, Clock3, GraduationCap, ShieldCheck, Users,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import ExamenInteractivo from '../components/examenes/ExamenInteractivo';
import QuizGrupal from '../components/examenes/QuizGrupal';
import { EXAMENES, examenPorSlug, examenRevisado, robotsDeExamen } from '../data/examenes';
import { getArticulo } from '../data/articulos';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const SITIO = 'https://edvanta.co';

export default function ExamenDetalle() {
  const { slug } = useParams();
  const examen = examenPorSlug(slug);
  const [modo, setModo] = useState('individual');

  useEffect(() => {
    setModo('individual');
  }, [slug]);

  useEffect(() => {
    if (!examen) return undefined;
    const canonical = `${SITIO}${examen.ruta}`;
    return updatePageSeo({
      title: examen.seo.titulo,
      description: examen.seo.descripcion,
      canonical,
      type: 'website',
      robots: robotsDeExamen(examen.slug),
      keywords: [examen.titulo, `${examen.categoria} preguntas`, `${examen.categoria} examen`],
      jsonLdId: 'examen',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Quiz',
            name: examen.titulo,
            description: examen.seo.descripcion,
            url: canonical,
            inLanguage: 'es-CO',
            educationalLevel: examen.nivel,
            about: examen.temas,
            isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
            hasPart: examen.preguntas.map((p) => ({
              '@type': 'Question',
              name: p.enunciado,
              acceptedAnswer: { '@type': 'Answer', text: p.opciones[p.correcta] },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
              { '@type': 'ListItem', position: 2, name: 'Exámenes', item: `${SITIO}/examenes` },
              { '@type': 'ListItem', position: 3, name: examen.titulo, item: canonical },
            ],
          },
        ],
      },
    });
  }, [examen]);

  if (!examen) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-extrabold text-edvanta-blue">No encontramos este examen</h1>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">Puede que la dirección haya cambiado. Estos son los exámenes disponibles.</p>
            <Link to="/examenes" className="ed-btn ed-btn--primary mt-6 inline-flex">Ver exámenes</Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const revisado = examenRevisado(examen.slug);
  const relacionados = examen.articulos
    .map((s) => getArticulo(s))
    .filter(Boolean);
  const avanzados = EXAMENES.filter((e) => e.nivel === 'Avanzado' && e.slug !== examen.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Exámenes', to: '/examenes' },
              { label: examen.categoria },
            ]} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-edvanta-teal/30 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
              <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
              {examen.categoria}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[2.9rem]">
              {examen.titulo}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-edvanta-muted">{examen.descripcion}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-edvanta-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-edvanta-border"><CheckCircle2 className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{examen.preguntas.length} preguntas</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-edvanta-border"><Clock3 className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{examen.duracion}</span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-edvanta-border">{examen.nivel}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <div className="space-y-3 text-[15px] leading-7 text-edvanta-ink/80">
                {examen.introduccion.map((p) => <p key={p}>{p}</p>)}
              </div>

              <div className="mt-6 rounded-2xl border border-edvanta-border bg-white p-5">
                <h2 className="font-display text-lg font-bold text-edvanta-deep">Qué evalúa</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {examen.temas.map((t) => (
                    <li key={t} className="rounded-full bg-edvanta-bg px-3 py-1.5 text-sm font-semibold text-edvanta-deep">{t}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-sm leading-6 text-edvanta-muted">
                  Resuélvelo solo o juega en grupos: el modo grupal reparte turnos, lleva puntaje y muestra la
                  explicación después de cada respuesta.
                </p>
                <div className="mt-3 inline-flex rounded-xl border border-edvanta-border bg-white p-1" role="tablist" aria-label="Modo de práctica">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={modo === 'individual'}
                    onClick={() => setModo('individual')}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${modo === 'individual' ? 'bg-edvanta-blue text-white' : 'text-edvanta-deep hover:bg-edvanta-bg'}`}
                  >
                    <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                    Individual
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={modo === 'grupo'}
                    onClick={() => setModo('grupo')}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${modo === 'grupo' ? 'bg-edvanta-blue text-white' : 'text-edvanta-deep hover:bg-edvanta-bg'}`}
                  >
                    <Users className="h-4 w-4" aria-hidden="true" />
                    En grupos
                  </button>
                </div>

                <div className="mt-5">
                  {modo === 'individual' ? <ExamenInteractivo examen={examen} /> : <QuizGrupal examen={examen} />}
                </div>
              </div>

              <details className="mt-10 rounded-2xl border border-edvanta-border bg-white p-5">
                <summary className="cursor-pointer list-none font-display text-lg font-bold text-edvanta-blue">
                  Ver la clave de respuestas y explicaciones
                </summary>
                <ol className="mt-4 space-y-4">
                  {examen.preguntas.map((p, i) => (
                    <li key={p.id} className="border-t border-edvanta-border pt-4 first:border-0 first:pt-0">
                      <p className="text-sm font-bold text-edvanta-deep">{i + 1}. {p.enunciado}</p>
                      <p className="mt-1 text-sm text-edvanta-tealdark"><strong>Respuesta:</strong> {p.opciones[p.correcta]}</p>
                      <p className="mt-1 text-sm leading-6 text-edvanta-ink/80">{p.explicacion}</p>
                      <p className="mt-1 text-xs text-edvanta-muted">Fuente: {p.fuente}</p>
                    </li>
                  ))}
                </ol>
              </details>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Link to={examen.curso.ruta} className="rounded-2xl border border-edvanta-border bg-white p-5 transition hover:border-edvanta-teal/40">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark"><GraduationCap className="h-4 w-4" aria-hidden="true" />Curso gratis</p>
                  <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">{examen.curso.nombre}</p>
                  <p className="mt-1 text-sm leading-6 text-edvanta-muted">Clases abiertas y certificado al terminar. Sin costo.</p>
                </Link>
                <Link to={examen.guia.ruta} className="rounded-2xl border border-edvanta-border bg-white p-5 transition hover:border-edvanta-teal/40">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark"><BookOpen className="h-4 w-4" aria-hidden="true" />Guía para profesionales</p>
                  <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">{examen.guia.nombre}</p>
                  <p className="mt-1 text-sm leading-6 text-edvanta-muted">Material de estudio y consulta para llevar el tema a la práctica.</p>
                </Link>
              </div>

              {examen.comunidad && (
                <Link to={`/comunidades/${examen.comunidad.slug}`} className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/35 p-5 transition hover:border-edvanta-teal/50">
                  <div>
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark"><Users className="h-4 w-4" aria-hidden="true" />Comunidad</p>
                    <p className="mt-1 font-display text-lg font-bold text-edvanta-deep">Comunidad de {examen.comunidad.nombre}</p>
                    <p className="mt-1 text-sm leading-6 text-edvanta-muted">Acompañamiento educativo para pacientes y cuidadores.</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-edvanta-blue" aria-hidden="true" />
                </Link>
              )}

              {relacionados.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Para repasar</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {relacionados.map((a) => (
                      <Link key={a.slug} to={`/articulos/${a.slug}`} className="group rounded-xl border border-edvanta-border bg-white p-4 transition hover:border-edvanta-teal/40 hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{a.category}</p>
                        <p className="mt-1.5 font-display text-base font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{a.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-edvanta-muted">{a.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {examen.vademecum?.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">En el vademécum</h2>
                  <ul className="mt-3 space-y-2">
                    {examen.vademecum.map((v) => (
                      <li key={v.ruta}>
                        <Link to={v.ruta} className="text-sm font-semibold text-edvanta-blue hover:underline">{v.nombre}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {avanzados.length > 0 && (
                <div className="mt-8 rounded-2xl border border-edvanta-border bg-edvanta-bg/60 p-5">
                  <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Más exámenes avanzados</h2>
                  <p className="mt-1 text-sm leading-6 text-edvanta-muted">Sigue con otro bloque de práctica del mismo nivel.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {avanzados.map((e) => (
                      <Link key={e.slug} to={e.ruta} className="group rounded-xl border border-edvanta-border bg-white p-4 transition hover:border-edvanta-teal/40 hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{e.categoria}</p>
                        <p className="mt-1.5 font-display text-base font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{e.titulo}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {examen.faq?.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Preguntas frecuentes</h2>
                  <div className="mt-4 space-y-3">
                    {examen.faq.map(([q, a]) => (
                      <details key={q} className="rounded-xl border border-edvanta-border bg-white p-4">
                        <summary className="cursor-pointer list-none text-sm font-bold text-edvanta-deep">{q}</summary>
                        <p className="mt-2 text-sm leading-6 text-edvanta-muted">{a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {examen.fuentes?.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Fuentes</h2>
                  <ul className="mt-3 space-y-2">
                    {examen.fuentes.map((f) => (
                      <li key={f.url} className="text-sm leading-6 text-edvanta-muted">
                        {f.texto} <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-edvanta-blue hover:underline">Ver fuente</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-edvanta-border bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Cómo funciona</p>
                <ol className="mt-3 space-y-3 text-sm leading-6 text-edvanta-ink/80">
                  <li><span className="font-bold text-edvanta-deep">1.</span> Responde las {examen.preguntas.length} preguntas.</li>
                  <li><span className="font-bold text-edvanta-deep">2.</span> Pulsa «Corregir examen».</li>
                  <li><span className="font-bold text-edvanta-deep">3.</span> Lee la explicación de cada respuesta.</li>
                  <li><span className="font-bold text-edvanta-deep">4.</span> Repite o sigue con el curso y la guía.</li>
                </ol>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <p className="flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Práctica educativa</p>
                <p className="mt-2">No genera certificado ni reemplaza una evaluación de curso. Si el tema es clínico, las decisiones se toman con el equipo de salud.</p>
                {!revisado && <p className="mt-2 font-semibold">Revisión clínica pendiente: la página no se indexa hasta que Karla la apruebe.</p>}
              </div>
              <div className="rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/35 p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Para profesionales</p>
                <p className="mt-2 font-display text-lg font-bold text-edvanta-deep">Sigue con el curso gratis</p>
                <p className="mt-1 text-sm leading-6 text-edvanta-muted">Clases abiertas, verificación de aprendizaje y certificado al terminar.</p>
                <Link to={examen.curso.ruta} onClick={() => trackEvent('course_clicked', { origen: 'examen', examen: examen.slug, curso: examen.curso.ruta })} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                  Ver el curso
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Repasa, practica y sigue aprendiendo</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-edvanta-muted">
              Los exámenes son una herramienta de estudio. El aprendizaje profundo está en las clases, los artículos y la práctica acompañada.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/examenes" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-bold text-white transition hover:bg-edvanta-bluedark">Ver todos los exámenes</Link>
              <Link to="/cursos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light">Explorar cursos gratis</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
