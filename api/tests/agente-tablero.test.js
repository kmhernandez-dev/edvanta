/**
 * Tablero del Agente de Crecimiento y webhook de Hotmart.
 *
 * Lo que no puede fallar:
 *  - el tablero cuenta certificados pagados y guías vendidas por día, en
 *    hora de Colombia, sin contar un certificado como guía;
 *  - sin las tablas de órdenes o eventos (base nueva) no se cae;
 *  - el webhook de Hotmart rechaza sin hottok, guarda cada transacción
 *    una sola vez e ignora los eventos que no son venta.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDb, seedUser } from './helpers.js';
import { diasDelPeriodo, tableroDelAgente } from '../lib/agente-tablero.js';
import { crearWebhookHotmart, guiaDesdeSrc, ventaDeHotmart } from '../routes/hotmart-webhook.js';

const AHORA = new Date('2026-12-10T17:00:00Z'); // 12:00 en Bogotá

const ORDERS = `CREATE TABLE orders (
  payment_id BIGINT PRIMARY KEY, status VARCHAR(40) NOT NULL, items JSONB NOT NULL DEFAULT '[]'::jsonb,
  transaction_amount NUMERIC(12,2), date_approved TIMESTAMPTZ)`;
const LEAD_EVENTS = `CREATE TABLE lead_events (
  id BIGSERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, event_type VARCHAR(80) NOT NULL,
  resource_slug VARCHAR(120), resource_name VARCHAR(160), product_id VARCHAR(120),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;

/** Respuesta mínima de Express para probar el manejador sin servidor. */
function respuesta() {
  const r = { statusCode: 200, body: null };
  r.status = (c) => { r.statusCode = c; return r; };
  r.json = (b) => { r.body = b; return r; };
  return r;
}

const ventaHotmart = (transaccion, extra = {}) => ({
  event: 'PURCHASE_APPROVED',
  version: '2.0.0',
  creation_date: AHORA.getTime(),
  data: {
    product: { id: 4567, name: 'Claude para Control de Calidad Farmaceutica' },
    buyer: { email: 'Compradora@Correo.co' },
    purchase: { transaction: transaccion, approved_date: AHORA.getTime(), price: { value: 34900, currency_value: 'COP' }, origin: { src: 'edv-claude-control-de-calidad-farmaceutica-hero' } },
  },
  ...extra,
});

describe('tablero del agente', () => {
  let t;

  beforeAll(async () => {
    t = await createTestDb();
  });
  afterAll(async () => {
    await t?.pglite?.close();
  });

  it('sin tablas de órdenes ni eventos no se cae: guías en cero y no disponibles', async () => {
    const r = await tableroDelAgente(t.db, { dias: 7, now: AHORA });
    expect(r.serie).toHaveLength(7);
    expect(r.hoy.dia).toBe('2026-12-10');
    expect(r.hoy.guias).toBe(0);
    expect(r.guias.mercadoPago.disponible).toBe(false);
    expect(r.guias.hotmart.disponible).toBe(false);
    expect(r.meta).toEqual({ certificados: 100, guias: 100 });
  });

  it('cuenta certificados, guías de Mercado Pago y de Hotmart por día de Bogotá', async () => {
    await t.db.query(ORDERS);
    await t.db.query(LEAD_EVENTS);

    // Un certificado pagado hoy.
    const u = await seedUser(t.db, { email: 'estudiante@correo.co' });
    const { rows: [curso] } = await t.db.query(`INSERT INTO aula_courses (title, kind) VALUES ('Oratoria', 'edvanta') RETURNING id`);
    await t.db.query(
      `INSERT INTO aula_certificate_payments (user_id, course_id, status, source, amount, approved_at)
       VALUES ($1, $2, 'aprobado', 'mercadopago', 60000, $3)`,
      [u.id, curso.id, new Date('2026-12-10T15:00:00Z')],
    );

    // Mercado Pago: una orden con 2 guías hoy; una orden SOLO de certificado
    // (items vacío tras el webhook) que no debe contar como guía; una de ayer.
    await t.db.query(`INSERT INTO orders VALUES (1, 'approved', '[{"id":"g1"},{"id":"g2"}]', 60000, '2026-12-10T14:00:00Z')`);
    await t.db.query(`INSERT INTO orders VALUES (2, 'approved', '[]', 60000, '2026-12-10T16:00:00Z')`);
    await t.db.query(`INSERT INTO orders VALUES (3, 'approved', '[{"id":"g1"}]', 30000, '2026-12-09T14:00:00Z')`);
    // 03:00 UTC del 10 es el 9 en Bogotá.
    await t.db.query(`INSERT INTO orders VALUES (4, 'approved', '[{"id":"g3"}]', 30000, '2026-12-10T03:00:00Z')`);
    await t.db.query(`INSERT INTO orders VALUES (5, 'rejected', '[{"id":"g3"}]', 30000, '2026-12-10T15:00:00Z')`);

    // Hotmart: 3 clics y 1 venta hoy.
    for (let i = 0; i < 3; i += 1) {
      await t.db.query(`INSERT INTO lead_events (email, event_type, resource_slug, created_at) VALUES ('', 'hotmart_clicked', 'guia-a', $1)`, [AHORA]);
    }
    await t.db.query(`INSERT INTO lead_events (email, event_type, resource_slug, metadata, created_at) VALUES ('c@correo.co', 'hotmart_purchase', 'guia-a', '{"transaccion":"HP1"}', $1)`, [AHORA]);

    const r = await tableroDelAgente(t.db, { dias: 7, now: AHORA });
    expect(r.hoy).toMatchObject({ certificados: 1, guiasMercadoPago: 2, guiasHotmart: 1, clicsHotmart: 3, guias: 3 });
    const ayer = r.serie.find((d) => d.dia === '2026-12-09');
    expect(ayer.guiasMercadoPago).toBe(2);
    expect(r.guias.hotmartConVentas).toBe(true);
    expect(r.guias.hotmart.porGuia[0]).toMatchObject({ guia: 'guia-a', clics: 3, ventas: 1 });
    expect(r.certificados.totales.pagosAprobados).toBe(1);
  });

  it('los días del periodo terminan hoy en Bogotá', () => {
    expect(diasDelPeriodo(3, new Date('2026-12-10T03:00:00Z'))).toEqual(['2026-12-07', '2026-12-08', '2026-12-09']);
  });
});

