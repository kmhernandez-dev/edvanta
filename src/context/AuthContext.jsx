/**
 * ============================================================
 *  AuthContext.jsx — Autenticación real con Supabase Auth
 *
 *  - Registro con email + contraseña
 *  - Inicio de sesión
 *  - Continuar con Google (OAuth)
 *  - Recuperar contraseña
 *  - Cerrar sesión
 *  - Sesión persistente (sobrevive al cerrar el navegador)
 *  - Perfil propio (profiles) con rol (user/admin)
 *  - Consents (terms, privacy, health_data_processing)
 *
 *  El rol admin se asigna manualmente en la base de datos.
 *  Nunca se modifica desde la interfaz.
 * ============================================================
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase, requireSupabase, supabaseConfigured } from '../lib/supabase';
import { apiUrl } from '../config/api';
import { authRedirect, safeNextPath } from '../lib/authRedirect';

const AuthContext = createContext(null);

const CONSENT_VERSION = '1.0';

// ─── Legacy: sesión de la academia (backend Express) ────────
const TOKEN_KEY = 'fst_academia_token';
const USER_KEY = 'fst_academia_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Legacy academia
  const [academiaUser, setAcademiaUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [academiaToken, setAcademiaToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [academiaLoading, setAcademiaLoading] = useState(false);
  const [academiaLinkRequired, setAcademiaLinkRequired] = useState(null);
  const academiaExchangeRef = useRef(null);
  const hadSupabaseUserRef = useRef(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return undefined;
    }
    const client = requireSupabase();
    let settled = false;
    const settle = () => {
      if (!settled) {
        settled = true;
        setLoading(false);
      }
    };

    // Al volver de Google, el token viene en la dirección. Supabase lo
    // lee después de crear el cliente; si aquí se apagara `loading` antes
    // de que termine, la pantalla de vuelta creería que no hay sesión y
    // mandaría otra vez a /cuenta. Por eso se espera al evento inicial.
    const traeCredenciales = /(?:^|[#&?])(access_token|refresh_token|code)=/.test(
      `${window.location.hash}${window.location.search}`,
    );

    const { data: listener } = client.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);
      if (!nextSession) setProfile(null);
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || !traeCredenciales) {
        settle();
      }
    });

    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
      if (!traeCredenciales) settle();
    });

    // Red de seguridad: si el evento no llega, no se queda «Entrando…»
    // para siempre. Con credenciales en la dirección se da más margen.
    const timeout = setTimeout(settle, traeCredenciales ? 10_000 : 2_000);
    return () => {
      clearTimeout(timeout);
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }
    const client = requireSupabase();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (error) {
      console.error('Error cargando perfil:', error.message);
      return null;
    }
    if (!data) {
      // Perfil no existe (usuario creado antes del trigger): lo creamos ahora.
      const { data: created, error: insertError } = await client
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();
      if (insertError) {
        console.error('Error creando perfil:', insertError.message);
        return null;
      }
      setProfile(created);
      return created;
    }
    setProfile(data);
    return data;
  }, [user]);

  useEffect(() => {
    if (user) loadProfile();
  }, [user, loadProfile]);

  const register = useCallback(async ({ name, email, password, privacyAccepted, redirectPath = '/mi-espacio', consentScope = 'health' }) => {
    setAuthError('');
    const client = requireSupabase();
    if (!privacyAccepted) {
      setAuthError('Debes aceptar los términos y la política de privacidad.');
      return { error: 'Debes aceptar los términos y la política de privacidad.' };
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: authRedirect(redirectPath),
      },
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    if (data.user) {
      const consents = [
        { user_id: data.user.id, consent_type: 'terms', version: CONSENT_VERSION, accepted: true, accepted_at: new Date().toISOString() },
        { user_id: data.user.id, consent_type: 'privacy', version: CONSENT_VERSION, accepted: true, accepted_at: new Date().toISOString() },
      ];
      if (consentScope === 'health') {
        consents.push({ user_id: data.user.id, consent_type: 'health_data_processing', version: CONSENT_VERSION, accepted: true, accepted_at: new Date().toISOString() });
      }
      await client.from('consents').upsert(consents, { onConflict: 'user_id,consent_type' });
    }
    return { user: data.user, session: data.session };
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError('');
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { user: data.user, session: data.session };
  }, []);

  /**
   * Entrar con Google.
   *
   * `redirectPath` es la pantalla que recibe la vuelta de Google, y tiene
   * que ser una que sepa esperar a que Supabase lea el token (ver
   * pages/VolviendoDeAcceso). `next` es a dónde quería ir la persona, y
   * viaja en la dirección porque entre medias se sale del sitio: cuando
   * vuelve, ya no queda nada en memoria de dónde estaba.
   */
  const loginWithGoogle = useCallback(async ({ redirectPath = '/mi-espacio', next } = {}) => {
    setAuthError('');
    const client = requireSupabase();
    const safeNext = next ? safeNextPath(next, '') : '';
    const destino = safeNext
      ? `${redirectPath}?next=${encodeURIComponent(safeNext)}`
      : redirectPath;
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirect(destino),
        // Sin scopes adicionales: Supabase pide solo email y perfil, lo
        // justo para identificar a la persona. Nada de Gmail, Drive,
        // contactos ni access_type=offline. Tampoco se fuerza el
        // consentimiento en cada entrada.
      },
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { ok: true };
  }, []);

  const resetPassword = useCallback(async email => {
    setAuthError('');
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/mi-espacio?reset=true`,
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { ok: true };
  }, []);

  const resendConfirmationEmail = useCallback(async email => {
    setAuthError('');
    const client = requireSupabase();
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/mi-espacio` },
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { ok: true };
  }, []);

  const updatePassword = useCallback(async newPassword => {
    setAuthError('');
    const client = requireSupabase();
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { ok: true };
  }, []);

  /**
   * Cerrar sesión cierra también la del aula.
   *
   * El aula guarda la suya en su propia cookie (httpOnly, limitada a
   * /api/aula). Si solo se cerrara la de Supabase, la del aula seguiría
   * viva y entrar a /aula volvería a dejar a la persona dentro: habría
   * cerrado sesión en una pantalla y no en la otra.
   *
   * Se pide primero la del aula, porque si falla la de Supabase igual
   * queremos haber cerrado aquella.
   */
  const logout = useCallback(async () => {
    try {
      await fetch(apiUrl('/api/aula/auth/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Aula-Request': '1' },
      });
    } catch { /* sin red: se cierra lo que se pueda */ }
    try {
      const client = requireSupabase();
      await client.auth.signOut();
    } catch { /* Supabase no configurado o sin red: igual se limpia lo local */ }
    setUser(null);
    setProfile(null);
    setSession(null);
    // La academia guarda su propio JWT. Si solo se cerrara Supabase, la
    // cabecera pediría entrar pero /academia seguiría recordando a la
    // persona. Salir tiene que salir de toda la plataforma.
    setAcademiaUser(null);
    setAcademiaToken('');
    setAcademiaLinkRequired(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const updateProfile = useCallback(async patch => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { data, error } = await client
      .from('profiles')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (error) return { error: error.message };
    setProfile(data);
    return { data };
  }, [user]);

  const requestAccountDeletion = useCallback(async () => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { error } = await client.rpc('request_account_deletion');
    if (error) return { error: error.message };
    return { ok: true };
  }, [user]);

  const exportMyData = useCallback(async () => {
    if (!user) return { error: 'Sin sesión' };
    const client = requireSupabase();
    const { data, error } = await client.rpc('export_my_data');
    if (error) return { error: error.message };
    return { data };
  }, [user]);

  // ─── Legacy academia (backend Express) ─────────────────────
  const saveAcademiaAuth = useCallback((userData, jwt) => {
    setAcademiaUser(userData);
    setAcademiaToken(jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, jwt);
  }, []);

  /**
   * Canjea la sesión de Supabase por una de Academia.
   *
   * La cuenta de Academia sigue mandando sobre progreso, retos y CV, pero
   * ahora reconoce a quien ya entró a Edvanta. Si el correo ya pertenece a
   * una cuenta de Academia sin vincular, NO se une por coincidencia: se
   * pide la contraseña de esa cuenta para demostrar que es suya.
   */
  const exchangeSupabaseForAcademia = useCallback(async () => {
    // Varias pantallas pueden pedir datos a la vez. Se comparte la misma
    // petición para no crear dos cuentas de Academia en una carrera.
    if (academiaExchangeRef.current) return academiaExchangeRef.current;

    const request = (async () => {
      const client = requireSupabase();
      const { data } = await client.auth.getSession();
      const accessToken = data?.session?.access_token;
      if (!accessToken) return '';

      let res;
      try {
        res = await fetch(apiUrl('/api/academia/auth/supabase'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        });
      } catch {
        throw new Error('No se pudo conectar con la academia. Revisa tu conexión.');
      }

      const payload = await res.json().catch(() => ({}));
      if (res.status === 409 && payload.code === 'ACADEMIA_LINK_REQUIRED') {
        const linkError = new Error(payload.error || 'Confirma tu contraseña de Academia para vincular las cuentas.');
        linkError.code = 'ACADEMIA_LINK_REQUIRED';
        linkError.email = payload.email || '';
        setAcademiaLinkRequired({ email: payload.email || '', message: linkError.message });
        throw linkError;
      }
      if (!res.ok) throw new Error(payload.error || 'No se pudo abrir tu cuenta de Academia.');

      saveAcademiaAuth(payload.user, payload.token);
      setAcademiaLinkRequired(null);
      return payload.token;
    })();

    academiaExchangeRef.current = request;
    try {
      return await request;
    } finally {
      academiaExchangeRef.current = null;
    }
  }, [saveAcademiaAuth]);

  const academiaLogin = useCallback(async (email, password) => {
    setAcademiaLoading(true);
    try {
      const res = await fetch(apiUrl('/api/academia/auth/login'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
      saveAcademiaAuth(data.user, data.token);
      return data;
    } finally {
      setAcademiaLoading(false);
    }
  }, [saveAcademiaAuth]);

  const academiaRegister = useCallback(async (name, email, password, privacyAccepted) => {
    setAcademiaLoading(true);
    try {
      const res = await fetch(apiUrl('/api/academia/auth/register'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, privacy_accepted: privacyAccepted === true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrarse');
      saveAcademiaAuth(data.user, data.token);
      return data;
    } finally {
      setAcademiaLoading(false);
    }
  }, [saveAcademiaAuth]);

  const academiaGoogleLogin = useCallback(async (credential, mode, privacyAccepted) => {
    setAcademiaLoading(true);
    try {
      const res = await fetch(apiUrl('/api/academia/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, mode, privacy_accepted: privacyAccepted === true }),
      });
      const data = await res.json();
      if (!res.ok) {
        const requestError = new Error(data.error || 'Error al continuar con Google');
        requestError.code = data.code;
        requestError.email = data.email;
        throw requestError;
      }
      saveAcademiaAuth(data.user, data.token);
      setAcademiaLinkRequired(null);
      return data;
    } finally {
      setAcademiaLoading(false);
    }
  }, [saveAcademiaAuth]);

  const academiaLinkGoogle = useCallback(async (credential, password) => {
    setAcademiaLoading(true);
    try {
      const res = await fetch(apiUrl('/api/academia/auth/google/link'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo vincular tu cuenta con Google');
      saveAcademiaAuth(data.user, data.token);
      setAcademiaLinkRequired(null);
      return data;
    } finally {
      setAcademiaLoading(false);
    }
  }, [saveAcademiaAuth]);

  const academiaLinkSupabase = useCallback(async password => {
    setAcademiaLoading(true);
    try {
      const client = requireSupabase();
      const { data } = await client.auth.getSession();
      const accessToken = data?.session?.access_token;
      if (!accessToken) throw new Error('Tu sesión de Edvanta no está disponible. Vuelve a entrar.');

      const res = await fetch(apiUrl('/api/academia/auth/supabase/link'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, password }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'No se pudo vincular tu cuenta de Academia.');
      saveAcademiaAuth(payload.user, payload.token);
      setAcademiaLinkRequired(null);
      return payload;
    } finally {
      setAcademiaLoading(false);
    }
  }, [saveAcademiaAuth]);

  const academiaLogout = useCallback(() => {
    setAcademiaUser(null);
    setAcademiaToken('');
    setAcademiaLinkRequired(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  // Si alguien entra a Edvanta con otra cuenta, el JWT viejo de Academia
  // no puede seguir mandando: pertenece a otra persona.
  useEffect(() => {
    if (!user || !academiaUser) return;
    const correoEdvanta = String(user.email || '').trim().toLowerCase();
    const correoAcademia = String(academiaUser.email || '').trim().toLowerCase();
    if (correoEdvanta && correoAcademia && correoEdvanta !== correoAcademia) {
      academiaLogout();
    }
  }, [user, academiaUser, academiaLogout]);

  // Salir desde el aula (o que caduque la sesión de Supabase) también
  // tiene que borrar el JWT de Academia. Al cargar por primera vez no se
  // toca: puede existir una sesión antigua de Academia sin Supabase.
  useEffect(() => {
    if (user) {
      hadSupabaseUserRef.current = true;
      return;
    }
    if (hadSupabaseUserRef.current) {
      hadSupabaseUserRef.current = false;
      academiaLogout();
    }
  }, [user, academiaLogout]);

  const academiaApi = useCallback(async (path, options = {}) => {
    let token = academiaToken;
    if (!token && user) token = await exchangeSupabaseForAcademia();
    if (!token) throw new Error('Inicia sesión para continuar.');

    const headers = { 'Content-Type': 'application/json', ...options.headers };
    headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(apiUrl(path), { ...options, headers });
    if (res.status === 401) { academiaLogout(); throw new Error('Sesión expirada'); }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
  }, [academiaToken, user, exchangeSupabaseForAcademia, academiaLogout]);

  const isAdmin = profile?.role === 'admin';
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    authError,
    setAuthError,
    isAdmin,
    isAuthenticated: Boolean(user),
    supabaseConfigured,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    resendConfirmationEmail,
    updatePassword,
    logout,
    updateProfile,
    loadProfile,
    requestAccountDeletion,
    exportMyData,
    // Legacy academia + puente con la sesión de Supabase
    academiaUser,
    academiaToken,
    academiaLoading,
    academiaLinkRequired,
    academiaLogin,
    academiaRegister,
    academiaGoogleLogin,
    academiaLinkGoogle,
    academiaLinkSupabase,
    clearAcademiaLinkRequired: () => setAcademiaLinkRequired(null),
    exchangeSupabaseForAcademia,
    academiaLogout,
    academiaApi,
  }), [user, profile, session, loading, authError, profile?.role, supabaseConfigured, register, login, loginWithGoogle, resetPassword, resendConfirmationEmail, updatePassword, logout, updateProfile, loadProfile, requestAccountDeletion, exportMyData, academiaUser, academiaToken, academiaLoading, academiaLinkRequired, academiaLogin, academiaRegister, academiaGoogleLogin, academiaLinkGoogle, academiaLinkSupabase, exchangeSupabaseForAcademia, academiaLogout, academiaApi]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
