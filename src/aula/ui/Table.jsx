import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useDebounced } from '../hooks';
import { EmptyState, ErrorState, LoadingBlock } from './States';

/**
 * Tabla administrativa con estados de carga, vacío y error.
 * columns: [{ key, header, render?, sortable?, align?, className? }]
 * rowHref: la primera celda es un enlace real (teclado y lector de pantalla)
 * y el clic en cualquier parte de la fila lleva al mismo destino.
 */
export function DataTable({
  columns, rows, rowKey = 'id', sort, dir, onSort, loading, error, onRetry, empty, caption,
  rowHref, selection,
}) {
  const navigate = useNavigate();
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (loading && !rows?.length) return <LoadingBlock rows={5} />;
  if (!rows?.length) return empty || <EmptyState title="Sin resultados" description="Prueba con otros filtros o términos de búsqueda." />;

  const allChecked = selection && rows.every((r) => selection.selected.has(r[rowKey]));

  return (
    <div className={`overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface)] ${loading ? 'opacity-60' : ''}`}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-[var(--aula-border)] bg-[var(--aula-surface-muted)]">
            {selection && (
              <th scope="col" className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos los de esta página"
                  checked={allChecked}
                  onChange={() => selection.toggleAll(rows.map((r) => r[rowKey]), !allChecked)}
                  className="h-4 w-4 accent-[var(--aula-primary)]"
                />
              </th>
            )}
            {columns.map((col) => {
              const active = sort === col.key;
              const Icon = !active ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--aula-muted)] ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.className || ''}`}
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key, active && dir === 'asc' ? 'desc' : 'asc')}
                      className="inline-flex items-center gap-1 uppercase hover:text-[var(--aula-text)]"
                    >
                      {col.header}
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  ) : col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={rowHref ? (e) => {
                // Los controles de la fila (y el propio enlace) hacen lo suyo.
                if (e.target.closest('a, button, input, select, textarea, label')) return;
                if (window.getSelection()?.toString()) return;
                navigate(rowHref(row));
              } : undefined}
              className={`border-b border-[var(--aula-border)] last:border-0 ${rowHref ? 'cursor-pointer hover:bg-[var(--aula-surface-muted)]' : ''}`}
            >
              {selection && (
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    aria-label="Seleccionar fila"
                    checked={selection.selected.has(row[rowKey])}
                    onChange={() => selection.toggle(row[rowKey])}
                    className="h-4 w-4 accent-[var(--aula-primary)]"
                  />
                </td>
              )}
              {columns.map((col, index) => {
                const content = col.render ? col.render(row) : row[col.key] ?? '—';
                return (
                  <td key={col.key} className={`px-4 py-3 align-middle ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}>
                    {rowHref && index === 0 ? (
                      <Link to={rowHref(row)} className="block rounded-[var(--aula-radius-sm)] hover:text-[var(--aula-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aula-primary)]">
                        {content}
                      </Link>
                    ) : content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, pages, total, pageSize, onPage }) {
  if (!total) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3 pt-3 text-sm text-[var(--aula-muted)]">
      <span>{from}–{to} de {total}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-[var(--aula-radius-sm)] px-3 font-medium hover:bg-[var(--aula-neutral-soft)] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <span className="px-2 font-medium text-[var(--aula-text)]">{page} / {pages}</span>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="inline-flex h-9 items-center gap-1 rounded-[var(--aula-radius-sm)] px-3 font-medium hover:bg-[var(--aula-neutral-soft)] disabled:opacity-40"
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

/** Buscador con espera: avisa el cambio 300 ms después de que el usuario deja de escribir. */
export function SearchInput({ value, onChange, placeholder = 'Buscar…', label = 'Buscar', className = '' }) {
  const [text, setText] = useState(value || '');
  const debounced = useDebounced(text, 300);
  useEffect(() => { setText(value || ''); }, [value]);
  useEffect(() => {
    if (debounced !== (value || '')) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--aula-muted)]" aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-[var(--aula-radius)] border border-[var(--aula-border-strong)] bg-white pl-9 pr-9 text-sm focus:border-[var(--aula-primary)] focus:outline-none focus:ring-[3px] focus:ring-[var(--aula-primary-soft)]"
      />
      {text && (
        <button type="button" onClick={() => setText('')} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-[var(--aula-muted)] hover:text-[var(--aula-text)]">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** Selector compacto para filtros de tabla. */
export function FilterSelect({ label, value, onChange, options, allLabel = 'Todos', className = '' }) {
  return (
    <label className={`flex flex-col gap-1 text-xs font-semibold text-[var(--aula-muted)] ${className}`}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 min-w-[150px] rounded-[var(--aula-radius)] border border-[var(--aula-border-strong)] bg-white px-3 text-sm font-normal text-[var(--aula-text)] focus:border-[var(--aula-primary)] focus:outline-none focus:ring-[3px] focus:ring-[var(--aula-primary-soft)]"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/** Estado de selección múltiple para tablas. */
export function useSelection() {
  const [selected, setSelected] = useState(() => new Set());
  return {
    selected,
    count: selected.size,
    toggle: (id) => setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    }),
    toggleAll: (ids, on) => setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    }),
    clear: () => setSelected(new Set()),
  };
}
