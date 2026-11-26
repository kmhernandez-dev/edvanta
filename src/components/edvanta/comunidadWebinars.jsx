/**
 * Piezas compartidas de /comunidad y /webinars.
 * El color y el icono salen del clúster para que la gente reconozca
 * la misma familia de contenido en el hub, el índice y el detalle.
 */
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Building2, CalendarClock, Check, Clock, Compass, FileCheck2,
  HeartPulse, Megaphone, MessageCircle, MonitorPlay, ShieldCheck, Stethoscope, Users, Video,
} from 'lucide-react';
import { PUBLICOS, rutaCluster, rutaTema, rutaWebinar } from '../../data/edvanta/comunidadWebinars';

const ICONOS = { Stethoscope, ShieldCheck, FileCheck2, Compass, Users, Megaphone, Building2, MessageCircle, MonitorPlay, HeartPulse };
const TONOS = [
  { tile: 'bg-edvanta-soft text-edvanta-blue', chip: 'bg-edvanta-soft text-edvanta-blue' },
  { tile: 'bg-edvanta-mint text-edvanta-tealdark', chip: 'bg-edvanta-mint text-edvanta-tealdark' },
  { tile: 'bg-[#F2EFFF] text-[#5E51A8]', chip: 'bg-[#F2EFFF] text-[#5E51A8]' },
];

export const iconoDeCluster = (cluster) => ICONOS[cluster?.icono] || Users;
export const tonoDeCluster = (cluster) => TONOS[Math.max(0, cluster?.slug?.length || 0) % TONOS.length];

export function EtiquetaPublico({ publico, className = '' }) {
  const p = PUBLICOS[publico] || PUBLICOS.profesional;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-edvanta-border bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-[.08em] text-edvanta-muted ${className}`}>
      {p.corto}
    </span>
  );
}

export function ClusterCard({ cluster }) {
  const Icono = iconoDeCluster(cluster);
  const tono = tonoDeCluster(cluster);
  return (
    <Link
      to={rutaCluster(cluster)}
      className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_14px_40px_rgba(23,34,59,.10)]"
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tono.tile}`}>
        <Icono className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{cluster.nombre}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{cluster.promesa}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
        Ver los temas
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function TemaCard({ tema, mostrarCluster = false }) {
  return (
    <Link
      to={rutaTema(tema)}
      className="group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_14px_40px_rgba(23,34,59,.10)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <EtiquetaPublico publico={tema.publico} />
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-edvanta-subtle">
          <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
          {tema.nivel}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-edvanta-subtle">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {tema.minutos} min
        </span>
      </div>
      <h3 className="mt-3 font-display text-[1.05rem] font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{tema.titulo}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{tema.descripcion}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
        Leer la guía
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function WebinarCard({ webinar }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_14px_40px_rgba(23,34,59,.10)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-edvanta-soft px-2.5 py-1 text-xs font-bold uppercase tracking-[.08em] text-edvanta-blue">
          <Video className="h-3.5 w-3.5" aria-hidden="true" />
          Webinar
        </span>
        <EtiquetaPublico publico={webinar.publico} />
      </div>
      <h3 className="mt-3 font-display text-[1.05rem] font-bold leading-snug text-edvanta-deep">
        <Link to={rutaWebinar(webinar)} className="hover:text-edvanta-blue">{webinar.titulo}</Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{webinar.descripcion}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-edvanta-muted">
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-edvanta-teal" aria-hidden="true" />{webinar.duracion}</div>
        <div className="flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5 text-edvanta-teal" aria-hidden="true" />{webinar.nivel}</div>
        <div className="col-span-2 flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-edvanta-teal" aria-hidden="true" />Fecha por confirmar</div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={rutaWebinar(webinar)} className="ed-btn ed-btn--secondary ed-btn--sm">
          Ver la sesión <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link to="/unete/profesionales?area=webinars" className="ed-btn ed-btn--ghost ed-btn--sm">Avísame</Link>
      </div>
    </article>
  );
}

export function CierreDePublico({ publico = 'profesional', origen = 'comunidad' }) {
  const contenido = publico === 'institucion'
    ? {
      eyebrow: 'Para instituciones',
      titulo: 'Lleva estos temas a tu equipo',
      texto: 'Diseñamos una sesión cerrada o un plan de formación según las brechas de tu servicio. Sin fechas ni precios inventados: primero conversamos.',
      principal: { to: '/unete/instituciones', label: 'Solicitar una propuesta' },
      secundario: { to: '/instituciones', label: 'Ver soluciones' },
    }
    : publico === 'paciente'
      ? {
        eyebrow: 'Edvanta Contigo',
        titulo: 'Aprende a cuidarte con información clara',
        texto: 'Guías, comunidad y recursos para pacientes y cuidadores. Educación que no reemplaza a tu equipo de salud.',
        principal: { to: '/contigo', label: 'Entrar a Edvanta Contigo' },
        secundario: { to: '/comunidades', label: 'Ver comunidades de apoyo' },
      }
      : {
        eyebrow: 'Tu siguiente paso',
        titulo: 'Convierte el tema en práctica',
        texto: 'La comunidad resuelve dudas; un curso con método y casos te ayuda a sostener el cambio. Empieza por la primera unidad abierta.',
        principal: { to: '/cursos', label: 'Ver los cursos' },
        secundario: { to: '/comunidad', label: 'Unirme a la comunidad' },
      };

  return (
    <section className="ds-surface-navy relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-mint">{contenido.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">{contenido.titulo}</h2>
          <p className="mt-4 text-base leading-7 text-white/80">{contenido.texto}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to={contenido.principal.to} className="ed-btn ed-btn--white ed-btn--lg" data-origen={origen}>
              {contenido.principal.label} <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
            </Link>
            <Link to={contenido.secundario.to} className="ed-btn ed-btn--outline-white ed-btn--lg">
              {contenido.secundario.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ListaDeAprendizajes({ items, titulo = 'Lo que vas a aprender' }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-edvanta-deep">{titulo}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-edvanta-muted">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edvanta-mint text-edvanta-tealdark">
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
