/**
 * /medicamentos — Índice de fichas rápidas para pacientes.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { FICHAS, META_FICHAS } from '../data/medicamentos/fichas.js';
import { updatePageSeo } from '../utils/seo';

const normal = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function MedicamentosIndex() {
  const [q, setQ] = useState('');
  useEffect(() => updatePageSeo({
    title: META_FICHAS.titulo,
    description: META_FICHAS.descripcion,
    canonical: 'https://edvanta.co/medicamentos',
    jsonLdId: 'medicamentos',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: META_FICHAS.h1,
      description: META_FICHAS.descripcion,
      url: 'https://edvanta.co/medicamentos',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: FICHAS.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: f.nombre, url: `https://edvanta.co/medicamentos/${f.slug}` })),
      },
    },
  }), []);

  const lista = useMemo(() => {
    const t = normal(q.trim());
    return t ? FICHAS.filter((f) => normal(`${f.nombre} ${f.clase} ${f.para}`).includes(t)) : FICHAS;
  }, [q]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Medicamentos' }]} />
            <h1 className="mt-5 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[3rem]">
              {META_FICHAS.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">
              Para qué sirve cada medicamento, cuidados importantes, efectos secundarios y cuándo consultar.
              Información educativa, sin dosis personalizadas.
            </p>
            <label className="relative mt-6 block max-w-md">
              <span className="sr-only">Buscar un medicamento</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca por nombre o grupo"
                className="w-full rounded-xl border border-edvanta-border bg-white px-4 py-3 pl-11 text-sm outline-none focus:border-edvanta-teal"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-edvanta-muted" aria-hidden="true" />
            </label>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-5 text-sm text-edvanta-muted">{lista.length} fichas</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((f) => (
              <li key={f.slug}>
                <Link to={`/medicamentos/${f.slug}`} className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-edvanta-teal/40 hover:shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{f.clase}</span>
                  <span className="mt-1 font-display text-lg font-bold text-edvanta-deep group-hover:text-edvanta-blue">{f.nombre}</span>
                  <span className="mt-2 text-sm leading-6 text-edvanta-muted">{f.para}</span>
                </Link>
              </li>
            ))}
          </ul>
          {lista.length === 0 && <p className="text-sm text-edvanta-muted">No encontramos ese medicamento. Prueba con otro nombre.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
