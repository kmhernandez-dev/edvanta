/**
 * ============================================================
 *  catalogo.jsx — Los inicios como catálogo
 *
 *  Los inicios de profesionales, instituciones y pacientes muestran
 *  primero lo que se ofrece, en filas que se deslizan (cuatro tarjetas
 *  a la vista en escritorio, como el catálogo de cursos). Aquí están:
 *
 *   FilaDeCatalogo     título con ícono, flechas, «Ver todo» y la fila.
 *   TarjetaCurso       portada, insignias, área, horas y clases.
 *   TarjetaLibro       guía o ebook en vertical; sin portada propia,
 *                      una hecha con su título (PortadaGenerada).
 *   TarjetaGuia        kit editable: abre su ficha con precio.
 *   TarjetaArticulo    artículo con portada de su tema.
 *   TarjetaRuta        ruta con foto y el nombre encima.
 *   ServiciosPlegados  los servicios, escondidos en botones que abren
 *                      su contenido debajo.
 *   EncuestaRapida     tres pasos al final para conocer a quien llega.
 *                      Se guarda como solicitud de interés.
 *   AvisoNovedad       aviso que aparece una vez por visita con lo más
 *                      nuevo. Real: siempre el curso más reciente.
 * ============================================================
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, Bell, BookOpen, BrainCircuit, Briefcase, Check, ChevronDown, Clock, FileCheck2,
  HardHat, HeartPulse, LibraryBig, MessagesSquare, Newspaper, Pill, PlayCircle, Radio, Route, Salad, Send,
  ShieldCheck, Sparkles, X, Zap,
} from 'lucide-react';
import { apiUrl } from '../../config/api';
import { areaPorId, cursoPropio, portadaDeArticulo } from '../../data/edvanta/catalogoInicio';
import { portadaDeRuta } from '../../data/edvanta/imagenes';
import { formatoPrecio } from '../../data/edvanta/productos';
import { enviarSolicitud } from '../../lib/solicitudes';
import { trackEvent } from '../../utils/analytics';

/* ── Datos ─────────────────────────────────────────────────── */

/** Cursos propios publicados, como tarjetas. Solo los que tienen portada. */
export function useCursosConPortada(publico = 'profesionales') {
  const [estado, setEstado] = useState({ cargando: true, cursos: [] });
  useEffect(() => {
    let vivo = true;
    fetch(apiUrl(`/api/cursos-edvanta?limit=100&publico=${publico}`))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (vivo) setEstado({ cargando: false, cursos: (j?.data || []).filter((c) => c.coverUrl).map(cursoPropio) });
      })
      .catch(() => { if (vivo) setEstado({ cargando: false, cursos: [] }); });
    return () => { vivo = false; };
  }, [publico]);
  return estado;
}

/** Las rutas profesionales con su portada. Sin portada no se muestran. */
export function useRutasConPortada() {
  const [rutas, setRutas] = useState([]);
  useEffect(() => {
    let vivo = true;
    fetch(apiUrl('/api/learning-paths'))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!vivo) return;
        setRutas((j?.data || [])
          .map((r) => ({
            id: r.slug,
            nombre: r.name,
            to: `/rutas/${r.slug}`,
            portada: portadaDeRuta(r.slug),
            antetitulo: r.estimated_duration ? `Ruta · ${r.estimated_duration}` : 'Ruta profesional',
            accion: r.step_count ? `${r.step_count} pasos` : 'Ver la ruta',
          }))
          .filter((r) => r.portada));
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);
  return rutas;
}

/**
 * Los artículos más recientes de un público. El índice de artículos pesa
 * y no hace falta para el primer pantallazo: se carga aparte.
 */
