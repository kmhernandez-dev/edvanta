import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Compass, RefreshCw, Route, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { learningRoutes } from '../data/featuredCourses';
import { updatePageSeo } from '../utils/seo';

const fallbackPaths = learningRoutes.map((path) => ({
  ...path,
  name: path.title,
  estimated_duration: 'Ruta flexible',
  step_count: path.courseSlugs.length,
  career: { name: 'Desarrollo profesional', family: 'Formacion transversal' },
}));

export default function LearningPathsIndex() {
  const [paths, setPaths] = useState([]);
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return updatePageSeo({
      title: 'Rutas profesionales para quimicos farmaceuticos | Edvanta',
      description: 'Explora rutas de aprendizaje conectadas con carreras, competencias, cursos y proyectos para construir tu perfil profesional farmacéutico.',
      canonical: 'https://edvanta.co/rutas',
      jsonLdId: 'learning-paths-index',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Rutas profesionales Edvanta',
        url: 'https://edvanta.co/rutas',
      },
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl('/api/learning-paths'), { signal: controller.signal });
        if (!response.ok) throw new Error('Rutas no disponibles');
        const payload = await response.json();
        const items = Array.isArray(payload.data) ? payload.data : [];
        if (!items.length) throw new Error('Catalogo pendiente');
        setPaths(items);
        setUsingFallback(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPaths(fallbackPaths);
          setUsingFallback(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [reloadKey]);

  const families = useMemo(() => {
    return [...new Set(paths.map(path => path.career?.family).filter(Boolean))];
  }, [paths]);

  const visiblePaths = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return paths.filter((path) => {
      const matchesFamily = family === 'all' || path.career?.family === family;
      const haystack = `${path.name || path.title} ${path.summary || ''} ${path.career?.name || ''}`.toLowerCase();
      return matchesFamily && (!normalized || haystack.includes(normalized));
    });
  }, [paths, query, family]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-bold uppercase text-teal-700">Aprende con dirección</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">
                Rutas para construir una carrera, no solo acumular cursos
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Cada recorrido conecta lo que una carrera exige con competencias, formación, práctica y evidencia que puedes mostrar.
              </p>
            </div>
            <div className="border-l-4 border-teal-500 pl-5 lg:self-end">
              <p className="text-sm font-bold text-[#071a4a]">Empieza por tu objetivo profesional</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Revisa una carrera si aún no sabes qué ruta elegir. Verás sus funciones, habilidades y cursos relacionados.
              </p>
              <Link to="/carreras" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">
                Explorar carreras <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#eef3f8]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <label className="relative flex-1">
              <span className="sr-only">Buscar una ruta</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Buscar por carrera o competencia"
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label>
              <span className="sr-only">Filtrar por familia</span>
              <select
                value={family}
                onChange={event => setFamily(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 lg:w-64"
              >
                <option value="all">Todas las familias</option>
                {families.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-teal-700">{loading ? 'Consultando rutas' : `${visiblePaths.length} rutas disponibles`}</p>
              <h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Elige tu siguiente recorrido</h2>
            </div>
            {usingFallback && (
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-600 hover:text-teal-700">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Actualizar catalogo
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white" />)}
            </div>
          ) : visiblePaths.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visiblePaths.map((path) => (
                <Link key={path.slug} to={`/rutas/${path.slug}`} className="group flex min-h-64 flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                      <Route className="h-5 w-5" aria-hidden="true" />
                    </span>
                    {path.featured && <span className="text-xs font-bold text-indigo-700">Ruta prioritaria</span>}
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase text-teal-700">{path.career?.name}</p>
                  <h3 className="mt-2 text-xl font-bold leading-7 text-[#071a4a] group-hover:text-teal-800">{path.name || path.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{path.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4" aria-hidden="true" /> {path.step_count} pasos</span>
                    <span className="inline-flex items-center gap-1.5"><Compass className="h-4 w-4" aria-hidden="true" /> {path.estimated_duration}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
              <Compass className="mx-auto h-9 w-9 text-teal-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-[#071a4a]">No encontramos una ruta con esos filtros</h2>
              <button type="button" onClick={() => { setQuery(''); setFamily('all'); }} className="mt-5 text-sm font-bold text-teal-700 hover:text-teal-900">Ver todas las rutas</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
