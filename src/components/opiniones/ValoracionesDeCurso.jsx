/**
 * ============================================================
 *  ValoracionesDeCurso.jsx — Las opiniones de un curso
 *
 *  Promedio, distribución, listado con filtros, y el formulario para
 *  dejar la tuya. Una por persona: si ya calificaste, esto edita la que
 *  tenías, no añade otra.
 *
 *  Dos cosas que se dicen tal cual y no se maquillan:
 *   · Quien no está matriculado en un curso propio no puede calificar,
 *     y se le explica por qué en vez de esconderle el formulario sin
 *     más.
 *   · En un curso externo la persona DECLARA haberlo hecho. Eso se
 *     marca como declarado, nunca como verificado: salir hacia el
 *     proveedor no demuestra que alguien terminara nada.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Btn, Eyebrow } from '../edvanta/ui';
import { Distribucion, ElegirEstrellas, Estrellas } from './Estrellas';
import {
  borrarMiOpinion, guardarMiOpinion, listaDeOpiniones,
} from '../../lib/opiniones';

const fecha = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
};

function Opinion({ o }) {
  return (
    <li className="border-t border-edvanta-border pt-5 first:border-0 first:pt-0">
      <div className="flex gap-3">
        <span aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-edvanta-light text-xs font-bold text-edvanta-blue">
          {o.autor.iniciales}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-bold text-edvanta-deep">{o.autor.nombre}</span>
            <span className="text-edvanta-muted"> · {fecha(o.fecha)}</span>
            {o.editada && <span className="text-edvanta-subtle"> · editada</span>}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Estrellas valor={o.puntuacion} tamano="sm" />
            <span className="sr-only">{o.puntuacion} de 5</span>
            {/* «Declarada» es exactamente eso: lo dice quien opina, nadie
                lo comprobó. Llamarlo verificado sería mentir. */}
            <span className="text-xs text-edvanta-muted">
              {o.vinculo === 'matriculado' ? 'Inscrito en Edvanta' : 'Dice haber hecho el curso'}
            </span>
          </div>
          {o.texto && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-edvanta-deep">{o.texto}</p>
          )}
        </div>
      </div>
    </li>
  );
}

