import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2, CalendarDays,
  Compass, FlaskConical, GraduationCap, Megaphone, Newspaper, Rocket, Sparkles, Wrench,
  TrendingUp,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { updatePageSeo } from '../utils/seo';
import { Btn, Steps } from '../components/edvanta/ui';
import { HeroInmersivo } from '../components/edvanta/heroes';
import {
  maestriasColombia, especializacionesColombia, diplomadosColombia,
  congresosColombia, webinarsColombia, areasCursosHub, formacionCentralMezclas,
} from '../data/careerHub';

const seoDescription = 'Carreras, maestrías, especializaciones, diplomados, empleo, prácticas y herramientas para el profesional farmacéutico en Colombia.';

const modulos = [
  {
    id: 'formacion',
    icon: GraduationCap,
    titulo: 'Formación en Colombia',
    texto: 'Maestrías, especializaciones, diplomados, congresos y webinars verificados en universidades públicas y privadas.',
    color: 'from-teal-500 to-emerald-600',
    a: '/carreras#formacion',
  },
  {
    id: 'cursos',
    icon: BookOpen,
    titulo: 'Cursos y áreas de estudio',
    texto: 'Explora más de 90 cursos organizados por área profesional, sin importar la plataforma que los dicte.',
    color: 'from-edvanta-blue to-blue-600',
    a: '/carreras#cursos',
  },
  {
    id: 'vocacion',
    icon: Compass,
    titulo: 'Orientación vocacional',
    texto: 'Sistema guiado de 3 pasos que te recomienda el mejor encaje para tu perfil farmacéutico.',
    color: 'from-edvanta-blue to-edvanta-blue',
    a: '/orientacion-vocacional',
  },
  {
    id: 'empleo',
    icon: BriefcaseBusiness,
    titulo: 'Empleo',
    texto: 'Crea tu hoja de vida, adapta según el cargo, escribe correos a RR. HH. y consulta el banco de vacantes.',
    color: 'from-amber-500 to-edvanta-blue',
    a: '/empleo',
  },
  {
    id: 'practicas',
    icon: FlaskConical,
    titulo: 'Prácticas',
    texto: 'Guía completa para prepararte, elegir perfil y aplicar con una hoja de vida pensada para prácticas.',
    color: 'from-edvanta-violet to-edvanta-blue',
    a: '/practicas-profesionales-farmaceuticas',
  },
  {
    id: 'noticias',
    icon: Megaphone,
    titulo: 'Noticias',
    texto: 'Agenda y fuentes oficiales del sector farmacéutico en Colombia.',
    color: 'from-edvanta-blue to-edvanta-blue',
    a: '/noticias',
  },
  {
    id: 'linkedin',
    icon: Sparkles,
    titulo: 'LinkedIn',
    texto: 'Banco de prompts, guía práctica con imágenes y guía para generar ingresos con tu marca personal.',
    color: 'from-edvanta-blue to-edvanta-blue',
    a: '/linkedin-farmaceutico',
  },
  {
    id: 'emprendimientos',
    icon: Rocket,
    titulo: 'Emprendimientos',
    texto: 'Crea tu idea, conéctate con la comunidad, prueba productos y publica tu emprendimiento.',
    color: 'from-lime-500 to-green-600',
    a: '/emprendimiento-farmaceutico',
  },
  {
    id: 'herramientas',
    icon: Wrench,
    titulo: 'Herramientas',
    texto: 'Guías, plantillas y recursos clasificados por tema, listos para copiar y usar.',
    color: 'from-slate-500 to-slate-700',
    a: '/herramientas',
  },
  {
    id: 'empresas',
    icon: Building2,
    titulo: 'Empresas',
    texto: 'Formación para tu equipo y programas educativos para tus pacientes, bajo propuesta.',
    color: 'from-teal-600 to-edvanta-blue',
    a: '/instituciones',
  },
];

