import { useEffect, useMemo, useState } from 'react';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import { Breadcrumb, Eyebrow } from '../components/edvanta/ui';
import recetasData from '../../data/nutricion/fst_recetas_master.json';

const RECETAS = recetasData.recetas || [];

const TIPOS = [
  { key: 'todos', label: 'Todas' },
  { key: 'desayuno', label: 'Desayunos' },
  { key: 'almuerzo', label: 'Almuerzos' },
  { key: 'cena', label: 'Cenas' },
  { key: 'snack', label: 'Snacks' },
  { key: 'sopa', label: 'Sopas' },
];

const CONDICIONES = [
  { key: '', label: 'Cualquier condición' },
  { key: 'hipotiroidismo', label: 'Hipotiroidismo' },
  { key: 'hashimoto_no_celiaco', label: 'Hashimoto (sin celiaquía)' },
  { key: 'hashimoto_celiaco', label: 'Hashimoto + celiaquía' },
  { key: 'graves_hipertiroidismo', label: 'Graves / hipertiroidismo' },
  { key: 'post_tiroidectomia_estable', label: 'Post-tiroidectomía' },
  { key: 'cancer_tiroides_estable', label: 'Cáncer de tiroides (estable)' },
  { key: 'pre_radioyodo', label: 'Preparación para radioyodo' },
  { key: 'hipoparatiroidismo_postquirurgico', label: 'Hipoparatiroidismo' },
];

const DIETAS = [
  { key: 'vegana', label: 'Vegana', test: r => r.vegana },
  { key: 'vegetariana', label: 'Vegetariana', test: r => r.vegetariana },
  { key: 'singluten', label: 'Sin gluten', test: r => r.naturalmente_sin_gluten },
  { key: 'bajoyodo', label: 'Baja en yodo', test: r => r.low_iodine_compatible },
];

const BADGE = {
  APTA: 'bg-emerald-100 text-emerald-800',
  APTA_CON_MODIFICACION: 'bg-amber-100 text-amber-800',
  NO_PRIORITARIA: 'bg-edvanta-soft text-edvanta-muted',
  EVITAR_TEMPORALMENTE: 'bg-red-100 text-red-700',
  REQUIERE_REVISION_PROFESIONAL: 'bg-amber-100 text-amber-800',
};
const CODE_LABEL = {
  APTA: 'Apta',
  APTA_CON_MODIFICACION: 'Con ajuste',
  NO_PRIORITARIA: 'No prioritaria',
  EVITAR_TEMPORALMENTE: 'Evitar (temporal)',
  REQUIERE_REVISION_PROFESIONAL: 'Requiere revisión',
};

function clasifOf(recipe, condKey) {
  const v = recipe?.condition_matrix?.[condKey];
  if (!v) return null;
  const idx = v.indexOf('—');
  const code = (idx === -1 ? v : v.slice(0, idx)).trim();
  const justif = idx === -1 ? '' : v.slice(idx + 1).trim();
  return { code, justif };
}

const condLabel = (key) => CONDICIONES.find(c => c.key === key)?.label || '';

function DietTags({ r }) {
  const tags = [];
  if (r.naturalmente_sin_gluten) tags.push('Sin gluten');
  if (r.vegana) tags.push('Vegana');
  else if (r.vegetariana) tags.push('Vegetariana');
  if (r.low_iodine_compatible) tags.push('Baja en yodo');
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(t => (
        <span key={t} className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">{t}</span>
      ))}
    </div>
  );
}

