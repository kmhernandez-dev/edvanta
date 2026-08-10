/**
 * ============================================================
 *  FstAppPortal.jsx — Portal de la app Feliz Sin Tiroides
 *
 *  Rutas:
 *    /fst-app                    → Dashboard
 *    /fst-app/nutrifst           → NutriFST IA (chat)
 *    /fst-app/levotiroxina       → Registro de levotiroxina
 *    /fst-app/alimento           → ¿Puedo comer esto?
 *    /fst-app/escaneo            → Escáner de comidas
 *    /fst-app/menus              → Menús con IA
 *    /fst-app/cocina             → Cocina con lo que tengo
 *    /fst-app/lista              → Lista de compras
 *    /fst-app/suplementos        → Escáner de suplementos
 *    /fst-app/sintomas           → Diario de síntomas
 *    /fst-app/yodo               → Preparación para radioyodo
 *    /fst-app/consulta           → Preparar mi consulta
 *    /fst-app/progreso           → Progreso
 *    /fst-app/perfil             → Perfil
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { FstAppProvider, useFstApp } from '../context/FstAppContext';
import { useAuth } from '../context/AuthContext';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import FstAppShell from '../components/fstApp/FstAppShell';
import { updatePageSeo } from '../utils/seo';
import {
  FstDashboard, FstOnboarding, FstProfile, FstProgress,
} from '../components/fstApp/FstAppSections';
import {
  NutriFstChat, LevoSection, FoodCheckSection, PlateScanner, MenusSection,
  CookSection, ShoppingListSection, SupplementsSection, SymptomsSection,
  YodoSection, ConsultaSection,
} from '../components/fstApp/FstAppTools';

function AccessScreen() {
  const { startDemo, startReal, realDataEnabled } = useFstApp();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  const openReal = () => {
    if (startReal()) navigate('/fst-app');
    else setLoginOpen(true);
  };

  return (
    <div className="fst-app min-h-screen bg-[#FFF9F4] text-[#263746]">
      <header className="border-b border-[#f0eaf5] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/feliz-sin-tiroides" className="flex items-center gap-3">
            <img src="/img/port-logofelizsintiroides.jpg" alt="" className="h-10 w-10 rounded-xl object-cover" />
            <span>
              <span className="block text-sm font-bold text-[#0A2540]">Feliz Sin Tiroides</span>
              <span className="block text-xs text-slate-500">Tu espacio de acompañamiento</span>
            </span>
          </Link>
          <Link to="/feliz-sin-tiroides" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Volver</Link>
        </div>
      </header>
      <main>
        <section className="border-b border-[#f0eaf5] bg-gradient-to-b from-[#FFF9F4] to-[#f7f0fb]">
          <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9274C9]">
                <ShieldCheck className="h-4 w-4" /> Aplicación de acompañamiento
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-[#0A2540] sm:text-5xl">
                Vivir sin tiroides también se aprende
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Información, herramientas y acompañamiento para ayudarte a entender mejor tu alimentación, tus medicamentos y tus hábitos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={openReal} disabled={!realDataEnabled} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-6 text-sm font-bold text-white hover:bg-[#123b5f] disabled:cursor-not-allowed disabled:bg-slate-400">
                  {realDataEnabled ? (user ? 'Abrir mi espacio' : 'Ingresar o crear cuenta') : 'Acceso personal en piloto'} <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => { startDemo(); navigate('/fst-app'); }} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#2CB1A1] bg-white px-6 text-sm font-bold text-[#0A655D] hover:bg-[#effaf8]">
                  Probar con datos ficticios
                </button>
              </div>
              <p className="mt-5 flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-500">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
                {realDataEnabled ? 'Esta herramienta organiza lo que registras. No diagnostica ni modifica tratamientos.' : 'Piloto educativo: usa solamente perfiles ficticios. El registro de datos personales y clínicos permanece desactivado.'}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#F5DCE8]" aria-hidden="true" />
              <div className="absolute -bottom-6 -right-4 h-28 w-28 rounded-full bg-[#EAE2F8]" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-xl shadow-[#0A2540]/10">
                <div className="flex items-center justify-between border-b border-[#f3eef7] pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#9274C9]">Hola, Ana</p>
                    <p className="mt-1 text-xl font-semibold text-[#0A2540]">¿Cómo podemos ayudarte hoy?</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Sparkles className="h-5 w-5" /></span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['Preguntar a NutriFST', 'Registrar comida', 'Registrar levotiroxina', 'Revisar alimento'].map(item => (
                    <div key={item} className="rounded-xl border border-[#f0eaf5] bg-[#faf8fd] px-3 py-3 text-xs font-semibold text-[#0A2540]">{item}</div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-[#d3efe9] bg-[#f0faf8] p-3">
                  <p className="text-[10px] font-bold uppercase text-[#0B8176]">Tu día</p>
                  <p className="mt-1 text-sm font-semibold text-[#0A2540]">Levotiroxina 06:30 · Tomada ✓</p>
                  <p className="text-xs text-slate-500">2 comidas registradas · 1 síntoma</p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#f3eef7] pt-4 text-center">
                  {[['7', 'días de registros'], ['3', 'herramientas usadas'], ['100%', 'control personal']].map(([value, label]) => (
                    <div key={label}><p className="text-xl font-bold text-[#0A2540]">{value}</p><p className="text-[11px] text-slate-500">{label}</p></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['NutriFST IA', 'Pregunta sobre alimentos, interacciones y menús con respuestas basadas en evidencia.'],
              ['Mi medicamento', 'Registra tu levotiroxina, su horario y revisa posibles interacciones.'],
              ['Mi alimentación', 'Escanea tus comidas, crea menús y cocina con lo que tienes.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-[#f0eaf5] bg-white p-5">
                <p className="font-semibold text-[#0A2540]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

function PortalContent() {
  const { state, session, loading } = useFstApp();
  const location = useLocation();
  if (!session) return <AccessScreen />;
  if (loading || !state) return <div className="flex min-h-screen items-center justify-center bg-[#FFF9F4]"><p className="text-sm font-semibold text-slate-600">Cargando tu espacio...</p></div>;
  if (!state.profile.onboardingCompleted) return <FstOnboarding />;

  let content = <FstDashboard />;
  if (location.pathname.startsWith('/fst-app/nutrifst')) content = <NutriFstChat />;
  if (location.pathname.startsWith('/fst-app/levotiroxina')) content = <LevoSection />;
  if (location.pathname.startsWith('/fst-app/alimento')) content = <FoodCheckSection />;
  if (location.pathname.startsWith('/fst-app/escaneo')) content = <PlateScanner />;
  if (location.pathname.startsWith('/fst-app/menus')) content = <MenusSection />;
  if (location.pathname.startsWith('/fst-app/cocina')) content = <CookSection />;
  if (location.pathname.startsWith('/fst-app/lista')) content = <ShoppingListSection />;
  if (location.pathname.startsWith('/fst-app/suplementos')) content = <SupplementsSection />;
  if (location.pathname.startsWith('/fst-app/sintomas')) content = <SymptomsSection />;
  if (location.pathname.startsWith('/fst-app/yodo')) content = <YodoSection />;
  if (location.pathname.startsWith('/fst-app/consulta')) content = <ConsultaSection />;
  if (location.pathname.startsWith('/fst-app/progreso')) content = <FstProgress />;
  if (location.pathname.startsWith('/fst-app/perfil')) content = <FstProfile />;
  return <FstAppShell>{content}</FstAppShell>;
}

export default function FstAppPortal() {
  useEffect(() => updatePageSeo({
    title: 'Feliz Sin Tiroides | Tu espacio de acompañamiento',
    description: 'Aplicación HealthTech para personas con tiroidectomía, hipotiroidismo, Hashimoto, Graves o tratamiento con levotiroxina: NutriFST IA, registro de medicamentos, menús, síntomas y preparación de consultas.',
    canonical: 'https://edvanta.co/fst-app',
    image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
    jsonLdId: 'fst-app',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Feliz Sin Tiroides',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://edvanta.co/fst-app',
      description: 'Aplicación educativa de acompañamiento para personas con condiciones tiroideas.',
    },
  }), []);
  return <FstAppProvider><PortalContent /></FstAppProvider>;
}
