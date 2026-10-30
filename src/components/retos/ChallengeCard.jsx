/**
 * ============================================================
 *  retos/ChallengeCard.jsx — Tarjeta de reto
 *  Estética FST: femenina, limpia, wellness. Sin emojis.
 * ============================================================
 */

import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { levelLabel, goalLabel } from '../../lib/retos';

const COVER_GRADIENTS = [
  'from-edvanta-mint to-edvanta-lilac',
  'from-edvanta-lilac to-[#F0FAF9]',
  'from-edvanta-lilac to-edvanta-bg',
  'from-[#F0FAF9] to-edvanta-lilac',
];

function coverGradient(title) {
  let hash = 0;
  for (const char of title || '') hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

export default function ChallengeCard({ challenge, progress = null }) {
  const gradient = coverGradient(challenge.title);
  const pct = progress?.percent ?? null;

  return (
    <Link
      to={`/academia/retos/${challenge.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-edvanta-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
    >
      <div className={`relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${gradient}`}>
        {challenge.cover_image ? (
          <img
            src={challenge.cover_image}
            alt={challenge.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center">
            <Icon name="sparkles" className="mx-auto h-10 w-10 text-edvanta-blue" />
            <p className="mt-2 font-display text-lg font-extrabold text-edvanta-deep">{challenge.title}</p>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-edvanta-deep">
          7 días
        </span>
        {challenge.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-edvanta-blue/90 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Destacado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-extrabold leading-snug text-edvanta-deep transition-colors group-hover:text-teal-700">
          {challenge.title}
        </h3>
        {challenge.tagline && <p className="text-sm italic text-edvanta-blue">{challenge.tagline}</p>}
        {challenge.description && (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-edvanta-muted">{challenge.description}</p>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-edvanta-subtle">
          {challenge.average_duration && (
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" className="h-3.5 w-3.5" /> {challenge.average_duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Icon name="activity" className="h-3.5 w-3.5" /> {levelLabel(challenge.level)}
          </span>
          {challenge.equipment && (
            <span className="inline-flex items-center gap-1">
              <Icon name="check" className="h-3.5 w-3.5" /> {challenge.equipment}
            </span>
          )}
        </div>

        {pct !== null && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-700">{progress.completed} de {progress.total} días</span>
              <span className="font-semibold text-teal-700">{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-edvanta-bg" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso del reto ${challenge.title}`}>
              <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-600">
          {pct !== null && pct > 0 ? 'Continuar reto' : 'Ver reto'}
          <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
