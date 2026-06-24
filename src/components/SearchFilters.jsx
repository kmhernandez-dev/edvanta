import { COURSE_CATEGORIES } from '../data/courses';

const PROFILES = [
  { value: 'todos',        label: 'Todos los perfiles' },
  { value: 'salud',        label: 'Salud' },
  { value: 'farmacia',     label: 'Farmacia' },
  { value: 'calidad',      label: 'Calidad' },
  { value: 'hseq',         label: 'HSEQ' },
  { value: 'datos',        label: 'Datos' },
  { value: 'logistica',    label: 'Logística' },
  { value: 'marketing',    label: 'Marketing' },
  { value: 'empleabilidad',label: 'Empleabilidad' },
];

export default function SearchFilters({ search, setSearch, category, setCategory, profile, setProfile, total }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-8 space-y-4">
      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar curso o pack..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Categoría</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white text-gray-700"
          >
            {COURSE_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Profile filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Perfil profesional</label>
          <select
            value={profile}
            onChange={e => setProfile(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white text-gray-700"
          >
            {PROFILES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count & reset */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-navy-900">{total}</span> resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
        {(search || category !== 'Todos' || profile !== 'todos') && (
          <button
            onClick={() => { setSearch(''); setCategory('Todos'); setProfile('todos'); }}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
