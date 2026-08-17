/**
 * ============================================================
 *  RetoDetalle.jsx — /academia/retos/:slug
 *  Portada, info, progreso, días 1–7, NutriFit y comunidad.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import ChallengeProgress from '../components/retos/ChallengeProgress';
import NutriFitCTA from '../components/retos/NutriFitCTA';
import { getStoredGoal } from '../components/retos/GoalSelector';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { FST_COMMUNITY_URL, waLink } from '../config/links';
import {
  challengeProgress, currentStreak, goalLabel, levelLabel, buildShareMessage,
} from '../lib/retos';

export default function RetoDetalle() {
  const { slug } = useParams();
  const { user, academiaApi: api } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [days, setDays] = useState([]);
  const [membership, setMembership] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    api(`/api/academia/retos/${slug}`)
      .then(data => {
        if (cancelled) return;
        setChallenge(data.challenge || null);
        setDays(data.days || []);
        setMembership(data.membership || null);
        setCheckins(data.checkins || []);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, api]);

  useEffect(() => load(), [load]);

  useEffect(() => {
    if (!challenge) return undefined;
    trackEvent('challenge_viewed', { challenge: slug });
    return updatePageSeo({
      title: `${challenge.title} | Retos FST | Feliz Sin Tiroides`,
      description: challenge.description?.substring(0, 155) || `Reto de 7 días: ${challenge.title}`,
      canonical: `https://edvanta.co/academia/retos/${challenge.slug}`,
      image: challenge.cover_image,
    });
  }, [challenge]);

  const progress = useMemo(() => challengeProgress(days, checkins), [days, checkins]);
  const streak = useMemo(() => currentStreak(checkins), [checkins]);
  const completedIds = useMemo(
    () => new Set(checkins.filter(checkin => checkin.exercise_completed).map(checkin => String(checkin.challenge_day_id))),
    [checkins]
  );

  const handleJoin = async () => {
    if (!user) { setLoginOpen(true); return; }
    setJoining(true);
    setError('');
    try {
      await api(`/api/academia/retos/${slug}/join`, {
        method: 'POST',
        body: JSON.stringify({ selected_goal: membership?.selected_goal || getStoredGoal() || 'maintain_wellbeing' }),
      });
      trackEvent('challenge_joined', { challenge: slug });
      trackEvent('challenge_started', { challenge: slug });
      load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setJoining(false);
    }
  };

  const shareProgress = () => {
    const nextDay = Math.min(progress.completed + 1, progress.total);
    const url = waLink(buildShareMessage({ dayNumber: nextDay, challengeTitle: challenge.title }));
    trackEvent('challenge_shared', { challenge: slug });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="min-h-screen bg-sand-50"><FstHeader /><p className="pt-36 text-center text-sm text-gray-500">Cargando reto...</p><FstFooter /></div>;
  }
  if (!challenge) return <Navigate to="/academia/retos" replace />;

  const firstIncomplete = days.find(day => !completedIds.has(String(day.id)));
  const continueDay = firstIncomplete || days[0];

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      {/* Hero del reto */}
      <section className="border-b border-gray-200 bg-white pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500" aria-label="Migas de pan">
            <Link to="/academia" className="hover:text-[#0f766e]">Academia</Link>
            <span>/</span>
            <Link to="/academia/retos" className="hover:text-[#0f766e]">Retos FST</Link>
            <span>/</span>
            <span className="truncate text-gray-700">{challenge.title}</span>
          </nav>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ebf7] px-3 py-1 text-xs font-semibold text-[#563a78]">
                <Icon name="sparkles" className="h-3.5 w-3.5" /> Reto de 7 días
              </span>
              <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-deepblue-900 md:text-4xl">{challenge.title}</h1>
              {challenge.tagline && <p className="mt-2 text-base italic text-[#76539a]">{challenge.tagline}</p>}
              {challenge.description && <p className="mt-4 leading-relaxed text-gray-600">{challenge.description}</p>}

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Objetivo</dt>
                  <dd className="mt-0.5 font-medium">{goalLabel(challenge.primary_goal)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Nivel</dt>
                  <dd className="mt-0.5 font-medium">{levelLabel(challenge.level)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Duración media</dt>
                  <dd className="mt-0.5 font-medium">{challenge.average_duration || 'A tu ritmo'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Equipamiento</dt>
                  <dd className="mt-0.5 font-medium">{challenge.equipment || 'Sin equipo'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Instructora</dt>
                  <dd className="mt-0.5 font-medium">{challenge.instructor || 'Creadoras externas'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Sesiones</dt>
                  <dd className="mt-0.5 font-medium">{days.length} sesiones</dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {membership ? (
                  continueDay && (
                    <Link to={`/academia/retos/${challenge.slug}/dia/${continueDay.day_number}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700">
                      {progress.completed > 0 ? `Continuar Día ${continueDay.day_number}` : 'Empezar Día 1'} <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={joining}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                  >
                    <Icon name="sparkles" className="h-4 w-4" /> {joining ? 'Uniéndote...' : 'Unirme al reto'}
                  </button>
                )}
                {membership && progress.completed > 0 && (
                  <button
                    type="button"
                    onClick={shareProgress}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#d7c8e5] bg-white px-6 text-sm font-semibold text-[#563a78] hover:bg-[#faf8fc]"
                  >
                    <Icon name="message" className="h-4 w-4" /> Compartir mi avance
                  </button>
                )}
                <a href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-sand-200 bg-white px-6 text-sm font-semibold text-gray-600 hover:bg-sand-50">
                  <Icon name="users" className="h-4 w-4" /> Ir a la comunidad FST
                </a>
              </div>
              {error && <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            </div>

            <div className="relative">
              <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#e8f4f2] to-[#fdf2f6] shadow-lg">
                {challenge.cover_image ? (
                  <img src={challenge.cover_image} alt={challenge.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Icon name="sparkles" className="mx-auto h-16 w-16 text-[#563a78]" />
                    <p className="mt-3 font-serif text-2xl font-semibold text-deepblue-900">{challenge.title}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progreso + días */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {user && membership && (
            <div className="mb-8">
              <ChallengeProgress days={days} checkins={checkins} />
              {streak > 0 && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  {streak} {streak === 1 ? 'día' : 'días'} de racha. Cada día cuenta, sin presión.
                </p>
              )}
            </div>
          )}

          <h2 className="mb-5 font-serif text-xl font-semibold text-deepblue-900">Tu semana</h2>
          <div className="space-y-3">
            {days.map(day => {
              const done = completedIds.has(String(day.id));
              return (
                <Link
                  key={day.id}
                  to={`/academia/retos/${challenge.slug}/dia/${day.day_number}`}
                  className="flex items-center gap-4 rounded-lg border border-sand-100 bg-white p-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-teal-600 text-white' : 'border-2 border-sand-200 bg-white text-gray-500'}`}>
                    {done ? <Icon name="check" className="h-5 w-5" /> : day.day_number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Día {day.day_number} de 7</p>
                    <p className="truncate text-sm font-semibold text-deepblue-900">{day.title}</p>
                    <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      {day.duration_minutes && <span>{day.duration_minutes} min</span>}
                      {day.body_area && <span>· {day.body_area}</span>}
                      {day.equipment && <span>· {day.equipment}</span>}
                      {day.instructor && <span>· {day.instructor}</span>}
                    </p>
                  </div>
                  <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-gray-300" />
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <NutriFitCTA goal={membership?.selected_goal || challenge.primary_goal} />
          </div>

          <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <strong>Descargo:</strong> los Retos FST tienen fines educativos y de bienestar general. No sustituyen valoración, diagnóstico ni tratamiento individual por profesionales de salud.{' '}
            <Link to="/descargo-medico" className="font-semibold underline">Ver descargo médico</Link>
          </p>
        </div>
      </section>

      <FstFooter />
      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
