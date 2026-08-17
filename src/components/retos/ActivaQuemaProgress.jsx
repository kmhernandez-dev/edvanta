/**
 * ============================================================
 *  retos/ActivaQuemaProgress.jsx — Progreso del reto
 *  Activa & Quema (solo este reto).
 *  Barra de 7 días, mensaje según avance, XP acumulado e
 *  insignias desbloqueadas.
 * ============================================================
 */

import Icon from '../Icon';
import { challengeProgress, challengeXp, unlockedBadges, progressMessage } from '../../lib/retos';
import {
  ACTIVA_QUEMA_XP, ACTIVA_QUEMA_BADGES, ACTIVA_QUEMA_PROGRESS_MESSAGES,
} from '../../data/retos/activaQuema';

export default function ActivaQuemaProgress({ days, checkins }) {
  const progress = challengeProgress(days, checkins);
  const xp = challengeXp({ days, checkins, xpConfig: ACTIVA_QUEMA_XP });
  const badges = unlockedBadges({ days, checkins, badges: ACTIVA_QUEMA_BADGES });
  const message = progressMessage(progress.completed, ACTIVA_QUEMA_PROGRESS_MESSAGES);
  const completedIds = new Set(
    (checkins || []).filter(checkin => checkin.exercise_completed).map(checkin => String(checkin.challenge_day_id))
  );

  return (
    <section className="rounded-lg border border-sand-100 bg-white p-5 shadow-sm" aria-labelledby="progress-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="progress-title" className="text-sm font-bold text-deepblue-900">Tu progreso</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ebf7] px-3 py-1 text-xs font-semibold text-[#563a78]">
          <Icon name="sparkles" className="h-3.5 w-3.5" /> {xp} XP
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2" role="list" aria-label="Días del reto">
        {(days || []).map(day => {
          const done = completedIds.has(String(day.id));
          return (
            <div key={day.id} className="flex flex-1 flex-col items-center gap-1.5" role="listitem">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  done ? 'bg-teal-600 text-white' : 'border-2 border-sand-200 bg-white text-gray-400'
                }`}
                aria-label={`Día ${day.day_number}${done ? ' completado' : ' pendiente'}`}
              >
                {done ? <Icon name="check" className="h-4 w-4" /> : day.day_number}
              </span>
              <span className="text-[10px] font-medium text-gray-400">Día {day.day_number}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-sand-100" role="progressbar" aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={progress.total} aria-label="Progreso del reto">
          <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {progress.completed} de {progress.total} días completados · {progress.percent}%
        </p>
        {message && <p className="mt-2 text-sm font-semibold text-teal-700">{message}</p>}
      </div>

      {badges.length > 0 && (
        <div className="mt-4 border-t border-sand-100 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Insignias</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map(badge => (
              <span key={badge.id} className="inline-flex items-center gap-1.5 rounded-full border border-[#d7c8e5] bg-[#faf8fc] px-3 py-1.5 text-xs font-semibold text-[#563a78]" title={badge.description}>
                <Icon name="award" className="h-3.5 w-3.5" /> {badge.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
