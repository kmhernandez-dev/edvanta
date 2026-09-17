import { useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { fileUrl } from '../../../api';
import { Button, IconButton } from '../../../ui/Button';
import { FileUploader } from '../../../ui/FileUploader';
import {
  checkForm, errorsFrom, isBlank, Select, TextArea, TextInput,
} from '../../../ui/Form';
import { Card } from '../../../ui/Page';
import { RichTextField } from '../../../ui/RichTextField';
import { Alert } from '../../../ui/States';
import { useCompanyOptions } from '../forms';
import { useCourse } from './CursoLayout';
import { useCourseForm } from './courseForm';

const pick = (c) => ({
  title: c.title,
  shortDescription: c.shortDescription,
  descriptionHtml: c.descriptionHtml,
  cover: c.coverFileId ? { id: c.coverFileId, name: 'Portada actual' } : null,
  category: c.category,
  level: c.level || '',
  tags: c.tags,
  objective: c.objective,
  learningOutcomes: c.learningOutcomes.length ? c.learningOutcomes : [''],
  audience: c.audience,
  prerequisites: c.prerequisites,
  durationMinutes: c.durationMinutes == null ? '' : String(c.durationMinutes),
  authorName: c.authorName,
  modality: c.modality,
  kind: c.kind,
  companyId: c.companyId ? String(c.companyId) : '',
});

const FIELD_MAP = {
  cover: 'coverFileId',
};

function TagsInput({ value, onChange, error }) {
  const [text, setText] = useState('');
  const add = () => {
    const parts = text.split(',').map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
    onChange(next.slice(0, 12));
    setText('');
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="aula-tags" className="text-sm font-semibold">Etiquetas</label>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Etiquetas del curso">
          {value.map((t) => (
            <li key={t} className="inline-flex items-center gap-1 rounded-full bg-[var(--aula-primary-soft)] py-0.5 pl-2.5 pr-1 text-xs font-semibold text-[var(--aula-primary)]">
              {t}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Quitar la etiqueta ${t}`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-white">
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id="aula-tags"
          value={text}
          maxLength={40}
          disabled={value.length >= 12}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder={value.length >= 12 ? 'Máximo 12 etiquetas' : 'Escribe y presiona Enter'}
          aria-describedby="aula-tags-hint"
          aria-invalid={error ? true : undefined}
          className="h-11 flex-1 rounded-[var(--aula-radius)] border border-[var(--aula-border-strong)] px-3.5 text-[15px] focus:border-[var(--aula-primary)] focus:outline-none focus:ring-[3px] focus:ring-[var(--aula-primary-soft)]"
        />
        <Button variant="secondary" onClick={add} disabled={!text.trim()}>Agregar</Button>
      </div>
      <p id="aula-tags-hint" className="text-xs text-[var(--aula-muted)]">Sirven para buscar y agrupar cursos. Hasta 12.</p>
      {error && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{error}</p>}
    </div>
  );
}

function OutcomesInput({ value, onChange, error }) {
  const update = (i, text) => onChange(value.map((v, j) => (j === i ? text : v)));
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold">Resultados de aprendizaje</legend>
      <p className="-mt-1 text-xs text-[var(--aula-muted)]">Qué podrá hacer la persona al terminar. Uno por línea, hasta 20.</p>
      {value.map((v, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 text-right text-xs tabular-nums text-[var(--aula-muted)]">{i + 1}.</span>
          <input
            value={v}
            maxLength={300}
            onChange={(e) => update(i, e.target.value)}
            aria-label={`Resultado de aprendizaje ${i + 1}`}
            className="h-10 flex-1 rounded-[var(--aula-radius)] border border-[var(--aula-border-strong)] px-3 text-sm focus:border-[var(--aula-primary)] focus:outline-none focus:ring-[3px] focus:ring-[var(--aula-primary-soft)]"
          />
          <IconButton icon={Trash2} size="sm" label={`Quitar el resultado ${i + 1}`} disabled={value.length === 1 && !v}
            onClick={() => onChange(value.length === 1 ? [''] : value.filter((_, j) => j !== i))} />
        </div>
      ))}
      {value.length < 20 && (
        <Button size="sm" variant="ghost" icon={Plus} className="self-start" onClick={() => onChange([...value, ''])}>Agregar resultado</Button>
      )}
      {error && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{error}</p>}
    </fieldset>
  );
}

export default function Informacion() {
  const { course, setCourse } = useCourse();
  const companies = useCompanyOptions();
  const locked = course.enrollments.total > 0;
  const f = useCourseForm(course, setCourse, pick, {
    validate: (form) => checkForm([
      ['title', isBlank(form.title), 'El título es obligatorio.'],
      ['companyId', form.kind === 'empresa' && !form.companyId, 'Elige la empresa de esta capacitación.'],
      ['durationMinutes', form.durationMinutes !== '' && !/^\d+$/.test(form.durationMinutes), 'Escribe la duración en minutos.'],
    ]),
    successMessage: 'Información guardada. Ya la ven los participantes.',
  });
  const toBody = (form, changed) => {
    const body = {};
    for (const key of changed) {
      if (key === 'cover') body.coverFileId = form.cover?.id ?? null;
      else if (key === 'durationMinutes') body.durationMinutes = form.durationMinutes === '' ? null : Number(form.durationMinutes);
      else if (key === 'learningOutcomes') body.learningOutcomes = form.learningOutcomes.filter((x) => x.trim());
      else if (key === 'companyId' || key === 'kind') {
        body.kind = form.kind;
        body.companyId = form.kind === 'empresa' ? Number(form.companyId) : null;
      } else body[key] = form[key];
    }
    return body;
  };
  const { fields: rawFields, general } = errorsFrom(f.error, [
    'title', 'shortDescription', 'descriptionHtml', 'coverFileId', 'category', 'level', 'tags', 'objective',
    'learningOutcomes', 'audience', 'prerequisites', 'durationMinutes', 'authorName', 'modality', 'companyId', 'kind',
  ]);
  const fields = { ...rawFields, cover: rawFields[FIELD_MAP.cover] };
  const { form, set } = f;
  const archived = course.status === 'archivado';

  return (
    <form ref={f.ref} onSubmit={(e) => f.submit(e, toBody)} noValidate className="flex flex-col gap-6">
      <Alert tone="info">Estos datos se actualizan de inmediato para los participantes; no hace falta publicar.</Alert>
      {general && <Alert tone="danger">{general}</Alert>}
      <fieldset disabled={archived} className="contents">
        <Card title="Presentación">
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-4">
              <TextInput label="Título" required maxLength={160} value={form.title} error={fields.title} onChange={set('title')} />
              <div className="flex flex-col gap-1">
                <TextArea label="Descripción corta" rows={2} maxLength={300} value={form.shortDescription} error={fields.shortDescription}
                  onChange={set('shortDescription')} hint="Aparece en «Mi aula», debajo del título." />
                <p className="self-end text-[11px] tabular-nums text-[var(--aula-muted)]">{form.shortDescription.length}/300</p>
              </div>
            </div>
            <FileUploader
              label="Portada"
              purpose="portada"
              disabled={archived}
              value={form.cover}
              onChange={set('cover')}
              preview={(v) => <img src={fileUrl(v.id)} alt="" className="h-12 w-20 rounded object-cover" />}
              hint="Imagen horizontal (16:9), sin texto importante en los bordes."
            />
          </div>
          <div className="mt-5">
            <RichTextField label="Descripción completa" value={form.descriptionHtml} onChange={set('descriptionHtml')} error={fields.descriptionHtml}
              hint="Qué aborda el curso y cómo está organizado." />
          </div>
        </Card>

        <Card title="Objetivos y público">
          <div className="flex flex-col gap-5">
            <TextArea label="Objetivo general" rows={3} maxLength={1000} value={form.objective} error={fields.objective} onChange={set('objective')} />
            <OutcomesInput value={form.learningOutcomes} onChange={set('learningOutcomes')} error={fields.learningOutcomes} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="Dirigido a" rows={2} maxLength={500} value={form.audience} error={fields.audience} onChange={set('audience')} />
              <TextArea label="Requisitos previos" rows={2} maxLength={500} value={form.prerequisites} error={fields.prerequisites} onChange={set('prerequisites')} />
            </div>
          </div>
        </Card>

        <Card title="Clasificación">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextInput label="Categoría" maxLength={80} value={form.category} error={fields.category} onChange={set('category')} placeholder="Ej.: Regulatorio" />
            <Select label="Nivel" value={form.level} onChange={set('level')} placeholder="Sin nivel"
              options={[{ value: 'basico', label: 'Básico' }, { value: 'intermedio', label: 'Intermedio' }, { value: 'avanzado', label: 'Avanzado' }]} />
            <TextInput label="Duración total (min)" inputMode="numeric" value={form.durationMinutes} error={fields.durationMinutes}
              onChange={(e) => f.setForm({ ...form, durationMinutes: e.target.value.replace(/\D/g, '') })} />
            <TextInput label="Autor o equipo" maxLength={120} value={form.authorName} error={fields.authorName} onChange={set('authorName')} />
            <Select label="Modalidad" value={form.modality} onChange={set('modality')}
              options={[{ value: 'asincronica', label: 'Asincrónica (a su ritmo)' }, { value: 'mixta', label: 'Mixta (con encuentros)' }]} />
          </div>
          <div className="mt-5"><TagsInput value={form.tags} onChange={set('tags')} error={fields.tags} /></div>
        </Card>

        <Card title="Tipo de curso" description={locked ? 'No se puede cambiar: el curso ya tiene participantes. Duplícalo para adaptarlo a otra empresa.' : 'Define a quién se puede asignar.'}>
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Tipo" value={form.kind} disabled={locked} onChange={set('kind')}
              options={[{ value: 'edvanta', label: 'Curso propio de Edvanta' }, { value: 'empresa', label: 'Capacitación privada de una empresa' }]} />
            {form.kind === 'empresa' && (
              <Select label="Empresa" required value={form.companyId} disabled={locked} error={fields.companyId} placeholder="Elige una empresa"
                onChange={set('companyId')} options={(companies.data || []).map((c) => ({ value: String(c.value), label: c.label }))} />
            )}
          </div>
        </Card>
      </fieldset>

      {!archived && (
        <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-[var(--aula-border)] bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-[var(--aula-radius)] sm:border">
          <p className="mr-auto text-sm text-[var(--aula-muted)]" aria-live="polite">{f.dirty ? 'Hay cambios sin guardar.' : 'Todo guardado.'}</p>
          <Button variant="ghost" onClick={f.reset} disabled={!f.dirty || f.busy}>Descartar</Button>
          <Button type="submit" icon={Save} loading={f.busy} disabled={!f.dirty}>Guardar cambios</Button>
        </div>
      )}
    </form>
  );
}
