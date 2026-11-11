/**
 * ============================================================
 *  solicitudes.js — Recibir y atender lo que piden por la web
 *
 *  POST /api/aula/solicitudes                  público
 *  GET  /api/aula/admin/solicitudes            solo administración
 *  POST /api/aula/admin/solicitudes/:id        cambiar estado o nota
 *
 *  Va bajo /api/aula por la misma razón que las opiniones: aquí ya
 *  están el encabezado anti-CSRF, el límite de intentos y la sesión de
 *  quien administra. El formulario público no necesita cuenta.
 * ============================================================
 */

import express from 'express';
import { id as idField, route, tooMany } from '../../lib/aula/http.js';
import { clientIp, createRateLimiter } from '../../lib/aula/security.js';
import {
  actualizarSolicitud, avisoDeSolicitud, clasificarPendientes, crearSolicitud, listarSolicitudes, leerSolicitud,
  solicitudesCsv,
} from '../../lib/aula/solicitudes.js';
import { enviarCorreoEmbudo, plantillaDeRegistro } from '../../lib/aula/correos-embudo.js';

/** Formularios del embudo: a quien los llena se le responde con su enlace. */
const DEL_EMBUDO = /^(unete|encuesta|guia|cierre)-/;

const UNA_HORA = 60 * 60 * 1000;

export function solicitudesRouter({ mailer, siteUrl, notifyEmail }) {
  const router = express.Router();
  const porIp = createRateLimiter({ windowMs: UNA_HORA, max: 10 });
  const porCorreo = createRateLimiter({ windowMs: UNA_HORA, max: 4 });

  router.post('/', route(async (req, res) => {
    // Campo trampa: invisible para las personas, los robots lo llenan.
    // Se responde como si nada para no enseñarles a esquivarlo.
    if (req.body?.sitioWeb) return res.status(201).json({ ok: true });

    if (!porIp.hit(clientIp(req) || 'sin-ip')) {
      throw tooMany('Recibimos varias solicitudes desde tu conexión. Espera un rato o escríbenos por WhatsApp.');
    }
    const datos = leerSolicitud(req.body);
    if (!porCorreo.hit(datos.correo)) {
      throw tooMany('Ya recibimos varias solicitudes con este correo. Te responderemos pronto.');
    }

    const solicitud = await crearSolicitud(req.aula.db, datos);

    // El aviso por correo es una comodidad: si no sale, la solicitud
    // igual está guardada y se ve en el panel.
    if (notifyEmail && mailer) {
      try {
        await mailer.send({ to: notifyEmail, ...avisoDeSolicitud(solicitud, siteUrl) });
      } catch (err) {
        console.error(JSON.stringify({ level: 'error', msg: 'No salió el aviso de solicitud', error: err.message }));
      }
    }

    // La respuesta a la persona: su enlace gratis o el paso siguiente.
    // Una sola vez por correo y tipo de registro.
    if (DEL_EMBUDO.test(solicitud.referencia || '')) {
      const plantilla = plantillaDeRegistro(solicitud);
      await enviarCorreoEmbudo(req.aula.db, mailer, {
        correo: solicitud.correo,
        plantilla,
        clave: (solicitud.areas || [])[0] || '',
        datos: { nombre: solicitud.nombre, area: (solicitud.areas || [])[0] || null, institucion: solicitud.institucion, siteUrl },
      });
    }
    return res.status(201).json({ ok: true, id: solicitud.id, temperatura: solicitud.temperatura });
  }));

  return router;
}

export function adminSolicitudesRouter() {
  const router = express.Router();

  router.get('/solicitudes', route(async (req, res) => {
    const pagina = Number(req.query.pagina) > 0 ? Number(req.query.pagina) : 1;
    const q = (k) => (req.query[k] ? String(req.query[k]) : null);
    await clasificarPendientes(req.aula.db);
    res.json(await listarSolicitudes(req.aula.db, {
      estado: q('estado'),
      tipo: q('tipo'),
      publico: q('publico'),
      temperatura: q('temperatura'),
      interes: q('interes'),
      pagina,
    }));
  }));

  // El CRM en CSV: para Excel o para importar en la herramienta de correo.
  router.get('/solicitudes.csv', route(async (req, res) => {
    await clasificarPendientes(req.aula.db);
    const csv = await solicitudesCsv(req.aula.db);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="crm-edvanta-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(`﻿${csv}`);
  }));

  router.post('/solicitudes/:id', route(async (req, res) => {
    const solicitud = await actualizarSolicitud(
      req.aula.db,
      idField(req.params.id),
      { estado: req.body?.estado, notaInterna: req.body?.notaInterna },
      { actor: req.aula.user, ip: clientIp(req) },
    );
    res.json({ solicitud });
  }));

  return router;
}
