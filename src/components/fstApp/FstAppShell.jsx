/**
 * ============================================================
 *  FstAppShell.jsx — Layout de la app Feliz Sin Tiroides
 *
 *  Desktop: sidebar lateral.
 *  Móvil: barra inferior Inicio | NutriFST | + | Progreso | Perfil
 *  El botón central "+" abre el registro rápido.
 * ============================================================
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, Apple, BookOpen, ChefHat, HeartPulse, Home, LogOut, Menu, MessageCircle,
  Pill, Plus, Scale, ShieldCheck, ShoppingBasket, Sparkles, Stethoscope, UserRound, X,
  Beaker, CalendarDays, History, ClipboardList, LockKeyhole,
} from 'lucide-react';
import { useFstApp } from '../../context/FstAppContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/fst-app', label: 'Inicio', icon: Home, exact: true },
  { to: '/fst-app/nutrifst', label: 'NutriFST', icon: MessageCircle },
  { to: '/fst-app/progreso', label: 'Progreso', icon: Activity },
  { to: '/fst-app/perfil', label: 'Perfil', icon: UserRound },
];

const quickActions = [
  { id: 'medicamento', label: 'Registrar medicamento', icon: Pill, to: '/fst-app/levotiroxina' },
  { id: 'comida', label: 'Registrar comida', icon: Apple, to: '/fst-app/escaneo' },
  { id: 'suplemento', label: 'Registrar suplemento', icon: Sparkles, to: '/fst-app/suplementos' },
  { id: 'sintoma', label: 'Registrar síntoma', icon: HeartPulse, to: '/fst-app/sintomas' },
  { id: 'peso', label: 'Registrar peso', icon: Scale, to: '/fst-app/progreso' },
];

function NavLink({ item, mobile = false, onClick }) {
  const location = useLocation();
  const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
  const Icon = item.icon;
  if (mobile) {
    return (
      <Link
        to={item.to}
        onClick={onClick}
        className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? 'text-[#9274C9]' : 'text-slate-500'}`}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} />
        {item.label}
      </Link>
    );
  }
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? 'bg-[#EAE2F8] text-[#6b4fa8]' : 'text-slate-600 hover:bg-[#faf8fd] hover:text-[#0A2540]'}`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      {item.label}
    </Link>
  );
}

function QuickAddSheet({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button type="button" className="absolute inset-0 bg-[#0A2540]/45" onClick={onClose} aria-label="Cerrar registro rápido" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#e5dceb]" />
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-[#0A2540]">¿Qué quieres registrar?</p>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f7f8] text-slate-500" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {quickActions.map(action => (
            <button
              key={action.id}
              type="button"
              onClick={() => { onClose(); navigate(action.to); }}
              className="flex min-h-16 flex-col items-start justify-center gap-1.5 rounded-2xl border border-[#f0eaf5] bg-[#faf8fd] p-3 text-left hover:border-[#d8cce8]"
            >
              <action.icon className="h-5 w-5 text-[#9274C9]" strokeWidth={1.8} />
              <span className="text-xs font-semibold text-[#0A2540]">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FstAppShell({ children }) {
  const { saveStatus } = useFstApp();
  const { user, profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const name = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Mi espacio';

  return (
    <div className="fst-app min-h-screen bg-[#FFF9F4] text-[#263746]">
      <header className="sticky top-0 z-40 border-b border-[#f0eaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMenuOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#f0eaf5] text-[#0A2540] lg:hidden" aria-label="Abrir navegación">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/fst-app" className="flex min-w-0 items-center gap-3" aria-label="Feliz Sin Tiroides, inicio">
              <img src="/img/port-logofelizsintiroides.jpg" alt="" className="h-10 w-10 rounded-xl object-cover" width="40" height="40" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-[#0A2540]">Feliz Sin Tiroides</span>
                <span className="hidden truncate text-xs text-slate-500 sm:block">Tu espacio de acompañamiento</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {profile?.role === 'admin' && (
              <Link to="/admin" className="rounded-full border border-[#eae2f8] bg-[#f7f3fb] px-2.5 py-1 text-[10px] font-bold uppercase text-[#6b4fa8] hover:bg-[#f0eaf8]">
                Admin
              </Link>
            )}
            <span className={`hidden text-xs sm:inline ${saveStatus === 'error' ? 'text-red-700' : 'text-slate-500'}`} role="status">
              {saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'error' ? 'No se pudo guardar' : 'Guardado automático'}
            </span>
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-[#0A2540]">{name}</p>
              <p className="text-xs text-slate-500">Espacio personal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-[#f0eaf5] bg-white p-4 lg:flex lg:flex-col">
          <nav className="space-y-1" aria-label="Navegación de Feliz Sin Tiroides">
            {navItems.map(item => <NavLink key={item.to} item={item} />)}
          </nav>
          <p className="mt-6 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Herramientas</p>
          <nav className="mt-2 space-y-1" aria-label="Herramientas de NutriFST">
            {[
              { to: '/fst-app/levotiroxina', label: 'Mi levotiroxina', icon: Pill },
              { to: '/fst-app/laboratorios', label: 'Mis laboratorios', icon: Beaker },
              { to: '/fst-app/citas', label: 'Mis citas', icon: CalendarDays },
              { to: '/fst-app/historia', label: 'Mi historia', icon: History },
              { to: '/fst-app/habitos', label: 'Mis hábitos', icon: Activity },
              { to: '/fst-app/preguntas', label: 'Preguntas para consulta', icon: ClipboardList },
              { to: '/fst-app/alimento', label: '¿Puedo comer esto?', icon: Apple },
              { to: '/fst-app/escaneo', label: 'Escáner de comidas', icon: ChefHat },
              { to: '/fst-app/menus', label: 'Mis menús', icon: BookOpen },
              { to: '/fst-app/cocina', label: 'Cocina con lo que tengo', icon: ChefHat },
              { to: '/fst-app/lista', label: 'Lista de compras', icon: ShoppingBasket },
              { to: '/fst-app/suplementos', label: 'Escáner de suplementos', icon: Sparkles },
              { to: '/fst-app/sintomas', label: 'Diario de síntomas', icon: HeartPulse },
              { to: '/fst-app/yodo', label: 'Preparación para radioyodo', icon: ShieldCheck },
              { to: '/fst-app/consulta', label: 'Preparar mi consulta', icon: Stethoscope },
              { to: '/fst-app/privacidad', label: 'Privacidad', icon: LockKeyhole },
            ].map(item => (
              <Link key={item.to} to={item.to} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-slate-600 hover:bg-[#faf8fd] hover:text-[#0A2540]">
                <item.icon className="h-4 w-4 text-[#9274C9]" strokeWidth={1.8} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-[#eae2f8] bg-[#faf8fd] p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9274C9]" />
                <p className="text-xs leading-5 text-slate-600">Herramienta educativa. No sustituye la evaluación de un profesional de salud.</p>
              </div>
            </div>
            <button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:bg-[#faf8fd] hover:text-[#0A2540]">
              <LogOut className="h-5 w-5" /> Salir del espacio
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10" id="fst-app-main">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#f0eaf5] bg-white px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(10,37,64,0.08)] lg:hidden" aria-label="Navegación móvil">
        <NavLink item={navItems[0]} mobile />
        <NavLink item={navItems[1]} mobile />
        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          className="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-slate-500"
          aria-label="Registro rápido"
        >
          <span className="-mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0A2540] text-white shadow-lg">
            <Plus className="h-5 w-5" strokeWidth={2.2} />
          </span>
          Registrar
        </button>
        <NavLink item={navItems[2]} mobile />
        <NavLink item={navItems[3]} mobile />
      </nav>

      <QuickAddSheet open={quickOpen} onClose={() => setQuickOpen(false)} />

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[#0A2540]/45" onClick={() => setMenuOpen(false)} aria-label="Cerrar navegación" />
          <aside className="relative h-full w-[min(84vw,320px)] bg-white p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-bold text-[#0A2540]">Feliz Sin Tiroides</p>
              <button type="button" onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#f0eaf5]" aria-label="Cerrar navegación">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1" aria-label="Navegación lateral móvil">
              {navItems.map(item => <NavLink key={item.to} item={item} onClick={() => setMenuOpen(false)} />)}
            </nav>
            <p className="mt-6 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Herramientas</p>
            <nav className="mt-2 space-y-1" aria-label="Herramientas móvil">
              {[
                { to: '/fst-app/levotiroxina', label: 'Mi levotiroxina', icon: Pill },
                { to: '/fst-app/laboratorios', label: 'Mis laboratorios', icon: Beaker },
                { to: '/fst-app/citas', label: 'Mis citas', icon: CalendarDays },
                { to: '/fst-app/historia', label: 'Mi historia', icon: History },
                { to: '/fst-app/habitos', label: 'Mis hábitos', icon: Activity },
                { to: '/fst-app/preguntas', label: 'Preguntas para consulta', icon: ClipboardList },
                { to: '/fst-app/alimento', label: '¿Puedo comer esto?', icon: Apple },
                { to: '/fst-app/escaneo', label: 'Escáner de comidas', icon: ChefHat },
                { to: '/fst-app/menus', label: 'Mis menús', icon: BookOpen },
                { to: '/fst-app/cocina', label: 'Cocina con lo que tengo', icon: ChefHat },
                { to: '/fst-app/lista', label: 'Lista de compras', icon: ShoppingBasket },
                { to: '/fst-app/suplementos', label: 'Escáner de suplementos', icon: Sparkles },
                { to: '/fst-app/sintomas', label: 'Diario de síntomas', icon: HeartPulse },
                { to: '/fst-app/yodo', label: 'Preparación para radioyodo', icon: ShieldCheck },
                { to: '/fst-app/consulta', label: 'Preparar mi consulta', icon: Stethoscope },
                { to: '/fst-app/privacidad', label: 'Privacidad', icon: LockKeyhole },
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-slate-600 hover:bg-[#faf8fd]">
                  <item.icon className="h-4 w-4 text-[#9274C9]" strokeWidth={1.8} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <button type="button" onClick={logout} className="mt-8 flex min-h-11 w-full items-center gap-3 rounded-xl border border-[#f0eaf5] px-3 text-sm font-semibold text-slate-600">
              <LogOut className="h-5 w-5" /> Salir del espacio
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
