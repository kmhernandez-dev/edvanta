/**
 * Pago de certificados (y de productos del catálogo) desde una cuenta
 * del aula.
 *
 * El navegador solo manda ids. El precio de un certificado sale de
 * aula_courses.certificate_price y el de un producto, del catálogo del
 * servidor. Cada certificado queda como un pago pendiente de la persona;
 * el webhook de Mercado Pago lo aprueba y la administración puede
 * aprobarlo a mano (pago por otro medio). Quien completa el curso emite
 * su certificado solo si está pagado o si el curso no tiene costo.
 */
import { randomUUID } from 'node:crypto';
import { audit } from './audit.js';
import { many, one } from './db.js';
import { AulaError, badRequest, notFound, normalizeEmail } from './http.js';
import { getServerProduct } from '../catalog.js';

export const PREFIJO_CERTIFICADO = 'certificado-';
const ID_CERTIFICADO = /^certificado-(\d{1,12})$/;

export const pesos = (n) => `$${Number(n).toLocaleString('es-CO')} COP`;

/**
 * Estado del pago del certificado de una persona en un curso.
 *  sin_costo   → el curso no cobra el certificado.
 *  institucion → la matrícula vino de una asignación institucional.
 *  pagado      → hay un pago aprobado.
 *  pendiente   → se inició un pago que Mercado Pago aún no confirma.
 *  sin_pagar   → nada de lo anterior.
 */
export async function pagoDelCertificado(db, userId, curso, matricula = null) {
  const precio = Number(curso?.certificate_price) || 0;
  if (precio <= 0) return { requerido: false, precio: 0, estado: 'sin_costo' };
  if (matricula?.assignment_id) return { requerido: false, precio, estado: 'institucion' };
  const fila = await one(
    db,
    `SELECT status FROM aula_certificate_payments
      WHERE user_id = $1 AND course_id = $2 AND status IN ('aprobado', 'pendiente')
      ORDER BY (status = 'aprobado') DESC, created_at DESC
      LIMIT 1`,
    [userId, curso.id],
  );
  if (fila?.status === 'aprobado') return { requerido: true, precio, estado: 'pagado' };
  return { requerido: true, precio, estado: fila ? 'pendiente' : 'sin_pagar' };
}

/** Convierte lo que manda el carrito en ítems con precio del servidor. */
export async function resolverCarrito(db, user, rawItems) {
  const lista = Array.isArray(rawItems) ? rawItems : [];
  if (!lista.length) throw badRequest('El carrito está vacío.', { field: 'items' });
  if (lista.length > 30) throw badRequest('El carrito admite como máximo 30 productos.', { field: 'items' });
  const items = [];
  const certificados = [];
  const productos = [];
  const vistos = new Set();
  for (const raw of lista) {
    const id = String(raw?.id ?? '').trim();
    const m = ID_CERTIFICADO.exec(id);
    if (m) {
      if (vistos.has(id)) continue;
      vistos.add(id);
      const curso = await one(
        db,
        `SELECT id, title, certificate_price FROM aula_courses
          WHERE id = $1 AND kind = 'edvanta' AND status = 'publicado' AND deleted_at IS NULL`,
        [Number(m[1])],
      );
      if (!curso || !(Number(curso.certificate_price) > 0)) {
        throw badRequest('Uno de los certificados del carrito ya no está disponible.', { field: 'items' });
      }
      const emitido = await one(
        db,
        `SELECT 1 FROM aula_certificates c JOIN aula_enrollments e ON e.id = c.enrollment_id
          WHERE e.user_id = $1 AND c.course_id = $2 AND c.status = 'emitido'`,
        [user.id, curso.id],
      );
      if (emitido) throw new AulaError(409, 'certificado_emitido', `Ya tienes el certificado de «${curso.title}». Quítalo del carrito.`);
      const pago = await pagoDelCertificado(db, user.id, curso);
      if (pago.estado === 'pagado') throw new AulaError(409, 'certificado_pagado', `Ya pagaste el certificado de «${curso.title}». Quítalo del carrito.`);
      items.push({
        id,
        title: `Certificado · ${curso.title}`.slice(0, 250),
        quantity: 1,
        unit_price: Number(curso.certificate_price),
        currency_id: 'COP',
      });
      certificados.push({ courseId: Number(curso.id), precio: Number(curso.certificate_price) });
      continue;
    }
    const producto = getServerProduct(id);
    if (!producto) throw badRequest(`Producto no disponible: ${id || '(sin id)'}`, { field: 'items' });
    const qty = Math.min(10, Math.max(1, parseInt(raw?.qty, 10) || 1));
    items.push({ id: producto.id, title: producto.name, quantity: qty, unit_price: producto.price, currency_id: producto.currency_id });
    for (let i = 0; i < qty; i += 1) productos.push(producto.id);
  }
  return { items, certificados, productos };
}

