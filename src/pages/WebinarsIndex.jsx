import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Check, Video } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, Faq, Section, SectionHeading, Steps } from '../components/edvanta/ui';
import { WebinarCard, CierreDePublico, EtiquetaPublico } from '../components/edvanta/comunidadWebinars';
import { WEBINARS, CLUSTERS, rutaCluster, rutaWebinar } from '../data/edvanta/comunidadWebinars';
import { updatePageSeo } from '../utils/seo';

const SITIO = 'https://edvanta.co';

const PREGUNTAS = [
  ['¿Cuándo se realizan los webinars?', 'Cada sesión tiene una fecha por confirmar. Inscríbete y te avisaremos cuando la fecha y el acceso estén definidos. No publicamos fechas que todavía no existen.'],
  ['¿Tienen costo?', 'Cada sesión informa sus condiciones cuando se confirman. Si una sesión tiene costo, se dice antes de la inscripción. No usamos precios de demostración como si fueran reales.'],
  ['¿Entregan certificado?', 'Los webinars son sesiones educativas y no prometen certificado. Para formación con evaluación y certificado verificable, revisa los cursos del aula.'],
  ['¿Puedo pedir una sesión para mi institución?', 'Sí. Los temas se pueden adaptar a una sesión cerrada para tu equipo. Escríbenos y armamos una propuesta según tus brechas y perfiles.'],
  ['¿Quedan grabados?', 'Depende de cada sesión. Cuando exista grabación se comunicará en la página de la sesión. No prometemos grabaciones que aún no están disponibles.'],
];

export default function WebinarsIndex() {
  const [publico, setPublico] = useState('todos');

  useEffect(() => updatePageSeo({
    title: 'Webinars para químicos farmacéuticos | Edvanta',
    description: 'Ciclo de webinars de Edvanta: farmacia clínica, calidad, regulatorio, carrera e instituciones. Fechas por confirmar e inscripción previa.',
    canonical: `${SITIO}/webinars`,
    image: `${SITIO}/img/og-edvanta.png`,
    jsonLdId: 'webinars',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'CollectionPage', name: 'Webinars de Edvanta', url: `${SITIO}/webinars`, inLanguage: 'es-CO' },
        { '@type': 'FAQPage', mainEntity: PREGUNTAS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
        { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO }, { '@type': 'ListItem', position: 2, name: 'Webinars', item: `${SITIO}/webinars` }] },
      ],
    },
  }), []);

  const lista = useMemo(() => WEBINARS.filter((w) => publico === 'todos' || w.publico === publico), [publico]);
  const porCluster = useMemo(() => CLUSTERS
    .map((c) => ({ cluster: c, webinars: lista.filter((w) => w.cluster === c.slug) }))
    .filter((g) => g.webinars.length), [lista]);

  const chip = (activo) => `inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition ${activo
    ? 'border-edvanta-blue bg-edvanta-blue text-white'
    : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/50'}`;

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF2FF] to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Webinars' }]} />
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3.5 py-1.5 text-xs font-bold uppercase text-edvanta-blue shadow-sm">
                  <Video className="h-4 w-4" aria-hidden="true" /> Ciclo Edvanta
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-edvanta-deep sm:text-5xl">
                  Webinars para químicos farmacéuticos y equipos de salud
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-edvanta-muted">
                  Sesiones en vivo para resolver un problema concreto de farmacia clínica, calidad,
                  regulatorio, carrera o formación de equipos. Inscripción previa y fecha por confirmar.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link to="/unete/profesionales?area=webinars" className="ed-btn ed-btn--gradient ed-btn--lg">
                    Recibir el aviso de la próxima sesión
                  </Link>
                  <Link to="/comunidad" className="ed-btn ed-btn--secondary ed-btn--lg">Unirme a la comunidad</Link>
                </div>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-edvanta-subtle">
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  No publicamos fechas hasta que estén confirmadas.
                </p>
              </div>
              <div className="rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_16px_44px_rgba(23,34,59,.10)]">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">Qué obtienes al inscribirte</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-edvanta-muted">
                  {[
                    'Aviso cuando la fecha y el acceso estén definidos.',
                    'Los recursos y lecturas previas de la sesión.',
                    'Un espacio para enviar tu pregunta antes del encuentro.',
                    'Acceso a la comunidad y al ciclo completo de temas.',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edvanta-mint text-edvanta-tealdark">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Section tone="base" compact>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar webinars por público">
            {[['todos', 'Todos'], ['profesional', 'Profesionales'], ['institucion', 'Instituciones'], ['paciente', 'Pacientes']].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setPublico(id)} className={chip(publico === id)}>{label}</button>
            ))}
          </div>
        </Section>

        <Section tone="base" className="pt-0">
          <div className="space-y-14">
            {porCluster.map(({ cluster, webinars }) => (
              <section key={cluster.slug} aria-labelledby={`web-${cluster.slug}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">Área</p>
                    <h2 id={`web-${cluster.slug}`} className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">{cluster.nombre}</h2>
                  </div>
                  <Link to={rutaCluster(cluster)} className="ed-btn ed-btn--secondary ed-btn--sm shrink-0">Ver los temas del área</Link>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {webinars.map((w) => <WebinarCard key={w.slug} webinar={w} />)}
                </div>
              </section>
            ))}
          </div>
        </Section>

        <Section tone="ice">
          <SectionHeading eyebrow="Cómo funciona" title="Una sesión útil empieza antes de conectarte" />
          <Steps className="mt-8" items={[
            { title: 'Elige un problema', desc: 'Inscríbete a la sesión que responda a una tarea que tengas pendiente, no a la que suene más interesante.' },
            { title: 'Prepara una pregunta', desc: 'Envíala al inscribirte. Las preguntas concretas reciben mejores respuestas.' },
            { title: 'Participa', desc: 'Toma notas con acciones, no con transcripciones. Anota qué vas a probar después.' },
            { title: 'Aplica y comparte', desc: 'Prueba una idea en tu trabajo y comparte el resultado en la comunidad.' },
          ]} />
        </Section>

        <Section tone="base">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
            <div>
              <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de inscribirte" desc="Lo que sí podemos prometer y lo que todavía no está definido." />
              <div className="mt-8">
                <Faq items={PREGUNTAS.map(([q, a]) => ({ q, a }))} />
              </div>
            </div>
            <aside className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-6">
              <EtiquetaPublico publico="institucion" />
              <h2 className="mt-3 font-display text-xl font-bold text-edvanta-deep">¿Lo necesitas para tu equipo?</h2>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                Adaptamos una sesión a las brechas de tu servicio y la dictamos de forma cerrada.
                Primero conversamos; no cotizamos sobre supuestos.
              </p>
              <Link to="/unete/instituciones" className="ed-btn ed-btn--primary ed-btn--md ed-btn--block mt-5">Solicitar una sesión cerrada</Link>
              <Link to={`${rutaWebinar(WEBINARS.find((w) => w.publico === 'institucion') || WEBINARS[0])}`} className="mt-3 block text-center text-sm font-bold text-edvanta-blue hover:underline">
                Ver el webinar para instituciones →
              </Link>
            </aside>
          </div>
        </Section>

        <CierreDePublico publico="profesional" origen="webinars_cierre" />
      </main>
      <SiteFooter />
    </div>
  );
}
