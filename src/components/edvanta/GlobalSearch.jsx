import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowUpRight, CornerDownLeft, Compass, GraduationCap, Route as RouteIcon, Wrench, FileText } from 'lucide-react';
import { searchContent, orderedTypeGroups } from '../../lib/edvanta/search';

const TYPE_ICON = { careerArea: Compass, course: GraduationCap, learningRoute: RouteIcon, tool: Wrench, article: FileText };
const SUGGESTED = ['Validaciones', 'Aseguramiento de Calidad', 'Farmacovigilancia', 'Power BI', 'Asuntos Regulatorios', 'Hoja de vida'];

function useDebounced(value, delay = 160) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/**
 * Buscador global de Edvanta.
 * - Botón (icono) que abre un panel tipo command-palette.
 * - Atajos: "/" o Ctrl/Cmd+K para abrir; Escape para cerrar.
 * - Búsqueda mientras escribe (debounce) sobre TODO el ecosistema.
 */
export default function GlobalSearch({ className = '' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounced = useDebounced(q, 160);

  const { groups, flat } = useMemo(() => {
    if (!debounced.trim()) return { groups: [], flat: [] };
    const res = searchContent(debounced, { limit: 24 });
    const grouped = orderedTypeGroups(res.byType).map((g) => ({ ...g, items: g.items.slice(0, 5) }));
    const flatList = grouped.flatMap((g) => g.items.map((x) => x.node));
    return { groups: grouped, flat: flatList, total: res.total };
  }, [debounced]);

  // Índice de navegación: [ ...resultados, verTodos ]
  const seeAllIndex = flat.length;
  const hasQuery = debounced.trim().length > 0;

  useEffect(() => setActive(0), [debounced]);

  const close = useCallback(() => {
    setOpen(false);
    setQ('');
    setActive(0);
  }, []);

  const goToNode = useCallback(
    (node) => {
      if (!node) return;
      const external = Boolean(node.externalUrl);
      close();
      if (external) window.open(node.externalUrl, '_blank', 'noopener,noreferrer');
      else navigate(node.route || '/');
    },
    [close, navigate],
  );

  const seeAll = useCallback(() => {
    const term = debounced.trim();
    close();
    navigate(`/buscar?q=${encodeURIComponent(term)}`);
  }, [debounced, close, navigate]);

  // Abrir con "/" o Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Al abrir: foco al input y bloquear scroll del body
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(id);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const onInputKeyDown = (e) => {
    if (e.key === 'Escape') { close(); return; }
    const max = seeAllIndex; // último índice válido = "ver todos"
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, max)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (!hasQuery) return;
      if (active === seeAllIndex || flat.length === 0) seeAll();
      else goToNode(flat[active]);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-xl border border-edvanta-border bg-white px-3 text-sm text-slate-500 transition hover:border-edvanta-blue/40 hover:text-edvanta-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-edvanta-blue ${className}`}
        aria-label="Buscar en Edvanta"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden lg:inline">Buscar…</span>
        <kbd className="ml-1 hidden rounded border border-edvanta-border bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 lg:inline">/</kbd>
      </button>

      {!open ? null : (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/50 px-4 pt-[10vh] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar en Edvanta"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-edvanta-border px-4">
              <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKeyDown}
                type="search"
                placeholder="Busca cursos, áreas, rutas, herramientas o artículos…"
                className="h-14 w-full border-0 bg-transparent text-base text-edvanta-deep placeholder:text-slate-400 focus:outline-none focus:ring-0"
                aria-label="Término de búsqueda"
                aria-controls="edvanta-search-results"
              />
              <button type="button" onClick={close} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Cerrar buscador">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Resultados */}
            <div id="edvanta-search-results" className="edvanta-scrollbar-thin max-h-[55vh] overflow-y-auto p-2">
              {!hasQuery ? (
                <div className="px-3 py-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Búsquedas sugeridas</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQ(s)}
                        className="rounded-full border border-edvanta-border bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-edvanta-blue/40 hover:bg-edvanta-light hover:text-edvanta-blue"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : flat.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-600">No encontramos resultados para “{debounced}”.</p>
                  <p className="mt-1 text-sm text-slate-400">Intenta con un área (Calidad, Validaciones) o una competencia (GMP, CAPA, HPLC).</p>
                </div>
              ) : (
                <>
                  {groups.map((g) => {
                    const Icon = TYPE_ICON[g.type] || FileText;
                    return (
                      <div key={g.type} className="mb-1">
                        <p className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          <Icon className="h-3 w-3" aria-hidden="true" /> {g.items[0].node.typeLabel}
                        </p>
                        {g.items.map(({ node }) => {
                          const idx = flat.indexOf(node);
                          const isActive = idx === active;
                          const external = Boolean(node.externalUrl);
                          return (
                            <button
                              key={node.id}
                              type="button"
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => goToNode(node)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${isActive ? 'bg-edvanta-light' : 'hover:bg-slate-50'}`}
                            >
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5">
                                  <span className="truncate text-sm font-bold text-edvanta-deep">{node.title}</span>
                                  {external && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />}
                                </span>
                                {(node.areaLabels?.[0] || node.description) && (
                                  <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500">
                                    {node.areaLabels?.[0] ? `${node.areaLabels[0]} · ` : ''}{node.description}
                                  </span>
                                )}
                              </span>
                              {isActive && <CornerDownLeft className="h-4 w-4 shrink-0 text-edvanta-blue" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onMouseEnter={() => setActive(seeAllIndex)}
                    onClick={seeAll}
                    className={`mt-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${active === seeAllIndex ? 'bg-edvanta-blue text-white' : 'bg-slate-50 text-edvanta-blue hover:bg-edvanta-light'}`}
                  >
                    Ver todos los resultados de “{debounced}”
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
