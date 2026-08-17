import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BookOpenCheck, BriefcaseBusiness, Route, Shapes, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { learningRoutes } from '../data/featuredCourses';
import { updatePageSeo } from '../utils/seo';

const entryPoints = [
  {
    title: 'Quiero elegir un área',
    description: 'Compara funciones, contextos de trabajo y habilidades antes de decidir qué estudiar.',
    to: '/carreras',
    action: 'Explorar carreras',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Ya tengo una meta',
    description: 'Sigue una secuencia que conecta fundamentos, práctica, portafolio y empleabilidad.',
    to: '/rutas',
    action: 'Ver rutas',
    icon: Route,
  },
  {
    title: 'Necesito una habilidad',
    description: 'Descubre en qué carreras se utiliza y qué cursos verificados ayudan a desarrollarla.',
    to: '/competencias',
    action: 'Ver competencias',
    icon: Shapes,
  },
  {
    title: 'Busco un curso concreto',
    description: 'Filtra la oferta existente por carrera, competencia, proveedor, idioma y tipo de acceso.',
    to: '/cursos',
    action: 'Buscar cursos',
    icon: BookOpenCheck,
  },
];

const fallbackPaths = learningRoutes.map(path => ({
  slug: path.slug,
  name: path.title,
  summary: path.summary,
  step_count: path.courseSlugs.length,
  estimated_duration: 'Ruta flexible',
  career: { name: 'Desarrollo profesional' },
}));

export default function LearningHub() {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return updatePageSeo({
      title: 'Aprende para construir tu carrera farmacéutica | Edvanta',
      description: 'Conecta carreras, competencias, rutas y cursos profesionales en una secuencia útil para avanzar en la industria farmacéutica.',
      canonical: 'https://edvanta.co/aprende',
      jsonLdId: 'learning-hub',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Aprende en Edvanta',
        url: 'https://edvanta.co/aprende',
      },
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/api/learning-paths'), { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Rutas no disponibles');
        return response.json();
      })
      .then(payload => setPaths((payload.data || []).slice(0, 4)))
      .catch(error => {
        if (error.name !== 'AbortError') setPaths(fallbackPaths.slice(0, 4));
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Header />
      <main className="bg-white pt-16">
        <section className="border-b border-slate-200 bg-[#f7f9fc]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-bold uppercase text-teal-700">Aprende en Edvanta</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">
                Convierte lo que aprendes en una decisión profesional
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Empieza por la carrera que te interesa, identifica las competencias que te faltan y elige formación que tenga un propósito claro.
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-5 lg:self-end">
              <Target className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <p className="mt-4 text-sm font-bold text-[#071a4a]">Tu siguiente paso debe responder a una meta</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">No necesitas empezar por el curso más popular. Empieza por la brecha que más limita tu objetivo actual.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-teal-700">Elige tu punto de entrada</p>
            <h2 className="mt-1 text-2xl font-bold text-[#071a4a]">¿Qué necesitas resolver hoy?</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {entryPoints.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link key={item.to} to={item.to} className="group grid min-h-40 gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md sm:grid-cols-[48px_minmax(0,1fr)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <ItemIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-[#071a4a]">{item.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 group-hover:text-teal-900">
                      {item.action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#eef3f8]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-sm font-bold text-indigo-700">Rutas profesionales</p>
                <h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Aprende en el orden que el trabajo lo exige</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Cada ruta combina contexto, competencias, cursos existentes y pasos para construir evidencia.</p>
              </div>
              <Link to="/rutas" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">Ver todas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {paths.map(path => (
                <Link key={path.slug} to={`/rutas/${path.slug}`} className="group flex min-h-60 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                  <Route className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  <p className="mt-5 text-xs font-bold uppercase text-teal-700">{path.career?.name}</p>
                  <h3 className="mt-2 text-lg font-bold leading-6 text-[#071a4a]">{path.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{path.summary}</p>
                  <span className="mt-4 text-xs font-semibold text-slate-500">{path.step_count} pasos · {path.estimated_duration}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <BadgeCheck className="h-7 w-7 text-teal-700" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-[#071a4a]">Cursos con contexto profesional</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Edvanta conserva los cursos de proveedores externos, pero los organiza según las competencias y carreras donde pueden aportar valor.</p>
            <Link to="/cursos" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white hover:bg-[#102862]">Explorar catálogo <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div>
            <Shapes className="h-7 w-7 text-indigo-600" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-[#071a4a]">Competencias reutilizables</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Una misma habilidad puede ser importante en varias carreras. Consulta dónde se usa, qué nivel requiere y qué formación la desarrolla.</p>
            <Link to="/competencias" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-700">Explorar competencias <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
