import { createContext, useContext, useReducer, useEffect } from 'react';
import { DEMO_CASES } from '../data/atenfarma-demo';

const STORAGE_KEY = 'atenfarma_workspace_v1';

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
    cases: DEMO_CASES.map(c => ({ ...c })),
    activeCaseId: null,
    methodology: 'cmm',
    activeTab: 'panel',
    lastSaved: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_CASE':
      return { ...state, activeCaseId: action.payload };
    case 'SET_METHODOLOGY':
      return { ...state, methodology: action.payload };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'UPDATE_CASE': {
      const cases = state.cases.map(c =>
        c.id === action.payload.id ? { ...c, ...action.payload.data, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'UPDATE_MEDICATIONS': {
      const cases = state.cases.map(c =>
        c.id === action.payload.caseId ? { ...c, medications: action.payload.medications, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'UPDATE_ASSESSMENT': {
      const cases = state.cases.map(c =>
        c.id === action.payload.caseId ? { ...c, assessment: { ...c.assessment, [action.payload.medId]: { ...(c.assessment?.[action.payload.medId] || {}), [action.payload.key]: action.payload.value } }, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'UPDATE_PROBLEMS': {
      const cases = state.cases.map(c =>
        c.id === action.payload.caseId ? { ...c, problems: action.payload.problems, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'UPDATE_CARE_PLAN': {
      const cases = state.cases.map(c =>
        c.id === action.payload.caseId ? { ...c, carePlan: action.payload.carePlan, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'UPDATE_FOLLOW_UPS': {
      const cases = state.cases.map(c =>
        c.id === action.payload.caseId ? { ...c, followUps: action.payload.followUps, updated: new Date().toISOString() } : c
      );
      return { ...state, cases, lastSaved: new Date().toISOString() };
    }
    case 'RESET_DEMO':
      return createInitialState();
    default:
      return state;
  }
}

export function WorkspaceProvider({ children }) {
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
    methodology: state.methodology,
    activeTab: state.activeTab,
    lastSaved: state.lastSaved,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
