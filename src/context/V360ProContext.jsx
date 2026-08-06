import { createContext, useContext, useReducer, useEffect } from 'react';
import { DEMO_CASES_V360 } from '../data/vida360-pro-demo';

const STORAGE_KEY = 'vida360_pro_workspace_v1';

const WorkspaceContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function createInitialState() {
  return {
    cases: DEMO_CASES_V360.map(c => ({ ...c })),
    activeCaseId: null,
    activeDiscipline: 'endocrinologia',
    activeTab: 'panel',
    lastSaved: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_CASE':
      return { ...state, activeCaseId: action.payload };
    case 'SET_DISCIPLINE':
      return { ...state, activeDiscipline: action.payload };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'UPDATE_CASE': {
      const cases = state.cases.map(c =>
        c.id === action.payload.id ? { ...c, ...action.payload.data, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'UPDATE_DISCIPLINE_DATA': {
      const cases = state.cases.map(c =>
        c.id === action.payload.caseId
          ? { ...c, [action.payload.discipline]: action.payload.data, updated: new Date().toISOString() }
          : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'RESET_DEMO':
      return createInitialState();
    default:
      return state;
  }
}

export function V360ProProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => loadState() || createInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeCase = state.cases.find(c => c.id === state.activeCaseId) || null;

  const value = {
    state,
    dispatch,
    activeCase,
    cases: state.cases,
    activeDiscipline: state.activeDiscipline,
    activeTab: state.activeTab,
    lastSaved: state.lastSaved,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useV360Pro() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useV360Pro must be used within V360ProProvider');
  return ctx;
}
