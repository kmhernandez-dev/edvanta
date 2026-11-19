/**
 * ============================================================
 *  assist.js — Edvanta Assist: atender a cada persona
 *
 *  Con 100.000 visitas al día no se puede atender «de memoria». Assist
 *  junta en un solo lugar lo que hoy vive en cinco tablas distintas:
 *
 *   · buscarPersonas      por correo o nombre, con cuenta o sin ella
 *                         (un interesado que llenó un formulario).
 *   · fichaDePersona      la persona completa: cuenta, cursos y avance,
 *                         pagos, certificados, solicitudes, correos que
 *                         recibió, notas del equipo y QUÉ HACER AHORA.
 *   · bandejaDeAtencion   las listas de trabajo del día, ordenadas por
 *                         dinero en juego: solicitudes nuevas, pagos sin
 *                         terminar, cursos terminados sin certificado,
 *                         estudiantes quietos e invitaciones sin abrir.
 *   · resumenDeVentas     el embudo de los últimos días: cuentas,
 *                         inscripciones, pagos, ingresos, conversión y
 *                         lo que recuperaron los correos automáticos.
 *
 *  Todo es lectura salvo las notas y las acciones (enlace de acceso,
 *  recordatorio de pago, oferta del certificado), que quedan en la
 *  bitácora del aula.
 *
 *  Nada inventado: los precios salen de precio-certificado.js y los
 *  números, de la base. Los mensajes de WhatsApp no suponen el género.
 * ============================================================
 */
import { many, one } from './db.js';
import { precioDelCertificado } from '../precio-certificado.js';
import { WA_NUMERO } from './correos-embudo.js';

const HORA = 60 * 60 * 1000;
const DIA = 24 * HORA;
export const UMBRALES = Object.freeze({
  pagoAbandonadoHoras: 2,
  inactivoDias: 7,
  invitadoSinEntrarDias: 3,
  sinEmpezarDias: 3,
  ventanaDias: 60,
});

