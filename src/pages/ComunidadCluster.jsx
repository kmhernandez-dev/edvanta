import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, Faq, Section, SectionHeading } from '../components/edvanta/ui';
import { TemaCard, WebinarCard, CierreDePublico, iconoDeCluster, tonoDeCluster } from '../components/edvanta/comunidadWebinars';
import {
  clusterPorSlug, temasDeCluster, webinarsDeCluster, rutaTema, rutaWebinar,
} from '../data/edvanta/comunidadWebinars';
import { updatePageSeo } from '../utils/seo';
import NotFound from './NotFound';

const SITIO = 'https://edvanta.co';

export default function ComunidadCluster() {
  const { cluster: slug } = useParams();
  const cluster = clusterPorSlug(slug);
  const temas = cluster ? temasDeCluster(cluster.slug) : [];
  const webinars = cluster ? webinarsDeCluster(cluster.slug) : [];

  useEffect(() => {
    if (!cluster) return;
    updatePageSeo({
      title: `${cluster.nombre} | Comunidad Edvanta`,
      description: cluster.descripcion.slice(0, 158),
      canonical: `${SITIO}/comunidad/temas/${cluster.slug}`,
      image: `${SITIO}/img/og-edvanta.png`,
      jsonLdId: `cluster-${cluster.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: cluster.nombre,
        description: cluster.descripcion,
        url: `${SITIO}/comunidad/temas/${cluster.slug}`,
        inLanguage: 'es-CO',
        hasPart: temas.map((t) => ({ '@type': 'Article', name: t.titulo, url: `${SITIO}${rutaTema(t)}` })),
      },
    });
  }, [cluster, temas]);

  if (!cluster) return <NotFound />;

  const Icono = iconoDeCluster(cluster);
  const tono = tonoDeCluster(cluster);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-[#EAF2FF] to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Comunidad', to: '/comunidad' },
              { label: 'Temas', to: '/comunidad/temas' },
              { label: cluster.corto },
            ]} />
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tono.tile}`}>
                  <Icono className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] text-edvanta-deep sm:text-5xl">{cluster.nombre}</h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-edvanta-muted">{cluster.promesa}</p>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-edvanta-muted">{cluster.descripcion}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/comunidad#unirme" className="ed-btn ed-btn--gradient ed-btn--md">Unirme a la comunidad</Link>
                  <Link to={cluster.curso} className="ed-btn ed-btn--secondary ed-btn--md">Ver formación del área</Link>
                </div>
              </div>
              <aside className="rounded-2xl border border-edvanta-border bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">En esta área</p>
                <ul className="mt-3 space-y-2 text-sm text-edvanta-muted">
                  <li>{temas.length} guías con método y preguntas frecuentes</li>
                  <li>{webinars.length} webinars con inscripción previa</li>
                  <li>Recursos gratuitos y formación de pago claramente separados</li>
                  <li>Sin datos de pacientes ni consejo individual</li>
                </ul>
                <Link to="/webinars" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
                  Ver todos los webinars <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <Section tone="base">
          <SectionHeading eyebrow="Guías del área" title={`Temas de ${cluster.corto.toLowerCase()}`} desc="Cada guía resuelve una tarea concreta y termina en un recurso que existe." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {temas.map((t) => <TemaCard key={t.slug} tema={t} />)}
          </div>
        </Section>

        {webinars.length > 0 && (
          <Section tone="ice">
            <SectionHeading eyebrow="En vivo" title="Webinars del área" desc="Sesiones con fecha por confirmar. Regístrate para recibir el aviso." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {webinars.map((w) => <WebinarCard key={w.slug} webinar={w} />)}
            </div>
          </Section>
        )}

        <Section tone="base">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Cómo usar estas guías" title="Lee, aplica y vuelve con una pregunta" />
              <ol className="mt-6 space-y-4 text-[15px] leading-7 text-edvanta-muted">
                <li><strong className="text-edvanta-deep">1. Elige una tarea.</strong> No leas todo el área: empieza por el problema que tienes esta semana.</li>
                <li><strong className="text-edvanta-deep">2. Aplica un paso.</strong> Prueba una acción concreta con un paciente, un formato o un proceso.</li>
                <li><strong className="text-edvanta-deep">3. Documenta.</strong> Anota qué hiciste y qué cambió. Sin registro no hay aprendizaje demostrable.</li>
                <li><strong className="text-edvanta-deep">4. Comparte.</strong> Lleva la duda o el resultado a la comunidad o a una sesión en vivo.</li>
              </ol>
            </div>
            <Faq items={[
              { q: '¿Estas guías reemplazan un protocolo o un curso?', a: 'No. Son guías educativas de Edvanta. Un protocolo se adapta a tu institución y un curso ordena la práctica con casos y evaluación. No sustituyen el criterio del equipo tratante.' },
              { q: '¿Puedo aplicar esto en mi institución?', a: 'Puedes usar las ideas como punto de partida. Para llevarlas a un servicio con pacientes, revisa la normativa local y valida el cambio con tu equipo y tus jefaturas.' },
              { q: '¿Los contenidos son consejo clínico individual?', a: 'No. Son contenido educativo y profesional. No indican dosis, no diagnostican y no reemplazan la valoración de un paciente concreto.' },
            ]} />
          </div>
        </Section>

        <CierreDePublico publico={cluster.publico} origen={`cluster-${cluster.slug}`} />
      </main>
      <SiteFooter />
    </div>
  );
}
