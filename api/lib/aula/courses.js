/**
 * Cursos: datos generales, estados, duplicado, publicación y versiones.
 *
 * Estados: borrador → (en revisión) → publicado → archivado. Publicar crea
 * una versión inmutable. Las inscripciones que no han empezado pasan solas
 * a la versión nueva; las que van en curso solo cambian con una
 * actualización obligatoria, y las completadas conservan su versión salvo
 * que se decida reabrirlas. Todo queda en la bitácora.
 */
import { many, one, whereBuilder } from './db.js';
import {
  badRequest, bogotaYmd, bool, conflict, dayBoundary, id as idField, int, notFound, num, oneOf,
  pageResult, paging, plural, sorting, str, strList,
} from './http.js';
import { richText } from './richtext.js';
import { audit } from './audit.js';
import { notify } from './notify.js';
import { buildSnapshot, diffSnapshots, validateSnapshot } from './snapshot.js';
import { recomputeEnrollment } from './progress.js';
import { copyModuleInto } from './structure.js';

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export const COURSE_STATUS_LABEL = {
  borrador: 'Borrador', en_revision: 'En revisión', publicado: 'Publicado', archivado: 'Archivado',
};

const COLUMNS = {
  title: 'title',
  kind: 'kind',
  companyId: 'company_id',
  shortDescription: 'short_description',
  descriptionHtml: 'description_html',
  coverFileId: 'cover_file_id',
  category: 'category',
  level: 'level',
  tags: 'tags',
  objective: 'objective',
  learningOutcomes: 'learning_outcomes',
  audience: 'audience',
  prerequisites: 'prerequisites',
  durationMinutes: 'duration_minutes',
  authorName: 'author_name',
  modality: 'modality',
  passingScore: 'passing_score',
  maxAttempts: 'max_attempts',
  availableFrom: 'available_from',
  availableUntil: 'available_until',
  sequential: 'sequential',
  videoCompletionPct: 'video_completion_pct',
  resourcesEnabled: 'resources_enabled',
};

// Reglas que cambian resultados: solo llegan a los participantes al publicar.
const VERSIONED_RULES = ['passingScore', 'maxAttempts', 'sequential', 'videoCompletionPct'];

export function readCourse(body = {}, { partial = false } = {}) {
  const b = body || {};
  const want = (k) => !partial || has(b, k);
  const out = {};
  if (want('title')) out.title = str(b.title, 'title', 'El título', { max: 160 });
  if (want('kind')) out.kind = oneOf(b.kind ?? 'edvanta', 'kind', 'El tipo de curso', ['edvanta', 'empresa']);
  if (want('companyId')) {
    out.companyId = b.companyId === null || b.companyId === undefined || b.companyId === ''
      ? null : idField(b.companyId, 'companyId', 'La empresa');
  }
  if (want('shortDescription')) out.shortDescription = str(b.shortDescription, 'shortDescription', 'La descripción corta', { max: 300, optional: true });
  if (want('descriptionHtml')) out.descriptionHtml = richText(b.descriptionHtml, 'descriptionHtml', 'La descripción', { optional: true });
  if (want('coverFileId')) {
    out.coverFileId = b.coverFileId === null || b.coverFileId === undefined || b.coverFileId === ''
      ? null : idField(b.coverFileId, 'coverFileId', 'La portada');
  }
  if (want('category')) out.category = str(b.category, 'category', 'La categoría', { max: 80, optional: true });
  if (want('level')) out.level = oneOf(b.level, 'level', 'El nivel', ['basico', 'intermedio', 'avanzado'], { optional: true });
  if (want('tags')) out.tags = strList(b.tags, 'tags', 'Las etiquetas', { maxItems: 12, maxLength: 40 });
  if (want('objective')) out.objective = str(b.objective, 'objective', 'El objetivo general', { max: 1000, optional: true });
  if (want('learningOutcomes')) {
    out.learningOutcomes = strList(b.learningOutcomes, 'learningOutcomes', 'Los resultados de aprendizaje', { maxItems: 20, maxLength: 300 });
  }
  if (want('audience')) out.audience = str(b.audience, 'audience', 'El público', { max: 500, optional: true });
  if (want('prerequisites')) out.prerequisites = str(b.prerequisites, 'prerequisites', 'Los requisitos', { max: 500, optional: true });
  if (want('durationMinutes')) out.durationMinutes = int(b.durationMinutes, 'durationMinutes', 'La duración', { min: 0, max: 100000, optional: true });
  if (want('authorName')) out.authorName = str(b.authorName, 'authorName', 'El autor o equipo', { max: 120, optional: true });
  if (want('modality')) out.modality = oneOf(b.modality ?? 'asincronica', 'modality', 'La modalidad', ['asincronica', 'mixta']);
  if (want('passingScore')) out.passingScore = num(b.passingScore ?? 70, 'passingScore', 'La nota mínima', { min: 0, max: 100 });
  if (want('maxAttempts')) out.maxAttempts = int(b.maxAttempts ?? 3, 'maxAttempts', 'Los intentos por evaluación', { min: 1, max: 20 });
  if (want('availableFrom')) out.availableFrom = dayBoundary(b.availableFrom, 'availableFrom', 'La fecha de apertura', { optional: true });
  if (want('availableUntil')) out.availableUntil = dayBoundary(b.availableUntil, 'availableUntil', 'La fecha de cierre', { optional: true, end: true });
  if (want('sequential')) out.sequential = bool(b.sequential, 'sequential', 'Avance en orden', { optional: true });
  if (want('videoCompletionPct')) {
    out.videoCompletionPct = int(b.videoCompletionPct ?? 90, 'videoCompletionPct', 'El porcentaje de video', { min: 50, max: 100 });
  }
  if (want('resourcesEnabled')) out.resourcesEnabled = bool(b.resourcesEnabled, 'resourcesEnabled', 'Recursos de trabajo', { optional: true });
  if (out.availableFrom && out.availableUntil && out.availableUntil <= out.availableFrom) {
    throw badRequest('La fecha de cierre debe ser posterior a la de apertura.', { field: 'availableUntil' });
  }
  if (!partial) {
    if (out.kind === 'empresa' && !out.companyId) throw badRequest('Elige la empresa de esta capacitación.', { field: 'companyId' });
    if (out.kind === 'edvanta') out.companyId = null;
  }
  return out;
}

