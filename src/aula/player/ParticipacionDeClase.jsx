/**
 * ============================================================
 *  ParticipacionDeClase.jsx — Preguntas y nota de UNA clase
 *
 *  Debajo del contenido de la clase, no en la barra lateral: se
 *  pregunta cuando ya se leyó o se vio el video, no antes.
 *
 *  La nota de la clase es independiente de la del curso y NO entra en
 *  su media. Son dos cosas distintas: una clase puede estar floja en un
 *  curso buenísimo, y esa información se pierde si se mezclan.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { ElegirEstrellas, Estrellas } from '../../components/opiniones/Estrellas';
import Comentarios from '../../components/opiniones/Comentarios';
import {
  borrarComentario, comentarEnClase, editarComentario, guardarNotaDeClase,
  participacionDeClase, reportar,
} from '../../lib/opiniones';

/** Nota de esta clase. Vive aparte de la del curso. */
function NotaDeLaClase({ cursoId, claseId, nota, onGuardada }) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const elegir = async (n) => {
    setGuardando(true);
    setError('');
    const r = await guardarNotaDeClase(cursoId, claseId, n);
    setGuardando(false);
    if (!r.ok) { setError(r.error); return; }
    setAviso('Gracias por tu nota.');
    onGuardada(r.datos);
  };

  return (
    <div className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-5">
      <ElegirEstrellas
        valor={nota.mia || 0}
        onChange={elegir}
        disabled={guardando}
        etiqueta="¿Qué tal esta clase?"
        tamano="md"
      />
      <p className="mt-2 text-xs leading-5 text-[var(--aula-muted)]">
        Es solo de esta clase y no cuenta para la valoración del curso.
      </p>
      {nota.total > 0 && (
        <p className="mt-2 flex items-center gap-2 text-xs text-[var(--aula-muted)]">
          <Estrellas valor={nota.promedio} tamano="sm" />
          <span>
            {nota.promedio} de 5 · {nota.total} {nota.total === 1 ? 'nota' : 'notas'}
          </span>
        </p>
      )}
      {aviso && <p role="status" className="mt-2 text-xs font-semibold text-emerald-700">{aviso}</p>}
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-[var(--aula-danger)]">{error}</p>}
    </div>
  );
}

export default function ParticipacionDeClase({ cursoId, claseId }) {
  const [nota, setNota] = useState(null);
  const [puedo, setPuedo] = useState({ comentar: false, opinar: false, moderar: false });
  const [fallo, setFallo] = useState('');

  // Se pide una vez para saber la nota y los permisos. Los comentarios
  // los recarga el propio hilo, que lleva su paginación.
  useEffect(() => {
    let vivo = true;
    setNota(null);
    participacionDeClase(cursoId, claseId).then((r) => {
      if (!vivo) return;
      if (!r.ok) { setFallo(r.error); return; }
      setFallo('');
      setNota(r.datos.nota);
      setPuedo(r.datos.puedo);
    });
    return () => { vivo = false; };
  }, [cursoId, claseId]);

  const cargar = useCallback(
    (p) => participacionDeClase(cursoId, claseId, { pagina: p }).then((r) => (
      r.ok ? { ok: true, datos: r.datos.comentarios } : r
    )),
    [cursoId, claseId],
  );

  if (fallo) {
    return <p className="mt-10 text-sm text-[var(--aula-muted)]">{fallo}</p>;
  }

  return (
    <section className="mt-12 border-t border-[var(--aula-border)] pt-8">
      {nota && (
        <div className="mb-8 max-w-md">
          <NotaDeLaClase cursoId={cursoId} claseId={claseId} nota={nota} onGuardada={setNota} />
        </div>
      )}
      <Comentarios
        donde="clase"
        // La clave del borrador lleva curso y clase: así lo que se
        // estaba escribiendo en una clase no reaparece en otra.
        sitio={`clase-${cursoId}-${claseId}`}
        titulo="Preguntas y comentarios de esta clase"
        descripcion="Lo que preguntes aquí queda en esta clase. Si tu duda es del curso entero, mejor en su página."
        puedo={puedo}
        invitacion="Entra con tu cuenta para preguntar sobre esta clase."
        cargar={cargar}
        publicar={(cuerpo, padreId) => comentarEnClase(cursoId, claseId, { cuerpo, padreId })}
        editar={(id, cuerpo) => editarComentario('clase', id, cuerpo)}
        borrar={(id) => borrarComentario('clase', id)}
        reportar={(id) => reportar('comentario_clase', id)}
      />
    </section>
  );
}
