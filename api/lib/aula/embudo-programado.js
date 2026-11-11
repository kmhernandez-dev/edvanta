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

export const INICIO_DEL_EMBUDO = '2026-11-11T00:00:00Z';
const HORA = 60 * 60 * 1000;
const DIA = 24 * HORA;

const urlDelCurso = (siteUrl, f) => `${siteUrl}/aula/${f.slug || `curso/${f.course_id}`}`;
const SLUG = `(SELECT ps.slug FROM public_slugs ps WHERE ps.entity = 'aula' AND ps.entity_id = c.id AND ps.is_current LIMIT 1)`;

export async function correrEmbudoProgramado(db, mailer, { now = new Date(), siteUrl = 'https://edvanta.co', tope = 60 } = {}) {
  if (!mailer) return { bienvenidas: 0, recordatorios: 0, novedades: 0 };
  const sitio = String(siteUrl).replace(/\/+$/, '');
  const hecho = { bienvenidas: 0, recordatorios: 0, novedades: 0 };
  const yaEnviado = (plantilla) => `NOT EXISTS (SELECT 1 FROM embudo_correos ec
      WHERE ec.correo = lower(u.email) AND ec.plantilla = '${plantilla}' AND ec.clave = c.id::text)`;

  // 1 · Bienvenida al curso, al día siguiente de inscribirse.
  const { rows: nuevos } = await db.query(
    `SELECT u.email, u.first_name, c.id AS course_id, c.title, c.certificate_price, ${SLUG} AS slug
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
    const ok = await enviarCorreoEmbudo(db, mailer, {
      correo: f.email, plantilla: 'bienvenida-curso', clave: String(f.course_id),
      datos: { nombre: f.first_name, curso: f.title, cursoUrl: urlDelCurso(sitio, f), precio: Number(f.certificate_price) || 0, siteUrl: sitio },
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

  return hecho;
}
