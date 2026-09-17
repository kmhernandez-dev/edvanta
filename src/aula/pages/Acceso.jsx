import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, MailCheck } from 'lucide-react';
import { post } from '../api';
import { AuthLayout } from '../layout/Shells';
import { homeFor, safeReturn, useAulaSession } from '../session';
import { Button } from '../ui/Button';
import {
  checkForm, errorsFrom, isBadEmail, passwordProblem, PasswordInput, TextInput, useFocusFirstError,
} from '../ui/Form';

const BAD_EMAIL = 'El correo no parece válido. Revisa que tenga el formato nombre@dominio.com.';
import { Alert, PageLoader, Spinner } from '../ui/States';

export function Entrar() {
  const { status, user, login } = useAulaSession();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);

  if (status === 'loading') return <PageLoader />;
  if (user) return <Navigate to={safeReturn(params.get('volver'), user)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([['email', isBadEmail(form.email), BAD_EMAIL]]);
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    try {
      const signed = await login(form.email, form.password);
      navigate(safeReturn(params.get('volver'), signed), { replace: true });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  const { fields, general } = errorsFrom(error);
  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold text-[var(--aula-primary)]">Entra al aula</h1>
      <p className="mt-1 text-sm text-[var(--aula-muted)]">Usa el correo con el que te dieron acceso.</p>
      <form ref={formRef} onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        {params.get('sesion') === 'vencida' && !error && (
          <Alert tone="info">Tu sesión terminó. Vuelve a entrar para continuar donde ibas.</Alert>
        )}
        <TextInput
          label="Correo"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          error={fields.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <PasswordInput
          label="Contraseña"
          autoComplete="current-password"
          required
          value={form.password}
          error={fields.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" size="lg" icon={LogIn} loading={busy} loadingLabel="Entrando…" disabled={!form.email || !form.password}>
          Entrar
        </Button>
        <Link to="/aula/recuperar" className="text-center text-sm font-semibold text-[var(--aula-primary)] hover:underline">
          ¿Primera vez u olvidaste tu contraseña?
        </Link>
      </form>
    </AuthLayout>
  );
}

export function Recuperar() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);

  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([['email', isBadEmail(email), BAD_EMAIL]]);
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await post('/auth/recover', { email });
      setSent(res.message);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const { fields, general } = errorsFrom(error);
  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold text-[var(--aula-primary)]">Crear o restablecer tu contraseña</h1>
      {sent ? (
        <div className="mt-6 flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--aula-success-soft)] text-[var(--aula-success)]">
            <MailCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-[var(--aula-text)]" role="status">{sent}</p>
          <p className="text-xs text-[var(--aula-muted)]">El enlace vence en 2 horas.</p>
          <Button variant="secondary" to="/aula/entrar">Volver a entrar</Button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-[var(--aula-muted)]">
            Escribe tu correo y te enviaremos un enlace para crear tu contraseña. Sirve para tu primer ingreso y si olvidaste la anterior.
          </p>
          <form ref={formRef} onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
            {general && <Alert tone="danger">{general}</Alert>}
            <TextInput
              label="Correo"
              type="email"
              autoComplete="email"
              required
              value={email}
              error={fields.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" size="lg" loading={busy} loadingLabel="Enviando…" disabled={!email}>Enviar enlace</Button>
            <Link to="/aula/entrar" className="text-center text-sm font-semibold text-[var(--aula-primary)] hover:underline">Volver a entrar</Link>
          </form>
        </>
      )}
    </AuthLayout>
  );
}

/** Página del enlace de invitación o recuperación (/aula/acceso#token=…). */
export function Acceso() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signedIn } = useAulaSession();
  const token = new URLSearchParams(location.hash.replace(/^#/, '')).get('token') || '';
  const [info, setInfo] = useState({ loading: true, data: null, error: null });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);

  useEffect(() => {
    let alive = true;
    if (!token) {
      setInfo({ loading: false, data: null, error: { message: 'Este enlace está incompleto. Ábrelo directamente desde el correo.' } });
      return undefined;
    }
    post('/auth/link/inspect', { token })
      .then((data) => { if (alive) setInfo({ loading: false, data, error: null }); })
      .catch((err) => { if (alive) setInfo({ loading: false, data: null, error: err }); });
    return () => { alive = false; };
  }, [token]);

  const mismatch = confirm && password !== confirm;
  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    const problem = passwordProblem(password);
    if (problem) { setError(checkForm([['password', true, problem]])); return; }
    setBusy(true);
    setError(null);
    try {
      const { user } = await post('/auth/link/redeem', { token, password });
      signedIn(user);
      // Quita el token de la barra de direcciones y del historial.
      window.history.replaceState(null, '', '/aula/acceso');
      navigate(homeFor(user), { replace: true });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  if (info.loading) {
    return <AuthLayout><div className="py-8 text-center"><Spinner label="Verificando el enlace…" /></div></AuthLayout>;
  }
  if (info.error) {
    return (
      <AuthLayout>
        <h1 className="text-2xl font-extrabold text-[var(--aula-primary)]">No pudimos usar este enlace</h1>
        <Alert tone="danger" className="mt-5">{info.error.message}</Alert>
        <div className="mt-5 flex flex-col gap-2">
          <Button to="/aula/recuperar">Pedir un enlace nuevo</Button>
          <Button variant="ghost" to="/aula/entrar">Ir a entrar</Button>
        </div>
      </AuthLayout>
    );
  }

  const invite = info.data.purpose === 'invite';
  const { fields, general } = errorsFrom(error);
  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold text-[var(--aula-primary)]">
        {invite ? `Te damos la bienvenida, ${info.data.firstName}` : 'Crea una contraseña nueva'}
      </h1>
      <p className="mt-1 text-sm text-[var(--aula-muted)]">
        {invite ? 'Crea tu contraseña para entrar al aula con ' : 'Será la nueva contraseña de '}
        <strong className="text-[var(--aula-text)]">{info.data.email}</strong>.
      </p>
      <form ref={formRef} onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        <PasswordInput
          label="Contraseña"
          autoComplete="new-password"
          required
          hint="Mínimo 10 caracteres, con letras y números."
          value={password}
          error={fields.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Repite la contraseña"
          autoComplete="new-password"
          required
          value={confirm}
          error={mismatch ? 'Las contraseñas no coinciden.' : undefined}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button type="submit" size="lg" loading={busy} loadingLabel="Guardando…" disabled={!password || !confirm || mismatch}>
          {invite ? 'Crear contraseña y entrar' : 'Guardar y entrar'}
        </Button>
      </form>
    </AuthLayout>
  );
}
