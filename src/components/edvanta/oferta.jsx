/**
 * ============================================================
 *  oferta.jsx — Piezas para mostrar la oferta de Edvanta
 *
 *  Escuelas, productos, paquetes y su estado se pintan siempre con
 *  estas piezas, para que una misma cosa se vea igual en el inicio,
 *  en su escuela y en su ficha. Los datos salen de src/data/edvanta.
 *
 *  Profesionales y pacientes llevan tonos distintos a propósito
 *  (azul y turquesa): quien llega debe saber de un vistazo si una
 *  ficha es para quien atiende o para quien se cuida.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CalendarClock, CheckCircle2, FileCheck2, GraduationCap, HeartPulse, Megaphone, MonitorPlay, ShieldCheck, Tag, Users,
} from 'lucide-react';
import { apiUrl } from '../../config/api';
import { ESTADOS, ORIGENES } from '../../data/edvanta/estados';
import { formatoPrecio } from '../../data/edvanta/productos';

export const ICONOS_ESCUELA = { HeartPulse, ShieldCheck, FileCheck2, Megaphone };

// Ficha del ícono de cada escuela (sistema de diseño 2.0).
const TILE = { teal: 'ds-icon-tile--teal', blue: '', violet: 'ds-icon-tile--violet', amber: 'ds-icon-tile--violet' };

export function EstadoBadge({ estado, className = '' }) {
  const e = ESTADOS[estado];
  if (!e) return null;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${e.clase} ${className}`}>
      {e.etiqueta}
    </span>
  );
}

export function OrigenBadge({ origen }) {
  if (!ORIGENES[origen]) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-edvanta-muted ring-1 ring-inset ring-edvanta-border">
      {ORIGENES[origen]}
    </span>
  );
}

/** Para quién es: profesionales (azul) o pacientes (turquesa). */
export function PublicoBadge({ publico }) {
  const pacientes = publico === 'pacientes';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${pacientes ? 'bg-edvanta-mint text-edvanta-tealdark' : 'bg-edvanta-light text-edvanta-blue'}`}>
      {pacientes ? <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" /> : <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />}
      {pacientes ? 'Para pacientes y cuidadores' : 'Para profesionales'}
    </span>
  );
}

/**
 * Cursos virtuales propios publicados en el aula.
 * `publico` evita mezclar los de pacientes con los profesionales.
 */
export function useCursosPropios({ publico = 'profesionales', area = null, limite = 60 } = {}) {
  const [estado, setEstado] = useState({ cargando: true, cursos: [], error: false });
  useEffect(() => {
    let vivo = true;
    const q = new URLSearchParams({ limit: String(limite), publico });
    if (area) q.set('area', area);
    fetch(apiUrl(`/api/cursos-edvanta?${q}`))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (!vivo) return;
        setEstado({ cargando: false, error: false, cursos: (j?.data || []).map((c) => ({
          id: `propio-${c.id}`,
          title: c.title,
          description: c.shortDescription,
          image: c.coverUrl,
          to: c.to,
          area: c.area,
          category: c.category,
          lessons: c.lessons,
          ctaLabel: 'Ver el curso',
        })) });
      })
      .catch(() => { if (vivo) setEstado({ cargando: false, cursos: [], error: true }); });
    return () => { vivo = false; };
  }, [publico, area, limite]);
  return estado;
}

export function EscuelaCard({ escuela, cursos = null }) {
  const Icono = ICONOS_ESCUELA[escuela.icono] || GraduationCap;
  const areas = escuela.recorridos.flatMap((r) => r.areas);
  const listas = areas.filter((a) => a.estado === 'disponible').length;
  const conteo = typeof cursos === 'number' && cursos > 0
    ? `${cursos} ${cursos === 1 ? 'curso virtual' : 'cursos virtuales'}`
    : listas > 0
      ? `${listas} de ${areas.length} áreas disponibles`
      : 'En desarrollo';
  return (
    <Link to={`/escuelas/${escuela.slug}`} className="group ds-card ds-card--interactive flex h-full flex-col overflow-hidden">
      {escuela.imagen && (
        <div className="relative aspect-[16/11] overflow-hidden bg-edvanta-bg">
          <img src={escuela.imagen} alt={escuela.imagenAlt} width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031D5C]/45 via-transparent to-transparent" aria-hidden="true" />
          <span className="ds-chip ds-chip--glass absolute bottom-3 left-3">{conteo}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col px-6 pb-6">
        <span className={`ds-icon-tile ${TILE[escuela.tono] || ''} relative h-12 w-12 ring-4 ring-white ${escuela.imagen ? '-mt-6' : 'mt-6'}`}>
          <Icono className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h3 className="mt-4 font-display text-lg font-extrabold leading-snug text-edvanta-deep">{escuela.nombre}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{escuela.resumen}</p>
        {!escuela.imagen && <p className="mt-4 text-[13px] font-semibold text-edvanta-deep">{conteo}</p>}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
          Conocer la escuela
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/** Lista de áreas de una escuela, cada una con su estado real. */
export function ListaDeAreas({ areas }) {
  return (
    <ul className="ds-card divide-y divide-edvanta-border overflow-hidden">
      {areas.map((a) => {
        const destino = a.producto ? `/cursos/en-vivo/${a.producto}` : a.to;
        const punto = a.estado === 'disponible' ? 'bg-edvanta-teal' : a.estado === 'proxima_apertura' ? 'bg-edvanta-violet' : 'bg-edvanta-strong';
        const cuerpo = (
          <>
            <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${punto}`} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-edvanta-deep">{a.nombre}</span>
              {a.nota && <span className="mt-0.5 block text-sm leading-6 text-edvanta-muted">{a.nota}</span>}
            </span>
            <EstadoBadge estado={a.estado} />
            {destino && <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-edvanta-blue transition-transform group-hover:translate-x-1" aria-hidden="true" />}
          </>
        );
        return (
          <li key={a.nombre}>
            {destino ? (
              <Link to={destino} className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-edvanta-soft/70">{cuerpo}</Link>
            ) : (
              <div className="flex items-start gap-3 px-5 py-4">{cuerpo}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Tarjeta de un producto propio (curso en vivo, guía, kit). */
export function ProductoCard({ producto, onVerKit }) {
  const p = producto;
  const accion = p.tipo === 'plantillas'
    ? { etiqueta: 'Ver el kit', onClick: () => onVerKit?.(p.kit) }
    : p.accion?.tipo === 'externo'
      ? { etiqueta: p.accion.etiqueta, href: p.accion.href }
      : { etiqueta: p.accion?.tipo === 'interes' ? 'Ver detalles y registrar interés' : (p.accion?.etiqueta || 'Ver'), to: p.to || p.accion?.to };
  const clsBoton = 'ed-btn ed-btn--primary mt-6';
  const datos = [
    p.modalidad && { icon: MonitorPlay, texto: p.modalidad, k: 'Modalidad' },
    (p.tipo !== 'guia' || p.precio === 0) && { icon: Tag, texto: formatoPrecio(p.precio), k: 'Valor' },
    p.tipo === 'curso_en_vivo' && { icon: CalendarClock, texto: p.fechaInicio || 'Fecha de inicio por confirmar', k: 'Inicio' },
  ].filter(Boolean);

  return (
    <article className="ds-card ds-card--interactive flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <EstadoBadge estado={p.estado} />
        <PublicoBadge publico={p.publico} />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{p.tipoTexto}</p>
      <h3 className="mt-1.5 font-display text-lg font-extrabold leading-snug text-edvanta-deep">{p.nombre}</h3>
      {p.dirigidoA && <p className="mt-2 text-sm leading-6 text-edvanta-muted"><span className="font-semibold text-edvanta-deep">Para: </span>{p.dirigidoA}</p>}
      <ul className="mt-4 flex-1 space-y-2 text-sm text-edvanta-deep">
        {datos.map(({ icon: I, texto, k }) => (
          <li key={k} className="flex items-center gap-2">
            <I className="h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
            <span className="sr-only">{k}: </span>{texto}
          </li>
        ))}
      </ul>
      {accion.href ? (
        <a href={accion.href} target="_blank" rel="noopener noreferrer" className={clsBoton}>{accion.etiqueta}</a>
      ) : accion.to ? (
        <Link to={accion.to} className={clsBoton}>{accion.etiqueta}</Link>
      ) : (
        <button type="button" onClick={accion.onClick} className={clsBoton}>{accion.etiqueta}</button>
      )}
      {p.accion?.nota && <p className="mt-2 text-xs text-edvanta-muted">{p.accion.nota}</p>}
    </article>
  );
}

/** Tarjeta de un paquete institucional, con todo lo que pide quien compra. */
export function PaqueteCard({ paquete, onSolicitar }) {
  const p = paquete;
  return (
    <article id={p.slug} className="group ds-card flex h-full scroll-mt-28 flex-col overflow-hidden">
      {p.imagen && (
        <div className="relative aspect-[2/1] overflow-hidden bg-edvanta-bg">
          <img src={p.imagen} alt={p.imagenAlt} width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031D5C]/70 via-[#031D5C]/10 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-white/90">{p.lema}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-white">{p.nombre}</h3>
            </div>
            <EstadoBadge estado={p.estado} className="shadow-sm" />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {!p.imagen && <h3 className="mb-3 font-display text-xl font-extrabold text-edvanta-deep">{p.nombre}</h3>}
        <p className="text-base leading-7 text-edvanta-deep">{p.necesidad}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[[Users, 'Quién se beneficia', p.publico], [MonitorPlay, 'Modalidad', p.modalidad]].map(([I, k, v]) => (
            <div key={k} className="flex gap-3">
              <span className="ds-icon-tile ds-icon-tile--teal h-9 w-9 shrink-0 rounded-[10px]"><I className="h-4 w-4" aria-hidden="true" /></span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[.1em] text-edvanta-subtle">{k}</span>
                <span className="mt-0.5 block text-sm leading-6 text-edvanta-muted">{v}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-edvanta-muted"><span className="font-bold text-edvanta-deep">Alcance: </span>{p.alcance}</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.1em] text-edvanta-subtle">Qué recibe tu institución</p>
        <ul className="mt-2.5 space-y-2">
          {p.entregables.map((e) => (
            <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{e}
            </li>
          ))}
        </ul>
        {p.aclaracion && <p className="mt-5 border-l-2 border-edvanta-violet/60 pl-3 text-xs leading-5 text-edvanta-muted">{p.aclaracion}</p>}
        <div className="mt-auto pt-6">
          <button type="button" onClick={() => onSolicitar(p.slug)} className="ed-btn ed-btn--primary ed-btn--block">
            <Users aria-hidden="true" />
            Solicitar propuesta
          </button>
        </div>
      </div>
    </article>
  );
}
