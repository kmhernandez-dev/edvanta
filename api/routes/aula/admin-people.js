import express from 'express';
import {
  addGroupMembers, companyOptions, createCompany, createGroup, deleteCompany, deleteGroup, getCompany, getGroup,
  groupOptions, listCompanies, listGroupMembers, listGroups, readCompany, readGroup, removeGroupMember,
  updateCompany, updateGroup,
} from '../../lib/aula/org.js';
import {
  createUser, deleteUser, getUser, importUsers, IMPORT_TEMPLATE, inviteUser, listUsers, readUser, setUserStatus, updateUser,
} from '../../lib/aula/users.js';
import {
  createAssignment, reactivateEnrollment, revokeAssignment, withdrawEnrollment,
} from '../../lib/aula/enrollments.js';
import { many } from '../../lib/aula/db.js';
import {
  badRequest, bool, date, id as idField, idList, oneOf, route, str,
} from '../../lib/aula/http.js';
import { actorOf } from './middleware.js';

const ctx = (req, deps) => ({
  actor: actorOf(req), ip: req.aula.ip, now: req.aula.now, mailer: deps.mailer, siteUrl: deps.siteUrl,
});

const reasonOf = (body) => str(body?.reason, 'reason', 'El motivo', { max: 500, optional: true });

export function adminPeopleRouter(deps) {
  const router = express.Router();

  // ── Selectores ────────────────────────────────────────────
  router.get('/options/companies', route(async (req, res) => res.json(await companyOptions(req.aula.db))));
  router.get('/options/groups', route(async (req, res) => res.json(await groupOptions(req.aula.db, req.query.companyId))));

  // ── Empresas ──────────────────────────────────────────────
  router.get('/companies', route(async (req, res) => res.json(await listCompanies(req.aula.db, req.query))));
  router.post('/companies', route(async (req, res) => {
    res.status(201).json(await createCompany(req.aula.db, readCompany(req.body), ctx(req, deps)));
  }));
  router.get('/companies/:id', route(async (req, res) => res.json(await getCompany(req.aula.db, idField(req.params.id)))));
  router.patch('/companies/:id', route(async (req, res) => {
    res.json(await updateCompany(req.aula.db, idField(req.params.id), readCompany(req.body, { partial: true }), ctx(req, deps)));
  }));
  router.delete('/companies/:id', route(async (req, res) => {
    await deleteCompany(req.aula.db, idField(req.params.id), ctx(req, deps));
    res.json({ ok: true });
  }));

  // ── Grupos ────────────────────────────────────────────────
  router.get('/groups', route(async (req, res) => res.json(await listGroups(req.aula.db, req.query))));
  router.post('/groups', route(async (req, res) => {
    res.status(201).json(await createGroup(req.aula.db, readGroup(req.body), ctx(req, deps)));
  }));
  router.get('/groups/:id', route(async (req, res) => {
    const groupId = idField(req.params.id);
    const group = await getGroup(req.aula.db, groupId);
    const assignments = await many(
      req.aula.db,
      `SELECT a.id, a.course_id, c.title AS course_title, a.starts_at, a.due_at, a.created_at
         FROM aula_assignments a JOIN aula_courses c ON c.id = a.course_id
        WHERE a.group_id = $1 AND a.revoked_at IS NULL ORDER BY a.created_at DESC`,
      [groupId],
    );
    res.json({ ...group, assignments });
  }));
  router.patch('/groups/:id', route(async (req, res) => {
    res.json(await updateGroup(req.aula.db, idField(req.params.id), readGroup(req.body, { partial: true }), ctx(req, deps)));
  }));
  router.delete('/groups/:id', route(async (req, res) => {
    await deleteGroup(req.aula.db, idField(req.params.id), ctx(req, deps));
    res.json({ ok: true });
  }));
  router.get('/groups/:id/members', route(async (req, res) => {
    const rows = await listGroupMembers(req.aula.db, idField(req.params.id));
    res.json(rows.map((r) => ({
      id: r.id, email: r.email, firstName: r.first_name, lastName: r.last_name,
      fullName: `${r.first_name} ${r.last_name}`.trim(), status: r.status, jobTitle: r.job_title, addedAt: r.added_at,
    })));
  }));
  router.post('/groups/:id/members', route(async (req, res) => {
    const userIds = idList(req.body?.userIds, 'userIds', 'Las personas');
    res.json(await addGroupMembers(req.aula.db, idField(req.params.id), userIds, ctx(req, deps)));
  }));
  router.delete('/groups/:id/members/:userId', route(async (req, res) => {
    res.json(await removeGroupMember(req.aula.db, idField(req.params.id), idField(req.params.userId, 'userId', 'La persona'), {
      ...ctx(req, deps), withdrawCourses: req.query.withdraw === '1',
    }));
  }));

  // ── Personas ──────────────────────────────────────────────
  router.get('/users', route(async (req, res) => res.json(await listUsers(req.aula.db, req.query))));
  router.post('/users', route(async (req, res) => {
    const input = readUser(req.body);
    const groupIds = Array.isArray(req.body?.groupIds) && req.body.groupIds.length
      ? idList(req.body.groupIds, 'groupIds', 'Los grupos') : [];
    const invite = bool(req.body?.sendInvite, 'sendInvite', 'Enviar invitación', { optional: true, fallback: true });
    res.status(201).json(await createUser(req.aula.db, input, { ...ctx(req, deps), groupIds, invite }));
  }));
  router.get('/users/import/template', (_req, res) => {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="plantilla-participantes-aula.csv"');
    // BOM para que Excel reconozca las tildes.
    res.send(`﻿${IMPORT_TEMPLATE}`);
  });
  router.post('/users/import', route(async (req, res) => {
    const b = req.body || {};
    res.json(await importUsers(req.aula.db, {
      rows: b.rows,
      createCompanies: bool(b.createCompanies, 'createCompanies', 'Crear empresas', { optional: true }),
      createGroups: bool(b.createGroups, 'createGroups', 'Crear grupos', { optional: true }),
      sendInvites: bool(b.sendInvites, 'sendInvites', 'Enviar invitaciones', { optional: true, fallback: true }),
      dryRun: bool(b.dryRun, 'dryRun', 'Simulación', { optional: true, fallback: true }),
      ...ctx(req, deps),
    }));
  }));
  router.get('/users/:id', route(async (req, res) => {
    const userId = idField(req.params.id);
    const user = await getUser(req.aula.db, userId);
    const enrollments = await many(
      req.aula.db,
      `SELECT e.id, e.course_id, c.title AS course_title, e.effective_status, e.progress_pct, e.due_at,
              e.assigned_at, e.first_access_at, e.last_access_at, e.completed_at, e.withdrawn_at, e.final_score
         FROM aula_enrollments_v e JOIN aula_courses c ON c.id = e.course_id
        WHERE e.user_id = $1 ORDER BY e.assigned_at DESC`,
      [userId],
    );
    res.json({ ...user, enrollmentList: enrollments });
  }));
  router.patch('/users/:id', route(async (req, res) => {
    res.json(await updateUser(req.aula.db, idField(req.params.id), readUser(req.body, { partial: true }), ctx(req, deps)));
  }));
  router.post('/users/:id/suspend', route(async (req, res) => {
    res.json(await setUserStatus(req.aula.db, idField(req.params.id), 'suspended', { ...ctx(req, deps), reason: reasonOf(req.body) }));
  }));
  router.post('/users/:id/reactivate', route(async (req, res) => {
    res.json(await setUserStatus(req.aula.db, idField(req.params.id), 'active', ctx(req, deps)));
  }));
  router.post('/users/:id/invite', route(async (req, res) => {
    res.json(await inviteUser(req.aula.db, idField(req.params.id), ctx(req, deps)));
  }));
  router.delete('/users/:id', route(async (req, res) => {
    await deleteUser(req.aula.db, idField(req.params.id), { ...ctx(req, deps), reason: reasonOf(req.body) });
    res.json({ ok: true });
  }));

  // ── Asignaciones e inscripciones ──────────────────────────
  router.post('/assignments', route(async (req, res) => {
    const b = req.body || {};
    const targetType = oneOf(b.targetType, 'targetType', 'El destino', ['usuario', 'grupo', 'empresa']);
    const targetIds = idList(b.targetIds, 'targetIds', 'Los destinos', { max: 500 });
    const courseIds = idList(b.courseIds, 'courseIds', 'Los cursos', { max: 50 });
    const startsAt = date(b.startsAt, 'startsAt', 'La fecha de inicio', { optional: true });
    const dueAt = date(b.dueAt, 'dueAt', 'La fecha límite', { optional: true });
    if (dueAt && dueAt < req.aula.now && !b.allowPastDue) {
      throw badRequest('La fecha límite ya pasó. Elige una fecha futura.', { field: 'dueAt' });
    }
    // Todo o nada: si un destino falla, no queda ninguna asignación a medias.
    const results = await req.aula.db.tx(async (tx) => {
      const out = [];
      for (const courseId of courseIds) {
        for (const targetId of targetIds) {
          const r = await createAssignment(tx, { courseId, targetType, targetId, startsAt, dueAt, ...ctx(req, deps) });
          out.push({ courseId, targetId, assignmentId: r.assignment.id, created: r.created, reactivated: r.reactivated, unchanged: r.unchanged });
        }
      }
      return out;
    });
    res.status(201).json({
      results,
      created: results.reduce((s, r) => s + r.created, 0),
      reactivated: results.reduce((s, r) => s + r.reactivated, 0),
      unchanged: results.reduce((s, r) => s + r.unchanged, 0),
    });
  }));
  router.post('/assignments/:id/revoke', route(async (req, res) => {
    res.json(await revokeAssignment(req.aula.db, { assignmentId: idField(req.params.id), ...ctx(req, deps) }));
  }));
  router.post('/enrollments/:id/withdraw', route(async (req, res) => {
    await withdrawEnrollment(req.aula.db, { enrollmentId: idField(req.params.id), reason: reasonOf(req.body), ...ctx(req, deps) });
    res.json({ ok: true });
  }));
  router.post('/enrollments/:id/reactivate', route(async (req, res) => {
    await reactivateEnrollment(req.aula.db, { enrollmentId: idField(req.params.id), ...ctx(req, deps) });
    res.json({ ok: true });
  }));

  return router;
}
