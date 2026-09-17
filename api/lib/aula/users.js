/**
 * Participantes y administradores: alta manual, edición, suspensión,
 * baja, invitaciones e importación por CSV.
 */
import { many, one, whereBuilder } from './db.js';
import {
  badRequest, conflict, email as emailField, forbidden, notFound, oneOf, pageResult, paging, plural, sorting, str,
} from './http.js';
import { audit } from './audit.js';
import { issueAuthToken, publicUser, revokeUserSessions, USER_FIELDS } from './accounts.js';
import { accessLink, inviteEmail } from './emails.js';
import { applyStandingAssignments } from './enrollments.js';

const has = (body, key) => Object.prototype.hasOwnProperty.call(body, key);
const MAX_IMPORT_ROWS = 2000;

export function readUser(body = {}, { partial = false } = {}) {
  const out = {};
  if (!partial || has(body, 'firstName')) out.firstName = str(body.firstName, 'firstName', 'El nombre', { max: 80 });
  if (!partial || has(body, 'lastName')) out.lastName = str(body.lastName, 'lastName', 'El apellido', { max: 80, optional: true }) || '';
  if (!partial || has(body, 'email')) out.email = emailField(body.email);
  if (!partial || has(body, 'jobTitle')) out.jobTitle = str(body.jobTitle, 'jobTitle', 'El cargo', { max: 120, optional: true });
  if (!partial || has(body, 'role')) out.role = oneOf(body.role ?? 'participant', 'role', 'El rol', ['participant', 'admin']);
  if (!partial || has(body, 'companyId')) {
    out.companyId = body.companyId === null || body.companyId === undefined || body.companyId === '' ? null : Number(body.companyId);
    if (out.companyId !== null && !(out.companyId > 0)) throw badRequest('La empresa no es válida.', { field: 'companyId' });
  }
  return out;
}

function userRow(r) {
  return {
    ...publicUser(r),
    companyName: r.company_name ?? null,
    groups: r.groups ?? [],
    enrollments: r.enrollments ?? 0,
    hasPassword: r.has_password ?? undefined,
  };
}

const USER_SELECT = `
  SELECT ${USER_FIELDS}, co.name AS company_name, (u.password_hash IS NOT NULL) AS has_password,
    COALESCE((
      SELECT json_agg(json_build_object('id', g.id, 'name', g.name) ORDER BY g.name)
        FROM aula_group_members m JOIN aula_groups g ON g.id = m.group_id AND g.deleted_at IS NULL
       WHERE m.user_id = u.id AND m.removed_at IS NULL
    ), '[]'::json) AS groups,
    (SELECT count(*)::int FROM aula_enrollments e WHERE e.user_id = u.id AND e.withdrawn_at IS NULL) AS enrollments
  FROM aula_users u
  LEFT JOIN aula_companies co ON co.id = u.company_id`;

export async function listUsers(db, query) {
  const pg = paging(query);
  const sort = sorting(query, {
    name: 'lower(u.last_name), lower(u.first_name)',
    email: 'u.email',
    company: 'lower(co.name)',
    status: 'u.status',
    lastLogin: 'u.last_login_at',
    createdAt: 'u.created_at',
  }, 'name');
  const w = whereBuilder(['u.deleted_at IS NULL']);
  if (query.q?.trim()) {
    const p = w.param(`%${query.q.trim()}%`);
    w.and(`(u.first_name ILIKE ${p} OR u.last_name ILIKE ${p} OR u.email ILIKE ${p} OR (u.first_name || ' ' || u.last_name) ILIKE ${p})`);
  }
  if (['participant', 'admin'].includes(query.role)) w.and(`u.role = ${w.param(query.role)}`);
  if (['invited', 'active', 'suspended'].includes(query.status)) w.and(`u.status = ${w.param(query.status)}`);
  if (query.companyId === 'none') w.and('u.company_id IS NULL');
  else if (Number(query.companyId) > 0) w.and(`u.company_id = ${w.param(Number(query.companyId))}`);
  if (Number(query.groupId) > 0) {
    w.and(`EXISTS (SELECT 1 FROM aula_group_members m WHERE m.user_id = u.id AND m.removed_at IS NULL AND m.group_id = ${w.param(Number(query.groupId))})`);
  }
  if (Number(query.notInGroup) > 0) {
    w.and(`NOT EXISTS (SELECT 1 FROM aula_group_members m WHERE m.user_id = u.id AND m.removed_at IS NULL AND m.group_id = ${w.param(Number(query.notInGroup))})`);
  }
  const total = (await one(db, `SELECT count(*)::int AS n FROM aula_users u LEFT JOIN aula_companies co ON co.id = u.company_id ${w.sql}`, w.params)).n;
  const dir = sort.key === 'name' && !query.dir ? 'ASC' : sort.dir;
  const orderBy = sort.column.split(',').map((c) => `${c.trim()} ${dir} NULLS LAST`).join(', ');
  const rows = await many(db, `${USER_SELECT} ${w.sql} ORDER BY ${orderBy}, u.id LIMIT ${pg.size} OFFSET ${pg.offset}`, w.params);
  return pageResult(rows.map(userRow), total, pg);
}

