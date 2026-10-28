/**
 * ============================================================
 *  BibliotecaHome.jsx — Inicio de edvanta.co
 *
 *  En este orden, porque es el orden en que alguien decide:
 *
 *   1. Qué es Edvanta (titular)
 *   2. Por dónde entro: profesional, paciente o institución
 *   3. Lo que hay disponible ahora: el curso en vivo
 *   4. Las cuatro escuelas y sus cursos virtuales
 *   5. Guías y recursos
 *   6. Servicios para instituciones
 *   7. Quién está detrás y con qué criterio
 *   8. Contacto o registro de interés
 *
 *  Todo sale de src/data/edvanta y de la base de datos: el curso en
 *  vivo que se ve aquí es el mismo objeto que su ficha. Se retiraron
 *  el catálogo «de más de 6.000 cursos» (cifra sin respaldo), las
 *  rutas genéricas de Power BI o gestión ambiental y los carruseles de
 *  cursos de terceros, que siguen en /cursos, separados y señalados.
 * ============================================================
 */

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Building2, CalendarClock, CheckCircle2, Compass, GraduationCap, HeartPulse, Lightbulb,
  MessageCircle, MonitorPlay, Sparkles, Users,
} from 'lucide-react';

import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Hero from '../components/Hero';
import InicioEstudiante from '../components/InicioEstudiante';
import CourseCarousel from '../components/CourseCarousel';
import { Btn, CtaBanner, NavCard, Section, SectionHeading, Steps } from '../components/edvanta/ui';
import { EscuelaCard, EstadoBadge, PublicoBadge, useCursosPropios } from '../components/edvanta/oferta';
import { useAuth } from '../context/AuthContext';
import { ESCUELAS, cursoEnEscuela } from '../data/edvanta/escuelas';
import { AUTORA, KITS_PROFESIONALES, PRODUCTO_DESTACADO, productoPorSlug } from '../data/edvanta/productos';
import { PAQUETES } from '../data/edvanta/servicios';
import { EDVANTA_WHATSAPP_URL } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const PUBLICOS = [
  {
    to: '/escuelas',
    icon: GraduationCap,
    tono: 'blue',
    etiqueta: 'Para profesionales',
    title: 'Tu actualización en el sector farmacéutico',
    desc: 'Cursos en vivo y virtuales de las cuatro escuelas: farmacia clínica, calidad, regulatorio y comunicación.',
    puntos: ['Cursos en vivo y virtuales', 'Guías y kits editables', 'Rutas por área'],
    cta: 'Ver las escuelas',
    image: '/img/publicos/profesionales.webp',
    imageAlt: 'Equipo de salud revisando juntos un caso en una tableta',
  },
  {
    to: '/pacientes',
    icon: HeartPulse,
    tono: 'teal',
    etiqueta: 'Para pacientes y cuidadores',
    title: 'Conocimiento claro para cuidar de ti y de los tuyos',
    desc: 'Guías y rutas en lenguaje claro. Empieza por la salud tiroidea con Feliz Sin Tiroides.',
    puntos: ['Información confiable', 'En lenguaje claro', 'Paso a paso'],
    cta: 'Ir a Edvanta Contigo',
    image: '/img/publicos/pacientes.webp',
    imageAlt: 'Química farmacéutica explicando la tiroides a pacientes y familiares con una tableta',
  },
  {
    to: '/instituciones',
    icon: Building2,
    tono: 'violet',
    etiqueta: 'Para instituciones',
    title: 'Formación a la medida para equipos de salud',
    desc: 'Formación para equipos, programas educativos para pacientes, licencias y materiales, bajo propuesta.',
    puntos: ['Programas a la medida', 'Modalidad flexible', 'Acompañamiento'],
    cta: 'Ver qué se puede contratar',
    image: '/img/publicos/instituciones.webp',
    imageAlt: 'Presentación de resultados de formación ante el equipo directivo de una institución',
  },
];

