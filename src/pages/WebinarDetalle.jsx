import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BarChart3, CalendarClock, Check, Clock, MonitorPlay, Video } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, Faq, Section, SectionHeading } from '../components/edvanta/ui';
import { EtiquetaPublico, TemaCard, WebinarCard, CierreDePublico } from '../components/edvanta/comunidadWebinars';
import { BotonWhatsApp } from '../components/edvanta/embudo';
import {
  PUBLICOS, clusterPorSlug, webinarPorSlug, webinarsRelacionados, rutaTema, rutaWebinar,
} from '../data/edvanta/comunidadWebinars';
import { TEMAS } from '../data/edvanta/comunidadWebinars';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import NotFound from './NotFound';

const SITIO = 'https://edvanta.co';

const minutosDe = (duracion) => {
  const n = Number(String(duracion).match(/\d+/)?.[0] || 60);
  return `PT${n}M`;
};

export default function WebinarDetalle() {
  const { slug } = useParams();
  const webinar = webinarPorSlug(slug);
  const cluster = webinar ? clusterPorSlug(webinar.cluster) : null;
  const relacionados = webinar ? webinarsRelacionados(webinar, 3) : [];
  const temas = webinar ? (webinar.temas || []).map((s) => TEMAS.find((t) => t.slug === s)).filter(Boolean) : [];

  const preguntas = webinar ? [
    ['¿Cuándo se realiza?', 'La fecha está por confirmar. Inscríbete y te avisaremos cuando la fecha y el acceso estén definidos. No publicamos una fecha que todavía no existe.'],
    ['¿Tiene costo?', 'Las condiciones se informan cuando la sesión se confirma. Si tiene costo, se dice antes de la inscripción. No usamos precios de demostración.'],
    ['¿Entregan certificado?', 'Es una sesión educativa y no promete certificado. Para formación con evaluación y certificado verificable, revisa los cursos del aula.'],
    ['¿Puedo pedir esta sesión para mi institución?', 'Sí. El tema se puede adaptar a una sesión cerrada para tu equipo. Escríbenos y armamos una propuesta según tus brechas y perfiles.'],
    ['¿Queda grabada?', 'Depende de la sesión. Cuando exista grabación se comunicará en esta misma página. No prometemos grabaciones que aún no están disponibles.'],
  ] : [];

  useEffect(() => {
    if (!webinar) return;
    updatePageSeo({
      title: webinar.seoTitle,
      description: webinar.descripcion,
      canonical: `${SITIO}${rutaWebinar(webinar)}`,
      image: `${SITIO}/img/og-edvanta.png`,
      type: 'article',
      jsonLdId: `webinar-${webinar.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: webinar.titulo,
            description: webinar.descripcion,
            url: `${SITIO}${rutaWebinar(webinar)}`,
            inLanguage: 'es-CO',
            educationalLevel: webinar.nivel,
            timeRequired: minutosDe(webinar.duracion),
            provider: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
            audience: { '@type': 'Audience', audienceType: PUBLICOS[webinar.publico]?.nombre },
            about: cluster?.nombre,
          },
          {
            '@type': 'FAQPage',
            mainEntity: preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
              { '@type': 'ListItem', position: 2, name: 'Webinars', item: `${SITIO}/webinars` },
              { '@type': 'ListItem', position: 3, name: webinar.titulo, item: `${SITIO}${rutaWebinar(webinar)}` },
            ],
          },
        ],
      },
    });
  }, [webinar, cluster, preguntas]);

  if (!webinar) return <NotFound />;

  const institucional = webinar.publico === 'institucion';
  const paciente = webinar.publico === 'paciente';
  const registro = institucional ? '/unete/instituciones' : paciente ? '/unete/pacientes' : '/unete/profesionales?area=webinars';
  const etiquetaRegistro = institucional ? 'Solicitar esta sesión para mi institución' : 'Recibir el aviso de la próxima fecha';
  const mensajeWhatsApp = `Hola, equipo Edvanta. Me interesa el webinar "${webinar.titulo}" y quiero saber cuándo será la próxima sesión.`;

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-[#F2F7FF] to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Comunidad', to: '/comunidad' },
              { label: 'Webinars', to: '/webinars' },
              { label: 'Sesión' },
            ]} />
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-edvanta-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-edvanta-blue">
                    <Video className="h-3.5 w-3.5" aria-hidden="true" /> Webinar
                  </span>
                  <EtiquetaPublico publico={webinar.publico} />
                </div>
                <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-edvanta-deep sm:text-5xl">{webinar.titulo}</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-edvanta-muted">{webinar.promesa}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-edvanta-muted">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-edvanta-border"><Clock className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{webinar.duracion}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-edvanta-border"><BarChart3 className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{webinar.nivel}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-edvanta-border"><MonitorPlay className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{webinar.modalidad}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7E8] px-3 py-1.5 text-[#8A5A00] ring-1 ring-[#EBD7AE]"><CalendarClock className="h-4 w-4" aria-hidden="true" />Fecha por confirmar</span>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link to={registro} onClick={() => trackEvent('webinar_registro_click', { webinar: webinar.slug, publico: webinar.publico })} className="ed-btn ed-btn--gradient ed-btn--lg">
                    {etiquetaRegistro} <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
                  </Link>
                  <BotonWhatsApp mensaje={mensajeWhatsApp} origen={`webinar-${webinar.slug}`} tamano="ed-btn--lg">
                    Escribir por WhatsApp
                  </BotonWhatsApp>
                </div>
              </div>

              <aside className="rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_16px_44px_rgba(23,34,59,.10)]">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">Resumen de la sesión</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-edvanta-muted">Área</dt><dd className="text-right font-semibold text-edvanta-deep">{cluster?.corto}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-edvanta-muted">Público</dt><dd className="text-right font-semibold text-edvanta-deep">{PUBLICOS[webinar.publico]?.corto}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-edvanta-muted">Nivel</dt><dd className="text-right font-semibold text-edvanta-deep">{webinar.nivel}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-edvanta-muted">Duración</dt><dd className="text-right font-semibold text-edvanta-deep">{webinar.duracion}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-edvanta-muted">Modalidad</dt><dd className="text-right font-semibold text-edvanta-deep">{webinar.modalidad}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-edvanta-muted">Fecha</dt><dd className="text-right font-semibold text-[#8A5A00]">Por confirmar</dd></div>
                </dl>
                <p className="mt-4 border-t border-edvanta-border pt-4 text-[12px] leading-5 text-edvanta-subtle">
                  Al inscribirte recibes el aviso y los recursos previos. No se cobra nada hasta que la sesión tenga condiciones confirmadas.
                </p>
                <Link to={webinar.curso.to} className="ed-btn ed-btn--secondary ed-btn--md ed-btn--block mt-4">
                  {webinar.curso.label}
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <Section tone="base" compact>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <article className="max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-edvanta-deep">Qué vas a aprender</h2>
              <ul className="mt-5 space-y-3">
                {webinar.aprendizajes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-edvanta-muted">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edvanta-mint text-edvanta-tealdark">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-bold text-edvanta-deep">A quién está dirigido</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {webinar.dirigidoA.map((p) => (
                  <li key={p} className="rounded-xl border border-edvanta-border bg-edvanta-bg px-4 py-3 text-sm font-semibold text-edvanta-deep">{p}</li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-bold text-edvanta-deep">Agenda prevista</h2>
              <ol className="mt-5 space-y-4">
                {webinar.agenda.map((paso, i) => (
                  <li key={paso} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-edvanta-blue font-display text-sm font-extrabold text-white">{i + 1}</span>
                    <p className="pt-0.5 text-[15px] leading-7 text-edvanta-muted">{paso}</p>
                  </li>
                ))}
              </ol>

              <h2 className="mt-10 font-display text-2xl font-bold text-edvanta-deep">Quién dirige la sesión</h2>
              <div className="mt-4 rounded-2xl border border-edvanta-border bg-white p-5">
                <p className="font-display text-lg font-bold text-edvanta-deep">Karla Hernández</p>
                <p className="mt-1 text-sm font-semibold text-edvanta-blue">Química Farmacéutica Clínica · Edvanta</p>
                <p className="mt-3 text-sm leading-6 text-edvanta-muted">
                  Química farmacéutica clínica de la Universidad del Atlántico, autora y revisora de
                  contenido de Edvanta. Dirige la formación de Edvanta y la comunidad de químicos
                  farmacéuticos. <Link to="/autores/karla-hernandez" className="font-semibold text-edvanta-blue hover:underline">Ver perfil</Link>.
                </p>
              </div>

              <h2 className="mt-10 font-display text-2xl font-bold text-edvanta-deep">Preguntas frecuentes</h2>
              <div className="mt-5">
                <Faq items={preguntas.map(([q, a]) => ({ q, a }))} />
              </div>

              <div className="mt-10 rounded-2xl border border-edvanta-border bg-edvanta-bg p-6">
                <h2 className="font-display text-xl font-bold text-edvanta-deep">Antes de la sesión</h2>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                  Lee la guía del tema y llega con una pregunta concreta. Es la forma más rápida de
                  aprovechar la sesión y de que el resto del grupo también aprenda.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {temas.map((t) => (
                    <Link key={t.slug} to={rutaTema(t)} className="flex items-center justify-between gap-3 rounded-xl border border-edvanta-border bg-white px-4 py-3 text-sm font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
                      {t.titulo} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                  <Link to="/comunidad/temas" className="flex items-center justify-between gap-3 rounded-xl border border-edvanta-border bg-white px-4 py-3 text-sm font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
                    Ver todas las guías de la comunidad <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">Recuerda</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-edvanta-muted">
                  <li>· La fecha se confirma con las personas inscritas.</li>
                  <li>· No prometemos certificado ni grabación.</li>
                  <li>· Puedes pedir la sesión cerrada para tu equipo.</li>
                  <li>· Trae una pregunta concreta y sin datos de pacientes.</li>
                </ul>
              </div>
            </aside>
          </div>
        </Section>

        {relacionados.length > 0 && (
          <Section tone="ice">
            <SectionHeading eyebrow="Otras sesiones" title="Webinars relacionados" desc="Mismo enfoque: resolver un problema concreto con espacio para preguntas." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((w) => <WebinarCard key={w.slug} webinar={w} />)}
            </div>
          </Section>
        )}

        <CierreDePublico publico={webinar.publico} origen={`webinar-${webinar.slug}`} />
      </main>
      <SiteFooter />
    </div>
  );
}
