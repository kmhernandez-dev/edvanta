/**
 * Seguimiento y exportación CRM del aula.
 *
 * Une la ficha comercial (crm_code, segmento, etiquetas) con la actividad
 * real: cursos, avance, entregas pendientes, quizzes y foros.
 */
import { many, one, whereBuilder } from './db.js';
import { pageResult, paging } from './http.js';

const fullName = (u) => `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;

async function activityOf(db, userId) {
  const enrollments = await many(
    db,
    `SELECT e.course_id, c.title, e.effective_status, e.progress_pct, e.final_score,
            e.assessments_submitted, e.assessments_required, e.activities_submitted,
            e.activities_required, e.forums_participated, e.forums_required, e.last_access_at
       FROM aula_enrollments_v e
       JOIN aula_courses c ON c.id = e.course_id
      WHERE e.user_id = $1 AND e.withdrawn_at IS NULL
      ORDER BY c.title`,
    [userId],
  );
  const pendingSubmissions = await one(
    db,
    `SELECT count(*)::int AS n
       FROM aula_submissions s
       JOIN aula_enrollments e ON e.id = s.enrollment_id
      WHERE e.user_id = $1 AND e.withdrawn_at IS NULL
        AND s.current_revision > 0
        AND s.status IN ('enviada', 'entregada_tarde', 'en_revision', 'requiere_ajustes')`,
    [userId],
  );
  const pendingForums = await one(
    db,
    `SELECT count(*)::int AS n
       FROM aula_forums f
       JOIN aula_enrollments e ON e.course_id = f.course_id AND e.user_id = $1 AND e.withdrawn_at IS NULL
      WHERE f.deleted_at IS NULL AND f.weight > 0
        AND EXISTS (SELECT 1 FROM aula_forum_posts p
                     WHERE p.forum_id = f.id AND p.author_id = $1
                       AND p.deleted_at IS NULL AND p.is_hidden = FALSE)
        AND NOT EXISTS (SELECT 1 FROM aula_forum_grades g
                         WHERE g.forum_id = f.id AND g.enrollment_id = e.id AND g.score IS NOT NULL)`,
    [userId],
  );
  const quizzes = await one(
    db,
    `SELECT count(*)::int AS n
       FROM aula_attempts at
       JOIN aula_enrollments e ON e.id = at.enrollment_id
      WHERE e.user_id = $1 AND e.withdrawn_at IS NULL AND at.status <> 'en_curso'`,
    [userId],
  );
  const forums = await one(
    db,
    `SELECT count(DISTINCT p.forum_id)::int AS n
       FROM aula_forum_posts p
       JOIN aula_enrollments e ON e.user_id = p.author_id
      WHERE p.author_id = $1 AND p.deleted_at IS NULL AND p.is_hidden = FALSE`,
    [userId],
  );
  const last = await one(
    db,
    `SELECT GREATEST(
       COALESCE((SELECT max(last_access_at) FROM aula_enrollments WHERE user_id = $1 AND withdrawn_at IS NULL), 'epoch'::timestamptz),
       COALESCE((SELECT max(at.submitted_at) FROM aula_attempts at JOIN aula_enrollments e ON e.id = at.enrollment_id WHERE e.user_id = $1), 'epoch'::timestamptz),
       COALESCE((SELECT max(s.last_submitted_at) FROM aula_submissions s JOIN aula_enrollments e ON e.id = s.enrollment_id WHERE e.user_id = $1), 'epoch'::timestamptz),
       COALESCE((SELECT max(p.created_at) FROM aula_forum_posts p WHERE p.author_id = $1), 'epoch'::timestamptz)
     ) AS at`,
    [userId],
  );
  return {
    enrollments,
    pendingSubmissions: pendingSubmissions.n,
    pendingForums: pendingForums.n,
    pendingTasks: pendingSubmissions.n + pendingForums.n,
    quizzesSubmitted: quizzes.n,
    forumsParticipated: forums.n,
    lastActivityAt: last?.at && new Date(last.at).getFullYear() > 1970 ? last.at : null,
  };
}

export async function crmUsers(db, query = {}) {
  const pg = paging(query, { defaultSize: 50, maxSize: 200 });
  const w = whereBuilder(['u.deleted_at IS NULL']);
  if (query.q?.trim()) {
    const p = w.param(`%${query.q.trim()}%`);
    w.and(`(u.first_name ILIKE ${p} OR u.last_name ILIKE ${p} OR u.email ILIKE ${p}
      OR u.crm_code ILIKE ${p} OR (u.first_name || ' ' || u.last_name) ILIKE ${p}
      OR EXISTS (SELECT 1 FROM unnest(u.crm_tags) tag WHERE tag ILIKE ${p}))`);
  }
  if (query.segmento?.trim()) w.and(`u.segmento = ${w.param(query.segmento.trim())}`);
  if (query.tag?.trim()) w.and(`EXISTS (SELECT 1 FROM unnest(u.crm_tags) tag WHERE tag = ${w.param(query.tag.trim())})`);
  if (query.status?.trim()) w.and(`u.status = ${w.param(query.status.trim())}`);
  const total = (await one(db, `SELECT count(*)::int AS n FROM aula_users u ${w.sql}`, w.params)).n;
  const rows = await many(
    db,
    `SELECT u.id, u.crm_code, u.first_name, u.last_name, u.email, u.role, u.status,
            u.segmento, u.crm_tags, u.crm_source, u.crm_notes, u.last_login_at, u.created_at
       FROM aula_users u
       ${w.sql}
      ORDER BY lower(u.first_name || u.last_name), u.id
      LIMIT ${pg.size} OFFSET ${pg.offset}`,
    w.params,
  );
  const items = [];
  for (const u of rows) {
    const activity = await activityOf(db, u.id);
    items.push({
      id: u.id,
      crmCode: u.crm_code,
      fullName: fullName(u),
      email: u.email,
      role: u.role,
      status: u.status,
      segmento: u.segmento,
      crmTags: u.crm_tags || [],
      crmSource: u.crm_source,
      crmNotes: u.crm_notes,
      lastLoginAt: u.last_login_at,
      createdAt: u.created_at,
      ...activity,
    });
  }
  return pageResult(items, total, pg);
}

const cell = (value) => {
  const text = String(value ?? '');
  return /[",\n;]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export async function crmCsv(db) {
  const users = await many(
    db,
    `SELECT id, crm_code, first_name, last_name, email, role, status, segmento,
            crm_tags, crm_source, last_login_at, created_at
       FROM aula_users WHERE deleted_at IS NULL ORDER BY id LIMIT 5000`,
  );
  const lines = [[
    'crm_code', 'nombre', 'email', 'rol', 'estado', 'segmento', 'etiquetas', 'origen',
    'ultimo_acceso', 'cursos', 'progreso_promedio', 'tareas_pendientes', 'quizzes_enviados', 'foros_participados', 'alta',
  ]];
  for (const u of users) {
    const a = await activityOf(db, u.id);
    const avg = a.enrollments.length
      ? Math.round((a.enrollments.reduce((n, e) => n + Number(e.progress_pct || 0), 0) / a.enrollments.length) * 10) / 10
      : 0;
    lines.push([
      u.crm_code, fullName(u), u.email, u.role, u.status, u.segmento,
      (u.crm_tags || []).join('|'), u.crm_source,
      u.last_login_at ? new Date(u.last_login_at).toISOString() : '',
      a.enrollments.length, avg, a.pendingTasks, a.quizzesSubmitted, a.forumsParticipated,
      u.created_at ? new Date(u.created_at).toISOString() : '',
    ]);
  }
  return lines.map((line) => line.map(cell).join(',')).join('\n');
}
