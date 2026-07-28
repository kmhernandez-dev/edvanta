import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { articulos } from '../data/articulos';
import { updatePageSeo } from '../utils/seo';

const PAGE_SIZE = 9;

const BRANDS = [
  { key: 'all', label: 'Todos', icon: '📚' },
  { key: 'edvanta', label: 'Edvanta', icon: '📘' },
  { key: 'fst', label: 'Feliz Sin Tiroides', icon: '🦋' },
  { key: 'atenfarma', label: 'AtenFarmaClinic', icon: '⚕️' },
];

export default function ArticulosIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [category, setCategory] = useState('Todas');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const cat = searchParams.get('categoria');
    if (cat) {
      const found = articulos.find(a => a.category?.toLowerCase().includes(cat.toLowerCase()));
      if (found) {
        setCategory(found.category);
        setBrand(found.marca);
      }
    }
  }, []);

  const filteredByBrand = useMemo(() => {
    if (brand === 'all') return articulos;
    return articulos.filter(a => a.marca === brand);
  }, [brand]);

  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(filteredByBrand.map(a => a.category)))],
    [filteredByBrand]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return filteredByBrand.filter(a => {
      const matchCat = category === 'Todas' || a.category === category;
      const matchSearch = !term || `${a.title} ${a.description} ${a.category}`.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [category, filteredByBrand, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [category, search, brand]);

  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageSeo({
      title: 'Biblioteca de artículos | Edvanta',
      description: 'Explora nuestra biblioteca de artículos educativos sobre calidad, Power BI, auditoría, salud tiroidea, farmacia clínica y más.',
      canonical: 'https://edvanta.co/articulos',
      image: 'https://edvanta.co/img/cursos/gestion-de-calidad.webp',
      jsonLdId: 'articles-index',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Biblioteca de artículos',
        url: 'https://edvanta.co/articulos',
        publisher: { '@type': 'Organization', name: 'Edvanta' },
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 to-teal-700 text-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-200">Biblioteca</p>
              <h1 className="text-3xl font-bold md:text-5xl">Artículos y recursos educativos</h1>
              <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
                Explora, estudia y aprende con nuestra colección de artículos organizados por tema. Subraya, toma notas y guarda tu progreso.
              </p>
            </div>
          </div>
        </section>

        {/* Brand tabs */}
        <section className="border-b border-gray-200 bg-white sticky top-16 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-0">
              {BRANDS.map(b => (
                <button
                  key={b.key}
                  onClick={() => { setBrand(b.key); setCategory('Todas'); }}
                  className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    brand === b.key
                      ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1.5">{b.icon}</span>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-slate-50 py-6 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 md:grid-cols-[1fr_280px]">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por tema, habilidad o palabra clave..."
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {categories.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              {filtered.length} artículo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              {brand !== 'all' && ` en ${BRANDS.find(b => b.key === brand)?.label}`}
              {category !== 'Todas' && ` sobre "${category}"`}
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-slate-50 py-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-navy-950">No encontramos artículos con ese filtro.</p>
                <p className="mt-1 text-sm text-gray-500">Prueba otra categoría o una búsqueda más amplia.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map(article => (
                  <Link
                    key={article.slug}
                    to={`/articulos/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`aspect-[16/9] bg-gradient-to-br ${
                      article.marca === 'fst' ? 'from-teal-500 to-blush-400' :
                      article.marca === 'atenfarma' ? 'from-deepblue-800 to-teal-600' :
                      'from-navy-900 to-teal-600'
                    } flex items-end p-4`}>
                      <span className="chip bg-white/90 text-navy-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-base font-bold leading-snug text-navy-950 group-hover:text-teal-700 transition-colors">
                        {article.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">{article.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          {article.marca === 'fst' ? '🦋' : article.marca === 'atenfarma' ? '⚕️' : '📘'}
                          {article.marca === 'fst' ? 'FST' : article.marca === 'atenfarma' ? 'AtenFarma' : 'Edvanta'}
                        </span>
                        <span>{article.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-gray-500">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