/** El formulario de calificar, con los tres casos posibles. */
function Calificar({ refCurso, exigeMatricula, miOpinion, puedo, urlVolver, onGuardado }) {
  const [abierto, setAbierto] = useState(false);
  const [puntuacion, setPuntuacion] = useState(miOpinion?.puntuacion || 0);
  const [texto, setTexto] = useState(miOpinion?.texto || '');
  const [declaro, setDeclaro] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    setPuntuacion(miOpinion?.puntuacion || 0);
    setTexto(miOpinion?.texto || '');
  }, [miOpinion]);

  if (!puedo.opinar) {
    return (
      <Card className="mt-6">
        <p className="text-sm font-bold text-edvanta-deep">¿Hiciste este curso?</p>
        <p className="mt-1 text-sm leading-6 text-edvanta-muted">
          Entra con tu cuenta para dejar tu valoración. Volverás a esta página.
        </p>
        <Btn className="mt-4" size="sm"
          to={`/cuenta?next=${encodeURIComponent(`${urlVolver}#valoraciones`)}`}>
          Entrar para calificar
        </Btn>
      </Card>
    );
  }

  const enviar = async (e) => {
    e.preventDefault();
    if (!puntuacion) { setError('Elige cuántas estrellas le das.'); return; }
    if (!exigeMatricula && !declaro) {
      setError('Confirma que hiciste el curso antes de calificarlo.');
      return;
    }
    setGuardando(true);
    setError('');
    const r = await guardarMiOpinion(refCurso, { puntuacion, texto, declaro });
    setGuardando(false);
    if (!r.ok) {
      setError(r.codigo === 'sin_permiso'
        ? 'Para calificar este curso tienes que estar inscrito en él.'
        : r.error);
      return;
    }
    setAviso('Gracias. Tu valoración quedó publicada.');
    setAbierto(false);
    onGuardado(r.datos);
  };

  const borrar = async () => {
    setGuardando(true);
    const r = await borrarMiOpinion(refCurso);
    setGuardando(false);
    if (r.ok) { setAviso('Quitamos tu valoración.'); onGuardado(r.datos); setAbierto(false); }
    else setError(r.error);
  };

  if (!abierto) {
    return (
      <Card className="mt-6">
        {miOpinion ? (
          <>
            <p className="text-sm font-bold text-edvanta-deep">Tu valoración</p>
            <div className="mt-2 flex items-center gap-2">
              <Estrellas valor={miOpinion.puntuacion} tamano="sm" />
              <span className="text-sm text-edvanta-muted">{miOpinion.puntuacion} de 5</span>
            </div>
            {miOpinion.texto && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-edvanta-muted">{miOpinion.texto}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn size="sm" variant="secondary" onClick={() => setAbierto(true)}>Editar mi valoración</Btn>
              <Btn size="sm" variant="ghost" onClick={borrar} disabled={guardando}>Quitarla</Btn>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-edvanta-deep">¿Hiciste este curso?</p>
            <p className="mt-1 text-sm leading-6 text-edvanta-muted">
              Cuéntale a quien venga detrás si le va a servir.
            </p>
            <Btn className="mt-4" size="sm" onClick={() => setAbierto(true)}>Calificar el curso</Btn>
          </>
        )}
        {aviso && <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">{aviso}</p>}
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <ElegirEstrellas valor={puntuacion} onChange={setPuntuacion} disabled={guardando} />
        <div>
          <label htmlFor="resena" className="text-sm font-bold text-edvanta-deep">
            Tu reseña <span className="font-normal text-edvanta-muted">(opcional)</span>
          </label>
          <textarea
            id="resena"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            maxLength={4000}
            placeholder="¿Qué te sirvió? ¿Qué esperabas y no estaba?"
            className="mt-1.5 w-full resize-y rounded-xl border border-edvanta-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/20"
          />
        </div>

        {!exigeMatricula && (
          <label className="flex items-start gap-2.5 text-sm text-edvanta-deep">
            <input type="checkbox" checked={declaro} onChange={(e) => setDeclaro(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-edvanta-border" />
            <span>
              Confirmo que hice este curso. Quedará marcado como <strong>declarado</strong>:
              Edvanta no puede comprobar lo que ocurre en otra plataforma.
            </span>
          </label>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Btn type="submit" size="sm" disabled={guardando}>
            {guardando ? 'Guardando…' : miOpinion ? 'Guardar cambios' : 'Publicar mi valoración'}
          </Btn>
          <Btn type="button" size="sm" variant="ghost" onClick={() => setAbierto(false)}>Cancelar</Btn>
        </div>
      </form>
    </Card>
  );
}

export default function ValoracionesDeCurso({ refCurso, urlVolver, inicial, exigeMatricula, puedo }) {
  const [resumen, setResumen] = useState(inicial?.resumen || { total: 0, promedio: null, distribucion: null });
  const [opiniones, setOpiniones] = useState(inicial?.opiniones || []);
  const [hayMas, setHayMas] = useState(Boolean(inicial?.hayMas));
  const [miOpinion, setMiOpinion] = useState(inicial?.miOpinion || null);
  const [filtro, setFiltro] = useState(null);
  const [orden, setOrden] = useState('recientes');
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);

  const traer = useCallback(async (p, f, o) => {
    setCargando(true);
    const r = await listaDeOpiniones(refCurso, { pagina: p, estrellas: f, orden: o });
    setCargando(false);
    if (!r.ok) return;
    setResumen(r.datos.resumen);
    setOpiniones(p === 1 ? r.datos.opiniones : (prev) => [...prev, ...r.datos.opiniones]);
    setHayMas(r.datos.hayMas);
  }, [refCurso]);

  // Al filtrar u ordenar se vuelve a la primera página: si no, se queda
  // en la página 3 de un listado que ahora tiene una.
  useEffect(() => {
    if (filtro === null && orden === 'recientes' && pagina === 1 && inicial) return;
    traer(pagina, filtro, orden);
  }, [traer, pagina, filtro, orden, inicial]);

  const trasGuardar = (datos) => {
    setResumen(datos.resumen);
    setMiOpinion(datos.miOpinion);
    setPagina(1);
    traer(1, filtro, orden);
  };

  return (
    <div>
      {resumen.total > 0 ? (
        <div className="gap-8 sm:grid sm:grid-cols-[auto_minmax(0,22rem)] sm:items-start">
          <div className="mb-6 sm:mb-0">
            <p className="font-display text-5xl font-extrabold text-edvanta-deep">{resumen.promedio}</p>
            <Estrellas valor={resumen.promedio} className="mt-1" />
            <p className="mt-1 text-sm text-edvanta-muted">
              {resumen.total} {resumen.total === 1 ? 'valoración' : 'valoraciones'} en Edvanta
            </p>
          </div>
          <Distribucion distribucion={resumen.distribucion} total={resumen.total}
            filtro={filtro} onFiltrar={(n) => { setFiltro(n); setPagina(1); }} />
        </div>
      ) : (
        <Card>
          <Eyebrow>Todavía nadie</Eyebrow>
          <p className="mt-2 text-base font-bold text-edvanta-deep">
            Este curso aún no tiene valoraciones en Edvanta.
          </p>
          <p className="mt-1 text-sm leading-6 text-edvanta-muted">
            Sé la primera persona en compartir tu experiencia.
          </p>
        </Card>
      )}

      <Calificar

        refCurso={refCurso}
        exigeMatricula={exigeMatricula}
        miOpinion={miOpinion}
        puedo={puedo}
        urlVolver={urlVolver}
        onGuardado={trasGuardar}
      />

      {resumen.total > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-edvanta-deep">
              {filtro ? `Valoraciones de ${filtro} ${filtro === 1 ? 'estrella' : 'estrellas'}` : 'Todas las valoraciones'}
            </p>
            <label className="text-sm text-edvanta-muted">
              Ordenar por{' '}
              <select
                value={orden}
                onChange={(e) => { setOrden(e.target.value); setPagina(1); }}
                className="rounded-lg border border-edvanta-border bg-white px-2 py-1 text-sm font-semibold text-edvanta-deep"
              >
                <option value="recientes">Más recientes</option>
                <option value="utiles">Más detalladas</option>
              </select>
            </label>
          </div>

          {filtro && (
            <Btn size="sm" variant="ghost" className="mt-2" onClick={() => { setFiltro(null); setPagina(1); }}>
              Quitar filtro
            </Btn>
          )}

          <ul className="mt-5 flex flex-col gap-5">
            {opiniones.map((o) => <Opinion key={o.id} o={o} />)}
          </ul>
          {!opiniones.length && !cargando && (
            <p className="mt-4 text-sm text-edvanta-muted">No hay valoraciones con ese filtro.</p>
          )}
          {hayMas && (
            <Btn size="sm" variant="secondary" className="mt-6"
              onClick={() => setPagina((p) => p + 1)} disabled={cargando}>
              {cargando ? 'Cargando…' : 'Ver más valoraciones'}
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}
