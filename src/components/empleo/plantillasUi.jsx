/**
 * ============================================================
 *  plantillasUi.jsx — Ver y elegir el diseño de la hoja de vida
 *
 *  · VistaPreviaCv  — la hoja de vida dibujada tal como sale en PDF
 *  · GaleriaPlantillas — los diseños con una miniatura de TU hoja
 *  · MuestraPlantillas — miniaturas de ejemplo para la landing
 *
 *  Todo se genera en el navegador con el mismo código que produce
 *  el archivo descargable: lo que se ve es lo que se descarga.
 * ============================================================
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Image as ImageIcon, Loader2, User } from 'lucide-react';
import { PLANTILLAS } from '../../lib/cv/plantillas';
import { dibujarCv, huellaCv, miniaturaCv } from '../../lib/cv/vistaPrevia';
import { ejemploCv } from '../../lib/cv/ejemplo';

/** Catálogo completo: el diseño oficial, las plantillas y el formato plano. */
export const DISENOS = [
  {
    id: 'edvanta',
    nombre: 'Edvanta oficial',
    desc: 'Limpia y moderna, con la identidad Edvanta. La más segura con los filtros automáticos.',
    foto: false,
    etiqueta: 'Recomendada',
  },
  ...PLANTILLAS,
  {
    id: 'ats',
    nombre: 'ATS simple',
    desc: 'Blanco y negro, sin adornos. Para portales con filtros muy estrictos.',
    foto: false,
    etiqueta: 'Sin diseño',
  },
];

export const disenoPorId = (id) => DISENOS.find((d) => d.id === id) || DISENOS[0];

/* ── Miniaturas ───────────────────────────────────────────── */

const cacheMiniaturas = new Map();

