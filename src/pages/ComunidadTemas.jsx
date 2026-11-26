import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, Section, SectionHeading } from '../components/edvanta/ui';
import { ClusterCard, TemaCard, CierreDePublico } from '../components/edvanta/comunidadWebinars';
import { CLUSTERS, TEMAS, rutaCluster } from '../data/edvanta/comunidadWebinars';
import { updatePageSeo } from '../utils/seo';

const SITIO = 'https://edvanta.co';

export default function ComunidadTemas() {
  const [clusterActivo, setClusterActivo] = useState('todos');
  const [publicoActivo, setPublicoActivo] = useState('todos');

  useEffect(() => updatePageSeo({
    title: 'Temas de la comunidad farmacéutica | Edvanta',
    description: 'Guías de farmacia clínica, calidad, regulatorio, carrera y comunicación para químicos farmacéuticos, instituciones y pacientes. Método, errores y preguntas frecuentes.',
    canonical: `${SITIO}/comunidad/temas`,
    image: `${SITIO}/img/og-edvanta.png`,
    jsonLdId: 'comunidad-temas',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Temas de la comunidad farmacéutica',
      url: `${SITIO}/comunidad/temas`,
      inLanguage: 'es-CO',
      isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
    },
  }), []);

  const temas = useMemo(() => TEMAS.filter((t) => {
    if (clusterActivo !== 'todos' && t.cluster !== clusterActivo) return false;
    if (publicoActivo !== 'todos' && t.publico !== publicoActivo) return false;
    return true;
  }), [clusterActivo, publicoActivo]);

  const agrupados = useMemo(() => CLUSTERS
    .map((c) => ({ cluster: c, temas: temas.filter((t) => t.cluster === c.slug) }))
    .filter((g) => g.temas.length), [temas]);

  const chip = (activo) => `inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition ${activo
    ? 'border-edvanta-blue bg-edvanta-blue text-white'
    : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/50'}`;

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-[#EAF2FF] to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Comunidad', to: '/comunidad' }, { label: 'Temas' }]} />
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] text-edvanta-deep sm:text-5xl">
              Temas de la comunidad farmacéutica
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-edvanta-muted">
              Guías para resolver una tarea concreta del trabajo farmacéutico: método, errores
              frecuentes, preguntas y recursos. Elige por área o por público.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-edvanta-muted ring-1 ring-edvanta-border">{TEMAS.length} guías</span>
              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-edvanta-muted ring-1 ring-edvanta-border">{CLUSTERS.length} áreas</span>
              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-edvanta-muted ring-1 ring-edvanta-border">Actualización editorial</span>
            </div>
          </div>
        </section>

        <Section tone="base" compact>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
              <button type="button" onClick={() => setClusterActivo('todos')} className={chip(clusterActivo === 'todos')}>Todas las áreas</button>
              {CLUSTERS.map((c) => (
                <button key={c.slug} type="button" onClick={() => setClusterActivo(c.slug)} className={chip(clusterActivo === c.slug)}>
                  {c.corto}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por público">
              {[['todos', 'Todos los públicos'], ['profesional', 'Profesionales'], ['institucion', 'Instituciones'], ['paciente', 'Pacientes']].map(([id, label]) => (
                <button key={id} type="button" onClick={() => setPublicoActivo(id)} className={chip(publicoActivo === id)}>{label}</button>
              ))}
            </div>
          </div>
        </Section>

        <Section tone="base" className="pt-0">
          {agrupados.length === 0 ? (
            <p className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-6 text-sm text-edvanta-muted">
              No hay temas con esa combinación. Prueba con otra área o con todos los públicos.
            </p>
          ) : (
            <div className="space-y-14">
              {agrupados.map(({ cluster, temas: lista }) => (
                <section key={cluster.slug} aria-labelledby={`cluster-${cluster.slug}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">Área de la comunidad</p>
                      <h2 id={`cluster-${cluster.slug}`} className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">{cluster.nombre}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-edvanta-muted">{cluster.descripcion}</p>
                    </div>
                    <Link to={rutaCluster(cluster)} className="ed-btn ed-btn--secondary ed-btn--sm shrink-0">Ver el área completa</Link>
                  </div>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {lista.map((t) => <TemaCard key={t.slug} tema={t} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </Section>

        <Section tone="ice">
          <SectionHeading eyebrow="Rutas completas" title="Las áreas de la comunidad" desc="Cada área reúne sus guías, webinars y el siguiente paso de formación." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CLUSTERS.map((c) => <ClusterCard key={c.slug} cluster={c} />)}
          </div>
        </Section>

        <CierreDePublico publico="profesional" origen="comunidad_temas" />
      </main>
      <SiteFooter />
    </div>
  );
}
