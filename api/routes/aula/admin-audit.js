import express from 'express';
import { AUDIT_ACTIONS } from '../../lib/aula/audit.js';
import { many, one, whereBuilder } from '../../lib/aula/db.js';
import { date, pageResult, paging, route } from '../../lib/aula/http.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function adminAuditRouter() {
  const router = express.Router();

  router.get('/actions', (_req, res) => {
    res.json(Object.entries(AUDIT_ACTIONS).map(([value, label]) => ({ value, label })));
  });

  router.get('/', route(async (req, res) => {
    const { db } = req.aula;
    const q = req.query;
    const pg = paging(q, { defaultSize: 50 });
    const w = whereBuilder();

    const text = typeof q.q === 'string' ? q.q.trim() : '';
    if (text) {
      const p = w.param(`%${text}%`);
      w.and(`(summary ILIKE ${p} OR actor_email ILIKE ${p})`);
    }
    if (typeof q.action === 'string' && AUDIT_ACTIONS[q.action]) w.and(`action = ${w.param(q.action)}`);
    if (typeof q.entityType === 'string' && /^[a-z_]{2,30}$/.test(q.entityType)) {
      w.and(`entity_type = ${w.param(q.entityType)}`);
    }
    if (Number(q.courseId) > 0) w.and(`course_id = ${w.param(Number(q.courseId))}`);
    if (Number(q.companyId) > 0) w.and(`company_id = ${w.param(Number(q.companyId))}`);
    const from = date(q.from, 'from', 'La fecha inicial', { optional: true });
    const to = date(q.to, 'to', 'La fecha final', { optional: true });
    if (from) w.and(`created_at >= ${w.param(from)}`);
    if (to) w.and(`created_at < ${w.param(new Date(to.getTime() + DAY_MS))}`);

    const total = (await one(db, `SELECT count(*)::int AS n FROM aula_audit_log ${w.sql}`, w.params)).n;
    const rows = await many(
      db,
      `SELECT id, actor_email, action, entity_type, entity_id, course_id, company_id,
              summary, before_data, after_data, reason, created_at
         FROM aula_audit_log ${w.sql}
        ORDER BY created_at DESC, id DESC
        LIMIT ${pg.size} OFFSET ${pg.offset}`,
      w.params,
    );
    res.json(pageResult(rows.map((r) => ({
      id: r.id,
      actor: r.actor_email || 'Sistema',
      action: r.action,
      actionLabel: AUDIT_ACTIONS[r.action] || r.action,
      entityType: r.entity_type,
      entityId: r.entity_id,
      courseId: r.course_id,
      companyId: r.company_id,
      summary: r.summary,
      before: r.before_data,
      after: r.after_data,
      reason: r.reason,
      createdAt: r.created_at,
    })), total, pg));
  }));

  return router;
}
