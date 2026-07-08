import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { articulos } from '../data/articulos';
import { updatePageSeo } from '../utils/seo';

const PAGE_SIZE = 6;

export default function ArticulosIndex() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [page, setPage] = useState(1);

  const edvantaArticles = useMemo(
    () => articulos.filter((article) => article.marca === 'edvanta'),
    []
  );
  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(edvantaArticles.map((article) => article.category)))],
    [edvantaArticles]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return edvantaArticles.filter((article) => {
      const matchCategory = category === 'Todos' || article.category === category;
      const matchSearch = !term || `${article.title} ${article.description} ${article.category}`.toLowerCase().includes(term);
      return matchCategory && matchSearch;
    });
  }, [category, edvantaArticles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = edvantaArticles[0];

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const cleanup = updatePageSeo({
      title: 'Artículos y rutas de aprendizaje | Edvanta',
      description: 'Artículos de Edvanta sobre calidad, Power BI, auditoría, ambiente, SST, proyectos, Lean y Lean Six Sigma.',
      canonical: 'https://edvanta.co/articulos',
      image: 'https://edvanta.co/img/cursos/gestion-de-calidad.webp',
      jsonLdId: 'articles-index',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Artículos y rutas de aprendizaje',
        url: 'https://edvanta.co/articulos',
        publisher: { '@type': 'Organization', name: 'Edvanta' },
      },
    });
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        <section className="bg-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Edvanta</p>
              <h1 className="text-3xl font-bold text-navy-950 md:text-5xl">Artículos y rutas de aprendizaje</h1>
              <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                Guías para orientar tu aprendizaje en calidad, datos, auditoría, sostenibilidad, SST y mejora de procesos.
              </p>
            </div>
          </div>
        </section>

        {featured && (
          <section className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Artículo destacado</p>
                <h2 className="text-2xl font-bold text-navy-950">{featured.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-gray-500">{featured.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link to={`/articulos/${featured.slug}`} className="btn-primary">Leer artículo</Link>
                  <Link to={`/cursos/${featured.courseSlug}`} className="btn-secondary">Ver curso relacionado</Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-white pb-16 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 grid gap-4 rounded-lg border border-gray-200 bg-slate-50 p-4 md:grid-cols-[1fr_260px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por tema, habilidad o curso"
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((article) => {
                return (
                  <Link
                    key={article.slug}
                    to={`/articulos/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-teal-600">{article.category}</p>
                      <h2 className="mt-2 text-lg font-bold leading-snug text-navy-950 group-hover:text-teal-700">
                        {article.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{article.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-500">
                        <span>Edvanta</span>
                        <span>{article.updated || article.date} · {article.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {!visible.length && (
              <div className="rounded-lg border border-gray-200 bg-slate-50 py-14 text-center">
                <p className="font-semibold text-navy-950">No encontramos artículos con ese filtro.</p>
                <p className="mt-1 text-sm text-gray-500">Prueba otra categoría o una búsqueda más amplia.</p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500">Página {page} de {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
