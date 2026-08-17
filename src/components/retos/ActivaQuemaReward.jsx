/**
 * ============================================================
 *  retos/ActivaQuemaReward.jsx — Recompensa del reto
 *  Activa & Quema (solo este reto).
 *  Bloqueada hasta completar 7/7. Al completar muestra el
 *  recetario de recompensa (el archivo real se asociará
 *  posteriormente desde el sistema existente).
 * ============================================================
 */

import Icon from '../Icon';
import { ACTIVA_QUEMA_REWARD } from '../../data/retos/activaQuema';

export default function ActivaQuemaReward({ completed, total }) {
  const unlocked = total > 0 && completed >= total;

  return (
    <section className="rounded-lg border border-[#d7c8e5] bg-gradient-to-b from-[#faf8fc] to-white p-6 text-center shadow-sm sm:p-8" aria-labelledby="reward-title">
      <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${unlocked ? 'bg-[#f2ebf7] text-[#563a78]' : 'bg-sand-100 text-gray-400'}`}>
        <Icon name={unlocked ? 'gift' : 'lock'} className="h-7 w-7" />
      </span>
      <h2 id="reward-title" className="mt-4 font-serif text-2xl font-semibold text-deepblue-900">
        {unlocked ? ACTIVA_QUEMA_REWARD.title : 'Tu recompensa te espera'}
      </h2>
      <p className="mt-1 text-sm italic text-[#76539a]">
        {unlocked ? ACTIVA_QUEMA_REWARD.subtitle : 'Completa 7/7 días para desbloquearla.'}
      </p>

      {unlocked ? (
        <>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600">{ACTIVA_QUEMA_REWARD.text}</p>
          {ACTIVA_QUEMA_REWARD.url ? (
            <a
              href={ACTIVA_QUEMA_REWARD.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#563a78] px-6 text-sm font-semibold text-white hover:bg-[#452b65]"
            >
              <Icon name="gift" className="h-4 w-4" /> {ACTIVA_QUEMA_REWARD.cta}
            </a>
          ) : (
            <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              Tu recetario está en preparación. Pronto estará disponible aquí como parte de tus recursos de Feliz Sin Tiroides.
            </p>
          )}
        </>
      ) : (
        <div className="mx-auto mt-6 max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-sand-100" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total} aria-label="Progreso hacia la recompensa">
            <div className="h-full rounded-full bg-[#563a78] transition-all duration-500" style={{ width: `${total > 0 ? Math.round((completed / total) * 100) : 0}%` }} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {completed} de {total} días · faltan {Math.max(total - completed, 0)}
          </p>
        </div>
      )}
    </section>
  );
}
