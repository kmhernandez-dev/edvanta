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
  ArrowRight, CalendarClock, FileCheck2, GraduationCap, HeartPulse, Megaphone, ShieldCheck, Users,
} from 'lucide-react';
import { apiUrl } from '../../config/api';
import { ESTADOS, ORIGENES } from '../../data/edvanta/estados';
import { formatoPrecio } from '../../data/edvanta/productos';

export const ICONOS_ESCUELA = { HeartPulse, ShieldCheck, FileCheck2, Megaphone };

const TONOS = {
  teal: 'bg-edvanta-mint text-edvanta-tealdark',
  blue: 'bg-edvanta-light text-edvanta-blue',
  violet: 'bg-edvanta-lilac text-[#5E51A8]',
  amber: 'bg-amber-50 text-amber-800',
};

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
  return (
    <Link
      to={`/escuelas/${escuela.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]"
    >
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${TONOS[escuela.tono] || TONOS.blue}`}>
        <Icono className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-lg font-extrabold leading-snug text-edvanta-deep">{escuela.nombre}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{escuela.resumen}</p>
      <p className="mt-4 text-[13px] font-semibold text-edvanta-deep">
        {typeof cursos === 'number' && cursos > 0
          ? `${cursos} ${cursos === 1 ? 'curso virtual disponible' : 'cursos virtuales disponibles'}`
          : listas > 0
            ? `${listas} de ${areas.length} áreas con contenido disponible`
            : 'Escuela en desarrollo'}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
        Conocer la escuela
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

/** Lista de áreas de una escuela, cada una con su estado real. */
export function ListaDeAreas({ areas }) {
  return (
    <ul className="divide-y divide-edvanta-border overflow-hidden rounded-2xl border border-edvanta-border bg-white">
      {areas.map((a) => {
        const destino = a.producto ? `/cursos/en-vivo/${a.producto}` : a.to;
        const cuerpo = (
          <>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-edvanta-deep">{a.nombre}</span>
              {a.nota && <span className="mt-0.5 block text-sm leading-6 text-edvanta-muted">{a.nota}</span>}
            </span>
            <EstadoBadge estado={a.estado} />
            {destino && <ArrowRight className="h-4 w-4 shrink-0 text-edvanta-blue" aria-hidden="true" />}
          </>
        );
        return (
          <li key={a.nombre}>
            {destino ? (
              <Link to={destino} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-edvanta-bg">{cuerpo}</Link>
            ) : (
              <div className="flex items-center gap-3 px-5 py-4">{cuerpo}</div>
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
  const clsBoton = 'mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark';

  return (
    <article className="flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)]">
      <div className="flex flex-wrap items-center gap-2">
        <EstadoBadge estado={p.estado} />
        <PublicoBadge publico={p.publico} />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">{p.tipoTexto}</p>
      <h3 className="mt-1.5 font-display text-lg font-extrabold leading-snug text-edvanta-deep">{p.nombre}</h3>
      {p.dirigidoA && <p className="mt-2 text-sm leading-6 text-edvanta-muted"><span className="font-semibold text-edvanta-deep">Para: </span>{p.dirigidoA}</p>}
      <dl className="mt-3 flex-1 space-y-1 text-sm text-edvanta-muted">
        {p.modalidad && <div><dt className="inline font-semibold text-edvanta-deep">Modalidad: </dt><dd className="inline">{p.modalidad}</dd></div>}
        {p.tipo !== 'guia' || p.precio === 0 ? (
          <div><dt className="inline font-semibold text-edvanta-deep">Valor: </dt><dd className="inline">{formatoPrecio(p.precio)}</dd></div>
        ) : null}
        {p.tipo === 'curso_en_vivo' && (
          <div className="flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            <dt className="sr-only">Inicio</dt>
            <dd>{p.fechaInicio || 'Fecha de inicio por confirmar'}</dd>
          </div>
        )}
      </dl>
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
  const filas = [
    ['Necesidad que atiende', p.necesidad],
    ['Quién se beneficia', p.publico],
    ['Modalidad', p.modalidad],
    ['Alcance', p.alcance],
  ];
  return (
    <article id={p.slug} className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{p.lema}</p>
          <h3 className="mt-1 font-display text-xl font-extrabold text-edvanta-deep">{p.nombre}</h3>
        </div>
        <EstadoBadge estado={p.estado} />
      </div>
      <dl className="mt-4 space-y-3 text-sm leading-6">
        {filas.map(([k, v]) => (
          <div key={k}>
            <dt className="font-semibold text-edvanta-deep">{k}</dt>
            <dd className="text-edvanta-muted">{v}</dd>
          </div>
        ))}
        <div>
          <dt className="font-semibold text-edvanta-deep">Entregables</dt>
          <dd>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-edvanta-muted">
              {p.entregables.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </dd>
        </div>
      </dl>
      {p.aclaracion && <p className="mt-4 rounded-xl bg-edvanta-bg px-4 py-3 text-xs leading-5 text-edvanta-muted">{p.aclaracion}</p>}
      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => onSolicitar(p.slug)}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark"
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          Solicitar propuesta
        </button>
      </div>
    </article>
  );
}
