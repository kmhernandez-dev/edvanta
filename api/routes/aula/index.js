/**
 * Router del Aula Edvanta (/api/aula).
 *
 * Se construye con sus dependencias (base de datos, almacenamiento,
 * correo) para poder probarlo completo con PGlite y un disco temporal.
 */
import express from 'express';
import { ensureBootstrapAdmins } from '../../lib/aula/accounts.js';
import { errorHandler, notFound } from '../../lib/aula/http.js';
import { requireAulaHeader } from '../../lib/aula/security.js';
import { adminAuditRouter } from './admin-audit.js';
import { adminSummaryRouter } from './admin-summary.js';
import { meRouter } from './me.js';
import { authRouter } from './auth.js';
import { filesRouter, sweepStaleUploads, uploadsRouter } from './files.js';
import { attachSession, requireAdmin, requireUser } from './middleware.js';

export function createAulaRouter({
  db,
  storage,
  mailer,
  siteUrl,
  secureCookies = true,
  now = () => new Date(),
}) {
  const deps = { db, storage, mailer, siteUrl, secureCookies };
  const router = express.Router();

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  router.use(requireAulaHeader);
  router.use(express.json({ limit: '2mb' }));
  router.use(attachSession({ db, now }));

  router.use('/auth', authRouter(deps));
  router.use('/uploads', requireUser, uploadsRouter(deps));
  router.use('/files', requireUser, filesRouter(deps));
  router.use('/me', requireUser, meRouter(deps));

  const admin = express.Router();
  admin.use('/summary', adminSummaryRouter(deps));
  admin.use('/audit', adminAuditRouter(deps));
  router.use('/admin', requireAdmin, admin);

  router.use((_req, _res, next) => next(notFound('Esta ruta del aula no existe.')));
  router.use(errorHandler);
  return router;
}

/** Tareas de arranque: carpetas de archivos, administradores iniciales y limpieza periódica. */
export async function startAula({ db, storage, adminEmails = [], log = () => {} }) {
  await storage.init();
  const admins = await ensureBootstrapAdmins(db, adminEmails);
  log({ msg: 'Aula lista', admins, storage: storage.root });

  const sweep = () => sweepStaleUploads({ db, storage })
    .then((n) => { if (n) log({ msg: 'Subidas abandonadas limpiadas', count: n }); })
    .catch((err) => log({ level: 'error', msg: 'Falló la limpieza de subidas', error: err.message }));
  const timer = setInterval(sweep, 60 * 60 * 1000);
  timer.unref?.();
  return { admins, stop: () => clearInterval(timer) };
}
