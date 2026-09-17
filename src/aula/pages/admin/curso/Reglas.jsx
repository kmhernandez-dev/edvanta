import { Save } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { checkForm, errorsFrom, TextInput, Toggle } from '../../../ui/Form';
import { Card } from '../../../ui/Page';
import { Alert } from '../../../ui/States';
import { useCourse } from './CursoLayout';
import { useCourseForm } from './courseForm';

const pick = (c) => ({
  passingScore: String(Number(c.passingScore)),
  maxAttempts: String(c.maxAttempts),
  sequential: c.sequential,
  videoCompletionPct: String(c.videoCompletionPct),
  resourcesEnabled: c.resourcesEnabled,
  availableFrom: c.availableFromDay || '',
  availableUntil: c.availableUntilDay || '',
});

const VERSIONED = ['passingScore', 'maxAttempts', 'sequential', 'videoCompletionPct'];
const intIn = (v, min, max) => /^\d+$/.test(v) && Number(v) >= min && Number(v) <= max;

export default function Reglas() {
  const { course, setCourse, openPublish } = useCourse();
  const f = useCourseForm(course, setCourse, pick, {
    validate: (form) => checkForm([
      ['passingScore', !/^\d+(\.\d{1,2})?$/.test(form.passingScore) || Number(form.passingScore) > 100, 'La nota mínima va de 0 a 100.'],
      ['maxAttempts', !intIn(form.maxAttempts, 1, 20), 'Los intentos van de 1 a 20.'],
      ['videoCompletionPct', !intIn(form.videoCompletionPct, 50, 100), 'El porcentaje va de 50 a 100.'],
      ['availableUntil', form.availableFrom && form.availableUntil && form.availableUntil <= form.availableFrom, 'El cierre debe ser posterior a la apertura.'],
    ]),
    successMessage: 'Reglas guardadas.',
  });
  const toBody = (form, changed) => Object.fromEntries(changed.map((k) => {
    if (['passingScore', 'maxAttempts', 'videoCompletionPct'].includes(k)) return [k, Number(form[k])];
    if (k === 'availableFrom' || k === 'availableUntil') return [k, form[k] || null];
    return [k, form[k]];
  }));
  const { fields, general } = errorsFrom(f.error, Object.keys(pick(course)));
  const { form, set } = f;
  const archived = course.status === 'archivado';
  const versionedChanged = course.version && f.changed.some((k) => VERSIONED.includes(k));
  const pendingRules = course.version && course.hasUnpublishedChanges;

  return (
    <form ref={f.ref} onSubmit={(e) => f.submit(e, toBody)} noValidate className="flex flex-col gap-6">
      {general && <Alert tone="danger">{general}</Alert>}
      {pendingRules && (
        <Alert tone="warning" action={<Button size="sm" variant="secondary" onClick={openPublish}>Revisar y publicar</Button>}>
          Hay cambios de contenido o de reglas que los participantes todavía no ven.
        </Alert>
      )}
      <fieldset disabled={archived} className="contents">
        <Card title="Aprobación y avance" description="Se aplican a quienes cursen la versión que publiques con estos valores. Las versiones anteriores conservan sus reglas.">
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Nota mínima para aprobar (%)" inputMode="decimal" value={form.passingScore} error={fields.passingScore}
              onChange={(e) => f.setForm({ ...form, passingScore: e.target.value.replace(/[^\d.]/g, '') })}
              hint="Se usa en las evaluaciones que no definan otra." />
            <TextInput label="Intentos por evaluación" inputMode="numeric" value={form.maxAttempts} error={fields.maxAttempts}
              onChange={(e) => f.setForm({ ...form, maxAttempts: e.target.value.replace(/\D/g, '') })} hint="Entre 1 y 20." />
            <TextInput label="Video visto para completar (%)" inputMode="numeric" value={form.videoCompletionPct} error={fields.videoCompletionPct}
              onChange={(e) => f.setForm({ ...form, videoCompletionPct: e.target.value.replace(/\D/g, '') })}
              hint="Para clases que se completan con video. Entre 50 y 100." />
          </div>
          <div className="mt-5 border-t border-[var(--aula-border)] pt-5">
            <Toggle label="Avanzar en orden" checked={form.sequential} onChange={set('sequential')}
              description="Cada clase obligatoria se desbloquea al completar la anterior." />
          </div>
          {versionedChanged && (
            <Alert tone="info" className="mt-4">Después de guardar, publica una versión nueva para que estas reglas lleguen a los participantes.</Alert>
          )}
        </Card>

        <Card title="Disponibilidad" description="Se aplican de inmediato. Las fechas son días completos en hora de Colombia.">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Abre el" type="date" value={form.availableFrom} error={fields.availableFrom} onChange={set('availableFrom')}
              hint="Vacío: disponible apenas se publique." />
            <TextInput label="Cierra el" type="date" value={form.availableUntil} error={fields.availableUntil} onChange={set('availableUntil')}
              hint="Vacío: sin fecha de cierre. Después del cierre, nadie puede entrar." />
          </div>
          <p className="mt-3 text-xs text-[var(--aula-muted)]">Las fechas límite de cada persona o grupo se definen al asignar el curso, en «Participantes».</p>
        </Card>

        <Card title="Recursos de trabajo">
          <Toggle label="Mostrar la biblioteca de recursos a los participantes" checked={form.resourcesEnabled} onChange={set('resourcesEnabled')}
            description="Solo se ven los recursos publicados, siempre en su versión vigente. Se aplica de inmediato." />
        </Card>
      </fieldset>

      {!archived && (
        <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-[var(--aula-border)] bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-[var(--aula-radius)] sm:border">
          <p className="mr-auto text-sm text-[var(--aula-muted)]" aria-live="polite">{f.dirty ? 'Hay cambios sin guardar.' : 'Todo guardado.'}</p>
          <Button variant="ghost" onClick={f.reset} disabled={!f.dirty || f.busy}>Descartar</Button>
          <Button type="submit" icon={Save} loading={f.busy} disabled={!f.dirty}>Guardar reglas</Button>
        </div>
      )}
    </form>
  );
}
