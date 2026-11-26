/**
 * Edvanta Assist (/api/aula/admin/assist) — solo administradores del aula.
 *
 *   GET  /buscar?q=                    personas por correo o nombre
 *   GET  /persona?correo=              ficha completa + qué hacer ahora
 *   POST /persona/notas                { correo, nota }
 *   POST /persona/enlace-acceso        { correo }            invitación o restablecer
 *   POST /persona/recordatorio-pago    { correo, courseId }  correo «pago-pendiente»
 *   POST /persona/oferta-certificado   { correo, courseId }  correo «curso-completado»
 *   POST /persona/pago-enlace          { correo, courseId }  pago por el enlace de WhatsApp: abre el curso
 *   GET  /bandeja                      listas de trabajo del día
 *   GET  /ventas?dias=30               embudo, ingresos, metas de hoy y recuperación
 *   POST /servicios                    { correo, servicio, valor, moneda?, nota? }
 *   POST /servicios/:id/anular
 *   GET  /metas · PUT /metas           { certificados?, guias?, servicios? } por día
 *
 * Los correos manuales usan las mismas plantillas que los automáticos y
 * el mismo registro (embudo_correos): si el automático aún no salió, el
 * manual ocupa su lugar y no se repite; si ya salió, se permite uno
 * manual por día.
 */
import express from 'express';
import { prepareReset } from '../../lib/aula/accounts.js';
import {
  agregarNota, bandejaDeAtencion, buscarPersonas, fichaDePersona, resumenDeVentas,
} from '../../lib/aula/assist.js';
import { audit } from '../../lib/aula/audit.js';
import { enviarCorreoEmbudo } from '../../lib/aula/correos-embudo.js';
import { one } from '../../lib/aula/db.js';
import { urlDelCertificado } from '../../lib/aula/embudo-programado.js';
import { accessLink, inviteEmail, resetEmail } from '../../lib/aula/emails.js';
import {
  badRequest, bogotaYmd, conflict, email as emailField, id as idField, int, notFound, num, oneOf, route, str,
} from '../../lib/aula/http.js';
import { precioDelCertificado } from '../../lib/precio-certificado.js';
import {
  SERVICIOS_SUGERIDOS, anularVentaServicio, guardarMetas, metasDiarias, registrarVentaServicio,
} from '../../lib/ventas.js';
import { concederPagoDeCertificado } from '../../lib/aula/checkout.js';
import { ENLACE_PAGO_WHATSAPP } from '../../lib/aula/enlace-pago.js';
import { actorOf } from './middleware.js';

const SLUG = `(SELECT ps.slug FROM public_slugs ps WHERE ps.entity = 'aula' AND ps.entity_id = c.id AND ps.is_current LIMIT 1)`;

