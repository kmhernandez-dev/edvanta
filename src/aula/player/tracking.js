/**
 * Medición del aprendizaje en el navegador. El servidor valida y acota
 * todo lo que se envía; aquí solo se evita contar tiempo que no fue real:
 * la pestaña debe estar visible y la persona activa (o un video en curso).
 */
import { useCallback, useEffect, useRef } from 'react';
import { post } from '../api';

const IDLE_MS = 90 * 1000;
const TIME_FLUSH_MS = 30 * 1000;
const VIDEO_FLUSH_MS = 10 * 1000;

/**
 * Cuenta segundos activos en una clase y los envía cada 30 s (y al salir).
 * `onTick` recibe cada segundo contado; `onSynced` la respuesta del servidor.
 */
export function useActiveTime({ courseId, lessonId, enabled, mediaPlaying, onTick, onSynced }) {
  const pending = useRef(0);
  const lastActivity = useRef(Date.now());
  const handlers = useRef({ onTick, onSynced });
  handlers.current = { onTick, onSynced };

  const send = useCallback(async ({ keepalive = false } = {}) => {
    const seconds = pending.current;
    if (!seconds) return;
    pending.current = 0;
    try {
      const res = await post(`/me/courses/${courseId}/lessons/${lessonId}/time`, { seconds }, { keepalive });
      handlers.current.onSynced?.(res);
    } catch {
      pending.current += seconds; // se reintenta en el siguiente envío
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    if (!enabled) return undefined;
    lastActivity.current = Date.now();
    const mark = () => { lastActivity.current = Date.now(); };
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const tick = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      const idle = Date.now() - lastActivity.current > IDLE_MS;
      if (idle && !mediaPlaying?.current) return;
      pending.current += 1;
      handlers.current.onTick?.(1);
    }, 1000);
    const flush = setInterval(() => send(), TIME_FLUSH_MS);
    const onHide = () => { if (document.visibilityState === 'hidden') send({ keepalive: true }); };
    const onLeave = () => send({ keepalive: true });
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onLeave);
    return () => {
      events.forEach((e) => window.removeEventListener(e, mark));
      clearInterval(tick);
      clearInterval(flush);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onLeave);
      send({ keepalive: true });
    };
  }, [enabled, send, mediaPlaying]);

  // Para enviar lo pendiente antes de una acción que depende del tiempo.
  return send;
}

function addSegment(list, from, to) {
  const last = list[list.length - 1];
  if (last && Math.abs(last[1] - from) < 0.75) last[1] = Math.max(last[1], to);
  else list.push([from, to]);
}

/**
 * Tramos vistos de cada video de la clase. Solo cuenta la reproducción
 * continua (saltar hacia adelante no suma) y envía cada 10 s, al pausar y
 * al terminar. Devuelve el manejador `onMedia` para los bloques.
 */
export function useVideoTracker({ courseId, lessonId, enabled, onResult, mediaPlaying }) {
  const blocks = useRef(new Map());
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const flush = useCallback(async (blockId, { keepalive = false } = {}) => {
    const s = blocks.current.get(blockId);
    if (!s || !s.duration || (!s.segments.length && !s.positionDirty)) return;
    const segments = s.segments;
    s.segments = [];
    s.positionDirty = false;
    s.lastFlush = Date.now();
    try {
      const res = await post(
        `/me/courses/${courseId}/lessons/${lessonId}/video`,
        { blockId, duration: s.duration, position: s.position, segments },
        { keepalive },
      );
      onResultRef.current?.(res);
    } catch {
      s.segments = [...segments, ...s.segments];
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    const map = blocks.current;
    return () => {
      // Al cambiar de clase se envía lo pendiente de la anterior y se empieza de cero.
      for (const id of map.keys()) flush(id, { keepalive: true });
      map.clear();
    };
  }, [flush]);

  return useCallback((lesson, block, info) => {
    if (!enabled) return;
    const map = blocks.current;
    const s = map.get(block.id) || { last: null, segments: [], duration: 0, position: 0, lastFlush: Date.now(), positionDirty: false };
    if (info.duration > 0) s.duration = info.duration;
    switch (info.type) {
      case 'time': {
        if (info.playing && s.last !== null) {
          const delta = info.current - s.last;
          if (delta > 0 && delta <= 3) addSegment(s.segments, s.last, info.current);
        }
        s.last = info.current;
        s.position = info.current;
        s.positionDirty = true;
        if (mediaPlaying) mediaPlaying.current = Boolean(info.playing);
        if (Date.now() - s.lastFlush >= VIDEO_FLUSH_MS) {
          map.set(block.id, s);
          flush(block.id);
        }
        break;
      }
      case 'seek':
        s.last = info.current;
        s.position = info.current;
        break;
      case 'pause':
      case 'ended':
        if (mediaPlaying) mediaPlaying.current = false;
        map.set(block.id, s);
        flush(block.id);
        if (info.type === 'ended') s.last = null;
        break;
      default:
    }
    map.set(block.id, s);
  }, [enabled, flush, mediaPlaying]);
}