export function courseRow(r) {
  return {
    id: r.id,
    title: r.title,
    kind: r.kind,
    companyId: r.company_id,
    companyName: r.company_name ?? null,
    status: r.status,
    shortDescription: r.short_description || '',
    descriptionHtml: r.description_html || '',
    coverFileId: r.cover_file_id,
    category: r.category || '',
    level: r.level,
    tags: r.tags || [],
    objective: r.objective || '',
    learningOutcomes: r.learning_outcomes || [],
    audience: r.audience || '',
    prerequisites: r.prerequisites || '',
    durationMinutes: r.duration_minutes,
    authorName: r.author_name || '',
    modality: r.modality,
    passingScore: r.passing_score,
    maxAttempts: r.max_attempts,
    availableFrom: r.available_from,
    availableUntil: r.available_until,
    availableFromDay: bogotaYmd(r.available_from),
    availableUntilDay: bogotaYmd(r.available_until),
    sequential: r.sequential,
    videoCompletionPct: r.video_completion_pct,
    resourcesEnabled: r.resources_enabled,
    currentVersionId: r.current_version_id,
    versionNumber: r.version_number ?? null,
    publishedAt: r.published_at,
    isDemo: r.is_demo,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function assertCover(db, fileId) {
  if (!fileId) return;
  const f = await one(db, "SELECT id FROM aula_files WHERE id = $1 AND purpose = 'portada' AND status = 'listo' AND deleted_at IS NULL", [fileId]);
  if (!f) throw badRequest('La portada no terminó de subirse o no es una imagen válida.', { field: 'coverFileId' });
}

async function assertCompany(db, companyId) {
  const c = await one(db, 'SELECT id, name, status FROM aula_companies WHERE id = $1 AND deleted_at IS NULL', [companyId]);
  if (!c) throw badRequest('La empresa seleccionada no existe.', { field: 'companyId' });
  return c;
}

async function lockCourse(db, id) {
  const c = await one(db, 'SELECT * FROM aula_courses WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [id]);
  if (!c) throw notFound('No encontramos ese curso.');
  return c;
}

// ── Consultas ───────────────────────────────────────────────

const COURSE_STATS = `
  (SELECT count(*)::int FROM aula_modules m WHERE m.course_id = c.id AND m.deleted_at IS NULL) AS modules,
  (SELECT count(*)::int FROM aula_lessons l JOIN aula_modules m ON m.id = l.module_id AND m.deleted_at IS NULL
    WHERE l.course_id = c.id AND l.deleted_at IS NULL) AS lessons,
  (SELECT count(*)::int FROM aula_enrollments e WHERE e.course_id = c.id AND e.withdrawn_at IS NULL) AS enrollments,
  (SELECT count(*)::int FROM aula_enrollments e
    WHERE e.course_id = c.id AND e.withdrawn_at IS NULL AND e.progress_status = 'completado') AS completed`;

export async function listCourses(db, query) {
  const pg = paging(query);
  const sort = sorting(query, {
    title: 'lower(c.title)', updatedAt: 'c.updated_at', createdAt: 'c.created_at', enrollments: 'enrollments',
  }, 'updatedAt');
  const w = whereBuilder(['c.deleted_at IS NULL']);
  if (query.q?.trim()) {
    const p = w.param(`%${query.q.trim()}%`);
    w.and(`(c.title ILIKE ${p} OR c.category ILIKE ${p} OR co.name ILIKE ${p})`);
  }
  if (Object.keys(COURSE_STATUS_LABEL).includes(query.status)) w.and(`c.status = ${w.param(query.status)}`);
  else if (query.status !== 'todos') w.and("c.status <> 'archivado'");
  if (['edvanta', 'empresa'].includes(query.kind)) w.and(`c.kind = ${w.param(query.kind)}`);
  if (/^\d+$/.test(query.companyId || '')) w.and(`c.company_id = ${w.param(Number(query.companyId))}`);
  const from = `FROM aula_courses c
    LEFT JOIN aula_companies co ON co.id = c.company_id
    LEFT JOIN aula_course_versions v ON v.id = c.current_version_id`;
  const total = (await one(db, `SELECT count(*)::int AS n ${from} ${w.sql}`, w.params)).n;
  const dir = sort.key === 'title' && !query.dir ? 'ASC' : sort.dir;
  const rows = await many(
    db,
    `SELECT c.*, co.name AS company_name, v.version_number, ${COURSE_STATS}
       ${from} ${w.sql}
      ORDER BY ${sort.column} ${dir}, c.id DESC LIMIT ${pg.size} OFFSET ${pg.offset}`,
    w.params,
  );
  return pageResult(rows.map((r) => ({
    ...courseRow(r),
    modules: r.modules,
    lessons: r.lessons,
    enrollments: r.enrollments,
    completed: r.completed,
  })), total, pg);
}

export async function courseOptions(db, { companyId } = {}) {
  return many(
    db,
    `SELECT c.id AS value, c.title AS label, c.kind, c.company_id, c.status, co.name AS company_name
       FROM aula_courses c LEFT JOIN aula_companies co ON co.id = c.company_id
      WHERE c.deleted_at IS NULL AND c.status <> 'archivado'
        AND ($1::bigint IS NULL OR c.kind = 'edvanta' OR c.company_id = $1)
      ORDER BY lower(c.title)`,
    [companyId ? Number(companyId) : null],
  );
}

async function loadCourse(db, id) {
  const row = await one(
    db,
    `SELECT c.*, co.name AS company_name, co.status AS company_status,
            v.version_number, v.published_at AS version_published_at, v.snapshot AS published_snapshot
       FROM aula_courses c
       LEFT JOIN aula_companies co ON co.id = c.company_id
       LEFT JOIN aula_course_versions v ON v.id = c.current_version_id
      WHERE c.id = $1 AND c.deleted_at IS NULL`,
    [id],
  );
  if (!row) throw notFound('No encontramos ese curso.');
  return row;
}

/** Estado de las inscripciones activas de un curso. */
export async function enrollmentStats(db, courseId) {
  const rows = await many(
    db,
    `SELECT e.effective_status AS status, count(*)::int AS n
       FROM aula_enrollments_v e WHERE e.course_id = $1 AND e.withdrawn_at IS NULL
      GROUP BY 1`,
    [courseId],
  );
  const byStatus = Object.fromEntries(rows.map((r) => [r.status, r.n]));
  return { total: rows.reduce((s, r) => s + r.n, 0), byStatus };
}

/** Datos del editor: curso, estructura (sin el contenido de los bloques) y estado de publicación. */
export async function getCourse(db, id) {
  const row = await loadCourse(db, id);
  const snapshot = await buildSnapshot(db, id);
  const outline = snapshot.modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      subtitle: l.subtitle,
      isRequired: l.isRequired,
      completionRule: l.completionRule,
      minSeconds: l.minSeconds,
      durationMinutes: l.durationMinutes,
      blockCount: l.blocks.length,
      blockTypes: [...new Set(l.blocks.map((b) => b.type))],
    })),
  }));
  const published = row.published_snapshot;
  const publishedLessonIds = new Set((published?.modules || []).flatMap((m) => m.lessons.map((l) => l.id)));
  return {
    ...courseRow(row),
    companyName: row.company_name,
    companyStatus: row.company_status,
    version: row.current_version_id
      ? { id: row.current_version_id, number: row.version_number, publishedAt: row.version_published_at }
      : null,
    hasUnpublishedChanges: published ? published.fingerprint !== snapshot.fingerprint : snapshot.totals.lessons > 0,
    outline: outline.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => ({ ...l, published: publishedLessonIds.has(l.id) })),
    })),
    totals: snapshot.totals,
    enrollments: await enrollmentStats(db, id),
  };
}

