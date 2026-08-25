import { Link } from 'react-router-dom';
import Icon from '../Icon';

export default function FstHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/feliz-sin-tiroides" className="flex min-w-0 items-center gap-3" aria-label="Feliz Sin Tiroides, inicio">
          <img src="/img/port-logofelizsintiroides.jpg" alt="" width="44" height="44" className="h-11 w-11 rounded-md object-cover" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-[#132e55]">Feliz Sin Tiroides</span>
            <span className="block truncate text-[11px] text-gray-500">Educación tiroidea responsable</span>
          </span>
        </Link>
        <Link to="/" className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-[#405268] hover:bg-white hover:text-[#0b8176]">
          <Icon name="arrowRight" className="h-4 w-4 rotate-180" /> <span className="hidden sm:inline">Volver a Edvanta</span>
        </Link>
      </div>
    </header>
  );
}
