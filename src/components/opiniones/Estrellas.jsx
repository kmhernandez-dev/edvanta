/**
 * ============================================================
 *  Estrellas.jsx — Mostrar y elegir una calificación
 *
 *  Dos piezas que parecen la misma y no lo son:
 *
 *  <Estrellas valor={4} /> es un DIBUJO. No se pulsa, no recibe foco, y
 *  va acompañado de su valor en texto para quien no ve el dibujo.
 *
 *  <ElegirEstrellas> es un CONTROL. Son botones de radio de verdad, con
 *  nombre, valor anunciado y manejo de teclado: se llega con el tabulador
 *  y se mueve con las flechas, como cualquier otro grupo de opciones.
 *  Un montón de estrellitas con onClick no es un control: quien navega
 *  con teclado o con lector de pantalla no puede calificar.
 * ============================================================
 */

import { useId } from 'react';
import { Star } from 'lucide-react';

const TAMANOS = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };

/** Calificación ya dada. Decorativa: el texto de al lado es lo que se lee. */
export function Estrellas({ valor, tamano = 'md', className = '' }) {
  const n = Math.round(Number(valor) || 0);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${TAMANOS[tamano]} ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-edvanta-subtle'}`}
        />
      ))}
    </span>
  );
}

/** Calificación con su número al lado, para leerla sin ver las estrellas. */
export function EstrellasConTexto({ valor, total, tamano = 'md' }) {
  if (!valor) {
    return <span className="text-sm text-edvanta-muted">Sin valoraciones</span>;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <Estrellas valor={valor} tamano={tamano} />
      <span className="text-sm font-semibold text-edvanta-deep">
        {valor} de 5
        {typeof total === 'number' && (
          <span className="font-normal text-edvanta-muted">
            {' '}· {total} {total === 1 ? 'valoración' : 'valoraciones'}
          </span>
        )}
      </span>
    </span>
  );
}

const ETIQUETAS = {
  1: '1 estrella: muy flojo',
  2: '2 estrellas: flojo',
  3: '3 estrellas: correcto',
  4: '4 estrellas: bueno',
  5: '5 estrellas: muy bueno',
};

/**
 * Elegir una calificación. Grupo de radios: uno solo en el orden de
 * tabulación, flechas para moverse, y cada opción anuncia qué significa.
 */
export function ElegirEstrellas({ valor, onChange, nombre, etiqueta = 'Tu calificación', disabled = false, tamano = 'lg' }) {
  const id = useId();
  const grupo = nombre || `estrellas-${id}`;
  return (
    <fieldset disabled={disabled} className="border-0 p-0">
      <legend className="text-sm font-bold text-edvanta-deep">{etiqueta}</legend>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const elegida = valor === n;
          return (
            <label
              key={n}
              className={`cursor-pointer rounded-lg p-1 transition focus-within:ring-2 focus-within:ring-edvanta-blue focus-within:ring-offset-1 ${
                disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-edvanta-light/60'
              }`}
            >
              <input
                type="radio"
                name={grupo}
                value={n}
                checked={elegida}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              <Star
                className={`${TAMANOS[tamano]} transition ${
                  valor && n <= valor ? 'fill-amber-400 text-amber-400' : 'text-edvanta-subtle'
                }`}
                aria-hidden="true"
              />
              <span className="sr-only">{ETIQUETAS[n]}</span>
            </label>
          );
        })}
        {valor ? (
          <span className="ml-2 text-sm font-semibold text-edvanta-deep">{valor} de 5</span>
        ) : (
          <span className="ml-2 text-sm text-edvanta-muted">Elige de 1 a 5</span>
        )}
      </div>
    </fieldset>
  );
}

/** La barra de «cuántos pusieron cada nota». */
export function Distribucion({ distribucion, total, onFiltrar, filtro }) {
  if (!total) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map((n) => {
        const cuantas = distribucion?.[n] || 0;
        const pct = total ? Math.round((cuantas / total) * 100) : 0;
        const activo = filtro === n;
        return (
          <li key={n}>
            <button
              type="button"
              onClick={() => onFiltrar(activo ? null : n)}
              aria-pressed={activo}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 text-left transition hover:bg-edvanta-light/60 ${
                activo ? 'bg-edvanta-light' : ''
              }`}
            >
              <span className="w-16 shrink-0 text-xs font-semibold text-edvanta-deep">
                {n} {n === 1 ? 'estrella' : 'estrellas'}
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-edvanta-border">
                <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
              </span>
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-edvanta-muted">{cuantas}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