// ── Cambios ─────────────────────────────────────────────────

export async function createCourse(db, input, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    if (input.kind === 'empresa') {
      const company = await assertCompany(tx, input.companyId);
      if (company.status !== 'activa') throw badRequest('La empresa está inactiva. Reactívala para crearle capacitaciones.', { field: 'companyId' });
    }
    await assertCover(tx, input.coverFileId);
    const keys = Object.keys(COLUMNS).filter((k) => input[k] !== undefined);
    const params = keys.map((k) => input[k]);
    params.push(actor.id, now);
    const row = await one(
      tx,
      `INSERT INTO aula_courses (${keys.map((k) => COLUMNS[k]).join(', ')}, created_by, updated_by, created_at, updated_at)
       VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}, $${keys.length + 1}, $${keys.length + 1}, $${keys.length + 2}, $${keys.length + 2})
       RETURNING *`,
      params,
    );
    await audit(tx, {
      actor, ip, action: 'curso.crear', entityType: 'curso', entityId: row.id, courseId: row.id, companyId: row.company_id,
      summary: `Curso «${row.title}» creado como borrador.`,
    });
    return courseRow(row);
  });
}

export async function updateCourse(db, id, input, { actor, ip }) {
  return db.tx(async (tx) => {
    const before = await lockCourse(tx, id);
    if (before.status === 'archivado') throw conflict('El curso está archivado. Restáuralo para editarlo.');
    const kind = input.kind ?? before.kind;
    let companyId = has(input, 'companyId') ? input.companyId : before.company_id;
    if (kind === 'edvanta') companyId = null;
    if (kind === 'empresa' && !companyId) throw badRequest('Elige la empresa de esta capacitación.', { field: 'companyId' });
    if (kind !== before.kind || companyId !== before.company_id) {
      const used = await one(
        tx,
        `SELECT (SELECT count(*)::int FROM aula_enrollments WHERE course_id = $1) AS enrollments,
                (SELECT count(*)::int FROM aula_assignments WHERE course_id = $1 AND revoked_at IS NULL) AS assignments`,
        [id],
      );
      if (used.enrollments || used.assignments) {
        throw conflict('No se puede cambiar el tipo ni la empresa de un curso que ya tiene participantes. Duplícalo para otra empresa.', { field: 'companyId' });
      }
      if (companyId) await assertCompany(tx, companyId);
      input.kind = kind;
      input.companyId = companyId;
    }
    if (has(input, 'coverFileId')) await assertCover(tx, input.coverFileId);
    const from = has(input, 'availableFrom') ? input.availableFrom : before.available_from;
    const until = has(input, 'availableUntil') ? input.availableUntil : before.available_until;
    if (from && until && new Date(until) <= new Date(from)) {
      throw badRequest('La fecha de cierre debe ser posterior a la de apertura.', { field: 'availableUntil' });
    }

    const sets = [];
    const params = [id];
    const changed = {};
    for (const [key, column] of Object.entries(COLUMNS)) {
      if (!has(input, key)) continue;
      params.push(input[key]);
      sets.push(`${column} = $${params.length}`);
      changed[key] = input[key];
    }
    if (!sets.length) return getCourse(tx, id);
    params.push(actor.id);
    await tx.query(`UPDATE aula_courses SET ${sets.join(', ')}, updated_by = $${params.length} WHERE id = $1`, params);

    const rulesTouched = VERSIONED_RULES.filter((k) => has(changed, k));
    await audit(tx, {
      actor, ip, action: 'curso.editar', entityType: 'curso', entityId: id, courseId: id, companyId,
      summary: `Curso «${input.title || before.title}» editado${rulesTouched.length && before.current_version_id ? ' (las reglas nuevas se aplican al publicar)' : ''}.`,
      before: Object.fromEntries(Object.keys(changed).map((k) => [k, before[COLUMNS[k]]])),
      after: changed,
    });
    return getCourse(tx, id);
  });
}