const SLUG = `(SELECT ps.slug FROM public_slugs ps WHERE ps.entity = 'aula' AND ps.entity_id = c.id AND ps.is_current LIMIT 1)`;
const nombreDe = (r) => `${r.first_name || ''} ${r.last_name || ''}`.trim();
const primerNombre = (n) => String(n || '').trim().split(/\s+/)[0] || '';
const dias = (desde, now) => Math.max(0, Math.floor((now - new Date(desde)) / DIA));
/** «hace 5 horas», «hace 1 día», «hace 12 días». */
function hace(desde, now) {
  const ms = Math.max(0, now - new Date(desde));
  if (ms < DIA) {
    const h = Math.max(1, Math.floor(ms / HORA));
    return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`;
  }
  const d = Math.floor(ms / DIA);
  return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
}
const pesos = (n) => `COP ${Number(n).toLocaleString('es-CO')}`;
const num = (v) => (v === null || v === undefined ? null : Number(v));

/** Escapa % y _ para buscar el texto tal cual dentro de un LIKE. */
const patronLike = (q) => `%${String(q).toLowerCase().replace(/[\\%_]/g, (m) => `\\${m}`)}%`;

/**
 * Número de WhatsApp en formato internacional, solo dígitos. Un celular
 * colombiano de 10 dígitos (3xx) recibe el 57; lo demás se deja como vino
 * si ya trae su indicativo. null si no parece un número.
 */
export function numeroWhatsApp(valor) {
  const d = String(valor || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.length === 10 && d.startsWith('3')) return `57${d}`;
  if (d.length >= 11 && d.length <= 15) return d;
  return null;
}

/** Enlace de WhatsApp hacia la persona (no hacia Edvanta) con el mensaje escrito. */
export function enlaceWhatsApp(numero, mensaje) {
  const n = numeroWhatsApp(numero);
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}` : null;
}

const urlCurso = (sitio, m) => `${sitio}/aula/${m.slug || `curso/${m.courseId}`}`;

/* ── Búsqueda ────────────────────────────────────────────────── */

export async function buscarPersonas(db, q, { limite = 20 } = {}) {
  const texto = String(q || '').trim();
  if (texto.length < 2) return [];
  const patron = patronLike(texto);
  const cuentas = await many(
    db,
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.created_at, u.last_login_at,
            (SELECT count(*)::int FROM aula_enrollments e WHERE e.user_id = u.id AND e.withdrawn_at IS NULL) AS cursos
       FROM aula_users u
      WHERE u.deleted_at IS NULL
        AND lower(u.email || ' ' || u.first_name || ' ' || u.last_name) LIKE $1
      ORDER BY u.last_login_at DESC NULLS LAST, u.created_at DESC
      LIMIT $2`,
    [patron, limite],
  );
  const interesados = await many(
    db,
    `SELECT DISTINCT ON (lower(s.correo)) lower(s.correo) AS correo, s.nombre, s.estado, s.temperatura, s.created_at,
            count(*) OVER (PARTITION BY lower(s.correo))::int AS solicitudes
       FROM solicitudes s
      WHERE lower(s.correo || ' ' || s.nombre) LIKE $1
      ORDER BY lower(s.correo), s.created_at DESC
      LIMIT $2`,
    [patron, limite],
  );
  const porCorreo = new Map();
  for (const u of cuentas) {
    porCorreo.set(u.email, {
      correo: u.email,
      nombre: nombreDe(u) || u.email,
      cuenta: { id: Number(u.id), rol: u.role, estado: u.status, creada: u.created_at, ultimaEntrada: u.last_login_at, cursos: u.cursos },
      solicitudes: 0,
      temperatura: null,
    });
  }
  for (const s of interesados) {
    const actual = porCorreo.get(s.correo);
    if (actual) {
      actual.solicitudes = s.solicitudes;
      actual.temperatura = s.temperatura;
    } else {
      porCorreo.set(s.correo, {
        correo: s.correo, nombre: s.nombre, cuenta: null,
        solicitudes: s.solicitudes, temperatura: s.temperatura, ultimaSolicitud: s.created_at,
      });
    }
  }
  return [...porCorreo.values()].slice(0, limite);
}

/* ── Ficha de una persona ────────────────────────────────────── */

export async function fichaDePersona(db, correo, { now = new Date(), siteUrl = 'https://edvanta.co' } = {}) {
  const email = String(correo || '').trim().toLowerCase();
  const sitio = String(siteUrl).replace(/\/+$/, '');
  const cuenta = await one(
    db,
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.job_title, u.created_at,
            u.last_login_at, u.segmento, u.crm_tags, u.crm_notes, co.name AS empresa,
            (u.password_hash IS NOT NULL) AS tiene_contrasena
       FROM aula_users u
       LEFT JOIN aula_companies co ON co.id = u.company_id
      WHERE u.email = $1 AND u.deleted_at IS NULL`,
    [email],
  );

  const matriculas = cuenta ? await many(
    db,
    `SELECT e.id, e.course_id, c.title, c.kind, c.publico, c.certificate_price, e.assignment_id,
            e.progress_status, e.progress_pct, e.assigned_at, e.first_access_at, e.last_access_at,
            e.completed_at, e.withdrawn_at, e.active_seconds, ${SLUG} AS slug,
            x.status AS certificado, x.code AS certificado_codigo, x.issued_at AS certificado_emitido
       FROM aula_enrollments e
       JOIN aula_courses c ON c.id = e.course_id
       LEFT JOIN aula_certificates x ON x.enrollment_id = e.id
      WHERE e.user_id = $1
      ORDER BY e.assigned_at DESC`,
    [cuenta.id],
  ) : [];

  const pagos = cuenta ? await many(
    db,
    `SELECT p.id, p.course_id, c.title, p.status, p.source, p.amount, p.currency_id, p.note,
            p.created_at, p.approved_at
       FROM aula_certificate_payments p
       JOIN aula_courses c ON c.id = p.course_id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT 50`,
    [cuenta.id],
  ) : [];

  const solicitudes = await many(
    db,
    `SELECT id, tipo, referencia, nombre, whatsapp, rol, institucion, cargo, mensaje, estado,
            temperatura, puntaje, siguiente_accion, publico, interes, areas, origen, utm_source,
            utm_campaign, nota_interna, created_at
       FROM solicitudes
      WHERE lower(correo) = $1
      ORDER BY created_at DESC
      LIMIT 20`,
    [email],
  );

  const correos = await many(
    db,
    `SELECT plantilla, clave, enviado, created_at FROM embudo_correos
      WHERE correo = $1 ORDER BY created_at DESC LIMIT 40`,
    [email],
  );

  const notas = await many(
    db,
    `SELECT id, nota, autor_email, created_at FROM aula_assist_notas
      WHERE correo = $1 ORDER BY created_at DESC LIMIT 50`,
    [email],
  );

  if (!cuenta && !solicitudes.length && !correos.length && !notas.length) return null;

  const whatsapp = solicitudes.find((s) => numeroWhatsApp(s.whatsapp))?.whatsapp || null;
  const nombre = (cuenta && nombreDe(cuenta)) || solicitudes[0]?.nombre || email;

  const cursos = matriculas.map((m) => {
    const aprobado = pagos.find((p) => Number(p.course_id) === Number(m.course_id) && p.status === 'aprobado');
    const oferta = precioDelCertificado(m, { pais: 'CO', inscritoEl: m.assigned_at, ahora: now });
    return {
      matriculaId: Number(m.id),
      courseId: Number(m.course_id),
      titulo: m.title,
      slug: m.slug,
      url: urlCurso(sitio, { slug: m.slug, courseId: m.course_id }),
      institucional: m.assignment_id !== null,
      estado: m.progress_status,
      avance: Math.round(Number(m.progress_pct) || 0),
      inscrito: m.assigned_at,
      ultimoAcceso: m.last_access_at,
      terminado: m.completed_at,
      retirado: m.withdrawn_at,
      minutos: Math.round((m.active_seconds || 0) / 60),
      certificado: {
        conCosto: Number(m.certificate_price) > 0 && m.kind === 'edvanta' && m.assignment_id === null,
        pagado: Boolean(aprobado),
        estado: m.certificado || null,
        codigo: m.certificado_codigo || null,
        emitido: m.certificado_emitido || null,
        precioHoy: oferta.precio || null,
        precioLista: oferta.conDescuento ? oferta.lista : null,
        descuentoVence: oferta.conDescuento ? oferta.venceEl : null,
      },
    };
  });

  const persona = {
    correo: email,
    nombre,
    whatsapp: numeroWhatsApp(whatsapp),
    cuenta: cuenta ? {
      id: Number(cuenta.id),
      rol: cuenta.role,
      estado: cuenta.status,
      cargo: cuenta.job_title,
      empresa: cuenta.empresa,
      creada: cuenta.created_at,
      ultimaEntrada: cuenta.last_login_at,
      tieneContrasena: cuenta.tiene_contrasena,
      segmento: cuenta.segmento,
      etiquetas: cuenta.crm_tags || [],
      notaCrm: cuenta.crm_notes,
    } : null,
    cursos,
    pagos: pagos.map((p) => ({
      id: Number(p.id), courseId: Number(p.course_id), curso: p.title, estado: p.status, medio: p.source,
      monto: num(p.amount), moneda: p.currency_id, nota: p.note, creado: p.created_at, aprobado: p.approved_at,
    })),
    solicitudes: solicitudes.map((s) => ({
      id: Number(s.id), tipo: s.tipo, referencia: s.referencia, rol: s.rol, institucion: s.institucion,
      cargo: s.cargo, mensaje: s.mensaje, estado: s.estado, temperatura: s.temperatura, puntaje: s.puntaje,
      siguienteAccion: s.siguiente_accion, publico: s.publico, interes: s.interes, areas: s.areas || [],
      origen: s.origen, utmSource: s.utm_source, utmCampaign: s.utm_campaign, notaInterna: s.nota_interna,
      creada: s.created_at,
    })),
    correos: correos.map((c) => ({ plantilla: c.plantilla, clave: c.clave, enviado: c.enviado, fecha: c.created_at })),
    notas: notas.map((n) => ({ id: Number(n.id), nota: n.nota, autor: n.autor_email, fecha: n.created_at })),
    valor: {
      pagado: pagos.filter((p) => p.status === 'aprobado').reduce((s, p) => s + (Number(p.amount) || 0), 0),
      certificados: cursos.filter((c) => c.certificado.estado === 'emitido').length,
    },
  };
  persona.acciones = siguientesAcciones(persona, { now });
  return persona;
}

/**
 * Qué hacer ahora con esta persona, de lo que más dinero o más riesgo
 * tiene a lo que menos. Reglas simples y explicables (no una caja negra):
 * cada acción dice por qué aparece.
 */
export function siguientesAcciones(persona, { now = new Date() } = {}) {
  const acciones = [];
  const nombre = primerNombre(persona.nombre);
  const wa = (mensaje) => enlaceWhatsApp(persona.whatsapp, mensaje);
  const saludo = `Hola, ${nombre}. Te escribe el equipo de Edvanta.`;

  for (const s of persona.solicitudes.filter((x) => x.estado === 'nueva')) {
    acciones.push({
      clave: `solicitud-${s.id}`, prioridad: 'alta', tipo: 'responder',
      titulo: 'Responder su solicitud',
      detalle: `${s.tipo === 'propuesta' ? 'Pidió una propuesta' : s.tipo === 'contacto' ? 'Nos escribió' : 'Mostró interés'}${s.referencia ? ` en «${s.referencia}»` : ''} ${hace(s.creada, now)}${s.temperatura ? ` · ${s.temperatura}` : ''}.`,
      solicitudId: s.id,
      whatsapp: wa(`${saludo} Recibimos tu solicitud${s.referencia ? ` sobre ${s.referencia}` : ''} y queremos ayudarte. ¿Tienes unos minutos para conversar?`),
    });
  }

  for (const c of persona.cursos.filter((x) => !x.retirado)) {
    const pendiente = persona.pagos.find((p) => p.courseId === c.courseId && p.estado === 'pendiente');
    if (c.certificado.conCosto && !c.certificado.pagado && pendiente
        && now - new Date(pendiente.creado) >= UMBRALES.pagoAbandonadoHoras * HORA) {
      acciones.push({
        clave: `pago-${c.courseId}`, prioridad: 'alta', tipo: 'recuperar-pago',
        titulo: `Recuperar el pago del certificado de ${c.titulo}`,
        detalle: `Empezó a pagar ${hace(pendiente.creado, now)} y no terminó.${c.certificado.precioHoy ? ` Hoy le corresponde ${pesos(c.certificado.precioHoy)} (Colombia).` : ''}`,
        courseId: c.courseId, operacion: 'recordatorio-pago',
        whatsapp: wa(`${saludo} Vimos que empezaste el pago del certificado de ${c.titulo} y no se completó. ¿Te ayudamos a terminarlo?`),
      });
    } else if (c.certificado.conCosto && !c.certificado.pagado && c.terminado && c.certificado.estado !== 'emitido') {
      acciones.push({
        clave: `certificado-${c.courseId}`, prioridad: 'alta', tipo: 'vender-certificado',
        titulo: `Ofrecer el certificado: terminó ${c.titulo}`,
        detalle: `Terminó ${hace(c.terminado, now)} y no tiene certificado.${c.certificado.precioHoy ? ` Hoy le corresponde ${pesos(c.certificado.precioHoy)} (Colombia)${c.certificado.descuentoVence ? `, con descuento hasta el ${new Date(c.certificado.descuentoVence).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' })}` : ''}.` : ''}`,
        courseId: c.courseId, operacion: 'oferta-certificado',
        whatsapp: wa(`${saludo} ¡Felicitaciones por terminar ${c.titulo}! Tu certificado verificable está listo para emitir. ¿Te cuento cómo obtenerlo?`),
      });
    }
    if (c.certificado.pagado && c.terminado && c.certificado.estado !== 'emitido') {
      acciones.push({
        clave: `emitir-${c.courseId}`, prioridad: 'media', tipo: 'emitir',
        titulo: `Recordarle emitir su certificado de ${c.titulo}`,
        detalle: 'Pagó y terminó, pero aún no lo emite desde el aula.',
        courseId: c.courseId,
        whatsapp: wa(`${saludo} Tu certificado de ${c.titulo} ya está pagado y terminaste el curso: lo emites desde la pestaña «Tu certificado» del aula.`),
      });
    }
    if (c.estado === 'en_progreso' && c.ultimoAcceso && dias(c.ultimoAcceso, now) >= UMBRALES.inactivoDias) {
      acciones.push({
        clave: `reactivar-${c.courseId}`, prioridad: 'media', tipo: 'reactivar',
        titulo: `Reactivar: ${c.titulo}`,
        detalle: `Va en el ${c.avance} % y lleva ${dias(c.ultimoAcceso, now)} días sin entrar.`,
        courseId: c.courseId,
        whatsapp: wa(`${saludo} Vas en el ${c.avance} % de ${c.titulo}. ¿Te ayudamos a retomarlo? Todo tu avance sigue guardado.`),
      });
    }
    if (c.estado === 'no_iniciado' && dias(c.inscrito, now) >= UMBRALES.sinEmpezarDias) {
      acciones.push({
        clave: `empezar-${c.courseId}`, prioridad: 'baja', tipo: 'empezar',
        titulo: `Ayudarle a empezar ${c.titulo}`,
        detalle: `Se inscribió ${hace(c.inscrito, now)} y no ha abierto la primera clase.`,
        courseId: c.courseId,
        whatsapp: wa(`${saludo} Te inscribiste en ${c.titulo}. La primera lección toma pocos minutos, ¿te ayudamos a empezar?`),
      });
    }
  }

  if (persona.cuenta && persona.cuenta.estado === 'invited' && !persona.cuenta.ultimaEntrada
      && dias(persona.cuenta.creada, now) >= UMBRALES.invitadoSinEntrarDias) {
    acciones.push({
      clave: 'acceso', prioridad: 'media', tipo: 'acceso',
      titulo: 'Reenviar su enlace de acceso',
      detalle: `Su cuenta se creó ${hace(persona.cuenta.creada, now)} y nunca ha entrado.`,
      operacion: 'enlace-acceso',
      whatsapp: wa(`${saludo} Te enviamos a tu correo un enlace para entrar al aula. Si no lo ves, revisa la carpeta de spam.`),
    });
  }

  if (!persona.cuenta && persona.solicitudes.length) {
    acciones.push({
      clave: 'invitar', prioridad: 'media', tipo: 'invitar',
      titulo: 'Invitarle a un curso gratis',
      detalle: 'Dejó sus datos, pero aún no tiene cuenta en el aula.',
      whatsapp: wa(`${saludo} Tenemos cursos gratis para tu área, con certificado opcional. ¿Te recomiendo uno?`),
    });
  }

  const orden = { alta: 0, media: 1, baja: 2 };
  return acciones.sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);
}

