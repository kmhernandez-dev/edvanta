/**
 * ============================================================
 *  FelizSinTiroides.jsx — /feliz-sin-tiroides
 *
 *  Feliz Sin Tiroides es el programa de Edvanta para pacientes
 *  tiroideos: comunidad, ebooks, la guía gratis de levotiroxina y la
 *  atención farmacéutica. Lleva el encabezado y el pie de Edvanta con la
 *  barra del programa, y las piezas del sistema de diseño: la misma
 *  letra, los mismos botones y los mismos colores que el resto del sitio.
 *
 *  El orden es el de una visita: quién es la comunidad, qué se puede
 *  leer (ebooks), qué se lleva gratis (la guía), con quién hablar (la
 *  atención) y qué más hay en el programa.
 *
 *  Regla FST: venta solo por Hotmart (sin precio, sin carrito).
 * ============================================================
 */

import { useEffect, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChartLine, GraduationCap, Leaf, MessageCircle, Pill, Sparkles,
  UserRound, Users,
} from 'lucide-react';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import FstLeadForm from '../components/fst/FstLeadForm';
import { HeroPaciente } from '../components/edvanta/heroes';
import {
  ArrowLink, Breadcrumb, Btn, IconButton, NavCard, Section, SectionHeading,
} from '../components/edvanta/ui';
import { ebooks } from '../data/fst';
import { FST_COMMUNITY_URL, FST_COLECCION_HOTMART, waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { trackLeadEvent } from '../lib/leadEvents';
import { trackFstClick } from '../lib/fstClicks';

const WA_ATENCION = 'Hola Karla, quiero conocer la atención farmacéutica personalizada.';

const buyUrl = (e) => e.checkoutUrl || e.hotmartUrl || FST_COLECCION_HOTMART;

// Todo lo que tiene el programa, con su dirección real.
const EXPLORA = [
  { label: 'Guías y ebooks', href: '#ebooks', icon: BookOpen, desc: 'Descarga inmediata en PDF, escritas en lenguaje de paciente.' },
  { label: 'Atención farmacéutica', href: '#atencion', icon: Pill, desc: 'Acompañamiento uno a uno, 100 % virtual.' },
  { label: 'Comunidad', href: FST_COMMUNITY_URL, external: true, icon: Users, desc: 'Miles de pacientes que se cuidan en compañía.' },
  { label: 'Vida 360', to: '/vida-360', icon: ChartLine, desc: 'Organiza medicación, exámenes y síntomas en un solo lugar.' },
  { label: 'NutriFST', to: '/nutrifst', icon: Sparkles, desc: 'Resuelve tus dudas de alimentación tiroidea.' },
  { label: 'Recetas', to: '/recetas', icon: Leaf, desc: 'Recetas pensadas para tu tiroides.' },
  { label: 'Academia', to: '/academia', icon: GraduationCap, desc: 'Cursos y formación en salud tiroidea.' },
  { label: 'Mi espacio', to: '/fst-app?modo=registro', icon: UserRound, desc: 'Crea tu cuenta y entra a tu espacio personal.' },
];

const BENEFICIOS = [
  'Organiza tus medicamentos y suplementos y aprende cuándo y cómo tomarlos sin tantas dudas.',
  'Entiende qué comer y qué evitar, sin perderte entre consejos contradictorios de redes sociales.',
  'Comprende mejor tus síntomas y tus resultados, para saber qué observar y qué preguntar en tus controles.',
  'Convierte la información que consumes en un plan claro para ti, con acompañamiento profesional.',
];

const VALORACION = [
  ['Duración', '45 minutos'],
  ['Modalidad', 'Videollamada'],
  ['Incluye', 'Informe escrito'],
  ['Contacto', 'WhatsApp directo'],
];

const enHotmart = { target: '_blank', rel: 'noopener noreferrer sponsored' };

function EbookCard({ e, onComprar }) {
  return (
    <article className="ebook ds-card ds-card--interactive flex w-[80%] shrink-0 snap-start flex-col overflow-hidden sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]">
      <div className="aspect-[16/11] overflow-hidden bg-edvanta-lilac">
        {e.cover?.image && <img src={e.cover.image} alt={e.name} width="800" height="550" loading="lazy" decoding="async" className="h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {e.tag && <span className="ds-chip ds-chip--violet mb-3 self-start">{e.tag}</span>}
        <h3 className="font-display text-lg font-extrabold leading-snug text-edvanta-deep">{e.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{e.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-edvanta-subtle">PDF · Hotmart</span>
          <Btn href={buyUrl(e)} {...enHotmart} size="sm" onClick={() => onComprar(e)}>Ver más</Btn>
        </div>
      </div>
    </article>
  );
}

export default function FelizSinTiroides() {
  const carruselRef = useRef(null);

  useEffect(() => {
    updatePageSeo({
      title: 'Feliz Sin Tiroides | Comunidad, ebooks y atención farmacéutica para pacientes tiroideos',
      description: 'La comunidad de pacientes tiroideos de habla hispana. Ebooks prácticos y atención farmacéutica personalizada con enfoque biopsicosocial.',
      canonical: 'https://edvanta.co/feliz-sin-tiroides',
      jsonLdId: 'feliz-sin-tiroides',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Feliz Sin Tiroides', url: 'https://edvanta.co/feliz-sin-tiroides' },
    });
  }, []);

  const scrollCarrusel = (dir) => {
    const el = carruselRef.current;
    if (!el) return;
    const card = el.querySelector('.ebook');
    const step = card ? card.getBoundingClientRect().width + 20 : 300;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const coleccion = ebooks.find((e) => e.featured);
  const restantes = ebooks.filter((e) => e !== coleccion && (e.checkoutUrl || e.hotmartUrl));
  const catalogo = [coleccion, ...restantes].filter(Boolean);

  const onComprar = (e) => {
    trackEvent('fst_ebook_click', { id: e.id });
    trackLeadEvent('hotmart_clicked', { productId: e.id, resourceName: e.name });
    trackFstClick({ section: 'coleccion', element: `cta_${e.id}`, label: e.name, destination: buyUrl(e) });
  };

  const alUnirse = (origen) => () => {
    trackEvent('fst_hero_click', { cta: 'comunidad' });
    trackLeadEvent('community_clicked', { source: origen });
    trackFstClick({ section: 'comunidad', element: 'cta_unirme', label: 'Unirme a la comunidad', destination: FST_COMMUNITY_URL });
  };

  return (
    <div className="min-h-screen bg-white">
      <FstHeader />
      <main>
        <HeroPaciente
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Para pacientes', to: '/pacientes' }, { label: 'Feliz Sin Tiroides' }]} className="mb-8" />}
          eyebrow="Feliz Sin Tiroides"
          title="Únete a la comunidad de pacientes tiroideos más grande de habla hispana"
          highlight="pacientes tiroideos"
          lead="Información clara, ebooks prácticos y acompañamiento profesional para que entiendas tu tiroides y tomes decisiones con seguridad."
          image="/img/fst-hero-profesional.jpg"
          imageAlt="Atención farmacéutica profesional — Feliz Sin Tiroides"
          note={{ title: 'Hecho por una química farmacéutica', text: 'que también vive sin tiroides.' }}
          actions={(
            <>
              <Btn href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" variant="teal" size="lg" icon={Users} onClick={alUnirse('hero')}>
                Unirme a la comunidad
              </Btn>
              <Btn href="#ebooks" variant="secondary" size="lg">Explorar contenido</Btn>
            </>
          )}
        />

        {/* La comunidad */}
        <Section id="comunidad" tone="white" bordered compact>
          <p className="mx-auto max-w-3xl text-center font-display text-xl font-bold leading-snug text-edvanta-deep sm:text-2xl">
            Más de <span className="text-edvanta-tealdark">10.000 pacientes</span> cuidan su salud tiroidea con FST Tiroides Care
          </p>
        </Section>

        {/* Ebooks */}
        <Section id="ebooks" tone="ice">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeading
              eyebrow="Productos digitales"
              title="Ebooks para cuidar tu tiroides"
              desc="Descarga inmediata en PDF, escritos en lenguaje de paciente y con enfoque responsable."
            />
            <div className="hidden gap-2 sm:flex">
              <IconButton icon={ArrowLeft} label="Ver ebooks anteriores" variant="secondary" onClick={() => scrollCarrusel(-1)} />
              <IconButton icon={ArrowRight} label="Ver más ebooks" variant="secondary" onClick={() => scrollCarrusel(1)} />
            </div>
          </div>

          <div
            ref={carruselRef}
            className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {catalogo.map((e) => <EbookCard key={e.id} e={e} onComprar={onComprar} />)}
          </div>

          <div className="mt-6 text-center">
            <Btn
              href={FST_COLECCION_HOTMART}
              {...enHotmart}
              variant="secondary"
              iconRight={ArrowRight}
              onClick={() => {
                trackEvent('fst_ebook_click', { id: 'coleccion' });
                trackLeadEvent('hotmart_clicked', { productId: 'fst-coleccion-sana', resourceName: 'Colección Sana tu Tiroides' });
                trackFstClick({ section: 'coleccion', element: 'cta_coleccion_completa', label: 'Ver la Colección completa', destination: FST_COLECCION_HOTMART });
              }}
            >
              Ver la Colección completa
            </Btn>
          </div>
        </Section>

        {/* Guía gratis (captación) */}
        <Section id="guia-gratis" tone="aqua">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="lg:pt-4">
              <SectionHeading
                eyebrow="Recurso gratuito"
                tone="teal"
                title="Tu guía de levotiroxina, sin costo"
                desc="Horarios, alimentos e interacciones en lenguaje claro, para que tu tratamiento por fin funcione. Escrita por una Química Farmacéutica que también vive sin tiroides."
              />
              <ul className="mt-6 flex flex-wrap gap-2">
                {['Horarios', 'Alimentos', 'Interacciones', 'PDF gratis'].map((t) => (
                  <li key={t} className="ds-chip ds-chip--teal">{t}</li>
                ))}
              </ul>
              <ArrowLink to="/recurso/levotiroxina" className="mt-6">Conoce la guía por dentro</ArrowLink>
            </div>
            <div className="ds-card p-5 sm:p-7">
              <FstLeadForm compact />
            </div>
          </div>
        </Section>

        {/* Atención farmacéutica */}
        <Section id="atencion" tone="lavender">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Servicio uno a uno"
                tone="violet"
                title="Atención farmacéutica personalizada"
                desc="Medicación, alimentación y bienestar emocional, en una sola conversación."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="ds-chip ds-chip--violet">Enfoque biopsicosocial</span>
                <span className="ds-chip ds-chip--violet">100 % virtual</span>
              </div>
              <ul className="mt-8 grid gap-5">
                {BENEFICIOS.map((b) => (
                  <li key={b} className="flex items-start gap-3.5">
                    <span className="ds-icon-tile ds-icon-tile--teal h-8 w-8 shrink-0 rounded-full"><Check className="h-4 w-4" aria-hidden="true" /></span>
                    <p className="text-[15px] leading-7 text-edvanta-deep">{b}</p>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="ds-card relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: 'var(--ds-grad-brand)' }} aria-hidden="true" />
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Valoración inicial</h3>
              <p className="mt-1 text-sm leading-6 text-edvanta-muted">Una videollamada conmigo para revisar tu caso completo.</p>
              <dl className="mt-5 divide-y divide-edvanta-border">
                {VALORACION.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3.5 text-[15px]">
                    <dt className="text-edvanta-muted">{k}</dt>
                    <dd className="text-right font-semibold text-edvanta-deep">{v}</dd>
                  </div>
                ))}
              </dl>
              <Btn
                href={waLink(WA_ATENCION)}
                target="_blank"
                rel="noopener noreferrer"
                variant="teal"
                block
                icon={MessageCircle}
                className="mt-6"
                onClick={() => {
                  trackEvent('fst_atencion_click');
                  trackLeadEvent('pharmaceutical_service_clicked', { source: 'landing' });
                  trackFstClick({ section: 'servicios', element: 'cta_atencion', label: 'Conocer atención farmacéutica', destination: waLink(WA_ATENCION) });
                }}
              >
                Conocer la atención farmacéutica
              </Btn>
              <p className="mt-3 text-center text-xs text-edvanta-subtle">No sustituye la consulta con tu médico tratante.</p>
            </aside>
          </div>
        </Section>

        {/* Todo el programa */}
        <Section tone="white">
          <SectionHeading
            eyebrow="Todo en un lugar"
            title="Explora Feliz Sin Tiroides"
            desc="Guías, herramientas, comunidad y tu espacio personal para acompañar tu proceso."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORA.map((item, i) => (
              <NavCard
                key={item.label}
                to={item.to}
                href={item.href}
                external={item.external}
                icon={item.icon}
                tone={i % 2 ? 'violet' : 'teal'}
                title={item.label}
                desc={item.desc}
                cta={item.external ? 'Unirme' : 'Entrar'}
                onClick={item.external ? alUnirse('explora') : undefined}
              />
            ))}
          </div>
        </Section>
      </main>
      <FstFooter />
    </div>
  );
}
