/**
 * ============================================================
 *  FstAppModules.jsx — Módulos reales de la app FST
 *
 *  - Mis laboratorios (con gráfica de evolución)
 *  - Mis citas
 *  - Mi historia tiroidea (línea de tiempo)
 *  - Mis hábitos
 *  - Preguntas para mi consulta
 *  - Configuración > Privacidad
 * ============================================================
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Beaker, CalendarDays, Check, ClipboardList, Download, History,
  KeyRound, LockKeyhole, Plus, Stethoscope, Trash2, UserRound,
} from 'lucide-react';
import { useFstApp } from '../../context/FstAppContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeading, Panel, Field, SafetyNote, EmptyState } from '../fstApp/ui';

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const labTestOptions = ['TSH', 'T4 libre', 'T3', 'Tiroglobulina', 'Anti-Tg', 'Calcio', 'PTH', 'Vitamina D', 'Otro'];

export function LabsSection() {
  const { data, insert, remove, logActivity } = useFstApp();
  const [form, setForm] = useState({ test_name: 'TSH', value: '', unit: '', reference_min: '', reference_max: '', test_date: today(), laboratory: '', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedTest, setSelectedTest] = useState('TSH');

  const labs = data.laboratoryResults || [];

  const save = async event => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!form.test_name || !form.value) {
      setError('Escribe el nombre del examen y su valor.');
      return;
    }
    const result = await insert('laboratory_results', {
      test_name: form.test_name,
      value: Number(form.value),
      unit: form.unit,
      reference_min: form.reference_min ? Number(form.reference_min) : null,
      reference_max: form.reference_max ? Number(form.reference_max) : null,
      test_date: form.test_date,
      laboratory: form.laboratory,
      notes: form.notes,
    });
    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Laboratorio guardado correctamente.');
      setForm({ ...form, value: '', unit: '', reference_min: '', reference_max: '', notes: '' });
      logActivity('laboratory_created', 'laboratory_results');
    }
  };

  const chartData = useMemo(() => {
    const filtered = labs
      .filter(item => item.test_name === selectedTest)
      .sort((a, b) => String(a.test_date).localeCompare(String(b.test_date)));
    return filtered.slice(-12);
  }, [labs, selectedTest]);

  const maxValue = Math.max(...chartData.map(item => Number(item.value) || 0), 1);

  return (
    <>
      <PageHeading eyebrow="Mis laboratorios" title="Seguimiento de exámenes" description="Registra TSH, T4 libre, T3, tiroglobulina, calcio y más. Las tendencias son informativas: no diagnosticamos ni modificamos tratamientos." />
      <SafetyNote>Esta herramienta organiza tus resultados. No interpreta ni diagnostica: lleva tus exámenes a tu profesional de salud.</SafetyNote>

      {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</div>}
      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Nuevo resultado" icon={Beaker}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Examen">
                <select value={form.test_name} onChange={e => setForm({ ...form, test_name: e.target.value })}>
                  {labTestOptions.map(option => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Valor">
                <input type="number" step="any" inputMode="decimal" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="Ej. 2.8" />
              </Field>
              <Field label="Unidad">
                <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="Ej. mUI/L" />
              </Field>
              <Field label="Fecha del examen">
                <input type="date" value={form.test_date} onChange={e => setForm({ ...form, test_date: e.target.value })} />
              </Field>
              <Field label="Referencia mínima">
                <input type="number" step="any" inputMode="decimal" value={form.reference_min} onChange={e => setForm({ ...form, reference_min: e.target.value })} />
              </Field>
              <Field label="Referencia máxima">
                <input type="number" step="any" inputMode="decimal" value={form.reference_max} onChange={e => setForm({ ...form, reference_max: e.target.value })} />
              </Field>
              <Field label="Laboratorio">
                <input value={form.laboratory} onChange={e => setForm({ ...form, laboratory: e.target.value })} placeholder="Opcional" />
              </Field>
            </div>
            <Field label="Notas">
              <textarea rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Opcional" />
            </Field>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
              <Plus className="h-4 w-4" /> Guardar resultado
            </button>
          </form>
        </Panel>

        <Panel title="Evolución histórica" description="Tendencia informativa del examen seleccionado" icon={Activity} action={
          <select value={selectedTest} onChange={e => setSelectedTest(e.target.value)} className="min-h-9 rounded-lg border border-[#e5dceb] bg-white px-2 text-xs font-semibold text-[#0A2540]">
            {[...new Set(labs.map(item => item.test_name))].map(name => <option key={name}>{name}</option>)}
          </select>
        }>
          {chartData.length >= 2 ? (
            <div>
              <div className="flex h-44 items-end gap-2">
                {chartData.map(item => (
                  <div key={item.id} className="group relative flex-1">
                    <div
                      className="rounded-t-lg bg-[#2CB1A1] transition-all hover:bg-[#9274C9]"
                      style={{ height: `${Math.max(6, (Number(item.value) / maxValue) * 100)}%` }}
                      title={`${item.test_date}: ${item.value} ${item.unit || ''}`}
                    />
                    <p className="mt-1 truncate text-center text-[9px] text-slate-400">{item.test_date?.slice(5)}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-4 text-slate-500">Tendencia informativa. No es un diagnóstico: conversa los resultados con tu profesional.</p>
            </div>
          ) : (
            <EmptyState icon={Beaker} title="No tienes laboratorios registrados todavía" text="Agrega tu primer resultado para ver su evolución." />
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Resultados registrados" icon={ClipboardList}>
          {labs.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-[#f3eef7] text-xs uppercase text-slate-400">
                  <tr>
                    <th className="pb-3">Examen</th>
                    <th>Valor</th>
                    <th>Referencia</th>
                    <th>Fecha</th>
                    <th>Laboratorio</th>
                    <th><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f6f2f9]">
                  {labs.map(item => (
                    <tr key={item.id}>
                      <td className="py-3 font-semibold text-[#0A2540]">{item.test_name}</td>
                      <td>{item.value} {item.unit}</td>
                      <td className="text-xs text-slate-500">{item.reference_min != null ? `${item.reference_min} – ${item.reference_max ?? '—'}` : '—'}</td>
                      <td className="text-xs text-slate-500">{formatDate(item.test_date)}</td>
                      <td className="text-xs text-slate-500">{item.laboratory || '—'}</td>
                      <td>
                        <button
                          type="button"
                          onClick={async () => { await remove('laboratory_results', item.id); logActivity('laboratory_deleted', 'laboratory_results'); }}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Eliminar ${item.test_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Beaker} title="No tienes laboratorios registrados todavía" text="Agrega tu primer resultado para empezar tu seguimiento." />
          )}
        </Panel>
      </div>
    </>
  );
}

export function AppointmentsSection() {
  const { data, insert, remove, logActivity } = useFstApp();
  const [form, setForm] = useState({ professional: '', specialty: '', appointment_date: '', appointment_time: '', location: '', modality: '', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const appointments = data.appointments || [];

  const save = async event => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!form.professional || !form.appointment_date) {
      setError('Escribe el profesional y la fecha de la cita.');
      return;
    }
    const result = await insert('appointments', form);
    if (result.error) setError(result.error);
    else {
      setMessage('Cita guardada correctamente.');
      setForm({ professional: '', specialty: '', appointment_date: '', appointment_time: '', location: '', modality: '', notes: '' });
      logActivity('appointment_created', 'appointments');
    }
  };

  const sorted = [...appointments].sort((a, b) => String(a.appointment_date).localeCompare(String(b.appointment_date)));
  const next = sorted.find(item => item.status === 'scheduled' && item.appointment_date >= today());

  return (
    <>
      <PageHeading eyebrow="Mis citas" title="Citas y consultas" description="Organiza tus controles con endocrinología, oncología, nutrición y más." />
      {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</div>}
      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Nueva cita" icon={CalendarDays}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Profesional"><input value={form.professional} onChange={e => setForm({ ...form, professional: e.target.value })} placeholder="Ej. Dra. endocrinóloga" /></Field>
              <Field label="Especialidad">
                <select value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}>
                  <option value="">Selecciona</option>
                  <option>Endocrinología</option>
                  <option>Oncología</option>
                  <option>Nutrición</option>
                  <option>Medicina general</option>
                  <option>Otra</option>
                </select>
              </Field>
              <Field label="Fecha"><input type="date" value={form.appointment_date} onChange={e => setForm({ ...form, appointment_date: e.target.value })} /></Field>
              <Field label="Hora"><input type="time" value={form.appointment_time} onChange={e => setForm({ ...form, appointment_time: e.target.value })} /></Field>
              <Field label="Ubicación"><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ej. Clínica, consultorio" /></Field>
              <Field label="Modalidad">
                <select value={form.modality} onChange={e => setForm({ ...form, modality: e.target.value })}>
                  <option value="">Selecciona</option>
                  <option>Presencial</option>
                  <option>Teleconsulta</option>
                  <option>Virtual</option>
                </select>
              </Field>
            </div>
            <Field label="Notas"><textarea rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Opcional" /></Field>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
              <Plus className="h-4 w-4" /> Guardar cita
            </button>
          </form>
        </Panel>

        <Panel title="Próxima cita" icon={Stethoscope}>
          {next ? (
            <div className="rounded-xl border border-[#d3efe9] bg-[#f0faf8] p-4">
              <p className="text-sm font-bold text-[#0A2540]">{next.professional}</p>
              <p className="text-xs text-slate-500">{next.specialty || 'Sin especialidad'} · {next.modality || 'Sin modalidad'}</p>
              <p className="mt-2 text-sm font-semibold text-[#0B8176]">{formatDate(next.appointment_date)} {next.appointment_time ? `· ${next.appointment_time}` : ''}</p>
              {next.location && <p className="mt-1 text-xs text-slate-500">{next.location}</p>}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title="No tienes citas próximas" text="Agrega tu próxima consulta para tenerla organizada." />
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Todas mis citas" icon={ClipboardList}>
          {sorted.length ? (
            <div className="space-y-2">
              {sorted.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#f0eaf5] p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A2540]">{item.professional}</p>
                    <p className="text-xs text-slate-500">{formatDate(item.appointment_date)} {item.appointment_time ? `· ${item.appointment_time}` : ''} · {item.specialty || 'Sin especialidad'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => { await remove('appointments', item.id); logActivity('appointment_deleted', 'appointments'); }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Eliminar cita"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title="No tienes citas registradas" text="Agrega tu primera cita." />
          )}
        </Panel>
      </div>
    </>
  );
}

export function TimelineSection() {
  const { data } = useFstApp();
  const events = useMemo(() => {
    const list = [];
    const thyroid = data.thyroidProfile;
    if (thyroid?.surgery_date) list.push({ date: thyroid.surgery_date, type: 'Procedimiento', title: thyroid.surgery_type || 'Cirugía tiroidea' });
    if (thyroid?.radioiodine_date) list.push({ date: thyroid.radioiodine_date, type: 'Procedimiento', title: 'Yodoterapia (radioyodo)' });
    (data.laboratoryResults || []).forEach(item => list.push({ date: item.test_date, type: 'Laboratorio', title: `${item.test_name}: ${item.value} ${item.unit || ''}` }));
    (data.appointments || []).forEach(item => list.push({ date: item.appointment_date, type: 'Consulta', title: `${item.professional}: ${item.specialty || 'consulta'}` }));
    (data.medications || []).forEach(item => list.push({ date: item.start_date, type: 'Medicamento', title: `${item.medication_name} ${item.dose ?? ''} ${item.dose_unit || ''}` }));
    (data.symptomLogs || []).forEach(item => list.push({ date: item.log_date, type: 'Síntoma', title: `Registro de síntomas (${item.intensity}/10)` }));
    (data.timeline || []).forEach(item => list.push({ date: item.event_date, type: item.event_type, title: item.title }));
    return list
      .filter(item => item.date)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [data]);

  const typeColor = {
    Procedimiento: 'bg-[#EAE2F8] text-[#6b4fa8]',
    Laboratorio: 'bg-[#d3efe9] text-[#0B8176]',
    Consulta: 'bg-[#f5dce8] text-[#b04a76]',
    Medicamento: 'bg-[#f7f3fb] text-[#9274C9]',
    Síntoma: 'bg-[#fdf4f8] text-[#b04a76]',
  };

  return (
    <>
      <PageHeading eyebrow="Mi historia tiroidea" title="Línea de tiempo" description="Tu historia se construye automáticamente con tus registros: cirugía, yodoterapia, medicamentos, laboratorios, consultas y síntomas." />
      {events.length ? (
        <div className="mt-6 space-y-0">
          {events.map((event, index) => (
            <div key={index} className="relative flex gap-4 pb-6">
              {index < events.length - 1 && <span className="absolute left-[9px] top-6 h-full w-px bg-[#eae2f8]" />}
              <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-white shadow ${typeColor[event.type] || 'bg-[#EAE2F8]'}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400">{formatDate(event.date)}</p>
                <p className="text-sm font-semibold text-[#0A2540]">{event.title}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColor[event.type] || 'bg-[#f6f7f8] text-slate-500'}`}>{event.type}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={History}
            title="Tu historia se construirá con tus registros"
            text="Agrega medicamentos, laboratorios, citas o tu perfil tiroideo y aparecerán aquí cronológicamente."
            action={<Link to="/fst-app/perfil" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Completar perfil tiroideo</Link>}
          />
        </div>
      )}
    </>
  );
}

export function HabitsSection() {
  const { data, insert, remove, logActivity } = useFstApp();
  const [name, setName] = useState('');
  const [habitType, setHabitType] = useState('Hidratación');
  const [message, setMessage] = useState('');

  const habits = data.habits || [];
  const habitLogs = data.habitLogs || [];

  const save = async event => {
    event.preventDefault();
    setMessage('');
    if (!name.trim()) return;
    const result = await insert('habits', { name: name.trim(), habit_type: habitType, target_frequency: 'Diaria' });
    if (result.error) setMessage(`Error: ${result.error}`);
    else {
      setMessage('Hábito creado correctamente.');
      setName('');
      logActivity('habit_created', 'habits');
    }
  };

  const toggleToday = async habit => {
    const existing = habitLogs.find(log => log.habit_id === habit.id && log.log_date === today());
    if (existing) {
      await remove('habit_logs', existing.id);
    } else {
      await insert('habit_logs', { habit_id: habit.id, log_date: today(), completed: true });
    }
    logActivity('habit_logged', 'habit_logs');
  };

  return (
    <>
      <PageHeading eyebrow="Mis hábitos" title="Hábitos y rutinas" description="Registra hábitos de hidratación, sueño, movimiento y más. Sin culpa: observar es el primer paso." />
      {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Nuevo hábito" icon={Activity}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre del hábito"><input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Tomar 8 vasos de agua" /></Field>
              <Field label="Tipo">
                <select value={habitType} onChange={e => setHabitType(e.target.value)}>
                  <option>Hidratación</option>
                  <option>Sueño</option>
                  <option>Movimiento</option>
                  <option>Alimentación</option>
                  <option>Bienestar</option>
                  <option>Otro</option>
                </select>
              </Field>
            </div>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
              <Plus className="h-4 w-4" /> Crear hábito
            </button>
          </form>
        </Panel>

        <Panel title="Hábitos de hoy" icon={Check}>
          {habits.length ? (
            <div className="space-y-2">
              {habits.map(habit => {
                const done = habitLogs.some(log => log.habit_id === habit.id && log.log_date === today());
                return (
                  <div key={habit.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#f0eaf5] p-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0A2540]">{habit.name}</p>
                      <p className="text-xs text-slate-500">{habit.habit_type} · {habit.target_frequency}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleToday(habit)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${done ? 'border-[#2CB1A1] bg-[#2CB1A1] text-white' : 'border-[#e5dceb] bg-white text-slate-400'}`}
                      aria-label={done ? `Desmarcar ${habit.name}` : `Marcar ${habit.name} como hecho`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Activity} title="Aún no tienes hábitos" text="Crea tu primer hábito para empezar a seguirlo." />
          )}
        </Panel>
      </div>
    </>
  );
}

export function QuestionsSection() {
  const { data, insert, update, remove, logActivity } = useFstApp();
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');

  const questions = data.questions || [];

  const save = async event => {
    event.preventDefault();
    setMessage('');
    if (!question.trim()) return;
    const result = await insert('questions_for_visit', { question: question.trim() });
    if (result.error) setMessage(`Error: ${result.error}`);
    else {
      setMessage('Pregunta guardada correctamente.');
      setQuestion('');
      logActivity('question_created', 'questions_for_visit');
    }
  };

  const toggleStatus = async item => {
    await update('questions_for_visit', item.id, { status: item.status === 'pending' ? 'answered' : 'pending' });
  };

  return (
    <>
      <PageHeading eyebrow="Preguntas para mi consulta" title="Tus preguntas organizadas" description="Escribe las preguntas que quieres llevar a tu próxima consulta y márcalas cuando las respondan." />
      {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Nueva pregunta" icon={Stethoscope}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Pregunta">
              <textarea rows="3" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ej. ¿Debo separar el calcio más tiempo de la levotiroxina?" />
            </Field>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
              <Plus className="h-4 w-4" /> Guardar pregunta
            </button>
          </form>
        </Panel>

        <Panel title="Mis preguntas" icon={ClipboardList}>
          {questions.length ? (
            <div className="space-y-2">
              {questions.map(item => (
                <div key={item.id} className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${item.status === 'answered' ? 'border-emerald-200 bg-emerald-50/50' : 'border-[#f0eaf5]'}`}>
                  <div className="min-w-0">
                    <p className={`text-sm leading-5 ${item.status === 'answered' ? 'text-slate-500 line-through' : 'text-[#0A2540]'}`}>{item.question}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === 'answered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.status === 'answered' ? 'Respondida' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => toggleStatus(item)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-[#f0faf8] hover:text-[#0B8176]" aria-label="Cambiar estado">
                      <Check className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={async () => { await remove('questions_for_visit', item.id); logActivity('question_deleted', 'questions_for_visit'); }} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar pregunta">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Stethoscope} title="No tienes preguntas guardadas" text="Escribe las preguntas que quieres llevar a tu consulta." />
          )}
        </Panel>
      </div>
    </>
  );
}

export function PrivacySection() {
  const { logout, updatePassword, requestAccountDeletion, exportMyData } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleExport = async () => {
    setMessage('');
    setError('');
    const result = await exportMyData();
    if (result.error) return setError(result.error);
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mis-datos-fst-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Descarga iniciada. Tus datos son solo tuyos.');
  };

  const handlePassword = async event => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (newPassword.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (newPassword !== confirmNewPassword) return setError('Las contraseñas no coinciden.');
    const result = await updatePassword(newPassword);
    if (result.error) setError(result.error);
    else {
      setMessage('Contraseña actualizada correctamente.');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const handleDelete = async () => {
    setMessage('');
    setError('');
    const result = await requestAccountDeletion();
    if (result.error) setError(result.error);
    else setMessage('Solicitud de eliminación registrada. El equipo revisará los plazos de retención aplicables.');
  };

  return (
    <>
      <PageHeading eyebrow="Configuración" title="Privacidad y cuenta" description="Controla tus datos: descárgalos, cambia tu contraseña o solicita la eliminación de tu cuenta." />
      {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</div>}
      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Mis datos" icon={Download}>
          <p className="text-sm leading-6 text-slate-600">Descarga una copia de toda la información que has registrado en tu espacio.</p>
          <button type="button" onClick={handleExport} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
            <Download className="h-4 w-4" /> Descargar mis datos
          </button>
        </Panel>

        <Panel title="Cambiar contraseña" icon={KeyRound}>
          <form onSubmit={handlePassword} className="space-y-4">
            <Field label="Nueva contraseña"><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" /></Field>
            <Field label="Confirmar contraseña"><input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Repite tu contraseña" /></Field>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2CB1A1] px-4 text-sm font-bold text-white hover:bg-[#27a08f]">
              <KeyRound className="h-4 w-4" /> Actualizar contraseña
            </button>
          </form>
        </Panel>

        <Panel title="Cerrar sesión" icon={LockKeyhole}>
          <p className="text-sm leading-6 text-slate-600">Cierra tu sesión en este dispositivo. Tus datos permanecen guardados.</p>
          <button type="button" onClick={logout} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#e5dceb] px-4 text-sm font-bold text-slate-600 hover:bg-[#faf8fd]">
            Cerrar sesión
          </button>
        </Panel>

        <Panel title="Eliminar mi cuenta" icon={UserRound}>
          <p className="text-sm leading-6 text-slate-600">Solicita la eliminación de tu cuenta y tus registros asociados. Esta solicitud será revisada según las reglas del producto.</p>
          {!confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-600 hover:bg-rose-50">
              Solicitar eliminación
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-bold text-rose-700">¿Estás segura?</p>
              <p className="mt-1 text-xs leading-5 text-rose-600">Esta acción solicita la eliminación de tu cuenta y tus datos. No se puede deshacer.</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={handleDelete} className="min-h-10 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700">Confirmar solicitud</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="min-h-10 rounded-xl border border-rose-200 px-4 text-xs font-bold text-rose-600">Cancelar</button>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
