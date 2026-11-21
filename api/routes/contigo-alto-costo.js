/**
 * ============================================================
 *  routes/contigo-alto-costo.js — Programa Contigo Alto Costo
 *
 *  GET  /estado              ¿Se reciben registros? (CONTIGO_ALTO_COSTO_ACTIVO)
 *  POST /registro            Registro con autorizaciones granulares
 *  GET  /mis-datos?t=TOKEN   El titular consulta sus datos y autorizaciones
 *  POST /mis-datos           El titular otorga o revoca autorizaciones
 *  POST /suprimir            El titular pide la supresión de sus datos
 *  GET  /admin/resumen       Cifras agregadas (x-admin-token)
 *  GET  /admin/contactos     Personas que autorizaron contacto de un QF (x-admin-token)
 *
 *  Reglas (Ley 1581 de 2012 y Decreto 1377 de 2013):
 *  - Los datos de salud solo se guardan con autorización expresa, y
 *    registrarse nunca exige entregarlos.
 *  - Un correo ya registrado no se sobrescribe: se le envía su enlace de
 *    gestión, y la respuesta es la misma para no revelar quién está inscrito.
 *  - Cada autorización y revocación queda en la bitácora.
 *  - Los resúmenes ocultan los grupos pequeños.
 * ============================================================
 */
import { Router } from 'express';
import {
  CONDICIONES, NECESIDADES, FINALIDADES, VERSION_CONSENTIMIENTO, MINIMO_PARA_MOSTRAR,
} from '../lib/contigo-alto-costo.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const celularPattern = /^[+\d\s().-]{7,40}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const COLUMNA = {
  datos_personales: 'autoriza_datos_personales',
  datos_sensibles: 'autoriza_datos_sensibles',
  comunicaciones: 'autoriza_comunicaciones',
  contacto_qf: 'autoriza_contacto_qf',
  estudios_anonimizados: 'autoriza_estudios_anonimizados',
  info_terceros: 'autoriza_info_terceros',
};

function limpiar(valor, max = 160) {
  return (valor ?? '').toString().trim().slice(0, max);
}

function autorizacionesDe(cuerpo) {
  const a = cuerpo?.autorizaciones || {};
  return Object.fromEntries(FINALIDADES.map((f) => [f, a[f] === true]));
}

function filaPublica(fila) {
  return {
    nombre: fila.nombre,
    email: fila.email,
    celular: fila.celular,
    departamento: fila.departamento,
    rol: fila.rol,
    necesidades: fila.necesidades,
    condicion: fila.condicion,
    medicamento: fila.medicamento,
    eps: fila.eps,
    autorizaciones: Object.fromEntries(FINALIDADES.map((f) => [f, fila[COLUMNA[f]] === true])),
    version_consentimiento: fila.version_consentimiento,
  };
}

/** Cuenta por clave y oculta los grupos con menos de MINIMO_PARA_MOSTRAR personas. */
function conSupresion(filas) {
  return filas.map((f) => ({
    clave: f.clave,
    personas: Number(f.personas) < MINIMO_PARA_MOSTRAR ? `<${MINIMO_PARA_MOSTRAR}` : Number(f.personas),
  }));
}

function correoDeBienvenida({ nombre, enlace }) {
  const saludo = nombre ? `Hola, ${nombre}` : 'Hola';
  return {
    asunto: 'Tu registro en Contigo Alto Costo de Edvanta',
    html: `<p>${saludo}:</p>
<p>Recibimos tu registro en <strong>Contigo Alto Costo</strong>, el programa de Edvanta para personas que viven con una enfermedad de alto costo y para quienes las cuidan.</p>
<p>Desde este enlace puedes revisar tus datos, cambiar tus autorizaciones o pedir que los eliminemos cuando quieras:</p>
<p><a href="${enlace}">${enlace}</a></p>
<p>Guarda este correo: el enlace es personal. Si no fuiste tú, no hagas nada y no te escribiremos de nuevo.</p>
<p>Edvanta no diagnostica ni cambia tratamientos. Ante una urgencia, acude a un servicio de salud.</p>`,
  };
}

