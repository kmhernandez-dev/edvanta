/**
 * Cuentas del aula: sesiones, invitaciones, recuperación de contraseña
 * y designación de administradores.
 *
 * Las sesiones viven en la base de datos, así que suspender a alguien o
 * cambiar su contraseña le corta el acceso de inmediato.
 */
import { createHash } from 'node:crypto';
import { many, one } from './db.js';
import { AulaError, badRequest, notFound } from './http.js';
import {
  checkPassword, hashPassword, hashToken, newToken, passwordProblem, SESSION_TTL_MS,
} from './security.js';
import { audit } from './audit.js';

const TOKEN_TTL_MS = {
  invite: 7 * 24 * 60 * 60 * 1000,
  reset: 2 * 60 * 60 * 1000,
};

// Evita escribir en cada petición: basta con saber que la sesión sigue viva.
const TOUCH_EVERY_MS = 5 * 60 * 1000;

export const USER_FIELDS = `
  u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.company_id,
  u.job_title, u.is_demo, u.last_login_at, u.created_at, u.updated_at`;

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: `${row.first_name} ${row.last_name}`.trim(),
    role: row.role,
    status: row.status,
    companyId: row.company_id ?? null,
    jobTitle: row.job_title ?? null,
    isDemo: Boolean(row.is_demo),
    lastLoginAt: row.last_login_at ?? null,
    createdAt: row.created_at ?? null,
  };
}

// ── Sesiones ────────────────────────────────────────────────

export async function createSession(db, userId, { ip = null, userAgent = null, now = new Date() } = {}) {
  const token = newToken();
  await db.query(
    `INSERT INTO aula_sessions (user_id, token_hash, ip, user_agent, created_at, last_seen_at, expires_at)
     VALUES ($1, $2, $3, $4, $5, $5, $6)`,
    [userId, hashToken(token), ip, userAgent ? String(userAgent).slice(0, 300) : null, now,
      new Date(now.getTime() + SESSION_TTL_MS)],
  );
  await db.query('UPDATE aula_users SET last_login_at = $2 WHERE id = $1', [userId, now]);
  return token;
}

/** Devuelve { sessionId, user } si el token corresponde a una sesión válida de una cuenta activa. */
export async function resolveSession(db, token, { now = new Date() } = {}) {
  if (!token || typeof token !== 'string' || token.length > 200) return null;
  const row = await one(
    db,
    `SELECT s.id AS session_id, s.last_seen_at, ${USER_FIELDS}
       FROM aula_sessions s
       JOIN aula_users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > $2
        AND u.deleted_at IS NULL`,
    [hashToken(token), now],
  );
  if (!row || row.status !== 'active') return null;
  if (now - new Date(row.last_seen_at) > TOUCH_EVERY_MS) {
    await db.query('UPDATE aula_sessions SET last_seen_at = $2 WHERE id = $1', [row.session_id, now]);
  }
  return { sessionId: row.session_id, user: publicUser(row) };
}

export async function revokeSession(db, sessionId, now = new Date()) {
  await db.query('UPDATE aula_sessions SET revoked_at = $2 WHERE id = $1 AND revoked_at IS NULL', [sessionId, now]);
}

export async function revokeUserSessions(db, userId, { now = new Date(), exceptSessionId = null } = {}) {
  await db.query(
    `UPDATE aula_sessions SET revoked_at = $2
      WHERE user_id = $1 AND revoked_at IS NULL AND ($3::bigint IS NULL OR id <> $3::bigint)`,
    [userId, now, exceptSessionId],
  );
}

// ── Inicio de sesión ────────────────────────────────────────

export async function login(db, { email, password, ip, userAgent, now = new Date() }) {
  const user = await one(
    db,
    `SELECT ${USER_FIELDS}, u.password_hash FROM aula_users u WHERE u.email = $1 AND u.deleted_at IS NULL`,
    [email],
  );
  const valid = await checkPassword(password, user?.password_hash ?? null);
  if (!user || !valid) {
    throw new AulaError(401, 'credenciales_invalidas',
      'El correo o la contraseña no coinciden. Si no recuerdas tu contraseña, puedes restablecerla.');
  }
  if (user.status === 'suspended') {
    throw new AulaError(403, 'cuenta_suspendida',
      'Tu cuenta está suspendida. Escribe a Edvanta si necesitas recuperar el acceso.');
  }
  if (user.status !== 'active') {
    throw new AulaError(403, 'cuenta_sin_activar',
      'Tu cuenta aún no está activa. Usa el enlace de invitación que te llegó por correo.');
  }
  const token = await createSession(db, user.id, { ip, userAgent, now });
  return { token, user: publicUser(user) };
}

