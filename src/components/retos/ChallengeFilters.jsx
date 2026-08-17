/**
 * ============================================================
 *  retos/ChallengeFilters.jsx — Filtros de /academia/retos
 *  Móvil: drawer/bottom sheet. Escritorio: panel lateral.
 * ============================================================
 */

import { useState } from 'react';
import Icon from '../Icon';
import {
  GOALS, BODY_AREAS, TRAINING_TYPES, DURATION_RANGES, EQUIPMENT_OPTIONS, LEVELS,
} from '../../lib/retos';

function FilterGroup({ label, options, value, onChange, optionLabel }) {
  return (
    <fieldset className="border-t border-sand-100 pt-4 first:border-t-0 first:pt-0">
      <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const id = typeof option === 'string' ? option : option.id;
          const text = optionLabel ? optionLabel(option) : (typeof option === 'string' ? option : option.label);
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(active ? '' : id)}
              aria-pressed={active}
              className={`min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-sand-200 bg-white text-deepblue-800 hover:border-teal-200'
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ChallengeFilters({ filters, onChange, onClear, resultCount }) {
  const [open, setOpen] = useState(false);

  const set = (key, value) => onChange({ ...filters, [key]: value });
  const activeCount = Object.values(filters).filter(Boolean).length;

  const panel = (
    <div className="space-y-5">
      <FilterGroup
        label="Objetivo"
        options={GOALS}
        value={filters.goal}
        onChange={value => set('goal', value)}
        optionLabel={option => option.label}
      />
      <FilterGroup label="Zona corporal" options={BODY_AREAS} value={filters.bodyArea} onChange={value => set('bodyArea', value)} />
      <FilterGroup label="Tipo" options={TRAINING_TYPES} value={filters.type} onChange={value => set('type', value)} />
      <FilterGroup label="Duración diaria" options={DURATION_RANGES} value={filters.duration} onChange={value => set('duration', value)} />
      <FilterGroup label="Equipamiento" options={EQUIPMENT_OPTIONS} value={filters.equipment} onChange={value => set('equipment', value)} />
      <FilterGroup
        label="Nivel"
        options={LEVELS}
        value={filters.level}
        onChange={value => set('level', value)}
        optionLabel={option => option.label}
      />
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-sand-200 bg-white px-4 text-xs font-semibold text-gray-600 hover:border-teal-200"
        >
          <Icon name="close" className="h-3.5 w-3.5" /> Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Escritorio */}
      <aside className="hidden lg:block" aria-label="Filtros de retos">
        <div className="rounded-lg border border-sand-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-deepblue-900">Filtros</h2>
            {resultCount !== undefined && <span className="text-xs text-gray-400">{resultCount} retos</span>}
          </div>
          {panel}
        </div>
      </aside>

      {/* Móvil: bottom sheet */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-sand-200 bg-white px-4 text-sm font-semibold text-deepblue-800 shadow-sm"
          aria-haspopup="dialog"
        >
          <Icon name="list" className="h-4 w-4" /> Filtros
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">{activeCount}</span>
          )}
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" role="dialog" aria-modal="true" aria-label="Filtros de retos">
            <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-deepblue-900">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-sand-200 text-gray-600"
                  aria-label="Cerrar filtros"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>
              {panel}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-teal-600 px-6 text-sm font-semibold text-white"
              >
                Ver {resultCount !== undefined ? `${resultCount} retos` : 'retos'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
