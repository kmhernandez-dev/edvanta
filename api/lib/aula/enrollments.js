/**
 * Asignaciones e inscripciones.
 *
 * Una asignación dice "este curso es para esta persona / este grupo /
 * esta empresa". Las inscripciones son su resultado por persona. Las
 * asignaciones a grupo o empresa también alcanzan a quienes entren
 * después. Retirar nunca borra el historial académico: solo marca la
 * inscripción como retirada.
 */
import { many, one } from './db.js';
import { badRequest, conflict, notFound, plural } from './http.js';
import { audit } from './audit.js';
import { notify } from './notify.js';
import { initializeEnrollments, recomputeEnrollment } from './progress.js';

const TARGET_LABEL = { usuario: 'la persona', grupo: 'el grupo', empresa: 'la empresa' };

/** Personas que hoy alcanza una asignación. */
export async function targetUserIds(db, { target_type: type, user_id: userId, group_id: groupId, company_id: companyId }) {
  let rows;
  if (type === 'usuario') {
    rows = await many(db, "SELECT id FROM aula_users WHERE id = $1 AND deleted_at IS NULL AND role = 'participant'", [userId]);
  } else if (type === 'grupo') {
    rows = await many(
      db,
      `SELECT u.id FROM aula_group_members m
         JOIN aula_users u ON u.id = m.user_id
         JOIN aula_groups g ON g.id = m.group_id
        WHERE m.group_id = $1 AND m.removed_at IS NULL AND u.deleted_at IS NULL
          AND u.role = 'participant' AND g.deleted_at IS NULL`,
      [groupId],
    );
  } else {
    rows = await many(
      db,
      "SELECT id FROM aula_users WHERE company_id = $1 AND deleted_at IS NULL AND role = 'participant'",
      [companyId],
    );
  }
  return rows.map((r) => r.id);
}

/**
 * Inscribe (o reactiva) a una lista de personas. Las inscripciones ya
 * activas no se tocan. Devuelve cuántas se crearon y reactivaron.
 */
export async function enrollUsers(db, { course, userIds, assignmentId = null, startsAt = null, dueAt = null, actor = null, now = new Date() }) {
  if (!userIds.length) return { created: [], reactivated: [], unchanged: 0 };
  const rows = await many(
    db,
    `INSERT INTO aula_enrollments
       (course_id, user_id, assignment_id, course_version_id, starts_at, due_at, assigned_at, created_at, updated_at)
     SELECT $1, uid, $2, $3, $4, $5, $6, $6, $6 FROM unnest($7::bigint[]) AS uid
     ON CONFLICT (course_id, user_id) DO UPDATE
        SET withdrawn_at = NULL,
            withdrawn_by = NULL,
            assignment_id = EXCLUDED.assignment_id,
            starts_at = EXCLUDED.starts_at,
            due_at = EXCLUDED.due_at,
            assigned_at = EXCLUDED.assigned_at,
            course_version_id = COALESCE(aula_enrollments.course_version_id, EXCLUDED.course_version_id)
      WHERE aula_enrollments.withdrawn_at IS NOT NULL
     RETURNING id, user_id, (xmax = 0) AS inserted`,
    [course.id, assignmentId, course.current_version_id ?? null, startsAt, dueAt, now, userIds],
  );
  const created = rows.filter((r) => r.inserted);
  const reactivated = rows.filter((r) => !r.inserted);

  // Lo que exige la versión que van a cursar (las reactivadas conservan su avance).
  await initializeEnrollments(db, created.map((r) => r.id), course.current_version_id);
  for (const row of reactivated) await recomputeEnrollment(db, row.id, { now });

  for (const row of rows) {
    await notify(db, {
      userId: row.user_id,
      type: 'asignacion',
      title: `Te asignaron el curso «${course.title}»`,
      body: dueAt ? `Fecha límite: ${new Date(dueAt).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}.` : null,
      link: `/aula/curso/${course.id}`,
      dedupeKey: `asignacion:${course.id}:${now.getTime()}`,
      now,
    });
  }
  if (actor && reactivated.length) {
    await audit(db, {
      actor, action: 'inscripcion.reactivar', entityType: 'curso', entityId: course.id, courseId: course.id,
      summary: `${plural(reactivated.length, 'inscripción reactivada', 'inscripciones reactivadas')} en «${course.title}».`,
      after: { enrollmentIds: reactivated.map((r) => r.id) },
    });
  }
  return { created, reactivated, unchanged: userIds.length - rows.length };
}

