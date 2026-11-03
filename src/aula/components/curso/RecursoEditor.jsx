import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUp, ClipboardCheck, Copy, FileText, HelpCircle, MessageSquare, Plus, Save,
  Send, Trash2,
} from 'lucide-react';
import { fileUrl, get, patch, post } from '../../api';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog, Modal } from '../../ui/Dialog';
import { FileUploader } from '../../ui/FileUploader';
import {
  Checkbox, checkForm, errorsFrom, Field, isBlank, Select, TextArea, TextInput, Toggle,
} from '../../ui/Form';
import { RichText } from '../../ui/RichText';
import RichTextEditor from '../../ui/RichTextEditor';
import { Alert, LoadingBlock, Spinner } from '../../ui/States';
import { Segmented } from '../../ui/Tabs';
import { useToast } from '../../ui/Toast';

export const RESOURCE_META = {
  quiz: { label: 'Quiz', icon: ClipboardCheck, tone: 'accent', endpoint: 'quizzes', name: 'quiz' },
  activity: { label: 'Actividad', icon: FileText, tone: 'info', endpoint: 'activities', name: 'actividad' },
  forum: { label: 'Foro', icon: MessageSquare, tone: 'success', endpoint: 'forums', name: 'foro' },
};

const STATUS_TONE = { borrador: 'neutral', publicado: 'success', archivado: 'neutral' };

const dateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const DEFAULT_LEVELS = [
  { level: 4, label: 'Destacado', description: 'Cumple con profundidad, precisión y evidencia.' },
  { level: 3, label: 'Logrado', description: 'Cumple lo esencial con una justificación suficiente.' },
  { level: 2, label: 'En desarrollo', description: 'Cumple parcialmente; falta precisión o evidencia.' },
  { level: 1, label: 'Inicial', description: 'Presenta intentos aislados o incompletos.' },
  { level: 0, label: 'Sin evidencia', description: 'No presenta el trabajo solicitado.' },
];

let localId = 0;
const nextLocalId = (prefix) => {
  localId += 1;
  return `${prefix}-${Date.now()}-${localId}`;
};

const blankOption = (index) => ({
  id: null, text: '', isCorrect: index === 0, feedback: '',
});
const blankQuestion = () => ({
  id: null,
  promptHtml: '',
  points: 25,
  explanation: '',
  generalFeedback: '',
  options: Array.from({ length: 4 }, (_, index) => blankOption(index)),
});
const blankRubric = () => ({ version: 1, scale: '0-4', total: 100, criteria: [] });
const blankCriterion = () => ({
  id: nextLocalId('criterion'),
  name: '',
  weight: 50,
  levels: DEFAULT_LEVELS.map((level) => ({ ...level })),
});

function quizInitial(moduleId) {
  return {
    title: '',
    moduleId: moduleId ? String(moduleId) : '',
    instructionsHtml: '',
    isRequired: true,
    passingScore: '70',
    maxAttempts: '2',
    showAnswersAfterSubmit: true,
    weight: '10',
    questions: [blankQuestion(), blankQuestion(), blankQuestion(), blankQuestion()],
  };
}

function activityInitial(moduleId) {
  return {
    title: '',
    moduleId: moduleId ? String(moduleId) : '',
    instructionsHtml: '',
    caseHtml: '',
    pointsToSolve: [''],
    expectedProduct: '',
    extensionHint: '',
    supportHtml: '',
    teacherGuideHtml: '',
    materials: [],
    dueAt: '',
    allowText: true,
    allowLink: false,
    allowFile: true,
    acceptedExtensionsText: 'pdf, docx, xlsx, pptx, png, jpg, jpeg',
    maxFileMb: '20',
    maxPoints: '100',
    isRequired: true,
    weight: '20',
    gradingMethod: 'directa',
    rubric: blankRubric(),
  };
}

function forumInitial(moduleId) {
  return {
    title: '',
    moduleId: moduleId ? String(moduleId) : '',
    purpose: '',
    description: '',
    centralQuestion: '',
    guidingQuestions: [''],
    participationHtml: '',
    rulesHtml: '',
    opensAt: '',
    closesAt: '',
    isClosed: false,
    allowAttachments: false,
    gradingMethod: 'formativa',
    weight: '0',
    rubric: blankRubric(),
    noParticipantsAlternative: '',
  };
}

function formFromQuiz(data, modules) {
  const quiz = data.quiz;
  return {
    title: quiz.title || '',
    moduleId: quiz.moduleId ? String(quiz.moduleId) : (modules[0]?.id ? String(modules[0].id) : ''),
    instructionsHtml: quiz.instructionsHtml || '',
    isRequired: quiz.isRequired ?? true,
    passingScore: String(quiz.passingScore ?? 70),
    maxAttempts: String(quiz.maxAttempts ?? 2),
    showAnswersAfterSubmit: quiz.showAnswersAfterSubmit ?? true,
    weight: String(quiz.weight ?? 0),
    questions: (data.questions || []).length
      ? data.questions.map((q) => ({
        id: q.id,
        promptHtml: q.promptHtml || '',
        points: Number(q.points) || 25,
        explanation: q.explanation || '',
        generalFeedback: q.generalFeedback || '',
        options: (q.options || []).map((o) => ({
          id: o.id, text: o.text || '', isCorrect: Boolean(o.isCorrect), feedback: o.feedback || '',
        })),
      }))
      : [blankQuestion(), blankQuestion(), blankQuestion(), blankQuestion()],
  };
}

