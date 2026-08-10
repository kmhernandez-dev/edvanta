/**
 * ============================================================
 *  FstAppContext.jsx — Estado global de la app Feliz Sin Tiroides
 *
 *  Persistencia: localStorage (modo demo) o API (modo real).
 *  El modo real se activa con VITE_FST_APP_REAL_DATA_ENABLED=true
 *  y VIDA360_REAL_DATA_ENABLED=true en el backend.
 * ============================================================
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { uid } from '../lib/fstApp/nutrifst';

const FstAppContext = createContext(null);
const SESSION_KEY = 'fst_app_session';
const realDataEnabled = import.meta.env.VITE_FST_APP_REAL_DATA_ENABLED === 'true';

export const symptomOptions = [
  'Energía', 'Sueño', 'Estreñimiento', 'Concentración', 'Palpitaciones',
  'Ansiedad', 'Hinchazón', 'Hormigueo', 'Cambios emocionales', 'Otro',
];

export const conditionOptions = [
  'Hipotiroidismo', 'Tiroiditis de Hashimoto', 'Enfermedad de Graves',
  'Tiroidectomía total', 'Tiroidectomía parcial', 'Cáncer de tiroides',
  'Yodoterapia (radioyodo)', 'Otra condición', 'No estoy segura',
];

export const surgeryOptions = [
  'Tiroidectomía total', 'Tiroidectomía parcial', 'Sin cirugía', 'No estoy segura',
];

export const goalOptions = [
  'Equilibrada', 'Más energía', 'Mejor digestión', 'Mantener peso',
  'Reducir inflamación', 'Comer más saludable', 'Preparar consulta',
];

export const budgetOptions = ['bajo', 'medio', 'alto'];
export const cookTimeOptions = [15, 30, 60];

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
}

export function createEmptyFstAppState(user) {
  const name = user?.name || '';
  const [firstName = '', ...rest] = name.split(' ');
  return {
    schemaVersion: 1,
    profile: {
      firstName,
      lastName: rest.join(' '),
      email: user?.email || '',
      condition: '',
      surgery: '',
      treatment: '',
      levoDose: '',
      levoTime: '',
      supplements: [],
      nutritionGoal: '',
      allergies: '',
      intolerances: '',
      country: '',
      weight: '',
      height: '',
      foodPreferences: [],
      budget: 'medio',
      cookTime: 30,
      people: 1,
      lowIodineMode: false,
      lowIodineConfirmed: false,
      onboardingCompleted: false,
    },
    levoLog: [],
    meals: [],
    symptoms: [],
    weights: [],
    menu: null,
    shoppingList: null,
    questions: [],
    chatHistory: [],
    createdAt: new Date().toISOString(),
  };
}

export function createDemoFstAppState() {
  const state = createEmptyFstAppState({ name: 'Ana Torres', email: 'ana.demo@fst.app' });
  state.profile = {
    ...state.profile,
    firstName: 'Ana',
    lastName: 'Torres',
    condition: 'Tiroidectomía total',
    surgery: 'Tiroidectomía total',
    treatment: 'Levotiroxina',
    levoDose: '100 mcg',
    levoTime: '06:30',
    supplements: [
      { id: uid('sup'), name: 'Calcio', dose: '500 mg', time: '13:00', note: 'Indicado por mi endocrinóloga' },
      { id: uid('sup'), name: 'Vitamina D', dose: '1000 UI', time: '13:00', note: '' },
    ],
    nutritionGoal: 'Equilibrada',
    country: 'Colombia',
    weight: '62',
    height: '165',
    foodPreferences: ['Pollo', 'Huevo', 'Arroz', 'Aguacate'],
    budget: 'medio',
    cookTime: 30,
    people: 1,
    onboardingCompleted: true,
  };
  const today = new Date();
  const daysAgo = days => {
    const value = new Date(today);
    value.setDate(value.getDate() - days);
    return value.toISOString().slice(0, 10);
  };
  state.levoLog = [0, 1, 2, 3, 4, 5, 6].map(days => ({
    id: uid('levo'),
    date: daysAgo(days),
    time: '06:30',
    status: days === 3 ? 'Omitida' : 'Tomada',
    note: days === 3 ? 'Cambio de rutina' : '',
  }));
  state.symptoms = [
    { id: uid('sym'), name: 'Energía', date: daysAgo(0), intensity: 6, notes: '' },
    { id: uid('sym'), name: 'Energía', date: daysAgo(1), intensity: 5, notes: '' },
    { id: uid('sym'), name: 'Energía', date: daysAgo(2), intensity: 7, notes: '' },
    { id: uid('sym'), name: 'Sueño', date: daysAgo(0), intensity: 4, notes: '' },
    { id: uid('sym'), name: 'Sueño', date: daysAgo(1), intensity: 5, notes: '' },
    { id: uid('sym'), name: 'Estreñimiento', date: daysAgo(2), intensity: 3, notes: '' },
    { id: uid('sym'), name: 'Concentración', date: daysAgo(0), intensity: 5, notes: '' },
  ];
  state.meals = [
    { id: uid('meal'), date: daysAgo(0), meal: 'Desayuno', description: 'Huevos pericos con arepa y café', items: [{ name: 'huevo', amount: 2 }, { name: 'arepa', amount: 1 }, { name: 'cafe', amount: 1 }] },
    { id: uid('meal'), date: daysAgo(0), meal: 'Almuerzo', description: 'Pollo con arroz y ensalada', items: [{ name: 'pollo', amount: 1 }, { name: 'arroz', amount: 1 }, { name: 'ensalada', amount: 1 }] },
    { id: uid('meal'), date: daysAgo(1), meal: 'Almuerzo', description: 'Frijoles con arroz', items: [{ name: 'frijoles', amount: 1 }, { name: 'arroz', amount: 1 }] },
  ];
  state.questions = [
    '¿Debo separar el calcio más tiempo de la levotiroxina?',
    '¿Qué exámenes debo pedir en el próximo control?',
  ];
  state.chatHistory = [
    {
      id: uid('chat'),
      role: 'user',
      text: '¿Puedo tomar café ahora?',
      at: new Date().toISOString(),
    },
    {
      id: uid('chat'),
      role: 'assistant',
      text: 'El café puede reducir la absorción de levotiroxina si se toman muy cerca. La práctica habitual es separar la toma del medicamento del café. Tienes registrado tu horario de levotiroxina a las 06:30.',
      at: new Date().toISOString(),
      level: 'amarillo',
      evidence: ['cafe-levotiroxina-2008'],
    },
  ];
  return state;
}

export function FstAppProvider({ children }) {
  const { user, api } = useAuth();
  const [session, setSession] = useState(readSession);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const hydrated = useRef(false);
  const saveTimer = useRef(null);

  const storageKey = useMemo(() => session ? `fst_app_${session.mode}_${session.id}` : '', [session]);

  const persistSession = useCallback(value => {
    setSession(value);
    if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  const startDemo = useCallback(() => {
    const nextSession = { mode: 'demo', id: 'demo' };
    persistSession(nextSession);
    let next = null;
    try { next = JSON.parse(localStorage.getItem(storageKey)); } catch { next = null; }
    setState(next || createDemoFstAppState());
    hydrated.current = true;
  }, [persistSession, storageKey]);

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
      if (!state) startDemo();
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
    api('/api/fst-app/state')
      .then(data => {
        if (!cancelled) {
          setState(data.state || createEmptyFstAppState(user));
          hydrated.current = true;
        }
      })
      .catch(() => {
        if (!cancelled) setState(createEmptyFstAppState(user));
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
          await api('/api/fst-app/state', { method: 'PUT', body: JSON.stringify({ state }) });
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
    }));
  }, []);

  const remove = useCallback((section, id) => {
    setState(current => ({ ...current, [section]: (current?.[section] || []).filter(item => item.id !== id) }));
  }, []);

  const updateProfile = useCallback((patch) => {
    setState(current => ({ ...current, profile: { ...current.profile, ...patch } }));
  }, []);

  const value = useMemo(() => ({
    state, session, loading, saveStatus, isDemo: session?.mode === 'demo',
    realDataEnabled,
    startDemo, startReal, exit, update, add, remove, updateProfile,
  }), [state, session, loading, saveStatus, startDemo, startReal, exit, update, add, remove, updateProfile]);

  return <FstAppContext.Provider value={value}>{children}</FstAppContext.Provider>;
}

export function useFstApp() {
  const value = useContext(FstAppContext);
  if (!value) throw new Error('useFstApp requiere FstAppProvider');
  return value;
}
