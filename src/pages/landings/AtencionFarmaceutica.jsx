import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import LandingHeader from '../../components/fst/landing/LandingHeader';
import LandingFooter from '../../components/fst/landing/LandingFooter';
import LeadMagnetSection from '../../components/fst/landing/LeadMagnetSection';
import { SectionHeading, FaqList, AuthorityBlock, TrustBar, useScrollAnalytics } from '../../components/fst/landing/LandingUi';
import { updatePageSeo } from '../../utils/seo';
import { trackEvent } from '../../utils/analytics';
import { trackLeadEvent } from '../../lib/leadEvents';
import { trackFstClick } from '../../lib/fstClicks';
import { waLink } from '../../config/links';
import { LEAD_MAGNETS, CHECKOUTS } from '../../data/fstLandings';

const whatsappLink = waLink('Hola Karla, quiero reservar mi Atención Farmacéutica. ¿Me cuentas cómo funciona?');

// ─── Variables editables del servicio (no inventar) ──────────
const SERVICIO = {
  duracion: '[DEFINIR DURACIÓN]',
  seguimiento: '[DEFINIR SEGUIMIENTO]',
  entregable: '[DEFINIR ENTREGABLE]',
  precio: '[DEFINIR PRECIO]',
};
const SERVICIO_DURACION = SERVICIO.duracion;
const VARIABLE_ENTREGABLE = SERVICIO.entregable;

const flujoAtencion = [
  { icon: 'pill', label: 'MEDICAMENTOS' },
  { icon: 'clock', label: 'HORARIOS' },
  { icon: 'leaf', label: 'SUPLEMENTOS' },
  { icon: 'clipboard', label: 'ADHERENCIA' },
  { icon: 'users', label: 'INTERACCIONES' },
  { icon: 'activity', label: 'SÍNTOMAS REPORTADOS' },
  { icon: 'message', label: 'DUDAS' },
  { icon: 'checkCircle', label: 'PLAN DE ORGANIZACIÓN' },
];

const pasos = [
  { icon: 'calendar', title: '1. Reserva', text: 'Elige el espacio a través de WhatsApp o el formulario. Te confirmamos disponibilidad y quedas con tu cita apartada.' },
  { icon: 'mail', title: '2. Envías información', text: 'Unos días antes recibes una guía para reunir lo básico: medicamentos actuales, horarios, suplementos y tus principales dudas.' },
  { icon: 'users', title: '3. Realizamos la atención', text: 'En la sesión revisamos tu farmacoterapia, tus rutinas y tus preguntas en un espacio individual y confidencial.' },
  { icon: 'checkCircle', title: '4. Recibes tu plan', text: `Recibes un documento con la organización de tu esquema y las preguntas para tu equipo médico: ${VARIABLE_ENTREGABLE}.` },
];

const faqList = [
  ['¿Qué es la Atención Farmacéutica?', 'Es un espacio individual y estructurado con un químico farmacéutico para revisar cómo usas tus medicamentos y suplementos: horarios, adherencia, dudas e interacciones, con un enfoque educativo y organizativo.'],
  ['¿Es lo mismo que una consulta médica?', 'No. La Atención Farmacéutica no diagnostica, no prescribe y no modifica tratamientos. Complementa la consulta médica ayudándote a organizar la información y las preguntas que llevarás a tu médico.'],
  ['¿Para quién es útil?', 'Para personas que toman varios medicamentos o suplementos, tienen dudas de horarios, dificultad para seguir su esquema o quieren preparar mejor su próxima consulta.'],
  ['¿Qué información se revisa?', 'Medicamentos, horarios, suplementos, adherencia, posibles interacciones, síntomas reportados y dudas. Todo lo que compartas es confidencial.'],
  ['¿Cómo se realiza?', `${SERVICIO_DURACION}. Se realiza de forma individual, previa recolección de tu información, y termina con un documento resumen.`],
  ['¿Esto sustituye a mi endocrinólogo?', 'No, y es importante decirlo con claridad: la Atención Farmacéutica complementa y prepara tu consulta médica. Las decisiones clínicas siempre las toma tu equipo de salud.'],
  ['¿Qué NO hace un farmacéutico en este servicio?', 'No diagnostica, no prescribe, no cambia dosis y no atiende urgencias. Si lo que tienes es una emergencia, acude a un servicio de urgencias de inmediato.'],
  ['¿Cómo reservo?', 'Escríbenos por WhatsApp con el mensaje de reserva o completa el formulario de la página. Te confirmaremos disponibilidad y pasos a seguir.'],
];