function formFromActivity(data, modules) {
  const activity = data.activity;
  return {
    title: activity.title || '',
    moduleId: activity.moduleId ? String(activity.moduleId) : (modules[0]?.id ? String(modules[0].id) : ''),
    instructionsHtml: activity.instructionsHtml || '',
    caseHtml: activity.caseHtml || '',
    pointsToSolve: (activity.pointsToSolve || []).length ? activity.pointsToSolve : [''],
    expectedProduct: activity.expectedProduct || '',
    extensionHint: activity.extensionHint || '',
    supportHtml: activity.supportHtml || '',
    teacherGuideHtml: activity.teacherGuideHtml || '',
    materials: (activity.materials || []).map((m) => ({
      name: m.name || '', url: m.url || '', fileId: m.fileId || null, kind: m.fileId ? 'archivo' : 'enlace',
      file: m.fileId ? { id: m.fileId, name: m.name || 'Material actual' } : null,
    })),
    dueAt: dateInput(activity.dueAt),
    allowText: activity.allowText ?? true,
    allowLink: activity.allowLink ?? false,
    allowFile: activity.allowFile ?? true,
    acceptedExtensionsText: (activity.acceptedExtensions || []).join(', '),
    maxFileMb: String(activity.maxFileMb ?? 20),
    maxPoints: String(activity.maxPoints ?? 100),
    isRequired: activity.isRequired ?? true,
    weight: String(activity.weight ?? 0),
    gradingMethod: activity.gradingMethod || (activity.rubric ? 'rubrica' : 'directa'),
    rubric: activity.rubric?.criteria?.length ? activity.rubric : blankRubric(),
  };
}

function formFromForum(data, modules) {
  const forum = data.forum;
  return {
    title: forum.title || '',
    moduleId: forum.moduleId ? String(forum.moduleId) : (modules[0]?.id ? String(modules[0].id) : ''),
    purpose: forum.purpose || '',
    description: forum.description || '',
    centralQuestion: forum.centralQuestion || '',
    guidingQuestions: (forum.guidingQuestions || []).length ? forum.guidingQuestions : [''],
    participationHtml: forum.participationHtml || '',
    rulesHtml: forum.rulesHtml || '',
    opensAt: dateInput(forum.opensAt),
    closesAt: dateInput(forum.closesAt),
    isClosed: forum.isClosed ?? false,
    allowAttachments: forum.allowAttachments ?? false,
    gradingMethod: forum.gradingMethod || (forum.rubric ? 'rubrica' : 'formativa'),
    weight: String(forum.weight ?? 0),
    rubric: forum.rubric?.criteria?.length ? forum.rubric : blankRubric(),
    noParticipantsAlternative: forum.noParticipantsAlternative || '',
  };
}

function useBeforeUnload(dirty) {
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
}

function LevelEditor({ criterion, onChange }) {
  const levels = criterion.levels?.length ? criterion.levels : DEFAULT_LEVELS;
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-xs font-semibold text-[var(--aula-primary)]">Descriptores de desempeño</summary>
      <div className="mt-2 flex flex-col gap-2">
        {[4, 3, 2, 1, 0].map((level) => {
          const current = levels.find((l) => Number(l.level) === level) || DEFAULT_LEVELS.find((l) => l.level === level);
          return (
            <div key={level} className="grid gap-2 sm:grid-cols-[110px_1fr]">
              <span className="text-xs font-semibold text-[var(--aula-muted)]">Nivel {level}</span>
              <TextInput
                aria-label={`Descriptor del nivel ${level}`}
                value={current?.description || ''}
                onChange={(e) => {
                  const next = levels.filter((l) => Number(l.level) !== level);
                  next.push({ ...current, level, description: e.target.value });
                  next.sort((a, b) => Number(b.level) - Number(a.level));
                  onChange(next);
                }}
              />
            </div>
          );
        })}
      </div>
    </details>
  );
}

