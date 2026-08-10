/**
 * ============================================================
 *  FstAppSections.jsx — Secciones principales de la app FST
 *  (Dashboard, Onboarding, Perfil, Progreso)
 *
 *  Datos reales desde Supabase. Sin ficticios ni demo.
 * ============================================================
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, Apple, ArrowRight, BookOpen, CalendarDays, Check, ChefHat, Droplets,
  HeartPulse, MessageCircle, Pill, Plus, Scale, Sparkles, Stethoscope, UserRound,
} from 'lucide-react';
import { useFstApp, conditionOptions, surgeryOptions, goalOptions, budgetOptions, cookTimeOptions } from '../../context/FstAppContext';
import { useAuth } from '../../context/AuthContext';
import { checkInteractions } from '../../lib/fstApp/nutrifst';
import { PageHeading, Panel, Field, SafetyNote, EmptyState, QuickAction, ProgressBar } from '../fstApp/ui';

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : '';

export function FstDashboard() {
  const { data, insert, logActivity } = useFstApp();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(' ')[0] || 'bienvenida';

  const medications = data.medications || [];
  const medicationLogs = data.medicationLogs || [];
  const meals = data.meals || [];
  const symptomLogs = data.symptomLogs || [];
  const appointments = data.appointments || [];
  const laboratoryResults = data.laboratoryResults || [];
  const habits = data.habits || [];
  const habitLogs = data.habitLogs || [];
  const questions = data.questions || [];

  const activeMedication = medications.find(item => item.active);
  const levo = medications.find(item => item.medication_name.toLowerCase().includes('levotiroxina') && item.active) || activeMedication;
  const todayLog = levo ? medicationLogs.find(item => item.medication_id === levo.id && item.scheduled_at?.slice(0, 10) === today()) : null;
  const mealsToday = meals.filter(item => item.meal_date === today());
  const symptomsToday = symptomLogs.filter(item => item.log_date === today());
  const nextAppointment = [...appointments]
    .filter(item => item.status === 'scheduled' && item.appointment_date >= today())
    .sort((a, b) => String(a.appointment_date).localeCompare(String(b.appointment_date)))[0];
  const lastLab = [...laboratoryResults].sort((a, b) => String(b.test_date).localeCompare(String(a.test_date)))[0];
  const pendingQuestions = questions.filter(item => item.status === 'pending');
  const habitsToday = habits.filter(habit => habitLogs.some(log => log.habit_id === habit.id && log.log_date === today()));

  const interactions = useMemo(() => {
    const supplements = medications.filter(item => item.medication_type === 'suplemento' && item.active);
    return checkInteractions({
      levoTime: levo?.schedule_time || '',
      medications: levo ? [{ name: levo.medication_name }] : [],
      supplements: supplements.map(item => ({ name: item.medication_name })),
      lowIodineMode: data.preferences?.low_iodine_mode || false,
    });
  }, [medications, levo, data.preferences]);

  const markLevo = async () => {
    if (!levo) return;
    if (todayLog) return;
    await insert('medication_logs', {
      medication_id: levo.id,
      scheduled_at: `${today()}T${levo.schedule_time || '07:00'}:00`,
      taken_at: new Date().toISOString(),
      status: 'taken',
    });
    logActivity('medication_taken', 'medication_logs');
  };

  const completion = useMemo(() => {
    const checks = [
      Boolean(profile?.onboarding_completed),
      Boolean(levo),
      Boolean(data.preferences?.nutrition_goal),
      Boolean(profile?.country),
      medicationLogs.length > 0,
      symptomLogs.length > 0,
      meals.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, levo, data.preferences, medicationLogs, symptomLogs, meals]);

  return (
    <>
      <PageHeading
        eyebrow="Panel personal"
        title={`Buenos días, ${firstName}`}
        description="¿Cómo podemos ayudarte hoy?"
      />

      <SafetyNote>Esta herramienta organiza lo que registras y ofrece información educativa. No diagnostica, no modifica dosis ni reemplaza a tu equipo de salud.</SafetyNote>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <QuickAction icon={MessageCircle} label="Preguntar a NutriFST" tone="purple" onClick={() => navigate('/fst-app/nutrifst')} />
        <QuickAction icon={Apple} label="Registrar comida" tone="teal" onClick={() => navigate('/fst-app/escaneo')} />
        <QuickAction icon={Pill} label="Registrar levotiroxina" onClick={() => navigate('/fst-app/levotiroxina')} />
        <QuickAction icon={ChefHat} label="Revisar alimento" tone="blush" onClick={() => navigate('/fst-app/alimento')} />
        <QuickAction icon={BookOpen} label="Crear menú" onClick={() => navigate('/fst-app/menus')} />
        <QuickAction icon={HeartPulse} label="Registrar síntoma" tone="teal" onClick={() => navigate('/fst-app/sintomas')} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Resumen de hoy" description="Medicamento, comidas, hidratación y síntomas" icon={CalendarDays}>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAE2F8] text-[#9274C9]"><Pill className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-[#0A2540]">{levo ? levo.medication_name : 'Levotiroxina'}</p>
                  <p className="text-xs text-slate-500">{levo?.schedule_time ? `Horario: ${levo.schedule_time}` : 'Sin medicamento registrado'}</p>
                </div>
              </div>
              {todayLog?.status === 'taken' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><Check className="h-3.5 w-3.5" /> Tomada</span>
              ) : levo ? (
                <button type="button" onClick={markLevo} className="rounded-full bg-[#0A2540] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#123b5f]">Marcar</button>
              ) : (
                <Link to="/fst-app/levotiroxina" className="text-xs font-bold text-[#9274C9]">Registrar</Link>
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d3efe9] text-[#0B8176]"><Apple className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-[#0A2540]">Comidas de hoy</p>
                  <p className="text-xs text-slate-500">{mealsToday.length} registrada(s)</p>
                </div>
              </div>
              <Link to="/fst-app/escaneo" className="text-xs font-bold text-[#0B8176]">Registrar</Link>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5dce8] text-[#b04a76]"><Droplets className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-[#0A2540]">Hidratación</p>
                  <p className="text-xs text-slate-500">{habitsToday.length} hábito(s) cumplido(s) hoy</p>
                </div>
              </div>
              <Link to="/fst-app/habitos" className="text-xs font-bold text-[#b04a76]">Ver hábitos</Link>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f3fb] text-[#9274C9]"><HeartPulse className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-[#0A2540]">Síntomas de hoy</p>
                  <p className="text-xs text-slate-500">{symptomsToday.length} registro(s)</p>
                </div>
              </div>
              <Link to="/fst-app/sintomas" className="text-xs font-bold text-[#9274C9]">Registrar</Link>
            </div>
          </div>
        </Panel>

        <Panel title="Tu progreso" description="Completa tu perfil para mejores sugerencias" icon={Activity}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0A2540]">{completion}% completado</p>
            <span className="text-xs text-slate-500">Sin juicios, a tu ritmo</span>
          </div>
          <div className="mt-3"><ProgressBar value={completion} /></div>
          <div className="mt-4 space-y-2">
            {!levo && <p className="text-xs text-slate-500">• Registra tu levotiroxina y su horario</p>}
            {!data.preferences?.nutrition_goal && <p className="text-xs text-slate-500">• Elige tu objetivo nutricional</p>}
            {!profile?.country && <p className="text-xs text-slate-500">• Agrega tu país en el perfil</p>}
            {levo && data.preferences?.nutrition_goal && profile?.country && <p className="text-xs font-semibold text-[#0B8176]">• Tu perfil está casi completo</p>}
          </div>
          <Link to="/fst-app/perfil" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#9274C9]">Completar perfil <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Panel>

        <Panel title="Revisión de interacciones" description="Según tus registros actuales" icon={Sparkles}>
          {interactions.length ? (
            <div className="space-y-3">
              {interactions.map((item, index) => (
                <div key={index} className={`rounded-xl border p-3 ${item.level === 'rojo' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
                  <p className={`text-xs font-bold ${item.level === 'rojo' ? 'text-rose-700' : 'text-amber-800'}`}>{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                </div>
              ))}
              <p className="text-[11px] leading-4 text-slate-500">Revisión educativa. No modifiques dosis ni horarios por esta información.</p>
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Sin interferencias evidentes"
              text="Registra tu levotiroxina, horario y suplementos para revisar posibles interacciones."
              action={<Link to="/fst-app/levotiroxina" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Registrar mi levotiroxina</Link>}
            />
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Próxima cita" icon={Stethoscope}>
          {nextAppointment ? (
            <div className="rounded-xl border border-[#d3efe9] bg-[#f0faf8] p-4">
              <p className="text-sm font-bold text-[#0A2540]">{nextAppointment.professional}</p>
              <p className="text-xs text-slate-500">{nextAppointment.specialty || 'Sin especialidad'}</p>
              <p className="mt-2 text-sm font-semibold text-[#0B8176]">{formatDate(nextAppointment.appointment_date)} {nextAppointment.appointment_time ? `· ${nextAppointment.appointment_time}` : ''}</p>
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title="No tienes citas próximas" text="Agrega tu próxima consulta." action={<Link to="/fst-app/citas" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Agregar cita</Link>} />
          )}
        </Panel>

        <Panel title="Últimos laboratorios" icon={Activity}>
          {lastLab ? (
            <div className="space-y-2">
              {[...laboratoryResults].sort((a, b) => String(b.test_date).localeCompare(String(a.test_date))).slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                  <p className="text-sm font-semibold text-[#0A2540]">{item.test_name}</p>
                  <p className="text-xs text-slate-500">{item.value} {item.unit} · {formatDate(item.test_date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={BeakerIcon} title="No tienes laboratorios registrados todavía" text="Agrega tu primer resultado." action={<Link to="/fst-app/laboratorios" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Agregar mi primer resultado</Link>} />
          )}
        </Panel>

        <Panel title="Preguntas para consulta" icon={Stethoscope}>
          {pendingQuestions.length ? (
            <div className="space-y-2">
              {pendingQuestions.slice(0, 3).map(item => (
                <div key={item.id} className="rounded-xl border border-[#f0eaf5] p-3">
                  <p className="text-sm leading-5 text-[#0A2540]">{item.question}</p>
                  <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pendiente</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Stethoscope} title="Sin preguntas pendientes" text="Escribe las preguntas para tu próxima consulta." action={<Link to="/fst-app/preguntas" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Agregar pregunta</Link>} />
          )}
        </Panel>
      </div>
    </>
  );
}

function BeakerIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 4h6M10 4v5l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V4M7.5 14h9" /></svg>;
}

export function FstOnboarding() {
  const { upsertPreferences, upsertThyroidProfile, completeOnboarding, insert } = useFstApp();
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({
    condition: '',
    surgery: '',
    treatment: '',
    levoDose: '',
    levoTime: '',
    country: profile?.country || '',
    nutritionGoal: '',
    allergies: '',
    intolerances: '',
    weight: '',
    height: '',
    foodPreferences: '',
    budget: 'medio',
    cookTime: 30,
    people: 1,
    goals: [],
  });
  const [saving, setSaving] = useState(false);
  const total = 5;
  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));

  const finish = async () => {
    setSaving(true);
    try {
      await upsertPreferences({
        nutrition_goal: draft.nutritionGoal || null,
        allergies: draft.allergies || null,
        intolerances: draft.intolerances || null,
        weight_kg: draft.weight ? Number(draft.weight) : null,
        height_cm: draft.height ? Number(draft.height) : null,
        food_preferences: draft.foodPreferences || null,
        budget: draft.budget,
        cook_time_min: draft.cookTime,
        people_count: draft.people,
      });
      await upsertThyroidProfile({
        condition_type: draft.condition || null,
        surgery_history: Boolean(draft.surgery && draft.surgery !== 'Sin cirugía'),
        surgery_type: draft.surgery || null,
        current_thyroid_medication: draft.treatment || null,
      });
      if (draft.levoTime || draft.levoDose) {
        await insert('medications', {
          medication_name: 'Levotiroxina',
          medication_type: 'medicamento',
          dose: draft.levoDose ? Number(draft.levoDose) : null,
          dose_unit: 'mcg',
          frequency: 'Diaria',
          schedule_time: draft.levoTime || null,
          active: true,
        });
      }
      await updateProfile({ country: draft.country || null, onboarding_completed: true });
      await completeOnboarding();
      navigate('/fst-app');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fst-app mx-auto max-w-2xl py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#0A2540]">Feliz Sin Tiroides</p>
          <p className="text-xs text-slate-500">Configura tu punto de partida</p>
        </div>
        <p className="text-sm font-semibold text-[#9274C9]">Paso {step} de {total}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f0eaf5]">
        <div className="h-full rounded-full bg-[#2CB1A1] transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>

      <section className="mt-6 rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-[0_2px_12px_rgba(10,37,64,0.05)] sm:p-8">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Bienvenida a Feliz Sin Tiroides</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Tu espacio personal para organizar tu tratamiento, tus hábitos y tu seguimiento. Puedes completar la información a tu ritmo: nada es obligatorio para empezar.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Pill', 'Organiza tu medicación'],
                ['Beaker', 'Registra tus laboratorios'],
                ['HeartPulse', 'Sigue tus síntomas'],
                ['CalendarDays', 'Prepara tus citas'],
                ['Activity', 'Crea hábitos'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Pill className="h-4 w-4" /></span>
                  <p className="text-sm font-semibold text-[#0A2540]">{label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Cuéntanos qué quieres organizar</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Elige lo que más te interesa. Puedes usar todo después.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Mi medicación', 'medication'],
                ['Mis laboratorios', 'labs'],
                ['Mis síntomas', 'symptoms'],
                ['Mis citas', 'appointments'],
                ['Mis hábitos', 'habits'],
              ].map(([label, value]) => {
                const selected = draft.goals.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('goals', selected ? draft.goals.filter(g => g !== value) : [...draft.goals, value])}
                    className={`flex min-h-14 items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition ${selected ? 'border-[#9274C9] bg-[#f7f3fb] text-[#6b4fa8]' : 'border-[#f0eaf5] bg-white text-[#0A2540] hover:border-[#d8cce8]'}`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${selected ? 'border-[#9274C9] bg-[#9274C9] text-white' : 'border-[#e5dceb]'}`}>
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Configura tu perfil básico</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Información general. No estamos diagnosticando: solo personalizamos tu espacio.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Condición tiroidea">
                <select value={draft.condition} onChange={e => set('condition', e.target.value)}>
                  <option value="">Selecciona</option>
                  {conditionOptions.map(option => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="¿Tienes tiroidectomía?">
                <select value={draft.surgery} onChange={e => set('surgery', e.target.value)}>
                  <option value="">Selecciona</option>
                  {surgeryOptions.map(option => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Tratamiento actual">
                <select value={draft.treatment} onChange={e => set('treatment', e.target.value)}>
                  <option value="">Selecciona</option>
                  <option>Levotiroxina</option>
                  <option>Levotiroxina + otro medicamento</option>
                  <option>Sin medicamento</option>
                  <option>No estoy segura</option>
                </select>
              </Field>
              <Field label="País">
                <input value={draft.country} onChange={e => set('country', e.target.value)} placeholder="Ej. Colombia" />
              </Field>
              <Field label="Objetivo nutricional">
                <select value={draft.nutritionGoal} onChange={e => set('nutritionGoal', e.target.value)}>
                  <option value="">Selecciona</option>
                  {goalOptions.map(option => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Peso (kg)" hint="Opcional.">
                <input type="number" inputMode="decimal" value={draft.weight} onChange={e => set('weight', e.target.value)} placeholder="Ej. 62" />
              </Field>
              <Field label="Estatura (cm)" hint="Opcional.">
                <input type="number" inputMode="decimal" value={draft.height} onChange={e => set('height', e.target.value)} placeholder="Ej. 165" />
              </Field>
              <Field label="Preferencias alimentarias" hint="Separa con comas.">
                <input value={draft.foodPreferences} onChange={e => set('foodPreferences', e.target.value)} placeholder="Ej. pollo, huevo, arroz" />
              </Field>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Tu primer medicamento (opcional)</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Si tomas levotiroxina, regístrala con su horario. Puedes agregar más medicamentos después.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Dosis de levotiroxina" hint="Como aparece en tu caja o frasco.">
                <input type="number" inputMode="decimal" value={draft.levoDose} onChange={e => set('levoDose', e.target.value)} placeholder="Ej. 100" />
              </Field>
              <Field label="Horario habitual">
                <input type="time" value={draft.levoTime} onChange={e => set('levoTime', e.target.value)} />
              </Field>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <Field label="Presupuesto">
                <select value={draft.budget} onChange={e => set('budget', e.target.value)}>
                  {budgetOptions.map(option => <option key={option} value={option}>{option === 'bajo' ? 'Económico' : option === 'medio' ? 'Medio' : 'Amplio'}</option>)}
                </select>
              </Field>
              <Field label="Tiempo para cocinar">
                <select value={draft.cookTime} onChange={e => set('cookTime', Number(e.target.value))}>
                  {cookTimeOptions.map(option => <option key={option} value={option}>{option} minutos</option>)}
                </select>
              </Field>
              <Field label="Personas">
                <input type="number" min="1" max="8" value={draft.people} onChange={e => set('people', Number(e.target.value) || 1)} />
              </Field>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">¡Listo para empezar!</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Tu espacio está configurado. Puedes completar más información cuando quieras, desde tu perfil.</p>
            <div className="mt-6 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Recuerda</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Esta herramienta organiza tu información y ofrece educación. No diagnostica, no modifica dosis ni reemplaza a tu equipo de salud.</p>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-between gap-3">
          <button type="button" onClick={() => setStep(value => Math.max(1, value - 1))} disabled={step === 1 || saving} className="min-h-11 rounded-xl border border-[#e5dceb] px-5 text-sm font-bold text-slate-600 disabled:opacity-40">
            Anterior
          </button>
          {step < total ? (
            <button type="button" onClick={() => setStep(value => value + 1)} className="min-h-11 rounded-xl bg-[#0A2540] px-5 text-sm font-bold text-white hover:bg-[#123b5f]">
              Continuar
            </button>
          ) : (
            <button type="button" onClick={finish} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2CB1A1] px-5 text-sm font-bold text-white hover:bg-[#27a08f] disabled:opacity-50">
              {saving ? 'Guardando...' : <><Check className="h-4 w-4" /> Entrar a Mi espacio</>}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export function FstProfile() {
  const { data, upsertPreferences, upsertThyroidProfile, insert, remove, logActivity } = useFstApp();
  const { profile, updateProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const prefs = data.preferences || {};
  const thyroid = data.thyroidProfile || {};
  const medications = data.medications || [];

  const [form, setForm] = useState({
    firstName: profile?.full_name || '',
    country: profile?.country || '',
    condition: thyroid.condition_type || '',
    surgery: thyroid.surgery_type || '',
    treatment: thyroid.current_thyroid_medication || '',
    levoDose: '',
    levoTime: '',
    nutritionGoal: prefs.nutrition_goal || '',
    allergies: prefs.allergies || '',
    intolerances: prefs.intolerances || '',
    weight: prefs.weight_kg || '',
    height: prefs.height_cm || '',
    foodPreferences: prefs.food_preferences || '',
    budget: prefs.budget || 'medio',
    cookTime: prefs.cook_time_min || 30,
    people: prefs.people_count || 1,
  });

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const save = async event => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateProfile({ full_name: form.firstName || null, country: form.country || null });
      await upsertPreferences({
        nutrition_goal: form.nutritionGoal || null,
        allergies: form.allergies || null,
        intolerances: form.intolerances || null,
        weight_kg: form.weight ? Number(form.weight) : null,
        height_cm: form.height ? Number(form.height) : null,
        food_preferences: form.foodPreferences || null,
        budget: form.budget,
        cook_time_min: Number(form.cookTime),
        people_count: Number(form.people),
      });
      await upsertThyroidProfile({
        condition_type: form.condition || null,
        surgery_history: Boolean(form.surgery && form.surgery !== 'Sin cirugía'),
        surgery_type: form.surgery || null,
        current_thyroid_medication: form.treatment || null,
      });
      setMessage('Perfil guardado correctamente.');
      logActivity('profile_updated', 'profile');
    } catch (err) {
      setError(err.message);
    }
  };

  const addSupplement = async () => {
    setMessage('');
    setError('');
    const result = await insert('medications', {
      medication_name: 'Calcio',
      medication_type: 'suplemento',
      dose: 500,
      dose_unit: 'mg',
      frequency: 'Diaria',
      active: true,
    });
    if (result.error) setError(result.error);
    else {
      setMessage('Suplemento agregado. Puedes editarlo en Medicamentos.');
      logActivity('supplement_created', 'medications');
    }
  };

  return (
    <>
      <PageHeading eyebrow="Perfil" title="Tu información" description="Toda la información es opcional y editable. No se usa para diagnosticar." />
      {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</div>}
      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}

      <form onSubmit={save} className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Historia tiroidea" icon={UserRound}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre"><input value={form.firstName} onChange={e => set('firstName', e.target.value)} /></Field>
            <Field label="País"><input value={form.country} onChange={e => set('country', e.target.value)} /></Field>
            <Field label="Condición tiroidea">
              <select value={form.condition} onChange={e => set('condition', e.target.value)}>
                <option value="">Selecciona</option>
                {conditionOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Tiroidectomía">
              <select value={form.surgery} onChange={e => set('surgery', e.target.value)}>
                <option value="">Selecciona</option>
                {surgeryOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Tratamiento">
              <select value={form.treatment} onChange={e => set('treatment', e.target.value)}>
                <option value="">Selecciona</option>
                <option>Levotiroxina</option>
                <option>Levotiroxina + otro medicamento</option>
                <option>Sin medicamento</option>
                <option>No estoy segura</option>
              </select>
            </Field>
          </div>
        </Panel>

        <Panel title="Nutrición y cuerpo" icon={Apple}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Objetivo nutricional">
              <select value={form.nutritionGoal} onChange={e => set('nutritionGoal', e.target.value)}>
                <option value="">Selecciona</option>
                {goalOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Alergias"><input value={form.allergies} onChange={e => set('allergies', e.target.value)} /></Field>
            <Field label="Intolerancias"><input value={form.intolerances} onChange={e => set('intolerances', e.target.value)} /></Field>
            <Field label="Peso (kg)"><input type="number" inputMode="decimal" value={form.weight} onChange={e => set('weight', e.target.value)} /></Field>
            <Field label="Estatura (cm)"><input type="number" inputMode="decimal" value={form.height} onChange={e => set('height', e.target.value)} /></Field>
            <Field label="Preferencias" hint="Separa con comas.">
              <input value={form.foodPreferences} onChange={e => set('foodPreferences', e.target.value)} />
            </Field>
            <Field label="Presupuesto">
              <select value={form.budget} onChange={e => set('budget', e.target.value)}>
                {budgetOptions.map(option => <option key={option} value={option}>{option === 'bajo' ? 'Económico' : option === 'medio' ? 'Medio' : 'Amplio'}</option>)}
              </select>
            </Field>
            <Field label="Tiempo para cocinar">
              <select value={form.cookTime} onChange={e => set('cookTime', Number(e.target.value))}>
                {cookTimeOptions.map(option => <option key={option} value={option}>{option} minutos</option>)}
              </select>
            </Field>
            <Field label="Personas en casa">
              <input type="number" min="1" max="8" value={form.people} onChange={e => set('people', Number(e.target.value) || 1)} />
            </Field>
          </div>
        </Panel>

        <Panel title="Suplementos registrados" icon={Sparkles}>
          {medications.filter(item => item.medication_type === 'suplemento').length ? (
            <div className="space-y-3">
              {medications.filter(item => item.medication_type === 'suplemento').map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0A2540]">{item.medication_name}</p>
                    <p className="text-xs text-slate-500">{item.dose ?? ''} {item.dose_unit || ''} · {item.schedule_time || 'Sin horario'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => { await remove('medications', item.id); logActivity('supplement_deleted', 'medications'); }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Eliminar ${item.medication_name}`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Sparkles} title="Sin suplementos registrados" text="Agrega suplementos desde el escáner de suplementos." action={<button type="button" onClick={addSupplement} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Agregar suplemento</button>} />
          )}
        </Panel>

        <Panel title="Modo especial" icon={Stethoscope}>
          <label className="flex items-start gap-3 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-4">
            <input
              type="checkbox"
              checked={prefs.low_iodine_mode || false}
              onChange={async e => {
                await upsertPreferences({ low_iodine_mode: e.target.checked, low_iodine_confirmed: e.target.checked });
                setMessage(e.target.checked ? 'Modo radioyodo activado.' : 'Modo radioyodo desactivado.');
              }}
              className="mt-1 h-5 w-5 accent-[#9274C9]"
            />
            <span className="text-sm leading-6 text-slate-600">
              <strong className="text-[#0A2540]">Preparación para radioyodo (dieta baja en yodo)</strong>
              <span className="block text-xs text-slate-500">Solo actívalo si tu equipo de salud te lo indicó. La dieta es temporal.</span>
            </span>
          </label>
          <p className="mt-3 text-xs leading-5 text-slate-500">La dieta baja en yodo es temporal y debe realizarse siguiendo las indicaciones del equipo tratante.</p>
        </Panel>

        <div className="lg:col-span-2">
          <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-5 text-sm font-bold text-white hover:bg-[#123b5f]">
            <Check className="h-4 w-4" /> Guardar perfil
          </button>
        </div>
      </form>
    </>
  );
}

export function FstProgress() {
  const { data, insert, remove, logActivity } = useFstApp();
  const [weight, setWeight] = useState('');
  const [range, setRange] = useState(7);
  const symptomLogs = data.symptomLogs || [];
  const weightLogs = data.weightLogs || [];
  const meals = data.meals || [];
  const medicationLogs = data.medicationLogs || [];

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - range);
    return symptomLogs
      .filter(item => new Date(item.log_date) >= cutoff)
      .sort((a, b) => String(a.log_date).localeCompare(String(b.log_date)));
  }, [symptomLogs, range]);

  const byName = useMemo(() => {
    const map = {};
    for (const item of filtered) {
      const name = item.symptoms?.name || 'Síntoma';
      if (!map[name]) map[name] = [];
      map[name].push(item);
    }
    return map;
  }, [filtered]);

  const addWeight = async event => {
    event.preventDefault();
    if (!weight) return;
    await insert('weight_logs', { weight_kg: Number(weight), log_date: today() });
    setWeight('');
    logActivity('weight_logged', 'weight_logs');
  };

  return (
    <>
      <PageHeading eyebrow="Progreso" title="Tus registros y tendencias" description="Observa patrones sin culpa. Una asociación observada no significa que una variable sea la causa de la otra." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Tendencias de síntomas" description={`Últimos ${range} días`} icon={Activity} action={
          <div className="flex gap-1">
            {[7, 30, 90].map(value => (
              <button key={value} type="button" onClick={() => setRange(value)} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${range === value ? 'bg-[#0A2540] text-white' : 'bg-[#f6f7f8] text-slate-500'}`}>{value}d</button>
            ))}
          </div>
        }>
          {Object.keys(byName).length ? (
            <div className="space-y-4">
              {Object.entries(byName).map(([name, items]) => {
                const sorted = [...items].sort((a, b) => String(a.log_date).localeCompare(String(b.log_date)));
                const first = Number(sorted[0].intensity);
                const last = Number(sorted[sorted.length - 1].intensity);
                const trend = last < first ? 'disminuyó' : last > first ? 'aumentó' : 'se mantuvo';
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0A2540]">{name}</p>
                      <span className={`text-xs font-bold ${trend === 'aumentó' ? 'text-amber-600' : trend === 'disminuyó' ? 'text-emerald-600' : 'text-slate-500'}`}>{trend}</span>
                    </div>
                    <div className="mt-2 flex h-16 items-end gap-1">
                      {sorted.map(item => (
                        <div key={item.id} className="flex-1">
                          <div
                            className="rounded-t-md bg-[#2CB1A1] transition-all"
                            style={{ height: `${Math.max(8, (Number(item.intensity) / 10) * 100)}%` }}
                            title={`${item.log_date}: ${item.intensity}/10`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{sorted.length} registro(s) · de {first}/10 a {last}/10</p>
                  </div>
                );
              })}
              <p className="rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-3 text-[11px] leading-5 text-slate-500">
                Una asociación observada no significa necesariamente que una variable sea la causa de la otra. Lleva estas tendencias a tu consulta.
              </p>
            </div>
          ) : (
            <EmptyState icon={Activity} title="Aún no hay tendencias" text="Registra síntomas durante varios días para ver cómo cambian." action={<Link to="/fst-app/sintomas" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Registrar síntoma</Link>} />
          )}
        </Panel>

        <Panel title="Registro de peso" description="Opcional y sin juicios" icon={Scale}>
          <form onSubmit={addWeight} className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="Peso en kg"
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#e5dceb] px-3 text-sm"
              aria-label="Nuevo peso"
            />
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A2540] text-white" aria-label="Agregar peso"><Plus className="h-5 w-5" /></button>
          </form>
          {weightLogs.length ? (
            <div className="mt-4 space-y-2">
              {[...weightLogs].sort((a, b) => String(b.log_date).localeCompare(String(a.log_date))).slice(0, 10).map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                  <p className="text-sm font-semibold text-[#0A2540]">{item.weight_kg} kg</p>
                  <p className="text-xs text-slate-500">{formatDate(item.log_date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Registra tu peso cuando quieras. Los cambios de peso pueden conversarse con tu equipo de salud.</p>
          )}
        </Panel>

        <Panel title="Registros recientes" description="Comidas, síntomas y levotiroxina" icon={CalendarDays}>
          <div className="space-y-3">
            {[...meals].sort((a, b) => String(b.meal_date).localeCompare(String(a.meal_date))).slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0A2540]">{item.meal_type}: {item.description}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.meal_date)}</p>
                </div>
                <Apple className="h-4 w-4 shrink-0 text-[#0B8176]" />
              </div>
            ))}
            {[...medicationLogs].sort((a, b) => String(b.scheduled_at).localeCompare(String(a.scheduled_at))).slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0A2540]">Levotiroxina · {item.status === 'taken' ? 'Tomada' : item.status}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.scheduled_at?.slice(0, 10))} · {item.scheduled_at?.slice(11, 16)}</p>
                </div>
                <Pill className="h-4 w-4 shrink-0 text-[#9274C9]" />
              </div>
            ))}
            {!meals.length && !medicationLogs.length && <p className="text-sm text-slate-500">Aún no hay registros. Empieza con tu levotiroxina o una comida.</p>}
          </div>
        </Panel>
      </div>
    </>
  );
}
