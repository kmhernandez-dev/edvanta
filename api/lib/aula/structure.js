/**
 * Estructura de un curso: módulos → clases → bloques (copia de trabajo).
 *
 * Nada de esto llega a los participantes hasta publicar. Eliminar es
 * lógico: el avance registrado en clases eliminadas se conserva y las
 * versiones ya publicadas siguen intactas.
 */
import { many, one } from './db.js';
import {
  badRequest, bool, conflict, int, notFound, oneOf, plural, str,
} from './http.js';
import { audit } from './audit.js';
import {
  assertBlockFiles, BLOCK_TYPES, blockDownloadable, blockFileIds, blockSummary, readBlockData,
} from './blocks.js';

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

// ── Validación ──────────────────────────────────────────────

export function readModule(body = {}, { partial = false } = {}) {
  const b = body || {};
  const out = {};
  if (!partial || has(b, 'title')) out.title = str(b.title, 'title', 'El nombre del módulo', { max: 160 });
  if (!partial || has(b, 'description')) out.description = str(b.description, 'description', 'La descripción', { max: 1000, optional: true });
  return out;
}

export function readLesson(body = {}, { partial = false } = {}) {
  const b = body || {};
  const want = (k) => !partial || has(b, k);
  const out = {};
  if (want('title')) out.title = str(b.title, 'title', 'El título de la clase', { max: 160 });
  if (want('subtitle')) out.subtitle = str(b.subtitle, 'subtitle', 'El subtítulo', { max: 300, optional: true });
  if (want('isRequired')) out.isRequired = bool(b.isRequired ?? true, 'isRequired', 'Obligatoria');
  if (want('completionRule')) out.completionRule = oneOf(b.completionRule ?? 'manual', 'completionRule', 'La forma de completar', ['manual', 'video']);
  if (want('minSeconds')) out.minSeconds = int(b.minSeconds ?? 0, 'minSeconds', 'El tiempo mínimo', { min: 0, max: 4 * 60 * 60 });
  if (want('durationMinutes')) out.durationMinutes = int(b.durationMinutes, 'durationMinutes', 'La duración', { min: 0, max: 24 * 60, optional: true });
  return out;
}

const LESSON_COLUMNS = {
  title: 'title', subtitle: 'subtitle', isRequired: 'is_required', completionRule: 'completion_rule',
  minSeconds: 'min_seconds', durationMinutes: 'duration_minutes',
};

// ── Carga con verificación ─────────────────────────────────

async function editableCourse(db, courseId) {
  const c = await one(db, 'SELECT id, title, status, company_id FROM aula_courses WHERE id = $1 AND deleted_at IS NULL', [courseId]);
  if (!c) throw notFound('No encontramos ese curso.');
  if (c.status === 'archivado') throw conflict('El curso está archivado. Restáuralo para editarlo.');
  return c;
}

async function loadModule(db, moduleId) {
  const m = await one(
    db,
    `SELECT m.*, c.title AS course_title, c.status AS course_status, c.company_id
       FROM aula_modules m JOIN aula_courses c ON c.id = m.course_id AND c.deleted_at IS NULL
      WHERE m.id = $1 AND m.deleted_at IS NULL`,
    [moduleId],
  );
  if (!m) throw notFound('No encontramos ese módulo.');
  if (m.course_status === 'archivado') throw conflict('El curso está archivado. Restáuralo para editarlo.');
  return m;
}

async function loadLesson(db, lessonId) {
  const l = await one(
    db,
    `SELECT l.*, m.title AS module_title, c.title AS course_title, c.status AS course_status, c.company_id
       FROM aula_lessons l
       JOIN aula_modules m ON m.id = l.module_id AND m.deleted_at IS NULL
       JOIN aula_courses c ON c.id = l.course_id AND c.deleted_at IS NULL
      WHERE l.id = $1 AND l.deleted_at IS NULL`,
    [lessonId],
  );
  if (!l) throw notFound('No encontramos esa clase.');
  return l;
}

