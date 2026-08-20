import { Link } from 'react-router-dom';
import { Compass, GraduationCap, Route as RouteIcon, Wrench, FileText, ArrowRight, ArrowUpRight } from 'lucide-react';

const TYPE_META = {
  careerArea: { Icon: Compass, tint: 'text-edvanta-blue', chip: 'bg-edvanta-light text-edvanta-blue' },
  course: { Icon: GraduationCap, tint: 'text-teal-600', chip: 'bg-teal-50 text-teal-700' },
  learningRoute: { Icon: RouteIcon, tint: 'text-indigo-500', chip: 'bg-indigo-50 text-indigo-600' },
  tool: { Icon: Wrench, tint: 'text-amber-600', chip: 'bg-amber-50 text-amber-700' },
  article: { Icon: FileText, tint: 'text-slate-500', chip: 'bg-slate-100 text-slate-600' },
};

/**
 * Card unificada para cualquier nodo del content graph.
 * - Cursos → enlace externo (preserva la URL de afiliado), abre en pestaña nueva.
 * - Resto → enlace interno a su ruta real.
 * variant: 'card' (por defecto) | 'row' (compacto, para paneles/listas).
 */
export default function ContentNodeCard({ node, variant = 'card', onNavigate }) {
  if (!node) return null;
  const meta = TYPE_META[node.type] || TYPE_META.article;
  const { Icon } = meta;
  // Los cursos preservan su URL de afiliado: si hay externalUrl, ese es el destino.
  const isExternal = Boolean(node.externalUrl);
  const href = isExternal ? node.externalUrl : node.route;

  const Wrapper = ({ children, className }) =>
    isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer sponsored" className={className} onClick={onNavigate}>
        {children}
      </a>
    ) : (
      <Link to={href || '/'} className={className} onClick={onNavigate}>
        {children}
      </Link>
    );

  if (variant === 'row') {
    return (
      <Wrapper className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-edvanta-light/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-edvanta-blue">
        <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 ${meta.tint}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold text-edvanta-deep group-hover:text-edvanta-blue">{node.title}</span>
            {isExternal && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />}
          </span>
          {node.description && <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500">{node.description}</span>}
        </span>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="card-edvanta group flex h-full flex-col overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-edvanta-blue">
      {node.image ? (
        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={node.image}
            alt={node.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className={`flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-slate-50 to-edvanta-light ${meta.tint}`}>
          <Icon className="h-10 w-10 opacity-70" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.chip}`}>
            <Icon className="h-3 w-3" aria-hidden="true" />
            {node.typeLabel}
          </span>
          {node.areaLabels?.[0] && (
            <span className="truncate text-[11px] font-semibold text-slate-400">{node.areaLabels[0]}</span>
          )}
        </div>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">
          {node.title}
        </h3>
        {node.description && <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-6 text-slate-500">{node.description}</p>}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-edvanta-blue">
          {isExternal ? 'Abrir recurso' : 'Ver más'}
          {isExternal ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      </div>
    </Wrapper>
  );
}
