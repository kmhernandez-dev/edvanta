/**
 * Errores, validación y utilidades HTTP del aula.
 *
 * Toda respuesta de error tiene la forma
 *   { error: { code, message, field? } }
 * con un mensaje en español que dice qué pasó y qué hacer.
 */

export class AulaError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

export const badRequest = (message, extra) => new AulaError(400, 'solicitud_invalida', message, extra);
export const unauthorized = (message = 'Tu sesión terminó. Vuelve a iniciar sesión para continuar.') =>
  new AulaError(401, 'sin_sesion', message);
export const forbidden = (message = 'No tienes permiso para realizar esta acción.') =>
  new AulaError(403, 'sin_permiso', message);
export const notFound = (message = 'No encontramos lo que buscas. Puede que haya sido eliminado.') =>
  new AulaError(404, 'no_encontrado', message);
export const conflict = (message, extra) => new AulaError(409, 'conflicto', message, extra);
export const tooMany = (message) => new AulaError(429, 'demasiados_intentos', message);

function fieldError(field, message) {
  return badRequest(message, { field });
}

// ── Validación ──────────────────────────────────────────────

export function str(value, field, label, { min = 1, max = 200, optional = false } = {}) {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    if (optional) return null;
    throw fieldError(field, `${label} es obligatorio.`);
  }
  if (typeof value !== 'string') throw fieldError(field, `${label} no tiene un formato válido.`);
  const clean = value.trim();
  if (clean.length < min) throw fieldError(field, `${label} debe tener al menos ${min} caracteres.`);
  if (clean.length > max) throw fieldError(field, `${label} admite como máximo ${max} caracteres.`);
  return clean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function email(value, field = 'email', label = 'El correo', { optional = false } = {}) {
  const clean = normalizeEmail(value);
  if (!clean) {
    if (optional) return null;
    throw fieldError(field, `${label} es obligatorio.`);
  }
  if (clean.length > 254 || !EMAIL_RE.test(clean)) {
    throw fieldError(field, `${label} no parece válido. Revisa que tenga el formato nombre@dominio.com.`);
  }
  return clean;
}

export function int(value, field, label, { min = -Infinity, max = Infinity, optional = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (optional) return null;
    throw fieldError(field, `${label} es obligatorio.`);
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n)) throw fieldError(field, `${label} debe ser un número entero.`);
  if (n < min || n > max) {
    const range = Number.isFinite(max) ? `entre ${min} y ${max}` : `mayor o igual a ${min}`;
    throw fieldError(field, `${label} debe estar ${range}.`);
  }
  return n;
}

export function num(value, field, label, { min = -Infinity, max = Infinity, optional = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (optional) return null;
    throw fieldError(field, `${label} es obligatorio.`);
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) throw fieldError(field, `${label} debe ser un número.`);
  if (n < min || n > max) throw fieldError(field, `${label} debe estar entre ${min} y ${max}.`);
  return n;
}

export function bool(value, field, label, { optional = false, fallback = false } = {}) {
  if (value === undefined || value === null) {
    if (optional) return fallback;
    throw fieldError(field, `${label} es obligatorio.`);
  }
  if (typeof value !== 'boolean') throw fieldError(field, `${label} debe ser sí o no.`);
  return value;
}

export function oneOf(value, field, label, allowed, { optional = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (optional) return null;
    throw fieldError(field, `${label} es obligatorio.`);
  }
  if (!allowed.includes(value)) throw fieldError(field, `${label} no es una opción válida.`);
  return value;
}

export function date(value, field, label, { optional = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (optional) return null;
    throw fieldError(field, `${label} es obligatoria.`);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw fieldError(field, `${label} no es una fecha válida.`);
  return d;
}

export function id(value, field = 'id', label = 'El identificador') {
  return int(value, field, label, { min: 1 });
}

export function idList(value, field, label, { max = 5000 } = {}) {
  if (!Array.isArray(value) || value.length === 0) throw fieldError(field, `${label}: selecciona al menos uno.`);
  if (value.length > max) throw fieldError(field, `${label}: máximo ${max} a la vez.`);
  const ids = value.map((v) => int(v, field, label, { min: 1 }));
  return [...new Set(ids)];
}

// ── Paginación y orden ─────────────────────────────────────

export function paging(query, { defaultSize = 25, maxSize = 200 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const size = Math.min(maxSize, Math.max(1, Number.parseInt(query.pageSize, 10) || defaultSize));
  return { page, size, offset: (page - 1) * size };
}

/** Devuelve la columna SQL permitida para ordenar, nunca texto del cliente. */
export function sorting(query, allowed, fallback) {
  const key = typeof query.sort === 'string' && allowed[query.sort] ? query.sort : fallback;
  const dir = query.dir === 'asc' ? 'ASC' : 'DESC';
  return { column: allowed[key], dir, key };
}

export function pageResult(rows, total, { page, size }) {
  return { items: rows, total, page, pageSize: size, pages: Math.max(1, Math.ceil(total / size)) };
}

// ── Express ────────────────────────────────────────────────

export const route = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const PG_MESSAGES = {
  '23505': [409, 'duplicado', 'Ya existe un registro con esos datos.'],
  '23503': [409, 'relacion_invalida', 'Este registro está relacionado con otros datos y no se puede completar la acción.'],
  '23514': [400, 'dato_invalido', 'Alguno de los datos no cumple las reglas del aula.'],
  '22P02': [400, 'dato_invalido', 'Alguno de los datos no tiene el formato esperado.'],
};

export function errorHandler(err, req, res, _next) {
  if (err instanceof AulaError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message, ...err.extra } });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'demasiado_grande', message: 'El contenido enviado es demasiado grande.' } });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'json_invalido', message: 'No pudimos leer los datos enviados.' } });
  }
  const mapped = err?.code && PG_MESSAGES[err.code];
  if (mapped) {
    const [status, code, message] = mapped;
    return res.status(status).json({ error: { code, message } });
  }
  console.error(JSON.stringify({
    level: 'error', ns: 'aula', msg: 'Error no controlado', path: req.path, method: req.method,
    error: err?.message, code: err?.code, stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
  }));
  return res.status(500).json({
    error: { code: 'error_interno', message: 'Algo falló de nuestro lado. Intenta de nuevo en unos minutos.' },
  });
}
