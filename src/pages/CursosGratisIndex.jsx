import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses, COURSE_CATEGORIES } from '../data/courses';
import { updatePageSeo } from '../utils/seo';

const CAT_ICONS = {
  'Salud y Medicina': '🏥',
  'IA y Datos': '🤖',
  'Tecnología': '💻',
  'Gestión Empresarial y Calidad': '📊',
  'Marketing': '📢',
  'Seguridad, Medio Ambiente y Operaciones': '🛡️',
  'Psicología, Educación y Oficios': '🧠',
  'Legal, Ofimática e Ingeniería': '⚖️',
  'Idiomas': '🌐',
};

export default function CursosGratisIndex() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    updatePageSeo({
      title: '100+ Cursos gratuitos recomendados | Edvanta',
      description: 'Explora más de 100 cursos gratuitos en salud, datos, calidad, marketing, seguridad, tecnología y más. Organizados por categoría. Accede gratis en Edutin Academy.',
      canonical: 'https://edvanta.co/cursos-gratis',
      image: 'https://edvanta.co/img/cursos/gestion-de-calidad.webp',
      jsonLdId: 'free-courses-index',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Cursos gratuitos recomendados',
        url: 'https://edvanta.co/cursos-gratis',
        publisher: { '@type': 'Organization', name: 'Edvanta' },
      },
    });
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter(c => {
      const matchCat = category === 'Todos' || c.category === category;
      const matchSearch = !term || `${c.name} ${c.category} ${c.code}`.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [category, search]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 to-teal-700 text-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-200">Catálogo completo</p>
              <h1 className="text-3xl font-bold md:text-5xl">100+ Cursos gratuitos recomendados</h1>
              <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
                Explora nuestra selección de cursos gratuitos en Edutin Academy. Organizados por categoría para que encuentres exactamente lo que necesitas aprender.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-white/60">
                <span>🏥 Salud</span><span>·</span><span>🤖 IA y Datos</span><span>·</span>
                <span>📊 Calidad</span><span>·</span><span>🛡️ HSEQ</span><span>·</span>
                <span>📢 Marketing</span><span>·</span><span>💻 Tecnología</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category tabs */}
        <section className="border-b border-gray-200 bg-white sticky top-16 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-0">
              {COURSE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    category === cat
                      ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {CAT_ICONS[cat] && <span className="mr-1">{CAT_ICONS[cat]}</span>}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search + count */}
        <section className="bg-slate-50 py-5 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar curso por nombre, código o categoría..."
                className="w-full sm:w-96 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <p className="text-xs text-gray-400">
                {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                {category !== 'Todos' && ` en ${category}`}
              </p>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-slate-50 py-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-navy-950">No encontramos cursos con ese filtro.</p>
                <p className="mt-1 text-sm text-gray-500">Prueba otra categoría o una búsqueda más amplia.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map(course => (
                  <Link
                    key={course.id}
                    to={`/cursos-gratis/${course.id}`}
                    className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-navy-100 to-teal-100 flex items-center justify-center relative">
                      <span className="text-4xl">{CAT_ICONS[course.category] || '📚'}</span>
                      <span className="absolute top-3 left-3 chip bg-white/90 text-navy-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {course.code}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-1.5">
                      <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">{course.category}</p>
                      <h3 className="text-sm font-bold leading-snug text-navy-950 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {course.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        <span className="text-[11px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">Gratuito</span>
                        <span className="text-[11px] text-gray-400">Virtual</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-40 hover:bg-gray-50">
                  ← Anterior
                </button>
                <span className="text-sm text-gray-500">Página {page} de {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy-900 disabled:opacity-40 hover:bg-gray-50">
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Transparencia:</strong> Edvanta puede recibir una comisión si te inscribes mediante algunos enlaces. Esto no modifica el precio ni condiciona nuestro criterio editorial. El contenido académico es gratuito; la certificación puede tener un costo opcional determinado por Edutin Academy. Edvanta no dicta ni certifica estos cursos.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
