/**
 * ============================================================
 *  embudo-programado.js — Los correos que salen con el tiempo
 *
 *  Corre cada hora desde server.js. En cada vuelta:
 *
 *   1. bienvenida-curso   a quien se inscribió por su cuenta hace 20 horas o más
 *                         en un curso del catálogo abierto. Lleva las dos
 *                         opciones: WhatsApp o estudiar con certificado.
 *   2. recordatorio-curso a quien lleva 5 días en el curso y no ha empezado.
 *   3. novedades          una vez al mes a quien aceptó recibir novedades
 *                         (y solo a esas personas).
 *   4. certificado-por-vencer  a quien estudia gratis un curso con certificado
 *                         de pago cuando faltan 48 horas o menos para que venza
 *                         SU descuento (7 días desde la inscripción).
 *
 *  Venta automática (cuenta desde INICIO_VENTA_AUTOMATICA):
 *
 *   5. pago-pendiente     a quien empezó a pagar el certificado hace 2 horas
 *                         o más (y menos de 7 días) y no tiene pago aprobado.
 *   6. curso-completado   a quien terminó un curso con certificado de pago
 *                         hace 1 hora o más y no tiene certificado ni pago.
 *   7. reactivacion-curso a quien va entre el 1 % y el 99 % y lleva de 10 a
 *                         30 días sin entrar.
 *
 *  Cuidados:
 *   · Solo cuenta lo que pasó desde INICIO_DEL_EMBUDO: las matrículas y
 *     registros anteriores no reciben una avalancha de correos.
 *   · Las matrículas de una empresa (assignment_id) no reciben correos de
 *     venta del certificado: el certificado lo cubre la institución.
 *   · Cada correo se reserva en embudo_correos antes de salir: nunca dos
 *     veces el mismo.
 *   · Un tope por vuelta evita mandar cientos de golpe.
 * ============================================================
 */
import { enviarCorreoEmbudo } from './correos-embudo.js';
import { precioDelCertificado } from '../precio-certificado.js';

export const INICIO_DEL_EMBUDO = '2026-11-11T00:00:00Z';
// Los correos de venta automática cuentan desde su lanzamiento: quien
// terminó un curso o dejó un pago antes no recibe un correo atrasado.
export const INICIO_VENTA_AUTOMATICA = '2026-11-19T00:00:00-05:00';
const HORA = 60 * 60 * 1000;
const DIA = 24 * HORA;

const urlDelCurso = (siteUrl, f) => `${siteUrl}/aula/${f.slug || `curso/${f.course_id}`}`;
// Donde se paga y se emite el certificado (pestaña «Tu certificado» del aula).
export const urlDelCertificado = (siteUrl, f) => `${urlDelCurso(siteUrl, f)}/certificado`;
const SLUG = `(SELECT ps.slug FROM public_slugs ps WHERE ps.entity = 'aula' AND ps.entity_id = c.id AND ps.is_current LIMIT 1)`;