export function useArticulosRecientes(publico = 'profesionales', cantidad = 12) {
  const [lista, setLista] = useState([]);
  useEffect(() => {
    let vivo = true;
    import('../../data/articulos')
      .then(({ articulos }) => {
        if (!vivo) return;
        const deSalud = (a) => a.publico === 'pacientes' || a.marca === 'contigo' || a.marca === 'fst';
        const delPublico = articulos.filter((a) => (publico === 'pacientes' ? deSalud(a) : !deSalud(a)));
        // Por fecha de publicación: la de actualización la tienen casi
        // todos el mismo día. Y a lo sumo dos con la misma portada, para
        // que la fila no repita la misma imagen.
        const recientes = [...delPublico].sort((x, y) => String(y.date || '').localeCompare(String(x.date || '')));
        const usos = {};
        const elegidos = [];
        for (const a of recientes) {
          const portada = portadaDeArticulo(a);
          if ((usos[portada] || 0) >= 2) continue;
          usos[portada] = (usos[portada] || 0) + 1;
          elegidos.push(a);
          if (elegidos.length >= cantidad) break;
        }
        setLista(elegidos);
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, [publico, cantidad]);
  return lista;
}

/** Mientras llegan los cursos: la forma de una fila, sin saltos. */
export function FilaCargando() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Cargando cursos">
      <div className="ds-skeleton h-7 w-56" />
      <div className="mt-5 flex gap-4 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-[78%] shrink-0 sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <div className="ds-skeleton aspect-[16/9] w-full" />
            <div className="ds-skeleton mt-3 h-4 w-4/5" />
            <div className="ds-skeleton mt-2 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

const ICONOS = {
  BookOpen, BrainCircuit, Briefcase, FileCheck2, HardHat, HeartPulse, LibraryBig, MessagesSquare, Newspaper, Pill, Route, Salad,
  ShieldCheck, Sparkles, Zap,
};


// Cuántas tarjetas se ven a la vez: en el celular se asoma la siguiente
// para que se note que la fila se desliza.
const ANCHOS = {
  curso: 'w-[78%] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]',
  libro: 'w-[44%] sm:w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)]',
  ruta: 'w-[84%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]',
};

const ocultarSiFalla = (e) => { e.currentTarget.style.visibility = 'hidden'; };

/* ── Fila ──────────────────────────────────────────────────── */

export function FilaDeCatalogo({
  id, titulo, subtitulo, icono, tono = 'blue', verTodo, items, render, ancho = 'curso',
}) {
  const pista = useRef(null);
  const [puede, setPuede] = useState({ atras: false, adelante: false });

  const medir = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuede({ atras: el.scrollLeft > 4, adelante: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir, items?.length]);

  if (!items?.length) return null;

  const mover = (dir) => pista.current?.scrollBy({ left: dir * pista.current.clientWidth * 0.9, behavior: 'smooth' });
  const flecha = 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-edvanta-border bg-white text-edvanta-deep transition hover:-translate-y-0.5 hover:border-edvanta-blue/40 hover:text-edvanta-blue hover:shadow-[var(--ds-sh-sm)] disabled:pointer-events-none disabled:opacity-35';

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-32 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <h2 id={`${id}-titulo`} className="font-display text-xl font-extrabold leading-tight text-edvanta-deep sm:text-2xl">{titulo}</h2>
              {subtitulo && <p className="mt-0.5 truncate text-sm text-edvanta-muted">{subtitulo}</p>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {verTodo && (
              <Link to={verTodo.to} className="mr-1 hidden items-center gap-1 text-sm font-bold text-edvanta-blue transition hover:gap-2 sm:inline-flex">
                {verTodo.label || 'Ver todo'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <button type="button" onClick={() => mover(-1)} disabled={!puede.atras} aria-label={`Ver anteriores: ${titulo}`} className={`${flecha} hidden sm:inline-flex`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => mover(1)} disabled={!puede.adelante} aria-label={`Ver más: ${titulo}`} className={`${flecha} hidden sm:inline-flex`}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={pista}
          onScroll={medir}
          className="ds-fila -mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 pt-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {items.map((item, i) => (
            <div key={item.id || item.slug || i} className={`shrink-0 snap-start ${ANCHOS[ancho] || ANCHOS.curso}`}>
              {render(item, i)}
            </div>
          ))}
        </div>

        {verTodo && (
          <Link to={verTodo.to} className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-edvanta-blue sm:hidden">
            {verTodo.label || 'Ver todo'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}

/* ── Tarjetas ──────────────────────────────────────────────── */

export function TarjetaCurso({ curso, nuevo = false, fila }) {
  const area = areaPorId(curso.area);
  const etiqueta = curso.etiqueta || area?.corto;
  return (
    <Link
      to={curso.to}
      onClick={() => trackEvent('catalogo_click', { fila: fila || null, curso: curso.id })}
      className="group ds-card ds-card--interactive flex h-full flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-edvanta-teal"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-edvanta-soft">
        <img
          src={curso.portada}
          alt=""
          width="640"
          height="360"
          loading="lazy"
          decoding="async"
          onError={ocultarSiFalla}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {etiqueta && <p className="text-xs font-semibold uppercase tracking-[.1em] text-edvanta-tealdark">{etiqueta}</p>}
        <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-edvanta-deep transition-colors group-hover:text-edvanta-blue">
          {curso.titulo}
        </h3>
        <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[13px] text-edvanta-muted">
          {curso.horas > 0 && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{curso.horas} h</span>}
          {curso.clases > 0 && <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />{curso.clases} clases</span>}
          {curso.certificado && <span className="inline-flex items-center gap-1 text-edvanta-tealdark"><Award className="h-3.5 w-3.5" aria-hidden="true" />Certificado</span>}
          {curso.detalle && <span>{curso.detalle}</span>}
          {curso.origen === 'edutin' && <span>Curso en Edutin</span>}
        </p>
        <span className="ed-btn ed-btn--primary ed-btn--sm ed-btn--block mt-4">
          {curso.origen === 'en-vivo' ? 'Registrar mi interés' : 'Estudiar gratis'}
          <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

const FONDOS_DE_PORTADA = [
  'linear-gradient(160deg, #031D5C 0%, #082E86 55%, #1C6E9C 100%)',
  'linear-gradient(160deg, #0B5A64 0%, #0F7480 50%, #25A7B0 100%)',
  'linear-gradient(160deg, #3F3790 0%, #5E51A8 50%, #8981CE 100%)',
];

/** Portada hecha con el título, para guías que no tienen la suya. */
export function PortadaGenerada({ titulo, sello, logo, tono = 0 }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-4 text-white" style={{ background: FONDOS_DE_PORTADA[tono % FONDOS_DE_PORTADA.length] }}>
      <span className="absolute inset-y-0 left-0 w-2 bg-black/15" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
      {logo ? <img src={logo} alt="" className="relative h-9 w-9 rounded-lg bg-white object-cover" /> : <span />}
      <p className="relative font-display text-[15px] font-extrabold leading-tight [text-wrap:balance] sm:text-base">{titulo}</p>
      <p className="relative text-xs font-semibold uppercase tracking-[.14em] text-white/80">{sello}</p>
    </div>
  );
}

/** Guía o ebook, en vertical. `href` externo (Hotmart) o `to` interno. */
export function TarjetaLibro({ libro, fila }) {
  const contenido = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--ds-r)] bg-edvanta-bg shadow-[var(--ds-sh-sm)] ring-1 ring-edvanta-border transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--ds-sh-md)]">
        {libro.portada ? (
          <img src={libro.portada} alt="" width="300" height="400" loading="lazy" decoding="async" onError={ocultarSiFalla} className="h-full w-full object-cover" />
        ) : (
          <PortadaGenerada titulo={libro.titulo} sello={libro.sello} logo={libro.logo} tono={libro.tono} />
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-edvanta-deep transition-colors group-hover:text-edvanta-blue">{libro.titulo}</h3>
      <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-edvanta-tealdark">
        {libro.accion || 'Ver la guía'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </p>
    </>
  );
  const alPulsar = () => {
    trackEvent('catalogo_click', { fila: fila || null, guia: libro.id });
    libro.onClick?.();
  };
  return libro.href ? (
    <a href={libro.href} target="_blank" rel="noopener noreferrer sponsored" onClick={alPulsar} className="group block outline-none focus-visible:ring-2 focus-visible:ring-edvanta-teal">
      {contenido}
    </a>
  ) : (
    <Link to={libro.to} onClick={alPulsar} className="group block outline-none focus-visible:ring-2 focus-visible:ring-edvanta-teal">
      {contenido}
    </Link>
  );
}

/** Kit de plantillas: abre su ficha (precio y carrito). */
export function TarjetaGuia({ guia, onAbrir }) {
  return (
    <button
      type="button"
      onClick={() => { trackEvent('catalogo_click', { fila: 'guias', guia: guia.slug }); onAbrir(guia); }}
      className="group ds-card ds-card--interactive flex h-full w-full flex-col overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-edvanta-teal"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-edvanta-bg">
        <img src={guia.imagen} alt="" width="640" height="480" loading="lazy" decoding="async" onError={ocultarSiFalla} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
      </div>
      <div className="flex w-full flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{guia.nombre}</h3>
        {guia.kit?.category && <p className="mt-1 line-clamp-2 text-xs leading-5 text-edvanta-muted">{guia.kit.category}</p>}
        <span className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-display text-base font-extrabold text-edvanta-blue">{formatoPrecio(guia.precio)}</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-edvanta-tealdark">Ver el kit <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
        </span>
      </div>
    </button>
  );
}

export function TarjetaArticulo({ articulo }) {
  return (
    <Link
      to={`/articulos/${articulo.slug}`}
      onClick={() => trackEvent('catalogo_click', { fila: 'articulos', articulo: articulo.slug })}
      className="group ds-card ds-card--interactive flex h-full flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-edvanta-teal"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-edvanta-soft">
        <img src={portadaDeArticulo(articulo)} alt="" width="640" height="360" loading="lazy" decoding="async" onError={ocultarSiFalla} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-3 font-display text-base font-bold leading-snug text-edvanta-deep transition-colors group-hover:text-edvanta-blue">{articulo.title}</h3>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] text-edvanta-muted">
          <Newspaper className="h-3.5 w-3.5" aria-hidden="true" /> Artículo{articulo.readingTime ? ` · ${articulo.readingTime} de lectura` : ''}
        </p>
      </div>
    </Link>
  );
}

/** Ruta con su foto y el nombre encima. */
export function TarjetaRuta({ ruta }) {
  return (
    <Link
      to={ruta.to}
      onClick={() => trackEvent('catalogo_click', { fila: 'rutas', ruta: ruta.id })}
      className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--ds-r-lg)] bg-edvanta-blue shadow-[var(--ds-sh-sm)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[var(--ds-sh-md)] focus-visible:ring-2 focus-visible:ring-edvanta-teal"
    >
      {ruta.portada && <img src={ruta.portada} alt="" width="800" height="600" loading="lazy" decoding="async" onError={ocultarSiFalla} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#031D5C]/92 via-[#031D5C]/35 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {ruta.antetitulo && <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-mint">{ruta.antetitulo}</p>}
        <h3 className="mt-1 font-display text-lg font-extrabold leading-tight sm:text-xl">{ruta.nombre}</h3>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
          {ruta.accion || 'Ver la ruta'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </p>
      </div>
    </Link>
  );
}

/* ── Servicios en botones ──────────────────────────────────── */

/**
 * `anclas` lleva los enlaces de antes a lo que ahora vive en un botón:
 * { catalogo: 'areas' } hace que /instituciones#catalogo abra «areas».
 * `listo` avisa cuando ya cargó lo de arriba: hasta entonces la sección
 * se movería y bajar a ella antes la dejaría lejos.
 */
export function ServiciosPlegados({ id, eyebrow, titulo, desc, servicios, anclas = {}, listo = true }) {
  const { hash } = useLocation();
  const [abierto, setAbierto] = useState(null);
  const base = useId();
  const seccion = useRef(null);
  const anclasRef = useRef(anclas);
  useEffect(() => {
    const destino = anclasRef.current[decodeURIComponent(hash.replace(/^#/, ''))];
    if (!destino) return;
    setAbierto(destino);
    if (listo) requestAnimationFrame(() => seccion.current?.scrollIntoView({ block: 'start' }));
  }, [hash, listo]);
  const elegido = servicios.find((s) => s.id === abierto);
  return (
    <section ref={seccion} id={id} className="scroll-mt-32 border-y border-edvanta-border bg-edvanta-bg">
      {Object.keys(anclas).map((a) => <span key={a} id={a} className="block scroll-mt-32" aria-hidden="true" />)}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-xl font-extrabold text-edvanta-deep sm:text-2xl">{titulo}</h2>
        {desc && <p className="mt-1 max-w-2xl text-sm leading-6 text-edvanta-muted">{desc}</p>}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {servicios.map((s) => {
            const Icono = s.icono;
            const on = abierto === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-expanded={on}
                aria-controls={`${base}-panel`}
                onClick={() => {
                  setAbierto(on ? null : s.id);
                  if (!on) trackEvent('servicio_abierto', { servicio: s.id });
                }}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition duration-200 ${on
                  ? 'border-edvanta-blue bg-edvanta-blue text-white shadow-[var(--ds-sh-btn)]'
                  : 'border-edvanta-border bg-white text-edvanta-deep hover:-translate-y-0.5 hover:border-edvanta-blue/40 hover:text-edvanta-blue hover:shadow-[var(--ds-sh-sm)]'}`}
              >
                {Icono && <Icono className="h-4 w-4" aria-hidden="true" />}
                {s.etiqueta}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${on ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        {elegido && (
          <div id={`${base}-panel`} role="region" aria-label={elegido.etiqueta} className="ds-desplegado mt-6 rounded-[var(--ds-r-lg)] border border-edvanta-border bg-white p-5 shadow-[var(--ds-sh-sm)] sm:p-7">
            {elegido.contenido}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Encuesta ──────────────────────────────────────────────── */

const ROTULOS_DE_ROL = {
  quimico: 'Químico farmacéutico',
  regente: 'Regente de farmacia',
  auxiliar: 'Auxiliar de farmacia',
  estudiante: 'Estudiante',
  otro_profesional: 'Otro profesional',
  paciente: 'Paciente',
  cuidador: 'Cuidador o familiar',
  otro: 'Otro',
};

function Chip({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition duration-200 active:scale-95 ${activo
        ? 'border-edvanta-teal bg-edvanta-mint text-edvanta-tealdark'
        : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-teal/50'}`}
    >
      {activo && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

/**
 * Tres pasos: qué le interesa, cómo y quién es, y a dónde escribirle.
 * Llega como solicitud de interés (con su `referencia`) al panel de
 * solicitudes del aula, como el resto de formularios del sitio.
 */
export function EncuestaRapida({
  referencia, eyebrow = 'Encuesta de un minuto', titulo, desc, temas, roles, modalidades, preguntaModalidad = '¿Cómo prefieres aprender?',
  preguntaTemas = '¿Qué te gustaría aprender?', preguntaIdea = '¿Qué curso o guía te gustaría que creáramos? (opcional)',
}) {
  const { pathname } = useLocation();
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({
    temas: [], modalidad: '', rol: '', mensaje: '', nombre: '', correo: '', aceptaTratamiento: false, aceptaNovedades: true, sitioWeb: '',
  });
  const [estado, setEstado] = useState('editando');
  const [error, setError] = useState(null);
  const base = useId();
  const inicio = useRef(null);

  const poner = (campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }));
  const alternarTema = (t) => setDatos((d) => ({ ...d, temas: d.temas.includes(t) ? d.temas.filter((x) => x !== t) : [...d.temas, t] }));
  const ir = (n) => {
    setPaso(n);
    if (n === 1) trackEvent('encuesta_avanzo', { referencia, paso: n });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    setError(null);
    const r = await enviarSolicitud({
      tipo: 'interes',
      referencia,
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.rol || null,
      areas: datos.temas,
      modalidad: datos.modalidad || null,
      mensaje: datos.mensaje.trim() || null,
      aceptaTratamiento: datos.aceptaTratamiento,
      aceptaNovedades: datos.aceptaNovedades,
      origen: pathname,
      sitioWeb: datos.sitioWeb,
    });
    if (r.ok) {
      setEstado('listo');
      trackEvent('encuesta_enviada', { referencia, temas: datos.temas.length });
      inicio.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setEstado('editando');
    setError(r.error);
  };

  const pasos = ['Intereses', 'Tu perfil', 'Tus datos'];
  const campo = 'mt-1.5 min-h-11 w-full rounded-[var(--ds-r-sm)] border border-edvanta-border bg-white px-3 text-[15px] font-normal text-edvanta-deep outline-none transition focus:border-edvanta-teal focus:ring-2 focus:ring-edvanta-teal/25';

  return (
    <section id="encuesta" className="ds-surface-glow scroll-mt-32 border-t border-edvanta-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-edvanta-deep sm:text-3xl">{titulo}</h2>
          {desc && <p className="mt-3 max-w-md text-base leading-7 text-edvanta-muted">{desc}</p>}
        </div>

        <div ref={inicio} className="ds-card scroll-mt-32 p-5 sm:p-7">
          {estado === 'listo' ? (
            <div className="ds-desplegado py-6 text-center">
              <p className="mt-4 font-display text-xl font-extrabold text-edvanta-deep">¡Gracias, {datos.nombre.split(' ')[0]}!</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-edvanta-muted">
                Ya tenemos tus respuestas. Te escribiremos a {datos.correo} cuando haya algo de {datos.temas.slice(0, 2).join(' y ').toLowerCase() || 'tu interés'}.
              </p>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate={false}>
              {/* Avance */}
              <ol className="flex items-center gap-2" aria-label="Pasos de la encuesta">
                {pasos.map((p, i) => (
                  <li key={p} className="flex flex-1 flex-col gap-1.5" aria-current={paso === i ? 'step' : undefined}>
                    <span className={`h-1.5 rounded-full transition-colors duration-300 ${i <= paso ? 'bg-edvanta-teal' : 'bg-edvanta-border'}`} />
                    <span className={`text-xs font-bold uppercase tracking-[.1em] ${i === paso ? 'text-edvanta-tealdark' : 'text-edvanta-subtle'}`}>{p}</span>
                  </li>
                ))}
              </ol>

              {paso === 0 && (
                <fieldset className="ds-desplegado mt-6">
                  <legend className="font-display text-lg font-extrabold text-edvanta-deep">{preguntaTemas}</legend>
                  <p className="mt-1 text-sm text-edvanta-muted">Elige todos los que quieras.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {temas.map((t) => <Chip key={t} activo={datos.temas.includes(t)} onClick={() => alternarTema(t)}>{t}</Chip>)}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button type="button" disabled={!datos.temas.length} onClick={() => ir(1)} className="ed-btn ed-btn--primary">
                      Siguiente <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
                    </button>
                  </div>
                </fieldset>
              )}

              {paso === 1 && (
                <div className="ds-desplegado mt-6 space-y-6">
                  <fieldset>
                    <legend className="font-display text-lg font-extrabold text-edvanta-deep">{preguntaModalidad}</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {modalidades.map(([k, v]) => <Chip key={k} activo={datos.modalidad === k} onClick={() => poner('modalidad', datos.modalidad === k ? '' : k)}>{v}</Chip>)}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="font-display text-lg font-extrabold text-edvanta-deep">Eres…</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {roles.map((k) => <Chip key={k} activo={datos.rol === k} onClick={() => poner('rol', datos.rol === k ? '' : k)}>{ROTULOS_DE_ROL[k] || k}</Chip>)}
                    </div>
                  </fieldset>
                  <label className="block text-sm font-semibold text-edvanta-deep" htmlFor={`${base}-idea`}>
                    {preguntaIdea}
                    <textarea id={`${base}-idea`} rows={2} maxLength={600} value={datos.mensaje} onChange={(e) => poner('mensaje', e.target.value)} className={`${campo} min-h-[4.5rem] py-2`} />
                  </label>
                  <div className="flex justify-between gap-3">
                    <button type="button" onClick={() => ir(0)} className="ed-btn ed-btn--ghost"><ArrowLeft aria-hidden="true" /> Atrás</button>
                    <button type="button" onClick={() => ir(2)} className="ed-btn ed-btn--primary">Siguiente <ArrowRight className="ed-btn__arrow" aria-hidden="true" /></button>
                  </div>
                </div>
              )}

              {paso === 2 && (
                <div className="ds-desplegado mt-6 space-y-4">
                  <p className="font-display text-lg font-extrabold text-edvanta-deep">¿A dónde te avisamos?</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-edvanta-deep" htmlFor={`${base}-nombre`}>
                      Tu nombre
                      <input id={`${base}-nombre`} required maxLength={120} autoComplete="name" value={datos.nombre} onChange={(e) => poner('nombre', e.target.value)} className={campo} />
                    </label>
                    <label className="block text-sm font-semibold text-edvanta-deep" htmlFor={`${base}-correo`}>
                      Tu correo
                      <input id={`${base}-correo`} type="email" required maxLength={160} autoComplete="email" value={datos.correo} onChange={(e) => poner('correo', e.target.value)} className={campo} />
                    </label>
                  </div>
                  {/* Trampa para robots: las personas no la ven. */}
                  <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={datos.sitioWeb} onChange={(e) => poner('sitioWeb', e.target.value)} className="hidden" />
                  <label className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-muted">
                    <input type="checkbox" required checked={datos.aceptaTratamiento} onChange={(e) => poner('aceptaTratamiento', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0F7480]" />
                    <span>Autorizo a Edvanta a usar estos datos para responderme, según la <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.</span>
                  </label>
                  <label className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-muted">
                    <input type="checkbox" checked={datos.aceptaNovedades} onChange={(e) => poner('aceptaNovedades', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0F7480]" />
                    <span>Quiero recibir avisos de cursos y guías nuevas.</span>
                  </label>
                  {error && <p role="alert" className="rounded-[var(--ds-r-sm)] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
                  <div className="flex justify-between gap-3 pt-1">
                    <button type="button" onClick={() => ir(1)} className="ed-btn ed-btn--ghost"><ArrowLeft aria-hidden="true" /> Atrás</button>
                    <button type="submit" disabled={estado === 'enviando'} aria-busy={estado === 'enviando' || undefined} className="ed-btn ed-btn--teal">
                      {estado === 'enviando' ? 'Enviando…' : 'Enviar mis respuestas'} <Send aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Aviso de novedad ──────────────────────────────────────── */

/**
 * Aparece una vez por visita, unos segundos después de entrar, con algo
 * nuevo y real (el curso más reciente). Espera a que se cierre el aviso
 * de cookies para no taparlo, y se va solo.
 */
export function AvisoNovedad({ clave, antetitulo = 'Nuevo en Edvanta', texto, to, imagen, accion = 'Ver el curso', retraso = 6000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!to || !texto) return undefined;
    try { if (sessionStorage.getItem(clave)) return undefined; } catch { /* sin almacenamiento: se muestra igual */ }
    let t;
    const intentar = () => {
      if (document.querySelector('[aria-label="Preferencias de analítica"]')) { t = setTimeout(intentar, 4000); return; }
      setVisible(true);
      try { sessionStorage.setItem(clave, '1'); } catch { /* nada */ }
    };
    t = setTimeout(intentar, retraso);
    return () => clearTimeout(t);
  }, [clave, to, texto, retraso]);

  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => setVisible(false), 14000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" className="ds-aviso fixed bottom-4 left-4 right-4 z-[60] sm:right-auto sm:w-[23rem]">
      <div className="relative flex gap-3 rounded-2xl border border-edvanta-border bg-white p-3 pr-10 shadow-[0_18px_44px_rgba(23,34,59,.22)]">
        {imagen && <img src={imagen} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
            <Bell className="h-3.5 w-3.5" aria-hidden="true" /> {antetitulo}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-edvanta-deep">{texto}</p>
          <Link to={to} onClick={() => { setVisible(false); trackEvent('aviso_novedad_click', { destino: to }); }} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-edvanta-blue hover:underline">
            {accion} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <button type="button" onClick={() => setVisible(false)} aria-label="Cerrar aviso" className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-edvanta-subtle transition hover:bg-edvanta-bg hover:text-edvanta-deep">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
