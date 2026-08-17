/**
 * ============================================================
 *  retos/NutriFitCTA.jsx — Conexión con NutriFit (NutriFST IA)
 *  NutriFit sigue siendo la fuente de la estrategia nutricional.
 *  Solo pasa el objetivo como contexto (no rompe NutriFit).
 * ============================================================
 */

import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { trackEvent } from '../../utils/analytics';

export default function NutriFitCTA({ goal }) {
  const query = goal ? `?goal=${encodeURIComponent(goal)}` : '';
  return (
    <section className="rounded-lg border border-[#eae2f8] bg-[#f7f3fb] p-5 sm:p-6" aria-labelledby="nutrifit-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="nutrifit-title" className="text-base font-bold text-[#563a78]">Complementa tu reto con NutriFit</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-gray-600">
            Adapta tu alimentación según tu objetivo y tus datos actuales.
          </p>
        </div>
        <Link
          to={`/fst-app/nutrifst${query}`}
          onClick={() => trackEvent('nutrifit_opened_from_challenge', { goal: goal || null })}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#563a78] px-6 text-sm font-semibold text-white hover:bg-[#452b65]"
        >
          <Icon name="sparkles" className="h-4 w-4" /> Abrir mi NutriFit
        </Link>
      </div>
    </section>
  );
}