const TONO_PANEL = {
  blue: { fondo: 'linear-gradient(160deg, #EEF2FE 0%, #FFFFFF 60%)', tile: '', texto: 'text-edvanta-blue', btn: 'primary' },
  teal: { fondo: 'linear-gradient(160deg, #E9F7F6 0%, #FFFFFF 60%)', tile: 'ds-icon-tile--teal', texto: 'text-edvanta-tealdark', btn: 'teal' },
  violet: { fondo: 'linear-gradient(160deg, #F1EDFD 0%, #FFFFFF 60%)', tile: 'ds-icon-tile--violet', texto: 'text-[#5E51A8]', btn: 'primary' },
};

/** Panel de público: cada puerta con su color, su foto y lo que encuentra. */
function PanelPublico({ p }) {
  const t = TONO_PANEL[p.tono];
  const Icon = p.icon;
  return (
    <article className="group ds-card relative flex h-full flex-col overflow-hidden" style={{ background: t.fondo }}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={p.image} alt={p.imageAlt} width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </div>
      <div className="relative -mt-8 flex flex-1 flex-col px-6 pb-6">
        <span className={`ds-icon-tile ${t.tile} h-12 w-12 ring-4 ring-white`}><Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" /></span>
        <p className={`mt-4 text-xs font-bold uppercase tracking-[.14em] ${t.texto}`}>{p.etiqueta}</p>
        <h3 className="mt-1.5 font-display text-xl font-extrabold leading-snug text-edvanta-deep">{p.title}</h3>
        <p className="mt-2 text-sm leading-6 text-edvanta-muted">{p.desc}</p>
        <ul className="mt-4 flex-1 space-y-1.5">
          {p.puntos.map((x) => (
            <li key={x} className="flex items-center gap-2 text-sm font-semibold text-edvanta-deep">
              <CheckCircle2 className={`h-4 w-4 ${t.texto}`} aria-hidden="true" />{x}
            </li>
          ))}
        </ul>
        <Btn to={p.to} variant={t.btn} iconRight={ArrowRight} className="mt-6 self-start">{p.cta}</Btn>
      </div>
    </article>
  );
}

// El recorrido completo, en palabras que se pueden cumplir hoy.
const RECORRIDO = [
  { icon: BookOpen, title: 'Aprende', desc: 'Cursos y recursos de cada escuela.' },
  { icon: Lightbulb, title: 'Aplica', desc: 'Kits y casos para tu práctica diaria.' },
  { icon: Compass, title: 'Avanza', desc: 'Rutas y competencias para tu carrera.' },
  { icon: Users, title: 'Conecta', desc: 'Comunidad y vitrina de talento.' },
  { icon: Sparkles, title: 'Genera impacto', desc: 'En tus pacientes y en tu institución.' },
];