/** Borrador ↔ en revisión, archivar y restaurar. Publicar tiene su propia función. */
export async function setCourseStatus(db, id, target, { actor, ip, reason = null }) {
  return db.tx(async (tx) => {
    const c = await lockCourse(tx, id);
    const allowed = {
      en_revision: ['borrador'],
      borrador: ['en_revision'],
      archivado: ['borrador', 'en_revision', 'publicado'],
    };
    let next = target;
    if (target === 'restaurar') {
      if (c.status !== 'archivado') throw conflict('El curso no está archivado.');
      next = c.current_version_id ? 'publicado' : 'borrador';
    } else if (!allowed[target]?.includes(c.status)) {
      throw conflict(`Un curso en estado «${COURSE_STATUS_LABEL[c.status]}» no puede pasar a «${COURSE_STATUS_LABEL[target] || target}».`);
    }
    await tx.query('UPDATE aula_courses SET status = $2, updated_by = $3 WHERE id = $1', [id, next, actor.id]);
    const active = next === 'archivado'
      ? (await one(tx, 'SELECT count(*)::int AS n FROM aula_enrollments WHERE course_id = $1 AND withdrawn_at IS NULL', [id])).n
      : 0;
    await audit(tx, {
      actor, ip, reason, action: 'curso.estado', entityType: 'curso', entityId: id, courseId: id, companyId: c.company_id,
      summary: `«${c.title}»: ${COURSE_STATUS_LABEL[c.status]} → ${COURSE_STATUS_LABEL[next]}.${active ? ` ${plural(active, 'participante deja', 'participantes dejan')} de verlo; su historial se conserva.` : ''}`,
      before: { status: c.status }, after: { status: next },
    });
    return getCourse(tx, id);
  });
}

