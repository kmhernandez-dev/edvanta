import { Link } from 'react-router-dom';

const gateways = [
  {
    title: 'AtenFarmaClinic',
    eyebrow: 'Farmacia clínica',
    text: 'Impulsa tu práctica clínica.',
    to: '/atenfarmaclinic',
    image: '/img/port-logoatenfarmaclinic.jpg',
    accent: 'bg-teal-50 text-teal-700 ring-teal-100',
    action: 'Entrar a AtenFarmaClinic',
  },
  {
    title: 'Feliz Sin Tiroides',
    eyebrow: 'Salud tiroidea',
    text: 'Guía clara para vivir mejor.',
    to: '/feliz-sin-tiroides',
    image: '/img/port-logofelizsintiroides.jpg',
    accent: 'bg-blush-50 text-blush-600 ring-blush-100',
    action: 'Entrar a Feliz Sin Tiroides',
  },
];

export default function BrandGatewaySection() {
  return (
    <section className="bg-white py-4 md:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 md:grid-cols-2">
          {gateways.map((item) => (
            <Link
              key={item.to}
              to={item.to}
            className="group flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
          >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ${item.accent}`}>
                <img src={item.image} alt="" width="40" height="40" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.eyebrow}</p>
                <h2 className="truncate text-sm font-bold text-navy-950">{item.title}</h2>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{item.text}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-1 text-sm font-bold text-teal-700 sm:inline-flex">
                Ver
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
