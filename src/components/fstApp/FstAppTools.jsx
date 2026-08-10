/**
 * ============================================================
 *  FstAppTools.jsx — Herramientas de NutriFST IA
 * ============================================================
 */

import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Apple, ArrowRight, BookOpen, CalendarDays, Check, ChefHat, ClipboardList,
  FileText, HeartPulse, Pill, Plus, RefreshCw, Send,
  ShieldCheck, ShoppingBasket, Sparkles, Stethoscope, Trash2, Upload,
} from 'lucide-react';
import { useFstApp, symptomOptions } from '../../context/FstAppContext';
import {
  analyzeQuestion, buildWeeklyMenu, replaceMeal, buildShoppingList, checkInteractions,
  buildConsultationReport, mealLabels, uid,
} from '../../lib/fstApp/nutrifst';
import { findFood } from '../../data/fstApp/alimentos';
import { downloadConsultationPdf } from '../../lib/fstApp/pdf';
import { PageHeading, Panel, Field, SafetyNote, EmptyState, AnswerCard, EvidenceButton, LevelBadge, Chip } from '../fstApp/ui';

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : '';

const suggestionChips = [
  '¿Puedo tomar café?',
  '¿El calcio interfiere con mi levotiroxina?',
  'Hazme un menú para esta semana',
  'Cocina con lo que tengo: pollo, arroz, huevo',
  'Analiza este plato: arroz, pollo, ensalada',
  '¿Qué puedo desayunar?',
];

