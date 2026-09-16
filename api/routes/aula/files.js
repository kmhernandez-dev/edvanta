import express from 'express';
import { fileAccess, requireOpenEnrollment } from '../../lib/aula/access.js';
import { one } from '../../lib/aula/db.js';
import {
  AulaError, badRequest, conflict, forbidden, id as idField, notFound, oneOf, route, str,
} from '../../lib/aula/http.js';
import {
  CHUNK_SIZE, FILE_TYPES, checkUpload, matchesSignature, newStorageKey, parseRange, safeOriginalName, uploadRules,
} from '../../lib/aula/storage.js';

const ADMIN_PURPOSES = ['contenido', 'recurso', 'logo', 'portada', 'foro'];
const PARTICIPANT_PURPOSES = ['entrega', 'foro'];
const STALE_UPLOAD_MS = 24 * 60 * 60 * 1000;

function publicUpload(row) {
  return {
    id: row.id,
    name: row.original_name,
    size: row.size_bytes,
    receivedBytes: row.received_bytes,
    status: row.status,
    mime: row.mime_type,
    extension: row.extension,
    purpose: row.purpose,
    chunkSize: CHUNK_SIZE,
    error: row.error_message || null,
  };
}

/** Límites extra según dónde se va a usar el archivo (actividad o foro). */
async function contextLimits(req, purpose) {
  const { db, user, now } = req.aula;
  if (purpose === 'entrega') {
    const activityId = idField(req.body?.activityId, 'activityId', 'La actividad');
    const activity = await one(
      db,
      `SELECT id, course_id, allow_file, accepted_extensions, max_file_mb
         FROM aula_activities WHERE id = $1 AND deleted_at IS NULL AND status = 'publicado'`,
      [activityId],
    );
    if (!activity) throw notFound('No encontramos esa actividad.');
    await requireOpenEnrollment(db, user, activity.course_id, { now });
    if (!activity.allow_file) throw badRequest('Esta actividad no recibe archivos.');
    return { extensions: activity.accepted_extensions, maxMb: activity.max_file_mb };
  }
  if (purpose === 'foro') {
    const forumId = idField(req.body?.forumId, 'forumId', 'El foro');
    const forum = await one(
      db,
      `SELECT f.id, f.course_id, f.is_closed, f.allow_attachments
         FROM aula_forums f WHERE f.id = $1 AND f.deleted_at IS NULL`,
      [forumId],
    );
    if (!forum) throw notFound('No encontramos ese foro.');
    if (!forum.allow_attachments) throw badRequest('Este foro no admite adjuntos.');
    if (user.role !== 'admin') {
      await requireOpenEnrollment(db, user, forum.course_id, { now });
      if (forum.is_closed) throw forbidden('Este foro está cerrado.');
      const muted = await one(db, 'SELECT 1 FROM aula_forum_mutes WHERE course_id = $1 AND user_id = $2', [forum.course_id, user.id]);
      if (muted) throw forbidden('Un administrador limitó tu participación en los foros de este curso.');
    }
    return {};
  }
  return {};
}

