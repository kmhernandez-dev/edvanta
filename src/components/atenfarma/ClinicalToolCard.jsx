import { Link } from 'react-router-dom';

const STATUS_MAP = {
  available: { label: 'Disponible', className: 'bg-teal-50 text-teal-700 border-teal-200' },
  demo: { label: 'Demostración', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  upcoming: { label: 'Próximamente', className: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const ICON_PATHS = {
  clipboard: 'M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  scale: 'M12 4v16M7 20h10M6 4h12M6 4 3 11h6L6 4Zm12 0-3 7h6l-3-7Z',
  shield: 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  message: 'M4 5h16v11H9l-5 4V5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  beaker: 'M9 4h6M10 4v5l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V4M7.5 14h9',
  chart: 'M5 19V11M10 19V5M15 19v-6M20 19V8M4 21h16',
  book: 'M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13',
};

export default function ClinicalToolCard({ tool }) {
  const status = STATUS_MAP[tool.status] || STATUS_MAP.upcoming;
  const d = ICON_PATHS[tool.icon] || ICON_PATHS.clipboard;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all flex flex-col">
      <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-4 shrink-0">
        <svg className="w-5 h-5 text-deepblue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={d} />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-deepblue-900 mb-1.5">{tool.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{tool.activity}</p>
      <div className="text-[11px] text-gray-400 mb-3 space-y-0.5">
        <p><span className="font-medium text-gray-500">Resultado:</span> {tool.result}</p>
        <p><span className="font-medium text-gray-500">Perfil:</span> {tool.audience}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.className}`}>
          {status.label}
        </span>
        {tool.status !== 'upcoming' && (
          <Link
            to={tool.route}
            className="text-xs font-semibold text-deepblue-700 hover:text-teal-600 transition-colors flex items-center gap-1"
          >
            Acceder
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
