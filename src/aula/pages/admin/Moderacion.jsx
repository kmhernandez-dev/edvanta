/**
 * ============================================================
 *  Moderacion.jsx — La bandeja de comentarios
 *
 *  Una cola de trabajo, no un listado para mirar. Lo reportado y sin
 *  revisar va primero, porque es lo único que de verdad urge; el resto
 *  está detrás de un filtro.
 *
 *  Cada fila trae su contexto —quién, en qué curso, en qué clase— para
 *  poder decidir sin abrir nada. Y las acciones tienen vuelta atrás:
 *  retirar se deshace con restaurar, y un reporte infundado se cierra
 *  sin borrar el comentario.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle, CornerDownRight, Eye, MessageSquare, RotateCcw, Trash2,
} from 'lucide-react';
import { get, post } from '../../api';
import { PageHeader } from '../../ui/Page';
import { Button } from '../../ui/Button';
import { useAsync } from '../../hooks';

const FILTROS = [
  { id: 'reportados', label: 'Reportados' },
  { id: 'publicados', label: 'Publicados' },
  { id: 'retirados', label: 'Retirados' },
  { id: 'todos', label: 'Todos' },
];

const fecha = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

/** Responder sin salir de la bandeja. */
function Responder({ c, onHecho }) {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    setError('');
    try {
      const ruta = c.donde === 'curso'
        ? `/admin/moderacion/curso/${c.refCurso}/responder`
        : `/admin/moderacion/clase/${c.courseId}/${c.lessonId}/responder`;
      await post(ruta, { cuerpo: texto.trim(), padreId: c.id });
      setTexto('');
      onHecho();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="mt-3 flex flex-col gap-2">
      <label htmlFor={`resp-${c.id}`} className="sr-only">Tu respuesta</label>
      <textarea
        id={`resp-${c.id}`}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={2}
        placeholder="Responde públicamente, con tu nombre…"
        className="w-full resize-y rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-2.5 text-sm outline-none focus:border-[var(--aula-secondary)]"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={!texto.trim() || enviando}>
          {enviando ? 'Enviando…' : 'Publicar respuesta'}
        </Button>
        {error && <span className="text-xs font-semibold text-[var(--aula-danger)]">{error}</span>}
      </div>
    </form>
  );
}