export function NutriFstChat() {
  const { state, update } = useFstApp();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [menuResult, setMenuResult] = useState(null);
  const [cookResult, setCookResult] = useState(null);
  const [plateResult, setPlateResult] = useState(null);
  const listRef = useRef(null);

  const send = (text) => {
    const question = (text ?? input).trim();
    if (!question || typing) return;
    setInput('');
    setTyping(true);
    const userMessage = { id: uid('chat'), role: 'user', text: question, at: new Date().toISOString() };
    update('chatHistory', items => [userMessage, ...items]);
    window.setTimeout(() => {
      const answer = analyzeQuestion(question, state.profile);
      const assistantMessage = {
        id: uid('chat'),
        role: 'assistant',
        text: answer.brief,
        at: new Date().toISOString(),
        level: answer.level,
        evidence: answer.evidence,
        redNote: answer.redNote,
      };
      update('chatHistory', items => [assistantMessage, ...items]);
      setMenuResult(answer.menu || null);
      setCookResult(answer.recipes || null);
      setPlateResult(answer.estimate || null);
      setTyping(false);
      window.setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }, 700);
  };

  const clearChat = () => update('chatHistory', []);

  return (
    <>
      <PageHeading
        eyebrow="NutriFST IA"
        title="Pregúntale a NutriFST"
        description="Alimentos, interacciones con levotiroxina, menús, suplementos y más. Respuestas educativas con evidencia verificable."
        action={
          <button type="button" onClick={clearChat} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e5dceb] px-3 text-xs font-bold text-slate-500 hover:bg-[#faf8fd]">
            <RefreshCw className="h-3.5 w-3.5" /> Limpiar conversación
          </button>
        }
      />

      <SafetyNote>NutriFST no diagnostica, no modifica dosis ni reemplaza a tu profesional de salud. Ante una emergencia, busca atención médica inmediata.</SafetyNote>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 fst-scrollbar-thin" aria-label="Preguntas sugeridas">
        {suggestionChips.map(chip => (
          <button key={chip} type="button" onClick={() => send(chip)} className="shrink-0 rounded-full border border-[#eae2f8] bg-white px-3 py-2 text-xs font-semibold text-[#9274C9] hover:bg-[#f7f3fb]">
            {chip}
          </button>
        ))}
      </div>

      <div ref={listRef} className="mt-4 space-y-4">
        {state.chatHistory.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[92%] sm:max-w-[80%] ${message.role === 'user' ? 'rounded-2xl rounded-br-md bg-[#0A2540] px-4 py-3 text-sm leading-6 text-white' : 'w-full'}`}>
              {message.role === 'user' ? (
                <p className="whitespace-pre-line">{message.text}</p>
              ) : (
                <div className="rounded-2xl border border-[#f0eaf5] bg-white p-4 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">
                      <Sparkles className="h-3.5 w-3.5" /> NutriFST
                    </span>
                    <LevelBadge level={message.level} />
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{message.text}</p>
                  {message.redNote && <p className="mt-2 text-xs font-bold text-rose-700">{message.redNote}</p>}
                  <EvidenceButton evidenceIds={message.evidence} compact />
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl border border-[#f0eaf5] bg-white px-4 py-3 shadow-sm">
              <span className="fst-typing-dot h-2 w-2 rounded-full bg-[#9274C9]" />
              <span className="fst-typing-dot h-2 w-2 rounded-full bg-[#9274C9]" />
              <span className="fst-typing-dot h-2 w-2 rounded-full bg-[#9274C9]" />
            </div>
          </div>
        )}
      </div>

      {menuResult && (
        <div className="mt-6 rounded-2xl border border-[#eae2f8] bg-[#faf8fd] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#0A2540]">Tu menú generado</p>
            <Link to="/fst-app/menus" className="inline-flex items-center gap-1 text-xs font-bold text-[#9274C9]">Abrir en Mis menús <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.entries(menuResult).map(([meal, recipe]) => (
              <div key={meal} className="rounded-xl border border-[#f0eaf5] bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">{mealLabels[meal]}</p>
                <p className="mt-1 text-sm font-semibold text-[#0A2540]">{recipe.name}</p>
                <p className="text-xs text-slate-500">{recipe.time} min · {recipe.cost === 'bajo' ? 'económica' : recipe.cost === 'alto' ? 'amplia' : 'media'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cookResult && (
        <div className="mt-6 rounded-2xl border border-[#eae2f8] bg-[#faf8fd] p-5">
          <p className="text-sm font-bold text-[#0A2540]">Opciones con tus ingredientes</p>
          <div className="mt-3 space-y-2">
            {cookResult.map(recipe => (
              <details key={recipe.id} className="rounded-xl border border-[#f0eaf5] bg-white">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[#0A2540]">
                  {recipe.name} <span className="text-xs font-normal text-slate-500">{recipe.time} min</span>
                </summary>
                <div className="border-t border-[#f3eef7] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Ingredientes</p>
                  <p className="mt-1 text-sm text-slate-600">{recipe.ingredients.map(item => `${item.amount} ${item.unit} de ${item.name}`).join(', ')}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#9274C9]">Preparación</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-4 text-sm text-slate-600">
                    {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                  </ol>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {plateResult && (
        <div className="mt-6 rounded-2xl border border-[#eae2f8] bg-[#faf8fd] p-5">
          <p className="text-sm font-bold text-[#0A2540]">Estimación de tu plato</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ['Proteína', `${Math.round(plateResult.totals.protein)} g`],
              ['Fibra', `${Math.round(plateResult.totals.fiber)} g`],
              ['Carbohidratos', `${Math.round(plateResult.totals.carbs)} g`],
              ['Grasas', `${Math.round(plateResult.totals.fats)} g`],
              ['Energía', `${Math.round(plateResult.totals.kcal)} kcal`],
              ['Vegetales', plateResult.totals.vegetables >= 1 ? 'Sí' : 'No detectados'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[#f0eaf5] bg-white p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#0A2540]">{value}</p>
              </div>
            ))}
          </div>
          <Link to="/fst-app/escaneo" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Registrar esta comida en mi diario <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      )}

      <form
        onSubmit={event => { event.preventDefault(); send(); }}
        className="sticky bottom-20 mt-6 flex gap-2 rounded-2xl border border-[#f0eaf5] bg-white p-2 shadow-[0_2px_16px_rgba(10,37,64,0.08)] lg:bottom-4"
      >
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Escribe tu pregunta... ej. ¿Puedo comer esto?"
          className="min-h-11 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 text-sm focus:outline-none"
          aria-label="Pregunta para NutriFST"
        />
        <button type="submit" disabled={typing || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A2540] text-white hover:bg-[#123b5f] disabled:opacity-40" aria-label="Enviar pregunta">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </>
  );
}

export function LevoSection() {
  const { state, update, add } = useFstApp();
  const profile = state.profile;
  const [time, setTime] = useState(profile.levoTime || '');
  const [dose, setDose] = useState(profile.levoDose || '');
  const [note, setNote] = useState('');
  const interactions = useMemo(() => checkInteractions(profile), [profile]);

  const saveTime = () => {
    update('profile', current => ({ ...current, levoTime: time, levoDose: dose }));
  };

  const logToday = () => {
    const existing = state.levoLog.find(item => item.date === today());
    if (existing) {
      update('levoLog', items => items.map(item => item.id === existing.id ? { ...item, status: 'Tomada', time: time || profile.levoTime, note } : item));
    } else {
      add('levoLog', { id: uid('levo'), date: today(), time: time || profile.levoTime, status: 'Tomada', note });
    }
    setNote('');
  };

  const timeline = [...state.levoLog].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 14);

  return (
    <>
      <PageHeading eyebrow="Mi medicamento" title="Registrar mi levotiroxina" description="Guarda tu horario y marca tu toma diaria. Nunca te sugeriremos cambiar dosis: eso es decisión de tu equipo de salud." />
      <SafetyNote>Esta herramienta organiza tu registro. No modifica dosis, no suspende medicamentos y no reemplaza la indicación de tu profesional.</SafetyNote>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Mi horario" description="La hora habitual en la que tomas tu levotiroxina" icon={Pill}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hora habitual">
              <input type="time" value={time} onChange={event => setTime(event.target.value)} />
            </Field>
            <Field label="Dosis" hint="Como aparece en tu caja o frasco.">
              <input value={dose} onChange={event => setDose(event.target.value)} placeholder="Ej. 100 mcg" />
            </Field>
          </div>
          <button type="button" onClick={saveTime} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
            <Check className="h-4 w-4" /> Guardar horario
          </button>
          <div className="mt-5 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Recordatorio educativo</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">La práctica habitual es tomar la levotiroxina en ayunas, con agua, y separarla de café, té, lácteos, soya y suplementos minerales según la indicación de tu profesional.</p>
            <EvidenceButton evidenceIds={['horario-levotiroxina-2010', 'absorcion-levotiroxina-2017']} compact />
          </div>
        </Panel>

        <Panel title="Registrar toma de hoy" description="Marca tu dosis del día" icon={CalendarDays}>
          <div className="flex items-center justify-between rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-4">
            <div>
              <p className="text-sm font-semibold text-[#0A2540]">Hoy · {formatDate(today())}</p>
              <p className="text-xs text-slate-500">{time || profile.levoTime || 'Sin horario registrado'} · {dose || profile.levoDose || 'Sin dosis registrada'}</p>
            </div>
            {state.levoLog.find(item => item.date === today())?.status === 'Tomada' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><Check className="h-3.5 w-3.5" /> Registrada</span>
            ) : (
              <button type="button" onClick={logToday} className="rounded-full bg-[#2CB1A1] px-4 py-2 text-xs font-bold text-white hover:bg-[#27a08f]">Registrar toma</button>
            )}
          </div>
          <Field label="Nota (opcional)" hint="Ej. la tomé más tarde por un cambio de rutina.">
            <textarea rows="2" value={note} onChange={event => setNote(event.target.value)} placeholder="Sin juicios: registrar ayuda a conversar con tu equipo." />
          </Field>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Línea de tiempo" description="Tus últimos 14 registros" icon={CalendarDays}>
          {timeline.length ? (
            <div className="space-y-0">
              {timeline.map((item, index) => (
                <div key={item.id} className="relative flex gap-3 pb-4">
                  {index < timeline.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-[#eae2f8]" />}
                  <span className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${item.status === 'Tomada' ? 'border-[#2CB1A1] bg-[#2CB1A1]' : 'border-amber-400 bg-amber-50'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A2540]">{formatDate(item.date)} · {item.time}</p>
                    <p className="text-xs text-slate-500">{item.status}{item.note ? ` — ${item.note}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Pill} title="Aún no hay registros" text="Marca tu toma de hoy para empezar tu línea de tiempo." />
          )}
        </Panel>

        <Panel title="Revisión de interacciones" description="Levotiroxina + alimentos + bebidas + suplementos + horario" icon={ShieldCheck}>
          {interactions.length ? (
            <div className="space-y-3">
              {interactions.map((item, index) => (
                <div key={index} className={`rounded-xl border p-3 ${item.level === 'rojo' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
                  <p className={`text-xs font-bold ${item.level === 'rojo' ? 'text-rose-700' : 'text-amber-800'}`}>{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                  <EvidenceButton evidenceIds={item.evidence} compact />
                </div>
              ))}
              <p className="text-[11px] leading-4 text-slate-500">Nunca aumentes, disminuyas ni suspendas dosis por esta revisión: conversa primero con tu profesional.</p>
            </div>
          ) : (
            <EmptyState
              icon={ShieldCheck}
              title="Sin interferencias evidentes"
              text="Registra tu horario y tus suplementos para revisar posibles interacciones."
              action={<Link to="/fst-app/suplementos" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A2540] px-4 text-xs font-bold text-white">Registrar suplementos</Link>}
            />
          )}
        </Panel>
      </div>
    </>
  );
}

export function FoodCheckSection() {
  const { state } = useFstApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const check = event => {
    event.preventDefault();
    if (!query.trim()) return;
    const food = findFood(query);
    setResult(food || { id: 'desconocido', name: query, general: 'No tengo información específica registrada para este alimento.', levo: { level: 'verde', text: 'Sin datos específicos de interacción con levotiroxina.' }, supplements: 'Sin datos específicos.', lowIodine: 'Si estás en dieta baja en yodo, revisa la etiqueta.', tips: ['Revisa la etiqueta si es un producto envasado.', 'Registra cómo te sientes si tienes dudas.', 'Lleva la etiqueta a tu consulta.'], evidence: [] });
  };

  return (
    <>
      <PageHeading eyebrow="Herramienta rápida" title="¿Puedo comer esto?" description={'Escribe un alimento o bebida y revisa su información, su relación con la levotiroxina y sus consideraciones. Sin categorías absolutas de "bueno" o "malo".'} />
      <SafetyNote>Esta herramienta ofrece información educativa. No es una prescripción ni una prohibición: las decisiones alimentarias se conversan con tu equipo de salud.</SafetyNote>

      <form onSubmit={check} className="mt-6 flex gap-2 rounded-2xl border border-[#f0eaf5] bg-white p-2 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Ej. café, huevo, calcio, brócoli..."
          className="min-h-11 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 text-sm focus:outline-none"
          aria-label="Alimento a revisar"
        />
        <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
          Revisar <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 fst-scrollbar-thin" aria-label="Alimentos frecuentes">
        {['Café', 'Huevo', 'Leche', 'Brócoli', 'Soya', 'Aguacate', 'Pescado', 'Algas'].map(item => (
          <button key={item} type="button" onClick={() => { setQuery(item); setResult(findFood(item)); }} className="shrink-0 rounded-full border border-[#eae2f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#9274C9] hover:bg-[#f7f3fb]">
            {item}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#0A2540]">{result.name}</h2>
            <LevelBadge level={result.levo.level} />
          </div>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Información general</p>
              <p className="mt-1">{result.general}</p>
            </div>
            <div className="rounded-xl border border-[#d3efe9] bg-[#f0faf8] p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#0B8176]">Consideración con levotiroxina</p>
              <p className="mt-1">{result.levo.text}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Consideración con suplementos</p>
              <p className="mt-1">{result.supplements}</p>
            </div>
            {state.profile.lowIodineMode && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Dieta baja en yodo</p>
                <p className="mt-1">{result.lowIodine}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Recomendaciones prácticas</p>
              <ul className="mt-1 space-y-1.5">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CB1A1]" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <EvidenceButton evidenceIds={result.evidence} />
        </div>
      )}
    </>
  );
}

export function PlateScanner() {
  const { state, add } = useFstApp();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [detected, setDetected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [items, setItems] = useState([]);
  const [meal, setMeal] = useState('Almuerzo');
  const [saved, setSaved] = useState(false);

  const onImage = file => {
    if (!file) return;
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    setDetected([
      { name: 'huevo', amount: 1 },
      { name: 'aguacate', amount: 0.5 },
      { name: 'arepa', amount: 1 },
      { name: 'cafe', amount: 1 },
    ]);
    setConfirmed(false);
    setItems([
      { name: 'huevo', amount: 1 },
      { name: 'aguacate', amount: 0.5 },
      { name: 'arepa', amount: 1 },
      { name: 'cafe', amount: 1 },
    ]);
    setSaved(false);
  };

  const confirm = () => {
    setConfirmed(true);
    setDetected(null);
  };

  const saveMeal = () => {
    const description = items.map(item => `${item.amount} ${item.name}`).join(', ');
    add('meals', { id: uid('meal'), date: today(), meal, description, items });
    setSaved(true);
  };

  return (
    <>
      <PageHeading eyebrow="Escáner de comidas" title="Analiza tu plato" description="Sube una fotografía de tu comida. La IA identifica tentativamente los alimentos y tú confirmas antes de analizar." />
      <SafetyNote>La identificación de alimentos es tentativa y puede fallar. Siempre revisa y corrige antes de guardar.</SafetyNote>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Sube tu foto" icon={Upload}>
          {imageUrl ? (
            <div className="overflow-hidden rounded-xl border border-[#f0eaf5]">
              <img src={imageUrl} alt="Tu plato" className="max-h-72 w-full object-cover" />
            </div>
          ) : (
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e5dceb] bg-[#faf8fd] p-6 text-center hover:border-[#d8cce8]">
              <Upload className="h-8 w-8 text-[#9274C9]" />
              <span className="text-sm font-semibold text-[#0A2540]">Toca para subir una foto de tu plato</span>
              <span className="text-xs text-slate-500">JPG o PNG · La foto se procesa en tu navegador</span>
              <input type="file" accept="image/*" className="sr-only" onChange={event => onImage(event.target.files?.[0])} />
            </label>
          )}
          {imageUrl && (
            <button type="button" onClick={() => { setImageUrl(''); setImage(null); setDetected(null); setConfirmed(false); setSaved(false); }} className="mt-3 text-xs font-bold text-slate-500 hover:text-rose-600">
              Quitar foto
            </button>
          )}
        </Panel>

        <Panel title="Alimentos detectados" icon={ChefHat}>
          {!imageUrl && <EmptyState icon={ChefHat} title="Esperando tu foto" text="Sube una fotografía para que NutriFST intente identificar los alimentos." />}
          {imageUrl && !confirmed && detected && (
            <>
              <p className="text-sm text-slate-600">Creo que veo:</p>
              <ul className="mt-2 space-y-1.5">
                {detected.map(item => (
                  <li key={item.name} className="flex items-center gap-2 text-sm font-semibold text-[#0A2540]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2CB1A1]" /> {item.name} · {item.amount}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-bold text-[#0A2540]">¿Es correcto?</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={confirm} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2CB1A1] px-4 text-sm font-bold text-white hover:bg-[#27a08f]">
                  <Check className="h-4 w-4" /> Sí, es correcto
                </button>
                <button type="button" onClick={() => setDetected(null)} className="min-h-11 rounded-xl border border-[#e5dceb] px-4 text-sm font-bold text-slate-600">
                  No, corregir
                </button>
              </div>
            </>
          )}
          {imageUrl && (confirmed || !detected) && (
            <>
              <p className="text-sm font-bold text-[#0A2540]">Corrige los alimentos y cantidades</p>
              <div className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={item.name}
                      onChange={event => setItems(list => list.map((entry, i) => i === index ? { ...entry, name: event.target.value } : entry))}
                      className="min-h-10 min-w-0 flex-1 rounded-xl border border-[#e5dceb] px-3 text-sm"
                      aria-label={`Alimento ${index + 1}`}
                    />
                    <input
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={item.amount}
                      onChange={event => setItems(list => list.map((entry, i) => i === index ? { ...entry, amount: Number(event.target.value) || 1 } : entry))}
                      className="min-h-10 w-20 rounded-xl border border-[#e5dceb] px-3 text-sm"
                      aria-label={`Cantidad de ${item.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => setItems(list => list.filter((_, i) => i !== index))}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Quitar alimento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setItems(list => [...list, { name: '', amount: 1 }])} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#9274C9]">
                <Plus className="h-3.5 w-3.5" /> Agregar alimento
              </button>
              <div className="mt-4">
                <Field label="Comida">
                  <select value={meal} onChange={event => setMeal(event.target.value)}>
                    <option>Desayuno</option>
                    <option>Almuerzo</option>
                    <option>Cena</option>
                    <option>Snack</option>
                  </select>
                </Field>
              </div>
              <button type="button" onClick={saveMeal} disabled={!items.some(item => item.name.trim())} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f] disabled:opacity-40">
                <Check className="h-4 w-4" /> Guardar y analizar
              </button>
            </>
          )}
          {saved && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              Comida registrada. Puedes ver el desglose estimado en NutriFST o en tu progreso.
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

export function MenusSection() {
  const { state, update } = useFstApp();
  const [menu, setMenu] = useState(state.menu);
  const [activeDay, setActiveDay] = useState(0);
  const [optionOpen, setOptionOpen] = useState(null);

  const generate = () => {
    const next = buildWeeklyMenu(state.profile);
    setMenu(next);
    update('menu', next);
  };

  const changeMeal = (dayIndex, meal, option) => {
    const result = replaceMeal(menu, dayIndex, meal, option);
    setMenu(result.menu);
    update('menu', result.menu);
    setOptionOpen(null);
  };

  const buildList = () => {
    if (!menu) return;
    const recipes = menu.flatMap(day => [day.desayuno, day.almuerzo, day.cena, day.snack]);
    const list = buildShoppingList(recipes);
    update('shoppingList', list);
  };

  const day = menu?.[activeDay];

  return (
    <>
      <PageHeading
        eyebrow="Mis menús"
        title="Menús con IA"
        description="Menús personalizados según tu objetivo, país, presupuesto, preferencias y tiempo para cocinar."
        action={
          <button type="button" onClick={generate} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
            <RefreshCw className="h-4 w-4" /> Generar menú semanal
          </button>
        }
      />

      {!menu ? (
        <div className="mt-6">
          <EmptyState
            icon={BookOpen}
            title="Aún no tienes un menú"
            text="Genera un menú semanal con desayuno, almuerzo, cena y snack, adaptado a tu perfil."
            action={<button type="button" onClick={generate} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0A2540] px-5 text-sm font-bold text-white">Generar mi menú</button>}
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 fst-scrollbar-thin" role="tablist" aria-label="Días de la semana">
            {menu.map((dayItem, index) => (
              <button
                key={dayItem.day}
                type="button"
                role="tab"
                aria-selected={activeDay === index}
                onClick={() => { setActiveDay(index); setOptionOpen(null); }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeDay === index ? 'bg-[#0A2540] text-white' : 'border border-[#e5dceb] bg-white text-slate-600'}`}
              >
                {dayItem.day}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {['desayuno', 'almuerzo', 'cena', 'snack'].map(meal => {
              const recipe = day[meal];
              return (
                <div key={meal} className="rounded-2xl border border-[#f0eaf5] bg-white p-4 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">{mealLabels[meal]}</p>
                    <button type="button" onClick={() => setOptionOpen(optionOpen === `${activeDay}-${meal}` ? null : `${activeDay}-${meal}`)} className="rounded-full border border-[#eae2f8] px-3 py-1 text-[11px] font-bold text-[#9274C9] hover:bg-[#f7f3fb]">
                      Cambiar esta comida
                    </button>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-[#0A2540]">{recipe.name}</h3>
                  <p className="text-xs text-slate-500">{recipe.time} min · {recipe.cost === 'bajo' ? 'económica' : recipe.cost === 'alto' ? 'amplia' : 'media'} · {recipe.servings} porción(es)</p>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-bold text-[#0B8176]">Ver ingredientes y preparación</summary>
                    <div className="mt-2 border-t border-[#f3eef7] pt-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Ingredientes</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{recipe.ingredients.map(item => `${item.amount} ${item.unit} de ${item.name}`).join(', ')}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#9274C9]">Preparación</p>
                      <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs leading-5 text-slate-600">
                        {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                      </ol>
                    </div>
                  </details>
                  {optionOpen === `${activeDay}-${meal}` && (
                    <div className="mt-3 space-y-1.5 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">¿Cómo la prefieres?</p>
                      {[
                        ['economica', 'Más económica'],
                        ['rapida', 'Más rápida'],
                        ['otros-ingredientes', 'Con otros ingredientes'],
                        ['no-tengo', 'No tengo este alimento'],
                        ['no-me-gusta', 'No me gusta'],
                      ].map(([option, label]) => (
                        <button key={option} type="button" onClick={() => changeMeal(activeDay, meal, option)} className="block w-full rounded-lg border border-[#f0eaf5] bg-white px-3 py-2 text-left text-xs font-semibold text-[#0A2540] hover:border-[#d8cce8]">
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={buildList} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2CB1A1] px-5 text-sm font-bold text-white hover:bg-[#27a08f]">
              <ShoppingBasket className="h-4 w-4" /> Crear lista de compras
            </button>
            <Link to="/fst-app/lista" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e5dceb] px-5 text-sm font-bold text-[#0A2540] hover:bg-[#faf8fd]">
              Ver mi lista <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export function CookSection() {
  const { state, update } = useFstApp();
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState(null);

  const cook = event => {
    event.preventDefault();
    if (!ingredients.trim()) return;
    const list = ingredients.split(',').map(item => item.trim()).filter(Boolean);
    const answer = analyzeQuestion(`Cocina con lo que tengo: ${list.join(', ')}`, state.profile);
    setResults(answer.recipes || []);
  };

  return (
    <>
      <PageHeading eyebrow="Cocina con lo que tengo" title="¿Qué puedo cocinar hoy?" description="Escribe los ingredientes que tienes en casa y NutriFST te propone opciones que los aprovechan." />
      <form onSubmit={cook} className="mt-6 flex gap-2 rounded-2xl border border-[#f0eaf5] bg-white p-2 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
        <input
          value={ingredients}
          onChange={event => setIngredients(event.target.value)}
          placeholder="Ej. pollo, arroz, huevo, tomate y aguacate"
          className="min-h-11 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 text-sm focus:outline-none"
          aria-label="Ingredientes disponibles"
        />
        <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
          <ChefHat className="h-4 w-4" /> Cocinar
        </button>
      </form>

      {results && (
        <div className="mt-6 space-y-3">
          {results.map(recipe => (
            <details key={recipe.id} className="rounded-2xl border border-[#f0eaf5] bg-white shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-[#0A2540]">
                {recipe.name} <span className="text-xs font-normal text-slate-500">{recipe.time} min · {recipe.cost === 'bajo' ? 'económica' : recipe.cost === 'alto' ? 'amplia' : 'media'}</span>
              </summary>
              <div className="border-t border-[#f3eef7] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Ingredientes</p>
                <p className="mt-1 text-sm text-slate-600">{recipe.ingredients.map(item => `${item.amount} ${item.unit} de ${item.name}`).join(', ')}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#9274C9]">Preparación</p>
                <ol className="mt-1 list-decimal space-y-1 pl-4 text-sm text-slate-600">
                  {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
                {recipe.notes && <p className="mt-3 rounded-xl bg-[#faf8fd] p-3 text-xs leading-5 text-slate-500">{recipe.notes}</p>}
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

export function ShoppingListSection() {
  const { state, update } = useFstApp();
  const [checked, setChecked] = useState({});
  const [have, setHave] = useState({});
  const list = state.shoppingList;

  const toggle = (group, name) => {
    const key = `${group}:${name}`;
    setChecked(current => ({ ...current, [key]: !current[key] }));
  };

  const toggleHave = (group, name) => {
    const key = `${group}:${name}`;
    setHave(current => ({ ...current, [key]: !current[key] }));
  };

  if (!list) {
    return (
      <>
        <PageHeading eyebrow="Lista de compras" title="Tu lista de mercado" description="Se genera automáticamente a partir de tu menú semanal." />
        <EmptyState
          icon={ShoppingBasket}
          title="Aún no hay lista"
          text="Genera un menú semanal y crea la lista de compras desde la sección Mis menús."
          action={<Link to="/fst-app/menus" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0A2540] px-5 text-sm font-bold text-white">Ir a Mis menús</Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Lista de compras" title="Tu lista de mercado" description="Marca lo que ya compraste o indica que ya lo tienes en casa." />
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(list).map(([groupKey, group]) => (
          <Panel key={groupKey} title={group.label} icon={ShoppingBasket}>
            {group.items.length ? (
              <div className="space-y-2">
                {group.items.map(item => {
                  const key = `${groupKey}:${item.name}`;
                  const isChecked = checked[key];
                  const isHave = have[key];
                  return (
                    <div key={key} className={`flex items-center gap-3 rounded-xl border p-3 ${isChecked ? 'border-emerald-200 bg-emerald-50/50' : 'border-[#f0eaf5] bg-white'}`}>
                      <button type="button" onClick={() => toggle(groupKey, item.name)} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${isChecked ? 'border-[#2CB1A1] bg-[#2CB1A1] text-white' : 'border-[#e5dceb] bg-white'}`} aria-label={`Marcar ${item.name} como comprado`}>
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${isChecked ? 'text-slate-400 line-through' : 'text-[#0A2540]'}`}>{item.name}</p>
                        <p className="text-xs text-slate-500">{item.amount} {item.unit} · para: {item.recipes.join(', ')}</p>
                      </div>
                      <button type="button" onClick={() => toggleHave(groupKey, item.name)} className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${isHave ? 'bg-[#EAE2F8] text-[#6b4fa8]' : 'border border-[#e5dceb] text-slate-500'}`}>
                        {isHave ? 'Ya lo tengo' : 'Ya lo tengo'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Nada en esta categoría.</p>
            )}
          </Panel>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">¿Te falta un ingrediente? Puedes buscar un sustituto en NutriFST preguntando: "¿con qué puedo reemplazar X?"</p>
    </>
  );
}

export function SupplementsSection() {
  const { state, updateProfile } = useFstApp();
  const [imageUrl, setImageUrl] = useState('');
  const [detected, setDetected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ name: '', dose: '', time: '', note: '' });
  const supplements = state.profile.supplements;

  const onImage = file => {
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setDetected([
      { name: 'Calcio', dose: '500 mg', time: '13:00' },
      { name: 'Vitamina D', dose: '1000 UI', time: '13:00' },
    ]);
    setConfirmed(false);
    setForm({ name: 'Calcio', dose: '500 mg', time: '13:00', note: '' });
  };

  const confirm = () => {
    setConfirmed(true);
    setDetected(null);
  };

  const save = () => {
    if (!form.name.trim()) return;
    updateProfile({ supplements: [...supplements, { id: uid('sup'), ...form }] });
    setForm({ name: '', dose: '', time: '', note: '' });
    setImageUrl('');
    setConfirmed(false);
  };

  return (
    <>
      <PageHeading eyebrow="Escáner de suplementos" title="Revisa tus suplementos" description="Sube una fotografía de la etiqueta. Detectamos tentativamente los componentes y tú confirmas antes de guardar." />
      <SafetyNote>No recomendamos iniciar suplementos automáticamente. Esta herramienta solo organiza lo que ya tomas y señala consideraciones para conversar con tu profesional.</SafetyNote>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Sube la etiqueta" icon={Upload}>
          {imageUrl ? (
            <div className="overflow-hidden rounded-xl border border-[#f0eaf5]">
              <img src={imageUrl} alt="Etiqueta del suplemento" className="max-h-72 w-full object-cover" />
            </div>
          ) : (
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e5dceb] bg-[#faf8fd] p-6 text-center hover:border-[#d8cce8]">
              <Upload className="h-8 w-8 text-[#9274C9]" />
              <span className="text-sm font-semibold text-[#0A2540]">Toca para subir la foto de la etiqueta</span>
              <span className="text-xs text-slate-500">JPG o PNG · La foto se procesa en tu navegador</span>
              <input type="file" accept="image/*" className="sr-only" onChange={event => onImage(event.target.files?.[0])} />
            </label>
          )}
          {imageUrl && (
            <button type="button" onClick={() => { setImageUrl(''); setDetected(null); setConfirmed(false); }} className="mt-3 text-xs font-bold text-slate-500 hover:text-rose-600">
              Quitar foto
            </button>
          )}
        </Panel>

        <Panel title="Componentes detectados" icon={Sparkles}>
          {!imageUrl && <EmptyState icon={Sparkles} title="Esperando la etiqueta" text="Sube una fotografía para detectar vitaminas, minerales y otros componentes." />}
          {imageUrl && !confirmed && detected && (
            <>
              <p className="text-sm text-slate-600">Detecté tentativamente:</p>
              <ul className="mt-2 space-y-1.5">
                {detected.map(item => (
                  <li key={item.name} className="flex items-center gap-2 text-sm font-semibold text-[#0A2540]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2CB1A1]" /> {item.name} · {item.dose}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-bold text-[#0A2540]">¿Es correcto?</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={confirm} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2CB1A1] px-4 text-sm font-bold text-white hover:bg-[#27a08f]">
                  <Check className="h-4 w-4" /> Sí, es correcto
                </button>
                <button type="button" onClick={() => setDetected(null)} className="min-h-11 rounded-xl border border-[#e5dceb] px-4 text-sm font-bold text-slate-600">
                  No, corregir
                </button>
              </div>
            </>
          )}
          {imageUrl && (confirmed || !detected) && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nombre"><input value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Ej. Calcio" /></Field>
                <Field label="Dosis"><input value={form.dose} onChange={event => setForm(current => ({ ...current, dose: event.target.value }))} placeholder="Ej. 500 mg" /></Field>
                <Field label="Horario"><input type="time" value={form.time} onChange={event => setForm(current => ({ ...current, time: event.target.value }))} /></Field>
                <Field label="Nota"><input value={form.note} onChange={event => setForm(current => ({ ...current, note: event.target.value }))} placeholder="Opcional" /></Field>
              </div>
              <button type="button" onClick={save} disabled={!form.name.trim()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f] disabled:opacity-40">
                <Check className="h-4 w-4" /> Guardar suplemento
              </button>
            </>
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Mis suplementos registrados" description="Revisa consideraciones con tus medicamentos" icon={ClipboardList}>
          {supplements.length ? (
            <div className="space-y-3">
              {supplements.map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0A2540]">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.dose} · {item.time || 'Sin horario'}{item.note ? ` · ${item.note}` : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateProfile({ supplements: supplements.filter(s => s.id !== item.id) })}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <p className="text-[11px] leading-4 text-slate-500">Consideraciones: los minerales (calcio, hierro, zinc) y la biotina pueden interferir con la levotiroxina o los exámenes. Conversa cada suplemento con tu profesional.</p>
            </div>
          ) : (
            <EmptyState icon={ClipboardList} title="Sin suplementos registrados" text="Sube una etiqueta o agrega manualmente los suplementos que tomas." />
          )}
        </Panel>
      </div>
    </>
  );
}

export function SymptomsSection() {
  const { state, add, remove } = useFstApp();
  const [name, setName] = useState('Energía');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');

  const save = event => {
    event.preventDefault();
    add('symptoms', { id: uid('sym'), name, date: today(), intensity, notes });
    setNotes('');
  };

  const recent = [...state.symptoms].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 10);

  return (
    <>
      <PageHeading eyebrow="Diario de síntomas" title="Registra cómo te sientes" description="Energía, sueño, digestión, concentración y más. Sin lenguaje de culpa: registrar es observar, no juzgar." />
      <SafetyNote>Una asociación observada no significa necesariamente que una variable sea la causa de la otra. Lleva tus tendencias a la consulta.</SafetyNote>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Nuevo registro" icon={HeartPulse}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Síntoma">
              <select value={name} onChange={event => setName(event.target.value)}>
                {symptomOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label={`Intensidad: ${intensity}/10`}>
              <input type="range" min="1" max="10" value={intensity} onChange={event => setIntensity(Number(event.target.value))} />
            </Field>
            <Field label="Nota (opcional)">
              <textarea rows="2" value={notes} onChange={event => setNotes(event.target.value)} placeholder="Ej. después del almuerzo, en la tarde..." />
            </Field>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
              <Plus className="h-4 w-4" /> Guardar registro
            </button>
          </form>
        </Panel>

        <Panel title="Registros recientes" icon={CalendarDays}>
          {recent.length ? (
            <div className="space-y-2">
              {recent.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#f0eaf5] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0A2540]">{item.name} · {item.intensity}/10</p>
                    <p className="text-xs text-slate-500">{formatDate(item.date)}{item.notes ? ` — ${item.notes}` : ''}</p>
                  </div>
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-[#f0eaf5]">
                    <div className="h-full rounded-full bg-[#2CB1A1]" style={{ width: `${item.intensity * 10}%` }} />
                  </div>
                  <button type="button" onClick={() => remove('symptoms', item.id)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar registro">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={HeartPulse} title="Sin registros" text="Registra tu primer síntoma para empezar a observar tendencias." />
          )}
        </Panel>
      </div>
    </>
  );
}

export function YodoSection() {
  const { state, updateProfile } = useFstApp();
  const profile = state.profile;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDate, setTargetDate] = useState('');

  const activate = () => {
    updateProfile({ lowIodineMode: true, lowIodineConfirmed: true, yodoTargetDate: targetDate });
    setConfirmOpen(false);
  };

  const deactivate = () => {
    updateProfile({ lowIodineMode: false, lowIodineConfirmed: false });
  };

  const daysLeft = profile.yodoTargetDate
    ? Math.max(0, Math.ceil((new Date(`${profile.yodoTargetDate}T12:00:00`) - new Date()) / 86400000))
    : null;

  return (
    <>
      <PageHeading eyebrow="Modo especial" title="Preparación para radioyodo" description="Un modo independiente con calendario, alimentos, recetas, menú, lista de compras y revisión de suplementos." />
      <SafetyNote>La dieta baja en yodo es temporal y debe realizarse siguiendo las indicaciones del equipo tratante.</SafetyNote>

      {!profile.lowIodineMode ? (
        <div className="mt-6 rounded-2xl border border-[#eae2f8] bg-white p-6 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
          <h2 className="text-lg font-semibold text-[#0A2540]">Activar el modo</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Este modo solo debe activarse si tu equipo de salud te indicó una dieta baja en yodo antes de la yodoterapia o un rastreo.</p>
          <button type="button" onClick={() => setConfirmOpen(true)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-5 text-sm font-bold text-white hover:bg-[#123b5f]">
            <ShieldCheck className="h-4 w-4" /> Activar modo
          </button>
          {confirmOpen && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">Confirmación</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">¿Tu equipo de salud te indicó dieta baja en yodo? Esta herramienta no la prescribe: solo te acompaña si ya la tienes indicada.</p>
              <div className="mt-3">
                <Field label="Fecha de la yodoterapia o rastreo (opcional)">
                  <input type="date" value={targetDate} onChange={event => setTargetDate(event.target.value)} />
                </Field>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={activate} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2CB1A1] px-4 text-sm font-bold text-white hover:bg-[#27a08f]">
                  <Check className="h-4 w-4" /> Sí, mi equipo me lo indicó
                </button>
                <button type="button" onClick={() => setConfirmOpen(false)} className="min-h-11 rounded-xl border border-[#e5dceb] px-4 text-sm font-bold text-slate-600">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Panel title="Cuenta regresiva" icon={CalendarDays}>
              {daysLeft !== null ? (
                <>
                  <p className="text-4xl font-bold text-[#0A2540]">{daysLeft}</p>
                  <p className="text-sm text-slate-500">días para tu fecha registrada</p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Registra la fecha de tu yodoterapia o rastreo en tu perfil para ver la cuenta regresiva.</p>
              )}
            </Panel>
            <Panel title="Alimentos a evitar" icon={Apple}>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• Algas y suplementos con algas o kelp</li>
                <li>• Mariscos y pescados de mar</li>
                <li>• Sal yodada y sal marina</li>
                <li>• Lácteos (según indicación)</li>
                <li>• Yema de huevo (según indicación)</li>
                <li>• Procesados con sal yodada</li>
              </ul>
            </Panel>
            <Panel title="Suplementos" icon={Sparkles}>
              <p className="text-sm leading-6 text-slate-600">Suspende todo suplemento con yodo, algas o kelp según la indicación de tu equipo. Revisa etiquetas de multivitamínicos.</p>
              <Link to="/fst-app/suplementos" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#9274C9]">Revisar mis suplementos <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Panel>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Panel title="Recetas y menú" icon={BookOpen}>
              <p className="text-sm leading-6 text-slate-600">Genera un menú semanal y revisa que las recetas no usen ingredientes con yodo.</p>
              <Link to="/fst-app/menus" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Ir a Mis menús <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Panel>
            <Panel title="Lista de compras" icon={ShoppingBasket}>
              <p className="text-sm leading-6 text-slate-600">Crea tu lista de mercado y marca los productos sin yodo (sal sin yodo, alimentos frescos).</p>
              <Link to="/fst-app/lista" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0B8176]">Ver mi lista <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Panel>
          </div>

          <div className="mt-4 rounded-2xl border border-[#eae2f8] bg-[#faf8fd] p-5">
            <p className="text-sm font-bold text-[#0A2540]">Recordatorio importante</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">La dieta baja en yodo es temporal y debe realizarse siguiendo las indicaciones del equipo tratante. No suspendas levotiroxina por la dieta: sigue la indicación de tu equipo sobre cuándo y cómo ajustarla.</p>
            <button type="button" onClick={deactivate} className="mt-3 text-xs font-bold text-slate-500 hover:text-rose-600">
              Desactivar modo (cuando tu equipo lo indique)
            </button>
          </div>
        </>
      )}
    </>
  );
}

export function ConsultaSection() {
  const { state, update } = useFstApp();
  const [range, setRange] = useState(30);
  const [question, setQuestion] = useState('');
  const [generating, setGenerating] = useState(false);

  const addQuestion = event => {
    event.preventDefault();
    if (!question.trim()) return;
    update('questions', items => [...items, question.trim()]);
    setQuestion('');
  };

  const generatePdf = async () => {
    setGenerating(true);
    try {
      const report = buildConsultationReport(state);
      await downloadConsultationPdf(report);
    } finally {
      setGenerating(false);
    }
  };

  const recentSymptoms = [...state.symptoms]
    .filter(item => {
      const days = (Date.now() - new Date(item.date).getTime()) / 86400000;
      return days <= range;
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return (
    <>
      <PageHeading
        eyebrow="Preparar mi consulta"
        title="Resumen para tu profesional"
        description="Reúne tus últimos registros en un informe claro para llevar a consulta."
        action={
          <button type="button" onClick={generatePdf} disabled={generating} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f] disabled:opacity-50">
            <FileText className="h-4 w-4" /> {generating ? 'Generando...' : 'Generar informe PDF'}
          </button>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Resumen de registros" description={`Últimos ${range} días`} icon={ClipboardList} action={
          <div className="flex gap-1">
            {[7, 30, 90].map(value => (
              <button key={value} type="button" onClick={() => setRange(value)} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${range === value ? 'bg-[#0A2540] text-white' : 'bg-[#f6f7f8] text-slate-500'}`}>{value}d</button>
            ))}
          </div>
        }>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Medicamentos', state.profile.levoDose ? `Levotiroxina ${state.profile.levoDose}` : 'Sin dosis registrada'],
              ['Horario', state.profile.levoTime || 'Sin horario'],
              ['Suplementos', state.profile.supplements.length],
              ['Comidas', state.meals.length],
              ['Síntomas', recentSymptoms.length],
              ['Tomas de levotiroxina', state.levoLog.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#0A2540]">{value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Síntomas recientes" icon={HeartPulse}>
          {recentSymptoms.length ? (
            <div className="space-y-2">
              {recentSymptoms.slice(0, 8).map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#f0eaf5] p-2.5">
                  <p className="text-sm font-semibold text-[#0A2540]">{item.name} · {item.intensity}/10</p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sin síntomas registrados en este periodo.</p>
          )}
        </Panel>

        <Panel title="Mis preguntas" icon={Stethoscope}>
          <form onSubmit={addQuestion} className="flex gap-2">
            <input
              value={question}
              onChange={event => setQuestion(event.target.value)}
              placeholder="Escribe una pregunta para tu consulta"
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#e5dceb] px-3 text-sm"
              aria-label="Nueva pregunta"
            />
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A2540] text-white" aria-label="Agregar pregunta"><Plus className="h-5 w-5" /></button>
          </form>
          {state.questions.length ? (
            <div className="mt-3 space-y-2">
              {state.questions.map((item, index) => (
                <div key={index} className="flex items-start justify-between gap-2 rounded-xl border border-[#f0eaf5] p-3">
                  <p className="text-sm leading-5 text-slate-600">{index + 1}. {item}</p>
                  <button
                    type="button"
                    onClick={() => update('questions', items => items.filter((_, i) => i !== index))}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Quitar pregunta"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Agrega las preguntas que quieres llevar a tu consulta.</p>
          )}
        </Panel>
      </div>

      <div className="mt-4 rounded-2xl border border-[#eae2f8] bg-[#faf8fd] p-5">
        <p className="text-sm font-bold text-[#0A2540]">Qué incluye el informe PDF</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">Medicamentos, horarios, suplementos, alimentación, síntomas, cambios registrados, posibles interacciones y tus preguntas. El informe es educativo: no modifica tu tratamiento y no reemplaza la consulta.</p>
      </div>
    </>
  );
}
