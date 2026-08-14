import { Link } from 'react-router-dom';

// Cada objetivo apunta a un destino REAL del sitio (ruta o categoría existente).
const goals = [
  {
    icon: 'M20 7h-3V6a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM9 6a1 1 0 011-1h4a1 1 0 011 1v1H9V6z',
    title: 'Conseguir mejores oportunidades laborales',
    desc: 'Cursos y habilidades con aplicación profesional.',
    to: '/rutas/empleabilidad-farmasalud',
  },
  {
    icon: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM5 4v3M18 16v3M4 18h3M17 5h3',
    title: 'Aprender Inteligencia Artificial',
    desc: 'Desde fundamentos hasta automatización y agentes.',
    to: '/cursos?category=Inteligencia+artificial',
  },
  {
    icon: 'M3 3v18h18M7 15l3-3 4 4 5-6',
    title: 'Dominar análisis de datos',
    desc: 'Excel, Power BI, SQL, Python y análisis.',
    to: '/rutas/datos-indicadores',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: 'Fortalecer calidad y procesos',
    desc: 'ISO, auditoría, mejora continua y gestión.',
    to: '/rutas/calidad-auditoria-mejora',
  },
  {
    icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1a4 4 0 10-4-4 4 4 0 004 4z',
    title: 'Crecer en gestión y liderazgo',
    desc: 'Proyectos, estrategia, productividad y equipos.',
    to: '/cursos?category=Gestión+de+calidad',
  },
  {
    icon: 'M4 4v5h5M20 20v-5h-5M5 9a8 8 0 0114-3m1 9a8 8 0 01-14 3',
    title: 'Actualizarme profesionalmente',
    desc: 'Recursos para mantener vigentes mis habilidades.',
    to: '/articulos',
  },
];

export default function GoalsSection() {
  return (
    <section id="objetivos" className="edvanta bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow-edvanta mb-2">Empieza por tu objetivo</p>
          <h2 className="font-display text-3xl font-extrabold text-edvanta-deep md:text-4xl">¿Qué quieres lograr?</h2>
          <p className="mt-3 text-base text-slate-500">
            Empieza por tu objetivo. Nosotros te ayudamos a organizar el camino.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map(g => (
            <Link
              key={g.title}
              to={g.to}
              className="card-edvanta group flex flex-col p-6 focus:outline-none focus:ring-2 focus:ring-edvanta-blue focus:ring-offset-2"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue transition-colors group-hover:bg-edvanta-blue group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={g.icon} />
                </svg>
              </span>
              <h3 className="mb-1.5 font-display text-lg font-bold leading-snug text-edvanta-deep">{g.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{g.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-edvanta-blue">
                Ver opciones
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