function SectionCard({ titulo, descripcion, verTodo, to, children, id }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-edvanta-border py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-edvanta-deep sm:text-3xl">{titulo}</h2>
            {descripcion && <p className="mt-2 text-sm leading-6 text-edvanta-muted">{descripcion}</p>}
          </div>
          {verTodo && (
            <Link to={to} className="inline-flex items-center gap-2 rounded-lg border border-edvanta-border bg-white px-4 py-2 text-sm font-bold text-edvanta-muted transition hover:border-teal-400 hover:text-edvanta-tealdark">
              {verTodo} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function FormItemCard({ item, badge }) {
  return (
    <article className="flex min-h-52 flex-col ds-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-edvanta-teal hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase text-edvanta-tealdark">{badge}</p>
        <span className="rounded-full bg-edvanta-soft px-2 py-0.5 text-[10px] font-bold text-edvanta-muted">{item.tipo === 'pública' ? 'Pública' : item.tipo === 'privada' ? 'Privada' : item.modalidad}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-edvanta-deep">{item.nombre}</h3>
      <p className="mt-1 text-sm font-semibold text-edvanta-muted">{item.universidad || item.organizador}</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{item.resumen}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-edvanta-subtle">
        <span className="inline-flex items-center gap-1 rounded-full bg-edvanta-bg px-2 py-0.5"><CalendarDays className="h-3 w-3" />{item.modalidad}</span>
        {item.ciudad && <span className="rounded-full bg-edvanta-bg px-2 py-0.5">{item.ciudad}</span>}
      </div>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-edvanta-tealdark hover:text-teal-900">
        Ver programa <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}

export default function CareersIndex() {
  const location = useLocation();

  useEffect(() => updatePageSeo({
    title: 'Carreras farmacéuticas en Colombia | Edvanta',
    description: seoDescription,
    canonical: 'https://edvanta.co/carreras',
    keywords: ['carreras farmacéuticas', 'maestrías Colombia', 'especializaciones farmacia', 'empleo farmacéutico', 'orientación vocacional'],
    jsonLdId: 'careers-hub',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Carreras farmacéuticas en Colombia',
      description: seoDescription,
      url: 'https://edvanta.co/carreras',
      isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: 'https://edvanta.co' },
    },
  }), []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location.hash]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        {/* Héroe B a foto completa: el equipo del sector y, sobre la zona clara, el titular. */}
        <HeroInmersivo
          fullBleed
          image="/img/fotos/equipo-carrera-farmaceutica.webp"
          imageMobile="/img/fotos/equipo-carrera-farmaceutica-movil.webp"
          imageAlt="Una enfermera, una química farmacéutica con bata y un profesional de la industria, de pie en un laboratorio con tabletas en la mano"
          eyebrow="Centro profesional farmacéutico"
          title="Todo para construir tu carrera farmacéutica en Colombia"
          highlight="tu carrera farmacéutica"
          lead="Formación verificada, orientación vocacional, empleo, prácticas, emprendimiento y herramientas en un solo lugar. Diseñado para el químico farmacéutico y el técnico del sector."
          actions={(
            <>
              <Btn href="#formacion" size="lg" icon={GraduationCap}>Explorar formación</Btn>
              <Btn to="/orientacion-vocacional" variant="secondary" size="lg" icon={Compass}>Orientación vocacional</Btn>
            </>
          )}
        />

        {/* El recorrido, como diagrama, justo debajo del héroe. */}
        <section className="ds-surface-diagonal border-y border-edvanta-border">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <p className="ed-eyebrow">Tu recorrido</p>
            <Steps
              className="mt-8"
              items={[
                { icon: Compass, title: 'Oriéntate', desc: 'Descubre el área que más encaja contigo.' },
                { icon: GraduationCap, title: 'Fórmate', desc: 'Cursos y rutas por competencias.' },
                { icon: BadgeCheck, title: 'Postúlate', desc: 'Hoja de vida, correos y vacantes.' },
                { icon: TrendingUp, title: 'Crece', desc: 'Emprende y avanza en tu carrera.' },
              ]}
            />
          </div>
        </section>

        {/* Módulos */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modulos.map(modulo => {
              const Icon = modulo.icon;
              return (
                <Link key={modulo.id} to={modulo.a} className="group flex min-h-44 flex-col rounded-xl border border-edvanta-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-edvanta-teal hover:shadow-lg">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${modulo.color} text-white shadow`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-edvanta-deep group-hover:text-edvanta-tealdark">{modulo.titulo}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{modulo.descripcion}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-tealdark">
                    Entrar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Formación */}
        <SectionCard
          id="formacion"
          titulo="Maestrías, especializaciones y diplomados en Colombia"
          descripcion="Programas verificados en las páginas oficiales de cada universidad. Siempre confirma convocatorias y fechas en la fuente oficial."
        >
          <div className="mt-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark"><GraduationCap className="h-4 w-4" aria-hidden="true" />Maestrías en universidades de Colombia</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {maestriasColombia.map(item => <FormItemCard key={item.id} item={item} badge="Maestría" />)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark"><BadgeCheck className="h-4 w-4" aria-hidden="true" />Especializaciones</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {especializacionesColombia.map(item => <FormItemCard key={item.id} item={item} badge="Especialización" />)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark"><BookOpen className="h-4 w-4" aria-hidden="true" />Diplomados</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {diplomadosColombia.map(item => <FormItemCard key={item.id} item={item} badge="Diplomado" />)}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark"><CalendarDays className="h-4 w-4" aria-hidden="true" />Congresos y eventos</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {congresosColombia.map(item => <FormItemCard key={item.id} item={item} badge="Congreso / Evento" />)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark"><Megaphone className="h-4 w-4" aria-hidden="true" />Webinars y formación virtual</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {webinarsColombia.map(item => <FormItemCard key={item.id} item={item} badge="Webinar / Virtual" />)}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark"><FlaskConical className="h-4 w-4" aria-hidden="true" />Central de mezclas, BPE y farmacia oncológica</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {formacionCentralMezclas.map(item => <FormItemCard key={item.id} item={item} badge="Central de mezclas" />)}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Cursos sin plataformas */}
        <SectionCard
          id="cursos"
          titulo="Cursos por área profesional"
          descripcion="Toda la oferta de cursos del catálogo, organizada por el área donde aporta valor, sin importar la plataforma que los dicte."
          verTodo="Ver el catálogo completo"
          to="/cursos"
        >
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areasCursosHub.map(area => (
              <Link key={area.slug} to="/cursos" className="group ds-card p-4 transition hover:border-edvanta-teal hover:bg-edvanta-mint/40">
                <p className="text-sm font-bold text-edvanta-deep group-hover:text-edvanta-tealdark">{area.nombre}</p>
                <p className="mt-1 text-xs leading-5 text-edvanta-subtle">{area.detalle}</p>
              </Link>
            ))}
          </div>
        </SectionCard>

        {/* CTA final */}
        <section className="bg-[#071428] py-14">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">¿No sabes por dónde empezar?</h2>
              <p className="mt-2 text-base leading-7 text-slate-300">
                Responde 3 preguntas cortas y te recomendamos tu mejor encaje profesional, la formación adecuada y tu primer paso.
              </p>
            </div>
            <Link to="/orientacion-vocacional" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-teal-500 px-6 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-400">
              <Compass className="h-4 w-4" aria-hidden="true" /> Hacer la orientación vocacional
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
