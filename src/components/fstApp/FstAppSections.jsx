/**
 * ============================================================
 *  FstAppSections.jsx — Secciones principales de la app FST
 *  (Dashboard, Onboarding, Perfil, Progreso)
 * ============================================================
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, Apple, ArrowRight, BookOpen, CalendarDays, Check, ChefHat, Droplets,
  HeartPulse, MessageCircle, Pill, Plus, Scale, Sparkles, Stethoscope, UserRound,
} from 'lucide-react';
import { useFstApp, conditionOptions, surgeryOptions, goalOptions, budgetOptions, cookTimeOptions } from '../../context/FstAppContext';
import { checkInteractions, uid } from '../../lib/fstApp/nutrifst';
import { PageHeading, Panel, Field, SafetyNote, EmptyState, QuickAction, ProgressBar } from '../fstApp/ui';

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : '';

export function FstDashboard() {
  const { state, update } = useFstApp();
  const navigate = useNavigate();
  const profile = state.profile;
  const levoToday = state.levoLog.find(item => item.date === today());
  const mealsToday = state.meals.filter(item => item.date === today());
  const symptomsToday = state.symptoms.filter(item => item.date === today());
  const interactions = useMemo(() => checkInteractions(state.profile), [state.profile]);
  const completion = useMemo(() => {
    const checks = [
      Boolean(profile.condition),
      Boolean(profile.levoTime),
      Boolean(profile.nutritionGoal),
      Boolean(profile.country),
      state.levoLog.length > 0,
      state.symptoms.length > 0,
      state.meals.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, state]);

  const markLevo = () => {
    const existing = state.levoLog.find(item => item.date === today());
    if (existing) {
      update('levoLog', items => items.map(item => item.id === existing.id ? { ...item, status: 'Tomada', time: profile.levoTime || new Date().toTimeString().slice(0, 5) } : item));
    } else {
      update('levoLog', items => [{ id: uid('levo'), date: today(), time: profile.levoTime || new Date().toTimeString().slice(0, 5), status: 'Tomada', note: '' }, ...items]);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="Panel personal"
        title={`Hola, ${profile.firstName || 'bienvenida'}`}
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
        <Panel title="Tu día" description="Medicamento, comidas, hidratación y síntomas" icon={CalendarDays}>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAE2F8] text-[#9274C9]"><Pill className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-[#0A2540]">Levotiroxina</p>
                  <p className="text-xs text-slate-500">{profile.levoTime ? `Horario: ${profile.levoTime}` : 'Sin horario registrado'}</p>
                </div>
              </div>
              {levoToday?.status === 'Tomada' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><Check className="h-3.5 w-3.5" /> Tomada</span>
              ) : (
                <button type="button" onClick={markLevo} className="rounded-full bg-[#0A2540] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#123b5f]">Marcar</button>
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
                  <p className="text-xs text-slate-500">Recuerda tomar agua durante el día</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#b04a76]">Meta: 8 vasos</span>
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
            {!profile.condition && <p className="text-xs text-slate-500">• Cuéntanos tu condición tiroidea en el perfil</p>}
            {!profile.levoTime && <p className="text-xs text-slate-500">• Registra tu horario de levotiroxina</p>}
            {!profile.nutritionGoal && <p className="text-xs text-slate-500">• Elige tu objetivo nutricional</p>}
            {profile.condition && profile.levoTime && profile.nutritionGoal && <p className="text-xs font-semibold text-[#0B8176]">• Tu perfil está casi completo</p>}
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
    </>
  );
}

export function FstOnboarding() {
  const { state, updateProfile } = useFstApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(state.profile);
  const total = 4;
  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));

  const finish = () => {
    updateProfile({ ...draft, onboardingCompleted: true });
    navigate('/fst-app');
  };

  return (
    <div className="mx-auto max-w-2xl py-6">
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
            <h1 className="text-2xl font-semibold text-[#0A2540]">Cuéntanos lo esencial de tu historia</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">No estamos diagnosticando: solo usamos esta información para personalizar tus herramientas. Puedes corregirla después.</p>
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
              <Field label="¿Tomas levotiroxina?" hint="Si la tomas, registra la dosis que aparece en tu caja o frasco.">
                <select value={draft.levoDose ? 'si' : draft.treatment === 'Levotiroxina' ? 'si' : ''} onChange={e => set('levoDose', e.target.value === 'si' ? draft.levoDose || '100 mcg' : '')}>
                  <option value="">Selecciona</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </Field>
              <Field label="Horario habitual de levotiroxina">
                <input type="time" value={draft.levoTime} onChange={e => set('levoTime', e.target.value)} />
              </Field>
              <Field label="País">
                <input value={draft.country} onChange={e => set('country', e.target.value)} placeholder="Ej. Colombia" />
              </Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Tu alimentación</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Esto nos ayuda a crear menús y sugerencias más cercanas a tu realidad.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Objetivo nutricional">
                <select value={draft.nutritionGoal} onChange={e => set('nutritionGoal', e.target.value)}>
                  <option value="">Selecciona</option>
                  {goalOptions.map(option => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Alergias alimentarias">
                <input value={draft.allergies} onChange={e => set('allergies', e.target.value)} placeholder="Ej. maní, mariscos" />
              </Field>
              <Field label="Intolerancias">
                <input value={draft.intolerances} onChange={e => set('intolerances', e.target.value)} placeholder="Ej. lactosa, gluten" />
              </Field>
              <Field label="Peso (kg)" hint="Opcional. Solo se usa para contexto educativo.">
                <input type="number" inputMode="decimal" value={draft.weight} onChange={e => set('weight', e.target.value)} placeholder="Ej. 62" />
              </Field>
              <Field label="Estatura (cm)" hint="Opcional.">
                <input type="number" inputMode="decimal" value={draft.height} onChange={e => set('height', e.target.value)} placeholder="Ej. 165" />
              </Field>
              <Field label="Preferencias alimentarias" hint="Separa con comas.">
                <input value={draft.foodPreferences.join(', ')} onChange={e => set('foodPreferences', e.target.value.split(',').map(item => item.trim()).filter(Boolean))} placeholder="Ej. pollo, huevo, arroz" />
              </Field>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Tus suplementos</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Registra los suplementos que tomas para revisar posibles interacciones con tu horario. No recomendamos iniciar suplementos automáticamente.</p>
            <div className="mt-6 space-y-3">
              {draft.supplements.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0A2540]">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.dose} · {item.time || 'Sin horario'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set('supplements', draft.supplements.filter(s => s.id !== item.id))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                  </button>
                </div>
              ))}
              {!draft.supplements.length && <p className="text-sm text-slate-500">Aún no registras suplementos. Puedes agregarlos después en "Escáner de suplementos".</p>}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-2xl font-semibold text-[#0A2540]">Tus preferencias de menú</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Así genero menús más realistas para ti.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
              <Field label="Número de personas">
                <input type="number" min="1" max="8" value={draft.people} onChange={e => set('people', Number(e.target.value) || 1)} />
              </Field>
            </div>
            <div className="mt-6 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Modo especial</p>
              <label className="mt-2 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={draft.lowIodineMode}
                  onChange={e => set('lowIodineMode', e.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#9274C9]"
                />
                <span className="text-sm leading-6 text-slate-600">
                  <strong className="text-[#0A2540]">Preparación para radioyodo (dieta baja en yodo)</strong>
                  <span className="block text-xs text-slate-500">Solo actívalo si tu equipo de salud te indicó dieta baja en yodo. La dieta es temporal y debe seguir las indicaciones del equipo tratante.</span>
                </span>
              </label>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-between gap-3">
          <button type="button" onClick={() => setStep(value => Math.max(1, value - 1))} disabled={step === 1} className="min-h-11 rounded-xl border border-[#e5dceb] px-5 text-sm font-bold text-slate-600 disabled:opacity-40">
            Anterior
          </button>
          {step < total ? (
            <button type="button" onClick={() => setStep(value => value + 1)} className="min-h-11 rounded-xl bg-[#0A2540] px-5 text-sm font-bold text-white hover:bg-[#123b5f]">
              Continuar
            </button>
          ) : (
            <button type="button" onClick={finish} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2CB1A1] px-5 text-sm font-bold text-white hover:bg-[#27a08f]">
              <Check className="h-4 w-4" /> Empezar
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export function FstProfile() {
  const { state, updateProfile, update } = useFstApp();
  const profile = state.profile;
  const set = (key, value) => updateProfile({ [key]: value });

  return (
    <>
      <PageHeading eyebrow="Perfil" title="Tu información" description="Toda la información es opcional y editable. No se usa para diagnosticar." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Historia tiroidea" icon={UserRound}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre"><input value={profile.firstName} onChange={e => set('firstName', e.target.value)} /></Field>
            <Field label="Apellido"><input value={profile.lastName} onChange={e => set('lastName', e.target.value)} /></Field>
            <Field label="Condición tiroidea">
              <select value={profile.condition} onChange={e => set('condition', e.target.value)}>
                <option value="">Selecciona</option>
                {conditionOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Tiroidectomía">
              <select value={profile.surgery} onChange={e => set('surgery', e.target.value)}>
                <option value="">Selecciona</option>
                {surgeryOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Tratamiento">
              <select value={profile.treatment} onChange={e => set('treatment', e.target.value)}>
                <option value="">Selecciona</option>
                <option>Levotiroxina</option>
                <option>Levotiroxina + otro medicamento</option>
                <option>Sin medicamento</option>
                <option>No estoy segura</option>
              </select>
            </Field>
            <Field label="Dosis de levotiroxina" hint="Como aparece en tu caja o frasco.">
              <input value={profile.levoDose} onChange={e => set('levoDose', e.target.value)} placeholder="Ej. 100 mcg" />
            </Field>
            <Field label="Horario habitual">
              <input type="time" value={profile.levoTime} onChange={e => set('levoTime', e.target.value)} />
            </Field>
            <Field label="País">
              <input value={profile.country} onChange={e => set('country', e.target.value)} />
            </Field>
          </div>
        </Panel>

        <Panel title="Nutrición y cuerpo" icon={Apple}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Objetivo nutricional">
              <select value={profile.nutritionGoal} onChange={e => set('nutritionGoal', e.target.value)}>
                <option value="">Selecciona</option>
                {goalOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Alergias"><input value={profile.allergies} onChange={e => set('allergies', e.target.value)} /></Field>
            <Field label="Intolerancias"><input value={profile.intolerances} onChange={e => set('intolerances', e.target.value)} /></Field>
            <Field label="Peso (kg)"><input type="number" inputMode="decimal" value={profile.weight} onChange={e => set('weight', e.target.value)} /></Field>
            <Field label="Estatura (cm)"><input type="number" inputMode="decimal" value={profile.height} onChange={e => set('height', e.target.value)} /></Field>
            <Field label="Preferencias" hint="Separa con comas.">
              <input value={profile.foodPreferences.join(', ')} onChange={e => set('foodPreferences', e.target.value.split(',').map(item => item.trim()).filter(Boolean))} />
            </Field>
            <Field label="Presupuesto">
              <select value={profile.budget} onChange={e => set('budget', e.target.value)}>
                {budgetOptions.map(option => <option key={option} value={option}>{option === 'bajo' ? 'Económico' : option === 'medio' ? 'Medio' : 'Amplio'}</option>)}
              </select>
            </Field>
            <Field label="Tiempo para cocinar">
              <select value={profile.cookTime} onChange={e => set('cookTime', Number(e.target.value))}>
                {cookTimeOptions.map(option => <option key={option} value={option}>{option} minutos</option>)}
              </select>
            </Field>
            <Field label="Personas en casa">
              <input type="number" min="1" max="8" value={profile.people} onChange={e => set('people', Number(e.target.value) || 1)} />
            </Field>
          </div>
        </Panel>

        <Panel title="Suplementos registrados" icon={Sparkles}>
          {profile.supplements.length ? (
            <div className="space-y-3">
              {profile.supplements.map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0A2540]">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.dose} · {item.time || 'Sin horario'}{item.note ? ` · ${item.note}` : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateProfile({ supplements: profile.supplements.filter(s => s.id !== item.id) })}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Sparkles} title="Sin suplementos registrados" text="Agrega suplementos desde el escáner de suplementos." action={<Link to="/fst-app/suplementos" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Ir al escáner</Link>} />
          )}
        </Panel>

        <Panel title="Modo especial" icon={Stethoscope}>
          <label className="flex items-start gap-3 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-4">
            <input
              type="checkbox"
              checked={profile.lowIodineMode}
              onChange={e => set('lowIodineMode', e.target.checked)}
              className="mt-1 h-5 w-5 accent-[#9274C9]"
            />
            <span className="text-sm leading-6 text-slate-600">
              <strong className="text-[#0A2540]">Preparación para radioyodo (dieta baja en yodo)</strong>
              <span className="block text-xs text-slate-500">Solo actívalo si tu equipo de salud te lo indicó. La dieta es temporal.</span>
            </span>
          </label>
          <p className="mt-3 text-xs leading-5 text-slate-500">La dieta baja en yodo es temporal y debe realizarse siguiendo las indicaciones del equipo tratante.</p>
        </Panel>
      </div>
    </>
  );
}

export function FstProgress() {
  const { state, update, add } = useFstApp();
  const [weight, setWeight] = useState('');
  const [range, setRange] = useState(7);
  const symptoms = state.symptoms;
  const weights = state.weights;

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - range);
    return symptoms
      .filter(item => new Date(item.date) >= cutoff)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [symptoms, range]);

  const byName = useMemo(() => {
    const map = {};
    for (const item of filtered) {
      if (!map[item.name]) map[item.name] = [];
      map[item.name].push(item);
    }
    return map;
  }, [filtered]);

  const addWeight = event => {
    event.preventDefault();
    if (!weight) return;
    add('weights', { id: uid('w'), date: today(), value: Number(weight) });
    setWeight('');
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
                const sorted = [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
                const first = Number(sorted[0].intensity);
                const last = Number(sorted[sorted.length - 1].intensity);
                const trend = last < first ? 'disminuyó' : last > first ? 'aumentó' : 'se mantuvo';
                const max = Math.max(...sorted.map(item => Number(item.intensity)), 1);
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0A2540]">{name}</p>
                      <span className={`text-xs font-bold ${trend === 'aumentó' ? 'text-amber-600' : trend === 'disminuyó' ? 'text-emerald-600' : 'text-slate-500'}`}>{trend}</span>
                    </div>
                    <div className="mt-2 flex h-16 items-end gap-1">
                      {sorted.map(item => (
                        <div key={item.id} className="group relative flex-1">
                          <div
                            className="rounded-t-md bg-[#2CB1A1] transition-all"
                            style={{ height: `${Math.max(8, (Number(item.intensity) / 10) * 100)}%` }}
                            title={`${item.date}: ${item.intensity}/10`}
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
          {weights.length ? (
            <div className="mt-4 space-y-2">
              {[...weights].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 10).map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                  <p className="text-sm font-semibold text-[#0A2540]">{item.value} kg</p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Registra tu peso cuando quieras. Los cambios de peso pueden conversarse con tu equipo de salud.</p>
          )}
        </Panel>

        <Panel title="Registros recientes" description="Comidas, síntomas y levotiroxina" icon={CalendarDays}>
          <div className="space-y-3">
            {[...state.meals].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0A2540]">{item.meal}: {item.description}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
                <Apple className="h-4 w-4 shrink-0 text-[#0B8176]" />
              </div>
            ))}
            {[...state.levoLog].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0A2540]">Levotiroxina · {item.status}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)} · {item.time}</p>
                </div>
                <Pill className="h-4 w-4 shrink-0 text-[#9274C9]" />
              </div>
            ))}
            {!state.meals.length && !state.levoLog.length && <p className="text-sm text-slate-500">Aún no hay registros. Empieza con tu levotiroxina o una comida.</p>}
          </div>
        </Panel>
      </div>
    </>
  );
}
