import { Link } from 'react-router-dom';

export default function Transparency() {
  return (
    <section className="edvanta bg-edvanta-light/60 py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-edvanta-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6 md:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-deep">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-edvanta-deep">Transparencia Edvanta</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Algunos enlaces a cursos pueden ser de afiliados: si te inscribes a través de ellos, Edvanta puede recibir una comisión sin costo adicional para ti. Esto nunca cambia nuestro criterio de selección ni el orden en que te mostramos las opciones.
            </p>
            <Link to="/afiliados" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-edvanta-blue hover:underline">
              Más sobre transparencia
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
