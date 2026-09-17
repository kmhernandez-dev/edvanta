/**
 * Empresas (clientes privados del aula) y grupos o cohortes.
 */
import { many, one, whereBuilder } from './db.js';
import {
  badRequest, calendarDate, conflict, email as emailField, listJoin, notFound, oneOf,
  pageResult, paging, plural, sorting, str,
} from './http.js';
import { audit } from './audit.js';
import { applyStandingAssignments } from './enrollments.js';

// ── Empresas ────────────────────────────────────────────────

const has = (body, key) => Object.prototype.hasOwnProperty.call(body, key);

export function readCompany(body = {}, { partial = false } = {}) {
  const out = {};
  if (!partial || has(body, 'name')) out.name = str(body.name, 'name', 'El nombre de la empresa', { max: 120 });
  if (!partial || has(body, 'contactName')) out.contactName = str(body.contactName, 'contactName', 'El nombre de contacto', { max: 120, optional: true });
  if (!partial || has(body, 'contactEmail')) out.contactEmail = emailField(body.contactEmail, 'contactEmail', 'El correo de contacto', { optional: true });
  if (!partial || has(body, 'contactPhone')) out.contactPhone = str(body.contactPhone, 'contactPhone', 'El teléfono', { max: 40, optional: true });
  if (!partial || has(body, 'status')) out.status = oneOf(body.status ?? 'activa', 'status', 'El estado', ['activa', 'inactiva']);
  if (!partial || has(body, 'internalNotes')) out.internalNotes = str(body.internalNotes, 'internalNotes', 'Las observaciones', { max: 2000, optional: true });
  if (!partial || has(body, 'logoFileId')) {
    out.logoFileId = body.logoFileId === null || body.logoFileId === undefined || body.logoFileId === '' ? null : Number(body.logoFileId);
    if (out.logoFileId !== null && !(out.logoFileId > 0)) throw badRequest('El logotipo no es válido.', { field: 'logoFileId' });
  }
  return out;
}

const COMPANY_COLUMNS = {
  name: { name: 'name', contactName: 'contact_name', contactEmail: 'contact_email', contactPhone: 'contact_phone', status: 'status', internalNotes: 'internal_notes', logoFileId: 'logo_file_id' },
};

