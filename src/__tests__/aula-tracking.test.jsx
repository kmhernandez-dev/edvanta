import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../aula/api', () => ({ post: vi.fn(async () => ({ activeSeconds: 0 })) }));

// eslint-disable-next-line import/first
import { post } from '../aula/api';
// eslint-disable-next-line import/first
import { useActiveTime, useVideoTracker } from '../aula/player/tracking';

const setVisibility = (value) => Object.defineProperty(document, 'visibilityState', { value, configurable: true });

describe('aula · medición del aprendizaje en el navegador', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    post.mockClear();
    setVisibility('visible');
  });
  afterEach(() => {
    vi.useRealTimers();
    setVisibility('visible');
  });

  it('solo cuenta la reproducción continua de un video', async () => {
    const { result, unmount } = renderHook(() => useVideoTracker({ courseId: 1, lessonId: 2, enabled: true }));
    const block = { id: 9 };
    const ev = (type, current, playing = true) => result.current({ id: 2 }, block, { type, current, duration: 100, playing });

    act(() => {
      ev('time', 0);
      ev('time', 1);
      ev('time', 2);
      ev('time', 50); // saltó hacia adelante: no suma
      ev('time', 51);
      ev('seek', 80);
      ev('time', 81);
      ev('time', 83, false); // en pausa no suma
      ev('pause', 83, false);
    });
    await vi.waitFor(() => expect(post).toHaveBeenCalledTimes(1));
    const [url, body] = post.mock.calls[0];
    expect(url).toBe('/me/courses/1/lessons/2/video');
    expect(body).toEqual({ blockId: 9, duration: 100, position: 83, segments: [[0, 2], [50, 51], [80, 81]] });
    unmount();
  });

  it('no mide nada si la clase no está abierta', () => {
    const { result } = renderHook(() => useVideoTracker({ courseId: 1, lessonId: 2, enabled: false }));
    act(() => {
      result.current({ id: 2 }, { id: 9 }, { type: 'time', current: 0, duration: 10, playing: true });
      result.current({ id: 2 }, { id: 9 }, { type: 'pause', current: 1, duration: 10, playing: false });
    });
    expect(post).not.toHaveBeenCalled();
  });

  it('cuenta tiempo solo con la pestaña visible y actividad reciente', async () => {
    const onTick = vi.fn();
    const mediaPlaying = { current: false };
    const { unmount } = renderHook(() => useActiveTime({ courseId: 1, lessonId: 2, enabled: true, mediaPlaying, onTick }));

    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(onTick).toHaveBeenCalledTimes(5);

    // Sin actividad por más de 90 s deja de contar.
    await act(async () => { vi.advanceTimersByTime(120000); });
    const idle = onTick.mock.calls.length;
    expect(idle).toBe(90);
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(onTick.mock.calls.length).toBe(idle);

    // Con un video en reproducción sigue contando.
    mediaPlaying.current = true;
    await act(async () => { vi.advanceTimersByTime(3000); });
    expect(onTick.mock.calls.length).toBe(idle + 3);

    // Con la pestaña oculta, no.
    setVisibility('hidden');
    await act(async () => { vi.advanceTimersByTime(3000); });
    expect(onTick.mock.calls.length).toBe(idle + 3);

    // Envía cada 30 s y, al salir, lo que quedó pendiente.
    expect(post.mock.calls.filter(([url]) => url.endsWith('/time')).length).toBe(3);
    unmount();
    const last = post.mock.calls.at(-1);
    expect(last[1]).toEqual({ seconds: 3 });
    expect(last[2]).toEqual({ keepalive: true });
  });
});
