import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Carga datos con estados de carga/error y recarga manual.
 * `fn` recibe { signal }; las respuestas viejas se descartan.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true });
  const [tick, setTick] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.resolve()
      .then(() => fnRef.current({ signal: controller.signal }))
      .then((data) => { if (!controller.signal.aborted) setState({ data, error: null, loading: false }); })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === 'AbortError') return;
        setState((s) => ({ ...s, error, loading: false }));
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback((updater) => setState((s) => ({
    ...s, data: typeof updater === 'function' ? updater(s.data) : updater,
  })), []);

  return { ...state, reload, setData };
}

export function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Estado de tablas en la URL (búsqueda, filtros, orden y página), para que
 * recargar o compartir el enlace conserve la vista.
 */
export function useTableState(defaults = {}) {
  const [params, setParams] = useSearchParams();
  const read = (key) => params.get(key) ?? defaults[key] ?? '';
  const state = new Proxy({}, { get: (_t, key) => read(String(key)) });

  const update = useCallback((changes, { resetPage = true } = {}) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(changes)) {
        if (value === '' || value === null || value === undefined || value === defaults[key]) next.delete(key);
        else next.set(key, String(value));
      }
      if (resetPage && !('page' in changes)) next.delete('page');
      return next;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setParams]);

  const query = (extra = {}) => {
    const q = new URLSearchParams(params);
    for (const [key, value] of Object.entries(defaults)) if (!q.has(key) && value !== '') q.set(key, value);
    for (const [key, value] of Object.entries(extra)) if (value !== '' && value !== undefined && value !== null) q.set(key, value);
    return q.toString();
  };

  return { state, update, query, key: params.toString() };
}
