import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Globe2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

function friendlyAuthError(message) {
  const value = String(message || '');
  if (/invalid login credentials/i.test(value)) return 'El correo o la contraseña no coinciden.';
  if (/already registered/i.test(value)) return 'Este correo ya tiene una cuenta. Inicia sesión.';
  if (/email not confirmed/i.test(value)) return 'Confirma tu correo antes de iniciar sesión.';
  if (/rate limit|too many/i.test(value)) return 'Hay demasiados intentos. Espera un momento y vuelve a intentarlo.';
  return value || 'No fue posible completar el acceso.';
}

export default function ProfessionalAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, authError, setAuthError, login, register, loginWithGoogle, supabaseConfigured } = useAuth();
  const { professionalProfile, loading: workspaceLoading } = useProfessional();
  const [mode, setMode] = useState(searchParams.get('modo') === 'registro' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    const requested = searchParams.get('next');
    return requested?.startsWith('/app') && !requested.startsWith('//') ? requested : '/app';
  }, [searchParams]);

  useEffect(() => updatePageSeo({
    title: 'Crea tu perfil profesional | Edvanta',
    description: 'Crea un perfil privado para guardar cursos, seguir rutas y organizar tu crecimiento profesional en la industria farmacéutica.',
    canonical: 'https://edvanta.co/cuenta',
    robots: 'noindex,nofollow',
  }), []);

  useEffect(() => {
    if (!authLoading && !workspaceLoading && user) {
      navigate(professionalProfile?.onboarding_completed ? nextPath : '/app/onboarding', { replace: true });
    }
  }, [authLoading, workspaceLoading, user, professionalProfile, nextPath, navigate]);

  const switchMode = value => {
    setMode(value);
    setFormError('');
    setSuccess('');
    setAuthError('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setAuthError('');

    if (!email.trim() || !password) return setFormError('Completa tu correo y contraseña.');
    if (mode === 'register' && !name.trim()) return setFormError('Escribe el nombre que deseas mostrar.');
    if (password.length < 8) return setFormError('La contraseña debe tener al menos 8 caracteres.');
    if (mode === 'register' && !privacyAccepted) return setFormError('Debes aceptar los términos y la política de privacidad.');

    setSubmitting(true);
    try {
      const result = mode === 'register'
        ? await register({
            name: name.trim(),
            email: email.trim(),
            password,
            privacyAccepted,
            redirectPath: '/app/onboarding',
            consentScope: 'professional',
          })
        : await login(email.trim(), password);
      if (result?.error) throw new Error(result.error);
      if (mode === 'register') trackEvent('signup_completed', { method: 'email', account_scope: 'professional' });
      if (mode === 'register' && !result?.session) {
        setSuccess('Revisa tu correo y confirma la cuenta. Después podrás completar tu perfil profesional.');
      }
    } catch (error) {
      setFormError(friendlyAuthError(error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError('');
    setAuthError('');
    setSubmitting(true);
    const result = await loginWithGoogle({ redirectPath: '/app/onboarding' });
    if (result?.error) setFormError(friendlyAuthError(result.error));
    setSubmitting(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8 lg:py-16">
            <div className="max-w-2xl self-center">
              <p className="text-sm font-bold uppercase text-teal-700">Tu espacio profesional</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">Convierte tus intereses en un plan que puedas seguir</h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">Guarda cursos, organiza rutas y concentra en un solo lugar las decisiones que fortalecen tu perfil.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  [BriefcaseBusiness, 'Define una carrera objetivo'],
                  [CheckCircle2, 'Sigue tu avance real'],
                  [LockKeyhole, 'Datos privados por defecto'],
                ].map(([Icon, label]) => (
                  <div key={label} className="border-l-2 border-teal-500 pl-3">
                    <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold leading-5 text-slate-700">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex gap-1 border-b border-slate-200" role="tablist" aria-label="Acceso a Edvanta">
                <button type="button" onClick={() => switchMode('login')} className={`min-h-11 flex-1 border-b-2 px-3 text-sm font-bold ${mode === 'login' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500'}`}>Ingresar</button>
                <button type="button" onClick={() => switchMode('register')} className={`min-h-11 flex-1 border-b-2 px-3 text-sm font-bold ${mode === 'register' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500'}`}>Crear cuenta</button>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#071a4a]">{mode === 'login' ? 'Continúa con tu plan' : 'Crea tu perfil profesional'}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{mode === 'login' ? 'Accede a tus cursos guardados y rutas activas.' : 'La configuración inicial toma menos de tres minutos.'}</p>

              {!supabaseConfigured && (
                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">El registro todavía no está configurado en este entorno.</div>
              )}
              {(formError || authError) && <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">{formError || friendlyAuthError(authError)}</div>}
              {success && <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{success}</div>}

              <button type="button" onClick={handleGoogle} disabled={!supabaseConfigured || submitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                <Globe2 className="h-5 w-5" aria-hidden="true" /> Continuar con Google
              </button>
              <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" /><span>o usa tu correo</span><span className="h-px flex-1 bg-slate-200" /></div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <label className="block text-sm font-semibold text-slate-700">Nombre
                    <span className="relative mt-1.5 block"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={name} onChange={event => setName(event.target.value)} autoComplete="name" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></span>
                  </label>
                )}
                <label className="block text-sm font-semibold text-slate-700">Correo
                  <span className="relative mt-1.5 block"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></span>
                </label>
                <label className="block text-sm font-semibold text-slate-700">Contraseña
                  <span className="relative mt-1.5 block"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></span>
                </label>
                {mode === 'register' && (
                  <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    <input type="checkbox" checked={privacyAccepted} onChange={event => setPrivacyAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-teal-700" />
                    <span>Acepto los <Link to="/terminos" target="_blank" className="font-bold text-teal-800">términos</Link> y la <Link to="/privacidad" target="_blank" className="font-bold text-teal-800">política de privacidad</Link>.</span>
                  </label>
                )}
                <button type="submit" disabled={!supabaseConfigured || submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white hover:bg-[#0d2d6d] disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? 'Procesando...' : mode === 'login' ? 'Ingresar a mi panel' : 'Crear mi perfil'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
