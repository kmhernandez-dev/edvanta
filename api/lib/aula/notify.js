/**
 * Notificaciones dentro del aula.
 *
 * `email: true` deja la notificación marcada como pendiente de envío por
 * correo; el despachador de correo la toma cuando está activo. La clave
 * `dedupeKey` evita avisos repetidos del mismo evento.
 */
import { many } from './db.js';

export async function notify(db, {
  userId, type, title, body = null, link = null, dedupeKey = null, email = false, now = new Date(),
}) {
  await db.query(
    `INSERT INTO aula_notifications (user_id, type, title, body, link, dedupe_key, email_status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING`,
    [userId, type, title, body, link, dedupeKey, email ? 'pendiente' : 'no_aplica', now],
  );
}

export async function notifyMany(db, userIds, payload) {
  for (const userId of userIds) await notify(db, { ...payload, userId });
}

export async function listNotifications(db, userId, { limit = 30 } = {}) {
  return many(
    db,
    `SELECT id, type, title, body, link, read_at, created_at
       FROM aula_notifications WHERE user_id = $1
      ORDER BY created_at DESC, id DESC LIMIT $2`,
    [userId, limit],
  );
}
