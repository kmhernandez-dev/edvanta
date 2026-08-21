import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import LandingHeader from '../components/fst/landing/LandingHeader';
import LandingFooter from '../components/fst/landing/LandingFooter';
import LeadMagnetSection from '../components/fst/landing/LeadMagnetSection';
import { EbookCover3D } from '../components/fst/landing/LandingMockups';
import { SectionHeading, FaqList, useScrollAnalytics } from '../components/fst/landing/LandingUi';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { trackFstClick } from '../lib/fstClicks';
import { LEAD_MAGNETS, CHECKOUTS } from '../data/fstLandings';

const faqHome = [
  ['¿Cómo empiezo a organizar mi autocuidado tiroideo?', 'Empieza con el checklist gratuito de esta página: medicamentos, horarios, suplementos, síntomas, exámenes y preguntas para consulta en una sola hoja. Después, elige una ruta educativa en recursos o una revisión individual en Atención Farmacéutica.'],
  ['¿Los recursos reemplazan la consulta médica?', 'No. Son materiales educativos para comprender, organizar y participar en tu cuidado. Nunca sustituyen la valoración, diagnóstico, tratamiento ni seguimiento de tu equipo de salud.'],
  ['¿Puedo usar los recursos si vivo sin tiroides?', 'Sí. Hay guías específicas para tiroidectomía y yodoterapia, además de la Colección y los diarios que sirven en cualquier etapa.'],
  ['¿En qué formato vienen los productos?', 'Son recursos digitales (PDF) entregados desde Hotmart tras el pago, con acceso inmediato y disponible para siempre en tu cuenta.'],
  ['¿Qué es la Atención Farmacéutica y en qué se diferencia?', 'Es un espacio individual con un químico farmacéutico para revisar medicamentos, horarios, suplementos y preparar tus consultas. No diagnostica ni modifica tratamientos.'],
  ['¿Qué diferencia hay entre los recursos y el checklist gratuito?', 'El checklist es la puerta de entrada: una hoja para organizar lo esencial. Los recursos profundizan en cada tema (caída del cabello, sueño, emociones, microbiota, alimentación) con guías y registros completos.'],
];

const situaciones = [
  'sales de consulta y recuerdas después las preguntas que querías hacer',
  'encuentras recomendaciones contradictorias sobre tu medicamento',
  'no sabes cómo organizar medicamento, alimentación y suplementos',
  'recibes resultados de laboratorio y no sabes qué preguntar',
  'aparece un síntoma nuevo y no sabes con qué relacionarlo',
  'tienes decenas de publicaciones guardadas pero ningún sistema',
  'quieres participar más en tu autocuidado pero no sabes por dónde comenzar',
];

const preguntasDia = [
  '¿Puedo tomar esto ahora?',
  '¿Cuánto debo esperar?',
  '¿Este suplemento puede interferir?',
  '¿Qué debería preguntarle a mi médico?',
  '¿Por qué sigo sintiéndome así?',
  '¿Cómo organizo todo esto?',
];

