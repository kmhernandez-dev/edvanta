import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, AlertCircle, ArrowRight, Beaker, CalendarDays, Check, CheckCircle2,
  ChevronRight, ClipboardCheck, Clock3, Download, FileHeart, FileText, FlaskConical,
  Goal, HeartPulse, History, Info, ListChecks, LockKeyhole, NotebookPen, Pill,
  Plus, RefreshCw, ShieldCheck, Stethoscope, Trash2, UserRound, UsersRound, X,
} from 'lucide-react';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { analyteOptions, symptomOptions } from '../../data/vida360Demo';
import { useAuth } from '../../context/AuthContext';
import { useVida360 } from '../../context/Vida360Context';
import {
  buildTimeline, completionPercent, downloadJson, downloadPatientPdf, uid,
} from '../../lib/vida360';

const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha';
const today = () => new Date().toISOString().slice(0, 10);

function PageHeading({ eyebrow, title, description, action }) {
  return <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B8176]">{eyebrow}</p><h1 className="mt-1 text-2xl font-semibold text-[#0A2540] sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}</div>{action}</header>;
}

function Panel({ title, description, icon: Icon, action, children, className = '' }) {
  return <section className={`rounded-lg border border-slate-200 bg-white ${className}`}><div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-5"><div className="flex min-w-0 items-start gap-3">{Icon && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#e8f7f4] text-[#0B8176]"><Icon className="h-5 w-5" /></span>}<div><h2 className="font-semibold text-[#0A2540]">{title}</h2>{description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}</div></div>{action}</div><div className="p-4 sm:p-5">{children}</div></section>;
}

