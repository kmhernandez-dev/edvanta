import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenCheck, BriefcaseBusiness, RefreshCw, Route, Shapes } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExternalCourseCard from '../components/ExternalCourseCard';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const TYPE_LABELS = {
  technical: 'Competencia técnica',
  digital: 'Competencia digital',
  business: 'Competencia de negocio y gestión',
  human: 'Competencia humana',
};

const LEVEL_LABELS = {
  foundation: 'Fundamentos',
  working: 'Aplicación práctica',
  advanced: 'Dominio avanzado',
};

export default function CompetencyPage() {
  const { slug } = useParams();
  const [skill, setSkill] = useState(null);
  const [careers, setCareers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(apiUrl(`/api/skills/${encodeURIComponent(slug)}`), { signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 404 ? 'Esta competencia aún no tiene una ficha pública.' : 'No fue posible consultar la competencia.');
        const payload = await response.json();
        setSkill(payload.data || null);
        setCareers(Array.isArray(payload.careers) ? payload.careers : []);
        setCourses(Array.isArray(payload.courses) ? payload.courses : []);
        setPaths(Array.isArray(payload.learning_paths) ? payload.learning_paths : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [slug, reloadKey]);

  useEffect(() => {
    if (!skill) return undefined;
    trackEvent('skill_viewed', { skill: skill.slug });
    return updatePageSeo({
      title: `${skill.name}: carreras, cursos y rutas | Edvanta`,
      description: `${skill.description} Descubre qué carreras requieren ${skill.name}, qué nivel necesitas y qué formación puede ayudarte a desarrollarla.`,
      canonical: `https://edvanta.co/competencias/${skill.slug}`,
      jsonLdId: 'skill-detail',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: skill.name,
        description: skill.description,
        inDefinedTermSet: 'Competencias profesionales Edvanta',
        url: `https://edvanta.co/competencias/${skill.slug}`,
      },
    });
  }, [skill]);

  if (loading) {
    return <><Header /><main className="min-h-screen bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="h-5 w-48 animate-pulse rounded bg-slate-200" /><div className="mt-8 h-14 max-w-3xl animate-pulse rounded bg-slate-200" /><div className="mt-5 h-20 max-w-3xl animate-pulse rounded bg-slate-100" /></div></main><Footer /></>;
  }

  if (error || !skill) {
    return (
      <><Header /><main className="min-h-[70vh] bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6"><Shapes className="mx-auto h-10 w-10 text-teal-700" aria-hidden="true" /><h1 className="mt-5 text-3xl font-bold text-[#071a4a]">No pudimos abrir esta competencia</h1><p className="mt-3 text-slate-600">{error || 'La ficha no está disponible.'}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => setReloadKey(value => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white"><RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar</button><Link to="/competencias" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Ver todas</Link></div></div></main><Footer /></>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Migas de pan"><Link to="/" className="hover:text-teal-700">Inicio</Link><span>/</span><Link to="/competencias" className="hover:text-teal-700">Competencias</Link><span>/</span><span className="font-semibold text-slate-700">{skill.name}</span></nav>
            <div className="mt-9 max-w-4xl">
              <p className="text-sm font-bold uppercase text-teal-700">{TYPE_LABELS[skill.skill_type] || 'Competencia profesional'}</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">{skill.name}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{skill.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-2xl"><div className="flex items-center gap-3"><BriefcaseBusiness className="h-6 w-6 text-teal-700" aria-hidden="true" /><h2 className="text-2xl font-bold text-[#071a4a]">Carreras que requieren esta competencia</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">El nivel esperado cambia según el rol. Revisa cada carrera antes de elegir una formación.</p></div>
          {careers.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {careers.map(career => <Link key={career.slug} to={`/carreras/${career.slug}`} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"><p className="text-xs font-bold uppercase text-teal-700">{career.family}</p><h3 className="mt-2 text-lg font-bold text-[#071a4a]">{career.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{career.headline}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-xs font-semibold text-slate-500">Nivel: {LEVEL_LABELS[career.required_level] || career.required_level}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">Ver carrera <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span></div></Link>)}
            </div>
          ) : <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Todavía no hay carreras publicadas asociadas con esta competencia.</p>}
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-3"><BookOpenCheck className="h-6 w-6 text-indigo-600" aria-hidden="true" /><h2 className="text-2xl font-bold text-[#071a4a]">Cursos verificados que la desarrollan</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">La relación se basa en cobertura de competencia, no solo en coincidencias de título.</p></div><Link to={`/cursos?skill=${skill.slug}`} className="text-sm font-bold text-teal-700">Ver catálogo filtrado</Link></div>
            {courses.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{courses.map(course => <ExternalCourseCard key={course.id} course={course} />)}</div> : <p className="rounded-lg border border-slate-200 bg-[#f7f9fc] p-5 text-sm text-slate-600">Aún no hay cursos con relación editorial verificada. Edvanta no mostrará coincidencias automáticas como recomendaciones confirmadas.</p>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-center gap-3"><Route className="h-6 w-6 text-teal-700" aria-hidden="true" /><h2 className="text-2xl font-bold text-[#071a4a]">Rutas donde la practicarás</h2></div>
          {paths.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{paths.map(path => <Link key={`${path.slug}-${path.step_order}`} to={`/rutas/${path.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"><p className="text-xs font-bold text-indigo-700">Paso {String(path.step_order).padStart(2, '0')}</p><h3 className="mt-2 text-lg font-bold text-[#071a4a]">{path.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{path.summary}</p></Link>)}</div> : <p className="text-sm text-slate-600">Esta competencia aún no forma parte de una ruta publicada.</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}
