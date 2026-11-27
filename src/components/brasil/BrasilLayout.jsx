import { Link, useLocation } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BRASIL_NAV } from '../../data/brasil';

export default function BrasilLayout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const active = (to) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className="min-h-screen bg-white text-edvanta-deep">
      <header className="sticky top-0 z-50 border-b border-edvanta-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
          <Link to="/br" className="flex shrink-0 items-center gap-3" aria-label="Edvanta Brasil, início">
            <img src="/img/logo-edvanta.png" alt="Edvanta" className="h-11 w-auto" width="931" height="512" />
            <span className="rounded-full bg-[#E8F6EE] px-3 py-1 text-xs font-extrabold uppercase tracking-[.12em] text-[#176B3A]">Brasil</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Edvanta Brasil">
            {BRASIL_NAV.map((item) => (
              <Link key={item.to} to={item.to} className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${active(item.to) ? 'bg-edvanta-soft text-edvanta-blue' : 'text-edvanta-muted hover:bg-edvanta-bg hover:text-edvanta-blue'}`}>{item.label}</Link>
            ))}
            <Link to="/" className="ml-2 inline-flex items-center gap-2 rounded-xl border border-edvanta-border px-4 py-3 text-sm font-semibold text-edvanta-blue">
              <Globe2 className="h-4 w-4" /> Español
            </Link>
          </nav>
          <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl text-edvanta-blue md:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-edvanta-border px-4 py-3 md:hidden" aria-label="Edvanta Brasil móvel">
            {[...BRASIL_NAV, { label: 'Edvanta em espanhol', to: '/' }].map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-semibold text-edvanta-deep">{item.label}</Link>)}
          </nav>
        )}
      </header>
      {children}
      <footer className="border-t border-edvanta-border bg-edvanta-bg">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img src="/img/logo-edvanta.png" alt="Edvanta" className="h-12 w-auto" width="931" height="512" loading="lazy" />
              <span className="font-bold text-[#176B3A]">Brasil</span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-edvanta-muted">Educação farmacêutica em português para profissionais, estudantes, pacientes e instituições. Conteúdo educacional; não substitui avaliação clínica ou orientação regulatória oficial.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-edvanta-blue">
            {BRASIL_NAV.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}
            <a href="mailto:contacto@edvanta.co">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