async function loadBlock(db, blockId) {
  const b = await one(
    db,
    `SELECT b.*, l.course_id, c.status AS course_status
       FROM aula_lesson_blocks b
       JOIN aula_lessons l ON l.id = b.lesson_id AND l.deleted_at IS NULL
       JOIN aula_courses c ON c.id = l.course_id AND c.deleted_at IS NULL
      WHERE b.id = $1 AND b.deleted_at IS NULL`,
    [blockId],
  );
  if (!b) throw notFound('No encontramos ese bloque.');
  if (b.course_status === 'archivado') throw conflict('El curso está archivado. Restáuralo para editarlo.');
  return b;
}

const assertEditable = (row) => {
  if (row.course_status === 'archivado') throw conflict('El curso está archivado. Restáuralo para editarlo.');
};

async function nextOrder(db, table, column, value) {
  const r = await one(db, `SELECT COALESCE(max(sort_order), -1) + 1 AS n FROM ${table} WHERE ${column} = $1 AND deleted_at IS NULL`, [value]);
  return r.n;
}

/** Abre un espacio en la posición `after + 1` y devuelve esa posición. */
async function slotAfter(db, table, column, value, afterSortOrder) {
  await db.query(
    `UPDATE ${table} SET sort_order = sort_order + 1 WHERE ${column} = $1 AND deleted_at IS NULL AND sort_order > $2`,
    [value, afterSortOrder],
  );
  return afterSortOrder + 1;
}

/**
 * Aplica un orden nuevo. `ids` debe traer exactamente los elementos
 * activos del contenedor (así no se pierde nada si otra persona editó
 * al mismo tiempo).
 */
async function applyOrder(db, table, column, value, ids, label) {
  const current = await many(db, `SELECT id FROM ${table} WHERE ${column} = $1 AND deleted_at IS NULL`, [value]);
  const expected = new Set(current.map((r) => r.id));
  if (ids.length !== expected.size || ids.some((id) => !expected.has(id))) {
    throw conflict(`La lista de ${label} cambió mientras la ordenabas. Recarga la página e inténtalo de nuevo.`, { code: 'orden_desactualizado' });
  }
  for (const [index, id] of ids.entries()) {
    await db.query(`UPDATE ${table} SET sort_order = $2 WHERE id = $1 AND sort_order IS DISTINCT FROM $2`, [id, index]);
  }
}

// ── Impacto de eliminar ────────────────────────────────────

/** Cuántas personas tienen avance en estas clases y si están publicadas. */
export async function lessonImpact(db, lessonIds, courseId) {
  if (!lessonIds.length) return { started: 0, completed: 0, published: false };
  const r = await one(
    db,
    `SELECT count(DISTINCT lp.enrollment_id)::int AS started,
            count(DISTINCT lp.enrollment_id) FILTER (WHERE lp.status = 'completado')::int AS completed
       FROM aula_lesson_progress lp
       JOIN aula_enrollments e ON e.id = lp.enrollment_id AND e.withdrawn_at IS NULL
      WHERE lp.lesson_id = ANY($1::bigint[])`,
    [lessonIds],
  );
  const v = await one(
    db,
    `SELECT v.snapshot FROM aula_courses c JOIN aula_course_versions v ON v.id = c.current_version_id WHERE c.id = $1`,
    [courseId],
  );
  const publishedIds = new Set((v?.snapshot?.modules || []).flatMap((m) => m.lessons.map((l) => l.id)));
  return { ...r, published: lessonIds.some((id) => publishedIds.has(id)) };
}

export async function moduleImpact(db, moduleId) {
  const m = await loadModule(db, moduleId);
  const lessons = await many(db, 'SELECT id FROM aula_lessons WHERE module_id = $1 AND deleted_at IS NULL', [moduleId]);
  return { lessons: lessons.length, ...(await lessonImpact(db, lessons.map((l) => l.id), m.course_id)) };
}

export async function lessonImpactById(db, lessonId) {
  const l = await loadLesson(db, lessonId);
  const blocks = await one(db, 'SELECT count(*)::int AS n FROM aula_lesson_blocks WHERE lesson_id = $1 AND deleted_at IS NULL', [lessonId]);
  return { blocks: blocks.n, ...(await lessonImpact(db, [lessonId], l.course_id)) };
}

