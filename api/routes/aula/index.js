/**
 * Router del Aula Edvanta (/api/aula).
 *
 * Se construye con sus dependencias (base de datos, almacenamiento,
 * correo) para poder probarlo completo con PGlite y un disco temporal.
 */
import express from 'express';
import { ensureBootstrapAdmins } from '../../lib/aula/accounts.js';
import { publicarAprobados, republicarAprobadas } from '../../lib/aula/publicaciones.js';
import { errorHandler, notFound } from '../../lib/aula/http.js';
import { requireAulaHeader } from '../../lib/aula/security.js';
import { adminAssistRouter } from './admin-assist.js';
import { adminAuditRouter } from './admin-audit.js';
import { adminCoursesRouter } from './admin-courses.js';
import { adminPeopleRouter } from './admin-people.js';
import { adminCertificadosRouter } from './admin-certificados.js';
import { adminSummaryRouter } from './admin-summary.js';
import { meRouter } from './me.js';
import { pedagogiaRouter } from './pedagogia.js';
import { docenteRouter } from './docente.js';
import { authRouter } from './auth.js';
import { filesRouter, sweepStaleUploads, uploadsRouter } from './files.js';
import { opinionesRouter } from './opiniones.js';
import { adminModeracionRouter } from './admin-moderacion.js';
import { adminSolicitudesRouter, solicitudesRouter } from './solicitudes.js';
import { attachSession, requireAdmin, requireDocente, requireUser } from './middleware.js';
import { precioPublicoRouter } from './precio-publico.js';

export function createAulaRouter({
  db,
  storage,
  mailer,
  siteUrl,
  secureCookies = true,
  adminEmailHashes = [],
  notifyEmail = null,
  now = () => new Date(),
  // Crea la preferencia de pago; las pruebas la reemplazan para no usar la red.
  crearPreferencia = null,
}) {
  const deps = { db, storage, mailer, siteUrl, secureCookies, adminEmailHashes, notifyEmail, crearPreferencia };
  const router = express.Router();

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  router.use(requireAulaHeader);
  router.use(express.json({ limit: '4mb' }));
  router.use(attachSession({ db, now }));

  router.use('/auth', authRouter(deps));
  router.use('/uploads', requireUser, uploadsRouter(deps));
  router.use('/files', requireUser, filesRouter(deps));
  router.use('/me', requireUser, pedagogiaRouter(deps));
  router.use('/me', requireUser, meRouter(deps));
  router.use('/docente', requireUser, requireDocente, docenteRouter(deps));
  // Leer opiniones y preguntas es público; escribir se comprueba dentro.
  router.use('/opiniones', opinionesRouter(deps));
  // Precio del certificado para quien mira (país y plazo de la oferta).
  router.use('/precio-certificado', precioPublicoRouter(deps));
  // Interés, propuestas y contacto: se envían sin cuenta.
  router.use('/solicitudes', solicitudesRouter(deps));

  const admin = express.Router();
  admin.use('/summary', adminSummaryRouter(deps));
  // Edvanta Assist: atención de personas, bandeja de trabajo y ventas.
  admin.use('/assist', adminAssistRouter(deps));
  admin.use('/audit', adminAuditRouter(deps));
  admin.use('/', adminPeopleRouter(deps));
  admin.use('/', adminCoursesRouter(deps));
  admin.use('/', adminModeracionRouter(deps));
  admin.use('/', adminCertificadosRouter(deps));
  admin.use('/', adminSolicitudesRouter(deps));
  router.use('/admin', requireAdmin, admin);

  router.use((_req, _res, next) => next(notFound('Esta ruta del aula no existe.')));
  router.use(errorHandler);
  return router;
}

/** Tareas de arranque: carpetas de archivos, administradores iniciales y limpieza periódica. */
export async function startAula({
  db, storage, adminEmails = [], adminHashes = [], log = () => {},
  // Con varios procesos, server.js pasa un candado para que la limpieza
  // corra en uno solo; sin él (pruebas, desarrollo), corre directo.
  envolverLimpieza = (limpiar) => limpiar(),
}) {
  await storage.init();
  const admins = await ensureBootstrapAdmins(db, adminEmails, { hashes: adminHashes });
  log({ msg: 'Aula lista', admins, storage: storage.root });

  // Cursos sembrados por migración que ya venían aprobados para publicar.
  try {
    await publicarAprobados(db, { log });
  } catch (err) {
    log({ level: 'error', msg: 'Falló la publicación de cursos aprobados', error: err.message });
  }
  // Y las versiones nuevas aprobadas de cursos ya publicados (videos, clases reescritas).
  try {
    await republicarAprobadas(db, { log });
  } catch (err) {
    log({ level: 'error', msg: 'Falló la publicación de versiones aprobadas', error: err.message });
  }

  const sweep = () => envolverLimpieza(() => sweepStaleUploads({ db, storage }))
    .then((n) => { if (n) log({ msg: 'Subidas abandonadas limpiadas', count: n }); })
    .catch((err) => log({ level: 'error', msg: 'Falló la limpieza de subidas', error: err.message }));
  const timer = setInterval(sweep, 60 * 60 * 1000);
  timer.unref?.();
  return { admins, stop: () => clearInterval(timer) };
}
