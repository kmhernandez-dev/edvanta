/**
 * ============================================================
 *  /hoja-de-vida — Landing de la herramienta de hoja de vida
 *
 *  Solo explica y muestra: qué hace, los diez diseños, qué revisa
 *  y las dudas frecuentes. La herramienta vive sola en
 *  /hoja-de-vida/crear; cada botón de esta página lleva allí (con
 *  el diseño elegido, si la persona tocó uno).
 * ============================================================
 */

import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheck, FileUp, Gauge, LayoutTemplate, Mail, PenLine, Search, ShieldCheck, Sparkles, Target, Wand2,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { MuestraPlantillas } from '../components/empleo/plantillasUi';
import { AnilloPuntaje, NIVELES } from '../components/empleo/hv/Revision';
import {
  ArrowLink, Breadcrumb, Btn, Card, CtaBanner, Faq, Section, SectionHeading, Steps, TituloConAcento,
} from '../components/edvanta/ui';
import { PLANTILLAS } from '../lib/cv/catalogo';
import { ejemploCv } from '../lib/cv/ejemplo';
import { revisionDelEditor } from '../lib/cv/revision';
import { updatePageSeo } from '../utils/seo';

const CREAR = '/hoja-de-vida/crear';

const PASOS = [
  { icon: FileUp, title: 'Sube la que tienes o empieza', desc: 'PDF o Word. La leemos y ordenamos tus datos; si prefieres, la armas desde cero.' },
  { icon: PenLine, title: 'Corrige con ayuda', desc: 'Cinco pasos cortos, ejemplos de logros para tu cargo y el puntaje ATS mientras escribes.' },
  { icon: LayoutTemplate, title: 'Elige el diseño y descarga', desc: 'Diez diseños tamaño carta. El PDF sale con texto real, listo para postular.' },
];

const QUE_REVISA = [
  { icon: Gauge, title: 'Puntaje de compatibilidad', desc: 'Una nota de 0 a 100 con seis categorías: estructura, contacto, logros, palabras clave, formato y redacción.' },
  { icon: Target, title: 'Palabras clave del cargo', desc: 'Compara tu hoja de vida con el cargo al que te postulas y te muestra los términos que faltan.' },
  { icon: Wand2, title: 'Frases para reescribir', desc: 'Encuentra las funciones sin resultado («apoyé procesos») y te propone cómo escribirlas como logros.' },
  { icon: Sparkles, title: 'Lectura con IA', desc: 'La revisión a fondo lee tu hoja como un reclutador del sector salud y farmacéutico, frase por frase.' },
];

const ERRORES = [
  'Tablas y cuadros de texto: los filtros leen el contenido desordenado.',
  'Cédula, edad y estado civil: ocupan espacio y no suman.',
  'Funciones sin resultado: «apoyé procesos» no dice qué lograste.',
  'PDF escaneado como imagen: el sistema no puede leer el texto.',
  'La misma hoja para todas las vacantes, sin las palabras del cargo.',
];

const FAQS = [
  { q: '¿Puedo usar la hoja de vida que ya tengo?', a: 'Sí. Súbela en PDF o en Word (.docx): leemos tus datos, los ponemos en el editor con un diseño nuevo y te mostramos su puntaje. Solo revisas, corriges y descargas.' },
  { q: '¿Qué es un ATS y por qué importa?', a: 'Es el sistema que usan las empresas para recibir y filtrar hojas de vida. Si el archivo no se puede leer bien o no tiene las palabras del cargo, no llega a una persona. Por eso el formato importa tanto como el contenido.' },
  { q: '¿Mis datos se guardan?', a: 'Mientras editas, la hoja de vida se guarda en tu navegador. Si inicias sesión, también en tu cuenta, para retomarla desde otro dispositivo. Para la revisión con IA enviamos solo el texto y no lo guardamos.' },
  { q: '¿Qué diseño elijo?', a: 'Para portales con filtros estrictos, Tradicional ATS o cualquiera de una sola columna (Clásico, Funcional, Línea de tiempo, Ejecutivo). Los de dos columnas también salen con texto real y en orden de lectura.' },
  { q: '¿Cuántas páginas debe tener?', a: 'Una página si tienes menos de diez años de experiencia; dos como máximo. Si el contenido no cabe, el diseño continúa en otra página sin cortar nada.' },
  { q: '¿Tiene costo?', a: 'No. Crear, revisar y descargar tu hoja de vida es gratis.' },
];

