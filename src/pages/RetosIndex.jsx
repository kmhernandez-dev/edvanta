/**
 * ============================================================
 *  RetosIndex.jsx — /academia/retos
 *  Hero → Reto de esta semana → Elige tu objetivo →
 *  Explorar por vibe → Continúa tu reto → Todos los retos.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import ChallengeCard from '../components/retos/ChallengeCard';
import ChallengeFilters from '../components/retos/ChallengeFilters';
import GoalSelector, { getStoredGoal } from '../components/retos/GoalSelector';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import {
  enrichChallenge, filterChallenges, levelLabel,
} from '../lib/retos';

export default function RetosIndex() {
  const { user, academiaApi: api } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [weekly, setWeekly] = useState(null);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(() => getStoredGoal());
  const [filters, setFilters] = useState({ goal: '', bodyArea: '', type: '', duration: '', equipment: '', level: '' });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    updatePageSeo({
      title: 'Retos FST | Retos semanales de movimiento | Feliz Sin Tiroides',
      description: 'Retos de 7 días de movimiento, fuerza, Pilates, caminatas y hábitos de alimentación para tu rutina. Elige tu objetivo y encuentra tu vibe.',
      canonical: 'https://edvanta.co/academia/retos',
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/academia/retos').then(r => r.json()),
      fetch('/api/academia/retos/weekly').then(r => r.json()),
    ])
      .then(([listData, weeklyData]) => {
        if (cancelled) return;
        setChallenges((listData.challenges || []).map(enrichChallenge));
        setWeekly(weeklyData.challenge ? enrichChallenge(weeklyData.challenge) : null);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!user) { setMine([]); return; }
    let cancelled = false;
    api('/api/academia/retos/mine')
      .then(data => { if (!cancelled) setMine(data.challenges || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user, api]);

  const handleGoalSelect = useCallback(selectedGoal => {
    setGoal(selectedGoal);
    setFilters(current => ({ ...current, goal: selectedGoal }));
    trackEvent('challenge_filter_used', { filter: 'goal', value: selectedGoal });
  }, []);

  const filtered = useMemo(() => filterChallenges(challenges, filters), [challenges, filters]);

  const activeChallenge = useMemo(() => {
    if (!user || mine.length === 0) return null;
    const active = mine.find(item => item.status === 'active');
    return active || null;
  }, [user, mine]);

  const activeProgress = useMemo(() => {
    if (!activeChallenge) return null;
    const total = activeChallenge.total_days || 7;
    const completed = activeChallenge.completed_days || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent, nextDay: Math.min(completed + 1, total) };
  }, [activeChallenge]);

  const scrollToAll = () => {
    document.getElementById('todos-los-retos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      {/* A. Hero */}
      <section className="border-b border-gray-200 bg-white pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#eae2f8] bg-[#f7f3fb] px-4 py-2">
            <Icon name="sparkles" className="h-4 w-4 text-[#6b4fa8]" />
            <span className="text-xs font-semibold text-[#6b4fa8]">Retos FST · Feliz Sin Tiroides</span>
          </div>
          <h1 className="mb-5 font-serif text-3xl font-semibold leading-[1.15] text-deepblue-900 md:text-5xl">
            Tu semana. Tu objetivo. Tu reto.
          </h1>
          <p className="mx-auto mb-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            Elige cómo quieres moverte esta semana y encuentra una experiencia de 7 días que se adapte a ti.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#elige-tu-objetivo" onClick={event => { event.preventDefault(); document.getElementById('elige-tu-objetivo')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700">
              Encontrar mi reto
            </a>
            <button type="button" onClick={scrollToAll} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#d7c8e5] bg-white px-6 text-sm font-semibold text-[#563a78] hover:bg-[#faf8fc]">
              Ver todos los retos
            </button>
          </div>
        </div>
      </section>

      {/* B. Reto de esta semana */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold text-deepblue-900">Reto de esta semana</h2>
            <button type="button" onClick={scrollToAll} className="text-sm font-semibold text-teal-700 hover:underline">Ver todos</button>
          </div>
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-400">Cargando retos...</p>
          ) : weekly ? (
            <div className="grid overflow-hidden rounded-lg border border-sand-100 bg-white shadow-sm md:grid-cols-2">
              <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-[#e8f4f2] to-[#fdf2f6] md:aspect-auto">
                {weekly.cover_image ? (
                  <img src={weekly.cover_image} alt={weekly.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Icon name="sparkles" className="mx-auto h-12 w-12 text-[#563a78]" />
                    <p className="mt-2 font-serif text-xl font-semibold text-deepblue-900">{weekly.title}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-teal-600">Reto destacado</span>
                <h3 className="font-serif text-2xl font-semibold text-deepblue-900">{weekly.title}</h3>
                {weekly.tagline && <p className="text-sm italic text-[#76539a]">{weekly.tagline}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>7 días</span>
                  {weekly.average_duration && <span>· {weekly.average_duration}</span>}
                  <span>· {levelLabel(weekly.level)}</span>
                  {weekly.equipment && <span>· {weekly.equipment}</span>}
                  {weekly.instructor && <span>· {weekly.instructor}</span>}
                </div>
                <Link to={`/academia/retos/${weekly.slug}`} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700">
                  Unirme al reto <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-sand-100 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">Estamos preparando el próximo reto ✨</p>
              <p className="mt-1 text-xs text-gray-400">Mientras tanto, explora la biblioteca de retos evergreen.</p>
            </div>
          )}
        </div>
      </section>

      {/* C. Elige tu objetivo */}
      <section id="elige-tu-objetivo" className="scroll-mt-24 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Primer paso</p>
            <h2 className="font-serif text-3xl font-semibold text-deepblue-900">Elige tu objetivo</h2>
          </div>
          <GoalSelector onSelect={handleGoalSelect} />
        </div>
      </section>

      {/* D. Explorar por vibe */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Biblioteca</p>
            <h2 className="font-serif text-3xl font-semibold text-deepblue-900">Explora por vibe</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Doce colecciones de 7 días para moverte a tu manera. Todas pueden iniciarse cualquier día.
            </p>
          </div>
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-400">Cargando retos...</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {challenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* E. Continúa tu reto */}
      {user && activeChallenge && activeProgress && (
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">Continúa tu reto</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-deepblue-900">{activeChallenge.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Día {activeProgress.nextDay} de {activeProgress.total} · {activeProgress.percent}%
                  </p>
                  <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={activeProgress.completed} aria-valuemin={0} aria-valuemax={activeProgress.total} aria-label={`Progreso de ${activeChallenge.title}`}>
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${activeProgress.percent}%` }} />
                  </div>
                </div>
                <Link to={`/academia/retos/${activeChallenge.slug}/dia/${activeProgress.nextDay}`} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700">
                  Continuar Día {activeProgress.nextDay} <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* F. Todos los retos (grid filtrable) */}
      <section id="todos-los-retos" className="scroll-mt-24 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-semibold text-deepblue-900">Todos los retos</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Filtra por objetivo, zona corporal, tipo, duración, equipamiento y nivel.
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <ChallengeFilters
              filters={filters}
              onChange={newFilters => { setFilters(newFilters); trackEvent('challenge_filter_used', { filters: newFilters }); }}
              onClear={() => setFilters({ goal: '', bodyArea: '', type: '', duration: '', equipment: '', level: '' })}
              resultCount={filtered.length}
            />

            <div>
              {loading ? (
                <p className="py-10 text-center text-sm text-gray-400">Cargando retos...</p>
              ) : filtered.length === 0 ? (
                <div className="rounded-lg border border-sand-100 bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-deepblue-900">Tu próxima semana puede empezar aquí.</p>
                  <p className="mt-1 text-xs text-gray-400">Prueba con otros filtros o explora la biblioteca completa.</p>
                  <button
                    type="button"
                    onClick={() => setFilters({ goal: '', bodyArea: '', type: '', duration: '', equipment: '', level: '' })}
                    className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-teal-200 bg-white px-4 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                  >
                    <Icon name="close" className="h-3.5 w-3.5" /> Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Descargo */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs leading-relaxed text-amber-800">
              <strong>Descargo:</strong> los Retos FST tienen fines educativos y de bienestar general. No sustituyen valoración, diagnóstico ni tratamiento individual por profesionales de salud.{' '}
              <Link to="/descargo-medico" className="font-semibold underline">Ver descargo médico</Link>
            </p>
          </div>
        </div>
      </section>

      <FstFooter />
    </div>
  );
}