export default function FelizSinTiroidesLanding() {
  useScrollAnalytics('feliz_sin_tiroides');

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: 'feliz_sin_tiroides' });
    const cleanup = updatePageSeo({
      title: 'Feliz Sin Tiroides | Organiza tu autocuidado tiroideo',
      description: 'Educación y herramientas para comprender, organizar y participar en tu autocuidado tiroideo: guías, diarios, checklist y atención farmacéutica.',
      canonical: 'https://edvanta.co/feliz-sin-tiroides',
      image: 'https://edvanta.co/img/karla-real.jpg',
      keywords: ['autocuidado tiroideo', 'educación tiroidea', 'levotiroxina y alimentos', 'caída del cabello y tiroides', 'atención farmacéutica', 'recursos tiroides', 'hipotiroidismo autocuidado', 'hipertiroidismo educación', 'tiroiditis de Hashimoto alimentación', 'insomnio y tiroides', 'emociones y tiroides', 'probióticos y tiroides'],
      jsonLdId: 'feliz-sin-tiroides',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            url: 'https://edvanta.co/feliz-sin-tiroides',
            name: 'Feliz Sin Tiroides',
            description: 'Educación y herramientas para comprender, organizar y participar en tu autocuidado tiroideo.',
            inLanguage: 'es-CO',
          },
          {
            '@type': 'Person',
            name: 'Karla Hernández',
            jobTitle: 'Química Farmacéutica',
            image: 'https://edvanta.co/img/karla-real.jpg',
            knowsAbout: ['Atención farmacéutica', 'Adherencia a levotiroxina', 'Educación en salud tiroidea'],
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqHome.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          },
        ],
      },
    });
    return cleanup;
  }, []);

  const magnet = {
    ...LEAD_MAGNETS.coleccion,
    related: { name: 'Colección de la Tiroides', url: CHECKOUTS.coleccion, cta: 'Ver la colección completa' },
  };

  const goRecursos = () => { trackEvent('hero_cta_click', { cta: 'aprender_cuidarme' }); trackFstClick({ section: 'hero', element: 'cta_aprender', label: 'QUIERO APRENDER A CUIDARME MEJOR', destination: '/recursos-tiroides' }); };
  const goAtencion = () => { trackEvent('hero_cta_click', { cta: 'orientacion_personalizada' }); trackFstClick({ section: 'hero', element: 'cta_atencion', label: 'NECESITO ORIENTACIÓN PERSONALIZADA', destination: '/atencion-farmaceutica' }); };
  const goA = () => { trackEvent('hero_cta_click', { cta: 'explorar_recursos', location: 'camino_a' }); };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <LandingHeader />

      <main>
        {/* ── HERO ── */}
        <section id="fst-inicio" className="relative isolate overflow-hidden bg-[#FFF9F4] py-24 md:py-32 scroll-mt-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F5DCE8]/60 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#EAE2F8]/60 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#e5dceb] bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#76539a] shadow-sm">
                  <Icon name="heart" className="h-4 w-4" /> Educación farmacéutica tiroidea
                </p>
                <h1 className="mt-6 text-4xl font-semibold leading-[1.08] text-[#0A2540] sm:text-5xl lg:text-[3.4rem]">
                  Vivir con una enfermedad tiroidea no debería significar vivir llena de dudas sobre qué hacer cada día.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                  Medicamentos, horarios, alimentos, suplementos, exámenes, síntomas, citas médicas… cuando toda la información llega por partes, cuidar de ti puede sentirse más complicado de lo que debería.
                </p>
                <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[#0A2540]">
                  En Feliz Sin Tiroides ayudamos a las personas a comprender, organizar y participar activamente en su autocuidado.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/recursos-tiroides" onClick={goRecursos} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f]">
                    QUIERO APRENDER A CUIDARME MEJOR <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                  <Link to="/atencion-farmaceutica" onClick={goAtencion} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#bda7d2] bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#563a78] transition-colors hover:bg-[#f7f2fa]">
                    NECESITO ORIENTACIÓN PERSONALIZADA
                  </Link>
                </div>
                <a
                  href="#lead-magnet"
                  onClick={event => { event.preventDefault(); document.querySelector('#lead-magnet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#563a78] underline underline-offset-4 hover:text-[#452b65]"
                >
                  Quiero empezar con una guía gratuita <Icon name="arrowDown" className="h-4 w-4" />
                </a>
              </div>
              <div className="mx-auto w-full max-w-sm">
                <EbookCover3D image="/img/port-coleccion.jpg" alt="Colección de la Tiroides de Feliz Sin Tiroides" />
              </div>
            </div>
          </div>
        </section>

        {/* ── IDENTIFICACIÓN ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Identificación" title="¿Te ha pasado?" description="Nada de esto te hace 'poco constante': son síntomas de vivir sin un sistema." centered />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {situaciones.map(item => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-[#f0eaf5] bg-white p-5 shadow-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAE2F8] text-[#563a78]">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-6 text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border-l-4 border-[#76539a] bg-[#faf8fc] p-6">
              <p className="text-base font-semibold leading-7 text-[#132e55]">
                El problema no siempre es que te falte información. Muchas veces tienes demasiada, pero nadie te ha ayudado a organizarla.
              </p>
            </div>
          </div>
        </section>

        {/* ── AGITACIÓN ÉTICA ── */}
        <section className="bg-[#f5f0f7] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Las preguntas del día" title="¿Cuántas de estas preguntas has tenido esta semana?" centered />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {preguntasDia.map(pregunta => (
                <div key={pregunta} className="rounded-2xl border border-[#e5dceb] bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold leading-6 text-[#132e55]">"{pregunta}"</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-semibold leading-8 text-[#132e55]">
              Cuidarte no debería sentirse como resolver un rompecabezas diferente todos los días.
            </p>
          </div>
        </section>

        {/* ── PROMESA CENTRAL ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#76539a]">La promesa de Feliz Sin Tiroides</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#132e55] md:text-4xl">
              No necesitas memorizar más información sobre tu tiroides. Necesitas aprender a utilizarla.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
              En Feliz Sin Tiroides transformamos información compleja en herramientas, sistemas, guías, registros, educación y acompañamiento.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: 'book', title: 'Guías claras', text: 'Información organizada para el problema específico que te preocupa hoy.' },
                { icon: 'clipboard', title: 'Registros', text: 'Hojas y trackers para que los datos de tu día tengan utilidad.' },
                { icon: 'compass', title: 'Rutas', text: 'Estructuras que te dicen qué sigue, sin adivinar.' },
                { icon: 'users', title: 'Acompañamiento', text: 'Un espacio individual cuando tu caso lo necesita.' },
                { icon: 'message', title: 'Preparación de consultas', text: 'Las preguntas correctas para tu médico, listas.' },
                { icon: 'heart', title: 'Educación real', text: 'Sin promesas milagrosas: información que respeta tu criterio.' },
              ].map(item => (
                <div key={item.title} className="rounded-2xl border border-[#f0eaf5] bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Icon name={item.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-semibold text-[#132e55]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOS DOS CAMINOS ── */}
        <section id="fst-caminos" className="scroll-mt-24 bg-[#f0faf8] py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Dos formas de avanzar" title="Elige el camino que mejor te acompaña hoy" centered />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {/* CAMINO A */}
              <div className="flex h-full flex-col rounded-3xl border border-[#cfe5e0] bg-white p-8 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f7f5] text-[#0B8176]"><Icon name="book" className="h-6 w-6" /></span>
                <h3 className="mt-5 text-2xl font-semibold text-[#0A2540]">QUIERO APRENDER A MI RITMO</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">Productos digitales educativos para cuando quieres ir organizando tu autocuidado poco a poco, con material que consultas cuando quieras.</p>
                <ul className="mt-5 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                  {['Comprender', 'Organizar', 'Consultar', 'Registrar', 'Preparar consultas', 'Crear rutinas'].map(item => (
                    <li key={item} className="flex items-center gap-2"><Icon name="checkCircle" className="h-4 w-4 text-[#0f766e]" /> {item}</li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Link to="/recursos-tiroides" onClick={goA} className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f]">
                    EXPLORAR MIS RECURSOS <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* CAMINO B */}
              <div className="flex h-full flex-col rounded-3xl border border-[#e5dceb] bg-white p-8 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Icon name="users" className="h-6 w-6" /></span>
                <h3 className="mt-5 text-2xl font-semibold text-[#0A2540]">NECESITO REVISAR MI CASO</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">Atención Farmacéutica individual para cuando las dudas ya son específicas y una guía general no alcanza.</p>
                <ul className="mt-5 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                  {['Medicamentos y horarios', 'Suplementos', 'Adherencia', 'Preguntas para tu médico', 'Revisión individual', 'Documento resumen'].map(item => (
                    <li key={item} className="flex items-center gap-2"><Icon name="checkCircle" className="h-4 w-4 text-[#0f766e]" /> {item}</li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Link to="/atencion-farmaceutica" onClick={goAtencion} className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#563a78] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#452b65]">
                    QUIERO CONOCER LA ATENCIÓN FARMACÉUTICA <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOBRE KARLA ── */}
        <section id="fst-karla" className="scroll-mt-24 bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-[#e5dceb] bg-[#f2ebf7]">
              <img src="/img/karla-real.jpg" alt="Karla Hernández, química farmacéutica y fundadora de Feliz Sin Tiroides" width="800" height="1000" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div>
              <SectionHeading eyebrow="¿Quién está detrás?" title="Educación farmacéutica creada desde la ciencia y la experiencia real" />
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-600">
                <p>Soy <strong className="text-[#132e55]">Karla Hernández, Química Farmacéutica</strong> y creadora de Feliz Sin Tiroides.</p>
                <p>Mi propósito es convertir información compleja relacionada con medicamentos, autocuidado y salud tiroidea en herramientas que las personas puedan comprender y utilizar de una forma mucho más práctica.</p>
                <p>Todo el contenido es educativo: no diagnostica, no prescribe y no cambia dosis. Complementa la conversación con tu equipo tratante.</p>
              </div>
              <div className="mt-6 rounded-lg border-l-4 border-[#76539a] bg-[#faf8fc] p-5">
                <p className="text-sm leading-6 text-gray-700">
                  <strong className="text-[#132e55]">Aviso profesional:</strong> Karla no se presenta como médica endocrinóloga. Los recursos complementan, nunca sustituyen, la atención médica.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="fst-preguntas" className="scroll-mt-24 bg-[#f5f0f7] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Respuestas claras antes de comenzar" centered />
            <div className="mt-10">
              <FaqList items={faqHome} />
            </div>
          </div>
        </section>

        {/* ── LEAD MAGNET ── */}
        <LeadMagnetSection
          magnet={magnet}
          formId="lead_home"
          title="¿Todavía no sabes por dónde empezar? Empieza gratis."
          intro="El checklist para organizar tu autocuidado tiroideo es el primer paso concreto: medicamentos, horarios, suplementos, síntomas, exámenes y preguntas para tu consulta."
        />

        {/* ── CIERRE ── */}
        <section className="relative isolate overflow-hidden bg-[#132e55] py-20 text-white">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#76539a]/30 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">Puedes seguir acumulando información… o empezar a organizarla.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">
              Elige el camino de hoy: recursos para aprender a tu ritmo, atención farmacéutica para tu caso, o el checklist gratuito para dar el primer paso.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/recursos-tiroides" onClick={goRecursos} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#132e55] shadow-md transition-colors hover:bg-[#f2ebf7]">
                EXPLORAR MIS RECURSOS <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link to="/atencion-farmaceutica" onClick={goAtencion} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10">
                ORIENTACIÓN PERSONALIZADA
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
