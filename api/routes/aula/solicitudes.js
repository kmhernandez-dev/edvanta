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
  actualizarSolicitud, avisoDeSolicitud, crearSolicitud, listarSolicitudes, leerSolicitud,
} from '../../lib/aula/solicitudes.js';

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
    return res.status(201).json({ ok: true, id: solicitud.id });
  }));

  return router;
}

export function adminSolicitudesRouter() {
  const router = express.Router();

  router.get('/solicitudes', route(async (req, res) => {
    const pagina = Number(req.query.pagina) > 0 ? Number(req.query.pagina) : 1;
    res.json(await listarSolicitudes(req.aula.db, {
      estado: req.query.estado ? String(req.query.estado) : null,
      tipo: req.query.tipo ? String(req.query.tipo) : null,
      pagina,
    }));
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