export async function getUser(db, id) {
  const row = await one(db, `${USER_SELECT} WHERE u.id = $1 AND u.deleted_at IS NULL`, [id]);
  if (!row) throw notFound('No encontramos a esa persona.');
  return userRow(row);
}

async function assertCompany(db, companyId) {
  if (!companyId) return;
  const c = await one(db, 'SELECT id FROM aula_companies WHERE id = $1 AND deleted_at IS NULL', [companyId]);
  if (!c) throw badRequest('La empresa seleccionada no existe.', { field: 'companyId' });
}

const emailTaken = (email) => (err) => {
  if (err.code === '23505') throw conflict(`Ya hay una cuenta con el correo ${email}.`, { field: 'email' });
  throw err;
};

async function sendInvite(db, user, { actor, mailer, siteUrl, now }) {
  const token = await issueAuthToken(db, user.id, 'invite', { createdBy: actor?.id ?? null, now });
  const message = inviteEmail({ firstName: user.first_name ?? user.firstName, link: accessLink(siteUrl, token), invitedBy: 'Edvanta' });
  return { token, message, to: user.email };
}

/** Envía correos ya preparados; nunca lanza (el alta no depende del correo). */
async function deliver(mailer, prepared) {
  let sent = 0;
  for (const p of prepared) {
    try {
      if (await mailer.send({ to: p.to, subject: p.message.subject, html: p.message.html })) sent += 1;
    } catch (err) {
      console.error(JSON.stringify({ level: 'error', ns: 'aula', msg: 'Falló el envío de invitación', to: p.to, error: err.message }));
    }
  }
  return sent;
}

export async function createUser(db, input, { groupIds = [], invite = true, actor, ip, mailer, siteUrl, now = new Date() }) {
  if (input.role === 'admin' && input.companyId) {
    throw badRequest('Los administradores de Edvanta no se asocian a una empresa cliente.', { field: 'companyId' });
  }
  if (input.role === 'admin' && groupIds.length) {
    throw badRequest('Los administradores no forman parte de grupos de participantes.');
  }
  const prepared = [];
  const user = await db.tx(async (tx) => {
    await assertCompany(tx, input.companyId);
    const row = await one(
      tx,
      `INSERT INTO aula_users (email, first_name, last_name, role, status, company_id, job_title, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'invited', $5, $6, $7, $7) RETURNING *`,
      [input.email, input.firstName, input.lastName, input.role, input.companyId, input.jobTitle, now],
    ).catch(emailTaken(input.email));

    if (groupIds.length) {
      const groups = await many(tx, 'SELECT id, company_id FROM aula_groups WHERE id = ANY($1::bigint[]) AND deleted_at IS NULL', [groupIds]);
      if (groups.length !== groupIds.length) throw badRequest('Algún grupo seleccionado ya no existe.', { field: 'groupIds' });
      if (groups.some((g) => g.company_id && g.company_id !== input.companyId)) {
        throw badRequest('Los grupos deben ser de la misma empresa de la persona.', { field: 'groupIds' });
      }
      await tx.query(
        `INSERT INTO aula_group_members (group_id, user_id, added_at, added_by)
         SELECT gid, $1, $2, $3 FROM unnest($4::bigint[]) AS gid`,
        [row.id, now, actor.id, groupIds],
      );
    }
    const enrolled = await applyStandingAssignments(tx, { userId: row.id, now });
    if (invite) prepared.push(await sendInvite(tx, row, { actor, mailer, siteUrl, now }));
    await audit(tx, {
      actor, ip, action: 'usuario.crear', entityType: 'usuario', entityId: row.id, companyId: row.company_id,
      summary: `Cuenta de ${row.role === 'admin' ? 'administración' : 'participante'} creada para ${row.email}${enrolled ? `, con ${plural(enrolled, 'inscripción', 'inscripciones')} por sus grupos o su empresa` : ''}.`,
      after: { email: row.email, role: row.role, companyId: row.company_id, groupIds },
    });
    return row;
  });
  const sent = await deliver(mailer, prepared);
  return { user: await getUser(db, user.id), invitationSent: invite ? sent === 1 : null };
}

