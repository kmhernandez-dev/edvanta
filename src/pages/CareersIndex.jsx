import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2, CalendarDays,
  Compass, FlaskConical, GraduationCap, Megaphone, Newspaper, Rocket, Sparkles, Wrench,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updatePageSeo } from '../utils/seo';
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
    color: 'from-sky-500 to-blue-600',
    a: '/carreras#cursos',
  },
  {
    id: 'vocacion',
    icon: Compass,
    titulo: 'Orientación vocacional',
    texto: 'Sistema guiado de 3 pasos que te recomienda el mejor encaje para tu perfil farmacéutico.',
    color: 'from-fuchsia-500 to-purple-600',
    a: '/vocacion',
  },
  {
    id: 'empleo',
    icon: BriefcaseBusiness,
    titulo: 'Empleo',
    texto: 'Crea tu hoja de vida, adapta según el cargo, escribe correos a RR. HH. y consulta el banco de vacantes.',
    color: 'from-amber-500 to-orange-600',
    a: '/empleo',
  },
  {
    id: 'practicas',
    icon: FlaskConical,
    titulo: 'Prácticas',
    texto: 'Guía completa para prepararte, elegir perfil y aplicar con una hoja de vida pensada para prácticas.',
    color: 'from-rose-500 to-pink-600',
    a: '/practicas',
  },
  {
    id: 'noticias',
    icon: Megaphone,
    titulo: 'Noticias',
    texto: 'Agenda y fuentes oficiales del sector farmacéutico en Colombia.',
    color: 'from-indigo-500 to-violet-600',
    a: '/noticias',
  },
  {
    id: 'linkedin',
    icon: Sparkles,
    titulo: 'LinkedIn',
    texto: 'Banco de prompts, guía práctica con imágenes y guía para generar ingresos con tu marca personal.',
    color: 'from-sky-600 to-cyan-700',
    a: '/linkedin',
  },
  {
    id: 'emprendimientos',
    icon: Rocket,
    titulo: 'Emprendimientos',
    texto: 'Crea tu idea, conéctate con la comunidad, prueba productos y publica tu emprendimiento.',
    color: 'from-lime-500 to-green-600',
    a: '/emprendimientos',
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
    texto: 'Busca talento en la comunidad: perfiles clasificados por área con proyectos y artículos.',
    color: 'from-teal-600 to-cyan-700',
    a: '/empresas',
  },
];

function SectionCard({ titulo, descripcion, verTodo, to, children, id }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-slate-100 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">{titulo}</h2>
            {descripcion && <p className="mt-2 text-sm leading-6 text-slate-600">{descripcion}</p>}
          </div>
          {verTodo && (
            <Link to={to} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-800">
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
    <article className="flex min-h-52 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase text-teal-700">{badge}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{item.tipo === 'pública' ? 'Pública' : item.tipo === 'privada' ? 'Privada' : item.modalidad}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-[#071a4a]">{item.nombre}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-700">{item.universidad || item.organizador}</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.resumen}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5"><CalendarDays className="h-3 w-3" />{item.modalidad}</span>
        {item.ciudad && <span className="rounded-full bg-slate-50 px-2 py-0.5">{item.ciudad}</span>}
      </div>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">
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
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#071a4a]">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-200">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                Centro profesional farmacéutico
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
                Todo para construir tu carrera farmacéutica en Colombia
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Formación verificada, orientación vocacional, empleo, prácticas, emprendimiento y herramientas
                en un solo lugar. Diseñado para el químico farmacéutico y el técnico del sector.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#formacion" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-teal-500 px-6 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-400">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" /> Explorar formación
                </a>
                <Link to="/vocacion" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                  <Compass className="h-4 w-4" aria-hidden="true" /> Orientación vocacional
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modulos.map(modulo => {
              const Icon = modulo.icon;
              return (
                <Link key={modulo.id} to={modulo.a} className="group flex min-h-44 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${modulo.color} text-white shadow`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-[#071a4a] group-hover:text-teal-800">{modulo.titulo}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{modulo.descripcion}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700">
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
              <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><GraduationCap className="h-4 w-4" aria-hidden="true" />Maestrías en universidades de Colombia</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {maestriasColombia.map(item => <FormItemCard key={item.id} item={item} badge="Maestría" />)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><BadgeCheck className="h-4 w-4" aria-hidden="true" />Especializaciones</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {especializacionesColombia.map(item => <FormItemCard key={item.id} item={item} badge="Especialización" />)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><BookOpen className="h-4 w-4" aria-hidden="true" />Diplomados</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {diplomadosColombia.map(item => <FormItemCard key={item.id} item={item} badge="Diplomado" />)}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><CalendarDays className="h-4 w-4" aria-hidden="true" />Congresos y eventos</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {congresosColombia.map(item => <FormItemCard key={item.id} item={item} badge="Congreso / Evento" />)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><Megaphone className="h-4 w-4" aria-hidden="true" />Webinars y formación virtual</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {webinarsColombia.map(item => <FormItemCard key={item.id} item={item} badge="Webinar / Virtual" />)}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><FlaskConical className="h-4 w-4" aria-hidden="true" />Central de mezclas, BPE y farmacia oncológica</div>
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
              <Link key={area.slug} to="/cursos" className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:bg-teal-50/40">
                <p className="text-sm font-bold text-[#071a4a] group-hover:text-teal-800">{area.nombre}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{area.detalle}</p>
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
            <Link to="/vocacion" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-teal-500 px-6 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-400">
              <Compass className="h-4 w-4" aria-hidden="true" /> Hacer la orientación vocacional
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
