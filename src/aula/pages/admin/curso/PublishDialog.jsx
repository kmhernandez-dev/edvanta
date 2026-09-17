import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Rocket, XCircle } from 'lucide-react';
import { get, post } from '../../../api';
import { useAsync } from '../../../hooks';
import { plural } from '../../../labels';
import { Button } from '../../../ui/Button';
import { Modal } from '../../../ui/Dialog';
import {
  Checkbox, checkForm, errorsFrom, TextArea, useFocusFirstError,
} from '../../../ui/Form';
import { Alert, ErrorState, LoadingBlock } from '../../../ui/States';

function DiffSummary({ diff }) {
  if (diff.first) {
    return (
      <p className="text-sm">
        Primera versión: {plural(diff.modulesAdded, 'módulo')} y {plural(diff.lessonsAdded, 'clase')} ({plural(diff.requiredAdded, 'obligatoria')}).
      </p>
    );
  }
  const lines = [
    diff.lessonsAdded && plural(diff.lessonsAdded, 'clase nueva', 'clases nuevas'),
    diff.lessonsChanged && plural(diff.lessonsChanged, 'clase modificada', 'clases modificadas'),
    diff.lessonsRemoved && plural(diff.lessonsRemoved, 'clase eliminada', 'clases eliminadas'),
    diff.modulesAdded && plural(diff.modulesAdded, 'módulo nuevo', 'módulos nuevos'),
    diff.modulesChanged && plural(diff.modulesChanged, 'módulo modificado', 'módulos modificados'),
    diff.modulesRemoved && plural(diff.modulesRemoved, 'módulo eliminado', 'módulos eliminados'),
  ].filter(Boolean);
  return (
    <div className="flex flex-col gap-2 text-sm">
      {lines.length ? <p>{lines.join(' · ')}</p> : <p className="text-[var(--aula-muted)]">Sin cambios de estructura.</p>}
      {diff.requiredAdded > 0 && (
        <p className="text-[var(--aula-warning)]">
          {plural(diff.requiredAdded, 'clase obligatoria nueva', 'clases obligatorias nuevas')}: quienes pasen a esta versión la verán como pendiente.
        </p>
      )}
      {diff.rules.length > 0 && (
        <ul className="list-disc pl-5">
          {diff.rules.map((r) => <li key={r.key}>{r.label}: {r.before} → <strong>{r.after}</strong></li>)}
        </ul>
      )}
    </div>
  );
}

