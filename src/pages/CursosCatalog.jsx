import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import CourseCarousel from '../components/CourseCarousel';
import ExternalCourseCard from '../components/ExternalCourseCard';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { ArrowRight, BookOpenCheck, CalendarClock, Compass, Lightbulb, TrendingUp } from 'lucide-react';
import { Btn } from '../components/edvanta/ui';
import { HeroRuta } from '../components/edvanta/heroes';
import { escuelaDelArea } from '../data/edvanta/escuelas';
import { PRODUCTO_DESTACADO, productoPorSlug } from '../data/edvanta/productos';

// Las áreas con las que se agrupan los cursos propios, en el orden en
// que se muestran. Cada una se titula con el nombre de su escuela.
const CATEGORIAS = ['Farmacología', 'Calidad', 'Asuntos Regulatorios'];

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

  // Los cursos que dicta Edvanta encabezan el catálogo general. Antes
  // esta página solo listaba cursos de otras plataformas, así que la ruta
  // «Inicio › Cursos › este curso» llevaba a un sitio donde ese curso no
  // estaba. En las páginas de un proveedor concreto no pintan nada.
  const [propios, setPropios] = useState([]);
  useEffect(() => {
    if (defaultProvider) return undefined;
    let vivo = true;
    // Solo los profesionales: el curso para pacientes vive en /pacientes.
    fetch(apiUrl('/api/cursos-edvanta?limit=60&publico=profesionales'))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!vivo || !j?.data?.length) return;
        setPropios(j.data.map((c) => ({
          id: `propio-${c.id}`,
          title: c.title,
          description: c.shortDescription,
          image: c.coverUrl,
          to: c.to,
          area: c.area,
          ctaLabel: 'Ver el curso',
        })));
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, [defaultProvider]);

  const enVivo = productoPorSlug(PRODUCTO_DESTACADO);

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
      <SiteHeader />

      <main>
        {/* Héroe D: el catálogo como recorrido de aprendizaje. */}
        <HeroRuta
          eyebrow={defaultProvider ? PROVIDER_LABELS[defaultProvider] : 'Catálogo de cursos'}
          title={defaultProvider ? `Cursos de ${PROVIDER_LABELS[defaultProvider]}` : 'Cursos de Edvanta y recomendados'}
          highlight={defaultProvider ? undefined : 'Cursos de Edvanta'}
          lead={defaultProvider
            ? `Explora nuestra selección de cursos de ${PROVIDER_LABELS[defaultProvider]} en farmacia, calidad, datos, IA, gestión de proyectos y más.`
            : 'Primero, los cursos de Edvanta, ordenados por escuela. Después, cursos de otras plataformas que recomendamos, señalados como tales.'}
          actions={!defaultProvider && (
            <>
              <Btn href="#cursos-edvanta" size="lg" iconRight={ArrowRight}>Ver cursos de Edvanta</Btn>
              <Btn to="/escuelas" variant="secondary" size="lg">Explorar por escuela</Btn>
            </>
          )}
          steps={[
            { icon: Compass, title: 'Explora', desc: 'Elige escuela y área' },
            { icon: BookOpenCheck, title: 'Aprende', desc: 'Video y texto, a tu ritmo' },
            { icon: Lightbulb, title: 'Aplica', desc: 'Casos de la práctica' },
            { icon: TrendingUp, title: 'Avanza', desc: 'Rutas y competencias' },
          ]}
        />

        {/* El curso en vivo va antes que todo: es lo que abre primero. */}
        {!defaultProvider && enVivo && (
          <section className="border-b border-edvanta-border bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-amber-700">Curso en vivo · Próxima apertura</p>
                <p className="mt-1 text-lg font-bold text-edvanta-deep">{enVivo.nombre}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-edvanta-muted"><CalendarClock className="h-4 w-4" aria-hidden="true" />Para auxiliares y regentes · fecha y valor por confirmar</p>
              </div>
              <Btn to={enVivo.to} iconRight={ArrowRight} className="shrink-0">Ver el curso</Btn>
            </div>
          </section>
        )}

        {/* Un carrusel por categoría. Con más de cuarenta cursos propios,
            una sola fila larguísima no deja orientarse: lo que la persona
            quiere saber primero es si hay algo de lo suyo. Lo que todavía
            no tiene categoría va al final, bajo su propio título, en vez
            de desaparecer. */}
        {propios.length > 0 && (
          <section id="cursos-edvanta" className="ds-surface-ice scroll-mt-28 border-b border-edvanta-border">
            {CATEGORIAS.map((area) => {
              const deLaCategoria = propios.filter((c) => c.area === area);
              if (!deLaCategoria.length) return null;
              return (
                <CourseCarousel
                  key={area}
                  title={escuelaDelArea(area)?.nombre || area}
                  courses={deLaCategoria}
                  sectionKey={`catalogo_${area.toLowerCase().replace(/\s+/g, '_')}`}
                />
              );
            })}
            {propios.some((c) => !CATEGORIAS.includes(c.area)) && (
              <CourseCarousel
                title="Otros cursos de Edvanta"
                courses={propios.filter((c) => !CATEGORIAS.includes(c.area))}
                sectionKey="catalogo_otros"
              />
            )}
          </section>
        )}

        {!defaultProvider && (
          <section id="otras-plataformas" className="scroll-mt-32 bg-white">
            <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-subtle">No son de Edvanta</p>
              <h2 className="mt-1 text-2xl font-bold text-edvanta-deep md:text-3xl">Cursos recomendados de otras plataformas</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-edvanta-muted">
                Coursera, Udemy y Edutin. El acceso, el precio y el certificado dependen de cada plataforma. Algunos enlaces son de afiliado:
                Edvanta puede recibir una comisión sin costo adicional para ti.
              </p>
            </div>
          </section>
        )}

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
                  className="ed-btn ed-btn--teal shrink-0">
                  Buscar
                </button>
              </div>

              {/* Filter grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <select aria-label="Filtrar por categoría" value={category} onChange={e => handleFilterChange(setCategory, 'category')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todas las categorías</option>
                  {filterOptions.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select aria-label="Filtrar por carrera" value={career} onChange={e => handleFilterChange(setCareer, 'career')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todas las carreras</option>
                  {(filterOptions.careers || []).map(item => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>

                <select aria-label="Filtrar por competencia" value={skill} onChange={e => handleFilterChange(setSkill, 'skill')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todas las competencias</option>
                  {(filterOptions.skills || []).map(item => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>

                <select aria-label="Filtrar por idioma" value={language} onChange={e => handleFilterChange(setLanguage, 'language')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todos los idiomas</option>
                  {filterOptions.languages.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                <select aria-label="Filtrar por nivel" value={level} onChange={e => handleFilterChange(setLevel, 'level')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todos los niveles</option>
                  {filterOptions.levels.map(l => (
                    <option key={l} value={l}>{LEVEL_LABELS[l] || l}</option>
                  ))}
                </select>

                <select aria-label="Filtrar por tipo de acceso" value={priceType} onChange={e => handleFilterChange(setPriceType, 'price_type')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Todos los tipos de acceso</option>
                  {filterOptions.price_types.map(p => (
                    <option key={p} value={p}>{PRICE_TYPE_LABELS[p] || p}</option>
                  ))}
                </select>

                <select aria-label="Filtrar por certificado" value={certificate} onChange={e => handleFilterChange(setCertificate, 'certificate')(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Certificado: todos</option>
                  <option value="true">Con certificado</option>
                </select>

                {hasFilters && (
                  <button type="button" onClick={clearFilters}
                    className="text-xs text-teal-600 hover:text-edvanta-tealdark font-medium px-3 py-2 rounded-lg hover:bg-edvanta-mint transition-colors">
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
              <div className="rounded-lg border border-gray-200 bg-edvanta-bg py-16 text-center">
                <BookOpenCheck className="mx-auto mb-3 h-9 w-9 text-edvanta-tealdark" aria-hidden="true" />
                <p className="font-semibold text-navy-950">No encontramos cursos con esos filtros.</p>
                <p className="mt-1 text-sm text-gray-500">Prueba con otros filtros o una búsqueda más amplia.</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-teal-600 hover:text-edvanta-tealdark">
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
              <p className="text-xs text-edvanta-blue leading-relaxed">
                <strong>Transparencia de afiliados:</strong> Algunos enlaces de esta página son enlaces de afiliado. Edvanta puede recibir una comisión si realizas una compra, sin costo adicional para ti.
              </p>
              <p className="text-xs text-edvanta-blue leading-relaxed">
                El curso, el acceso, el precio, el certificado y las condiciones dependen de la plataforma correspondiente (Coursera, Udemy, Edutin). Edvanta no emite certificados de estas plataformas. Los precios en Udemy pueden variar según promociones vigentes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
