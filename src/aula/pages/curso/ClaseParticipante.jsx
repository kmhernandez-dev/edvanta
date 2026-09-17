import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Library, PartyPopper, PlayCircle } from 'lucide-react';
import { post } from '../../api';
import { fmtDate } from '../../labels';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/Page';
import { Alert, PageLoader } from '../../ui/States';
import { useToast } from '../../ui/Toast';
import { CoursePlayer, flattenLessons } from '../../player/CoursePlayer';
import { useActiveTime, useVideoTracker } from '../../player/tracking';
import { useCourseData } from './CursoParticipante';

const clock = (seconds) => {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function CompletionPanel({ lesson, state, rules, activeSeconds, watchedPct, onComplete, busy, error, courseCompleted, videoCount }) {
  if (state.status === 'completado') {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-[var(--aula-radius-lg)] border border-[#BEE6E3] bg-[var(--aula-success-soft)] p-4">
        <p className="flex items-center gap-2 font-semibold text-[var(--aula-success)]">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Clase completada{state.completedAt ? ` el ${fmtDate(state.completedAt)}` : ''}.
        </p>
        {courseCompleted && (
          <p className="flex items-center gap-2 text-sm text-[var(--aula-success)]">
            <PartyPopper className="h-4 w-4" aria-hidden="true" /> ¡Completaste todos los requisitos del curso!
          </p>
        )}
      </div>
    );
  }

  if (lesson.completionRule === 'video') {
    const threshold = rules.videoCompletionPct;
    return (
      <div className="flex flex-col gap-2 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <PlayCircle className="h-4 w-4 text-[var(--aula-primary)]" aria-hidden="true" />
          Esta clase se completa al ver al menos el {threshold} % {videoCount > 1 ? 'de cada video' : 'del video'}.
        </p>
        <ProgressBar value={Math.min(100, (watchedPct / threshold) * 100)} label="Avance del video" />
        <p className="text-xs text-[var(--aula-muted)]" aria-live="polite">
          Llevas el {Math.floor(watchedPct)} % visto. Adelantar el video no cuenta; puedes pausarlo y retomarlo cuando quieras.
        </p>
        {!lesson.isRequired && <p className="text-xs text-[var(--aula-muted)]">Es opcional: no cuenta para completar el curso.</p>}
      </div>
    );
  }

  const remaining = Math.max(0, lesson.minSeconds - activeSeconds);
  const waiting = remaining > 0;
  return (
    <div className="flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
      <p className="text-sm">
        {waiting
          ? 'Lee con calma: podrás marcar la clase como completada cuando cumplas el tiempo mínimo.'
          : '¿Terminaste de leer? Marca la clase como completada para registrar tu avance.'}
      </p>
      {error && <Alert tone="warning">{error}</Alert>}
      <div className="flex flex-wrap items-center gap-3">
        <Button icon={CheckCircle2} onClick={onComplete} loading={busy} loadingLabel="Guardando…" disabled={waiting}>
          Marcar como completada
        </Button>
        {waiting && (
          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--aula-muted)]">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Disponible en <span className="font-semibold tabular-nums text-[var(--aula-text)]">{clock(remaining)}</span>
          </span>
        )}
      </div>
      {lesson.minSeconds > 0 && (
        <p className="text-xs text-[var(--aula-muted)]">Solo cuenta el tiempo con la pestaña abierta y activa.</p>
      )}
      {!lesson.isRequired && <p className="text-xs text-[var(--aula-muted)]">Es opcional: no cuenta para completar el curso.</p>}
    </div>
  );
}

