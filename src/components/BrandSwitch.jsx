import { Link } from 'react-router-dom';
import Icon from './Icon';

/**
 * Franja que conecta las tres marcas de Karla Hernández.
 * `current` = 'biblioteca' | 'fst' | 'atenfarma' (resalta la actual)
 */
const BRANDS = [
  {
    id: 'biblioteca',
    to: '/',
    icon: 'book',
    name: 'Edvanta',
    desc: 'Packs, plantillas y rutas para profesionales',
    accent: 'from-navy-900 to-navy-800',
    ring: 'ring-navy-200',
  },
  {
    id: 'fst',
    to: '/feliz-sin-tiroides',
    icon: 'heart',
    name: 'Feliz Sin Tiroides®',
    desc: 'Salud tiroidea y metabólica para pacientes',
    accent: 'from-teal-600 to-blush-400',
    ring: 'ring-teal-200',
  },
  {
    id: 'atenfarma',
    to: '/atenfarmaclinic',
    icon: 'pill',
    name: 'AtenFarmaClinic',
    desc: 'Atención farmacéutica clínica para químicos farmacéuticos',
    accent: 'from-deepblue-700 to-teal-700',
    ring: 'ring-deepblue-600/20',
  },
];

export default function BrandSwitch({ current }) {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          El ecosistema Edvanta
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {BRANDS.map(b => {
            const isCurrent = b.id === current;
            const inner = (
              <div className={`relative h-full p-5 rounded-2xl border transition-all duration-300 ${
                isCurrent
                  ? `bg-gradient-to-br ${b.accent} text-white border-transparent shadow-md`
                  : 'bg-white border-gray-100 hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-md'
              }`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${isCurrent ? 'bg-white/15' : 'bg-teal-50'}`}>
                  <Icon name={b.icon} className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-teal-600'}`} />
                </div>
                <p className={`text-sm font-bold mb-1 ${isCurrent ? 'text-white' : 'text-navy-950'}`}>{b.name}</p>
                <p className={`text-xs leading-snug ${isCurrent ? 'text-white/80' : 'text-gray-500'}`}>{b.desc}</p>
                {isCurrent ? (
                  <span className="inline-block mt-3 text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">Estás aquí</span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-semibold text-teal-600">
                    Visitar
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            );
            return isCurrent
              ? <div key={b.id}>{inner}</div>
              : <Link key={b.id} to={b.to} className="block h-full">{inner}</Link>;
          })}
        </div>
      </div>
    </section>
  );
}
