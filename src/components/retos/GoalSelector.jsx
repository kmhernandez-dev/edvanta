/**
 * ============================================================
 *  retos/GoalSelector.jsx — Elige tu objetivo (3 tarjetas)
 *  Guarda selected_goal en localStorage y lo persiste al
 *  unirse a un reto (backend).
 * ============================================================
 */

import { useEffect, useState } from 'react';
import Icon from '../Icon';
import { GOALS } from '../../lib/retos';

const STORAGE_KEY = 'fst_retos_selected_goal';

export function getStoredGoal() {
  try { return localStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
}

export function storeGoal(goalId) {
  try { localStorage.setItem(STORAGE_KEY, goalId); } catch { /* almacenamiento no disponible */ }
}

export default function GoalSelector({ onSelect }) {
  const [selected, setSelected] = useState(() => getStoredGoal());

  useEffect(() => {
    if (selected) onSelect?.(selected);
  }, [selected, onSelect]);

  const choose = goalId => {
    setSelected(goalId);
    storeGoal(goalId);
    onSelect?.(goalId);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Elige tu objetivo">
      {GOALS.map(goal => {
        const active = selected === goal.id;
        return (
          <button
            key={goal.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => choose(goal.id)}
            className={`flex flex-col items-start gap-3 rounded-lg border p-5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
              active
                ? 'border-teal-500 bg-teal-50/60 shadow-md'
                : 'border-sand-100 bg-white shadow-sm hover:border-teal-200 hover:shadow-md'
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${active ? 'bg-teal-600 text-white' : 'bg-[#f2ebf7] text-[#563a78]'}`}>
              <Icon name={goal.icon} className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold leading-snug text-deepblue-900">{goal.label}</span>
            <span className="text-sm leading-relaxed text-gray-500">{goal.description}</span>
            <span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${active ? 'text-teal-700' : 'text-gray-400'}`}>
              {active ? (
                <>
                  <Icon name="checkCircle" className="h-4 w-4" /> Objetivo seleccionado
                </>
              ) : (
                'Seleccionar'
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