function Fila({ c, onCambio }) {
  const [respondiendo, setRespondiendo] = useState(false);
  const [motivos, setMotivos] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  const actuar = async (accion) => {
    setOcupado(true);
    setError('');
    try {
      await post(`/admin/moderacion/${c.donde}/${c.id}/${accion}`, {});
      onCambio();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const verMotivos = async () => {
    try {
      const r = await get(`/admin/moderacion/${c.donde}/${c.id}/reportes`);
      setMotivos(r.motivos);
    } catch (err) { setError(err.message); }
  };

  const retirado = c.estado !== 'publicado';

  return (
    <li className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--aula-neutral-soft)] px-2.5 py-1 font-bold text-[var(--aula-muted)]">
          {c.donde === 'curso' ? 'Ficha del curso' : 'Dentro de una clase'}
        </span>
        {c.reportes > 0 && (
          <button type="button" onClick={verMotivos}
            className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-800 hover:bg-amber-100">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {c.reportes} {c.reportes === 1 ? 'reporte' : 'reportes'}
          </button>
        )}
        {retirado && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 font-bold text-red-700">Retirado</span>
        )}
        {c.esRespuesta && (
          <span className="inline-flex items-center gap-1 text-[var(--aula-muted)]">
            <CornerDownRight className="h-3.5 w-3.5" aria-hidden="true" />Respuesta
          </span>
        )}
      </div>

      <p className="mt-2 text-sm">
        <span className="font-bold text-[var(--aula-text)]">{c.autor.nombre}</span>
        <span className="text-[var(--aula-muted)]"> · {fecha(c.fecha)}</span>
        {c.editado && <span className="text-[var(--aula-subtle)]"> · editado</span>}
      </p>
      <p className="mt-1 text-xs text-[var(--aula-muted)]">
        {c.contexto.curso}
        {c.contexto.clase ? ` · ${c.contexto.clase}` : ''}
      </p>

      <p className="mt-2 whitespace-pre-wrap rounded-[var(--aula-radius-sm)] bg-[var(--aula-neutral-soft)] p-3 text-sm leading-6 text-[var(--aula-text)]">
        {c.cuerpo}
      </p>

      {motivos && (
        <div className="mt-2 rounded-[var(--aula-radius-sm)] bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-900">Por qué lo reportaron</p>
          <ul className="mt-1 flex flex-col gap-1">
            {motivos.map((m, i) => (
              <li key={`${m.fecha}-${i}`} className="text-xs text-amber-900">
                {m.quien}: {m.motivo || 'sin motivo escrito'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {retirado ? (
          <Button size="sm" variant="secondary" icon={RotateCcw} onClick={() => actuar('restaurar')} disabled={ocupado}>
            Volver a publicar
          </Button>
        ) : (
          <Button size="sm" variant="danger" icon={Trash2} onClick={() => actuar('retirar')} disabled={ocupado}>
            Retirar
          </Button>
        )}
        {c.reportes > 0 && (
          <Button size="sm" variant="secondary" onClick={() => actuar('descartar-reporte')} disabled={ocupado}>
            El reporte no procede
          </Button>
        )}
        {!retirado && (
          <Button size="sm" variant="ghost" icon={MessageSquare} onClick={() => setRespondiendo((v) => !v)}>
            Responder
          </Button>
        )}
        <a href={c.contexto.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--aula-primary)] hover:underline">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />Ver en su sitio
        </a>
      </div>

      {error && <p role="alert" className="mt-2 text-xs font-semibold text-[var(--aula-danger)]">{error}</p>}
      {respondiendo && <Responder c={c} onHecho={() => { setRespondiendo(false); onCambio(); }} />}
    </li>
  );
}

export default function Moderacion() {
  const [filtro, setFiltro] = useState('reportados');
  const [pagina, setPagina] = useState(1);
  const [version, setVersion] = useState(0);

  const cargar = useCallback(
    ({ signal }) => get(`/admin/moderacion?filtro=${filtro}&pagina=${pagina}`, { signal }),
    [filtro, pagina, version],
  );
  const bandeja = useAsync(cargar, [cargar]);

  // Al cambiar de filtro se vuelve a la primera página: si no, se queda
  // en la tres de una lista que ahora tiene una.
  useEffect(() => { setPagina(1); }, [filtro]);

  const recargar = () => setVersion((v) => v + 1);
  const datos = bandeja.data;

  return (
    <>
      <PageHeader
        title="Comentarios"
        description="Lo reportado y sin revisar va primero. Retirar se deshace, y un reporte infundado se cierra sin borrar nada."
      />
      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            aria-pressed={filtro === f.id}
            className={`min-h-10 rounded-[var(--aula-radius)] px-4 text-sm font-bold transition ${
              filtro === f.id
                ? 'bg-[var(--aula-primary)] text-white'
                : 'bg-[var(--aula-neutral-soft)] text-[var(--aula-muted)] hover:text-[var(--aula-text)]'
            }`}
          >
            {f.label}
            {f.id === 'reportados' && datos?.pendientes > 0 && (
              <span className="ml-2 rounded-full bg-amber-400 px-1.5 text-xs text-amber-950">{datos.pendientes}</span>
            )}
          </button>
        ))}
      </div>

      {bandeja.loading && !datos && (
        <p className="mt-8 text-sm text-[var(--aula-muted)]">Cargando comentarios…</p>
      )}
      {bandeja.error && (
        <p role="alert" className="mt-8 rounded-[var(--aula-radius)] bg-red-50 p-4 text-sm font-semibold text-red-700">
          {bandeja.error.message}{' '}
          <button type="button" onClick={recargar} className="underline">Reintentar</button>
        </p>
      )}

      {datos && !datos.comentarios.length && (
        <p className="mt-8 rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] p-6 text-sm text-[var(--aula-muted)]">
          {filtro === 'reportados'
            ? 'No hay nada reportado. Cuando alguien marque un comentario, aparecerá aquí.'
            : 'No hay comentarios con este filtro.'}
        </p>
      )}

      {datos?.comentarios.length > 0 && (
        <>
          <ul className="mt-6 flex flex-col gap-4">
            {datos.comentarios.map((c) => (
              <Fila key={`${c.donde}-${c.id}`} c={c} onCambio={recargar} />
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3">
            {pagina > 1 && (
              <Button size="sm" variant="secondary" onClick={() => setPagina((p) => p - 1)}>Anteriores</Button>
            )}
            {datos.hayMas && (
              <Button size="sm" variant="secondary" onClick={() => setPagina((p) => p + 1)}>Siguientes</Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