/** Solo se eliminan cursos que nunca se publicaron ni se asignaron. */
export async function deleteCourse(db, id, { actor, ip, reason = null, now = new Date() }) {
  return db.tx(async (tx) => {
    const c = await lockCourse(tx, id);
    const used = await one(
      tx,
      `SELECT (SELECT count(*)::int FROM aula_enrollments WHERE course_id = $1) AS enrollments,
              (SELECT count(*)::int FROM aula_course_versions WHERE course_id = $1) AS versions`,
      [id],
    );
    if (used.enrollments || used.versions) {
      throw conflict('Este curso ya se publicó o tiene participantes. Archívalo para conservar su historial.');
    }
    await tx.query('UPDATE aula_courses SET deleted_at = $2, updated_by = $3 WHERE id = $1', [id, now, actor.id]);
    await audit(tx, {
      actor, ip, reason, action: 'curso.eliminar', entityType: 'curso', entityId: id, courseId: id, companyId: c.company_id,
      summary: `Borrador «${c.title}» eliminado.`,
    });
    return { ok: true };
  });
}

/**
 * Copia la copia de trabajo (módulos, clases, bloques y recursos) en un
 * curso nuevo en borrador. Sirve para adaptar un curso a otra empresa.
 */
export async function duplicateCourse(db, id, { title, kind, companyId } = {}, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const src = await lockCourse(tx, id);
    const targetKind = kind || src.kind;
    const targetCompany = targetKind === 'empresa' ? (companyId ?? src.company_id) : null;
    if (targetKind === 'empresa') {
      if (!targetCompany) throw badRequest('Elige la empresa de la copia.', { field: 'companyId' });
      await assertCompany(tx, targetCompany);
    }
    const copy = await one(
      tx,
      `INSERT INTO aula_courses
         (kind, company_id, title, short_description, description_html, cover_file_id, category, level, tags,
          objective, learning_outcomes, audience, prerequisites, duration_minutes, author_name, modality,
          passing_score, max_attempts, sequential, video_completion_pct, resources_enabled,
          status, created_by, updated_by, created_at, updated_at)
       SELECT $2, $3, $4, short_description, description_html, cover_file_id, category, level, tags,
              objective, learning_outcomes, audience, prerequisites, duration_minutes, author_name, modality,
              passing_score, max_attempts, sequential, video_completion_pct, resources_enabled,
              'borrador', $5, $5, $6, $6
         FROM aula_courses WHERE id = $1
       RETURNING *`,
      [id, targetKind, targetCompany, title?.trim() || `${src.title} (copia)`, actor.id, now],
    );
    await copyStructure(tx, { fromCourseId: id, toCourseId: copy.id });
    await copyResources(tx, { fromCourseId: id, toCourseId: copy.id, actor, now });
    await audit(tx, {
      actor, ip, action: 'curso.duplicar', entityType: 'curso', entityId: copy.id, courseId: copy.id, companyId: copy.company_id,
      summary: `«${copy.title}» creado como copia de «${src.title}».`,
      after: { sourceCourseId: id },
    });
    return courseRow(copy);
  });
}

async function copyStructure(tx, { fromCourseId, toCourseId }) {
  const modules = await many(
    tx,
    'SELECT id FROM aula_modules WHERE course_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id',
    [fromCourseId],
  );
  for (const [index, m] of modules.entries()) {
    await copyModuleInto(tx, { moduleId: m.id, courseId: toCourseId, sortOrder: index, keepTitle: true });
  }
}

