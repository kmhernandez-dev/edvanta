/**
 * /examenes — Hub de exámenes interactivos públicos.
 *
 * Cada tarjeta lleva a una página con preguntas, corrección inmediata,
 * explicaciones y enlaces al curso, la guía y los artículos del tema.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Clock3, GraduationCap, ListChecks, Users } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { EXAMENES, META_EXAMENES } from '../data/examenes';
import { updatePageSeo } from '../utils/seo';

const SITIO = 'https://edvanta.co';

export default function ExamenesIndex() {
  useEffect(() => updatePageSeo({
    title: META_EXAMENES.titulo,
    description: META_EXAMENES.descripcion,
    canonical: `${SITIO}/examenes`,
    type: 'website',
    jsonLdId: 'examenes',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: META_EXAMENES.h1,
          description: META_EXAMENES.descripcion,
          url: `${SITIO}/examenes`,
          inLanguage: 'es-CO',
          isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
          publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
        },
        {
          '@type': 'ItemList',
          itemListElement: EXAMENES.map((e, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: e.titulo,
            url: `${SITIO}${e.ruta}`,
          })),
        },
      ],
    },
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Exámenes' }]} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-edvanta-teal/30 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
              <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
              Práctica abierta
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[3rem]">
              {META_EXAMENES.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">
              Preguntas de farmacia y salud con corrección inmediata, explicaciones y enlaces a los contenidos
              que necesitas para repasar. Sin registro y sin costo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cursos" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-bold text-white transition hover:bg-edvanta-bluedark">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Ver cursos gratis
              </Link>
              <Link to="/vademecum" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light">
                Consultar el vademécum
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-edvanta-muted">
              <ListChecks className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />
              Práctica educativa. No genera certificado ni reemplaza una evaluación de curso.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMENES.map((e) => (
              <article key={e.slug} className="flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition hover:-translate-y-0.5 hover:border-edvanta-teal/40 hover:shadow-[0_12px_36px_rgba(23,34,59,.10)]">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{e.categoria}</p>
                <h2 className="mt-2 font-display text-xl font-bold leading-snug text-edvanta-deep">
                  <Link to={e.ruta} className="hover:text-edvanta-blue">{e.titulo}</Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">{e.descripcion}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-edvanta-muted">
                  <span className="inline-flex items-center gap-1.5"><ListChecks className="h-4 w-4" aria-hidden="true" />{e.preguntas.length} preguntas</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" aria-hidden="true" />{e.duracion}</span>
                  <span>{e.nivel}</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden="true" />Individual o en grupos</span>
                </div>
                <div className="mt-auto pt-5">
                  <Link to={e.ruta} className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                    Empezar el examen
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Cómo aprovecharlo</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['1. Responde sin buscar', 'Marca tu mejor respuesta. El examen está pensado para detectar lo que necesitas repasar, no para castigar errores.'],
                ['2. Lee la explicación', 'Cada respuesta trae el porqué y la fuente. Ahí está el aprendizaje que no aparece en una lista de respuestas.'],
                ['3. Sigue con el tema', 'Cada examen enlaza el curso gratis, la guía y los artículos del mismo tema. Así el repaso tiene continuidad.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <p className="font-display text-base font-bold text-edvanta-deep">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-edvanta-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