async function adminCount(db) {
  return (await one(db, "SELECT count(*)::int AS n FROM aula_users WHERE role = 'admin' AND deleted_at IS NULL AND status <> 'suspended'")).n;
}

export async function updateUser(db, id, input, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const before = await one(tx, `SELECT ${USER_FIELDS} FROM aula_users u WHERE u.id = $1 AND u.deleted_at IS NULL FOR UPDATE`, [id]);
    if (!before) throw notFound('No encontramos a esa persona.');
    const nextRole = input.role ?? before.role;
    if (before.role === 'admin' && nextRole !== 'admin') {
      if (id === actor.id) throw forbidden('No puedes quitarte a ti mismo el rol de administrador.');
      if (await adminCount(tx) <= 1) throw conflict('Debe quedar al menos un administrador activo.');
    }
    const nextCompany = 'companyId' in input ? input.companyId : before.company_id;
    if (nextRole === 'admin' && nextCompany) {
      throw badRequest('Los administradores de Edvanta no se asocian a una empresa cliente.', { field: 'companyId' });
    }
    if ('companyId' in input) await assertCompany(tx, input.companyId);

    const map = { firstName: 'first_name', lastName: 'last_name', email: 'email', jobTitle: 'job_title', role: 'role', companyId: 'company_id' };
    const sets = [];
    const params = [id];
    for (const [key, column] of Object.entries(map)) {
      if (key in input) {
        params.push(input[key]);
        sets.push(`${column} = $${params.length}`);
      }
    }
    if (sets.length) await tx.query(`UPDATE aula_users SET ${sets.join(', ')} WHERE id = $1`, params).catch(emailTaken(input.email));

    // Si cambió de empresa, deja los grupos de la anterior (el historial se conserva).
    if ('companyId' in input && input.companyId !== before.company_id) {
      await tx.query(
        `UPDATE aula_group_members m SET removed_at = $2
           FROM aula_groups g
          WHERE m.group_id = g.id AND m.user_id = $1 AND m.removed_at IS NULL
            AND g.company_id IS DISTINCT FROM $3::bigint`,
        [id, now, input.companyId],
      );
    }
    if (nextRole === 'admin') {
      await tx.query('UPDATE aula_group_members SET removed_at = $2 WHERE user_id = $1 AND removed_at IS NULL', [id, now]);
    }
    const enrolled = nextRole === 'participant' ? await applyStandingAssignments(tx, { userId: id, now }) : 0;

    const after = await one(tx, `SELECT ${USER_FIELDS} FROM aula_users u WHERE u.id = $1`, [id]);
    const roleChanged = before.role !== after.role;
    await audit(tx, {
      actor, ip, action: roleChanged ? 'usuario.rol' : 'usuario.editar', entityType: 'usuario', entityId: id,
      companyId: after.company_id,
      summary: roleChanged
        ? `${after.email} ahora es ${after.role === 'admin' ? 'administrador' : 'participante'}.`
        : `Datos de ${after.email} actualizados${enrolled ? `; ${plural(enrolled, 'inscripción nueva', 'inscripciones nuevas')} por su empresa` : ''}.`,
      before: publicUser(before), after: publicUser(after),
    });
    return getUser(tx, id);
  });
}

