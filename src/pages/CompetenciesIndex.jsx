import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, RefreshCw, Search, Shapes } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';

const TYPE_LABELS = {
  technical: 'Técnicas',
  digital: 'Digitales',
  business: 'Negocio y gestión',
  human: 'Humanas',
};

export default function CompetenciesIndex() {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return updatePageSeo({
      title: 'Competencias para la industria farmacéutica | Edvanta',
      description: 'Explora competencias técnicas, digitales, de negocio y humanas conectadas con carreras, rutas y cursos profesionales.',
      canonical: 'https://edvanta.co/competencias',
      jsonLdId: 'skills-index',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Competencias profesionales Edvanta',
        url: 'https://edvanta.co/competencias',
      },
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(apiUrl('/api/skills'), { signal: controller.signal });
        if (!response.ok) throw new Error('No fue posible consultar las competencias.');
        const payload = await response.json();
        setSkills(Array.isArray(payload.data) ? payload.data : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [reloadKey]);

  const visibleSkills = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return skills.filter(skill => {
      const matchesType = type === 'all' || skill.skill_type === type;
      const haystack = `${skill.name} ${skill.description || ''}`.toLowerCase();
      return matchesType && (!normalized || haystack.includes(normalized));
    });
  }, [skills, query, type]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-sm font-bold uppercase text-teal-700">Mapa de habilidades</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">Comprende qué necesitas aprender y dónde lo vas a usar</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Cada competencia se conecta con las carreras que la requieren, las rutas que la practican y los cursos que la enseñan.</p>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#eef3f8]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <label className="relative flex-1">
              <span className="sr-only">Buscar competencia</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar GMP, Power BI, auditorías..." className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label>
              <span className="sr-only">Tipo de competencia</span>
              <select value={type} onChange={event => setType(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 lg:w-60">
                <option value="all">Todos los tipos</option>
                {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-teal-700">{loading ? 'Consultando el mapa' : `${visibleSkills.length} competencias`}</p>
              <h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Explora por habilidad</h2>
            </div>
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">Ver por carrera <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 9 }).map((_, index) => <div key={index} className="h-52 animate-pulse rounded-lg border border-slate-200 bg-white" />)}</div>
          ) : error ? (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
              <RefreshCw className="mx-auto h-9 w-9 text-teal-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-[#071a4a]">No pudimos cargar el mapa de competencias</h2>
              <p className="mt-2 text-sm text-slate-600">{error}</p>
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Reintentar</button>
            </div>
          ) : visibleSkills.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleSkills.map(skill => (
                <Link key={skill.slug} to={`/competencias/${skill.slug}`} className="group flex min-h-52 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Shapes className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="text-xs font-bold text-indigo-700">{TYPE_LABELS[skill.skill_type] || skill.skill_type}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#071a4a] group-hover:text-teal-800">{skill.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{skill.description}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="h-4 w-4" aria-hidden="true" /> {skill.career_count} carreras</span>
                    <span className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4" aria-hidden="true" /> {skill.verified_course_count} cursos verificados</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
              <Shapes className="mx-auto h-9 w-9 text-teal-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-[#071a4a]">No encontramos coincidencias</h2>
              <button type="button" onClick={() => { setQuery(''); setType('all'); }} className="mt-5 text-sm font-bold text-teal-700">Limpiar filtros</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
