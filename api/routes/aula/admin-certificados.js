/**
 * Certificados de aprobación, para la administración: ver los emitidos en
 * un curso y revocar uno (queda la constancia; no se borra).
 */
import express from 'express';
import { id as idField, route } from '../../lib/aula/http.js';
import { certificadosDelCurso, revocarCertificado } from '../../lib/aula/certificados.js';
import { concederPagoDeCertificado, pagosDeCertificadosDelCurso } from '../../lib/aula/checkout.js';
import { actorOf } from './middleware.js';

export function adminCertificadosRouter() {
  const router = express.Router();

  router.get('/courses/:id/certificates', route(async (req, res) => {
    const courseId = idField(req.params.id, 'id', 'El curso');
    res.json(await certificadosDelCurso(req.aula.db, courseId));
  }));

  // Pagos del certificado: ver los de un curso y registrar uno hecho por
  // otro medio (transferencia, convenio). Queda en la auditoría.
  router.get('/courses/:id/certificate-payments', route(async (req, res) => {
    const courseId = idField(req.params.id, 'id', 'El curso');
    res.json({ pagos: await pagosDeCertificadosDelCurso(req.aula.db, courseId) });
  }));

  router.post('/courses/:id/certificate-payments', route(async (req, res) => {
    const courseId = idField(req.params.id, 'id', 'El curso');
    res.status(201).json(await concederPagoDeCertificado(req.aula.db, actorOf(req), {
      courseId, email: req.body?.email, nota: req.body?.nota,
    }, { now: req.aula.now }));
  }));

  router.post('/certificates/:id/revoke', route(async (req, res) => {
    const id = idField(req.params.id, 'id', 'El certificado');
    res.json(await revocarCertificado(req.aula.db, actorOf(req), id, req.body?.motivo, { now: req.aula.now }));
  }));

  return router;
}