function RubricEditor({ value, onChange }) {
  const rubric = value?.criteria?.length ? value : blankRubric();
  const total = rubric.criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const update = (next) => onChange({ ...rubric, version: rubric.scale === '0-100' ? 2 : 1, total: 100, ...next });
  const setCriterion = (index, patch) => update({
    criteria: rubric.criteria.map((c, i) => (i === index ? { ...c, ...patch } : c)),
  });
  return (
    <div className="flex flex-col gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Rúbrica</p>
          <p className="text-xs text-[var(--aula-muted)]">Los pesos de los criterios distribuyen la nota de esta actividad y deben sumar 100 %.</p>
        </div>
        <Select
          label="Escala"
          className="w-48"
          value={rubric.scale || '0-4'}
          onChange={(e) => {
            const scale = e.target.value;
            update({
              scale,
              criteria: rubric.criteria.map((c) => ({
                ...c,
                levels: scale === '0-4' && !c.levels?.length ? DEFAULT_LEVELS.map((l) => ({ ...l })) : c.levels || [],
              })),
            });
          }}
          options={[
            { value: '0-4', label: 'Niveles 0 a 4' },
            { value: '0-100', label: 'Nota directa 0 a 100' },
          ]}
        />
      </div>
      {rubric.criteria.map((criterion, index) => (
        <div key={criterion.id || index} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-[var(--aula-surface-muted)] p-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
            <TextInput
              label={`Criterio ${index + 1}`}
              value={criterion.name}
              onChange={(e) => setCriterion(index, { name: e.target.value })}
              placeholder="Qué se evalúa"
            />
            <TextInput
              label="Peso (%)"
              inputMode="decimal"
              value={String(criterion.weight ?? '')}
              onChange={(e) => setCriterion(index, { weight: e.target.value })}
            />
            <Button
              variant="ghost"
              icon={Trash2}
              onClick={() => update({ criteria: rubric.criteria.filter((_, i) => i !== index) })}
              aria-label={`Quitar criterio ${index + 1}`}
            />
          </div>
          {rubric.scale !== '0-100' && (
            <LevelEditor criterion={criterion} onChange={(levels) => setCriterion(index, { levels })} />
          )}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          icon={Plus}
          onClick={() => update({ criteria: [...rubric.criteria, blankCriterion()] })}
        >
          Añadir criterio
        </Button>
        <span className={`text-xs font-semibold ${Math.abs(total - 100) <= 0.05 ? 'text-[var(--aula-success)]' : 'text-[var(--aula-danger)]'}`}>
          Los pesos suman {Math.round(total * 100) / 100} %
        </span>
      </div>
    </div>
  );
}

function QuestionEditor({ questions, onChange }) {
  const update = (index, patch) => onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  const setOption = (qIndex, oIndex, patch) => {
    const question = questions[qIndex];
    const options = question.options.map((option, i) => {
      if (i === oIndex) return { ...option, ...patch };
      if (patch.isCorrect) return { ...option, isCorrect: false };
      return option;
    });
    update(qIndex, { options });
  };
  const move = (index, delta) => {
    const next = [...questions];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const addQuestion = () => onChange([
    ...questions,
    { ...blankQuestion(), points: Number(questions[0]?.points) || 25 },
  ]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Preguntas</p>
          <p className="text-xs text-[var(--aula-muted)]">Cada pregunta tiene una única respuesta correcta. El servidor calcula la nota sobre 100.</p>
        </div>
        <Button size="sm" variant="secondary" icon={Plus} onClick={addQuestion}>Añadir pregunta</Button>
      </div>
      {questions.map((question, qIndex) => (
        <section key={question.id || qIndex} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">Pregunta {qIndex + 1}</p>
            <div className="flex items-center gap-1">
              <TextInput
                label="Puntos"
                className="w-24"
                inputMode="decimal"
                value={String(question.points ?? '')}
                onChange={(e) => update(qIndex, { points: e.target.value })}
                aria-label={`Puntos de la pregunta ${qIndex + 1}`}
              />
              <Button size="sm" variant="ghost" icon={ArrowUp} disabled={qIndex === 0} onClick={() => move(qIndex, -1)} aria-label="Subir pregunta" />
              <Button size="sm" variant="ghost" icon={ArrowDown} disabled={qIndex === questions.length - 1} onClick={() => move(qIndex, 1)} aria-label="Bajar pregunta" />
              <Button
                size="sm"
                variant="ghost"
                icon={Copy}
                aria-label="Duplicar pregunta"
                onClick={() => onChange([
                  ...questions.slice(0, qIndex + 1),
                  { ...question, id: null, options: question.options.map((o) => ({ ...o, id: null })) },
                  ...questions.slice(qIndex + 1),
                ])}
              />
              <Button
                size="sm"
                variant="ghost"
                icon={Trash2}
                disabled={questions.length <= 1}
                aria-label="Quitar pregunta"
                onClick={() => onChange(questions.filter((_, i) => i !== qIndex))}
              />
            </div>
          </div>
          <RichTextEditor
            label={`Enunciado de la pregunta ${qIndex + 1}`}
            value={question.promptHtml}
            onChange={(promptHtml) => update(qIndex, { promptHtml })}
            minHeight={80}
            headings={false}
            placeholder="Escribe la pregunta…"
          />
          <div className="mt-3 flex flex-col gap-2">
            {question.options.map((option, oIndex) => (
              <div key={option.id || oIndex} className="grid gap-2 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-2 sm:grid-cols-[32px_1fr_1fr_auto] sm:items-center">
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={Boolean(option.isCorrect)}
                    onChange={() => setOption(qIndex, oIndex, { isCorrect: true })}
                    aria-label={`Marcar ${String.fromCharCode(65 + oIndex)} como respuesta correcta`}
                    className="h-4 w-4 accent-[var(--aula-primary)]"
                  />
                  {String.fromCharCode(65 + oIndex)}
                </label>
                <TextInput
                  aria-label={`Texto de la opción ${String.fromCharCode(65 + oIndex)}`}
                  value={option.text}
                  onChange={(e) => setOption(qIndex, oIndex, { text: e.target.value })}
                  placeholder="Opción"
                />
                <TextInput
                  aria-label={`Retroalimentación de la opción ${String.fromCharCode(65 + oIndex)}`}
                  value={option.feedback}
                  onChange={(e) => setOption(qIndex, oIndex, { feedback: e.target.value })}
                  placeholder="Retroalimentación (opcional)"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  disabled={question.options.length <= 2}
                  aria-label="Quitar opción"
                  onClick={() => update(qIndex, { options: question.options.filter((_, i) => i !== oIndex) })}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                icon={Plus}
                onClick={() => update(qIndex, { options: [...question.options, blankOption(question.options.length)] })}
              >
                Añadir opción
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const points = Math.round((100 / questions.length) * 100) / 100;
                  onChange(questions.map((q) => ({ ...q, points })));
                }}
              >
                Repartir 100 puntos
              </Button>
            </div>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-[var(--aula-primary)]">Explicación y retroalimentación general</summary>
            <div className="mt-2 grid gap-3">
              <TextArea
                label="Explicación de la respuesta"
                rows={2}
                value={question.explanation}
                onChange={(e) => update(qIndex, { explanation: e.target.value })}
                hint="Se muestra al estudiante si publicas las soluciones."
              />
              <TextArea
                label="Retroalimentación general"
                rows={2}
                value={question.generalFeedback}
                onChange={(e) => update(qIndex, { generalFeedback: e.target.value })}
              />
            </div>
          </details>
        </section>
      ))}
    </div>
  );
}

function MaterialsEditor({ courseId, materials, onChange }) {
  const update = (index, patch) => onChange(materials.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  return (
    <div className="flex flex-col gap-2">
      {materials.map((material, index) => (
        <div key={index} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_170px] sm:items-end">
            <TextInput
              label={`Nombre del material ${index + 1}`}
              value={material.name}
              onChange={(e) => update(index, { name: e.target.value })}
              placeholder="Guía, plantilla o lectura"
            />
            <Select
              label="Origen"
              value={material.kind}
              onChange={(e) => update(index, { kind: e.target.value })}
              options={[{ value: 'enlace', label: 'Enlace web' }, { value: 'archivo', label: 'Archivo' }]}
            />
          </div>
          {material.kind === 'archivo' ? (
            <div className="mt-2">
              <FileUploader
                purpose="recurso"
                context={{ courseId: Number(courseId) }}
                value={material.file || (material.fileId ? { id: material.fileId, name: material.name || 'Archivo actual' } : null)}
                onChange={(file) => update(index, { file, fileId: file?.id || null })}
                label="Archivo del material"
                hint="Se descarga solo desde este curso y esta actividad."
              />
            </div>
          ) : (
            <TextInput
              className="mt-2"
              label="Dirección"
              inputMode="url"
              value={material.url}
              onChange={(e) => update(index, { url: e.target.value })}
              placeholder="https://…"
            />
          )}
          <div className="mt-2">
            <Button size="sm" variant="ghost" icon={Trash2} onClick={() => onChange(materials.filter((_, i) => i !== index))}>
              Quitar material
            </Button>
          </div>
        </div>
      ))}
      <Button
        size="sm"
        variant="secondary"
        icon={Plus}
        onClick={() => onChange([...materials, { name: '', url: '', fileId: null, kind: 'enlace', file: null }])}
      >
        Añadir material
      </Button>
    </div>
  );
}

function ListEditor({ label, items, onChange, placeholder, rows = 2 }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <TextArea
            label={`${label} ${index + 1}`}
            rows={rows}
            value={item}
            onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            className="mt-7"
            disabled={items.length <= 1}
            aria-label={`Quitar ${label.toLowerCase()} ${index + 1}`}
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <Button size="sm" variant="ghost" icon={Plus} onClick={() => onChange([...items, ''])}>
        Añadir {label.toLowerCase()}
      </Button>
    </div>
  );
}

export function RecursoEditor({
  open, type, resourceId = null, moduleId = null, modules = [], courseId, base, onClose, onSaved,
}) {
  const toast = useToast();
  const meta = RESOURCE_META[type];
  const [form, setForm] = useState(() => (type === 'quiz' ? quizInitial(moduleId) : type === 'activity' ? activityInitial(moduleId) : forumInitial(moduleId)));
  const [currentId, setCurrentId] = useState(resourceId);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const formRef = useRef(null);
  useBeforeUnload(dirty);

  useEffect(() => {
    if (!open) return undefined;
    setError(null);
    setSaved(null);
    setDirty(false);
    setCurrentId(resourceId);
    if (!resourceId) {
      setForm(type === 'quiz' ? quizInitial(moduleId) : type === 'activity' ? activityInitial(moduleId) : forumInitial(moduleId));
      return undefined;
    }
    let alive = true;
    setLoading(true);
    get(`${base}/authoring/${meta.endpoint}/${resourceId}`)
      .then((data) => {
        if (!alive) return;
        setForm(type === 'quiz'
          ? formFromQuiz(data, modules)
          : type === 'activity' ? formFromActivity(data, modules) : formFromForum(data, modules));
      })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type, resourceId, moduleId, base]);

  const set = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
    setDirty(true);
    setSaved(null);
  };

  const requestClose = () => {
    if (dirty) setConfirmClose(true);
    else onClose();
  };

  const bodyFor = () => {
    if (type === 'quiz') {
      return {
        title: form.title,
        moduleId: Number(form.moduleId),
        instructionsHtml: form.instructionsHtml,
        isRequired: form.isRequired,
        passingScore: Number(form.passingScore),
        maxAttempts: Number(form.maxAttempts),
        showAnswersAfterSubmit: form.showAnswersAfterSubmit,
        weight: Number(form.weight),
        questions: form.questions.map((q) => ({
          id: q.id || undefined,
          promptHtml: q.promptHtml,
          points: Number(q.points),
          explanation: q.explanation,
          generalFeedback: q.generalFeedback,
          options: q.options.map((o) => ({
            id: o.id || undefined,
            text: o.text,
            isCorrect: o.isCorrect,
            feedback: o.feedback,
          })),
        })),
      };
    }
    if (type === 'activity') {
      return {
        title: form.title,
        moduleId: Number(form.moduleId),
        instructionsHtml: form.instructionsHtml,
        caseHtml: form.caseHtml,
        pointsToSolve: form.pointsToSolve.filter((p) => p.trim()),
        expectedProduct: form.expectedProduct,
        extensionHint: form.extensionHint,
        supportHtml: form.supportHtml,
        teacherGuideHtml: form.teacherGuideHtml,
        materials: form.materials
          .filter((m) => m.name.trim() && (m.kind === 'archivo' ? (m.file?.id || m.fileId) : m.url.trim()))
          .map((m) => ({
            name: m.name.trim(),
            fileId: m.kind === 'archivo' ? (m.file?.id || m.fileId) : null,
            url: m.kind === 'enlace' ? m.url.trim() : null,
          })),
        dueAt: form.dueAt || null,
        allowText: form.allowText,
        allowLink: form.allowLink,
        allowFile: form.allowFile,
        acceptedExtensions: form.acceptedExtensionsText.split(',').map((e) => e.trim()).filter(Boolean),
        maxFileMb: Number(form.maxFileMb),
        maxPoints: Number(form.maxPoints),
        isRequired: form.isRequired,
        weight: Number(form.weight),
        gradingMethod: form.gradingMethod,
        rubric: form.gradingMethod === 'rubrica' ? form.rubric : form.rubric?.criteria?.length ? form.rubric : null,
      };
    }
    return {
      title: form.title,
      moduleId: Number(form.moduleId),
      purpose: form.purpose,
      description: form.description,
      centralQuestion: form.centralQuestion,
      guidingQuestions: form.guidingQuestions.filter((q) => q.trim()),
      participationHtml: form.participationHtml,
      rulesHtml: form.rulesHtml,
      opensAt: form.opensAt || null,
      closesAt: form.closesAt || null,
      isClosed: form.isClosed,
      allowAttachments: form.allowAttachments,
      gradingMethod: form.gradingMethod,
      weight: form.gradingMethod === 'formativa' ? 0 : Number(form.weight),
      rubric: form.gradingMethod === 'rubrica' ? form.rubric : null,
      noParticipantsAlternative: form.noParticipantsAlternative,
    };
  };

  const save = async (publish = false) => {
    const problems = checkForm([
      ['title', isBlank(form.title), `Escribe el título del ${meta.name}.`],
      ['moduleId', !form.moduleId, 'Elige la unidad.'],
    ]);
    if (problems) {
      setError(problems);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = bodyFor();
      const savedData = currentId
        ? await patch(`${base}/authoring/${meta.endpoint}/${currentId}`, body)
        : await post(`${base}/authoring/courses/${courseId}/${meta.endpoint}`, body);
      const id = savedData.quiz?.id || savedData.activity?.id || savedData.forum?.id || currentId;
      setCurrentId(id);
      setDirty(false);
      setSaved('saved');
      onSaved?.(savedData, false);
      if (publish) {
        try {
          await post(`${base}/authoring/${meta.endpoint}/${id}/publish`, {});
          setSaved('published');
          toast.success(`${meta.label} publicado y visible en el aula.`);
          onSaved?.(savedData, true);
        } catch (publishError) {
          setError(publishError);
          toast.error('Se guardó el borrador, pero no se pudo publicar. Revisa el mensaje.');
        }
      } else {
        toast.success(`${meta.label} guardado.`);
      }
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const { fields, general } = errorsFrom(error, [
    'title', 'moduleId', 'instructionsHtml', 'weight', 'maxAttempts', 'passingScore',
    'questions', 'rubric', 'score', 'centralQuestion', 'closesAt',
  ]);
  const title = currentId ? `Editar ${meta.name}` : `Añadir ${meta.name}`;

  return (
    <>
      <Modal
        open={open}
        onClose={busy ? undefined : requestClose}
        dismissable={!busy}
        size="xl"
        title={title}
        description="Guarda un borrador cuando quieras. Publicar comprueba los requisitos y lo hace visible a los estudiantes autorizados."
        footer={(
          <>
            <span className="mr-auto self-center text-sm text-[var(--aula-muted)]" aria-live="polite">
              {busy ? <Spinner label="Guardando…" /> : saved === 'published' ? 'Publicado' : saved === 'saved' ? 'Guardado' : dirty ? 'Hay cambios sin guardar.' : ''}
            </span>
            <Button variant="ghost" onClick={requestClose} disabled={busy}>Cerrar</Button>
            <Button variant="secondary" icon={Save} onClick={() => save(false)} loading={busy}>Guardar borrador</Button>
            <Button icon={Send} onClick={() => save(true)} loading={busy}>Publicar</Button>
          </>
        )}
      >
        {loading ? <LoadingBlock rows={5} label="Cargando el recurso" /> : (
          <form ref={formRef} className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()} noValidate>
            {general && <Alert tone="danger">{general}</Alert>}
            {saved && <Alert tone="success">{saved === 'published' ? 'Publicado. Ya aparece en el aula.' : 'Guardado en el servidor. Puedes cerrar y continuar después.'}</Alert>}

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Título"
                required
                value={form.title}
                error={fields.title}
                onChange={(e) => set({ title: e.target.value })}
                data-autofocus
              />
              <Select
                label="Unidad"
                required
                value={form.moduleId}
                error={fields.moduleId}
                onChange={(e) => set({ moduleId: e.target.value })}
                options={modules.map((m) => ({ value: String(m.id), label: m.title }))}
                placeholder="Elige la unidad"
              />
            </div>

            {type === 'quiz' && (
              <>
                <RichTextEditor
                  label="Instrucciones"
                  value={form.instructionsHtml}
                  onChange={(instructionsHtml) => set({ instructionsHtml })}
                  error={fields.instructionsHtml}
                  hint="Qué debe hacer la persona, cuánto tiempo tiene y cómo se califica."
                />
                <div className="grid gap-4 sm:grid-cols-4">
                  <TextInput label="Intentos" inputMode="numeric" value={form.maxAttempts} error={fields.maxAttempts} onChange={(e) => set({ maxAttempts: e.target.value.replace(/\D/g, '') })} hint="Inicial: 2." />
                  <TextInput label="Nota mínima" inputMode="decimal" value={form.passingScore} error={fields.passingScore} onChange={(e) => set({ passingScore: e.target.value.replace(/[^\d.]/g, '') })} hint="Sobre 100." />
                  <TextInput label="Peso en el curso (%)" inputMode="decimal" value={form.weight} error={fields.weight} onChange={(e) => set({ weight: e.target.value.replace(/[^\d.]/g, '') })} hint="0 = formativo." />
                  <div className="flex items-end"><Checkbox label="Obligatorio" checked={form.isRequired} onChange={(e) => set({ isRequired: e.target.checked })} /></div>
                </div>
                <Toggle
                  label="Mostrar soluciones y explicaciones al enviar"
                  description="Si está apagado, el estudiante ve su nota y las preguntas, pero no la clave."
                  checked={form.showAnswersAfterSubmit}
                  onChange={(showAnswersAfterSubmit) => set({ showAnswersAfterSubmit })}
                />
                <QuestionEditor questions={form.questions} onChange={(questions) => set({ questions })} />
              </>
            )}

            {type === 'activity' && (
              <>
                <RichTextEditor
                  label="Consigna pública"
                  value={form.instructionsHtml}
                  onChange={(instructionsHtml) => set({ instructionsHtml })}
                  error={fields.instructionsHtml}
                  hint="Lo que ve el estudiante. No incluyas aquí la solución docente."
                />
                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--aula-primary)]">Caso, puntos y producto esperado</summary>
                  <div className="mt-3 flex flex-col gap-4">
                    <RichTextEditor label="Caso de estudio" value={form.caseHtml} onChange={(caseHtml) => set({ caseHtml })} hint="Opcional. Puedes usar la consigna para todo el caso." />
                    <ListEditor label="Punto a resolver" items={form.pointsToSolve} onChange={(pointsToSolve) => set({ pointsToSolve })} placeholder="Qué debe resolver el estudiante" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput label="Producto esperado" value={form.expectedProduct} onChange={(e) => set({ expectedProduct: e.target.value })} placeholder="Ensayo, informe, mapa conceptual…" />
                      <TextInput label="Extensión orientativa" value={form.extensionHint} onChange={(e) => set({ extensionHint: e.target.value })} placeholder="Ej. 2 a 3 páginas" />
                    </div>
                    <RichTextEditor label="Recursos de apoyo" value={form.supportHtml} onChange={(supportHtml) => set({ supportHtml })} hint="Lecturas, plantillas o enlaces." />
                  </div>
                </details>

                <section className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
                  <h3 className="text-sm font-semibold">Materiales descargables</h3>
                  <p className="mb-3 text-xs text-[var(--aula-muted)]">Archivos o enlaces para realizar la actividad. Los archivos son privados y solo se sirven a quien cursa el curso.</p>
                  <MaterialsEditor courseId={courseId} materials={form.materials} onChange={(materials) => set({ materials })} />
                </section>

                <section className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
                  <h3 className="text-sm font-semibold">Entrega</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <Checkbox label="Texto" checked={form.allowText} onChange={(e) => set({ allowText: e.target.checked })} />
                    <Checkbox label="Enlace" checked={form.allowLink} onChange={(e) => set({ allowLink: e.target.checked })} />
                    <Checkbox label="Archivo" checked={form.allowFile} onChange={(e) => set({ allowFile: e.target.checked })} />
                  </div>
                  {form.allowFile && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <TextInput label="Formatos admitidos" value={form.acceptedExtensionsText} onChange={(e) => set({ acceptedExtensionsText: e.target.value })} hint="Separados por coma. Ej. pdf, docx, png." />
                      <TextInput label="Tamaño máximo (MB)" inputMode="numeric" value={form.maxFileMb} onChange={(e) => set({ maxFileMb: e.target.value.replace(/\D/g, '') })} />
                    </div>
                  )}
                </section>

                <div className="grid gap-4 sm:grid-cols-4">
                  <TextInput label="Peso en el curso (%)" inputMode="decimal" value={form.weight} error={fields.weight} onChange={(e) => set({ weight: e.target.value.replace(/[^\d.]/g, '') })} hint="0 = formativo." />
                  <TextInput label="Puntaje máximo" inputMode="decimal" value={form.maxPoints} onChange={(e) => set({ maxPoints: e.target.value.replace(/[^\d.]/g, '') })} hint="La nota final se expresa sobre 100." />
                  <TextInput label="Fecha límite" type="date" value={form.dueAt} onChange={(e) => set({ dueAt: e.target.value })} hint="Opcional." />
                  <div className="flex items-end"><Checkbox label="Obligatoria" checked={form.isRequired} onChange={(e) => set({ isRequired: e.target.checked })} /></div>
                </div>

                <Select
                  label="Forma de calificar"
                  value={form.gradingMethod}
                  onChange={(e) => set({ gradingMethod: e.target.value })}
                  options={[{ value: 'directa', label: 'Nota directa de 0 a 100' }, { value: 'rubrica', label: 'Rúbrica por criterios' }]}
                />
                {form.gradingMethod === 'rubrica' && (
                  <RubricEditor value={form.rubric} onChange={(rubric) => set({ rubric })} />
                )}

                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--aula-primary)]">Guía docente privada</summary>
                  <div className="mt-3">
                    <RichTextEditor
                      label="Solución o guía para revisar"
                      value={form.teacherGuideHtml}
                      onChange={(teacherGuideHtml) => set({ teacherGuideHtml })}
                      hint="Solo la ve el equipo docente. No se muestra al estudiante."
                    />
                  </div>
                </details>
              </>
            )}

            {type === 'forum' && (
              <>
                <TextInput label="Propósito" value={form.purpose} onChange={(e) => set({ purpose: e.target.value })} hint="Para qué discuten y qué se espera de la conversación." />
                <RichTextEditor
                  label="Caso, dilema o tema"
                  value={form.description}
                  onChange={(description) => set({ description })}
                  error={fields.centralQuestion}
                  hint="Presenta la situación concreta. No inventes participantes."
                />
                <TextInput label="Pregunta central" value={form.centralQuestion} onChange={(e) => set({ centralQuestion: e.target.value })} />
                <ListEditor label="Pregunta de profundización" items={form.guidingQuestions} onChange={(guidingQuestions) => set({ guidingQuestions })} placeholder="Pregunta que ayuda a profundizar" rows={2} />
                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--aula-primary)]">Instrucciones, reglas y fechas</summary>
                  <div className="mt-3 flex flex-col gap-4">
                    <RichTextEditor label="Instrucciones de participación" value={form.participationHtml} onChange={(participationHtml) => set({ participationHtml })} hint="Intervención inicial, respuestas esperadas y extensión." />
                    <RichTextEditor label="Reglas de convivencia" value={form.rulesHtml} onChange={(rulesHtml) => set({ rulesHtml })} hint="Respeto, fuentes, datos confidenciales y uso de IA." />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput label="Abre el" type="date" value={form.opensAt} onChange={(e) => set({ opensAt: e.target.value })} hint="Opcional." />
                      <TextInput label="Cierra el" type="date" value={form.closesAt} error={fields.closesAt} onChange={(e) => set({ closesAt: e.target.value })} hint="Opcional. Después del cierre se conserva la lectura." />
                    </div>
                    <TextArea
                      label="Alternativa si no hay compañeros"
                      rows={2}
                      value={form.noParticipantsAlternative}
                      onChange={(e) => set({ noParticipantsAlternative: e.target.value })}
                      hint="Opcional. Por ejemplo, responder con una comparación documentada."
                    />
                  </div>
                </details>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    label="Tipo de foro"
                    value={form.gradingMethod}
                    onChange={(e) => set({ gradingMethod: e.target.value, weight: e.target.value === 'formativa' ? '0' : form.weight })}
                    options={[
                      { value: 'formativa', label: 'Formativo (sin nota)' },
                      { value: 'directa', label: 'Calificable con nota directa' },
                      { value: 'rubrica', label: 'Calificable con rúbrica' },
                    ]}
                  />
                  <TextInput
                    label="Peso en el curso (%)"
                    inputMode="decimal"
                    value={form.gradingMethod === 'formativa' ? '0' : form.weight}
                    error={fields.weight}
                    disabled={form.gradingMethod === 'formativa'}
                    onChange={(e) => set({ weight: e.target.value.replace(/[^\d.]/g, '') })}
                    hint="Solo si tiene nota."
                  />
                  <div className="flex flex-col justify-end gap-2">
                    <Checkbox label="Permitir adjuntos" checked={form.allowAttachments} onChange={(e) => set({ allowAttachments: e.target.checked })} />
                    <Checkbox label="Cerrar respuestas" description="La lectura se conserva." checked={form.isClosed} onChange={(e) => set({ isClosed: e.target.checked })} />
                  </div>
                </div>
                {form.gradingMethod === 'rubrica' && (
                  <RubricEditor value={form.rubric} onChange={(rubric) => set({ rubric })} />
                )}
              </>
            )}
          </form>
        )}
      </Modal>
      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="Hay cambios sin guardar"
        description="Si cierras ahora, se pierde lo que escribiste en este formulario. Los cambios ya guardados en el servidor se conservan."
        confirmLabel="Cerrar sin guardar"
        tone="danger"
        onConfirm={() => { setConfirmClose(false); onClose(); }}
      />
    </>
  );
}

