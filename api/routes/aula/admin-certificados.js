/**
 * Certificados de aprobación, para la administración: ver los emitidos en
 * un curso y revocar uno (queda la constancia; no se borra).
 */
import express from 'express';
import { id as idField, route } from '../../lib/aula/http.js';
import { certificadosDelCurso, revocarCertificado } from '../../lib/aula/certificados.js';
import { actorOf } from './middleware.js';

export function adminCertificadosRouter() {
  const router = express.Router();

  router.get('/courses/:id/certificates', route(async (req, res) => {
    const courseId = idField(req.params.id, 'id', 'El curso');
    res.json(await certificadosDelCurso(req.aula.db, courseId));
  }));

  router.post('/certificates/:id/revoke', route(async (req, res) => {
    const id = idField(req.params.id, 'id', 'El certificado');
    res.json(await revocarCertificado(req.aula.db, actorOf(req), id, req.body?.motivo, { now: req.aula.now }));
  }));

  return router;
}