/* ── Bandeja de atención ─────────────────────────────────────── */

export async function bandejaDeAtencion(db, { now = new Date(), limite = 50 } = {}) {
  const ventana = new Date(now - UMBRALES.ventanaDias * DIA);

  const solicitudesNuevas = await grupo(db,
    `FROM solicitudes s WHERE s.estado = 'nueva'`,
    `SELECT s.id, lower(s.correo) AS correo, s.nombre, s.tipo, s.referencia, s.temperatura, s.puntaje,
            s.whatsapp, s.created_at
       FROM solicitudes s WHERE s.estado = 'nueva'
      ORDER BY s.puntaje DESC, s.created_at DESC LIMIT $1`,
    [], limite,
    (r) => ({ correo: r.correo, nombre: r.nombre, detalle: `${r.tipo}${r.referencia ? ` · ${r.referencia}` : ''}`, temperatura: r.temperatura, fecha: r.created_at, whatsapp: numeroWhatsApp(r.whatsapp), solicitudId: Number(r.id) }));

  const pagosSinTerminar = await grupo(db,
    `FROM (SELECT DISTINCT p.user_id, p.course_id FROM aula_certificate_payments p
            WHERE p.status = 'pendiente' AND p.created_at >= $1 AND p.created_at <= $2
              AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments a
                               WHERE a.user_id = p.user_id AND a.course_id = p.course_id AND a.status = 'aprobado')) t`,
    `SELECT DISTINCT ON (p.user_id, p.course_id) u.email AS correo, u.first_name, u.last_name,
            c.id AS course_id, c.title, p.created_at,
            EXISTS (SELECT 1 FROM embudo_correos ec WHERE ec.correo = lower(u.email)
                     AND ec.plantilla = 'pago-pendiente'
                     AND (ec.clave = c.id::text OR ec.clave LIKE c.id::text || ':%')) AS recordado
       FROM aula_certificate_payments p
       JOIN aula_users u ON u.id = p.user_id AND u.deleted_at IS NULL
       JOIN aula_courses c ON c.id = p.course_id
      WHERE p.status = 'pendiente' AND p.created_at >= $2 AND p.created_at <= $3
        AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments a
                         WHERE a.user_id = p.user_id AND a.course_id = p.course_id AND a.status = 'aprobado')
      ORDER BY p.user_id, p.course_id, p.created_at DESC LIMIT $1`,
    [ventana, new Date(now - UMBRALES.pagoAbandonadoHoras * HORA)], limite,
    (r) => ({ correo: r.correo, nombre: nombreDe(r), detalle: r.title, courseId: Number(r.course_id), fecha: r.created_at, recordado: r.recordado }));

  const terminaronSinCertificado = await grupo(db,
    `FROM aula_enrollments e
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta' AND c.certificate_price > 0
      WHERE e.withdrawn_at IS NULL AND e.assignment_id IS NULL AND e.completed_at >= $1
        AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments p WHERE p.user_id = e.user_id AND p.course_id = c.id AND p.status = 'aprobado')
        AND NOT EXISTS (SELECT 1 FROM aula_certificates x WHERE x.enrollment_id = e.id AND x.status = 'emitido')`,
    `SELECT u.email AS correo, u.first_name, u.last_name, c.id AS course_id, c.title, e.completed_at,
            EXISTS (SELECT 1 FROM embudo_correos ec WHERE ec.correo = lower(u.email)
                     AND ec.plantilla = 'curso-completado' AND ec.clave = c.id::text) AS ofrecido
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta' AND c.certificate_price > 0
      WHERE e.withdrawn_at IS NULL AND e.assignment_id IS NULL AND e.completed_at >= $2
        AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments p WHERE p.user_id = e.user_id AND p.course_id = c.id AND p.status = 'aprobado')
        AND NOT EXISTS (SELECT 1 FROM aula_certificates x WHERE x.enrollment_id = e.id AND x.status = 'emitido')
      ORDER BY e.completed_at DESC LIMIT $1`,
    [ventana], limite,
    (r) => ({ correo: r.correo, nombre: nombreDe(r), detalle: r.title, courseId: Number(r.course_id), fecha: r.completed_at, ofrecido: r.ofrecido }));

  const inactivos = await grupo(db,
    `FROM aula_enrollments e
      WHERE e.withdrawn_at IS NULL AND e.progress_status = 'en_progreso'
        AND e.last_access_at >= $1 AND e.last_access_at <= $2`,
    `SELECT u.email AS correo, u.first_name, u.last_name, c.id AS course_id, c.title, e.progress_pct, e.last_access_at
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL
       JOIN aula_courses c ON c.id = e.course_id
      WHERE e.withdrawn_at IS NULL AND e.progress_status = 'en_progreso'
        AND e.last_access_at >= $2 AND e.last_access_at <= $3
      ORDER BY e.progress_pct DESC, e.last_access_at LIMIT $1`,
    [ventana, new Date(now - UMBRALES.inactivoDias * DIA)], limite,
    (r) => ({ correo: r.correo, nombre: nombreDe(r), detalle: `${r.title} · ${Math.round(Number(r.progress_pct))} %`, courseId: Number(r.course_id), fecha: r.last_access_at }));

  const invitadosSinEntrar = await grupo(db,
    `FROM aula_users u WHERE u.deleted_at IS NULL AND u.role = 'participant' AND u.status = 'invited'
        AND u.last_login_at IS NULL AND u.created_at >= $1 AND u.created_at <= $2`,
    `SELECT u.email AS correo, u.first_name, u.last_name, u.created_at
       FROM aula_users u WHERE u.deleted_at IS NULL AND u.role = 'participant' AND u.status = 'invited'
        AND u.last_login_at IS NULL AND u.created_at >= $2 AND u.created_at <= $3
      ORDER BY u.created_at DESC LIMIT $1`,
    [ventana, new Date(now - UMBRALES.invitadoSinEntrarDias * DIA)], limite,
    (r) => ({ correo: r.correo, nombre: nombreDe(r), detalle: 'Invitación sin abrir', fecha: r.created_at }));

  const entregas = await one(
    db,
    `SELECT count(*)::int AS n FROM aula_submissions s
       JOIN aula_enrollments e ON e.id = s.enrollment_id AND e.withdrawn_at IS NULL
      WHERE s.current_revision > 0 AND s.status IN ('enviada', 'entregada_tarde', 'en_revision')`,
  );

  return {
    generada: now.toISOString(),
    umbrales: UMBRALES,
    grupos: {
      solicitudesNuevas, pagosSinTerminar, terminaronSinCertificado, inactivos, invitadosSinEntrar,
    },
    entregasPorRevisar: entregas?.n || 0,
  };
}

