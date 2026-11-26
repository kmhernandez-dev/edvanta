import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Eye, EyeOff, Globe2, LockKeyhole, Mail, MailCheck, MessageCircle, UserRound } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { safeNextPath } from '../lib/authRedirect';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { waLink } from '../config/links';

/** Cuánto se espera a Supabase antes de devolverle el botón a la persona. */
const ESPERA_MAXIMA_MS = 25000;
const ESPERA_REENVIO_S = 60;

export function friendlyAuthError(message) {
  const value = String(message || '');
  if (/invalid login credentials/i.test(value)) return 'El correo o la contraseña no coinciden.';
  if (/already registered|already been registered/i.test(value)) return 'Este correo ya tiene una cuenta. Escribe tu contraseña para entrar.';
  if (/email not confirmed/i.test(value)) return 'Falta confirmar tu correo: abre el enlace que te enviamos.';
  if (/sending confirmation|error sending/i.test(value)) return 'No pudimos enviarte el correo de confirmación. Continúa con Google o escríbenos por WhatsApp.';
  if (/email rate limit|rate limit|too many|only request this after/i.test(value)) return 'Hay demasiados intentos en este momento. Espera un minuto, o continúa con Google.';
  if (/invalid format|unable to validate email|email address .* is invalid/i.test(value)) return 'Revisa tu correo: parece tener un error.';
  if (/password should be|weak password|at least \d+ characters/i.test(value)) return 'Elige una contraseña más larga: mínimo 8 caracteres.';
  if (/signups? (are )?(not allowed|disabled)/i.test(value)) return 'El registro con correo no está disponible en este momento. Continúa con Google.';
  if (/failed to fetch|network|load failed|tardó demasiado/i.test(value)) return 'No hay conexión o la respuesta tardó demasiado. Revisa tu internet y toca el botón otra vez.';
  if (/database error/i.test(value)) return 'No pudimos crear la cuenta. Intenta de nuevo o continúa con Google.';
  return value || 'No fue posible completar el acceso.';
}

/** Supabase no corta una petición colgada: sin esto el botón se queda en «Procesando…». */
function conLimite(promesa, ms = ESPERA_MAXIMA_MS) {
  let reloj;
  const limite = new Promise((_, rechazar) => { reloj = setTimeout(() => rechazar(new Error('La respuesta tardó demasiado.')), ms); });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(reloj));
}

/** ¿Ya se envió tres veces a esta misma ruta en medio minuto? (ida y vuelta sin fin). */
function rebota(ruta) {
  try {
    const ahora = Date.now();
    const previo = JSON.parse(window.sessionStorage.getItem('edv_cuenta_idas') || '{}');
    const veces = previo.ruta === ruta && ahora - previo.desde < 30000 ? previo.veces + 1 : 1;
    window.sessionStorage.setItem('edv_cuenta_idas', JSON.stringify({ ruta, veces, desde: veces === 1 ? ahora : previo.desde }));
    return veces > 3;
  } catch {
    return false;
  }
}

/** La bandeja de entrada del correo, cuando se puede abrir con un enlace. */
function bandejaDe(correo) {
  const dominio = String(correo || '').split('@')[1]?.toLowerCase() || '';
  if (/^(gmail|googlemail)\.com$/.test(dominio)) return ['Abrir Gmail', 'https://mail.google.com/mail/u/0/#search/edvanta'];
  if (/^(hotmail|outlook|live|msn)\./.test(dominio)) return ['Abrir Outlook', 'https://outlook.live.com/mail/0/'];
  if (/^yahoo\./.test(dominio)) return ['Abrir Yahoo Mail', 'https://mail.yahoo.com/'];
  return null;
}

