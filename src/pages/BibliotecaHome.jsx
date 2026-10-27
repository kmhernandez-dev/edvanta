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
  ArrowRight, BookOpen, Building2, CalendarClock, GraduationCap, HeartPulse, MessageCircle, MonitorPlay,
} from 'lucide-react';

import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Hero from '../components/Hero';
import InicioEstudiante from '../components/InicioEstudiante';
import CourseCarousel from '../components/CourseCarousel';
import { Btn, CtaBanner, NavCard, Section, SectionHeading } from '../components/edvanta/ui';
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
    tone: 'blue',
    title: 'Profesionales y equipos de salud',
    desc: 'Actualízate con cursos en vivo y virtuales de las cuatro escuelas: farmacia clínica, calidad, regulatorio y comunicación.',
    cta: 'Ver las escuelas',
  },
  {
    to: '/pacientes',
    icon: HeartPulse,
    tone: 'teal',
    title: 'Pacientes y cuidadores',
    desc: 'Comprende tu salud con guías y rutas en lenguaje claro. Empieza por la salud tiroidea con Feliz Sin Tiroides.',
    cta: 'Ir a Edvanta Contigo',
  },
  {
    to: '/instituciones',
    icon: Building2,
    tone: 'violet',
    title: 'Instituciones',
    desc: 'Formación para equipos, programas educativos para pacientes, licencias y materiales, bajo propuesta.',
    cta: 'Ver qué se puede contratar',
  },
];

function CursoDestacado({ p }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-edvanta-border bg-white shadow-[0_12px_36px_rgba(23,34,59,.08)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
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
          <Btn to={p.to}>Ver el curso</Btn>
          <Btn to={`${p.to}#registro`} variant="secondary">Registrar mi interés</Btn>
        </div>
      </div>
      <div className="border-t border-edvanta-border bg-edvanta-bg p-6 sm:p-10 lg:border-l lg:border-t-0">
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
      <Section>
        <SectionHeading eyebrow="Por dónde empezar" title="¿Para quién es lo que buscas?" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PUBLICOS.map((p) => <NavCard key={p.to} {...p} />)}
        </div>
      </Section>

      {/* 3. Disponible ahora */}
      {destacado && (
        <Section id="curso-en-vivo" tone="tint" bordered>
          <SectionHeading
            eyebrow="Primer curso en vivo"
            title="Para auxiliares y regentes de farmacia"
            desc="Formación de actualización en vivo. No es una biblioteca de clases grabadas ni otorga el título de auxiliar o regente."
          />
          <div className="mt-8"><CursoDestacado p={destacado} /></div>
        </Section>
      )}

      {/* 4. Escuelas */}
      <Section id="escuelas">
        <SectionHeading
          eyebrow="Escuelas de Edvanta"
          title="Cuatro escuelas, una sola Edvanta"
          desc="Cada escuela reúne cursos, guías y servicios de un campo del trabajo farmacéutico."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ESCUELAS.map((e) => (
            <EscuelaCard key={e.slug} escuela={e} cursos={e.catalogo ? porEscuela[e.slug] : null} />
          ))}
        </div>
      </Section>
      {cursos.length > 0 && (
        <section className="border-y border-edvanta-border bg-edvanta-bg">
          <CourseCarousel title="Cursos virtuales disponibles hoy" courses={cursos.slice(0, 16)} sectionKey="home_cursos_propios" />
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <Link to="/cursos" className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
              Ver los {cursos.length} cursos virtuales de Edvanta
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* 5. Guías y recursos */}
      <Section>
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
      <Section tone="tint" bordered>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Para instituciones"
            title="Formación y educación en salud, bajo propuesta"
            desc="Para hospitales, IPS, EPS y empresas del sector."
          />
          <Btn to="/instituciones#solicitar-propuesta" className="shrink-0">Solicitar propuesta</Btn>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAQUETES.map((p) => (
            <Link key={p.slug} to={`/instituciones#${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-edvanta-blue/30">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{p.lema}</p>
              <p className="mt-1 text-lg font-bold text-edvanta-deep">{p.nombre}</p>
              <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{p.necesidad}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
                Ver detalle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 7. Quién está detrás */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
          <img src="/img/karla-real.jpg" alt={AUTORA.nombre} width="800" height="1000" loading="lazy"
            className="mx-auto aspect-[4/5] w-52 rounded-3xl bg-edvanta-bg object-cover object-top lg:w-full" />
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
