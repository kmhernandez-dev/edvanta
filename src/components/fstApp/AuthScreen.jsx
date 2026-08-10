/**
 * ============================================================
 *  AuthScreen.jsx — Acceso real con Supabase Auth
 *
 *  - Crear mi cuenta (email + contraseña + confirmación)
 *  - Continuar con Google (OAuth)
 *  - Iniciar sesión
 *  - Recuperar contraseña
 *  - Aceptación de términos y política de privacidad
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabaseConfigured } from '../../lib/supabase';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
    </svg>
  );
}

function friendlyError(raw) {
  if (!raw) return '';
  const msg = String(raw);
  if (/invalid login credentials/i.test(msg)) {
    return 'Correo o contraseña incorrectos. Si acabas de crear tu cuenta, revisa que hayas confirmado tu correo con el enlace que te enviamos.';
  }
  if (/email not confirmed/i.test(msg)) {
    return 'Todavía no confirmas tu correo. Revisa tu bandeja de entrada (y spam) y pulsa el enlace de confirmación que te enviamos.';
  }
  if (/already registered|already been registered|already exists/i.test(msg)) {
    return 'Este correo ya tiene una cuenta. Pulsa "Ya tengo una cuenta" e inicia sesión.';
  }
  if (/rate limit/i.test(msg)) {
    return 'Se enviaron demasiados correos en poco tiempo. Espera un minuto e intenta de nuevo.';
  }
  if (/password should be at least/i.test(msg)) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (/signup not enabled|signups not allowed/i.test(msg)) {
    return 'El registro está desactivado temporalmente en esta plataforma.';
  }
  if (/unsupported provider|provider is not enabled/i.test(msg)) {
    return 'El acceso con Google aún no está habilitado en la plataforma. Usa "Crear mi cuenta" con correo y contraseña por ahora.';
  }
  if (/rate_limit|too many/i.test(msg)) {
    return 'Demasiados intentos. Espera un momento e intenta de nuevo.';
  }
  if (/failed to fetch|network/i.test(msg)) {
    return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
  }
  return msg;
}

export default function AuthScreen({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const requestedMode = searchParams.get('modo');
  const { login, register, loginWithGoogle, resetPassword, resendConfirmationEmail, authError, setAuthError, loading } = useAuth();
  const [mode, setMode] = useState(requestedMode === 'registro' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    let cancelled = false;
    fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        setGoogleEnabled(Boolean(data?.external?.google));
      })
      .catch(() => { if (!cancelled) setGoogleEnabled(false); });
    return () => { cancelled = true; };
  }, []);

  const switchMode = next => {
    setMode(next);
    setFormError('');
    setSuccessMessage('');
    setAuthError('');
  };

  const handleGoogle = async () => {
    setFormError('');
    setAuthError('');
    const result = await loginWithGoogle();
    if (result?.error) setFormError(friendlyError(result.error));
  };

  const handleResend = async () => {
    setFormError('');
    setSuccessMessage('');
    setResending(true);
    try {
      const result = await resendConfirmationEmail(email);
      if (result?.error) setFormError(friendlyError(result.error));
      else setSuccessMessage('Te reenviamos el enlace de confirmación. Revisa tu correo (y la carpeta de spam).');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setAuthError('');
    setShowResend(false);

    if (mode === 'register') {
      if (!name.trim()) return setFormError('Escribe tu nombre.');
      if (password.length < 6) return setFormError('La contraseña debe tener al menos 6 caracteres.');
      if (password !== confirmPassword) return setFormError('Las contraseñas no coinciden.');
      if (!privacyAccepted) return setFormError('Debes aceptar los términos y la política de privacidad.');
    }
    if (mode === 'reset') {
      if (!email.trim()) return setFormError('Escribe tu correo electrónico.');
    }
    if (mode !== 'reset' && !email.trim()) return setFormError('Escribe tu correo electrónico.');
    if (mode !== 'reset' && !password) return setFormError('Escribe tu contraseña.');

    setSubmitting(true);
    try {
      if (mode === 'register') {
        const result = await register({ name, email, password, privacyAccepted });
        if (result?.error) {
          setFormError(friendlyError(result.error));
        } else if (result?.user && !result?.session) {
          setSuccessMessage('Tu cuenta fue creada. Revisa tu correo y pulsa el enlace de confirmación. Si ya confirmaste, inicia sesión.');
          setMode('login');
        } else {
          onSuccess?.();
        }
      } else if (mode === 'login') {
        const result = await login(email, password);
        if (result?.error) {
          setFormError(friendlyError(result.error));
          if (/invalid login credentials/i.test(String(result.error))) {
            setShowResend(true);
          }
        } else onSuccess?.();
      } else {
        const result = await resetPassword(email);
        if (result?.error) setFormError(friendlyError(result.error));
        else setSuccessMessage('Te enviamos un enlace para recuperar tu contraseña. Revisa tu correo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full min-h-11 rounded-xl border border-[#e5dceb] bg-white px-4 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#2CB1A1]/30 focus:border-[#2CB1A1]';

  return (
    <div className="fst-app min-h-screen bg-[#FFF9F4] text-[#263746]">
      <header className="border-b border-[#f0eaf5] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/feliz-sin-tiroides" className="flex items-center gap-3">
            <img src="/img/port-logofelizsintiroides.jpg" alt="" className="h-10 w-10 rounded-xl object-cover" />
            <span>
              <span className="block text-sm font-bold text-[#0A2540]">Feliz Sin Tiroides</span>
              <span className="block text-xs text-slate-500">Tu espacio de acompañamiento</span>
            </span>
          </Link>
          <Link to="/feliz-sin-tiroides" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Volver</Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-[#f0eaf5] bg-white p-6 shadow-[0_2px_20px_rgba(10,37,64,0.08)] sm:p-8">
          <h1 className="text-2xl font-semibold text-[#0A2540]">
            {mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear mi cuenta' : 'Recuperar contraseña'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {mode === 'login' && 'Organiza tu información y haz seguimiento desde un espacio personal y privado.'}
            {mode === 'register' && 'Crea tu cuenta para organizar tu tratamiento, tus hábitos y tu seguimiento.'}
            {mode === 'reset' && 'Te enviaremos un enlace para restablecer tu contraseña.'}
          </p>

          {(formError || authError) && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-700" role="alert">
              {formError || friendlyError(authError)}
              {showResend && mode === 'login' && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !email.trim()}
                  className="mt-2 block w-full rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                >
                  {resending ? 'Enviando...' : 'Reenviar enlace de confirmación a mi correo'}
                </button>
              )}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800" role="status">
              {successMessage}
            </div>
          )}

          {!supabaseConfigured && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              Supabase no está configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el acceso.
            </div>
          )}

          {mode !== 'reset' && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={!supabaseConfigured || submitting || googleEnabled === false}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#e5dceb] bg-white text-sm font-bold text-[#0A2540] hover:bg-[#faf8fd] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <GoogleIcon /> Continuar con Google
              </button>
              {googleEnabled === false && (
                <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  El acceso con Google aún no está habilitado en la plataforma. Usa "Crear mi cuenta" con correo y contraseña.
                </p>
              )}
              <div className="my-5 flex items-center gap-3 text-[11px] uppercase text-slate-400">
                <span className="h-px flex-1 bg-[#f0eaf5]" />
                <span>o continúa con correo</span>
                <span className="h-px flex-1 bg-[#f0eaf5]" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#0A2540]">Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className={`mt-1.5 ${inputClass}`} placeholder="Tu nombre" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#0A2540]">Correo electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`mt-1.5 ${inputClass}`} placeholder="tu@correo.com" />
            </div>
            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-semibold text-[#0A2540]">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`mt-1.5 ${inputClass}`} placeholder="Mínimo 6 caracteres" />
              </div>
            )}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#0A2540]">Confirmar contraseña</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`mt-1.5 ${inputClass}`} placeholder="Repite tu contraseña" />
              </div>
            )}
            {mode === 'register' && (
              <label className="flex items-start gap-2.5 rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={e => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#2CB1A1]"
                />
                <span>
                  He leído y acepto los <Link to="/terminos" target="_blank" className="font-semibold text-[#0B8176] hover:underline">términos</Link> y la{' '}
                  <Link to="/privacidad" target="_blank" className="font-semibold text-[#0B8176] hover:underline">política de privacidad</Link>.
                </span>
              </label>
            )}
            <button
              type="submit"
              disabled={!supabaseConfigured || submitting}
              className="min-h-12 w-full rounded-xl bg-[#0A2540] text-sm font-bold text-white hover:bg-[#123b5f] disabled:opacity-50"
            >
              {submitting ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear mi cuenta' : 'Enviar enlace'}
            </button>
          </form>

          <div className="mt-5 space-y-2 text-center text-xs text-slate-500">
            {mode === 'login' && (
              <>
                <p>
                  ¿No tienes cuenta?{' '}
                  <button type="button" onClick={() => switchMode('register')} className="font-bold text-[#0B8176] hover:underline">Crear mi cuenta</button>
                </p>
                <p>
                  <button type="button" onClick={() => switchMode('reset')} className="font-semibold text-slate-500 hover:underline">¿Olvidaste tu contraseña?</button>
                </p>
              </>
            )}
            {mode === 'register' && (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => switchMode('login')} className="font-bold text-[#0B8176] hover:underline">Iniciar sesión</button>
              </p>
            )}
            {mode === 'reset' && (
              <p>
                <button type="button" onClick={() => switchMode('login')} className="font-bold text-[#0B8176] hover:underline">Volver a iniciar sesión</button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