// Solo rutas internas del sitio: «/aula/x/certificado», nunca «//otro.com».
const rutaSegura = (r) => (typeof r === 'string' && /^\/(?![/\\])[\w\-/.%~]*$/.test(r) ? r : '/');

/**
 * Crea la preferencia de pago y deja los certificados como pendientes.
 * `crearPreferencia` es null cuando Mercado Pago no está configurado.
 */
export async function iniciarPago(db, user, rawItems, { crearPreferencia, siteUrl, apiUrl, volverA } = {}) {
  if (!crearPreferencia) {
    throw new AulaError(503, 'pagos_inactivos', 'El pago en línea aún no está activo. Escríbenos por WhatsApp y te ayudamos a completar la compra.');
  }
  const { items, certificados, productos } = await resolverCarrito(db, user, rawItems);
  const externalReference = randomUUID();
  const volver = rutaSegura(volverA);
  const url = (estado) => `${siteUrl}${volver}${volver.includes('?') ? '&' : '?'}pago=${estado}`;
  const preferencia = await crearPreferencia({
    items,
    back_urls: { success: url('exitoso'), failure: url('fallido'), pending: url('pendiente') },
    auto_return: 'approved',
    external_reference: externalReference,
    statement_descriptor: 'EDVANTA',
    metadata: {
      product_ids: productos,
      certificados: certificados.map((c) => c.courseId),
      aula_user_id: Number(user.id),
      external_reference: externalReference,
    },
    notification_url: `${apiUrl}/api/mp-webhook`,
  });
  const total = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  await db.tx(async (tx) => {
    for (const c of certificados) {
      await tx.query(
        `INSERT INTO aula_certificate_payments (user_id, course_id, status, source, amount, external_reference)
         VALUES ($1, $2, 'pendiente', 'mercadopago', $3, $4)`,
        [user.id, c.courseId, c.precio, externalReference],
      );
    }
  });
  // La orden es el mismo registro que usa la tienda; si falla, el pago
  // sigue siendo trazable por su referencia en aula_certificate_payments.
  try {
    await db.query(
      `INSERT INTO orders (preference_id, external_reference, status, status_detail, items,
                           transaction_amount, currency_id, email, date_created, logged_at)
       VALUES ($1, $2, 'pending_checkout', 'preference_created', $3::jsonb, $4, 'COP', $5, NOW(), NOW())
       ON CONFLICT (external_reference) DO NOTHING`,
      [preferencia?.id || null, externalReference, JSON.stringify(items), total, user.email || null],
    );
  } catch (e) {
    console.error('[aula/checkout] No se guardó la orden:', e.message);
  }
  return { initPoint: preferencia?.init_point || null, preferenceId: preferencia?.id || null, externalReference, total, items };
}

/**
 * Aprueba los certificados de un pago confirmado por Mercado Pago. Si no
 * encuentra pendientes por la referencia (por ejemplo, porque falló el
 * guardado al iniciar), usa los datos que viajaron en el pago. Un segundo
 * pago del mismo certificado queda anulado para revisar su devolución.
 */
