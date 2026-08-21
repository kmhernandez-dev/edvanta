import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import LandingHeader from '../../components/fst/landing/LandingHeader';
import LandingFooter from '../../components/fst/landing/LandingFooter';
import LeadMagnetSection from '../../components/fst/landing/LeadMagnetSection';
import { EbookCover3D, PhoneMockup } from '../../components/fst/landing/LandingMockups';
import { SectionHeading, FaqList, useScrollAnalytics } from '../../components/fst/landing/LandingUi';
import { updatePageSeo } from '../../utils/seo';
import { trackEvent } from '../../utils/analytics';
import { trackFstClick } from '../../lib/fstClicks';
import { LEAD_MAGNETS, CHECKOUTS } from '../../data/fstLandings';
import { waLink } from '../../config/links';

const LEAD_FORM_WHATSAPP = waLink('Hola Karla, me gustaría orientación para elegir un recurso para mi momento tiroideo.');

const faqList = [
  ['¿Los recursos reemplazan la consulta médica?', 'No. Son materiales educativos para ayudarte a comprender información, organizar preguntas y participar activamente en tu cuidado. No sustituyen valoración, diagnóstico, tratamiento ni seguimiento profesional.'],
  ['¿Cómo elijo el recurso correcto?', 'Usa el selector de esta página: elige la situación que mejor describe tu momento y cada recurso te explicará si es para ti, qué incluye y qué preguntas resuelve. Si tienes dudas, escríbenos por WhatsApp.'],
  ['¿En qué formato vienen?', 'Son recursos digitales (PDF) que se entregan desde Hotmart después de confirmar el pago. Puedes imprimirlos o usarlos en tu celular, tablet o computador.'],
  ['¿Tengo acceso inmediato?', 'Sí. El enlace de descarga llega al instante tras el pago y queda disponible en tu cuenta de Hotmart para siempre.'],
  ['¿Lo puedo consultar varias veces?', 'Sí, son tuyos para siempre: puedes abrirlos y releerlos las veces que necesites, en cualquier dispositivo.'],
  ['¿Me sirve si tengo un diagnóstico específico?', 'Cada recurso indica claramente para quién es. Si tu condición (Graves, nódulos, cáncer de tiroides) no aparece en una guía concreta, la Colección o la Atención Farmacéutica pueden ser tu mejor punto de partida.'],
  ['¿Qué diferencia hay entre los ebooks y la Atención Farmacéutica?', 'Los ebooks son educación que consultas a tu ritmo. La Atención Farmacéutica es un espacio individual para revisar tu caso con un químico farmacéutico: medicamentos, horarios, suplementos y preguntas para tu equipo médico.'],
];

const needRoutes = [
  {
    icon: 'book',
    question: 'Tengo dudas generales sobre mi autocuidado',
    text: 'Conceptos, medicación, registros y hábitos en una sola ruta.',
    to: '/coleccion-tiroides',
    cta: 'Ver la Colección de la Tiroides',
  },
  {
    icon: 'trendDown',
    question: 'Me preocupa la caída del cabello',
    text: 'Registra lo que pasa y prepárate para tu consulta.',
    to: '/caida-cabello-tiroides',
    cta: 'Ver el protocolo de caída del cabello',
  },
  {
    icon: 'sun',
    question: 'Estoy teniendo problemas para dormir',
    text: 'Observa tu descanso y construye una rutina nocturna.',
    to: '/insomnio-tiroides',
    cta: 'Ver la guía de insomnio y tiroides',
  },
  {
    icon: 'heart',
    question: 'Quiero aprender a manejar mejor mis emociones y tengo hipotiroidismo',
    text: 'Un diario guiado para registrar tu mundo emocional.',
    to: '/diario-emociones-hipotiroidismo',
    cta: 'Ver el diario para hipotiroidismo',
  },
  {
    icon: 'activity',
    question: 'Quiero aprender a manejar mejor mis emociones y tengo hipertiroidismo',
    text: 'Registro breve para días acelerados: emociones, energía y descanso.',
    to: '/diario-emociones-hipertiroidismo',
    cta: 'Ver el diario para hipertiroidismo',
  },
  {
    icon: 'leaf',
    question: 'Quiero entender mejor el papel de la microbiota',
    text: 'Qué son los probióticos y cómo decidir con criterio.',
    to: '/probioticos-tiroides',
    cta: 'Ver la guía de probióticos',
  },
  {
    icon: 'clipboard',
    question: 'Tengo Hashimoto y quiero organizar mejor mi alimentación',
    text: 'Educación nutricional sin listas prohibidas interminables.',
    to: '/hashimoto-nutricion',
    cta: 'Ver Nutrir tu tiroides',
  },
];

