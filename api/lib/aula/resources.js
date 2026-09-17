/**
 * Recursos de trabajo de un curso (guías, formatos, fichas…).
 *
 * Cada recurso tiene versiones inmutables: reemplazar el archivo crea una
 * versión nueva con una nota de qué cambió, y la anterior queda en el
 * historial. Los participantes ven solo la versión vigente de los
 * recursos publicados, y solo si el curso tiene la biblioteca activa.
 * El contenido lo carga el equipo de Edvanta: el aula no genera textos.
 */
import { many, one } from './db.js';
import {
  badRequest, bool, conflict, id as idField, notFound, oneOf, str,
} from './http.js';
import { audit } from './audit.js';
import { notify } from './notify.js';
import { requireOpenEnrollment } from './access.js';

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export const RESOURCE_STATUS_LABEL = { borrador: 'Borrador', publicado: 'Publicado', archivado: 'Archivado' };

// ── Validación ──────────────────────────────────────────────

export function readCategory(body = {}) {
  return { name: str(body?.name, 'name', 'El nombre de la categoría', { max: 80 }) };
}

export function readResource(body = {}, { partial = false } = {}) {
  const b = body || {};
  const want = (k) => !partial || has(b, k);
  const out = {};
  if (want('title')) out.title = str(b.title, 'title', 'El título', { max: 160 });
  if (want('description')) out.description = str(b.description, 'description', 'La descripción', { max: 1000, optional: true });
  if (want('categoryId')) {
    out.categoryId = b.categoryId === null || b.categoryId === undefined || b.categoryId === ''
      ? null : idField(b.categoryId, 'categoryId', 'La categoría');
  }
  if (want('allowDownload')) out.allowDownload = bool(b.allowDownload ?? true, 'allowDownload', 'Permitir descarga');
  return out;
}

export function readVersion(body = {}, { first = false } = {}) {
  const b = body || {};
  const hasFile = b.fileId !== undefined && b.fileId !== null && b.fileId !== '';
  const hasUrl = typeof b.url === 'string' && b.url.trim() !== '';
  if (hasFile === hasUrl) {
    throw badRequest('Sube un archivo o indica un enlace (uno de los dos).', { field: hasFile ? 'url' : 'fileId' });
  }
  let url = null;
  if (hasUrl) {
    try {
      const u = new URL(b.url.trim());
      if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('protocolo');
      url = u.toString();
    } catch {
      throw badRequest('El enlace debe ser una dirección web (https://…).', { field: 'url' });
    }
  }
  const notes = str(b.notes, 'notes', 'La nota de la versión', { max: 500, optional: true });
  if (!first && (!notes || notes.length < 5)) {
    throw badRequest('Cuenta qué cambió en esta versión (mínimo 5 caracteres).', { field: 'notes' });
  }
  return { fileId: hasFile ? idField(b.fileId, 'fileId', 'El archivo') : null, url, notes };
}

async function assertResourceFile(db, fileId) {
  if (!fileId) return;
  const f = await one(db, "SELECT id FROM aula_files WHERE id = $1 AND purpose = 'recurso' AND status = 'listo' AND deleted_at IS NULL", [fileId]);
  if (!f) throw badRequest('El archivo no terminó de subirse. Espera a que termine o vuelve a subirlo.', { field: 'fileId' });
}

async function loadCourse(db, courseId) {
  const c = await one(db, 'SELECT id, title, company_id, status, resources_enabled FROM aula_courses WHERE id = $1 AND deleted_at IS NULL', [courseId]);
  if (!c) throw notFound('No encontramos ese curso.');
  return c;
}

async function loadResource(db, resourceId, { lock = false } = {}) {
  const r = await one(
    db,
    `SELECT r.*, c.title AS course_title, c.company_id
       FROM aula_resources r JOIN aula_courses c ON c.id = r.course_id AND c.deleted_at IS NULL
      WHERE r.id = $1 AND r.deleted_at IS NULL ${lock ? 'FOR UPDATE OF r' : ''}`,
    [resourceId],
  );
  if (!r) throw notFound('No encontramos ese recurso.');
  return r;
}

async function assertCategory(db, courseId, categoryId) {
  if (!categoryId) return;
  const cat = await one(db, 'SELECT id FROM aula_resource_categories WHERE id = $1 AND course_id = $2 AND deleted_at IS NULL', [categoryId, courseId]);
  if (!cat) throw badRequest('Esa categoría no existe en este curso.', { field: 'categoryId' });
}

// ── Consultas ───────────────────────────────────────────────

