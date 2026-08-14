const microProofs = [
  'Opciones gratuitas',
  'Rutas organizadas',
  'Diferentes plataformas',
  'Información clara antes de inscribirte',
];

const floatingCards = [
  { pos: '-left-3 top-8', area: 'Datos', meta: 'Ruta: Analítica' },
  { pos: '-right-3 top-1/3', area: 'Calidad', meta: '4 etapas' },
  { pos: 'bottom-8 left-10', area: 'IA aplicada', meta: 'Nivel inicial' },
];

const Check = () => (
  <svg className="h-4 w-4 shrink-0 text-edvanta-blue" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Hero({ onFindRoute, onExploreCourses }) {
  return (
    <section id="inicio" className="edvanta relative overflow-hidden bg-gradient-to-b from-edvanta-light to-white pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-edvanta-blue/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-edvanta-mint/40 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

          {/* Copy */}
          <div className="text-center lg:text-left">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3.5 py-1.5 text-xs font-semibold text-edvanta-deep shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-edvanta-blue" />
              Aprendizaje para avanzar profesionalmente
            </span>

            <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.08] text-edvanta-deep sm:text-5xl md:text-[3.4rem]">
              Aprende lo que <span className="text-edvanta-blue">realmente</span> puede ayudarte a avanzar.
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Cursos, rutas y recursos seleccionados para desarrollar habilidades que puedes aplicar en tu trabajo, carrera o próximo proyecto.
            </p>

            <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button onClick={onFindRoute} className="btn-edvanta w-full sm:w-auto">
                Encuentra tu ruta
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <button onClick={onExploreCourses} className="btn-edvanta-outline w-full sm:w-auto">
                Explorar cursos
              </button>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
              {microProofs.map(t => (
                <li key={t} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Check /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Imagen editorial + tarjetas flotantes */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <img
              src="/img/hero-biblioteca.jpg"
              alt="Persona adulta estudiando y aplicando lo aprendido en su trabajo"
              loading="eager"
              className="w-full rounded-[1.75rem] shadow-2xl ring-1 ring-edvanta-deep/5"
            />
            {floatingCards.map(c => (
              <div
                key={c.area}
                className={`absolute ${c.pos} hidden items-center gap-2.5 rounded-2xl border border-edvanta-border bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:flex`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-edvanta-light text-edvanta-blue">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[11px] font-bold leading-tight text-edvanta-deep">{c.area}</span>
                  <span className="block text-[11px] leading-tight text-slate-500">{c.meta}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
