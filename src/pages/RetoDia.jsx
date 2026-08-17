/**
 * ============================================================
 *  RetoDia.jsx — /academia/retos/:slug/dia/:dayNumber
 *  Video externo (YouTube), check-in, microreto nutricional,
 *  racha, compartir avance y navegación entre días.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import ChallengeVideo from '../components/retos/ChallengeVideo';
import DailyCheckin from '../components/retos/DailyCheckin';
import ChallengeCompletion from '../components/retos/ChallengeCompletion';
import NutriFitCTA from '../components/retos/NutriFitCTA';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { waLink } from '../config/links';
import {
  challengeProgress, currentStreak, dayLevelLabel, buildShareMessage,
} from '../lib/retos';

export default function RetoDia() {
  const { slug, dayNumber } = useParams();
  const { user, academiaApi: api } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [days, setDays] = useState([]);
  const [membership, setMembership] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [error, setError] = useState('');

  const dayKey = Number(dayNumber);

  useEffect(() => { window.scrollTo(0, 0); }, [slug, dayNumber]);

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

  const day = useMemo(() => days.find(item => Number(item.day_number) === dayKey) || null, [days, dayKey]);
  const checkin = useMemo(
    () => day ? checkins.find(item => String(item.challenge_day_id) === String(day.id)) || null : null,
    [checkins, day]
  );

  useEffect(() => {
    if (!challenge || !day) return undefined;
    trackEvent('challenge_day_viewed', { challenge: slug, day: dayKey });
    return updatePageSeo({
      title: `Día ${day.day_number} · ${day.title} | ${challenge.title} | Retos FST`,
      description: day.description?.substring(0, 155) || `Día ${day.day_number} del reto ${challenge.title}`,
      canonical: `https://edvanta.co/academia/retos/${challenge.slug}/dia/${day.day_number}`,
    });
  }, [challenge, day, slug, dayKey]);

  const progress = useMemo(() => challengeProgress(days, checkins), [days, checkins]);
  const streak = useMemo(() => currentStreak(checkins), [checkins]);
  const completedIds = useMemo(
    () => new Set(checkins.filter(item => item.exercise_completed).map(item => String(item.challenge_day_id))),
    [checkins]
  );

  const saveCheckin = useCallback(async patch => {
    if (!user) { setLoginOpen(true); return; }
    if (!day) return;
    setSaving(true);
    setError('');
    try {
      const data = await api(`/api/academia/retos/${slug}/checkin`, {
        method: 'POST',
        body: JSON.stringify({ day_id: day.id, ...patch }),
      });
      if (patch.exercise_completed === true) {
        trackEvent('challenge_day_completed', { challenge: slug, day: dayKey });
      }
      if (patch.nutrition_completed === true) {
        trackEvent('nutrition_challenge_completed', { challenge: slug, day: dayKey });
      }
      if (data.completed) {
        trackEvent('challenge_completed', { challenge: slug });
      }
      load();
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  }, [user, day, api, slug, dayKey, load]);

  const shareProgress = () => {
    const url = waLink(buildShareMessage({ dayNumber: dayKey, challengeTitle: challenge.title }));
    trackEvent('challenge_shared', { challenge: slug, day: dayKey });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="min-h-screen bg-sand-50"><FstHeader /><p className="pt-36 text-center text-sm text-gray-500">Cargando día...</p><FstFooter /></div>;
  }
  if (!challenge) return <Navigate to="/academia/retos" replace />;
  if (!day) return <Navigate to={`/academia/retos/${challenge.slug}`} replace />;

  const currentIndex = days.findIndex(item => Number(item.day_number) === dayKey);
  const previousDay = currentIndex > 0 ? days[currentIndex - 1] : null;
  const nextDay = currentIndex < days.length - 1 ? days[currentIndex + 1] : null;
  const allDone = progress.total > 0 && progress.completed >= progress.total;

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />
      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-5 flex min-w-0 items-center gap-2 overflow-hidden text-xs text-gray-500" aria-label="Migas de pan">
            <Link to="/academia" className="shrink-0 hover:text-[#0f766e]">Academia</Link>
            <span>/</span>
            <Link to="/academia/retos" className="shrink-0 hover:text-[#0f766e]">Retos FST</Link>
            <span>/</span>
            <Link to={`/academia/retos/${challenge.slug}`} className="max-w-40 truncate hover:text-[#0f766e]">{challenge.title}</Link>
            <span>/</span>
            <span className="truncate text-gray-700">Día {day.day_number}</span>
          </nav>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              {/* Cabecera del día */}
              <section className="rounded-lg border border-sand-100 bg-white p-5 sm:p-6" aria-labelledby="day-title">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-600">Día {day.day_number} de 7</p>
                <h1 id="day-title" className="mt-2 text-2xl font-semibold leading-tight text-deepblue-900">{day.title}</h1>
                {day.description && <p className="mt-3 text-sm leading-6 text-gray-600">{day.description}</p>}
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                  {day.instructor && (
                    <div className="flex items-center gap-1.5"><Icon name="user" className="h-4 w-4 text-teal-600" /> {day.instructor}</div>
                  )}
                  {day.duration_minutes && (
                    <div className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4 text-teal-600" /> {day.duration_minutes} min</div>
                  )}
                  {day.difficulty && (
                    <div className="flex items-center gap-1.5"><Icon name="activity" className="h-4 w-4 text-teal-600" /> {dayLevelLabel(day.difficulty)}</div>
                  )}
                  {day.equipment && (
                    <div className="flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-teal-600" /> {day.equipment}</div>
                  )}
                  {day.body_area && (
                    <div className="flex items-center gap-1.5"><Icon name="compass" className="h-4 w-4 text-teal-600" /> {day.body_area}</div>
                  )}
                </dl>
              </section>

              {/* Video */}
              <ChallengeVideo videoId={day.youtube_video_id} title={day.title} />
              <p className="text-xs leading-5 text-gray-400">
                Este entrenamiento es un recurso externo seleccionado para el reto. El contenido pertenece a su creadora original.
              </p>

              {/* Check-in */}
              {user ? (
                <DailyCheckin
                  checkin={checkin}
                  onSave={saveCheckin}
                  saving={saving}
                  nutritionChallenge={day.nutrition_challenge}
                />
              ) : (
                <section className="rounded-lg border border-sand-100 bg-white p-6 text-center">
                  <p className="text-sm font-semibold text-deepblue-900">Crea tu cuenta para guardar tu progreso</p>
                  <p className="mt-1 text-xs text-gray-500">Tu avance queda asociado a tu perfil y puedes continuar desde cualquier dispositivo.</p>
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#563a78] px-6 text-sm font-semibold text-white hover:bg-[#452b65]"
                  >
                    <Icon name="lock" className="h-4 w-4" /> Registrarme o iniciar sesión
                  </button>
                </section>
              )}

              {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              {/* Pantalla de fin de semana */}
              {allDone && (
                <ChallengeCompletion
                  challenge={challenge}
                  days={days}
                  checkins={checkins}
                  onShare={() => trackEvent('challenge_shared', { challenge: slug, type: 'completion' })}
                />
              )}

              {/* NutriFit */}
              <NutriFitCTA goal={membership?.selected_goal || challenge.primary_goal} />

              {/* Navegación entre días */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {previousDay ? (
                  <Link to={`/academia/retos/${challenge.slug}/dia/${previousDay.day_number}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-sand-200 bg-white px-4 text-sm font-semibold text-gray-600 hover:border-teal-200">
                    Día {previousDay.day_number}
                  </Link>
                ) : <span />}
                {nextDay && (
                  <Link to={`/academia/retos/${challenge.slug}/dia/${nextDay.day_number}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white hover:bg-[#452b65]">
                    Día {nextDay.day_number} <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Barra lateral */}
            <aside className="space-y-4 lg:sticky lg:top-24">
              {user && membership && (
                <section className="rounded-lg border border-sand-100 bg-white p-4" aria-labelledby="side-progress">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="side-progress" className="text-sm font-semibold text-deepblue-900">Tu progreso</h2>
                    <Link to={`/academia/retos/${challenge.slug}`} className="text-xs font-semibold text-[#563a78] hover:underline">Ver reto</Link>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand-100">
                    <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{progress.completed} de {progress.total} días · {progress.percent}%</p>
                  {streak > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#fdf2f6] px-3 py-1 text-xs font-semibold text-[#b04a76]">
                      <Icon name="sparkles" className="h-3.5 w-3.5" /> {streak} {streak === 1 ? 'día' : 'días'} de racha
                    </p>
                  )}
                </section>
              )}

              <section className="overflow-hidden rounded-lg border border-sand-100 bg-white" aria-labelledby="side-days">
                <div className="border-b border-sand-100 px-4 py-3">
                  <h2 id="side-days" className="inline-flex items-center gap-2 text-sm font-semibold text-deepblue-900">
                    <Icon name="list" className="h-4 w-4" /> Los 7 días
                  </h2>
                </div>
                <div className="divide-y divide-sand-100">
                  {days.map(item => {
                    const active = Number(item.day_number) === dayKey;
                    const done = completedIds.has(String(item.id));
                    return (
                      <Link
                        key={item.id}
                        to={`/academia/retos/${challenge.slug}/dia/${item.day_number}`}
                        className={`flex min-h-12 items-center gap-3 border-l-2 px-4 py-3 ${active ? 'border-teal-600 bg-teal-50/60' : 'border-transparent hover:bg-sand-50'}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? 'bg-teal-600 text-white' : active ? 'bg-white text-teal-700' : 'bg-sand-100 text-gray-500'}`}>
                          {done ? <Icon name="check" className="h-3.5 w-3.5" /> : item.day_number}
                        </span>
                        <span className={`truncate text-xs ${active ? 'font-semibold text-teal-800' : 'text-gray-700'}`}>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {user && membership && progress.completed > 0 && (
                <button
                  type="button"
                  onClick={shareProgress}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#d7c8e5] bg-white px-4 text-sm font-semibold text-[#563a78] hover:bg-[#faf8fc]"
                >
                  <Icon name="message" className="h-4 w-4" /> Compartir mi avance
                </button>
              )}

              <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                <strong>Aviso:</strong> contenido educativo y de bienestar. No sustituye valoración, diagnóstico ni tratamiento individual por profesionales de salud.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <FstFooter />
      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