export async function correrEmbudoProgramado(db, mailer, { now = new Date(), siteUrl = 'https://edvanta.co', tope = 60 } = {}) {
  const vacio = { bienvenidas: 0, recordatorios: 0, novedades: 0, porVencer: 0, pagosPendientes: 0, completados: 0, reactivaciones: 0 };
  if (!mailer) return vacio;
  const sitio = String(siteUrl).replace(/\/+$/, '');
  const hecho = { ...vacio };
  const yaEnviado = (plantilla) => `NOT EXISTS (SELECT 1 FROM embudo_correos ec
      WHERE ec.correo = lower(u.email) AND ec.plantilla = '${plantilla}' AND ec.clave = c.id::text)`;

  // 1 · Bienvenida al curso, al día siguiente de inscribirse.
  const { rows: nuevos } = await db.query(
    `SELECT u.email, u.first_name, c.id AS course_id, c.title, c.certificate_price, e.assigned_at, ${SLUG} AS slug
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL AND u.status = 'active'
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta'
      WHERE e.withdrawn_at IS NULL AND e.assignment_id IS NULL
        AND e.assigned_at >= $1 AND e.assigned_at <= $2
        AND ${yaEnviado('bienvenida-curso')}
      ORDER BY e.assigned_at LIMIT $3`,
    [INICIO_DEL_EMBUDO, new Date(now - 20 * HORA), tope],
  );
  for (const f of nuevos) {
    // El precio de Colombia y hasta cuándo rige para esta inscripción.
    const oferta = precioDelCertificado(f, { pais: 'CO', inscritoEl: f.assigned_at, ahora: now });
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'bienvenida-curso', clave: String(f.course_id),
      datos: { nombre: f.first_name, curso: f.title, cursoUrl: urlDelCurso(sitio, f), precio: oferta.precio, precioLista: oferta.lista, venceEl: oferta.venceEl, siteUrl: sitio },
    });
    if (ok) hecho.bienvenidas += 1;
  }

  // 2 · Recordatorio a los 5 días si no ha empezado.
  const { rows: quietos } = await db.query(
    `SELECT u.email, u.first_name, c.id AS course_id, c.title, ${SLUG} AS slug
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL AND u.status = 'active'
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta'
      WHERE e.withdrawn_at IS NULL AND e.assignment_id IS NULL
        AND e.assigned_at >= $1 AND e.assigned_at <= $2
        AND e.progress_pct = 0 AND e.completed_at IS NULL
        AND ${yaEnviado('recordatorio-curso')}
      ORDER BY e.assigned_at LIMIT $3`,
    [INICIO_DEL_EMBUDO, new Date(now - 5 * DIA), tope],
  );
  for (const f of quietos) {
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'recordatorio-curso', clave: String(f.course_id),
      datos: { nombre: f.first_name, curso: f.title, cursoUrl: urlDelCurso(sitio, f), siteUrl: sitio },
    });
    if (ok) hecho.recordatorios += 1;
  }

  // 4 · El descuento del certificado está por vencer (48 horas o menos).
  const { rows: porVencer } = await db.query(
    `SELECT u.email, u.first_name, c.id AS course_id, c.title, c.certificate_price, e.assigned_at, ${SLUG} AS slug
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL AND u.status = 'active'
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta' AND c.certificate_price > 0
      WHERE e.withdrawn_at IS NULL AND e.assignment_id IS NULL
        AND e.assigned_at >= $1 AND e.assigned_at >= $2
        AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments p
                         WHERE p.user_id = e.user_id AND p.course_id = c.id AND p.status IN ('aprobado', 'pendiente'))
        AND NOT EXISTS (SELECT 1 FROM aula_certificates x WHERE x.enrollment_id = e.id AND x.status = 'emitido')
        AND ${yaEnviado('certificado-por-vencer')}
      ORDER BY e.assigned_at LIMIT $3`,
    [INICIO_DEL_EMBUDO, new Date(now - 30 * DIA), tope],
  );
  for (const f of porVencer) {
    const oferta = precioDelCertificado(f, { pais: 'CO', inscritoEl: f.assigned_at, ahora: now });
    const quedan = oferta.venceEl ? new Date(oferta.venceEl) - now : -1;
    if (!oferta.conDescuento || quedan <= 0 || quedan > 2 * DIA) continue;
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'certificado-por-vencer', clave: String(f.course_id),
      datos: { nombre: f.first_name, curso: f.title, cursoUrl: urlDelCurso(sitio, f), precio: oferta.precio, precioLista: oferta.lista, venceEl: oferta.venceEl, siteUrl: sitio },
    });
    if (ok) hecho.porVencer += 1;
  }

  // 3 · Novedades del mes, solo con autorización, a partir de 7 días del registro.
  const mes = now.toISOString().slice(0, 7);
  const { rows: suscritos } = await db.query(
    `SELECT DISTINCT ON (lower(s.correo)) s.correo, s.nombre, s.areas
       FROM solicitudes s
      WHERE s.acepta_novedades AND s.publico = 'profesional'
        AND s.created_at >= $1 AND s.created_at <= $2
        AND NOT EXISTS (SELECT 1 FROM embudo_correos ec
                         WHERE ec.correo = lower(s.correo) AND ec.plantilla = 'novedades' AND ec.clave = $3)
      ORDER BY lower(s.correo), s.created_at DESC
      LIMIT $4`,
    [INICIO_DEL_EMBUDO, new Date(now - 7 * DIA), mes, tope],
  );
  for (const s of suscritos) {
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: s.correo, plantilla: 'novedades', clave: mes,
      datos: { nombre: s.nombre, area: (s.areas || [])[0] || null, siteUrl: sitio },
    });
    if (ok) hecho.novedades += 1;
  }

  await ventaAutomatica(db, mailer, { now, sitio, tope, hecho, yaEnviado });
  return hecho;
}

/**
 * 5 · 6 · 7: recuperar pagos, vender el certificado al terminar y
 * reactivar a quien se quedó a mitad de curso.
 */
