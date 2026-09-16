/**
 * Primitivas de seguridad del aula: tokens, contraseñas, cookie de
 * sesión, IP del cliente y límite de intentos.
 *
 * Los tokens (sesión, invitación, recuperación) nunca se guardan en
 * claro: la base de datos solo tiene su SHA-256.
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

export const SESSION_COOKIE = 'aula_session';
export const SESSION_COOKIE_PATH = '/api/aula';
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

const BCRYPT_COST = Math.min(14, Math.max(4, Number.parseInt(process.env.AULA_BCRYPT_COST || '12', 10) || 12));

export function newToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_COST);
}

// Hash de relleno: comparar contra él cuando el correo no existe hace que
// la respuesta tarde lo mismo y no delate qué cuentas existen.
let dummyHash = null;
function getDummyHash() {
  if (!dummyHash) dummyHash = bcrypt.hashSync('relleno-aula-edvanta', BCRYPT_COST);
  return dummyHash;
}

export async function checkPassword(password, hash) {
  if (typeof password !== 'string' || !password) return false;
  if (!hash) {
    await bcrypt.compare(password, getDummyHash());
    return false;
  }
  return bcrypt.compare(password, hash);
}

/** Devuelve el problema de la contraseña o null si es aceptable. */
export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 10) {
    return 'La contraseña debe tener al menos 10 caracteres.';
  }
  if (password.length > 128) return 'La contraseña admite como máximo 128 caracteres.';
  if (!/\p{L}/u.test(password) || !/\d/.test(password)) {
    return 'La contraseña debe combinar letras y números.';
  }
  return null;
}

// ── Cookies ─────────────────────────────────────────────────

export function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      try { return decodeURIComponent(part.slice(idx + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

export function sessionCookie(token, { secure }) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    `Path=${SESSION_COOKIE_PATH}`,
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
    secure ? 'Secure' : null,
  ].filter(Boolean).join('; ');
}

export function clearedSessionCookie({ secure }) {
  return [
    `${SESSION_COOKIE}=`,
    `Path=${SESSION_COOKIE_PATH}`,
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Lax',
    secure ? 'Secure' : null,
  ].filter(Boolean).join('; ');
}

// ── Petición ────────────────────────────────────────────────

export function clientIp(req) {
  const cf = req.headers['cf-connecting-ip'];
  const fwd = typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'].split(',')[0] : '';
  return String(cf || fwd || req.ip || '').trim().slice(0, 64) || null;
}

/**
 * Toda petición que cambia datos debe traer la cabecera X-Aula-Request.
 * Un formulario de otro sitio no puede enviarla, y un fetch de otro origen
 * la dispara en una verificación CORS que el servidor rechaza.
 */
export function requireAulaHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers['x-aula-request'] === '1') return next();
  return res.status(403).json({
    error: { code: 'origen_no_valido', message: 'La solicitud no vino del aula. Recarga la página e intenta de nuevo.' },
  });
}

// ── Límite de intentos ──────────────────────────────────────

export function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  function prune(now) {
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => now - t < windowMs);
      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  }

  return {
    /** Registra un intento y devuelve false si ya se pasó del límite. */
    hit(key, now = Date.now()) {
      const times = (hits.get(key) || []).filter((t) => now - t < windowMs);
      times.push(now);
      hits.set(key, times);
      if (hits.size > 5000) prune(now);
      return times.length <= max;
    },
    reset(key) {
      hits.delete(key);
    },
  };
}