export default function RecursosTiroides() {
  useScrollAnalytics('recursos_tiroides');

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: 'recursos_tiroides' });
    const cleanup = updatePageSeo({
      title: 'Recursos para tu tiroides: guías, diarios y ebooks | Feliz Sin Tiroides',
      description: 'Encuentra la guía para tu momento: caída del cabello, insomnio, emociones, microbiota y alimentación en Hashimoto. Recursos digitales organizados.',
      canonical: 'https://edvanta.co/recursos-tiroides',
      image: 'https://edvanta.co/img/port-coleccion.jpg',
      keywords: ['recursos para tiroides', 'guías tiroidea', 'ebooks para tiroides', 'diario de la tiroides', 'curso autocuidado tiroidea', 'guía caída del cabello y tiroides', 'guía sueño tiroidea', 'diario emociones hipotiroidismo', 'diario emociones hipertiroidismo', 'probióticos y tiroides', 'alimentación Hashimoto'],
      jsonLdId: 'recursos-tiroides',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            url: 'https://edvanta.co/recursos-tiroides',
            name: 'Recursos para tu tiroides',
            description: 'Guías, diarios y ebooks educativos de Feliz Sin Tiroides para organizar tu autocuidado.',
            inLanguage: 'es-CO',
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqList.map(([question, answer]) => ({
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

  const scrollToSelector = (event) => {
    event.preventDefault();
    document.querySelector('#selector-recursos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('hero_cta_click', { location: 'recursos_hero', cta: 'encontrar_mi_recurso' });
  };

  const magnet = {
    ...LEAD_MAGNETS.coleccion,
    related: { name: 'Colección de la Tiroides', url: CHECKOUTS.coleccion, cta: 'Ver la colección completa' },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <LandingHeader />

      <main>
        {/* ── HERO ── */}
        <section className="relative isolate overflow-hidden bg-[#FFF9F4] py-24 md:py-32">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F5DCE8]/60 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#EAE2F8]/60 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#e5dceb] bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#76539a] shadow-sm">
                <Icon name="book" className="h-4 w-4" /> Recursos digitales · Feliz Sin Tiroides
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] text-[#0A2540] sm:text-5xl">
                No necesitas otro consejo aislado sobre la tiroides. Necesitas saber qué hacer con la información.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Encuentra guías, ebooks, diarios y recursos creados para ayudarte a entender aspectos específicos de tu autocuidado tiroideo y aplicarlos en tu día a día.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#selector-recursos"
                  onClick={scrollToSelector}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f]"
                >
                  ENCONTRAR MI RECURSO <Icon name="arrowDown" className="h-4 w-4" />
                </a>
                <Link to="/atencion-farmaceutica" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#bda7d2] bg-white px-7 py-3.5 text-sm font-bold text-[#563a78] transition-colors hover:bg-[#f7f2fa]">
                  ¿Necesitas algo individual? Atención Farmacéutica
                </Link>
              </div>
              <p className="mt-5 text-xs text-gray-500">Recursos educativos digitales · Pago seguro en Hotmart · Acceso inmediato</p>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <EbookCover3D image="/img/port-coleccion.jpg" alt="Colección de la Tiroides" />
            </div>
          </div>
        </section>

        {/* ── SELECTOR DE NECESIDADES ── */}
        <section id="selector-recursos" className="scroll-mt-24 bg-[#f5f0f7] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="¿Qué quieres trabajar hoy?" title="¿Qué necesitas resolver hoy?" description="Elige la situación que mejor describe tu momento. Cada ruta te lleva a la landing del recurso específico, con su propio contenido, sus preguntas y su recurso gratuito." centered />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {needRoutes.map(route => (
                <Link
                  key={route.to}
                  to={route.to}
                  onClick={() => { trackEvent('related_product_click', { product: route.to }); trackFstClick({ section: 'selector_recursos', element: route.to, label: route.cta, destination: route.to }); }}
                  className="group flex h-full flex-col rounded-2xl border border-[#e5dceb] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c7b1dc] hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]">
                    <Icon name={route.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-[#132e55]">{route.question}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{route.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#563a78]">
                    {route.cta} <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CURSO DE AUTOCUIDADO ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="mx-auto w-full max-w-sm">
              <PhoneMockup tag="CURSO" title="Curso de Autocuidado de la Tiroides" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#76539a]">¿Prefieres una ruta guiada?</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#132e55] md:text-4xl">Curso de Autocuidado de la Tiroides</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Si tu momento merece un recorrido educativo más estructurado —lecciones, ejercicios y materiales descargables—, el curso te acompaña paso a paso para integrar medicación, hábitos y comunicación con tu equipo de salud.
              </p>
              <ul className="my-6 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                {['Lecciones organizadas', 'Ejercicios prácticos', 'Material descargable', 'Ritmo propio'].map(item => (
                  <li key={item} className="flex items-center gap-2"><Icon name="checkCircle" className="h-5 w-5 text-[#0f766e]" /> {item}</li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={CHECKOUTS.autocuidado}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackEvent('checkout_click', { product_id: 'fst-autocuidado', product_name: 'Curso de Autocuidado de la Tiroides' }); trackFstClick({ section: 'recursos', element: 'curso_autocuidado', label: 'Ver el curso', destination: CHECKOUTS.autocuidado }); }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#123b5f]"
                >
                  Ver el curso <Icon name="arrowRight" className="h-4 w-4" />
                </a>
                <Link to="/academia" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#2CB1A1] bg-white px-6 py-3 text-sm font-bold text-[#0A655D] hover:bg-[#effaf8]">
                  Explorar Academy gratis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ATENCIÓN FARMACÉUTICA ── */}
        <section className="bg-[#132e55] py-16 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5eead4]">¿Tu caso ya es muy específico?</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Si manejas varios medicamentos, horarios complicados o dudas concretas de farmacoterapia, una guía puede no ser suficiente.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">La Atención Farmacéutica individual revisa tu situación en un espacio privado, ordenado y profesional, sin sustituir tu consulta médica.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/atencion-farmaceutica" onClick={() => { trackEvent('hero_cta_click', { location: 'recursos', cta: 'atencion_farmaceutica' }); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#132e55] hover:bg-[#f2ebf7]">
                Conocer la Atención Farmacéutica <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={LEAD_FORM_WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de elegir un recurso, respuestas claras" centered />
            <div className="mt-10">
              <FaqList items={faqList} />
            </div>
          </div>
        </section>

        {/* ── LEAD MAGNET ── */}
        <LeadMagnetSection magnet={magnet} formId="lead_recursos" />
      </main>

      <LandingFooter />
    </div>
  );
}
