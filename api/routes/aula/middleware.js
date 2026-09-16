import { resolveSession } from '../../lib/aula/accounts.js';
import { forbidden, unauthorized } from '../../lib/aula/http.js';
import { clientIp, readCookie, SESSION_COOKIE } from '../../lib/aula/security.js';

/** Deja en req.aula la base de datos, el usuario de la sesión (o null) y la IP. */
export function attachSession({ db, now }) {
  return async (req, _res, next) => {
    try {
      req.aula = { db, user: null, sessionId: null, ip: clientIp(req), now: now() };
      const token = readCookie(req.headers.cookie, SESSION_COOKIE);
      if (token) {
        const session = await resolveSession(db, token, { now: req.aula.now });
        if (session) {
          req.aula.user = session.user;
          req.aula.sessionId = session.sessionId;
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function requireUser(req, _res, next) {
  if (!req.aula?.user) return next(unauthorized());
  return next();
}

export function requireAdmin(req, _res, next) {
  if (!req.aula?.user) return next(unauthorized());
  if (req.aula.user.role !== 'admin') {
    return next(forbidden('Esta sección es solo para administradores del aula.'));
  }
  return next();
}

export function requireParticipant(req, _res, next) {
  if (!req.aula?.user) return next(unauthorized());
  if (req.aula.user.role !== 'participant') {
    return next(forbidden('Esta sección es para participantes. Usa la vista previa del panel de administración.'));
  }
  return next();
}

/** Datos del actor para la bitácora. */
export const actorOf = (req) => ({ id: req.aula.user.id, email: req.aula.user.email });
