import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExternalCourseCard from '../components/ExternalCourseCard';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { BookOpenCheck } from 'lucide-react';

const PROVIDER_LABELS = {
  edutin: 'Edutin',
  coursera: 'Coursera',
  udemy: 'Udemy',
};

const PROVIDER_STYLES = {
  edutin: 'bg-teal-100 text-teal-800 border-teal-200',
  coursera: 'bg-blue-100 text-blue-800 border-blue-200',
  udemy: 'bg-purple-100 text-purple-800 border-purple-200',
};

const PRICE_TYPE_LABELS = {
  free: 'Gratis',
  free_audit: 'Auditoría gratuita',
  paid: 'De pago',
  subscription: 'Suscripción',
  financial_aid: 'Ayuda financiera',
  unknown: 'Consultar',
};

const LEVEL_LABELS = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  mixed: 'Mixto',
};

export default function CursosCatalog({ defaultProvider = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filterOptions, setFilterOptions] = useState({
    providers: [],
    categories: [],
    professional_areas: [],
    languages: [],
    levels: [],
    price_types: [],
    careers: [],
    skills: [],
  });

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [provider, setProvider] = useState(searchParams.get('provider') || defaultProvider);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [professionalArea, setProfessionalArea] = useState(searchParams.get('area') || '');
  const [career, setCareer] = useState(searchParams.get('career') || '');
  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [priceType, setPriceType] = useState(searchParams.get('price_type') || '');
  const [certificate, setCertificate] = useState(searchParams.get('certificate') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const pageTitle = defaultProvider
    ? `Cursos de ${PROVIDER_LABELS[defaultProvider] || defaultProvider} | Edvanta`
    : 'Cursos profesionales recomendados | Edvanta';

  const pageDescription = defaultProvider
    ? `Explora cursos de ${PROVIDER_LABELS[defaultProvider] || defaultProvider} en farmacia, calidad, datos, IA, gestión de proyectos y más. Organizados por categoría profesional.`
    : 'Explora cursos de Coursera, Udemy y Edutin en farmacia, calidad, datos, IA, gestión de proyectos y más. Organizados por categoría profesional.';

  useEffect(() => {
    updatePageSeo({
      title: pageTitle,
      description: pageDescription,
      canonical: `https://edvanta.co/cursos${defaultProvider ? `/${defaultProvider}` : ''}`,
      jsonLdId: 'courses-catalog',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        url: `https://edvanta.co/cursos${defaultProvider ? `/${defaultProvider}` : ''}`,
        publisher: { '@type': 'Organization', name: 'Edvanta' },
      },
    });
  }, [defaultProvider, pageTitle, pageDescription]);

  // Load filter options
  useEffect(() => {
    fetch(apiUrl('/api/courses/filters/options'))
      .then(r => r.json())
      .then(d => { if (d.ok) setFilterOptions(d.data); })
      .catch(() => {});
  }, []);

  // Sync URL params
  const syncUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Fetch courses
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (provider) params.set('provider', provider);
    if (category) params.set('category', category);
    if (professionalArea) params.set('professional_area', professionalArea);
    if (career) params.set('career', career);
    if (skill) params.set('skill', skill);
    if (language) params.set('language', language);
    if (level) params.set('level', level);
    if (priceType) params.set('price_type', priceType);
    if (certificate === 'true') params.set('certificate_available', 'true');
    params.set('page', String(page));
    params.set('limit', '20');

    fetch(apiUrl(`/api/courses?${params.toString()}`))
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setCourses(d.data);
          setPagination(d.pagination);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, provider, category, professionalArea, career, skill, language, level, priceType, certificate, page]);

  const handleFilterChange = (setter, key) => (value) => {
    setter(value);
    setPage(1);
    syncUrl({ [key]: value, page: null });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    syncUrl({ q: search, page: null });
  };

  const clearFilters = () => {
    setSearch('');
    setProvider(defaultProvider);
    setCategory('');
    setProfessionalArea('');
    setCareer('');
    setSkill('');
    setLanguage('');
    setLevel('');
    setPriceType('');
    setCertificate('');
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const hasFilters = search || (provider && !defaultProvider) || category || professionalArea || career || skill || language || level || priceType || certificate;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase text-teal-700">
                {defaultProvider ? PROVIDER_LABELS[defaultProvider] : 'Catálogo multi-plataforma'}
              </p>
              <h1 className="text-3xl font-bold text-[#071a4a] md:text-5xl">
                {defaultProvider
                  ? `Cursos de ${PROVIDER_LABELS[defaultProvider]}`
                  : 'Cursos profesionales recomendados'}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                {defaultProvider
                  ? `Explora nuestra selección de cursos de ${PROVIDER_LABELS[defaultProvider]} en farmacia, calidad, datos, IA, gestión de proyectos y más.`
                  : 'Cursos profesionales organizados por categoría y área de la industria farmacéutica, sin importar quién los dicte.'}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-gray-200 bg-white sticky top-16 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col gap-3">
              {/* Search bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setPage(1); syncUrl({ q: search, page: null }); } }}
                  placeholder="Buscar curso por título, categoría, instructor..."
                  className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
                <button type="button" onClick={() => { setPage(1); syncUrl({ q: search, page: null }); }}
                  className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shrink-0">
                  Buscar
                </button>
              </div>

              {/* Filter grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <select value={category} onChange={e => handleFilterChange(setCategory, 'category')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todas las categorías</option>
                  {filterOptions.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select value={career} onChange={e => handleFilterChange(setCareer, 'career')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todas las carreras</option>
                  {(filterOptions.careers || []).map(item => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>

                <select value={skill} onChange={e => handleFilterChange(setSkill, 'skill')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todas las competencias</option>
                  {(filterOptions.skills || []).map(item => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>

                <select value={language} onChange={e => handleFilterChange(setLanguage, 'language')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todos los idiomas</option>
                  {filterOptions.languages.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                <select value={level} onChange={e => handleFilterChange(setLevel, 'level')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todos los niveles</option>
                  {filterOptions.levels.map(l => (
                    <option key={l} value={l}>{LEVEL_LABELS[l] || l}</option>
                  ))}
                </select>

                <select value={priceType} onChange={e => handleFilterChange(setPriceType, 'price_type')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todos los tipos de acceso</option>
                  {filterOptions.price_types.map(p => (
                    <option key={p} value={p}>{PRICE_TYPE_LABELS[p] || p}</option>
                  ))}
                </select>

                <select value={certificate} onChange={e => handleFilterChange(setCertificate, 'certificate')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Certificado: todos</option>
                  <option value="true">Con certificado</option>
                </select>

                {hasFilters && (
                  <button type="button" onClick={clearFilters}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors">
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? 'Cargando...' : `${pagination.total} curso${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-gray-100 bg-white">
                    <div className="aspect-[16/9] bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-slate-50 py-16 text-center">
                <BookOpenCheck className="mx-auto mb-3 h-9 w-9 text-teal-700" aria-hidden="true" />
                <p className="font-semibold text-navy-950">No encontramos cursos con esos filtros.</p>
                <p className="mt-1 text-sm text-gray-500">Prueba con otros filtros o una búsqueda más amplia.</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700">
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map(course => (
                  <ExternalCourseCard key={course.id} course={course} hideProvider={!defaultProvider} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); syncUrl({ page: String(Math.max(1, page - 1)) }); }}
                  disabled={page === 1}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-40 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-500">Página {pagination.page} de {pagination.totalPages}</span>
                <button
                  onClick={() => { setPage(p => Math.min(pagination.totalPages, p + 1)); syncUrl({ page: String(Math.min(pagination.totalPages, page + 1)) }); }}
                  disabled={page === pagination.totalPages}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-40 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Transparencia de afiliados:</strong> Algunos enlaces de esta página son enlaces de afiliado. Edvanta puede recibir una comisión si realizas una compra, sin costo adicional para ti.
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                El curso, el acceso, el precio, el certificado y las condiciones dependen de la plataforma correspondiente (Coursera, Udemy, Edutin). Edvanta no emite certificados de estas plataformas. Los precios en Udemy pueden variar según promociones vigentes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
