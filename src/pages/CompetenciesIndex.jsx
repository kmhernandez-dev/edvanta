import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BookOpenCheck, BriefcaseBusiness, Compass, RefreshCw, Route, Search, Shapes, Target } from 'lucide-react';
import { HeroRuta } from '../components/edvanta/heroes';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
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
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <HeroRuta
          eyebrow="Mapa de habilidades"
          title="Comprende qué necesitas aprender y dónde lo vas a usar"
          highlight="dónde lo vas a usar"
          lead="Cada competencia se conecta con las carreras que la requieren, las rutas que la practican y los cursos que la enseñan."
          steps={[
            { icon: Target, title: 'Competencia', desc: 'Qué debes saber hacer' },
            { icon: Compass, title: 'Carreras', desc: 'Dónde se pide' },
            { icon: Route, title: 'Rutas', desc: 'Dónde se practica' },
            { icon: BookOpen, title: 'Cursos', desc: 'Dónde se aprende' },
          ]}
        />

        <section className="border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <label className="relative flex-1">
              <span className="sr-only">Buscar competencia</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar GMP, Power BI, auditorías..." className="min-h-11 w-full rounded-lg border border-edvanta-border bg-white pl-10 pr-4 text-sm outline-none focus:border-edvanta-teal focus:ring-2 focus:ring-teal-100" />
            </label>
            <label>
              <span className="sr-only">Tipo de competencia</span>
              <select value={type} onChange={event => setType(event.target.value)} className="min-h-11 w-full rounded-lg border border-edvanta-border bg-white px-3 text-sm text-edvanta-muted outline-none focus:border-edvanta-teal focus:ring-2 focus:ring-teal-100 lg:w-60">
                <option value="all">Todos los tipos</option>
                {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-edvanta-tealdark">{loading ? 'Consultando el mapa' : `${visibleSkills.length} competencias`}</p>
              <h2 className="mt-1 text-2xl font-bold text-edvanta-deep">Explora por habilidad</h2>
            </div>
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-edvanta-tealdark hover:text-teal-900">Ver por carrera <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 9 }).map((_, index) => <div key={index} className="h-52 animate-pulse ds-card" />)}</div>
          ) : error ? (
            <div className="ds-card px-6 py-16 text-center">
              <RefreshCw className="mx-auto h-9 w-9 text-edvanta-tealdark" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-edvanta-deep">No pudimos cargar el mapa de competencias</h2>
              <p className="mt-2 text-sm text-edvanta-muted">{error}</p>
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="ed-btn ed-btn--primary mt-5">Reintentar</button>
            </div>
          ) : visibleSkills.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleSkills.map(skill => (
                <Link key={skill.slug} to={`/competencias/${skill.slug}`} className="group flex min-h-52 flex-col ds-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-edvanta-teal hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-edvanta-mint text-edvanta-tealdark"><Shapes className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="text-xs font-bold text-indigo-700">{TYPE_LABELS[skill.skill_type] || skill.skill_type}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-edvanta-deep group-hover:text-edvanta-tealdark">{skill.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{skill.description}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-edvanta-border pt-4 text-xs font-semibold text-edvanta-subtle">
                    <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="h-4 w-4" aria-hidden="true" /> {skill.career_count} carreras</span>
                    <span className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4" aria-hidden="true" /> {skill.verified_course_count} cursos verificados</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="ds-card px-6 py-16 text-center">
              <Shapes className="mx-auto h-9 w-9 text-edvanta-tealdark" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-edvanta-deep">No encontramos coincidencias</h2>
              <button type="button" onClick={() => { setQuery(''); setType('all'); }} className="mt-5 text-sm font-bold text-edvanta-tealdark">Limpiar filtros</button>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
