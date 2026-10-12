/**
 * ============================================================
 *  Comentarios.jsx — Un hilo de preguntas, en la ficha o en la clase
 *
 *  La misma pieza sirve para los dos sitios porque lo que cambia es de
 *  dónde vienen los datos, no cómo se leen ni cómo se responden. Quien
 *  la usa le pasa las funciones de cargar, publicar, editar y borrar.
 *
 *  Lo que NO se hace aquí: decidir quién puede escribir. Eso lo dice el
 *  servidor en `puedo`, y si miente da igual, porque lo vuelve a
 *  comprobar al recibir. El formulario se oculta por cortesía, no por
 *  seguridad.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Flag, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { Btn } from '../edvanta/ui';
import { guardarBorrador, leerBorrador, olvidarBorrador } from '../../lib/opiniones';

const fecha = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

function Avatar({ iniciales }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-edvanta-light text-xs font-bold text-edvanta-blue"
    >
      {iniciales}
    </span>
  );
}

/** El cuadro de escribir. Guarda borrador por si el envío falla. */
function Escribir({ sitio, placeholder, onEnviar, onCancelar, autoFoco = false, etiqueta }) {
  const [texto, setTexto] = useState(() => leerBorrador(sitio));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const campo = useRef(null);

  useEffect(() => { if (autoFoco) campo.current?.focus(); }, [autoFoco]);

  const cambiar = (v) => {
    setTexto(v);
    guardarBorrador(sitio, v);
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    setError('');
    const r = await onEnviar(texto.trim());
    setEnviando(false);
    if (r?.ok) {
      // Solo se olvida el borrador cuando el servidor confirmó. Si se
      // limpiara al enviar, un fallo de red se llevaría el texto.
      olvidarBorrador(sitio);
      setTexto('');
      onCancelar?.();
      return;
    }
    setError(r?.error || 'No se pudo publicar. Tu texto sigue aquí.');
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-2">
      <label htmlFor={`escribir-${sitio}`} className="sr-only">{etiqueta}</label>
      <textarea
        id={`escribir-${sitio}`}
        ref={campo}
        value={texto}
        onChange={(e) => cambiar(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={4000}
        className="w-full resize-y rounded-xl border border-edvanta-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/20"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Btn type="submit" size="sm" disabled={!texto.trim() || enviando}>
          {enviando ? 'Publicando…' : 'Publicar'}
        </Btn>
        {onCancelar && (
          <Btn type="button" size="sm" variant="ghost" onClick={onCancelar}>Cancelar</Btn>
        )}
        {leerBorrador(sitio) && !texto && (
          <span className="text-xs text-edvanta-muted">Se guardó lo que escribiste.</span>
        )}
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p>
      )}
    </form>
  );
}