export function PublishDialog({ course, onClose, onPublished }) {
  const check = useAsync(({ signal }) => get(`/admin/courses/${course.id}/publish`, { signal }), [course.id]);
  const [form, setForm] = useState({ changeSummary: '', mandatory: false, reopenCompleted: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);

  useEffect(() => {
    if (!form.mandatory && form.reopenCompleted) setForm((f) => ({ ...f, reopenCompleted: false }));
  }, [form.mandatory, form.reopenCompleted]);

  const data = check.data;
  const first = data?.diff?.first;
  const lessonLink = (lessonId) => `/aula/admin/cursos/${course.id}/clases/${lessonId}`;

  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([
      ['changeSummary', !first && form.changeSummary.trim().length < 5, 'Cuenta qué cambió (mínimo 5 caracteres). Queda en el historial de versiones.'],
    ]);
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    try {
      const result = await post(`/admin/courses/${course.id}/publish`, first ? {} : form);
      onPublished(result);
    } catch (err) {
      setError(err);
      setBusy(false);
      if (err.code === 'curso_incompleto') check.reload();
    }
  };

  const { fields, general } = errorsFrom(error, ['changeSummary']);
  const impact = data?.impact;
  return (
    <Modal
      open
      onClose={busy ? undefined : onClose}
      dismissable={!busy}
      size="lg"
      title={data ? `Publicar versión ${data.nextVersion}` : 'Publicar'}
      description="Publicar crea una versión fija del contenido y de las reglas. Las versiones anteriores quedan en el historial."
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button type="submit" form="aula-publish-form" icon={Rocket} loading={busy} loadingLabel="Publicando…" disabled={!data?.canPublish}>
            Publicar versión {data?.nextVersion || ''}
          </Button>
        </>
      )}
    >
      {check.loading && !data && <LoadingBlock rows={3} label="Revisando el curso" />}
      {check.error && <ErrorState error={check.error} onRetry={check.reload} />}
      {data && (
        <form ref={formRef} id="aula-publish-form" onSubmit={submit} className="flex flex-col gap-5" noValidate>
          {general && <Alert tone="danger">{general}</Alert>}

          {data.unchanged && (
            <Alert tone="info" title="No hay nada nuevo para publicar">
              El contenido y las reglas son iguales a la versión publicada. Los cambios de título, descripción o portada ya se ven sin publicar.
            </Alert>
          )}

          {data.errors.length > 0 && (
            <section aria-labelledby="pub-errors" className="rounded-[var(--aula-radius)] border border-[#F9C9C4] bg-[var(--aula-danger-soft)] p-4">
              <h3 id="pub-errors" className="flex items-center gap-2 text-sm font-bold text-[var(--aula-danger)]">
                <XCircle className="h-4 w-4" aria-hidden="true" /> Antes de publicar, resuelve esto
              </h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {data.errors.map((p, i) => (
                  <li key={`${p.code}-${i}`}>
                    {p.lessonId ? <Link to={lessonLink(p.lessonId)} onClick={onClose} className="underline">{p.message}</Link> : p.message}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!data.errors.length && !data.unchanged && (
            <section aria-labelledby="pub-diff" className="flex flex-col gap-2">
              <h3 id="pub-diff" className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="h-4 w-4 text-[var(--aula-success)]" aria-hidden="true" /> Qué incluye esta versión
              </h3>
              <DiffSummary diff={data.diff} />
            </section>
          )}

          {data.warnings.length > 0 && (
            <details className="rounded-[var(--aula-radius)] border border-[#F5DDAD] bg-[var(--aula-warning-soft)] px-4 py-3">
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--aula-warning)]">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" /> {plural(data.warnings.length, 'recomendación', 'recomendaciones')} (no impiden publicar)
              </summary>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {data.warnings.map((w, i) => (
                  <li key={`${w.code}-${i}`}>{w.lessonId ? <Link to={lessonLink(w.lessonId)} onClick={onClose} className="underline">{w.message}</Link> : w.message}</li>
                ))}
              </ul>
            </details>
          )}

          {data.canPublish && (
            <section aria-labelledby="pub-impact" className="flex flex-col gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-4">
              <h3 id="pub-impact" className="text-sm font-bold">Participantes</h3>
              {impact.total === 0 ? (
                <p className="text-sm text-[var(--aula-muted)]">Nadie tiene asignado este curso todavía. Quienes lo reciban después empezarán en esta versión.</p>
              ) : first ? (
                <p className="text-sm">{plural(impact.total, 'persona asignada podrá', 'personas asignadas podrán')} empezar el curso y recibirá un aviso en el aula.</p>
              ) : (
                <>
                  <ul className="flex flex-col gap-1 text-sm">
                    <li><strong>{impact.automatic}</strong> sin empezar: pasan a la nueva versión automáticamente.</li>
                    <li><strong>{impact.inProgress}</strong> en curso: {form.mandatory ? 'pasan a la nueva versión y conservan las clases que ya completaron.' : 'siguen en su versión actual.'}</li>
                    <li><strong>{impact.completed}</strong> completados: {form.mandatory && form.reopenCompleted ? 'pasan a la nueva versión; si hay clases obligatorias nuevas, su curso se reabre.' : 'conservan su versión y su resultado.'}</li>
                  </ul>
                  <Checkbox
                    label="Actualización obligatoria"
                    description="Úsala cuando el contenido anterior ya no deba estudiarse (por ejemplo, un cambio regulatorio). Quienes van en curso reciben un aviso."
                    checked={form.mandatory}
                    onChange={(e) => setForm({ ...form, mandatory: e.target.checked })}
                  />
                  {form.mandatory && impact.completed > 0 && (
                    <Checkbox
                      className="ml-7"
                      label={`Reabrir también a ${plural(impact.completed, 'quien ya completó', 'quienes ya completaron')}`}
                      description="Su curso vuelve a quedar en progreso si hay clases obligatorias nuevas. Queda registrado en la bitácora."
                      checked={form.reopenCompleted}
                      onChange={(e) => setForm({ ...form, reopenCompleted: e.target.checked })}
                    />
                  )}
                </>
              )}
            </section>
          )}

          {data.canPublish && !first && (
            <TextArea
              label="Resumen de cambios"
              required
              rows={3}
              maxLength={1000}
              value={form.changeSummary}
              error={fields.changeSummary}
              onChange={(e) => setForm({ ...form, changeSummary: e.target.value })}
              hint="Por ejemplo: «Se actualizó la clase de indicaciones según la nueva ficha técnica». Lo verán los administradores en el historial."
            />
          )}
        </form>
      )}
    </Modal>
  );
}
