/**
 * ============================================================
 *  retos/DailyCheckin.jsx — Check-in diario del reto
 *  Completar día, sensación, microreto nutricional y energía.
 *  No es diagnóstico médico: solo registro de bienestar.
 * ============================================================
 */

import { useState } from 'react';
import Icon from '../Icon';
import { DIFFICULTY_OPTIONS, difficultyLabel } from '../../lib/retos';

export default function DailyCheckin({ checkin, onSave, saving, nutritionChallenge }) {
  const [difficulty, setDifficulty] = useState(checkin?.perceived_difficulty || '');
  const [energy, setEnergy] = useState(checkin?.energy_score || 0);
  const [nutritionDone, setNutritionDone] = useState(checkin?.nutrition_completed || false);
  const [error, setError] = useState('');

  const exerciseDone = checkin?.exercise_completed || false;

  const save = async (patch = {}) => {
    setError('');
    try {
      await onSave({
        exercise_completed: patch.exercise_completed ?? exerciseDone,
        nutrition_completed: patch.nutrition_completed ?? nutritionDone,
        perceived_difficulty: patch.perceived_difficulty ?? difficulty,
        energy_score: patch.energy_score ?? energy,
      });
    } catch (requestError) {
      setError(requestError.message || 'No fue posible guardar el check-in');
    }
  };

  return (
    <section className="space-y-5 rounded-lg border border-sand-100 bg-white p-5 shadow-sm sm:p-6" aria-label="Check-in del día">
      {/* Completar día */}
      <div>
        <h2 className="text-base font-bold text-deepblue-900">¿Terminaste tu entrenamiento?</h2>
        <button
          type="button"
          onClick={() => save({ exercise_completed: !exerciseDone })}
          disabled={saving}
          className={`mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition-colors disabled:opacity-60 sm:w-auto ${
            exerciseDone
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          <Icon name={exerciseDone ? 'checkCircle' : 'check'} className="h-5 w-5" />
          {saving ? 'Guardando...' : exerciseDone ? 'Día completado · Toca para desmarcar' : 'Completar día'}
        </button>
        {exerciseDone && checkin?.completed_at && (
          <p className="mt-2 text-xs text-gray-400">
            Completado el {new Date(checkin.completed_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Sensación */}
      <div className="border-t border-sand-100 pt-5">
        <h2 className="text-base font-bold text-deepblue-900">¿Cómo se sintió hoy?</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="¿Cómo se sintió hoy?">
          {DIFFICULTY_OPTIONS.map(option => {
            const active = difficulty === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => { setDifficulty(option.id); save({ perceived_difficulty: option.id }); }}
                className={`min-h-10 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  active ? 'border-[#76539a] bg-[#f2ebf7] text-[#563a78]' : 'border-sand-200 bg-white text-gray-600 hover:border-[#d7c8e5]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {difficulty && <p className="mt-2 text-xs text-gray-400">Guardado: {difficultyLabel(difficulty)}</p>}
      </div>

      {/* Microreto nutricional */}
      {nutritionChallenge && (
        <div className="border-t border-sand-100 pt-5">
          <h2 className="text-base font-bold text-deepblue-900">Mi check-in de hoy</h2>
          <div className="mt-3 space-y-2">
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <Icon name={exerciseDone ? 'checkCircle' : 'circle'} className={`h-5 w-5 ${exerciseDone ? 'text-teal-600' : 'text-gray-300'}`} />
              Entrenamiento realizado
            </p>
            <button
              type="button"
              onClick={() => { setNutritionDone(value => !value); save({ nutrition_completed: !nutritionDone }); }}
              className="flex w-full items-center gap-2 rounded-md p-1 text-left text-sm text-gray-700 hover:bg-sand-50"
              aria-pressed={nutritionDone}
            >
              <Icon name={nutritionDone ? 'checkCircle' : 'circle'} className={`h-5 w-5 shrink-0 ${nutritionDone ? 'text-teal-600' : 'text-gray-300'}`} />
              <span>
                <span className="font-semibold">Reto de alimentación:</span> {nutritionChallenge}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Energía */}
      <div className="border-t border-sand-100 pt-5">
        <h2 className="text-base font-bold text-deepblue-900">¿Cómo está tu energía hoy?</h2>
        <p className="mt-1 text-xs text-gray-400">Opcional. Solo para tu registro personal.</p>
        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Nivel de energía de 1 a 5">
          {[1, 2, 3, 4, 5].map(value => {
            const active = energy === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Energía ${value} de 5`}
                onClick={() => { setEnergy(value); save({ energy_score: value }); }}
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                  active ? 'border-teal-600 bg-teal-600 text-white' : 'border-sand-200 bg-white text-gray-500 hover:border-teal-200'
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}