const RESOURCE_SELECT = `
  SELECT r.id, r.course_id, r.category_id, r.title, r.description, r.status, r.allow_download,
         r.sort_order, r.created_at, r.updated_at,
         v.id AS version_id, v.version_number, v.file_id, v.external_url, v.notes AS version_notes,
         v.created_at AS version_created_at, v.created_by_email AS version_created_by,
         f.original_name AS file_name, f.size_bytes AS file_size, f.extension AS file_extension, f.mime_type AS file_mime,
         cat.name AS category_name
    FROM aula_resources r
    LEFT JOIN aula_resource_versions v ON v.id = r.current_version_id
    LEFT JOIN aula_files f ON f.id = v.file_id
    LEFT JOIN aula_resource_categories cat ON cat.id = r.category_id AND cat.deleted_at IS NULL`;

function resourceRow(r) {
  return {
    id: r.id,
    courseId: r.course_id,
    categoryId: r.category_name ? r.category_id : null,
    categoryName: r.category_name || null,
    title: r.title,
    description: r.description || '',
    status: r.status,
    allowDownload: r.allow_download,
    sortOrder: r.sort_order,
    updatedAt: r.version_created_at || r.updated_at,
    current: r.version_id ? {
      id: r.version_id,
      number: r.version_number,
      fileId: r.file_id,
      url: r.external_url,
      notes: r.version_notes || '',
      createdAt: r.version_created_at,
      createdBy: r.version_created_by,
      file: r.file_id ? { name: r.file_name, size: r.file_size, extension: r.file_extension, mime: r.file_mime } : null,
    } : null,
  };
}

export async function listResources(db, courseId) {
  const course = await loadCourse(db, courseId);
  const categories = await many(
    db,
    `SELECT cat.id, cat.name, cat.sort_order,
            (SELECT count(*)::int FROM aula_resources r WHERE r.category_id = cat.id AND r.deleted_at IS NULL) AS resources
       FROM aula_resource_categories cat
      WHERE cat.course_id = $1 AND cat.deleted_at IS NULL
      ORDER BY cat.sort_order, lower(cat.name)`,
    [courseId],
  );
  const rows = await many(
    db,
    `${RESOURCE_SELECT} WHERE r.course_id = $1 AND r.deleted_at IS NULL ORDER BY r.sort_order, r.id`,
    [courseId],
  );
  return {
    enabled: course.resources_enabled,
    categories: categories.map((c) => ({ id: c.id, name: c.name, resources: c.resources })),
    resources: rows.map(resourceRow),
  };
}

export async function listResourceVersions(db, resourceId) {
  const r = await loadResource(db, resourceId);
  const rows = await many(
    db,
    `SELECT v.*, f.original_name, f.size_bytes, f.extension
       FROM aula_resource_versions v LEFT JOIN aula_files f ON f.id = v.file_id
      WHERE v.resource_id = $1 ORDER BY v.version_number DESC`,
    [resourceId],
  );
  return rows.map((v) => ({
    id: v.id,
    number: v.version_number,
    current: v.id === r.current_version_id,
    fileId: v.file_id,
    url: v.external_url,
    notes: v.notes || '',
    createdAt: v.created_at,
    createdBy: v.created_by_email,
    file: v.file_id ? { name: v.original_name, size: v.size_bytes, extension: v.extension } : null,
  }));
}

// ── Categorías ─────────────────────────────────────────────

export async function createCategory(db, courseId, input) {
  await loadCourse(db, courseId);
  const order = (await one(db, 'SELECT COALESCE(max(sort_order), -1) + 1 AS n FROM aula_resource_categories WHERE course_id = $1 AND deleted_at IS NULL', [courseId])).n;
  const row = await one(
    db,
    'INSERT INTO aula_resource_categories (course_id, name, sort_order) VALUES ($1, $2, $3) RETURNING id, name',
    [courseId, input.name, order],
  ).catch((err) => {
    if (err.code === '23505') throw conflict(`Ya existe la categoría «${input.name}».`, { field: 'name' });
    throw err;
  });
  return { id: row.id, name: row.name, resources: 0 };
}

export async function updateCategory(db, categoryId, input) {
  const row = await one(
    db,
    'UPDATE aula_resource_categories SET name = $2 WHERE id = $1 AND deleted_at IS NULL RETURNING id, name',
    [categoryId, input.name],
  ).catch((err) => {
    if (err.code === '23505') throw conflict(`Ya existe la categoría «${input.name}».`, { field: 'name' });
    throw err;
  });
  if (!row) throw notFound('No encontramos esa categoría.');
  return row;
}

