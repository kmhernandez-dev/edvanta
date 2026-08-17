/**
 * ============================================================
 *  retos/ChallengeCompletion.jsx — Pantalla de fin de semana
 *  "Girl, lo hiciste." + insignia + compartir + próximo reto.
 * ============================================================
 */

import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { buildCompletionMessage } from '../../lib/retos';
import { waLink } from '../../config/links';

export default function ChallengeCompletion({ challenge, days, checkins, onShare }) {
  const completedMinutes = (days || []).reduce((total, day) => {
    const done = (checkins || []).some(checkin =>
      String(checkin.challenge_day_id) === String(day.id) && checkin.exercise_completed
    );
    return total + (done && day.duration_minutes ? day.duration_minutes : 0);
  }, 0);

  const shareUrl = waLink(buildCompletionMessage({ challengeTitle: challenge.title }));

  return (
    <section className="rounded-lg border border-[#d7c8e5] bg-gradient-to-b from-[#faf8fc] to-white p-6 text-center shadow-sm sm:p-10" aria-labelledby="completion-title">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2ebf7] text-[#563a78]">
        <Icon name="award" className="h-8 w-8" />
      </span>
      <h2 id="completion-title" className="mt-5 font-serif text-3xl font-semibold text-deepblue-900">Girl, lo hiciste.</h2>
      <p className="mt-2 text-base text-gray-600">Completaste {challenge.title}.</p>

      <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
        <div className="rounded-lg border border-sand-100 bg-white p-4">
          <p className="text-2xl font-bold text-teal-700">7/7</p>
          <p className="mt-1 text-xs text-gray-400">días completados</p>
        </div>
        <div className="rounded-lg border border-sand-100 bg-white p-4">
          <p className="text-2xl font-bold text-teal-700">{completedMinutes || '—'}</p>
          <p className="mt-1 text-xs text-gray-400">minutos realizados</p>
        </div>
        <div className="rounded-lg border border-sand-100 bg-white p-4">
          <p className="text-2xl font-bold text-teal-700">1</p>
          <p className="mt-1 text-xs text-gray-400">reto completado</p>
        </div>
      </div>

      <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-[#d7c8e5] bg-white px-4 py-2 text-sm font-semibold text-[#563a78]">
        <Icon name="award" className="h-4 w-4" /> {challenge.title} · Completed
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onShare?.('completion')}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#563a78] px-6 text-sm font-semibold text-white hover:bg-[#452b65]"
        >
          <Icon name="message" className="h-4 w-4" /> Compartir mi logro
        </a>
        <Link to="/academia/retos" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-6 text-sm font-semibold text-teal-700 hover:bg-teal-50">
          Elegir próximo reto
        </Link>
        <Link to="/academia" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-sand-200 bg-white px-6 text-sm font-semibold text-gray-600 hover:bg-sand-50">
          Volver a Academia
        </Link>
      </div>
    </section>
  );
}