function impactSummary(impact) {
  if (!impact.started) return '';
  return ` ${plural(impact.started, 'participante tenía', 'participantes tenían')} avance (${impact.completed} ${impact.completed === 1 ? 'la había' : 'la habían'} completado); ese historial se conserva.`;
}

// ── Módulos ─────────────────────────────────────────────────

const moduleRow = (m) => ({ id: m.id, courseId: m.course_id, title: m.title, description: m.description || '', sortOrder: m.sort_order });

export async function createModule(db, courseId, input, { afterModuleId = null } = {}) {
  return db.tx(async (tx) => {
    await editableCourse(tx, courseId);
    let order;
    if (afterModuleId) {
      const after = await loadModule(tx, afterModuleId);
      if (after.course_id !== courseId) throw badRequest('Ese módulo es de otro curso.');
      order = await slotAfter(tx, 'aula_modules', 'course_id', courseId, after.sort_order);
    } else {
      order = await nextOrder(tx, 'aula_modules', 'course_id', courseId);
    }
    const m = await one(
      tx,
      'INSERT INTO aula_modules (course_id, title, description, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [courseId, input.title, input.description, order],
    );
    return moduleRow(m);
  });
}

export async function updateModule(db, moduleId, input) {
  await loadModule(db, moduleId);
  const sets = [];
  const params = [moduleId];
  for (const key of ['title', 'description']) {
    if (!has(input, key)) continue;
    params.push(input[key]);
    sets.push(`${key} = $${params.length}`);
  }
  if (!sets.length) return moduleRow(await loadModule(db, moduleId));
  return moduleRow(await one(db, `UPDATE aula_modules SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params));
}

export async function deleteModule(db, moduleId, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const m = await loadModule(tx, moduleId);
    const impact = await moduleImpact(tx, moduleId);
    await tx.query('UPDATE aula_lessons SET deleted_at = $2 WHERE module_id = $1 AND deleted_at IS NULL', [moduleId, now]);
    await tx.query('UPDATE aula_modules SET deleted_at = $2 WHERE id = $1', [moduleId, now]);
    await audit(tx, {
      actor, ip, action: 'contenido.eliminar', entityType: 'modulo', entityId: moduleId, courseId: m.course_id, companyId: m.company_id,
      summary: `Módulo «${m.title}» eliminado de «${m.course_title}» (${plural(impact.lessons, 'clase', 'clases')}).${impactSummary(impact)}`,
      after: impact,
    });
    return impact;
  });
}

export async function reorderModules(db, courseId, ids) {
  return db.tx(async (tx) => {
    await editableCourse(tx, courseId);
    await applyOrder(tx, 'aula_modules', 'course_id', courseId, ids, 'módulos');
    return { ok: true };
  });
}

/** Copia un módulo con sus clases y bloques dentro de un curso. */
export async function copyModuleInto(db, { moduleId, courseId, sortOrder, keepTitle = false }) {
  const src = await one(db, 'SELECT * FROM aula_modules WHERE id = $1', [moduleId]);
  const m = await one(
    db,
    'INSERT INTO aula_modules (course_id, title, description, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
    [courseId, keepTitle ? src.title : `${src.title} (copia)`, src.description, sortOrder],
  );
  const lessons = await many(
    db,
    'SELECT id, sort_order FROM aula_lessons WHERE module_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id',
    [moduleId],
  );
  for (const l of lessons) {
    await copyLessonInto(db, { lessonId: l.id, moduleId: m.id, courseId, sortOrder: l.sort_order, keepTitle: true });
  }
  return m;
}

export async function duplicateModule(db, moduleId) {
  return db.tx(async (tx) => {
    const src = await loadModule(tx, moduleId);
    const order = await slotAfter(tx, 'aula_modules', 'course_id', src.course_id, src.sort_order);
    return moduleRow(await copyModuleInto(tx, { moduleId, courseId: src.course_id, sortOrder: order }));
  });
}

// ── Clases ──────────────────────────────────────────────────

const lessonRow = (l) => ({
  id: l.id,
  courseId: l.course_id,
  moduleId: l.module_id,
  title: l.title,
  subtitle: l.subtitle || '',
  isRequired: l.is_required,
  completionRule: l.completion_rule,
  minSeconds: l.min_seconds,
  durationMinutes: l.duration_minutes,
  sortOrder: l.sort_order,
  updatedAt: l.updated_at,
});

export async function createLesson(db, moduleId, input, { afterLessonId = null } = {}) {
  return db.tx(async (tx) => {
    const m = await loadModule(tx, moduleId);
    let order;
    if (afterLessonId) {
      const after = await loadLesson(tx, afterLessonId);
      if (after.module_id !== moduleId) throw badRequest('Esa clase es de otro módulo.');
      order = await slotAfter(tx, 'aula_lessons', 'module_id', moduleId, after.sort_order);
    } else {
      order = await nextOrder(tx, 'aula_lessons', 'module_id', moduleId);
    }
    const l = await one(
      tx,
      `INSERT INTO aula_lessons (course_id, module_id, title, subtitle, is_required, completion_rule, min_seconds, duration_minutes, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [m.course_id, moduleId, input.title, input.subtitle, input.isRequired, input.completionRule, input.minSeconds, input.durationMinutes, order],
    );
    return lessonRow(l);
  });
}

