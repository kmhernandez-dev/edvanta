/**
 * La guía de Hotmart que lleva a la práctica lo que enseña el curso.
 *
 * Sale en la ficha del curso (debajo del certificado) y en el aula (al
 * terminar una clase y en «Tu certificado»). Un clic a la compra en
 * Hotmart, con `src` para saber qué página vendió, y otro a la página de
 * la guía para quien quiere ver qué incluye.
 *
 * Precio real (preciosGuias.js, verificado en Hotmart). Las guías de
 * Feliz Sin Tiroides no muestran precio: así lo pide su marca.
 */
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Btn } from '../edvanta/ui';
import { PortadaGenerada } from '../edvanta/catalogo';
import { MARCAS } from '../../data/guiasVenta';
import { guiasParaCurso } from '../../data/guiaParaCurso';
import { PRECIOS_GUIAS } from '../../data/preciosGuias';
import { PROMOCION, conCupon, promoActiva } from '../../data/promocion';
import { conOrigen } from '../../lib/hotmart';
import { trackEvent } from '../../utils/analytics';

const TONO = { edvanta: 0, atenfarma: 1, fst: 2 };
const pesos = (n) => `COP ${Number(n).toLocaleString('es-CO')}`;

/**
 * Con `curso`, la guía sale de las reglas por área (guiaParaCurso.js).
 * Un artículo del blog pasa la suya en `guia` (guiaParaArticulo.js).
 */
export default function GuiaRecomendada({ curso, guia: elegida = null, origen = 'ficha-curso', compacta = false, className = '', etiqueta = 'Llévalo a la práctica' }) {
  const guia = elegida ? { ...elegida, precio: PRECIOS_GUIAS[elegida.slug] || null } : guiasParaCurso(curso, 1)[0];
  if (!guia) return null;
  const marca = MARCAS[guia.marca];
  const conPrecio = guia.marca !== 'fst' && guia.precio?.valor > 0;
  const oferta = promoActiva();
  const comprar = conCupon(conOrigen(guia.pago || guia.venta, guia.slug, origen));
  const alComprar = () => trackEvent('guia_compra_click', {
    slug: guia.slug, marca: guia.marca, origen, curso: curso?.titulo || null, cupon: oferta ? PROMOCION.codigo : null,
  });

  return (
    <aside
      aria-label={elegida ? 'Guía recomendada para este tema' : 'Guía recomendada para este curso'}
      className={`ds-card overflow-hidden ${compacta ? 'p-4' : 'p-5 sm:p-6'} ${className}`}
    >
      <div className={`flex gap-4 ${compacta ? 'items-center' : 'flex-col sm:flex-row sm:items-center sm:gap-6'}`}>
        <div className={`${compacta ? 'w-20' : 'w-28 sm:w-32'} shrink-0 overflow-hidden rounded-xl shadow-[0_10px_24px_-14px_rgba(8,46,134,.45)]`}>
          {guia.portada ? (
            <img src={guia.portada} alt={`Portada de «${guia.titulo}»`} loading="lazy" decoding="async" width="300" height="300" className="block h-auto w-full" />
          ) : (
            <PortadaGenerada titulo={guia.titulo} sello={marca.sello} tono={TONO[guia.marca]} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-edvanta-tealdark">{etiqueta} · {guia.antetitulo}</p>
          <h3 className={`mt-1 font-display font-bold text-edvanta-deep ${compacta ? 'text-base' : 'text-lg sm:text-xl'}`}>{guia.titulo}</h3>
          {!compacta && <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{guia.bajada}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {conPrecio && (
              <p className="text-sm text-edvanta-deep">
                <span className="font-bold tabular-nums">{pesos(guia.precio.valor)}</span>
                <span className="text-edvanta-muted"> · {guia.formato}</span>
                {oferta && <span className="ml-1 font-semibold text-[var(--ds-promo)]"> · {PROMOCION.porcentaje} % OFF con {PROMOCION.codigo}</span>}
              </p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn href={comprar} external variant={oferta ? 'gradient' : 'primary'} size="sm" iconRight={ExternalLink} onClick={alComprar}>
              {oferta ? `Comprar con ${PROMOCION.porcentaje} % OFF` : 'Comprar la guía'}
            </Btn>
            <Btn to={`/guia/${guia.slug}`} variant="secondary" size="sm" iconRight={ArrowRight}
              onClick={() => trackEvent('guia_ver_click', { slug: guia.slug, origen })}>
              Ver qué incluye
            </Btn>
          </div>
        </div>
      </div>
    </aside>
  );
}