async function copyResources(tx, { fromCourseId, toCourseId, actor, now }) {
  const categories = await many(
    tx,
    'SELECT id, name, sort_order FROM aula_resource_categories WHERE course_id = $1 AND deleted_at IS NULL',
    [fromCourseId],
  );
  const categoryMap = new Map();
  for (const cat of categories) {
    const row = await one(
      tx,
      'INSERT INTO aula_resource_categories (course_id, name, sort_order) VALUES ($1, $2, $3) RETURNING id',
      [toCourseId, cat.name, cat.sort_order],
    );
    categoryMap.set(cat.id, row.id);
  }
  const resources = await many(
    tx,
    `SELECT r.*, v.file_id, v.external_url, v.notes
       FROM aula_resources r
       JOIN aula_resource_versions v ON v.id = r.current_version_id
      WHERE r.course_id = $1 AND r.deleted_at IS NULL AND r.status <> 'archivado'`,
    [fromCourseId],
  );
  for (const r of resources) {
    const copy = await one(
      tx,
      `INSERT INTO aula_resources (course_id, category_id, title, description, status, allow_download, sort_order, created_by)
       VALUES ($1, $2, $3, $4, 'borrador', $5, $6, $7) RETURNING id`,
      [toCourseId, categoryMap.get(r.category_id) ?? null, r.title, r.description, r.allow_download, r.sort_order, actor.id],
    );
    const version = await one(
      tx,
      `INSERT INTO aula_resource_versions (resource_id, version_number, file_id, external_url, notes, created_by, created_by_email, created_at)
       VALUES ($1, 1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [copy.id, r.file_id, r.external_url, 'Copiado de otro curso.', actor.id, actor.email, now],
    );
    await tx.query('UPDATE aula_resources SET current_version_id = $2 WHERE id = $1', [copy.id, version.id]);
  }
}

// ── Publicación y versiones ────────────────────────────────

async function enrollmentImpact(db, courseId, currentVersionId) {
  const rows = await many(
    db,
    `SELECT CASE
              WHEN e.course_version_id IS NULL THEN 'sin_version'
              WHEN e.progress_status = 'completado' THEN 'completado'
              WHEN e.first_access_at IS NULL AND e.progress_status = 'no_iniciado' THEN 'sin_empezar'
              ELSE 'en_curso'
            END AS bucket,
            (e.course_version_id IS NOT DISTINCT FROM $2::bigint) AS on_current,
            count(*)::int AS n
       FROM aula_enrollments e
      WHERE e.course_id = $1 AND e.withdrawn_at IS NULL
      GROUP BY 1, 2`,
    [courseId, currentVersionId],
  );
  const sum = (bucket) => rows.filter((r) => r.bucket === bucket).reduce((s, r) => s + r.n, 0);
  return {
    total: rows.reduce((s, r) => s + r.n, 0),
    automatic: sum('sin_version') + sum('sin_empezar'),
    inProgress: sum('en_curso'),
    completed: sum('completado'),
    onOlderVersions: rows.filter((r) => !r.on_current && r.bucket !== 'sin_version').reduce((s, r) => s + r.n, 0),
  };
}

/** Lo que el administrador ve antes de publicar. */
export async function publishCheck(db, id) {
  const course = await loadCourse(db, id);
  const snapshot = await buildSnapshot(db, id);
  const { errors, warnings } = validateSnapshot(snapshot, course);
  const published = course.published_snapshot;
  const unchanged = Boolean(published) && published.fingerprint === snapshot.fingerprint;
  return {
    canPublish: !errors.length && !unchanged,
    unchanged,
    errors,
    warnings,
    nextVersion: (await one(db, 'SELECT COALESCE(max(version_number), 0)::int AS n FROM aula_course_versions WHERE course_id = $1', [id])).n + 1,
    diff: diffSnapshots(published, snapshot),
    impact: await enrollmentImpact(db, id, course.current_version_id),
    totals: snapshot.totals,
  };
}

export async function publishCourse(db, id, {
  changeSummary = '', mandatory = false, reopenCompleted = false,
}, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const locked = await lockCourse(tx, id);
    const course = await loadCourse(tx, id);
    const snapshot = await buildSnapshot(tx, id);
    const { errors } = validateSnapshot(snapshot, course);
    if (errors.length) {
      throw badRequest('El curso aún no se puede publicar. Revisa los puntos pendientes.', { code: 'curso_incompleto', problems: errors });
    }
    const previous = course.published_snapshot;
    if (previous && previous.fingerprint === snapshot.fingerprint) {
      throw conflict('No hay cambios de contenido ni de reglas desde la última versión publicada.');
    }
    if (previous && changeSummary.trim().length < 5) {
      throw badRequest('Cuéntale al equipo qué cambió en esta versión (mínimo 5 caracteres).', { field: 'changeSummary' });
    }
    const diff = diffSnapshots(previous, snapshot);
    const { n: count } = await one(tx, 'SELECT COALESCE(max(version_number), 0)::int AS n FROM aula_course_versions WHERE course_id = $1', [id]);
    const versionNumber = count + 1;
    const version = await one(
      tx,
      `INSERT INTO aula_course_versions
         (course_id, version_number, change_summary, snapshot, is_mandatory_update, published_by, published_by_email, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, version_number, published_at`,
      [id, versionNumber, changeSummary.trim() || 'Primera publicación.', JSON.stringify(snapshot),
        Boolean(previous) && mandatory, actor.id, actor.email, now],
    );
    for (const [fileId, meta] of Object.entries(snapshot.files)) {
      await tx.query(
        'INSERT INTO aula_version_files (course_version_id, file_id, downloadable) VALUES ($1, $2, $3)',
        [version.id, Number(fileId), meta.downloadable],
      );
    }
    await tx.query(
      `UPDATE aula_courses
          SET status = 'publicado', current_version_id = $2, published_at = COALESCE(published_at, $3), updated_by = $4
        WHERE id = $1`,
      [id, version.id, now, actor.id],
    );

    // Quién pasa a la versión nueva.
    const moved = await many(
      tx,
      `UPDATE aula_enrollments e
          SET course_version_id = $2
         FROM (SELECT id, course_version_id AS old_version, first_access_at IS NOT NULL AS started, progress_status
                 FROM aula_enrollments WHERE course_id = $1 AND withdrawn_at IS NULL) prev
        WHERE e.id = prev.id
          AND (
               prev.old_version IS NULL
            OR (NOT prev.started AND prev.progress_status = 'no_iniciado')
            OR ($3 AND prev.progress_status <> 'completado')
            OR ($3 AND $4 AND prev.progress_status = 'completado')
          )
      RETURNING e.id, e.user_id, prev.old_version, prev.started, prev.progress_status`,
      [id, version.id, Boolean(previous) && mandatory, Boolean(reopenCompleted)],
    );
    for (const m of moved) await recomputeEnrollment(tx, m.id, { now });

    const title = course.title;
    const link = `/aula/curso/${id}`;
    if (!previous) {
      for (const m of moved) {
        await notify(tx, {
          userId: m.user_id, type: 'curso_disponible', title: `Ya puedes empezar «${title}»`,
          link, dedupeKey: `curso_disponible:${id}`, now,
        });
      }
    } else if (mandatory) {
      for (const m of moved.filter((x) => x.started)) {
        await notify(tx, {
          userId: m.user_id, type: 'actualizacion_obligatoria', title: `«${title}» tiene una actualización obligatoria`,
          body: changeSummary.trim(), link, dedupeKey: `actualizacion:${version.id}`, now,
        });
      }
    }

    const reopened = moved.filter((m) => m.progress_status === 'completado').length;
    const reassigned = moved.filter((m) => m.old_version && m.started).length;
    await audit(tx, {
      actor, ip, action: 'curso.publicar', entityType: 'curso', entityId: id, courseId: id, companyId: locked.company_id,
      summary: `Versión ${versionNumber} de «${title}» publicada. ${plural(moved.length, 'inscripción pasa', 'inscripciones pasan')} a esta versión.`,
      after: { versionId: version.id, versionNumber, mandatory: Boolean(previous) && mandatory, reopenCompleted, diff },
    });
    if (reassigned) {
      await audit(tx, {
        actor, ip, action: 'inscripcion.actualizacion', entityType: 'curso', entityId: id, courseId: id, companyId: locked.company_id,
        summary: `Actualización obligatoria de «${title}»: ${plural(reassigned, 'participante en curso pasa', 'participantes en curso pasan')} a la versión ${versionNumber}${reopened ? `; ${plural(reopened, 'curso completado se reabre', 'cursos completados se reabren')}` : ''}.`,
        after: { enrollmentIds: moved.filter((m) => m.old_version && m.started).map((m) => m.id), fromVersions: [...new Set(moved.map((m) => m.old_version).filter(Boolean))] },
      });
    }
    return {
      version: { id: version.id, number: versionNumber, publishedAt: version.published_at },
      moved: moved.length,
      reassigned,
      reopened,
    };
  });
}

export async function listVersions(db, courseId) {
  await loadCourse(db, courseId);
  const rows = await many(
    db,
    `SELECT v.id, v.version_number, v.change_summary, v.is_mandatory_update, v.published_by_email, v.published_at,
            (v.snapshot->'totals') AS totals,
            (SELECT count(*)::int FROM aula_enrollments e WHERE e.course_version_id = v.id AND e.withdrawn_at IS NULL) AS enrollments
       FROM aula_course_versions v WHERE v.course_id = $1 ORDER BY v.version_number DESC`,
    [courseId],
  );
  return rows.map((r) => ({
    id: r.id,
    number: r.version_number,
    changeSummary: r.change_summary,
    mandatory: r.is_mandatory_update,
    publishedBy: r.published_by_email,
    publishedAt: r.published_at,
    totals: r.totals,
    enrollments: r.enrollments,
  }));
}

export async function getVersion(db, courseId, versionId) {
  const v = await one(
    db,
    'SELECT id, version_number, change_summary, snapshot, published_at, published_by_email FROM aula_course_versions WHERE id = $1 AND course_id = $2',
    [versionId, courseId],
  );
  if (!v) throw notFound('No encontramos esa versión.');
  return { id: v.id, number: v.version_number, changeSummary: v.change_summary, publishedAt: v.published_at, publishedBy: v.published_by_email, snapshot: v.snapshot };
}

// ── Participantes del curso ────────────────────────────────

export async function listCourseEnrollments(db, courseId, query) {
  await loadCourse(db, courseId);
  const pg = paging(query);
  const sort = sorting(query, {
    name: 'lower(u.first_name || u.last_name)', progress: 'e.progress_pct', assignedAt: 'e.assigned_at', dueAt: 'e.due_at',
  }, 'assignedAt');
  const w = whereBuilder(['e.course_id = $1']);
  w.params.push(courseId);
  if (query.withdrawn === '1') w.and('e.withdrawn_at IS NOT NULL');
  else w.and('e.withdrawn_at IS NULL');
  if (query.q?.trim()) {
    const p = w.param(`%${query.q.trim()}%`);
    w.and(`(u.email ILIKE ${p} OR (u.first_name || ' ' || u.last_name) ILIKE ${p})`);
  }
  if (typeof query.status === 'string' && /^[a-z_]+$/.test(query.status)) w.and(`e.effective_status = ${w.param(query.status)}`);
  if (/^\d+$/.test(query.groupId || '')) {
    w.and(`EXISTS (SELECT 1 FROM aula_group_members gm WHERE gm.user_id = u.id AND gm.group_id = ${w.param(Number(query.groupId))} AND gm.removed_at IS NULL)`);
  }
  const from = `FROM aula_enrollments_v e
    JOIN aula_users u ON u.id = e.user_id
    LEFT JOIN aula_companies co ON co.id = u.company_id
    LEFT JOIN aula_course_versions v ON v.id = e.course_version_id
    LEFT JOIN aula_assignments a ON a.id = e.assignment_id`;
  const total = (await one(db, `SELECT count(*)::int AS n ${from} ${w.sql}`, w.params)).n;
  const rows = await many(
    db,
    `SELECT e.*, u.first_name, u.last_name, u.email, u.status AS user_status, co.name AS company_name,
            v.version_number, a.target_type
       ${from} ${w.sql}
      ORDER BY ${sort.column} ${sort.dir} NULLS LAST, e.id LIMIT ${pg.size} OFFSET ${pg.offset}`,
    w.params,
  );
  return pageResult(rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    fullName: `${r.first_name} ${r.last_name}`.trim(),
    email: r.email,
    companyName: r.company_name,
    status: r.effective_status,
    progressPct: r.progress_pct,
    lessons: { done: r.lessons_done, required: r.lessons_required },
    versionNumber: r.version_number,
    assignedVia: r.target_type,
    assignedAt: r.assigned_at,
    dueAt: r.due_at,
    lastAccessAt: r.last_access_at,
    completedAt: r.completed_at,
    withdrawnAt: r.withdrawn_at,
  })), total, pg);
}

export async function listCourseAssignments(db, courseId) {
  await loadCourse(db, courseId);
  const rows = await many(
    db,
    `SELECT a.*,
            COALESCE(u.first_name || ' ' || u.last_name, g.name, co.name) AS target_label,
            u.email AS target_email, gco.name AS group_company,
            (SELECT count(*)::int FROM aula_enrollments e WHERE e.assignment_id = a.id AND e.withdrawn_at IS NULL) AS enrollments
       FROM aula_assignments a
       LEFT JOIN aula_users u ON u.id = a.user_id
       LEFT JOIN aula_groups g ON g.id = a.group_id
       LEFT JOIN aula_companies gco ON gco.id = g.company_id
       LEFT JOIN aula_companies co ON co.id = a.company_id
      WHERE a.course_id = $1 AND a.revoked_at IS NULL
      ORDER BY a.created_at DESC`,
    [courseId],
  );
  return rows.map((r) => ({
    id: r.id,
    targetType: r.target_type,
    targetId: r.user_id || r.group_id || r.company_id,
    targetLabel: r.target_label?.trim() || r.target_email,
    targetDetail: r.target_type === 'usuario' ? r.target_email : r.target_type === 'grupo' ? r.group_company : null,
    startsAt: r.starts_at,
    dueAt: r.due_at,
    createdAt: r.created_at,
    enrollments: r.enrollments,
  }));
}