export async function aprobarPagosDeCertificados(db, { externalReference = null, paymentId = null, metadata = null, now = new Date() } = {}) {
  return db.tx(async (tx) => {
    let filas = externalReference
      ? await many(
        tx,
        `SELECT id, user_id, course_id FROM aula_certificate_payments
          WHERE external_reference = $1 AND status = 'pendiente' FOR UPDATE`,
        [externalReference],
      )
      : [];
    if (!filas.length) {
      const userId = Number(metadata?.aula_user_id);
      const cursos = (Array.isArray(metadata?.certificados) ? metadata.certificados : []).map(Number).filter((n) => Number.isInteger(n) && n > 0);
      if (!userId || !cursos.length) return [];
      filas = cursos.map((courseId) => ({ id: null, user_id: userId, course_id: courseId }));
    }
    const aprobados = [];
    for (const f of filas) {
      const previo = await one(
        tx,
        "SELECT id FROM aula_certificate_payments WHERE user_id = $1 AND course_id = $2 AND status = 'aprobado'",
        [f.user_id, f.course_id],
      );
      if (f.id) {
        await tx.query(
          `UPDATE aula_certificate_payments
              SET status = $2, payment_id = $3, approved_at = CASE WHEN $2 = 'aprobado' THEN $4::timestamptz ELSE approved_at END,
                  note = $5, updated_at = $4
            WHERE id = $1`,
          [f.id, previo ? 'anulado' : 'aprobado', paymentId, now, previo ? 'Pago duplicado: ya había un pago aprobado. Revisar devolución.' : null],
        );
      } else if (!previo) {
        await tx.query(
          `INSERT INTO aula_certificate_payments (user_id, course_id, status, source, external_reference, payment_id, approved_at)
           VALUES ($1, $2, 'aprobado', 'mercadopago', $3, $4, $5)`,
          [f.user_id, f.course_id, externalReference, paymentId, now],
        );
      }
      if (!previo) aprobados.push({ userId: Number(f.user_id), courseId: Number(f.course_id) });
    }
    return aprobados;
  });
}

/** La administración registra un pago hecho por otro medio. */
export async function concederPagoDeCertificado(db, actor, { courseId, email, nota } = {}, { now = new Date() } = {}) {
  const correo = normalizeEmail(email);
  if (!correo) throw badRequest('Escribe el correo de la persona.', { field: 'email' });
  const texto = String(nota ?? '').trim();
  if (texto.length < 5) throw badRequest('Anota cómo se pagó (por ejemplo, «transferencia del 6 de noviembre»).', { field: 'nota' });
  return db.tx(async (tx) => {
    const curso = await one(tx, 'SELECT id, title, certificate_price FROM aula_courses WHERE id = $1 AND deleted_at IS NULL', [courseId]);
    if (!curso) throw notFound('No encontramos ese curso.');
    const persona = await one(tx, 'SELECT id, first_name, last_name FROM aula_users WHERE email = $1 AND deleted_at IS NULL', [correo]);
    if (!persona) throw notFound('No hay una cuenta del aula con ese correo.');
    const previo = await one(tx, "SELECT id FROM aula_certificate_payments WHERE user_id = $1 AND course_id = $2 AND status = 'aprobado'", [persona.id, curso.id]);
    if (previo) throw new AulaError(409, 'certificado_pagado', 'Esa persona ya tiene el certificado de este curso pagado.');
    const fila = await one(
      tx,
      `INSERT INTO aula_certificate_payments (user_id, course_id, status, source, amount, note, granted_by, approved_at)
       VALUES ($1, $2, 'aprobado', 'admin', $3, $4, $5, $6)
       RETURNING id`,
      [persona.id, curso.id, Number(curso.certificate_price) || null, texto.slice(0, 500), actor?.id || null, now],
    );
    await audit(tx, {
      actor, action: 'certificado.pago_manual', entityType: 'certificado', entityId: fila.id, courseId: curso.id,
      summary: `Pago del certificado de «${curso.title}» registrado a mano para ${correo}: ${texto.slice(0, 120)}`,
    });
    return { id: Number(fila.id), cursoId: Number(curso.id), usuarioId: Number(persona.id), estado: 'aprobado' };
  });
}

/** Pagos de certificados de un curso, para la administración. */
export async function pagosDeCertificadosDelCurso(db, courseId) {
  const filas = await many(
    db,
    `SELECT p.id, p.status, p.source, p.amount, p.payment_id, p.note, p.created_at, p.approved_at,
            u.email, u.first_name, u.last_name
       FROM aula_certificate_payments p JOIN aula_users u ON u.id = p.user_id
      WHERE p.course_id = $1
      ORDER BY p.created_at DESC
      LIMIT 500`,
    [courseId],
  );
  return filas.map((f) => ({
    id: Number(f.id), estado: f.status, origen: f.source, monto: f.amount == null ? null : Number(f.amount),
    pagoMercadoPago: f.payment_id == null ? null : Number(f.payment_id), nota: f.note,
    creadoEl: f.created_at, aprobadoEl: f.approved_at, correo: f.email,
    nombre: `${f.first_name || ''} ${f.last_name || ''}`.trim(),
  }));
}