// ── Invitaciones y recuperación ─────────────────────────────

export async function issueAuthToken(db, userId, purpose, { createdBy = null, now = new Date() } = {}) {
  if (!TOKEN_TTL_MS[purpose]) throw new Error(`Propósito de token desconocido: ${purpose}`);
  // Un enlace nuevo invalida los anteriores del mismo tipo.
  await db.query(
    'UPDATE aula_auth_tokens SET used_at = $3 WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL',
    [userId, purpose, now],
  );
  const token = newToken();
  await db.query(
    `INSERT INTO aula_auth_tokens (user_id, purpose, token_hash, expires_at, created_by, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, purpose, hashToken(token), new Date(now.getTime() + TOKEN_TTL_MS[purpose]), createdBy, now],
  );
  return token;
}

const INVALID_LINK = () => new AulaError(400, 'enlace_invalido',
  'Este enlace no es válido o ya se usó. Pide uno nuevo desde "¿Olvidaste tu contraseña?".');
const EXPIRED_LINK = () => new AulaError(400, 'enlace_vencido',
  'Este enlace venció. Pide uno nuevo desde "¿Olvidaste tu contraseña?".');

async function loadToken(db, token, now, { lock = false } = {}) {
  if (!token || typeof token !== 'string' || token.length > 200) throw INVALID_LINK();
  const row = await one(
    db,
    `SELECT t.id AS token_id, t.purpose, t.expires_at, t.used_at, ${USER_FIELDS}
       FROM aula_auth_tokens t
       JOIN aula_users u ON u.id = t.user_id
      WHERE t.token_hash = $1 AND u.deleted_at IS NULL
      ${lock ? 'FOR UPDATE OF t' : ''}`,
    [hashToken(token)],
  );
  if (!row || row.used_at) throw INVALID_LINK();
  if (new Date(row.expires_at) <= now) throw EXPIRED_LINK();
  if (row.status === 'suspended') {
    throw new AulaError(403, 'cuenta_suspendida', 'Tu cuenta está suspendida. Escribe a Edvanta para reactivarla.');
  }
  return row;
}

/** Datos mínimos para mostrar la pantalla de "crea tu contraseña". */
export async function inspectAuthToken(db, token, { now = new Date() } = {}) {
  const row = await loadToken(db, token, now);
  return { purpose: row.purpose, email: row.email, firstName: row.first_name };
}

/** Fija la contraseña con un enlace, activa la cuenta y abre una sesión nueva. */
export async function redeemAuthToken(db, { token, password, ip, userAgent, now = new Date() }) {
  const problem = passwordProblem(password);
  if (problem) throw badRequest(problem, { field: 'password' });
  const hash = await hashPassword(password);

  return db.tx(async (tx) => {
    const row = await loadToken(tx, token, now, { lock: true });
    await tx.query('UPDATE aula_auth_tokens SET used_at = $2 WHERE id = $1', [row.token_id, now]);
    await tx.query(
      `UPDATE aula_users
          SET password_hash = $2, password_changed_at = $3,
              status = CASE WHEN status = 'invited' THEN 'active' ELSE status END
        WHERE id = $1`,
      [row.id, hash, now],
    );
    await revokeUserSessions(tx, row.id, { now });
    const sessionToken = await createSession(tx, row.id, { ip, userAgent, now });
    const fresh = await one(tx, `SELECT ${USER_FIELDS} FROM aula_users u WHERE u.id = $1`, [row.id]);
    return { token: sessionToken, user: publicUser(fresh), purpose: row.purpose };
  });
}

/**
 * Prepara un enlace de recuperación. Devuelve null si el correo no
 * corresponde a una cuenta utilizable; quien llama responde igual en
 * ambos casos para no revelar qué correos existen.
 */
export async function prepareReset(db, email, { now = new Date(), adminHashes = [] } = {}) {
  const find = () => one(
    db,
    `SELECT ${USER_FIELDS} FROM aula_users u WHERE u.email = $1 AND u.deleted_at IS NULL`,
    [email],
  );
  let user = await find();
  // Administrador designado por huella: su cuenta nace cuando pide su enlace.
  if (!user && adminHashes.includes(emailFingerprint(email))) {
    await ensureBootstrapAdmins(db, [email], { now });
    user = await find();
  }
  if (!user || user.status === 'suspended') return null;
  // Quien nunca creó su contraseña recibe una invitación (7 días), no un
  // «restablecer» de 2 horas.
  const { has_password: hasPassword } = await one(
    db,
    'SELECT password_hash IS NOT NULL AS has_password FROM aula_users WHERE id = $1',
    [user.id],
  );
  const purpose = user.status === 'invited' && !hasPassword ? 'invite' : 'reset';
  const token = await issueAuthToken(db, user.id, purpose, { now });
  return { user: publicUser(user), token, purpose };
}

export async function changePassword(db, { userId, sessionId, current, next, now = new Date() }) {
  const row = await one(db, 'SELECT password_hash FROM aula_users WHERE id = $1 AND deleted_at IS NULL', [userId]);
  if (!row) throw notFound();
  if (!(await checkPassword(current, row.password_hash))) {
    throw new AulaError(400, 'contrasena_actual_incorrecta', 'La contraseña actual no es correcta.', { field: 'current' });
  }
  const problem = passwordProblem(next);
  if (problem) throw badRequest(problem, { field: 'next' });
  if (current === next) throw badRequest('La nueva contraseña debe ser distinta de la actual.', { field: 'next' });
  await db.query(
    'UPDATE aula_users SET password_hash = $2, password_changed_at = $3 WHERE id = $1',
    [userId, await hashPassword(next), now],
  );
  // Cierra las demás sesiones abiertas con la contraseña anterior.
  await revokeUserSessions(db, userId, { now, exceptSessionId: sessionId });
}

// ── Administradores iniciales ───────────────────────────────

/**
 * Garantiza que los correos de AULA_ADMIN_EMAILS sean administradores.
 * Una cuenta nueva queda sin contraseña: su dueño la crea desde
 * "¿Olvidaste tu contraseña?", que también la activa.
 */
export async function ensureBootstrapAdmins(db, emails, { now = new Date(), hashes = [] } = {}) {
  const results = [];
  // Cuentas existentes cuyo correo coincide con una huella designada.
  const hashed = hashes.length
    ? (await many(
      db,
      `SELECT email FROM aula_users
        WHERE deleted_at IS NULL AND encode(sha256(convert_to(email, 'UTF8')), 'hex') = ANY($1::text[])`,
      [hashes],
    )).map((r) => r.email)
    : [];
  for (const email of [...new Set([...emails, ...hashed])]) {
    const existing = await one(db, 'SELECT id, role FROM aula_users WHERE email = $1 AND deleted_at IS NULL', [email]);
    if (existing?.role === 'admin') {
      results.push({ email, action: 'sin_cambios' });
      continue;
    }
    if (existing) {
      await db.query("UPDATE aula_users SET role = 'admin' WHERE id = $1", [existing.id]);
      await audit(db, {
        action: 'admin.designado', entityType: 'usuario', entityId: existing.id,
        summary: `${email} fue designado administrador por configuración del servidor.`,
        before: { role: existing.role }, after: { role: 'admin' },
      });
      results.push({ email, action: 'promovido' });
      continue;
    }
    const created = await one(
      db,
      `INSERT INTO aula_users (email, first_name, last_name, role, status, created_at, updated_at)
       VALUES ($1, 'Administración', 'Edvanta', 'admin', 'invited', $2, $2)
       RETURNING id`,
      [email, now],
    );
    await audit(db, {
      action: 'admin.designado', entityType: 'usuario', entityId: created.id,
      summary: `${email} fue creado como administrador por configuración del servidor.`,
      after: { role: 'admin', status: 'invited' },
    });
    results.push({ email, action: 'creado' });
  }
  return results;
}

/** Huella SHA-256 (hexadecimal) de un correo en minúsculas y sin espacios. */
export function emailFingerprint(email) {
  return createHash('sha256').update(String(email || '').trim().toLowerCase()).digest('hex');
}

/**
 * Administradores designados por huella (AULA_ADMIN_EMAIL_HASHES): permite
 * nombrarlos en un repositorio público sin publicar su correo.
 */
export function parseAdminHashes(raw) {
  return [...new Set(String(raw || '')
    .split(/[,;\s]+/)
    .map((h) => h.trim().toLowerCase())
    .filter((h) => /^[a-f0-9]{64}$/.test(h)))];
}

export function parseAdminEmails(raw) {
  return [...new Set(String(raw || '')
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)))];
}
