import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, RefreshCw, Search, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';

const seoDescription = 'Explora carreras de la industria farmacéutica, compara habilidades y encuentra una ruta de aprendizaje clara para fortalecer tu perfil profesional.';

function CareerCard({ career }) {
  const visibleSkills = Array.isArray(career.skills) ? career.skills.slice(0, 4) : [];

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-md">
      <p className="text-xs font-bold uppercase text-teal-700">{career.family?.name}</p>
      <h2 className="mt-2 text-xl font-bold text-[#071a4a]">{career.name}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{career.headline}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{career.summary}</p>

      {visibleSkills.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold text-slate-500">Habilidades clave</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {visibleSkills.map(skill => (
              <span key={skill.slug} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <Link
        to={`/carreras/${career.slug}`}
        className="mt-5 inline-flex min-h-11 items-center justify-between rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white transition hover:bg-[#0d2d6d] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        Explorar esta carrera <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function CareersIndex() {
  const [careers, setCareers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => updatePageSeo({
    title: 'Carreras en la industria farmacéutica | Edvanta',
    description: seoDescription,
    canonical: 'https://edvanta.co/carreras',
    keywords: ['carreras farmacéuticas', 'industria farmacéutica', 'habilidades profesionales', 'rutas de aprendizaje'],
    jsonLdId: 'careers-index',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Carreras en la industria farmacéutica',
      description: seoDescription,
      url: 'https://edvanta.co/carreras',
      isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: 'https://edvanta.co' },
    },
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (family) params.set('family', family);

      try {
        const [careerResponse, familyResponse] = await Promise.all([
          fetch(apiUrl(`/api/careers${params.size ? `?${params}` : ''}`), { signal: controller.signal }),
          fetch(apiUrl('/api/careers/filters/options'), { signal: controller.signal }),
        ]);
        if (!careerResponse.ok || !familyResponse.ok) throw new Error('No fue posible consultar el explorador profesional.');
        const [careerPayload, familyPayload] = await Promise.all([careerResponse.json(), familyResponse.json()]);
        setCareers(Array.isArray(careerPayload.data) ? careerPayload.data : []);
        setFamilies(Array.isArray(familyPayload.data) ? familyPayload.data : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, family, reloadKey]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-700">
                <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
                Explorador profesional
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">
                Encuentra un camino profesional que puedas construir
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Conoce qué hace cada área de la industria farmacéutica, qué habilidades necesita y por dónde conviene empezar a formarte.
              </p>
            </div>

            <div className="mt-9 max-w-3xl">
              <label htmlFor="career-search" className="mb-2 block text-sm font-bold text-[#071a4a]">
                Buscar por carrera o habilidad
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="career-search"
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Ejemplo: validaciones, farmacovigilancia, datos..."
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtrar por familia profesional
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Familias profesionales">
            <button
              type="button"
              onClick={() => setFamily('')}
              aria-pressed={!family}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition ${!family ? 'border-[#071a4a] bg-[#071a4a] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400'}`}
            >
              Todas
            </button>
            {families.map(item => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setFamily(item.slug)}
                aria-pressed={family === item.slug}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition ${family === item.slug ? 'border-[#071a4a] bg-[#071a4a] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400'}`}
              >
                {item.name} ({item.career_count})
              </button>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#071a4a]">Carreras para explorar</h2>
              {!loading && !error && <p className="mt-1 text-sm text-slate-500">{careers.length} resultados editoriales</p>}
            </div>
          </div>

          {loading && (
            <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Cargando carreras">
              {[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white" />)}
            </div>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
              <p className="font-bold text-amber-900">El explorador no está disponible en este momento.</p>
              <p className="mt-1 text-sm text-amber-800">{error}</p>
              <button type="button" onClick={() => setReloadKey(value => value + 1)} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 text-sm font-bold text-amber-900">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
              </button>
            </div>
          )}

          {!loading && !error && careers.length > 0 && (
            <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
              {careers.map(career => <CareerCard key={career.id} career={career} />)}
            </div>
          )}

          {!loading && !error && careers.length === 0 && (
            <div className="mt-6 border-y border-slate-200 py-14 text-center">
              <p className="text-lg font-bold text-[#071a4a]">No encontramos una carrera con esos criterios.</p>
              <p className="mt-2 text-sm text-slate-600">Prueba otra habilidad o vuelve a consultar todas las familias.</p>
              <button type="button" onClick={() => { setQuery(''); setFamily(''); }} className="mt-5 min-h-10 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white">
                Limpiar filtros
              </button>
            </div>
          )}
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-[#071a4a]">¿Todavía no sabes qué área elegir?</h2>
              <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">Revisa los cursos disponibles para detectar los temas que más te interesan y construir una base antes de especializarte.</p>
            </div>
            <Link to="/cursos" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#071a4a] px-5 text-sm font-bold text-[#071a4a] hover:bg-slate-50">
              Explorar cursos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
