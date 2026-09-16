import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, KeyRound, LogOut, Menu, X } from 'lucide-react';
import { useAulaSession } from '../session';
import { ROLE_LABEL } from '../labels';
import { ADMIN_NAV, PARTICIPANT_NAV } from '../nav';

function Logo({ to }) {
  return (
    <Link to={to} className="flex shrink-0 items-center gap-2.5" aria-label="Aula Edvanta, ir al inicio">
      <img src="/img/logo-edvanta.png" alt="Edvanta" width="931" height="512" className="h-10 w-auto" />
      <span className="hidden border-l border-[var(--aula-border)] pl-2.5 font-[family-name:var(--aula-font-display)] text-sm font-bold text-[var(--aula-secondary)] sm:inline">
        Aula
      </span>
    </Link>
  );
}

function initials(user) {
  return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'A';
}

function UserMenu() {
  const { user, logout } = useAulaSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const signOut = async () => {
    setLeaving(true);
    await logout();
    navigate('/aula/entrar', { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-[var(--aula-radius)] py-1.5 pl-1.5 pr-2 hover:bg-[var(--aula-neutral-soft)]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--aula-accent-soft)] text-sm font-bold text-[#5E51A8]">
          {initials(user)}
        </span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-sm font-semibold">{user?.firstName}</span>
          <span className="block text-xs text-[var(--aula-muted)]">{ROLE_LABEL[user?.role]}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-[var(--aula-muted)]" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-1 w-60 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-1.5 shadow-[var(--aula-shadow-lg)]">
          <div className="border-b border-[var(--aula-border)] px-3 pb-2.5 pt-1.5">
            <p className="truncate text-sm font-semibold">{user?.fullName}</p>
            <p className="truncate text-xs text-[var(--aula-muted)]">{user?.email}</p>
          </div>
          <Link role="menuitem" to="/aula/cuenta" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2 rounded-[var(--aula-radius-sm)] px-3 py-2 text-sm hover:bg-[var(--aula-surface-muted)]">
            <KeyRound className="h-4 w-4 text-[var(--aula-muted)]" /> Mi cuenta
          </Link>
          <button role="menuitem" type="button" onClick={signOut} disabled={leaving} className="flex w-full items-center gap-2 rounded-[var(--aula-radius-sm)] px-3 py-2 text-left text-sm hover:bg-[var(--aula-surface-muted)] disabled:opacity-60">
            <LogOut className="h-4 w-4 text-[var(--aula-muted)]" /> {leaving ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </div>
      )}
    </div>
  );
}

export function AuthLayout({ children }) {
  return (
    <div className="aula-root flex min-h-screen flex-col" style={{ background: 'var(--aula-gradient-hero)' }}>
      <header className="px-4 py-5 sm:px-8">
        <Logo to="/aula" />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4 sm:items-center">
        <div className="w-full max-w-md rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-6 shadow-[var(--aula-shadow)] sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export function ParticipantShell() {
  return (
    <div className="aula-root">
      <header className="sticky top-0 z-40 border-b border-[var(--aula-border)] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Logo to="/aula" />
          <nav aria-label="Aula" className="flex items-center gap-1">
            {PARTICIPANT_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `inline-flex h-10 items-center gap-2 rounded-[var(--aula-radius-sm)] px-3 text-sm font-medium ${
                  isActive ? 'bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]' : 'text-[var(--aula-muted)] hover:bg-[var(--aula-neutral-soft)] hover:text-[var(--aula-text)]'
                }`}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto"><UserMenu /></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminShell() {
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  useEffect(() => { setDrawer(false); }, [location.pathname]);

  const nav = (
    <nav aria-label="Administración del aula" className="flex flex-col gap-5">
      {ADMIN_NAV.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--aula-subtle)]">{section.title}</p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `flex h-10 items-center gap-2.5 rounded-[var(--aula-radius-sm)] px-3 text-sm font-medium ${
                  isActive ? 'bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]' : 'text-[var(--aula-text)] hover:bg-[var(--aula-surface-muted)]'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="aula-root">
      <header className="sticky top-0 z-40 border-b border-[var(--aula-border)] bg-white">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--aula-radius-sm)] hover:bg-[var(--aula-neutral-soft)] lg:hidden"
            onClick={() => setDrawer((v) => !v)}
            aria-label={drawer ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={drawer}
          >
            {drawer ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo to="/aula/admin" />
          <span className="hidden rounded-full bg-[var(--aula-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--aula-primary)] sm:inline">
            Administración
          </span>
          <div className="ml-auto"><UserMenu /></div>
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-[var(--aula-border)] bg-white px-3 py-5 lg:block">
          {nav}
        </aside>
        {drawer && (
          <div className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto border-t border-[var(--aula-border)] bg-white px-3 py-5 lg:hidden">
            {nav}
          </div>
        )}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