/** Un grupo de la bandeja: su total y las primeras filas. */
async function grupo(db, desde, consulta, params, limite, fila) {
  const total = await one(db, `SELECT count(*)::int AS n ${desde}`, params);
  const rows = await many(db, consulta, [limite, ...params]);
  return { total: total?.n || 0, items: rows.map(fila) };
}

/* ── Ventas ──────────────────────────────────────────────────── */

const zona = (col) => `to_char(${col} AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD')`;

export async function resumenDeVentas(db, { dias: periodo = 30, now = new Date() } = {}) {
  const n = Math.min(365, Math.max(1, Math.round(Number(periodo) || 30)));
  const desde = new Date(now - n * DIA);
  const p = [desde, now];

  const totales = await one(
    db,
    `SELECT
       (SELECT count(*)::int FROM aula_users WHERE deleted_at IS NULL AND role = 'participant' AND NOT is_demo
          AND created_at >= $1 AND created_at <= $2) AS cuentas,
       (SELECT count(*)::int FROM solicitudes WHERE created_at >= $1 AND created_at <= $2) AS solicitudes,
       (SELECT count(*)::int FROM aula_enrollments WHERE assigned_at >= $1 AND assigned_at <= $2) AS inscripciones,
       (SELECT count(*)::int FROM aula_enrollments WHERE assignment_id IS NULL AND assigned_at >= $1 AND assigned_at <= $2) AS inscripciones_propias,
       (SELECT count(*)::int FROM aula_enrollments WHERE completed_at >= $1 AND completed_at <= $2) AS terminados,
       (SELECT count(*)::int FROM (SELECT DISTINCT user_id, course_id FROM aula_certificate_payments
          WHERE created_at >= $1 AND created_at <= $2) t) AS pagos_iniciados,
       (SELECT count(*)::int FROM aula_certificate_payments WHERE status = 'aprobado'
          AND approved_at >= $1 AND approved_at <= $2) AS pagos_aprobados,
       (SELECT count(*)::int FROM aula_certificates WHERE status = 'emitido'
          AND issued_at >= $1 AND issued_at <= $2) AS certificados`,
    p,
  );

  const ingresos = await many(
    db,
    `SELECT currency_id AS moneda, source AS medio, count(*)::int AS pagos, COALESCE(sum(amount), 0)::float AS total
       FROM aula_certificate_payments
      WHERE status = 'aprobado' AND approved_at >= $1 AND approved_at <= $2
      GROUP BY currency_id, source ORDER BY total DESC`,
    p,
  );

  const porCurso = await many(
    db,
    `SELECT c.id, c.title,
            (SELECT count(*)::int FROM aula_enrollments e WHERE e.course_id = c.id AND e.assigned_at >= $1 AND e.assigned_at <= $2) AS inscripciones,
            (SELECT count(*)::int FROM aula_enrollments e WHERE e.course_id = c.id AND e.completed_at >= $1 AND e.completed_at <= $2) AS terminados,
            count(p.id)::int AS pagos,
            COALESCE(sum(p.amount), 0)::float AS ingresos
       FROM aula_courses c
       LEFT JOIN aula_certificate_payments p ON p.course_id = c.id AND p.status = 'aprobado'
            AND p.approved_at >= $1 AND p.approved_at <= $2
      WHERE c.deleted_at IS NULL AND c.kind = 'edvanta'
      GROUP BY c.id, c.title
     HAVING count(p.id) > 0
         OR EXISTS (SELECT 1 FROM aula_enrollments e WHERE e.course_id = c.id AND e.assigned_at >= $1 AND e.assigned_at <= $2)
      ORDER BY ingresos DESC, inscripciones DESC
      LIMIT 15`,
    p,
  );

  // Ventas que llegaron DESPUÉS de un correo automático de ese mismo curso:
  // lo que la máquina de ventas recupera sola.
  const recuperadas = await many(
    db,
    `SELECT ec.plantilla, count(DISTINCT pa.id)::int AS pagos, COALESCE(sum(pa.amount), 0)::float AS total
       FROM aula_certificate_payments pa
       JOIN aula_users u ON u.id = pa.user_id
       JOIN embudo_correos ec ON ec.correo = lower(u.email) AND ec.enviado
            AND (ec.clave = pa.course_id::text OR ec.clave LIKE pa.course_id::text || ':%')
            AND ec.created_at < pa.approved_at
            AND ec.plantilla IN ('pago-pendiente', 'curso-completado', 'certificado-por-vencer', 'bienvenida-curso', 'reactivacion-curso')
      WHERE pa.status = 'aprobado' AND pa.approved_at >= $1 AND pa.approved_at <= $2
      GROUP BY ec.plantilla ORDER BY pagos DESC`,
    p,
  );

  const correos = await many(
    db,
    `SELECT plantilla, count(*)::int AS enviados FROM embudo_correos
      WHERE enviado AND created_at >= $1 AND created_at <= $2
      GROUP BY plantilla ORDER BY enviados DESC`,
    p,
  );

  const serieInscripciones = await many(db,
    `SELECT ${zona('assigned_at')} AS dia, count(*)::int AS n FROM aula_enrollments
      WHERE assigned_at >= $1 AND assigned_at <= $2 GROUP BY 1`, p);
  const seriePagos = await many(db,
    `SELECT ${zona('approved_at')} AS dia, count(*)::int AS n, COALESCE(sum(amount), 0)::float AS total
       FROM aula_certificate_payments WHERE status = 'aprobado' AND approved_at >= $1 AND approved_at <= $2 GROUP BY 1`, p);
  const serieCuentas = await many(db,
    `SELECT ${zona('created_at')} AS dia, count(*)::int AS n FROM aula_users
      WHERE deleted_at IS NULL AND role = 'participant' AND NOT is_demo AND created_at >= $1 AND created_at <= $2 GROUP BY 1`, p);

  const mapa = (rows) => new Map(rows.map((r) => [r.dia, r]));
  const [mi, mp, mc] = [mapa(serieInscripciones), mapa(seriePagos), mapa(serieCuentas)];
  const serie = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const dia = new Date(now - i * DIA).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    serie.push({
      dia,
      cuentas: mc.get(dia)?.n || 0,
      inscripciones: mi.get(dia)?.n || 0,
      pagos: mp.get(dia)?.n || 0,
      ingresos: mp.get(dia)?.total || 0,
    });
  }

  const t = totales;
  const tasa = (a, b) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);
  const ingresosCop = ingresos.filter((r) => r.moneda === 'COP').reduce((s, r) => s + r.total, 0);
  return {
    dias: n,
    desde: desde.toISOString(),
    hasta: now.toISOString(),
    totales: {
      cuentas: t.cuentas,
      solicitudes: t.solicitudes,
      inscripciones: t.inscripciones,
      inscripcionesPropias: t.inscripciones_propias,
      terminados: t.terminados,
      pagosIniciados: t.pagos_iniciados,
      pagosAprobados: t.pagos_aprobados,
      certificados: t.certificados,
      ingresosCop,
      ticketPromedioCop: t.pagos_aprobados > 0 ? Math.round(ingresosCop / t.pagos_aprobados) : null,
    },
    conversion: {
      inscripcionAPago: tasa(t.pagos_aprobados, t.inscripciones_propias),
      inicioDePagoAPago: tasa(t.pagos_aprobados, t.pagos_iniciados),
      terminadoAPago: tasa(t.pagos_aprobados, t.terminados),
    },
    ingresos,
    porCurso: porCurso.map((r) => ({ id: Number(r.id), titulo: r.title, inscripciones: r.inscripciones, terminados: r.terminados, pagos: r.pagos, ingresos: r.ingresos })),
    recuperadas,
    correos,
    serie,
  };
}

/* ── Notas ───────────────────────────────────────────────────── */

export async function agregarNota(db, { correo, nota, actor }) {
  return one(
    db,
    `INSERT INTO aula_assist_notas (correo, nota, autor_id, autor_email)
     VALUES (lower(btrim($1)), btrim($2), $3, $4)
     RETURNING id, nota, autor_email, created_at`,
    [correo, nota, actor?.id ?? null, actor?.email ?? null],
  );
}
