import { useState } from 'react';
import { FileClock, History, ListTree, Rocket } from 'lucide-react';
import { get } from '../../../api';
import { useAsync } from '../../../hooks';
import { fmtDateTime, fmtMinutes, plural } from '../../../labels';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { Modal } from '../../../ui/Dialog';
import { Card } from '../../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../../ui/States';
import { BLOCK_META } from '../../../blocks/meta';
import { useCourse } from './CursoLayout';

function VersionDetail({ courseId, version, onClose }) {
  const detail = useAsync(({ signal }) => get(`/admin/courses/${courseId}/versions/${version.id}`, { signal }), [version.id]);
  const snap = detail.data?.snapshot;
  return (
    <Modal open onClose={onClose} size="lg" title={`Versión ${version.number}`}
      description={`Publicada el ${fmtDateTime(version.publishedAt)}${version.publishedBy ? ` por ${version.publishedBy}` : ''}. Esta versión no se puede modificar.`}>
      {detail.loading && <LoadingBlock rows={3} />}
      {detail.error && <ErrorState error={detail.error} onRetry={detail.reload} />}
      {snap && (
        <div className="flex flex-col gap-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-4">
            <div><dt className="text-xs text-[var(--aula-muted)]">Nota mínima</dt><dd className="font-semibold">{snap.rules.passingScore} %</dd></div>
            <div><dt className="text-xs text-[var(--aula-muted)]">Intentos</dt><dd className="font-semibold">{snap.rules.maxAttempts}</dd></div>
            <div><dt className="text-xs text-[var(--aula-muted)]">En orden</dt><dd className="font-semibold">{snap.rules.sequential ? 'Sí' : 'No'}</dd></div>
            <div><dt className="text-xs text-[var(--aula-muted)]">Video para completar</dt><dd className="font-semibold">{snap.rules.videoCompletionPct} %</dd></div>
          </dl>
          <ol className="flex flex-col gap-3">
            {snap.modules.map((m, mi) => (
              <li key={m.id} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
                <p className="text-sm font-bold">Módulo {mi + 1} · {m.title}</p>
                <ol className="mt-2 flex flex-col gap-1.5">
                  {m.lessons.map((l, li) => (
                    <li key={l.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="w-5 text-right text-xs tabular-nums text-[var(--aula-muted)]">{li + 1}.</span>
                      <span className="font-medium">{l.title}</span>
                      {!l.isRequired && <Badge>Opcional</Badge>}
                      {l.durationMinutes ? <span className="text-xs text-[var(--aula-muted)]">{fmtMinutes(l.durationMinutes)}</span> : null}
                      <span className="flex items-center gap-1 text-[var(--aula-muted)]">
                        {[...new Set(l.blocks.map((b) => b.type))].map((t) => {
                          const Icon = BLOCK_META[t]?.icon;
                          return Icon ? <Icon key={t} className="h-3.5 w-3.5" aria-label={BLOCK_META[t].label} /> : null;
                        })}
                      </span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Modal>
  );
}

export default function Versiones() {
  const { course, openPublish } = useCourse();
  const versions = useAsync(({ signal }) => get(`/admin/courses/${course.id}/versions`, { signal }), [course.id, course.version?.id]);
  const [open, setOpen] = useState(null);

  return (
    <div className="flex flex-col gap-5">
      {course.hasUnpublishedChanges && course.status !== 'archivado' && (
        <Alert tone="warning" action={<Button size="sm" icon={Rocket} onClick={openPublish}>Revisar y publicar</Button>}>
          <span className="inline-flex items-center gap-1.5"><FileClock className="h-4 w-4" aria-hidden="true" />Hay cambios sin publicar.</span>
        </Alert>
      )}
      <Card title="Historial de versiones" description="Cada participante cursa la versión que le correspondió. Publicar una nueva no altera los resultados anteriores.">
        {versions.loading && !versions.data && <LoadingBlock rows={3} />}
        {versions.error && <ErrorState error={versions.error} onRetry={versions.reload} />}
        {versions.data && (versions.data.length ? (
          <ol className="relative flex flex-col gap-4 border-l-2 border-[var(--aula-border)] pl-5">
            {versions.data.map((v) => (
              <li key={v.id} className="relative">
                <span className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${v.id === course.version?.id ? 'bg-[var(--aula-success)]' : 'bg-[var(--aula-border-strong)]'}`} aria-hidden="true" />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">Versión {v.number}</p>
                  {v.id === course.version?.id && <Badge tone="success">Vigente</Badge>}
                  {v.mandatory && <Badge tone="warning">Actualización obligatoria</Badge>}
                  <span className="text-xs text-[var(--aula-muted)]">{fmtDateTime(v.publishedAt)}{v.publishedBy ? ` · ${v.publishedBy}` : ''}</span>
                </div>
                <p className="mt-1 text-sm">{v.changeSummary}</p>
                <p className="mt-1 text-xs text-[var(--aula-muted)]">
                  {v.totals ? `${plural(v.totals.modules, 'módulo')} · ${plural(v.totals.lessons, 'clase')} · ` : ''}
                  {plural(v.enrollments, 'persona la cursa', 'personas la cursan')}
                </p>
                <Button size="sm" variant="ghost" icon={ListTree} className="mt-1" onClick={() => setOpen(v)}>Ver estructura</Button>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState icon={History} title="Todavía no hay versiones" description="La primera versión se crea al publicar el curso."
            action={course.status !== 'archivado' && <Button icon={Rocket} onClick={openPublish}>Publicar</Button>} />
        ))}
      </Card>
      {open && <VersionDetail courseId={course.id} version={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