export function adminAssistRouter({ mailer, siteUrl, adminEmailHashes = [] }) {
  const router = express.Router();
  const sitio = String(siteUrl || 'https://edvanta.co').replace(/\/+$/, '');

  router.get('/buscar', route(async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 120) : '';
    if (q.length < 2) return res.json({ items: [] });
    res.json({ items: await buscarPersonas(req.aula.db, q) });
  }));

  router.get('/persona', route(async (req, res) => {
    const correo = emailField(req.query.correo, 'correo');
    const ficha = await fichaDePersona(req.aula.db, correo, { now: req.aula.now, siteUrl: sitio });
    if (!ficha) throw notFound('No encontramos a nadie con ese correo: ni cuenta, ni solicitudes, ni correos enviados.');
    res.json(ficha);
  }));

  router.post('/persona/notas', route(async (req, res) => {
    const { db, ip } = req.aula;
    const correo = emailField(req.body?.correo, 'correo');
    const nota = str(req.body?.nota, 'nota', 'La nota', { max: 2000 });
    const fila = await agregarNota(db, { correo, nota, actor: actorOf(req) });
    await audit(db, {
      actor: actorOf(req), action: 'assist.nota', entityType: 'persona', summary: `Nota de atención para ${correo}`, ip,
    });
    res.status(201).json({ id: Number(fila.id), nota: fila.nota, autor: fila.autor_email, fecha: fila.created_at });
  }));

  router.post('/persona/enlace-acceso', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const correo = emailField(req.body?.correo, 'correo');
    const preparado = await prepareReset(db, correo, { now, adminHashes: adminEmailHashes });
    if (!preparado) throw notFound('No hay una cuenta activa con ese correo (o está suspendida).');
    const link = accessLink(sitio, preparado.token);
    const mensaje = preparado.purpose === 'invite'
      ? inviteEmail({ firstName: preparado.user.firstName, link, admin: preparado.user.role === 'admin' })
      : resetEmail({ firstName: preparado.user.firstName, link });
    const enviado = Boolean(await mailer?.send({ to: preparado.user.email, ...mensaje }));
    await audit(db, {
      actor: actorOf(req), action: 'assist.enlace', entityType: 'usuario', entityId: preparado.user.id,
      summary: `Enlace de ${preparado.purpose === 'invite' ? 'invitación' : 'acceso'} enviado a ${correo}${enviado ? '' : ' (el correo no salió)'}`, ip,
    });
    res.json({ enviado, proposito: preparado.purpose });
  }));

  /** Persona + curso + matrícula para los correos de venta manuales. */
  async function personaYCurso(db, correo, courseId) {
    const fila = await one(
      db,
      `SELECT u.id AS user_id, u.email, u.first_name, c.id AS course_id, c.title, c.kind, c.certificate_price,
              e.assigned_at, e.completed_at, e.assignment_id, ${SLUG} AS slug,
              EXISTS (SELECT 1 FROM aula_certificate_payments p WHERE p.user_id = u.id AND p.course_id = c.id AND p.status = 'aprobado') AS pagado,
              EXISTS (SELECT 1 FROM aula_certificate_payments p WHERE p.user_id = u.id AND p.course_id = c.id AND p.status = 'pendiente') AS pendiente
         FROM aula_users u
         JOIN aula_courses c ON c.id = $2 AND c.deleted_at IS NULL
         LEFT JOIN aula_enrollments e ON e.user_id = u.id AND e.course_id = c.id
        WHERE u.email = $1 AND u.deleted_at IS NULL`,
      [correo, courseId],
    );
    if (!fila) throw notFound('No encontramos esa cuenta o ese curso.');
    if (fila.pagado) throw conflict('Esta persona ya pagó el certificado de este curso.');
    if (!(Number(fila.certificate_price) > 0) || fila.kind !== 'edvanta' || fila.assignment_id !== null) {
      throw badRequest('Este curso no tiene certificado de pago para esta persona.');
    }
    return fila;
  }

  /** Envía una plantilla de venta: la clave automática si está libre; si no, una manual por día. */
  async function enviarVenta(db, now, { correo, plantilla, courseId, datos }) {
    const libre = !(await one(
      db,
      'SELECT 1 AS x FROM embudo_correos WHERE correo = $1 AND plantilla = $2 AND clave = $3',
      [correo, plantilla, String(courseId)],
    ));
    const clave = libre ? String(courseId) : `${courseId}:manual:${bogotaYmd(now)}`;
    if (!libre) {
      const hoy = await one(
        db,
        'SELECT 1 AS x FROM embudo_correos WHERE correo = $1 AND plantilla = $2 AND clave = $3',
        [correo, plantilla, clave],
      );
      if (hoy) throw conflict('Este correo ya se le envió hoy. Mejor escríbele por WhatsApp.');
    }
    return enviarCorreoEmbudo(db, mailer, { correo, plantilla, clave, datos: { ...datos, siteUrl: sitio } });
  }

  router.post('/persona/recordatorio-pago', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const correo = emailField(req.body?.correo, 'correo');
    const courseId = idField(req.body?.courseId, 'courseId', 'El curso');
    const f = await personaYCurso(db, correo, courseId);
    if (!f.pendiente) throw badRequest('Esta persona no tiene un pago pendiente de este curso.');
    const oferta = precioDelCertificado(f, { pais: 'CO', inscritoEl: f.assigned_at, ahora: now });
    const enviado = await enviarVenta(db, now, {
      correo, plantilla: 'pago-pendiente', courseId,
      datos: { nombre: f.first_name, curso: f.title, pagarUrl: urlDelCertificado(sitio, f), precio: oferta.precio || null },
    });
    await audit(db, {
      actor: actorOf(req), action: 'assist.recordatorio', entityType: 'usuario', entityId: f.user_id, courseId,
      summary: `Recordatorio de pago de «${f.title}» a ${correo}${enviado ? '' : ' (el correo no salió)'}`, ip,
    });
    res.json({ enviado });
  }));

  // Venta por WhatsApp (enlace-pago.js): quien administra vio el pago del
  // enlace en Mercado Pago y lo registra; eso abre el curso completo y su
  // certificado. Queda en la bitácora con la nota del medio de pago.
  router.post('/persona/pago-enlace', route(async (req, res) => {
    const { db, now } = req.aula;
    const correo = emailField(req.body?.correo, 'correo');
    const courseId = idField(req.body?.courseId, 'courseId', 'El curso');
    const pago = await concederPagoDeCertificado(db, actorOf(req), {
      courseId, email: correo,
      nota: `Pagó por el enlace de Mercado Pago ${ENLACE_PAGO_WHATSAPP.url} (venta por WhatsApp); registrado en Assist.`,
    }, { now });
    res.json({ ok: true, pago });
  }));

  router.post('/persona/oferta-certificado', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const correo = emailField(req.body?.correo, 'correo');
    const courseId = idField(req.body?.courseId, 'courseId', 'El curso');
    const f = await personaYCurso(db, correo, courseId);
    if (!f.completed_at) throw badRequest('Esta persona aún no termina el curso.');
    const oferta = precioDelCertificado(f, { pais: 'CO', inscritoEl: f.assigned_at, ahora: now });
    const enviado = await enviarVenta(db, now, {
      correo, plantilla: 'curso-completado', courseId,
      datos: {
        nombre: f.first_name, curso: f.title, certificadoUrl: urlDelCertificado(sitio, f),
        precio: oferta.precio || null, precioLista: oferta.conDescuento ? oferta.lista : null,
        venceEl: oferta.conDescuento ? oferta.venceEl : null,
      },
    });
    await audit(db, {
      actor: actorOf(req), action: 'assist.oferta', entityType: 'usuario', entityId: f.user_id, courseId,
      summary: `Oferta del certificado de «${f.title}» a ${correo}${enviado ? '' : ' (el correo no salió)'}`, ip,
    });
    res.json({ enviado });
  }));

  /* ── Servicios vendidos (se cierran por WhatsApp) ──────────── */

  router.get('/servicios/sugeridos', route(async (_req, res) => {
    res.json({ items: SERVICIOS_SUGERIDOS });
  }));

  router.post('/servicios', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const correo = emailField(req.body?.correo, 'correo');
    const servicio = str(req.body?.servicio, 'servicio', 'El servicio', { min: 2, max: 160 });
    const valor = num(req.body?.valor, 'valor', 'El valor', { min: 0, max: 1_000_000_000 });
    const moneda = oneOf(req.body?.moneda ?? 'COP', 'moneda', 'La moneda', ['COP', 'USD', 'MXN', 'EUR', 'PEN', 'CLP', 'ARS']);
    const nota = str(req.body?.nota, 'nota', 'La nota', { max: 1000, optional: true });
    const nombre = str(req.body?.nombre, 'nombre', 'El nombre', { max: 160, optional: true });
    const fila = await registrarVentaServicio(db, { correo, nombre, servicio, valor, moneda, nota, vendidaEl: now, actor: actorOf(req) });
    await audit(db, {
      actor: actorOf(req), action: 'assist.servicio', entityType: 'venta_servicio', entityId: fila.id,
      summary: `Venta de servicio «${servicio}» a ${correo} por ${valor} ${moneda}`, ip,
    });
    res.status(201).json({
      id: Number(fila.id), servicio: fila.servicio, valor: Number(fila.valor), moneda: fila.moneda,
      nota: fila.nota, fecha: fila.vendida_el, anulada: null,
    });
  }));

  router.post('/servicios/:id/anular', route(async (req, res) => {
    const { db, ip, now } = req.aula;
    const id = idField(req.params.id);
    const fila = await anularVentaServicio(db, id, now);
    if (!fila) throw notFound('No encontramos esa venta, o ya estaba anulada.');
    await audit(db, {
      actor: actorOf(req), action: 'assist.servicio_anular', entityType: 'venta_servicio', entityId: id,
      summary: `Venta de servicio «${fila.servicio}» a ${fila.correo} anulada`, ip,
    });
    res.json({ ok: true });
  }));

  /* ── Metas diarias ────────────────────────────────────────── */

  router.get('/metas', route(async (req, res) => {
    res.json(await metasDiarias(req.aula.db));
  }));

  router.put('/metas', route(async (req, res) => {
    const { db, ip } = req.aula;
    const metas = {};
    for (const clave of ['certificados', 'guias', 'servicios']) {
      if (req.body?.[clave] !== undefined) metas[clave] = int(req.body[clave], clave, 'La meta', { min: 0, max: 100000 });
    }
    const resultado = await guardarMetas(db, metas, actorOf(req));
    await audit(db, {
      actor: actorOf(req), action: 'assist.metas', entityType: 'metas', summary: `Metas diarias: ${JSON.stringify(resultado)}`, ip,
    });
    res.json(resultado);
  }));

  router.get('/bandeja', route(async (req, res) => {
    res.json(await bandejaDeAtencion(req.aula.db, { now: req.aula.now }));
  }));

  router.get('/ventas', route(async (req, res) => {
    const dias = Math.min(365, Math.max(1, parseInt(req.query.dias, 10) || 30));
    res.json(await resumenDeVentas(req.aula.db, { dias, now: req.aula.now }));
  }));

  return router;
}
