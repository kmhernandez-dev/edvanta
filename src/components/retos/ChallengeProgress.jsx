/**
 * ============================================================
 *  retos/ChallengeProgress.jsx — Progreso de 7 días + racha
 *  Amable: sin mensajes de culpa. La racha se reinicia sola.
 * ============================================================
 */

import Icon from '../Icon';
import { challengeProgress, currentStreak } from '../../lib/retos';

export default function ChallengeProgress({ days, checkins }) {
  const progress = challengeProgress(days, checkins);
  const streak = currentStreak(checkins);
  const completedIds = new Set(
    (checkins || [])
      .filter(checkin => checkin.exercise_completed)
      .map(checkin => String(checkin.challenge_day_id))
  );

  return (
    <section className="rounded-lg border border-edvanta-border bg-white p-5 shadow-sm" aria-labelledby="progress-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="progress-title" className="text-sm font-bold text-edvanta-deep">Tu progreso</h2>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-edvanta-lilac px-3 py-1 text-xs font-semibold text-[#5E51A8]">
            <Icon name="sparkles" className="h-3.5 w-3.5" /> {streak} {streak === 1 ? 'día' : 'días'} de racha
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2" role="list" aria-label="Días del reto">
        {(days || []).map(day => {
          const done = completedIds.has(String(day.id));
          return (
            <div key={day.id} className="flex flex-1 flex-col items-center gap-1.5" role="listitem">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  done ? 'bg-teal-600 text-white' : 'border-2 border-edvanta-border bg-white text-edvanta-subtle'
                }`}
                aria-label={`Día ${day.day_number}${done ? ' completado' : ' pendiente'}`}
              >
                {done ? <Icon name="check" className="h-4 w-4" /> : day.day_number}
              </span>
              <span className="text-[10px] font-medium text-edvanta-subtle">Día {day.day_number}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-edvanta-bg" role="progressbar" aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={progress.total} aria-label="Progreso del reto">
          <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2 text-xs text-edvanta-muted">
          {progress.completed} de {progress.total} días completados · {progress.percent}%
        </p>
      </div>

      {streak === 0 && progress.completed > 0 && (
        <p className="mt-3 rounded-md bg-edvanta-bg p-3 text-xs leading-5 text-edvanta-blue">
          Hoy también puedes volver a empezar.
        </p>
      )}
    </section>
  );
}