function CursoDestacado({ p }) {
  return (
    <div className="ds-card grid overflow-hidden lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap gap-2">
          <EstadoBadge estado={p.estado} />
          <PublicoBadge publico={p.publico} />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">{p.tipoTexto}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-edvanta-deep sm:text-3xl">{p.nombre}</h3>
        <p className="mt-3 text-[15px] leading-7 text-edvanta-muted"><strong className="text-edvanta-deep">Para:</strong> {p.dirigidoA}</p>
        <ul className="mt-5 grid gap-2 text-sm text-edvanta-deep sm:grid-cols-2">
          <li className="flex items-center gap-2"><MonitorPlay className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{p.modalidad}</li>
          <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{p.formato.duracion}, {p.formato.encuentros.toLowerCase()}</li>
        </ul>
        <p className="mt-4 text-sm text-edvanta-muted">Con {p.docente.nombre}, {p.docente.profesion.toLowerCase()}. Fecha de inicio y valor por confirmar.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Btn to={p.to} iconRight={ArrowRight}>Ver el curso</Btn>
          <Btn to={`${p.to}#registro`} variant="secondary">Registrar mi interés</Btn>
        </div>
      </div>
      <div className="ds-surface-diagonal border-t border-edvanta-border p-6 sm:p-10 lg:border-l lg:border-t-0">
        {p.imagen && (
          <div className="ds-photo mb-6 aspect-[3/2]">
            <img src={p.imagen} alt={p.imagenAlt} width="1200" height="800" loading="lazy" decoding="async" />
          </div>
        )}
        <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Temas</p>
        <ol className="mt-4 space-y-2.5">
          {p.temario.map((t, i) => (
            <li key={t} className="flex items-start gap-3 text-sm text-edvanta-deep">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-edvanta-blue ring-1 ring-edvanta-border">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function BibliotecaHome() {
  const { user, profile: cuenta } = useAuth();
  // El nombre de pila basta para saludar; el completo ocupa dos renglones.
  const nombreCorto = String(cuenta?.full_name || user?.user_metadata?.full_name || '')
    .trim().split(/\s+/)[0] || null;

  const destacado = productoPorSlug(PRODUCTO_DESTACADO);
  const { cursos } = useCursosPropios({ publico: 'profesionales', limite: 60 });
  const porEscuela = useMemo(
    () => Object.fromEntries(ESCUELAS.map((e) => [e.slug, cursos.filter((c) => cursoEnEscuela(c, e)).length])),
    [cursos],
  );

  useEffect(() => updatePageSeo({
    title: 'Edvanta | Educación farmacéutica para profesionales, pacientes e instituciones',
    description: 'Cursos en vivo y virtuales, guías y servicios de formación: cuatro escuelas de Edvanta para profesionales de la salud, Edvanta Contigo para pacientes y propuestas para instituciones.',
    canonical: 'https://edvanta.co/',
  }), []);

  return (
    <div className="min-h-screen bg-edvanta-home">
      <SiteHeader />

      {/* Quien ya entró abre el inicio con sus cursos. */}
      {user ? <InicioEstudiante nombre={nombreCorto} /> : <Hero />}

      {/* 2. Por dónde entro */}
      <Section tone="white">
        <SectionHeading eyebrow="Por dónde empezar" title="¿Para quién es lo que buscas?" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PUBLICOS.map((p) => <PanelPublico key={p.to} p={p} />)}
        </div>
      </Section>

      {/* 3. Disponible ahora */}
      {destacado && (
        <Section id="curso-en-vivo" tone="diagonal" bordered>
          <SectionHeading
            eyebrow="Primer curso en vivo"
            title="Para auxiliares y regentes de farmacia"
            desc="Formación de actualización en vivo. No es una biblioteca de clases grabadas ni otorga el título de auxiliar o regente."
          />
          <div className="mt-8"><CursoDestacado p={destacado} /></div>
        </Section>
      )}

      {/* 4. Escuelas */}
      <Section id="escuelas" tone="white">
        <SectionHeading
          eyebrow="Escuelas de Edvanta"
          title="Cuatro escuelas, una sola Edvanta"
          desc="Cada escuela reúne cursos, guías y servicios de un campo del trabajo farmacéutico."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ESCUELAS.map((e) => (
            <EscuelaCard key={e.slug} escuela={e} cursos={e.catalogo ? porEscuela[e.slug] : null} />
          ))}
        </div>
      </Section>
      {cursos.length > 0 && (
        <section className="ds-surface-ice border-y border-edvanta-border">
          <CourseCarousel title="Cursos virtuales disponibles hoy" courses={cursos.slice(0, 16)} sectionKey="home_cursos_propios" />
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <Btn to="/cursos" variant="link" iconRight={ArrowRight}>Ver los {cursos.length} cursos virtuales de Edvanta</Btn>
          </div>
        </section>
      )}

      {/* El recorrido completo, como diagrama. */}
      <Section tone="glow">
        <SectionHeading
          align="center"
          eyebrow="Un acompañamiento integral"
          title="En cada etapa de tu aprendizaje"
          desc="De lo que estudias a lo que cambia en tu trabajo, en tus pacientes o en tu institución."
        />
        <Steps className="mt-12" items={RECORRIDO} />
      </Section>

      {/* 5. Guías y recursos */}
      <Section tone="white">
        <SectionHeading eyebrow="Guías y recursos" title="Material para aplicar lo que sabes" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <NavCard
            to="/guias#profesionales"
            icon={BookOpen}
            title="Kits para profesionales"
            desc={`${KITS_PROFESIONALES.length} kits de plantillas editables para atención farmacéutica, calidad e indicadores.`}
            cta="Ver los kits"
          />
          <NavCard
            to="/recurso/levotiroxina"
            icon={HeartPulse}
            tone="teal"
            title="Guía gratuita para pacientes"
            desc="Cómo tomar la levotiroxina correctamente: a qué hora, qué esperar antes del café y qué hacer si olvidas una dosis."
            cta="Descargar la guía"
          />
          <NavCard
            to="/guias"
            icon={GraduationCap}
            tone="violet"
            title="Artículos y herramientas"
            desc="Lecturas del sector, biblioteca de referencias y herramientas gratuitas para tu carrera."
            cta="Ver guías y recursos"
          />
        </div>
      </Section>

      {/* 6. Instituciones */}
      <Section tone="lavender" bordered>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Para instituciones"
            tone="violet"
            title="Formación y educación en salud, bajo propuesta"
            desc="Para hospitales, IPS, EPS y empresas del sector."
          />
          <Btn to="/instituciones#solicitar-propuesta" iconRight={ArrowRight} className="shrink-0">Solicitar propuesta</Btn>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAQUETES.map((p) => (
            <Link key={p.slug} to={`/instituciones/paquetes/${p.slug}`} className="group ds-card ds-card--interactive flex h-full flex-col overflow-hidden">
              {p.imagen && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.imagen} alt="" width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{p.lema}</p>
                <p className="mt-1 font-display text-lg font-extrabold text-edvanta-deep">{p.nombre}</p>
                <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{p.necesidad}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
                  Ver detalle
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 7. Quién está detrás */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
          <div className="ds-photo mx-auto aspect-[4/5] w-52 lg:w-full">
            <img src="/img/karla-real.jpg" alt={AUTORA.nombre} width="800" height="1000" loading="lazy" className="object-top" />
          </div>
          <div>
            <SectionHeading eyebrow="Quién está detrás" title={AUTORA.nombre} desc={`${AUTORA.profesion}. ${AUTORA.ciudad}.`} />
            <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
              Química farmacéutica y paciente que vive sin tiroides. Está al frente de Edvanta, creó Feliz Sin Tiroides
              y dicta el primer curso en vivo. En Edvanta decimos qué es propio y qué es de otras plataformas, y solo
              publicamos fechas, precios y cupos cuando existen.
            </p>
            <Btn to="/sobre-edvanta" variant="secondary" className="mt-6">Conocer Edvanta</Btn>
          </div>
        </div>
      </Section>

      {/* 8. Contacto */}
      <CtaBanner
        eyebrow="Hablemos"
        title="¿Tienes una pregunta o quieres que te avisemos cuando abra el curso?"
        desc="Registra tu interés en el curso en vivo o escríbenos. Te respondemos al correo o al WhatsApp que dejes."
        actions={(
          <>
            {destacado && <Btn to={`${destacado.to}#registro`} variant="white">Registrar mi interés</Btn>}
            <Btn to="/contacto" variant="outlineWhite">Contactar a Edvanta</Btn>
            <Btn href={EDVANTA_WHATSAPP_URL} external variant="outlineWhite" icon={MessageCircle}>WhatsApp</Btn>
          </>
        )}
      />

      <SiteFooter />
    </div>
  );
}