function Comentario({ c, donde, puedo, onResponder, onEditar, onBorrar, onReportar, anidado = false }) {
  const [editando, setEditando] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);

  if (c.retirado) {
    return (
      <li className={anidado ? 'ml-12' : ''}>
        <p className="rounded-xl bg-edvanta-bg px-4 py-3 text-sm italic text-edvanta-muted">
          Este comentario se retiró.
        </p>
      </li>
    );
  }

  return (
    <li className={anidado ? 'ml-12' : ''}>
      <article className="flex gap-3">
        <Avatar iniciales={c.autor.iniciales} />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-bold text-edvanta-deep">{c.autor.nombre}</span>
            <span className="text-edvanta-muted"> · {fecha(c.fecha)}</span>
            {c.editado && <span className="text-edvanta-subtle"> · editado</span>}
          </p>

          {editando ? (
            <div className="mt-2">
              <Escribir
                sitio={`editar-${donde}-${c.id}`}
                etiqueta="Editar tu comentario"
                placeholder="Corrige tu comentario…"
                autoFoco
                onEnviar={async (t) => {
                  const r = await onEditar(c.id, t);
                  if (r?.ok) setEditando(false);
                  return r;
                }}
                onCancelar={() => setEditando(false)}
              />
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-edvanta-deep">{c.cuerpo}</p>
          )}

          {!editando && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              {puedo.comentar && !anidado && (
                <button type="button" onClick={() => setRespondiendo((v) => !v)}
                  className="inline-flex items-center gap-1 font-semibold text-edvanta-blue hover:underline">
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />Responder
                </button>
              )}
              {c.mio && (
                <>
                  <button type="button" onClick={() => setEditando(true)}
                    className="inline-flex items-center gap-1 font-semibold text-edvanta-muted hover:text-edvanta-deep">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />Editar
                  </button>
                  <button type="button" onClick={() => onBorrar(c.id)}
                    className="inline-flex items-center gap-1 font-semibold text-edvanta-muted hover:text-red-700">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Borrar
                  </button>
                </>
              )}
              {!c.mio && puedo.comentar && (
                <button type="button" onClick={() => onReportar(c.id)}
                  className="inline-flex items-center gap-1 font-semibold text-edvanta-muted hover:text-edvanta-deep">
                  <Flag className="h-3.5 w-3.5" aria-hidden="true" />Reportar
                </button>
              )}
              {/* Quien modera retira lo ajeno; editarlo no, que sería
                  poner palabras en boca de otra persona. */}
              {puedo.moderar && !c.mio && (
                <button type="button" onClick={() => onBorrar(c.id)}
                  className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Retirar
                </button>
              )}
            </div>
          )}

          {respondiendo && (
            <div className="mt-3">
              <Escribir
                sitio={`responder-${donde}-${c.id}`}
                etiqueta="Tu respuesta"
                placeholder="Escribe tu respuesta…"
                autoFoco
                onEnviar={async (t) => {
                  const r = await onResponder(t, c.id);
                  if (r?.ok) setRespondiendo(false);
                  return r;
                }}
                onCancelar={() => setRespondiendo(false)}
              />
            </div>
          )}
        </div>
      </article>

      {c.respuestas?.length > 0 && (
        <ul className="mt-4 flex flex-col gap-4">
          {c.respuestas.map((r) => (
            <Comentario key={r.id} c={r} donde={donde} puedo={puedo} anidado
              onResponder={onResponder} onEditar={onEditar} onBorrar={onBorrar} onReportar={onReportar} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * El hilo completo.
 *
 * `cargar`, `publicar`, `editar`, `borrar` y `reportar` los pone quien
 * usa el componente: así la misma pieza sirve para la ficha y para una
 * clase sin saber nada de ninguna de las dos.
 */
export default function Comentarios({
  donde, titulo, descripcion, sitio, puedo, invitacion,
  cargar, publicar, editar, borrar, reportar,
}) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState('');
  const [pagina, setPagina] = useState(1);

  const traer = useCallback(async (p = 1) => {
    setCargando(true);
    const r = await cargar(p);
    setCargando(false);
    if (!r.ok) { setFallo(r.error); return; }
    setFallo('');
    setDatos(r.datos);
  }, [cargar]);

  useEffect(() => { traer(pagina); }, [traer, pagina]);

  const tras = async (accion) => {
    const r = await accion();
    if (r?.ok) await traer(pagina);
    return r;
  };

  return (
    <div>
      <h3 className="font-display text-xl font-extrabold text-edvanta-deep">{titulo}</h3>
      {descripcion && <p className="mt-1 text-sm leading-6 text-edvanta-muted">{descripcion}</p>}

      {puedo.comentar ? (
        <div className="mt-5">
          <Escribir
            sitio={sitio}
            etiqueta={titulo}
            placeholder="Escribe tu pregunta o comentario…"
            onEnviar={(t) => tras(() => publicar(t, null))}
          />
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-edvanta-bg px-4 py-3 text-sm text-edvanta-muted">{invitacion}</p>
      )}

      {cargando && !datos && (
        <p className="mt-6 text-sm text-edvanta-muted">Cargando comentarios…</p>
      )}
      {fallo && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {fallo}{' '}
          <button type="button" onClick={() => traer(pagina)} className="underline">Reintentar</button>
        </p>
      )}

      {datos && !datos.comentarios.length && !fallo && (
        <p className="mt-6 text-sm text-edvanta-muted">
          Todavía no hay preguntas. Si algo no te queda claro, pregúntalo: a quien venga detrás
          probablemente le sirva la respuesta.
        </p>
      )}

      {datos?.comentarios.length > 0 && (
        <>
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-edvanta-muted">
            {datos.total} {datos.total === 1 ? 'comentario' : 'comentarios'}
          </p>
          <ul className="mt-4 flex flex-col gap-6">
            {datos.comentarios.map((c) => (
              <Comentario
                key={c.id} c={c} donde={donde} puedo={puedo}
                onResponder={(t, padreId) => tras(() => publicar(t, padreId))}
                onEditar={(id, t) => tras(() => editar(id, t))}
                onBorrar={(id) => tras(() => borrar(id))}
                onReportar={(id) => tras(() => reportar(id))}
              />
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3">
            {pagina > 1 && (
              <Btn size="sm" variant="secondary" onClick={() => setPagina((p) => p - 1)}>Anteriores</Btn>
            )}
            {datos.hayMas && (
              <Btn size="sm" variant="secondary" onClick={() => setPagina((p) => p + 1)}>Ver más comentarios</Btn>
            )}
          </div>
        </>
      )}
    </div>
  );
}
