const stats = [
  { value: '+6.000', label: 'Cursos gratis' },
  { value: '4', label: 'Rutas clave' },
  { value: '100%', label: 'Herramientas aplicables' },
];

export default function Hero({ onExploreProducts, onExploreCourses }) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pb-14 pt-24 md:pb-16 md:pt-28">
      <div className="absolute inset-0 bg-dots opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="text-center md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-xs font-semibold text-teal-700">
                Cursos gratis · Herramientas listas · Rutas para crecer
              </span>
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Edvanta</p>
            <h1 className="mb-5 text-3xl font-bold leading-tight text-navy-950 sm:text-4xl md:text-5xl">
              Cursos <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">GRATIS</span> y herramientas para crecer profesionalmente
            </h1>

            <p className="mx-auto mb-7 max-w-lg text-base leading-relaxed text-gray-500 sm:text-lg md:mx-0">
              Encuentra formación virtual, rutas inteligentes y recursos prácticos para aprender más rápido,
              aplicar mejor y mostrar un perfil profesional más fuerte.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start">
              <button onClick={onExploreCourses} className="btn-primary w-full px-6 py-3 text-sm sm:w-auto">
                Ver cursos gratis
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button onClick={onExploreProducts} className="btn-secondary w-full px-6 py-3 text-sm sm:w-auto">
                Ver herramientas listas
              </button>
            </div>

            <div className="flex items-center justify-center gap-5 sm:gap-8 md:justify-start">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-5 sm:gap-8">
                  {i > 0 && <span className="h-8 w-px bg-gray-200" />}
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-extrabold text-navy-950">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="/img/hero-biblioteca.jpg"
              alt="Estudia cursos online y aplica con herramientas digitales"
              loading="eager"
              className="w-full rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
