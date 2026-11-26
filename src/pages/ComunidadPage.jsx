import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { ImageSlot, Section, SectionHeading, Steps, Faq, Card } from '../components/edvanta/ui';
import Icon from '../components/Icon';
import { EDVANTA_COMMUNITY_URL } from '../config/links';
import {
  CLUSTERS, TEMAS, WEBINARS, PUBLICOS, totalTemas, totalWebinars, rutaCluster, rutaTema, rutaWebinar,
} from '../data/edvanta/comunidadWebinars';
import { ClusterCard, WebinarCard, CierreDePublico } from '../components/edvanta/comunidadWebinars';
import { updatePageSeo } from '../utils/seo';
import { ARTICULOS_COMUNIDAD_WEBINARS } from '../data/articulosComunidadWebinars';
import { TITULO_ARTICULOS_COMUNIDAD_QF } from '../lib/articulosRelacionados';
import { trackEvent } from '../utils/analytics';

const SITIO = 'https://edvanta.co';

const beneficios = [
  { icon: 'users', titulo: 'Colegas que entienden tu trabajo', texto: 'Químicos farmacéuticos de farmacia clínica, calidad, regulatorio, industria y carrera, en un mismo espacio.' },
  { icon: 'briefcase', titulo: 'Oportunidades y orientación', texto: 'Vacantes, prácticas, proyectos y consejos de quienes ya pasaron por la misma decisión.' },
  { icon: 'book', titulo: 'Aprendizaje aplicable', texto: 'Temas con método, webinars y recursos para resolver una tarea concreta, no solo para leer.' },
  { icon: 'shield', titulo: 'Reglas claras', texto: 'Sin datos de pacientes, sin ventas agresivas y sin consejos que reemplacen al equipo de salud.' },
];

const PREGUNTAS = [
  ['¿La comunidad es gratis?', 'Sí. El grupo de WhatsApp de Edvanta es gratuito. Solo necesitas respetar las reglas y no compartir datos de pacientes ni información confidencial.'],
  ['¿Puedo preguntar por un caso clínico?', 'Puedes plantear una duda general y educativa, sin datos que identifiquen a una persona. La decisión clínica siempre es del equipo tratante.'],
  ['¿La comunidad reemplaza un curso o una asesoría?', 'No. La comunidad sirve para conectar y resolver dudas. Un curso ordena el aprendizaje y una asesoría revisa tu caso con alcance definido.'],
  ['¿Qué pasa si incumplo las reglas?', 'La moderación puede retirar mensajes o retirar a la persona del grupo. Las reglas buscan proteger la privacidad y la calidad de la conversación.'],
  ['¿También hay espacio para pacientes?', 'Sí. Edvanta Contigo y las comunidades de apoyo por enfermedad son espacios aparte, con reglas propias y enfoque educativo.'],
];

const destacados = ['seguimiento-farmacoterapeutico', 'bpm-en-servicios-farmaceuticos', 'registro-sanitario-paso-a-paso', 'primer-empleo-farmaceutico', 'liderazgo-en-servicio-farmaceutico', 'plan-de-capacitacion-para-equipos-de-farmacia'];