/**
 * @param {object} opciones
 * @param {{ query: (sql: string, params?: any[]) => Promise<{ rows: any[] }> }} opciones.db
 * @param {boolean} opciones.activo   Si es false, no se reciben registros.
 * @param {string} opciones.sitio     URL pública, para el enlace de gestión.
 * @param {string} [opciones.adminToken]
 * @param {(m: { to: string, subject: string, html: string }) => Promise<any>} [opciones.enviarCorreo]
 * @param {number} [opciones.limitePorHora]
 */
export function crearRutasAltoCosto({
  db, activo, sitio, adminToken, enviarCorreo = async () => null, limitePorHora = 8,
}) {
  const router = Router();
  const intentos = new Map();

  function excedeLimite(ip) {
    const ahora = Date.now();
    const recientes = (intentos.get(ip) || []).filter((t) => ahora - t < 3_600_000);
    recientes.push(ahora);
    intentos.set(ip, recientes);
    return recientes.length > limitePorHora;
  }

  async function bitacora(registroId, accion, finalidades) {
    for (const finalidad of finalidades) {
      await db.query(
        `INSERT INTO contigo_alto_costo_autorizaciones (registro_id, accion, finalidad, version)
         VALUES ($1, $2, $3, $4)`,
        [registroId, accion, finalidad, VERSION_CONSENTIMIENTO],
      );
    }
  }

  async function avisar(email, nombre, token) {
    const enlace = `${sitio}/contigo/alto-costo/mis-datos?t=${token}`;
    const { asunto, html } = correoDeBienvenida({ nombre, enlace });
    try {
      await enviarCorreo({ to: email, subject: asunto, html });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: correo no enviado', error: e.message }));
    }
  }

  router.get('/estado', (_req, res) => {
    res.json({ activo: Boolean(activo), version: VERSION_CONSENTIMIENTO });
  });

  router.post('/registro', async (req, res) => {
    if (!activo) {
      return res.status(503).json({
        ok: false,
        error: 'en_preparacion',
        mensaje: 'El registro abrirá cuando terminemos la revisión legal del programa.',
      });
    }
    const cuerpo = req.body || {};
    // Trampa para bots: un campo oculto que una persona nunca llena.
    if (limpiar(cuerpo.sitio_web)) return res.json({ ok: true });
    if (excedeLimite(req.ip || 'desconocida')) {
      return res.status(429).json({ ok: false, error: 'Demasiados intentos. Prueba de nuevo más tarde.' });
    }

    const nombre = limpiar(cuerpo.nombre, 100);
    const email = limpiar(cuerpo.email, 255).toLowerCase();
    const celular = limpiar(cuerpo.celular, 40);
    const departamento = limpiar(cuerpo.departamento, 80);
    const rol = limpiar(cuerpo.rol, 20);
    const necesidades = Array.isArray(cuerpo.necesidades)
      ? [...new Set(cuerpo.necesidades.map((n) => limpiar(n, 40)))].filter((n) => NECESIDADES.includes(n))
      : [];
    const condicion = limpiar(cuerpo.condicion, 60);
    const medicamento = limpiar(cuerpo.medicamento, 120);
    const eps = limpiar(cuerpo.eps, 80);
    const autorizaciones = autorizacionesDe(cuerpo);

    if (nombre.length < 2) return res.status(400).json({ ok: false, error: 'Escribe tu nombre.' });
    if (!emailPattern.test(email)) return res.status(400).json({ ok: false, error: 'Escribe un correo válido.' });
    if (celular && !celularPattern.test(celular)) return res.status(400).json({ ok: false, error: 'Revisa el número de celular.' });
    if (!['paciente', 'cuidador'].includes(rol)) return res.status(400).json({ ok: false, error: 'Cuéntanos si eres paciente o cuidador.' });
    if (condicion && !CONDICIONES.includes(condicion)) return res.status(400).json({ ok: false, error: 'Elige una condición de la lista.' });
    if (!autorizaciones.datos_personales) {
      return res.status(400).json({ ok: false, error: 'Para registrarte necesitamos tu autorización para tratar tus datos personales.' });
    }
    const traeSensibles = Boolean(condicion || medicamento || eps);
    if (traeSensibles && !autorizaciones.datos_sensibles) {
      return res.status(400).json({
        ok: false,
        error: 'Para guardar tu condición, tu medicamento o tu EPS necesitamos tu autorización expresa. También puedes registrarte sin esos datos.',
      });
    }

    try {
      const existente = await db.query('SELECT token_gestion, nombre FROM contigo_alto_costo WHERE email = $1', [email]);
      if (existente.rows[0]) {
        // No se sobrescribe un registro existente: su dueño recibe el enlace para actualizarlo.
        await avisar(email, existente.rows[0].nombre, existente.rows[0].token_gestion);
        return res.json({ ok: true });
      }

      const insertado = await db.query(
        `INSERT INTO contigo_alto_costo
           (nombre, email, celular, departamento, rol, necesidades, condicion, medicamento, eps,
            autoriza_datos_personales, autoriza_datos_sensibles, autoriza_comunicaciones,
            autoriza_contacto_qf, autoriza_estudios_anonimizados, autoriza_info_terceros,
            version_consentimiento, fuente, utm_source, utm_medium, utm_campaign)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING id, token_gestion`,
        [
          nombre, email, celular || null, departamento || null, rol, necesidades,
          autorizaciones.datos_sensibles ? condicion || null : null,
          autorizaciones.datos_sensibles ? medicamento || null : null,
          autorizaciones.datos_sensibles ? eps || null : null,
          true, autorizaciones.datos_sensibles, autorizaciones.comunicaciones,
          autorizaciones.contacto_qf, autorizaciones.estudios_anonimizados, autorizaciones.info_terceros,
          VERSION_CONSENTIMIENTO,
          limpiar(cuerpo.fuente, 500) || null,
          limpiar(cuerpo.utm_source) || null, limpiar(cuerpo.utm_medium) || null, limpiar(cuerpo.utm_campaign) || null,
        ],
      );
      const { id, token_gestion: token } = insertado.rows[0];
      await bitacora(id, 'otorga', FINALIDADES.filter((f) => autorizaciones[f]));
      await avisar(email, nombre, token);
      return res.status(201).json({ ok: true });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: registro', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No pudimos guardar tu registro. Intenta de nuevo.' });
    }
  });

  async function porToken(token) {
    if (!uuidPattern.test(token || '')) return null;
    const r = await db.query('SELECT * FROM contigo_alto_costo WHERE token_gestion = $1 AND suprimido_en IS NULL', [token]);
    return r.rows[0] || null;
  }

  router.get('/mis-datos', async (req, res) => {
    try {
      const fila = await porToken(limpiar(req.query.t, 64));
      if (!fila) return res.status(404).json({ ok: false, error: 'El enlace no es válido o tus datos ya fueron eliminados.' });
      return res.json({ ok: true, datos: filaPublica(fila) });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: mis-datos', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No pudimos consultar tus datos.' });
    }
  });

  router.post('/mis-datos', async (req, res) => {
    try {
      const fila = await porToken(limpiar(req.body?.t, 64));
      if (!fila) return res.status(404).json({ ok: false, error: 'El enlace no es válido o tus datos ya fueron eliminados.' });
      const nuevas = autorizacionesDe(req.body);
      if (!nuevas.datos_personales) {
        return res.status(400).json({ ok: false, error: 'Para retirar la autorización de datos personales, pide la eliminación de tus datos.' });
      }
      const otorga = FINALIDADES.filter((f) => nuevas[f] && fila[COLUMNA[f]] !== true);
      const revoca = FINALIDADES.filter((f) => !nuevas[f] && fila[COLUMNA[f]] === true);
      await db.query(
        `UPDATE contigo_alto_costo SET
           autoriza_datos_sensibles = $2, autoriza_comunicaciones = $3, autoriza_contacto_qf = $4,
           autoriza_estudios_anonimizados = $5, autoriza_info_terceros = $6,
           condicion = CASE WHEN $2 THEN condicion ELSE NULL END,
           medicamento = CASE WHEN $2 THEN medicamento ELSE NULL END,
           eps = CASE WHEN $2 THEN eps ELSE NULL END,
           version_consentimiento = $7, actualizado_en = NOW()
         WHERE id = $1`,
        [fila.id, nuevas.datos_sensibles, nuevas.comunicaciones, nuevas.contacto_qf,
          nuevas.estudios_anonimizados, nuevas.info_terceros, VERSION_CONSENTIMIENTO],
      );
      await bitacora(fila.id, 'otorga', otorga);
      await bitacora(fila.id, 'revoca', revoca);
      const actualizada = await porToken(fila.token_gestion);
      return res.json({ ok: true, datos: filaPublica(actualizada) });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: actualizar', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No pudimos actualizar tus autorizaciones.' });
    }
  });

  router.post('/suprimir', async (req, res) => {
    try {
      const fila = await porToken(limpiar(req.body?.t, 64));
      if (!fila) return res.status(404).json({ ok: false, error: 'El enlace no es válido o tus datos ya fueron eliminados.' });
      // Se borran los datos personales y de salud; solo queda la bitácora como prueba de las autorizaciones.
      await db.query(
        `UPDATE contigo_alto_costo SET
           nombre = 'Suprimido', email = 'suprimido-' || id || '@invalido.edvanta', celular = NULL,
           departamento = NULL, necesidades = '{}', condicion = NULL, medicamento = NULL, eps = NULL,
           autoriza_datos_personales = FALSE, autoriza_datos_sensibles = FALSE, autoriza_comunicaciones = FALSE,
           autoriza_contacto_qf = FALSE, autoriza_estudios_anonimizados = FALSE, autoriza_info_terceros = FALSE,
           fuente = NULL, utm_source = NULL, utm_medium = NULL, utm_campaign = NULL,
           suprimido_en = NOW(), actualizado_en = NOW()
         WHERE id = $1`,
        [fila.id],
      );
      await bitacora(fila.id, 'revoca', FINALIDADES.filter((f) => fila[COLUMNA[f]] === true));
      return res.json({ ok: true });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: suprimir', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No pudimos eliminar tus datos. Escríbenos para hacerlo a mano.' });
    }
  });

  function soloAdmin(req, res, next) {
    if (!adminToken) return res.status(503).json({ error: 'ADMIN_TOKEN no está configurado en este servicio.' });
    if (req.headers['x-admin-token'] !== adminToken) return res.status(401).json({ error: 'No autorizado.' });
    return next();
  }

  router.get('/admin/resumen', soloAdmin, async (_req, res) => {
    try {
      const total = await db.query('SELECT COUNT(*)::int AS n FROM contigo_alto_costo WHERE suprimido_en IS NULL');
      const porCondicion = await db.query(
        `SELECT COALESCE(condicion, 'sin-dato') AS clave, COUNT(*)::int AS personas
           FROM contigo_alto_costo WHERE suprimido_en IS NULL GROUP BY 1 ORDER BY 2 DESC`,
      );
      const porNecesidad = await db.query(
        `SELECT n AS clave, COUNT(*)::int AS personas
           FROM contigo_alto_costo, unnest(necesidades) AS n
          WHERE suprimido_en IS NULL GROUP BY 1 ORDER BY 2 DESC`,
      );
      const autorizaciones = await db.query(
        `SELECT
           COUNT(*) FILTER (WHERE autoriza_datos_sensibles)::int AS datos_sensibles,
           COUNT(*) FILTER (WHERE autoriza_comunicaciones)::int AS comunicaciones,
           COUNT(*) FILTER (WHERE autoriza_contacto_qf)::int AS contacto_qf,
           COUNT(*) FILTER (WHERE autoriza_estudios_anonimizados)::int AS estudios_anonimizados,
           COUNT(*) FILTER (WHERE autoriza_info_terceros)::int AS info_terceros
         FROM contigo_alto_costo WHERE suprimido_en IS NULL`,
      );
      return res.json({
        activos: total.rows[0].n,
        por_condicion: conSupresion(porCondicion.rows),
        por_necesidad: conSupresion(porNecesidad.rows),
        autorizaciones: autorizaciones.rows[0],
        minimo_para_mostrar: MINIMO_PARA_MOSTRAR,
      });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: resumen', error: e.message }));
      return res.status(500).json({ error: 'No fue posible calcular el resumen.' });
    }
  });

  router.get('/admin/contactos', soloAdmin, async (_req, res) => {
    try {
      const r = await db.query(
        `SELECT nombre, email, celular, departamento, rol, necesidades,
                CASE WHEN autoriza_datos_sensibles THEN condicion END AS condicion,
                CASE WHEN autoriza_datos_sensibles THEN medicamento END AS medicamento,
                creado_en
           FROM contigo_alto_costo
          WHERE suprimido_en IS NULL AND autoriza_contacto_qf
          ORDER BY creado_en DESC LIMIT 500`,
      );
      return res.json({ contactos: r.rows });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'contigo-alto-costo: contactos', error: e.message }));
      return res.status(500).json({ error: 'No fue posible listar los contactos.' });
    }
  });

  return router;
}