function EmptyState({ icon: Icon = FileText, title, text, to, action = 'Registrar informacion' }) {
  return <div className="py-8 text-center"><Icon className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-bold text-[#0A2540]">{title}</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">{text}</p>{to && <Link to={to} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#2CB1A1] px-4 text-xs font-bold text-[#0A655D]">{action} <ArrowRight className="h-4 w-4" /></Link>}</div>;
}

const statusStyles = {
  stable: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  review: 'border-amber-200 bg-amber-50 text-amber-800',
  priority: 'border-rose-200 bg-rose-50 text-rose-800',
  insufficient: 'border-slate-200 bg-slate-50 text-slate-600',
};
const statusLabel = { stable: 'Estable', review: 'Necesita revision', priority: 'Prioridad alta', insufficient: 'Informacion insuficiente' };

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded border px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[status] || statusStyles.insufficient}`}>{statusLabel[status] || status}</span>;
}

function Field({ label, hint, children }) {
  return <label className="block text-sm font-bold text-[#0A2540]">{label}{hint && <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{hint}</span>}<span className="vida360-field mt-2 block">{children}</span></label>;
}

function SafetyNote({ children }) {
  return <div className="flex items-start gap-3 rounded-md border border-[#bce6e0] bg-[#f0faf8] p-4 text-sm leading-6 text-slate-600"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0B8176]" /><p>{children}</p></div>;
}

export function Vida360Dashboard() {
  const { state, map360, update } = useVida360();
  const completion = completionPercent(state);
  const nextTasks = state.tasks.filter(item => item.status !== 'completed').slice(0, 3);
  const nextAppointment = [...state.appointments].filter(item => item.status !== 'cancelled').sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
  const activeMedication = state.medications.find(item => item.status === 'active');
  const symptomChart = [...state.symptoms].slice(0, 8).reverse().map(item => ({ date: item.date?.slice(5), value: Number(item.intensity), name: item.name }));
  const [goalName, setGoalName] = useState('');

  const addGoal = event => {
    event.preventDefault();
    if (!goalName.trim()) return;
    update('goals', items => [{ id: uid('goal'), name: goalName.trim(), reason: '', targetDate: '', status: 'pending', progress: 0 }, ...items]);
    setGoalName('');
  };

  return <>
    <PageHeading eyebrow="Panel personal" title={`Hola, ${state.profile.firstName || 'bienvenida'}`} description="Estas son las acciones mas utiles segun la informacion que has organizado." action={<Link to="/vida-360/registrar" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0A2540] px-4 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Registrar</Link>} />

    <SafetyNote>Esta herramienta organiza la informacion que registras. No sustituye la evaluacion de un profesional de salud ni modifica tu tratamiento.</SafetyNote>

    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <Panel title="Perfil organizado" description={`${completion}% de la informacion esencial`} icon={UserRound}>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-[#2CB1A1]" style={{ width: `${completion}%` }} /></div>
        <Link to="/vida-360/perfil" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Revisar perfil <ChevronRight className="h-4 w-4" /></Link>
      </Panel>
      <Panel title="Proximo control" description={nextAppointment ? formatDate(nextAppointment.date) : 'Sin cita registrada'} icon={CalendarDays}>
        {nextAppointment ? <><p className="font-semibold text-[#0A2540]">{nextAppointment.professional}</p><p className="mt-1 text-sm text-slate-500">{nextAppointment.reason}</p></> : <p className="text-sm text-slate-500">Agrega tu proximo control para preparar preguntas.</p>}
        <Link to="/vida-360/consultas" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Preparar consulta <ChevronRight className="h-4 w-4" /></Link>
      </Panel>
      <Panel title="Proximo medicamento" description="Segun tu horario registrado" icon={Pill}>
        {activeMedication ? <><p className="font-semibold text-[#0A2540]">{activeMedication.name} · {activeMedication.dose}</p><p className="mt-1 text-sm text-slate-500">{activeMedication.time || 'Horario no registrado'} · {activeMedication.frequency}</p></> : <p className="text-sm text-slate-500">No hay medicamentos activos.</p>}
        <Link to="/vida-360/mi-salud" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Ver medicamentos <ChevronRight className="h-4 w-4" /></Link>
      </Panel>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
      <Panel title="Tus tres siguientes acciones" description="Prioriza poco y termina lo importante" icon={ListChecks}>
        {nextTasks.length ? <div className="divide-y divide-slate-100">{nextTasks.map(task => <label key={task.id} className="flex min-h-16 cursor-pointer items-center gap-3 py-3"><input type="checkbox" checked={task.status === 'completed'} onChange={() => update('tasks', items => items.map(item => item.id === task.id ? { ...item, status: 'completed' } : item))} className="h-5 w-5 accent-[#2B8178]" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#0A2540]">{task.title}</span><span className="block text-xs text-slate-500">{formatDate(task.dueDate)} · {task.priority === 'high' ? 'Prioridad alta' : 'Prioridad normal'}</span></span></label>)}</div> : <EmptyState icon={CheckCircle2} title="No tienes tareas pendientes" text="Crea una tarea vinculada a una meta o consulta." to="/vida-360/consultas" action="Crear tarea" />}
      </Panel>
      <Panel title="Mapa FST 360" description="Sin puntaje clinico unico" icon={Activity}>
        <div className="space-y-3">{map360.map(item => <div key={item.code} className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-700">{item.label}</p><StatusBadge status={item.status} /></div>)}</div>
        <Link to="/vida-360/mi-salud?tab=mapa" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Ver explicaciones <ChevronRight className="h-4 w-4" /></Link>
      </Panel>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Panel title="Tendencia de sintomas" description="Intensidad reportada, no una interpretacion clinica" icon={HeartPulse}>
        {symptomChart.length ? <div className="h-56 w-full" aria-label="Grafico de intensidad de sintomas"><ResponsiveContainer width="100%" height="100%"><LineChart data={symptomChart} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" fontSize={11} stroke="#64748b" /><YAxis domain={[0, 10]} fontSize={11} stroke="#64748b" /><Tooltip contentStyle={{ borderRadius: 6, borderColor: '#cbd5e1', fontSize: 12 }} /><Line type="monotone" dataKey="value" stroke="#2B8178" strokeWidth={2.5} dot={{ fill: '#2B8178', r: 3 }} /></LineChart></ResponsiveContainer></div> : <EmptyState title="Aun no hay una tendencia" text="Dos o mas registros permiten observar cambios por fecha." to="/vida-360/registrar" />}
      </Panel>
      <Panel title="Metas personales" description="Define lo que quieres lograr y por que" icon={Goal}>
        <form onSubmit={addGoal} className="flex gap-2"><input value={goalName} onChange={event => setGoalName(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm" placeholder="Ej. preparar mi consulta" aria-label="Nueva meta" /><button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0A2540] text-white" aria-label="Agregar meta"><Plus className="h-5 w-5" /></button></form>
        <div className="mt-4 space-y-3">{state.goals.slice(0, 3).map(goal => <div key={goal.id}><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[#0A2540]">{goal.name}</p><span className="text-xs font-bold text-[#0B8176]">{goal.progress || 0}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-[#2CB1A1]" style={{ width: `${goal.progress || 0}%` }} /></div></div>)}</div>
      </Panel>
    </div>
  </>;
}

const healthTabs = [
  ['historia', 'Historia tiroidea', FileHeart], ['medicamentos', 'Medicamentos', Pill],
  ['sintomas', 'Sintomas', HeartPulse], ['laboratorios', 'Laboratorios', FlaskConical],
  ['evaluacion', 'Evaluacion', ClipboardCheck], ['mapa', 'Mapa 360', Activity], ['linea', 'Linea de tiempo', History],
];

export function Vida360Health() {
  const { state, update, remove, map360 } = useVida360();
  const queryTab = new URLSearchParams(window.location.search).get('tab');
  const [tab, setTab] = useState(healthTabs.some(item => item[0] === queryTab) ? queryTab : 'historia');
  const timeline = useMemo(() => buildTimeline(state), [state]);
  const changeThyroid = (key, value) => update('thyroid', current => ({ ...current, [key]: value }));

  return <>
    <PageHeading eyebrow="Mi salud" title="Tu historia, en un solo lugar" description="Registra hechos y experiencias sin asumir una interpretacion clinica." />
    <div className="mb-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Secciones de Mi salud">{healthTabs.map(([id, label, Icon]) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-bold ${tab === id ? 'border-[#2CB1A1] bg-[#e8f7f4] text-[#0A655D]' : 'border-slate-200 bg-white text-slate-600'}`}><Icon className="h-4 w-4" /> {label}</button>)}</div>

    {tab === 'historia' && <Panel title="Perfil tiroideo" description="No se calcula riesgo oncologico ni se interpreta el informe" icon={FileHeart}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Diagnostico principal"><input value={state.thyroid.primaryDiagnosis} onChange={e => changeThyroid('primaryDiagnosis', e.target.value)} /></Field>
        <Field label="Fecha de diagnostico"><input type="date" value={state.thyroid.diagnosisDate} onChange={e => changeThyroid('diagnosisDate', e.target.value)} /></Field>
        <Field label="Tipo de cirugia"><select value={state.thyroid.surgeryType} onChange={e => changeThyroid('surgeryType', e.target.value)}><option value="">Selecciona</option><option>Tiroidectomia total</option><option>Tiroidectomia parcial</option><option>Sin cirugia</option><option>Otro procedimiento</option></select></Field>
        <Field label="Fecha de cirugia"><input type="date" value={state.thyroid.surgeryDate} onChange={e => changeThyroid('surgeryDate', e.target.value)} /></Field>
        <Field label="Institucion"><input value={state.thyroid.institution} onChange={e => changeThyroid('institution', e.target.value)} /></Field>
        <Field label="Motivo de cirugia"><input value={state.thyroid.surgeryReason} onChange={e => changeThyroid('surgeryReason', e.target.value)} /></Field>
        <Field label="Antecedente de cancer"><select value={state.thyroid.cancerHistory} onChange={e => changeThyroid('cancerHistory', e.target.value)}><option>No</option><option>Si</option><option>No estoy segura</option></select></Field>
        <Field label="Yodoterapia"><select value={state.thyroid.radioiodine} onChange={e => changeThyroid('radioiodine', e.target.value)}><option>No</option><option>Si</option><option>No estoy segura</option></select></Field>
        <Field label="Proximo control"><input type="date" value={state.thyroid.nextControl} onChange={e => changeThyroid('nextControl', e.target.value)} /></Field>
        <Field label="Hipocalcemia posquirurgica"><select value={state.thyroid.hypocalcemia} onChange={e => changeThyroid('hypocalcemia', e.target.value)}><option>No</option><option>Si</option><option>No estoy segura</option></select></Field>
        <Field label="Profesional tratante"><input value={state.thyroid.endocrinologist} onChange={e => changeThyroid('endocrinologist', e.target.value)} /></Field>
        <Field label="Diagnosticos secundarios"><input value={state.thyroid.secondaryDiagnoses} onChange={e => changeThyroid('secondaryDiagnoses', e.target.value)} /></Field>
        <div className="sm:col-span-2 lg:col-span-3"><Field label="Resumen histopatologico" hint="Transcribe solo lo que entiendas; conserva el documento original."><textarea rows="4" value={state.thyroid.pathology} onChange={e => changeThyroid('pathology', e.target.value)} /></Field></div>
      </div>
    </Panel>}

    {tab === 'medicamentos' && <Panel title="Medicamentos y suplementos" description="Lista reportada por ti; no es una prescripcion" icon={Pill} action={<Link to="/vida-360/registrar?tipo=medicamento" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#0A2540] px-3 text-xs font-bold text-white"><Plus className="h-4 w-4" /> Agregar</Link>}>
      {state.medications.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="pb-3">Producto</th><th>Dosis</th><th>Horario</th><th>Esquema</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody className="divide-y divide-slate-100">{state.medications.map(item => <tr key={item.id}><td className="py-4"><p className="font-semibold text-[#0A2540]">{item.name}</p><p className="text-xs text-slate-500">{item.type} · {item.ingredient}</p></td><td>{item.dose || '-'}</td><td>{item.time || '-'}</td><td className="max-w-[230px] text-xs text-slate-600">{item.schedule || item.frequency}</td><td><span className="text-xs font-semibold text-[#0B8176]">{item.status === 'active' ? 'Activo' : 'Suspendido'}</span></td><td><button type="button" onClick={() => remove('medications', item.id)} className="flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-700" aria-label={`Eliminar ${item.name}`}><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div> : <EmptyState icon={Pill} title="No hay productos registrados" text="Agrega medicamentos, vitaminas, minerales o suplementos que uses." to="/vida-360/registrar" />}
    </Panel>}

    {tab === 'sintomas' && <Panel title="Diario de sintomas" description="Observa frecuencia e impacto sin atribuir automaticamente una causa" icon={HeartPulse} action={<Link to="/vida-360/registrar?tipo=sintoma" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#0A2540] px-3 text-xs font-bold text-white"><Plus className="h-4 w-4" /> Registrar</Link>}>
      {state.symptoms.length ? <div className="grid gap-3 md:grid-cols-2">{state.symptoms.map(item => <article key={item.id} className="rounded-md border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#0A2540]">{item.name}</h3><p className="mt-1 text-xs text-slate-500">{formatDate(item.date)} · impacto: {item.impact || 'no registrado'}</p></div><span className="rounded border border-slate-200 px-2 py-1 text-xs font-bold">{item.intensity}/10</span></div>{item.notes && <p className="mt-3 text-sm leading-6 text-slate-600">{item.notes}</p>}</article>)}</div> : <EmptyState title="No hay sintomas registrados" text="Registra solo los que te ayuden a observar cambios o preparar una consulta." to="/vida-360/registrar" />}
    </Panel>}

    {tab === 'laboratorios' && <Panel title="Laboratorios" description="El rango del laboratorio no sustituye tu meta clinica individual" icon={FlaskConical} action={<Link to="/vida-360/registrar?tipo=laboratorio" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#0A2540] px-3 text-xs font-bold text-white"><Plus className="h-4 w-4" /> Agregar</Link>}>
      {state.labs.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="pb-3">Analito</th><th>Resultado</th><th>Rango registrado</th><th>Fecha</th><th>Laboratorio</th></tr></thead><tbody className="divide-y divide-slate-100">{state.labs.map(item => { const numeric = Number(item.value); const outside = Number.isFinite(numeric) && ((item.low && numeric < Number(item.low)) || (item.high && numeric > Number(item.high))); return <tr key={item.id}><td className="py-4 font-semibold text-[#0A2540]">{item.analyte}</td><td><p className="font-semibold">{item.value} {item.unit}</p>{outside && <p className="mt-1 text-[11px] text-amber-700">Fuera del rango registrado por el laboratorio.</p>}</td><td>{item.low || '-'} a {item.high || '-'}</td><td>{formatDate(item.date)}</td><td>{item.laboratory || '-'}</td></tr>; })}</tbody></table></div> : <EmptyState icon={Beaker} title="No hay resultados registrados" text="Puedes registrar el valor y el rango exactamente como aparecen en el informe." to="/vida-360/registrar" />}
    </Panel>}

    {tab === 'evaluacion' && <Panel title="Evaluacion biopsicosocial" description="No diagnostica condiciones de salud mental ni calcula un puntaje clinico" icon={ClipboardCheck}>
      <div className="grid gap-5 sm:grid-cols-2">{[
        ['biological', 'Dimension biologica', 'Sintomas, medicamentos, cambios y controles.'],
        ['psychological', 'Experiencia emocional', 'Preocupacion, carga y confianza para hacer preguntas.'],
        ['social', 'Acceso y entorno social', 'Apoyo, costos, transporte, autorizaciones y acceso.'],
        ['functional', 'Funcionamiento cotidiano', 'Energia, sueno, trabajo, estudio y autocuidado.'],
      ].map(([key, label, hint]) => <Field key={key} label={label} hint={hint}><select value={state.assessment[key]} onChange={e => update('assessment', current => ({ ...current, [key]: e.target.value, updatedAt: new Date().toISOString() }))}><option value="">Prefiero no responder por ahora</option><option value="stable">No identifico una dificultad prioritaria</option><option value="review">Quiero revisar este tema</option><option value="priority">Necesito organizar apoyo pronto</option></select></Field>)}</div>
    </Panel>}

    {tab === 'mapa' && <div className="space-y-4"><SafetyNote>El Mapa FST 360 no es un puntaje clinico. Cada estado muestra el dato que lo origino y una accion organizativa.</SafetyNote>{map360.map(item => <Panel key={item.code} title={item.label} icon={Activity} action={<StatusBadge status={item.status} />}><div className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs font-bold uppercase text-slate-500">Motivo visible</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.reason}</p></div><div><p className="text-xs font-bold uppercase text-slate-500">Siguiente paso</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.next}</p></div><div><p className="text-xs font-bold uppercase text-slate-500">Dato pendiente</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.missing.length ? item.missing.join(', ') : 'No hay un dato esencial pendiente para esta regla.'}</p></div></div></Panel>)}</div>}

    {tab === 'linea' && <Panel title="Linea de tiempo tiroidea" description="Eventos ordenados por fecha y procedencia" icon={History}>{timeline.length ? <ol className="relative ml-3 border-l border-[#8dd8ce]">{timeline.map((item, index) => <li key={`${item.type}-${item.date}-${index}`} className="relative ml-6 pb-6"><span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#2B8178] ring-1 ring-[#8dd8ce]" /><p className="text-xs font-bold uppercase text-[#0B8176]">{item.type} · {formatDate(item.date)}</p><p className="mt-1 text-sm font-semibold text-[#0A2540]">{item.title}</p></li>)}</ol> : <EmptyState icon={History} title="La linea de tiempo esta vacia" text="Los eventos apareceran cuando agregues historia, resultados, sintomas o consultas." />}</Panel>}
  </>;
}

const registerKinds = [
  ['medicamento', 'Medicamento', Pill], ['adherencia', 'Dosis', Clock3],
  ['sintoma', 'Sintoma', HeartPulse], ['laboratorio', 'Laboratorio', FlaskConical],
];

export function Vida360Register() {
  const { state, add } = useVida360();
  const queryKind = new URLSearchParams(window.location.search).get('tipo');
  const [kind, setKind] = useState(registerKinds.some(item => item[0] === queryKind) ? queryKind : 'medicamento');
  const [notice, setNotice] = useState('');
  const [med, setMed] = useState({ name: '', ingredient: '', type: 'Medicamento', dose: '', frequency: '', time: '', brand: '', indication: '', schedule: '' });
  const [adherence, setAdherence] = useState({ medicationId: state.medications[0]?.id || '', date: today(), status: 'Tomada', reason: '', notes: '' });
  const [symptom, setSymptom] = useState({ name: 'Fatiga', date: today(), intensity: 5, impact: '', trigger: '', notes: '' });
  const [lab, setLab] = useState({ analyte: 'TSH', value: '', unit: '', low: '', high: '', date: today(), laboratory: '', notes: '' });

  const done = message => { setNotice(message); window.setTimeout(() => setNotice(''), 3500); };
  const submitMed = event => { event.preventDefault(); if (!med.name.trim()) return; add('medications', { id: uid('med'), ...med, status: 'active' }); setMed({ name: '', ingredient: '', type: 'Medicamento', dose: '', frequency: '', time: '', brand: '', indication: '', schedule: '' }); done('Producto agregado a tu lista.'); };
  const submitAdherence = event => { event.preventDefault(); if (!adherence.medicationId) return; add('adherence', { id: uid('adh'), ...adherence }); done('Registro de dosis guardado.'); };
  const submitSymptom = event => { event.preventDefault(); add('symptoms', { id: uid('sym'), ...symptom, intensity: Number(symptom.intensity) }); done('Sintoma agregado al diario.'); };
  const submitLab = event => { event.preventDefault(); if (!lab.value) return; add('labs', { id: uid('lab'), ...lab }); done('Resultado agregado a la linea de tiempo.'); };
  const closeSchedules = useMemo(() => { const levo = state.medications.find(item => /levotiroxina/i.test(item.name)); if (!levo?.time) return []; return state.medications.filter(item => item.id !== levo.id && /calcio|hierro|magnesio|antiacido/i.test(`${item.name} ${item.ingredient}`) && item.time && Math.abs(Number(item.time.slice(0, 2)) * 60 + Number(item.time.slice(3)) - (Number(levo.time.slice(0, 2)) * 60 + Number(levo.time.slice(3)))) < 240); }, [state.medications]);

  return <>
    <PageHeading eyebrow="Registro rapido" title="¿Que quieres registrar?" description="Guarda solo la informacion que te ayude a organizar, observar una tendencia o preparar una consulta." />
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="flex gap-2 overflow-x-auto lg:flex-col" role="tablist">{registerKinds.map(([id, label, Icon]) => <button key={id} type="button" onClick={() => setKind(id)} className={`flex min-h-12 min-w-[150px] items-center gap-3 rounded-md border px-4 text-sm font-bold lg:min-w-0 ${kind === id ? 'border-[#2CB1A1] bg-[#e8f7f4] text-[#0A655D]' : 'border-slate-200 bg-white text-slate-600'}`}><Icon className="h-5 w-5" /> {label}</button>)}</div>
      <div>
        {notice && <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800" role="status"><CheckCircle2 className="h-5 w-5" /> {notice}</div>}
        {kind === 'medicamento' && <Panel title="Agregar medicamento o suplemento" description="No modifica ni valida una prescripcion" icon={Pill}><form onSubmit={submitMed} className="grid gap-5 sm:grid-cols-2"><Field label="Nombre"><input required value={med.name} onChange={e => setMed({ ...med, name: e.target.value })} placeholder="Ej. Levotiroxina" /></Field><Field label="Principio activo"><input value={med.ingredient} onChange={e => setMed({ ...med, ingredient: e.target.value })} /></Field><Field label="Tipo"><select value={med.type} onChange={e => setMed({ ...med, type: e.target.value })}><option>Medicamento</option><option>Suplemento</option><option>Vitamina</option><option>Mineral</option><option>Producto natural</option><option>Otro</option></select></Field><Field label="Dosis y unidad"><input value={med.dose} onChange={e => setMed({ ...med, dose: e.target.value })} placeholder="Ej. 100 mcg" /></Field><Field label="Frecuencia"><input value={med.frequency} onChange={e => setMed({ ...med, frequency: e.target.value })} placeholder="Ej. una vez al dia" /></Field><Field label="Hora prevista"><input type="time" value={med.time} onChange={e => setMed({ ...med, time: e.target.value })} /></Field><Field label="Marca o fabricante"><input value={med.brand} onChange={e => setMed({ ...med, brand: e.target.value })} /></Field><Field label="Indicacion reportada"><input value={med.indication} onChange={e => setMed({ ...med, indication: e.target.value })} /></Field><div className="sm:col-span-2"><Field label="Esquema semanal" hint="Para dosis variables, escribe el esquema exactamente como te lo indicaron."><textarea rows="3" value={med.schedule} onChange={e => setMed({ ...med, schedule: e.target.value })} placeholder="Ej. lunes a sabado 100 mcg; domingo 50 mcg" /></Field></div><button className="min-h-12 rounded-md bg-[#0A2540] px-5 text-sm font-bold text-white sm:col-span-2">Guardar producto</button></form></Panel>}
        {kind === 'adherencia' && <Panel title="Registrar una dosis" description="Usamos lenguaje neutral para comprender barreras" icon={Clock3}><form onSubmit={submitAdherence} className="grid gap-5 sm:grid-cols-2"><Field label="Medicamento"><select required value={adherence.medicationId} onChange={e => setAdherence({ ...adherence, medicationId: e.target.value })}><option value="">Selecciona</option>{state.medications.map(item => <option key={item.id} value={item.id}>{item.name} · {item.dose}</option>)}</select></Field><Field label="Fecha"><input type="date" value={adherence.date} onChange={e => setAdherence({ ...adherence, date: e.target.value })} /></Field><Field label="Estado"><select value={adherence.status} onChange={e => setAdherence({ ...adherence, status: e.target.value })}><option>Tomada</option><option>Omitida</option><option>Retrasada</option><option>Tomada en condiciones diferentes</option><option>No recuerda</option><option>No disponible</option></select></Field><Field label="Motivo"><select value={adherence.reason} onChange={e => setAdherence({ ...adherence, reason: e.target.value })}><option value="">No aplica / prefiero no responder</option><option>Olvido</option><option>Cambio de rutina</option><option>Viaje</option><option>Se quedo sin medicamento</option><option>No disponible / entrega pendiente</option><option>Dificultad para tragar</option><option>Presento sintomas</option><option>Otro</option></select></Field><div className="sm:col-span-2"><Field label="Nota opcional"><textarea rows="3" value={adherence.notes} onChange={e => setAdherence({ ...adherence, notes: e.target.value })} /></Field></div><button className="min-h-12 rounded-md bg-[#0A2540] px-5 text-sm font-bold text-white sm:col-span-2">Guardar registro</button></form></Panel>}
        {kind === 'sintoma' && <Panel title="Agregar al diario de sintomas" description="El registro no atribuye el sintoma a la tiroides o a un medicamento" icon={HeartPulse}><form onSubmit={submitSymptom} className="grid gap-5 sm:grid-cols-2"><Field label="Sintoma"><select value={symptom.name} onChange={e => setSymptom({ ...symptom, name: e.target.value })}>{symptomOptions.map(item => <option key={item}>{item}</option>)}</select></Field><Field label="Fecha"><input type="date" value={symptom.date} onChange={e => setSymptom({ ...symptom, date: e.target.value })} /></Field><Field label={`Intensidad: ${symptom.intensity}/10`}><input type="range" min="0" max="10" value={symptom.intensity} onChange={e => setSymptom({ ...symptom, intensity: e.target.value })} /></Field><Field label="Impacto en tu dia"><input value={symptom.impact} onChange={e => setSymptom({ ...symptom, impact: e.target.value })} /></Field><Field label="Desencadenante percibido"><input value={symptom.trigger} onChange={e => setSymptom({ ...symptom, trigger: e.target.value })} placeholder="No estoy segura / sueno / alimentacion..." /></Field><Field label="Comentario"><input value={symptom.notes} onChange={e => setSymptom({ ...symptom, notes: e.target.value })} /></Field><button className="min-h-12 rounded-md bg-[#0A2540] px-5 text-sm font-bold text-white sm:col-span-2">Guardar sintoma</button></form></Panel>}
        {kind === 'laboratorio' && <Panel title="Agregar resultado de laboratorio" description="Copia valor, unidad y rango exactamente como aparecen" icon={FlaskConical}><form onSubmit={submitLab} className="grid gap-5 sm:grid-cols-2"><Field label="Analito"><select value={lab.analyte} onChange={e => setLab({ ...lab, analyte: e.target.value })}>{analyteOptions.map(item => <option key={item}>{item}</option>)}</select></Field><Field label="Fecha"><input type="date" value={lab.date} onChange={e => setLab({ ...lab, date: e.target.value })} /></Field><Field label="Resultado"><input required value={lab.value} onChange={e => setLab({ ...lab, value: e.target.value })} /></Field><Field label="Unidad"><input value={lab.unit} onChange={e => setLab({ ...lab, unit: e.target.value })} /></Field><Field label="Rango inferior"><input value={lab.low} onChange={e => setLab({ ...lab, low: e.target.value })} /></Field><Field label="Rango superior"><input value={lab.high} onChange={e => setLab({ ...lab, high: e.target.value })} /></Field><Field label="Laboratorio"><input value={lab.laboratory} onChange={e => setLab({ ...lab, laboratory: e.target.value })} /></Field><Field label="Observacion"><input value={lab.notes} onChange={e => setLab({ ...lab, notes: e.target.value })} /></Field><button className="min-h-12 rounded-md bg-[#0A2540] px-5 text-sm font-bold text-white sm:col-span-2">Guardar resultado</button></form></Panel>}
        {closeSchedules.length > 0 && <div className="mt-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p>Registraste levotiroxina y {closeSchedules.map(item => item.name).join(', ')} en horarios cercanos. Revisa esta informacion con tu quimico farmaceutico o profesional tratante.</p></div>}
      </div>
    </div>
  </>;
}

export function Vida360Consultations() {
  const { state, update, add } = useVida360();
  const [appointment, setAppointment] = useState({ professional: 'Endocrinologia', reason: '', date: '', time: '', location: '', status: 'scheduled' });
  const [generating, setGenerating] = useState('');
  const change = (key, value) => update('consultation', current => ({ ...current, [key]: value }));
  const makePdf = async kind => { setGenerating(kind); try { await downloadPatientPdf(state, kind); } finally { setGenerating(''); } };
  const submitAppointment = event => { event.preventDefault(); if (!appointment.date) return; add('appointments', { id: uid('apt'), ...appointment }); setAppointment({ professional: 'Endocrinologia', reason: '', date: '', time: '', location: '', status: 'scheduled' }); };

  return <>
    <PageHeading eyebrow="Consultas" title="Llega con tu informacion y tus preguntas" description="Edita el resumen antes de descargarlo. Tu profesional conserva el criterio clinico." />
    <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
      <Panel title="Preparador de consulta" description="Resumen editable paso a paso" icon={Stethoscope}>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Profesional"><select value={state.consultation.professional} onChange={e => change('professional', e.target.value)}><option value="">Selecciona</option><option>Endocrinologia</option><option>Medicina general</option><option>Oncologia</option><option>Quimica farmaceutica</option><option>Nutricion</option><option>Otro profesional</option></select></Field><Field label="Motivo"><input value={state.consultation.reason} onChange={e => change('reason', e.target.value)} /></Field><div className="sm:col-span-2"><Field label="¿Que cambio desde el ultimo control?"><textarea rows="3" value={state.consultation.changes} onChange={e => change('changes', e.target.value)} /></Field></div><div className="sm:col-span-2"><Field label="Sintomas, barreras o decisiones prioritarias"><textarea rows="3" value={state.consultation.priorities} onChange={e => change('priorities', e.target.value)} /></Field></div><div className="sm:col-span-2"><Field label="Preguntas que no quieres olvidar" hint="Una pregunta por linea."><textarea rows="5" value={state.consultation.questions} onChange={e => change('questions', e.target.value)} /></Field></div></div>
        <button type="button" onClick={() => makePdf('consultation')} disabled={Boolean(generating)} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#0A2540] px-5 text-sm font-bold text-white disabled:opacity-50"><Download className="h-4 w-4" /> {generating === 'consultation' ? 'Generando...' : 'Descargar resumen PDF'}</button>
      </Panel>
      <div className="space-y-4">
        <Panel title="Pasaporte tiroideo" description="Selecciona solo la informacion necesaria" icon={FileHeart}>
          <div className="space-y-3 text-sm text-slate-600">{['Datos basicos', 'Diagnostico y cirugia', 'Medicamentos activos', 'Proximo control'].map(item => <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#0B8176]" /> {item}</p>)}</div>
          <button type="button" onClick={() => makePdf('passport')} disabled={Boolean(generating)} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#2CB1A1] text-sm font-bold text-[#0A655D] disabled:opacity-50"><Download className="h-4 w-4" /> {generating === 'passport' ? 'Generando...' : 'Descargar pasaporte PDF'}</button>
        </Panel>
        <SafetyNote>Revisa siempre el documento antes de compartirlo. Incluye solo la informacion necesaria para esa atencion.</SafetyNote>
      </div>
    </div>
    <Panel title="Proximas consultas" description="Organiza fecha, motivo y lugar" icon={CalendarDays} className="mt-4">
      <form onSubmit={submitAppointment} className="grid gap-4 md:grid-cols-5"><Field label="Profesional"><input value={appointment.professional} onChange={e => setAppointment({ ...appointment, professional: e.target.value })} /></Field><Field label="Motivo"><input value={appointment.reason} onChange={e => setAppointment({ ...appointment, reason: e.target.value })} /></Field><Field label="Fecha"><input type="date" required value={appointment.date} onChange={e => setAppointment({ ...appointment, date: e.target.value })} /></Field><Field label="Hora"><input type="time" value={appointment.time} onChange={e => setAppointment({ ...appointment, time: e.target.value })} /></Field><button className="mt-auto min-h-11 rounded-md bg-[#2B8178] px-4 text-sm font-bold text-white">Agregar consulta</button></form>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{state.appointments.map(item => <article key={item.id} className="rounded-md border border-slate-200 p-4"><p className="text-xs font-bold uppercase text-[#0B8176]">{formatDate(item.date)} · {item.time || 'Sin hora'}</p><h3 className="mt-2 font-semibold text-[#0A2540]">{item.professional}</h3><p className="mt-1 text-sm text-slate-500">{item.reason || 'Sin motivo registrado'}</p></article>)}</div>
    </Panel>
    <Panel title="Archivos" description="Carga real deshabilitada hasta contar con almacenamiento privado, URLs firmadas y escaneo" icon={FileText} className="mt-4"><div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><LockKeyhole className="mx-auto h-7 w-7 text-slate-400" /><p className="mt-2 text-sm font-semibold text-[#0A2540]">Proteccion de archivos en preparacion</p><p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-slate-500">No cargues resultados, formulas o epicrisis reales en esta version. El modulo se activara cuando el almacenamiento privado y el registro de acceso hayan sido validados.</p></div></Panel>
  </>;
}

export function Vida360Profile() {
  const { state, update, isDemo } = useVida360();
  const { api } = useAuth();
  const [message, setMessage] = useState('');
  const changeProfile = (key, value) => update('profile', current => ({ ...current, [key]: value }));
  const toggleConsent = (code, accepted) => update('consents', items => items.map(item => item.code === code ? { ...item, accepted, updatedAt: new Date().toISOString(), revokedAt: accepted ? null : new Date().toISOString() } : item));
  const exportData = () => downloadJson(`fst-vida360-${new Date().toISOString().slice(0, 10)}.json`, { exportedAt: new Date().toISOString(), mode: isDemo ? 'demo' : 'authenticated', state });
  const deactivate = async () => {
    if (!window.confirm('¿Deseas registrar una solicitud de cierre? Esta accion no elimina datos inmediatamente.')) return;
    if (isDemo) setMessage('Solicitud simulada en modo demo. No se envio informacion.');
    else { try { const response = await api('/api/vida360/deactivate', { method: 'POST' }); setMessage(response.message); } catch (error) { setMessage(error.message); } }
  };

  return <>
    <PageHeading eyebrow="Perfil y privacidad" title="Tu informacion, bajo tu control" description="Revisa que datos has registrado, tus autorizaciones y la actividad reciente." />
    {message && <div className="mb-4 rounded-md border border-[#bce6e0] bg-[#f0faf8] p-4 text-sm text-[#0A655D]" role="status">{message}</div>}
    <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
      <Panel title="Perfil personal" description="No solicitamos documento de identidad en este MVP" icon={UserRound}>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Nombre"><input value={state.profile.firstName} onChange={e => changeProfile('firstName', e.target.value)} /></Field><Field label="Apellido"><input value={state.profile.lastName} onChange={e => changeProfile('lastName', e.target.value)} /></Field><Field label="Pais"><input value={state.profile.country} onChange={e => changeProfile('country', e.target.value)} /></Field><Field label="Ciudad"><input value={state.profile.city} onChange={e => changeProfile('city', e.target.value)} /></Field><Field label="Telefono"><input type="tel" value={state.profile.phone} onChange={e => changeProfile('phone', e.target.value)} /></Field><Field label="Ocupacion"><input value={state.profile.occupation} onChange={e => changeProfile('occupation', e.target.value)} /></Field><Field label="EPS o asegurador"><input value={state.profile.insurer} onChange={e => changeProfile('insurer', e.target.value)} /></Field><Field label="Persona de apoyo"><input value={state.profile.supportPerson} onChange={e => changeProfile('supportPerson', e.target.value)} /></Field><div className="sm:col-span-2"><Field label="Contacto de emergencia"><input value={state.profile.emergencyContact} onChange={e => changeProfile('emergencyContact', e.target.value)} /></Field></div></div>
      </Panel>
      <Panel title="Centro de privacidad" description="Texto demostrativo pendiente de revision legal" icon={ShieldCheck}>
        <div className="space-y-3">{state.consents.map(item => <div key={item.code} className="rounded-md border border-slate-200 p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#0A2540]">{item.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p><p className="mt-2 text-[10px] uppercase text-slate-400">Version {item.version} · {item.required ? 'Esencial' : 'Opcional'}</p></div><label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" className="peer sr-only" checked={item.accepted} disabled={item.required} onChange={e => toggleConsent(item.code, e.target.checked)} /><span className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-[#2B8178] peer-checked:after:translate-x-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-60" /></label></div></div>)}</div>
      </Panel>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Panel title="Tus datos" description="Descarga una copia legible por maquina" icon={Download}><button type="button" onClick={exportData} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#0A2540] px-4 text-sm font-bold text-white"><Download className="h-4 w-4" /> Exportar mis datos</button><button type="button" onClick={deactivate} className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-md border border-red-200 px-4 text-sm font-bold text-red-700 hover:bg-red-50">Solicitar cierre</button><p className="mt-4 text-xs leading-5 text-slate-500">La solicitud de cierre requiere revisar las obligaciones de retencion aplicables. No se promete eliminacion inmediata.</p></Panel>
      <Panel title="Actividad reciente" description="Lecturas y cambios relevantes" icon={History}><div className="space-y-3">{state.activity.slice(0, 6).map(item => <div key={item.id} className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#2CB1A1]" /><div><p className="text-sm font-semibold text-[#0A2540]">{item.action}</p><p className="text-xs text-slate-500">{new Date(item.at).toLocaleString('es-CO')}</p></div></div>)}</div></Panel>
    </div>
  </>;
}

