/**
 * Piezas visuales y tarjetas de la Escuela de Marketing.
 *
 * Las composiciones son ejemplos de estructura, no proyectos
 * contratados: cuando una pieza se presenta como muestra, lleva el
 * rótulo «Ejemplo ilustrativo». No hay métricas, clientes ni resultados
 * inventados.
 */

import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, CircleDot, FileText, LayoutGrid, LineChart, Megaphone,
  NotebookPen, Presentation, Sparkles,
} from 'lucide-react';

const ICONOS_SERVICIO = {
  'estrategia-y-posicionamiento': Megaphone,
  'comunicacion-cientifica': FileText,
  'materiales-comerciales': Presentation,
  'contenido-digital-y-video': LayoutGrid,
  'landing-pages-y-campanas': Sparkles,
  'formacion-de-equipos': NotebookPen,
};

export function MarketingSection({ id, tone = 'white', className = '', children }) {
  const tonos = {
    white: 'bg-white',
    lavender: 'marketing-bg-lavender',
    mint: 'marketing-bg-mint',
  };
  return (
    <section id={id} className={`${tonos[tone] || tonos.white} ${id ? 'scroll-mt-28' : ''} ${className}`.trim()}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function MarketingEyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-edvanta-tealdark">
      <span className="h-0.5 w-6 rounded-full bg-gradient-to-r from-edvanta-violet to-edvanta-teal" aria-hidden="true" />
      {children}
    </p>
  );
}

