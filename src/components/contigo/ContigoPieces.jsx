/**
 * Piezas de Edvanta Contigo.
 *
 * Las vistas de "Mi cuidado" son ilustrativas y llevan su rótulo.
 * Los estados vienen de la fuente de datos: una ruta que no está
 * disponible no muestra compra ni acceso a herramientas.
 */

import { Link } from 'react-router-dom';
import {
  ArrowRight, CalendarDays, Check, ClipboardList, Compass, FileText, HeartPulse,
  Pill, ShieldCheck, Stethoscope, Users,
} from 'lucide-react';

const ICONOS = {
  Compass, HeartPulse, Stethoscope, Pill, FileText, CalendarDays, Users, ClipboardList, ShieldCheck,
};

export function IconoContigo({ name, className = 'h-5 w-5' }) {
  const Icono = ICONOS[name] || HeartPulse;
  return <Icono className={className} strokeWidth={1.8} aria-hidden="true" />;
}

export function ContigoSection({ id, tone = 'white', children, className = '' }) {
  const tonos = {
    white: 'bg-white',
    sage: 'contigo-bg-sage',
    lavender: 'contigo-bg-lavender',
    mint: 'contigo-bg-mint',
  };
  return (
    <section id={id} className={`${tonos[tone] || tonos.white} ${id ? 'scroll-mt-28' : ''} ${className}`.trim()}>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function ContigoEyebrow({ children }) {
  return <p className="contigo-eyebrow">{children}</p>;
}

export function EstadoContigo({ estado = 'en_preparacion' }) {
  const map = {
    disponible: { label: 'Disponible', clase: 'contigo-chip--available' },
    en_desarrollo: { label: 'En preparación', clase: 'contigo-chip--soon' },
    en_preparacion: { label: 'En preparación', clase: 'contigo-chip--soon' },
    demo: { label: 'Precio de prueba', clase: 'contigo-chip--demo' },
  };
  const e = map[estado] || map.en_preparacion;
  return <span className={`contigo-chip ${e.clase}`}>{e.label}</span>;
}

export function ContigoHeroVisual() {
  return (
    <div
      className="contigo-hero-visual"
      role="img"
      aria-label="Vista ilustrativa de Mi cuidado con medicamentos, documentos y próxima consulta"
    >
      <span className="contigo-hero-visual__label">Vista ilustrativa de Mi cuidado</span>
      <div className="contigo-hero-visual__stack" aria-hidden="true">
        <div className="contigo-mini-card">
          <span className="contigo-mini-card__icon"><Pill className="h-4 w-4" /></span>
          <span>
            <span className="contigo-mini-card__title">Medicamentos</span>
            <span className="contigo-mini-card__text">Tu pauta registrada y confirmada.</span>
          </span>
        </div>
        <div className="contigo-mini-card">
          <span className="contigo-mini-card__icon"><FileText className="h-4 w-4" /></span>
          <span>
            <span className="contigo-mini-card__title">Documentos</span>
            <span className="contigo-mini-card__text">Laboratorios y archivos privados.</span>
          </span>
        </div>
        <div className="contigo-mini-card">
          <span className="contigo-mini-card__icon"><Stethoscope className="h-4 w-4" /></span>
          <span>
            <span className="contigo-mini-card__title">Próxima consulta</span>
            <span className="contigo-mini-card__text">Tus preguntas y objetivos a mano.</span>
          </span>
        </div>
      </div>
      <p className="contigo-hero-visual__note">
        Tu información, en un solo lugar. No mostramos datos clínicos de ejemplo.
      </p>
    </div>
  );
}

export function RutaContigoCard({ ruta }) {
  return (
    <article className="contigo-card contigo-card--interactive flex h-full flex-col overflow-hidden">
      <div className="contigo-route-media">
        {ruta.imagen && (
          <img src={ruta.imagen} alt="" width="1200" height="800" loading="lazy" decoding="async" />
        )}
        <span className="contigo-route-badge"><EstadoContigo estado={ruta.estado} /></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-extrabold leading-snug text-edvanta-deep">{ruta.nombre}</h3>
        <p className="mt-2 flex-1 text-base leading-7 text-[var(--contigo-muted)]">{ruta.texto}</p>
        {ruta.estado === 'disponible' ? (
          <Link to={ruta.to} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--contigo-primary)] hover:underline">
            Entrar a la ruta
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <Link to={ruta.to} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#5e51a8] hover:underline">
            Recibir novedades
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function NecesidadContigoCard({ necesidad }) {
  return (
    <Link
      to={necesidad.to}
      className="contigo-card contigo-card--interactive group flex h-full flex-col p-6"
    >
      <span className="contigo-icon"><IconoContigo name={necesidad.icono} /></span>
      <h3 className="mt-4 font-display text-xl font-extrabold leading-snug text-edvanta-deep">{necesidad.titulo}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--contigo-muted)]">{necesidad.texto}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--contigo-primary)]">
        {necesidad.cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function HerramientaContigoCard({ herramienta }) {
  const disponible = herramienta.estado === 'disponible' && herramienta.to;
  const contenido = (
    <>
      <span className="contigo-icon"><IconoContigo name={herramienta.icono} /></span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3>{herramienta.titulo}</h3>
          {!disponible && <EstadoContigo estado="en_preparacion" />}
        </div>
        <p>{herramienta.texto}</p>
        {disponible && (
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[var(--contigo-primary)]">
            Abrir en Feliz Sin Tiroides <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  );
  if (disponible) {
    return (
      <Link to={herramienta.to} className="contigo-tool contigo-card--interactive group">
        {contenido}
      </Link>
    );
  }
  return <div className="contigo-tool contigo-tool--disabled">{contenido}</div>;
}

export function PlanContigoCard({ plan, destacado = false }) {
  return (
    <article className={`contigo-plan ${destacado ? 'contigo-plan--featured' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <EstadoContigo estado={plan.estado} />
        {plan.id === 'plus' && <span className="contigo-chip contigo-chip--demo">Hipótesis de piloto</span>}
      </div>
      <h3 className="mt-3 font-display text-xl font-extrabold text-edvanta-deep">{plan.nombre}</h3>
      <p className="mt-1 text-base leading-7 text-[var(--contigo-muted)]">{plan.lema}</p>
      <p className="contigo-plan__price">{plan.precio}</p>
      <p className="contigo-plan__note">{plan.nota}</p>
      <ul className="contigo-plan__list flex-1">
        {plan.incluye.map((x) => (
          <li key={x}><Check className="h-3.5 w-3.5" aria-hidden="true" />{x}</li>
        ))}
      </ul>
      <Link to={plan.cta.to} className="ed-btn ed-btn--secondary mt-5 w-full">
        {plan.cta.label}
      </Link>
    </article>
  );
}