function useMiniaturas({ cv, cargoLabel, foto, activo, disenos = DISENOS, ancho = 240 }) {
  const [imagenes, setImagenes] = useState({});
  const [cargando, setCargando] = useState(false);
  const huella = useMemo(() => huellaCv(cv, cargoLabel, foto), [cv, cargoLabel, foto]);

  useEffect(() => {
    if (!activo) return undefined;
    let vivo = true;
    setCargando(true);
    const temporizador = setTimeout(async () => {
      for (const d of disenos) {
        if (!vivo) return;
        const clave = `${d.id}|${ancho}|${huella}`;
        if (cacheMiniaturas.has(clave)) {
          setImagenes((prev) => ({ ...prev, [d.id]: cacheMiniaturas.get(clave) }));
          continue;
        }
        try {
          const url = await miniaturaCv({ cv, cargoLabel, estilo: d.id, foto, ancho });
          if (cacheMiniaturas.size > 80) cacheMiniaturas.clear();
          cacheMiniaturas.set(clave, url);
          if (!vivo) return;
          setImagenes((prev) => ({ ...prev, [d.id]: url }));
        } catch { /* si un diseño falla, se sigue con los demás */ }
      }
      if (vivo) setCargando(false);
    }, 350);
    return () => { vivo = false; clearTimeout(temporizador); setCargando(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huella, activo, ancho, disenos]);

  return { imagenes, cargando };
}

/* ── Vista previa grande ──────────────────────────────────── */

/**
 * Dibuja la hoja de vida con la plantilla elegida. Espera a que la
 * persona deje de escribir para no regenerar el PDF en cada tecla.
 */
export function VistaPreviaCv({
  cv, cargoLabel = '', estilo = 'edvanta', foto = null, ancho = 520, className = '', etiqueta = true,
}) {
  const canvasRef = useRef(null);
  const [estado, setEstado] = useState('cargando');
  const [paginas, setPaginas] = useState(1);
  const huella = useMemo(() => huellaCv(cv, cargoLabel, foto), [cv, cargoLabel, foto]);
  const diseno = disenoPorId(estilo);

  useEffect(() => {
    let vivo = true;
    setEstado((previo) => (previo === 'listo' ? 'actualizando' : 'cargando'));
    const temporizador = setTimeout(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const { paginas: n } = await dibujarCv(canvas, { cv, cargoLabel, estilo, foto, ancho });
        if (!vivo) return;
        setPaginas(n);
        setEstado('listo');
      } catch {
        if (vivo) setEstado('error');
      }
    }, 550);
    return () => { vivo = false; clearTimeout(temporizador); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huella, estilo, ancho]);

  return (
    <div className={className}>
      {etiqueta && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-edvanta-muted">
            Así se descarga · {diseno.nombre}
          </p>
          <span className="text-[11px] font-semibold text-edvanta-subtle">
            {estado === 'listo' || estado === 'actualizando' ? `${paginas} ${paginas === 1 ? 'página' : 'páginas'}` : ''}
          </span>
        </div>
      )}
      <div className="relative overflow-hidden rounded-xl bg-white shadow-[0_12px_36px_rgba(23,34,59,.14)] ring-1 ring-black/5">
        <canvas ref={canvasRef} className="block w-full" aria-label={`Vista previa de la hoja de vida con el diseño ${diseno.nombre}`} />
        {(estado === 'cargando' || estado === 'actualizando') && (
          <div className={`absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-edvanta-blue ${estado === 'cargando' ? 'bg-white' : 'bg-white/60'}`}>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {estado === 'cargando' ? 'Preparando la vista previa…' : 'Actualizando…'}
          </div>
        )}
        {estado === 'error' && (
          <div className="flex min-h-64 items-center justify-center p-6 text-center text-sm text-edvanta-muted">
            No pudimos dibujar la vista previa en este navegador. La descarga del PDF sí funciona.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Galería de diseños ───────────────────────────────────── */

function TarjetaDiseno({ diseno, imagen, seleccionado, onElegir, conFoto }) {
  return (
    <button
      type="button"
      onClick={() => onElegir(diseno.id)}
      aria-pressed={seleccionado}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition ${seleccionado ? 'border-edvanta-blue shadow-[0_12px_28px_rgba(8,46,134,.18)]' : 'border-edvanta-border hover:-translate-y-0.5 hover:border-edvanta-blue/40 hover:shadow-[0_10px_24px_rgba(23,34,59,.10)]'}`}
    >
      <span className="relative block aspect-[210/297] w-full overflow-hidden bg-edvanta-bg">
        {imagen ? (
          <img src={imagen} alt={`Diseño ${diseno.nombre}`} className="h-full w-full object-cover object-top" loading="lazy" />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-edvanta-subtle" aria-hidden="true" />
          </span>
        )}
        {seleccionado && (
          <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-edvanta-blue text-white shadow">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        {diseno.etiqueta && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-edvanta-blue shadow-sm">
            {diseno.etiqueta}
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-1 p-3">
        <span className="flex items-center gap-1.5 text-sm font-bold text-edvanta-deep">
          {diseno.nombre}
          {diseno.foto && (
            <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[10px] font-bold ${conFoto ? 'bg-edvanta-mint text-edvanta-tealdark' : 'bg-amber-50 text-amber-700'}`}>
              <User className="h-2.5 w-2.5" aria-hidden="true" />
              {conFoto ? 'Con tu foto' : 'Lleva foto'}
            </span>
          )}
        </span>
        <span className="text-[11.5px] leading-4 text-edvanta-muted">{diseno.desc}</span>
      </span>
    </button>
  );
}

/**
 * Cuadrícula de diseños con una miniatura de la hoja de vida real.
 * `activo` evita generar los PDF cuando la galería no está a la vista.
 */
export function GaleriaPlantillas({
  cv, cargoLabel = '', foto = null, valor = 'edvanta', onElegir, activo = true, className = '',
}) {
  const { imagenes, cargando } = useMiniaturas({ cv, cargoLabel, foto, activo });
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {DISENOS.map((d) => (
          <TarjetaDiseno
            key={d.id}
            diseno={d}
            imagen={imagenes[d.id]}
            seleccionado={valor === d.id}
            onElegir={onElegir}
            conFoto={Boolean(foto)}
          />
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-edvanta-muted" role="status">
        {cargando
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Dibujando tu hoja de vida en cada diseño…</>
          : <><ImageIcon className="h-3.5 w-3.5" aria-hidden="true" /> Cada miniatura es tu hoja de vida real: elige la que más te guste y descárgala.</>}
      </p>
    </div>
  );
}

/* ── Muestra para la landing ──────────────────────────────── */

/** Miniaturas con datos de ejemplo, para mostrar los diseños sin editar nada. */
export function MuestraPlantillas({ ids = ['edvanta', 'ejecutiva', 'azul', 'moderna-turquesa'], ancho = 260, className = '', onElegir }) {
  const cv = useMemo(() => ejemploCv(), []);
  const disenos = useMemo(() => ids.map((id) => disenoPorId(id)), [ids]);
  const { imagenes } = useMiniaturas({ cv, cargoLabel: '', foto: null, activo: true, disenos, ancho });
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className}`}>
      {disenos.map((d, i) => {
        const contenido = (
          <>
            <span className="block aspect-[210/297] w-full overflow-hidden rounded-xl bg-white shadow-[0_12px_28px_rgba(23,34,59,.16)] ring-1 ring-black/5">
              {imagenes[d.id]
                ? <img src={imagenes[d.id]} alt={`Plantilla ${d.nombre}`} className="h-full w-full object-cover object-top" loading="lazy" />
                : <span className="flex h-full w-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-edvanta-subtle" aria-hidden="true" /></span>}
            </span>
            <span className="mt-2 block text-center text-sm font-bold text-edvanta-deep">{d.nombre}</span>
          </>
        );
        const clase = `block transition ${i % 2 ? 'sm:mt-6' : ''} ${onElegir ? 'hover:-translate-y-1' : ''}`;
        return onElegir
          ? <button key={d.id} type="button" onClick={() => onElegir(d.id)} className={`${clase} text-left`}>{contenido}</button>
          : <div key={d.id} className={clase}>{contenido}</div>;
      })}
    </div>
  );
}
