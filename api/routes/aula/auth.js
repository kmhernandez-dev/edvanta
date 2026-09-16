import express from 'express';
import {
  changePassword, inspectAuthToken, login, prepareReset, redeemAuthToken, revokeSession,
} from '../../lib/aula/accounts.js';
import { resetEmail } from '../../lib/aula/emails.js';
import { badRequest, email as emailField, route, tooMany } from '../../lib/aula/http.js';
import { clearedSessionCookie, createRateLimiter, sessionCookie } from '../../lib/aula/security.js';
import { requireUser } from './middleware.js';

const FIFTEEN_MIN = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

/**
 * El token de invitación/recuperación va en el fragmento (#) del enlace:
 * el navegador nunca lo envía al servidor, así que no queda en los
 * registros de acceso. La página lo lee y lo manda en el cuerpo.
 */
export function accessLink(siteUrl, token) {
  return `${siteUrl.replace(/\/+$/, '')}/aula/acceso#token=${encodeURIComponent(token)}`;
}

export function authRouter({ mailer, siteUrl, secureCookies }) {
  const router = express.Router();
  const loginByAccount = createRateLimiter({ windowMs: FIFTEEN_MIN, max: 8 });
  const loginByIp = createRateLimiter({ windowMs: FIFTEEN_MIN, max: 40 });
  const recoverByIp = createRateLimiter({ windowMs: ONE_HOUR, max: 10 });
  const recoverByEmail = createRateLimiter({ windowMs: ONE_HOUR, max: 3 });
  const linkByIp = createRateLimiter({ windowMs: FIFTEEN_MIN, max: 30 });

  const password = (value, field = 'password') => {
    if (typeof value !== 'string' || value === '') throw badRequest('Escribe tu contraseña.', { field });
    return value;
  };

  router.get('/me', (req, res) => {
    res.json({ user: req.aula.user });
  });

  router.post('/login', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const email = emailField(req.body?.email);
    const pass = password(req.body?.password);
    const key = `${ip}|${email}`;
    if (!loginByAccount.hit(key) || !loginByIp.hit(ip || 'sin-ip')) {
      throw tooMany('Hubo demasiados intentos. Espera 15 minutos y vuelve a intentarlo, o restablece tu contraseña.');
    }
    const result = await login(db, { email, password: pass, ip, userAgent: req.headers['user-agent'], now });
    loginByAccount.reset(key);
    res.setHeader('Set-Cookie', sessionCookie(result.token, { secure: secureCookies }));
    res.json({ user: result.user });
  }));

  router.post('/logout', route(async (req, res) => {
    if (req.aula.sessionId) await revokeSession(req.aula.db, req.aula.sessionId, req.aula.now);
    res.setHeader('Set-Cookie', clearedSessionCookie({ secure: secureCookies }));
    res.json({ ok: true });
  }));

  router.post('/recover', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const email = emailField(req.body?.email);
    const allowed = recoverByIp.hit(ip || 'sin-ip') && recoverByEmail.hit(email);
    if (!allowed) {
      throw tooMany('Ya pediste varios enlaces. Revisa tu bandeja de entrada (y la carpeta de spam) o espera una hora.');
    }
    const prepared = await prepareReset(db, email, { now });
    if (prepared) {
      const message = resetEmail({ firstName: prepared.user.firstName, link: accessLink(siteUrl, prepared.token) });
      const sent = await mailer.send({ to: prepared.user.email, ...message });
      if (!sent) {
        console.error(JSON.stringify({ level: 'error', ns: 'aula', msg: 'No se pudo enviar el correo de recuperación', user: prepared.user.id }));
      }
    }
    // Misma respuesta exista o no la cuenta.
    res.json({
      ok: true,
      message: 'Si ese correo tiene una cuenta en el aula, te enviamos un enlace para restablecer la contraseña. Revisa también la carpeta de spam.',
    });
  }));

  router.post('/link/inspect', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    if (!linkByIp.hit(ip || 'sin-ip')) throw tooMany('Hubo demasiados intentos. Espera unos minutos.');
    const info = await inspectAuthToken(db, req.body?.token, { now });
    res.json(info);
  }));

  router.post('/link/redeem', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    if (!linkByIp.hit(ip || 'sin-ip')) throw tooMany('Hubo demasiados intentos. Espera unos minutos.');
    const result = await redeemAuthToken(db, {
      token: req.body?.token,
      password: password(req.body?.password),
      ip,
      userAgent: req.headers['user-agent'],
      now,
    });
    res.setHeader('Set-Cookie', sessionCookie(result.token, { secure: secureCookies }));
    res.json({ user: result.user, purpose: result.purpose });
  }));

  router.post('/password', requireUser, route(async (req, res) => {
    const { db, user, sessionId, now } = req.aula;
    await changePassword(db, {
      userId: user.id,
      sessionId,
      current: password(req.body?.current, 'current'),
      next: password(req.body?.next, 'next'),
      now,
    });
    res.json({ ok: true, message: 'Tu contraseña se actualizó. Cerramos las demás sesiones abiertas.' });
  }));

  return router;
}
