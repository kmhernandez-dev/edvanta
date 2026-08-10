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

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, requireSupabase, supabaseConfigured } from '../lib/supabase';
import { apiUrl } from '../config/api';

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

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return undefined;
    }
    const client = requireSupabase();
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);
      if (!nextSession) {
        setProfile(null);
      }
    });
    return () => listener?.subscription?.unsubscribe();
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

  const register = useCallback(async ({ name, email, password, privacyAccepted }) => {
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
        emailRedirectTo: `${window.location.origin}/mi-espacio`,
      },
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    if (data.user) {
      await client.from('consents').upsert([
        { user_id: data.user.id, consent_type: 'terms', version: CONSENT_VERSION, accepted: true, accepted_at: new Date().toISOString() },
        { user_id: data.user.id, consent_type: 'privacy', version: CONSENT_VERSION, accepted: true, accepted_at: new Date().toISOString() },
        { user_id: data.user.id, consent_type: 'health_data_processing', version: CONSENT_VERSION, accepted: true, accepted_at: new Date().toISOString() },
      ], { onConflict: 'user_id,consent_type' });
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

  const loginWithGoogle = useCallback(async () => {
    setAuthError('');
    const client = requireSupabase();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/mi-espacio`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
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

  const logout = useCallback(async () => {
    const client = requireSupabase();
    await client.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
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
      if (!res.ok) throw new Error(data.error || 'Error al continuar con Google');
      saveAcademiaAuth(data.user, data.token);
      return data;
    } finally {
      setAcademiaLoading(false);
    }
  }, [saveAcademiaAuth]);

  const academiaLogout = useCallback(() => {
    setAcademiaUser(null);
    setAcademiaToken('');
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const academiaApi = useCallback(async (path, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (academiaToken) headers['Authorization'] = `Bearer ${academiaToken}`;
    const res = await fetch(apiUrl(path), { ...options, headers });
    if (res.status === 401) { academiaLogout(); throw new Error('Sesión expirada'); }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
  }, [academiaToken, academiaLogout]);

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
    // Legacy academia
    academiaUser,
    academiaToken,
    academiaLoading,
    academiaLogin,
    academiaRegister,
    academiaGoogleLogin,
    academiaLogout,
    academiaApi,
  }), [user, profile, session, loading, authError, profile?.role, supabaseConfigured, register, login, loginWithGoogle, resetPassword, resendConfirmationEmail, updatePassword, logout, updateProfile, loadProfile, requestAccountDeletion, exportMyData, academiaUser, academiaToken, academiaLoading, academiaLogin, academiaRegister, academiaGoogleLogin, academiaLogout, academiaApi]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
