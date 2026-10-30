/**
 * Certificados de aprobación.
 *
 * Quien completa un curso (todas sus clases obligatorias y, cuando el
 * curso las tenga, sus evaluaciones) pide su certificado una vez. Se
 * guarda una foto de lo que dice y un código al azar, que es lo que lleva
 * el QR. Pedirlo otra vez devuelve el mismo: un curso, un certificado.
 *
 * La verificación pública prueba que el documento es auténtico sin
 * exponer a nadie: muestra el titular, el curso, las horas y la fecha, y
 * del documento de identidad solo los últimos cuatro caracteres.
 */
import { randomInt } from 'node:crypto';
import { many, one } from './db.js';
import { AulaError, badRequest, notFound } from './http.js';
import { audit } from './audit.js';

export const EMISOR = { nombre: 'Edvanta S.A.S.', nit: '902.120.527-6' };
export const CIUDAD_DE_EXPEDICION = 'Medellín';

// Cómo se dice la modalidad del curso en el certificado.
const MODALIDAD = { asincronica: 'Virtual', mixta: 'Mixta' };

// Sin 0/O ni 1/I/L: se dicta por teléfono sin confundir caracteres.
const LETRAS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** EDV-XXXX-XXXX al azar: no se puede recorrer la lista de certificados. */
export function codigoNuevo() {
  const parte = () => Array.from({ length: 4 }, () => LETRAS[randomInt(LETRAS.length)]).join('');
  return `EDV-${parte()}-${parte()}`;
}

export const formatoDeCodigo = /^EDV-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/;

/** Horas del curso: su duración declarada, redondeada a media hora. */
export function horasDe(minutos) {
  const m = Number(minutos) || 0;
  if (m <= 0) return null;
  return Math.max(0.5, Math.round((m / 60) * 2) / 2);
}

/** Documento: letras, números, puntos y guiones. Vacío es válido. */
function documentoLimpio(valor) {
  const t = String(valor ?? '').trim().replace(/\s+/g, ' ');
  if (!t) return null;
  if (!/^[A-Za-z0-9.\- ]{3,20}$/.test(t)) {
    throw badRequest('Escribe tu documento solo con números y letras (de 3 a 20 caracteres).', { field: 'documento' });
  }
  return t;
}

const nombreCompleto = (u) => `${u?.first_name || ''} ${u?.last_name || ''}`.trim().replace(/\s+/g, ' ');

/** Lo que se muestra de un certificado emitido. */
function vista(c) {
  if (!c || c.status === 'pendiente') return null;
  return {
    id: Number(c.id),
    codigo: c.code,
    estado: c.status === 'revocado' ? 'revocado' : 'vigente',
    titular: c.holder_name,
    documento: c.holder_document,
    curso: c.course_title,
    horas: c.hours == null ? null : Number(c.hours),
    modalidad: c.modality,
    ciudad: c.city,
    emitidoEl: c.issued_at,
    revocadoEl: c.revoked_at,
  };
}

async function matriculaDe(db, userId, courseId) {
  return one(
    db,
    `SELECT e.id, e.effective_status, c.title, c.duration_minutes, c.modality
       FROM aula_enrollments_v e JOIN aula_courses c ON c.id = e.course_id
      WHERE e.user_id = $1 AND e.course_id = $2 AND e.withdrawn_at IS NULL
      LIMIT 1`,
    [userId, courseId],
  );
}

/** Su certificado en un curso: si ya lo tiene, o si puede pedirlo. */
export async function certificadoDelCurso(db, user, courseId) {
  const m = await matriculaDe(db, user.id, courseId);
  if (!m) throw notFound('No encontramos este curso entre los que tienes asignados.');
  const c = await one(db, 'SELECT * FROM aula_certificates WHERE enrollment_id = $1', [m.id]);
  const persona = await one(db, 'SELECT first_name, last_name FROM aula_users WHERE id = $1', [user.id]);
  return {
    elegible: m.effective_status === 'completado',
    certificado: vista(c),
    // Lo que diría si lo pidiera ahora: para que lo revise antes.
    borrador: {
      titular: nombreCompleto(persona),
      curso: m.title,
      horas: horasDe(m.duration_minutes),
      modalidad: MODALIDAD[m.modality] || 'Virtual',
      ciudad: CIUDAD_DE_EXPEDICION,
    },
    emisor: EMISOR,
  };
}

/**
 * Emite el certificado de quien completó el curso. Si ya existe, lo
 * devuelve tal cual: el documento y el nombre no se reescriben.
 */
