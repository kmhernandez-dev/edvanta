/**
 * ============================================================
 *  retos/ActivaQuemaCheckin.jsx — Check-in personalizado del
 *  reto Activa & Quema (solo este reto).
 *  Preguntas por día (antes/después), bonus opcional del Día 2
 *  y mensaje de finalización con insignia del día.
 * ============================================================
 */

import { useState } from 'react';
import Icon from '../Icon';
import {
  ACTIVA_QUEMA_CHECKINS, ACTIVA_QUEMA_BONUS, ACTIVA_QUEMA_DAY_MESSAGES,
  ACTIVA_QUEMA_BADGES,
} from '../../data/retos/activaQuema';
import { unlockedBadges } from '../../lib/retos';

export default function ActivaQuemaCheckin({ day, checkin, onSave, saving, days, checkins }) {
  const [answers, setAnswers] = useState(() => checkin?.checkin_answers || {});
  const [error, setError] = useState('');

  const exerciseDone = checkin?.exercise_completed || false;
  const questions = ACTIVA_QUEMA_CHECKINS[day.day_number] || [];
  const bonus = ACTIVA_QUEMA_BONUS[day.day_number];
  const dayMessage = ACTIVA_QUEMA_DAY_MESSAGES[day.day_number];
  const dayBadge = unlockedBadges({ days, checkins, badges: ACTIVA_QUEMA_BADGES })
    .find(badge => badge.day === day.day_number);

  const save = async (patch = {}) => {
    setError('');
    try {
      await onSave({
        exercise_completed: patch.exercise_completed ?? exerciseDone,
        checkin_answers: patch.checkin_answers ?? answers,
      });
    } catch (requestError) {
      setError(requestError.message || 'No fue posible guardar el check-in');
    }
  };

  const toggleAnswer = (questionId, option) => {
    const question = questions.find(item => item.id === questionId);
    const current = answers[questionId];
    let next;
    if (question?.type === 'multi') {
      const list = Array.isArray(current) ? current : [];
      next = list.includes(option) ? list.filter(item => item !== option) : [...list, option];
    } else {
      next = current === option ? null : option;
    }
    const updated = { ...answers, [questionId]: next };
    setAnswers(updated);
    save({ checkin_answers: updated });
  };

  const toggleBonus = () => {
    const updated = { ...answers, bonus_day_2: !answers.bonus_day_2 };
    setAnswers(updated);
    save({ checkin_answers: updated });
  };

  const renderQuestion = question => {
    const current = answers[question.id];
    const selected = Array.isArray(current) ? current : current ? [current] : [];
    return (
      <div key={question.id} className="border-t border-sand-100 pt-5">
        <h2 className="text-base font-bold text-deepblue-900">{question.question}</h2>
        <p className="mt-1 text-xs text-gray-400">
          {question.phase === 'before' ? 'Antes de entrenar' : 'Después de entrenar'}
          {question.type === 'multi' ? ' · Puedes elegir más de una' : ' · Elige una opción'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={question.question}>
          {question.options.map(option => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                role={question.type === 'multi' ? 'checkbox' : 'radio'}
                aria-checked={active}
                onClick={() => toggleAnswer(question.id, option)}
                className={`min-h-10 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  active ? 'border-[#76539a] bg-[#f2ebf7] text-[#563a78]' : 'border-sand-200 bg-white text-gray-600 hover:border-[#d7c8e5]'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
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

      {/* Preguntas del día */}
      {questions.map(renderQuestion)}

      {/* Bonus opcional (Día 2) */}
      {bonus && (
        <div className="border-t border-sand-100 pt-5">
          <h2 className="text-base font-bold text-deepblue-900">{bonus.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{bonus.text}</p>
          <button
            type="button"
            onClick={toggleBonus}
            disabled={saving}
            className={`mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
              answers.bonus_day_2
                ? 'border-[#76539a] bg-[#f2ebf7] text-[#563a78]'
                : 'border-sand-200 bg-white text-gray-600 hover:border-[#d7c8e5]'
            }`}
          >
            <Icon name={answers.bonus_day_2 ? 'checkCircle' : 'circle'} className="h-4 w-4" />
            {bonus.cta}
          </button>
          <p className="mt-2 text-xs text-gray-400">Opcional. No es obligatorio para completar el día.</p>
        </div>
      )}

      {/* Mensaje de finalización del día */}
      {exerciseDone && dayMessage && (
        <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-5 text-center">
          <h2 className="font-serif text-xl font-semibold text-deepblue-900">{dayMessage.completionTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">{dayMessage.completionText}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-teal-700">{dayMessage.completionCount}</p>
          {dayBadge && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7c8e5] bg-white px-4 py-2 text-xs font-semibold text-[#563a78]">
              <Icon name="award" className="h-4 w-4" /> Insignia desbloqueada: {dayBadge.title}
            </p>
          )}
        </div>
      )}

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}
