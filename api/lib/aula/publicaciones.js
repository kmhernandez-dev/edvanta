/**
 * Publicaciones aprobadas antes de que el curso existiera en el Aula.
 *
 * Una migración que siembra un curso ya aprobado deja una fila en
 * aula_publicaciones_aprobadas. Al arrancar, aquí se publica cada fila
 * pendiente con publishCourse, el mismo camino del botón «Publicar»:
 * snapshot, validación, versión y bitácora. Si el curso no pasa la
 * validación, no se fuerza nada: se guarda el error y sigue en borrador.
 */
import { many, one } from './db.js';
import { publishCourse } from './courses.js';

export async function publicarAprobados(db, { now = new Date(), log = () => {} } = {}) {
  const pendientes = await many(
    db,
    `SELECT p.id, p.course_id, p.aprobado_por, p.nota, c.title, c.status, c.current_version_id
       FROM aula_publicaciones_aprobadas p
       JOIN aula_courses c ON c.id = p.course_id AND c.deleted_at IS NULL
      WHERE p.publicado_at IS NULL
      ORDER BY p.id`,
  );
  const hechos = [];
  for (const p of pendientes) {
    // Alguien lo publicó a mano antes: la aprobación ya se cumplió.
    if (p.current_version_id) {
      await db.query(
        'UPDATE aula_publicaciones_aprobadas SET publicado_at = $2, version_id = $3, error = NULL WHERE id = $1',
        [p.id, now, p.current_version_id],
      );
      continue;
    }
    try {
      const { version } = await publishCourse(
        db,
        p.course_id,
        { changeSummary: `Primera publicación, aprobada por ${p.aprobado_por}. ${p.nota}`.trim() },
        { actor: { id: null, email: null }, ip: null, now },
      );
      await db.query(
        'UPDATE aula_publicaciones_aprobadas SET publicado_at = $2, version_id = $3, error = NULL WHERE id = $1',
        [p.id, now, version.id],
      );
      hechos.push(p.course_id);
      log({ msg: 'Curso aprobado publicado', courseId: p.course_id, title: p.title, version: version.number });
    } catch (err) {
      const problemas = (err.extra?.problems || []).slice(0, 3).map((x) => x.message).join(' | ');
      const error = [err.message, problemas].filter(Boolean).join(' — ').slice(0, 1000);
      await db.query('UPDATE aula_publicaciones_aprobadas SET error = $2 WHERE id = $1', [p.id, error]);
      log({ level: 'error', msg: 'No se pudo publicar un curso aprobado', courseId: p.course_id, title: p.title, error });
    }
  }
  return hechos;
}

/** Cuántas aprobaciones siguen esperando (para el registro de arranque). */
export async function aprobadosPendientes(db) {
  return (await one(db, 'SELECT count(*)::int AS n FROM aula_publicaciones_aprobadas WHERE publicado_at IS NULL')).n;
}