export function RecursoPreview({ open, type, resourceId, base, onClose }) {
  const meta = RESOURCE_META[type];
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!open || !resourceId) return undefined;
    let alive = true;
    setData(null);
    setError(null);
    get(`${base}/authoring/${meta.endpoint}/${resourceId}/preview`)
      .then((res) => { if (alive) setData(res); })
      .catch((err) => { if (alive) setError(err); });
    return () => { alive = false; };
  }, [open, resourceId, base, meta.endpoint]);
  const resource = data?.quiz || data?.activity || data?.forum;
  return (
    <Modal open={open} onClose={onClose} size="lg" title={`Vista previa · ${meta.label}`} description="Así lo verá el estudiante. Esta vista no crea intentos, entregas ni notas.">
      {!data && !error && <LoadingBlock rows={4} label="Preparando la vista previa" />}
      {error && <Alert tone="danger">{error.message}</Alert>}
      {resource && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              <Badge tone="warning">Vista previa</Badge>
              {resource.weight !== null && resource.weight !== undefined && <span className="text-xs text-[var(--aula-muted)]">Peso {resource.weight} %</span>}
            </div>
            <h2 className="mt-2 text-xl font-bold">{resource.title}</h2>
          </div>
          {type === 'quiz' && (
            <>
              <RichText html={resource.instructionsHtml} />
              <ol className="flex flex-col gap-3">
                {(data.questions || []).map((q, index) => (
                  <li key={q.id} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">Pregunta {index + 1} · {q.points} puntos</p>
                    <RichText html={q.promptHtml} className="mt-1" />
                    <ul className="mt-2 flex flex-col gap-1 text-sm">
                      {q.options.map((o) => <li key={o.id} className="rounded bg-[var(--aula-surface-muted)] px-3 py-1.5">{o.text}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          )}
          {type === 'activity' && (
            <>
              <RichText html={resource.instructionsHtml} />
              {resource.materials?.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold">Materiales</h3>
                  <ul className="mt-2 flex flex-col gap-2 text-sm">
                    {resource.materials.map((m, index) => (
                      <li key={index}>
                        {m.fileId
                          ? <a className="font-semibold text-[var(--aula-primary)] underline" href={fileUrl(m.fileId, { download: true })}>{m.name}</a>
                          : <a className="font-semibold text-[var(--aula-primary)] underline" href={m.url} target="_blank" rel="noopener noreferrer">{m.name}</a>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {resource.rubric?.criteria?.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold">Rúbrica</h3>
                  <ul className="mt-2 divide-y divide-[var(--aula-border)] text-sm">
                    {resource.rubric.criteria.map((c) => <li key={c.id} className="flex justify-between py-1.5"><span>{c.name}</span><span>{c.weight} %</span></li>)}
                  </ul>
                </section>
              )}
              {resource.dueAt && <p className="text-xs text-[var(--aula-muted)]">Fecha límite: {fmtDate(resource.dueAt)}</p>}
            </>
          )}
          {type === 'forum' && (
            <>
              {resource.purpose && <p className="text-sm font-semibold">{resource.purpose}</p>}
              <RichText html={resource.description} />
              {resource.centralQuestion && <p className="rounded bg-[var(--aula-surface-muted)] px-3 py-2 text-sm"><strong>Pregunta central:</strong> {resource.centralQuestion}</p>}
              {resource.guidingQuestions?.length > 0 && (
                <ul className="list-disc pl-5 text-sm">{resource.guidingQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
              )}
              {resource.participationHtml && <RichText html={resource.participationHtml} />}
              {resource.rulesHtml && <RichText html={resource.rulesHtml} />}
              {resource.noParticipantsAlternative && <Alert tone="info">{resource.noParticipantsAlternative}</Alert>}
              <p className="text-xs text-[var(--aula-muted)]">{resource.gradingMethod === 'formativa' ? 'Foro formativo' : `Peso ${resource.weight} %`}</p>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
