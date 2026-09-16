import express from 'express';
import { one } from '../../lib/aula/db.js';
import { route } from '../../lib/aula/http.js';

export function adminSummaryRouter() {
  const router = express.Router();

  router.get('/', route(async (req, res) => {
    const { db } = req.aula;
    const row = await one(
      db,
      `SELECT
         (SELECT count(*)::int FROM aula_users WHERE deleted_at IS NULL AND role = 'participant' AND status = 'active') AS participants_active,
         (SELECT count(*)::int FROM aula_users WHERE deleted_at IS NULL AND role = 'participant' AND status = 'invited') AS participants_invited,
         (SELECT count(*)::int FROM aula_users WHERE deleted_at IS NULL AND role = 'admin') AS admins,
         (SELECT count(*)::int FROM aula_companies WHERE deleted_at IS NULL) AS companies,
         (SELECT count(*)::int FROM aula_groups WHERE deleted_at IS NULL) AS groups,
         (SELECT count(*)::int FROM aula_courses WHERE deleted_at IS NULL AND status = 'publicado') AS courses_published,
         (SELECT count(*)::int FROM aula_courses WHERE deleted_at IS NULL AND status IN ('borrador', 'en_revision')) AS courses_draft,
         (SELECT count(*)::int FROM aula_enrollments WHERE withdrawn_at IS NULL) AS enrollments_active`,
    );
    res.json({
      participants: { active: row.participants_active, invited: row.participants_invited },
      admins: row.admins,
      companies: row.companies,
      groups: row.groups,
      courses: { published: row.courses_published, drafts: row.courses_draft },
      enrollments: { active: row.enrollments_active },
    });
  }));

  return router;
}
