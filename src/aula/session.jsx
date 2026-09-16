import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { get, post } from './api';
import { PageError, PageLoader } from './ui/States';

const SessionContext = createContext(null);

export function AulaSessionProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null, error: null });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, status: s.user ? s.status : 'loading', error: null }));
    try {
      const { user } = await get('/auth/me');
      setState({ status: user ? 'authenticated' : 'anonymous', user, error: null });
    } catch (error) {
      setState({ status: 'error', user: null, error });
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const onUnauthorized = () => setState({ status: 'anonymous', user: null, error: null });
    window.addEventListener('aula:unauthorized', onUnauthorized);
    return () => window.removeEventListener('aula:unauthorized', onUnauthorized);
  }, []);

  const value = useMemo(() => ({
    ...state,
    refresh,
    async login(email, password) {
      const { user } = await post('/auth/login', { email, password });
      setState({ status: 'authenticated', user, error: null });
      return user;
    },
    async logout() {
      try { await post('/auth/logout'); } finally {
        setState({ status: 'anonymous', user: null, error: null });
      }
    },
    signedIn(user) {
      setState({ status: 'authenticated', user, error: null });
    },
  }), [state, refresh]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAulaSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useAulaSession debe usarse dentro de AulaSessionProvider');
  return ctx;
}

export const homeFor = (user) => (user?.role === 'admin' ? '/aula/admin' : '/aula');

/** Solo muestra el contenido con sesión (y el rol pedido); si no, redirige. */
export function RequireAula({ role, children }) {
  const { status, user, error, refresh } = useAulaSession();
  const location = useLocation();

  if (status === 'loading') return <PageLoader label="Cargando el aula…" />;
  if (status === 'error') return <PageError error={error} onRetry={refresh} />;
  if (!user) {
    const back = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/aula/entrar?volver=${back}`} replace />;
  }
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;
  return children;
}

/** Ruta de destino segura tras iniciar sesión: solo rutas internas del aula. */
export function safeReturn(raw, user) {
  if (typeof raw === 'string' && raw.startsWith('/aula') && !raw.startsWith('//') && !raw.startsWith('/aula/entrar')) {
    if (raw.startsWith('/aula/admin') && user?.role !== 'admin') return homeFor(user);
    return raw;
  }
  return homeFor(user);
}
