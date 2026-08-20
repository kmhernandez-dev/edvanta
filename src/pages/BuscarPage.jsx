import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentNodeCard from '../components/edvanta/ContentNodeCard';
import { searchContent, orderedTypeGroups } from '../lib/edvanta/search';
import { AREA_OPTIONS, TYPE_LABELS, TYPE_ORDER } from '../lib/edvanta/contentGraph';
import { EDVANTA_WHATSAPP_URL } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const TYPE_TABS = [{ id: 'all', label: 'Todos' }, ...TYPE_ORDER.map((t) => ({ id: t, label: `${TYPE_LABELS[t]}s` }))];

export default function BuscarPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput] = useState(q);
  const [type, setType] = useState('all');
  const [area, setArea] = useState('all');

  useEffect(() => setInput(q), [q]);
  useEffect(() => { setType('all'); setArea('all'); }, [q]);

  useEffect(() => {
    updatePageSeo({
      title: q ? `Resultados para “${q}” | Edvanta` : 'Buscar en Edvanta',
      description: 'Busca cursos, áreas profesionales, rutas, herramientas y artículos para químicos farmacéuticos en el ecosistema Edvanta.',
      canonical: 'https://edvanta.co/buscar',
      jsonLdId: 'buscar',
      jsonLd: { '@context': 'https://schema.org', '@type': 'SearchResultsPage', name: 'Buscador Edvanta', url: 'https://edvanta.co/buscar' },
    });
  }, [q]);

  const res = useMemo(() => searchContent(q, { limit: 200 }), [q]);

  // Áreas presentes en los resultados (para el filtro).
  const areasInResults = useMemo(() => {
    const present = new Set();
    res.flat.forEach(({ node }) => node.areaIds.forEach((id) => present.add(id)));
    return AREA_OPTIONS.filter((a) => present.has(a.id));
  }, [res]);

  const afterArea = useMemo(
    () => res.flat.filter(({ node }) => area === 'all' || node.areaIds.includes(area)),
    [res, area],
  );

  const typeCounts = useMemo(() => {
    const c = { all: afterArea.length };
    afterArea.forEach(({ node }) => { c[node.type] = (c[node.type] || 0) + 1; });
    return c;
  }, [afterArea]);

  const visible = useMemo(
    () => afterArea.filter(({ node }) => type === 'all' || node.type === type),
    [afterArea, type],
  );

  const groups = useMemo(() => {
    if (type !== 'all') return null;
    const byType = {};
    visible.forEach((item) => (byType[item.node.type] ||= []).push(item));
    return orderedTypeGroups(byType);
  }, [visible, type]);

  const submit = (e) => {
    e.preventDefault();
    const term = input.trim();
    if (term) setParams({ q: term });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        {/* Barra de búsqueda / hero */}
        <section className="border-b border-edvanta-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="eyebrow-edvanta mb-2">Buscador del ecosistema</p>
            <h1 className="font-display text-3xl font-extrabold text-edvanta-deep sm:text-4xl">
              {q ? <>Resultados para <span className="text-edvanta-blue">“{q}”</span></> : 'Busca en todo Edvanta'}
            </h1>
            <form onSubmit={submit} className="mt-5 flex max-w-2xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="search"
                  placeholder="Cursos, áreas, rutas, herramientas o artículos…"
                  aria-label="Término de búsqueda"
                  className="h-12 w-full rounded-xl border border-edvanta-border bg-white pl-11 pr-4 text-base text-edvanta-deep placeholder:text-slate-400 focus:border-edvanta-blue focus:outline-none focus:ring-2 focus:ring-edvanta-blue/30"
                />
              </div>
              <button type="submit" className="btn-edvanta h-12 shrink-0">Buscar</button>
            </form>
            {q && <p className="mt-3 text-sm text-slate-500">{res.total} {res.total === 1 ? 'resultado' : 'resultados'} en el ecosistema.</p>}
          </div>
        </section>

        {!q ? (
          <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-edvanta-light text-edvanta-blue">
              <Search className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-4 text-base font-semibold text-edvanta-deep">Escribe qué necesitas aprender o resolver.</p>
            <p className="mt-1 text-sm text-slate-500">Ej.: Validaciones, Aseguramiento de Calidad, Farmacovigilancia, Power BI, hoja de vida.</p>
          </section>
        ) : res.total === 0 ? (
          <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-lg font-bold text-edvanta-deep">No encontramos resultados para “{q}”.</p>
            <p className="mt-2 text-sm text-slate-500">Prueba con un área (Calidad, Validaciones, Regulatorio) o una competencia (GMP, CAPA, HPLC, CSV).</p>
            <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-edvanta mt-6">Pedir orientación por WhatsApp</a>
          </section>
        ) : (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Filtros por tipo */}
            <div className="flex flex-wrap items-center gap-2">
              {TYPE_TABS.filter((t) => t.id === 'all' || typeCounts[t.id]).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  aria-pressed={type === t.id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
                    type === t.id ? 'bg-edvanta-deep text-white' : 'border border-edvanta-border bg-white text-slate-600 hover:border-edvanta-blue/40 hover:text-edvanta-blue'
                  }`}
                >
                  {t.label}
                  <span className={`text-xs ${type === t.id ? 'text-white/70' : 'text-slate-400'}`}>{typeCounts[t.id] || 0}</span>
                </button>
              ))}

              {/* Filtro por área */}
              {areasInResults.length > 1 && (
                <div className="ml-auto flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <label htmlFor="area-filter" className="sr-only">Filtrar por área</label>
                  <select
                    id="area-filter"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="rounded-lg border border-edvanta-border bg-white px-3 py-1.5 text-sm font-medium text-slate-600 focus:border-edvanta-blue focus:outline-none focus:ring-2 focus:ring-edvanta-blue/30"
                  >
                    <option value="all">Todas las áreas</option>
                    {areasInResults.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Resultados */}
            {visible.length === 0 ? (
              <p className="mt-10 rounded-xl border border-dashed border-edvanta-border bg-white px-6 py-12 text-center text-sm text-slate-500">
                No hay resultados con estos filtros. Cambia el tipo o el área.
              </p>
            ) : type === 'all' ? (
              <div className="mt-8 space-y-10">
                {groups.map((g) => (
                  <div key={g.type}>
                    <div className="mb-4 flex items-baseline justify-between">
                      <h2 className="font-display text-xl font-extrabold text-edvanta-deep">{g.items[0].node.typeLabel}s</h2>
                      {g.items.length > 6 && (
                        <button type="button" onClick={() => setType(g.type)} className="text-sm font-bold text-edvanta-blue hover:underline">
                          Ver los {g.items.length}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {g.items.slice(0, 8).map(({ node }) => (
                        <ContentNodeCard key={node.id} node={node} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map(({ node }) => (
                  <ContentNodeCard key={node.id} node={node} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
