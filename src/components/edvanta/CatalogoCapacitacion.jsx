import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { AREAS_CAPACITACION, CATEGORIAS_CAPACITACION } from '../../data/edvanta/capacitacion';

const FILTROS = [
  { id: 'todas', label: 'Todas las líneas' },
  { id: 'perfil', label: 'Formación por perfil' },
  { id: 'area', label: 'Formación por área' },
];

const normalizar = (texto) => String(texto || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

function AreaCard({ area }) {
  const categoria = CATEGORIAS_CAPACITACION[area.categoria];
  return (
    <article className="ds-card flex h-full flex-col p-6">
      <span className={`ds-chip w-fit ${area.categoria === 'perfil' ? 'ds-chip--teal' : 'ds-chip--violet'}`}>
        {categoria.etiqueta}
      </span>
      <h3 className="mt-4 font-display text-xl font-extrabold leading-snug text-edvanta-deep">{area.nombre}</h3>
      <p className="mt-2 text-sm leading-6 text-edvanta-muted">{area.resumen}</p>
      <div className="mt-4 rounded-xl bg-edvanta-bg px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-subtle">Puede servir a</p>
        <p className="mt-1 text-[13px] leading-5 text-edvanta-deep">{area.dirigidoA.slice(0, 3).join(' · ')}</p>
      </div>
      <div className="mt-auto pt-5">
        <Link
          to={`/empresas/${area.slug}`}
          aria-label={`Explorar capacitación en ${area.nombre}`}
          className="ed-btn ed-btn--secondary ed-btn--sm w-fit"
        >
          Explorar capacitación
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function CatalogoCapacitacion() {
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const areas = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return AREAS_CAPACITACION.filter((a) => {
      const coincideFiltro = filtro === 'todas' || a.categoria === filtro;
      if (!coincideFiltro) return false;
      if (!q) return true;
      const texto = normalizar([
        a.nombre,
        a.resumen,
        a.heroLead,
        ...a.dirigidoA,
        ...a.organizaciones,
        ...a.ejes.map((e) => e.titulo),
      ].join(' '));
      return texto.includes(q);
    });
  }, [filtro, busqueda]);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar áreas de capacitación">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
              className={`min-h-11 rounded-full px-4 text-sm font-bold transition ${
                filtro === f.id
                  ? 'bg-edvanta-blue text-white shadow-sm'
                  : 'border border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por tema, perfil u organización"
            aria-label="Buscar áreas de capacitación"
            className="h-11 w-full rounded-xl border border-edvanta-border bg-white pl-10 pr-4 text-sm text-edvanta-deep outline-none transition placeholder:text-edvanta-subtle focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
          />
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-edvanta-muted" role="status">
        {areas.length} {areas.length === 1 ? 'línea de capacitación' : 'líneas de capacitación'}
      </p>

      {areas.length > 0 ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((a) => <AreaCard key={a.slug} area={a} />)}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-edvanta-border bg-white p-8 text-center">
          <p className="font-display text-lg font-extrabold text-edvanta-deep">No encontramos esa combinación</p>
          <p className="mt-2 text-sm text-edvanta-muted">Prueba con otra palabra o vuelve a ver todas las líneas.</p>
          <button
            type="button"
            onClick={() => { setBusqueda(''); setFiltro('todas'); }}
            className="ed-btn ed-btn--secondary mt-4"
          >
            Ver todas las líneas
          </button>
        </div>
      )}
    </div>
  );
}
