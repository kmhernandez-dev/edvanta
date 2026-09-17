import { useRef, useState } from 'react';
import { post } from '../api';
import { ROLE_LABEL } from '../labels';
import { useAulaSession } from '../session';
import { Button } from '../ui/Button';
import { checkForm, errorsFrom, passwordProblem, PasswordInput, useFocusFirstError } from '../ui/Form';
import { Card, PageHeader } from '../ui/Page';
import { Alert } from '../ui/States';
import { useToast } from '../ui/Toast';

export default function Cuenta() {
  const { user } = useAulaSession();
  const toast = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);

  const mismatch = form.confirm && form.next !== form.confirm;
  const submit = async (e) => {
    e.preventDefault();
    if (mismatch) return;
    const problem = passwordProblem(form.next);
    if (problem) { setError(checkForm([['next', true, problem]])); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await post('/auth/password', { current: form.current, next: form.next });
      toast.success(res.message);
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const { fields, general } = errorsFrom(error);
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Mi cuenta" description="Tus datos de acceso al aula." />
      <div className="flex flex-col gap-5">
        <Card title="Datos">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-[var(--aula-muted)]">Nombre</dt><dd className="mt-0.5 font-semibold">{user.fullName}</dd></div>
            <div><dt className="text-[var(--aula-muted)]">Correo</dt><dd className="mt-0.5 font-semibold break-all">{user.email}</dd></div>
            <div><dt className="text-[var(--aula-muted)]">Rol</dt><dd className="mt-0.5 font-semibold">{ROLE_LABEL[user.role]}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-[var(--aula-muted)]">Si alguno de estos datos está mal, pídele al administrador del aula que lo corrija.</p>
        </Card>
        <Card title="Cambiar contraseña" description="Al cambiarla cerramos las demás sesiones abiertas.">
          <form ref={formRef} onSubmit={submit} className="flex flex-col gap-4" noValidate>
            {general && <Alert tone="danger">{general}</Alert>}
            <PasswordInput label="Contraseña actual" autoComplete="current-password" value={form.current} error={fields.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })} />
            <PasswordInput label="Contraseña nueva" autoComplete="new-password" hint="Mínimo 10 caracteres, con letras y números."
              value={form.next} error={fields.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
            <PasswordInput label="Repite la contraseña nueva" autoComplete="new-password" value={form.confirm}
              error={mismatch ? 'Las contraseñas no coinciden.' : undefined}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            <div>
              <Button type="submit" loading={busy} loadingLabel="Guardando…" disabled={!form.current || !form.next || !form.confirm || mismatch}>
                Cambiar contraseña
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
