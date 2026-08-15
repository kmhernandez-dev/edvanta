const steps = [
  { n: '01', title: 'Revisamos', desc: 'Analizamos su utilidad profesional.', icon: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z' },
  { n: '02', title: 'Organizamos', desc: 'Te mostramos qué conviene aprender primero.', icon: 'M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16.5l9 5 9-5' },
  { n: '03', title: 'Explicamos', desc: 'Presentamos modalidad, nivel y condiciones relevantes.', icon: 'M12 16v-4m0-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z' },
  { n: '04', title: 'Orientamos', desc: 'Relacionamos cada recurso con objetivos profesionales concretos.', icon: 'M12 22a10 10 0 100-20 10 10 0 000 20zM16 8l-2 6-6 2 2-6 6-2z' },
];

export default function SelectionMethod() {
  return (
    <section id="como-seleccionamos" className="edvanta bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow-edvanta mb-2">Cómo seleccionamos</p>
          <h2 className="font-display text-3xl font-extrabold text-edvanta-deep md:text-4xl">No recomendamos cursos al azar.</h2>
          <p className="mt-3 text-base text-slate-500">Cada recurso pasa por un criterio claro antes de llegar a ti.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(s => (
            <div key={s.n} className="relative">
              <span className="absolute -top-2 right-1 font-display text-5xl font-black leading-none text-edvanta-light" aria-hidden="true">{s.n}</span>
              <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-edvanta-light text-edvanta-blue">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </span>
              <h3 className="relative font-display text-lg font-bold text-edvanta-deep">{s.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
