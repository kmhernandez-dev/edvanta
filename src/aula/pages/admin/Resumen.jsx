import { BookOpen, Building2, GraduationCap, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { useAulaSession } from '../../session';
import { PageHeader, StatCard } from '../../ui/Page';
import { ErrorState, LoadingBlock } from '../../ui/States';

export default function Resumen() {
  const { user } = useAulaSession();
  const summary = useAsync(({ signal }) => get('/admin/summary', { signal }), []);
  const s = summary.data;

  return (
    <div>
      <PageHeader
        eyebrow="Administración del aula"
        title={`Hola, ${user.firstName}`}
        description="Estado general del aula con los datos actuales de la base."
      />
      {summary.loading && !s && <LoadingBlock rows={2} />}
      {summary.error && <ErrorState error={summary.error} onRetry={summary.reload} />}
      {s && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Participantes activos" value={s.participants.active} icon={UserCheck} tone="primary"
            hint={`${s.participants.invited} con invitación pendiente`} />
          <StatCard label="Empresas" value={s.companies} icon={Building2} hint={`${s.groups} grupos o cohortes`} />
          <StatCard label="Cursos publicados" value={s.courses.published} icon={BookOpen} tone="success"
            hint={`${s.courses.drafts} en borrador o revisión`} />
          <StatCard label="Inscripciones activas" value={s.enrollments.active} icon={GraduationCap} />
          <StatCard label="Grupos o cohortes" value={s.groups} icon={Users} />
          <StatCard label="Administradores" value={s.admins} icon={ShieldCheck} />
        </div>
      )}
    </div>
  );
}
