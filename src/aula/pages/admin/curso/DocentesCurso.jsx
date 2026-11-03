import { useState } from 'react';
import { Trash2, UserPlus, Users } from 'lucide-react';
import { del, get, post } from '../../../api';
import { useAsync } from '../../../hooks';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { Select } from '../../../ui/Form';
import { Card } from '../../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../../ui/States';
import { useToast } from '../../../ui/Toast';
import { useCourse } from './CursoLayout';

export default function DocentesCurso() {
  const { course } = useCourse();
  const toast = useToast();
  const teachers = useAsync(({ signal }) => get(`/admin/courses/${course.id}/teachers`, { signal }), [course.id]);
  const docentes = useAsync(({ signal }) => get('/admin/users?role=docente&pageSize=100', { signal }), []);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('docente');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    if (!userId) { setError(new Error('Elige una persona con rol docente.')); return; }
    setBusy(true);
    setError(null);
    try {
      await post(`/admin/courses/${course.id}/teachers`, { userId: Number(userId), role });
      setUserId('');
      await teachers.reload();
      toast.success('Docente asignado al curso.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    setBusy(true);
    setError(null);
    try {
      await del(`/admin/courses/${course.id}/teachers/${id}`);
      await teachers.reload();
      toast.success('Docente retirado del curso.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card title="Docentes del curso" description="Solo estas personas, además de la administración, pueden revisar entregas, intentos y foros de este curso.">
        {error && <Alert tone="danger" className="mb-4">{error.message}</Alert>}
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
          <Select label="Persona con rol docente" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Elige una persona"
            options={(docentes.data?.items || []).filter((u) => u.status !== 'suspended').map((u) => ({ value: String(u.id), label: `${u.fullName} · ${u.email}` }))} />
          <Select label="Rol en el curso" value={role} onChange={(e) => setRole(e.target.value)} options={[{ value: 'docente', label: 'Docente' }, { value: 'tutor', label: 'Tutor' }]} />
          <Button type="submit" icon={UserPlus} loading={busy} disabled={!userId}>Asignar</Button>
        </form>
        <p className="mt-2 text-xs text-[var(--aula-muted)]">Si la persona aún no tiene rol docente, créala o cámbiale el rol en Personas.</p>
      </Card>

      <Card title="Asignaciones vigentes">
        {teachers.loading && !teachers.data && <LoadingBlock rows={3} label="Cargando docentes" />}
        {teachers.error && <ErrorState error={teachers.error} onRetry={teachers.reload} />}
        {teachers.data && teachers.data.length === 0 && (
          <EmptyState icon={Users} title="Sin docentes asignados" description="Asigna al menos un docente para que pueda revisar y calificar este curso." />
        )}
        {teachers.data?.length > 0 && (
          <ul className="divide-y divide-[var(--aula-border)]">
            {teachers.data.map((t) => (
              <li key={t.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{t.first_name} {t.last_name}</p>
                  <p className="text-xs text-[var(--aula-muted)]">{t.email} · {t.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={t.role === 'tutor' ? 'warning' : 'accent'}>{t.role}</Badge>
                  <Button size="sm" variant="danger-soft" icon={Trash2} onClick={() => remove(t.user_id)} loading={busy}>Retirar</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