/** Los recursos de la categoría quedan sin categoría; no se borran. */
export async function deleteCategory(db, categoryId, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const cat = await one(tx, 'SELECT id FROM aula_resource_categories WHERE id = $1 AND deleted_at IS NULL', [categoryId]);
    if (!cat) throw notFound('No encontramos esa categoría.');
    const moved = await many(tx, 'UPDATE aula_resources SET category_id = NULL WHERE category_id = $1 RETURNING id', [categoryId]);
    await tx.query('UPDATE aula_resource_categories SET deleted_at = $2 WHERE id = $1', [categoryId, now]);
    return { uncategorized: moved.length };
  });
}

// ── Recursos ────────────────────────────────────────────────

export async function createResource(db, courseId, input, version, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const course = await loadCourse(tx, courseId);
    await assertCategory(tx, courseId, input.categoryId);
    await assertResourceFile(tx, version.fileId);
    const order = (await one(tx, 'SELECT COALESCE(max(sort_order), -1) + 1 AS n FROM aula_resources WHERE course_id = $1 AND deleted_at IS NULL', [courseId])).n;
    const r = await one(
      tx,
      `INSERT INTO aula_resources (course_id, category_id, title, description, status, allow_download, sort_order, created_by)
       VALUES ($1, $2, $3, $4, 'borrador', $5, $6, $7) RETURNING id`,
      [courseId, input.categoryId, input.title, input.description, input.allowDownload, order, actor.id],
    );
    const v = await one(
      tx,
      `INSERT INTO aula_resource_versions (resource_id, version_number, file_id, external_url, notes, created_by, created_by_email, created_at)
       VALUES ($1, 1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [r.id, version.fileId, version.url, version.notes || 'Primera versión.', actor.id, actor.email, now],
    );
    await tx.query('UPDATE aula_resources SET current_version_id = $2 WHERE id = $1', [r.id, v.id]);
    await audit(tx, {
      actor, ip, action: 'recurso.editar', entityType: 'recurso', entityId: r.id, courseId, companyId: course.company_id,
      summary: `Recurso «${input.title}» agregado a «${course.title}» como borrador.`,
    });
    return resourceRow(await one(tx, `${RESOURCE_SELECT} WHERE r.id = $1`, [r.id]));
  });
}

export async function updateResource(db, resourceId, input, { actor, ip }) {
  return db.tx(async (tx) => {
    const before = await loadResource(tx, resourceId, { lock: true });
    if (has(input, 'categoryId')) await assertCategory(tx, before.course_id, input.categoryId);
    const columns = { title: 'title', description: 'description', categoryId: 'category_id', allowDownload: 'allow_download' };
    const sets = [];
    const params = [resourceId];
    for (const [key, column] of Object.entries(columns)) {
      if (!has(input, key)) continue;
      params.push(input[key]);
      sets.push(`${column} = $${params.length}`);
    }
    if (sets.length) {
      await tx.query(`UPDATE aula_resources SET ${sets.join(', ')} WHERE id = $1`, params);
      await audit(tx, {
        actor, ip, action: 'recurso.editar', entityType: 'recurso', entityId: resourceId,
        courseId: before.course_id, companyId: before.company_id,
        summary: `Recurso «${input.title || before.title}» editado.`,
        before: { title: before.title, description: before.description, categoryId: before.category_id, allowDownload: before.allow_download },
        after: input,
      });
    }
    return resourceRow(await one(tx, `${RESOURCE_SELECT} WHERE r.id = $1`, [resourceId]));
  });
}

/** Reemplaza el archivo o enlace: crea una versión nueva y la deja vigente. */
export async function addResourceVersion(db, resourceId, version, { actor, ip, notifyParticipants = false, now = new Date() }) {
  return db.tx(async (tx) => {
    const r = await loadResource(tx, resourceId, { lock: true });
    await assertResourceFile(tx, version.fileId);
    const { n } = await one(tx, 'SELECT COALESCE(max(version_number), 0)::int AS n FROM aula_resource_versions WHERE resource_id = $1', [resourceId]);
    const v = await one(
      tx,
      `INSERT INTO aula_resource_versions (resource_id, version_number, file_id, external_url, notes, created_by, created_by_email, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, version_number`,
      [resourceId, n + 1, version.fileId, version.url, version.notes, actor.id, actor.email, now],
    );
    await tx.query('UPDATE aula_resources SET current_version_id = $2 WHERE id = $1', [resourceId, v.id]);
    let notified = 0;
    if (notifyParticipants && r.status === 'publicado') {
      const people = await many(
        tx,
        `SELECT e.user_id FROM aula_enrollments e JOIN aula_courses c ON c.id = e.course_id
          WHERE e.course_id = $1 AND e.withdrawn_at IS NULL AND c.resources_enabled`,
        [r.course_id],
      );
      for (const p of people) {
        await notify(tx, {
          userId: p.user_id, type: 'recurso_actualizado', title: `Se actualizó «${r.title}»`,
          body: version.notes, link: `/aula/curso/${r.course_id}/recursos`, dedupeKey: `recurso:${v.id}`, now,
        });
      }
      notified = people.length;
    }
    await audit(tx, {
      actor, ip, action: 'recurso.version', entityType: 'recurso', entityId: resourceId,
      courseId: r.course_id, companyId: r.company_id,
      summary: `Recurso «${r.title}»: versión ${v.version_number} vigente. ${version.notes}`,
      after: { versionId: v.id, versionNumber: v.version_number, notified },
    });
    return { resource: resourceRow(await one(tx, `${RESOURCE_SELECT} WHERE r.id = $1`, [resourceId])), notified };
  });
}

export async function setResourceStatus(db, resourceId, status, { actor, ip }) {
  const target = oneOf(status, 'status', 'El estado', Object.keys(RESOURCE_STATUS_LABEL));
  return db.tx(async (tx) => {
    const r = await loadResource(tx, resourceId, { lock: true });
    if (r.status === target) return resourceRow(await one(tx, `${RESOURCE_SELECT} WHERE r.id = $1`, [resourceId]));
    await tx.query('UPDATE aula_resources SET status = $2 WHERE id = $1', [resourceId, target]);
    await audit(tx, {
      actor, ip, action: 'recurso.editar', entityType: 'recurso', entityId: resourceId,
      courseId: r.course_id, companyId: r.company_id,
      summary: `Recurso «${r.title}»: ${RESOURCE_STATUS_LABEL[r.status]} → ${RESOURCE_STATUS_LABEL[target]}.`,
      before: { status: r.status }, after: { status: target },
    });
    return resourceRow(await one(tx, `${RESOURCE_SELECT} WHERE r.id = $1`, [resourceId]));
  });
}

export async function deleteResource(db, resourceId, { actor, ip, now = new Date() }) {
  return db.tx(async (tx) => {
    const r = await loadResource(tx, resourceId, { lock: true });
    if (r.status === 'publicado') {
      throw conflict('Este recurso está publicado. Archívalo primero; así los participantes dejan de verlo.');
    }
    await tx.query('UPDATE aula_resources SET deleted_at = $2 WHERE id = $1', [resourceId, now]);
    await audit(tx, {
      actor, ip, action: 'recurso.editar', entityType: 'recurso', entityId: resourceId,
      courseId: r.course_id, companyId: r.company_id,
      summary: `Recurso «${r.title}» eliminado. Su historial de versiones se conserva.`,
    });
    return { ok: true };
  });
}

export async function reorderResources(db, courseId, ids) {
  return db.tx(async (tx) => {
    await loadCourse(tx, courseId);
    const current = await many(tx, 'SELECT id FROM aula_resources WHERE course_id = $1 AND deleted_at IS NULL', [courseId]);
    const expected = new Set(current.map((r) => r.id));
    if (ids.length !== expected.size || ids.some((id) => !expected.has(id))) {
      throw conflict('La lista de recursos cambió mientras la ordenabas. Recarga la página e inténtalo de nuevo.', { code: 'orden_desactualizado' });
    }
    for (const [index, id] of ids.entries()) {
      await tx.query('UPDATE aula_resources SET sort_order = $2 WHERE id = $1 AND sort_order IS DISTINCT FROM $2', [id, index]);
    }
    return { ok: true };
  });
}

// ── Participantes ──────────────────────────────────────────

/** Biblioteca que ve un participante (solo recursos publicados, versión vigente). */
export async function participantResources(db, user, courseId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  if (!enrollment.resources_enabled) return { enabled: false, categories: [], resources: [] };
  const rows = await many(
    db,
    `${RESOURCE_SELECT}
      WHERE r.course_id = $1 AND r.deleted_at IS NULL AND r.status = 'publicado' AND r.current_version_id IS NOT NULL
      ORDER BY cat.sort_order NULLS LAST, r.sort_order, r.id`,
    [courseId],
  );
  const resources = rows.map((row) => {
    const r = resourceRow(row);
    return { ...r, status: undefined, sortOrder: undefined, current: r.current && { ...r.current, createdBy: undefined } };
  });
  const categories = [...new Map(resources.filter((r) => r.categoryId).map((r) => [r.categoryId, { id: r.categoryId, name: r.categoryName }])).values()];
  return { enabled: true, categories, resources };
}
