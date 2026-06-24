import Icon from './Icon';

const colorMap = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  teal:    'bg-teal-50 border-teal-200 text-teal-700',
  blue:    'bg-blue-50 border-blue-200 text-blue-700',
  purple:  'bg-purple-50 border-purple-200 text-purple-700',
  indigo:  'bg-indigo-50 border-indigo-200 text-indigo-700',
  sky:     'bg-sky-50 border-sky-200 text-sky-700',
  amber:   'bg-amber-50 border-amber-200 text-amber-700',
  rose:    'bg-rose-50 border-rose-200 text-rose-700',
  orange:  'bg-orange-50 border-orange-200 text-orange-700',
};

const iconBg = {
  emerald: 'bg-emerald-100 text-emerald-700',
  teal:    'bg-teal-100 text-teal-700',
  blue:    'bg-blue-100 text-blue-700',
  purple:  'bg-purple-100 text-purple-700',
  indigo:  'bg-indigo-100 text-indigo-700',
  sky:     'bg-sky-100 text-sky-700',
  amber:   'bg-amber-100 text-amber-700',
  rose:    'bg-rose-100 text-rose-700',
  orange:  'bg-orange-100 text-orange-700',
};

export default function CategoryCard({ category, onViewKit }) {
  const chip = colorMap[category.color] || colorMap.teal;
  const ibg  = iconBg[category.color]  || iconBg.teal;

  return (
    <div className="card p-5 flex flex-col gap-3 group hover:border-navy-200">
      <div className="flex items-start justify-between gap-2">
        <div className={`w-11 h-11 rounded-xl ${ibg} flex items-center justify-center shrink-0`}>
          <Icon name={category.icon} className="w-6 h-6" />
        </div>
        <span className={`chip border ${chip} text-xs font-medium shrink-0`}>
          {category.resources} recursos
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold text-navy-950 leading-snug mb-1.5">
          {category.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          {category.description}
        </p>
      </div>

      <button
        onClick={() => onViewKit(category.packId)}
        className="mt-auto btn-secondary text-xs py-2 px-4 w-full group-hover:bg-navy-50"
      >
        Ver kit
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