export default function ClaseParticipante() {
  const { courseId, lessonId: rawLessonId } = useParams();
  const lessonId = Number(rawLessonId);
  const navigate = useNavigate();
  const toast = useToast();
  const { data, applyProgress, setVideoProgress } = useCourseData();
  const lesson = useMemo(() => flattenLessons(data.snapshot).find((l) => l.id === lessonId), [data.snapshot, lessonId]);
  const state = data.lessonStates[lessonId] || { status: 'pendiente' };
  const [opened, setOpened] = useState(false);
  const [openError, setOpenError] = useState(null);
  const [serverSeconds, setServerSeconds] = useState(state.activeSeconds || 0);
  const [localSeconds, setLocalSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [completeError, setCompleteError] = useState(null);
  const [announce, setAnnounce] = useState('');
  const mediaPlaying = useRef(false);

  // Abrir la clase (registra el inicio). Si está bloqueada, vuelve a la portada.
  useEffect(() => {
    if (!lesson) return undefined;
    let alive = true;
    setOpened(false);
    setOpenError(null);
    setLocalSeconds(0);
    setCompleteError(null);
    post(`/me/courses/${courseId}/lessons/${lessonId}/open`, {})
      .then((res) => {
        if (!alive) return;
        applyProgress(res);
        setServerSeconds(res.lesson?.activeSeconds || 0);
        setOpened(true);
      })
      .catch((err) => {
        if (!alive) return;
        if (err.code === 'clase_bloqueada') {
          toast.info(err.message);
          navigate(`/aula/curso/${courseId}`, { replace: true });
          return;
        }
        setOpenError(err);
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  // También cuenta al repasar una clase completada: es tiempo de estudio real.
  const flushTime = useActiveTime({
    courseId,
    lessonId,
    enabled: opened,
    mediaPlaying,
    onTick: () => setLocalSeconds((s) => s + 1),
    onSynced: (res) => {
      setServerSeconds(res.activeSeconds);
      setLocalSeconds(0);
    },
  });

  const onVideoResult = useCallback((res) => {
    applyProgress(res);
    if (res.video) {
      setVideoProgress(lessonId, res.video.blockId, { pct: res.video.pct });
    }
    if (res.completed) {
      setAnnounce('Clase completada.');
      toast.success(res.enrollment?.status === 'completado' ? '¡Completaste el curso!' : 'Clase completada. ¡Bien hecho!');
    }
  }, [applyProgress, lessonId, setVideoProgress, toast]);

  const onMedia = useVideoTracker({
    courseId,
    lessonId,
    enabled: opened,
    mediaPlaying,
    onResult: onVideoResult,
  });

  const positions = useMemo(() => {
    const byBlock = data.videoProgress?.[lessonId] || {};
    return { [lessonId]: Object.fromEntries(Object.entries(byBlock).map(([id, v]) => [id, v.position || 0])) };
  }, [data.videoProgress, lessonId]);

  if (!lesson) return <Navigate to={`/aula/curso/${courseId}`} replace />;
  if (openError) {
    return (
      <div className="aula-root flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p role="alert" className="max-w-md text-sm text-[var(--aula-danger)]">{openError.message}</p>
        <Button variant="secondary" to={`/aula/curso/${courseId}`}>Volver a la portada del curso</Button>
      </div>
    );
  }
  if (state.status === 'bloqueado') return <PageLoader label="Revisando el acceso a la clase…" />;

  const videos = lesson.blocks.filter((b) => b.type === 'video');
  const lessonVideo = data.videoProgress?.[lessonId] || {};
  const watchedPct = videos.length ? Math.min(...videos.map((b) => Number(lessonVideo[b.id]?.pct) || 0)) : 0;
  const activeSeconds = serverSeconds + localSeconds;

  const complete = async () => {
    setBusy(true);
    setCompleteError(null);
    try {
      await flushTime();
      const res = await post(`/me/courses/${courseId}/lessons/${lessonId}/complete`, {});
      applyProgress(res);
      setAnnounce('Clase completada.');
      toast.success(res.enrollment?.status === 'completado' ? '¡Completaste el curso!' : 'Clase completada. ¡Bien hecho!');
    } catch (err) {
      if (err.code === 'tiempo_minimo' && typeof err.details?.remainingSeconds === 'number') {
        // El servidor manda: ajusta el contador a su cuenta.
        setServerSeconds(Math.max(0, lesson.minSeconds - err.details.remainingSeconds));
        setLocalSeconds(0);
      }
      setCompleteError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <CoursePlayer
        snapshot={data.snapshot}
        lessonId={lessonId}
        lessonHref={(id) => `/aula/curso/${courseId}/clase/${id}`}
        backTo={{ to: `/aula/curso/${courseId}`, label: 'Portada del curso' }}
        lessonState={(id) => data.lessonStates[id] || { status: 'pendiente' }}
        progress={{ pct: data.enrollment.progressPct }}
        videoPositions={positions}
        onMedia={onMedia}
        headerActions={data.resourcesEnabled && (
          <Button size="sm" variant="ghost" icon={Library} to={`/aula/curso/${courseId}/recursos`}>
            <span className="hidden sm:inline">Recursos</span>
          </Button>
        )}
        renderCompletion={(current) => (
          <CompletionPanel
            lesson={current}
            state={data.lessonStates[current.id] || { status: 'pendiente' }}
            rules={data.snapshot.rules}
            activeSeconds={activeSeconds}
            watchedPct={watchedPct}
            videoCount={videos.length}
            onComplete={complete}
            busy={busy}
            error={completeError}
            courseCompleted={data.enrollment.status === 'completado'}
          />
        )}
      />
      <p className="sr-only" aria-live="polite">{announce}</p>
    </>
  );
}
