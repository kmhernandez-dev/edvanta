import { waLink } from '../config/links';

const colorStyles = {
  teal: {
    border:  'border-teal-200',
    badge:   'bg-teal-50 text-teal-700',
    num:     'text-teal-600',
    dot:     'bg-teal-400',
  },
  navy: {
    border:  'border-navy-200',
    badge:   'bg-navy-50 text-navy-700',
    num:     'text-navy-600',
    dot:     'bg-navy-400',
  },
  gold: {
    border:  'border-amber-200',
    badge:   'bg-amber-50 text-amber-700',
    num:     'text-amber-600',
    dot:     'bg-amber-400',
  },
};

export default function RouteCard({ route, onViewPack }) {
  const s = colorStyles[route.color] || colorStyles.teal;

  const waUrl = waLink(`Hola, equipo Edvanta. Me interesa la ruta "${route.name}". ¿Pueden orientarme?`);

  return (
    <div className={`card border-l-4 ${s.border} p-6 flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div>
          <div className={`text-3xl font-black ${s.num} leading-none mb-0.5`}>{route.number}</div>
          <div className="text-lg">{route.icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-navy-950 leading-snug">{route.name}</h3>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            <span className={`chip text-xs ${s.badge}`}>⏱ {route.duration}</span>
            <span className="chip text-xs bg-gray-50 text-gray-600">{route.level}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">{route.description}</p>

      {/* Courses list */}
      <div>
        <p className="text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wide">Cursos incluidos</p>
        <div className="flex flex-wrap gap-1.5">
          {route.courses.map(c => (
            <span key={c} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended packs */}
      <div>
        <p className="text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wide">Packs recomendados</p>
        <div className="flex flex-col gap-1.5">
          {route.recommendedPacks.map(p => (
            <button
              key={p.id}
              onClick={() => onViewPack(p.id)}
              className="flex items-center justify-between px-3 py-2 bg-navy-50 hover:bg-navy-100 rounded-lg text-xs font-medium text-navy-800 transition-colors text-left group"
            >
              <span>📦 {p.name}</span>
              <svg className="w-3.5 h-3.5 text-navy-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline-teal text-xs py-2 text-center mt-auto"
      >
        Armar mi ruta con esta guía
      </a>
    </div>
  );
}
