/**
 * GET /api/aula/precio-certificado/:courseId
 *
 * Cuánto pagaría quien mira por el certificado de un curso propio: según
 * su país (Cloudflare) y, si ya está inscrito, el plazo de la oferta que
 * cuenta desde su inscripción. Es lo mismo que cobrará el checkout
 * (lib/precio-certificado.js). Sin caché: depende de quién pregunta.
 */
import express from 'express';
import { one } from '../../lib/aula/db.js';
import { id as idField, notFound, route } from '../../lib/aula/http.js';
import { paisDeSolicitud, precioDelCertificado } from '../../lib/precio-certificado.js';
import { equivalenteLocal, obtenerTasas } from '../../lib/tasas-de-cambio.js';

// En las pruebas no se consulta la red: las tasas se inyectan o no hay equivalente.
export function precioPublicoRouter({ db, tasas = process.env.VITEST ? async () => null : obtenerTasas }) {
  const router = express.Router();
  router.get('/:courseId', route(async (req, res) => {
    const courseId = idField(req.params.courseId, 'courseId', 'El curso');
    const curso = await one(
      db,
      `SELECT id, certificate_price FROM aula_courses
        WHERE id = $1 AND kind = 'edvanta' AND status = 'publicado' AND deleted_at IS NULL`,
      [courseId],
    );
    if (!curso) throw notFound('No encontramos ese curso.');
    const user = req.aula?.user || null;
    const matricula = user
      ? await one(db, `SELECT assigned_at, assignment_id FROM aula_enrollments
                        WHERE user_id = $1 AND course_id = $2 AND withdrawn_at IS NULL
                        ORDER BY assigned_at DESC LIMIT 1`, [user.id, courseId])
      : null;
    const ahora = req.aula?.now || new Date();
    const oferta = precioDelCertificado(curso, { pais: paisDeSolicitud(req), inscritoEl: matricula?.assigned_at || null, ahora });
    res.set('Cache-Control', 'private, no-store');
    // Equivalente aproximado en la moneda local (fuera de Colombia). Se cobra en COP.
    const equivalente = oferta.pais && oferta.pais !== 'CO' ? equivalenteLocal(oferta.precio, oferta.pais, await tasas()) : null;
    res.json({ cursoId: Number(curso.id), ...oferta, equivalente, institucion: Boolean(matricula?.assignment_id) });
  }));
  return router;
}