async function loadCourse(db, courseId) {
  const course = await one(
    db,
    `SELECT id, title, status, kind, company_id, current_version_id
       FROM aula_courses WHERE id = $1 AND deleted_at IS NULL`,
    [courseId],
  );
  if (!course) throw notFound('No encontramos ese curso.');
  if (course.status === 'archivado') throw conflict('Este curso está archivado; no se puede asignar.');
  return course;
}

async function describeTarget(db, type, targetId) {
  if (type === 'usuario') {
    const u = await one(db, "SELECT id, email, first_name, last_name, company_id, role FROM aula_users WHERE id = $1 AND deleted_at IS NULL", [targetId]);
    if (!u) throw notFound('No encontramos a esa persona.');
    if (u.role !== 'participant') throw badRequest('Los cursos solo se asignan a participantes.');
    return { companyId: u.company_id, label: `${u.first_name} ${u.last_name}`.trim() || u.email };
  }
  if (type === 'grupo') {
    const g = await one(db, 'SELECT id, name, company_id, status FROM aula_groups WHERE id = $1 AND deleted_at IS NULL', [targetId]);
    if (!g) throw notFound('No encontramos ese grupo.');
    return { companyId: g.company_id, label: g.name };
  }
  const c = await one(db, 'SELECT id, name FROM aula_companies WHERE id = $1 AND deleted_at IS NULL', [targetId]);
  if (!c) throw notFound('No encontramos esa empresa.');
  return { companyId: c.id, label: c.name };
}

