import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import Vida360Shell from '../components/vida360/Vida360Shell';
import { Vida360Provider, useVida360 } from '../context/Vida360Context';
import { useAuth } from '../context/AuthContext';
import { demoScenarios } from '../data/vida360Demo';
import { updatePageSeo } from '../utils/seo';
import {
  Vida360Consultations, Vida360Dashboard, Vida360Health, Vida360Profile, Vida360Register,
} from '../components/vida360/Vida360Sections';

function AccessScreen() {
  const { startDemo, startReal, realDataEnabled } = useVida360();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [scenario, setScenario] = useState('thyroidectomy');
  const navigate = useNavigate();

  const openReal = () => {
    if (startReal()) navigate('/vida-360');
    else setLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#263746]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/feliz-sin-tiroides" className="flex items-center gap-3">
            <img src="/img/port-logofelizsintiroides.jpg" alt="" className="h-10 w-10 rounded-md object-cover" />
            <span><span className="block text-sm font-bold text-[#0A2540]">FST Vida 360</span><span className="block text-xs text-slate-500">Feliz Sin Tiroides</span></span>
          </Link>
          <Link to="/feliz-sin-tiroides" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Volver</Link>
        </div>
      </header>
      <main>
        <section className="border-b border-slate-200 bg-[#F6F7F8]">
          <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0B8176]"><ShieldCheck className="h-4 w-4" /> Portal personal de salud tiroidea</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-[#0A2540] sm:text-5xl">Tu historia tiroidea, organizada para tomar mejores decisiones contigo y tu equipo de salud</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Reune medicamentos, sintomas, laboratorios, tareas y preguntas para tu consulta en un espacio privado y comprensible.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={openReal} disabled={!realDataEnabled} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0A2540] px-6 text-sm font-bold text-white hover:bg-[#123b5f] disabled:cursor-not-allowed disabled:bg-slate-400">
                  {realDataEnabled ? (user ? 'Abrir mi espacio' : 'Ingresar o crear cuenta') : 'Acceso personal en piloto'} <ArrowRight className="h-4 w-4" />
                </button>
                <a href="#demo" className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#2CB1A1] bg-white px-6 text-sm font-bold text-[#0A655D] hover:bg-[#effaf8]">Probar con datos ficticios</a>
              </div>
              <p className="mt-5 flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-500"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" /> {realDataEnabled ? 'Esta herramienta organiza lo que registras. No diagnostica ni modifica tratamientos.' : 'Piloto educativo: usa solamente perfiles ficticios. El registro de datos personales y clinicos permanece desactivado.'}</p>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-[#0A2540]/10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div><p className="text-xs font-bold uppercase text-[#0B8176]">Resumen de hoy</p><p className="mt-1 text-xl font-semibold text-[#0A2540]">Tres prioridades claras</p></div>
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#dff5f1] text-[#0B8176]"><Sparkles className="h-5 w-5" /></span>
              </div>
              <div className="divide-y divide-slate-100">
                {['Confirmar tu proximo control', 'Organizar resultados recientes', 'Preparar preguntas para la consulta'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 py-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8dd8ce] text-sm font-bold text-[#0A655D]">{index + 1}</span><p className="font-semibold text-[#263746]">{item}</p></div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center">
                {[['5', 'Dominios 360'], ['1', 'Linea de tiempo'], ['100%', 'Control personal']].map(([value, label]) => <div key={label}><p className="text-xl font-bold text-[#0A2540]">{value}</p><p className="text-[11px] text-slate-500">{label}</p></div>)}
              </div>
            </div>
          </div>
        </section>
        <section id="demo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B8176]">Modo demostracion</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#0A2540]">Explora todo sin registrar datos reales</h2>
              <p className="mt-4 leading-7 text-slate-600">Elige un caso ficticio. Los cambios quedan solo en este navegador y puedes reiniciar el perfil cuando quieras.</p>
              <label htmlFor="demo-profile" className="mt-6 block text-sm font-bold text-[#0A2540]">Perfil de demostracion</label>
              <select id="demo-profile" value={scenario} onChange={event => setScenario(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-[#2CB1A1] focus:outline-none focus:ring-2 focus:ring-[#2CB1A1]/20">
                {demoScenarios.map(item => <option key={item.id} value={item.id}>{item.name} · {item.label}</option>)}
              </select>
              <button type="button" onClick={() => { startDemo(scenario); navigate('/vida-360'); }} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2B8178] px-5 text-sm font-bold text-white hover:bg-[#216d65]">Explorar modo demo <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {demoScenarios.slice(0, 4).map(item => (
                <button key={item.id} type="button" onClick={() => setScenario(item.id)} className={`min-h-32 rounded-md border p-4 text-left transition ${scenario === item.id ? 'border-[#2CB1A1] bg-[#effaf8]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <span className="flex items-center gap-2 text-sm font-bold text-[#0A2540]"><UserRound className="h-4 w-4 text-[#0B8176]" /> {item.name}</span>
                  <span className="mt-2 block text-sm font-semibold text-[#2B8178]">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

function Onboarding() {
  const { state, update } = useVida360();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(state.onboarding);
  const total = 3;
  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const finish = () => {
    update('onboarding', { ...draft, completed: true });
    update('thyroid', current => ({ ...current, primaryDiagnosis: draft.mainDiagnosis || current.primaryDiagnosis }));
  };
  return (
    <div className="min-h-screen bg-[#F6F7F8] px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-bold text-[#0A2540]">FST Vida 360</p><p className="text-xs text-slate-500">Configura tu punto de partida</p></div><p className="text-sm font-semibold text-[#2B8178]">Paso {step} de {total}</p></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-[#2CB1A1] transition-all" style={{ width: `${(step / total) * 100}%` }} /></div>
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {step === 1 && <><h1 className="text-2xl font-semibold text-[#0A2540]">Cuéntanos lo esencial de tu historia</h1><p className="mt-2 text-sm leading-6 text-slate-600">Puedes completar o corregir esta informacion despues.</p><div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Relacion con la enfermedad tiroidea"><select value={draft.thyroidRelation} onChange={e => set('thyroidRelation', e.target.value)}><option value="">Selecciona</option><option>Vivo sin tiroides</option><option>Tengo hipotiroidismo</option><option>Tuve cancer de tiroides</option><option>Otra situacion</option></select></Field>
            <Field label="Estado de la tiroides"><select value={draft.thyroidStatus} onChange={e => set('thyroidStatus', e.target.value)}><option value="">Selecciona</option><option>Tiroidectomia total</option><option>Tiroidectomia parcial</option><option>Tiroides intacta</option><option>No estoy segura</option></select></Field>
            <Field label="Diagnostico principal"><input value={draft.mainDiagnosis} onChange={e => set('mainDiagnosis', e.target.value)} placeholder="Como aparece en tus documentos" /></Field>
            <Field label="¿Tomas levotiroxina?"><select value={draft.levothyroxine} onChange={e => set('levothyroxine', e.target.value)}><option value="">Selecciona</option><option>Si</option><option>No</option><option>No estoy segura</option></select></Field>
          </div></>}
          {step === 2 && <><h1 className="text-2xl font-semibold text-[#0A2540]">¿Que quieres organizar primero?</h1><div className="mt-6 space-y-5"><Field label="Primer objetivo"><select value={draft.firstGoal} onChange={e => set('firstGoal', e.target.value)}><option value="">Selecciona</option><option>Organizar medicamentos</option><option>Registrar sintomas</option><option>Revisar laboratorios</option><option>Prepararme para una consulta</option><option>Organizar suplementos</option><option>Comprender mejor mi tratamiento</option></select></Field><Field label="Principal preocupacion"><textarea rows="4" value={draft.mainConcern} onChange={e => set('mainConcern', e.target.value)} placeholder="Escribe solo lo que te resulte util organizar" /></Field></div></>}
          {step === 3 && <><h1 className="text-2xl font-semibold text-[#0A2540]">Revisa las autorizaciones</h1><p className="mt-2 text-sm leading-6 text-slate-600">Texto demostrativo pendiente de revision legal. Las opciones no esenciales pueden rechazarse.</p><div className="mt-5 space-y-3">{state.consents.map(item => <label key={item.code} className="flex items-start gap-3 rounded-md border border-slate-200 p-4"><input type="checkbox" checked={item.accepted} disabled={item.required} onChange={e => update('consents', list => list.map(consent => consent.code === item.code ? { ...consent, accepted: e.target.checked, updatedAt: new Date().toISOString() } : consent))} className="mt-1 h-5 w-5 accent-[#2B8178]" /><span><span className="block text-sm font-bold text-[#0A2540]">{item.label} {item.required ? '(esencial)' : '(opcional)'}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span></span></label>)}</div></>}
          <div className="mt-8 flex justify-between gap-3"><button type="button" onClick={() => setStep(value => Math.max(1, value - 1))} disabled={step === 1} className="min-h-11 rounded-md border border-slate-300 px-5 text-sm font-bold text-slate-600 disabled:opacity-40">Anterior</button>{step < total ? <button type="button" onClick={() => setStep(value => value + 1)} className="min-h-11 rounded-md bg-[#0A2540] px-5 text-sm font-bold text-white">Continuar</button> : <button type="button" onClick={finish} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#2B8178] px-5 text-sm font-bold text-white"><Check className="h-4 w-4" /> Terminar</button>}</div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return <label className="block text-sm font-bold text-[#0A2540]">{label}{hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}<span className="vida360-field mt-2 block">{children}</span></label>;
}

function PortalContent() {
  const { state, session, loading } = useVida360();
  const location = useLocation();
  if (!session) return <AccessScreen />;
  if (loading || !state) return <div className="flex min-h-screen items-center justify-center bg-[#F6F7F8]"><p className="text-sm font-semibold text-slate-600">Cargando tu espacio...</p></div>;
  if (!state.onboarding?.completed) return <Onboarding />;
  let content = <Vida360Dashboard />;
  if (location.pathname.startsWith('/vida-360/mi-salud')) content = <Vida360Health />;
  if (location.pathname.startsWith('/vida-360/registrar')) content = <Vida360Register />;
  if (location.pathname.startsWith('/vida-360/consultas')) content = <Vida360Consultations />;
  if (location.pathname.startsWith('/vida-360/perfil')) content = <Vida360Profile />;
  return <Vida360Shell>{content}</Vida360Shell>;
}

export default function Vida360Portal() {
  useEffect(() => updatePageSeo({
    title: 'FST Vida 360 | Portal personal de salud tiroidea',
    description: 'Organiza tu historia tiroidea, medicamentos, sintomas, laboratorios y preguntas para la consulta en un portal educativo y privado.',
    canonical: 'https://edvanta.co/vida-360',
    image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
    jsonLdId: 'fst-vida360',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'FST Vida 360', applicationCategory: 'HealthApplication', operatingSystem: 'Web', url: 'https://edvanta.co/vida-360' },
  }), []);
  return <Vida360Provider><PortalContent /></Vida360Provider>;
}