/**
 * Antes y después, dibujado: la hoja de vida con tablas y foto (lo que los
 * filtros leen mal) frente a una con secciones claras. Es un esquema.
 */
function AntesYDespues() {
  const linea = (w, tono = 'bg-[#DDE4EF]') => <span className={`block h-1.5 rounded-full ${tono}`} style={{ width: w }} />;
  return (
    <figure className="grid grid-cols-2 gap-4" aria-label="Comparación esquemática: hoja de vida con tablas y datos personales, frente a una hoja de vida con secciones ordenadas">
      <div className="relative rounded-[var(--ds-r-lg)] border border-edvanta-violet/30 bg-white p-3.5 shadow-[var(--ds-sh-sm)]" aria-hidden="true">
        <span className="ds-chip ds-chip--violet mb-3">Antes</span>
        <div className="flex gap-2">
          <span className="h-10 w-10 shrink-0 rounded-lg bg-[#DDE4EF]" />
          <div className="flex-1 space-y-1.5 pt-1">{linea('80%', 'bg-[#C9D4E6]')}{linea('55%')}</div>
        </div>
        <div className="mt-3 grid grid-cols-[38%_1fr] gap-2">
          <div className="space-y-1.5 rounded-md bg-[#F2F5FA] p-1.5">{linea('90%')}{linea('70%')}{linea('85%')}{linea('60%')}</div>
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-1">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className="h-3 rounded-sm border border-[#DDE4EF]" />)}</div>
            {linea('95%')}{linea('80%')}{linea('88%')}
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-[10px] font-semibold text-[#5E51A8]">
          <li>· Tablas y cuadros</li><li>· Datos personales</li>
        </ul>
      </div>
      <div className="relative rounded-[var(--ds-r-lg)] border border-edvanta-teal/40 bg-white p-3.5 shadow-[var(--ds-sh-md)]" aria-hidden="true">
        <span className="ds-chip ds-chip--teal mb-3">Después</span>
        <div className="space-y-1.5">{linea('70%', 'bg-edvanta-blue/70')}{linea('45%')}</div>
        {['Perfil', 'Experiencia', 'Formación', 'Habilidades'].map((s) => (
          <div key={s} className="mt-2.5">
            <span className="block text-[10px] font-extrabold uppercase tracking-wide text-edvanta-tealdark">{s}</span>
            <div className="mt-1 space-y-1">{linea('95%')}{linea('78%')}</div>
          </div>
        ))}
        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-edvanta-tealdark"><BadgeCheck className="h-3.5 w-3.5" />Formato ATS</span>
      </div>
    </figure>
  );
}

/** Portada: la foto, una hoja de vida real dibujada encima y su puntaje. */
function Portada() {
  // El puntaje del ejemplo se calcula con el mismo analizador de la herramienta.
  const muestra = useMemo(() => revisionDelEditor(ejemploCv(), 'Analista de control de calidad'), []);
  const tono = NIVELES[muestra.nivel] || NIVELES.alto;

  return (
    <section className="relative overflow-hidden ds-surface-diagonal">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-edvanta-violet/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 left-[-8rem] h-96 w-96 rounded-full bg-edvanta-teal/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-12">
        <div className="ds-rise">
          <Breadcrumb className="mb-7" items={[{ label: 'Empleo', to: '/empleo' }, { label: 'Hoja de vida' }]} />
          <span className="ds-chip ds-chip--teal"><BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Hoja de vida ATS · gratis</span>
          <h1 className="mt-5 font-display text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-edvanta-deep sm:text-5xl lg:text-[3.4rem]">
            <TituloConAcento title="Tu hoja de vida, lista para pasar los filtros" highlight="pasar los filtros" />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-edvanta-muted">
            Sube la que ya tienes en PDF o Word y la pasamos a un diseño nuevo en segundos, o créala desde cero con ayuda en cada paso.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn to={CREAR} size="lg" icon={Sparkles}>Crear mi hoja de vida</Btn>
            <Btn href="#disenos" size="lg" variant="secondary" icon={LayoutTemplate}>Elige cómo se ve</Btn>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-edvanta-muted">
            {['Sin crear cuenta', '10 diseños tamaño carta', 'PDF con texto real'].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-edvanta-teal" aria-hidden="true" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl pb-10 lg:max-w-none ds-rise-2">
          <div className="ds-photo aspect-[4/3]">
            <img
              src="/img/empleo/escribiendo-correo-postulacion.webp"
              alt="Química farmacéutica trabajando en su hoja de vida en el computador"
              width="1448"
              height="1086"
              className="h-full w-full object-cover"
              fetchpriority="high"
            />
          </div>
          {/* La hoja de vida de ejemplo, dibujada con el diseño Corporativo */}
          <Link
            to={`${CREAR}?diseno=corporativo`}
            className="ds-float block absolute -bottom-2 right-3 w-[42%] max-w-[15rem] rounded-xl bg-white p-1.5 text-left shadow-[var(--ds-sh-lg)] ring-1 ring-black/5 sm:right-6"
            aria-label="Empezar con el diseño Corporativo"
          >
            <MuestraPlantillas ids={['corporativo']} ancho={240} rejilla="grid-cols-1" escalonar={false} sinNombre />
          </Link>
          <div className="absolute left-3 top-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-4 shadow-[var(--ds-sh-md)] ring-1 ring-black/5 backdrop-blur sm:-left-6 sm:top-8">
            <AnilloPuntaje puntaje={muestra.puntaje} nivel={muestra.nivel} tam={48} />
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-subtle">Puntaje ATS del ejemplo</span>
              <span className={`ds-chip mt-0.5 ${tono.fondo}`}>{tono.texto}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HojaDeVida() {
  const navegar = useNavigate();
  useEffect(() => {
    updatePageSeo({
      title: 'Hoja de vida ATS para el sector salud y farmacéutico | Edvanta',
      description: 'Sube tu hoja de vida en PDF o Word y pásala a un diseño nuevo, o créala desde cero. Diez diseños, puntaje ATS, palabras clave del cargo y descarga en PDF.',
      canonical: 'https://edvanta.co/hoja-de-vida',
      keywords: ['hoja de vida ATS', 'crear hoja de vida', 'plantillas de hoja de vida', 'hoja de vida químico farmacéutico', 'mejorar hoja de vida'],
      jsonLdId: 'hoja-de-vida',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Hoja de vida ATS de Edvanta',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://edvanta.co/hoja-de-vida/crear',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
      },
    });
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <Portada />

        <Section tone="surface" bordered compact>
          <SectionHeading eyebrow="Cómo funciona" title="Tres pasos y la tienes lista" align="center" />
          <Steps className="mt-10" items={PASOS} />
        </Section>

        {/* Diseños */}
        <Section id="disenos">
          <SectionHeading
            eyebrow="Diez diseños"
            title="Elige cómo se ve tu hoja de vida"
            desc="Todos son tamaño carta y salen con texto real, así los filtros automáticos los leen completos. Toca uno para empezar con ese diseño."
            align="center"
          />
          <MuestraPlantillas
            className="mt-12"
            ids={PLANTILLAS.map((p) => p.id)}
            ancho={260}
            rejilla="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            escalonar={false}
            conDescripcion
            onElegir={(id) => navegar(`${CREAR}?diseno=${id}`)}
          />
          <div className="mt-12 flex justify-center">
            <Btn to={CREAR} size="lg" icon={Sparkles}>Crear mi hoja de vida</Btn>
          </div>
        </Section>

        {/* Qué revisa */}
        <Section tone="surface" bordered>
          <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="ds-photo mx-auto aspect-[4/5] max-w-md lg:max-w-none">
              <img src="/img/empresas/seleccion-revisando-perfiles.webp" alt="Equipo de selección revisando perfiles de candidatos en el computador" width="1086" height="1448" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="mt-10 lg:mt-0">
              <SectionHeading eyebrow="El analizador" title="Lo que mira un reclutador, antes de que lo mire" desc="Mientras armas tu hoja de vida, la herramienta la califica como lo haría un filtro ATS y te dice qué cambiar primero." />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {QUE_REVISA.map((q, i) => (
                  <Card key={q.title} className="p-5">
                    <span className={`ds-icon-tile h-11 w-11 items-center justify-center rounded-xl ${i % 2 ? 'ds-icon-tile--violet' : 'ds-icon-tile--teal'}`} aria-hidden="true">
                      <q.icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <p className="mt-3 text-base font-bold text-edvanta-deep">{q.title}</p>
                    <p className="mt-1 text-sm leading-6 text-edvanta-muted">{q.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Errores */}
        <Section>
          <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:items-center">
            <div>
              <SectionHeading eyebrow="Evítalos" title="Errores que dejan tu hoja de vida fuera" />
              <ul className="mt-7 space-y-3.5">
                {ERRORES.map((e) => (
                  <li key={e} className="flex items-start gap-3 text-[15px] leading-7 text-edvanta-deep">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {e}
                  </li>
                ))}
              </ul>
              <Btn to={CREAR} variant="secondary" icon={FileUp} className="mt-8">Subir mi hoja de vida y revisarla</Btn>
            </div>
            <div className="mt-10 lg:mt-0"><AntesYDespues /></div>
          </div>
        </Section>

        {/* Después */}
        <Section tone="surface" bordered compact>
          <SectionHeading eyebrow="Cuando la tengas lista" title="Sigue el proceso completo" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: Mail, tile: '', title: 'Escribe el correo', desc: 'Plantillas para postular, hacer seguimiento y agradecer.', to: '/empleo/correos', cta: 'Ver plantillas' },
              { icon: Search, tile: 'ds-icon-tile--teal', title: 'Busca la vacante', desc: 'Ofertas para químicos farmacéuticos con postulación directa.', to: '/empleo/ofertas-qf', cta: 'Ver ofertas' },
              { icon: Sparkles, tile: 'ds-icon-tile--violet', title: 'Que te busquen a ti', desc: 'Publica tus logros en la vitrina de talento.', to: '/talento', cta: 'Ir a la vitrina' },
            ].map((c) => (
              <Card key={c.title} hover>
                <span className={`ds-icon-tile h-12 w-12 items-center justify-center rounded-xl ${c.tile}`} aria-hidden="true"><c.icon className="h-6 w-6" strokeWidth={1.8} /></span>
                <p className="mt-4 text-base font-bold text-edvanta-deep">{c.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{c.desc}</p>
                <ArrowLink to={c.to} className="mt-4">{c.cta}</ArrowLink>
              </Card>
            ))}
          </div>
        </Section>

        <Section>
          <SectionHeading eyebrow="Preguntas frecuentes" title="Dudas sobre la hoja de vida" />
          <Faq className="mt-8" items={FAQS} />
        </Section>

        <CtaBanner
          eyebrow="Hazlo ahora"
          title="Sube tu hoja de vida y mírala con un diseño nuevo"
          desc="La leemos, la calificamos y la pasamos al diseño que elijas. Tú solo revisas y descargas."
          actions={(
            <>
              <Btn to={CREAR} variant="white" icon={Sparkles}>Crear mi hoja de vida</Btn>
              <Btn to="/empleo" variant="outlineWhite">Ver el centro de empleo</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}