// ─── Ficha completa (modal) ───────────────────────────────────
function RecipeModal({ recipe, cond, onClose }) {
  if (!recipe) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#031D5C]/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-edvanta-border bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-teal-600">{recipe.tipo_comida}</p>
            <h2 className="font-display text-xl font-extrabold text-edvanta-deep">{recipe.nombre}</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 text-edvanta-subtle hover:bg-edvanta-soft">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <p className="text-sm text-edvanta-muted">{recipe.descripcion}</p>

          <div className="flex flex-wrap gap-3 text-xs text-edvanta-muted">
            <span>⏱ {recipe.tiempo_preparacion_min} min</span>
            <span>· {recipe.dificultad}</span>
            <span>· {recipe.porciones} porción(es)</span>
            <span>· ~{recipe.energia_estimada_kcal} kcal*</span>
          </div>
          <DietTags r={recipe} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Ingredientes</h3>
              <ul className="space-y-1 text-sm text-edvanta-deep">
                {recipe.ingredientes.map((i, k) => (
                  <li key={k}>• {i.ingrediente} <span className="text-edvanta-subtle">— {i.medida_casera}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Preparación</h3>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-edvanta-deep">
                {recipe.preparacion.map((p, k) => <li key={k}>{p}</li>)}
              </ol>
            </div>
          </div>

          <div className="rounded-2xl bg-edvanta-bg p-4">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Compatibilidad por condición</h3>
            <div className="space-y-1.5">
              {CONDICIONES.filter(c => c.key).map(c => {
                const cl = clasifOf(recipe, c.key);
                if (!cl) return null;
                const highlight = cond === c.key;
                return (
                  <div key={c.key} className={`flex items-start justify-between gap-2 rounded-lg px-2 py-1 ${highlight ? 'bg-white ring-1 ring-teal-200' : ''}`}>
                    <span className="text-sm text-edvanta-deep">{c.label}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${BADGE[cl.code] || 'bg-edvanta-soft text-edvanta-muted'}`}>{CODE_LABEL[cl.code] || cl.code}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {recipe.clinical_rationale && (
            <div>
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-teal-600">Por qué</h3>
              <p className="text-sm leading-relaxed text-edvanta-muted">{recipe.clinical_rationale}</p>
            </div>
          )}

          {recipe.adaptaciones && Object.keys(recipe.adaptaciones).length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-teal-600">Adaptaciones</h3>
              <ul className="space-y-1 text-sm text-edvanta-muted">
                {Object.entries(recipe.adaptaciones).map(([k, v]) => (
                  <li key={k}><span className="font-semibold text-edvanta-deep">{k.replace(/_/g, ' ')}:</span> {v}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="rounded-xl bg-edvanta-lilac p-3 text-xs leading-relaxed text-edvanta-muted">
            Información educativa de apoyo nutricional. No reemplaza la indicación de tu médico o nutricionista. Los valores nutricionales (*) son estimados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RecetasFinder() {
  const [query, setQuery] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [cond, setCond] = useState('');
  const [diets, setDiets] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Buscador de recetas para la tiroides | Feliz Sin Tiroides';
  }, []);

  const toggleDiet = (key) => setDiets(d => d.includes(key) ? d.filter(x => x !== key) : [...d, key]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECETAS.filter(r => {
      if (q && !(r.nombre.toLowerCase().includes(q) || (r.ingredientes || []).some(i => i.ingrediente.toLowerCase().includes(q)))) return false;
      if (tipo !== 'todos' && r.tipo_comida !== tipo) return false;
      for (const key of diets) {
        const d = DIETAS.find(x => x.key === key);
        if (d && !d.test(r)) return false;
      }
      if (cond) {
        const cl = clasifOf(r, cond);
        if (!cl || cl.code === 'EVITAR_TEMPORALMENTE') return false;
      }
      return true;
    });
  }, [query, tipo, cond, diets]);

  // Resumen tipo "responde de distintas maneras"
  const summaryBits = [];
  if (cond) summaryBits.push(`para ${condLabel(cond)}`);
  if (tipo !== 'todos') summaryBits.push(TIPOS.find(t => t.key === tipo).label.toLowerCase());
  diets.forEach(k => summaryBits.push(DIETAS.find(d => d.key === k).label.toLowerCase()));
  if (query.trim()) summaryBits.push(`con “${query.trim()}”`);

  return (
    <div className="min-h-screen bg-edvanta-bg font-sans">
      <FstHeader />

      {/* Intro */}
      <section className="ds-surface-glow border-b border-edvanta-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
          <Breadcrumb items={[{ label: 'Feliz Sin Tiroides', to: '/feliz-sin-tiroides' }, { label: 'Recetas' }]} className="mb-6" />
          <Eyebrow tone="teal">Buscador de recetas</Eyebrow>
          <h1 className="mt-3 font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-edvanta-blue" style={{ fontSize: 'var(--ds-fs-h2)' }}>
            Encuentra recetas según tu tiroides
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-edvanta-muted">
            Filtra por tipo de comida, tu condición tiroidea y tu tipo de dieta. Cada receta indica si es apta o requiere un ajuste, con criterio basado en evidencia.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-edvanta-border bg-white p-5 shadow-sm">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre o ingrediente (ej. avena, pollo, arepa)…"
            className="w-full rounded-xl border border-edvanta-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {TIPOS.map(t => (
              <button key={t.key} onClick={() => setTipo(t.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${tipo === t.key ? 'bg-teal-600 text-white' : 'bg-edvanta-bg text-edvanta-muted hover:bg-edvanta-border'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-edvanta-deep">
              Condición tiroidea
              <select value={cond} onChange={e => setCond(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-edvanta-border bg-white px-3 py-2.5 text-sm font-normal text-edvanta-deep focus:outline-none focus:ring-2 focus:ring-teal-400">
                {CONDICIONES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
            <div>
              <span className="text-sm font-semibold text-edvanta-deep">Tipo de dieta</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {DIETAS.map(d => (
                  <button key={d.key} onClick={() => toggleDiet(d.key)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${diets.includes(d.key) ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-edvanta-border bg-white text-edvanta-muted hover:bg-edvanta-bg'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl font-extrabold text-edvanta-deep">
            {results.length} {results.length === 1 ? 'receta' : 'recetas'}
            {summaryBits.length > 0 && <span className="font-sans text-base font-normal text-edvanta-muted"> {summaryBits.join(' · ')}</span>}
          </h2>
          {(cond || tipo !== 'todos' || diets.length > 0 || query) && (
            <button onClick={() => { setQuery(''); setTipo('todos'); setCond(''); setDiets([]); }}
              className="text-sm font-semibold text-teal-600 hover:underline">Limpiar filtros</button>
          )}
        </div>

        {/* Resultados */}
        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-edvanta-border bg-white p-10 text-center">
            <p className="font-semibold text-edvanta-deep">No encontramos recetas con esos filtros.</p>
            <p className="mt-1 text-sm text-edvanta-muted">Prueba con menos filtros o cambia el tipo de comida.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(r => {
              const cl = cond ? clasifOf(r, cond) : null;
              return (
                <button key={r.recipe_id} onClick={() => setSelected(r)}
                  className="flex flex-col rounded-2xl border border-edvanta-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-edvanta-bg px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-edvanta-muted">{r.tipo_comida}</span>
                    {cl && <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${BADGE[cl.code] || 'bg-edvanta-soft text-edvanta-muted'}`}>{CODE_LABEL[cl.code] || cl.code}</span>}
                  </div>
                  <h3 className="font-display text-lg font-extrabold leading-snug text-edvanta-deep">{r.nombre}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-edvanta-muted">{r.descripcion}</p>
                  {cl && cl.justif && cond && <p className="mt-2 text-xs italic text-edvanta-muted">{cl.justif}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <DietTags r={r} />
                    <span className="shrink-0 text-xs text-edvanta-subtle">~{r.energia_estimada_kcal} kcal</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-edvanta-subtle">
          Apoyo nutricional educativo basado en reglas verificadas. No reemplaza la indicación de tu equipo de salud. Valores nutricionales estimados.
        </p>
      </section>

      <FstFooter />
      <RecipeModal recipe={selected} cond={cond} onClose={() => setSelected(null)} />
    </div>
  );
}
