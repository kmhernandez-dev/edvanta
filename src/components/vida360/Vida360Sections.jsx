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
  const { academiaApi: api } = useAuth();
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

export function Vida360Tools() {
  const { state } = useVida360();
  const [activeTool, setActiveTool] = useState(null);
  const [calcValues, setCalcValues] = useState({});
  const [calcResult, setCalcResult] = useState(null);
  const [calcErrors, setCalcErrors] = useState({});

  const patientTools = [
    { id: 'sintomas-tracker', name: 'Diario de síntomas', icon: Activity, description: 'Registra tus síntomas diarios, intensidad y factores desencadenantes para identificar patrones.', category: 'Seguimiento' },
    { id: 'medicacion-recordatorio', name: 'Organizador de medicación', icon: Pill, description: 'Visualiza tus horarios de medicación, suplementos y separaciones necesarias (ej. levotiroxina vs calcio).', category: 'Medicación' },
    { id: 'consulta-preparacion', name: 'Preparación para consulta', icon: NotebookPen, description: 'Organiza tus preguntas, síntomas recientes y resultados antes de tu cita médica.', category: 'Consultas' },
    { id: 'alimentos-tiroides', name: 'Guía de alimentos y tiroides', icon: FlaskConical, description: 'Conoce qué alimentos y suplementos interactúan con tu medicación tiroidea y cómo organizar tus horarios.', category: 'Nutrición' },
    { id: 'pasaporte-tiroideo', name: 'Pasaporte tiroideo', icon: FileHeart, description: 'Genera un documento portable con tu historia tiroidea, dosis actual y últimos laboratorios.', category: 'Documentos' },
    { id: 'calculadora-imc', name: 'Calculadora de IMC', icon: Beaker, description: 'Calcula tu índice de masa corporal y conoce su clasificación.', category: 'Calculadoras' },
    { id: 'calculadora-peso-ideal', name: 'Peso ideal y ajustado', icon: Beaker, description: 'Calcula tu peso ideal según tu altura y tu peso ajustado si tienes sobrepeso.', category: 'Calculadoras' },
    { id: 'calculadora-superficie', name: 'Superficie corporal', icon: Beaker, description: 'Calcula tu superficie corporal (fórmula de Mosteller).', category: 'Calculadoras' },
    { id: 'gad7', name: 'Tamizaje de ansiedad (GAD-7)', icon: HeartPulse, description: 'Cuestionario de 7 preguntas para evaluar tu nivel de ansiedad. Resultado orientativo, no diagnóstico.', category: 'Bienestar' },
    { id: 'phq9', name: 'Tamizaje de estado de ánimo (PHQ-9)', icon: HeartPulse, description: 'Cuestionario de 9 preguntas sobre cómo te has sentido. Resultado orientativo, no diagnóstico.', category: 'Bienestar' },
  ];

  const calculators = {
    'calculadora-imc': {
      name: 'Índice de Masa Corporal (IMC)', formula: 'IMC = Peso (kg) / [Altura (m)]²',
      fields: [
        { key: 'weight', label: 'Peso (kg)', type: 'number', min: 30, max: 300, unit: 'kg' },
        { key: 'height', label: 'Altura (cm)', type: 'number', min: 100, max: 250, unit: 'cm' },
      ],
      calculate: (v) => { const h = Number(v.height) / 100; return Math.round((Number(v.weight) / (h * h)) * 10) / 10; },
      unit: 'kg/m²',
      interpret: (r) => { if (r < 18.5) return { text: 'Peso bajo', color: 'text-amber-600' }; if (r < 25) return { text: 'Peso normal', color: 'text-teal-600' }; if (r < 30) return { text: 'Sobrepeso', color: 'text-amber-600' }; if (r < 35) return { text: 'Obesidad grado I', color: 'text-red-600' }; if (r < 40) return { text: 'Obesidad grado II', color: 'text-red-600' }; return { text: 'Obesidad grado III', color: 'text-red-600' }; },
      warning: 'El IMC no distingue entre masa muscular y grasa. No es un indicador completo de salud.',
    },
    'calculadora-peso-ideal': {
      name: 'Peso ideal y peso ajustado', formula: 'PI = 50 + 2.3 × (altura pulg - 60) [hombres] | 45.5 + 2.3 × (altura pulg - 60) [mujeres]',
      fields: [
        { key: 'height', label: 'Altura (cm)', type: 'number', min: 100, max: 250, unit: 'cm' },
        { key: 'weight', label: 'Peso real (kg)', type: 'number', min: 30, max: 300, unit: 'kg' },
        { key: 'sex', label: 'Sexo', type: 'select', options: [{ value: 'female', label: 'Femenino' }, { value: 'male', label: 'Masculino' }] },
      ],
      calculate: (v) => { const inches = Number(v.height) / 2.54; const base = v.sex === 'female' ? 45.5 : 50; const ideal = base + 2.3 * (inches - 60); const adjusted = ideal + 0.4 * (Number(v.weight) - ideal); return { ideal: Math.round(ideal * 10) / 10, adjusted: Math.round(adjusted * 10) / 10 }; },
      unit: 'kg',
      interpret: (r) => `Peso ideal: ${r.ideal} kg · Peso ajustado: ${r.adjusted} kg (si peso real > 120% del ideal)`,
      warning: 'Fórmula de Devine. El peso ajustado se usa cuando el peso real supera el 120% del ideal.',
    },
    'calculadora-superficie': {
      name: 'Superficie corporal (Mosteller)', formula: 'SC (m²) = √[(altura cm × peso kg) / 3600]',
      fields: [
        { key: 'weight', label: 'Peso (kg)', type: 'number', min: 1, max: 300, unit: 'kg' },
        { key: 'height', label: 'Altura (cm)', type: 'number', min: 30, max: 250, unit: 'cm' },
      ],
      calculate: (v) => Math.round(Math.sqrt((Number(v.weight) * Number(v.height)) / 3600) * 100) / 100,
      unit: 'm²',
      interpret: (r) => r < 1.5 ? 'Superficie corporal baja.' : r <= 2.0 ? 'Dentro del rango promedio adulto.' : 'Superficie corporal elevada.',
      warning: 'La fórmula de Mosteller es una estimación. No usar como único criterio para decisiones médicas.',
    },
    'gad7': {
      name: 'Tamizaje de ansiedad (GAD-7)', formula: 'Suma de 7 preguntas (0-3 puntos cada una). Rango: 0-21.',
      fields: [
        { key: 'q1', label: '¿Te has sentido nervioso/a, ansioso/a o con los nervios de punta?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q2', label: '¿No has podido dejar de preocuparte?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q3', label: '¿Te has preocupado demasiado por diferentes cosas?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q4', label: '¿Has tenido dificultad para relajarte?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q5', label: '¿Te has sentido inquieto/a sin poder quedarte quieto/a?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q6', label: '¿Te has irritado o enfadado con facilidad?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q7', label: '¿Has sentido miedo como si algo terrible pudiera pasar?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
      ],
      calculate: (v) => Object.values(v).reduce((s, val) => s + Number(val || 0), 0),
      unit: 'puntos',
      interpret: (r) => { if (r <= 4) return { text: 'Ansiedad mínima (0-4). No se requiere intervención.', color: 'text-teal-600' }; if (r <= 9) return { text: 'Ansiedad leve (5-9). Monitoreo recomendado.', color: 'text-teal-600' }; if (r <= 14) return { text: 'Ansiedad moderada (10-14). Considere consultar con un profesional.', color: 'text-amber-600' }; return { text: 'Ansiedad severa (15-21). Se recomienda consultar con un profesional de salud mental.', color: 'text-red-600' }; },
      warning: 'El GAD-7 es una herramienta de tamizaje, no un diagnóstico. No sustituye la evaluación de un profesional.',
    },
    'phq9': {
      name: 'Cuestionario de estado de ánimo (PHQ-9)', formula: 'Suma de 9 preguntas (0-3 puntos cada una). Rango: 0-27.',
      fields: [
        { key: 'q1', label: '¿Poco interés o placer en hacer las cosas?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q2', label: '¿Te has sentido desanimado/a, deprimido/a o sin esperanza?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q3', label: '¿Problemas para dormir o dormir en exceso?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q4', label: '¿Te has sentido cansado/a o con poca energía?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q5', label: '¿Poco apetito o comer en exceso?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q6', label: '¿Te has sentido mal contigo mismo/a o que eres un fracaso?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q7', label: '¿Dificultad para concentrarte en las cosas?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q8', label: '¿Te has movido o hablado tan lento que otros lo notan, o lo contrario?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
        { key: 'q9', label: '¿Has tenido pensamientos de hacerte daño o de que estarías mejor muerto/a?', type: 'select', options: [{ value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' }] },
      ],
      calculate: (v) => Object.values(v).reduce((s, val) => s + Number(val || 0), 0),
      unit: 'puntos',
      interpret: (r) => { if (r <= 4) return { text: 'Estado de ánimo dentro de rango normal (0-4).', color: 'text-teal-600' }; if (r <= 9) return { text: 'Síntomas depresivos leves (5-9). Monitoreo recomendado.', color: 'text-teal-600' }; if (r <= 14) return { text: 'Síntomas depresivos moderados (10-14). Considere consultar con un profesional.', color: 'text-amber-600' }; if (r <= 19) return { text: 'Síntomas moderadamente severos (15-19). Se recomienda consultar.', color: 'text-red-600' }; return { text: 'Síntomas severos (20-27). Se recomienda buscar atención profesional.', color: 'text-red-600' }; },
      warning: 'El PHQ-9 es una herramienta de tamizaje, no un diagnóstico. Si tienes pensamientos de hacerte daño, busca ayuda inmediata.',
    },
  };

  const activeCalc = calculators[activeTool];

  const handleCalcChange = (key, value) => { setCalcValues(p => ({ ...p, [key]: value })); setCalcErrors(p => ({ ...p, [key]: '' })); setCalcResult(null); };
  const handleCalcSubmit = () => { if (!activeCalc) return; const errs = {}; activeCalc.fields.forEach(f => { if (f.type !== 'select' && !calcValues[f.key]) errs[f.key] = 'Requerido'; }); if (Object.keys(errs).length > 0) { setCalcErrors(errs); return; } setCalcResult(activeCalc.calculate(calcValues)); };
  const handlePassportPdf = async () => { await downloadPatientPdf(state, 'passport'); };
  const handleConsultationPdf = async () => { await downloadPatientPdf(state, 'consultation'); };

  const medicationSchedule = (state.medications || []).filter(m => m.status === 'active');

  const foodInteractions = [
    { food: 'Café, té', interaction: 'Reduce la absorción de levotiroxina hasta un 40%', recommendation: 'Espera al menos 60 minutos después de tomar levotiroxina', severity: 'Alta' },
    { food: 'Leche, yogur, queso', interaction: 'El calcio se une a la levotiroxina y reduce su absorción', recommendation: 'Separa al menos 4 horas de la levotiroxina', severity: 'Alta' },
    { food: 'Suplementos de calcio', interaction: 'Quelación de levotiroxina', recommendation: 'Toma el calcio en la noche, lejos de la levotiroxina de la mañana', severity: 'Alta' },
    { food: 'Suplementos de hierro', interaction: 'Quelación de levotiroxina', recommendation: 'Separa al menos 4 horas de la levotiroxina', severity: 'Alta' },
    { food: 'Nueces de Brasil', interaction: 'Aportan selenio, cofactor para la conversión de T4 a T3', recommendation: '2 nueces al día cubren el requerimiento. No exceder.', severity: 'Beneficio' },
    { food: 'Brócoli, col, coliflor', interaction: 'En cantidades muy altas y crudas pueden interferir con la captación de yodo', recommendation: 'Seguras en cantidades normales y cocidas. No es necesario eliminarlas.', severity: 'Baja' },
    { food: 'Soya y derivados', interaction: 'Puede interferir con la absorción de levotiroxina', recommendation: 'Separa 4 horas de la levotiroxina. Cantidades moderadas son seguras.', severity: 'Media' },
    { food: 'Fibra en exceso', interaction: 'Puede reducir la absorción de levotiroxina', recommendation: 'Mantén una ingesta normal de fibra. No exceder 40g al día.', severity: 'Media' },
    { food: 'Toronja (pomelo)', interaction: 'Puede afectar el metabolismo de algunos medicamentos', recommendation: 'Consulta con tu médico si consumes toronja regularmente', severity: 'Media' },
  ];

  return (
    <>
      <PageHeading eyebrow="Herramientas" title="Herramientas para tu salud tiroidea" description="Calculadoras, guías y recursos para apoyar el manejo de tu condición. Ninguna herramienta sustituye la evaluación de un profesional de salud." />
      {!activeTool ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patientTools.map(tool => (
            <button key={tool.id} onClick={() => { setActiveTool(tool.id); setCalcValues({}); setCalcResult(null); setCalcErrors({}); }} className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 text-left transition hover:border-[#2CB1A1] hover:shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f7f4] text-[#0B8176]"><tool.icon className="h-5 w-5" /></span>
                <div><p className="text-sm font-semibold text-[#0A2540]">{tool.name}</p><span className="text-[10px] font-medium uppercase text-[#0B8176]">{tool.category}</span></div>
              </div>
              <p className="text-xs leading-5 text-slate-500">{tool.description}</p>
            </button>
          ))}
        </div>
      ) : activeTool === 'sintomas-tracker' ? (
        <div className="space-y-4">
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm font-semibold text-[#0B8176] hover:text-[#0A655D] min-h-[44px]"><ArrowRight className="h-4 w-4 rotate-180" /> Volver a herramientas</button>
          <Panel title="Diario de síntomas" description="Registra tus síntomas para identificar patrones." icon={Activity}>
            {(state.symptoms || []).length === 0 ? (
              <EmptyState icon={Activity} title="Sin síntomas registrados" text="Ve a la sección Registrar para añadir tus primeros síntomas." to="/vida-360/registrar" action="Ir a Registrar" />
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Últimos {Math.min(state.symptoms.length, 10)} registros:</p>
                {(state.symptoms || []).slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                    <div><span className="font-semibold text-[#0A2540]">{s.name}</span><span className="ml-2 text-slate-500">{s.date}</span></div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${Number(s.intensity) >= 7 ? 'text-red-600' : Number(s.intensity) >= 4 ? 'text-amber-600' : 'text-teal-600'}`}>{s.intensity}/10</span>
                      {s.notes && <span className="text-slate-400 hidden sm:inline">— {s.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      ) : activeTool === 'medicacion-recordatorio' ? (
        <div className="space-y-4">
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm font-semibold text-[#0B8176] hover:text-[#0A655D] min-h-[44px]"><ArrowRight className="h-4 w-4 rotate-180" /> Volver a herramientas</button>
          <Panel title="Organizador de medicación" description="Visualiza tus medicamentos activos y los horarios recomendados." icon={Pill}>
            {medicationSchedule.length === 0 ? (
              <EmptyState icon={Pill} title="Sin medicamentos registrados" text="Ve a la sección Registrar para añadir tus medicamentos." to="/vida-360/registrar" action="Ir a Registrar" />
            ) : (
              <div className="space-y-3">
                {medicationSchedule.map(m => (
                  <div key={m.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between"><div><p className="text-sm font-bold text-[#0A2540]">{m.name}</p><p className="text-xs text-slate-500">{m.dose || 'Dosis no registrada'} · {m.frequency || 'Frecuencia no registrada'}</p></div><span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">{m.time || 'Sin horario'}</span></div>
                    {m.name?.toLowerCase().includes('levotiroxina') && (
                      <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3">
                        <p className="text-[11px] font-semibold text-amber-800">Recordatorio importante</p>
                        <ul className="mt-1 space-y-1 text-[10px] text-amber-700">
                          <li>• Tomar en ayunas, con agua, 30-60 min antes del desayuno.</li>
                          <li>• Separar al menos 4 horas de: calcio, hierro, antiácidos.</li>
                          <li>• Evitar café o té hasta 60 min después de tomarla.</li>
                          <li>• Ser constante con la misma marca de levotiroxina.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      ) : activeTool === 'consulta-preparacion' ? (
        <div className="space-y-4">
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm font-semibold text-[#0B8176] hover:text-[#0A655D] min-h-[44px]"><ArrowRight className="h-4 w-4 rotate-180" /> Volver a herramientas</button>
          <Panel title="Preparación para tu consulta" description="Revisa esta información antes de tu cita médica." icon={NotebookPen}>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-semibold text-[#0A2540] mb-2">Resumen para llevar a tu consulta</p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>• <strong>Diagnóstico:</strong> {state.thyroid?.primaryDiagnosis || 'No registrado'}</li>
                  <li>• <strong>Medicamentos activos:</strong> {medicationSchedule.length} registrados</li>
                  <li>• <strong>Síntomas recientes:</strong> {(state.symptoms || []).length} registros</li>
                  <li>• <strong>Laboratorios:</strong> {(state.labs || []).length} resultados</li>
                  <li>• <strong>Próximo control:</strong> {state.thyroid?.nextControl || 'No registrado'}</li>
                </ul>
              </div>
              {state.consultation?.questions && (
                <div className="rounded-lg border border-[#bce6e0] bg-[#f0faf8] p-4">
                  <p className="text-sm font-semibold text-[#0A2540] mb-2">Tus preguntas para el médico</p>
                  <p className="text-xs text-slate-600 whitespace-pre-wrap">{state.consultation.questions}</p>
                </div>
              )}
              <button onClick={handleConsultationPdf} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#0A2540] px-4 text-sm font-bold text-white"><Download className="h-4 w-4" /> Descargar resumen PDF</button>
            </div>
          </Panel>
        </div>
      ) : activeTool === 'alimentos-tiroides' ? (
        <div className="space-y-4">
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm font-semibold text-[#0B8176] hover:text-[#0A655D] min-h-[44px]"><ArrowRight className="h-4 w-4 rotate-180" /> Volver a herramientas</button>
          <Panel title="Guía de alimentos y tiroides" description="Conoce cómo organizar tu alimentación con tu medicación tiroidea." icon={FlaskConical}>
            <div className="space-y-3">
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                <p className="text-[11px] font-semibold text-amber-800">Regla de oro</p>
                <p className="text-[10px] text-amber-700 mt-1">Toma tu levotiroxina en ayunas con agua. Espera 30-60 minutos antes de comer o beber cualquier otra cosa. Separa 4 horas de suplementos de calcio, hierro o antiácidos.</p>
              </div>
              {foodInteractions.map((fi, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="min-w-0"><p className="text-xs font-semibold text-[#0A2540]">{fi.food}</p><p className="text-[10px] text-slate-500 mt-0.5">{fi.interaction}</p><p className="text-[10px] text-[#0B8176] font-medium mt-1">{fi.recommendation}</p></div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${fi.severity === 'Alta' ? 'bg-red-50 text-red-700' : fi.severity === 'Media' ? 'bg-amber-50 text-amber-700' : fi.severity === 'Baja' ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-700'}`}>{fi.severity}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : activeTool === 'pasaporte-tiroideo' ? (
        <div className="space-y-4">
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm font-semibold text-[#0B8176] hover:text-[#0A655D] min-h-[44px]"><ArrowRight className="h-4 w-4 rotate-180" /> Volver a herramientas</button>
          <Panel title="Pasaporte tiroideo" description="Documento portable con tu información tiroidea esencial." icon={FileHeart}>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                <p><span className="font-semibold text-slate-600">Nombre:</span> <span className="text-slate-700">{state.profile?.firstName || '—'} {state.profile?.lastName || ''}</span></p>
                <p><span className="font-semibold text-slate-600">Diagnóstico:</span> <span className="text-slate-700">{state.thyroid?.primaryDiagnosis || 'No registrado'}</span></p>
                <p><span className="font-semibold text-slate-600">Cirugía:</span> <span className="text-slate-700">{state.thyroid?.surgeryType || 'No'} · {state.thyroid?.surgeryDate || ''}</span></p>
                <p><span className="font-semibold text-slate-600">Medicamentos:</span> <span className="text-slate-700">{medicationSchedule.map(m => `${m.name} ${m.dose || ''}`).join(', ') || 'Ninguno'}</span></p>
                <p><span className="font-semibold text-slate-600">Último laboratorio:</span> <span className="text-slate-700">{(state.labs || [])[0] ? `${(state.labs)[0].analyte}: ${(state.labs)[0].value} ${(state.labs)[0].unit || ''} (${(state.labs)[0].date})` : 'No registrado'}</span></p>
              </div>
              <button onClick={handlePassportPdf} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#0A2540] px-4 text-sm font-bold text-white"><Download className="h-4 w-4" /> Descargar pasaporte PDF</button>
            </div>
          </Panel>
        </div>
      ) : activeCalc ? (
        <div className="space-y-4">
          <button onClick={() => { setActiveTool(null); setCalcValues({}); setCalcResult(null); }} className="flex items-center gap-2 text-sm font-semibold text-[#0B8176] hover:text-[#0A655D] min-h-[44px]"><ArrowRight className="h-4 w-4 rotate-180" /> Volver a herramientas</button>
          <Panel title={activeCalc.name} description="Herramienta de apoyo. No sustituye la evaluación de un profesional de salud." icon={Beaker}>
            <div className="space-y-4">
              <div className="rounded-md bg-slate-50 border border-slate-200 p-3"><p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Fórmula</p><p className="text-[11px] text-slate-700 font-mono whitespace-pre-wrap">{activeCalc.formula}</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeCalc.fields.map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-700">{f.label} {f.unit && <span className="text-slate-400">({f.unit})</span>}</label>
                    {f.type === 'select' ? (
                      <select value={calcValues[f.key] || ''} onChange={e => handleCalcChange(f.key, e.target.value)} className="vida360-field mt-0 block w-full"><option value="">Seleccionar</option>{f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    ) : (
                      <input type={f.type} value={calcValues[f.key] || ''} onChange={e => handleCalcChange(f.key, e.target.value)} min={f.min} max={f.max} step={f.step || 1} className="vida360-field mt-0 block w-full" />
                    )}
                    {calcErrors[f.key] && <p className="text-[10px] text-red-600">{calcErrors[f.key]}</p>}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleCalcSubmit} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#0A2540] px-4 text-sm font-bold text-white">Calcular</button>
                <button onClick={() => { setCalcValues({}); setCalcResult(null); }} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-600">Limpiar</button>
              </div>
              {calcResult !== null && (
                <div className="rounded-lg border border-[#bce6e0] bg-[#f0faf8] p-4">
                  <p className="text-[10px] font-semibold text-[#0B8176] uppercase mb-1">Resultado</p>
                  <p className="text-xl font-bold text-[#0A2540]">{typeof calcResult === 'object' ? (calcResult.ideal || calcResult.adjusted || '—') : calcResult}<span className="text-sm font-normal text-[#0B8176] ml-1">{activeCalc.unit}</span></p>
                  {typeof calcResult === 'object' && calcResult.ideal && calcResult.adjusted && <div className="flex gap-4 mt-1 text-[11px] text-slate-600"><span>Peso ideal: {calcResult.ideal} kg</span><span>Peso ajustado: {calcResult.adjusted} kg</span></div>}
                  {activeCalc.interpret && (
                    <div className="mt-2">{typeof activeCalc.interpret(calcResult) === 'object' ? <p className={`text-sm font-semibold ${activeCalc.interpret(calcResult).color}`}>{activeCalc.interpret(calcResult).text}</p> : <p className="text-sm text-slate-700">{activeCalc.interpret(calcResult)}</p>}</div>
                  )}
                </div>
              )}
              {activeCalc.warning && <div className="rounded-md bg-amber-50 border border-amber-200 p-3"><p className="text-[10px] text-amber-700 leading-relaxed">{activeCalc.warning}</p></div>}
            </div>
          </Panel>
        </div>
      ) : null}
    </>
  );
}

