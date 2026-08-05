import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { createDemoVida360State, createEmptyVida360State } from '../data/vida360Demo';
import { computeFst360 } from '../lib/vida360';

const Vida360Context = createContext(null);
const SESSION_KEY = 'fst_vida360_session';
const realDataEnabled = import.meta.env.VITE_VIDA360_REAL_DATA_ENABLED === 'true';

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
}

export function Vida360Provider({ children }) {
  const { user, api } = useAuth();
  const [session, setSession] = useState(readSession);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const hydrated = useRef(false);
  const saveTimer = useRef(null);

  const storageKey = useMemo(() => session ? `fst_vida360_${session.mode}_${session.id}` : '', [session]);

  const persistSession = useCallback(value => {
    setSession(value);
    if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  const startDemo = useCallback(scenarioId => {
    const nextSession = { mode: 'demo', id: scenarioId };
    persistSession(nextSession);
    const key = `fst_vida360_demo_${scenarioId}`;
    let next;
    try { next = JSON.parse(localStorage.getItem(key)); } catch { next = null; }
    setState(next || createDemoVida360State(scenarioId));
    hydrated.current = true;
  }, [persistSession]);

  const startReal = useCallback(() => {
    if (!realDataEnabled || !user) return false;
    persistSession({ mode: 'real', id: String(user.id) });
    return true;
  }, [persistSession, user]);

  const exit = useCallback(() => {
    hydrated.current = false;
    setState(null);
    persistSession(null);
  }, [persistSession]);

  useEffect(() => {
    if (!session) return;
    if (session.mode === 'demo') {
      if (!state) startDemo(session.id);
      return;
    }
    if (!realDataEnabled) {
      exit();
      return;
    }
    if (!user || String(user.id) !== String(session.id)) {
      exit();
      return;
    }
    let cancelled = false;
    setLoading(true);
    api('/api/vida360/state')
      .then(data => {
        if (!cancelled) {
          setState(data.state || createEmptyVida360State(user));
          hydrated.current = true;
        }
      })
      .catch(() => {
        if (!cancelled) setState(createEmptyVida360State(user));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [session?.mode, session?.id, user?.id]);

  useEffect(() => {
    if (!state || !session || !hydrated.current) return;
    setSaveStatus('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        if (session.mode === 'demo') {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } else {
          await api('/api/vida360/state', { method: 'PUT', body: JSON.stringify({ state }) });
        }
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, 650);
    return () => window.clearTimeout(saveTimer.current);
  }, [state, session, storageKey, api]);

  const update = useCallback((section, value) => {
    setState(current => {
      const resolved = typeof value === 'function' ? value(current?.[section]) : value;
      return { ...current, [section]: resolved };
    });
  }, []);

  const add = useCallback((section, item) => {
    setState(current => ({
      ...current,
      [section]: [item, ...(current?.[section] || [])],
      activity: [{ id: `${section}-${Date.now()}`, action: `Registro actualizado: ${section}`, at: new Date().toISOString() }, ...(current?.activity || [])].slice(0, 30),
    }));
  }, []);

  const remove = useCallback((section, id) => {
    setState(current => ({ ...current, [section]: (current?.[section] || []).filter(item => item.id !== id) }));
  }, []);

  const value = useMemo(() => ({
    state, session, loading, saveStatus, isDemo: session?.mode === 'demo',
    realDataEnabled,
    startDemo, startReal, exit, update, add, remove,
    map360: state ? computeFst360(state) : [],
  }), [state, session, loading, saveStatus, startDemo, startReal, exit, update, add, remove]);

  return <Vida360Context.Provider value={value}>{children}</Vida360Context.Provider>;
}

export function useVida360() {
  const value = useContext(Vida360Context);
  if (!value) throw new Error('useVida360 requiere Vida360Provider');
  return value;
}