describe('webhook de Hotmart', () => {
  let t;
  let webhook;

  beforeAll(async () => {
    t = await createTestDb();
    await t.db.query(LEAD_EVENTS);
    webhook = crearWebhookHotmart({ db: t.db, hottok: () => 'secreto-de-prueba' });
  });
  afterAll(async () => {
    await t?.pglite?.close();
  });

  const llamar = async (body, headers = { 'x-hotmart-hottok': 'secreto-de-prueba' }) => {
    const res = respuesta();
    await webhook({ headers, body }, res);
    return res;
  };

  it('sin HOTMART_HOTTOK configurado responde 503 y no guarda', async () => {
    const sinClave = crearWebhookHotmart({ db: t.db, hottok: () => undefined });
    const res = respuesta();
    await sinClave({ headers: {}, body: ventaHotmart('HP0') }, res);
    expect(res.statusCode).toBe(503);
  });

  it('hottok equivocado o ausente: 401', async () => {
    expect((await llamar(ventaHotmart('HP1'), { 'x-hotmart-hottok': 'otro' })).statusCode).toBe(401);
    expect((await llamar(ventaHotmart('HP1'), {})).statusCode).toBe(401);
  });

  it('guarda la venta una sola vez por transacción, con la guía de origen', async () => {
    const r1 = await llamar(ventaHotmart('HP100'));
    expect(r1.body).toEqual({ ok: true, registrada: true });
    // Hotmart reintenta y luego manda «compra completa» de la misma transacción.
    expect((await llamar(ventaHotmart('HP100'))).body.registrada).toBe(false);
    expect((await llamar({ ...ventaHotmart('HP100'), event: 'PURCHASE_COMPLETE' })).body.registrada).toBe(false);

    const { rows } = await t.db.query(`SELECT * FROM lead_events WHERE event_type = 'hotmart_purchase'`);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ email: 'compradora@correo.co', resource_slug: 'claude-control-de-calidad-farmaceutica', product_id: '4567' });
    expect(rows[0].metadata).toMatchObject({ transaccion: 'HP100', precio: 34900, moneda: 'COP' });
  });

  it('el hottok también vale en el cuerpo (versión vieja)', async () => {
    const res = await llamar({ ...ventaHotmart('HP200'), hottok: 'secreto-de-prueba' }, {});
    expect(res.body.registrada).toBe(true);
  });

  it('reembolsos y otros eventos se aceptan y no cuentan como venta', async () => {
    const res = await llamar({ ...ventaHotmart('HP300'), event: 'PURCHASE_REFUNDED' });
    expect(res.statusCode).toBe(200);
    expect(res.body.ignorado).toBe('PURCHASE_REFUNDED');
  });

  it('venta sin transacción: 400', async () => {
    expect((await llamar(ventaHotmart(''))).statusCode).toBe(400);
  });

  it('normaliza la venta y saca la guía del src de /guia/…', () => {
    const v = ventaDeHotmart(ventaHotmart('HP9'));
    expect(v).toMatchObject({ evento: 'PURCHASE_APPROVED', correo: 'compradora@correo.co', precio: 34900, moneda: 'COP', guia: 'claude-control-de-calidad-farmaceutica' });
    expect(guiaDesdeSrc('edv-mi-guia-barra-movil')).toBe('mi-guia');
    expect(guiaDesdeSrc('edv-mi-guia-oferta')).toBe('mi-guia');
    expect(guiaDesdeSrc('HOTMART_SITE')).toBeNull();
    expect(guiaDesdeSrc(`edv-${'x'.repeat(60)}`)).toBeNull();
  });
});
