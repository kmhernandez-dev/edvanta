/**
 * /salud — Biblioteca de 200 artículos «para qué sirve».
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { BIBLIOTECA_SALUD, CATEGORIAS_SALUD, META_BIBLIOTECA } from '../data/salud/biblioteca.js';
import { updatePageSeo } from '../utils/seo';

const normal = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function BibliotecaSaludIndex() {
  const [q, setQ] = useState('');
  useEffect(() => updatePageSeo({
    title: META_BIBLIOTECA.titulo,
    description: META_BIBLIOTECA.descripcion,
    canonical: 'https://edvanta.co/salud',
    jsonLdId: 'biblioteca-salud',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: META_BIBLIOTECA.h1,
      description: META_BIBLIOTECA.descripcion,
      url: 'https://edvanta.co/salud',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: BIBLIOTECA_SALUD.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: `${a.nombre}: para qué sirve`, url: `https://edvanta.co/salud/${a.slug}` })),
      },
    },
  }), []);

  const lista = useMemo(() => {
    const t = normal(q.trim());
    return t ? BIBLIOTECA_SALUD.filter((a) => normal(`${a.nombre} ${a.categoria} ${a.para}`).includes(t)) : BIBLIOTECA_SALUD;
  }, [q]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Biblioteca de salud' }]} />
            <h1 className="mt-5 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[3rem]">
              {META_BIBLIOTECA.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">
              Plantas medicinales, vitaminas, suplementos, medicamentos y productos de cuidado: para qué sirven,
              qué precauciones tener y qué dice la evidencia. Sin dosis ni promesas de cura.
            </p>
            <label className="relative mt-6 block max-w-md">
              <span className="sr-only">Buscar en la biblioteca</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca una planta, vitamina o medicamento"
                className="w-full rounded-xl border border-edvanta-border bg-white px-4 py-3 pl-11 text-sm outline-none focus:border-edvanta-teal"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-edvanta-muted" aria-hidden="true" />
            </label>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-5 text-sm text-edvanta-muted">{lista.length} artículos</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((a) => (
              <li key={a.slug}>
                <Link to={`/salud/${a.slug}`} className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-edvanta-teal/40 hover:shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{CATEGORIAS_SALUD[a.categoria] || a.categoria}</span>
                  <span className="mt-1 font-display text-lg font-bold text-edvanta-deep group-hover:text-edvanta-blue">{a.nombre}: para qué sirve</span>
                  <span className="mt-2 line-clamp-3 text-sm leading-6 text-edvanta-muted">{a.para}</span>
                </Link>
              </li>
            ))}
          </ul>
          {lista.length === 0 && <p className="text-sm text-edvanta-muted">No encontramos ese tema. Prueba con otro nombre.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
