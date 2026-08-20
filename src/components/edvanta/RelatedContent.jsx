import { useMemo } from 'react';
import { getRelated, getNextSteps, getRelatedByMeta } from '../../lib/edvanta/related';
import ContentNodeCard from './ContentNodeCard';

/**
 * Bloque de contenido relacionado / siguiente paso, alimentado por metadata.
 *
 * Uso A (por nodo del grafo):   <RelatedContent nodeId="course:edutin-power-bi" />
 * Uso B (por metadata suelta):  <RelatedContent meta={{ areaIds:['validations'], skills:[...], tags:[...] }} />
 *
 * mode: 'related' (por defecto) | 'next' (prioriza rutas/herramientas/áreas)
 */
export default function RelatedContent({
  nodeId = null,
  node = null,
  meta = null,
  mode = 'related',
  limit = 6,
  title,
  eyebrow,
  variant = 'card',
  className = '',
}) {
  const items = useMemo(() => {
    const base = node || nodeId;
    if (base) return mode === 'next' ? getNextSteps(base, { limit }) : getRelated(base, { limit });
    if (meta) return getRelatedByMeta({ ...meta, limit });
    return [];
  }, [node, nodeId, meta, mode, limit]);

  if (!items.length) return null;

  const heading = title || (mode === 'next' ? 'Tu siguiente paso' : 'También te puede interesar');
  const eyebrowText = eyebrow || (mode === 'next' ? 'Sigue avanzando' : 'Ecosistema Edvanta');

  return (
    <section className={`edvanta ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow-edvanta mb-1.5">{eyebrowText}</p>
        <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">{heading}</h2>

        {variant === 'row' ? (
          <div className="mt-6 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <ContentNodeCard key={n.id} node={n} variant="row" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <ContentNodeCard key={n.id} node={n} variant="card" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