export async function updateLesson(db, lessonId, input) {
  const l = await loadLesson(db, lessonId);
  assertEditable(l);
  const sets = [];
  const params = [lessonId];
  for (const [key, column] of Object.entries(LESSON_COLUMNS)) {
    if (!has(input, key)) continue;
    params.push(input[key]);
    sets.push(`${column} = $${params.length}`);
  }
  if (!sets.length) return lessonRow(l);
  return lessonRow(await one(db, `UPDATE aula_lessons SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params));
}

export async function deleteLesson(db, lessonId, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const l = await loadLesson(tx, lessonId);
    assertEditable(l);
    const impact = await lessonImpactById(tx, lessonId);
    await tx.query('UPDATE aula_lessons SET deleted_at = $2 WHERE id = $1', [lessonId, now]);
    await audit(tx, {
      actor, ip, action: 'contenido.eliminar', entityType: 'clase', entityId: lessonId, courseId: l.course_id, companyId: l.company_id,
      summary: `Clase «${l.title}» eliminada de «${l.course_title}».${impactSummary(impact)}`,
      after: impact,
    });
    return impact;
  });
}

export async function reorderLessons(db, moduleId, ids) {
  return db.tx(async (tx) => {
    await loadModule(tx, moduleId);
    await applyOrder(tx, 'aula_lessons', 'module_id', moduleId, ids, 'clases');
    return { ok: true };
  });
}

/** Mueve una clase a otro módulo del mismo curso, en la posición indicada. */
export async function moveLesson(db, lessonId, { moduleId, position }) {
  return db.tx(async (tx) => {
    const l = await loadLesson(tx, lessonId);
    assertEditable(l);
    const target = await loadModule(tx, moduleId);
    if (target.course_id !== l.course_id) throw badRequest('Solo puedes mover clases dentro del mismo curso.');
    const siblings = (await many(
      tx,
      'SELECT id FROM aula_lessons WHERE module_id = $1 AND deleted_at IS NULL AND id <> $2 ORDER BY sort_order, id',
      [moduleId, lessonId],
    )).map((r) => r.id);
    const at = Math.max(0, Math.min(Number.isInteger(position) ? position : siblings.length, siblings.length));
    siblings.splice(at, 0, lessonId);
    await tx.query('UPDATE aula_lessons SET module_id = $2 WHERE id = $1', [lessonId, moduleId]);
    for (const [index, id] of siblings.entries()) {
      await tx.query('UPDATE aula_lessons SET sort_order = $2 WHERE id = $1 AND sort_order IS DISTINCT FROM $2', [id, index]);
    }
    return lessonRow(await loadLesson(tx, lessonId));
  });
}

export async function copyLessonInto(db, { lessonId, moduleId, courseId, sortOrder, keepTitle = false }) {
  const src = await one(db, 'SELECT * FROM aula_lessons WHERE id = $1', [lessonId]);
  const l = await one(
    db,
    `INSERT INTO aula_lessons (course_id, module_id, title, subtitle, is_required, completion_rule, min_seconds, duration_minutes, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [courseId, moduleId, keepTitle ? src.title : `${src.title} (copia)`, src.subtitle, src.is_required,
      src.completion_rule, src.min_seconds, src.duration_minutes, sortOrder],
  );
  const blocks = await many(
    db,
    'SELECT id FROM aula_lesson_blocks WHERE lesson_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id',
    [lessonId],
  );
  for (const [index, b] of blocks.entries()) await copyBlockInto(db, { blockId: b.id, lessonId: l.id, sortOrder: index });
  return l;
}

export async function duplicateLesson(db, lessonId) {
  return db.tx(async (tx) => {
    const src = await loadLesson(tx, lessonId);
    assertEditable(src);
    const order = await slotAfter(tx, 'aula_lessons', 'module_id', src.module_id, src.sort_order);
    return lessonRow(await copyLessonInto(tx, { lessonId, moduleId: src.module_id, courseId: src.course_id, sortOrder: order }));
  });
}

// ── Bloques ─────────────────────────────────────────────────

async function filesMeta(db, ids) {
  if (!ids.length) return {};
  const rows = await many(
    db,
    'SELECT id, original_name, mime_type, extension, size_bytes, status FROM aula_files WHERE id = ANY($1::bigint[])',
    [ids],
  );
  return Object.fromEntries(rows.map((f) => [f.id, {
    name: f.original_name, mime: f.mime_type, extension: f.extension, size: f.size_bytes, status: f.status,
  }]));
}

const blockRow = (b) => ({
  id: b.id,
  lessonId: b.lesson_id,
  type: b.type,
  data: b.data,
  allowDownload: blockDownloadable(b.type, b.allow_download),
  sortOrder: b.sort_order,
  summary: blockSummary(b.type, b.data),
  updatedAt: b.updated_at,
});

async function syncBlockFiles(db, blockId, fileIds) {
  await db.query('DELETE FROM aula_block_files WHERE block_id = $1', [blockId]);
  for (const [index, fileId] of [...new Set(fileIds)].entries()) {
    await db.query('INSERT INTO aula_block_files (block_id, file_id, sort_order) VALUES ($1, $2, $3)', [blockId, fileId, index]);
  }
}

/** La clase con sus bloques y el contexto para navegar en el editor. */
export async function getLesson(db, lessonId) {
  const l = await loadLesson(db, lessonId);
  const blocks = await many(
    db,
    'SELECT * FROM aula_lesson_blocks WHERE lesson_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id',
    [lessonId],
  );
  const siblings = await many(
    db,
    `SELECT l.id, l.title FROM aula_lessons l
       JOIN aula_modules m ON m.id = l.module_id AND m.deleted_at IS NULL
      WHERE l.course_id = $1 AND l.deleted_at IS NULL
      ORDER BY m.sort_order, m.id, l.sort_order, l.id`,
    [l.course_id],
  );
  const index = siblings.findIndex((s) => s.id === l.id);
  const fileIds = blocks.flatMap((b) => blockFileIds(b.type, b.data));
  return {
    ...lessonRow(l),
    courseTitle: l.course_title,
    courseStatus: l.course_status,
    moduleTitle: l.module_title,
    blocks: blocks.map(blockRow),
    files: await filesMeta(db, fileIds),
    previous: siblings[index - 1] || null,
    next: siblings[index + 1] || null,
    position: index + 1,
    totalLessons: siblings.length,
    blockTypes: Object.entries(BLOCK_TYPES)
      .filter(([, def]) => def.available)
      .map(([type, def]) => ({ type, label: def.label, downloadable: def.downloadable })),
  };
}

export function readBlockInput(body = {}, { partial = false, type = null } = {}) {
  const b = body || {};
  const blockType = type || oneOf(b.type, 'type', 'El tipo de bloque', Object.keys(BLOCK_TYPES));
  const out = { type: blockType };
  if (!partial || has(b, 'data')) Object.assign(out, readBlockData(blockType, b.data));
  if (!partial || has(b, 'allowDownload')) out.allowDownload = bool(b.allowDownload, 'allowDownload', 'Permitir descarga', { optional: true });
  return out;
}

export async function createBlock(db, lessonId, input, { afterBlockId = null } = {}) {
  return db.tx(async (tx) => {
    const l = await loadLesson(tx, lessonId);
    assertEditable(l);
    await assertBlockFiles(tx, input.files);
    let order;
    if (afterBlockId) {
      const after = await loadBlock(tx, afterBlockId);
      if (after.lesson_id !== lessonId) throw badRequest('Ese bloque es de otra clase.');
      order = await slotAfter(tx, 'aula_lesson_blocks', 'lesson_id', lessonId, after.sort_order);
    } else if (afterBlockId === 0) {
      order = await slotAfter(tx, 'aula_lesson_blocks', 'lesson_id', lessonId, -1);
    } else {
      order = await nextOrder(tx, 'aula_lesson_blocks', 'lesson_id', lessonId);
    }
    const b = await one(
      tx,
      `INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data, allow_download)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [lessonId, input.type, order, JSON.stringify(input.data), Boolean(input.allowDownload)],
    );
    await syncBlockFiles(tx, b.id, input.files.map((f) => f.fileId));
    return { block: blockRow(b), files: await filesMeta(tx, input.files.map((f) => f.fileId)) };
  });
}

export async function updateBlock(db, blockId, body) {
  return db.tx(async (tx) => {
    const current = await loadBlock(tx, blockId);
    const input = readBlockInput(body, { partial: true, type: current.type });
    const sets = [];
    const params = [blockId];
    if (input.data) {
      await assertBlockFiles(tx, input.files);
      params.push(JSON.stringify(input.data));
      sets.push(`data = $${params.length}`);
    }
    if (has(input, 'allowDownload')) {
      params.push(Boolean(input.allowDownload));
      sets.push(`allow_download = $${params.length}`);
    }
    if (!sets.length) return { block: blockRow(current), files: {} };
    const b = await one(tx, `UPDATE aula_lesson_blocks SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
    if (input.data) await syncBlockFiles(tx, blockId, input.files.map((f) => f.fileId));
    return { block: blockRow(b), files: await filesMeta(tx, blockFileIds(b.type, b.data)) };
  });
}

export async function deleteBlock(db, blockId, { now = new Date() } = {}) {
  const b = await loadBlock(db, blockId);
  await db.query('UPDATE aula_lesson_blocks SET deleted_at = $2 WHERE id = $1', [blockId, now]);
  return { ok: true, type: b.type };
}

export async function reorderBlocks(db, lessonId, ids) {
  return db.tx(async (tx) => {
    const l = await loadLesson(tx, lessonId);
    assertEditable(l);
    await applyOrder(tx, 'aula_lesson_blocks', 'lesson_id', lessonId, ids, 'bloques');
    return { ok: true };
  });
}

async function copyBlockInto(db, { blockId, lessonId, sortOrder }) {
  const src = await one(db, 'SELECT * FROM aula_lesson_blocks WHERE id = $1', [blockId]);
  const b = await one(
    db,
    `INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data, allow_download)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [lessonId, src.type, sortOrder, JSON.stringify(src.data), src.allow_download],
  );
  await syncBlockFiles(db, b.id, blockFileIds(src.type, src.data));
  return b;
}

export async function duplicateBlock(db, blockId) {
  return db.tx(async (tx) => {
    const src = await loadBlock(tx, blockId);
    const order = await slotAfter(tx, 'aula_lesson_blocks', 'lesson_id', src.lesson_id, src.sort_order);
    const b = await copyBlockInto(tx, { blockId, lessonId: src.lesson_id, sortOrder: order });
    return { block: blockRow(b), files: await filesMeta(tx, blockFileIds(b.type, b.data)) };
  });
}