function FlujoVisual() {
  return (
    <div className="mt-10">
      <div className="flex flex-col items-center gap-2">
        {flujoAtencion.map((item, index) => (
          <div key={item.label} className="w-full">
            <div className="flex items-center gap-4 rounded-xl border border-[#e5dceb] bg-white px-5 py-3.5 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAE2F8] text-[#9274C9]">
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <p className="text-sm font-bold tracking-wide text-[#132e55]">{item.label}</p>
            </div>
            {index < flujoAtencion.length - 1 && (
              <div className="flex justify-center py-0.5">
                <Icon name="arrowDown" className="h-4 w-4 text-[#76539a]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AtencionFarmaceutica() {
  useScrollAnalytics('atencion_farmaceutica');

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: 'atencion_farmaceutica' });
    const cleanup = updatePageSeo({
      title: 'Atención Farmacéutica individual | Feliz Sin Tiroides',
      description: 'Espacio individual con un químico farmacéutico para revisar medicamentos, horarios, suplementos y preparar tus consultas médicas.',
      canonical: 'https://edvanta.co/atencion-farmaceutica',
      image: 'https://edvanta.co/img/karla-real.jpg',
      keywords: ['atención farmacéutica', 'orientación farmacéutica', 'revisión de medicamentos', 'interacciones medicamentosas', 'adherencia tratamiento', 'atención farmacéutica tiroides', 'organizar levotiroxina y suplementos', 'dudas sobre medicamentos y horarios', 'químico farmacéutico tiroidea'],
      jsonLdId: 'atencion-farmaceutica',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            url: 'https://edvanta.co/atencion-farmaceutica',
            name: 'Atención Farmacéutica individual | Feliz Sin Tiroides',
            description: 'Espacio individual con un químico farmacéutico para revisar medicamentos, horarios, suplementos y preparar tus consultas médicas.',
            inLanguage: 'es-CO',
          },
          {
            '@type': 'Service',
            name: 'Atención Farmacéutica individual',
            provider: { '@type': 'Person', name: 'Karla Hernández', jobTitle: 'Química Farmacéutica' },
            description: 'Revisión individual de medicamentos, horarios, suplementos y adherencia para preparar tu consulta médica.',
            areaServed: 'CO',
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

  const reserve = () => {
    trackEvent('attention_booking_click', { location: 'atencion_farmaceutica' });
    trackLeadEvent('pharmaceutical_service_clicked', { source: 'landing_atencion' });
    trackFstClick({ section: 'atencion_farmaceutica', element: 'cta_reservar', label: 'QUIERO RESERVAR MI ATENCIÓN FARMACÉUTICA', destination: whatsappLink });
  };

  const magnet = {
    ...LEAD_MAGNETS.coleccion,
    related: { name: 'Colección de la Tiroides', url: CHECKOUTS.coleccion, cta: 'Ver la colección' },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <LandingHeader />

      <main>
        {/* ── HERO ── */}
        <section className="relative isolate overflow-hidden bg-[#FFF9F4] py-24 md:py-32">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F5DCE8]/60 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#EAE2F8]/60 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#e5dceb] bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#76539a] shadow-sm">
                  <Icon name="compass" className="h-4 w-4" /> Servicio individual · Química Farmacéutica
                </p>
                <h1 className="mt-6 text-4xl font-semibold leading-[1.08] text-[#0A2540] sm:text-5xl">
                  Cuando tus dudas ya son específicas, una guía general puede no ser suficiente.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                  Si utilizas medicamentos, suplementos, manejas distintos horarios o tienes dudas sobre tu farmacoterapia, la Atención Farmacéutica ofrece un espacio individual y estructurado para revisar tu situación.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={reserve}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f]"
                  >
                    QUIERO RESERVAR MI ATENCIÓN FARMACÉUTICA <Icon name="arrowRight" className="h-4 w-4" />
                  </a>
                  <a
                    href="#para-quien"
                    onClick={event => { event.preventDefault(); document.querySelector('#para-quien')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#bda7d2] bg-white px-7 py-3.5 text-sm font-bold text-[#563a78] transition-colors hover:bg-[#f7f2fa]"
                  >
                    QUIERO SABER SI ESTE SERVICIO ES PARA MÍ
                  </a>
                </div>
                <div className="mt-8">
                  <TrustBar items={['Espacio individual y confidencial', 'Preparación previa', 'Documento resumen']} />
                </div>
              </div>
              <div className="mx-auto w-full max-w-md">
                <div className="relative overflow-hidden rounded-2xl border border-[#e5dceb] bg-white shadow-xl shadow-[#0A2540]/10">
                  <img src="/img/karla-real.jpg" alt="Karla Hernández, Química Farmacéutica, en la Atención Farmacéutica de Feliz Sin Tiroides" width="800" height="1000" className="aspect-[4/5] w-full object-cover" />
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/40 bg-white/90 p-3 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">Tu espacio individual</p>
                    <p className="mt-1 text-sm font-semibold text-[#0A2540]">Karla Hernández · Química Farmacéutica</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUÉ ES ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="¿Qué es la Atención Farmacéutica?"
              title="No es otra consulta médica. Es una revisión centrada en tus medicamentos y en cómo los utilizas."
              description="El rol del químico farmacéutico es educar, organizar y acompañar el uso correcto de tu farmacoterapia: un complemento directo a tu consulta médica."
              centered
            />
            <div className="mx-auto mt-10 max-w-2xl">
              <FlujoVisual />
            </div>
          </div>
        </section>

        {/* ── PARA QUIÉN ── */}
        <section id="para-quien" className="scroll-mt-24 bg-[#f5f0f7] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="¿Para quién puede ser útil?" title="Si te reconoces en varias de estas situaciones, puede ser para ti" centered />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                'utilizas varios medicamentos a la vez',
                'tomas medicamentos y suplementos combinados',
                'tienes dudas sobre los horarios de tu tratamiento',
                'te cuesta seguir tu esquema con constancia',
                'quieres organizar mejor tu farmacoterapia',
                'tienes preguntas que quieres preparar para tu médico',
                'necesitas comprender cómo usar correctamente tus medicamentos',
                'llegas a consulta con dudas que no terminas de plantear',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-[#e5dceb] bg-white p-5 shadow-sm">
                  <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" />
                  <span className="text-sm leading-6 text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── QUÉ INCLUYE ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="¿Qué incluye?" title="Una revisión completa de tu farmacoterapia" description="El servicio puede ajustarse a tu caso: lo que sigue es la estructura base y las partes que siempre se revisan." centered />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: 'clipboard', title: 'Revisión previa', text: 'Un primer vistazo a la información que envías antes de la cita.' },
                { icon: 'message', title: 'Entrevista farmacéutica', text: 'Conversación individual para conocer tu rutina real y tus dudas.' },
                { icon: 'pill', title: 'Revisión de medicamentos', text: 'Uso, horarios y administración de cada medicamento.' },
                { icon: 'clock', title: 'Evaluación de horarios', text: 'Cómo organizar tomas que chocan con comidas, suplementos o tu día.' },
                { icon: 'leaf', title: 'Revisión de suplementos', text: 'Qué estás tomando, por qué y cómo se relaciona con tu tratamiento.' },
                { icon: 'shield', title: 'Posibles problemas con medicamentos', text: 'Identificación de situaciones que merecen conversarse con tu médico.' },
                { icon: 'book', title: 'Educación sobre uso adecuado', text: 'Información clara para que entiendas lo que estás tomando.' },
                { icon: 'compass', title: 'Organización del esquema', text: 'Un plan de organización realista, adaptado a tu rutina.' },
                { icon: 'users', title: 'Documento resumen', text: 'Resumen escrito de lo revisado y las preguntas para tu equipo médico.' },
              ].map(item => (
                <div key={item.title} className="rounded-2xl border border-[#f0eaf5] bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Icon name={item.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-semibold leading-snug text-[#132e55]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-[#c7b1dc] bg-[#faf8fc] p-6 text-center">
              <p className="text-sm text-gray-600">
                <strong className="text-[#132e55]">Detalles del servicio por confirmar:</strong> Duración {SERVICIO.duracion} · Seguimiento {SERVICIO.seguimiento} · Precio {SERVICIO.precio}
              </p>
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section className="bg-[#f0faf8] py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="¿Cómo funciona?" title="Cuatro pasos, sin complicaciones" centered />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pasos.map(paso => (
                <div key={paso.title} className="rounded-2xl border border-[#cfe5e0] bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f7f5] text-[#0B8176]"><Icon name={paso.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-semibold text-[#0A2540]">{paso.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{paso.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={reserve}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f]"
              >
                QUIERO RESERVAR MI ESPACIO <Icon name="arrowRight" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── SEGURIDAD Y LÍMITES ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Límites y colaboración" title="Qué no sustituye este servicio" centered />
            <div className="mt-8 rounded-2xl border border-[#e5dceb] bg-[#faf8fc] p-7">
              <p className="text-sm leading-7 text-gray-600">
                La Atención Farmacéutica no sustituye: <strong>el diagnóstico médico, la consulta endocrinológica, la atención de urgencias</strong> ni la modificación de tratamientos prescritos por cuenta propia.
              </p>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                Funciona como un espacio de <strong>colaboración interdisciplinaria</strong>: te ayuda a organizar lo que conversarás con tu médico, a entender tu farmacoterapia y a preparar tus preguntas. Nunca tomará decisiones clínicas por ti.
              </p>
              <div className="mt-6 border-t border-[#e5dceb] pt-5">
                <p className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                  <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" />
                  Confidencialidad: la información que compartes se usa exclusivamente para tu orientación y no se comparte con terceros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── AUTORIDAD ── */}
        <section className="bg-white py-4">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <AuthorityBlock />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-[#f5f0f7] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que sueles preguntar antes de reservar" centered />
            <div className="mt-10">
              <FaqList items={faqList} />
            </div>
          </div>
        </section>

        {/* ── LEAD MAGNET (para quien aún no está listo) ── */}
        <LeadMagnetSection
          magnet={magnet}
          formId="lead_atencion"
          title="¿Todavía no necesitas una cita? Empieza gratis."
          intro="Si quieres empezar organizando lo básico por tu cuenta, este checklist gratuito te da la estructura inicial."
        />

        {/* ── CTA FINAL ── */}
        <section className="relative isolate overflow-hidden bg-[#132e55] py-20 text-white">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#76539a]/30 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">Si tus dudas son específicas, tu espacio también debería serlo.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">
              Reserva tu Atención Farmacéutica y recibe la organización y las preguntas que hoy se pierden entre tantas fuentes.
            </p>
            <div className="mt-8">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={reserve}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#132e55] shadow-md transition-colors hover:bg-[#f2ebf7]"
              >
                QUIERO RESERVAR MI ATENCIÓN FARMACÉUTICA <Icon name="arrowRight" className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-white/70 sm:flex-row">
              <Link to="/recursos-tiroides" className="underline underline-offset-4 hover:text-white">Si prefieres educarte a tu ritmo, explora los recursos digitales</Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
