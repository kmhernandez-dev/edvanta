import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, BookOpenCheck, Compass, RefreshCw, Route, Search, Target } from 'lucide-react';
import { Btn } from '../components/edvanta/ui';
import { HeroRuta } from '../components/edvanta/heroes';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { apiUrl } from '../config/api';
import { learningRoutes } from '../data/featuredCourses';
import { portadaDeRuta } from '../data/edvanta/imagenes';
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
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <HeroRuta
          eyebrow="Aprende con dirección"
          title="Rutas para construir una carrera, no solo acumular cursos"
          highlight="construir una carrera"
          lead="Cada recorrido conecta lo que una carrera exige con competencias, formación, práctica y evidencia que puedes mostrar."
          actions={(
            <>
              <Btn href="#rutas" size="lg" iconRight={ArrowRight}>Ver las rutas</Btn>
              <Btn to="/carreras" variant="secondary" size="lg">Explorar carreras</Btn>
            </>
          )}
          steps={[
            { icon: Compass, title: 'Carrera', desc: 'Lo que exige el cargo' },
            { icon: Target, title: 'Competencias', desc: 'Lo que necesitas saber' },
            { icon: BookOpen, title: 'Formación', desc: 'Cursos y práctica' },
            { icon: Award, title: 'Evidencia', desc: 'Lo que puedes mostrar' },
          ]}
        />

        <section id="rutas" className="scroll-mt-28 border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <label className="relative flex-1">
              <span className="sr-only">Buscar una ruta</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Buscar por carrera o competencia"
                className="min-h-11 w-full rounded-lg border border-edvanta-border bg-white pl-10 pr-4 text-sm text-edvanta-deep outline-none focus:border-edvanta-teal focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label>
              <span className="sr-only">Filtrar por familia</span>
              <select
                value={family}
                onChange={event => setFamily(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-edvanta-border bg-white px-3 text-sm text-edvanta-muted outline-none focus:border-edvanta-teal focus:ring-2 focus:ring-teal-100 lg:w-64"
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
              <p className="text-sm font-bold text-edvanta-tealdark">{loading ? 'Consultando rutas' : `${visiblePaths.length} rutas disponibles`}</p>
              <h2 className="mt-1 text-2xl font-bold text-edvanta-deep">Elige tu siguiente recorrido</h2>
            </div>
            {usingFallback && (
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-edvanta-border bg-white px-4 text-sm font-bold text-edvanta-muted hover:border-edvanta-teal hover:text-edvanta-tealdark">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Actualizar catalogo
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse ds-card" />)}
            </div>
          ) : visiblePaths.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visiblePaths.map((path) => (
                <Link key={path.slug} to={`/rutas/${path.slug}`} className="group flex min-h-64 flex-col overflow-hidden rounded-2xl border border-edvanta-border bg-white shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]">
                  {portadaDeRuta(path.slug) && (
                    <div className="aspect-[3/2] overflow-hidden bg-edvanta-bg">
                      <img src={portadaDeRuta(path.slug)} alt={`Ruta de aprendizaje: ${path.name || path.title}`} width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-edvanta-mint text-edvanta-tealdark">
                      <Route className="h-5 w-5" aria-hidden="true" />
                    </span>
                    {path.featured && <span className="text-xs font-bold text-indigo-700">Ruta prioritaria</span>}
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase text-edvanta-tealdark">{path.career?.name}</p>
                  <h3 className="mt-2 text-xl font-bold leading-7 text-edvanta-deep group-hover:text-edvanta-tealdark">{path.name || path.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-edvanta-muted">{path.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-edvanta-border pt-4 text-xs font-semibold text-edvanta-subtle">
                    <span className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4" aria-hidden="true" /> {path.step_count} pasos</span>
                    <span className="inline-flex items-center gap-1.5"><Compass className="h-4 w-4" aria-hidden="true" /> {path.estimated_duration}</span>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="ds-card px-6 py-16 text-center">
              <Compass className="mx-auto h-9 w-9 text-edvanta-tealdark" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-edvanta-deep">No encontramos una ruta con esos filtros</h2>
              <button type="button" onClick={() => { setQuery(''); setFamily('all'); }} className="mt-5 text-sm font-bold text-edvanta-tealdark hover:text-teal-900">Ver todas las rutas</button>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
