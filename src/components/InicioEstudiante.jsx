/**
 * ============================================================
 *  InicioEstudiante.jsx — Lo primero que ve quien ya entró
 *
 *  Abre el inicio con sus cursos y su avance, y deja debajo el
 *  resto de la página: catálogo, empleo, herramientas.
 *
 *  No reemplaza el inicio ni lo esconde. Quien estudia también
 *  busca trabajo y usa las herramientas; quitarle la página
 *  completa por haber iniciado sesión sería dejarlo sin sitio a
 *  donde ir.
 *
 *  Si todavía no se ha inscrito en nada, en vez de un hueco vacío
 *  se le dice qué hacer y se le lleva al catálogo.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { misCursos } from '../lib/misCursos';
import { rutaEnAula } from '../aula/rutas';

function Avance({ valor, etiqueta }) {
  const pct = Math.max(0, Math.min(100, Math.round(Number(valor) || 0)));
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-edvanta-border"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={etiqueta}
    >
      <div className="h-full rounded-full bg-edvanta-teal transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Tarjeta({ curso }) {
  const pct = Math.round(Number(curso.progressPct) || 0);
  const empezado = pct > 0;
  // La portada de un curso de Edvanta se pide por su ruta pública, que el
  // navegador puede cachear. La de un curso de empresa no: esa va por el
  // aula, con sesión y sin caché, que es como tiene que ir.
  const portada = curso.coverFileId
    ? (curso.kind === 'edvanta' ? `/api/cursos-edvanta/${curso.courseId}/portada` : `/api/aula/files/${curso.coverFileId}`)
    : curso.coverUrl;
  return (
    <article className="flex w-[17rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-edvanta-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[19rem]">
      <div className="relative aspect-[16/9] shrink-0 bg-edvanta-light">
        {portada && (
          <img
            src={portada}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { e.currentTarget.remove(); }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-edvanta-deep">{curso.title}</h3>
        <div className="mt-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-edvanta-muted">
            <span>{curso.lessons?.done ?? 0} de {curso.lessons?.required ?? 0} clases</span>
            <span className="text-edvanta-deep">{pct} %</span>
          </div>
          <Avance valor={pct} etiqueta={`Avance en ${curso.title}`} />
        </div>
        <Link
          to={rutaEnAula(curso)}
          className="ed-btn ed-btn--primary"
        >
          {empezado ? 'Continuar curso' : 'Empezar curso'}
        </Link>
      </div>
    </article>
  );
}

export default function InicioEstudiante({ nombre }) {
  const [cursos, setCursos] = useState(null);
  const pista = useRef(null);
  const [puede, setPuede] = useState({ antes: false, despues: false });

  useEffect(() => {
    let vivo = true;
    misCursos().then((lista) => { if (vivo) setCursos(lista); });
    return () => { vivo = false; };
  }, []);

  const medir = () => {
    const el = pista.current;
    if (!el) return;
    setPuede({
      antes: el.scrollLeft > 8,
      despues: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  };

  useEffect(() => {
    medir();
    const el = pista.current;
    if (!el) return undefined;
    el.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      el.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, [cursos]);

  const mover = (signo) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: signo * (el.clientWidth * 0.85), behavior: 'smooth' });
  };

  // Mientras carga no se muestra nada: un esqueleto que aparece y
  // desaparece en medio segundo molesta más de lo que informa.
  if (cursos === null) return null;

  const pendientes = cursos.filter((c) => c.status !== 'completado');
  const saludo = nombre ? `Hola, ${nombre}` : 'Hola';
  const flecha = 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-edvanta-border bg-white transition disabled:opacity-0 disabled:pointer-events-none hover:border-edvanta-teal';

  return (
    <section className="border-b border-edvanta-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-edvanta-teal">Mi aula</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">{saludo}</h2>
            <p className="mt-1 text-sm leading-6 text-edvanta-muted">
              {cursos.length
                ? `Tienes ${pendientes.length} ${pendientes.length === 1 ? 'curso pendiente' : 'cursos pendientes'}.`
                : 'Todavía no has empezado ningún curso.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/aula"
              className="ed-btn ed-btn--secondary"
            >
              Ver todos mis cursos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {cursos.length > 2 && (
              <div className="hidden gap-2 sm:flex">
                <button type="button" className={flecha} onClick={() => mover(-1)} disabled={!puede.antes} aria-label="Ver cursos anteriores">
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button type="button" className={flecha} onClick={() => mover(1)} disabled={!puede.despues} aria-label="Ver más cursos">
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {cursos.length > 0 ? (
          <div
            ref={pista}
            className="-mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
          >
            {cursos.map((c) => <Tarjeta key={c.enrollmentId} curso={c} />)}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-edvanta-strong bg-edvanta-bg px-5 py-6">
            <GraduationCap className="h-8 w-8 shrink-0 text-edvanta-teal" aria-hidden="true" />
            <p className="flex-1 text-sm leading-6 text-edvanta-muted">
              Elige un curso de Edvanta y empieza hoy. Tu avance se guarda solo y puedes retomarlo cuando quieras.
            </p>
            <Link
              to="/aula"
              className="ed-btn ed-btn--primary"
            >
              Ver los cursos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