async function ventaAutomatica(db, mailer, { now, sitio, tope, hecho, yaEnviado }) {
  // 5 · Pago del certificado empezado y no terminado. El último intento de
  // cada persona y curso; nada si ya tiene uno aprobado.
  const { rows: pendientes } = await db.query(
    `SELECT DISTINCT ON (p.user_id, p.course_id)
            u.email, u.first_name, c.id AS course_id, c.title, c.certificate_price, e.assigned_at, ${SLUG} AS slug
       FROM aula_certificate_payments p
       JOIN aula_users u ON u.id = p.user_id AND u.deleted_at IS NULL AND u.status = 'active'
       JOIN aula_courses c ON c.id = p.course_id AND c.kind = 'edvanta'
       LEFT JOIN aula_enrollments e ON e.user_id = p.user_id AND e.course_id = p.course_id
      WHERE p.status = 'pendiente'
        AND p.created_at >= GREATEST($1::timestamptz, $2::timestamptz) AND p.created_at <= $3
        AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments a
                         WHERE a.user_id = p.user_id AND a.course_id = p.course_id AND a.status = 'aprobado')
        AND ${yaEnviado('pago-pendiente')}
      ORDER BY p.user_id, p.course_id, p.created_at DESC
      LIMIT $4`,
    [INICIO_VENTA_AUTOMATICA, new Date(now - 7 * DIA), new Date(now - 2 * HORA), tope],
  );
  for (const f of pendientes) {
    const oferta = precioDelCertificado(f, { pais: 'CO', inscritoEl: f.assigned_at, ahora: now });
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'pago-pendiente', clave: String(f.course_id),
      datos: { nombre: f.first_name, curso: f.title, pagarUrl: urlDelCertificado(sitio, f), precio: oferta.precio || null, siteUrl: sitio },
    });
    if (ok) hecho.pagosPendientes += 1;
  }

  // 6 · Terminó el curso y no tiene certificado (ni pago aprobado o en curso).
  const { rows: completos } = await db.query(
    `SELECT u.email, u.first_name, c.id AS course_id, c.title, c.certificate_price, e.assigned_at, ${SLUG} AS slug
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL AND u.status = 'active'
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta' AND c.certificate_price > 0
      WHERE e.withdrawn_at IS NULL AND e.assignment_id IS NULL
        AND e.completed_at >= $1 AND e.completed_at <= $2
        AND NOT EXISTS (SELECT 1 FROM aula_certificate_payments p
                         WHERE p.user_id = e.user_id AND p.course_id = c.id AND p.status IN ('aprobado', 'pendiente'))
        AND NOT EXISTS (SELECT 1 FROM aula_certificates x WHERE x.enrollment_id = e.id AND x.status = 'emitido')
        AND ${yaEnviado('curso-completado')}
      ORDER BY e.completed_at LIMIT $3`,
    [INICIO_VENTA_AUTOMATICA, new Date(now - HORA), tope],
  );
  for (const f of completos) {
    const oferta = precioDelCertificado(f, { pais: 'CO', inscritoEl: f.assigned_at, ahora: now });
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'curso-completado', clave: String(f.course_id),
      datos: {
        nombre: f.first_name, curso: f.title, certificadoUrl: urlDelCertificado(sitio, f),
        precio: oferta.precio || null, precioLista: oferta.conDescuento ? oferta.lista : null,
        venceEl: oferta.conDescuento ? oferta.venceEl : null, siteUrl: sitio,
      },
    });
    if (ok) hecho.completados += 1;
  }

  // 7 · A mitad de curso y quieto de 10 a 30 días.
  const { rows: quietos } = await db.query(
    `SELECT u.email, u.first_name, c.id AS course_id, c.title, e.progress_pct, ${SLUG} AS slug
       FROM aula_enrollments e
       JOIN aula_users u ON u.id = e.user_id AND u.deleted_at IS NULL AND u.status = 'active'
       JOIN aula_courses c ON c.id = e.course_id AND c.kind = 'edvanta'
      WHERE e.withdrawn_at IS NULL AND e.completed_at IS NULL
        AND e.progress_pct > 0 AND e.progress_pct < 100
        AND e.assigned_at >= $1
        AND e.last_access_at >= $2 AND e.last_access_at <= $3
        AND ${yaEnviado('reactivacion-curso')}
      ORDER BY e.progress_pct DESC LIMIT $4`,
    [INICIO_VENTA_AUTOMATICA, new Date(now - 30 * DIA), new Date(now - 10 * DIA), tope],
  );
  for (const f of quietos) {
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'reactivacion-curso', clave: String(f.course_id),
      datos: { nombre: f.first_name, curso: f.title, cursoUrl: urlDelCurso(sitio, f), avance: Math.round(Number(f.progress_pct)), siteUrl: sitio },
    });
    if (ok) hecho.reactivaciones += 1;
  }
}
