import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenCheck, Building2, CheckCircle2, Compass, RefreshCw, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const skillTypeLabels = {
  technical: 'Conocimiento técnico',
  digital: 'Competencias digitales',
  business: 'Negocio y gestión',
  human: 'Habilidades humanas',
};

const levelLabels = {
  foundation: 'Fundamentos',
  working: 'Aplicación práctica',
  advanced: 'Dominio avanzado',
};

export default function CareerPage() {
  const { slug } = useParams();
  const [career, setCareer] = useState(null);
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
        const response = await fetch(apiUrl(`/api/careers/${encodeURIComponent(slug)}`), { signal: controller.signal });
        if (response.status === 404) throw new Error('Esta carrera todavía no tiene una ficha pública.');
        if (!response.ok) throw new Error('No fue posible consultar la ficha profesional.');
        const payload = await response.json();
        setCareer(payload.data || null);
        setCourses(Array.isArray(payload.recommended_courses) ? payload.recommended_courses : []);
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
    if (!career) return undefined;
    trackEvent('career_viewed', { career: career.slug });
    const description = career.seo_description || career.summary;
    return updatePageSeo({
      title: career.seo_title || `${career.name} | Carreras Edvanta`,
      description,
      canonical: `https://edvanta.co/carreras/${career.slug}`,
      keywords: [career.name, career.family?.name, ...(career.skills || []).slice(0, 5).map(skill => skill.name)],
      jsonLdId: 'career-detail',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Occupation',
        name: career.name,
        description,
        occupationalCategory: career.family?.name,
        skills: (career.skills || []).map(skill => skill.name).join(', '),
        url: `https://edvanta.co/carreras/${career.slug}`,
      },
    });
  }, [career]);

  const skillGroups = useMemo(() => {
    const groups = {};
    for (const skill of career?.skills || []) {
      const type = skill.type || 'technical';
      if (!groups[type]) groups[type] = [];
      groups[type].push(skill);
    }
    return groups;
  }, [career]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f9fc] pt-16">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />
            <div className="mt-8 h-14 max-w-3xl animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-24 max-w-3xl animate-pulse rounded bg-slate-100" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !career) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#f7f9fc] pt-16">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <Compass className="mx-auto h-10 w-10 text-teal-700" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-bold text-[#071a4a]">No pudimos abrir esta carrera</h1>
            <p className="mt-3 text-slate-600">{error || 'La ficha solicitada no está disponible.'}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
              </button>
              <Link to="/carreras" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700">
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
              <Link to="/carreras" className="hover:text-teal-700">Carreras</Link><span>/</span>
              <span className="font-semibold text-slate-700">{career.name}</span>
            </nav>

            <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase text-teal-700">{career.family?.name}</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">{career.name}</h1>
                <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-slate-700">{career.headline}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{career.summary}</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-5">
                <p className="text-sm font-bold text-[#071a4a]">Empieza con una visión completa</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Revisa las funciones, habilidades y contextos de trabajo antes de elegir cursos.</p>
                <a href="#habilidades" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">
                  Ver habilidades <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-teal-700" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#071a4a]">Qué es esta carrera</h2>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-600">{career.what_it_is}</p>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <BookOpenCheck className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#071a4a]">Perfil recomendado</h2>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-600">{career.recommended_profile}</p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-[#071a4a]">Qué podrías hacer</h2>
              <ul className="mt-5 space-y-3">
                {(career.responsibilities || []).map(item => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[#071a4a]">Dónde se desarrolla</h2>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {(career.workplaces || []).map(item => <li key={item} className="border-l-2 border-indigo-200 pl-3 text-sm font-semibold leading-6 text-slate-700">{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="habilidades" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-teal-700">Mapa de competencias</p>
            <h2 className="mt-2 text-3xl font-bold text-[#071a4a]">Habilidades que conviene desarrollar</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">El nivel indica hasta dónde conviene avanzar para desempeñarte con autonomía creciente. No es un requisito de contratación ni una promesa de empleo.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {Object.entries(skillGroups).map(([type, skills]) => (
              <section key={type} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-bold text-[#071a4a]">{skillTypeLabels[type] || 'Otras habilidades'}</h3>
                <div className="mt-4 divide-y divide-slate-100">
                  {skills.map(skill => (
                    <div key={skill.slug} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-slate-800">{skill.name}</p>
                        <span className="shrink-0 rounded-full bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-800">{levelLabels[skill.required_level] || skill.required_level}</span>
                      </div>
                      {skill.description && <p className="mt-1 text-sm leading-6 text-slate-600">{skill.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#071a4a]">Cómo empezar a prepararte</h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">{career.entry_guidance}</p>

            {paths.length > 0 && (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {paths.map(path => (
                  <Link key={path.id} to={`/rutas/${path.slug}`} className="rounded-lg border border-slate-200 p-5 hover:border-teal-300">
                    <p className="text-xs font-bold uppercase text-teal-700">Ruta profesional</p>
                    <h3 className="mt-2 text-lg font-bold text-[#071a4a]">{path.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{path.summary}</p>
                  </Link>
                ))}
              </div>
            )}

            {courses.length > 0 ? (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-[#071a4a]">Cursos relacionados verificados</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map(course => (
                    <Link key={course.id} to={`/cursos/${course.slug}`} className="rounded-lg border border-slate-200 p-5 hover:border-teal-300">
                      <p className="text-xs font-bold uppercase text-teal-700">{course.provider}</p>
                      <h4 className="mt-2 font-bold text-[#071a4a]">{course.title}</h4>
                      <p className="mt-2 text-xs text-slate-500">{course.matching_skills} habilidades relacionadas</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-5 py-4">
                <p className="font-bold text-amber-950">Selección editorial de cursos en preparación</p>
                <p className="mt-1 text-sm leading-6 text-amber-900">Solo mostraremos cursos cuando su relación con estas habilidades haya sido revisada. Mientras tanto, puedes explorar el catálogo completo.</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cursos" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white hover:bg-[#0d2d6d]">
                Explorar cursos <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/carreras" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Comparar otras carreras
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-9 text-xs leading-5 text-slate-500 sm:px-6 lg:px-8">
          <p>Contenido de orientación educativa. Las funciones y requisitos concretos pueden variar según país, empresa, producto y nivel de responsabilidad. Edvanta no garantiza contratación, salario ni resultados profesionales.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
