import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import { safeNextPath } from '../lib/authRedirect';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

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

/** Al volver de Google no queremos reabrir este mismo modal. */
function returnPath() {
  const params = new URLSearchParams(window.location.search);
  params.delete('login');
  params.delete('modo');
  const search = params.toString();
  return safeNextPath(`${window.location.pathname}${search ? `?${search}` : ''}`, '/academia');
}

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve();
  const existing = document.getElementById(GOOGLE_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client?hl=es';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function AcademiaLoginModal({ isOpen, onClose }) {
  const {
    academiaLogin: login,
    academiaRegister: register,
    academiaGoogleLogin,
    academiaLinkGoogle,
    academiaLoading: loading,
    loginWithGoogle,
    supabaseConfigured,
  } = useAuth();
  const googleButtonRef = useRef(null);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState('');
  const [googleConfig, setGoogleConfig] = useState({ enabled: false, client_id: null });
  const [linkCredential, setLinkCredential] = useState('');
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setPassword('');
      setPrivacyAccepted(false);
      setLinkCredential('');
      setLinkEmail('');
      setLinkPassword('');
    }
  }, [isOpen]);

  // El botón de Google de Edvanta ya está configurado en Supabase. Solo
  // se consulta el cliente antiguo de Google Identity Services cuando
  // Supabase no está disponible (por ejemplo, en un entorno local).
  useEffect(() => {
    if (!isOpen || supabaseConfigured) return undefined;
    let cancelled = false;
    fetch(apiUrl('/api/academia/auth/config'))
      .then(response => response.json())
      .then(data => { if (!cancelled) setGoogleConfig(data.google || { enabled: false, client_id: null }); })
      .catch(() => { if (!cancelled) setGoogleConfig({ enabled: false, client_id: null }); });
    return () => { cancelled = true; };
  }, [isOpen, supabaseConfigured]);

  useEffect(() => {
    const googleReady = !supabaseConfigured && googleConfig.enabled && googleConfig.client_id && isOpen
      && (mode === 'login' || privacyAccepted);
    if (!googleReady || !googleButtonRef.current) return undefined;
    let cancelled = false;
    loadGoogleIdentity().then(() => {
      if (cancelled || !googleButtonRef.current) return;
      googleButtonRef.current.replaceChildren();
      window.google.accounts.id.initialize({
        client_id: googleConfig.client_id,
        callback: async ({ credential }) => {
          setError('');
          try {
            await academiaGoogleLogin(credential, mode, privacyAccepted);
            onClose();
          } catch (requestError) {
            if (requestError.code === 'ACADEMIA_LINK_REQUIRED') {
              setLinkCredential(credential);
              setLinkEmail(requestError.email || email);
            }
            setError(requestError.message);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: mode === 'login' ? 'signin_with' : 'signup_with',
        shape: 'rectangular',
        width: 336,
        locale: 'es',
      });
    }).catch(() => setError('No fue posible cargar el acceso con Google'));
    return () => { cancelled = true; };
  }, [googleConfig, academiaGoogleLogin, isOpen, mode, onClose, privacyAccepted, supabaseConfigured]);

  const handleGoogleRedirect = async () => {
    setError('');
    if (mode === 'register' && !privacyAccepted) {
      setError('Marca la aceptación de privacidad para activar el registro con Google.');
      return;
    }
    const result = await loginWithGoogle({ redirectPath: '/app', next: returnPath() });
    if (result?.error) setError(result.error);
  };

  const submitGoogleLink = async event => {
    event.preventDefault();
    setError('');
    if (!linkPassword) {
      setError('Escribe la contraseña de tu cuenta de Academia.');
      return;
    }
    try {
      await academiaLinkGoogle(linkCredential, linkPassword);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, privacyAccepted);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-teal-600 to-blush-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-lg font-semibold">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</p>
              <p className="text-xs text-white/80 mt-0.5">Academia Feliz Sin Tiroides</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="w-8 h-8 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{error}</div>
          )}

          {supabaseConfigured ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleRedirect}
                disabled={loading || (mode === 'register' && !privacyAccepted)}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <GoogleIcon /> Continuar con Google
              </button>
              <p className="text-center text-[10px] leading-4 text-gray-500">
                Solo pedimos tu nombre y correo. Al continuar aceptas la{' '}
                <Link to="/privacidad" target="_blank" className="font-semibold text-teal-700 hover:underline">política de privacidad</Link>.
              </p>
              {mode === 'register' && !privacyAccepted && (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
                  Marca la aceptación de privacidad para activar el registro con Google.
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] uppercase text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />
                <span>o continúa con correo</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
            </div>
          ) : googleConfig.enabled && (
            <div className="space-y-3">
              {mode === 'register' && !privacyAccepted ? (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
                  Marca la aceptación de privacidad para activar el registro con Google.
                </p>
              ) : (
                <div ref={googleButtonRef} className="flex min-h-11 w-full justify-center overflow-hidden" aria-label="Acceso con Google" />
              )}
              <div className="flex items-center gap-3 text-[11px] uppercase text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />
                <span>o continúa con correo</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
            </div>
          )}

          {linkCredential && (
            <div className="space-y-3 rounded-md border border-teal-200 bg-teal-50 p-3">
              <p className="text-xs leading-5 text-teal-900">
                Ya existe una cuenta de Academia con <strong>{linkEmail}</strong>. Escribe su contraseña para vincular Google sin crear un duplicado.
              </p>
              <input
                type="password"
                value={linkPassword}
                onChange={event => setLinkPassword(event.target.value)}
                autoComplete="current-password"
                className="min-h-11 w-full rounded-md border border-teal-200 bg-white px-3 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Contraseña de tu cuenta de Academia"
              />
              <button
                type="button"
                onClick={submitGoogleLink}
                disabled={loading}
                className="min-h-11 w-full rounded-md bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {loading ? 'Vinculando...' : 'Vincular cuenta'}
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-deepblue-800 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-sand-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-deepblue-800 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-sand-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-deepblue-800 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-sand-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {mode === 'register' && (
            <label className="flex items-start gap-2.5 rounded-md border border-sand-200 bg-sand-50/50 p-3 text-xs leading-relaxed text-gray-600">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={event => setPrivacyAccepted(event.target.checked)}
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600"
              />
              <span>
                Acepto la <Link to="/privacidad" target="_blank" className="font-semibold text-teal-700 hover:underline">política de privacidad</Link> y el uso de mis datos para acceder a la academia.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>

          <p className="text-center text-xs text-gray-500">
            {mode === 'login' ? (
              <>¿No tienes cuenta? <button type="button" onClick={() => { setMode('register'); setError(''); setLinkCredential(''); }} className="text-teal-600 hover:underline font-medium">Regístrate</button></>
            ) : (
              <>¿Ya tienes cuenta? <button type="button" onClick={() => { setMode('login'); setError(''); setLinkCredential(''); }} className="text-teal-600 hover:underline font-medium">Inicia sesión</button></>
            )}
          </p>

          <p className="text-[10px] text-gray-400 text-center leading-snug">
            Tus datos se usan para gestionar tu acceso, progreso e interacciones en la academia.
          </p>
        </form>
      </div>
    </div>
  );
}