function contentDisposition(kind, name) {
  const ascii = name.normalize('NFKD').replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `${kind}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export function uploadsRouter({ storage }) {
  const router = express.Router();

  // Consulta las reglas antes de elegir el archivo (formatos y tamaños).
  router.post('/rules', route(async (req, res) => {
    const { user } = req.aula;
    const allowed = user.role === 'admin' ? ADMIN_PURPOSES : PARTICIPANT_PURPOSES;
    const purpose = oneOf(req.body?.purpose, 'purpose', 'El tipo de subida', allowed);
    const limits = await contextLimits(req, purpose);
    res.json(uploadRules(purpose, limits));
  }));

  router.post('/', route(async (req, res) => {
    const { db, user, now } = req.aula;
    const allowed = user.role === 'admin' ? ADMIN_PURPOSES : PARTICIPANT_PURPOSES;
    const purpose = oneOf(req.body?.purpose, 'purpose', 'El tipo de subida', allowed);
    const filename = safeOriginalName(str(req.body?.filename, 'filename', 'El nombre del archivo', { max: 255 }));
    const limits = await contextLimits(req, purpose);
    const { extension, mime } = checkUpload({ purpose, filename, size: req.body?.size, limits });

    const row = await one(
      db,
      `INSERT INTO aula_files
         (storage_key, original_name, mime_type, extension, size_bytes, purpose, status, uploaded_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'subiendo', $7, $8, $8)
       RETURNING *`,
      [newStorageKey(extension, now), filename, mime, extension, Number(req.body.size), purpose, user.id, now],
    );
    res.status(201).json(publicUpload(row));
  }));

  async function ownUpload(req) {
    const fileId = idField(req.params.id, 'id', 'La subida');
    const row = await one(req.aula.db, 'SELECT * FROM aula_files WHERE id = $1 AND deleted_at IS NULL', [fileId]);
    if (!row || row.uploaded_by !== req.aula.user.id) throw notFound('No encontramos esa subida.');
    return row;
  }

  router.get('/:id', route(async (req, res) => {
    res.json(publicUpload(await ownUpload(req)));
  }));

  router.put(
    '/:id/chunk',
    express.raw({ type: () => true, limit: CHUNK_SIZE + 1024 }),
    route(async (req, res) => {
      const { db } = req.aula;
      const row = await ownUpload(req);
      if (row.status !== 'subiendo') throw conflict('Esta subida ya terminó o fue cancelada.', { code: 'subida_cerrada' });

      const offset = Number(req.headers['x-chunk-offset']);
      const chunk = req.body;
      if (!Buffer.isBuffer(chunk) || chunk.length === 0) throw badRequest('La parte del archivo llegó vacía.');
      if (!Number.isSafeInteger(offset) || offset !== row.received_bytes) {
        throw new AulaError(409, 'posicion_incorrecta', 'La subida se desincronizó; continuamos desde la última parte recibida.', {
          expectedOffset: row.received_bytes,
        });
      }
      if (offset + chunk.length > row.size_bytes) {
        await db.query("UPDATE aula_files SET status = 'fallido', error_message = $2 WHERE id = $1", [row.id, 'Tamaño mayor al declarado']);
        await storage.discardTemp(row.storage_key);
        throw badRequest('El archivo es más grande de lo que se declaró al iniciar la subida.');
      }
      if (offset === 0 && !matchesSignature(chunk, FILE_TYPES[row.extension].sniff)) {
        await db.query("UPDATE aula_files SET status = 'fallido', error_message = $2 WHERE id = $1", [row.id, 'Contenido no coincide con la extensión']);
        throw new AulaError(400, 'archivo_invalido',
          `El contenido del archivo no corresponde a un ${row.extension.toUpperCase()}. Verifica que el archivo no esté dañado o renombrado.`);
      }

      // Si el disco ya tiene más bytes que la base (reintento tras un corte), se descartan.
      const onDisk = await storage.tempSize(row.storage_key);
      if (onDisk !== offset) {
        await storage.discardTemp(row.storage_key);
        if (offset !== 0) {
          await db.query('UPDATE aula_files SET received_bytes = 0 WHERE id = $1', [row.id]);
          throw new AulaError(409, 'posicion_incorrecta', 'Reiniciamos la subida para garantizar que el archivo llegue completo.', { expectedOffset: 0 });
        }
      }

      await storage.appendChunk(row.storage_key, chunk);
      const updated = await one(
        db,
        `UPDATE aula_files SET received_bytes = received_bytes + $2
          WHERE id = $1 AND received_bytes = $3 AND status = 'subiendo'
          RETURNING received_bytes`,
        [row.id, chunk.length, offset],
      );
      if (!updated) {
        await storage.discardTemp(row.storage_key);
        await db.query('UPDATE aula_files SET received_bytes = 0 WHERE id = $1', [row.id]);
        throw new AulaError(409, 'posicion_incorrecta', 'Se enviaron dos partes a la vez; reiniciamos la subida.', { expectedOffset: 0 });
      }
      res.json({ receivedBytes: updated.received_bytes, size: row.size_bytes });
    }),
  );

  router.post('/:id/complete', route(async (req, res) => {
    const { db } = req.aula;
    const row = await ownUpload(req);
    if (row.status === 'listo') return res.json(publicUpload(row));
    if (row.status !== 'subiendo') throw conflict('Esta subida fue cancelada o falló. Vuelve a intentarlo.');
    if (row.received_bytes !== row.size_bytes) {
      throw new AulaError(409, 'subida_incompleta', 'Aún faltan partes del archivo por llegar.', {
        expectedOffset: row.received_bytes,
      });
    }
    try {
      const { sha256, size } = await storage.finalize(row.storage_key);
      if (size !== row.size_bytes) throw new Error(`Tamaño en disco ${size} distinto de ${row.size_bytes}`);
      const done = await one(
        db,
        "UPDATE aula_files SET status = 'listo', sha256 = $2, error_message = NULL WHERE id = $1 RETURNING *",
        [row.id, sha256],
      );
      return res.json(publicUpload(done));
    } catch (err) {
      await db.query("UPDATE aula_files SET status = 'fallido', error_message = $2 WHERE id = $1", [row.id, String(err.message).slice(0, 300)]);
      throw new AulaError(500, 'error_almacenamiento', 'No pudimos guardar el archivo. Intenta subirlo de nuevo.');
    }
  }));

  router.delete('/:id', route(async (req, res) => {
    const { db } = req.aula;
    const row = await ownUpload(req);
    if (row.status !== 'subiendo' && row.status !== 'fallido') {
      throw conflict('Este archivo ya se guardó; se retira desde el contenido que lo usa.');
    }
    await storage.discardTemp(row.storage_key);
    await db.query("UPDATE aula_files SET status = 'eliminado', deleted_at = NOW() WHERE id = $1", [row.id]);
    res.json({ ok: true });
  }));

  return router;
}

export function filesRouter({ storage }) {
  const router = express.Router();

  async function load(req) {
    const fileId = idField(req.params.id, 'id', 'El archivo');
    const access = await fileAccess(req.aula.db, req.aula.user, fileId);
    if (!access || !access.canView) throw notFound('No encontramos ese archivo o no tienes acceso a él.');
    return access;
  }

  router.get('/:id/meta', route(async (req, res) => {
    const { file, canDownload } = await load(req);
    res.json({
      id: file.id, name: file.original_name, size: file.size_bytes, mime: file.mime_type,
      extension: file.extension, canDownload,
    });
  }));

  const serve = route(async (req, res) => {
    const { file, canDownload } = await load(req);
    const wantsDownload = req.query.download === '1';
    if (wantsDownload && !canDownload) {
      throw forbidden('Puedes consultar este archivo en el aula, pero su descarga no está habilitada.');
    }
    if (!(await storage.exists(file.storage_key))) {
      console.error(JSON.stringify({ level: 'error', ns: 'aula', msg: 'Archivo ausente en el almacenamiento', file: file.id }));
      throw notFound('El archivo no está disponible en este momento. Avísale al administrador del aula.');
    }

    const size = file.size_bytes;
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
    res.setHeader('Content-Disposition', contentDisposition(wantsDownload ? 'attachment' : 'inline', file.original_name));

    const range = parseRange(req.headers.range, size);
    if (range === 'invalid') {
      res.setHeader('Content-Range', `bytes */${size}`);
      return res.status(416).end();
    }
    if (range) {
      res.status(206);
      res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
      res.setHeader('Content-Length', range.end - range.start + 1);
    } else {
      res.setHeader('Content-Length', size);
    }
    if (req.method === 'HEAD') return res.end();

    const stream = storage.readStream(file.storage_key, range);
    stream.on('error', (err) => {
      console.error(JSON.stringify({ level: 'error', ns: 'aula', msg: 'Error leyendo archivo', file: file.id, error: err.message }));
      res.destroy(err);
    });
    return stream.pipe(res);
  });

  router.get('/:id', serve);
  router.head('/:id', serve);
  return router;
}

/** Marca como fallidas las subidas abandonadas y borra sus partes. */
export async function sweepStaleUploads({ db, storage, now = new Date() }) {
  const { rows } = await db.query(
    `UPDATE aula_files SET status = 'fallido', error_message = 'Subida abandonada'
      WHERE status = 'subiendo' AND updated_at < $1
      RETURNING id, storage_key`,
    [new Date(now.getTime() - STALE_UPLOAD_MS)],
  );
  for (const row of rows) await storage.discardTemp(row.storage_key);
  return rows.length;
}