export default function ProfessionalAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, authError, setAuthError, login, register, loginWithGoogle, resetPassword, resendConfirmationEmail, supabaseConfigured } = useAuth();
  const { professionalProfile, loading: workspaceLoading } = useProfessional();
  const [mode, setMode] = useState(searchParams.get('modo') === 'registro' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verClave, setVerClave] = useState(false);
  // Cuenta creada, falta confirmar el correo: se guarda a quién se le envió.
  const [porConfirmar, setPorConfirmar] = useState('');
  const [reenvioEn, setReenvioEn] = useState(0);
  const avisoRef = useRef(null);
  const confirmarRef = useRef(null);
  const ultimoIntento = useRef(0);

  // A dónde se vuelve después de entrar. Antes solo se aceptaba /app, así
  // que quien venía de la ficha de un curso acababa en otra parte y tenía
  // que buscarlo de nuevo. Ahora vale cualquier ruta interna, pero solo
  // interna: una barra sola al principio y nada que parezca otro sitio,
  // porque este parámetro llega en la dirección y lo escribe cualquiera.
  const nextPath = useMemo(
    () => safeNextPath(searchParams.get('next'), '/app'),
    [searchParams],
  );
  // Viene a comprar el certificado de un curso: la página habla de eso y
  // de nada más, y al terminar vuelve directo al pago (pedido de Karla, 20-nov).
  const compra = /[?&]camino=certificado\b/.test(nextPath);
  // Al confirmar el correo, el enlace también vuelve a donde iba la persona.
  const regreso = nextPath !== '/app' ? `/app?next=${encodeURIComponent(nextPath)}` : '/app';

  useEffect(() => updatePageSeo({
    title: compra ? 'Paga tu certificado | Edvanta' : 'Crea tu perfil profesional | Edvanta',
    description: 'Crea un perfil privado para guardar cursos, seguir rutas y organizar tu crecimiento profesional en la industria farmacéutica.',
    canonical: 'https://edvanta.co/cuenta',
    robots: 'noindex,nofollow',
  }), [compra]);

  useEffect(() => {
    if (!authLoading && !workspaceLoading && user) {
      // Antes, quien no había contestado la encuesta era enviado a ella
      // antes de poder ver nada. Esa encuesta pedía objetivo, habilidades,
      // herramientas y disponibilidad, y no cambiaba lo que la persona veía
      // después. Ahora se entra directo a los cursos.
      // Si la página de destino no reconoce la sesión, devuelve aquí y esto
      // volvería a mandarla allá sin fin. Al tercer rebote se detiene y se avisa.
      if (rebota(nextPath)) {
        setFormError('Entraste, pero no pudimos abrir el siguiente paso. Recarga la página o escríbenos por WhatsApp y lo resolvemos.');
        return;
      }
      navigate(nextPath, { replace: true });
    }
  }, [authLoading, workspaceLoading, user, professionalProfile, nextPath, navigate]);

  // En el celular el botón queda al final de la tarjeta: el aviso sale junto
  // a él y se trae a la vista, para que nunca parezca que no pasó nada.
  useEffect(() => {
    if (!(formError || authError || success)) return;
    const nodo = avisoRef.current;
    if (nodo?.scrollIntoView) nodo.scrollIntoView({ block: 'center', behavior: 'smooth' });
    nodo?.focus?.({ preventScroll: true });
  }, [formError, authError, success]);

  // El paso de confirmar reemplaza al formulario: se muestra desde su título.
  useEffect(() => {
    if (porConfirmar) confirmarRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  }, [porConfirmar]);

  useEffect(() => {
    if (reenvioEn <= 0) return undefined;
    const reloj = setTimeout(() => setReenvioEn((n) => n - 1), 1000);
    return () => clearTimeout(reloj);
  }, [reenvioEn]);

  // ¿Ya confirmó el correo? Se intenta entrar con lo que escribió. Si abrió
  // el enlace en otra aplicación y vuelve a esta pestaña, sigue solo al pago.
  const comprobarConfirmacion = useCallback(async ({ silencioso = false } = {}) => {
    if (!porConfirmar || !password) return;
    if (silencioso && Date.now() - ultimoIntento.current < 8000) return;
    ultimoIntento.current = Date.now();
    if (!silencioso) { setSubmitting(true); setFormError(''); setSuccess(''); }
    try {
      const result = await conLimite(login(porConfirmar, password));
      if (result?.error && !silencioso) {
        setFormError(/not confirmed/i.test(result.error)
          ? 'Todavía no vemos la confirmación. Abre el correo que te enviamos y toca el enlace.'
          : friendlyAuthError(result.error));
      }
      if (silencioso) setAuthError('');
    } catch (error) {
      if (!silencioso) setFormError(friendlyAuthError(error.message));
    } finally {
      if (!silencioso) setSubmitting(false);
    }
  }, [porConfirmar, password, login, setAuthError]);

  useEffect(() => {
    if (!porConfirmar) return undefined;
    const alVolver = () => { if (document.visibilityState === 'visible') comprobarConfirmacion({ silencioso: true }); };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', alVolver);
    return () => { document.removeEventListener('visibilitychange', alVolver); window.removeEventListener('focus', alVolver); };
  }, [porConfirmar, comprobarConfirmacion]);

  const reenviar = async () => {
    if (reenvioEn > 0 || submitting) return;
    setFormError(''); setSuccess('');
    setSubmitting(true);
    try {
      const result = await conLimite(resendConfirmationEmail(porConfirmar, regreso));
      if (result?.error) throw new Error(result.error);
      setSuccess('Te enviamos el correo otra vez. Puede tardar un minuto; revisa también spam y promociones.');
      setReenvioEn(ESPERA_REENVIO_S);
      trackEvent('signup_confirmation_resent', { compra });
    } catch (error) {
      setFormError(friendlyAuthError(error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const olvideClave = async () => {
    setFormError(''); setSuccess(''); setAuthError('');
    if (!email.trim()) return setFormError('Escribe tu correo y te enviamos el enlace para cambiar la contraseña.');
    setSubmitting(true);
    try {
      const result = await conLimite(resetPassword(email.trim()));
      if (result?.error) throw new Error(result.error);
      setSuccess('Te enviamos un enlace para cambiar la contraseña. Revisa tu correo.');
    } catch (error) {
      setFormError(friendlyAuthError(error.message));
    } finally {
      setSubmitting(false);
    }
    return undefined;
  };

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
      const result = await conLimite(mode === 'register'
        ? register({
            name: name.trim(),
            email: email.trim(),
            password,
            privacyAccepted,
            redirectPath: regreso,
            consentScope: 'professional',
          })
        : login(email.trim(), password));
      if (result?.yaExiste) {
        // Ya tenía cuenta: se le deja el correo puesto y solo escribe la contraseña.
        setMode('login');
        setAuthError('');
        setFormError(compra
          ? 'Este correo ya tiene una cuenta. Escribe tu contraseña y toca «Entrar y pagar».'
          : 'Este correo ya tiene una cuenta. Escribe tu contraseña para entrar.');
        trackEvent('signup_existing_account', { compra });
        return;
      }
      if (result?.error) {
        // Entró sin haber confirmado el correo: se le lleva al paso de confirmar.
        if (mode === 'login' && /not confirmed/i.test(result.error)) { setAuthError(''); setPorConfirmar(email.trim()); return; }
        throw new Error(result.error);
      }
      if (mode === 'register') trackEvent('signup_completed', { method: 'email', account_scope: 'professional' });
      if (mode === 'register' && !result?.session) {
        setPorConfirmar(email.trim());
        setReenvioEn(ESPERA_REENVIO_S);
        trackEvent('signup_confirmation_pending', { compra });
      }
    } catch (error) {
      setAuthError('');
      setFormError(friendlyAuthError(error.message));
      trackEvent('signup_error', { modo: mode, compra, motivo: String(error.message || '').slice(0, 80) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError('');
    setAuthError('');
    // Con Google, el texto bajo el botón dice que al continuar se aceptan los
    // términos y la política: no se pide además la casilla (era un paso que
    // frenaba y contradecía ese mismo texto).
    setSuccess('');
    setSubmitting(true);
    // En registro, si no venía de una página concreta, la primera parada
    // es completar el perfil. En ingreso se vuelve al panel.
    const destino = nextPath === '/app' && mode === 'register'
      ? '/app/perfil?bienvenida=1'
      : nextPath;
    // Se vuelve a /app, que espera a que Supabase lea el token, y de ahí
    // a donde la persona quería ir (la ficha de un curso, por ejemplo).
    try {
      const result = await conLimite(loginWithGoogle({ redirectPath: '/app', next: destino }));
      if (result?.error) setFormError(friendlyAuthError(result.error));
    } catch (error) {
      setFormError(friendlyAuthError(error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const aviso = (formError || authError || success) ? (
    <div
      ref={avisoRef}
      tabIndex={-1}
      role={success && !formError && !authError ? 'status' : 'alert'}
      className={`rounded-lg border p-3 text-sm leading-6 outline-none ${success && !formError && !authError ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}
    >
      {formError || (authError ? friendlyAuthError(authError) : success)}
    </div>
  ) : null;
  const ayuda = waLink(compra
    ? 'Hola, estoy creando mi cuenta en edvanta.co para pagar mi certificado y necesito ayuda.'
    : 'Hola, necesito ayuda para crear mi cuenta en edvanta.co.');
  const bandeja = bandejaDe(porConfirmar);
  const campo = 'min-h-12 w-full rounded-lg border border-edvanta-border bg-white pl-10 pr-3 text-base outline-none focus:border-edvanta-teal focus:ring-2 focus:ring-teal-100';

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <section className="relative overflow-hidden border-b border-edvanta-border"><div className="ed-backdrop" aria-hidden="true" /><div className="ed-grid" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8 lg:py-16">
            <div className="max-w-2xl self-center">
              <p className="ed-eyebrow">{compra ? 'Tu certificado' : 'Tu espacio profesional'}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-blue sm:text-5xl">{compra ? 'Un paso y pasas al pago' : 'Convierte tus intereses en un plan que puedas seguir'}</h1>
              <p className="mt-5 text-lg leading-8 text-edvanta-muted">{compra
                ? 'Crea tu cuenta o entra para que el certificado quede a tu nombre. Después vas directo al pago seguro con Mercado Pago: tarjeta, PSE, Nequi o Efecty.'
                : 'Guarda cursos, organiza rutas y concentra en un solo lugar las decisiones que fortalecen tu perfil.'}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {(compra ? [
                  [CheckCircle2, 'Certificado a tu nombre'],
                  [CheckCircle2, 'Pago seguro con Mercado Pago'],
                  [CheckCircle2, 'Acompañamiento por WhatsApp'],
                ] : [
                  [BriefcaseBusiness, 'Define una carrera objetivo'],
                  [CheckCircle2, 'Sigue tu avance real'],
                  [LockKeyhole, 'Datos privados por defecto'],
                ]).map(([Icon, label]) => (
                  <div key={label} className="border-l-2 border-teal-500 pl-3">
                    <Icon className="h-5 w-5 text-edvanta-tealdark" aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold leading-5 text-edvanta-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {porConfirmar ? (
              <div ref={confirmarRef} className="ds-card scroll-mt-52 p-6 shadow-sm sm:p-7" data-paso="confirmar-correo">
                <MailCheck className="h-9 w-9 text-edvanta-tealdark" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-bold text-edvanta-deep">{compra ? 'Falta un toque: confirma tu correo' : 'Confirma tu correo'}</h2>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                  Te enviamos un enlace a <strong className="break-all text-edvanta-deep">{porConfirmar}</strong>. Ábrelo desde este mismo celular
                  {compra ? ' y pasas directo al pago con Mercado Pago.' : ' y entras a tu cuenta.'}
                </p>
                <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-edvanta-muted">
                  <li>Abre tu correo y busca el mensaje de Edvanta.</li>
                  <li>Si no está en la bandeja principal, mira en spam y en promociones.</li>
                  <li>Toca «Confirmar» y vuelve aquí: seguimos solos.</li>
                </ol>
                <div className="mt-5 space-y-3">
                  {aviso}
                  {bandeja && (
                    <a href={bandeja[1]} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('signup_open_inbox', { compra })} className="ed-btn ed-btn--primary w-full">
                      {bandeja[0]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                  <button type="button" onClick={() => comprobarConfirmacion()} disabled={submitting} className={`ed-btn w-full ${bandeja ? 'ed-btn--secondary' : 'ed-btn--primary'}`}>
                    {submitting ? 'Comprobando…' : compra ? 'Ya confirmé: ir al pago' : 'Ya confirmé: entrar'}
                  </button>
                  <button type="button" onClick={reenviar} disabled={submitting || reenvioEn > 0} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-edvanta-border bg-white px-4 text-sm font-bold text-edvanta-deep hover:bg-edvanta-bg disabled:cursor-not-allowed disabled:opacity-60">
                    {reenvioEn > 0 ? `Reenviar el correo en ${reenvioEn} s` : 'Reenviar el correo'}
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-edvanta-border pt-4 text-sm">
                  <button type="button" onClick={() => { setPorConfirmar(''); setFormError(''); setSuccess(''); }} className="min-h-11 font-bold text-edvanta-tealdark underline-offset-2 hover:underline">Corregir el correo</button>
                  <a href={ayuda} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('signup_help_whatsapp', { compra, paso: 'confirmar' })} className="inline-flex min-h-11 items-center gap-1.5 font-bold text-edvanta-tealdark underline-offset-2 hover:underline"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ayuda por WhatsApp</a>
                </div>
                <p className="mt-3 text-xs leading-5 text-edvanta-subtle">¿Prefieres no esperar el correo? <button type="button" onClick={handleGoogle} disabled={!supabaseConfigured || submitting} className="font-bold text-edvanta-tealdark underline">Continúa con Google</button> y entras de una vez.</p>
              </div>
            ) : (
            <div className="ds-card p-6 shadow-sm sm:p-7">
              <div className="flex gap-1 border-b border-edvanta-border" role="tablist" aria-label="Acceso a Edvanta">
                <button type="button" onClick={() => switchMode('login')} className={`min-h-11 flex-1 border-b-2 px-3 text-sm font-bold ${mode === 'login' ? 'border-edvanta-teal text-edvanta-tealdark' : 'border-transparent text-edvanta-subtle'}`}>Ingresar</button>
                <button type="button" onClick={() => switchMode('register')} className={`min-h-11 flex-1 border-b-2 px-3 text-sm font-bold ${mode === 'register' ? 'border-edvanta-teal text-edvanta-tealdark' : 'border-transparent text-edvanta-subtle'}`}>Crear cuenta</button>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-edvanta-deep">{compra ? (mode === 'login' ? 'Entra para pagar tu certificado' : 'Crea tu cuenta para pagar') : (mode === 'login' ? 'Continúa con tu plan' : 'Crea tu perfil profesional')}</h2>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">{compra ? 'Toma menos de un minuto. Luego vas directo a Mercado Pago.' : (mode === 'login' ? 'Accede a tus cursos guardados y rutas activas.' : 'La configuración inicial toma menos de tres minutos.')}</p>

              {!supabaseConfigured && (
                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">El registro todavía no está configurado en este entorno.</div>
              )}

              <button type="button" onClick={handleGoogle} disabled={!supabaseConfigured || submitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-edvanta-border bg-white px-4 text-sm font-bold text-edvanta-deep hover:bg-edvanta-bg disabled:cursor-not-allowed disabled:opacity-50">
                <Globe2 className="h-5 w-5" aria-hidden="true" /> Continuar con Google
              </button>
              <p className="mt-2 text-center text-xs leading-4 text-edvanta-subtle">
                Solo pedimos tu nombre y correo. Al continuar aceptas los{' '}
                <Link to="/terminos" target="_blank" className="font-semibold text-edvanta-tealdark">términos</Link> y la{' '}
                <Link to="/privacidad" target="_blank" className="font-semibold text-edvanta-tealdark">política de privacidad</Link>.
              </p>
              <div className="my-5 flex items-center gap-3 text-xs text-edvanta-subtle"><span className="h-px flex-1 bg-slate-200" /><span>o usa tu correo</span><span className="h-px flex-1 bg-slate-200" /></div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {mode === 'register' && (
                  <label className="block text-sm font-semibold text-edvanta-muted">Nombre
                    <span className="relative mt-1.5 block"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" /><input name="name" value={name} onChange={event => setName(event.target.value)} autoComplete="name" autoCapitalize="words" enterKeyHint="next" className={campo} /></span>
                  </label>
                )}
                <label className="block text-sm font-semibold text-edvanta-muted">Correo
                  <span className="relative mt-1.5 block"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" /><input type="email" name="email" inputMode="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" className={campo} /></span>
                </label>
                <label className="block text-sm font-semibold text-edvanta-muted">Contraseña
                  <span className="relative mt-1.5 block"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" /><input type={verClave ? 'text' : 'password'} name="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" className={`${campo} pr-12`} />
                    <button type="button" onClick={() => setVerClave(v => !v)} aria-label={verClave ? 'Ocultar la contraseña' : 'Ver la contraseña'} aria-pressed={verClave} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-edvanta-subtle">{verClave ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}</button></span>
                  {mode === 'register' && <span className="mt-1 block text-xs font-normal text-edvanta-subtle">Mínimo 8 caracteres.</span>}
                </label>
                {mode === 'login' && (
                  <button type="button" onClick={olvideClave} disabled={submitting} className="-mt-1 min-h-11 text-sm font-bold text-edvanta-tealdark underline-offset-2 hover:underline">Olvidé mi contraseña</button>
                )}
                {mode === 'register' && (
                  <label className="flex min-h-12 items-start gap-3 rounded-lg border border-edvanta-border bg-edvanta-bg p-3 text-sm leading-5 text-edvanta-muted">
                    <input type="checkbox" checked={privacyAccepted} onChange={event => setPrivacyAccepted(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700" />
                    <span>Acepto los <Link to="/terminos" target="_blank" className="font-bold text-edvanta-tealdark">términos</Link> y la <Link to="/privacidad" target="_blank" className="font-bold text-edvanta-tealdark">política de privacidad</Link>.</span>
                  </label>
                )}
                {aviso}
                <button type="submit" disabled={!supabaseConfigured || submitting} aria-busy={submitting} className="ed-btn ed-btn--primary w-full">
                  {submitting ? 'Procesando...' : compra ? (mode === 'login' ? 'Entrar y pagar' : 'Crear cuenta y pagar') : mode === 'login' ? 'Ingresar a mi panel' : 'Crear mi perfil'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                {compra && (
                  <a href={ayuda} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('signup_help_whatsapp', { compra, paso: 'formulario' })} className="flex min-h-11 items-center justify-center gap-1.5 text-sm font-bold text-edvanta-tealdark"><MessageCircle className="h-4 w-4" aria-hidden="true" /> ¿Algo no funciona? Te ayudamos por WhatsApp</a>
                )}
              </form>
            </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