export async function setUserStatus(db, id, status, { actor, ip, reason = null, now = new Date() }) {
  return db.tx(async (tx) => {
    const u = await one(tx, 'SELECT id, email, role, status, company_id, password_hash FROM aula_users WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [id]);
    if (!u) throw notFound('No encontramos a esa persona.');
    if (status === 'suspended') {
      if (u.status === 'suspended') throw conflict('La cuenta ya estaba suspendida.');
      if (id === actor.id) throw forbidden('No puedes suspender tu propia cuenta.');
      if (u.role === 'admin' && await adminCount(tx) <= 1) throw conflict('Debe quedar al menos un administrador activo.');
      await tx.query("UPDATE aula_users SET status = 'suspended' WHERE id = $1", [id]);
      await revokeUserSessions(tx, id, { now });
    } else {
      if (u.status !== 'suspended') throw conflict('La cuenta no está suspendida.');
      // Sin contraseña creada, vuelve a quedar pendiente de invitación.
      await tx.query('UPDATE aula_users SET status = $2 WHERE id = $1', [id, u.password_hash ? 'active' : 'invited']);
    }
    await audit(tx, {
      actor, ip, reason,
      action: status === 'suspended' ? 'usuario.suspender' : 'usuario.reactivar',
      entityType: 'usuario', entityId: id, companyId: u.company_id,
      summary: status === 'suspended'
        ? `Cuenta de ${u.email} suspendida; sus sesiones se cerraron.`
        : `Cuenta de ${u.email} reactivada.`,
    });
    return getUser(tx, id);
  });
}

export async function deleteUser(db, id, { actor, ip, reason = null, now = new Date() }) {
  return db.tx(async (tx) => {
    const u = await one(tx, 'SELECT id, email, role, company_id FROM aula_users WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [id]);
    if (!u) throw notFound('No encontramos a esa persona.');
    if (id === actor.id) throw forbidden('No puedes eliminar tu propia cuenta.');
    if (u.role === 'admin' && await adminCount(tx) <= 1) throw conflict('Debe quedar al menos un administrador activo.');
    const history = (await one(tx, 'SELECT count(*)::int AS n FROM aula_enrollments WHERE user_id = $1', [id])).n;
    await tx.query("UPDATE aula_users SET deleted_at = $2, status = 'suspended' WHERE id = $1", [id, now]);
    await tx.query('UPDATE aula_group_members SET removed_at = $2 WHERE user_id = $1 AND removed_at IS NULL', [id, now]);
    await tx.query('UPDATE aula_enrollments SET withdrawn_at = $2, withdrawn_by = $3 WHERE user_id = $1 AND withdrawn_at IS NULL', [id, now, actor.id]);
    await revokeUserSessions(tx, id, { now });
    await audit(tx, {
      actor, ip, reason, action: 'usuario.eliminar', entityType: 'usuario', entityId: id, companyId: u.company_id,
      summary: `Cuenta de ${u.email} eliminada. ${history ? `Se conserva${history === 1 ? '' : 'n'} ${plural(history, 'inscripción', 'inscripciones')} para los reportes.` : ''}`.trim(),
    });
  });
}

export async function inviteUser(db, id, { actor, ip, mailer, siteUrl, now = new Date() }) {
  const u = await one(db, 'SELECT id, email, first_name, status, company_id FROM aula_users WHERE id = $1 AND deleted_at IS NULL', [id]);
  if (!u) throw notFound('No encontramos a esa persona.');
  if (u.status === 'suspended') throw conflict('La cuenta está suspendida. Reactívala antes de invitar.');
  if (u.status === 'active') throw conflict('Esta persona ya activó su cuenta. Si olvidó la contraseña, puede restablecerla desde la pantalla de acceso.');
  const prepared = await sendInvite(db, u, { actor, mailer, siteUrl, now });
  await audit(db, {
    actor, ip, action: 'usuario.invitar', entityType: 'usuario', entityId: id, companyId: u.company_id,
    summary: `Invitación enviada a ${u.email}.`,
  });
  const sent = await deliver(mailer, [prepared]);
  if (!sent) {
    throw conflict('La invitación quedó lista, pero el correo no se pudo enviar. Verifica la configuración de correo e intenta de nuevo.');
  }
  return { sent: true };
}

// ── Importación por CSV ─────────────────────────────────────

const clean = (v) => (typeof v === 'string' ? v.trim() : v === undefined || v === null ? '' : String(v).trim());
const key = (s) => clean(s).toLowerCase().replace(/\s+/g, ' ');

/**
 * Valida (y si no es simulación, aplica) una importación. Cada fila
 * recibe un estado: nuevo, existente (con acciones) u omitida (con errores).
 * Las filas con errores nunca bloquean a las demás.
 */
export async function importUsers(db, {
  rows, createCompanies = false, createGroups = false, sendInvites = true, dryRun = true,
  actor, ip, mailer, siteUrl, now = new Date(),
}) {
  if (!Array.isArray(rows) || rows.length === 0) throw badRequest('El archivo no tiene filas para importar.');
  if (rows.length > MAX_IMPORT_ROWS) throw badRequest(`El archivo tiene ${rows.length} filas; el máximo por importación es ${MAX_IMPORT_ROWS}.`);

  const companies = await many(db, 'SELECT id, name FROM aula_companies WHERE deleted_at IS NULL');
  const companyByName = new Map(companies.map((c) => [key(c.name), c]));
  const groups = await many(db, 'SELECT id, name, company_id FROM aula_groups WHERE deleted_at IS NULL');
  const groupByKey = new Map(groups.map((g) => [`${g.company_id ?? 0}|${key(g.name)}`, g]));
  const emails = rows.map((r) => clean(r.email).toLowerCase()).filter(Boolean);
  const existing = await many(
    db,
    `SELECT u.id, u.email, u.company_id, u.role,
            ARRAY(SELECT group_id FROM aula_group_members m WHERE m.user_id = u.id AND m.removed_at IS NULL) AS group_ids
       FROM aula_users u WHERE u.email = ANY($1::text[]) AND u.deleted_at IS NULL`,
    [emails],
  );
  const existingByEmail = new Map(existing.map((u) => [u.email, u]));

  const seen = new Map();
  const newCompanies = new Set();
  const newGroups = new Map();
  const report = rows.map((raw, index) => {
    const line = index + 2; // la fila 1 es el encabezado
    const errors = [];
    const warnings = [];
    const actions = [];
    const firstName = clean(raw.firstName);
    const lastName = clean(raw.lastName);
    const mail = clean(raw.email).toLowerCase();
    const companyName = clean(raw.company);
    const groupName = clean(raw.group);
    const jobTitle = clean(raw.jobTitle);

    if (!firstName) errors.push('Falta el nombre.');
    else if (firstName.length > 80) errors.push('El nombre supera 80 caracteres.');
    if (lastName.length > 80) errors.push('El apellido supera 80 caracteres.');
    if (jobTitle.length > 120) errors.push('El cargo supera 120 caracteres.');
    if (!mail) errors.push('Falta el correo.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) || mail.length > 254) errors.push(`El correo «${clean(raw.email)}» no es válido.`);
    else if (seen.has(mail)) errors.push(`El correo se repite en la fila ${seen.get(mail)}.`);
    if (mail && !seen.has(mail)) seen.set(mail, line);

    let company = null;
    if (companyName) {
      company = companyByName.get(key(companyName)) || null;
      if (!company) {
        if (createCompanies) {
          newCompanies.add(key(companyName));
          actions.push(`Crear la empresa «${companyName}»`);
          company = { id: null, name: companyName, pending: true };
        } else {
          errors.push(`La empresa «${companyName}» no existe. Créala primero o activa «Crear empresas que no existan».`);
        }
      }
    }

    let group = null;
    if (groupName) {
      const gKey = `${company?.id ?? (company?.pending ? `nueva:${key(company.name)}` : 0)}|${key(groupName)}`;
      group = company?.pending ? null : groupByKey.get(`${company?.id ?? 0}|${key(groupName)}`) || null;
      if (!group) {
        if (createGroups) {
          if (!newGroups.has(gKey)) newGroups.set(gKey, { name: groupName, companyKey: company ? key(company.name) : null });
          actions.push(`Crear el grupo «${groupName}»`);
          group = { id: null, key: gKey, pending: true };
        } else {
          errors.push(`El grupo «${groupName}» no existe${company ? ` en ${company.name}` : ''}. Créalo primero o activa «Crear grupos que no existan».`);
        }
      }
    }

    const current = mail ? existingByEmail.get(mail) : null;
    let status = 'nuevo';
    if (current) {
      status = 'existente';
      if (current.role !== 'participant') {
        errors.push('Ese correo pertenece a un administrador.');
      } else {
        const otherCompany = company && (company.pending || current.company_id !== company.id);
        if (otherCompany) warnings.push('Ya existe con otra empresa; no se cambió su empresa.');
        if (group && (group.pending || !current.group_ids.includes(group.id))) {
          if (otherCompany) {
            errors.push('No se puede agregar al grupo porque la persona pertenece a otra empresa.');
          } else {
            actions.push(`Agregar al grupo «${groupName}»`);
          }
        } else if (!group) {
          warnings.push('La cuenta ya existe; no hay cambios.');
        } else {
          warnings.push('Ya está en ese grupo; no hay cambios.');
        }
      }
    } else if (!errors.length) {
      actions.unshift('Crear cuenta');
      if (sendInvites) actions.push('Enviar invitación');
    }

    return {
      line, email: mail, name: `${firstName} ${lastName}`.trim(), company: companyName || null, group: groupName || null,
      status: errors.length ? 'omitida' : status, errors, warnings, actions,
      _data: { firstName, lastName, mail, jobTitle, company, group, current },
    };
  });

  const summary = {
    total: report.length,
    nuevos: report.filter((r) => r.status === 'nuevo').length,
    existentes: report.filter((r) => r.status === 'existente').length,
    omitidas: report.filter((r) => r.status === 'omitida').length,
    empresasNuevas: newCompanies.size,
    gruposNuevos: newGroups.size,
  };
  const publicRows = report.map(({ _data, ...rest }) => rest);
  if (dryRun) return { dryRun: true, summary, rows: publicRows };

  const prepared = [];
  const result = await db.tx(async (tx) => {
    const createdCompanies = new Map();
    for (const name of newCompanies) {
      const original = report.find((r) => r._data.company?.pending && key(r._data.company.name) === name)._data.company.name;
      const c = await one(tx, 'INSERT INTO aula_companies (name) VALUES ($1) RETURNING id, name', [original]);
      createdCompanies.set(name, c);
    }
    const createdGroups = new Map();
    for (const [gKey, g] of newGroups) {
      const companyId = g.companyKey ? (createdCompanies.get(g.companyKey) || companyByName.get(g.companyKey)).id : null;
      const row = await one(tx, 'INSERT INTO aula_groups (company_id, name) VALUES ($1, $2) RETURNING id', [companyId, g.name]);
      createdGroups.set(gKey, row.id);
    }

    let created = 0;
    let addedToGroups = 0;
    const touched = new Set();
    for (const r of report) {
      if (r.status === 'omitida') continue;
      const d = r._data;
      const companyId = d.company ? (d.company.pending ? createdCompanies.get(key(d.company.name)).id : d.company.id) : null;
      const groupId = d.group ? (d.group.pending ? createdGroups.get(d.group.key) : d.group.id) : null;
      let userId;
      if (r.status === 'nuevo') {
        const u = await one(
          tx,
          `INSERT INTO aula_users (email, first_name, last_name, role, status, company_id, job_title, created_at, updated_at)
           VALUES ($1, $2, $3, 'participant', 'invited', $4, $5, $6, $6) RETURNING *`,
          [d.mail, d.firstName, d.lastName, companyId, d.jobTitle || null, now],
        );
        userId = u.id;
        created += 1;
        if (sendInvites) prepared.push(await sendInvite(tx, u, { actor, mailer, siteUrl, now }));
      } else {
        userId = d.current.id;
      }
      const shouldJoin = r.status === 'nuevo' || r.actions.some((a) => a.startsWith('Agregar al grupo'));
      if (groupId && shouldJoin) {
        const added = await one(
          tx,
          `INSERT INTO aula_group_members (group_id, user_id, added_at, added_by) VALUES ($1, $2, $3, $4)
           ON CONFLICT (group_id, user_id) DO UPDATE SET removed_at = NULL, added_at = EXCLUDED.added_at
             WHERE aula_group_members.removed_at IS NOT NULL
           RETURNING user_id`,
          [groupId, userId, now, actor.id],
        );
        if (added) addedToGroups += 1;
      }
      touched.add(userId);
    }
    let enrolled = 0;
    for (const userId of touched) enrolled += await applyStandingAssignments(tx, { userId, now });

    await audit(tx, {
      actor, ip, action: 'usuario.importar', entityType: 'usuario',
      summary: `Importación CSV: ${plural(created, 'cuenta nueva', 'cuentas nuevas')}, ${plural(addedToGroups, 'ingreso a grupos', 'ingresos a grupos')}, ${plural(summary.omitidas, 'fila omitida', 'filas omitidas')}${enrolled ? `, ${plural(enrolled, 'inscripción automática', 'inscripciones automáticas')}` : ''}.`,
      after: { ...summary, created, addedToGroups, enrolled },
    });
    return { created, addedToGroups, enrolled };
  });
  const invitationsSent = await deliver(mailer, prepared);
  return { dryRun: false, summary: { ...summary, ...result, invitacionesEnviadas: invitationsSent }, rows: publicRows };
}

export const IMPORT_TEMPLATE = [
  'nombre,apellido,correo,empresa,grupo,cargo',
  'Ana,Pérez (ejemplo),ana.perez@empresa-ejemplo.co,Pharmarket,Fuerza comercial — octubre 2026,Visitadora médica',
  '',
].join('\r\n');
