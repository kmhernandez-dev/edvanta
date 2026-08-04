import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

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
  const { login, register, googleLogin, loading } = useAuth();
  const googleButtonRef = useRef(null);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState('');
  const [googleConfig, setGoogleConfig] = useState({ enabled: false, client_id: null });

  useEffect(() => {
    if (isOpen) { setError(''); setPassword(''); setPrivacyAccepted(false); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    fetch(apiUrl('/api/academia/auth/config'))
      .then(response => response.json())
      .then(data => { if (!cancelled) setGoogleConfig(data.google || { enabled: false, client_id: null }); })
      .catch(() => { if (!cancelled) setGoogleConfig({ enabled: false, client_id: null }); });
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    const googleReady = googleConfig.enabled && googleConfig.client_id && isOpen
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
            await googleLogin(credential, mode, privacyAccepted);
            onClose();
          } catch (requestError) {
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
  }, [googleConfig, googleLogin, isOpen, mode, onClose, privacyAccepted]);

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

          {googleConfig.enabled && (
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
              <>¿No tienes cuenta? <button type="button" onClick={() => { setMode('register'); setError(''); }} className="text-teal-600 hover:underline font-medium">Regístrate</button></>
            ) : (
              <>¿Ya tienes cuenta? <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-teal-600 hover:underline font-medium">Inicia sesión</button></>
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