export function EstadoMarketing({ estado = 'en_desarrollo' }) {
  const map = {
    en_desarrollo: { label: 'En desarrollo', clase: 'bg-edvanta-lilac text-[#5E51A8] ring-[#DDD5F4]' },
    a_solicitud: { label: 'Bajo propuesta', clase: 'bg-edvanta-mint text-edvanta-tealdark ring-[#C9E9E5]' },
  };
  const e = map[estado] || map.en_desarrollo;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${e.clase}`}>
      <CircleDot className="h-3 w-3" aria-hidden="true" />
      {e.label}
    </span>
  );
}

/* ── Composiciones visuales ─────────────────────────────── */

export function MarketingHeroVisual() {
  return (
    <div
      className="marketing-stage"
      role="img"
      aria-label="Composición de una portada de programa, una ficha científica y una pieza de campaña de Edvanta"
    >
      <div className="marketing-stage__poster" aria-hidden="true">
        <span className="marketing-stage__kicker">Programa en desarrollo</span>
        <p className="marketing-stage__title">Marketing farmacéutico</p>
        <p className="marketing-stage__line">Ciencia, públicos y estrategia</p>
        <div className="marketing-stage__bars">
          <span /><span /><span />
        </div>
        <div className="marketing-stage__meta">Edvanta · Escuela de Marketing</div>
      </div>

      <div className="marketing-stage__sheet" aria-hidden="true">
        <span className="marketing-stage__sheet-head">Ficha científica</span>
        <p>Pregunta de comunicación</p>
        <div className="marketing-stage__rule" />
        <p>Hallazgo principal</p>
        <div className="marketing-stage__rule marketing-stage__rule--short" />
        <p className="marketing-stage__ref">Referencia · fuente verificable</p>
      </div>

      <div className="marketing-stage__campaign" aria-hidden="true">
        <img src="/img/escuelas/marketing.webp" alt="" width="1200" height="800" loading="eager" />
        <div className="marketing-stage__campaign-body">
          <span>Pieza de campaña · ejemplo</span>
          <p>Una idea clara, un público y un siguiente paso.</p>
          <div className="marketing-stage__cta">Ver la propuesta <ArrowRight className="h-3 w-3" /></div>
        </div>
      </div>
    </div>
  );
}

function VisualFicha() {
  return (
    <div className="marketing-example__surface marketing-example__surface--ficha">
      <span className="marketing-example__kicker">Ficha científica · ejemplo</span>
      <h4>Qué se puede afirmar</h4>
      <div className="marketing-example__line marketing-example__line--long" />
      <div className="marketing-example__line" />
      <div className="marketing-example__mini">
        <span>Hallazgo</span><span>Límite</span><span>Referencia</span>
      </div>
      <p className="marketing-example__small">Una fuente, un alcance y una frase que no exagera.</p>
    </div>
  );
}

function VisualAid() {
  return (
    <div className="marketing-example__surface marketing-example__surface--aid">
      <span className="marketing-example__kicker">Visual aid · ejemplo</span>
      <div className="marketing-example__steps">
        <span>01<br /><strong>Contexto</strong></span>
        <span>02<br /><strong>Evidencia</strong></span>
        <span>03<br /><strong>Siguiente paso</strong></span>
      </div>
      <p className="marketing-example__small">Una secuencia para acompañar la conversación, no para reemplazarla.</p>
    </div>
  );
}

function VisualCalendario() {
  const dias = [
    ['Lun', 'Público y necesidad'],
    ['Mar', 'Evidencia clave'],
    ['Mié', 'Pieza educativa'],
    ['Jue', 'Revisión'],
    ['Vie', 'Publicación'],
    ['Sáb', 'Aprendizaje'],
  ];
  return (
    <div className="marketing-example__surface marketing-example__surface--calendar">
      <span className="marketing-example__kicker">Calendario editorial · ejemplo</span>
      <div className="marketing-example__calendar">
        {dias.map(([d, t]) => (
          <span key={d}><strong>{d}</strong><em>{t}</em></span>
        ))}
      </div>
    </div>
  );
}

function VisualLanding() {
  return (
    <div className="marketing-example__surface marketing-example__surface--landing">
      <span className="marketing-example__kicker">Landing de campaña · ejemplo</span>
      <div className="marketing-example__browser">
        <span className="marketing-example__browser-dot" />
        <span className="marketing-example__browser-dot" />
        <span className="marketing-example__browser-dot" />
      </div>
      <h4>Una idea que se entiende antes de bajar.</h4>
      <div className="marketing-example__line marketing-example__line--long" />
      <div className="marketing-example__line" />
      <span className="marketing-example__cta">Solicitar información</span>
    </div>
  );
}

function VisualPrograma() {
  return (
    <div className="marketing-example__surface marketing-example__surface--program">
      <span className="marketing-example__kicker">Programa de capacitación · ejemplo</span>
      <div className="marketing-example__agenda">
        <span><strong>Sesión 1</strong> Contexto y públicos</span>
        <span><strong>Sesión 2</strong> Mensajes y evidencia</span>
        <span><strong>Sesión 3</strong> Práctica y revisión</span>
      </div>
    </div>
  );
}

const VISUALES = {
  ficha: VisualFicha,
  visual: VisualAid,
  calendario: VisualCalendario,
  landing: VisualLanding,
  programa: VisualPrograma,
  campana: VisualLanding,
};

export function EjemploEntregable({ ejemplo, compact = false }) {
  const Visual = VISUALES[ejemplo.variante] || VisualFicha;
  return (
    <article className={`marketing-example ${compact ? 'marketing-example--compact' : ''}`}>
      <Visual />
      <div className="marketing-example__caption">
        <p className="marketing-example__title">{ejemplo.titulo}</p>
        <p className="marketing-example__desc">{ejemplo.desc}</p>
        <span className="marketing-example__tag">Ejemplo ilustrativo</span>
      </div>
    </article>
  );
}

/* ── Tarjetas ───────────────────────────────────────────── */

export function ProgramaMarketingCard({ programa, escuelaSlug }) {
  return (
    <article className="marketing-card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <EstadoMarketing estado="en_desarrollo" />
        <span className="text-[11px] font-bold uppercase tracking-[.1em] text-edvanta-subtle">{programa.linea}</span>
      </div>
      <h3 className="mt-4 font-display text-xl font-extrabold leading-snug text-edvanta-deep">{programa.nombre}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{programa.resumen}</p>
      <p className="mt-4 border-l-2 border-edvanta-teal/50 pl-3 text-sm font-semibold leading-6 text-edvanta-deep">
        {programa.resultado}
      </p>
      <Link
        to={`/escuelas/${escuelaSlug}/programas/${programa.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline"
      >
        Conocer la propuesta
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function ServicioMarketingCard({ servicio }) {
  const Icono = ICONOS_SERVICIO[servicio.slug] || Megaphone;
  return (
    <article className="marketing-card flex h-full flex-col p-6">
      <span className="marketing-card__icon">
        <Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <EstadoMarketing estado="a_solicitud" />
      </div>
      <h3 className="mt-3 font-display text-xl font-extrabold leading-snug text-edvanta-deep">{servicio.nombre}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{servicio.resumen}</p>
      <p className="mt-4 rounded-xl bg-edvanta-bg px-3.5 py-3 text-xs leading-5 text-edvanta-deep">
        <span className="font-bold">Ejemplo de entregable: </span>{servicio.entregables[0]}
      </p>
      <Link
        to={`/empresas/marketing/${servicio.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline"
      >
        Conocer el servicio
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function ProcesoMarketing({ pasos }) {
  return (
    <ol className="marketing-process">
      {pasos.map((paso, i) => (
        <li key={paso.titulo} className="marketing-process__step">
          <span className="marketing-process__num">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{paso.titulo}</h3>
            <p>{paso.trabajo}</p>
            <span className="marketing-process__out">{paso.salida}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── Pestañas de áreas ──────────────────────────────────── */

export function MarketingAreaTabs({ areas }) {
  const [activa, setActiva] = useState(areas[0]?.id);
  const baseId = useId();
  const area = areas.find((a) => a.id === activa) || areas[0];

  const mover = (event) => {
    const actual = areas.findIndex((a) => a.id === area?.id);
    const paso = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!paso) return;
    event.preventDefault();
    const siguiente = areas[(actual + paso + areas.length) % areas.length];
    setActiva(siguiente.id);
    document.getElementById(`${baseId}-tab-${siguiente.id}`)?.focus();
  };

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Áreas de la Escuela de Marketing" className="marketing-tabs">
        {areas.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${a.id}`}
            aria-selected={activa === a.id}
            aria-controls={`${baseId}-panel-${a.id}`}
            onClick={() => setActiva(a.id)}
            onKeyDown={mover}
            className="marketing-tab"
          >
            {a.nombre}
          </button>
        ))}
      </div>

      {areas.map((a) => (
        <div
          key={a.id}
          id={`${baseId}-panel-${a.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${a.id}`}
          hidden={a.id !== area?.id}
          className="mt-6"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
            <div className="marketing-panel">
              <p className="text-sm leading-7 text-edvanta-deep">{a.aprende}</p>
              <ul className="mt-5 space-y-2.5">
                {a.aplicaciones.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {a.programas.map((slug) => (
                  <Link
                    key={slug}
                    to={`/escuelas/${ESCUELA_MARKETING_SLUG}/programas/${slug}`}
                    className="text-sm font-bold text-edvanta-blue hover:underline"
                  >
                    Ver programa
                  </Link>
                ))}
                {a.servicios.map((slug) => (
                  <Link
                    key={slug}
                    to={`/empresas/marketing/${slug}`}
                    className="text-sm font-bold text-edvanta-tealdark hover:underline"
                  >
                    Ver servicio
                  </Link>
                ))}
              </div>
            </div>
            <div className="marketing-area-visual" aria-hidden="true">
              <span className="marketing-area-visual__kicker">{a.nombre}</span>
              <p>{a.resumen}</p>
              <div className="marketing-area-visual__list">
                {a.aplicaciones.map((x, i) => (
                  <span key={x}><em>0{i + 1}</em>{x}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Solo para construir enlaces desde esta pieza. */
const ESCUELA_MARKETING_SLUG = 'marketing-y-comunicacion-farmaceutica';
