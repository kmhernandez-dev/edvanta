import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../Icon';

export const fstDestinations = [
  { label: 'Inicio', href: '/feliz-sin-tiroides', icon: 'compass' },
  { label: 'Guías', href: '/feliz-sin-tiroides/guias', icon: 'book' },
  { label: 'Herramientas', href: '/feliz-sin-tiroides/herramientas', icon: 'sparkles' },
  { label: 'Academy', href: '/feliz-sin-tiroides/academy', icon: 'cap' },
  { label: 'Atención farmacéutica', href: '/feliz-sin-tiroides/atencion-farmaceutica', icon: 'pill' },
  { label: 'Sobre mí', href: '/feliz-sin-tiroides/sobre-mi', icon: 'user' },
  { label: 'Comunidad', href: '/feliz-sin-tiroides/comunidad', icon: 'users' },
];

export default function FstSectionNav({ className = '' }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className={`border-y border-[#e8e1ee] bg-white ${className}`} aria-label="Secciones de Feliz Sin Tiroides">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {fstDestinations.map(item => {
          const active = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors ${active ? 'bg-[#eee8f7] text-[#563a78]' : 'text-[#405268] hover:bg-[#f4f8f7] hover:text-[#087f77]'}`}>
              <Icon name={item.icon} className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
        <span className="mx-1 h-6 w-px shrink-0 bg-[#dfe6e5]" aria-hidden="true" />
        <Link to={isAuthenticated ? '/fst-app' : '/fst-app?modo=registro'} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-[#0b8176] px-3 text-sm font-bold text-white hover:bg-[#096c63]">
          <Icon name="user" className="h-4 w-4" /> {isAuthenticated ? 'Mi espacio' : 'Crear mi cuenta'}
        </Link>
        <Link to="/vida-360" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-[#addfd8] px-3 text-sm font-bold text-[#087168] hover:bg-[#eef9f7]">
          <Icon name="chart" className="h-4 w-4" /> Vida 360
        </Link>
      </div>
    </nav>
  );
}
