import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenCheck, BriefcaseBusiness, CheckCircle2, Clock3, Compass, ExternalLink, FolderKanban, RefreshCw, Route } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { getFeaturedCourse, getLearningRoute } from '../data/featuredCourses';
import { updatePageSeo } from '../utils/seo';

const STEP_LABELS = {
  orientation: 'Orientación',
  learning: 'Aprendizaje',
  practice: 'Práctica',
  portfolio: 'Portafolio',
  career: 'Empleabilidad',
  opportunity: 'Oportunidades',
};

const STEP_ICONS = {
  orientation: Compass,
  learning: BookOpenCheck,
  practice: CheckCircle2,
  portfolio: FolderKanban,
  career: BriefcaseBusiness,
  opportunity: BriefcaseBusiness,
};

function buildFallbackPath(slug) {
  const legacy = getLearningRoute(slug);
  if (!legacy) return null;
  const courses = legacy.courseSlugs.map(getFeaturedCourse).filter(Boolean);
  return {
    slug: legacy.slug,
    name: legacy.title,
    summary: legacy.summary,
    audience: 'Profesionales que buscan una secuencia clara para desarrollar competencias aplicables.',
    outcomes: legacy.outcomes,
    estimated_duration: 'Ruta flexible',
    level: 'foundation',
    career: { name: 'Desarrollo profesional', slug: '' },
    steps: courses.map((course, index) => ({
      id: `${legacy.slug}-${course.slug}`,
      step_order: index + 1,
      title: course.title,
      description: course.shortDescription,
      step_type: 'learning',
      is_optional: false,
      skill: null,
      courses: [{
        slug: course.slug,
        title: course.title,
        short_description: course.shortDescription,
        provider: 'edutin',
        image_url: course.image?.webp,
        duration: course.duration,
        affiliate_url: course.affiliateUrl,
      }],
    })),
  };
}

function CourseLink({ course }) {
  return (
    <Link to={`/cursos/${course.slug}`} className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-teal-300 hover:bg-teal-50/30">
      {course.image_url ? (
        <img src={course.image_url} alt="" className="h-14 w-20 rounded-md object-cover" loading="lazy" />
      ) : (
        <span className="inline-flex h-14 w-20 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase text-teal-700">{course.provider}</span>
        <span className="mt-1 block text-sm font-bold leading-5 text-[#071a4a]">{course.title}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
    </Link>
  );
}

export default function RutaProfesionalPage() {
  const { slug } = useParams();
  const [path, setPath] = useState(null);
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
        const response = await fetch(apiUrl(`/api/learning-paths/${encodeURIComponent(slug)}`), { signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 404 ? 'Esta ruta aún no tiene una ficha pública.' : 'No fue posible consultar la ruta.');
        const payload = await response.json();
        setPath(payload.data || null);
      } catch (requestError) {
        if (requestError.name === 'AbortError') return;
        const fallback = buildFallbackPath(slug);
        if (fallback) setPath(fallback);
        else setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [slug, reloadKey]);

  useEffect(() => {
    if (!path) return undefined;
    const canonical = `https://edvanta.co/rutas/${path.slug}`;
    return updatePageSeo({
      title: path.seo_title || `${path.name} | Ruta profesional Edvanta`,
      description: path.seo_description || path.summary,
      canonical,
      jsonLdId: `learning-path-${path.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: path.name,
            description: path.summary,
            provider: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
            hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online' },
            url: canonical,
          },
          {
            '@type': 'ItemList',
            name: `Pasos de ${path.name}`,
            itemListElement: (path.steps || []).map((step, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: step.title,
            })),
          },
        ],
      },
    });
  }, [path]);

  const groupedSteps = useMemo(() => {
    const groups = [];
    for (const step of path?.steps || []) {
      const last = groups[groups.length - 1];
      if (last?.type === step.step_type) last.items.push(step);
      else groups.push({ type: step.step_type, items: [step] });
    }
    return groups;
  }, [path]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f9fc] pt-16">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-8 h-14 max-w-3xl animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-24 max-w-3xl animate-pulse rounded bg-slate-100" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !path) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#f7f9fc] pt-16">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <Route className="mx-auto h-10 w-10 text-teal-700" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-bold text-[#071a4a]">No pudimos abrir esta ruta</h1>
            <p className="mt-3 text-slate-600">{error || 'La ruta solicitada no está disponible.'}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
              </button>
              <Link to="/rutas" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Ver todas
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Migas de pan">
              <Link to="/" className="hover:text-teal-700">Inicio</Link><span>/</span>
              <Link to="/rutas" className="hover:text-teal-700">Rutas</Link><span>/</span>
              <span className="font-semibold text-slate-700">{path.name}</span>
            </nav>

            <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">Ruta para {path.career?.name}</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">{path.name}</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{path.summary}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-teal-700" aria-hidden="true" /> {path.steps?.length || 0} pasos</span>
                  <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-indigo-600" aria-hidden="true" /> {path.estimated_duration}</span>
                </div>
              </div>
              <div className="border-l-4 border-indigo-500 pl-5">
                <p className="text-sm font-bold text-[#071a4a]">Pensada para</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{path.audience}</p>
                {path.career?.slug && (
                  <Link to={`/carreras/${path.career.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">
                    Ver carrera completa <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
          <div>
            <div className="mb-8">
              <p className="text-sm font-bold text-teal-700">Secuencia recomendada</p>
              <h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Del contexto a la oportunidad</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Puedes adaptar el ritmo, pero conviene conservar la lógica de fundamentos, aplicación y evidencia profesional.</p>
            </div>

            <div className="space-y-9">
              {groupedSteps.map((group) => {
                const GroupIcon = STEP_ICONS[group.type] || BookOpenCheck;
                return (
                  <section key={`${group.type}-${group.items[0].step_order}`} aria-labelledby={`group-${group.items[0].step_order}`}>
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-700">
                      <GroupIcon className="h-4 w-4" aria-hidden="true" />
                      <h3 id={`group-${group.items[0].step_order}`}>{STEP_LABELS[group.type] || 'Desarrollo'}</h3>
                    </div>
                    <ol className="space-y-3">
                      {group.items.map((step) => (
                        <li key={step.id} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[48px_minmax(0,1fr)]">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#071a4a] text-sm font-bold text-white">
                            {String(step.step_order).padStart(2, '0')}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-bold text-[#071a4a]">{step.title}</h4>
                              {step.is_optional && <span className="text-xs font-bold text-slate-500">Opcional</span>}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                            {step.skill && <p className="mt-3 text-xs font-bold text-teal-700">Competencia: {step.skill.name}</p>}
                            {(step.courses || []).map(course => <CourseLink key={course.id || course.slug} course={course} />)}
                            {!step.courses?.length && ['portfolio', 'career', 'opportunity'].includes(step.step_type) && (
                              <p className="mt-4 border-l-2 border-slate-200 pl-3 text-xs leading-5 text-slate-500">Este paso queda preparado para herramientas y oportunidades verificadas. No muestra datos de demostracion como si fueran reales.</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold text-[#071a4a]">Lo que deberías demostrar</h2>
              <ul className="mt-4 space-y-3">
                {(path.outcomes || []).map(outcome => (
                  <li key={outcome} className="flex gap-2 text-sm leading-6 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" /> {outcome}
                  </li>
                ))}
              </ul>
            </div>
            <Link to={`/cursos?career=${path.career?.slug || ''}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white hover:bg-[#102862]">
              Explorar cursos relacionados <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/rutas" className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-600 hover:text-teal-700">
              Comparar otras rutas
            </Link>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
