/**
 * Reglas de acceso del aula. Se aplican en el servidor en cada petición;
 * la interfaz solo refleja lo que estas funciones permiten.
 *
 * Un participante:
 *  - solo ve cursos con una inscripción suya no retirada;
 *  - solo abre cursos publicados, vigentes y dentro de sus fechas;
 *  - solo ve archivos que pertenecen a la versión que está cursando, a
 *    recursos publicados de sus cursos, a foros de sus cursos o a sus
 *    propias entregas.
 * A quien no tiene inscripción se le responde "no encontrado", para no
 * revelar qué cursos existen.
 */
import { one } from './db.js';
import { AulaError, notFound } from './http.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });

/** ¿El curso está abierto para esta inscripción? Devuelve null si sí, o el motivo. */
export function closedReason(row, now = new Date()) {
  if (row.course_deleted_at || row.course_status === 'archivado') {
    return { code: 'curso_no_disponible', message: 'Este curso ya no está disponible.' };
  }
  if (row.course_status !== 'publicado' || !row.current_version_id || !row.course_version_id) {
    return { code: 'curso_sin_publicar', message: 'Este curso todavía no está publicado. Te avisaremos cuando abra.' };
  }
  if (row.available_from && new Date(row.available_from) > now) {
    return { code: 'curso_proximamente', message: `Este curso abre el ${fmtDate(row.available_from)}.` };
  }
  if (row.starts_at && new Date(row.starts_at) > now) {
    return { code: 'acceso_proximamente', message: `Tu acceso a este curso empieza el ${fmtDate(row.starts_at)}.` };
  }
  if (row.available_until && new Date(row.available_until) < now) {
    return { code: 'curso_cerrado', message: `El periodo de este curso terminó el ${fmtDate(row.available_until)}.` };
  }
  return null;
}

const ENROLLMENT_ROW = `
  SELECT e.*, c.status AS course_status, c.deleted_at AS course_deleted_at,
         c.current_version_id, c.available_from, c.available_until, c.title AS course_title,
         c.sequential, c.passing_score AS course_passing_score, c.max_attempts AS course_max_attempts,
         c.video_completion_pct, c.resources_enabled
    FROM aula_enrollments e
    JOIN aula_courses c ON c.id = e.course_id`;

export async function findEnrollment(db, userId, courseId) {
  return one(db, `${ENROLLMENT_ROW} WHERE e.user_id = $1 AND e.course_id = $2 AND e.withdrawn_at IS NULL`, [userId, courseId]);
}

export async function findEnrollmentById(db, enrollmentId) {
  return one(db, `${ENROLLMENT_ROW} WHERE e.id = $1`, [enrollmentId]);
}

/**
 * Inscripción vigente del usuario en el curso, o error.
 * Los administradores no tienen inscripción: usan la vista previa.
 */
export async function requireOpenEnrollment(db, user, courseId, { now = new Date() } = {}) {
  const row = await findEnrollment(db, user.id, courseId);
  if (!row) throw notFound('No encontramos este curso entre los que tienes asignados.');
  const reason = closedReason(row, now);
  if (reason) throw new AulaError(403, reason.code, reason.message);
  return row;
}

/**
 * Qué puede hacer el usuario con un archivo.
 * Devuelve { file, canView, canDownload } o null si el archivo no existe.
 */
export async function fileAccess(db, user, fileId) {
  const file = await one(
    db,
    `SELECT id, storage_key, original_name, mime_type, extension, size_bytes, purpose, status, uploaded_by
       FROM aula_files WHERE id = $1 AND deleted_at IS NULL`,
    [fileId],
  );
  if (!file || file.status !== 'listo') return null;

  if (user.role === 'admin') return { file, canView: true, canDownload: true };

  if (file.uploaded_by === user.id && (file.purpose === 'entrega' || file.purpose === 'foro')) {
    return { file, canView: true, canDownload: true };
  }

  const openCourse = `
    c.deleted_at IS NULL AND c.status = 'publicado'
    AND e.user_id = $2 AND e.withdrawn_at IS NULL`;

  let row = null;
  switch (file.purpose) {
    case 'contenido':
      row = await one(
        db,
        `SELECT bool_or(vf.downloadable) AS downloadable
           FROM aula_version_files vf
           JOIN aula_enrollments e ON e.course_version_id = vf.course_version_id
           JOIN aula_courses c ON c.id = e.course_id
          WHERE vf.file_id = $1 AND ${openCourse}
         HAVING count(*) > 0`,
        [fileId, user.id],
      );
      return row ? { file, canView: true, canDownload: Boolean(row.downloadable) } : { file, canView: false, canDownload: false };

    case 'recurso':
      row = await one(
        db,
        `SELECT bool_or(r.allow_download) AS downloadable
           FROM aula_resource_versions rv
           JOIN aula_resources r ON r.current_version_id = rv.id
           JOIN aula_courses c ON c.id = r.course_id
           JOIN aula_enrollments e ON e.course_id = c.id
          WHERE rv.file_id = $1 AND r.status = 'publicado' AND r.deleted_at IS NULL
            AND c.resources_enabled AND ${openCourse}
         HAVING count(*) > 0`,
        [fileId, user.id],
      );
      return row ? { file, canView: true, canDownload: Boolean(row.downloadable) } : { file, canView: false, canDownload: false };

    case 'portada':
      row = await one(
        db,
        `SELECT 1 FROM aula_courses c JOIN aula_enrollments e ON e.course_id = c.id
          WHERE c.cover_file_id = $1 AND c.deleted_at IS NULL AND e.user_id = $2 AND e.withdrawn_at IS NULL
          LIMIT 1`,
        [fileId, user.id],
      );
      return { file, canView: Boolean(row), canDownload: false };

    case 'logo':
      row = await one(
        db,
        `SELECT 1 FROM aula_companies co JOIN aula_users u ON u.company_id = co.id
          WHERE co.logo_file_id = $1 AND u.id = $2 LIMIT 1`,
        [fileId, user.id],
      );
      return { file, canView: Boolean(row), canDownload: false };

    case 'foro':
      row = await one(
        db,
        `SELECT 1
           FROM aula_forum_posts p
           JOIN aula_forums f ON f.id = p.forum_id
           JOIN aula_courses c ON c.id = f.course_id
           JOIN aula_enrollments e ON e.course_id = c.id
          WHERE p.file_id = $1 AND p.is_hidden = FALSE AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            AND ${openCourse}
          LIMIT 1`,
        [fileId, user.id],
      );
      return { file, canView: Boolean(row), canDownload: Boolean(row) };

    default:
      // Entregas ajenas y cualquier otro caso: sin acceso.
      return { file, canView: false, canDownload: false };
  }
}
