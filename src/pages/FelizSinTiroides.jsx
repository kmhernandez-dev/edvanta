import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import FstLeadForm from '../components/fst/FstLeadForm';
import EbookCard from '../components/fst/EbookCard';
import BrandSwitch from '../components/BrandSwitch';
import ArticulosSection from '../components/ArticulosSection';
import Icon from '../components/Icon';
import { ebooks } from '../data/fst';
import {
  ethicalCommitments,
  faqs,
  patientStages,
  productCategories,
  productDetails,
  recommendationOptions,
} from '../data/fstLanding';
import { waLink } from '../config/links';
import { trackEvent } from '../utils/analytics';
import { updatePageSeo } from '../utils/seo';

const whatsappUrl = waLink('Hola, llegué desde la página de Feliz Sin Tiroides y necesito orientación para elegir un recurso.');

function SectionHeading({ eyebrow, title, description, centered = false, dark = false }) {
  return (
    <div className={`mb-9 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#d8c5e8]' : 'text-[#76539a]'}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-semibold leading-tight md:text-4xl ${dark ? 'text-white' : 'text-[#132e55]'}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 md:text-lg ${dark ? 'text-white/70' : 'text-gray-600'}`}>{description}</p>}
    </div>
  );
}

function ResourceMockup() {
  const items = ['El mejor horario para tomarla', 'Cuánto esperar antes del café', 'Calcio y hierro: cómo separarlos', 'Qué hacer si olvidas una dosis'];
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-label="Vista previa de la guía gratuita">
      <div className="absolute -left-4 top-5 h-[88%] w-full rounded-lg border border-[#ddcfeb] bg-[#efe8f5]" />
      <div className="relative rounded-lg border border-[#d7c8e5] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#eee7f3] pb-4">
          <img src="/img/port-logofelizsintiroides.jpg" alt="" className="h-12 w-12 rounded-md object-cover" />
          <span className="rounded bg-[#f2ebf7] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#563a78]">Guía PDF</span>
        </div>
        <p className="mt-5 text-sm font-semibold text-[#0f766e]">Recurso gratuito</p>
        <h3 className="mt-1 text-2xl font-semibold leading-tight text-[#132e55]">Cómo tomar la levotiroxina correctamente</h3>
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div key={item} className="flex items-center gap-3 border-b border-gray-100 pb-2 text-sm text-gray-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#f2ebf7] text-xs font-bold text-[#563a78]">{index + 1}</span>
              {item}
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-gray-500">Incluye una hoja para preparar preguntas para tu próxima consulta.</p>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-label="Vista previa del panel personal">
      <div className="absolute -right-4 top-6 h-[86%] w-full rounded-2xl border border-[#e5dceb] bg-[#f7f3fb]" />
      <div className="relative rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-xl shadow-[#0A2540]/10">
        <div className="flex items-center justify-between border-b border-[#f3eef7] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Hola, Ana</p>
            <p className="mt-1 text-lg font-semibold text-[#0A2540]">¿Cómo podemos ayudarte hoy?</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]">
            <Icon name="sparkles" className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {['Preguntar a NutriFST', 'Registrar comida', 'Registrar levotiroxina', 'Revisar alimento'].map(item => (
            <div key={item} className="rounded-xl border border-[#f0eaf5] bg-[#faf8fd] px-3 py-3 text-xs font-semibold text-[#0A2540]">{item}</div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-[#d3efe9] bg-[#f0faf8] p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0B8176]">Tu día</p>
          <p className="mt-1 text-sm font-semibold text-[#0A2540]">Levotiroxina 06:30 · Tomada</p>
          <p className="text-xs text-slate-500">2 comidas registradas · 1 síntoma</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#f3eef7] pt-4 text-center">
          {[['7', 'días de registros'], ['3', 'herramientas usadas'], ['100%', 'control personal']].map(([value, label]) => (
            <div key={label}><p className="text-lg font-bold text-[#0A2540]">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NutriFstMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-label="Vista previa de NutriFST IA">
      <div className="absolute -left-4 top-6 h-[86%] w-full rounded-2xl border border-[#f5dce8] bg-[#fdf4f8]" />
      <div className="relative rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-xl shadow-[#0A2540]/10">
        <div className="flex items-center gap-2 border-b border-[#f3eef7] pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAE2F8] text-[#9274C9]">
            <Icon name="sparkles" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#0A2540]">NutriFST IA</p>
            <p className="text-[10px] text-slate-500">Asistente nutricional</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#0A2540] px-3 py-2 text-xs leading-5 text-white">¿Puedo tomar café ahora?</div>
          <div className="max-w-[92%] rounded-2xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">NutriFST</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">El café puede reducir la absorción de levotiroxina si se toman muy cerca. La práctica habitual es separar la toma del medicamento del café.</p>
            <span className="mt-2 inline-flex rounded-full border border-[#d3efe9] bg-[#f0faf8] px-2 py-0.5 text-[9px] font-bold uppercase text-[#0B8176]">Ver evidencia</span>
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#0A2540] px-3 py-2 text-xs leading-5 text-white">Hazme un menú para esta semana</div>
          <div className="max-w-[92%] rounded-2xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">NutriFST</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">Desayuno: huevos pericos · Almuerzo: pollo con arroz y verduras · Cena: ensalada de pollo</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#f0eaf5] p-2">
          <span className="min-w-0 flex-1 px-2 text-xs text-slate-400">Escribe tu pregunta...</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A2540] text-white">
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FelizSinTiroides() {
  const [selectedStage, setSelectedStage] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [activeCategory, setActiveCategory] = useState('nuevos');
  const [highlightedProductId, setHighlightedProductId] = useState('');
  const [leadPromptOpen, setLeadPromptOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: 'feliz_sin_tiroides' });

    const cleanupSeo = updatePageSeo({
      title: 'Vivir sin tiroides: levotiroxina, alimentación y autocuidado | Feliz Sin Tiroides',
      description: 'Educación farmacéutica para comprender la levotiroxina, los exámenes, la alimentación, la tiroidectomía y la yodoterapia con información clara y responsable.',
      canonical: 'https://edvanta.co/feliz-sin-tiroides',
      image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
      keywords: [
        'vivir sin tiroides',
        'levotiroxina y alimentos',
        'guía post tiroidectomía',
        'alimentación para hipotiroidismo',
        'yodoterapia I-131',
        'educación para pacientes tiroideos',
        'guía para recién diagnosticados con hipotiroidismo',
        'levotiroxina sin sorpresas',
        'insomnio y enfermedades tiroideas',
        'alimentación para tiroiditis de Hashimoto',
        'caída del cabello y tiroides',
        'probióticos y salud digestiva',
      ],
      jsonLdId: 'feliz-sin-tiroides',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': 'https://edvanta.co/feliz-sin-tiroides#webpage',
            url: 'https://edvanta.co/feliz-sin-tiroides',
            name: 'Feliz Sin Tiroides',
            description: 'Plataforma de educación farmacéutica para personas con condiciones tiroideas.',
            inLanguage: 'es-CO',
          },
          {
            '@type': 'Organization',
            '@id': 'https://edvanta.co/feliz-sin-tiroides#organization',
            name: 'Feliz Sin Tiroides',
            url: 'https://edvanta.co/feliz-sin-tiroides',
            logo: 'https://edvanta.co/img/port-logofelizsintiroides.jpg',
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
            mainEntity: faqs.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          },
        ],
      },
    });

    return cleanupSeo;
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('fst-lead-prompt-shown')) return undefined;
    const showPrompt = () => {
      if (sessionStorage.getItem('fst-lead-prompt-shown')) return;
      sessionStorage.setItem('fst-lead-prompt-shown', '1');
      setLeadPromptOpen(true);
    };
    let exitIntentReady = false;
    const readinessTimer = window.setTimeout(() => {
      exitIntentReady = true;
    }, 20000);
    const timer = window.setTimeout(showPrompt, 45000);
    const exitIntent = event => {
      if (exitIntentReady && event.clientY <= 0 && window.innerWidth >= 768) showPrompt();
    };
    document.addEventListener('mouseleave', exitIntent);
    return () => {
      window.clearTimeout(readinessTimer);
      window.clearTimeout(timer);
      document.removeEventListener('mouseleave', exitIntent);
    };
  }, []);

  const activeProducts = useMemo(() => {
    const category = productCategories.find(item => item.id === activeCategory);
    return category?.productIds.map(id => ebooks.find(product => product.id === id)).filter(Boolean) || [];
  }, [activeCategory]);

  const recommendedProducts = useMemo(() => {
    if (!recommendation) return [];
    return recommendation.productIds.map(id => ebooks.find(product => product.id === id)).filter(Boolean);
  }, [recommendation]);

  const selectStage = (stage) => {
    setSelectedStage(stage.id);
    setActiveCategory(stage.category);
    setHighlightedProductId(stage.productId);
    trackEvent('patient_stage_selected', { interest: stage.id, recommended_product: stage.productId });
    window.setTimeout(() => {
      const product = document.querySelector(`#fst-product-${stage.productId}`);
      product?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      product?.focus({ preventScroll: true });
    }, 100);
  };

  const chooseRecommendation = (option) => {
    setRecommendation(option);
    setActiveCategory(option.category);
    trackEvent('recommendation_completed', { recommendation: option.id });
  };

  const scrollTo = (selector) => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <FstHeader />

      <main>
        <section id="fst-inicio" className="relative isolate overflow-hidden bg-[#FFF9F4] pt-10 md:pt-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F5DCE8]/60 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#EAE2F8]/60 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#e5dceb] bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9274C9] shadow-sm">
                <Icon name="heart" className="h-4 w-4" /> Acompañamiento HealthTech para tu tiroides
              </p>
              <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] text-[#0A2540] sm:text-5xl lg:text-6xl">
                Vivir sin tiroides también se aprende
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Información, herramientas y acompañamiento para ayudarte a organizar tu tratamiento, tus hábitos y tu seguimiento.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/fst-app" onClick={() => trackEvent('hero_cta_click', { cta: 'crear_cuenta' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#123b5f]">
                  Crear mi cuenta <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link to="/fst-app" onClick={() => trackEvent('hero_cta_click', { cta: 'iniciar_sesion' })} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#2CB1A1] bg-white px-6 py-3 text-sm font-bold text-[#0A655D] hover:bg-[#effaf8]">
                  Iniciar sesión
                </Link>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#0A2540]">
                <Link to="/fst-app" onClick={() => trackEvent('hero_cta_click', { cta: 'google' })} className="inline-flex items-center gap-2 rounded-xl border border-[#e5dceb] bg-white px-4 py-2.5 text-sm font-bold text-[#0A2540] shadow-sm hover:bg-[#faf8fd]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
                  </svg>
                  Continuar con Google
                </Link>
              </p>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500">
                Organiza tu información y haz seguimiento desde un espacio personal y privado.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#F5DCE8]" aria-hidden="true" />
              <div className="absolute -bottom-6 -right-4 h-28 w-28 rounded-full bg-[#EAE2F8]" aria-hidden="true" />
              <DashboardMockup />
            </div>
          </div>
        </section>

        <section id="fst-app-preview" className="scroll-mt-24 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="NutriFST IA" title="Tu asistente nutricional inteligente" description="Pregunta sobre alimentos, sube fotos de tus platos y etiquetas, genera menús y cocina con lo que tienes. Respuestas claras, visuales y con evidencia verificable." centered />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <NutriFstMockup />
              <div className="space-y-4">
                {[
                  ['¿Puedo comer esto?', 'Revisa cualquier alimento o bebida y su relación con la levotiroxina, los suplementos y la dieta baja en yodo.'],
                  ['Escáner de comidas', 'Sube una foto de tu plato: la IA identifica tentativamente los alimentos, tú confirmas y ves el desglose estimado.'],
                  ['Menús con IA', 'Desayuno, almuerzo, cena y snack según tu objetivo, país, presupuesto y tiempo. Cada comida se puede cambiar.'],
                  ['Cocina con lo que tengo', 'Escribe tus ingredientes y recibe opciones que los aprovechan, con preparación paso a paso.'],
                ].map(([title, text]) => (
                  <div key={title} className="flex items-start gap-4 rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-sm">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Icon name="sparkles" className="h-5 w-5" /></span>
                    <div>
                      <h3 className="font-semibold text-[#0A2540]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
                <Link to="/fst-app" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0A2540] px-6 text-sm font-bold text-white hover:bg-[#123b5f]">
                  Probar NutriFST IA <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#faf8fd] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Tu espacio personal" title="Todo en un solo lugar" description="Una aplicación de acompañamiento para organizar tu tratamiento, tu alimentación y tus hábitos sin sentirte abrumada." centered />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['sparkles', 'NutriFST IA', 'Pregunta, escanea y genera menús con evidencia.'],
                ['pill', 'Mi medicamento', 'Registra tu levotiroxina y revisa interacciones.'],
                ['leaf', 'Mi alimentación', 'Escanea comidas y cocina con lo que tienes.'],
                ['heart', 'Mis síntomas', 'Observa tendencias sin culpa ni juicios.'],
                ['book', 'Mis menús', 'Planes semanales adaptados a tu realidad.'],
                ['chart', 'Mi progreso', 'Registros y tendencias para tu consulta.'],
                ['users', 'Mis recursos', 'Guías y educación creadas por una química farmacéutica.'],
              ].map(([icon, title, text]) => (
                <div key={title} className="rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-sm transition hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Icon name={icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-semibold text-[#0A2540]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-[#0A2540] bg-[#0A2540] p-5 text-white shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white"><Icon name="arrowRight" className="h-5 w-5" /></span>
                <h3 className="mt-3 font-semibold">Empieza hoy</h3>
                <p className="mt-1 text-sm leading-6 text-white/70">Crea tu cuenta y descubre tu espacio personal.</p>
                <Link to="/fst-app" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white underline underline-offset-4">Crear mi cuenta</Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Compromisos de confianza" className="border-y border-[#ece5f1] bg-[#faf8fc]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              ['award', 'Creado por una química farmacéutica'],
              ['book', 'Lenguaje claro y comprensible'],
              ['users', 'Recursos para diferentes etapas'],
              ['shield', 'Contenido educativo basado en evidencia'],
            ].map(([icon, text]) => (
              <div key={text} className="flex min-h-24 items-center gap-3 border-[#e5dceb] p-4 md:border-r">
                <Icon name={icon} className="h-6 w-6 shrink-0 text-[#76539a]" />
                <p className="text-sm font-semibold leading-5 text-[#132e55]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-20" aria-label="Etapa de salud tiroidea">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Tu punto de partida" title="¿En qué etapa de tu proceso te encuentras?" description="Selecciona la opción más cercana a tu situación. No te estamos diagnosticando: solo usaremos esta elección para mostrarte recursos educativos más relevantes." centered />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {patientStages.map(stage => {
                const selected = selectedStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectStage(stage)}
                    className={`flex min-h-24 items-center gap-4 rounded-lg border p-4 text-left transition-colors ${selected ? 'border-[#76539a] bg-[#f2ebf7] text-[#452b65]' : 'border-gray-200 bg-white text-[#132e55] hover:border-[#bda7d2] hover:bg-[#faf8fc]'}`}
                  >
                    <Icon name={stage.icon} className="h-7 w-7 shrink-0 text-[#0f766e]" />
                    <span className="text-sm font-semibold leading-5">{stage.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-6 text-center text-sm leading-6 text-gray-600">Al elegir una etapa te llevaremos a la ficha del recurso educativo más relacionado. Tu preferencia solo se guardará si completas y autorizas el formulario.</p>
          </div>
        </section>

        <section id="fst-recursos" className="scroll-mt-24 bg-[#f5f0f7] py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <ResourceMockup />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#76539a]">Empieza con una ayuda concreta</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#132e55] md:text-4xl">Guía gratuita: cómo tomar la levotiroxina correctamente</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">Recibe una guía breve para revisar horarios, alimentos, suplementos y hábitos que conviene conversar con tu profesional tratante. No incluye cambios de dosis ni reemplaza indicaciones médicas.</p>
              <ul className="my-6 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                {['Horarios e interacciones claros', 'Hoja de preparación de consulta', 'Lenguaje sencillo', 'Acceso inmediato por correo'].map(item => (
                  <li key={item} className="flex items-center gap-2"><Icon name="checkCircle" className="h-5 w-5 text-[#0f766e]" /> {item}</li>
                ))}
              </ul>
              <FstLeadForm selectedInterest={selectedStage} recommendation={recommendation?.id || ''} />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Empieza por aquí" title="Tres pasos para elegir sin sentirte abrumada" description="Una ruta breve para pasar de la duda a un siguiente paso educativo y responsable." centered />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ['1', 'Identifica tu necesidad', 'Elige el tema que hoy te genera más preguntas.'],
                ['2', 'Descarga una base clara', 'Empieza con la guía y organiza lo que ya sabes.'],
                ['3', 'Profundiza con criterio', 'Selecciona una guía o curso según tu etapa.'],
              ].map(([number, title, copy]) => (
                <div key={number} className="border-t-2 border-[#76539a] px-1 pt-5">
                  <span className="text-sm font-bold text-[#76539a]">Paso {number}</span>
                  <h3 className="mt-2 text-xl font-semibold text-[#132e55]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-lg border border-[#ded2e8] bg-[#faf8fc] p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-[#132e55]">¿Qué necesitas comprender mejor?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">El recomendador no diagnostica. Solo relaciona tu elección con uno o dos recursos educativos.</p>
              <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Temas del recomendador">
                {recommendationOptions.map(option => (
                  <button key={option.id} type="button" onClick={() => chooseRecommendation(option)} aria-pressed={recommendation?.id === option.id} className={`min-h-11 shrink-0 rounded-md border px-4 text-sm font-semibold ${recommendation?.id === option.id ? 'border-[#563a78] bg-[#563a78] text-white' : 'border-[#bda7d2] bg-white text-[#563a78] hover:bg-[#f2ebf7]'}`}>
                    {option.label}
                  </button>
                ))}
              </div>
              {recommendedProducts.length > 0 && (
                <div className="mt-6 border-t border-[#e5dceb] pt-5">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#0f766e]">Tu ruta sugerida</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {recommendedProducts.map(product => (
                      <button key={product.id} type="button" onClick={() => scrollTo('#fst-guias')} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 text-left hover:border-[#9f83ba]">
                        <span>
                          <span className="block text-sm font-semibold text-[#132e55]">{product.name}</span>
                          <span className="mt-1 block text-xs text-gray-500">{productDetails[product.id]?.format}</span>
                        </span>
                        <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-[#76539a]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="fst-guias" className="scroll-mt-24 bg-[#f8fafc] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Guías, diarios y recursos" title="Elige según lo que necesitas comprender o gestionar" description="Todos los productos conservan sus enlaces reales. Cada ficha explica para quién es, qué problema ayuda a organizar, qué incluye y en qué formato se entrega." centered />
            <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-4" role="tablist" aria-label="Categorías de recursos">
              {productCategories.map(category => (
                <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} onClick={() => setActiveCategory(category.id)} className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-semibold ${activeCategory === category.id ? 'bg-[#563a78] text-white' : 'border border-gray-300 bg-white text-gray-700 hover:border-[#9f83ba]'}`}>
                  {category.label}
                </button>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-gray-600">{productCategories.find(category => category.id === activeCategory)?.description}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeProducts.map(product => <EbookCard key={product.id} ebook={product} details={productDetails[product.id]} recommended={highlightedProductId === product.id} />)}
            </div>
          </div>
        </section>

        <section id="fst-cursos" className="scroll-mt-24 bg-[#132e55] py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading dark eyebrow="Cursos y acompañamiento educativo" title="Aprende a tu ritmo y prepara mejores conversaciones con tu equipo de salud" description="La academia y los recursos de Feliz Sin Tiroides enseñan organización, adherencia y autocuidado. No ofrecen diagnóstico ni sustituyen endocrinología, oncología, nutrición clínica o psicología." />
            <div className="grid gap-6 md:grid-cols-3">
              <div className="border-t border-white/30 pt-5">
                <Icon name="book" className="h-7 w-7 text-[#d8c5e8]" />
                <h3 className="mt-4 text-xl font-semibold">Curso de autocuidado tiroideo</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">Una ruta práctica sobre hábitos, adherencia y preparación de consultas.</p>
                <Link to="/academia/curso/autocuidado-de-la-tiroides" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">Entrar al curso gratuito <Icon name="arrowRight" className="h-4 w-4" /></Link>
              </div>
              <div className="border-t border-white/30 pt-5">
                <Icon name="cap" className="h-7 w-7 text-[#d8c5e8]" />
                <h3 className="mt-4 text-xl font-semibold">Academia virtual</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">Accede a clases y materiales organizados desde cualquier dispositivo.</p>
                <Link to="/academia" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">Explorar la academia <Icon name="arrowRight" className="h-4 w-4" /></Link>
              </div>
              <div className="border-t border-white/30 pt-5">
                <Icon name="users" className="h-7 w-7 text-[#d8c5e8]" />
                <h3 className="mt-4 text-xl font-semibold">Orientación para elegir</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">Cuéntanos qué tema necesitas comprender y te orientaremos hacia el recurso más adecuado.</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'courses' })} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">Escribir por WhatsApp <Icon name="arrowRight" className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="fst-karla" className="scroll-mt-24 bg-white py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div className="overflow-hidden rounded-lg bg-[#f2ebf7]">
              <img src="/img/karla-real.jpg" alt="Karla Hernández, química farmacéutica y fundadora de Feliz Sin Tiroides" width="800" height="1000" loading="lazy" className="aspect-[4/5] h-full w-full object-cover" />
            </div>
            <div>
              <SectionHeading eyebrow="Sobre Karla Hernández" title="Educación farmacéutica creada desde la ciencia y la experiencia real" />
              <div className="space-y-4 text-base leading-7 text-gray-600">
                <p>Karla Hernández es química farmacéutica, creadora de Feliz Sin Tiroides y paciente que ha vivido un proceso de cáncer de tiroides y tiroidectomía.</p>
                <p>Su enfoque es traducir información compleja sobre medicamentos, adherencia y autocuidado a un lenguaje que las personas puedan comprender y usar para preparar mejores preguntas.</p>
                <p>Feliz Sin Tiroides nace de una necesidad real: contar con educación serena, organizada y responsable durante un proceso que suele sentirse confuso.</p>
              </div>
              <div className="mt-6 rounded-lg border-l-4 border-[#76539a] bg-[#faf8fc] p-5">
                <p className="text-sm leading-6 text-gray-700"><strong className="text-[#132e55]">Límite profesional:</strong> Karla no se presenta como médica endocrinóloga. Los recursos no diagnostican, no prescriben y no indican cambios de dosis; complementan la conversación con el equipo tratante.</p>
              </div>
              <a href="#fst-recursos" onClick={event => { event.preventDefault(); scrollTo('#fst-recursos'); }} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#563a78] px-5 text-sm font-semibold text-white hover:bg-[#452b65]">Empezar con el recurso gratuito <Icon name="arrowRight" className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0f7] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Cómo trabajamos" title="Compromisos que puedes verificar en nuestros contenidos" description="Mientras recopilamos testimonios con autorización expresa, preferimos mostrarte el método y los límites de la marca." centered />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ethicalCommitments.map(([title, copy], index) => (
                <div key={title} className="border-t-2 border-[#76539a] bg-white p-5">
                  <span className="text-xs font-bold text-[#76539a]">0{index + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold text-[#132e55]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fst-preguntas" className="scroll-mt-24 bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Respuestas claras antes de elegir un recurso" centered />
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-1" onToggle={event => { if (event.currentTarget.open) trackEvent('faq_open', { question }); }}>
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-[#132e55]">
                    {question}
                    <Icon name="arrowDown" className="h-4 w-4 shrink-0 text-[#76539a] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-3xl pb-5 text-sm leading-7 text-gray-600">{answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-7 text-center">
              <a href="#fst-recursos" onClick={event => { event.preventDefault(); scrollTo('#fst-recursos'); }} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#563a78] underline underline-offset-4">Descargar la guía gratuita <Icon name="arrowRight" className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <ArticulosSection marca="fst" eyebrow="Lecturas educativas" title="Aprende sobre tu tiroides con información organizada" dark />

        <section className="bg-[#0f766e] py-16 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">No tienes que aprender a vivir con una condición tiroidea desde la confusión</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80">Empieza con información organizada, comprensible y creada para ayudarte a participar activamente en tu cuidado.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#fst-recursos" onClick={event => { event.preventDefault(); scrollTo('#fst-recursos'); }} className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#0f5e57]">Descargar la guía gratuita</a>
              <a href="#fst-guias" onClick={event => { event.preventDefault(); scrollTo('#fst-guias'); }} className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/50 px-6 text-sm font-semibold text-white hover:bg-white/10">Ver todos los recursos</a>
            </div>
          </div>
        </section>

        <BrandSwitch current="fst" />
      </main>

      <FstFooter />

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'floating' })} className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e] text-white shadow-lg hover:bg-[#0c655f]" aria-label="Orientación por WhatsApp">
        <Icon name="users" className="h-5 w-5" />
      </a>

      {leadPromptOpen && (
        <aside className="fixed bottom-20 right-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg border border-[#d7c8e5] bg-white p-5 shadow-2xl" aria-label="Invitación al recurso gratuito">
          <button type="button" onClick={() => setLeadPromptOpen(false)} className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100" aria-label="Cerrar invitación"><Icon name="close" className="h-4 w-4" /></button>
          <p className="text-xs font-bold uppercase tracking-widest text-[#76539a]">Antes de irte</p>
          <h2 className="mt-2 pr-8 text-xl font-semibold text-[#132e55]">Llévate la guía de levotiroxina</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">Es gratuito, educativo y te ayuda a preparar mejores preguntas para tu próxima consulta.</p>
          <button type="button" onClick={() => { setLeadPromptOpen(false); scrollTo('#fst-recursos'); }} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white">Quiero recibirlo</button>
        </aside>
      )}
    </div>
  );
}