function companyRow(r) {
  return {
    id: r.id,
    name: r.name,
    logoFileId: r.logo_file_id,
    contactName: r.contact_name,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    status: r.status,
    internalNotes: r.internal_notes,
    isDemo: r.is_demo,
    participants: r.participants ?? undefined,
    groups: r.groups ?? undefined,
    courses: r.courses ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const COMPANY_STATS = `
  (SELECT count(*)::int FROM aula_users u WHERE u.company_id = co.id AND u.deleted_at IS NULL AND u.role = 'participant') AS participants,
  (SELECT count(*)::int FROM aula_groups g WHERE g.company_id = co.id AND g.deleted_at IS NULL) AS groups,
  (SELECT count(*)::int FROM aula_courses c WHERE c.company_id = co.id AND c.deleted_at IS NULL) AS courses`;

export async function listCompanies(db, query) {
  const pg = paging(query);
  const sort = sorting(query, { name: 'lower(co.name)', createdAt: 'co.created_at', participants: 'participants' }, 'name');
  const w = whereBuilder(['co.deleted_at IS NULL']);
  if (query.q?.trim()) {
    const p = w.param(`%${query.q.trim()}%`);
    w.and(`(co.name ILIKE ${p} OR co.contact_name ILIKE ${p} OR co.contact_email ILIKE ${p})`);
  }
  if (['activa', 'inactiva'].includes(query.status)) w.and(`co.status = ${w.param(query.status)}`);
  const total = (await one(db, `SELECT count(*)::int AS n FROM aula_companies co ${w.sql}`, w.params)).n;
  const dir = sort.key === 'name' && !query.dir ? 'ASC' : sort.dir;
  const rows = await many(
    db,
    `SELECT co.*, ${COMPANY_STATS} FROM aula_companies co ${w.sql}
      ORDER BY ${sort.column} ${dir}, co.id LIMIT ${pg.size} OFFSET ${pg.offset}`,
    w.params,
  );
  return pageResult(rows.map(companyRow), total, pg);
}

export async function getCompany(db, id) {
  const row = await one(db, `SELECT co.*, ${COMPANY_STATS} FROM aula_companies co WHERE co.id = $1 AND co.deleted_at IS NULL`, [id]);
  if (!row) throw notFound('No encontramos esa empresa.');
  return companyRow(row);
}

async function assertLogo(db, fileId) {
  if (!fileId) return;
  const f = await one(db, "SELECT id FROM aula_files WHERE id = $1 AND purpose = 'logo' AND status = 'listo' AND deleted_at IS NULL", [fileId]);
  if (!f) throw badRequest('El logotipo no terminó de subirse o no es una imagen válida.', { field: 'logoFileId' });
}

export async function createCompany(db, input, { actor, ip }) {
  await assertLogo(db, input.logoFileId);
  const row = await one(
    db,
    `INSERT INTO aula_companies (name, contact_name, contact_email, contact_phone, status, internal_notes, logo_file_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [input.name, input.contactName, input.contactEmail, input.contactPhone, input.status, input.internalNotes, input.logoFileId],
  ).catch((err) => {
    if (err.code === '23505') throw conflict(`Ya existe una empresa llamada «${input.name}».`, { field: 'name' });
    throw err;
  });
  await audit(db, {
    actor, ip, action: 'empresa.crear', entityType: 'empresa', entityId: row.id, companyId: row.id,
    summary: `Empresa «${row.name}» creada.`, after: companyRow(row),
  });
  return companyRow(row);
}

export async function updateCompany(db, id, input, { actor, ip }) {
  const before = await one(db, 'SELECT * FROM aula_companies WHERE id = $1 AND deleted_at IS NULL', [id]);
  if (!before) throw notFound('No encontramos esa empresa.');
  if ('logoFileId' in input) await assertLogo(db, input.logoFileId);
  const sets = [];
  const params = [id];
  for (const [key, column] of Object.entries(COMPANY_COLUMNS.name)) {
    if (key in input) {
      params.push(input[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }
  if (!sets.length) return companyRow(before);
  const row = await one(db, `UPDATE aula_companies SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params).catch((err) => {
    if (err.code === '23505') throw conflict(`Ya existe una empresa llamada «${input.name}».`, { field: 'name' });
    throw err;
  });
  await audit(db, {
    actor, ip, action: 'empresa.editar', entityType: 'empresa', entityId: id, companyId: id,
    summary: `Empresa «${row.name}» editada.`, before: companyRow(before), after: companyRow(row),
  });
  return companyRow(row);
}

export async function deleteCompany(db, id, { actor, ip }) {
  const c = await getCompany(db, id);
  if (c.participants || c.groups || c.courses) {
    throw conflict(
      `«${c.name}» tiene ${listJoin([
        c.participants && plural(c.participants, 'participante'),
        c.groups && plural(c.groups, 'grupo'),
        c.courses && plural(c.courses, 'curso privado', 'cursos privados'),
      ].filter(Boolean))}. Para conservar su historial, márcala como inactiva en lugar de eliminarla.`,
    );
  }
  await db.query('UPDATE aula_companies SET deleted_at = NOW() WHERE id = $1', [id]);
  await audit(db, {
    actor, ip, action: 'empresa.eliminar', entityType: 'empresa', entityId: id, companyId: id,
    summary: `Empresa «${c.name}» eliminada.`, before: c,
  });
}

// ── Grupos ──────────────────────────────────────────────────

// Texto AAAA-MM-DD: el orden alfabético coincide con el cronológico.
function checkGroupDates(startsOn, endsOn) {
  if (startsOn && endsOn && endsOn < startsOn) {
    throw badRequest('La fecha de cierre no puede ser anterior a la de inicio.', { field: 'endsOn' });
  }
}

export function readGroup(body = {}, { partial = false } = {}) {
  const out = {};
  if (!partial || has(body, 'name')) out.name = str(body.name, 'name', 'El nombre del grupo', { max: 120 });
  if (!partial || has(body, 'companyId')) {
    out.companyId = body.companyId === null || body.companyId === undefined || body.companyId === '' ? null : Number(body.companyId);
    if (out.companyId !== null && !(out.companyId > 0)) throw badRequest('La empresa no es válida.', { field: 'companyId' });
  }
  if (!partial || has(body, 'description')) out.description = str(body.description, 'description', 'La descripción', { max: 1000, optional: true });
  if (!partial || has(body, 'status')) out.status = oneOf(body.status ?? 'activo', 'status', 'El estado', ['activo', 'cerrado']);
  if (!partial || has(body, 'startsOn')) out.startsOn = calendarDate(body.startsOn, 'startsOn', 'La fecha de inicio', { optional: true });
  if (!partial || has(body, 'endsOn')) out.endsOn = calendarDate(body.endsOn, 'endsOn', 'La fecha de cierre', { optional: true });
  checkGroupDates(out.startsOn, out.endsOn);
  return out;
}

function groupRow(r) {
  return {
    id: r.id,
    name: r.name,
    companyId: r.company_id,
    companyName: r.company_name ?? null,
    description: r.description,
    status: r.status,
    startsOn: r.starts_on,
    endsOn: r.ends_on,
    members: r.members ?? undefined,
    courses: r.courses ?? undefined,
    isDemo: r.is_demo,
    createdAt: r.created_at,
  };
}

const GROUP_SELECT = `
  SELECT g.*, co.name AS company_name,
    (SELECT count(*)::int FROM aula_group_members m JOIN aula_users u ON u.id = m.user_id
      WHERE m.group_id = g.id AND m.removed_at IS NULL AND u.deleted_at IS NULL) AS members,
    (SELECT count(*)::int FROM aula_assignments a WHERE a.group_id = g.id AND a.revoked_at IS NULL) AS courses
  FROM aula_groups g
  LEFT JOIN aula_companies co ON co.id = g.company_id`;

export async function listGroups(db, query) {
  const pg = paging(query);
  const sort = sorting(query, {
    name: 'lower(g.name)', company: 'lower(co.name)', members: 'members', createdAt: 'g.created_at',
  }, 'createdAt');
  const w = whereBuilder(['g.deleted_at IS NULL']);
  if (query.q?.trim()) {
    const p = w.param(`%${query.q.trim()}%`);
    w.and(`(g.name ILIKE ${p} OR co.name ILIKE ${p})`);
  }
  if (Number(query.companyId) > 0) w.and(`g.company_id = ${w.param(Number(query.companyId))}`);
  if (['activo', 'cerrado'].includes(query.status)) w.and(`g.status = ${w.param(query.status)}`);
  const total = (await one(db, `SELECT count(*)::int AS n FROM aula_groups g LEFT JOIN aula_companies co ON co.id = g.company_id ${w.sql}`, w.params)).n;
  const rows = await many(db, `${GROUP_SELECT} ${w.sql} ORDER BY ${sort.column} ${sort.dir} NULLS LAST, g.id LIMIT ${pg.size} OFFSET ${pg.offset}`, w.params);
  return pageResult(rows.map(groupRow), total, pg);
}

export async function getGroup(db, id) {
  const row = await one(db, `${GROUP_SELECT} WHERE g.id = $1 AND g.deleted_at IS NULL`, [id]);
  if (!row) throw notFound('No encontramos ese grupo.');
  return groupRow(row);
}

async function assertCompany(db, companyId) {
  if (!companyId) return null;
  const c = await one(db, 'SELECT id, name FROM aula_companies WHERE id = $1 AND deleted_at IS NULL', [companyId]);
  if (!c) throw badRequest('La empresa seleccionada no existe.', { field: 'companyId' });
  return c;
}

const groupConflict = (name) => (err) => {
  if (err.code === '23505') throw conflict(`Ya existe un grupo llamado «${name}» en esa empresa.`, { field: 'name' });
  throw err;
};

export async function createGroup(db, input, { actor, ip }) {
  await assertCompany(db, input.companyId);
  const row = await one(
    db,
    `INSERT INTO aula_groups (company_id, name, description, status, starts_on, ends_on)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [input.companyId, input.name, input.description, input.status, input.startsOn, input.endsOn],
  ).catch(groupConflict(input.name));
  const group = await getGroup(db, row.id);
  await audit(db, {
    actor, ip, action: 'grupo.crear', entityType: 'grupo', entityId: group.id, companyId: group.companyId,
    summary: `Grupo «${group.name}» creado${group.companyName ? ` en ${group.companyName}` : ''}.`, after: group,
  });
  return group;
}

export async function updateGroup(db, id, input, opts) {
  return db.tx((tx) => updateGroupTx(tx, id, input, opts));
}

async function updateGroupTx(db, id, input, { actor, ip }) {
  const before = await getGroup(db, id);
  if ('companyId' in input && input.companyId !== before.companyId) {
    if (before.members || before.courses) {
      throw conflict('No se puede cambiar la empresa de un grupo con miembros o cursos asignados. Crea un grupo nuevo.');
    }
    await assertCompany(db, input.companyId);
  }
  checkGroupDates(
    'startsOn' in input ? input.startsOn : before.startsOn,
    'endsOn' in input ? input.endsOn : before.endsOn,
  );
  const map = { name: 'name', companyId: 'company_id', description: 'description', status: 'status', startsOn: 'starts_on', endsOn: 'ends_on' };
  const sets = [];
  const params = [id];
  for (const [key, column] of Object.entries(map)) {
    if (key in input) {
      params.push(input[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }
  if (sets.length) await db.query(`UPDATE aula_groups SET ${sets.join(', ')} WHERE id = $1`, params).catch(groupConflict(input.name));
  const after = await getGroup(db, id);
  await audit(db, {
    actor, ip, action: 'grupo.editar', entityType: 'grupo', entityId: id, companyId: after.companyId,
    summary: `Grupo «${after.name}» editado.`, before, after,
  });
  return after;
}

export async function deleteGroup(db, id, { actor, ip }) {
  const g = await getGroup(db, id);
  if (g.courses) {
    throw conflict(`«${g.name}» tiene ${plural(g.courses, 'curso asignado', 'cursos asignados')}. Revoca las asignaciones o cierra el grupo para conservar el historial.`);
  }
  await db.query('UPDATE aula_groups SET deleted_at = NOW() WHERE id = $1', [id]);
  await db.query('UPDATE aula_group_members SET removed_at = NOW() WHERE group_id = $1 AND removed_at IS NULL', [id]);
  await audit(db, {
    actor, ip, action: 'grupo.eliminar', entityType: 'grupo', entityId: id, companyId: g.companyId,
    summary: `Grupo «${g.name}» eliminado (${plural(g.members, 'miembro desvinculado', 'miembros desvinculados')}).`, before: g,
  });
}

export async function listGroupMembers(db, groupId) {
  return many(
    db,
    `SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.job_title, m.added_at
       FROM aula_group_members m JOIN aula_users u ON u.id = m.user_id
      WHERE m.group_id = $1 AND m.removed_at IS NULL AND u.deleted_at IS NULL
      ORDER BY lower(u.last_name), lower(u.first_name)`,
    [groupId],
  );
}

/**
 * Agrega personas a un grupo y les aplica los cursos ya asignados al grupo.
 * Solo acepta participantes de la misma empresa del grupo.
 */
export async function addGroupMembers(db, groupId, userIds, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const group = await getGroup(tx, groupId);
    if (group.status === 'cerrado') throw conflict('Este grupo está cerrado. Reábrelo para agregar personas.');
    const users = await many(
      tx,
      "SELECT id, email, company_id, role FROM aula_users WHERE id = ANY($1::bigint[]) AND deleted_at IS NULL",
      [userIds],
    );
    if (users.length !== userIds.length) throw badRequest('Alguna de las personas seleccionadas ya no existe.');
    const wrong = users.filter((u) => u.role !== 'participant' || (group.companyId && u.company_id !== group.companyId));
    if (wrong.length) {
      throw badRequest(`${wrong.map((u) => u.email).join(', ')} no ${wrong.length === 1 ? 'pertenece' : 'pertenecen'} a ${group.companyName || 'este grupo'} o no ${wrong.length === 1 ? 'es participante' : 'son participantes'}.`);
    }
    const added = await many(
      tx,
      `INSERT INTO aula_group_members (group_id, user_id, added_at, added_by)
       SELECT $1, uid, $2, $3 FROM unnest($4::bigint[]) AS uid
       ON CONFLICT (group_id, user_id) DO UPDATE SET removed_at = NULL, added_at = EXCLUDED.added_at, added_by = EXCLUDED.added_by
         WHERE aula_group_members.removed_at IS NOT NULL
       RETURNING user_id`,
      [groupId, now, actor.id, userIds],
    );
    let enrolled = 0;
    for (const { user_id: userId } of added) enrolled += await applyStandingAssignments(tx, { userId, now });
    if (added.length) {
      await audit(tx, {
        actor, ip, action: 'grupo.miembros', entityType: 'grupo', entityId: groupId, companyId: group.companyId,
        summary: `${plural(added.length, 'persona agregada', 'personas agregadas')} a «${group.name}»${enrolled ? `; ${plural(enrolled, 'inscripción nueva', 'inscripciones nuevas')} por los cursos del grupo` : ''}.`,
        after: { added: added.map((a) => a.user_id) },
      });
    }
    return { added: added.length, alreadyMembers: userIds.length - added.length, enrolled };
  });
}

/**
 * Quita a una persona del grupo. Su historial se conserva; si
 * `withdrawCourses`, también se retira de los cursos que recibió por el grupo.
 */
export async function removeGroupMember(db, groupId, userId, { withdrawCourses = false, actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const group = await getGroup(tx, groupId);
    const row = await one(
      tx,
      `UPDATE aula_group_members SET removed_at = $3 WHERE group_id = $1 AND user_id = $2 AND removed_at IS NULL RETURNING user_id`,
      [groupId, userId, now],
    );
    if (!row) throw notFound('Esa persona no está en el grupo.');
    let withdrawn = 0;
    if (withdrawCourses) {
      const rows = await many(
        tx,
        `UPDATE aula_enrollments e SET withdrawn_at = $3, withdrawn_by = $4
          FROM aula_assignments a
         WHERE e.assignment_id = a.id AND a.group_id = $1 AND e.user_id = $2 AND e.withdrawn_at IS NULL
         RETURNING e.id`,
        [groupId, userId, now, actor.id],
      );
      withdrawn = rows.length;
    }
    const u = await one(tx, 'SELECT email FROM aula_users WHERE id = $1', [userId]);
    await audit(tx, {
      actor, ip, action: 'grupo.miembros', entityType: 'grupo', entityId: groupId, companyId: group.companyId,
      summary: `${u.email} salió de «${group.name}»${withdrawn ? ` y de ${plural(withdrawn, 'curso')}` : ''}. Su historial se conserva.`,
      before: { userId },
    });
    return { withdrawn };
  });
}

// ── Listas cortas para selectores ──────────────────────────

export async function companyOptions(db) {
  return many(db, "SELECT id AS value, name AS label, status FROM aula_companies WHERE deleted_at IS NULL ORDER BY lower(name)");
}

export async function groupOptions(db, companyId) {
  const w = whereBuilder(['g.deleted_at IS NULL']);
  if (companyId === 'none') w.and('g.company_id IS NULL');
  else if (Number(companyId) > 0) w.and(`g.company_id = ${w.param(Number(companyId))}`);
  return many(
    db,
    `SELECT g.id AS value, g.name AS label, g.company_id, g.status, co.name AS company_name
       FROM aula_groups g LEFT JOIN aula_companies co ON co.id = g.company_id
      ${w.sql} ORDER BY lower(co.name) NULLS FIRST, lower(g.name)`,
    w.params,
  );
}