export async function createAssignment(db, { courseId, targetType, targetId, startsAt = null, dueAt = null, actor, ip, now = new Date() }) {
  if (dueAt && startsAt && dueAt <= startsAt) {
    throw badRequest('La fecha límite debe ser posterior a la fecha de inicio.', { field: 'dueAt' });
  }
  return db.tx(async (tx) => {
    const course = await loadCourse(tx, courseId);
    const target = await describeTarget(tx, targetType, targetId);
    // Una capacitación privada no puede llegar a personas de otra empresa.
    if (course.kind === 'empresa' && target.companyId !== course.company_id) {
      throw badRequest('Esta capacitación es privada de otra empresa. Solo puede asignarse a personas o grupos de esa empresa.');
    }
    const assignment = await one(
      tx,
      `INSERT INTO aula_assignments (course_id, target_type, user_id, group_id, company_id, starts_at, due_at, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        course.id, targetType,
        targetType === 'usuario' ? targetId : null,
        targetType === 'grupo' ? targetId : null,
        targetType === 'empresa' ? targetId : null,
        startsAt, dueAt, actor.id, now,
      ],
    );
    let userIds = await targetUserIds(tx, assignment);
    if (course.kind === 'empresa') {
      userIds = (await many(tx, 'SELECT id FROM aula_users WHERE id = ANY($1::bigint[]) AND company_id = $2', [userIds, course.company_id])).map((r) => r.id);
    }
    const result = await enrollUsers(tx, { course, userIds, assignmentId: assignment.id, startsAt, dueAt, now });
    await audit(tx, {
      actor, ip, action: 'asignacion.crear', entityType: 'asignacion', entityId: assignment.id,
      courseId: course.id, companyId: target.companyId,
      summary: `«${course.title}» asignado a ${TARGET_LABEL[targetType]} ${target.label}: ${plural(result.created.length, 'inscripción nueva', 'inscripciones nuevas')}, ${plural(result.reactivated.length, 'reactivada')}.`,
      after: { targetType, targetId, startsAt, dueAt },
    });
    return { assignment, created: result.created.length, reactivated: result.reactivated.length, unchanged: result.unchanged };
  });
}

/** Revoca una asignación y retira las inscripciones que nacieron de ella. */
export async function revokeAssignment(db, { assignmentId, actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const a = await one(
      tx,
      `SELECT a.*, c.title FROM aula_assignments a JOIN aula_courses c ON c.id = a.course_id
        WHERE a.id = $1 FOR UPDATE OF a`,
      [assignmentId],
    );
    if (!a) throw notFound('No encontramos esa asignación.');
    if (a.revoked_at) throw conflict('Esta asignación ya estaba revocada.');
    await tx.query('UPDATE aula_assignments SET revoked_at = $2, revoked_by = $3 WHERE id = $1', [a.id, now, actor.id]);
    const withdrawn = await many(
      tx,
      `UPDATE aula_enrollments SET withdrawn_at = $2, withdrawn_by = $3
        WHERE assignment_id = $1 AND withdrawn_at IS NULL
        RETURNING id`,
      [a.id, now, actor.id],
    );
    await audit(tx, {
      actor, ip, action: 'asignacion.revocar', entityType: 'asignacion', entityId: a.id, courseId: a.course_id,
      summary: `Asignación de «${a.title}» revocada; ${plural(withdrawn.length, 'inscripción retirada', 'inscripciones retiradas')}. El historial se conserva.`,
    });
    return { withdrawn: withdrawn.length };
  });
}

/**
 * Aplica a una persona las asignaciones vigentes de sus grupos y de su
 * empresa (cuando entra a un grupo o se le asigna una empresa).
 */
export async function applyStandingAssignments(db, { userId, now = new Date() }) {
  const pending = await many(
    db,
    `SELECT a.id, a.course_id, a.starts_at, a.due_at, c.title, c.kind, c.company_id, c.current_version_id, u.company_id AS user_company
       FROM aula_assignments a
       JOIN aula_courses c ON c.id = a.course_id AND c.deleted_at IS NULL AND c.status <> 'archivado'
       JOIN aula_users u ON u.id = $1 AND u.deleted_at IS NULL AND u.role = 'participant'
      WHERE a.revoked_at IS NULL
        AND (
          (a.target_type = 'grupo' AND a.group_id IN (
             SELECT group_id FROM aula_group_members WHERE user_id = $1 AND removed_at IS NULL))
          OR (a.target_type = 'empresa' AND a.company_id = u.company_id)
        )
        AND NOT EXISTS (
          SELECT 1 FROM aula_enrollments e WHERE e.course_id = a.course_id AND e.user_id = $1
        )
      ORDER BY a.created_at`,
    [userId],
  );
  let enrolled = 0;
  const seen = new Set();
  for (const a of pending) {
    if (seen.has(a.course_id)) continue;
    if (a.kind === 'empresa' && a.company_id !== a.user_company) continue;
    seen.add(a.course_id);
    const course = { id: a.course_id, title: a.title, current_version_id: a.current_version_id };
    const r = await enrollUsers(db, { course, userIds: [userId], assignmentId: a.id, startsAt: a.starts_at, dueAt: a.due_at, now });
    enrolled += r.created.length + r.reactivated.length;
  }
  return enrolled;
}

export async function withdrawEnrollment(db, { enrollmentId, actor, ip, reason = null, now = new Date() }) {
  const e = await one(
    db,
    `UPDATE aula_enrollments SET withdrawn_at = $2, withdrawn_by = $3
      WHERE id = $1 AND withdrawn_at IS NULL
      RETURNING id, course_id, user_id`,
    [enrollmentId, now, actor.id],
  );
  if (!e) throw conflict('Esa inscripción no existe o ya estaba retirada.');
  const info = await one(
    db,
    `SELECT c.title, c.company_id, u.email FROM aula_courses c, aula_users u WHERE c.id = $1 AND u.id = $2`,
    [e.course_id, e.user_id],
  );
  await audit(db, {
    actor, ip, action: 'inscripcion.retirar', entityType: 'inscripcion', entityId: e.id,
    courseId: e.course_id, companyId: info.company_id, reason,
    summary: `Inscripción de ${info.email} en «${info.title}» retirada. Su historial académico se conserva.`,
  });
  return e;
}

export async function reactivateEnrollment(db, { enrollmentId, actor, ip, now = new Date() }) {
  const e = await one(
    db,
    `UPDATE aula_enrollments SET withdrawn_at = NULL, withdrawn_by = NULL, assigned_at = $2
      WHERE id = $1 AND withdrawn_at IS NOT NULL
      RETURNING id, course_id, user_id`,
    [enrollmentId, now],
  );
  if (!e) throw conflict('Esa inscripción no existe o no estaba retirada.');
  const info = await one(db, 'SELECT c.title, c.company_id, u.email FROM aula_courses c, aula_users u WHERE c.id = $1 AND u.id = $2', [e.course_id, e.user_id]);
  await audit(db, {
    actor, ip, action: 'inscripcion.reactivar', entityType: 'inscripcion', entityId: e.id,
    courseId: e.course_id, companyId: info.company_id,
    summary: `${info.email} vuelve a tener acceso a «${info.title}» con su avance previo.`,
  });
  return e;
}
