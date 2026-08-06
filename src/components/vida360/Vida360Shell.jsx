import { Link, useLocation } from 'react-router-dom';
import {
  CalendarDays, ClipboardPlus, HeartPulse, Home, LogOut, Menu, ShieldCheck, UserRound, Wrench, X,
} from 'lucide-react';
import { useState } from 'react';
import { useVida360 } from '../../context/Vida360Context';

const navItems = [
  { to: '/vida-360', label: 'Inicio', icon: Home, exact: true },
  { to: '/vida-360/mi-salud', label: 'Mi salud', icon: HeartPulse },
  { to: '/vida-360/registrar', label: 'Registrar', icon: ClipboardPlus, prominent: true },
  { to: '/vida-360/consultas', label: 'Consultas', icon: CalendarDays },
  { to: '/vida-360/herramientas', label: 'Herramientas', icon: Wrench },
  { to: '/vida-360/perfil', label: 'Perfil', icon: UserRound },
];

function NavLink({ item, mobile = false, onClick }) {
  const location = useLocation();
  const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
  const Icon = item.icon;
  if (mobile) {
    return (
      <Link to={item.to} onClick={onClick} className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? 'text-[#0b756b]' : 'text-slate-500'}`} aria-current={active ? 'page' : undefined}>
        <span className={`flex h-8 w-10 items-center justify-center ${item.prominent ? '-mt-4 rounded-md bg-[#0A2540] text-white shadow-lg' : ''}`}>
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        {item.label}
      </Link>
    );
  }
  return (
    <Link to={item.to} onClick={onClick} className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${active ? 'bg-[#dff5f1] text-[#0A5F58]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'}`} aria-current={active ? 'page' : undefined}>
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      {item.label}
    </Link>
  );
}

export default function Vida360Shell({ children }) {
  const { state, isDemo, saveStatus, exit } = useVida360();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = state?.profile?.firstName || 'Mi espacio';

  return (
    <div className="min-h-screen bg-[#F6F7F8] text-[#263746]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMenuOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-[#0A2540] lg:hidden" aria-label="Abrir navegacion">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/vida-360" className="flex min-w-0 items-center gap-3" aria-label="FST Vida 360, inicio">
              <img src="/img/port-logofelizsintiroides.jpg" alt="" className="h-10 w-10 rounded-md object-cover" width="40" height="40" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-[#0A2540]">FST Vida 360</span>
                <span className="hidden truncate text-xs text-slate-500 sm:block">Feliz Sin Tiroides</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && <span className="rounded border border-[#8dd8ce] bg-[#edf9f7] px-2 py-1 text-[10px] font-bold uppercase text-[#0A655d]">Demo ficticio</span>}
            <span className={`hidden text-xs sm:inline ${saveStatus === 'error' ? 'text-red-700' : 'text-slate-500'}`} role="status">
              {saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'error' ? 'No se pudo guardar' : 'Guardado automatico'}
            </span>
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-[#0A2540]">{name}</p>
              <p className="text-xs text-slate-500">Espacio personal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col">
          <nav className="space-y-1" aria-label="Navegacion de FST Vida 360">
            {navItems.map(item => <NavLink key={item.to} item={item} />)}
          </nav>
          <div className="mt-auto space-y-3">
            <div className="rounded-md border border-[#bce6e0] bg-[#f0faf8] p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0B8176]" />
                <p className="text-xs leading-5 text-slate-600">Organiza tu informacion. No sustituye la evaluacion de un profesional de salud.</p>
              </div>
            </div>
            <button type="button" onClick={exit} className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#0A2540]">
              <LogOut className="h-5 w-5" /> Salir del portal
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10" id="vida360-main">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(10,37,64,0.08)] lg:hidden" aria-label="Navegacion movil de FST Vida 360">
        {navItems.map(item => <NavLink key={item.to} item={item} mobile />)}
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[#0A2540]/45" onClick={() => setMenuOpen(false)} aria-label="Cerrar navegacion" />
          <aside className="relative h-full w-[min(84vw,320px)] bg-white p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-bold text-[#0A2540]">FST Vida 360</p>
              <button type="button" onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200" aria-label="Cerrar navegacion"><X className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-1" aria-label="Navegacion lateral movil">
              {navItems.map(item => <NavLink key={item.to} item={item} onClick={() => setMenuOpen(false)} />)}
            </nav>
            <button type="button" onClick={exit} className="mt-8 flex min-h-11 w-full items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600"><LogOut className="h-5 w-5" /> Salir del portal</button>
          </aside>
        </div>
      )}
    </div>
  );
}