export default function ComunidadPage() {
  useEffect(() => updatePageSeo({
    title: 'Comunidad de Químicos Farmacéuticos | Edvanta',
    description: 'Comunidad gratuita de químicos farmacéuticos: temas de farmacia clínica, calidad, regulatorio y carrera, webinars y recursos para aplicar lo que sabes.',
    canonical: `${SITIO}/comunidad`,
    image: `${SITIO}/img/og-edvanta.png`,
    jsonLdId: 'comunidad',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', name: 'Comunidad de Químicos Farmacéuticos', url: `${SITIO}/comunidad`, inLanguage: 'es-CO' },
        { '@type': 'FAQPage', mainEntity: PREGUNTAS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
        { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO }, { '@type': 'ListItem', position: 2, name: 'Comunidad', item: `${SITIO}/comunidad` }] },
      ],
    },
  }), []);

  const unirse = (origen) => trackEvent('community_clicked', { origin: origen });

  const temasDestacados = destacados
    .map((slug) => TEMAS.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />

      <main>
        <section id="unirme" className="relative overflow-hidden bg-gradient-to-b from-[#EAF2FF] to-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3.5 py-1.5 text-xs font-bold uppercase text-edvanta-blue shadow-sm">
                  <Icon name="users" className="h-4 w-4" /> Comunidad Edvanta
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-edvanta-deep sm:text-5xl">
                  La comunidad de químicos farmacéuticos para crecer con criterio
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-edvanta-muted">
                  Conecta con colegas, resuelve dudas del trabajo diario y accede a temas y webinars
                  que se aplican en farmacia clínica, calidad, regulatorio, industria y carrera.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={EDVANTA_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => unirse('comunidad_hero')}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 text-base font-bold text-white shadow-lg transition hover:bg-[#1fb959]"
                  >
                    <Icon name="whatsapp" className="h-5 w-5" /> Unirme al grupo de WhatsApp
                  </a>
                  <Link to="/comunidad/temas" onClick={() => unirse('comunidad_hero_temas')} className="ed-btn ed-btn--secondary ed-btn--lg">
                    Explorar los temas
                  </Link>
                  <Link to="/webinars" onClick={() => unirse('comunidad_hero_webinars')} className="ed-btn ed-btn--ghost ed-btn--lg">
                    Ver webinars
                  </Link>
                </div>
                <p className="mt-4 text-sm text-edvanta-subtle">Gratis. Solo necesitas WhatsApp y respetar las reglas del grupo.</p>
              </div>
              <div className="lg:pl-6">
                <ImageSlot
                  ratio="wide"
                  src="/img/comunidad/encuentro-comunidad-farmaceutica.webp"
                  alt="Grupo de químicos farmacéuticos reunidos alrededor de una mesa, conversando sobre una tableta"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-edvanta-border bg-edvanta-bg py-8">
          <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {[
              [`${CLUSTERS.length}`, 'rutas de contenido'],
              [`${totalTemas}`, 'guías profesionales y para pacientes'],
              [`${totalWebinars}`, 'webinars con inscripción previa'],
            ].map(([valor, etiqueta]) => (
              <div key={etiqueta} className="text-center">
                <p className="font-display text-3xl font-extrabold text-edvanta-blue">{valor}</p>
                <p className="mt-1 text-sm font-semibold text-edvanta-muted">{etiqueta}</p>
              </div>
            ))}
          </div>
        </section>

        <Section tone="base">
          <SectionHeading
            eyebrow="Qué encontrarás"
            title="Una comunidad que sirve para el trabajo real"
            desc="No es un grupo para llenar el chat. Es un espacio para preguntar mejor, encontrar recursos y tomar decisiones de carrera con más información."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <Card key={b.titulo} className="h-full">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-edvanta-light text-edvanta-blue">
                  <Icon name={b.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-edvanta-deep">{b.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">{b.texto}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section tone="ice">
          <SectionHeading eyebrow="Empieza por aquí" title="Rutas de contenido de la comunidad" desc="Cada ruta agrupa temas, webinars y recursos de una misma familia. Elige la que más se parece a tu semana." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CLUSTERS.map((c) => <ClusterCard key={c.slug} cluster={c} />)}
          </div>
        </Section>

        <Section tone="base">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Lo más consultado" title="Temas para resolver hoy" desc="Guías con método, errores frecuentes y preguntas que aparecen en el trabajo diario." />
            <Link to="/comunidad/temas" className="ed-btn ed-btn--secondary ed-btn--md shrink-0">
              Ver todos los temas
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {temasDestacados.map((t) => (
              <Link key={t.slug} to={rutaTema(t)} className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_14px_40px_rgba(23,34,59,.10)]">
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-edvanta-subtle">
                  <span className="rounded-full bg-edvanta-soft px-2.5 py-1 font-bold uppercase tracking-[.08em] text-edvanta-blue">{PUBLICOS[t.publico]?.corto || 'Profesionales'}</span>
                  <span>{t.nivel}</span>
                  <span>{t.minutos} min</span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{t.titulo}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{t.descripcion}</p>
                <span className="mt-4 text-sm font-bold text-edvanta-blue">Leer la guía →</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section tone="soft" bordered>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="En vivo" title="Ciclo de webinars Edvanta" desc="Sesiones para resolver un problema concreto, con preguntas y recursos. Las fechas se confirman con quienes se inscriben." />
            <Link to="/webinars" className="ed-btn ed-btn--secondary ed-btn--md shrink-0">Ver el ciclo</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WEBINARS.filter((w) => w.publico === 'profesional').slice(0, 3).map((w) => <WebinarCard key={w.slug} webinar={w} />)}
          </div>
        </Section>

        <Section tone="base">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow="Cómo funciona" title="Entrar es fácil; participar bien también" />
              <Steps className="mt-8" items={[
                { title: 'Únete al grupo', desc: 'Abres WhatsApp, entras al grupo y lees las reglas fijadas.' },
                { title: 'Preséntate con tu área', desc: 'Di en qué trabajas o qué estás estudiando y qué te gustaría resolver.' },
                { title: 'Pregunta con contexto', desc: 'Sin datos de pacientes ni información confidencial. Una pregunta clara recibe mejores respuestas.' },
                { title: 'Devuelve lo que aprendes', desc: 'Comparte la respuesta o el recurso que te sirvió. La comunidad crece cuando aporta.' },
              ]} />
            </div>
            <div className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-6">
              <h3 className="font-display text-xl font-bold text-edvanta-deep">Reglas que protegen la conversación</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-edvanta-muted">
                <li>· No compartir datos de pacientes, historias clínicas ni capturas identificables.</li>
                <li>· No prometer curas ni dar indicaciones de dosis a otras personas.</li>
                <li>· No vender ni promocionar sin permiso de la moderación.</li>
                <li>· Respetar la experiencia y el rol de cada persona del grupo.</li>
              </ul>
              <a
                href={EDVANTA_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => unirse('comunidad_reglas')}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1fb959]"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> Leer y entrar al grupo
              </a>
            </div>
          </div>
        </Section>

        <Section tone="ice">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de unirte" desc="Lo que más nos preguntan sobre la comunidad y sus límites." />
          <div className="mt-8 max-w-3xl">
            <Faq items={PREGUNTAS.map(([q, a]) => ({ q, a }))} />
          </div>
        </Section>

        <Section>
          <SectionHeading eyebrow="Para leer" title={TITULO_ARTICULOS_COMUNIDAD_QF} />
          <ul className="mt-8 grid max-w-4xl gap-2 sm:grid-cols-2">
            {ARTICULOS_COMUNIDAD_WEBINARS.map((a) => (
              <li key={a.slug}>
                <Link to={`/articulos/${a.slug}`} className="block rounded-xl border border-edvanta-border bg-white px-4 py-3 text-sm font-semibold leading-6 text-edvanta-deep transition hover:border-edvanta-teal/40 hover:text-edvanta-blue">{a.title}</Link>
              </li>
            ))}
          </ul>
        </Section>

        <CierreDePublico publico="profesional" origen="comunidad_cierre" />
      </main>

      <SiteFooter />
    </div>
  );
}