export async function emitirCertificado(db, user, courseId, { documento = null, now = new Date() } = {}) {
  const doc = documentoLimpio(documento);
  return db.tx(async (tx) => {
    const m = await matriculaDe(tx, user.id, courseId);
    if (!m) throw notFound('No encontramos este curso entre los que tienes asignados.');
    // Una petición a la vez por inscripción: dos clics no dan dos certificados.
    await tx.query('SELECT id FROM aula_enrollments WHERE id = $1 FOR UPDATE', [m.id]);
    const previo = await one(tx, 'SELECT * FROM aula_certificates WHERE enrollment_id = $1', [m.id]);
    if (previo?.status === 'emitido') return vista(previo);
    if (previo?.status === 'revocado') {
      throw new AulaError(409, 'certificado_revocado', 'Este certificado fue revocado. Escribe a Edvanta si crees que es un error.');
    }
    if (m.effective_status !== 'completado') {
      throw new AulaError(409, 'curso_sin_completar', 'Completa todas las clases obligatorias del curso para obtener tu certificado.');
    }
    const persona = await one(tx, 'SELECT first_name, last_name FROM aula_users WHERE id = $1', [user.id]);
    const titular = nombreCompleto(persona);
    if (!titular) {
      throw new AulaError(400, 'sin_nombre', 'Tu cuenta no tiene nombre. Escríbelo en «Mi cuenta» para que salga en el certificado.');
    }
    const datos = [m.id, now, courseId, titular, doc, m.title, horasDe(m.duration_minutes), MODALIDAD[m.modality] || 'Virtual', CIUDAD_DE_EXPEDICION];
    for (let intento = 0; intento < 5; intento += 1) {
      const codigo = codigoNuevo();
      const fila = previo
        ? await one(
          tx,
          `UPDATE aula_certificates
              SET code = $10, status = 'emitido', issued_at = $2, course_id = $3, holder_name = $4,
                  holder_document = $5, course_title = $6, hours = $7, modality = $8, city = $9
            WHERE enrollment_id = $1 AND NOT EXISTS (SELECT 1 FROM aula_certificates o WHERE o.code = $10)
            RETURNING *`,
          [...datos, codigo],
        )
        : await one(
          tx,
          `INSERT INTO aula_certificates
             (enrollment_id, issued_at, course_id, holder_name, holder_document, course_title, hours, modality, city, code, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'emitido')
           ON CONFLICT (code) DO NOTHING
           RETURNING *`,
          [...datos, codigo],
        );
      if (fila) {
        await audit(tx, {
          actor: user, action: 'certificado.emitir', entityType: 'certificado', entityId: fila.id, courseId,
          summary: `Certificado ${codigo} emitido a ${titular} por «${m.title}».`,
        });
        return vista(fila);
      }
    }
    throw new Error('No se pudo generar un código de certificado único');
  });
}

/** Verificación pública por código. Null si no existe. */
export async function verificarCertificado(db, codigo) {
  const texto = String(codigo ?? '').trim().toUpperCase();
  if (!formatoDeCodigo.test(texto)) return null;
  const c = vista(await one(db, `SELECT * FROM aula_certificates WHERE code = $1`, [texto]));
  if (!c) return null;
  // Lo justo para que un tercero coteje el documento que ya tiene: los
  // últimos cuatro caracteres, sin puntos ni guiones.
  const d = (c.documento || '').replace(/[^A-Za-z0-9]/g, '');
  return {
    codigo: c.codigo,
    estado: c.estado,
    titular: c.titular,
    documento: d ? `${'•'.repeat(Math.max(0, d.length - 4))}${d.slice(-4)}` : null,
    curso: c.curso,
    horas: c.horas,
    modalidad: c.modalidad,
    ciudad: c.ciudad,
    emitidoEl: c.emitidoEl,
    revocadoEl: c.revocadoEl,
    emisor: EMISOR,
  };
}

/** Los certificados de un curso, para la administración. */
export async function certificadosDelCurso(db, courseId) {
  const filas = await many(
    db,
    `SELECT * FROM aula_certificates WHERE course_id = $1 AND status <> 'pendiente' ORDER BY issued_at DESC`,
    [courseId],
  );
  return filas.map(vista);
}

/** Revoca un certificado vigente. No se borra: queda constancia. */
export async function revocarCertificado(db, actor, id, motivo, { now = new Date() } = {}) {
  const razon = String(motivo ?? '').trim();
  if (razon.length < 5) throw badRequest('Cuenta por qué se revoca (mínimo 5 caracteres).', { field: 'motivo' });
  const fila = await one(
    db,
    `UPDATE aula_certificates
        SET status = 'revocado', revoked_at = $2, revoked_reason = $3, revoked_by = $4
      WHERE id = $1 AND status = 'emitido'
      RETURNING *`,
    [id, now, razon, actor.id],
  );
  if (!fila) throw notFound('No hay un certificado vigente con ese identificador.');
  await audit(db, {
    actor, action: 'certificado.revocar', entityType: 'certificado', entityId: fila.id, courseId: fila.course_id,
    summary: `Certificado ${fila.code} revocado.`, reason: razon,
  });
  return vista(fila);
}
