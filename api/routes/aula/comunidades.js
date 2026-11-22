/**
 * ============================================================
 *  comunidades.js — Inscripción a los grupos de apoyo
 *
 *  POST /api/aula/comunidades/:slug/inscripcion            público
 *  GET  /api/aula/admin/comunidades/inscripciones          administración
 *  GET  /api/aula/admin/comunidades/resumen                administración
 *  GET  /api/aula/admin/comunidades/inscripciones.csv      administración
 *  POST /api/aula/admin/comunidades/inscripciones/:id      estado o nota
 *
 *  Va bajo /api/aula como las solicitudes: encabezado anti-CSRF,
 *  límite de intentos y sesión de administración.
 * ============================================================
 */

import express from 'express';
import { id as idField, route, tooMany } from '../../lib/aula/http.js';
import { clientIp, createRateLimiter } from '../../lib/aula/security.js';
import {
  actualizarInscripcion, avisoDeInscripcion, guardarInscripcion, inscripcionesCsv, leerInscripcion,
  listarInscripciones, resumenDeComunidades,
} from '../../lib/aula/comunidades.js';
import { enviarCorreoEmbudo } from '../../lib/aula/correos-embudo.js';

const UNA_HORA = 60 * 60 * 1000;

export function comunidadesRouter({ mailer, siteUrl, notifyEmail }) {
  const router = express.Router();
  const porIp = createRateLimiter({ windowMs: UNA_HORA, max: 10 });
  const porCorreo = createRateLimiter({ windowMs: UNA_HORA, max: 4 });

  router.post('/:slug/inscripcion', route(async (req, res) => {
    // Campo trampa: invisible para las personas, los robots lo llenan.
    if (req.body?.sitioWeb) return res.status(201).json({ ok: true });

    if (!porIp.hit(clientIp(req) || 'sin-ip')) {
      throw tooMany('Recibimos varias inscripciones desde tu conexión. Espera un rato o escríbenos por WhatsApp.');
    }
    const datos = leerInscripcion(req.params.slug, req.body);
    if (!porCorreo.hit(datos.correo)) {
      throw tooMany('Ya recibimos varias inscripciones con este correo. Espera un rato e inténtalo de nuevo.');
    }

    const inscripcion = await guardarInscripcion(req.aula.db, datos);

    // Avisos: comodidades. Si no salen, la inscripción ya está guardada.
    if (inscripcion.primeraVez && notifyEmail && mailer) {
      try {
        await mailer.send({ to: notifyEmail, ...avisoDeInscripcion(inscripcion, siteUrl) });
      } catch (err) {
        console.error(JSON.stringify({ level: 'error', msg: 'No salió el aviso de inscripción', error: err.message }));
      }
    }
    // Bienvenida a la persona: una sola vez por grupo.
    await enviarCorreoEmbudo(req.aula.db, mailer, {
      correo: inscripcion.correo,
      plantilla: 'bienvenida-comunidad',
      clave: inscripcion.comunidad,
      datos: { nombre: inscripcion.nombre, comunidad: inscripcion.comunidad, siteUrl },
    });

    return res.status(201).json({ ok: true, id: inscripcion.id, primeraVez: inscripcion.primeraVez });
  }));

  return router;
}

export function adminComunidadesRouter() {
  const router = express.Router();
  const q = (req, k) => (req.query[k] ? String(req.query[k]) : null);

  router.get('/comunidades/inscripciones', route(async (req, res) => {
    const pagina = Number(req.query.pagina) > 0 ? Number(req.query.pagina) : 1;
    res.json(await listarInscripciones(req.aula.db, { comunidad: q(req, 'comunidad'), estado: q(req, 'estado'), pagina }));
  }));

  router.get('/comunidades/resumen', route(async (req, res) => {
    res.json(await resumenDeComunidades(req.aula.db, { comunidad: q(req, 'comunidad') }));
  }));

  router.get('/comunidades/inscripciones.csv', route(async (req, res) => {
    const csv = await inscripcionesCsv(req.aula.db, { comunidad: q(req, 'comunidad') });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="grupos-de-apoyo-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(`﻿${csv}`);
  }));

  router.post('/comunidades/inscripciones/:id', route(async (req, res) => {
    const inscripcion = await actualizarInscripcion(
      req.aula.db,
      idField(req.params.id),
      { estado: req.body?.estado, notaInterna: req.body?.notaInterna },
      { actor: req.aula.user, ip: clientIp(req) },
    );
    res.json({ inscripcion });
  }));

  return router;
}
