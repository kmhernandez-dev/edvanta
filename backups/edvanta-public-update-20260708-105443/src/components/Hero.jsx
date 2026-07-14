const stats = [
  { value: '+6.000', label: 'Cursos gratis' },
  { value: '4', label: 'Herramientas pro' },
  { value: '100%', label: 'Editables' },
];

export default function Hero({ onExploreProducts, onExploreCourses }) {
  return (
    <section id="inicio" className="relative pt-24 pb-14 md:pt-28 md:pb-16 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.16),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Texto */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-teal-200 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-semibold text-teal-700">Aprende gratis · Aplica con herramientas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-950 leading-tight mb-5">
              Cursos <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">GRATIS</span> + herramientas complementarias para crecer profesionalmente
            </h1>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-7 max-w-lg mx-auto md:mx-0">
              Estudia gratis más de 6.000 cursos online y complementa tu formación con ebooks, herramientas y recursos editables para <strong className="text-gray-700">aplicar lo aprendido</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-8">
              <button onClick={onExploreCourses} className="btn-primary px-6 py-3 text-sm w-full sm:w-auto">
                Ver cursos gratis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button onClick={onExploreProducts} className="btn-secondary px-6 py-3 text-sm w-full sm:w-auto">
                Ver herramientas complementarias
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-6 sm:gap-8">
                  {i > 0 && <span className="w-px h-8 bg-gray-200" />}
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-extrabold text-navy-950">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
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
